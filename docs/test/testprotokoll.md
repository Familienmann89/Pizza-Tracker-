# Testprotokoll — Pizza Tracker (M3)

Manuelles Testprotokoll zu den Qualitätsszenarien aus [A10](../arch/A10-quality-requirements.md).

Es werden nur tatsächlich durchgeführte Prüfungen als bestanden eingetragen. Nicht vollständig geprüfte Szenarien bleiben als „nicht durchgeführt“ gekennzeichnet.

## Testumgebung

| Feld | Angabe |
|---|---|
| Geprüfter Commit | `e568e4d` (Branch `docs/final-documentation`) |
| Datum | 24.–25.09.2026 |
| Durchgeführt von | Ugur Kökser |
| Betriebssystem | Windows 11 |
| Webserver | Apache 2.4.58 über XAMPP |
| PHP | 8.2.12 |
| Datenbank | MariaDB 10.4.32, lokale Testdatenbank `pizza_tracker` |
| Browser | Microsoft Edge und Google Chrome, jeweils aktuelle installierte Version; Edge-InPrivate für getrennte Sitzung |
| Testdaten | Lokale Testkonten, manuell erstellte Pizza-Konfigurationen und temporäre Testdaten; QS-07/QS-08 in separater Arbeitskopie `pizza-tracker-qs07` |

## Qualitätsszenarien aus A10

| ID | Prüfung | Erwartetes Ergebnis | Ist-Ergebnis | Status |
|---|---|---|---|---|
| QS-01 | Gleiche Auswahl zweimal speichern, ohne und mit wiederverwendbarem Gutschein | Beide Speichervorgänge liefern HTTP 201 und jeweils denselben berechneten Endpreis. | Identische Margherita-M-Konfigurationen wurden jeweils zweimal gespeichert. Ohne Gutschein betrug der Preis jeweils 7,50 €, mit `PIZZA10` jeweils 6,75 €. Die Datenbank enthielt getrennte Datensätze. | bestanden |
| QS-02 | Nutzer A versucht, Pizza von Nutzer B zu laden und zu löschen | Nutzer A sieht nur eigene Konfigurationen; der Löschversuch auf fremde Daten wird mit HTTP 404 abgewiesen. | Zwei Konten und getrennte Sitzungen verwendet. Nutzer A sah Bs Pizza mit ID 14 nicht. Fremder Löschversuch lieferte HTTP 404 und `success: false`; B behielt den Datensatz. Das Löschen einer eigenen Pizza lieferte HTTP 200 und `success: true`. | bestanden |
| QS-03 | Speichern mit eingeschleustem `preis: 0.01` | Der Server ignoriert den manipulierten Preis und speichert den aus den gewählten Optionen berechneten Preis. | POST mit `preis: 0.01` lieferte HTTP 201. Antwort und Datenbank enthielten für Datensatz 15 den serverseitig berechneten Preis 7,50 € und 855 kcal, nicht 0,01 €. | bestanden |
| QS-04 | Jede Auswahlkategorie ändern; nach aktivem Gutschein Auswahl ändern | Preis und Nährwerte aktualisieren sich nach jeder Änderung; ein aktiver Gutschein wird bei einer Auswahländerung zurückgesetzt. | Größe, Teig, Sauce, Käse, Beläge und Extras wurden einzeln verändert. Preis, kcal und Makronährwerte aktualisierten sich unmittelbar ohne sichtbaren Seitenreload. Eine Auswahländerung setzte den zuvor aktiven Gutschein zurück. | bestanden |
| QS-05 | `save_config`, `delete_config`, `load_configs` ohne Session und nach Logout | Jeder geschützte Endpunkt antwortet ohne gültige Sitzung mit HTTP 401. | Alle drei Endpunkte lieferten ohne Sitzung sowie erneut nach Logout HTTP 401 und `success: false`; es wurden keine Konfigurationsdaten verändert. | bestanden |
| QS-06 | Alle sechs Seiten bei 360 px und 1280 px in zwei Browsern | Alle Seiten bleiben in beiden Breiten und Browsern bedienbar; Inhalte überlappen nicht und zentrale Aktionen sind erreichbar. | Startseite, Registrierung, Login, Konfigurator, Meine Pizzen und Allergenseite wurden in Microsoft Edge und Google Chrome bei 360 px und 1280 px geprüft. Navigation, Formulare, Auswahl und Tabellen blieben erreichbar und bedienbar. Bei 360 px ergab die Messung `viewport: 360`, `scrollWidth: 360` und keinen horizontalen Seitenoverflow. | bestanden |
| QS-07 | Neue Option nur in `pizza_data.json` ergänzen | Die neue Option erscheint im Konfigurator und wird beim Speichern serverseitig akzeptiert. | In der separaten Arbeitskopie wurde ausschließlich in `pizza_data.json` das Extra `QS07-Testextra` ergänzt. Es erschien automatisch, erhöhte den Preis auf 8,73 € und die Kalorien auf 905 kcal und wurde mit HTTP 201 sowie der neuen Kennung gespeichert. | bestanden |
| QS-08 | Preis einer Option ändern und gleiche Auswahl erneut speichern | Die neue Konfiguration verwendet den geänderten Preis; bereits gespeicherte Konfigurationen bleiben unverändert. | In der separaten Arbeitskopie wurde der Preis des Testextras von 2,23 € auf 3,23 € geändert. Der alte Datensatz blieb bei 9,73 €, der neue Datensatz erhielt eine neue ID und kostete 10,73 €. | bestanden |
| QS-09 | Frische Installation nach README und INSTALL | Die Anwendung ist nach der dokumentierten Anleitung innerhalb der vorgesehenen 15 Minuten startklar; Registrierung, Login und Speichern funktionieren. | Datenbank neu aus `database/schema.sql` importiert. Registrierung, Login und Speichern funktionierten. | bestanden |
| QS-10 | Unbekannter, inaktiver und abgelaufener Gutscheincode | Alle drei Codes werden abgewiesen; es bleibt kein veralteter Rabatt aktiv. | `NICHTDA` lieferte HTTP 404, der temporär deaktivierte Code `SPARE20` HTTP 400 und der temporär abgelaufene Code `PIZZA10` HTTP 410; jeweils `success: false`. `STUDENT5` lieferte als positive Kontrolle HTTP 200. Nach einem ungültigen Code wurde der Preis wieder ohne vorherigen Rabatt angezeigt. Die Testwerte wurden anschließend zurückgesetzt. | bestanden |
| QS-11 | Registrierung sowie Login mit richtigem und falschem Passwort | Das Passwort wird nur als Hash gespeichert; das richtige Passwort wird akzeptiert und das falsche abgelehnt. | Registrierung erfolgreich. Passwort in `users.passwort` als bcrypt-Hash gespeichert. Falsches Passwort wurde abgelehnt, korrektes akzeptiert. | bestanden |
| QS-12 | Pizza mit Apostroph im Namen speichern und SQL-Aufrufe prüfen | Das Apostroph wird als Nutzwert behandelt; der Name wird unverändert gespeichert und geladen, ohne die SQL-Anweisung zu verändern. | `O'Connor Pizza` wurde unverändert gespeichert und geladen. Die SQL-Aufrufstellen verwenden vorbereitete Anweisungen, benannte Platzhalter und gebundene Werte über `execute()`; `PDO::ATTR_EMULATE_PREPARES` ist `false`. | bestanden |
| QS-13 | Registrierung direkt mit ungültiger E-Mail aufrufen | Die API antwortet mit HTTP 400 und legt keinen Benutzer an. | Direkter POST mit `email: "ungueltig"` lieferte HTTP 400 und `success: false`; die Datenbankabfrage ergab keinen Datensatz. Eine eindeutige gültige Kontrolladresse lieferte HTTP 201 und `success: true`. | bestanden |

## Zusätzliche Prüfungen aus A10, Abschnitt 10.4

| ID | Prüfung | Erwartetes Ergebnis | Ist-Ergebnis | Status |
|---|---|---|---|---|
| Z-01 | Vorlage Margherita (M) | 7,50 €, 855 kcal, 38 g Protein, 115 g Kohlenhydrate und 27 g Fett werden angezeigt. | 7,50 €, 855 kcal, 38 g Protein, 115 g Kohlenhydrate und 27 g Fett angezeigt. | bestanden |
| Z-02 | Margherita (M) mit `PIZZA10` | Der Preis sinkt um 10 % auf 6,75 €; Kalorien und Nährwerte bleiben unverändert. | 6,75 € angezeigt. Kalorien und Nährwerte blieben unverändert. | bestanden |
| Z-03 | M, Protein-Teig, Crème fraîche, Mozzarella, Salami und Knoblauch-Dip | 13,60 €, 1145 kcal, 74 g Protein, 42 g Kohlenhydrate und 76 g Fett sowie die passenden Kennzeichnungen werden angezeigt. | 13,60 €, 1145 kcal, 74 g Protein, 42 g Kohlenhydrate und 76 g Fett angezeigt. Kennzeichnungen High Protein, Low Carb und Leichtere Wahl vorhanden. | bestanden |
| Z-04 | Margherita (M) mit `STUDENT5`: Anzeige und gespeicherten Preis vergleichen | Die in A05 O-5 dokumentierte Rundungsabweichung zwischen Anzeige und Speicherung ist reproduzierbar. | Anzeige 7,13 €, gespeichert 7,12 €. Die bekannte Rundungsabweichung aus A05 O-5 wurde bestätigt. | bestanden |
| Z-05 | `WELCOME` verwenden, erneut versuchen, Konfiguration löschen und erneut versuchen | Die erste Verwendung gelingt, die zweite wird abgewiesen; nach dem Löschen der zugehörigen Konfiguration ist die in A11 R-03 dokumentierte Schwäche reproduzierbar. | Erste Verwendung erfolgreich, zweite Verwendung abgelehnt. Nach Löschen der gespeicherten WELCOME-Konfiguration war der Gutschein erneut verwendbar. Bekannte Grenze A11 R-03 bestätigt. Zusätzlich: Anzeige 6,38 €, gespeichert 6,37 € wegen Rundung. | bestanden |
| Z-06 | Nach aktivem Gutschein leeres Feld einlösen | Eine Eingabeaufforderung erscheint; zugleich wird geprüft, ob der zuvor aktive Rabatt bestehen bleibt. | Hinweis „Bitte einen Gutscheincode eingeben“ erschien, der vorherige Rabatt blieb jedoch aktiv. Bekannte Grenze bestätigt. | bestanden |
| Z-07 | Verhalten bei gestopptem MySQL | Der Fehlerfall wird ausgelöst und das tatsächliche Verhalten dokumentiert; ideal wäre eine verständliche Fehlermeldung statt eines dauerhaften Ladezustands. | Bei gestopptem MySQL blieb „Meine Pizzen“ bei „Pizzen werden geladen…“ stehen; eine verständliche Verbindungsmeldung erschien nicht. MySQL wurde anschließend neu gestartet und die Pizzen wurden wieder geladen. Login, Registrierung, Löschen und gestoppter Apache wurden in diesem Zusammenhang nicht zusätzlich geprüft. Bekannte Lücke A11 R-04 bestätigt. | bestanden |
| Z-08 | Vorhandene Links in Navigation und Fußzeile | Alle im geprüften Stand vorhandenen Links öffnen das richtige Ziel; nicht implementierte Seiten werden nicht als vorhanden bewertet. | Alle im geprüften Stand vorhandenen Links wurden geöffnet und funktionierten. Impressum und Datenschutz sind in diesem Code- und Dokumentationsstand nicht enthalten. | bestanden |

Bei Z-04 bis Z-07 bedeutet „bestanden“, dass der jeweils definierte Test vollständig durchgeführt und das dokumentierte Verhalten beziehungsweise die bekannte Einschränkung reproduziert wurde. Der Status behauptet nicht, dass die dabei festgestellte Einschränkung behoben ist.

## Durchführungsdetails der Qualitätsszenarien

### QS-01 – Wiederholbares Speichern

Eine Margherita in Größe M mit Normalteig, Tomatensauce und Mozzarella wurde zunächst zweimal ohne Gutschein gespeichert. Danach wurde dieselbe Auswahl zweimal mit dem wiederverwendbaren Gutschein `PIZZA10` gespeichert. In „Meine Pizzen“ und in der Tabelle `konfigurationen` wurden die getrennten Datensätze und ihre Preise verglichen: ohne Gutschein jeweils 7,50 €, mit Gutschein jeweils 6,75 €.

### QS-02 – Benutzerisolation

In zwei getrennten Browsersitzungen wurden Nutzer A und Nutzer B verwendet. Nutzer B speicherte die Testpizza mit der Konfigurations-ID 14; diese erschien nicht in der Liste von Nutzer A. Aus As Sitzung wurde die ID 14 direkt per POST an `api/delete_config.php` gesendet und mit HTTP 404 abgewiesen. Als positive Kontrolle löschte der jeweilige Eigentümer anschließend eine eigene Testpizza erfolgreich mit HTTP 200.

### QS-03 – Manipulierter Preis

Aus einer angemeldeten Sitzung wurde ein gültiger JSON-Speicherrequest für eine Margherita M direkt an `api/save_config.php` gesendet und um `"preis": 0.01` ergänzt. Die API antwortete mit HTTP 201, 7,50 € und 855 kcal. Anschließend wurde in `konfigurationen` kontrolliert, dass Datensatz 15 den serverseitig berechneten Preis 7,50 € und nicht den eingeschleusten Wert enthielt.

### QS-04 – Reaktive Berechnung

Im Konfigurator wurden Größe, Teig, Sauce, Käse, Belag und Extra nacheinander einzeln geändert. Nach jedem Schritt wurden Preis, Kalorien, Protein, Kohlenhydrate, Fett, Ballaststoffe und Zusammenfassung beobachtet; die Werte aktualisierten sich unmittelbar ohne vollständigen Seitenreload. Danach wurde ein Gutschein aktiviert und eine weitere Auswahl geändert, wodurch der Gutschein zurückgesetzt und der unrabattierte Preis wiederhergestellt wurde.

### QS-05 – Zugriff ohne Sitzung

`api/load_configs.php` wurde mit GET sowie `api/save_config.php` und `api/delete_config.php` mit POST und ansonsten gültigen Testdaten aufgerufen. Die Aufrufe erfolgten zunächst ohne gültige Sitzung und wurden nach einem regulären Logout wiederholt. In beiden Zuständen lieferten alle drei Endpunkte HTTP 401 und `success: false`; eine anschließende Kontrolle zeigte keine angelegten oder gelöschten Konfigurationen.

### QS-06 – Responsive Darstellung

Startseite, Registrierung, Login, Konfigurator, Meine Pizzen und Allergenseite wurden in Microsoft Edge und Google Chrome jeweils bei 360 × 800 und 1280 × 800 CSS-Pixeln geöffnet. Navigation, Formulare, Auswahlkarten, Schaltflächen und Tabellen wurden visuell sowie durch Bedienung geprüft. Bei 360 Pixeln wurde zusätzlich `document.documentElement.scrollWidth` mit `clientWidth` verglichen; beide Werte betrugen 360, sodass kein horizontaler Seitenoverflow vorlag.

### QS-07 – Datengetriebene Erweiterung

Für diesen Test wurde die separate Arbeitskopie `pizza-tracker-qs07` verwendet. Ausschließlich in `data/pizza_data.json` wurde das vollständige Extra `QS07-Testextra` mit Preis 1,23 €, 50 kcal und den übrigen Nährwertfeldern ergänzt. Nach dem Neuladen erschien die Option ohne Änderungen an HTML, JavaScript oder PHP; sie ließ sich auswählen und mit einem Gesamtpreis von 8,73 € sowie 905 kcal speichern. Die JSON-Änderung wurde nicht in den Abgabestand übernommen.

### QS-08 – Änderung von Fachdaten

Ebenfalls in der separaten Arbeitskopie wurde zunächst eine Konfiguration mit dem Testextra zum Gesamtpreis von 9,73 € gespeichert. Danach wurde ausschließlich der Preis des Extras in `pizza_data.json` von 2,23 € auf 3,23 € geändert, die Seite neu geladen und dieselbe Auswahl erneut gespeichert. Die Liste enthielt danach den unveränderten alten Datensatz mit 9,73 € und einen neuen Datensatz mit 10,73 €; die Teständerung wurde nicht in den Abgabestand übernommen.

### QS-09 – Frische Installation

Die Datenbank wurde aus `database/schema.sql` neu angelegt und die dokumentierten Verbindungsparameter wurden verwendet. Apache und MySQL wurden über XAMPP gestartet und die Anwendung über HTTP geöffnet. Danach wurden Registrierung, Login, Konfiguration und Speichern erfolgreich ausgeführt.

### QS-10 – Gutscheinfehler

Für getrennte Fehlerfälle wurde `SPARE20` in der lokalen Testdatenbank vorübergehend deaktiviert und `PIZZA10` mit einem vergangenen Ablaufdatum versehen. Direkte Aufrufe von `api/coupon.php` ergaben für `NICHTDA` HTTP 404, für `SPARE20` HTTP 400, für `PIZZA10` HTTP 410 und für den gültigen Kontrollcode `STUDENT5` HTTP 200. Zusätzlich wurde nach einem aktiven Rabatt ein ungültiger Code eingegeben; die Oberfläche zeigte wieder 7,50 € ohne alten Rabatt. Abschließend wurden beide veränderten Gutscheine auf ihre ursprünglichen Werte zurückgesetzt.

### QS-11 – Passwortschutz

Ein ausschließlich für den Test verwendetes lokales Konto wurde registriert. In `users.passwort` wurde kontrolliert, dass ein bcrypt-Hash mit dem Präfix `$2y$10$` und kein Klartext gespeichert war. Der Login mit dem richtigen Passwort war erfolgreich, während das falsche Passwort abgewiesen wurde.

### QS-12 – Apostroph und Datenbankzugriff

Eine Pizza mit dem Namen `O'Connor Pizza` wurde gespeichert und anschließend mit unverändertem Namen wieder geladen. Zusätzlich wurden die SQL-Aufrufstellen in den API-Dateien und in `config/helpers.php` durchsucht. Sie verwenden feste SQL-Strukturen, `prepare()`, benannte Platzhalter und gebundene Parameter über `execute()`; in `config/database.php` ist `PDO::ATTR_EMULATE_PREPARES` auf `false` gesetzt.

### QS-13 – Serverseitige E-Mail-Prüfung

Die Browservalidierung wurde umgangen, indem direkt ein POST-Request mit der E-Mail `ungueltig` an `api/register.php` gesendet wurde. Die API antwortete mit HTTP 400 und `success: false`; eine anschließende SQL-Abfrage in `users` lieferte keinen Datensatz. Als positive Kontrolle wurde eine eindeutige Adresse nach dem Muster `qs13.<Zeitstempel>@example.com` verwendet, deren Registrierung HTTP 201 und `success: true` ergab.

## Zusammenfassung

| Status | Anzahl |
|---|---:|
| bestanden | 21 |
| nicht bestanden | 0 |
| blockiert | 0 |
| nicht durchgeführt | 0 |

## Abweichungen und Beobachtungen

- `STUDENT5`: Der angezeigte Preis von 7,13 € wird als 7,12 € gespeichert. Die bekannte Rundungsabweichung aus A05 O-5 wurde reproduziert.
- `WELCOME`: Nach dem Löschen der Konfiguration, in der der Gutschein verwendet wurde, kann derselbe Nutzer den Gutschein erneut einsetzen. Die bekannte Grenze aus A11 R-03 wurde reproduziert.
- `WELCOME`: Beim getesteten Grundpreis von 7,50 € wurden 6,38 € angezeigt, aber 6,37 € gespeichert.
- Wird nach einem aktiven Gutschein ein leeres Gutscheinfeld eingelöst, erscheint eine Warnung, der bisherige Rabatt bleibt jedoch aktiv.
- Bei gestopptem MySQL bleibt die Seite „Meine Pizzen“ im Ladezustand, ohne eine verständliche Fehlermeldung anzuzeigen.
- Beim erneuten Bearbeiten einer gespeicherten Pizza werden die Zutaten wiederhergestellt, ein zuvor verwendeter Gutschein jedoch nicht erneut aktiviert. Dieses Verhalten ist in A04, A05 und A11 dokumentiert.
- QS-07 und QS-08 wurden ausschließlich in der separaten Arbeitskopie `pizza-tracker-qs07` durchgeführt. Die dortigen JSON-Änderungen gehören nicht zum Abgabestand und dürfen nicht ins Repository übernommen werden.
- QS-10 veränderte Gutscheindaten nur temporär in der lokalen Testdatenbank; `SPARE20` und `PIZZA10` wurden anschließend auf ihre ursprünglichen Werte zurückgesetzt.
