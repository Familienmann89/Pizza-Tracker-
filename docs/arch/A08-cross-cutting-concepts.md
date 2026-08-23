# 8 Querschnittliche Konzepte

> **STATUS: GERÜST — NOCH KEINE DOKUMENTATION.**
> Übernommen wurde das Beschreibungsschema des Herold-Beispiels:
> **Strategie (Spec) → Realisierung im Code → Abweichung.**
> Nicht übernommen: Umfang, Walkthrough-Tiefe und sämtliche Inhalte.
> Alle ⟦…⟧-Stellen sind aus dem Repository zu belegen.

Dieses Kapitel dokumentiert die Konzepte, die mehrere Bausteine aus
[Kapitel 5](A05-bausteinsicht.md) übergreifen. Jeder Abschnitt hält fest, **wie das Konzept im
Code realisiert ist** — konkrete Dateien, Funktionen, Mechanismen — und benennt
**Abweichungen**, wo Implementierung und Spezifikation auseinandergehen. Abweichungen werden
hier benannt und in [Kapitel 11](A11-risiken-und-technische-schulden.md) als Befund geführt.

> ⟦**Vor dem Schreiben klären:** Gibt es in `docs/spec/` einen Abschnitt zu querschnittlichen
> Konzepten, auf den hier verwiesen werden kann? Falls ja: Zuordnungstabelle unten ausfüllen.
> Falls nein: Spalte streichen und stattdessen auf A01–A04 verweisen, wo passend.⟧

| § | Konzept | Strategie in der Spec |
|---|---------|----------------------|
| [8.1](#81-datenmodell-und-persistenz) | Datenmodell und Persistenz | ⟦…⟧ |
| [8.2](#82-zentrale-fachdaten--pizza_datajson) | Zentrale Fachdaten — `pizza_data.json` | ⟦…⟧ |
| [8.3](#83-frontend-backend-kommunikation) | Frontend-Backend-Kommunikation | ⟦…⟧ |
| [8.4](#84-validierung) | Validierung | ⟦…⟧ |
| [8.5](#85-authentifizierung-und-session) | Authentifizierung und Session | ⟦…⟧ |
| [8.6](#86-autorisierung) | Autorisierung | ⟦…⟧ |
| [8.7](#87-passwortschutz) | Passwortschutz | ⟦…⟧ |
| [8.8](#88-datenbankzugriff) | Datenbankzugriff | ⟦…⟧ |
| [8.9](#89-preisberechnung) | Preisberechnung | ⟦…⟧ |
| [8.10](#810-fehlerbehandlung) | Fehlerbehandlung | ⟦…⟧ |
| [8.11](#811-responsive-ui) | Responsive UI | ⟦…⟧ |
| [8.12](#812-umgang-mit-zugangsdaten) | Umgang mit Zugangsdaten | ⟦…⟧ |

---

## 8.1 Datenmodell und Persistenz

⟦Hat im Briefing keine direkte Entsprechung, gehört aber hierher, weil es alle schreibenden
Bausteine betrifft. Herold macht das genauso (dortiges § 8.1 ohne Spec-Gegenstück).⟧

**Realisierung.** ⟦Tabellen aus `database/schema.sql`: Namen, Schlüssel, Fremdschlüssel,
Datentypen. Mermaid-ER-Diagramm, falls hilfreich. Zuordnung: welche fachliche Entität aus der
Spec entspricht welcher Tabelle?⟧

**Zu klären:**

- ⟦Wie werden Beläge/Extras gespeichert — eigene Tabelle, Zwischentabelle oder JSON-Spalte?
  Bei JSON-Spalten: Konsequenz für relationale Abfragen benennen (Briefing A11).⟧
- ⟦Gibt es Fremdschlüssel mit ON DELETE-Verhalten, oder wird in PHP aufgeräumt?⟧
- ⟦Zeichensatz/Collation — relevant für Umlaute in Konfigurationsnamen.⟧

## 8.2 Zentrale Fachdaten — `pizza_data.json`

**Strategie.** Optionen, Preise, kcal und Vorlagen liegen an genau einer Stelle,
damit fachliche Änderungen ohne Codeänderung möglich sind ⟦Bezug zum Wartbarkeitsziel in
[Kapitel 10](A10-qualitaetsanforderungen.md)⟧.

**Realisierung.** ⟦Struktur der Datei beschreiben. Wer liest sie: nur `konfigurator.js`, oder
auch serverseitig? **Das ist die zentrale Frage dieses Abschnitts** — davon hängt ab, ob § 8.9
überhaupt funktionieren kann.⟧

**Konsequenz.** ⟦Falls die Datei nur clientseitig gelesen wird: Der Server hat keine
unabhängige Preisquelle. Falls beide sie lesen: Wie wird sichergestellt, dass beide dieselbe
Version sehen? Das Briefing nennt genau diesen Punkt als Nachteil der Entscheidung — hier
konkret ausführen, nicht abstrakt.⟧

> **Rezept — neue Zutat aufnehmen.** ⟦Falls belegbar: „Ein Eintrag in `pizza_data.json`,
> keine Codeänderung." Dieses Rezept-Format ist der überzeugendste Nachweis für Wartbarkeit —
> aber nur schreiben, wenn es im Code tatsächlich stimmt.⟧

## 8.3 Frontend-Backend-Kommunikation

**Realisierung.** ⟦`fetch()` gegen die Endpunkte unter `api/`. Zu belegen:⟧

| Aspekt | Ist-Zustand |
|--------|-------------|
| HTTP-Methoden | ⟦GET/POST — oder alles POST?⟧ |
| Request-Format | ⟦JSON-Body oder Formulardaten?⟧ |
| Response-Format | ⟦Einheitliche Hülle wie `{success, data, message}` oder je Endpunkt anders?⟧ |
| Statuscodes | ⟦Werden 401/403/404/422 gesetzt oder immer 200 mit Fehlerflag?⟧ |
| Credentials | ⟦Session-Cookie automatisch — wird `credentials` in fetch gesetzt?⟧ |

⟦Falls das Antwortformat uneinheitlich ist: als Befund benennen, nicht glätten.⟧

## 8.4 Validierung

**Strategie.** Clientseitige Prüfung ist Komfort, serverseitige Prüfung ist verbindlich.
⟦Diese Formulierung nur übernehmen, wenn der Code sie stützt.⟧

**Realisierung.** ⟦Tabelle nach Grenze — das ist Herolds nützlichste Idee in diesem Kapitel:⟧

| Grenze | Prüfende Stelle | Regeln | Bei Verstoß |
|--------|-----------------|--------|-------------|
| Browser (Komfort) | ⟦HTML-Attribute? JS?⟧ | ⟦…⟧ | ⟦…⟧ |
| Registrierung | `api/register.php` | ⟦…⟧ | ⟦…⟧ |
| Login | `api/login.php` | ⟦…⟧ | ⟦…⟧ |
| Konfiguration speichern | `api/save_config.php` | ⟦…⟧ | ⟦…⟧ |
| Gutschein | `api/coupon.php` | ⟦…⟧ | ⟦…⟧ |

⟦Für jede Zeile prüfen: Wird wirklich serverseitig geprüft, oder verlässt sich der Endpunkt
auf die Browserprüfung? Leere Zellen sind ein Ergebnis, keine Lücke.⟧

## 8.5 Authentifizierung und Session

**Realisierung.** ⟦`session_start()` — wo, zentral in `helpers.php` oder je Datei?
`api/session.php`: was liefert es, wer ruft es auf? `auth.js`: wie wird die Navigation
umgeschaltet? `session_regenerate_id(true)`: an welcher Stelle genau?⟧

**Wichtig zu unterscheiden:** ⟦Die Navigation im Browser umzuschalten ist Anzeige, keine
Zugriffskontrolle. Der Schutz muss serverseitig in jedem Endpunkt liegen. Prüfen, ob das
konsistent geschieht — Herold nennt das „the single gate". Falls beim Pizza Tracker jeder
Endpunkt seine Prüfung selbst mitbringt: benennen, denn dann kann sie vergessen werden.⟧

## 8.6 Autorisierung

**Realisierung.** ⟦Zwei Rollen: Gast und angemeldeter Nutzer. Ein Nutzer darf nur eigene
Konfigurationen sehen, bearbeiten und löschen. Wo wird das durchgesetzt?
In der WHERE-Klausel (`WHERE id = ? AND user_id = ?`) oder als separates SELECT mit
anschließendem Vergleich? Beides funktioniert, aber die Aussage ist unterschiedlich.⟧

⟦Direkter Bezug zum Sicherheitsszenario in [Kapitel 10](A10-qualitaetsanforderungen.md):
„fremde Konfiguration darf serverseitig nicht gelöscht werden".⟧

## 8.7 Passwortschutz

**Realisierung.** ⟦`password_hash()` mit welchem Algorithmus-Parameter — `PASSWORD_DEFAULT`
oder explizit? `password_verify()` beim Login. Wird das Klartextpasswort irgendwo geloggt,
zurückgegeben oder in einer Session abgelegt? Gibt es Mindestanforderungen an das Passwort,
und wo werden sie geprüft?⟧

## 8.8 Datenbankzugriff

**Realisierung.** ⟦`config/database.php`: Wie wird die PDO-Instanz erzeugt und weitergereicht —
Funktion, globale Variable, Singleton? Welche PDO-Attribute sind gesetzt
(`ERRMODE_EXCEPTION`, `EMULATE_PREPARES`, `FETCH_ASSOC`)? Das ist keine Formalie: ohne
`ERRMODE_EXCEPTION` scheitern Fehler still.⟧

**Prepared Statements.** ⟦Behauptung des Briefings. **Jede** SQL-Stelle im Repository prüfen.
Eine einzige String-Konkatenation reicht, um die Aussage zu widerlegen — dann gehört sie nach
A11 statt hierher. Kurzes Code-Zitat als Beleg ist sinnvoll.⟧

## 8.9 Preisberechnung

⟦Der inhaltlich heikelste Abschnitt. Das Briefing behauptet: „Live im Browser;
Server vertraut Clientpreis nicht blind." Zwei Teilaussagen, getrennt prüfen:⟧

**Clientseitig.** ⟦`konfigurator.js`: Wo liegt die Berechnungsfunktion, welche Größen gehen ein
(Größe, Teig, Beläge, Extras, Gutschein)?⟧

**Serverseitig.** ⟦`api/save_config.php`: Wird der Preis neu berechnet oder aus dem Request
übernommen? Falls neu berechnet — woher kommen die Preise, wenn `pizza_data.json` nur im
Browser gelesen wird (siehe § 8.2)?⟧

⟦**Falls der Server den Clientpreis übernimmt:** Nicht beschönigen. So dokumentieren, wie es
ist, und als Abweichung zwischen Spec/A08-Vorgabe und Implementierung nach A11 verlinken.
Ein ehrlich dokumentierter Befund ist besser als eine unbelegte Behauptung — und der
Konsistenzcheck in Abschnitt 10 des Briefings verlangt genau das.⟧

## 8.10 Fehlerbehandlung

**Realisierung.** ⟦Gibt es eine gemeinsame Hilfsfunktion in `config/helpers.php`, die
JSON-Fehlerantworten erzeugt? Welche HTTP-Statuscodes werden verwendet? Werden
PHP-/PDO-Exceptions gefangen, oder erreichen Stacktraces den Browser? Letzteres wäre ein
Befund für A11 (Informationsleck).⟧

**Im Frontend.** ⟦Wie zeigt die Browserlogik Fehler an — Bootstrap-Alert, `alert()`,
stilles Scheitern? Einheitlich oder je Datei anders?⟧

## 8.11 Responsive UI

**Realisierung.** ⟦Bootstrap 5.3 Grid und Komponenten plus `css/style.css`. Wo endet Bootstrap
und wo beginnt eigenes CSS? Gibt es eigene Breakpoints/Media Queries? Bezug zum
Kompatibilitätsszenario in [Kapitel 10](A10-qualitaetsanforderungen.md).⟧

## 8.12 Umgang mit Zugangsdaten

**Strategie.** Keine Zugangsdaten im öffentlichen Repository.

**Realisierung.** ⟦**Verifizieren, nicht behaupten.** Stehen DB-Zugangsdaten in
`config/database.php` und ist die Datei eingecheckt? Existiert eine `.gitignore` und greift
sie? Gibt es eine Beispieldatei (`database.example.php`) als Muster?
Falls Zugangsdaten im Repository liegen — auch wenn es nur `root` ohne Passwort für XAMPP ist —
gehört das als Befund nach A11, mit realistischer Einschätzung der Schadenshöhe
(lokale Standardkonfiguration ≠ Produktionsgeheimnis).⟧

---

## Was noch aus dem Repository belegt werden muss

| # | Offene Frage | Quelle |
|---|--------------|--------|
| 1 | Liest die API `pizza_data.json` serverseitig? | `api/*.php` |
| 2 | Serverseitige Preisneuberechnung vorhanden? | `api/save_config.php` |
| 3 | Alle SQL-Stellen: durchgängig Prepared Statements? | `api/*.php`, `config/*.php` |
| 4 | Wo wird die Session geprüft — zentral oder je Endpunkt? | `api/*.php`, `config/helpers.php` |
| 5 | Ort der Eigentumsprüfung (WHERE-Klausel vs. separates SELECT) | `api/delete_config.php`, `api/load_configs.php` |
| 6 | Einheitliches JSON-Antwortformat und Statuscodes? | alle `api/*.php` |
| 7 | PDO-Attribute, insbesondere Fehlerbehandlungsmodus | `config/database.php` |
| 8 | Erreichen PHP-Fehlermeldungen den Browser? | `config/*.php`, `php.ini`-Annahmen |
| 9 | `.gitignore` vorhanden und wirksam? | Repo-Wurzel |
| 10 | Gibt es in der Spec einen Abschnitt zu Querschnittskonzepten? | `docs/spec/` |
