const header = document.querySelector('header')

window.addEventListener('scroll', function() {
    const scrolled = window.scrollY;

    if ( scrolled > 20 ) {
        header.classList.add('out');
    } else {
        header.classList.remove('out');
    }
});

