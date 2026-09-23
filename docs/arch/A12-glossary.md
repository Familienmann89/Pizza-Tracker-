# 12 Glossar

Dieses Glossar erklärt die technischen Begriffe der Architektur anhand ihrer Verwendung im Pizza Tracker. Fachliche Begriffe wie Belag, Teigart und Gutscheincode stehen im [Glossar der Spezifikation](../spec/E2-glossar.md). Die ausführlichen Abläufe und Entscheidungen werden in den jeweiligen Architekturkapiteln beschrieben.

## 12.1 Technische Begriffe

| Begriff | Bedeutung im Pizza Tracker |
|---|---|
| **API / API-Endpunkt** | Schnittstelle zwischen Browser und Server. Die acht PHP-Dateien unter `api/` bearbeiten Anmeldung, Registrierung, Abmeldung, Sessionabfrage, Gutscheinprüfung sowie Speichern, Laden und Löschen von Konfigurationen. Eine solche Datei ist ein Endpunkt. Vorgesehene Antworten verwenden JSON; unerwartete Serverfehler sind eine bekannte Einschränkung, siehe [Kapitel 11](A11-risks-and-technical-debts.md). |
| **Authentifizierung** | Prüfung der Identität bei der Anmeldung. `api/login.php` prüft E-Mail und Passwort; die PHP-Session hält anschließend den Anmeldestatus. |
| **Autorisierung** | Prüfung der Zugriffsberechtigung. Beim Laden und Löschen begrenzt das Backend den Zugriff auf Konfigurationen des angemeldeten Nutzers. Versteckte Schaltflächen allein bieten diesen Schutz nicht. |
| **Backend** | Serverseitiger Anwendungsteil aus den PHP-Endpunkten unter `api/` und der gemeinsamen Logik unter `config/`. Er prüft Eingaben und Berechtigungen, berechnet Preis und Kalorien neu und greift auf die Datenbank zu. |
| **Bootstrap / CDN** | Bootstrap unterstützt Layout und Navigation. Die HTML-Seiten laden Version 5.3.3 über `cdn.jsdelivr.net`. Dieses Content Delivery Network (CDN) ist ein externer Dienst; seine Erreichbarkeit beeinflusst die Darstellung auch beim lokalen Betrieb. |
| **Client / Frontend** | Der Client ist der Browser als Ausführungsumgebung. Das Frontend besteht aus den HTML-Seiten sowie CSS und JavaScript des Projekts. Es verarbeitet Eingaben, aktualisiert die Anzeige und kommuniziert mit dem Backend. |
| **CRUD** | Create, Read, Update und Delete: Anlegen, Lesen, Ändern und Löschen gespeicherter Daten. Für Pizza-Konfigurationen gibt es Anlegen, Lesen und Löschen. „Erneut bearbeiten“ lädt die Auswahl in den Konfigurator; anschließendes Speichern erzeugt einen neuen Datensatz, kein Update des bisherigen. |
| **Datenbank / Persistenz** | Dauerhafte Speicherung von Nutzern, Konfigurationen und Gutscheinen in `pizza_tracker`. Die Tabellen `users`, `konfigurationen` und `gutscheine` werden durch `database/schema.sql` angelegt. |
| **DocumentRoot** | Ausgangsverzeichnis des Webservers für ausgelieferte Dateien. Das Projekt liegt bei XAMPP gewöhnlich in einem Unterordner von `htdocs` und wird über eine lokale HTTP-Adresse geöffnet. |
| **Fachdatenquelle** | `data/pizza_data.json` enthält Größen, Zutaten, Preise, Kalorien, Makronährwerte und Kennzeichnungen. Browser und Backend lesen dieselbe Datei. Die Makronährwertanzeige wird im Browser berechnet; die serverseitige Summenberechnung umfasst Preis und Kalorien. |
| **`fetch()`** | JavaScript-Funktion für HTTP-Anfragen. Sie lädt im Projekt die Fachdaten und ruft PHP-Endpunkte auf, ohne dafür eine neue Seite öffnen zu müssen. |
| **HTTP / HTTP-Statuscode** | Protokoll zwischen Browser und Webserver. Statuscodes kennzeichnen das Ergebnis einer Anfrage, beispielsweise 401 bei fehlender Anmeldung. Die lokale Einrichtung verwendet HTTP; eine Absicherung für öffentlichen Produktivbetrieb ist nicht Bestandteil dieser Einrichtung. |
| **JSON** | Datenformat für `pizza_data.json`, API-Antworten und Anfragen mit JSON-Inhalt. Auch Beläge und Extras werden als JSON in der Datenbank gespeichert. Nicht jede Anfrage besitzt einen JSON-Body, etwa die GET-Abfrage des Sessionstatus. |
| **MySQL / MariaDB** | Relationale Datenbanksysteme für die dauerhafte Speicherung. `config/database.php` stellt die Verbindung über einen MySQL-kompatiblen PDO-Treiber her. |
| **PDO / Prepared Statement** | PDO ist die verwendete PHP-Datenbankschnittstelle. Vorbereitete SQL-Anweisungen trennen SQL-Befehle von übergebenen Werten. `config/database.php` deaktiviert die Emulation solcher Anweisungen. Details stehen in [Kapitel 8](A08-cross-cutting-concepts.md). |
| **PHP-Session** | Serverseitiger Sitzungsspeicher für den Anmeldestatus. Der Browser übermittelt die Session-ID als Cookie. Zusätzlich liefert `api/session.php` bei bestehender Anmeldung ausgewählte Nutzerdaten an das Frontend; die Berechtigungsprüfung bleibt serverseitig. |
| **Repository** | Das Git-Repository mit Code, Dokumentation und Änderungshistorie. Gemeint ist hier nicht das Entwurfsmuster „Repository Pattern“ für eine separate Datenzugriffsschicht. |
| **`sessionStorage`** | Tabbezogener Speicher im Browser. `js/meine-pizzen.js` legt die erneut zu bearbeitende Konfiguration unter `pizza-edit-config` ab. `js/konfigurator.js` liest und entfernt diesen Eintrag. Dieser Speicher ersetzt keine PHP-Session und keine Datenbank. |
| **SQL** | Sprache für Definition und Verarbeitung relationaler Daten. Im Projekt stehen die Tabellendefinitionen in `database/schema.sql` und die Laufzeitabfragen in den zuständigen PHP-Dateien. |
| **Umgebungsvariable** | Außerhalb des Quellcodes gesetzter Konfigurationswert. Die Datenbankverbindung liest `PIZZA_DB_HOST`, `PIZZA_DB_PORT`, `PIZZA_DB_NAME`, `PIZZA_DB_USER` und `PIZZA_DB_PASS`; ohne gesetzte Werte gelten die Vorgaben in `config/database.php`. Eine `.env`-Datei wird nicht automatisch geladen. |
| **XAMPP / MAMP** | Softwarepakete für eine lokale Webserver-, PHP- und Datenbankumgebung. Die Projektanleitung beschreibt die Einrichtung mit XAMPP. Andere Umgebungen benötigen passende Verzeichnisse, Ports und Datenbankzugangsdaten. |

## 12.2 Fachliche Abgrenzung: Vorlage und gespeicherte Konfiguration

Eine **Vorlage** ist eine vordefinierte Auswahl aus `pizza_data.json`. Sie dient als Ausgangspunkt im Konfigurator und ist selbst kein Datensatz in der Datenbank. Eine **gespeicherte Konfiguration** gehört dagegen einem Nutzer und liegt in der Tabelle `konfigurationen`. Das Laden einer Vorlage speichert noch keine Konfiguration.
