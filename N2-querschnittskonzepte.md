# N2 — Querschnittskonzepte

## Authentifizierung & Session-Management

- PHP-Sessions (`$_SESSION`) für serverseitigen Anmeldestatus
- Passwort-Hashing mit `password_hash()` / `password_verify()` (bcrypt, `PASSWORD_DEFAULT`)
- `auth.js` prüft bei **jedem Seitenaufruf** den Session-Status über `api/session.php` und passt Navigation an
- Für den überschaubaren Projektumfang werden serverseitige Sessions statt JWT verwendet
- Session wird bei Logout vollständig zerstört (`session_destroy()`) und Cookie gelöscht

## Fehlerbehandlung

- Alle API-Endpunkte geben strukturierte JSON-Antworten zurück:
  - Erfolg: `{ "success": true, ... }`
  - Fehler: `{ "error": "Beschreibung des Fehlers" }`
- HTTP-Statuscodes werden korrekt gesetzt (200, 201, 400, 401, 404, 405, 409, 410)
- Frontend zeigt Fehlermeldungen als Bootstrap-Hinweisfelder an (grün = Erfolg, rot = Fehler)
- Die clientseitige Prüfung verbessert die Bedienung, ersetzt aber nicht die serverseitige Validierung

## Datenbankzugriff

- Der Datenbankzugriff wird zentral über `config/database.php` hergestellt
- Für Datenbankabfragen werden PDO Prepared Statements verwendet
- Verbindungsfehler werden abgefangen und als JSON-Fehler zurückgegeben
- Zeichensatz: `utf8mb4` für vollständige Unicode-Unterstützung (inkl. Emojis)

## Datenschutz

- Passwörter werden nicht im Klartext gespeichert
- Passwörter werden mit `password_hash()` gehasht
- Zugangsdaten und mögliche Secrets sollen nicht im Repository abgelegt werden (`.gitignore`)
- Keine personenbezogenen Daten in URL-Parametern

## KI-Werkzeuge

| Werkzeug | Einsatzbereich | Prüfung / Überarbeitung |
|---|---|---|
| Claude | Unterstützung bei Code, Struktur und Formulierungen | Ergebnisse wurden von der Gruppe geprüft und angepasst |
| GitHub Copilot | Unterstützung bei der Code-Vervollständigung | Vorschläge wurden nicht ungeprüft übernommen |

Die Werkzeuge wurden nur unterstützend eingesetzt. Für Inhalt, Umsetzung und Prüfung ist die Projektgruppe verantwortlich.
