document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const alertBox = document.getElementById('loginAlert');
    const toggle = document.getElementById('togglePassword');
    const password = document.getElementById('passwort');

    toggle?.addEventListener('click', () => {
        password.type = password.type === 'password' ? 'text' : 'password';
        toggle.textContent = password.type === 'password' ? 'Anzeigen' : 'Verbergen';
    });

    form.addEventListener('submit', async event => {
        event.preventDefault();
        alertBox.classList.add('d-none');

        const response = await fetch('api/login.php', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: form.email.value.trim(),
                passwort: form.passwort.value
            })
        });
        const data = await response.json();

        if (!response.ok) {
            alertBox.textContent = data.error || 'Anmeldung fehlgeschlagen.';
            alertBox.className = 'alert alert-danger';
            return;
        }

        window.location.href = 'konfigurator.html';
    });
});
