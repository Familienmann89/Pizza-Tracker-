# 11 Risiken und technische Schulden

Dieses Kapitel dokumentiert Risiken und technische Schulden des aktuellen M3-Stands. Es basiert auf der Sichtung des Repositorys und ergänzt die Qualitätsanforderungen aus [Kapitel 10](A10-quality-requirements.md). Aufgenommen werden nur Punkte, die sich aus dem vorhandenen Code, der Datenbankstruktur oder der Dokumentation ableiten lassen.

Ein **Risiko** beschreibt ein mögliches Ereignis mit negativer Auswirkung. Eine **technische Schuld** besteht bereits und verursacht bei Änderungen oder im Betrieb zusätzlichen Aufwand. Bewusst akzeptierte Projektgrenzen werden in Abschnitt 11.4 ausdrücklich von Mängeln abgegrenzt.

Die Einschätzung bezieht sich auf eine lokal betriebene Hochschulanwendung:

- **Eintrittswahrscheinlichkeit:** niedrig = nur in besonderen Situationen; mittel = bei einem realistischen Ablauf oder einer typischen Umgebung; hoch = im normalen Ablauf regelmäßig zu erwarten.
- **Schadenshöhe:** niedrig = kleine Einschränkung ohne Auswirkung auf Kernfunktionen; mittel = sichtbarer Fehler, falsche Daten oder zusätzlicher manueller Aufwand; hoch = Kernfunktion, Sicherheit oder Vorführung wird wesentlich beeinträchtigt.

Die Einordnung ist eine qualitative Bewertung und kein statistisch berechneter Wert.

## 11.1 Bestätigte Risiken

| ID | Risiko und Beleg | Auslöser und Auswirkung | Wahrscheinlichkeit | Schaden | Gegenmaßnahme und Status |
|---|---|---|---|---|---|
| R-01 | **Abhängigkeit vom Bootstrap-CDN.** Alle sechs HTML-Seiten laden Bootstrap 5.3.3 von `cdn.jsdelivr.net`. | Ohne Internetzugang oder bei einer CDN-Störung fehlen Bootstrap-CSS und teilweise Bootstrap-JavaScript. Dadurch kann die Anwendung bei einer Vorführung deutlich anders oder fehlerhaft erscheinen. | mittel | hoch | Bootstrap vor der Abgabe lokal in das Repository aufnehmen und die HTML-Verweise anpassen. Bis dahin Internetzugang und Seitenaufbau auf dem Präsentationsrechner testen. **Status: offen.** |
| R-02 | **Unterschiedliche Rundung im Browser und im Backend.** `js/konfigurator.js` zieht den prozentualen Rabatt ohne vorherige Cent-Rundung ab; `config/helpers.php` rundet zuerst den Rabatt und danach den Endpreis. | Bei bestimmten Beträgen zeigt der Browser einen anderen Endpreis als der Server speichert. Beispiel: 5,90 EUR mit `STUDENT5` ergibt im Browser 5,61 EUR, serverseitig aber 5,60 EUR. Das schwächt die funktionale Korrektheit aus QS-01 und QS-03. | mittel | mittel | Eine verbindliche Rundungsregel festlegen und in beiden Implementierungen identisch anwenden. Geeignet ist die serverseitige Regel: Rabatt auf Cent runden, anschließend Endpreis auf Cent runden. Danach Grenzfälle manuell und automatisiert prüfen. **Status: offen.** |
| R-03 | **`WELCOME` kann nach dem Löschen der zugehörigen Pizza erneut verwendet werden.** `validateCoupon()` erkennt die bisherige Nutzung nur über einen vorhandenen Datensatz in `konfigurationen`. | Löscht der Nutzer die Konfiguration, verschwindet zugleich der einzige Nutzungsnachweis. Der Gutschein kann dann entgegen der dokumentierten Regel „einmal pro Nutzer“ erneut eingelöst werden. | mittel | mittel | Gutscheineinlösungen in einer eigenen Tabelle dauerhaft protokollieren, zum Beispiel mit einer eindeutigen Kombination aus `user_id` und `gutschein_code`. Das Löschen einer Pizza darf diesen Nachweis nicht entfernen. **Status: offen.** |
| R-04 | **Nicht abgefangene Serverfehler können das JSON-Protokoll verlassen.** Erwartete Fehler werden zwar mit `jsonResponse()` beantwortet, es gibt aber keinen zentralen Exception-Handler. Zudem besitzen nicht alle `fetch()`-Aufrufe eine vollständige Fehlerbehandlung. | Ein Datenbank-, Datei- oder Laufzeitfehler kann statt JSON eine leere oder HTML-basierte HTTP-500-Antwort erzeugen. Das Frontend zeigt dann nur eine allgemeine Meldung oder reagiert bei einzelnen Abläufen gar nicht verständlich. | niedrig bis mittel | mittel | API-Einstiegspunkte zentral mit `try/catch` absichern, intern protokollieren und nach außen immer eine definierte JSON-Fehlerantwort liefern. Im Frontend `response.ok`, Inhaltstyp und JSON-Parsing einheitlich behandeln. **Status: offen.** |
| R-05 | **Dokumentierte Seiten fehlen im Repository.** `README.md` verlinkt `datenschutz.html`; `INSTALL.md` und die Dialogspezifikation nennen zusätzlich ein Impressum. Beide HTML-Dateien fehlen im geprüften Stand. | Prüfer oder Nutzer folgen der Dokumentation und finden die beschriebenen Seiten nicht. Dadurch entsteht ein sichtbarer Widerspruch zwischen Dokumentation und Anwendung. | hoch | niedrig bis mittel | Entweder `datenschutz.html` und `impressum.html` mit zum Projekt passenden Hinweisen ergänzen oder sämtliche nicht vorgesehenen Verweise konsistent entfernen. Anschließend alle internen Links prüfen. **Status: offen.** |

### Priorisierung der Risiken

Vor der finalen M3-Abgabe sind R-01 und R-05 besonders relevant, weil sie unmittelbar bei Installation oder Präsentation sichtbar werden können. R-02 und R-03 betreffen die fachliche Korrektheit und sollten spätestens vor einem weiterentwickelten Einsatz behoben werden. R-04 ist im lokalen Lehrbetrieb weniger wahrscheinlich, erschwert aber die Diagnose genau dann, wenn während einer Vorführung ein Umgebungsfehler auftritt.

## 11.2 Technische Schulden

| ID | Bestehende technische Schuld | Auswirkung | Empfohlener Tilgungsweg | Priorität |
|---|---|---|---|---|
| S-01 | **Keine automatisierten Tests.** Fachlogik, API-Endpunkte und Benutzerabläufe werden ausschließlich manuell geprüft. | Änderungen an Preisberechnung, Gutscheinen oder Autorisierung können unbemerkt Regressionen verursachen. Das vollständige erneute Prüfen kostet Zeit und ist fehleranfällig. | Zuerst Unit-Tests für `calculatePizzaTotals()` und `validateCoupon()` ergänzen. Danach Integrationstests für Anmeldung, Speichern, Laden, Löschen und die Eigentumsprüfung aus QS-02 und QS-05 aufbauen. Das manuelle Testprotokoll aus Kapitel 10 bleibt für Darstellung und Installation erforderlich. | hoch |
| S-02 | **„Erneut bearbeiten“ besitzt keinen UPDATE-Ablauf.** Die Auswahl wird über `sessionStorage` in den Konfigurator übertragen; `api/save_config.php` führt beim Speichern jedoch immer ein `INSERT` aus. | Nach einer Bearbeitung bleibt der alte Datensatz bestehen und zusätzlich entsteht eine neue Konfiguration. Das kann als Duplikat oder als unerwartetes Verhalten wahrgenommen werden. | Wenn wirklich bearbeitet werden soll, Konfigurations-ID mitführen und einen autorisierten UPDATE-Endpunkt ergänzen. Wenn bewusst eine Kopie entstehen soll, die Aktion eindeutig als „Als neue Pizza verwenden“ beschriften und dokumentieren. | mittel |
| S-03 | **Beläge und Extras liegen als JSON in `konfigurationen`.** Die Struktur ist für das Laden einer vollständigen Pizza einfach, aber nur eingeschränkt relational auswertbar. | Abfragen wie „häufigster Belag“ oder spätere Änderungen einzelner Zutaten erfordern JSON-Funktionen oder zusätzliche Verarbeitung in PHP. | Bei wachsendem Analysebedarf Zwischentabellen wie `konfiguration_belag` und `konfiguration_extra` einführen. Für den aktuellen Projektumfang kann die bestehende Lösung beibehalten werden. | niedrig |
| S-04 | **Fehlerbehandlung ist über mehrere Stellen verteilt.** Erwartete API-Fehler verwenden gemeinsame Helfer, aber Exceptions und Frontend-Netzwerkfehler werden nicht durchgehend nach demselben Schema behandelt. | Fehlermeldungen sind je nach Seite unterschiedlich aussagekräftig. Neue Endpunkte können leicht ein abweichendes Antwortformat einführen. | Einen kleinen zentralen API-Wrapper für Fehler, Logging und JSON-Antworten einführen. Im Frontend eine gemeinsame Hilfsfunktion für API-Aufrufe verwenden. | mittel |
| S-05 | **Datenbankschema ohne versionierte Migrationen.** Die Einrichtung erfolgt über eine einzelne `database/schema.sql`. | Nach späteren Schemaänderungen ist nicht nachvollziehbar, wie eine bestehende Installation sicher auf den neuen Stand gebracht wird. | Nummerierte, idempotente Migrationsdateien oder ein kleines Migrationstool einführen. Für den einmaligen lokalen Aufbau bleibt `schema.sql` ausreichend. | niedrig |
| S-06 | **Dokumentation und Implementierung können auseinanderlaufen.** Die Gutscheinregel, der Bearbeitungsablauf und die nicht vorhandenen Datenschutz-/Impressumsseiten zeigen bereits solche Abweichungen. | Prüfer und Teammitglieder können falsche Annahmen über das tatsächliche Verhalten treffen; spätere Änderungen werden an der falschen Stelle vorgenommen. | Vor jedem Release Spezifikation, Architekturdokumentation und Anwendung gemeinsam prüfen. Abweichungen entweder im Code beheben oder bewusst in der Dokumentation als Einschränkung festhalten. | hoch |

## 11.3 Bereits wirksame Schutzmaßnahmen

Bei der Codeprüfung wurden auch Schutzmaßnahmen bestätigt. Sie werden hier genannt, damit behobene oder nicht vorhandene Probleme nicht fälschlich als offene Risiken erscheinen:

- Der an das Backend gesendete Preis wird beim Speichern nicht vertraut. `api/save_config.php` validiert die Auswahl und berechnet den Preis serverseitig aus `data/pizza_data.json` neu.
- Passwörter werden mit `password_hash()` gespeichert und mit `password_verify()` geprüft.
- Datenbankzugriffe verwenden PDO Prepared Statements; die Emulation vorbereiteter Anweisungen ist deaktiviert.
- Geschützte Endpunkte verlangen eine aktive Session. Laden und Löschen werden auf den angemeldeten Eigentümer begrenzt.
- Nach Anmeldung und Registrierung wird die Session-ID erneuert.
- Datenbankzugangsdaten können über Umgebungsvariablen gesetzt werden. Die Werte `root` und leeres Passwort sind lokale XAMPP-Fallbacks und keine im Repository veröffentlichten Produktionszugänge.

Diese Maßnahmen reduzieren bekannte Sicherheitsrisiken, ersetzen aber nicht die Prüfungen aus [Kapitel 10](A10-quality-requirements.md).

## 11.4 Bewusst akzeptierte Projektgrenzen

Die folgenden Punkte sind im vereinbarten M3-Umfang keine offenen Risiken:

- **Kein produktiver Internetbetrieb:** Die Anwendung ist für eine lokale XAMPP- oder MAMP-Umgebung vorgesehen. TLS-Terminierung, öffentliches Hosting, Mehrserverbetrieb und Hochverfügbarkeit gehören daher nicht zum Projektziel; siehe [Kapitel 7](A07-deployment-view.md).
- **Keine echte Bestellung oder Zahlung:** Der Pizza Tracker speichert Konfigurationen, führt aber keine reale Bestellung, Zahlung oder Lieferung aus. Entsprechende Zahlungs- und Transaktionsrisiken liegen außerhalb des Anwendungsbereichs.
- **Keine horizontale Skalierung:** Für den lokalen Lehrbetrieb auf einem Rechner ist eine verteilte Architektur nicht erforderlich.
- **Kein Backend-Framework:** Die kleine PHP-Anwendung nutzt gemeinsame Helfer und klar getrennte Endpunkte. Ein Framework würde zusätzliche Komplexität erzeugen und ist für den aktuellen Umfang nicht zwingend; bei starkem Wachstum wäre diese Entscheidung neu zu bewerten.
- **Lokale Standardzugangsdaten:** Der XAMPP-Fallback `root` ohne Passwort ist ausschließlich für die lokale Entwicklungsumgebung vorgesehen. Für einen öffentlichen Betrieb wäre er unzulässig, ein öffentlicher Betrieb ist jedoch nicht Teil des aktuellen Ziels.

## 11.5 Maßnahmenplan

| Reihenfolge | Maßnahme | Zugeordnete Punkte | Abnahmekriterium |
|---|---|---|---|
| 1 | Dokumentationsverweise und fehlende Seiten bereinigen | R-05, S-06 | Jeder dokumentierte interne Link führt zu einer vorhandenen Datei; README, INSTALL und Anwendung widersprechen sich nicht. |
| 2 | Präsentationsfähigkeit ohne externe Abhängigkeit sichern | R-01 | Anwendung lädt mit deaktiviertem Internet vollständig und behält Layout sowie Navigation. |
| 3 | Rundung zwischen Browser und Server vereinheitlichen | R-02 | Für Normalfälle und Cent-Grenzfälle zeigt der Browser exakt den serverseitig gespeicherten Endpreis. |
| 4 | Dauerhaften Nachweis für einmalige Gutscheine einführen | R-03 | `WELCOME` bleibt nach dem Löschen einer Konfiguration für denselben Nutzer gesperrt. |
| 5 | Fehlerbehandlung vereinheitlichen | R-04, S-04 | Auch bei erzwungenem Datenbank- oder Dateifehler antwortet jeder API-Endpunkt mit definiertem JSON; die Oberfläche zeigt eine verständliche Meldung. |
| 6 | Kernlogik automatisiert absichern | S-01 | Tests decken Preisberechnung, Gutscheinstatus und Eigentumsprüfung ab und sind reproduzierbar ausführbar. |
| 7 | Semantik von „Erneut bearbeiten“ festlegen | S-02 | Entweder wird derselbe Datensatz autorisiert aktualisiert oder die Oberfläche benennt das Erstellen einer Kopie eindeutig. |

## 11.6 Nachweisgrenze

Die Einträge dokumentieren den durch Code- und Dokumentensichtung festgestellten Stand. Sie ersetzen keine ausgefüllten Tests. Insbesondere Offline-Betrieb, Browserdarstellung, API-Fehlerfälle und Gutscheinabläufe gelten erst nach dokumentierter Durchführung der zugehörigen Szenarien als praktisch geprüft. Die offenen Punkte bleiben deshalb bis zur Behebung oder bewussten Abnahme im Risikoregister erhalten.
