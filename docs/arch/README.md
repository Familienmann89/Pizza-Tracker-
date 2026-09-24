# Pizza Tracker — Architekturdokumentation

Die Architektur des Pizza Trackers ist nach dem [arc42-Template](https://arc42.org/) gegliedert. Die fachliche Grundlage ist die Spezifikation unter [`../spec/`](../spec/README.md).

## Kapitelübersicht

| Nr. | Kapitel | Datei |
|---|---|---|
| 1 | Einführung und Ziele | [01-einfuehrung-ziele.md](01-einfuehrung-ziele.md) |
| 2 | Randbedingungen | [02-randbedingungen.md](02-randbedingungen.md) |
| 3 | Kontext und Abgrenzung | [A03-kontext-und-abgrenzung.md](A03-kontext-und-abgrenzung.md) |
| 4 | Lösungsstrategie | [A04-loesungsstrategie.md](A04-loesungsstrategie.md) |
| 5 | Bausteinsicht | [A05 - Bausteinsicht.md](A05%20-%20Bausteinsicht.md) |
| 6 | Laufzeitsicht | [A06 - Laufzeitsicht.md](A06%20-%20Laufzeitsicht.md) |
| 7 | Verteilungssicht | [A07-deployment-view.md](A07-deployment-view.md) |
| 8 | Querschnittliche Konzepte | [A08-cross-cutting-concepts.md](A08-cross-cutting-concepts.md) |
| 9 | Architekturentscheidungen (ADRs) | [A09-architecture-decisions.md](A09-architecture-decisions.md) |
| 10 | Qualitätsanforderungen | [A10-quality-requirements.md](A10-quality-requirements.md) |
| 11 | Risiken und technische Schulden | [A11-risks-and-technical-debts.md](A11-risks-and-technical-debts.md) |
| 12 | Glossar | [A12-glossary.md](A12-glossary.md) |

## Quellen

- arc42 — Template für Architekturdokumentation, <https://arc42.org/>
- Starke, G.; Hruschka, P.: *Software-Architektur kompakt*. Springer Vieweg (Blackbox-/Whitebox-Vorlagen in Kapitel 5)
- Modulunterlagen WK_1106, SS 2026: <https://github.com/carstenlucke/thm_wkb_wk-1106>

## Eingesetzte KI-Werkzeuge

| Werkzeug | Wofür in der Architekturdokumentation | Wie geprüft |
|---|---|---|
| Claude (claude.ai) | Entwürfe und Überarbeitung der Kapitel; Abgleich der Aussagen mit dem Quellcode; Mermaid-Diagrammentwürfe | Aussagen wurden von der Gruppe gegen die genannten Dateien und Funktionen im Code geprüft. Wo der Code von der Beschreibung abwich, wurde die Beschreibung korrigiert oder die Abweichung in Kapitel 11 als Risiko festgehalten. |
| ChatGPT/Codex | Codeanalyse, Fehlersuche und Review-Hinweise; Überarbeitung der Kapitel 1 bis 5 | Aussagen und Hinweise wurden am Code nachvollzogen, bevor sie übernommen wurden. |
| GitHub Copilot | Code-Vervollständigung während der Implementierung | Vorschläge wurden vor der Übernahme gelesen und angepasst. |

Automatisierte Tests gibt es nicht. Bisher belegt sind nur statische Prüfungen: Die JavaScript-Dateien bestehen `node --check`, und `data/pizza_data.json` ist syntaktisch gültiges JSON. Funktionstests mit PHP und Datenbank werden im Testprotokoll dokumentiert; die Qualitätsszenarien in Kapitel 10 sind Prüfkriterien, keine bestandenen Tests.

Jedes Gruppenmitglied muss Code und Dokumentation erklären können, auch die von KI unterstützten Teile (siehe [Kapitel 2](02-randbedingungen.md), CONV-08 und CONV-11).
