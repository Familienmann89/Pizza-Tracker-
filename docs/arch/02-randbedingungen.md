# 2 — Randbedingungen

Dieses Kapitel beschreibt die technischen, organisatorischen und projektweiten Randbedingungen des **Pizza Trackers**. Sie geben den Rahmen für die weitere Architektur vor und müssen bei Architekturentscheidungen sowie bei der Implementierung berücksichtigt werden.

Die projektspezifischen Grundlagen stammen insbesondere aus [`P1 — Ziele und Rahmenbedingungen`](../spec/P1-ziele-rahmenbedingungen.md) und [`N1 — Nichtfunktionale Anforderungen`](../spec/N1-nichtfunktional.md). Weitere organisatorische und formale Randbedingungen ergeben sich aus den Vorgaben des Moduls und der M3-Abgabe.

---

## 2.1 Technische Randbedingungen

| ID | Randbedingung | Beschreibung | Quelle |
|---|---|---|---|
| TECH-01 | PHP 8 | Die serverseitige Anwendungslogik des Pizza Trackers wird mit PHP 8 umgesetzt. | [P1](../spec/P1-ziele-rahmenbedingungen.md) |
| TECH-02 | JavaScript | Clientseitige Funktionen werden mit JavaScript umgesetzt. Dazu gehören insbesondere die unmittelbare Aktualisierung von Preis und Kalorien während der Pizza-Konfiguration. | [P1](../spec/P1-ziele-rahmenbedingungen.md), [F2](../spec/F2-anwendungsfaelle.md) |
| TECH-03 | Bootstrap 5.3 | Bootstrap 5.3 bildet die technische Grundlage für die Gestaltung der Benutzeroberfläche. | [P1](../spec/P1-ziele-rahmenbedingungen.md) |
| TECH-04 | MySQL / MariaDB | Die persistente Datenhaltung erfolgt mit MySQL beziehungsweise MariaDB. | [P1](../spec/P1-ziele-rahmenbedingungen.md) |
| TECH-05 | XAMPP / MAMP | Die Anwendung ist für den lokalen Betrieb mit XAMPP oder MAMP vorgesehen. | [P1](../spec/P1-ziele-rahmenbedingungen.md), [N1](../spec/N1-nichtfunktional.md) |
| TECH-06 | Webanwendung | Der Pizza Tracker wird als webbasierte Anwendung umgesetzt. Eine native Mobile-App gehört ausdrücklich nicht zum Projektumfang. | [P1](../spec/P1-ziele-rahmenbedingungen.md) |
| TECH-07 | Responsive Bedienung | Die Benutzeroberfläche muss sich an unterschiedliche Bildschirmgrößen anpassen und sowohl auf Desktop- als auch auf Mobilgeräten bedienbar sein. | NFA06 |
| TECH-08 | Browser-Kompatibilität | Die Anwendung soll in aktuellen Versionen gängiger Browser funktionieren. | NFA07 |
| TECH-09 | Lokaler Betrieb | Die Anwendung ist für den lokalen Betrieb ausgelegt. Ein produktiver Cloud- oder Serverbetrieb ist für den vorgesehenen Projektumfang nicht erforderlich. | NFA08 |
| TECH-10 | Git und GitHub | Git wird zur Versionskontrolle verwendet. Das Projekt-Repository wird auf GitHub geführt. | [P1](../spec/P1-ziele-rahmenbedingungen.md) |

Technische Details, die keine vorgegebenen Randbedingungen sind, sondern konkrete Architekturentscheidungen darstellen, werden nicht in diesem Kapitel vorweggenommen. Wesentliche Entscheidungen werden in Kapitel A09 als Architecture Decision Records dokumentiert.

---

## 2.2 Organisatorische Randbedingungen

| ID | Randbedingung | Beschreibung | Quelle |
|---|---|---|---|
| ORG-01 | Hochschulprojekt | Das Projekt wird im Rahmen des Moduls **WK_1106 — Wirtschaftsinformatik-Projekt I (Softwaretechnik)** durchgeführt. | Modulvorgabe |
| ORG-02 | Teamgröße | Die Entwicklung erfolgt durch eine Projektgruppe mit fünf Mitgliedern aus dem Studiengang Wirtschaftsinformatik B.Sc. | [P1](../spec/P1-ziele-rahmenbedingungen.md) |
| ORG-03 | Finale M3-Deadline | Die finale Abgabe muss spätestens am **25. September 2026** erfolgen. | [P1](../spec/P1-ziele-rahmenbedingungen.md), M3-Vorgabe |
| ORG-04 | Drei Bewertungsbereiche | Spezifikation, Architektur sowie Implementierung und Präsentation werden jeweils separat bewertet. Jeder Bereich muss mindestens 50 von 100 Punkten erreichen. | Modulvorgabe |
| ORG-05 | Gemeinsames Repository | Spezifikation, Architekturdokumentation und Quellcode werden gemeinsam versioniert im Projekt-Repository gepflegt. | M3-Vorgabe |
| ORG-06 | Kontinuierliche Git-Historie | Die Entwicklung soll über die gesamte Projektlaufzeit durch nachvollziehbare Commits dokumentiert sein. Beiträge mehrerer Gruppenmitglieder sollen in der Historie erkennbar sein. | M3-Vorgabe |
| ORG-07 | Finale Abgabe per Git-Tag | Der finale M3-Abgabestand wird durch einen **annotated Git-Tag** im Repository festgelegt. Bewertet wird der Stand des getaggten Commits. | M3-Vorgabe |
| ORG-08 | Abgabe-Mail | Die Projektleitung übermittelt zur M3-Abgabe Repository-URL, Tag-Name, Commit-SHA sowie die erforderlichen Angaben zur Mitgliederliste an den Betreuer. | M3-Vorgabe |
| ORG-09 | Nachvollziehbarkeit | Spezifikation, Architektur und Implementierung müssen miteinander übereinstimmen. Anforderungen sollen von der Spezifikation über die Architektur bis zum Code nachvollziehbar sein. | Modulvorgabe |
| ORG-10 | Lauffähige Endversion | Zum Zeitpunkt der finalen Abgabe muss eine lauffähige Version des Pizza Trackers im Repository vorhanden sein. | M3-Vorgabe |

---

## 2.3 Projektkonventionen

| ID | Konvention | Beschreibung | Quelle |
|---|---|---|---|
| CONV-01 | Siedersleben-Spezifikation | Die fachliche Spezifikation orientiert sich am Bausteinmodell nach Siedersleben und wird unter `docs/spec/` gepflegt. | Projektvorgabe |
| CONV-02 | arc42-Architektur | Die Softwarearchitektur orientiert sich am arc42-Template und wird unter `docs/arch/` dokumentiert. | Projektvorgabe |
| CONV-03 | Markdown | Spezifikation und Architekturdokumentation werden als Markdown-Dateien im Repository gespeichert. | M3-Vorgabe |
| CONV-04 | Conventional Commits | Commit-Nachrichten folgen dem Conventional-Commits-Schema `type(scope): description`, beispielsweise `docs(arch): add architecture constraints`. | M3-Vorgabe |
| CONV-05 | Versionierbare Diagramme | Diagramme werden so im Repository abgelegt, dass ihre Quellen erhalten und Änderungen nachvollziehbar bleiben. Mermaid-Diagramme können direkt in Markdown eingebettet werden. | M3-Vorgabe |
| CONV-06 | Konsistenz zwischen Spec, Architektur und Code | Anwendungsfälle und Anforderungen aus der Spezifikation müssen in der Architektur und in der tatsächlichen Implementierung nachvollziehbar wiederzufinden sein. | M3-Vorgabe |
| CONV-07 | Architecture Decision Records | Wesentliche Architekturentscheidungen werden als ADRs dokumentiert. Erwartet werden mindestens 3–5 nachvollziehbare Entscheidungen mit Kontext, Alternativen, Entscheidung, Begründung und Konsequenzen. | Architekturvorgabe |
| CONV-08 | Transparente KI-Nutzung | Eingesetzte KI-Werkzeuge und deren Verwendungszwecke werden sowohl in der Spezifikation als auch in der Architekturdokumentation offengelegt. KI-generierte Ergebnisse müssen von der Projektgruppe geprüft und verstanden werden. | M3-Vorgabe |
| CONV-09 | Keine Geheimnisse im Repository | Passwörter, API-Keys, Tokens, `.env`-Dateien mit Zugangsdaten und andere Geheimnisse dürfen nicht im Repository gespeichert werden. | Repository-Vorgabe |
| CONV-10 | Datenschutz | Matrikelnummern, private Telefonnummern und andere nicht erforderliche personenbezogene Daten der Gruppenmitglieder werden nicht im öffentlichen Repository gespeichert. | Repository-Vorgabe |
| CONV-11 | Verständlicher Entwicklungsstand | Jedes Gruppenmitglied muss die von ihm mitentwickelten beziehungsweise dokumentierten Bestandteile beim späteren Code-Walkthrough erklären können. | Präsentationsvorgabe |

---

## 2.4 Auswirkungen auf die Architektur

Aus den genannten Randbedingungen ergeben sich bereits grundlegende Leitplanken für die Architektur des Pizza Trackers:

- Die Anwendung wird als klassische Webanwendung auf Basis von **PHP 8, JavaScript und Bootstrap 5.3** umgesetzt.
- Persistente Daten werden mit **MySQL beziehungsweise MariaDB** gespeichert.
- Der vorgesehene Betrieb erfolgt lokal über **XAMPP oder MAMP**.
- Die Benutzeroberfläche muss sowohl auf Desktop- als auch auf Mobilgeräten nutzbar sein.
- Die Architektur muss eine klare Zuordnung zwischen den Anforderungen aus der Spezifikation und den späteren Komponenten der Implementierung ermöglichen.
- Wesentliche technische Entscheidungen werden nicht nur im Code getroffen, sondern zusätzlich durch ADRs nachvollziehbar begründet.
- Dokumentation und Implementierung werden gemeinsam über Git versioniert und bilden zum M3-Zeitpunkt einen konsistenten Abgabestand.

Konkrete Architekturentscheidungen, beispielsweise zur Struktur des PHP-Codes, zur Datenbankanbindung oder zur Aufteilung der Anwendungsbestandteile, werden in den folgenden Architekturkapiteln erläutert und in den ADRs begründet.
