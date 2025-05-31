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
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            const headerOffset = 80; // Ajuste conforme a altura do seu header
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
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

// Carrossel de vídeos
const videoStories = document.querySelectorAll('.video-story');
let currentIndex = 0;
let isPlaying = false;
let isAnimating = false;

// Pré-carregar os vídeos
videoStories.forEach(story => {
    const video = story.querySelector('video');
    video.load(); // Força o carregamento do vídeo
    video.preload = "auto"; // Define o preload como automático
});

function updateCarousel(newIndex, direction = 'next') {
    if (isAnimating) return;
    isAnimating = true;
    
    const totalVideos = videoStories.length;
    currentIndex = (newIndex + totalVideos) % totalVideos;
    
    // Pausar todos os vídeos e resetar
    videoStories.forEach(story => {
        const video = story.querySelector('video');
        video.pause();
        video.currentTime = 0;
    });
    
    videoStories.forEach((story, index) => {
        const video = story.querySelector('video');
        story.classList.remove('active', 'prev', 'next');
        
        // Calcular posição relativa ao vídeo ativo
        const position = (index - currentIndex + totalVideos) % totalVideos;
        
        if (position === 0) {
            story.classList.add('active');
            // Não inicia o vídeo automaticamente
            story.style.transform = 'scale(1.05) translateX(0)';
            story.style.opacity = '1';
            story.style.zIndex = '2';
        } else if (position === totalVideos - 1 || position === -1) {
            story.classList.add('prev');
            story.style.transform = 'scale(0.85) translateX(-100%) rotateY(10deg)';
            story.style.opacity = '0.6';
            story.style.zIndex = '1';
        } else if (position === 1) {
            story.classList.add('next');
            story.style.transform = 'scale(0.85) translateX(100%) rotateY(-10deg)';
            story.style.opacity = '0.6';
            story.style.zIndex = '1';
        } else {
            story.style.transform = position < 0 
                ? 'scale(0.7) translateX(-200%) rotateY(20deg)'
                : 'scale(0.7) translateX(200%) rotateY(-20deg)';
            story.style.opacity = '0';
            story.style.zIndex = '0';
        }
    });
    
    // Atualizar barra de progresso
    updateProgressBar(videoStories[currentIndex].querySelector('video'));
    
    setTimeout(() => {
        isAnimating = false;
    }, 600);
}

function updateProgressBar(video) {
    const progressBar = document.querySelector('.progress-bar');
    if (!progressBar) return;
    
    if (video.paused || video.ended) {
        progressBar.style.width = '0%';
    } else {
        const progress = (video.currentTime / video.duration) * 100;
        progressBar.style.width = `${progress}%`;
    }
}

// Configurar eventos para cada vídeo
videoStories.forEach((story, index) => {
    const video = story.querySelector('video');
    
    // Atualizar barra de progresso durante a reprodução
    video.addEventListener('timeupdate', () => {
        if (story.classList.contains('active')) {
            updateProgressBar(video);
        }
    });
    
    // Ao terminar o vídeo, resetar
    video.addEventListener('ended', () => {
        if (story.classList.contains('active')) {
            video.currentTime = 0;
            isPlaying = false;
            updateProgressBar(video);
        }
    });
    
    // Clique no vídeo para play/pause
    story.addEventListener('click', () => {
        if (!story.classList.contains('active')) {
            const direction = index > currentIndex ? 'next' : 'prev';
            updateCarousel(index, direction);
        } else {
            if (video.paused) {
                video.play();
                isPlaying = true;
            } else {
                video.pause();
                isPlaying = false;
            }
        }
    });
    
    // Efeitos de hover
    story.addEventListener('mouseenter', () => {
        if (!story.classList.contains('active')) {
            story.style.transform = story.classList.contains('prev') 
                ? 'scale(0.9) translateX(-100%) rotateY(5deg)'
                : 'scale(0.9) translateX(100%) rotateY(-5deg)';
            story.style.opacity = '0.8';
        }
    });
    
    story.addEventListener('mouseleave', () => {
        if (!story.classList.contains('active')) {
            story.style.transform = story.classList.contains('prev')
                ? 'scale(0.85) translateX(-100%) rotateY(10deg)'
                : 'scale(0.85) translateX(100%) rotateY(-10deg)';
            story.style.opacity = '0.6';
        }
    });
});

// Controles de navegação
document.querySelector('.carousel-arrow.prev')?.addEventListener('click', () => {
    updateCarousel(currentIndex - 1, 'prev');
});

document.querySelector('.carousel-arrow.next')?.addEventListener('click', () => {
    updateCarousel(currentIndex + 1, 'next');
});

// Pausar quando a aba estiver em segundo plano
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        const activeVideo = videoStories[currentIndex].querySelector('video');
        activeVideo.pause();
        isPlaying = false;
    }
});

// Iniciar carrossel
document.addEventListener('DOMContentLoaded', () => {
    updateCarousel(0);
}); 