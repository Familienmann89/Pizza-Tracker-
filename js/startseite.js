document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-template]').forEach(button => {
        button.addEventListener('click', () => {
            const template = button.dataset.template;
            window.location.href = `konfigurator.html?template=${encodeURIComponent(template)}`;
        });
    });
});
