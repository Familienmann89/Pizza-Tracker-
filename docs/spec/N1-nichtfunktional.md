# N1 — Nichtfunktionale Anforderungen

| ID | Kategorie | Anforderung |
|---|---|---|
| NFA01 | Performance | Seiten laden in unter 3 Sekunden bei lokaler Ausführung |
| NFA02 | Sicherheit | Passwörter werden mit `password_hash()` und `PASSWORD_DEFAULT` gehasht und niemals im Klartext gespeichert |
| NFA03 | Sicherheit | Alle Datenbankabfragen verwenden PDO Prepared Statements. Dadurch wird das Risiko von SQL-Injections deutlich reduziert |
| NFA04 | Sicherheit | E-Mail-Adressen werden serverseitig mit `filter_var()` geprüft. Bei der HTML-Ausgabe werden Nutzereingaben mit `htmlspecialchars()` maskiert |
| NFA05 | Sicherheit | API-Endpunkte, die eine Anmeldung erfordern, prüfen die Session über `requireLogin()` vor jeder Operation |
| NFA06 | Usability | Die Oberfläche ist responsiv (Bootstrap 5.3) und auf Mobilgeräten vollständig bedienbar |
| NFA07 | Wartbarkeit | PHP-Logik ist in separate API-Endpunkte aufgeteilt — keine Geschäftslogik in den HTML-Dateien |
| NFA08 | Kompatibilität | Unterstützte Browser: Chrome, Firefox, Safari (aktuelle Versionen) |
| NFA09 | Verfügbarkeit | Das System läuft lokal über XAMPP oder MAMP. Für einen Offline-Betrieb können Bootstrap und die Icons lokal eingebunden werden |
