let pizzaData = null;
let activeCoupon = null;

const state = {
    name: 'Meine Pizza',
    groesse: '', teig: '', sauce: '', kaese: '', belaege: [], extras: []
};

function euro(value) {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
}

function optionCard(section, value, meta, multiple = false) {
    const id = `${section}-${value}`.replace(/[^a-zA-Z0-9_-]/g, '-');
    const type = multiple ? 'checkbox' : 'radio';
    const name = multiple ? section : section;
    return `
        <label class="option-card" for="${id}">
            <input class="form-check-input" type="${type}" name="${name}" id="${id}" value="${value}">
            <span class="option-title">${value}</span>
            <span class="option-meta">${meta.preis ? `+ ${euro(meta.preis)}` : 'inkl.'} · ${meta.kcal >= 0 ? '+' : ''}${meta.kcal} kcal</span>
        </label>`;
}

function renderOptions() {
    const sections = [
        ['groessen', 'groesse', false],
        ['teige', 'teig', false],
        ['saucen', 'sauce', false],
        ['kaese', 'kaese', false],
        ['belaege', 'belaege', true],
        ['extras', 'extras', true]
    ];

    for (const [dataKey, stateKey, multiple] of sections) {
        const container = document.getElementById(`${stateKey}Options`);
        container.innerHTML = Object.entries(pizzaData[dataKey])
            .map(([value, meta]) => optionCard(stateKey, value, meta, multiple))
            .join('');

        container.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', () => {
                if (multiple) {
                    state[stateKey] = [...container.querySelectorAll('input:checked')].map(i => i.value);
                } else {
                    state[stateKey] = input.value;
                }
                activeCoupon = null;
                document.getElementById('couponCode').value = '';
                showCouponMessage('', '');
                updateTotals();
            });
        });
    }
}

function calculateLocalTotals() {
    if (!pizzaData) return { price: 0, kcal: 0 };
    let price = 0;
    let kcal = 0;
    const singles = [
        ['groessen', state.groesse], ['teige', state.teig], ['saucen', state.sauce], ['kaese', state.kaese]
    ];
    for (const [section, value] of singles) {
        if (value && pizzaData[section][value]) {
            price += Number(pizzaData[section][value].preis);
            kcal += Number(pizzaData[section][value].kcal);
        }
    }
    for (const section of ['belaege', 'extras']) {
        for (const value of state[section]) {
            price += Number(pizzaData[section][value].preis);
            kcal += Number(pizzaData[section][value].kcal);
        }
    }
    if (activeCoupon) price -= price * activeCoupon.rabatt_prozent / 100;
    return { price: Math.max(0, price), kcal: Math.max(0, kcal) };
}

function updateTotals() {
    const totals = calculateLocalTotals();
    document.getElementById('priceValue').textContent = euro(totals.price);
    document.getElementById('kcalValue').textContent = `${Math.round(totals.kcal)} kcal`;
    document.getElementById('pizzaPreviewText').textContent = state.groesse
        ? `${state.groesse} · ${state.teig || 'Teig wählen'} · ${state.belaege.length} Beläge`
        : 'Wähle zuerst eine Größe';
}

function setChecked(section, values) {
    const list = Array.isArray(values) ? values : [values];
    document.querySelectorAll(`#${section}Options input`).forEach(input => {
        input.checked = list.includes(input.value);
    });
}

function applyConfig(config) {
    if (!config) return;
    for (const key of ['name', 'groesse', 'teig', 'sauce', 'kaese']) {
        if (config[key] !== undefined) state[key] = config[key];
    }
    state.belaege = Array.isArray(config.belaege) ? config.belaege : [];
    state.extras = Array.isArray(config.extras) ? config.extras : [];
    document.getElementById('pizzaName').value = state.name || 'Meine Pizza';
    setChecked('groesse', state.groesse);
    setChecked('teig', state.teig);
    setChecked('sauce', state.sauce);
    setChecked('kaese', state.kaese);
    setChecked('belaege', state.belaege);
    setChecked('extras', state.extras);
    updateTotals();
}

function showCouponMessage(text, type) {
    const box = document.getElementById('couponAlert');
    if (!text) {
        box.className = 'd-none';
        box.textContent = '';
        return;
    }
    box.className = `alert alert-${type} mt-2 py-2`;
    box.textContent = text;
}

async function validateCoupon() {
    const code = document.getElementById('couponCode').value.trim();
    if (!code) {
        showCouponMessage('Bitte einen Gutscheincode eingeben.', 'warning');
        return;
    }
    const response = await fetch('api/coupon.php', {
        method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
    });
    const data = await response.json();
    if (!response.ok) {
        activeCoupon = null;
        showCouponMessage(data.error || 'Gutschein konnte nicht geprüft werden.', 'danger');
        updateTotals();
        return;
    }
    activeCoupon = data.coupon;
    showCouponMessage(`${activeCoupon.code}: ${activeCoupon.rabatt_prozent}% Rabatt angewendet.`, 'success');
    updateTotals();
}

function getPayload() {
    return {
        name: document.getElementById('pizzaName').value.trim() || 'Meine Pizza',
        groesse: state.groesse,
        teig: state.teig,
        sauce: state.sauce,
        kaese: state.kaese,
        belaege: state.belaege,
        extras: state.extras,
        gutschein_code: activeCoupon?.code || ''
    };
}

async function saveConfig() {
    const status = document.getElementById('saveAlert');
    if (![state.groesse, state.teig, state.sauce, state.kaese].every(Boolean)) {
        status.textContent = 'Bitte Größe, Teig, Sauce und Käse auswählen.';
        status.className = 'alert alert-warning mt-3';
        return;
    }

    const response = await fetch('api/save_config.php', {
        method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(getPayload())
    });
    const data = await response.json();
    if (!response.ok) {
        status.textContent = data.error || 'Speichern fehlgeschlagen.';
        status.className = 'alert alert-danger mt-3';
        return;
    }
    status.textContent = `Gespeichert. Endpreis: ${euro(data.preis)}`;
    status.className = 'alert alert-success mt-3';
}

document.addEventListener('pizza-auth-changed', event => {
    document.getElementById('saveButton')?.classList.toggle('d-none', !event.detail.loggedIn);
});

document.addEventListener('DOMContentLoaded', async () => {
    pizzaData = await fetch('data/pizza_data.json').then(r => r.json());
    renderOptions();

    const editRaw = sessionStorage.getItem('pizza-edit-config');
    if (editRaw) {
        sessionStorage.removeItem('pizza-edit-config');
        try { applyConfig(JSON.parse(editRaw)); } catch (_) {}
    } else {
        const templateKey = new URLSearchParams(location.search).get('template');
        if (templateKey && pizzaData.vorlagen[templateKey]) applyConfig(pizzaData.vorlagen[templateKey]);
        else updateTotals();
    }

    document.getElementById('pizzaName').addEventListener('input', event => state.name = event.target.value);
    document.getElementById('applyCoupon').addEventListener('click', validateCoupon);
    document.getElementById('saveButton').addEventListener('click', saveConfig);
});
