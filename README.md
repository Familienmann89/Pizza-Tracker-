# Pizza Tracker

Pizza Tracker ist eine lokale Webanwendung für das Hochschulmodul Wirtschaftsinformatik-Projekt I (Softwaretechnik), WK_1106. Nutzer können eine Pizza aus Größe, Teig, Sauce, Käse, Belägen und Extras zusammenstellen. Preis und Kalorien werden sofort berechnet. Angemeldete Nutzer können eigene Konfigurationen speichern, erneut laden und löschen.

> **Hinweis:** Dies ist ein Hochschulprojekt. Es können keine echten Bestellungen oder Zahlungen durchgeführt werden.

## Funktionen

- responsive Startseite mit drei Pizza-Vorlagen
- Konfigurator für S, M, L, XL und XXL inklusive Durchmesser
- Pizza-Vorschau auf Basis lokaler Fotos mit Zutatenliste als Chips
- Live-Berechnung von Preis, Kalorien, Protein, Kohlenhydraten und Fett
- leichtere Zutatenvarianten und ein Protein-Teig (Low Carb)
- Ernährungskennzeichnungen nach nachvollziehbaren, datenbasierten Regeln
- Gutscheincodes mit serverseitiger Prüfung
- Registrierung, Anmeldung und PHP-Session
- Speichern, Anzeigen, erneutes Bearbeiten und Löschen eigener Pizzen
- Informationsseite zu Allergenen und Inhaltsstoffen

## Technologien

- HTML5 und CSS3
- Bootstrap 5.3.3, geladen über `cdn.jsdelivr.net` (Internetzugang beim Laden der Seiten erforderlich)
- JavaScript ohne zusätzliches Framework
- PHP ab 8.1 mit den Erweiterungen PDO/`pdo_mysql` und `mbstring`
- PDO mit Prepared Statements
- MySQL oder MariaDB
- XAMPP oder MAMP für den lokalen Betrieb

## Installation

1. Repository nach `C:\xampp\htdocs\pizza-tracker\` kopieren.
2. Im XAMPP Control Panel Apache und MySQL starten.
3. `http://localhost/phpmyadmin` öffnen.
4. `database/schema.sql` importieren.
5. `http://localhost/pizza-tracker/startseite.html` aufrufen.

Weitere Hinweise stehen in [INSTALL.md](INSTALL.md).

## Gutscheine

| Code | Rabatt |
|---|---:|
| `PIZZA10` | 10 % |
| `SPARE20` | 20 % |
| `WELCOME` | 15 % |
| `STUDENT5` | 5 % |

Die Gültigkeit und Nutzbarkeit werden über `api/coupon.php` geprüft.

## Projektstruktur

```text
api/         PHP-Endpunkte
config/      Datenbankverbindung und Hilfsfunktionen
css/         gemeinsames Stylesheet
data/        Pizzaoptionen, Preise, kcal und Vorlagen
database/    Datenbankschema
docs/spec/   fachliche Spezifikation
docs/arch/   Architekturdokumentation
img/         lokale Bilddateien und Favicon
js/          Browserlogik
```

## Kurzer Funktionstest

1. Benutzerkonto registrieren und anmelden.
2. Margherita laden und `7,50 €` sowie `855 kcal` prüfen.
3. Salami laden und `9,00 €` sowie `1.020 kcal` prüfen.
4. Hawaii laden und `10,00 €` sowie `1.040 kcal` prüfen.
5. `PIZZA10` einlösen und kontrollieren, dass nur der Preis reduziert wird.
6. Konfiguration speichern, unter „Meine Pizzen“ öffnen und wieder löschen.
7. Knoblauch-Dip und Chili-Öl als separate Kennzeichnung neben der Pizza prüfen.
8. Nährwertzeile prüfen: Margherita M zeigt 38 g Protein, 115 g Kohlenhydrate, 27 g Fett.
9. Protein-Teig (Low Carb) + Light-Mozzarella + Hähnchenbrust wählen und die Kennzeichnungen „High Protein" und „Low Carb" prüfen.

## Datenschutz

Die Anwendung ist für einen lokalen Lehrbetrieb vorgesehen. Sie verarbeitet Registrierungsdaten, eine technisch notwendige PHP-Session und gespeicherte Pizza-Konfigurationen. Eigene Datenschutz- oder Impressumsseiten sind in der M3-Version nicht enthalten.

## Team

Die Rollen und Mitglieder sind in [TEAMINFO.md](TEAMINFO.md) dokumentiert.

## Einsatz von KI-Werkzeugen

KI-Werkzeuge wurden unterstützend für Codeanalyse, Entwürfe, Dokumentation und die Erstellung der lokalen Pizza-Bilder eingesetzt. Alle übernommenen Ergebnisse müssen von der Projektgruppe geprüft und verstanden werden. Genannt wurden im Projektverlauf insbesondere Claude, GitHub Copilot und ChatGPT/Codex. Die Offenlegung steht in [docs/spec/README.md](docs/spec/README.md#eingesetzte-ki-werkzeuge) und [docs/arch/README.md](docs/arch/README.md#eingesetzte-ki-werkzeuge).

## Nährwerte

Jede Zutat trägt in `data/pizza_data.json` neben Preis und Kalorien auch Protein, Kohlenhydrate, Fett und
Ballaststoffe. Die Werte sind aus üblichen Lebensmittel-Referenzwerten abgeleitet und so gerundet, dass
4 kcal/g Protein + 4 kcal/g Kohlenhydrate + 9 kcal/g Fett die hinterlegten Kalorien plausibel ergeben.
Es sind berechnete Richtwerte, keine Laborwerte und keine Ernährungsberatung. Details stehen in
[docs/spec/D2-datentypen.md](docs/spec/D2-datentypen.md).

Ein Gutschein reduziert ausschließlich den Preis — Kalorien und Nährwerte bleiben unverändert.

## Projektgrenzen

Nicht Bestandteil der M3-Version sind echte Bestellungen, ein Warenkorb, Lieferprozesse, Getränke, ein
Administrationsbereich und Echtzeit-Tracking. Ebenfalls nicht umgesetzt sind Zahlungsanbieter wie PayPal,
Apple Pay, Google Pay oder Kreditkartenzahlung; sie sind allenfalls spätere Erweiterungen. Die Nährwert-
und Allergenangaben sind Richtwerte und ersetzen keine verbindliche Kennzeichnung oder Beratung.

## Abgabe

Der finale Abgabestand muss auf dem Default-Branch liegen und durch einen annotierten Git-Tag gekennzeichnet werden, beispielsweise:

```bash
git tag -a v1.0.0 -m "Final submission M3"
git push origin v1.0.0
```
