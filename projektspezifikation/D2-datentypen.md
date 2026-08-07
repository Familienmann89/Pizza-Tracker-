# D2 — Datentypenverzeichnis

## Datenbanktypen

| Typ | Verwendung | Wertebereich / Format | Beispiel |
| --- | --- | --- | --- |
| `INT` | IDs, Kalorienwerte | Ganze Zahl; IDs automatisch hochzählend | `1`, `42`, `850` |
| `VARCHAR(n)` | Texte, Codes und Namen | UTF-8, maximal n Zeichen | `"Salami"`, `"PIZZA10"` |
| `DECIMAL(8,2)` | Preise | 0.00 – 999999.99 € | `12.99` |
| `DECIMAL(5,2)` | Rabatt-Prozentsatz | 0.00 – 100.00 % | `10.00` |
| `JSON` | Beläge und Extras | Array von Strings | `["Salami", "Champignons"]` |
| `DATETIME` | Zeitstempel | `YYYY-MM-DD HH:MM:SS` | `2026-07-03 14:30:00` |
| `DATE` | Ablaufdatum eines Gutscheins | `YYYY-MM-DD` | `2027-12-31` |
| `TINYINT(1)` | Wahrheitswert | 0 = false, 1 = true | `1` |

## Domänenwerte

### GRÖSSE

| Wert | Beschreibung |
| --- | --- |
| `S` | Klein |
| `M` | Mittel |
| `L` | Groß |
| `XL` | Extragroß |
| `XXL` | Familiengröße |

### KÄSE

| Wert | Beschreibung |
| --- | --- |
| `Mozzarella` | Klassischer Mozzarella |
| `Gouda` | Gouda |
| `Gorgonzola` | Gorgonzola |
| `Ziegenkäse` | Ziegenkäse |
| `Vegan` | Veganer Käseersatz |

### SAUCE

| Wert | Beschreibung |
| --- | --- |
| `Tomate` | Klassische Tomatensauce |
| `Pesto` | Grünes Pesto |
| `Knoblauch-Öl` | Knoblauch-Öl-Basis |
| `Crème fraîche` | Crème fraîche |
| `BBQ` | BBQ-Sauce |

### TEIG

| Wert | Beschreibung |
| --- | --- |
| `Normal` | Klassischer Teig |
| `Dünn & Knusprig` | Dünner Teig |
| `Dick & Fluffig` | Dicker Teig |
| `Vollkorn` | Vollkornteig |
| `Käserand` | Teig mit Käserand |
```
