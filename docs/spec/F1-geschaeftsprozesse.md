# F1 — Geschäftsprozesse

Dieser Baustein beschreibt die Geschäftsprozesse rund um den Pizza Tracker. Die Prozesse reichen über die Anwendung selbst hinaus und zeigen den größeren fachlichen Kontext also was vor, während und nach der Nutzung der App geschieht.

---

## GP1 — Pizza bestellen

Dieser Prozess beschreibt den gesamten Ablauf vom Hunger bis zur fertigen Pizza — der Pizza Tracker übernimmt dabei den Konfigurationsschritt.

```mermaid
flowchart TD
    A([Nutzer hat Hunger]) --> B[Nutzer öffnet\nden Pizza Tracker]
    B --> C[Nutzer stellt\nseine Wunschpizza zusammen]
    C --> D[Preis und Kalorien\nwerden angezeigt]
    D --> E{Gutschein\nvorhanden?}
    E -->|Ja| F[Gutscheincode eingeben\nRabatt wird angewendet]
    E -->|Nein| G[Konfiguration abschließen]
    F --> G
    G --> H{Bei Pizzeria\nbestellen?}
    H -->|Ja| I[Konfiguration\nan Pizzeria weitergeben]
    H -->|Nein| J[Konfiguration\nfür später speichern]
    I --> K[Pizzeria bereitet\nPizza zu]
    K --> L[Nutzer bezahlt\nund erhält Pizza]
    L --> M([Nutzer ist zufrieden])
    J --> M
```

### Schritte

| Schritt | Akteur | Beschreibung |
|---|---|---|
| 1 | Nutzer | Nutzer hat Hunger und möchte eine Pizza bestellen |
| 2 | Nutzer | Nutzer öffnet den Pizza Tracker |
| 3 | Nutzer | Nutzer stellt seine Wunschpizza zusammen (Größe, Teig, Sauce, Käse, Beläge) |
| 4 | System | Preis und Kalorien werden nach jeder Auswahl sofort angezeigt |
| 5 | Nutzer | Nutzer gibt optional einen Gutscheincode ein |
| 6 | System | Gutscheincode wird geprüft und Rabatt wird angewendet |
| 7 | Nutzer | Nutzer gibt die Konfiguration an eine Pizzeria weiter oder speichert sie |
| 8 | Pizzeria | Pizzeria bereitet die Pizza nach der Konfiguration zu |
| 9 | Nutzer | Nutzer bezahlt und erhält seine Pizza |

---

## GP2 — Konto erstellen und anmelden

Dieser Prozess beschreibt wie ein Nutzer ein Konto anlegt und sich anmeldet, um seine Pizzen zu speichern.

```mermaid
flowchart TD
    A([Nutzer möchte\nKonfigurationen speichern]) --> B{Hat der Nutzer\nschon ein Konto?}
    B -->|Nein| C[Nutzer füllt\nRegistrierungsformular aus]
    C --> D{Sind alle Angaben\nkorrekt und vollständig?}
    D -->|Nein| E[Fehlermeldung\nwird angezeigt]
    E --> C
    D -->|Ja| F[Konto wird\nangelegt]
    F --> G[Nutzer ist\nangemeldet]
    B -->|Ja| H[Nutzer gibt\nE-Mail und Passwort ein]
    H --> I{Sind die Zugangsdaten\nkorrekt?}
    I -->|Nein| J[Fehlermeldung\nwird angezeigt]
    J --> H
    I -->|Ja| G
    G --> K([Nutzer kann\nKonfigurationen speichern])
```

### Schritte

| Schritt | Akteur | Beschreibung |
|---|---|---|
| 1 | Nutzer | Nutzer möchte seine Pizza-Konfigurationen speichern |
| 2 | Nutzer | Nutzer registriert sich mit seinen persönlichen Daten |
| 3 | System | Angaben werden auf Vollständigkeit und Gültigkeit geprüft |
| 4 | System | Konto wird angelegt und Nutzer wird direkt angemeldet |
| 5 | Nutzer | Bei späterer Rückkehr meldet sich der Nutzer mit E-Mail und Passwort an |
| 6 | System | Zugangsdaten werden geprüft |
| 7 | Nutzer | Nutzer kann nun seine Konfigurationen speichern und verwalten |

---

## GP3 — Konfiguration verwalten

Dieser Prozess beschreibt wie ein angemeldeter Nutzer seine gespeicherten Pizza-Konfigurationen verwaltet.

```mermaid
flowchart TD
    A([Nutzer öffnet\nMeine Pizzen]) --> B[Gespeicherte Pizzen\nwerden angezeigt]
    B --> C{Was möchte\nder Nutzer tun?}
    C -->|Erneut bestellen| D[Konfiguration wird\nim Konfigurator geöffnet]
    C -->|Löschen| E[Bestätigungsdialog\nerscheint]
    D --> F[Nutzer passt\ndie Pizza an]
    F --> G[Nutzer gibt\nKonfiguration weiter]
    E --> H{Nutzer bestätigt\ndas Löschen?}
    H -->|Ja| I[Konfiguration\nwird gelöscht]
    H -->|Nein| B
    G --> J([Ende])
    I --> J
```

### Schritte

| Schritt | Akteur | Beschreibung |
|---|---|---|
| 1 | Nutzer | Nutzer öffnet „Meine Pizzen" |
| 2 | System | Alle gespeicherten Konfigurationen des Nutzers werden angezeigt |
| 3a | Nutzer | Nutzer wählt eine Pizza zum erneuten Bestellen aus |
| 4a | System | Konfiguration wird im Konfigurator vorausgefüllt |
| 5a | Nutzer | Nutzer passt die Pizza an und gibt sie weiter |
| 3b | Nutzer | Nutzer möchte eine Pizza-Konfiguration löschen |
| 4b | System | Bestätigungsdialog erscheint |
| 5b | Nutzer | Nutzer bestätigt das Löschen |
| 6b | System | Konfiguration wird unwiderruflich gelöscht |
