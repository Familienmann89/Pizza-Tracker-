# D2 — Datentypenverzeichnis

## Basistypen

Die Typnamen in [D1](D1-datenmodell.md) sind fachliche Basistypen. Die Tabelle ordnet sie der Umsetzung in `database/schema.sql` zu.

| Typ | Bedeutung | Umsetzung in der Datenbank |
|---|---|---|
| Zahl | Ganzzahlige technische Kennung | `INT UNSIGNED` |
| Text | Zeichenkette mit Höchstlänge | `VARCHAR(n)`, Länge je Spalte |
| Liste | Liste von Optionsnamen (Beläge, Extras) | `JSON`-Array |
| Betrag | Eurobetrag mit zwei Nachkommastellen | `DECIMAL(8,2)` |
| Prozent | Rabatt in Prozent | `DECIMAL(5,2)` |
| JaNein | Wahrheitswert | `TINYINT(1)` (1 = ja, 0 = nein) |
| Datum | Kalenderdatum bzw. Zeitpunkt | `DATE` (`gueltig_bis`), `DATETIME` (`erstellt_am`) |
| Kalorien | Ganze Kilokalorien; wird berechnet, nicht gespeichert | — |

Die Domänentypen `Groesse`, `Teig`, `Sauce` und `Kaese` werden als Text gespeichert; zulässig sind nur die unten aufgeführten Werte. Beläge und Extras werden als Liste gespeichert; zulässig sind die Namen aus den Tabellen „Beläge“ und „Extras“ weiter unten. Maßgeblich ist `data/pizza_data.json`; der Server lehnt unbekannte Werte ab.

## Domänenwerte

### Groesse (Pizza-Größe)

| Wert | Beschreibung | Durchmesser |
|---|---|---:|
| S | Klein | 20 cm |
| M | Mittel | 26 cm |
| L | Groß | 30 cm |
| XL | Extragroß | 34 cm |
| XXL | Familiengröße | 40 cm |

### Teig (Teigart)

| Wert | Beschreibung |
|---|---|
| Normal | Klassischer Teig |
| Dünn & Knusprig | Dünner Teig |
| Dick & Fluffig | Dicker Teig |
| Vollkorn | Vollkornteig |
| Käserand | Teig mit Käserand |
| Protein-Teig (Low Carb) | Teig mit höherem Protein- und geringerem Kohlenhydratanteil |

### Sauce

| Wert | Beschreibung |
|---|---|
| Tomate | Klassische Tomatensauce |
| Pesto | Grünes Pesto |
| Knoblauch-Öl | Knoblauch-Öl-Basis |
| Crème fraîche | Crème fraîche |
| BBQ | BBQ-Sauce |

### Kaese (Käse)

| Wert | Beschreibung |
|---|---|
| Mozzarella | Klassischer Mozzarella |
| Gouda | Gouda |
| Gorgonzola | Gorgonzola |
| Ziegenkäse | Ziegenkäse |
| Vegan | Veganer Käseersatz |
| Light-Mozzarella | Fettreduzierter Mozzarella |
| Gouda light | Fettreduzierter Gouda |

---

## Nährwert- und Kennzeichnungsdaten

Seit M3 trägt jede Auswahlmöglichkeit in `data/pizza_data.json` neben `preis` und `kcal` auch
`protein`, `kohlenhydrate`, `fett` und `ballaststoffe` (jeweils Gramm je ganzer Pizza bzw. als
Differenz zur Basisgröße) sowie `allergene`, `vegetarisch` und `vegan`.

> **Herkunft der Werte.** Die Makronährwerte wurden aus üblichen Lebensmittel-Referenzwerten abgeleitet
> und so gerundet, dass 4 kcal/g Protein + 4 kcal/g Kohlenhydrate + 9 kcal/g Fett die bereits zuvor
> hinterlegten Kalorien plausibel ergeben (größte Abweichung 6 kcal). Es sind berechnete Richtwerte,
> keine Laborwerte einer konkreten Rezeptur. Preise und Kalorien wurden dabei nicht verändert.

### Größen

| Größe | Aufpreis | kcal | Protein g | KH g | Fett g | Allergene | Kennzeichnung |
|---|---:|---:|---:|---:|---:|---|---|
| S | 5.90 € | +420 | +14 | +77 | +6 | Glutenhaltiges Getreide | — |
| M | 7.50 € | +560 | +19 | +103 | +8 | Glutenhaltiges Getreide | — |
| L | 9.20 € | +720 | +24 | +132 | +10 | Glutenhaltiges Getreide | — |
| XL | 11.20 € | +900 | +30 | +165 | +13 | Glutenhaltiges Getreide | — |
| XXL | 13.90 € | +1150 | +39 | +211 | +16 | Glutenhaltiges Getreide | — |

### Teigarten

| Teig | Aufpreis | kcal | Protein g | KH g | Fett g | Allergene | Kennzeichnung |
|---|---:|---:|---:|---:|---:|---|---|
| Normal | 0.00 € | +0 | +0 | +0 | +0 | — | — |
| Dünn & Knusprig | 0.50 € | -70 | -2 | -13 | -1 | — | leichter |
| Dick & Fluffig | 0.80 € | +120 | +4 | +22 | +2 | — | — |
| Vollkorn | 0.80 € | +40 | +4 | +3 | +1 | — | leichter |
| Käserand | 2.20 € | +230 | +14 | +12 | +14 | Milch | — |
| Protein-Teig (Low Carb) | 2.40 € | -95 | +26 | -70 | +9 | Glutenhaltiges Getreide, Soja | neu, leichter |

### Saucen

| Sauce | Aufpreis | kcal | Protein g | KH g | Fett g | Allergene | Kennzeichnung |
|---|---:|---:|---:|---:|---:|---|---|
| Tomate | 0.00 € | +55 | +2 | +9 | +1 | — | — |
| Pesto | 1.20 € | +140 | +3 | +3 | +13 | Milch | — |
| Knoblauch-Öl | 0.90 € | +120 | +0 | +1 | +13 | — | — |
| Crème fraîche | 1.20 € | +165 | +2 | +3 | +16 | Milch | — |
| BBQ | 0.80 € | +95 | +1 | +20 | +1 | — | — |

### Käsesorten

| Käse | Aufpreis | kcal | Protein g | KH g | Fett g | Allergene | Kennzeichnung |
|---|---:|---:|---:|---:|---:|---|---|
| Mozzarella | 0.00 € | +240 | +17 | +3 | +18 | Milch | — |
| Gouda | 0.80 € | +270 | +19 | +1 | +21 | Milch | — |
| Gorgonzola | 1.40 € | +260 | +16 | +1 | +21 | Milch | — |
| Ziegenkäse | 1.50 € | +245 | +16 | +2 | +19 | Milch | — |
| Vegan | 1.20 € | +210 | +2 | +16 | +15 | — | — |
| Light-Mozzarella | 0.60 € | +165 | +20 | +3 | +8 | Milch | neu, leichter |
| Gouda light | 1.00 € | +190 | +22 | +1 | +11 | Milch | neu, leichter |

### Beläge

| Belag | Aufpreis | kcal | Protein g | KH g | Fett g | Allergene | Kennzeichnung |
|---|---:|---:|---:|---:|---:|---|---|
| Salami | 1.50 € | +165 | +9 | +1 | +14 | — | — |
| Schinken | 1.50 € | +120 | +14 | +1 | +7 | — | — |
| Champignons | 1.00 € | +25 | +3 | +3 | +0 | — | leichter |
| Paprika | 1.00 € | +30 | +1 | +6 | +0 | — | leichter |
| Zwiebeln | 0.80 € | +35 | +1 | +8 | +0 | — | leichter |
| Mais | 1.00 € | +75 | +2 | +15 | +1 | — | — |
| Ananas | 1.00 € | +65 | +1 | +15 | +0 | — | — |
| Rucola | 1.20 € | +15 | +2 | +1 | +0 | — | leichter |
| Oliven | 1.20 € | +80 | +1 | +1 | +8 | — | — |
| Thunfisch | 1.80 € | +145 | +24 | +0 | +5 | Fisch | — |
| Geflügelsalami | 1.50 € | +105 | +13 | +1 | +5 | — | neu, leichter |
| Hähnchenbrust | 1.90 € | +110 | +23 | +0 | +2 | — | neu, leichter |

### Extras

| Extra | Aufpreis | kcal | Protein g | KH g | Fett g | Allergene | Kennzeichnung |
|---|---:|---:|---:|---:|---:|---|---|
| Extra Käse | 1.50 € | +180 | +13 | +2 | +13 | Milch | — |
| Knoblauch-Dip | 1.00 € | +110 | +1 | +2 | +11 | Milch | — |
| Chili-Öl | 0.70 € | +70 | +0 | +0 | +8 | — | — |

### Ernährungskennzeichnungen

Die Kennzeichnungen werden ausschließlich aus den obigen Daten berechnet — nie aus dem Namen einer Pizza.

| Kennzeichnung | Regel |
|---|---|
| High Protein | Protein mindestens 30 g und mindestens 25 % der Kalorien aus Protein |
| Low Carb | höchstens 30 % der Kalorien aus Kohlenhydraten |
| Vegetarisch | keine Zutat mit vegetarisch=false |
| Vegan | alle gewählten Zutaten mit vegan=true |
| Leichtere Wahl | mindestens eine als leicht=true gekennzeichnete Zutatenvariante gewählt |

Ein Gutschein reduziert ausschließlich den Preis. Kalorien und Nährwerte bleiben unverändert.
