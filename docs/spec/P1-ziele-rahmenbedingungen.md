# P1 — Ziele und Rahmenbedingungen

## Worum geht es?

Der Pizza Tracker ist eine Webanwendung, in der Nutzer ihre eigene Pizza zusammenstellen können. Während der Auswahl werden Preis und Kalorien direkt angezeigt. Zusätzlich können gültige Gutscheincodes eingelöst werden. Mit einem Benutzerkonto lassen sich eigene Zusammenstellungen speichern und später erneut öffnen.

## Was die App können soll

- Pizza zusammenstellen: Größe, Teig, Sauce, Käse, Beläge und Extras wählen
- Preis und Kalorien werden live berechnet ohne Neuladen der Seite
- Gutscheincodes für prozentuale Rabatte einlösen
- Registrierung und Login
- Eigene Konfigurationen speichern, anzeigen und löschen
- Pizza-Größen mit Durchmesser anzeigen
- Auswahl in einer dynamischen Pizza-Vorschau darstellen
- Projekt- und Allergenhinweise bereitstellen
- Makronährstoffe (Protein, Kohlenhydrate, Fett, Ballaststoffe) live mitberechnen
- Leichtere Zutatenvarianten und einen Protein-/Low-Carb-Teig anbieten
- Nachvollziehbare Ernährungskennzeichnungen aus den hinterlegten Zutatendaten ableiten

## Gutschein-System

Der Pizza Tracker bietet ein Gutschein-System, mit dem Nutzer beim Konfigurieren ihrer Pizza einen Preisnachlass erhalten können.

Ein Gutscheincode besteht aus einer Buchstaben-Zahlen-Kombination (z.B. PIZZA10) und gewährt bei Eingabe einen prozentualen Rabatt auf den Gesamtpreis der konfigurierten Pizza. Das System prüft dabei automatisch, ob der Code gültig, aktiv und noch nicht abgelaufen ist; bei WELCOME zusätzlich, ob der Nutzer angemeldet ist und den Code noch nicht verwendet hat.

Es gibt verschiedene Arten von Gutscheincodes:

| Art | Beschreibung | Beispiel |
|---|---|---|
| Zeitlich begrenzt | Gilt nur bis zu einem bestimmten Datum | PIZZA10 (10 %), SPARE20 (20 %) |
| Einmalig | Nur für angemeldete Nutzer, einmal pro Nutzerkonto. Technische Einschränkung: Die bisherige Nutzung wird nur über eine noch vorhandene gespeicherte Konfiguration erkannt; nach deren Löschung kann der Code erneut verwendet werden ([A11](../arch/A11-risks-and-technical-debts.md), R-03) | WELCOME (15 %) |
| Dauerhaft | STUDENT5 gewährt 5 % Rabatt und besitzt kein Ablaufdatum; eine Prüfung des Studentenstatus findet nicht statt | STUDENT5 (5 %) |

## Wer benutzt die App?

| Stakeholder | Rolle | Was erwartet er? |
|---|---|---|
| Gast (nicht angemeldet) | Nutzer | Pizza konfigurieren sowie Preis und Kalorien sehen |
| Registrierter Nutzer | Hauptnutzer | Konfigurationen speichern und wiederverwenden |
| Projektgruppe | Entwickler | Eine funktionierende und nachvollziehbare Umsetzung |
| Betreuer (Carsten Lucke) | Prüfer | Nachvollziehbare Softwareentwicklung im Rahmen von WK_1106 |

## Was gehört dazu — und was nicht?

**Dabei:**
- Pizza konfigurieren aus vorgegebenen Zutaten
- Berechnung von Preis und Kalorien
- Gutscheincodes mit prozentualem Rabatt
- Nutzerregistrierung und Login
- Konfigurationen speichern, laden, löschen

**Nicht dabei:**
- Echte Lieferung oder Bestellung
- Bezahlung
- Admin-Bereich für Pizzeria
- Native App für Handy
- Echtzeit-Tracking
- Getränke, Warenkorb und sonstige Produktkategorien
- Verbindliche Ernährungs- oder Allergenberatung (die Nährwert- und Allergenangaben sind ausdrücklich Richtwerte)
- Mengengenaue Rezepturen und Herstellerangaben je Zutat
- Echter Warenkorb, Bestellprozess und Zahlungsanbieter (PayPal, Apple Pay, Google Pay, Kreditkarte) — mögliche spätere Erweiterung

## Rahmenbedingungen

| Kategorie | Was gilt |
|---|---|
| Kurs | Wirtschaftsinformatik-Projekt I (Softwaretechnik), WK_1106, THM |
| Gruppe | 4 Personen, Wirtschaftsinformatik B.Sc. |
| Technik | PHP ab 8.1, JavaScript, MySQL/MariaDB, Bootstrap 5.3 |
| Betrieb | Lokal per XAMPP oder MAMP |
| Versionskontrolle | Git auf GitHub |
| Abgabe M1 | Fr, 3. Juli 2026 |
| Abgabe M3 | Fr, 25. September 2026 |

## Wann ist das Projekt erfolgreich?

- Eine Pizza kann vollständig zusammengestellt werden; Preis und Kalorien werden dabei direkt aktualisiert
- Gutscheincodes werden korrekt geprüft und der Rabatt wird vom Preis abgezogen
- Registrierung und Anmeldung funktionieren zuverlässig
- Angemeldete Nutzer können ihre Konfigurationen speichern und unter "Meine Pizzen" abrufen
- Die App läuft stabil lokal per XAMPP
