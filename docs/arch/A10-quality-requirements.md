10 Qualitätsanforderungen

Dieses Kapitel konkretisiert die Qualitätsziele aus Kapitel 1.2 und die nichtfunktionalen Anforderungen aus N1. Die Anforderungen werden durch überprüfbare Nutzungsszenarien und Änderungsszenarien beschrieben. Da das Projekt keine automatisierten Tests enthält, sind die Kriterien so formuliert, dass sie mit Browser, Entwicklerwerkzeugen, HTTP-Aufrufen und Datenbankabfragen manuell geprüft werden können.

Die Prioritäten bedeuten:

A — architekturprägend: Ein Verfehlen widerspricht einem zentralen Qualitätsziel oder einer wesentlichen Architekturentscheidung.

B — verbindlich: Die Anforderung ist für den Projektumfang relevant, kann aber lokal und ohne grundlegenden Architekturwechsel erfüllt werden.

C — wünschenswert: Die Anforderung verbessert die Anwendung, ist für den vereinbarten Projektumfang jedoch nicht zwingend.

10.1 Qualitätsbaum

Qualitätsaspekt

Konkretisierte Anforderung

Priorität

Bezug zu Kapitel 1 / Spezifikation

Realisierung und Nachweis

Funktionale Korrektheit

Eine identische Pizza-Konfiguration ergibt bei identischem Gutschein denselben serverseitig berechneten Endpreis.

A

Qualitätsziel 2; UC01–UC04

Serverseitige Neuberechnung aus pizza_data.json gemäß § 8.9; QS-01 und QS-03

Sicherheit

Nutzer können nur ihre eigenen gespeicherten Konfigurationen laden und löschen.

A

Qualitätsziel 1; NFA05

Sessionprüfung und Eigentumsbedingung gemäß § 8.6; QS-02 und QS-05

Sicherheit

Passwörter werden ausschließlich als Hash gespeichert.

A

Qualitätsziel 1; NFA02

password_hash() und password_verify() gemäß § 8.7

Sicherheit

Datenbankeingaben werden über vorbereitete SQL-Anweisungen verarbeitet.

A

Qualitätsziel 1; NFA03–NFA04

PDO mit deaktivierter Emulation und Prepared Statements gemäß § 8.8

Benutzbarkeit

Preis, Kalorien und Nährwerte werden unmittelbar nach einer Änderung der Auswahl aktualisiert.

B

Qualitätsziel 3; NFA06; UC01–UC03

Clientseitige Berechnung und DOM-Aktualisierung; QS-04

Performance

Die Neuberechnung im Konfigurator erfolgt ohne vollständigen Seitenreload.

B

Qualitätsziel 4; NFA01

Browserlogik und JSON-basierte Kommunikation gemäß ADR 9.4; QS-04

Wartbarkeit

Optionen innerhalb bestehender Kategorien werden zentral in data/pizza_data.json gepflegt.

B

Ergänzende Architekturanforderung; ADR 9.5

Browser und Backend lesen dieselbe Fachdatenquelle gemäß § 8.2; QS-07 und QS-08

Kompatibilität

Die Anwendung ist in aktuellen Desktop-Browsern und bei typischen mobilen sowie Desktop-Breiten bedienbar.

B

Qualitätsziel 5; NFA07

Bootstrap und eigenes responsives CSS gemäß § 8.11; QS-06

Betreibbarkeit

Die Anwendung kann anhand der mitgelieferten Anleitung in einer lokalen XAMPP- oder MAMP-Umgebung eingerichtet werden.

B

Qualitätsziel 6; NFA08

Installationsschritte in README.md und INSTALL.md sowie § 7.3; QS-09

Fehlertransparenz

Ungültige oder abgelaufene Gutscheine werden abgelehnt und dem Nutzer verständlich gemeldet.

B

Funktionale Korrektheit; N2 „Fehlerbehandlung“

Gemeinsame JSON-Fehlerantworten und Statuscodes; QS-10

Bewusst nicht vertiefte Qualitätsaspekte

Skalierbarkeit und Hochverfügbarkeit: Die Anwendung ist für einen lokalen Lehrbetrieb auf einem einzelnen Rechner vorgesehen. Lastverteilung, Failover und Mehrserverbetrieb liegen außerhalb des Projektumfangs.

Internationalisierung: Die Benutzerschnittstelle ist ausschließlich deutschsprachig. Eine mehrsprachige Oberfläche ist nicht Teil der M3-Version.

Produktiver Internetbetrieb: TLS-Terminierung, öffentliches Hosting und produktive Serverhärtung sind nicht vorgesehen, weil die Anwendung lokal über XAMPP beziehungsweise MAMP betrieben wird.

Vollständige Barrierefreiheit: Semantische HTML-Elemente und Beschriftungen werden verwendet, ein formaler Test nach WCAG ist jedoch nicht Bestandteil des Projekts. Deshalb wird keine vollständige Barrierefreiheit zugesichert.

Diese Abgrenzungen heben die grundlegenden Sicherheitsanforderungen an gespeicherte Passwörter, Eingabevalidierung und Autorisierung nicht auf.

10.2 Qualitätsszenarien

U bezeichnet ein Nutzungsszenario, Ä ein Änderungsszenario. Die Tabelle formuliert Soll-Kriterien. Die Durchführung und das tatsächliche Ergebnis werden in einem manuellen Testprotokoll mit Datum, Browser, geprüftem Commit und Ist-Ergebnis festgehalten.

ID

Art

Kontext und Auslöser

Erwartete Reaktion

Prüfbares Kriterium

QS-01

U

Ein angemeldeter Nutzer stellt dieselbe Pizza zweimal mit identischer Größe, identischen Zutaten und identischem Gutschein zusammen und speichert beide Konfigurationen.

Der Server berechnet in beiden Fällen denselben Endpreis.

Die beiden Datensätze in konfigurationen besitzen denselben Wert in preis. Unterschiede bei ID, Name oder Erstellungszeitpunkt sind zulässig.

QS-02

U

Nutzer A sendet an api/delete_config.php die ID einer Konfiguration von Nutzer B.

Die fremde Konfiguration wird nicht gelöscht und es werden keine Informationen über ihren Inhalt ausgegeben.

Der Endpunkt antwortet mit HTTP 404 und success: false. Eine anschließende Datenbankabfrage zeigt, dass der Datensatz unverändert vorhanden ist.

QS-03

U

Ein angemeldeter Nutzer ergänzt den JSON-Request an api/save_config.php um einen manipulierten Preis.

Der übertragene Preis wird ignoriert. Der Server validiert die Auswahl und berechnet den Preis selbst aus pizza_data.json und einem gegebenenfalls gültigen Gutschein.

Der gespeicherte Preis entspricht dem Ergebnis von calculatePizzaTotals() und nicht dem manipulierten Request-Wert.

QS-04

U

Im Konfigurator wird Größe, Teig, Sauce, Käse, Belag oder Extra geändert.

Preis, Kalorien, Makronährwerte, Vorschau und Zusammenfassung werden unmittelbar aktualisiert.

Die sichtbaren Werte ändern sich ohne Seitenwechsel. Im Netzwerk-Tab entsteht durch die Auswahländerung kein neuer Dokument-Request.

QS-05

U

Ein nicht angemeldeter Besucher ruft api/save_config.php, api/load_configs.php oder api/delete_config.php direkt auf.

Der Server verweigert die geschützte Aktion.

Jeder korrekt aufgerufene geschützte Endpunkt antwortet mit HTTP 401 und einer JSON-Antwort mit success: false; es wird kein Datensatz angelegt, geladen oder gelöscht.

QS-06

U

Die Anwendung wird in einem aktuellen Browser mit einer mobilen Breite von 360 Pixeln und einer Desktop-Breite von 1280 Pixeln geöffnet.

Navigation, Formulare, Konfigurator und Tabellen bleiben erreichbar und bedienbar.

Bei beiden Breiten gibt es auf Seitenebene kein horizontales Scrollen; Texte und Bedienelemente überdecken sich nicht. Breite Tabellen dürfen innerhalb ihres vorgesehenen Containers horizontal scrollbar sein. Der verwendete Browser wird im Testprotokoll genannt.

QS-07

Ä

Innerhalb einer bestehenden Kategorie soll eine neue Pizzaoption mit Preis, Kalorien, Nährwerten und Kennzeichnungen ergänzt werden.

Die neue Option wird aus pizza_data.json im Konfigurator erzeugt und vom Backend als gültige Auswahl akzeptiert.

Für die neue Option ist nur eine Änderung an data/pizza_data.json erforderlich; HTML-, JavaScript- und PHP-Dateien bleiben unverändert. Preis und Nährwerte werden nach Auswahl korrekt einbezogen.

QS-08

Ä

Der Preis einer bestehenden Option in pizza_data.json wird geändert, nachdem bereits Konfigurationen gespeichert wurden.

Neue Speichervorgänge verwenden den geänderten Preis; bereits gespeicherte Datensätze behalten ihren historischen Preis.

Vorhandene Zeilen in konfigurationen.preis bleiben unverändert. Eine anschließend neu gespeicherte identische Konfiguration verwendet den neuen Preis aus pizza_data.json.

QS-09

Ä

Das Repository wird auf einem Rechner eingerichtet, auf dem der Pizza Tracker zuvor nicht installiert war.

Eine Person kann die Anwendung ausschließlich mithilfe von README.md und INSTALL.md unter XAMPP oder MAMP starten.

Repository in den DocumentRoot kopieren, Apache und MySQL/MariaDB starten, database/schema.sql importieren und startseite.html öffnen. Ziel: lauffähige Anwendung innerhalb von 15 Minuten und ohne Quellcodeänderung. Tatsächliche Dauer und zusätzliche Rückfragen werden protokolliert.

QS-10

U

Im Konfigurator wird ein unbekannter, inaktiver oder abgelaufener Gutscheincode eingegeben.

Der Gutschein wird nicht aktiviert, der Preis bleibt ohne Rabatt und die Oberfläche zeigt eine verständliche Fehlermeldung.

Unbekannter Code führt zu HTTP 404, inaktiver Code zu HTTP 400 und abgelaufener Code zu HTTP 410. Die Antwort enthält success: false; activeCoupon bleibt beziehungsweise wird null.

10.3 Rückverfolgbarkeit

Die Szenarien decken die Qualitätsziele aus Kapitel 1 wie folgt ab:

Funktionale Korrektheit: QS-01, QS-03, QS-08 und QS-10

Sicherheit: QS-02, QS-03 und QS-05

Benutzbarkeit: QS-04 und QS-06

Performance: QS-04

Wartbarkeit der Fachdaten: QS-07 und QS-08

Kompatibilität: QS-06

Betreibbarkeit: QS-09

Die Szenarien QS-03 und QS-08 belegen außerdem die in ADR 9.5 beschriebene Entscheidung, dieselbe Fachdatenquelle für Browser und Backend zu verwenden. QS-02 und QS-05 konkretisieren die in § 8.5 und § 8.6 dokumentierte Trennung zwischen sichtbarer Benutzeroberfläche und serverseitiger Zugriffskontrolle.

10.4 Nachweisgrenzen

Die Szenarien definieren überprüfbare Anforderungen, ersetzen aber kein ausgefülltes Testprotokoll. Insbesondere Aussagen zur Browserkompatibilität, Darstellung bei 360 beziehungsweise 1280 Pixeln und Einrichtungsdauer auf einem fremden Rechner gelten erst nach dokumentierter Durchführung als nachgewiesen. Bis dahin handelt es sich um verbindliche Abnahmekriterien für den finalen M3-Stand.
