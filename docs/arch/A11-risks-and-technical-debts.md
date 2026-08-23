# 11 Risiken und technische Schulden

> **STATUS: GERÜST — NOCH KEINE DOKUMENTATION.**
> Übernommen wurde die Dreiteilung des Herold-Beispiels (Risiken / technische Schulden /
> Nicht-Risiken) und der Sammeleintrag für Spec-Code-Abweichungen.
> **Ergänzt gegenüber Herold:** Spalten für Eintrittswahrscheinlichkeit und Schadenshöhe —
> das Briefing fordert beide, Herolds Tabelle hat sie nicht.
> Alle ⟦…⟧-Stellen sind aus dem Code zu belegen.

Aufgenommen wird nur, was im aktuellen Code bestätigt ist. Bewusst getroffene Abwägungen stehen
als ADR in [Kapitel 9](A09-architekturentscheidungen.md) und werden hier nicht wiederholt —
außer wenn ein Restrisiko bleibt.

> **Abgrenzung der drei Abschnitte.** Ein **Risiko** kann eintreten und hat einen Auslöser.
> Eine **technische Schuld** besteht bereits und kostet später Aufwand. Ein **Nicht-Risiko** ist
> eine bewusste Entscheidung, die regelmäßig für einen Mangel gehalten wird.
> ⟦Die sieben Punkte aus dem Briefing verteilen sich auf alle drei Abschnitte — Zuordnung unten
> vorgeschlagen, im Team prüfen.⟧

---

## 11.1 Risiken

| ID | Risiko | Ursache / Auslöser | Auswirkung | Wahrsch. | Schaden | Gegenmaßnahme | Status |
|----|--------|--------------------|------------|----------|---------|---------------|--------|
| R-01 | **Bootstrap wird per CDN geladen** ⟦nur aufnehmen, falls im HTML bestätigt⟧ | ⟦Kein Internetzugang bei Präsentation oder Bewertung; CDN nicht erreichbar⟧ | ⟦Layout bricht vollständig; Anwendung wirkt defekt, obwohl die Logik funktioniert⟧ | ⟦mittel⟧ | ⟦hoch — betrifft ausgerechnet die Vorführsituation⟧ | ⟦Bootstrap lokal unter `css/` bzw. `js/` ablegen und einbinden⟧ | ⟦offen⟧ |
| R-02 | **„Erneut bearbeiten" legt einen neuen Datensatz statt eines UPDATE an** ⟦verifizieren⟧ | ⟦`konfigurator.js` sendet beim Speichern immer an denselben Endpunkt ohne ID⟧ | ⟦Duplikate in „Meine Pizzen"; Nutzer verliert den Überblick⟧ | ⟦…⟧ | ⟦…⟧ | ⟦ID mitführen und serverseitig zwischen INSERT und UPDATE unterscheiden⟧ | ⟦…⟧ |
| R-03 | ⟦**Preis wird nicht serverseitig nachgerechnet** — nur aufnehmen, falls in § 8.9 bestätigt⟧ | ⟦Manipulierter Request über die Entwicklerkonsole⟧ | ⟦Beliebiger Preis speicherbar⟧ | ⟦niedrig im lokalen Betrieb⟧ | ⟦gering — kein Zahlungsvorgang, keine echten Bestellungen⟧ | ⟦Serverseitige Neuberechnung aus `pizza_data.json`⟧ | ⟦…⟧ |
| R-04 | ⟦**Zugangsdaten im Repository** — nur falls zutreffend⟧ | ⟦`config/database.php` eingecheckt⟧ | ⟦…⟧ | ⟦…⟧ | ⟦realistisch einschätzen: XAMPP-Standardzugang ist kein Produktionsgeheimnis, aber schlechte Praxis⟧ | ⟦…⟧ | ⟦…⟧ |
| R-05 | ⟦**Sensible Dateien unterhalb des DocumentRoot erreichbar** — prüfen: sind `database/schema.sql`, `config/` per URL abrufbar?⟧ | ⟦Fehlende `.htaccess`-Regeln⟧ | ⟦…⟧ | ⟦…⟧ | ⟦…⟧ | ⟦…⟧ | ⟦…⟧ |

⟦Weitere Kandidaten nur aufnehmen, wenn im Code belegt. Ein knappes, belegtes Kapitel ist
besser als eine lange Liste plausibler Vermutungen — das Briefing verlangt ausdrücklich
„nur Risiken, die im aktuellen Code bestätigt werden".⟧

**Hinweis zur Einschätzung.** ⟦Wahrscheinlichkeit und Schaden im Kontext eines lokal
betriebenen Hochschulprojekts bewerten, nicht im Kontext eines Onlineshops. Ein
SQL-Injection-Befund wäre hier trotzdem hoch einzustufen; ein fehlendes TLS dagegen nicht,
weil die Anwendung nie im Netz steht. Diese Einordnung offen begründen — sie zeigt, dass
verstanden wurde, was tatsächlich auf dem Spiel steht.⟧

---

## 11.2 Technische Schulden

| ID | Schuld | Warum es eine Schuld ist | Tilgungsweg |
|----|--------|--------------------------|-------------|
| S-01 | **Keine automatisierten Tests** | ⟦Regressionen werden nur manuell entdeckt; jede Änderung erfordert erneutes Durchklicken aller Abläufe. Mit acht Endpunkten und fünf Seiten ist das noch machbar — genau das ist die Begründung, warum es akzeptiert wurde.⟧ | ⟦Für ein Projekt dieser Größe und Laufzeit bewusst akzeptiert; bei Fortführung zuerst die Preisberechnung testen, weil dort die Fachlogik konzentriert ist.⟧ |
| S-02 | **Einfache PHP-Struktur ohne Framework** | ⟦Jeder Endpunkt bringt Session-Prüfung, Validierung und Fehlerbehandlung selbst mit — Wiederholung, die auseinanderlaufen kann. Konkret belegen: Wie oft steht dieselbe Prüfung im Code?⟧ | ⟦Gemeinsame Helfer in `config/helpers.php` ausbauen; Framework wäre erst bei deutlichem Wachstum verhältnismäßig — Verweis auf ADR-001.⟧ |
| S-03 | ⟦**Beläge/Extras als JSON-Spalte** — nur falls in `schema.sql` bestätigt⟧ | ⟦Auswertungen wie „meistgewählter Belag" erfordern JSON-Funktionen oder Auswertung in PHP statt eines einfachen GROUP BY. Die relationale Entscheidung aus ADR-002 ist an dieser Stelle nicht durchgehalten.⟧ | ⟦Zwischentabelle `konfiguration_belag`; Aufwand: Migration plus Anpassung von zwei Endpunkten.⟧ |
| S-04 | **Spec-/Code-Abweichungen** ⟦Sammeleintrag — hier landen die Funde aus dem Konsistenzcheck⟧ | ⟦Auseinanderlaufende Dokumente führen bei künftigen Änderungen genau an den tragenden Stellen in die Irre. Als Unterpunkte (a), (b), (c) … führen, jeweils mit Verweis auf das betroffene Kapitel.⟧ | ⟦Je Punkt entscheiden: Spec anpassen oder Code anpassen. Bis dahin gilt die Architekturdokumentation als codegetreue Referenz.⟧ |
| S-05 | ⟦**Uneinheitliches API-Antwortformat** — nur falls in § 8.3 festgestellt⟧ | ⟦…⟧ | ⟦…⟧ |

⟦S-04 erst am Ende füllen, nach dem Konsistenzcheck. Erwartete Kandidaten nach heutigem Stand:
serverseitige Preisberechnung, „Erneut bearbeiten", Begriffs- oder Tabellennamen, die zwischen
Spec und Code abweichen.⟧

---

## 11.3 Nicht-Risiken

⟦Bewusste Entscheidungen, die regelmäßig für Mängel gehalten werden. Dieser Abschnitt nimmt
Rückfragen in der mündlichen Prüfung vorweg — je ein bis zwei Sätze mit Begründung.⟧

- **Kein produktiver Internetbetrieb.** ⟦Lokales XAMPP-Deployment ist der vereinbarte
  Projektrahmen, kein Versäumnis. Fehlendes TLS, fehlende Härtung und fehlende Skalierung
  folgen daraus und sind deshalb hier keine Risiken. Verweis auf [Kapitel 7](A07-verteilungssicht.md).⟧
- **Vereinfachte Pizza-Vorschau.** ⟦Die grafische Darstellung ist bewusst schematisch;
  fotorealistisches Rendering war nie Ziel. Verweis auf die Zielabgrenzung in A01 ⟦prüfen,
  ob dort so formuliert⟧.⟧
- **Keine Skalierung / kein Lastverhalten.** ⟦Ein Nutzer auf einem lokalen Rechner.⟧
- ⟦**Keine echte Bestellabwicklung.** Falls die Spec das ausschließt: hier benennen, sonst streichen.⟧

---

## Was noch aus dem Repository belegt werden muss

| # | Offene Frage | Quelle |
|---|--------------|--------|
| 1 | Bootstrap per CDN oder lokal? | HTML-`<head>` |
| 2 | „Erneut bearbeiten": UPDATE oder INSERT? | `konfigurator.js`, `api/save_config.php` |
| 3 | Serverseitige Preisneuberechnung? | `api/save_config.php` |
| 4 | Beläge/Extras relational oder JSON? | `database/schema.sql` |
| 5 | Zugangsdaten eingecheckt? `.gitignore` wirksam? | Repo-Wurzel, `config/` |
| 6 | `config/`, `database/` per URL erreichbar? | `.htaccess`, Ordnerstruktur |
| 7 | Wie oft wiederholt sich dieselbe Session-/Validierungslogik? | alle `api/*.php` |
| 8 | Einheitliches Antwortformat? | alle `api/*.php` |
| 9 | Ergebnisse des Konsistenzchecks (→ S-04) | Abschluss der Doku |
