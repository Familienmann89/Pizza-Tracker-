# A10 – Qualitätsanforderungen

Dieses Kapitel konkretisiert die Qualitätsziele aus [Kapitel 1.2](01-einfuehrung-ziele.md#12-qualitätsziele) und die nichtfunktionalen Anforderungen aus [N1](../spec/N1-nichtfunktional.md). Die Anforderungen werden durch überprüfbare Nutzungsszenarien und Änderungsszenarien beschrieben. Da der geprüfte Projektstand keine automatisierten Tests enthält, sind die Kriterien so formuliert, dass sie mit Browser, Entwicklerwerkzeugen, HTTP-Aufrufen und Datenbankabfragen manuell geprüft werden können.

Die Prioritäten bedeuten:

- **A — architekturprägend:** Ein Verfehlen widerspricht einem zentralen Qualitätsziel oder einer wesentlichen Architekturentscheidung.
- **B — verbindlich:** Die Anforderung ist für den Projektumfang relevant, kann aber lokal und ohne grundlegenden Architekturwechsel erfüllt werden.
- **C — wünschenswert:** Die Anforderung verbessert die Anwendung, ist für den vereinbarten Projektumfang jedoch nicht zwingend.

---

## 10.1 Qualitätsbaum

Die Tabelle gliedert die Qualitätsziele in konkrete Anforderungen. Die Spalte zur Realisierung nennt vorhandene Mechanismen und geplante Prüfungen, keine bereits bestandenen Tests.

| Qualitätsaspekt | Konkretisierte Anforderung | Priorität | Bezug zu Kapitel 1 / Spezifikation | Realisierung und Nachweis |
|---|---|---:|---|---|
| **Funktionale Korrektheit** | Eine identische Pizza-Konfiguration ergibt bei unveränderten Fachdaten und identischem, weiterhin gültigem Rabatt denselben serverseitig berechneten Endpreis. | A | Qualitätsziel 2; UC01–UC04 | Serverseitige Neuberechnung aus `pizza_data.json` gemäß [§ 8.9](A08-cross-cutting-concepts.md#89-preis--und-kalorienberechnung); QS-01 und QS-03 |
| **Sicherheit** | Nutzer können nur ihre eigenen gespeicherten Konfigurationen laden und löschen. | A | Qualitätsziel 1; NFA05 für den Anmeldeschutz, UC09/UC10 für die Nutzerzuordnung | Sessionprüfung und Eigentumsbedingung gemäß [§ 8.6](A08-cross-cutting-concepts.md#86-autorisierung); QS-02 und QS-05 |
| **Sicherheit** | Passwörter werden ausschließlich als Hash gespeichert. | A | Qualitätsziel 1; NFA02 | `password_hash()` und `password_verify()` gemäß [§ 8.7](A08-cross-cutting-concepts.md#87-passwortschutz); QS-11 |
| **Sicherheit** | Datenbankeingaben werden über vorbereitete SQL-Anweisungen verarbeitet. | A | Qualitätsziel 1; NFA03 | PDO mit deaktivierter Emulation und Prepared Statements gemäß [§ 8.8](A08-cross-cutting-concepts.md#88-datenbankzugriff); QS-12 |
| **Sicherheit** | E-Mail-Adressen mit ungültigem Format werden serverseitig abgelehnt. | B | Qualitätsziel 1; NFA04 | Prüfung in `api/register.php`; QS-13 |
| **Benutzbarkeit** | Preis, Kalorien und Nährwerte werden unmittelbar nach einer Änderung der Auswahl aktualisiert. | B | Qualitätsziele 3 und 4; UC01–UC03 | Clientseitige Berechnung und DOM-Aktualisierung; QS-04 |
| **Performance** | Die Neuberechnung im Konfigurator erfolgt ohne vollständigen Seitenreload. | B | Qualitätsziel 4; NFA01 | Lokale Browserberechnung gemäß [§ 8.9](A08-cross-cutting-concepts.md#89-preis--und-kalorienberechnung); QS-04. Kein vollständiger Nachweis der Seitenladezeit aus NFA01 |
| **Wartbarkeit** | Optionen innerhalb bestehender Kategorien werden zentral in `data/pizza_data.json` gepflegt. | B | Ergänzende Architekturanforderung; [ADR 9.5](A09-architecture-decisions.md#95-einsatz-von-pizza_datajson-als-zentrale-fachdatenquelle) | Browser und Backend lesen dieselbe Fachdatenquelle gemäß [§ 8.2](A08-cross-cutting-concepts.md#82-zentrale-fachdaten--pizza_datajson); QS-07 und QS-08 |
| **Kompatibilität** | Die Anwendung ist in aktuellen Desktop-Browsern und bei typischen mobilen sowie Desktop-Breiten bedienbar. | B | Qualitätsziele 3 und 5; NFA06 und NFA07 | Bootstrap und eigenes responsives CSS gemäß [§ 8.11](A08-cross-cutting-concepts.md#811-responsive-benutzeroberfläche); QS-06 |
| **Betreibbarkeit** | Die Anwendung kann anhand der mitgelieferten Anleitung in einer lokalen XAMPP- oder MAMP-Umgebung eingerichtet werden. | B | Qualitätsziel 6; NFA08 | Installationsschritte in `README.md` und `INSTALL.md` sowie [§ 7.3](A07-deployment-view.md#73-inbetriebnahme); QS-09 |
| **Fehlertransparenz** | Ungültige oder abgelaufene Gutscheine werden abgelehnt und dem Nutzer verständlich gemeldet. | B | Funktionale Korrektheit; N2 „Fehlerbehandlung“ | Gemeinsame JSON-Fehlerantworten und Statuscodes; QS-10 |

Die Klassen A, B und C sind Prioritäten innerhalb des Projekts, keine Bewertungsnoten. In dieser Tabelle sind nur Anforderungen der Klassen A und B festgelegt.

### Bewusst nicht vertiefte Qualitätsaspekte

- **Skalierbarkeit und Hochverfügbarkeit:** Die Anwendung ist für einen lokalen Lehrbetrieb auf einem einzelnen Rechner vorgesehen. Lastverteilung, Failover und Mehrserverbetrieb liegen außerhalb des Projektumfangs.
- **Internationalisierung:** Die Benutzerschnittstelle ist ausschließlich deutschsprachig. Eine mehrsprachige Oberfläche ist nicht Teil der M3-Version.
- **Produktiver Internetbetrieb:** TLS-Terminierung, öffentliches Hosting und produktive Serverhärtung sind nicht vorgesehen, weil die Anwendung lokal über XAMPP beziehungsweise MAMP betrieben wird.
- **Vollständige Barrierefreiheit:** Semantische HTML-Elemente und Beschriftungen werden verwendet, ein formaler Test nach WCAG ist jedoch nicht Bestandteil des Projekts. Deshalb wird keine vollständige Barrierefreiheit zugesichert.

Diese Abgrenzungen heben die grundlegenden Sicherheitsanforderungen an gespeicherte Passwörter, Eingabevalidierung und Autorisierung nicht auf.

---

## 10.2 Qualitätsszenarien

**U** bezeichnet ein Nutzungsszenario, **Ä** ein Änderungsszenario. Die Tabelle formuliert Soll-Kriterien. Die Durchführung und das tatsächliche Ergebnis werden in einem manuellen Testprotokoll mit Datum, Umgebung, geprüftem Commit, Testdaten, erwartetem Ergebnis, Ist-Ergebnis und Status festgehalten. Mögliche Statuswerte sind „bestanden“, „nicht bestanden“, „blockiert“ und „nicht durchgeführt“.

**Testbedingungen:** Ausschließlich lokale Testkonten und eine separate Testdatenbank verwenden. Für QS-02 sind zwei getrennte Nutzer-Sessions erforderlich, beispielsweise in unterschiedlichen Browserprofilen. QS-07 und QS-08 erfolgen in einer separaten Arbeitskopie; Änderungen an Fachdaten und Testgutscheinen werden protokolliert und nicht versehentlich als Produktänderungen übernommen. Ein Test eines veränderten Stands muss zusätzlich zum Ausgangscommit die Änderung nennen.

| ID | Art | Kontext und Auslöser | Erwartete Reaktion | Prüfbares Kriterium |
|---|:---:|---|---|---|
| **QS-01** | U | Dieselbe gültige Auswahl wird zweimal bei unveränderten Fachdaten gespeichert, zunächst ohne Gutschein und separat mit einem unveränderten, wiederverwendbaren gültigen Gutschein. WELCOME ist für diese Wiederholung ausgeschlossen. | Beide Speichervorgänge eines Testpaars verwenden denselben Endpreis. | Beide Aufrufe liefern HTTP 201. Die zugehörigen Zeilen in `konfigurationen.preis` und die zurückgegebenen Preise stimmen pro Testpaar überein. Unterschiedliche IDs und Zeitpunkte sind zulässig. |
| **QS-02** | U | Nutzer A und B besitzen jeweils eine gespeicherte Pizza. A lädt seine Liste und sendet anschließend die ID von Bs Pizza an den Löschendpunkt. | A sieht nur eigene Datensätze und kann Bs Pizza nicht löschen. | `GET api/load_configs.php` unter As Session enthält keine Konfiguration von B. `POST api/delete_config.php` mit Bs ID liefert HTTP 404 und `success: false`. Bs Datensatz ist anschließend unverändert vorhanden. Ein positiver Kontrolltest bestätigt, dass A eine eigene Testpizza löschen kann. |
| **QS-03** | U | Ein gültiger Speicherrequest wird um `preis: 0.01` ergänzt. Auswahl und gültiger Rabatt sind vorab festgelegt. | Der Server ignoriert den eingeschleusten Preis und berechnet selbst. | Erwarteten Preis unabhängig anhand der JSON-Einzelpreise berechnen: Summe auf Cent runden, Rabattbetrag auf Cent runden, nicht negativen Endpreis auf Cent runden. HTTP 201, Antwortpreis und gespeicherter Preis entsprechen diesem Sollwert, nicht 0,01 Euro. Die gewählte Testpizza muss dafür einen anderen regulären Endpreis haben. |
| **QS-04** | U | Nach vollständigem Laden der Fachdaten wird jede Auswahlkategorie einzeln verändert; zusätzlich wird nach aktiviertem Gutschein eine Auswahl geändert. | Werte und Darstellung werden passend zur Auswahl aktualisiert; der zuvor aktive Gutschein wird zurückgesetzt. | Preis, kcal und Makronährwerte anhand der ausgewählten JSON-Einträge unabhängig nachrechnen und mit den formatierten Anzeigen vergleichen. Kein neuer Dokument- oder API-Request durch die Auswahländerung; statische Bildabrufe sind zulässig. Zusammenfassung und Größenanzeige passen; ein Beispielbild ist nicht als exakte Zutatenabbildung zu bewerten. Reaktionsdauer beziehungsweise wahrnehmbare Verzögerungen protokollieren. |
| **QS-05** | U | Ohne gültige Session werden `save_config.php` und `delete_config.php` mit POST und ansonsten gültigen JSON-Daten sowie `load_configs.php` mit GET aufgerufen. Nach einem erfolgreichen Logout wird dies wiederholt. | Alle geschützten Aktionen werden serverseitig abgewiesen. | Jeder Aufruf liefert HTTP 401 mit `success: false`. Es werden keine Konfigurationsdaten zurückgegeben und keine Zeilen angelegt oder gelöscht. Cookie beziehungsweise Sessionzustand und korrekte HTTP-Methode im Test festhalten. |
| **QS-06** | U | Startseite, Registrierung, Login, Konfigurator, Meine Pizzen und Allergenseite werden bei 360 und 1280 CSS-Pixeln Breite in mindestens zwei gängigen Browsern geprüft, beispielsweise Firefox und Chrome oder Edge. | Navigation, Formulare, Auswahl und Tabellen bleiben erreichbar und bedienbar. | Kein horizontales Scrollen auf Seitenebene, keine überdeckten Texte oder Bedienelemente. Tabellen dürfen innerhalb ihres Containers scrollen. Login, Konfiguration und Speichern zusätzlich funktional prüfen. Browsername/-version, Betriebssystem, Viewport-Höhe und -Breite sowie CDN-Verfügbarkeit protokollieren. Emulation nicht als Test auf einem echten Mobilgerät ausgeben. |
| **QS-07** | Ä | In einer separaten Arbeitskopie wird eine neue Option innerhalb einer vorhandenen Kategorie mit eindeutiger Kennung und vollständigen Feldern nach bestehendem Muster ergänzt. Danach wird der Konfigurator neu geladen. | Die Option erscheint ohne zusätzliche HTML-, JavaScript- oder PHP-Änderung und wird serverseitig akzeptiert. | Nur `data/pizza_data.json` ist geändert. Die Option ist auswählbar, ihre Preis- und Nährwertbeiträge erscheinen korrekt; Speichern liefert HTTP 201 und enthält die neue Optionskennung im Datensatz. Der Server prüft Preis und kcal, nicht die Makronährwerte. Eine eigene Foto-Vorschau ist nicht Teil dieses Kriteriums. |
| **QS-08** | Ä | Eine Pizza wird ohne Gutschein gespeichert. Danach wird in einer separaten Arbeitskopie der Preis einer enthaltenen Option geändert und der Browser neu geladen. Dieselbe Auswahl wird erneut gespeichert. | Die neue Zeile verwendet den neuen Preis; die alte Zeile bleibt unverändert. | Alten Datensatz anhand seiner ID prüfen. Sein `preis` bleibt gleich; ein neuer Datensatz mit neuer ID entspricht dem unabhängig berechneten geänderten Preis. Es wird kein UPDATE und keine historische Speicherung der Nährwerte vorausgesetzt. |
| **QS-09** | Ä | Eine Person richtet eine frische Projektkopie mithilfe von README und INSTALL ein. Eine kompatible XAMPP-/MAMP-Umgebung mit PHP ab 8.1, PDO-MySQL und mbstring ist bereits installiert; CDN-Zugriff ist verfügbar. | Die Anwendung lässt sich ohne Änderungen der Fachlogik lokal starten und benutzen. | Ab Beginn der Projektinstallation bis zu erfolgreicher Registrierung, Login und Speicherung einer Pizza werden höchstens 15 Minuten angestrebt. Projekt in ein Unterverzeichnis des DocumentRoot kopieren, Dienste starten, Schema in eine separate Testdatenbank importieren, nötige Verbindungsparameter setzen und Startseite über HTTP öffnen. Dauer, Konfigurationsschritte und Rückfragen protokollieren; Systeminstallation und Downloads sind nicht Teil dieser Messung. |
| **QS-10** | U | In der Testdatenbank werden getrennte Testfälle für unbekannten, inaktiven und abgelaufenen Code vorbereitet. Bei jedem Fehlerfall wird auch ein zuvor aktiver gültiger Gutschein berücksichtigt. | Ein fehlerhafter Gutschein wird abgelehnt; ein vorheriger Rabatt bleibt nicht unbemerkt aktiv. | Unbekannt: HTTP 404; inaktiv: HTTP 400; abgelaufen und aktiv: HTTP 410. Jeweils `success: false`, verständliche Meldung, `activeCoupon` null und Preis ohne Rabatt. Die Fälle getrennt anlegen, da die API Aktivierung vor Ablauf prüft. Ein gültiger Kontrollcode aktiviert den erwarteten Rabatt. |
| **QS-11** | U | Ein lokales Testkonto wird mit einem ausschließlich für diesen Test verwendeten Passwort registriert. Anschließend erfolgen Login mit richtigem und falschem Passwort. | Das Passwort wird als Hash gespeichert; nur die korrekten Zugangsdaten werden akzeptiert. | `users.passwort` enthält keinen Klartext. Codeprüfung bestätigt `password_hash(..., PASSWORD_BCRYPT)` und `password_verify()`. Richtiger Login liefert HTTP 200, falscher HTTP 401. Kein Passwort oder Hash in Sessionstatus- oder Loginantwort. Keine realen Zugangsdaten im Protokoll festhalten. |
| **QS-12** | U | Die SQL-Aufrufe des geprüften Commits werden durchgesehen. Ergänzend wird eine gültige Pizza unter einem Testnamen mit Apostroph gespeichert und erneut geladen. | Eingabewerte werden als Daten, nicht als SQL-Befehl verarbeitet. | Codeprüfung dokumentiert alle Aufrufstellen: SQL-Struktur fest, Eingabewerte über Platzhalter und `execute()` gebunden; PDO-Emulation deaktiviert. Testname wird unverändert gespeichert und geladen. Dieser Kontrolltest allein beweist keine vollständige Sicherheit gegen schädliche Eingaben. |
| **QS-13** | U | Direkt an `api/register.php` wird eine sonst gültige Registrierung mit der ungültigen E-Mail `ungueltig` gesendet. Dadurch wird die Browservalidierung bewusst umgangen. | Auch der Server lehnt das ungültige Format ab. | HTTP 400 mit `success: false`; kein entsprechender Nutzerdatensatz. Ein separates Testkonto mit gültigem E-Mail-Format und vollständigen Daten dient als positiver Kontrollfall und liefert HTTP 201. |

---

## 10.3 Rückverfolgbarkeit

Die Szenarien decken die Qualitätsziele aus Kapitel 1 wie folgt ab:

- **Funktionale Korrektheit:** QS-01, QS-03, QS-08 und QS-10
- **Sicherheit:** QS-02, QS-03, QS-05 und QS-11 bis QS-13
- **Benutzbarkeit:** QS-04 und QS-06
- **Performance:** QS-04 prüft lokale Aktualisierung, aber nicht vollständig die Seitenladezeiten aus NFA01
- **Wartbarkeit der Fachdaten:** QS-07 und QS-08
- **Kompatibilität:** QS-06
- **Betreibbarkeit:** QS-09

Die Szenarien QS-03 und QS-08 prüfen außerdem Auswirkungen der in [ADR 9.5](A09-architecture-decisions.md#95-einsatz-von-pizza_datajson-als-zentrale-fachdatenquelle) beschriebenen Entscheidung, dieselbe Fachdatenquelle für Browser und Backend zu verwenden. Erst dokumentierte Ist-Ergebnisse liefern einen praktischen Nachweis. QS-02 und QS-05 konkretisieren die in [§ 8.5](A08-cross-cutting-concepts.md#85-authentifizierung-und-session) und [§ 8.6](A08-cross-cutting-concepts.md#86-autorisierung) dokumentierte Trennung zwischen sichtbarer Benutzeroberfläche und serverseitiger Zugriffskontrolle.

---

## 10.4 Nachweisgrenzen und bekannte Abweichungen

Die Szenarien definieren überprüfbare Anforderungen, ersetzen aber kein ausgefülltes Testprotokoll. Insbesondere Aussagen zur Browserkompatibilität, Darstellung bei 360 beziehungsweise 1280 Pixeln und Einrichtungsdauer auf einem fremden Rechner gelten erst nach dokumentierter Durchführung als nachgewiesen. Bis dahin handelt es sich um verbindliche Abnahmekriterien für den finalen M3-Stand.


Die vorhandene Implementierung weist bekannte Grenzen auf, die nicht durch abgeschwächte Testergebnisse verdeckt werden dürfen:

- **Rundung:** QS-01 prüft Wiederholbarkeit auf dem Server, nicht die Gleichheit von Browser- und Serverpreis. Diese Werte zusätzlich mit Rabatt vergleichen und Abweichungen protokollieren; siehe A06/A08.
- **WELCOME:** QS-10 ersetzt keinen Test der Einmalregel. Separat prüfen: erstmalig verwenden, erneut versuchen und anschließend in der isolierten Testdatenbank die zugehörige Konfiguration löschen und erneut versuchen. Die derzeitige Prüfung ist an vorhandene Konfigurationen gebunden und garantiert keine dauerhafte Einmaligkeit.
- **Leeres Gutscheinfeld:** Nach einem aktivierten Gutschein ein leeres Feld prüfen. Ein alter Rabatt kann in diesem Zweig aktiv bleiben; das Ergebnis als eigenen Fehlerfall festhalten.
- **Fehlerbehandlung:** Erreichbare API-Fehlermeldungen belegen noch keine Behandlung von Verbindungsabbrüchen. Netzwerkfehler zusätzlich prüfen; bekannte Lücken bei Login, Registrierung, Laden, Löschen und Logout bleiben offen, bis sie behoben und nachgetestet sind.
- **Performance:** Ohne festgelegtes Messverfahren und Zeitbudget bleibt „ohne spürbare Verzögerung“ aus NFA01 ungenau. Gemessene Lade- und Reaktionszeiten dokumentieren; QS-04 allein rechtfertigt keine vollständige Erfüllungsbehauptung.
- **Sicherheit:** QS-11 bis QS-13 prüfen konkrete Schutzmaßnahmen, keinen vollständigen Sicherheitstest oder eine Freigabe für öffentlichen Betrieb.

Die 15 Minuten für QS-09 sind ein projektspezifisches Ziel, keine hier nachgewiesene Vorgabe des Prüfers. Wird es verfehlt, wird die Überschreitung mit Ursache dokumentiert. Der Status einer Anforderung wird nicht allein durch eine Quellcodeprüfung auf „bestanden“ gesetzt.

Nach Durchführung wird hier auf das tatsächlich angelegte Testprotokoll verwiesen. Nicht durchgeführte, blockierte oder fehlgeschlagene Prüfungen bleiben ausdrücklich erkennbar.
