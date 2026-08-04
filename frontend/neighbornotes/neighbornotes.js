document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const modalEl = document.getElementById('loginModal');
            const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
            modal.hide();
            loginForm.reset();
        });
    }
});
