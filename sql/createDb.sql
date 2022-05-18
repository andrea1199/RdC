/* Tabella Utenti iscritti 
 * Gli utenti possono essere di vari tipi (con vari privilegi):
 * Privilegi=0 => Utente standard
 * Privilegi=1 => Utente organizzatore 
 * Privilegi=2 => DBA (massimo livello di privilegi)
 * Privilegi=3 => Utente standard in attesa di diventare organizzatore
 * Password salvate in formato MD5
*/
CREATE TABLE Utente(
    Nome                VARCHAR NOT NULL,
    Cognome             VARCHAR NOT NULL,
    DataNascita         DATE NOT NULL,
    Sesso               CHAR(1) NOT NULL,
    Email               VARCHAR,
    Passwd              VARCHAR NOT NULL,
    Verificato          BOOLEAN NOT NULL,
    Privilegi           INT NOT NULL,
    
    PRIMARY KEY (Email)
);

/* Tabella per il mapping tra il nome di un immagine e il suo titolo */
CREATE TABLE ImgMapping(
    Nome                VARCHAR,
    Titolo              VARCHAR,

    PRIMARY KEY (Nome)
);

/* Tabella Eventi organizzati
 * Un evento può essere ancora disponibile oppure già passato (non prenotabile)
 * ed ha un numero limitato di posti.
*/
CREATE TABLE Evento(
    ID                  INT,
    Organizzatore       VARCHAR NOT NULL,
    Titolo              VARCHAR NOT NULL,
    Tipo                VARCHAR,
    Luogo               VARCHAR,
    DataOra             TIMESTAMP,
    PostiDisponibili    INT,
    Descrizione         VARCHAR,
    Disponibile         BOOLEAN,
    Passato             BOOLEAN,
    Immagine            VARCHAR,

    PRIMARY KEY (ID),
    FOREIGN KEY (Organizzatore) REFERENCES Utente,
    FOREIGN KEY (Immagine) REFERENCES ImgMapping
);

/* Tabella delle prenotazioni
 * Ogni persona può prenotare al massimo una sola volta ogni evento
*/
CREATE TABLE Prenotazione(
    ID_Evento           INT,
    Email_Utente        VARCHAR,
    DataOra             TIMESTAMP,

    PRIMARY KEY (ID_Evento, Email_Utente),
    FOREIGN KEY (Email_Utente) REFERENCES Utente,
    FOREIGN KEY (ID_Evento) REFERENCES Evento
);

/* Inserimento utente DBA */
INSERT INTO Utente VALUES
    ('Database', 'Administrator', '2000-01-01', 'M', 'dba@pgsql.com', '63a9f0ea7bb98050796b649e85481845', true, 2);
