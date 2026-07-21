# F1 — Geschäftsprozesse

## GP1 — Pizza konfigurieren und speichern

Der wichtigste Ablauf der Anwendung ist das Zusammenstellen und Speichern einer Pizza.

```mermaid
flowchart TD
    A([Start]) --> B[Konfigurator öffnen]
    B --> C[Größe wählen\nS / M / L / XL / XXL]
    C --> D[Teig wählen]
    D --> E[Sauce wählen]
    E --> F[Käse wählen]
    F --> G[Beläge wählen]
    G --> H{Gutschein\nvorhanden?}
    H -->|Ja| I[Code eingeben]
    I --> J{Code gültig?}
    J -->|Ja| K[Rabatt anwenden]
    J -->|Nein| L[Fehlermeldung]
    L --> H
    K --> M{Angemeldet?}
    H -->|Nein| M
    M -->|Ja| N[Konfiguration speichern]
    M -->|Nein| O[Nur anzeigen]
    N --> P([Ende])
    O --> P
```

### Schritte

| Schritt | Akteur | Beschreibung |
|---|---|---|
| 1 | Nutzer / Gast | Konfigurator öffnen (`konfigurator.html`) |
| 2 | Nutzer / Gast | Größe, Teig, Sauce, Käse und Beläge wählen |
| 3 | System | Preis und Kalorien nach jeder Auswahl direkt aktualisieren |
| 4 | Nutzer / Gast | Optional: Gutscheincode eingeben |
| 5 | System | Code in der Datenbank prüfen und gegebenenfalls den Rabatt anwenden |
| 6a | Gast | Konfiguration nur anzeigen, nicht speichern |
| 6b | Angemeldeter Nutzer | Konfiguration in der Datenbank speichern |
| 7 | Nutzer | Gespeicherte Pizzen unter "Meine Pizzen" abrufen |

---

## GP2 — Benutzerregistrierung und Login

```mermaid
flowchart TD
    A([Start]) --> B{Bereits\nregistriert?}
    B -->|Nein| C[Registrierungsformular\nausfüllen]
    C --> D{Eingaben\ngültig?}
    D -->|Nein| E[Fehler anzeigen]
    E --> C
    D -->|Ja| F[Passwort hashen\nbcrypt]
    F --> G[Nutzer in DB\nspeichern]
    G --> H[Session setzen]
    B -->|Ja| I[Login-Formular\nausfüllen]
    I --> J{E-Mail + Passwort\nkorrekt?}
    J -->|Nein| K[Fehlermeldung]
    K --> I
    J -->|Ja| H
    H --> L([Angemeldet])
```

---

## GP3 — Gespeicherte Pizza löschen

| Schritt | Akteur | Beschreibung |
|---|---|---|
| 1 | Angemeldeter Nutzer | "Meine Pizzen" öffnen |
| 2 | Nutzer | Auf "Löschen" klicken |
| 3 | System | Bestätigungsdialog anzeigen |
| 4 | Nutzer | Bestätigen |
| 5 | System | Prüfen, ob die `user_id` mit dem angemeldeten Nutzer übereinstimmt |
| 6 | System | Datensatz löschen und die Karte aus der Ansicht entfernen |
