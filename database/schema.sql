CREATE DATABASE IF NOT EXISTS pizza_tracker
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE pizza_tracker;

CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vorname VARCHAR(100) NOT NULL,
    nachname VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    passwort VARCHAR(255) NOT NULL,
    strasse VARCHAR(255) NOT NULL,
    hausnummer VARCHAR(20) NOT NULL,
    plz VARCHAR(10) NOT NULL,
    stadt VARCHAR(100) NOT NULL,
    telefon VARCHAR(30) DEFAULT NULL,
    erstellt_am DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS konfigurationen (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    name VARCHAR(100) NOT NULL DEFAULT 'Meine Pizza',
    groesse VARCHAR(10) NOT NULL,
    teig VARCHAR(50) NOT NULL,
    sauce VARCHAR(50) NOT NULL,
    kaese VARCHAR(50) NOT NULL,
    belaege JSON NOT NULL,
    extras JSON DEFAULT NULL,
    gutschein_code VARCHAR(50) DEFAULT NULL,
    preis DECIMAL(8,2) NOT NULL,
    erstellt_am DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_konfigurationen_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS gutscheine (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    rabatt_prozent DECIMAL(5,2) NOT NULL,
    aktiv TINYINT(1) NOT NULL DEFAULT 1,
    gueltig_bis DATE DEFAULT NULL,
    erstellt_am DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO gutscheine (code, rabatt_prozent, aktiv, gueltig_bis)
VALUES
    ('PIZZA10', 10.00, 1, '2027-12-31'),
    ('SPARE20', 20.00, 1, '2027-06-30'),
    ('WELCOME', 15.00, 1, '2027-12-31'),
    ('STUDENT5', 5.00, 1, NULL)
ON DUPLICATE KEY UPDATE
    rabatt_prozent = VALUES(rabatt_prozent),
    aktiv = VALUES(aktiv),
    gueltig_bis = VALUES(gueltig_bis);
