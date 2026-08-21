document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const alertBox = document.getElementById('registerAlert');

    form.addEventListener('submit', async event => {
        event.preventDefault();
        alertBox.classList.add('d-none');

        if (form.passwort.value !== form.passwort_bestaetigung.value) {
            alertBox.textContent = 'Die Passwörter stimmen nicht überein.';
            alertBox.className = 'alert alert-danger';
            return;
        }

        const payload = Object.fromEntries(new FormData(form).entries());
        const response = await fetch('api/register.php', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();

        if (!response.ok) {
            alertBox.textContent = data.error || 'Registrierung fehlgeschlagen.';
            alertBox.className = 'alert alert-danger';
            return;
        }

        window.location.href = 'konfigurator.html';
    });
});
