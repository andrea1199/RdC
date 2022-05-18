/* Inserimento tuple di prova nel DB */
INSERT INTO Utente VALUES
    ('Normal', 'User', '2000-01-01', 'M', 'normal@user.com', '63a9f0ea7bb98050796b649e85481845', true, 0),
    ('Promoter', 'User', '2000-01-01', 'M', 'promoter@user.com', '63a9f0ea7bb98050796b649e85481845', true, 1);

INSERT INTO ImgMapping VALUES 
    ('chess.png', 'Scacchi'),
    ('wrestling.png', 'Wrestling'),
    ('boardgame.png', 'Dadi (giochi da tavolo)'),
    ('armwrestling.png', 'Braccio di ferro'),
    ('tennis.png', 'Tennis'),
    ('volleyball.png', 'Pallone da pallavolo'),
    ('scherma.png', 'Scherma'),
    ('motocross.png', 'Motocross'),
    ('demolitionderby.png', 'Autoscontro'),
    ('sing.png', 'Microfono (canto)'),
    ('dance.png', 'Ballo'),
    ('carrace.png', 'F1 (corsa di auto)'),
    ('soccer.png', 'Pallone da calcio');


INSERT INTO Evento VALUES
    -- Eventi passati
    (1, 'promoter@user.com', 'Torneo di scacchi', 'Torneo', 'Roma, IT', '2022-04-01 10:30', 
        50, 'Evento torneo di scacchi. 4 persone', False, True, 'chess.png'),
    (2, 'promoter@user.com', 'Duello di Wrestling', 'Singolo', 'Napoli, IT', '2022-04-10 11:30', 
        50, 'Evento duello di Wrestling. 2 persone', False, True, 'wrestling.png'),
    (3, 'promoter@user.com', 'Torneo di giochi da tavolo', 'Torneo', 'Milano, IT', '2022-03-17 12:00',
        20, 'Evento torneo di giochi da tavolo. 4-8 persone', False, True, 'boardgame.png'),
    
    -- Eventi correnti
    (4, 'promoter@user.com', 'Torneo di braccio di ferro', 'Torneo', 'Roma, IT', '2022-05-05 10:30', 
        40, 'Evento torneo di braccio di ferro. 2 persone', True, False, 'armwrestling.png'),
    (5, 'promoter@user.com', 'Torneo di tennis', 'Torneo', 'Verona, IT', '2022-05-06 19:30', 
        30, 'Evento torneo di tennis. 2 persone', True, False, 'tennis.png'),
    (6, 'promoter@user.com', 'Partita di pallavolo', 'Singolo', 'Firenze, IT', '2022-05-08 21:00', 
        90, 'Evento partita di pallavolo. 10 persone', True, False, 'volleyball.png'),
    (7, 'promoter@user.com', 'Duello di scherma', 'Singolo', 'Napoli, IT', '2022-05-10 11:30', 
        30, 'Evento duello di scherma. 2 persone', True, False, 'scherma.png'),
    (8, 'promoter@user.com', 'Gara di motocross', 'Singolo', 'Milano, IT', '2022-05-15 12:00', 
        60, 'Evento gara di motocross. 8-12 persone', True, False, 'motocross.png'),
    (9, 'promoter@user.com', 'Gara di autoscontro', 'Singolo', 'Bari, IT', '2022-05-21 12:00', 
        90, 'Evento gara di autoscontro. 8-12 persone', True, False, 'demolitionderby.png'),

    -- Eventi futuri
    (10, 'promoter@user.com', 'Torneo di D&D', 'Torneo', 'Bari, IT', '2022-08-24 12:00', 
        10, 'Evento torneo di Dungeons & Dragons. 6-8 persone', True, False, 'boardgame.png'),
    (11, 'promoter@user.com', 'Esibizione di canto', 'Singolo', 'Palermo, IT', '2022-09-27 12:00', 
        50, 'Evento esibizione di canto. 1 persona', True, False, 'sing.png'),
    (12, 'promoter@user.com', 'Torneo di ballo', 'Torneo', 'Verona, IT', '2022-11-30 12:00', 
        100, 'Evento torneo di ballo. 10-16 persone', True, False, 'dance.png');
