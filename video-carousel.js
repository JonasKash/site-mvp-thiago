document.addEventListener('DOMContentLoaded', function() {
    const wrapper = document.querySelector('.stories-wrapper');
    const items = document.querySelectorAll('.story-item:not(.story-placeholder)');
    const prevBtn = document.querySelector('.carousel-nav.prev');
    const nextBtn = document.querySelector('.carousel-nav.next');
    let currentIndex = 0;
    let isPlaying = false;

    function updateCarousel() {
        items.forEach((item, index) => {
            item.classList.remove('active', 'prev', 'next');
            
            if (Math.abs(index - currentIndex) > 1) {
                item.style.opacity = '0';
                item.style.visibility = 'hidden';
            } else {
                item.style.opacity = '';
                item.style.visibility = '';
                
                if (index === currentIndex) {
                    item.classList.add('active');
                } else if (index === currentIndex - 1 || (currentIndex === 0 && index === items.length - 1)) {
                    item.classList.add('prev');
                } else if (index === currentIndex + 1 || (currentIndex === items.length - 1 && index === 0)) {
                    item.classList.add('next');
                }
            }
        });

        // Centralizar o item ativo
        const activeItem = items[currentIndex];
        if (activeItem) {
            const wrapperRect = wrapper.getBoundingClientRect();
            const activeRect = activeItem.getBoundingClientRect();
            const offset = activeRect.left - wrapperRect.left - (wrapperRect.width - activeRect.width) / 2;
            wrapper.style.transform = `translateX(${-offset}px)`;
        }
    }

    function playVideo(item) {
        const video = item.querySelector('video');
        const progressBar = item.querySelector('.progress-bar');
        
        if (video) {
            video.currentTime = 0;
            const playPromise = video.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    isPlaying = true;
                    item.classList.add('playing');

                    // Atualizar a barra de progresso
                    const updateProgress = () => {
                        const progress = (video.currentTime / video.duration) * 100;
                        progressBar.style.width = `${progress}%`;
                    };

                    video.addEventListener('timeupdate', updateProgress);
                    video.addEventListener('ended', () => {
                        item.classList.remove('playing');
                        progressBar.style.width = '0%';
                        video.removeEventListener('timeupdate', updateProgress);
                        isPlaying = false;
                        // Avançar para o próximo vídeo automaticamente
                        goToNext();
                    });
                }).catch(error => {
                    console.error('Erro ao reproduzir o vídeo:', error);
                });
            }
        }
    }

    function stopAllVideos() {
        items.forEach(item => {
            const video = item.querySelector('video');
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
            item.classList.remove('playing');
            const progressBar = item.querySelector('.progress-bar');
            if (progressBar) {
                progressBar.style.width = '0%';
            }
        });
        isPlaying = false;
    }

    function goToNext() {
        stopAllVideos();
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
    }

    function goToPrev() {
        stopAllVideos();
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateCarousel();
    }

    // Navegação
    if (prevBtn) prevBtn.addEventListener('click', goToPrev);
    if (nextBtn) nextBtn.addEventListener('click', goToNext);

    // Controle de play/pause ao clicar no vídeo
    items.forEach((item, index) => {
        const overlay = item.querySelector('.story-overlay');
        const video = item.querySelector('video');
        
        if (overlay && video) {
            overlay.addEventListener('click', () => {
                if (index === currentIndex) {
                    if (video.paused) {
                        stopAllVideos();
                        playVideo(item);
                    } else {
                        video.pause();
                        item.classList.remove('playing');
                        isPlaying = false;
                    }
                } else {
                    stopAllVideos();
                    currentIndex = index;
                    updateCarousel();
                }
            });
        }
    });

    // Navegação por toque
    let touchStartX = 0;
    let touchEndX = 0;

    wrapper.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    wrapper.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                goToNext();
            } else {
                goToPrev();
            }
        }
    }

    // Inicializar o carrossel
    updateCarousel();
}); 