# 12 Glossar

> **STATUS: GERÜST — NOCH KEINE DOKUMENTATION.**
> Übernommen wurde das Prinzip des Herold-Beispiels: **Domänenbegriffe bleiben im Spec-Glossar
> und werden hier nicht wiederholt**; definiert wird das Architektur- und Implementierungs-
> vokabular. Jeder Eintrag verweist auf die Stelle im Projekt, an der der Begriff wirksam wird.
> Alle ⟦…⟧-Stellen sind zu belegen.

> ⟦**Zuerst klären:** Existiert in `docs/spec/` ein Glossar? Falls ja, den einleitenden Satz
> analog zu Herold formulieren — welche Begriffe dort kanonisch sind — und diese hier
> weglassen statt abweichend zu wiederholen. Falls nein, alle Begriffe hier führen und das
> im Konsistenzcheck vermerken.⟧

**Regel für jeden Eintrag:** Nicht erklären, was der Begriff allgemein bedeutet, sondern was er
**in diesem Projekt** bezeichnet — mit Datei-, Tabellen- oder Kapitelverweis.
⟦Ein Eintrag ohne Projektbezug ist ein Wörterbucheintrag und gehört gestrichen.⟧

---

## Fachliche Begriffe

⟦Diese drei sind Domänenbegriffe. **Wenn das Spec-Glossar sie definiert: hier streichen und
oben referenzieren.** Nur aufnehmen, falls die Spec sie nicht führt.⟧

| Begriff | Definition |
|---------|------------|
| **Konfiguration** | ⟦Eine vom Nutzer zusammengestellte Pizza. Persistiert in Tabelle ⟦Name⟧; Felder ⟦…⟧. Abgrenzung zur „Vorlage" hier ausdrücklich benennen — die Begriffe werden sonst verwechselt.⟧ |
| **Pizza-Vorlage** | ⟦Vordefinierte Ausgangskonfiguration aus `data/pizza_data.json`, über ⟦URL-Parameter⟧ in den Konfigurator geladen. Nicht in der Datenbank gespeichert ⟦prüfen⟧.⟧ |
| **Gutschein** | ⟦Rabattcode; geprüft durch `api/coupon.php` gegen Tabelle `gutscheine`. Welche Rabattarten gibt es — prozentual, absolut?⟧ |

## Architektur- und Implementierungsbegriffe

| Begriff | Definition |
|---------|------------|
| **API** | ⟦In diesem Projekt: die Menge der JSON-Endpunkte unter `api/`. Kein öffentliches Interface für Dritte — Abgrenzung wichtig.⟧ |
| **API-Endpunkt** | ⟦Eine einzelne PHP-Datei unter `api/`, die einen fachlichen Vorgang bearbeitet und JSON zurückgibt. Aktuell ⟦Anzahl⟧ Stück — Aufzählung oder Verweis auf § 5.1.3.⟧ |
| **Authentifizierung** | ⟦Nachweis der Identität durch Nutzername/E-Mail und Passwort; realisiert in `api/login.php`. Verweis auf § 8.5.⟧ |
| **Autorisierung** | ⟦Prüfung, ob ein angemeldeter Nutzer eine Aktion auf einer bestimmten Ressource ausführen darf — hier: nur auf eigenen Konfigurationen. Verweis auf § 8.6. Der Unterschied zu „Authentifizierung" ist prüfungsrelevant, deshalb hier klar trennen.⟧ |
| **Backend** | ⟦Serverseitig ausgeführter Anteil: PHP unter `api/` und `config/`. Verweis auf § 5.1.3.⟧ |
| **Bootstrap** | ⟦CSS-Framework in Version 5.3; liefert Grid und Komponenten der Oberfläche. Eingebunden ⟦per CDN / lokal⟧. Verweis auf § 8.11 und ggf. das CDN-Risiko in A11.⟧ |
| **Client** | ⟦Der Browser des Nutzers. Abgrenzung zu „Frontend": Client ist die Laufzeitumgebung, Frontend der dort ausgeführte Code.⟧ |
| **CRUD** | ⟦Create, Read, Update, Delete. Im Pizza Tracker auf Konfigurationen angewandt — **prüfen, ob Update tatsächlich existiert** (siehe „Erneut bearbeiten" in A11). Falls nicht, hier ehrlich vermerken: CR_D.⟧ |
| **Datenbank** | ⟦Die MariaDB-Datenbank ⟦Name⟧ mit den Tabellen ⟦…⟧, angelegt aus `database/schema.sql`.⟧ |
| **Frontend** | ⟦Im Browser ausgeführter Anteil: HTML-Seiten, `css/style.css`, `js/*.js`. Verweis auf § 5.1.1 und § 5.1.2.⟧ |
| **HTTP** | ⟦Das Protokoll zwischen Browser und Apache. Im lokalen Betrieb ohne TLS ⟦prüfen⟧ — Verweis auf Kapitel 7.⟧ |
| **JSON** | ⟦Datenformat in zwei Rollen, die nicht verwechselt werden dürfen: Austauschformat der API **und** Speicherformat der Fachdaten in `pizza_data.json` ⟦sowie ggf. Spaltenformat für Beläge⟧.⟧ |
| **MariaDB** | ⟦Das im XAMPP-Paket enthaltene relationale Datenbanksystem, MySQL-kompatibel. Verweis auf ADR-002 und Kapitel 7.⟧ |
| **PDO** | ⟦PHP Data Objects — die Datenbankschnittstelle, über die `config/database.php` die Verbindung herstellt. Ermöglicht Prepared Statements. Verweis auf § 8.8.⟧ |
| **PHP Session** | ⟦Serverseitiger Sitzungsspeicher; hält nach dem Login ⟦welche Werte? `user_id`?⟧. Der Browser hält nur die Session-ID im Cookie. Verweis auf § 8.5.⟧ |
| **Prepared Statement** | ⟦Vorbereitete SQL-Anweisung mit Platzhaltern; Werte werden getrennt übergeben, wodurch SQL-Injection ausgeschlossen wird. Verweis auf § 8.8.⟧ |
| **Repository** | ⟦Hier ausschließlich im Sinne von Git-Repository — **nicht** das Entwurfsmuster „Repository Pattern". Diese Klarstellung gehört hin, weil der Begriff in Architekturdokumenten meist anders gemeint ist.⟧ |
| **Session** | ⟦Siehe „PHP Session". Falls beide Einträge dasselbe meinen: einen streichen. Doppelte Einträge mit leicht abweichender Definition sind der häufigste Glossarfehler.⟧ |
| **sessionStorage** | ⟦Browserseitiger Speicher, der beim Schließen des Tabs geleert wird. **Nur aufnehmen, wenn im Code tatsächlich verwendet** — dann mit Angabe, wofür (z. B. Vorlagenübergabe). Falls nicht verwendet: streichen und im Konsistenzcheck vermerken, dass das Briefing ihn nennt, das Projekt ihn aber nicht nutzt.⟧ |
| **SQL** | ⟦Abfragesprache der Datenbank; im Projekt in `database/schema.sql` und in den Endpunkten unter `api/`.⟧ |
| **XAMPP** | ⟦Lokales Paket aus Apache, PHP und MariaDB; die einzige Ausführungsumgebung des Projekts. Verweis auf Kapitel 7.⟧ |

---

## Prüfpunkte vor dem Abschluss

| # | Frage | Quelle |
|---|-------|--------|
| 1 | Existiert ein Spec-Glossar? Welche Begriffe sind dort kanonisch? | `docs/spec/` |
| 2 | Weicht eine Definition hier von der Spec ab? | Abgleich |
| 3 | Wird `sessionStorage` tatsächlich verwendet? | `js/*.js` |
| 4 | Existiert eine Update-Funktion für Konfigurationen? (→ CRUD) | `api/save_config.php` |
| 5 | Heißen die Tabellen im Glossar genauso wie in `schema.sql`? | `database/schema.sql` |
| 6 | Werden „Konfiguration" und „Vorlage" in A05–A11 durchgängig so verwendet? | eigene Kapitel |
| 7 | Tauchen in A05–A11 Begriffe auf, die hier fehlen? | eigene Kapitel |
