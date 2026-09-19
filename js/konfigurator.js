let pizzaData = null;
let activeCoupon = null;

const state = {
    name: 'Meine Pizza',
    groesse: '', teig: '', sauce: '', kaese: '', belaege: [], extras: []
};

// Makronaehrwerte, die im Konfigurator live angezeigt werden.
// Preis und Kalorien bleiben serverseitig massgeblich (api/save_config.php).
const MACROS = ['protein', 'kohlenhydrate', 'fett', 'ballaststoffe'];

// Extras, die nicht auf der Pizza liegen, sondern separat serviert werden.
const SIDE_EXTRAS = {
    'Knoblauch-Dip': { kuerzel: 'Dip', text: 'Knoblauch-Dip separat' },
    'Chili-Öl': { kuerzel: 'Öl', text: 'Chili-Öl separat' }
};

function euro(value) {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
}

function gramm(value) {
    return `${Math.max(0, Math.round(value))} g`;
}

function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function optionCard(section, value, meta, multiple = false) {
    const id = `${section}-${value}`.replace(/[^a-zA-Z0-9_-]/g, '-');
    const type = multiple ? 'checkbox' : 'radio';
    const size = meta.cm ? `<span class="option-size">Ø ${meta.cm} cm</span>` : '';
    const label = meta.label ? `<span class="option-label">${escapeHtml(meta.label)}</span>` : '';
    const tags = [];
    if (meta.neu) tags.push('<span class="option-tag option-tag-new">Neu</span>');
    if (meta.leicht) tags.push('<span class="option-tag option-tag-light">Leichter</span>');
    const preis = meta.preis ? `+ ${euro(meta.preis)}` : 'inkl.';
    const kcal = `${meta.kcal >= 0 ? '+' : ''}${meta.kcal} kcal`;
    return `
        <label class="option-card" for="${id}">
            <span class="option-head">
                <input class="form-check-input" type="${type}" name="${section}" id="${id}" value="${escapeHtml(value)}">
                <span class="option-name">${escapeHtml(value)}</span>
            </span>
            ${label}${size}
            ${tags.length ? `<span class="option-tags">${tags.join('')}</span>` : ''}
            <span class="option-meta"><span class="option-price">${preis}</span><span class="option-kcal">${kcal}</span></span>
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

// Liefert alle aktuell gewaehlten Zutaten als [Abschnitt, Name, Datensatz].
function selectedEntries() {
    if (!pizzaData) return [];
    const entries = [];
    const singles = [['groessen', state.groesse], ['teige', state.teig], ['saucen', state.sauce], ['kaese', state.kaese]];
    for (const [section, value] of singles) {
        if (value && pizzaData[section][value]) entries.push([section, value, pizzaData[section][value]]);
    }
    for (const section of ['belaege', 'extras']) {
        for (const value of state[section]) {
            if (pizzaData[section][value]) entries.push([section, value, pizzaData[section][value]]);
        }
    }
    return entries;
}

function calculateLocalTotals() {
    const empty = { price: 0, kcal: 0, protein: 0, kohlenhydrate: 0, fett: 0, ballaststoffe: 0 };
    if (!pizzaData) return empty;

    const totals = { ...empty };
    for (const [, , meta] of selectedEntries()) {
        totals.price += Number(meta.preis);
        totals.kcal += Number(meta.kcal);
        for (const macro of MACROS) totals[macro] += Number(meta[macro] || 0);
    }

    // Ein Gutschein reduziert ausschliesslich den Preis - niemals Kalorien oder Naehrwerte.
    if (activeCoupon) totals.price -= totals.price * activeCoupon.rabatt_prozent / 100;

    totals.price = Math.max(0, totals.price);
    totals.kcal = Math.max(0, totals.kcal);
    for (const macro of MACROS) totals[macro] = Math.max(0, totals[macro]);
    return totals;
}

// Ernaehrungskennzeichnungen. Jede Regel ist aus den hinterlegten Zutatendaten
// ableitbar und steht zusaetzlich in pizza_data.json unter "kennzeichnungs_regeln".
function nutritionBadges(totals) {
    const entries = selectedEntries();
    if (!entries.length || !state.groesse) return [];

    const badges = [];
    const proteinAnteil = totals.kcal > 0 ? (4 * totals.protein) / totals.kcal : 0;
    const kohlenhydratAnteil = totals.kcal > 0 ? (4 * totals.kohlenhydrate) / totals.kcal : 0;

    if (totals.protein >= 30 && proteinAnteil >= 0.25) {
        badges.push({ text: 'High Protein', titel: `${Math.round(totals.protein)} g Protein, ${Math.round(proteinAnteil * 100)} % der Kalorien aus Protein` });
    }
    if (kohlenhydratAnteil > 0 && kohlenhydratAnteil <= 0.30) {
        badges.push({ text: 'Low Carb', titel: `${Math.round(kohlenhydratAnteil * 100)} % der Kalorien aus Kohlenhydraten` });
    }
    if (entries.every(([, , meta]) => meta.vegan)) {
        badges.push({ text: 'Vegan', titel: 'Alle gewählten Zutaten sind als vegan hinterlegt' });
    } else if (entries.every(([, , meta]) => meta.vegetarisch)) {
        badges.push({ text: 'Vegetarisch', titel: 'Keine gewählte Zutat ist als nicht vegetarisch hinterlegt' });
    }
    const leichte = entries.filter(([, , meta]) => meta.leicht).map(([, name]) => name);
    if (leichte.length) {
        badges.push({ text: 'Leichtere Wahl', titel: `Leichtere Variante gewählt: ${leichte.join(', ')}` });
    }
    return badges;
}

// Waehlt ein passendes, lokal vorhandenes Foto. Es gibt keine freigestellten
// Zutatenbilder im Projekt, deshalb wird die Auswahl nicht auf die Pizza gezeichnet,
// sondern als Zutatenliste daneben gezeigt.
function previewImage() {
    const vorlagen = pizzaData?.vorlagen || {};
    for (const vorlage of Object.values(vorlagen)) {
        if (!vorlage.bild) continue;
        const gleich = vorlage.teig === state.teig
            && vorlage.sauce === state.sauce
            && vorlage.kaese === state.kaese
            && [...vorlage.belaege].sort().join('|') === [...state.belaege].sort().join('|')
            && [...vorlage.extras].sort().join('|') === [...state.extras].sort().join('|');
        if (gleich) return { src: vorlage.bild, alt: `${vorlage.name} aus dem Steinofen`, vorlage: vorlage.name };
    }
    return { src: 'img/margherita.webp', alt: 'Ofenfrische Pizza als Beispielbild', vorlage: null };
}

function renderPreview() {
    const visual = document.getElementById('pizzaVisual');
    const photo = document.getElementById('pizzaPhoto');
    const badge = document.getElementById('pizzaSizeBadge');
    const sides = document.getElementById('pizzaSides');
    const note = document.getElementById('pizzaPhotoNote');
    if (!visual || !photo) return;

    const hasSize = Boolean(state.groesse);
    visual.dataset.empty = hasSize ? 'false' : 'true';

    const size = pizzaData?.groessen?.[state.groesse];
    if (size) {
        visual.style.setProperty('--pizza-size', `${150 + (size.cm - 20) * 6}px`);
        badge.textContent = `${state.groesse} · Ø ${size.cm} cm`;
        badge.classList.remove('d-none');
    } else {
        visual.style.removeProperty('--pizza-size');
        badge.classList.add('d-none');
    }

    const bild = previewImage();
    if (photo.getAttribute('src') !== bild.src) photo.setAttribute('src', bild.src);
    photo.setAttribute('alt', bild.alt);
    note.textContent = bild.vorlage
        ? `Abbildung: ${bild.vorlage}`
        : 'Beispielabbildung – deine Auswahl steht in der Zutatenliste';

    // Dip und Öl werden separat serviert und deshalb neben der Pizza gekennzeichnet.
    const marker = state.extras.filter(name => SIDE_EXTRAS[name]);
    sides.innerHTML = marker
        .map(name => `<span class="side-marker" title="${escapeHtml(SIDE_EXTRAS[name].text)}"><span class="side-marker-dot">${escapeHtml(SIDE_EXTRAS[name].kuerzel)}</span>${escapeHtml(name)}</span>`)
        .join('');
    sides.classList.toggle('d-none', marker.length === 0);
}

function renderSummary() {
    const list = document.getElementById('pizzaSummary');
    if (!list) return;

    const rows = [
        ['Größe', state.groesse ? `${state.groesse} · Ø ${pizzaData.groessen[state.groesse].cm} cm` : null],
        ['Teig', state.teig],
        ['Sauce', state.sauce],
        ['Käse', state.kaese],
        ['Beläge', state.belaege.length ? state.belaege.join(', ') : null],
        ['Extras', state.extras.length ? state.extras.join(', ') : null]
    ].filter(([, value]) => value);

    list.innerHTML = rows.length
        ? rows.map(([label, value]) => `<li><span>${label}</span><strong>${escapeHtml(value)}</strong></li>`).join('')
        : '<li class="text-secondary justify-content-center">Noch nichts ausgewählt</li>';
}

// Zutaten-Chips ersetzen die frueher auf die Pizza gezeichneten Symbole.
function renderChips() {
    const chips = document.getElementById('pizzaChips');
    if (!chips) return;
    const entries = selectedEntries().filter(([section]) => section !== 'groessen');
    chips.innerHTML = entries.length
        ? entries.map(([section, name, meta]) => {
            const klasse = meta.leicht ? ' chip-light' : '';
            const titel = [`${meta.preis ? `+ ${euro(meta.preis)}` : 'inkl.'}`, `${meta.kcal >= 0 ? '+' : ''}${meta.kcal} kcal`].join(' · ');
            return `<span class="pizza-chip chip-${section}${klasse}" title="${escapeHtml(titel)}">${escapeHtml(name)}</span>`;
        }).join('')
        : '<span class="text-secondary small">Noch keine Zutaten gewählt</span>';
}

function renderNutrition(totals) {
    const line = document.getElementById('nutritionLine');
    const badgeBox = document.getElementById('nutritionBadges');
    if (!line) return;

    const parts = [
        euro(totals.price),
        `${Math.round(totals.kcal)} kcal`,
        `${gramm(totals.protein)} Protein`,
        `${gramm(totals.kohlenhydrate)} Kohlenhydrate`,
        `${gramm(totals.fett)} Fett`
    ];
    if (totals.ballaststoffe > 0) parts.push(`${gramm(totals.ballaststoffe)} Ballaststoffe`);
    line.textContent = parts.join(' · ');

    const badges = nutritionBadges(totals);
    badgeBox.innerHTML = badges
        .map(b => `<span class="nutrition-badge" title="${escapeHtml(b.titel)}">${escapeHtml(b.text)}</span>`)
        .join('');
    badgeBox.classList.toggle('d-none', badges.length === 0);
}

function updateTotals() {
    const totals = calculateLocalTotals();
    document.getElementById('priceValue').textContent = euro(totals.price);
    document.getElementById('kcalValue').textContent = `${Math.round(totals.kcal)} kcal`;
    document.getElementById('proteinValue').textContent = gramm(totals.protein);
    document.getElementById('carbValue').textContent = gramm(totals.kohlenhydrate);
    document.getElementById('fatValue').textContent = gramm(totals.fett);
    document.getElementById('pizzaPreviewText').textContent = state.groesse
        ? `${state.groesse} · ${state.teig || 'Teig wählen'} · ${state.belaege.length} Beläge`
        : 'Wähle zuerst eine Größe';
    renderPreview();
    renderChips();
    renderSummary();
    renderNutrition(totals);
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
    const button = document.getElementById('applyCoupon');
    button.disabled = true;
    button.textContent = 'Prüfe …';
    try {
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
        showCouponMessage(`${activeCoupon.code}: ${activeCoupon.rabatt_prozent}% Rabatt auf den Preis. Kalorien und Nährwerte bleiben unverändert.`, 'success');
        updateTotals();
    } catch (_) {
        activeCoupon = null;
        showCouponMessage('Keine Verbindung zur Gutscheinprüfung. Bitte XAMPP und die Netzwerkverbindung prüfen.', 'danger');
        updateTotals();
    } finally {
        button.disabled = false;
        button.textContent = 'Einlösen';
    }
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
    const button = document.getElementById('saveButton');
    if (![state.groesse, state.teig, state.sauce, state.kaese].every(Boolean)) {
        status.textContent = 'Bitte Größe, Teig, Sauce und Käse auswählen.';
        status.className = 'alert alert-warning mt-3';
        return;
    }

    button.disabled = true;
    button.textContent = 'Wird gespeichert …';
    try {
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
    } catch (_) {
        status.textContent = 'Keine Verbindung zum Server. Bitte Apache und MySQL in XAMPP prüfen.';
        status.className = 'alert alert-danger mt-3';
    } finally {
        button.disabled = false;
        button.textContent = 'Konfiguration speichern';
    }
}

document.addEventListener('pizza-auth-changed', event => {
    document.getElementById('saveButton')?.classList.toggle('d-none', !event.detail.loggedIn);
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('data/pizza_data.json');
        if (!response.ok) throw new Error('Pizzadaten nicht verfügbar');
        pizzaData = await response.json();
    } catch (_) {
        const alertBox = document.getElementById('configLoadAlert');
        alertBox.textContent = 'Die Pizzadaten konnten nicht geladen werden. Bitte öffne die Anwendung über http://localhost/pizza-tracker/ und prüfe, ob data/pizza_data.json vorhanden ist.';
        alertBox.classList.remove('d-none');
        return;
    }
    renderOptions();

    const hinweis = document.getElementById('nutritionNote');
    if (hinweis && pizzaData.naehrwert_hinweis) {
        hinweis.textContent = 'Alle Nährwertangaben sind berechnete Richtwerte und können je nach Zutatenmenge abweichen.';
    }

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
