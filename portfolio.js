document.addEventListener('DOMContentLoaded', () => {
    // Carrossel de Depoimentos
    const carousel = document.querySelector('.testimonials-wrapper');
    const prevButton = document.querySelector('.carousel-nav.prev');
    const nextButton = document.querySelector('.carousel-nav.next');
    const items = document.querySelectorAll('.testimonial-item');
    
    if (!carousel || !prevButton || !nextButton || !items.length) return;

    const scrollToItem = (direction) => {
        const itemWidth = items[0].offsetWidth + parseInt(getComputedStyle(items[0]).marginRight);
        const currentScroll = carousel.scrollLeft;
        const targetScroll = direction === 'next' 
            ? currentScroll + itemWidth 
            : currentScroll - itemWidth;

        carousel.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
        });
    };

    prevButton.addEventListener('click', () => scrollToItem('prev'));
    nextButton.addEventListener('click', () => scrollToItem('next'));
}); 