// Melhorias de performance para mobile
document.addEventListener('DOMContentLoaded', function() {
    // Lazy loading para imagens
    const images = document.querySelectorAll('img[data-src]');
    const imageOptions = {
        threshold: 0,
        rootMargin: '50px'
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, imageOptions);

    images.forEach(img => imageObserver.observe(img));

    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Detecção de gestos touch para o carrossel
    const carousel = document.querySelector('.stories-wrapper');
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    carousel.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe para esquerda
                document.querySelector('.carousel-nav.next')?.click();
            } else {
                // Swipe para direita
                document.querySelector('.carousel-nav.prev')?.click();
            }
        }
    }

    // Otimização de scroll
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    function handleScroll() {
        // Adiciona classe para navbar quando rolar
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Animação de elementos quando entram na viewport
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const isVisible = (rect.top <= window.innerHeight * 0.8);
            
            if (isVisible) {
                el.classList.add('visible');
            }
        });
    }

    // Otimização de formulário para mobile
    const form = document.querySelector('.contact-form');
    if (form) {
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Previne zoom em iOS ao focar inputs
            input.addEventListener('focus', () => {
                document.documentElement.style.fontSize = '16px';
            });

            // Restaura tamanho da fonte ao desfocar
            input.addEventListener('blur', () => {
                document.documentElement.style.fontSize = '';
            });
        });

        // Validação de formulário
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('#email');
            
            if (email && !isValidEmail(email.value)) {
                showError(email, 'Por favor, insira um email válido');
                return;
            }

            // Aqui você pode adicionar a lógica de envio do formulário
            console.log('Formulário enviado com sucesso!');
        });
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showError(input, message) {
        const errorDiv = input.parentElement.querySelector('.error-message') || 
                        document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        if (!input.parentElement.querySelector('.error-message')) {
            input.parentElement.appendChild(errorDiv);
        }

        input.classList.add('error');
        
        setTimeout(() => {
            errorDiv.remove();
            input.classList.remove('error');
        }, 3000);
    }
}); 