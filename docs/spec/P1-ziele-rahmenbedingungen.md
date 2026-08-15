# P1 — Ziele und Rahmenbedingungen

## Worum geht es?

Der Pizza Tracker ist eine Webanwendung, in der Nutzer ihre eigene Pizza zusammenstellen können. Während der Auswahl werden Preis und Kalorien direkt angezeigt. Zusätzlich können gültige Gutscheincodes eingelöst werden. Mit einem Benutzerkonto lassen sich eigene Zusammenstellungen speichern und später erneut öffnen.

## Was die App können soll

- Pizza zusammenstellen: Größe, Teig, Sauce, Käse und Beläge wählen
- Preis und Kalorien werden live berechnet ohne Neuladen der Seite
- Gutscheincodes für prozentuale Rabatte einlösen
- Registrierung und Login
- Eigene Konfigurationen speichern, anzeigen und löschen

## Gutschein-System

Der Pizza Tracker bietet ein Gutschein-System, mit dem Nutzer beim Konfigurieren ihrer Pizza einen Preisnachlass erhalten können.

Ein Gutscheincode besteht aus einer Buchstaben-Zahlen-Kombination (z.B. PIZZA10) und gewährt bei Eingabe einen prozentualen Rabatt auf den Gesamtpreis der konfigurierten Pizza. Das System prüft dabei automatisch ob der Code gültig, aktiv und noch nicht abgelaufen ist.

Es gibt verschiedene Arten von Gutscheincodes:

| Art | Beschreibung | Beispiel |
|---|---|---|
| Zeitlich begrenzt | Gilt nur bis zu einem bestimmten Datum | PIZZA10 (10 %), SPARE20 (20 %) |
| Einmalig | Gilt nur bei der ersten Bestellung nach der Registrierung | WELCOME (15 %) |
| Dauerhaft | Gilt unbegrenzt für eine bestimmte Zielgruppe | STUDENT5 (5 % für Studenten) |

## Wer benutzt die App?

| Stakeholder | Rolle | Was erwartet er? |
|---|---|---|
| Gast (nicht angemeldet) | Nutzer | Pizza konfigurieren sowie Preis und Kalorien sehen |
| Registrierter Nutzer | Hauptnutzer | Konfigurationen speichern und wiederverwenden |
| Projektgruppe | Entwickler | Eine funktionierende und nachvollziehbare Umsetzung |
| Betreuer (Carsten Lucke) | Prüfer | Nachvollziehbare Softwareentwicklung im Rahmen von WK_1208 |

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

## Rahmenbedingungen

| Kategorie | Was gilt |
|---|---|
| Kurs | Softwaretechnik (WK_1208), THM |
| Gruppe | 5 Personen, Wirtschaftsinformatik B.Sc. |
| Technik | PHP 8, JavaScript, MySQL/MariaDB, Bootstrap 5.3 |
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
