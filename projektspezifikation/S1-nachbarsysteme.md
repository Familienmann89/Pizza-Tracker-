# S1 — Nachbarsysteme

## Externe Systeme

Der Pizza Tracker ist im aktuellen Projektumfang nicht an externe Fachsysteme oder APIs angebunden. Zutaten, Preise, Kalorienwerte und Gutscheine werden innerhalb der Anwendung verwaltet.

Es gibt keine Anbindung an:
- Lieferdienste
- Zahlungsanbieter
- E-Mail-Provider
- Social-Login-Dienste (Google, Facebook)
- Analytics-Dienste

## Interne Schnittstellen (Frontend ↔ Backend)

Die Kommunikation findet hauptsächlich über interne HTTP-Endpunkte zwischen Browser und PHP-Backend statt:

| Methode | Endpunkt | Auth | Beschreibung |
|---|---|---|---|
| GET | `api/session.php` | — | Session-Status prüfen |
| POST | `api/login.php` | — | Nutzer einloggen |
| POST | `api/logout.php` | — | Nutzer ausloggen |
| POST | `api/register.php` | — | Nutzer registrieren |
| POST | `api/coupon.php` | — | Gutschein validieren |
| POST | `api/save_config.php` | ✅ Session | Konfiguration speichern |
| GET | `api/load_configs.php` | ✅ Session | Konfigurationen laden |
| POST | `api/delete_config.php` | ✅ Session | Konfiguration löschen |

## Externe Bibliotheken (CDN)

Bootstrap und Bootstrap Icons werden standardmäßig über ein CDN eingebunden. Dadurch besteht für diese Dateien eine externe technische Abhängigkeit:

| Bibliothek | Version | Zweck | URL |
|---|---|---|---|
| Bootstrap CSS | 5.3.3 | Responsives Styling | cdn.jsdelivr.net |
| Bootstrap JS | 5.3.3 | Interaktive Komponenten | cdn.jsdelivr.net |
| Bootstrap Icons | 1.11.3 | Icon-Font | cdn.jsdelivr.net |

Für einen vollständig lokalen Betrieb können die Dateien heruntergeladen und direkt in das Projekt eingebunden werden.
