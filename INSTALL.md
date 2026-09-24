# Pizza Tracker — Installation und Inbetriebnahme

## Voraussetzungen

- XAMPP mit Apache, PHP ab 8.1 und MySQL/MariaDB
- PHP-Erweiterungen `pdo_mysql` und `mbstring` (in XAMPP üblicherweise aktiv)
- aktueller Browser
- Internetzugang beim Laden der Seiten, da Bootstrap 5.3.3 von `cdn.jsdelivr.net` geladen wird

MAMP ist als Alternative vorgesehen, verwendet aber in der Standardeinstellung andere Datenbankwerte als XAMPP. In diesem Fall müssen die Verbindungswerte (siehe unten) angepasst werden. Dieser Weg ist bisher nicht in einem Testprotokoll nachgewiesen.

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
- `WELCOME` — 15 %, nur für angemeldete Nutzer; die Nutzung wird über vorhandene gespeicherte Konfigurationen geprüft
- `STUDENT5` — 5 %, kein Ablaufdatum

## Kurztest

1. Registrierung durchführen.
2. Pizza konfigurieren und Live-Preis/Kalorien prüfen.
3. `PIZZA10` einlösen.
4. Prüfen, ob S/M/L/XL/XXL mit 20/26/30/34/40 cm angezeigt werden.
5. Knoblauch-Dip und Chili-Öl als separate Kennzeichnung neben der Pizza prüfen.
6. Nährwertzeile mit Protein, Kohlenhydraten und Fett prüfen; Gutschein darf sie nicht verändern.
7. Konfiguration speichern, unter „Meine Pizzen“ erneut öffnen und löschen.
8. Startseite und Allergene-Seite auf Desktop und Mobilansicht öffnen.
9. Abmelden und prüfen, dass „Meine Pizzen“ nicht mehr in der Navigation sichtbar ist.
