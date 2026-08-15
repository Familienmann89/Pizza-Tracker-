# F2 — Anwendungsfälle

## Übersicht

```mermaid
graph LR
    Gast((Gast))
    Nutzer((Angemeldeter\nNutzer))
    System((System))

    Gast --> UC01[UC01\nPizza konfigurieren]
    Gast --> UC04[UC04\nGutschein einlösen]
    Gast --> UC05[UC05\nRegistrieren]
    Gast --> UC06[UC06\nEinloggen]
    Gast --> UC11[UC11\nVorlage laden]

    Nutzer --> UC01
    Nutzer --> UC04
    Nutzer --> UC07[UC07\nAusloggen]
    Nutzer --> UC08[UC08\nKonfiguration speichern]
    Nutzer --> UC09[UC09\nMeine Pizzen anzeigen]
    Nutzer --> UC10[UC10\nKonfiguration löschen]

    System --> UC02[UC02\nPreis berechnen]
    System --> UC03[UC03\nKalorien berechnen]

    UC01 -.->|includes| UC02
    UC01 -.->|includes| UC03
```

## Übersicht der Anwendungsfälle

| ID | Name | Akteur | Priorität |
|---|---|---|---|
| [UC01](#uc01--pizza-konfigurieren) | Pizza konfigurieren | Gast / Nutzer | Hoch |
| [UC02](#uc02--preis-berechnen) | Preis berechnen | System (automatisch) | Hoch |
| [UC03](#uc03--kalorien-berechnen) | Kalorien berechnen | System (automatisch) | Hoch |
| [UC04](#uc04--gutscheincode-einlösen) | Gutscheincode einlösen | Gast / Nutzer | Mittel |
| [UC05](#uc05--nutzer-registrieren) | Nutzer registrieren | Gast | Hoch |
| [UC06](#uc06--nutzer-einloggen) | Nutzer einloggen | Gast | Hoch |
| [UC07](#uc07--nutzer-ausloggen) | Nutzer ausloggen | Angemeldeter Nutzer | Mittel |
| [UC08](#uc08--konfiguration-speichern) | Konfiguration speichern | Angemeldeter Nutzer | Mittel |
| [UC09](#uc09--gespeicherte-pizzen-anzeigen) | Gespeicherte Pizzen anzeigen | Angemeldeter Nutzer | Mittel |
| [UC10](#uc10--konfiguration-löschen) | Konfiguration löschen | Angemeldeter Nutzer | Niedrig |
| [UC11](#uc11--vorlage-laden) | Vorlage laden | Gast / Nutzer | Niedrig |

---

## Anwendungsfälle im Detail

### UC01 — Pizza konfigurieren

| Feld | Inhalt |
|---|---|
| **Akteur** | Gast oder angemeldeter Nutzer |
| **Vorbedingung** | Der Konfigurator ist geöffnet |
| **Normaler Ablauf** | 1. Größe wählen (S, M, L, XL oder XXL) <br> 2. Teigart wählen (Normal, Dünn & Knusprig, Dick & Fluffig, Vollkorn oder Käserand) <br> 3. Sauce wählen (Tomate, Pesto, Knoblauch-Öl, Crème fraîche oder BBQ) <br> 4. Käse wählen (Mozzarella, Gouda, Gorgonzola, Ziegenkäse oder Vegan) <br> 5. Beläge auswählen (Mehrfachauswahl möglich) <br> 6. Preis und Kalorien werden nach jeder Auswahl sofort aktualisiert |
| **Ergebnis** | Fertige Konfiguration mit angezeigtem Preis und Kalorien |
| **Alternativer Ablauf** | Nutzer wählt eine Vorlage (UC11) → Felder werden vorausgefüllt und können anschließend geändert werden |
| **Fehlerfälle** | Pflichtauswahl fehlt: Die Konfiguration kann nicht gespeichert werden |

```mermaid
flowchart TD
    A([Start]) --> B[Größe wählen]
    B --> C[Teigart wählen]
    C --> D[Sauce wählen]
    D --> E[Käse wählen]
    E --> F[Beläge wählen]
    F --> G[Preis und Kalorien\nwerden aktualisiert]
    G --> H{Gutschein\nverwenden?}
    H -->|Ja| I[UC04\nGutschein einlösen]
    H -->|Nein| J{Angemeldet?}
    I --> J
    J -->|Ja| K[UC08\nKonfiguration speichern]
    J -->|Nein| L[Konfiguration\nnur anzeigen]
    K --> M([Ende])
    L --> M
```

**Akzeptanzkriterien:**
- Der Preis wird nach jeder Änderung sofort aktualisiert
- Die Kalorienanzahl summiert korrekt alle gewählten Zutaten

---

### UC02 — Preis berechnen

| Feld | Inhalt |
|---|---|
| **Akteur** | System (automatisch) |
| **Vorbedingung** | Mindestens eine Zutat wurde ausgewählt |
| **Normaler Ablauf** | Das System berechnet den Gesamtpreis auf Basis der gewählten Zutaten und zeigt ihn sofort an. Bei einem eingelösten Gutschein wird der Rabatt abgezogen. |
| **Ergebnis** | Aktueller Preis wird angezeigt |

---

### UC03 — Kalorien berechnen

| Feld | Inhalt |
|---|---|
| **Akteur** | System (automatisch) |
| **Vorbedingung** | Mindestens eine Zutat wurde ausgewählt |
| **Normaler Ablauf** | Das System summiert die Kalorienwerte aller gewählten Zutaten und zeigt das Ergebnis sofort an. |
| **Ergebnis** | Aktuelle Kalorienanzahl wird angezeigt |

---

### UC04 — Gutscheincode einlösen

| Feld | Inhalt |
|---|---|
| **Akteur** | Gast oder angemeldeter Nutzer |
| **Vorbedingung** | Eine Pizza wurde konfiguriert |
| **Normaler Ablauf** | 1. Nutzer gibt einen Gutscheincode ein <br> 2. Das System prüft ob der Code gültig und nicht abgelaufen ist <br> 3. Der Rabatt wird vom Preis abgezogen <br> 4. Der neue Preis wird angezeigt |
| **Ergebnis** | Reduzierter Preis wird angezeigt |
| **Fehlerfälle** | Ungültiger Code: Fehlermeldung wird angezeigt · Abgelaufener Code: Fehlermeldung wird angezeigt |
| **Verfügbare Codes** | PIZZA10 (10 %), SPARE20 (20 %), WELCOME (15 %), STUDENT5 (5 %) |

**Akzeptanzkriterium:**
- Der Code PIZZA10 reduziert den Preis um 10 %. Bei einem ungültigen Code erscheint eine Fehlermeldung.

---

### UC05 — Nutzer registrieren

| Feld | Inhalt |
|---|---|
| **Akteur** | Gast |
| **Vorbedingung** | Nutzer ist nicht angemeldet |
| **Normaler Ablauf** | 1. Registrierungsformular ausfüllen: Vorname, Nachname, E-Mail, Passwort und Adresse <br> 2. Eingaben werden geprüft <br> 3. E-Mail-Adresse wird auf Gültigkeit und Verfügbarkeit geprüft <br> 4. Passwort wird sicher gespeichert <br> 5. Nutzer wird direkt angemeldet und zum Konfigurator weitergeleitet |
| **Ergebnis** | Konto wurde erstellt, Nutzer ist angemeldet |
| **Fehlerfälle** | E-Mail bereits vorhanden: Fehlermeldung · Pflichtfeld leer: Fehlermeldung · Passwort zu kurz: Fehlermeldung |

**Akzeptanzkriterium:**
- Ein neuer Nutzer kann sich registrieren und wird direkt angemeldet weitergeleitet.

---

### UC06 — Nutzer einloggen

| Feld | Inhalt |
|---|---|
| **Akteur** | Gast |
| **Vorbedingung** | Nutzer ist registriert und nicht angemeldet |
| **Normaler Ablauf** | 1. E-Mail-Adresse und Passwort eingeben <br> 2. Das System prüft die Zugangsdaten <br> 3. Bei Erfolg wird der Nutzer angemeldet und zum Konfigurator weitergeleitet |
| **Ergebnis** | Nutzer ist angemeldet |
| **Fehlerfälle** | Falsche Zugangsdaten: Fehlermeldung wird angezeigt |

**Akzeptanzkriterium:**
- Ein registrierter Nutzer kann sich einloggen. Bei falschen Zugangsdaten erscheint eine Fehlermeldung.

---

### UC07 — Nutzer ausloggen

| Feld | Inhalt |
|---|---|
| **Akteur** | Angemeldeter Nutzer |
| **Vorbedingung** | Nutzer ist angemeldet |
| **Normaler Ablauf** | 1. Nutzer klickt auf „Abmelden" <br> 2. Die Anmeldung wird beendet <br> 3. Nutzer wird zur Startseite weitergeleitet |
| **Ergebnis** | Nutzer ist abgemeldet · „Meine Pizzen" ist nicht mehr sichtbar |

**Akzeptanzkriterium:**
- Nach dem Abmelden ist „Meine Pizzen" nicht mehr sichtbar.

---

### UC08 — Konfiguration speichern

| Feld | Inhalt |
|---|---|
| **Akteur** | Angemeldeter Nutzer |
| **Vorbedingung** | Nutzer ist angemeldet · Pflichtfelder wurden ausgewählt |
| **Normaler Ablauf** | 1. Nutzer klickt auf „Speichern" <br> 2. Das System prüft die Anmeldung <br> 3. Die Konfiguration wird dem Nutzerkonto zugeordnet und gespeichert |
| **Ergebnis** | Konfiguration ist unter „Meine Pizzen" abrufbar |
| **Fehlerfälle** | Nicht angemeldet: Speichern nicht möglich · Pflichtfeld fehlt: Fehlermeldung |

**Akzeptanzkriterium:**
- Ein angemeldeter Nutzer kann eine Konfiguration speichern. Sie erscheint anschließend unter „Meine Pizzen".

---

### UC09 — Gespeicherte Pizzen anzeigen

| Feld | Inhalt |
|---|---|
| **Akteur** | Angemeldeter Nutzer |
| **Vorbedingung** | Nutzer ist angemeldet |
| **Normaler Ablauf** | 1. Nutzer öffnet „Meine Pizzen" <br> 2. Das System lädt alle gespeicherten Konfigurationen des Nutzers <br> 3. Konfigurationen werden als Karten angezeigt |
| **Ergebnis** | Alle gespeicherten Pizzen des Nutzers werden angezeigt |
| **Leere Ansicht** | Wenn noch keine Konfigurationen gespeichert wurden, erscheint ein Hinweis mit Link zum Konfigurator |

---

### UC10 — Konfiguration löschen

| Feld | Inhalt |
|---|---|
| **Akteur** | Angemeldeter Nutzer |
| **Vorbedingung** | Nutzer ist angemeldet · Konfiguration existiert |
| **Normaler Ablauf** | 1. Nutzer klickt auf „Löschen" <br> 2. Bestätigungsdialog erscheint <br> 3. Nutzer bestätigt <br> 4. Das System prüft ob die Konfiguration dem angemeldeten Nutzer gehört <br> 5. Konfiguration wird gelöscht |
| **Ergebnis** | Konfiguration ist nicht mehr vorhanden |
| **Fehlerfälle** | Fremde Konfiguration: Löschen nicht möglich · Nicht angemeldet: Löschen nicht möglich |

**Akzeptanzkriterium:**
- Ein Nutzer kann nur seine eigenen Konfigurationen löschen.

---

### UC11 — Vorlage laden

| Feld | Inhalt |
|---|---|
| **Akteur** | Gast oder angemeldeter Nutzer |
| **Vorbedingung** | Nutzer befindet sich auf der Startseite |
| **Normaler Ablauf** | 1. Nutzer klickt auf eine der drei Vorlagen (Margherita, Salami oder Hawaii) <br> 2. Der Konfigurator öffnet sich mit den vorausgefüllten Werten der Vorlage <br> 3. Nutzer kann die Vorlage nach Belieben anpassen |
| **Ergebnis** | Konfigurator ist mit Vorlage vorausgefüllt |
