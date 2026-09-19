# 12 Glossar

Domänenbegriffe — was der Pizza Tracker fachlich tut — sind bereits in
[E2 — Glossar](../spec/E2-glossar.md) definiert und werden hier **nicht** wiederholt. Dieses
Kapitel führt ausschließlich Architektur- und Implementierungsvokabular: Begriffe, die
beschreiben, **wie** das System technisch aufgebaut ist, nicht **was** es fachlich tut.

**Regel für jeden Eintrag:** Nicht erklärt wird, was ein Begriff allgemein bedeutet, sondern was
er **in diesem Projekt** bezeichnet — mit Datei-, Tabellen- oder Kapitelverweis.

> **Grundlage:** Alle Verweise auf Dateien und Funktionen sind aus dem Code des Branches `main`,
> Commit `619acf4a4fb4d81b9e78fa133e6c9ecf135fa65b`, geprüft. Verweise auf § 8.x zeigen auf
> Abschnitte, die als Überschrift bereits in [Kapitel 8](A08-cross-cutting-concepts.md) existieren;
> deren Inhalt ist noch nicht ausgearbeitet (Person 3). Verweise auf ADR-Nummern zeigen entsprechend
> auf [Kapitel 9](A09-architecture-decisions.md).

---

## Domänenbegriffe — bereits in E2 definiert

Die folgenden Begriffe sind fachlicher Natur und werden ausschließlich in
[E2 — Glossar](../spec/E2-glossar.md) geführt: **Konfiguration**, **Vorlage**, **Gutscheincode**,
**Belag**, **Sauce**, **Teigart**, **Gast**, **kcal**. Eine zweite, hier abweichende Definition
würde zu genau der Art von Widerspruch führen, vor der die Kursvorgaben warnen. Eine architektonisch
relevante Ergänzung zu zweien dieser Begriffe:

- **Konfiguration vs. Vorlage:** Eine *Vorlage* (`vorlagen` in `data/pizza_data.json`) ist nie in
  der Datenbank gespeichert — sie ist nur der Ausgangszustand, mit dem der Konfigurator vorbefüllt
  wird. Erst wenn ein angemeldeter Nutzer speichert, entsteht eine *Konfiguration* als Datensatz in
  der Tabelle `konfigurationen`. Die beiden Begriffe bezeichnen also unterschiedliche Lebensphasen
  derselben fachlichen Sache, nicht dieselbe.
- **Gutscheincode vs. Gutschein:** E2 definiert den *Gutscheincode* als den Code selbst. Wenn dieses
  und andere Architekturkapitel von einem *Gutschein* sprechen, ist damit derselbe Datensatz aus der
  Tabelle `gutscheine` gemeint (Code **und** Rabattprozentsatz), nicht ein zweiter Begriff.

## Architektur- und Implementierungsbegriffe

| Begriff | Definition |
|---------|------------|
| **API** | Die Menge der acht JSON-Endpunkte unter `api/` (§ 5.1.3), über die Browserlogik und Backend/API Daten austauschen. Kein öffentliches Interface für Dritte: Die API wird ausschließlich von der eigenen Browserlogik desselben Projekts aufgerufen. |
| **API-Endpunkt** | Eine einzelne PHP-Datei unter `api/`, die genau einen fachlichen Vorgang bearbeitet und mit JSON antwortet. Es gibt acht: `session.php`, `login.php`, `logout.php`, `register.php`, `coupon.php`, `save_config.php`, `load_configs.php`, `delete_config.php` (§ 5.2.2). |
| **Authentifizierung** | Der Nachweis der Identität durch E-Mail und Passwort, realisiert in `api/login.php` (Prüfung mit `password_verify()`) und `api/register.php` (Anlage mit `password_hash()`). Nach Erfolg wird die Session-ID mit `session_regenerate_id(true)` erneuert. Ausgearbeitet in § 8.5. |
| **Autorisierung** | Die Prüfung, ob eine bereits authentifizierte Person eine bestimmte Aktion auf einer bestimmten Ressource ausführen darf. Im Pizza Tracker konkret: Ein Nutzer darf gespeicherte Konfigurationen nur einsehen, erneut laden oder löschen, wenn sie ihm gehören. Durchgesetzt wird das direkt in der SQL-Bedingung, z. B. `WHERE id = :id AND user_id = :user_id` in `delete_config.php` — nicht durch eine vorgelagerte, separate Prüfung. **Unterschied zur Authentifizierung:** Authentifizierung stellt fest, *wer* jemand ist; Autorisierung, *was* diese Person tun darf. Ausgearbeitet in § 8.6. |
| **Backend** | Der serverseitig ausgeführte Anteil der Anwendung: die acht Endpunkte unter `api/` sowie `config/database.php` und `config/helpers.php`. Entspricht den Bausteinen „Backend/API“ und „Gemeinsame Serverlogik“ aus § 5.1.3 f. |
| **Bootstrap** | CSS- und JavaScript-Framework, konkret Version **5.3.3**, eingebunden in allen fünf HTML-Seiten über das CDN `cdn.jsdelivr.net`. Für die Definition des Begriffs selbst siehe [E2](../spec/E2-glossar.md); hier ergänzend die konkrete Version und Einbindungsart, weil beide für § 7.1 (Verteilungssicht) und das CDN-Risiko in [Kapitel 11](A11-risks-and-technical-debts.md) relevant sind. |
| **Client** | Der Browser des Nutzers als Laufzeitumgebung. **Abgrenzung zu „Frontend“:** Der Client ist die Umgebung, in der ausgeführt wird; das Frontend ist der Code, der dort ausgeführt wird (siehe unten). |
| **CRUD** | Create, Read, Update, Delete — die vier grundlegenden Operationen auf gespeicherten Daten. Auf Konfigurationen angewandt, unterstützt der Pizza Tracker aktuell nur **Create** (`save_config.php`, ausschließlich `INSERT`), **Read** (`load_configs.php`) und **Delete** (`delete_config.php`). Eine **Update**-Operation existiert nicht: „Erneut bearbeiten“ füllt den Konfigurator vor, ein anschließendes Speichern legt aber einen neuen Datensatz an (§ 5.2.2, offener Punkt O-4 in [Kapitel 5](A05%20-%20Bausteinsicht.md)). Der Pizza Tracker realisiert also **CR_D**, kein vollständiges CRUD. |
| **Datenbank** | Die MariaDB-Datenbank `pizza_tracker` mit den drei Tabellen `users`, `konfigurationen` und `gutscheine`, angelegt aus `database/schema.sql` (§ 5.1.6). |
| **Frontend** | Der im Browser ausgeführte Code: die fünf HTML-Seiten, `css/style.css` und die sechs Dateien unter `js/`. Entspricht den Bausteinen „Präsentationsschicht“ und „Browserlogik“ aus § 5.1.1 f. |
| **HTTP** | Das Protokoll zwischen Browser und Apache. Im bestätigten lokalen Betrieb **ohne TLS**, also unverschlüsseltes HTTP auf Port 80 (§ 7.1). |
| **JSON** | Datenformat in zwei getrennten Rollen, die nicht verwechselt werden dürfen: (1) Austauschformat zwischen Browserlogik und API — jede Anfrage und jede Antwort ist ein JSON-Objekt; (2) Speicherformat der Fachdaten in `data/pizza_data.json` sowie der Spalten `belaege` und `extras` in der Tabelle `konfigurationen` (Spaltentyp `JSON`, siehe [D1](../spec/D1-datenmodell.md)). Für die allgemeine Definition siehe auch [E2](../spec/E2-glossar.md). |
| **MariaDB** | Das im XAMPP-Paket enthaltene relationale Datenbanksystem, MySQL-kompatibel, in der bestätigten Installation in Version **10.4.32**. Architekturentscheidung dazu: ADR-002 in [Kapitel 9](A09-architecture-decisions.md). |
| **PDO** | *PHP Data Objects* — die Datenbankschnittstelle, über die `getDatabase()` in `config/database.php` die Verbindung herstellt (`ERRMODE_EXCEPTION`, `FETCH_ASSOC`, `EMULATE_PREPARES = false`). Ermöglicht Prepared Statements (siehe unten). Für die allgemeine Definition siehe auch [E2](../spec/E2-glossar.md); ausgearbeitet in § 8.8. |
| **PHP-Session** | Der serverseitige Sitzungsspeicher, gestartet über `startAppSession()` in `config/helpers.php`. Hält nach Anmeldung oder Registrierung `user_id`, `vorname` und `email` (siehe `login.php`, `register.php`). Der Browser selbst hält keine dieser Werte, nur die Session-ID im Cookie. **Verhältnis zu „Session“ in [E2](../spec/E2-glossar.md):** E2 beschreibt dort den fachlichen Begriff — dass der Anmeldestatus während der Nutzung erhalten bleibt. „PHP-Session“ bezeichnet hier den technischen Mechanismus, mit dem das umgesetzt ist. Ausgearbeitet in § 8.5. |
| **Prepared Statement** | Eine vorbereitete SQL-Anweisung mit benannten Platzhaltern (z. B. `:id`, `:user_id`); Werte werden getrennt vom SQL-Text übergeben. Im Pizza Tracker wird **jede** SQL-Stelle so ausgeführt — geprüft in allen acht Endpunkten und in `validateCoupon()`, keine Ausnahme durch String-Verkettung gefunden. Für die allgemeine Definition siehe auch [E2](../spec/E2-glossar.md); ausgearbeitet in § 8.8. |
| **Repository** | In diesem Dokument ausschließlich im Sinne von **Git-Repository** — nicht das Entwurfsmuster „Repository Pattern“. Der Pizza Tracker hat keine eigene Datenzugriffsschicht in diesem musterhaften Sinn; SQL steht direkt in den Endpunkten (§ 5.1.3). |
| **sessionStorage** | Browserseitiger Speicher, der beim Schließen des Tabs geleert wird. Tatsächlich verwendet: `meine-pizzen.js` legt beim Klick auf „Erneut bearbeiten“ die gespeicherte Konfiguration unter dem Schlüssel `pizza-edit-config` ab, `konfigurator.js` liest den Eintrag beim Laden und entfernt ihn danach (§ 5.2.1). Für keinen anderen Zweck im Projekt eingesetzt. |
| **SQL** | Die Abfragesprache der Datenbank. Im Projekt in `database/schema.sql` (Tabellendefinition und Startdaten) sowie direkt in den acht Endpunkten und in `validateCoupon()` (Prepared Statements, siehe oben). |
| **XAMPP** | Lokales Software-Paket aus Apache, PHP und MariaDB — die einzige bestätigte Ausführungsumgebung des Projekts (§ 7.1 f.), in der getesteten Installation unter Windows mit Apache 2.4.58 und PHP 8.2.12. Für die allgemeine Definition siehe auch [E2](../spec/E2-glossar.md). |

---

## Konsistenzhinweise

Diese Punkte wurden beim Erstellen dieses Kapitels geprüft und sind damit erledigt, nicht mehr offen:

- **sessionStorage tatsächlich verwendet?** Ja, für „Erneut bearbeiten“ (siehe Eintrag oben).
- **Existiert eine Update-Funktion?** Nein — belegt beim Eintrag „CRUD“ und bereits in
  [Kapitel 5](A05%20-%20Bausteinsicht.md) als O-4 geführt.
- **Doppelter Eintrag „Session“/„PHP-Session“?** Aufgelöst: „Session“ bleibt ausschließlich in E2 als
  fachlicher Begriff, „PHP-Session“ steht hier als technischer Mechanismus mit Verweis auf E2.
- **Tabellennamen konsistent mit `schema.sql`?** Ja: `users`, `konfigurationen`, `gutscheine`.

Diese Punkte kann ich mit den mir zugänglichen Dateien nicht abschließend prüfen und übergebe sie:

- **An alle:** Ob „Konfiguration“ und „Vorlage“ in den noch unfertigen Kapiteln A06, A08, A09, A10
  und A11 durchgängig im hier festgelegten Sinn verwendet werden, lässt sich erst beurteilen, wenn
  diese Kapitel ausgearbeitet sind. Bitte beim jeweiligen Abschluss gegen dieses Glossar prüfen.
- **An Person 3 (A08/A09):** Die Verweise auf § 8.5, § 8.6, § 8.8 und ADR-002 zeigen auf Überschriften,
  die im Repository bereits existieren, deren Inhalt aber noch nicht geschrieben ist. Sobald diese
  Abschnitte stehen, bitte kurz gegenprüfen, ob die hier zusammengefassten technischen Fakten
  (z. B. `session_regenerate_id(true)`, `PASSWORD_BCRYPT`) mit der dortigen ausführlichen Darstellung
  übereinstimmen.

## Verbleibende Grenzen dieses Schritts

- Geprüft wurden alle acht `api/*.php`-Dateien, `config/helpers.php`, `config/database.php` und
  `database/schema.sql` sowie `E2-glossar.md` und `D1-datenmodell.md` im Abgleich.
- Nicht geprüft: ob dieselben Begriffe in A06, A08–A11 bereits abweichend verwendet werden — diese
  Kapitel sind noch nicht ausgearbeitet.
- Kein Code und keine andere Datei wurden verändert.

**Geänderte Datei:** `docs/arch/A12-glossary.md` (Entwurf oben, noch nicht eingecheckt)

**Commit-Nachricht:**
```
docs(arch): A12 Glossar mit Projektbezug ausgearbeitet, Abgleich mit E2
```

**Drei Verständnisfragen:**
1. Warum steht „Konfiguration“ nicht in diesem Kapitel, obwohl der Begriff ständig in der Architektur vorkommt?
2. Was ist der Unterschied zwischen „Session“ in E2 und „PHP-Session“ hier — und warum braucht es beide Einträge statt nur einen?
3. Warum realisiert der Pizza Tracker „CR_D“ und kein vollständiges CRUD? Welche konkrete Codezeile belegt das?

**Nächster Schritt:** README.md oder INSTALL.md — beide profitieren jetzt von den hier geklärten Begriffen (API-Endpunkt, Backend/Frontend, PHP-Session). Womit soll ich weitermachen?
