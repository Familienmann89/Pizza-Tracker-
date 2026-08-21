# Pizza Tracker — Installation und Inbetriebnahme

## Voraussetzungen

- XAMPP mit Apache, PHP 8 und MySQL/MariaDB
- aktueller Browser

## Installation unter Windows / XAMPP

1. Repository nach `C:\xampp\htdocs\pizza-tracker\` kopieren.
2. XAMPP Control Panel öffnen und **Apache** sowie **MySQL** starten.
3. `http://localhost/phpmyadmin` öffnen.
4. Die Datei `database/schema.sql` importieren. Sie erstellt die Datenbank `pizza_tracker`, alle Tabellen und die vier Gutschein-Codes.
5. Anschließend `http://localhost/pizza-tracker/startseite.html` öffnen.

## Datenbankverbindung

Standardmäßig verwendet die Anwendung die typischen XAMPP-Werte:

- Host: `127.0.0.1`
- Port: `3306`
- Datenbank: `pizza_tracker`
- Benutzer: `root`
- Passwort: leer

Alternativ können die Umgebungsvariablen `PIZZA_DB_HOST`, `PIZZA_DB_PORT`, `PIZZA_DB_NAME`, `PIZZA_DB_USER` und `PIZZA_DB_PASS` gesetzt werden.

## Test-Gutscheine

- `PIZZA10` — 10 %
- `SPARE20` — 20 %
- `WELCOME` — 15 %, einmal pro registriertem Nutzer
- `STUDENT5` — 5 %

## Kurztest

1. Registrierung durchführen.
2. Pizza konfigurieren und Live-Preis/Kalorien prüfen.
3. `PIZZA10` einlösen.
4. Konfiguration speichern.
5. Unter „Meine Pizzen“ öffnen, erneut bearbeiten und löschen.
6. Abmelden und prüfen, dass „Meine Pizzen“ nicht mehr in der Navigation sichtbar ist.
