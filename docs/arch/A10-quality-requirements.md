# 10 Qualitätsanforderungen

> **STATUS: GERÜST — NOCH KEINE DOKUMENTATION.**
> Übernommen wurden die Zweiteilung (Übersicht + Szenarien), die Priorisierung und die
> Unterscheidung Nutzungs-/Änderungsszenario aus dem Herold-Beispiel.
> **Angepasst:** Messkriterien müssen hier manuell prüfbar sein — es gibt keine automatisierten
> Tests, auf die verwiesen werden könnte.
> Alle ⟦…⟧-Stellen sind zu belegen.

Dieses Kapitel sammelt die Qualitätsanforderungen, die die Architektur über die Qualitätsziele
aus [§ 1.2](A01-einfuehrung-und-ziele.md) hinaus prägen. ⟦Dateiname und Abschnittsnummer von
A01 prüfen.⟧

> ⟦**Zuerst A01 lesen.** Die dort genannten Qualitätsziele sind verbindlich. Dieses Kapitel
> verfeinert sie und erfindet keine neuen. Falls A01 andere Ziele nennt als die sieben unten
> aus dem Briefing: A01 hat Vorrang, Abweichung im Konsistenzcheck festhalten.⟧

---

## 10.1 Qualitätsbaum

⟦Priorisierung: **A** — architekturprägend, ein Verfehlen entwertet eine Architekturentscheidung;
**B** — verbindlich, aber lokal umsetzbar; **C** — wünschenswert.
Nicht alle sieben Kategorien sind A. Ehrlich einstufen — eine Tabelle mit sieben A-Anforderungen
sagt nichts aus.⟧

| Kategorie (ISO 25010) | Anforderung | Priorität | Qualitätsziel (A01) | Realisiert durch |
|-----------------------|-------------|-----------|---------------------|------------------|
| **Funktionale Korrektheit** | Gleiche Konfiguration ergibt konsistente Preisberechnung | ⟦A?⟧ | ⟦QZ-…⟧ | ⟦§ 8.9, § 8.2⟧ |
| **Sicherheit** | Fremde Konfigurationen sind serverseitig nicht löschbar | ⟦A⟧ | ⟦QZ-…⟧ | [§ 8.6](A08-querschnittliche-konzepte.md#86-autorisierung) |
| | ⟦Passwörter nur als Hash gespeichert⟧ | ⟦B⟧ | ⟦…⟧ | [§ 8.7](A08-querschnittliche-konzepte.md#87-passwortschutz) |
| | ⟦SQL-Injection ausgeschlossen (Prepared Statements)⟧ | ⟦B⟧ | ⟦…⟧ | [§ 8.8](A08-querschnittliche-konzepte.md#88-datenbankzugriff) |
| **Benutzbarkeit** | Preis und kcal aktualisieren sich unmittelbar bei Auswahl | ⟦B⟧ | ⟦…⟧ | ⟦§ 6.4, ADR-004⟧ |
| **Performance** | Neuberechnung ohne vollständigen Seitenreload | ⟦B⟧ | ⟦…⟧ | ⟦ADR-004⟧ |
| **Wartbarkeit** | Pizza-Optionen zentral über `pizza_data.json` pflegbar | ⟦A⟧ | ⟦…⟧ | [§ 8.2](A08-querschnittliche-konzepte.md#82-zentrale-fachdaten--pizza_datajson), ADR-005 |
| **Kompatibilität** | Nutzbar in gängigen modernen Browsern, verschiedene Bildschirmgrößen | ⟦B⟧ | ⟦…⟧ | [§ 8.11](A08-querschnittliche-konzepte.md#811-responsive-ui) |
| **Betreibbarkeit** | Nachvollziehbare lokale Inbetriebnahme mit XAMPP | ⟦B⟧ | ⟦…⟧ | [§ 7.3](A07-verteilungssicht.md#73-inbetriebnahme) |

**Bewusst nicht enthalten.** ⟦Herold benennt weggelassene Zweige samt Begründung — das ist
wirksam gegen den Eindruck, etwas übersehen zu haben. Kandidaten für euch:
Barrierefreiheit, Internationalisierung, Skalierbarkeit/Lastverhalten, Verfügbarkeit,
Datenschutz/DSGVO. Je einen Halbsatz mit Begründung, nicht mehr.
Aber nur schreiben, wenn es tatsächlich eine bewusste Entscheidung war.⟧

---

## 10.2 Qualitätsszenarien

**U** = Nutzungsszenario, **Ä** = Änderungsszenario.

⟦Jedes Szenario braucht laut Briefing: Auslöser, Umgebung, erwartete Reaktion, prüfbares
Kriterium. Die Tabellenform unten deckt das ab — „Kontext/Auslöser" enthält beides.
**Prüfregel für jedes Kriterium: Könnte ein Kommilitone es in unter fünf Minuten ohne
Vorwissen nachprüfen?** Wenn nein, ist es kein Kriterium, sondern ein Wunsch.⟧

| ID | Art | Kontext / Auslöser | Erwartete Reaktion | Prüfbares Kriterium |
|----|-----|--------------------|--------------------|---------------------|
| QS-01 | U | ⟦Dieselbe Konfiguration wird zweimal zusammengestellt und gespeichert.⟧ | ⟦…⟧ | ⟦Beide Datensätze weisen denselben Preis aus. Prüfbar per SELECT.⟧ |
| QS-02 | U | ⟦Angemeldeter Nutzer A sendet eine Löschanfrage mit der ID einer Konfiguration von Nutzer B — z. B. über die Entwicklerkonsole.⟧ | ⟦Server lehnt ab; Datensatz bleibt bestehen.⟧ | ⟦HTTP-Status ⟦…⟧; Zeile in `konfigurationen` unverändert. Manuell nachstellbar.⟧ |
| QS-03 | U | ⟦Client sendet beim Speichern einen manipulierten Preis.⟧ | ⟦…⟧ | ⟦**Erst formulieren, wenn § 8.9 geklärt ist.** Falls der Server nicht nachrechnet, gehört dieses Szenario nicht hierher, sondern als Befund nach A11 — ein Szenario, das der Code nicht erfüllt, darf nicht als erfüllt dokumentiert werden.⟧ |
| QS-04 | U | ⟦Nutzer wählt im Konfigurator eine zusätzliche Zutat.⟧ | ⟦Preis und kcal aktualisieren sich ohne Seitenwechsel.⟧ | ⟦Anzeige aktualisiert, ohne dass im Netzwerk-Tab ein Dokument-Request erscheint. Gute Kriterien sind beobachtbar, nicht gefühlt.⟧ |
| QS-05 | U | ⟦Nicht angemeldeter Besucher ruft einen geschützten Endpunkt direkt auf.⟧ | ⟦…⟧ | ⟦…⟧ |
| QS-06 | U | ⟦Anwendung wird auf ⟦Breite⟧ px dargestellt.⟧ | ⟦…⟧ | ⟦Bedienbar ohne horizontales Scrollen; welche Browser wurden tatsächlich geprüft? Nur die nennen.⟧ |
| QS-07 | Ä | ⟦Eine neue Zutat mit Preis und kcal soll aufgenommen werden.⟧ | ⟦Ein Eintrag in `pizza_data.json`; Konfigurator zeigt sie an, Preis rechnet mit.⟧ | ⟦Null Änderungen an HTML-, JS- oder PHP-Dateien. **Vor dem Schreiben ausprobieren** — falls die Zutat auch im HTML stehen muss, ist das Wartbarkeitsziel nicht erfüllt und der Befund gehört nach A11.⟧ |
| QS-08 | Ä | ⟦Ein Preis wird in `pizza_data.json` geändert, nachdem Konfigurationen gespeichert wurden.⟧ | ⟦…⟧ | ⟦Ändert sich der Preis alter Konfigurationen rückwirkend? Beides ist ein legitimes Ergebnis, aber es muss dokumentiert und gewollt sein. Siehe ADR-005.⟧ |
| QS-09 | Ä | ⟦Das Projekt wird auf einem fremden Rechner in Betrieb genommen.⟧ | ⟦…⟧ | ⟦In unter ⟦X⟧ Minuten lauffähig, ausschließlich anhand der README. **Einmal von jemandem ausprobieren lassen, der es nicht gebaut hat** — das ist der einzige ehrliche Test für Betreibbarkeit.⟧ |
| QS-10 | U | ⟦Ungültiger oder abgelaufener Gutscheincode wird eingegeben.⟧ | ⟦…⟧ | ⟦…⟧ |

**Rückverfolgbarkeit.** ⟦Nach der Szenarientabelle ein bis zwei Sätze: Welches Szenario belegt
welches Qualitätsziel aus A01? Herold macht das am Kapitelende und es kostet zwei Zeilen.⟧

---

## Was noch zu klären ist

| # | Frage | Quelle |
|---|-------|--------|
| 1 | Welche Qualitätsziele nennt A01 § 1.2 genau? | `docs/arch/A01-…` |
| 2 | Enthält `docs/spec/` einen NFR-Katalog mit Messkriterien? | `docs/spec/` |
| 3 | Rechnet der Server den Preis nach? (entscheidet über QS-03) | `api/save_config.php` |
| 4 | Funktioniert QS-07 tatsächlich ohne Codeänderung? | ausprobieren |
| 5 | Werden Preise historisiert? (entscheidet über QS-08) | `schema.sql` |
| 6 | Welche Browser wurden tatsächlich geprüft? | Team |
| 7 | Existiert eine README mit Inbetriebnahme? | Repo-Wurzel |
