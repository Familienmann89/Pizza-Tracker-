# S3 — Inbetriebnahme

Die folgenden Schritte beschreiben die lokale Einrichtung mit XAMPP. Eine ausführlichere Anleitung kann zusätzlich im Hauptordner des vollständigen Projekts abgelegt werden.

## Voraussetzungen

| Software | Version | Download |
|---|---|---|
| PHP | 8.x | über XAMPP oder MAMP |
| MySQL / MariaDB | 10.4+ | über XAMPP oder MAMP |
| Webbrowser | aktuell | Chrome, Firefox, Safari |

## Kurzübersicht (XAMPP)

```
1. XAMPP installieren → Apache + MySQL starten
2. Projektordner nach C:\xampp\htdocs\pizza-tracker\ kopieren
3. phpMyAdmin öffnen und die Datenbank `pizza_tracker` anlegen
4. Die SQL-Datei mit dem Datenbankschema importieren und die Tabellen anlegen
5. Falls vorhanden, die Datei mit Beispieldaten und Gutscheincodes importieren
6. Im Browser `http://localhost/pizza-tracker/startseite.html` öffnen
```

## Umgebungen

| Umgebung | Beschreibung |
|---|---|
| Lokal (XAMPP) | Standardumgebung für Entwicklung und Bewertung |
| Lokal (MAMP) | Alternative für macOS (Port 8888) |
| Produktion | Nicht vorgesehen im Rahmen dieses Projekts |

## Test-Gutscheincodes

| Code | Rabatt |
|---|---|
| `PIZZA10` | 10 % |
| `SPARE20` | 20 % |
| `WELCOME` | 15 % |
| `STUDENT5` | 5 % |
