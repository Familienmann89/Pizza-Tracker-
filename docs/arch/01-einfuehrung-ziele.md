# 1 — Einführung und Ziele

Der **Pizza Tracker** ist eine webbasierte Anwendung zur individuellen Zusammenstellung von Pizzen. Nutzer können Größe, Teig, Sauce, Käse, Beläge und Extras auswählen. Während der Konfiguration werden Preis, Kalorien und Nährwerte aktualisiert. Eine Foto-Vorschau, Größenangaben und Ernährungskennzeichnungen unterstützen die Auswahl. Zusätzlich unterstützt die Anwendung Gutscheincodes sowie Benutzerkonten zum Speichern und Verwalten eigener Pizza-Konfigurationen.

Dieses Kapitel fasst die Anforderungen und Qualitätsziele zusammen, die für die Softwarearchitektur maßgeblich sind. Die vollständige fachliche Spezifikation befindet sich unter [`../spec/`](../spec/) und wird hier nicht dupliziert.

---

## 1.1 Anforderungsüberblick

Der fachliche Kern des Pizza Trackers besteht aus der **Konfiguration, Berechnung und Verwaltung individueller Pizza-Zusammenstellungen**.

Ein Gast kann eine Pizza konfigurieren, wobei folgende Bestandteile ausgewählt werden können:

- Größe: S, M, L, XL oder XXL mit 20, 26, 30, 34 beziehungsweise 40 cm Durchmesser
- Teigart
- Sauce
- Käse
- Beläge
- Extras

Nach Änderungen an der Konfiguration werden **Preis, Kalorien und Makronährwerte** neu berechnet und angezeigt. Zu den Makronährwerten gehören Protein, Kohlenhydrate und Fett; vorhandene Ballaststoffwerte werden ergänzend berücksichtigt. Die Angaben sind berechnete Richtwerte aus den hinterlegten Fachdaten, keine Messung einer tatsächlich zubereiteten Pizza.

Die Foto-Vorschau verwendet vorhandene Bilder und bildet nicht jede individuelle Zutatenkombination exakt ab. Größenanzeige, Auswahlzusammenfassung, Ernährungskennzeichnungen und die Allergenseite ergänzen diese Orientierung.

Zusätzlich kann ein Nutzer einen Gutscheincode eingeben. Das System prüft dabei, ob der Code vorhanden, aktiv und noch gültig ist. Bei erfolgreicher Prüfung wird der entsprechende prozentuale Rabatt auf den aktuellen Preis angewendet. Kalorien und Nährwerte bleiben unverändert. Ändert sich anschließend die Zutaten- oder Größenauswahl, muss der Gutschein erneut eingelöst werden.

Gäste können sich registrieren; nach erfolgreicher Registrierung sind sie direkt angemeldet. Bestehende Nutzer melden sich mit E-Mail und Passwort an. Angemeldete Nutzer können eigene Konfigurationen speichern, später wieder aufrufen und löschen.

Eine erneut geöffnete Pizza dient im aktuellen Ablauf als Ausgangspunkt für eine neue Konfiguration: Erneutes Speichern legt einen neuen Datensatz an und überschreibt den alten nicht. Der frühere Gutschein wird dabei nicht automatisch erneut aktiviert.

Darüber hinaus können Gäste und angemeldete Nutzer vordefinierte Pizza-Vorlagen wie **Margherita, Salami und Hawaii** laden und anschließend individuell verändern.

### Zentrale Anwendungsfälle

| ID | Anwendungsfall | Akteur |
|---|---|---|
| UC01 | Pizza konfigurieren | Gast / angemeldeter Nutzer |
| UC02 | Preis berechnen | System |
| UC03 | Kalorien berechnen | System |
| UC04 | Gutscheincode einlösen | Gast / angemeldeter Nutzer |
| UC05 | Nutzer registrieren | Gast |
| UC06 | Nutzer einloggen | Gast |
| UC07 | Nutzer ausloggen | Angemeldeter Nutzer |
| UC08 | Konfiguration speichern | Angemeldeter Nutzer |
| UC09 | Gespeicherte Pizzen anzeigen | Angemeldeter Nutzer |
| UC10 | Konfiguration löschen | Angemeldeter Nutzer |
| UC11 | Vorlage laden | Gast / angemeldeter Nutzer |

UC02 und UC03 bezeichnen automatische Berechnungsfunktionen innerhalb der Konfiguration; „System“ ist hier die ausführende Instanz, kein zusätzlicher externer Nutzer.

Die fachlich beschriebenen Abläufe, Vorbedingungen, Ergebnisse und Fehlerfälle sind in [`F2 — Anwendungsfälle`](../spec/F2-anwendungsfaelle.md) dokumentiert.

### Geschäftsprozesse

Die Spezifikation unterscheidet drei übergeordnete Geschäftsprozesse:

| ID | Geschäftsprozess | Bedeutung für den Pizza Tracker |
|---|---|---|
| GP1 | Pizza bestellen | Der Pizza Tracker unterstützt den Konfigurationsschritt einschließlich Preis-, Kalorien- und Gutscheinberechnung. Eine tatsächliche Bestellung und Bezahlung erfolgen außerhalb des Systems. |
| GP2 | Konto erstellen und anmelden | Nutzer registrieren sich beziehungsweise melden sich an, um zusätzliche Funktionen nutzen zu können. |
| GP3 | Konfiguration verwalten | Angemeldete Nutzer können gespeicherte Pizza-Konfigurationen anzeigen, erneut verwenden und löschen. |

Die vollständigen Geschäftsprozesse sind in [`F1 — Geschäftsprozesse`](../spec/F1-geschaeftsprozesse.md) beschrieben.

### Zentrale Anwendungsfunktion: Gutscheinprüfung

Eine besonders relevante fachliche Funktion ist die Prüfung eines Gutscheincodes.

Bei der Einlösung prüft das System nacheinander:

1. ob der Gutscheincode vorhanden ist,
2. ob der Gutscheincode aktiv ist,
3. ob der Gutscheincode noch gültig ist,
4. bei WELCOME zusätzlich, ob eine Anmeldung vorliegt und bereits eine mit diesem Code gespeicherte Konfiguration des Nutzers existiert,
5. welcher prozentuale Rabatt anzuwenden ist.

Der Browser berechnet damit den angezeigten Preis. Beim Speichern prüft der Server den Gutschein erneut und berechnet den verbindlichen Speicherpreis selbst.

Bei einer fehlgeschlagenen Prüfung wird dem Nutzer eine entsprechende Fehlermeldung angezeigt. Die fachliche Gutscheinregel steht in [`F3 — Anwendungsfunktionen`](../spec/F3-anwendungsfunktionen.md). Die aktuelle WELCOME-Prüfung ist an vorhandene gespeicherte Konfigurationen gebunden und garantiert keine dauerhafte Einmaligkeit nach deren Löschung. Diese und weitere Abweichungen werden in [A11](A11-risks-and-technical-debts.md) festgehalten; die Abläufe beschreibt [A06](A06%20-%20Laufzeitsicht.md).

### Systemgrenze

Nicht Bestandteil des Pizza Trackers sind:

- tatsächliche Bestellung oder Lieferung einer Pizza
- Bezahlung
- Admin-Bereich einer Pizzeria
- native Mobile-App
- Echtzeit-Tracking

Der in `F1` beschriebene Geschäftsprozess „Pizza bestellen“ reicht bewusst über die Systemgrenze hinaus. Vorgänge wie Zubereitung, Bezahlung und Übergabe einer Pizza werden **nicht durch den Pizza Tracker implementiert**.

### Weiterführende Spezifikation

Die maßgeblichen fachlichen Quellen sind:

- [`P1 — Ziele und Rahmenbedingungen`](../spec/P1-ziele-rahmenbedingungen.md)
- [`F1 — Geschäftsprozesse`](../spec/F1-geschaeftsprozesse.md)
- [`F2 — Anwendungsfälle`](../spec/F2-anwendungsfaelle.md)
- [`F3 — Anwendungsfunktionen`](../spec/F3-anwendungsfunktionen.md)
- [`N1 — Nichtfunktionale Anforderungen`](../spec/N1-nichtfunktional.md)

---

## 1.2 Qualitätsziele

Die für die Architektur wichtigsten Qualitätsziele ergeben sich aus den fachlichen und nichtfunktionalen Anforderungen des Projekts. Die folgenden Aussagen sind Ziele, keine pauschale Bestätigung ihrer vollständigen Erfüllung. Die Prioritätsnummern dienen zugleich als Referenzen für A10.

| Priorität | Qualitätsziel | Beschreibung | Bezug |
|---|---|---|---|
| 1 | **Sicherheit** | Passwörter dürfen nicht im Klartext gespeichert werden. Eingaben sollen gegen schädliche Inhalte abgesichert werden. Funktionen für angemeldete Nutzer dürfen Gästen nicht zugänglich sein. Gespeicherte Konfigurationen dürfen nur vom jeweiligen Eigentümer geladen und gelöscht werden. | NFA02–NFA05 |
| 2 | **Funktionale Korrektheit** | Preis, Kalorien, ergänzende Nährwerte und Gutscheine sollen zur aktuellen Auswahl passen. Angezeigter und gespeicherter Endpreis sollen übereinstimmen. | P1, UC01–UC04 |
| 3 | **Benutzbarkeit** | Die Oberfläche soll sich an verschiedene Bildschirmgrößen anpassen und auf Desktop- sowie Mobilgeräten bedienbar sein. | NFA06 |
| 4 | **Performance** | Seiten sollen ohne spürbare Verzögerung bereitstehen. Änderungen an Preis und Kalorien sollen während der Konfiguration unmittelbar sichtbar werden. | NFA01, UC01–UC03 |
| 5 | **Kompatibilität** | Die Anwendung soll in aktuellen Versionen gängiger Browser funktionieren. | NFA07 |
| 6 | **Betreibbarkeit** | Die Anwendung ist für den lokalen Betrieb vorgesehen und soll mit XAMPP beziehungsweise MAMP betrieben werden können. | P1, NFA08 |

Die detaillierten nichtfunktionalen Anforderungen befinden sich in [`N1 — Nichtfunktionale Anforderungen`](../spec/N1-nichtfunktional.md).

Die Qualitätsziele bilden eine Grundlage für die [Architekturentscheidungen in A09](A09-architecture-decisions.md). [A10](A10-quality-requirements.md) konkretisiert sie durch Prüfkriterien; [A11](A11-risks-and-technical-debts.md) beschreibt bekannte Grenzen. Insbesondere die unterschiedliche Rabatt-Rundung darf nicht durch eine allgemeine Aussage „Berechnung korrekt“ übergangen werden.

---

## 1.3 Stakeholder

| Stakeholder | Rolle | Erwartung an das System und die Architektur |
|---|---|---|
| **Gast** | Nicht angemeldeter Nutzer | Pizza konfigurieren, Preise und Nährwerte verstehen, Allergene einsehen, zulässige Gutscheine verwenden und Vorlagen laden; bei Bedarf ein Konto erstellen |
| **Registrierter Nutzer** | Hauptnutzer | Zusätzlich eigene Konfigurationen speichern, anzeigen, erneut verwenden und löschen |
| **Projektgruppe** | Entwickler | Funktionierende, verständliche und nachvollziehbare Umsetzung mit klarer Struktur |
| **Betreuer** | Prüfer | Nachvollziehbare Softwareentwicklung sowie Übereinstimmung von Spezifikation, Architektur und Implementierung |

---

## 1.4 Technische Rahmenbedingungen

Die folgende Tabelle fasst die im Projekt eingesetzten Technologien zusammen. Sie beschreibt den vorhandenen Projektstand und stellt keine Behauptung dar, dass sämtliche Technologien vom Prüfer vorgeschrieben wurden. Die Randbedingungen erläutert [Kapitel 2](02-randbedingungen.md), die technischen Begründungen enthält [A09](A09-architecture-decisions.md).

| Bereich | Technologie / Werkzeug |
|---|---|
| Backend | PHP ab 8.1; benötigt PDO-MySQL und mbstring |
| Frontend | JavaScript |
| Benutzeroberfläche | HTML, Bootstrap 5.3.3 über CDN und eigenes CSS |
| Persistenz | MySQL / MariaDB für Nutzer, Gutscheine und gespeicherte Konfigurationen |
| Fachdaten | `data/pizza_data.json` für Optionen, Preise, Nährwerte und Vorlagen |
| Lokale Laufzeitumgebung | XAMPP oder MAMP |
| Versionskontrolle | Git |
| Repository | GitHub |

Die Anwendung wird als klassische Webanwendung entwickelt und ist für den lokalen Betrieb vorgesehen.

Die konkreten Laufzeitvoraussetzungen und die CDN-Abhängigkeit beschreibt [A07](A07-deployment-view.md). Implementierungsdetails stehen in [A08](A08-cross-cutting-concepts.md). Begriffserklärungen enthält das [Glossar](A12-glossary.md).
