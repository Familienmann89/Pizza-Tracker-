# D2 — Datentypenverzeichnis

## Datenbanktypen

| Typ | Verwendung | Wertebereich / Format | Beispiel |
|---|---|---|---|
| `INT` | IDs, Flags | Ganzzahl, bei IDs automatisch hochzählend | `1`, `42` |
| `VARCHAR(n)` | Texte, Codes, Namen | UTF-8, maximal n Zeichen | `"Salami"`, `"PIZZA10"` |
| `DECIMAL(8,2)` | Preise | 0.00 – 999999.99 € | `12.99` |
| `DECIMAL(5,2)` | Rabatt-Prozentsatz | 0.00 – 100.00 % | `10.00` |
| `JSON` | Beläge, Extras | Array von Strings | `["Salami", "Champignons"]` |
| `DATETIME` | Zeitstempel | `YYYY-MM-DD HH:MM:SS` | `2026-07-03 14:30:00` |
| `DATE` | Ablaufdatum Gutschein | `YYYY-MM-DD` | `2027-12-31` |
| `TINYINT(1)` | Boolean-Flag | 0 = false, 1 = true | `1` |

## Domänenwerte

### groesse (Pizza-Größe)

| Wert | Beschreibung |
|---|---|
| `S` | Klein |
| `M` | Mittel |
| `L` | Groß |
| `XL` | Extragroß |
| `XXL` | Familiengröße |

### teig (Teigart)

| Wert | Beschreibung |
|---|---|
| `Normal` | Klassischer Teig |
| `Dünn & Knusprig` | Dünner Teig |
| `Dick & Fluffig` | Dicker Teig |
| `Vollkorn` | Vollkornteig |
| `Käserand` | Teig mit Käserand |

### sauce (Sauce)

| Wert | Beschreibung |
|---|---|
| `Tomate` | Klassische Tomatensauce |
| `Pesto` | Grünes Pesto |
| `Knoblauch-Öl` | Knoblauch-Öl-Basis |
| `Crème fraîche` | Crème fraîche |
| `BBQ` | BBQ-Sauce |

### kaese (Käse)

| Wert | Beschreibung |
|---|---|
| `Mozzarella` | Klassischer Mozzarella |
| `Gouda` | Gouda |
| `Gorgonzola` | Gorgonzola |
| `Ziegenkäse` | Ziegenkäse |
| `Vegan` | Veganer Käseersatz |

## HTTP-Fehlercodes

| Code | Typ | Auslöser |
|---|---|---|
| 200 | OK | Erfolgreiche Anfrage |
| 201 | Created | Registrierung, Konfiguration gespeichert |
| 400 | Bad Request | Pflichtfeld leer, ungültige E-Mail, Passwort zu kurz |
| 401 | Unauthorized | Nicht angemeldet bei geschütztem Endpunkt |
| 404 | Not Found | Ungültiger Gutscheincode, fremde Konfiguration |
| 405 | Method Not Allowed | Nicht erlaubte HTTP-Methode, zum Beispiel GET statt POST |
| 409 | Conflict | E-Mail bereits registriert |
| 410 | Gone | Gutscheincode abgelaufen |
