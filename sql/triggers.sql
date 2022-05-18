-- Funzione per diminuire di 1 il numero di posti disponibili dopo una prenotazione
CREATE OR REPLACE FUNCTION diminuisci_posti() RETURNS TRIGGER AS
$$
	BEGIN
		UPDATE evento
			SET postidisponibili = postidisponibili - 1
            WHERE ID = NEW.ID_Evento;
		RETURN null;
	END;
$$ LANGUAGE PLPGSQL;

-- Funzione per aumentare di 1 il numero di posti disponibili dopo una disdetta della prenotazione
CREATE OR REPLACE FUNCTION aumenta_posti() RETURNS TRIGGER AS
$$
	BEGIN
		UPDATE evento
			SET postidisponibili = postidisponibili + 1
            WHERE ID = OLD.ID_Evento;
		RETURN null;
	END;
$$ LANGUAGE PLPGSQL;

-- Triggers per attivare le funzioni
CREATE OR REPLACE TRIGGER trigger_insert_prenotazione AFTER INSERT ON prenotazione
FOR EACH ROW EXECUTE PROCEDURE diminuisci_posti();

CREATE OR REPLACE TRIGGER trigger_delete_prenotazione AFTER DELETE ON prenotazione
FOR EACH ROW EXECUTE PROCEDURE aumenta_posti();

-- Funzione per aggiornare i flag "passato" e "disponibile" in base al timestamp attuale
CREATE OR REPLACE FUNCTION set_flags() RETURNS TRIGGER AS
$$
	BEGIN
		UPDATE evento
			SET passato = true, disponibile = false
            WHERE dataora < (SELECT NOW()::timestamp);
		RETURN null;
	END;
$$ LANGUAGE PLPGSQL;

-- Triggers per attivare la funzione
-- I flag verranno aggiornati ad ogni prenotazione inserita o tolta
CREATE OR REPLACE TRIGGER trigger_insert_prenotazione_flags AFTER INSERT ON prenotazione
FOR EACH ROW EXECUTE PROCEDURE set_flags();

CREATE OR REPLACE TRIGGER trigger_delete_prenotazione_flags AFTER DELETE ON prenotazione
FOR EACH ROW EXECUTE PROCEDURE set_flags();
