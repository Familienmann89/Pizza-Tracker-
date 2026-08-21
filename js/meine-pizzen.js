function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
}

function formatDate(value) {
    return new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value.replace(' ', 'T')));
}

function renderCard(config) {
    const toppings = config.belaege.length ? config.belaege.join(', ') : 'Keine';
    const extras = config.extras.length ? config.extras.join(', ') : 'Keine';
    return `
        <div class="col-12 col-md-6 col-xl-4" data-card-id="${config.id}">
            <article class="card h-100 shadow-sm border-0">
                <div class="card-body">
                    <div class="d-flex justify-content-between gap-2 align-items-start">
                        <h2 class="h5 mb-1">${escapeHtml(config.name)}</h2>
                        ${config.gutschein_code ? `<span class="badge text-bg-success">${escapeHtml(config.gutschein_code)}</span>` : ''}
                    </div>
                    <p class="text-secondary small mb-3">${formatDate(config.erstellt_am)}</p>
                    <dl class="row small mb-3">
                        <dt class="col-4">Größe</dt><dd class="col-8">${escapeHtml(config.groesse)}</dd>
                        <dt class="col-4">Teig</dt><dd class="col-8">${escapeHtml(config.teig)}</dd>
                        <dt class="col-4">Sauce</dt><dd class="col-8">${escapeHtml(config.sauce)}</dd>
                        <dt class="col-4">Käse</dt><dd class="col-8">${escapeHtml(config.kaese)}</dd>
                        <dt class="col-4">Beläge</dt><dd class="col-8">${escapeHtml(toppings)}</dd>
                        <dt class="col-4">Extras</dt><dd class="col-8">${escapeHtml(extras)}</dd>
                    </dl>
                    <div class="fs-4 fw-bold text-danger mb-3">${Number(config.preis).toFixed(2).replace('.', ',')} €</div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-danger flex-fill" data-edit='${escapeHtml(JSON.stringify(config))}'>Erneut bearbeiten</button>
                        <button class="btn btn-outline-secondary" data-delete="${config.id}" data-name="${escapeHtml(config.name)}">Löschen</button>
                    </div>
                </div>
            </article>
        </div>`;
}

async function loadConfigs() {
    const loading = document.getElementById('loading');
    const grid = document.getElementById('pizzaGrid');
    const empty = document.getElementById('emptyState');
    const unauthorized = document.getElementById('unauthorizedState');

    const response = await fetch('api/load_configs.php', { credentials: 'same-origin' });
    const data = await response.json();
    loading.classList.add('d-none');

    if (response.status === 401) {
        unauthorized.classList.remove('d-none');
        return;
    }
    if (!response.ok) {
        unauthorized.textContent = data.error || 'Pizzen konnten nicht geladen werden.';
        unauthorized.classList.remove('d-none');
        return;
    }
    if (!data.configs.length) {
        empty.classList.remove('d-none');
        return;
    }

    grid.innerHTML = data.configs.map(renderCard).join('');
    grid.querySelectorAll('[data-edit]').forEach(button => button.addEventListener('click', () => {
        sessionStorage.setItem('pizza-edit-config', button.dataset.edit);
        window.location.href = 'konfigurator.html';
    }));
    grid.querySelectorAll('[data-delete]').forEach(button => button.addEventListener('click', async () => {
        if (!confirm(`„${button.dataset.name}“ wirklich löschen?`)) return;
        const response = await fetch('api/delete_config.php', {
            method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: Number(button.dataset.delete) })
        });
        if (response.ok) {
            document.querySelector(`[data-card-id="${button.dataset.delete}"]`)?.remove();
            if (!grid.children.length) empty.classList.remove('d-none');
        }
    }));
}

document.addEventListener('DOMContentLoaded', loadConfigs);
