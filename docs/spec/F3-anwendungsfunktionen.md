# F3 — Anwendungsfunktionen

## API-Endpunkte

Die Backend-Funktionen liegen als einzelne PHP-Endpunkte im Ordner `api/`. Das Frontend ruft sie mit `fetch()` auf.

| ID | Funktion | Methode | Endpunkt | Auth |
|---|---|---|---|---|
| F3.01 | Session prüfen | GET | `api/session.php` | — |
| F3.02 | Login | POST | `api/login.php` | — |
| F3.03 | Logout | POST | `api/logout.php` | — |
| F3.04 | Registrierung | POST | `api/register.php` | — |
| F3.05 | Gutschein prüfen | POST | `api/coupon.php` | — |
| F3.06 | Konfiguration speichern | POST | `api/save_config.php` | ✅ Session |
| F3.07 | Konfigurationen laden | GET | `api/load_configs.php` | ✅ Session |
| F3.08 | Konfiguration löschen | POST | `api/delete_config.php` | ✅ Session |

## Beispiele für Anfragen und Antworten

### F3.01 — Session prüfen

Antwort bei aktiver Sitzung:

```json
{ "loggedIn": true, "user": { "id": 1, "vorname": "Ramon", "email": "ramon@example.de" } }
```

Antwort ohne aktive Sitzung:

```json
{ "loggedIn": false }
```

### F3.02 — Login

Anfrage:

```json
{ "email": "max@example.de", "passwort": "geheim123" }
```

Erfolgreiche Antwort:

```json
{ "success": true, "user": { "id": 1, "vorname": "Max", "email": "max@example.de" } }
```

Fehlerantwort:

```json
{ "error": "E-Mail oder Passwort ist falsch." }
```

### F3.05 — Gutschein prüfen

Anfrage:

```json
{ "code": "PIZZA10" }
```

Erfolgreiche Antwort:

```json
{ "success": true, "code": "PIZZA10", "rabatt_prozent": 10.00 }
```

Fehlerantwort:

```json
{ "error": "Ungültiger Gutscheincode." }
```

### F3.06 — Konfiguration speichern

Anfrage:

```json
{
  "name": "Meine Lieblingspizza",
  "groesse": "XL",
  "teig": "Käserand",
  "sauce": "Tomate",
  "kaese": "Mozzarella",
  "belaege": ["Salami", "Champignons"],
  "gutschein_code": "PIZZA10",
  "preis": 14.39
}
```

Erfolgreiche Antwort:

```json
{ "success": true, "id": 42 }
```

## HTTP-Statuscodes

| Code | Bedeutung | Beispiel |
|---|---|---|
| 200 | Erfolg | Session-Abfrage, Login |
| 201 | Ressource erstellt | Registrierung, Konfiguration speichern |
| 400 | Ungültige Eingabe | Pflichtfeld fehlt, Passwort zu kurz |
| 401 | Nicht angemeldet | Zugriff auf geschützten Endpunkt |
| 404 | Ressource nicht gefunden | Ungültiger Gutscheincode, fremde Konfiguration |
| 405 | Falsche HTTP-Methode | GET statt POST |
| 409 | Konflikt | E-Mail bereits registriert |
| 410 | Ressource abgelaufen | Gutscheincode abgelaufen |

## Frontend-Funktionen (JavaScript)

| Datei | Funktion | Beschreibung |
|---|---|---|
| `js/auth.js` | `checkSession()` | Prüft beim Seitenaufruf den Anmeldestatus und passt die Navigation an |
| `js/auth.js` | `logoutUser()` | Ruft `api/logout.php` auf und leitet anschließend zur Startseite weiter |
| `js/konfigurator.js` | `updatePreis()` | Berechnet Preis live nach jeder Auswahl |
| `js/konfigurator.js` | `updateKalorien()` | Berechnet Kalorien live nach jeder Auswahl |
| `js/konfigurator.js` | `validateCoupon()` | Sendet Code an `api/coupon.php`, zeigt Rabatt an |
| `js/konfigurator.js` | `saveConfig()` | Sendet Konfiguration an `api/save_config.php` |
