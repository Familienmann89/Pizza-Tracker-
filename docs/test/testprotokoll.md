# Testprotokoll — Pizza Tracker (M3)

Manuelles Testprotokoll zu den Qualitätsszenarien aus [A10](../arch/A10-quality-requirements.md).

Es werden nur tatsächlich durchgeführte Prüfungen als bestanden eingetragen. Nicht vollständig geprüfte Szenarien bleiben als „nicht durchgeführt“ gekennzeichnet.

## Testumgebung

| Feld | Angabe |
|---|---|
| Geprüfter Commit | `e568e4d` (Branch `docs/final-documentation`) |
| Datum | 24.09.2026 |
| Durchgeführt von | Ugur Kökser |
| Betriebssystem | Windows 11 |
| Webserver | Apache 2.4.58 über XAMPP |
| PHP | 8.2.12 |
| Datenbank | MariaDB 10.4.32, lokale Testdatenbank `pizza_tracker` |
| Browser | Microsoft Edge, aktuelle installierte Version |
| Testdaten | Lokales Testkonto und manuell erstellte Pizza-Konfigurationen |

## Qualitätsszenarien aus A10

| ID | Prüfung | Ist-Ergebnis | Status |
|---|---|---|---|
| QS-01 | Gleiche Auswahl zweimal speichern, ohne und mit wiederverwendbarem Gutschein | Nicht vollständig in den geforderten Testpaaren geprüft. | nicht durchgeführt |
| QS-02 | Nutzer A versucht, Pizza von Nutzer B zu laden und zu löschen | Kein Test mit zwei getrennten Nutzerkonten durchgeführt. | nicht durchgeführt |
| QS-03 | Speichern mit eingeschleustem `preis: 0.01` | Manipulierter API-Aufruf wurde nicht durchgeführt. | nicht durchgeführt |
| QS-04 | Jede Auswahlkategorie ändern; nach aktivem Gutschein Auswahl ändern | Nicht für jede Auswahlkategorie vollständig geprüft. | nicht durchgeführt |
| QS-05 | `save_config`, `delete_config`, `load_configs` ohne Session und nach Logout | Endpunkte wurden nicht einzeln auf HTTP 401 geprüft. | nicht durchgeführt |
| QS-06 | Alle sechs Seiten bei 360 px und 1280 px in zwei Browsern | Nicht vollständig in zwei Browsern und beiden Breiten geprüft. | nicht durchgeführt |
| QS-07 | Neue Option nur in `pizza_data.json` ergänzen | Keine separate Arbeitskopie verändert. | nicht durchgeführt |
| QS-08 | Preis einer Option ändern und gleiche Auswahl erneut speichern | Keine separate Arbeitskopie verändert. | nicht durchgeführt |
| QS-09 | Frische Installation nach README und INSTALL | Datenbank neu aus `database/schema.sql` importiert. Registrierung, Login und Speichern funktionierten. | bestanden |
| QS-10 | Unbekannter, inaktiver und abgelaufener Gutscheincode | Nicht alle drei Fälle und HTTP-Statuscodes geprüft. | nicht durchgeführt |
| QS-11 | Registrierung sowie Login mit richtigem und falschem Passwort | Registrierung erfolgreich. Passwort in `users.passwort` als bcrypt-Hash gespeichert. Falsches Passwort wurde abgelehnt, korrektes akzeptiert. | bestanden |
| QS-12 | Pizza mit Apostroph im Namen speichern und SQL-Aufrufe prüfen | Apostroph-Test und vollständige Codeprüfung nicht durchgeführt. | nicht durchgeführt |
| QS-13 | Registrierung direkt mit ungültiger E-Mail aufrufen | Direkter API-Aufruf nicht durchgeführt. | nicht durchgeführt |

## Zusätzliche Prüfungen aus A10, Abschnitt 10.4

| ID | Prüfung | Ist-Ergebnis | Status |
|---|---|---|---|
| Z-01 | Vorlage Margherita (M) | 7,50 €, 855 kcal, 38 g Protein, 115 g Kohlenhydrate und 27 g Fett angezeigt. | bestanden |
| Z-02 | Margherita (M) mit `PIZZA10` | 6,75 € angezeigt. Kalorien und Nährwerte blieben unverändert. | bestanden |
| Z-03 | M, Protein-Teig, Crème fraîche, Mozzarella, Salami und Knoblauch-Dip | 13,60 €, 1145 kcal, 74 g Protein, 42 g Kohlenhydrate und 76 g Fett angezeigt. Kennzeichnungen High Protein, Low Carb und Leichtere Wahl vorhanden. | bestanden |
| Z-04 | Margherita (M) mit `STUDENT5`: Anzeige und gespeicherten Preis vergleichen | Anzeige 7,13 €, gespeichert 7,12 €. Die bekannte Rundungsabweichung aus A05 O-5 wurde bestätigt. | bestanden |
| Z-05 | `WELCOME` verwenden, erneut versuchen, Konfiguration löschen und erneut versuchen | Erste Verwendung erfolgreich, zweite Verwendung abgelehnt. Nach Löschen der gespeicherten WELCOME-Konfiguration war der Gutschein erneut verwendbar. Bekannte Grenze A11 R-03 bestätigt. Zusätzlich: Anzeige 6,38 €, gespeichert 6,37 € wegen Rundung. | bestanden |
| Z-06 | Nach aktivem Gutschein leeres Feld einlösen | Hinweis „Bitte einen Gutscheincode eingeben“ erschien, der vorherige Rabatt blieb jedoch aktiv. Bekannte Grenze bestätigt. | bestanden |
| Z-07 | Verhalten bei gestopptem MySQL | Bei gestopptem MySQL blieb „Meine Pizzen“ bei „Pizzen werden geladen…“ stehen; eine verständliche Verbindungsmeldung erschien nicht. MySQL wurde anschließend neu gestartet und die Pizzen wurden wieder geladen. Login, Registrierung, Löschen und gestoppter Apache wurden in diesem Zusammenhang nicht zusätzlich geprüft. Bekannte Lücke A11 R-04 bestätigt. | bestanden |
| Z-08 | Vorhandene Links in Navigation und Fußzeile | Alle im geprüften Stand vorhandenen Links wurden geöffnet und funktionierten. Impressum und Datenschutz sind in diesem Code- und Dokumentationsstand nicht enthalten. | bestanden |

## Zusammenfassung

| Status | Anzahl |
|---|---:|
| bestanden | 10 |
| nicht bestanden | 0 |
| blockiert | 0 |
| nicht durchgeführt | 11 |

## Abweichungen und Beobachtungen

- `STUDENT5`: Der angezeigte Preis von 7,13 € wird als 7,12 € gespeichert. Die bekannte Rundungsabweichung aus A05 O-5 wurde reproduziert.
- `WELCOME`: Nach dem Löschen der Konfiguration, in der der Gutschein verwendet wurde, kann derselbe Nutzer den Gutschein erneut einsetzen. Die bekannte Grenze aus A11 R-03 wurde reproduziert.
- `WELCOME`: Beim getesteten Grundpreis von 7,50 € wurden 6,38 € angezeigt, aber 6,37 € gespeichert.
- Wird nach einem aktiven Gutschein ein leeres Gutscheinfeld eingelöst, erscheint eine Warnung, der bisherige Rabatt bleibt jedoch aktiv.
- Bei gestopptem MySQL bleibt die Seite „Meine Pizzen“ im Ladezustand, ohne eine verständliche Fehlermeldung anzuzeigen.
- Beim erneuten Bearbeiten einer gespeicherten Pizza werden die Zutaten wiederhergestellt, ein zuvor verwendeter Gutschein jedoch nicht erneut aktiviert. Dieses Verhalten ist in A04, A05 und A11 dokumentiert.
- Nicht vollständig geprüfte Qualitätsszenarien wurden bewusst nicht als bestanden bewertet.
