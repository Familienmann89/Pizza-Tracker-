# A11 – Risiken und technische Schulden

Dieses Kapitel dokumentiert Risiken und technische Schulden des vorliegenden Projektstands auf dem Weg zur M3-Abgabe. Es basiert auf der Sichtung des Repositorys und ergänzt die Qualitätsanforderungen aus [Kapitel 10](A10-quality-requirements.md). Aufgenommen werden nur Punkte, die sich aus dem vorhandenen Code, der Datenbankstruktur oder der Dokumentation ableiten lassen.

Ein **Risiko** beschreibt ein mögliches Ereignis mit negativer Auswirkung. Eine **technische Schuld** besteht bereits und verursacht bei Änderungen oder im Betrieb zusätzlichen Aufwand. Bewusst akzeptierte Projektgrenzen werden in Abschnitt 11.4 ausdrücklich von Mängeln abgegrenzt.

Die Einschätzung bezieht sich auf eine lokal betriebene Hochschulanwendung:

- **Eintrittswahrscheinlichkeit:** niedrig = nur in besonderen Situationen; mittel = bei einem realistischen Ablauf oder einer typischen Umgebung; hoch = im normalen Ablauf regelmäßig zu erwarten.
- **Schadenshöhe:** niedrig = kleine Einschränkung ohne Auswirkung auf Kernfunktionen; mittel = sichtbarer Fehler, falsche Daten oder zusätzlicher manueller Aufwand; hoch = Kernfunktion, Sicherheit oder Vorführung wird wesentlich beeinträchtigt.

Die Einordnung ist eine qualitative Bewertung und kein statistisch berechneter Wert. „Offen“ bedeutet, dass im geprüften Code keine Behebung vorliegt. Die genannten Gegenmaßnahmen sind Vorschläge, keine bereits umgesetzten Änderungen oder zugesagten Erweiterungen. Eine Risikoakzeptanz ist eine bewusste Teamentscheidung; sie macht eine verletzte Anforderung nicht nachträglich erfüllt.

## 11.1 Bestätigte Risiken

| ID | Risiko und Beleg | Auslöser und Auswirkung | Wahrscheinlichkeit | Schaden | Gegenmaßnahme und Status |
|---|---|---|---|---|---|
| R-01 | **Abhängigkeit vom Bootstrap-CDN.** Alle sechs HTML-Seiten laden Bootstrap 5.3.3 von `cdn.jsdelivr.net`. | Ohne Internetzugang oder bei einer CDN-Störung können bei leerem Browsercache Bootstrap-CSS und Bootstrap-JavaScript fehlen. Dadurch kann die Anwendung bei einer Vorführung deutlich anders oder fehlerhaft erscheinen. | mittel | hoch | Internet- und CDN-Verfügbarkeit als Betriebsabhängigkeit dokumentieren und den Präsentationsrechner prüfen. Wenn ein netzunabhängiger Betrieb benötigt wird, Bootstrap lokal bereitstellen und Verweise anpassen; diese Codeänderung ist noch nicht umgesetzt. **Status: offen.** |
| R-02 | **Unterschiedliche Rundung im Browser und im Backend.** `js/konfigurator.js` zieht den prozentualen Rabatt ohne vorherige Cent-Rundung ab; `config/helpers.php` rundet zuerst den Rabatt und danach den Endpreis. | Bei bestimmten Beträgen zeigt der Browser einen anderen Endpreis als der Server speichert. Dies verletzt die erwartete Übereinstimmung von Anzeige und Speicherung. QS-01 prüft dagegen nur serverseitige Wiederholbarkeit und QS-03 die Abwehr eines manipulierten Preises; beide Tests allein würden diese Abweichung nicht ausschließen. | mittel | mittel | Eine verbindliche Rundungsregel festlegen und in beiden Implementierungen identisch anwenden. Geeignet ist die serverseitige Regel: Rabatt auf Cent runden, anschließend Endpreis auf Cent runden. Danach vollständige gültige Konfigurationen mit und ohne Rabatt sowie Cent-Grenzfälle nachtesten; automatisierte Regressionstests wären eine spätere Ergänzung. **Status: offen.** |
| R-03 | **`WELCOME` kann nach dem Löschen der zugehörigen Pizza erneut verwendet werden.** `validateCoupon()` erkennt die bisherige Nutzung nur über einen vorhandenen Datensatz in `konfigurationen`. | Löscht der Nutzer die Konfiguration, verschwindet zugleich der einzige Nutzungsnachweis. Der Gutschein kann dann entgegen der dokumentierten Regel „einmal pro Nutzer“ erneut eingelöst werden. | mittel | mittel | Eine mögliche Behebung ist eine separate Einlösetabelle mit eindeutiger Kombination aus `user_id` und `gutschein_code`. Einlösen und Speichern müssten dabei gemeinsam abgesichert werden; das Löschen einer Pizza darf den Nachweis nicht entfernen. Dies erfordert Backend- und Schemaänderungen und ist nicht Teil der bisherigen Dokumentationskorrektur. **Status: offen.** |
| R-04 | **Nicht abgefangene Serverfehler können das JSON-Protokoll verlassen.** Erwartete Fehler werden zwar mit `jsonResponse()` beantwortet, es gibt aber keinen zentralen Exception-Handler. Zudem besitzen nicht alle `fetch()`-Aufrufe eine vollständige Fehlerbehandlung. | Ein Datenbank-, Datei- oder Laufzeitfehler kann statt JSON eine leere oder HTML-basierte HTTP-500-Antwort erzeugen. Das Frontend zeigt dann nur eine allgemeine Meldung oder reagiert bei einzelnen Abläufen gar nicht verständlich. | niedrig bis mittel | mittel | API-Einstiegspunkte zentral mit `try/catch` absichern, intern protokollieren und nach außen immer eine definierte JSON-Fehlerantwort liefern. Im Frontend `response.ok`, Inhaltstyp und JSON-Parsing einheitlich behandeln. **Status: offen.** |
| R-05 | **Dokumentierte Seiten fehlen im Repository.** `README.md` verlinkt `datenschutz.html`; `INSTALL.md` und die Dialogspezifikation nennen zusätzlich ein Impressum. Beide HTML-Dateien fehlen im geprüften Stand. | Prüfer oder Nutzer folgen den Dokumentationsverweisen und finden die beschriebenen Seiten nicht. Der bereits entfernte Footer-Link behebt die verbliebenen Dokumentationsverweise nicht. Dadurch entsteht ein sichtbarer Widerspruch zwischen Dokumentation und Anwendung. | hoch | niedrig bis mittel | Entweder `datenschutz.html` und `impressum.html` mit zum Projekt passenden Hinweisen ergänzen oder sämtliche nicht vorgesehenen Verweise konsistent entfernen. Anschließend alle internen Links prüfen. **Status: offen.** |
| R-06 | **Ein aktiver Gutschein bleibt bei leerer erneuter Eingabe erhalten.** `validateCoupon()` in `js/konfigurator.js` zeigt bei leerem Feld eine Warnung und kehrt zurück, bevor `activeCoupon` zurückgesetzt wird. | Nach einem gültigen Gutschein leert der Nutzer das Feld und klickt erneut auf Einlösen. Der vorherige Rabatt kann trotz leerem Feld beim nächsten Speichern verwendet werden. | mittel | mittel | Gewünschtes Verhalten eindeutig festlegen; beim Verwerfen des Codes auch aktiven Gutschein und Anzeige zurücksetzen. Den Wechsel „gültig → leer“ gesondert prüfen. **Status: offen.** |

### Priorisierung der Risiken

Zuerst müssen Installation und zentrale Abläufe reproduzierbar geprüft werden. R-02, R-03 und R-06 betreffen die fachliche Korrektheit und sind bereits für die Abnahme relevant, nicht erst für einen späteren produktiven Einsatz. R-01 kann die Vorführung beeinträchtigen; R-05 verursacht sichtbare Dokumentationswidersprüche. R-04 wird besonders bei Ausfällen von Datenbank, Dateien oder Verbindung wirksam.

Vor der Abgabe sind für diese Punkte Befund, Testergebnis und Teamentscheidung festzuhalten. Bei einer Behebung folgt ein Nachtest. Bleibt ein Fehler offen, wird er ausdrücklich dokumentiert; mögliche Auswirkungen auf die Bewertung entfallen dadurch nicht.

## 11.2 Technische Schulden

| ID | Bestehende technische Schuld | Auswirkung | Empfohlener Tilgungsweg | Priorität |
|---|---|---|---|---|
| S-01 | **Keine automatisierten Tests.** Im geprüften Repository sind keine automatisierten Tests enthalten; ein ausgefülltes Protokoll der manuellen Tests liegt in diesem Stand ebenfalls nicht vor. | Änderungen an Preisberechnung, Gutscheinen oder Autorisierung können unbemerkt Regressionen verursachen. Das vollständige erneute Prüfen kostet Zeit und ist fehleranfällig. | Für die Abnahme zuerst die manuellen Szenarien aus Kapitel 10 durchführen und Ergebnisse festhalten. Danach bieten sich automatisierte Tests für Preisberechnung an. Gutscheinprüfung benötigt Datenbank-Testdaten und gegebenenfalls Entkopplung der HTTP-Antwortlogik; dafür sind Integrationstests sinnvoll. Automatisierte Tests werden hier nicht als zusätzliche Vorgabe des Prüfers behauptet. | hoch |
| S-02 | **„Erneut bearbeiten“ besitzt keinen UPDATE-Ablauf.** Die Auswahl wird über `sessionStorage` in den Konfigurator übertragen; `api/save_config.php` führt beim Speichern jedoch immer ein `INSERT` aus. | Nach einer Bearbeitung bleibt der alte Datensatz bestehen und zusätzlich entsteht eine neue Konfiguration. Der frühere Gutschein wird nicht als aktiver Rabatt wiederhergestellt; die Anzeige nutzt aktuelle Fachdaten. Das kann als Duplikat oder als unerwartetes Verhalten wahrgenommen werden. | Wenn wirklich bearbeitet werden soll, Konfigurations-ID mitführen und einen autorisierten UPDATE-Endpunkt ergänzen. Wenn bewusst eine Kopie entstehen soll, die Aktion eindeutig als „Als neue Pizza verwenden“ beschriften und dokumentieren. | mittel |
| S-03 | **Beläge und Extras liegen als JSON in `konfigurationen`.** Die Struktur ist für das Laden einer vollständigen Pizza einfach, aber nur eingeschränkt relational auswertbar. | Abfragen wie „häufigster Belag“ oder spätere Änderungen einzelner Zutaten erfordern JSON-Funktionen oder zusätzliche Verarbeitung in PHP. | Bei wachsendem Analysebedarf Zwischentabellen wie `konfiguration_belag` und `konfiguration_extra` einführen. Für den aktuellen Projektumfang kann die bestehende Lösung beibehalten werden. | niedrig |
| S-04 | **Fehlerbehandlung ist über mehrere Stellen verteilt.** Erwartete API-Fehler verwenden gemeinsame Helfer, aber Exceptions und Frontend-Netzwerkfehler werden nicht durchgehend nach demselben Schema behandelt. | Fehlermeldungen sind je nach Seite unterschiedlich aussagekräftig. Neue Endpunkte können leicht ein abweichendes Antwortformat einführen. | Einen kleinen zentralen API-Wrapper für Fehler, Logging und JSON-Antworten einführen. Im Frontend eine gemeinsame Hilfsfunktion für API-Aufrufe verwenden. | mittel |
| S-05 | **Datenbankschema ohne versionierte Migrationen.** Die Einrichtung erfolgt über eine einzelne `database/schema.sql`. | Nach späteren Schemaänderungen fehlt ein definierter Aktualisierungspfad. Ein erneuter Import führt keine vollständige Migration aus und kann vorhandene Gutscheinwerte durch das Seed-Statement überschreiben. | Nummerierte, idempotente Migrationsdateien oder ein kleines Migrationstool einführen. Für den einmaligen lokalen Aufbau bleibt `schema.sql` ausreichend. | niedrig |
| S-06 | **Dokumentation und Implementierung können auseinanderlaufen.** Die Gutscheinregel, der Bearbeitungsablauf und die nicht vorhandenen Datenschutz-/Impressumsseiten zeigen bereits solche Abweichungen. | Prüfer und Teammitglieder können falsche Annahmen über das tatsächliche Verhalten treffen; spätere Änderungen werden an der falschen Stelle vorgenommen. | Vor jedem Release Spezifikation, Architekturdokumentation und Anwendung gemeinsam prüfen. Abweichungen entweder im Code beheben oder bewusst in der Dokumentation als Einschränkung festhalten. | hoch |
| S-07 | **Eingabelisten werden nur teilweise normalisiert.** `normalizeConfig()` behandelt nicht als Array gesendete Beläge und Extras als leere Listen; `assertChoices()` prüft vorhandene Kennungen, entfernt aber keine Wiederholungen. | Ein manipulierter Request kann dieselbe Zutat mehrfach in Preis und Kalorien einrechnen. Die Oberfläche bietet diese Mehrfachauswahl nicht entsprechend an. | Mengenmodell festlegen: Sind Zutaten nur einmal zulässig, doppelte Kennungen ablehnen oder eindeutig normalisieren. Unzulässige Datentypen ausdrücklich zurückweisen. Direkte API-Tests ergänzen. **Status: offen.** | mittel |

## 11.3 Bereits vorhandene Schutzmaßnahmen

Bei der Codeprüfung wurden auch Schutzmaßnahmen bestätigt. Sie werden hier genannt, damit behobene oder nicht vorhandene Probleme nicht fälschlich als offene Risiken erscheinen:

- Der reguläre Speicherrequest enthält keinen Preis. Ein zusätzlich eingeschleuster Preis wird nicht als verbindlicher Wert übernommen. `api/save_config.php` validiert die Auswahl und berechnet den Preis serverseitig aus `data/pizza_data.json` neu.
- Passwörter werden mit `password_hash()` gespeichert und mit `password_verify()` geprüft.
- Datenbankzugriffe verwenden PDO Prepared Statements; die Emulation vorbereiteter Anweisungen ist deaktiviert.
- Geschützte Endpunkte verlangen eine aktive Session. Laden und Löschen werden auf den angemeldeten Eigentümer begrenzt.
- Nach Anmeldung und Registrierung wird die Session-ID erneuert.
- Datenbankzugangsdaten können über Umgebungsvariablen gesetzt werden. Die Werte `root` und leeres Passwort sind lokale XAMPP-Fallbacks und keine im Repository veröffentlichten Produktionszugänge.

Gutscheinprüfung und Speichern besitzen im Browser bereits `try/catch/finally` und eine vorübergehende Schaltflächensperre. Die Behauptung, dort fehle jegliche Netzwerkfehlerbehandlung, wäre falsch. Die verbliebenen Lücken betreffen andere Abläufe und die zentrale Behandlung unerwarteter Serverfehler.

Diese Maßnahmen sind im Code vorhanden; ihre praktische Wirksamkeit ist mit den Prüfungen aus [Kapitel 10](A10-quality-requirements.md) zu kontrollieren.

## 11.4 Bewusst akzeptierte Projektgrenzen

Die folgenden Funktionen gehören nicht zum beschriebenen Projektumfang. Ihr Fehlen allein ist daher kein Implementierungsfehler. Das hebt Risiken der tatsächlich vorhandenen Funktionen nicht auf:

- **Kein produktiver Internetbetrieb:** Die Anwendung ist für eine lokale XAMPP- oder MAMP-Umgebung vorgesehen. TLS-Terminierung, öffentliches Hosting, Mehrserverbetrieb und Hochverfügbarkeit gehören daher nicht zum Projektziel; siehe [Kapitel 7](A07-deployment-view.md).
- **Keine echte Bestellung oder Zahlung:** Der Pizza Tracker speichert Konfigurationen, führt aber keine reale Bestellung, Zahlung oder Lieferung aus. Entsprechende Zahlungs- und Transaktionsrisiken liegen außerhalb des Anwendungsbereichs.
- **Keine horizontale Skalierung:** Für den lokalen Lehrbetrieb auf einem Rechner ist eine verteilte Architektur nicht erforderlich.
- **Kein Backend-Framework:** Die kleine PHP-Anwendung nutzt gemeinsame Helfer und klar getrennte Endpunkte. Ein Framework würde zusätzliche Komplexität erzeugen und ist für den aktuellen Umfang nicht zwingend; bei starkem Wachstum wäre diese Entscheidung neu zu bewerten.
- **Lokale Standardzugangsdaten:** `root` ohne Passwort ist ein Fallback für bestimmte lokale Entwicklungsumgebungen, keine universell passende oder automatisch sichere Konfiguration. Lokaler Projektbetrieb garantiert nicht, dass Apache oder Datenbank aus dem Netzwerk unerreichbar sind. Die konkrete Umgebung muss passend eingerichtet werden.

## 11.5 Maßnahmenplan

Die Reihenfolge dient der Bearbeitung und ersetzt nicht die Einstufung der fachlichen Bedeutung. Dokumentationskorrekturen können direkt übernommen werden. Vorgeschlagene Code- oder Schemaänderungen benötigen eine gesonderte Umsetzung und Prüfung.

| Reihenfolge | Maßnahme | Zugeordnete Punkte | Abschlusskriterium |
|---|---|---|---|
| 1 | Installation und zentrale Qualitätsszenarien auf einem festgehaltenen Commit prüfen | S-01; QS-01 bis QS-13 aus A10 | Protokoll mit Umgebung, Testdaten, Soll-/Ist-Ergebnis und Status; offene Fehler werden benannt. |
| 2 | Widersprüche in Dokumentation und Oberfläche abgleichen | R-05, S-02, S-06 | Dokumentierte Links existieren; Kopieren und tatsächliches Aktualisieren werden nicht verwechselt; noch offene Funktionsabweichungen sind sichtbar. |
| 3 | Fachliche Fehler zu Preis, Gutscheinen und Eingabelisten behandeln | R-02, R-03, R-06, S-07 | Nach einer Behebung stimmen Preiswerte überein, ein Einmalnachweis bleibt erhalten, leere Gutscheineingabe hat eindeutiges Verhalten und Listen entsprechen dem festgelegten Mengenmodell. Andernfalls bleibt der jeweilige Fehler offen dokumentiert. |
| 4 | Präsentationsumgebung absichern | R-01 | Mit dokumentierter CDN-Verbindung ist die Darstellung geprüft. Falls Offline-Betrieb benötigt wird: lokale Ressourcen bereitstellen und mit leerem Cache ohne Internet testen. |
| 5 | Fehlerbehandlung vervollständigen | R-04, S-04 | Nach Umsetzung liefern kontrolliert ausgelöste Serverfehler definierte Antworten; Netzwerk- und JSON-Fehler erhalten verständliches Benutzerfeedback. |
| 6 | Regressionstests und spätere Wartbarkeit verbessern | S-01, S-03, S-05 | Bei Weiterentwicklung priorisierte automatisierte Tests ergänzen; Migrationen oder Normalisierung nur bei entsprechendem Änderungsbedarf einführen. |

Für tatsächlich zugewiesene Maßnahmen werden Verantwortlicher und Status im Team festgehalten. Eine Personenzuordnung oder ein Fertigstellungstermin wird hier nicht ohne bestätigte Absprache erfunden.

## 11.6 Nachweisgrenze

Die Einträge dokumentieren den durch Code- und Dokumentensichtung festgestellten Stand. Sie ersetzen keine ausgefüllten Tests. Insbesondere Offline-Betrieb, Browserdarstellung, API-Fehlerfälle und Gutscheinabläufe gelten erst nach dokumentierter Durchführung der zugehörigen Szenarien als praktisch geprüft. Die Einträge bleiben nachvollziehbar erhalten. Eine Behebung erhält den zugehörigen Commit und einen Nachtest; eine bewusste Risikoakzeptanz erhält eine Begründung und gegebenenfalls eine vorläufige Maßnahme. Akzeptierte Restfehler gelten nicht als bestandene Qualitätsanforderungen.

Dieses Kapitel ist mit [A06](A06%20-%20Laufzeitsicht.md), [A08](A08-cross-cutting-concepts.md) und [A09](A09-architecture-decisions.md) abgestimmt zu halten. Die Bearbeitung dieses Dokuments allein verändert weder Code noch Datenbankschema.
