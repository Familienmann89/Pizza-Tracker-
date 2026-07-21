# Pizza Tracker — Spezifikation

Diese Projektspezifikation beschreibt den Pizza Tracker anhand des Bausteinmodells von Johannes Siedersleben. Die einzelnen Dateien betrachten das System aus fachlicher, technischer und organisatorischer Sicht. Dieses Dokument dient als Übersicht und Einstieg in die weiteren Bausteine.

Referenz zum Bausteinmodell: [SIEDERSLEBEN.md](SIEDERSLEBEN.md)
Quelle: SIEDERSLEBEN, J. (Hrsg.) 2003. *Softwaretechnik — Praxiswissen für Softwareingenieure*. München: Carl Hanser Verlag.

---

## E1 — Leseanleitung

### Für wen ist dieses Dokument?

- **Nutzer:** Überblick über Funktionen und Bedienung der Anwendung.
- **Entwickler:** Anforderungen, Aufbau und Schnittstellen nachvollziehen.
- **Betreuer:** Umfang und technische Entscheidungen unabhängig vom Quellcode beurteilen.

### Leseempfehlung

1. **P1** — Ziele, Umfang, Rahmenbedingungen
2. **P2** — Systemstruktur und Tech-Stack
3. **F1–F3** — Was die App tut (Prozesse, Use Cases, Funktionen)
4. **D1–D2** — Datenmodell und Typen
5. **B1** — Wie die Oberfläche aussieht
6. **S1 / S3** — Schnittstellen und Inbetriebnahme
7. **N1 / N2** — Qualitätsanforderungen
8. **E2** — Glossar zum Nachschlagen

### Konventionen

- Die Bausteine werden mit Codes wie P1, F2 oder N1 bezeichnet.
- Für jeden verwendeten Baustein gibt es eine eigene Markdown-Datei.
- Fachliche Anforderungen und technische Entscheidungen werden getrennt dargestellt.
- Nicht anwendbare Bausteine werden kurz begründet.

### Status-Legende

| Symbol | Bedeutung |
|---|---|
| ✅ | Block vorhanden |
| 🛠 | Geplant, noch nicht geschrieben |
| ⛔ | Nicht anwendbar (Begründung unten) |

---

## Übersicht aller Blöcke

### 1. Projektgrundlagen

| Block | Titel | Status | Datei |
|---|---|---|---|
| P1 | Ziele und Rahmenbedingungen | ✅ | [P1-ziele-rahmenbedingungen.md](P1-ziele-rahmenbedingungen.md) |
| P2 | Architekturüberblick | ✅ | [P2-architekturueberblick.md](P2-architekturueberblick.md) |

### 2. Abläufe und Funktionen

| Block | Titel | Status | Datei |
|---|---|---|---|
| F1 | Geschäftsprozesse | ✅ | [F1-geschaeftsprozesse.md](F1-geschaeftsprozesse.md) |
| F2 | Anwendungsfälle | ✅ | [F2-anwendungsfaelle.md](F2-anwendungsfaelle.md) |
| F3 | Anwendungsfunktionen | ✅ | [F3-anwendungsfunktionen.md](F3-anwendungsfunktionen.md) |

### 3. Daten

| Block | Titel | Status | Datei |
|---|---|---|---|
| D1 | Datenmodell | ✅ | [D1-datenmodell.md](D1-datenmodell.md) |
| D2 | Datentypenverzeichnis | ✅ | [D2-datentypen.md](D2-datentypen.md) |

### 4. Benutzerschnittstelle

| Block | Titel | Status | Datei |
|---|---|---|---|
| B1 | Dialogspezifikation | ✅ | [B1-dialogspezifikation.md](B1-dialogspezifikation.md) |
| B2 | Batch | ⛔ | — |
| B3 | Druckausgaben | ⛔ | — |

### 5. Schnittstellen

| Block | Titel | Status | Datei |
|---|---|---|---|
| S1 | Nachbarsysteme | ✅ | [S1-nachbarsysteme.md](S1-nachbarsysteme.md) |
| S2 | Datenmigration | ⛔ | — |
| S3 | Inbetriebnahme | ✅ | [S3-inbetriebnahme.md](S3-inbetriebnahme.md) |

### 6. Übergreifendes

| Block | Titel | Status | Datei |
|---|---|---|---|
| N1 | Nichtfunktionale Anforderungen | ✅ | [N1-nichtfunktional.md](N1-nichtfunktional.md) |
| N2 | Querschnittskonzepte | ✅ | [N2-querschnittskonzepte.md](N2-querschnittskonzepte.md) |

### 7. Ergänzendes

| Block | Titel | Status | Datei |
|---|---|---|---|
| E1 | Leseanleitung | ✅ | dieses Dokument |
| E2 | Glossar | ✅ | [E2-glossar.md](E2-glossar.md) |

---

## Nicht anwendbare Blöcke

### B2 — Batch

Der Pizza Tracker hat keine Batch-Verarbeitung. Alles läuft synchron innerhalb eines HTTP-Requests. Es gibt keinen Worker, keine Queue und keinen Scheduler.

### B3 — Druckausgaben

Es gibt keine Druckfunktion, keine PDFs und keine Berichte. Der Browser zeigt alles direkt an.

### S2 — Datenmigration

Für das Projekt gibt es kein Vorgängersystem und keine Altdaten. Die Datenbank wird neu über das vorgesehene SQL-Schema angelegt.

---

## Eingesetzte KI-Werkzeuge

| Werkzeug | Wofür | Wie geprüft |
|---|---|---|
| Claude | Unterstützung bei Code, Struktur und Formulierungen | Inhalte wurden durch die Gruppe geprüft und angepasst |
| GitHub Copilot | Unterstützung bei der Code-Vervollständigung | Vorschläge wurden vor der Übernahme geprüft |
