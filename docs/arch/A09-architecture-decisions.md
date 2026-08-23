# 9 Architekturentscheidungen

> **STATUS: GERÜST — NOCH KEINE DOKUMENTATION.**
> Übernommen wurde die Optionsmatrix des Herold-Beispiels (Option / Beschreibung / Pro / Contra).
> **Ergänzt gegenüber Herold:** getrennte positive und negative Konsequenzen — das Briefing
> fordert beides als eigene Punkte, Herolds Template hat sie nicht.
> Alle ⟦…⟧-Stellen sind zu belegen bzw. im Team zu klären.

Dieses Kapitel hält die tragenden Architekturentscheidungen fest. Jede Entscheidung dokumentiert
Kontext, erwogene Alternativen, die getroffene Entscheidung, ihre Begründung und die daraus
folgenden Konsequenzen in beide Richtungen.

## Template

Jedes ADR folgt derselben Struktur:

```markdown
## ADR-00X: Titel

**Status:** ⟦Akzeptiert / Akzeptiert (durch Rahmenbedingung vorgegeben) / Abgelöst durch ADR-00Y⟧

**Kontext:** Welche Situation, welche Rahmenbedingung, welcher Zeitpunkt.

**Alternativen:**

| Option | Beschreibung | Pro | Contra |
|--------|--------------|-----|--------|
| A — … | … | … | … |
| B — … | … | … | … |

**Entscheidung:** Option ⟦X⟧.

**Begründung:** Warum genau in diesem Projekt, mit diesem Team, unter diesen Rahmenbedingungen.

**Positive Konsequenzen:** Was dadurch einfacher oder möglich wurde.

**Negative Konsequenzen / Trade-offs:** Was dadurch schwieriger, unmöglich oder aufwendiger wurde.
⟦Dieser Punkt darf nicht leer sein. Eine Entscheidung ohne Nachteil war keine Entscheidung.⟧
```

> **Hinweis zur Ehrlichkeit.** Wo eine Technologie durch die Aufgabenstellung, die
> Lehrveranstaltung oder vorhandene Kenntnisse festgelegt war, gehört das in den **Kontext** —
> nicht in eine erfundene Bewertungsmatrix. Ein ADR darf lauten: „vorgegeben; die Alternativen
> wurden nachträglich zur Einordnung betrachtet". Das ist belastbarer als eine rückwärts
> konstruierte Abwägung.
> ⟦Vor dem Schreiben im Team klären, welche Entscheidungen frei waren und welche nicht.⟧

---

## ADR-001: PHP als Backend-Technologie

**Status:** ⟦…⟧

**Kontext:** ⟦War PHP vorgegeben, durch XAMPP nahegelegt, oder frei gewählt? Welche Kenntnisse
lagen im Team vor? Zeitrahmen des Projekts?⟧

**Alternativen:** ⟦PHP · Node.js/Express · Java/Spring. Für jede realistisch einschätzen —
Contra-Spalten wie „steilere Lernkurve im gegebenen Zeitrahmen" sind zulässig und ehrlich;
pauschale Technologieurteile nicht.⟧

**Entscheidung / Begründung / Konsequenzen:** ⟦…⟧

⟦Negative Konsequenz, die hier hingehört: ohne Framework keine vorgegebene Struktur —
Querverweis auf [Kapitel 11](A11-risiken-und-technische-schulden.md).⟧

---

## ADR-002: MySQL/MariaDB als relationale Persistenz

**Status:** ⟦…⟧

**Kontext:** ⟦Es bestehen Beziehungen zwischen Nutzern, Konfigurationen und Gutscheinen —
das ist das eigentliche Argument und sollte konkret aus `database/schema.sql` belegt werden.⟧

**Alternativen:** ⟦MySQL/MariaDB · SQLite · reine JSON-Dateien.
SQLite ist die interessanteste Alternative: relational, aber ohne separaten Dienst.
Warum wurde sie nicht gewählt — oder wurde sie nie erwogen? Beides ist dokumentierbar.⟧

**Entscheidung / Begründung / Konsequenzen:** ⟦…⟧

⟦Falls Beläge/Extras als JSON-Spalte abgelegt sind: hier den Trade-off benennen —
die Entscheidung für relational wurde an dieser Stelle teilweise wieder aufgeweicht.
Verweis auf § 8.1 und A11.⟧

---

## ADR-003: Session-basierte Authentifizierung

**Status:** ⟦…⟧

**Kontext:** ⟦Serverseitig gerenderte Seiten plus fetch-Aufrufe an dieselbe Herkunft —
das ist der Kontext, der Sessions naheliegend macht. Keine mobile App, kein Drittanbieter-Client.⟧

**Alternativen:** ⟦PHP Session · JWT · keine Authentifizierung.
„Keine Authentifizierung" ist ernst zu nehmen: Die Konfiguration einer Pizza ist kein
schützenswertes Geheimnis. Das eigentliche Argument ist die Zuordnung gespeicherter
Konfigurationen zu einem Nutzer — genau das gehört in die Begründung.⟧

**Entscheidung / Begründung / Konsequenzen:** ⟦…⟧

---

## ADR-004: JSON-basierte PHP-API statt Formular-Postbacks

**Status:** ⟦…⟧

**Kontext:** ⟦Der Konfigurator braucht Live-Aktualisierung ohne Seitenreload — das ist die
Anforderung, aus der diese Entscheidung folgt. Bezug zum Qualitätsziel „Benutzbarkeit" in
[Kapitel 10](A10-qualitaetsanforderungen.md).⟧

**Alternativen:** ⟦klassische Formular-Postbacks mit serverseitigem Rendering ·
fetch/JSON gegen einzelne Endpunkte · ⟦serverseitiges Templating mit partiellen Updates?⟧⟧

**Entscheidung / Begründung / Konsequenzen:** ⟦…⟧

⟦Negative Konsequenz: Zustand und Berechnungslogik existieren nun teilweise doppelt —
im Browser und auf dem Server. Direkter Zusammenhang mit § 8.9 und der Frage, ob der Server
den Clientpreis nachrechnet. Erst schreiben, wenn das geklärt ist.⟧

---

## ADR-005: `pizza_data.json` als zentrale fachliche Datenquelle

**Status:** ⟦…⟧

**Kontext:** ⟦Optionen, Preise, kcal und Vorlagen mussten irgendwo liegen. Warum nicht in der
Datenbank, wo bereits eine Persistenz existiert? Das ist die Frage, die dieses ADR beantworten muss.⟧

**Alternativen:** ⟦JSON-Datei · Datenbanktabellen · fest im JavaScript-Code.⟧

**Entscheidung / Begründung / Konsequenzen:** ⟦…⟧

⟦Das Briefing nennt den Trade-off bereits: zentrale Pflege als Vorteil, Konsistenz zwischen
Client und Server als Nachteil. Konkret ausführen — wer liest die Datei, und was passiert,
wenn sich ein Preis ändert, nachdem eine Konfiguration gespeichert wurde? Werden historische
Preise mitgespeichert oder neu aufgelöst? Das ist aus `schema.sql` und `save_config.php`
ablesbar und macht den Unterschied zwischen einem generischen und einem echten ADR.⟧

---

## Weitere Kandidaten

⟦Das Briefing fordert 3–5 ADRs; fünf sind oben angelegt. Falls eines davon nicht trägt,
sind das mögliche Ersatzkandidaten — jeweils nur aufnehmen, wenn im Repository belegbar:⟧

- ⟦**Bootstrap 5.3 statt eigenem CSS-Framework** — trägt, falls die CDN-Frage (A11) daran hängt.⟧
- ⟦**Ein Endpunkt pro Aktion statt eines zentralen Controllers** — die Struktur unter `api/`
  ist eine bewusste oder unbewusste Entscheidung; falls bewusst, ist sie ein ADR wert.⟧
- ⟦**Preisberechnung im Browser** — falls das nicht schon in ADR-004 aufgeht, verdient es
  ein eigenes ADR, weil daran das Sicherheitsargument hängt.⟧
- ⟦**Kein Framework (Vanilla JS statt Vue/React)** — falls im Team tatsächlich erwogen.⟧

---

## Vor dem Schreiben zu klären

| # | Frage | Klären mit |
|---|-------|-----------|
| 1 | Welche Technologien waren vorgegeben, welche frei gewählt? | Team / Aufgabenstellung |
| 2 | Wurden Alternativen tatsächlich erwogen oder werden sie nachträglich eingeordnet? | Team |
| 3 | Sind ADRs bereits in A01–A04 angedeutet? Dann konsistent halten, nicht widersprechen. | `docs/arch/` |
| 4 | Werden Preise beim Speichern historisiert oder neu aufgelöst? | `schema.sql`, `save_config.php` |
| 5 | Werden Beläge/Extras relational oder als JSON abgelegt? | `schema.sql` |
| 6 | Existiert eine Namenskonvention für ADR-Dateien im Projekt? | `docs/arch/` |
