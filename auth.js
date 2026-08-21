window.PizzaAuth = (() => {
    let state = { loggedIn: false, user: null };

    function applyState() {
        document.querySelectorAll('[data-auth-guest]').forEach(el => el.classList.toggle('d-none', state.loggedIn));
        document.querySelectorAll('[data-auth-user]').forEach(el => el.classList.toggle('d-none', !state.loggedIn));
        document.querySelectorAll('[data-user-name]').forEach(el => {
            el.textContent = state.user?.vorname ? `Abmelden (${state.user.vorname})` : 'Abmelden';
        });
        document.dispatchEvent(new CustomEvent('pizza-auth-changed', { detail: state }));
    }

    async function checkSession() {
        try {
            const response = await fetch('api/session.php', { credentials: 'same-origin' });
            const data = await response.json();
            state = { loggedIn: Boolean(data.loggedIn), user: data.user || null };
        } catch (_) {
            state = { loggedIn: false, user: null };
        }
        applyState();
        return state;
    }

    async function logoutUser() {
        await fetch('api/logout.php', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: '{}'
        });
        window.location.href = 'startseite.html';
    }

    function getState() {
        return state;
    }

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('[data-action="logout"]').forEach(el => el.addEventListener('click', event => {
            event.preventDefault();
            logoutUser();
        }));
        checkSession();
    });

    return { checkSession, logoutUser, getState };
})();
