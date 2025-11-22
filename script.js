const navLinkEls = document.querySelectorAll('.navbar-item');
const windowPathname = window.location.pathname;

navLinkEls.forEach(navLinkEl => {
    if (navLinkEl.href.includes(windowPathname))  {
        navLinkEl.classList.add('active');
    }
});
