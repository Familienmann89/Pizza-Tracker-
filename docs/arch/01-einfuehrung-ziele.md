# 1 — Einführung und Ziele

Der **Pizza Tracker** ist eine webbasierte Anwendung zur individuellen Zusammenstellung von Pizzen. Nutzer können Größe, Teig, Sauce, Käse und Beläge auswählen. Während der Konfiguration werden Preis und Kalorien direkt aktualisiert. Zusätzlich unterstützt die Anwendung Gutscheincodes sowie Benutzerkonten zum Speichern und Verwalten eigener Pizza-Konfigurationen.

Dieses Kapitel fasst die Anforderungen und Qualitätsziele zusammen, die für die Softwarearchitektur maßgeblich sind. Die vollständige fachliche Spezifikation befindet sich unter [`../spec/`](../spec/) und wird hier nicht dupliziert.

---

## 1.1 Anforderungsüberblick

Der fachliche Kern des Pizza Trackers besteht aus der **Konfiguration, Berechnung und Verwaltung individueller Pizza-Zusammenstellungen**.

Ein Gast kann eine Pizza konfigurieren, wobei folgende Bestandteile ausgewählt werden können:

- Größe
- Teigart
- Sauce
- Käse
- Beläge

Nach Änderungen an der Konfiguration werden **Preis und Kalorien unmittelbar neu berechnet und angezeigt**.

Zusätzlich kann ein Nutzer einen Gutscheincode eingeben. Das System prüft dabei, ob der Code vorhanden, aktiv und noch gültig ist. Bei erfolgreicher Prüfung wird der entsprechende prozentuale Rabatt auf den aktuellen Preis angewendet.

Gäste können sich registrieren und anschließend anmelden. Angemeldete Nutzer können ihre Pizza-Konfigurationen speichern, später wieder aufrufen und löschen.

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

Die vollständigen Abläufe, Vorbedingungen, Ergebnisse und Fehlerfälle sind in [`F2 — Anwendungsfälle`](../spec/F2-anwendungsfaelle.md) dokumentiert.

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
4. welcher prozentuale Rabatt anzuwenden ist,
5. welcher neue Gesamtpreis daraus entsteht.

Bei einer fehlgeschlagenen Prüfung wird dem Nutzer eine entsprechende Fehlermeldung angezeigt. Der vollständige Prüfvorgang ist in [`F3 — Anwendungsfunktionen`](../spec/F3-anwendungsfunktionen.md) dokumentiert.

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

Die für die Architektur wichtigsten Qualitätsziele ergeben sich aus den nichtfunktionalen Anforderungen des Projekts.

| Priorität | Qualitätsziel | Beschreibung | Bezug |
|---|---|---|---|
| 1 | **Sicherheit** | Passwörter dürfen nicht im Klartext gespeichert werden. Eingaben sollen gegen schädliche Inhalte abgesichert werden. Funktionen für angemeldete Nutzer dürfen Gästen nicht zugänglich sein. | NFA02–NFA05 |
| 2 | **Funktionale Korrektheit** | Preis, Kalorien und Gutscheine müssen entsprechend der aktuellen Pizza-Konfiguration korrekt berechnet und verarbeitet werden. | P1, UC01–UC04 |
| 3 | **Benutzbarkeit** | Die Oberfläche soll sich an verschiedene Bildschirmgrößen anpassen und auf Desktop- sowie Mobilgeräten bedienbar sein. | NFA06 |
| 4 | **Performance** | Seiten sollen ohne spürbare Verzögerung bereitstehen. Änderungen an Preis und Kalorien sollen während der Konfiguration unmittelbar sichtbar werden. | NFA01, UC01–UC03 |
| 5 | **Kompatibilität** | Die Anwendung soll in aktuellen Versionen gängiger Browser funktionieren. | NFA07 |
| 6 | **Betreibbarkeit** | Die Anwendung ist für den lokalen Betrieb vorgesehen und soll mit XAMPP beziehungsweise MAMP betrieben werden können. | P1, NFA08 |

Die detaillierten nichtfunktionalen Anforderungen befinden sich in [`N1 — Nichtfunktionale Anforderungen`](../spec/N1-nichtfunktional.md).

Die Qualitätsziele bilden eine Grundlage für die später dokumentierten Architekturentscheidungen.

---

## 1.3 Stakeholder

| Stakeholder | Rolle | Erwartung an das System und die Architektur |
|---|---|---|
| **Gast** | Nicht angemeldeter Nutzer | Pizza konfigurieren, Preis und Kalorien anzeigen lassen, Gutscheincodes verwenden, Vorlagen laden sowie Registrierung und Anmeldung nutzen |
| **Registrierter Nutzer** | Hauptnutzer | Zusätzlich eigene Konfigurationen speichern, anzeigen, erneut verwenden und löschen |
| **Projektgruppe** | Entwickler | Funktionierende, verständliche und nachvollziehbare Umsetzung mit klarer Struktur |
| **Betreuer** | Prüfer | Nachvollziehbare Softwareentwicklung sowie Übereinstimmung von Spezifikation, Architektur und Implementierung |

---

## 1.4 Technische Rahmenbedingungen

Die grundlegenden Technologien sind bereits durch die Projektrahmenbedingungen festgelegt:

| Bereich | Technologie / Werkzeug |
|---|---|
| Backend | PHP 8 |
| Frontend | JavaScript |
| Benutzeroberfläche | Bootstrap 5.3 |
| Persistenz | MySQL / MariaDB |
| Lokale Laufzeitumgebung | XAMPP oder MAMP |
| Versionskontrolle | Git |
| Repository | GitHub |

Die Anwendung wird als klassische Webanwendung entwickelt und ist für den lokalen Betrieb vorgesehen.

Die konkrete technische Struktur sowie die daraus resultierenden Architekturentscheidungen werden in den folgenden Kapiteln beschrieben.
