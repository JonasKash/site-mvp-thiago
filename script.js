// Adiciona classe ao navbar quando rolar a página
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
    } else {
        navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    }
});

// Animação suave ao clicar nos links do menu
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Função para converter string numérica em número
function parseMetricNumber(text) {
    const numStr = text.replace(/[^0-9M]/g, '');
    if (numStr.includes('M')) {
        return parseFloat(numStr.replace('M', '')) * 1000000;
    }
    return parseInt(numStr);
}

// Função para formatar número grande
function formatMetricNumber(number, originalFormat) {
    if (originalFormat.includes('M')) {
        return (number / 1000000).toFixed(0) + 'M+';
    }
    return number.toLocaleString() + '+';
}

// Animação dos números nas métricas
function animateNumbers() {
    const metricItems = document.querySelectorAll('.metrica-item h3');
    
    metricItems.forEach(item => {
        const originalText = item.textContent;
        const finalNumber = parseMetricNumber(originalText);
        let currentNumber = 0;
        const increment = finalNumber / 50;
        const duration = 2000;
        const interval = duration / 50;
        
        const counter = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= finalNumber) {
                item.textContent = originalText;
                clearInterval(counter);
            } else {
                item.textContent = formatMetricNumber(Math.floor(currentNumber), originalText);
            }
        }, interval);
    });
}

// Observa quando as métricas entram na viewport
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateNumbers();
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.5
});

const metricas = document.querySelector('.metricas');
if (metricas) {
    observer.observe(metricas);
}

document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.carousel-container');
    const stories = Array.from(document.querySelectorAll('.video-story'));
    const dots = Array.from(document.querySelectorAll('.carousel-dot'));
    const prevBtn = document.querySelector('.carousel-nav.prev');
    const nextBtn = document.querySelector('.carousel-nav.next');
    let currentIndex = 2; // Começa no item do meio (active)
    
    // Inicializa os vídeos
    stories.forEach(story => {
        const video = story.querySelector('video');
        const progress = story.querySelector('.progress-bar');
        
        // Reset do progresso quando o vídeo termina
        video.addEventListener('ended', () => {
            progress.style.width = '0%';
            nextSlide();
        });
        
        // Atualiza a barra de progresso
        video.addEventListener('timeupdate', () => {
            const percent = (video.currentTime / video.duration) * 100;
            progress.style.width = `${percent}%`;
        });
    });
    
    function updateCarousel() {
        stories.forEach((story, index) => {
            story.className = 'video-story';
            const video = story.querySelector('video');
            
            if (index === currentIndex) {
                story.classList.add('active');
                video.play();
            } else {
                video.pause();
                video.currentTime = 0;
                story.querySelector('.progress-bar').style.width = '0%';
                
                if (index === currentIndex - 2) story.classList.add('far-prev');
                if (index === currentIndex - 1) story.classList.add('prev');
                if (index === currentIndex + 1) story.classList.add('next');
                if (index === currentIndex + 2) story.classList.add('far-next');
            }
        });
        
        // Atualiza os dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % stories.length;
        updateCarousel();
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + stories.length) % stories.length;
        updateCarousel();
    }
    
    // Event Listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });
    
    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    carousel.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
    
    // Inicia o carrossel
    updateCarousel();
}); 