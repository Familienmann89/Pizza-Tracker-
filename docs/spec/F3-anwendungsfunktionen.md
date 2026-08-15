# F3 — Anwendungsfunktionen

## Gutschein-Prüfvorgang

Der Gutschein-Prüfvorgang ist die zentrale Anwendungsfunktion des Pizza Trackers, die über die reine Benutzerinteraktion hinausgeht. Sie beschreibt, wie das System einen eingegebenen Gutscheincode fachlich bewertet.

### Ablauf der Gutscheinprüfung

Wenn ein Nutzer einen Gutscheincode eingibt und auf „Einlösen" klickt, durchläuft das System folgende Prüfschritte:

```mermaid
flowchart TD
    A([Nutzer gibt Code ein]) --> B{Ist der Code\nim System vorhanden?}
    B -->|Nein| C[Fehlermeldung:\nUngültiger Code]
    B -->|Ja| D{Ist der Code\nnoch aktiv?}
    D -->|Nein| E[Fehlermeldung:\nCode nicht aktiv]
    D -->|Ja| F{Ist der Code\nnoch gültig?}
    F -->|Abgelaufen| G[Fehlermeldung:\nCode abgelaufen]
    F -->|Gültig| H[Rabatt berechnen]
    H --> I[Neuen Preis anzeigen]
    I --> J([Ende])
    C --> J
    E --> J
    G --> J
```

### Prüfschritte im Detail

| Schritt | Beschreibung | Ergebnis bei Fehler |
|---|---|---|
| 1. Code vorhanden | Das System prüft ob der eingegebene Code überhaupt existiert | Fehlermeldung: Ungültiger Gutscheincode |
| 2. Code aktiv | Das System prüft ob der Code nicht deaktiviert wurde | Fehlermeldung: Code nicht aktiv |
| 3. Gültigkeitsdatum | Das System prüft ob der Code noch nicht abgelaufen ist | Fehlermeldung: Gutscheincode abgelaufen |
| 4. Rabatt anwenden | Der Rabatt wird in Prozent vom aktuellen Preis abgezogen | — |
| 5. Preis anzeigen | Der neue reduzierte Preis wird dem Nutzer angezeigt | — |

### Verfügbare Gutscheincodes

| Code | Rabatt | Art |
|---|---|---|
| PIZZA10 | 10 % | Zeitlich begrenzt |
| SPARE20 | 20 % | Zeitlich begrenzt |
| WELCOME | 15 % | Einmalig bei Registrierung |
| STUDENT5 | 5 % | Dauerhaft für Studenten |
