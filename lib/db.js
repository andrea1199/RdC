const pg = require('pg');
const cjs = require('crypto-js')

// Configurazione parametri
const config = {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'biar',
    database: 'EventHubDB',
    port: 5432
};

// Funzione ausiliaria per la gestione delle date degli eventi
function getDate(which) {
    // Data di oggi
    var oggi = new Date();

    // Seleziona la data richiesta
    switch(which) {
        // Se viene richiesta la data di oggi
        case 'oggi':
            return oggi;
            
        // Se viene richiesta la data di 1 mese a partire da oggi
        case 'mese':
            // Se il mese corrente è 12, il prossimo mese sarà 01 dell'anno successivo
            if (oggi.getMonth() == 12) {
                oggi.setMonth(1);
                oggi.setFullYear(oggi.getFullYear() + 1);
            }
            else
                oggi.setMonth(oggi.getMonth() + 1);
            
            return oggi;

        // Se viene richiesta la data di 1 settimana a partire da oggi
        case 'settimana':
            // Se il giorno non cade nel mese successivo (30gg)
            if (oggi.getDate() + 7 <= 30 && oggi.getMonth() != 2) {
                oggi.setDate(oggi.getDate() + 7);
                return oggi;
            }

            // Se il giorno non cade nel mese successivo (febbraio)
            if (oggi.getDate() + 7 <= 28 && oggi.getMonth() == 2) {
                oggi.setDate(oggi.getDate() + 7);
                return oggi; 
            }

            // Se il giorno non cade nel mese successivo (31gg)
            if (oggi.getDate() + 7 == 31 && 
                (oggi.getMonth() == 1 || oggi.getMonth() == 3 || oggi.getMonth() == 5 ||
                oggi.getMonth() == 7 || oggi.getMonth() == 8 || oggi.getMonth() == 10 ||
                oggi.getMonth() == 12)) {
                oggi.setDate(oggi.getDate() + 7);
                return oggi;
            }

            // Se il giorno cade nel mese successivo (febbraio)
            if (oggi.getDate() + 7 > 28 && oggi.getMonth() == 2) {
                oggi.setDate(oggi.getDate() + 7 - 28);
                oggi.setMonth(oggi.getMonth() + 1);
                return oggi;
            }

            // Se il giorno cade nel mese successivo (31gg)
            if (oggi.getDate() + 7 > 31) {
                // Se il mese è dicembre
                if (oggi.getMonth() == 12) {
                    oggi.setMonth(1);
                    oggi.setFullYear(oggi.getFullYear() + 1);
                    oggi.setDate(oggi.getDate() + 7 - 31);
                    return oggi;
                }
                // Altrimenti se il mese ha 31gg
                if (oggi.getMonth() == 1 || oggi.getMonth() == 3 || oggi.getMonth() == 5 ||
                    oggi.getMonth() == 7 || oggi.getMonth() == 8 || oggi.getMonth() == 10) {
                    oggi.setDate(oggi.getDate() + 7 - 31);
                    oggi.setMonth(oggi.getMonth() + 1);
                    return oggi;
                }
            }

            // Se il giorno cade nel mese successivo (30gg)
            if (oggi.getDate() + 7 > 30)
                if (oggi.getMonth() == 4 || oggi.getMonth() == 6 || oggi.getMonth() == 9 ||
                    oggi.getMonth() == 11) {
                    oggi.setDate(oggi.getDate() + 7 - 30);
                    oggi.setMonth(oggi.getMonth() + 1);
                    return oggi;
                }

            break;

        // Se viene richiesta la data di domani
        case 'domani':
            // Se il giorno non cade nel mese successivo (30gg)
            if (oggi.getDate() + 1 <= 30 && oggi.getMonth() != 2) {
                oggi.setDate(oggi.getDate() + 1);
                return oggi;
            }

            // Se il giorno non cade nel mese successivo (febbraio)
            if (oggi.getDate() + 1 <= 28 && oggi.getMonth() == 2) {
                oggi.setDate(oggi.getDate() + 1);
                return oggi;
            }

            // Se il giorno non cade nel mese successivo (31gg)
            if (oggi.getDate() + 1 == 31 && 
                (oggi.getMonth() == 1 || oggi.getMonth() == 3 || oggi.getMonth() == 5 ||
                oggi.getMonth() == 7 || oggi.getMonth() == 8 || oggi.getMonth() == 10 ||
                oggi.getMonth() == 12)) {
                oggi.setDate(oggi.getDate() + 1);
                return oggi;
            }

            // Se il giorno cade nel mese successivo (febbraio)
            if (oggi.getDate() + 1 > 28 && oggi.getMonth() == 2) {
                oggi.setDate(oggi.getDate() + 1 - 28);
                oggi.setMonth(oggi.getMonth() + 1);
                return oggi;
            }

            // Se il giorno cade nel mese successivo (31gg)
            if (oggi.getDate() + 1 > 31) {
                // Se il mese è dicembre
                if (oggi.getMonth() == 12) {
                    oggi.setMonth(1);
                    oggi.setFullYear(oggi.getFullYear() + 1);
                    oggi.setDate(oggi.getDate() + 1 - 31);
                    return oggi;
                }
                // Altrimenti se il mese ha 31gg
                if (oggi.getMonth() == 1 || oggi.getMonth() == 3 || oggi.getMonth() == 5 ||
                    oggi.getMonth() == 7 || oggi.getMonth() == 8 || oggi.getMonth() == 10) {
                    oggi.setDate(oggi.getDate() + 1 - 31);
                    oggi.setMonth(oggi.getMonth() + 1);
                    return oggi;
                }
            }

            // Se il giorno cade nel mese successivo (30gg)
            if (oggi.getDate() + 1 > 30)
                if (oggi.getMonth() == 4 || oggi.getMonth() == 6 || oggi.getMonth() == 9 ||
                    oggi.getMonth() == 11) {
                    oggi.setDate(oggi.getDate() + 1 - 30);
                    oggi.setMonth(oggi.getMonth() + 1);
                    return oggi;
                }

            break;
    }
}

/* Funzione per la query al db
 * Per ogni query che viene eseguita genera un nuovo client
 * e si connette al db.
 * Una volta eseguita la query, il client viene disconnesso,
 * così da lasciare il canale libero
*/
async function runQuery(query) {
    // Configurazione del client
    const client = new pg.Client(config);

    // Connessione
    client.connect(err => {
        if (err) throw err;
        // console.log(">Connesso al db");
    });

    // Esegui la query
    try {
        return (await client.query(query)).rows;
    }
    catch (err) {
        console.log(err);
    }
    finally {
        client.end();
        // console.log(">Disconnesso dal db");
    }
}

// Funzione per la query al db di tipo Insert/Delete/Update
// Restituisce il numero di righe della query invece delle righe stesse
async function runInsDelUpd(query) {
    // Configurazione del client
    const client = new pg.Client(config);

    // Connessione
    client.connect(err => {
        if (err) throw err;
        // console.log(">Connesso al db");
    });

    // Esegui la query
    try {
        return (await client.query(query)).rowCount;
    }
    catch (err) {
        console.log(err);
    }
    finally {
        client.end();
        // console.log(">Disconnesso dal db");
    }
}

// Funzione per prendere i dati della main-listing
async function loadMainListing() {
    // Sono gli eventi che cadono entro il prossimo mese
    var mese = getDate('mese').toISOString();

    // Query per il main-listing
    var query = "SELECT Titolo, Tipo, DataOra, PostiDisponibili, Descrizione, ID, Disponibile,\
                Immagine, Luogo, Organizzatore\
                FROM Evento WHERE Disponibile = true AND Dataora <= \'" + mese + "\'\
                ORDER BY ID;";

    // Esegui la query
    try {
        return await runQuery(query);
    }
    catch (err) {
        console.log(err);
    }
}

// Funzione per prendere i dati della main-listing (eventi "Highlights")
async function loadHighlights() {
    // Gli highlights sono gli eventi che cadono entro una settimana da oggi
    var oggi = getDate('oggi').toISOString();
    var sett = getDate('settimana').toISOString();

    // Imposta la query
    var query = "SELECT Titolo, Tipo, DataOra, PostiDisponibili, Descrizione, ID, Disponibile,\
                Immagine, Luogo, Organizzatore\
                FROM Evento WHERE Disponibile = true AND DataOra >= \'" + oggi + "\'\
                AND DataOra <= \'" + sett + "\' ORDER BY ID;";

    // Esegui la query
    try {
        return await runQuery(query);
    }
    catch (err) {
        console.log(err);
    }
}

// Funzione per prendere i dati della main-listing (eventi "Prossimamente")
async function loadNext() {
    // Sono gli eventi che cadono a partire dal prossimo mese
    var mese = getDate('mese').toISOString();

    // Imposta la query
    var query = "SELECT Titolo, Tipo, DataOra, PostiDisponibili, Descrizione, ID, Disponibile,\
                Immagine, Luogo, Organizzatore\
                FROM Evento WHERE Disponibile = true AND DataOra >= \'" + mese + "\' ORDER BY ID;";

    // Esegui la query
    try {
        return await runQuery(query);
    }
    catch (err) {
        console.log(err);
    }
}

// Funzione per prendere i dati della main-listing ("Eventi conclusi")
async function loadPassed() {
    // Sono gli eventi che sono già passati
    var oggi = getDate('oggi').toISOString();

    // Imposta la query
    var query = "SELECT Titolo, Tipo, DataOra, PostiDisponibili, Descrizione, ID, Disponibile,\
                Immagine, Luogo, Organizzatore\
                FROM Evento WHERE Passato = true AND DataOra < \'" + oggi + "\' ORDER BY ID;";

    // Esegui la query
    try {
        return await runQuery(query);
    }
    catch (err) {
        console.log(err);
    }
}

/* Funzione per inserire un nuovo utente (registrazione)
 * Restituisce dei codici di errore a seconda del risultato della query:
 *  0 = query eseguita con successo
 *  -1 = query fallita (utente già registrato)
*/
async function insertUser(user) {
    // Query per l'inserimento
    var query = 'INSERT INTO Utente VALUES (';
    query += '\'' + user.nome + '\',';
    query += '\'' + user.cognome + '\',';
    query += '\'' + user.datanasc + '\',';
    query += '\'' + user.sesso + '\',';
    query += '\'' + user.email + '\',';
    query += '\'' + cjs.MD5(user.password).toString() + '\',';
    query += user.validato + ',';
    query += user.privilegi + ');';

    // Esegui la query
    try {
        var res = await runInsDelUpd(query);
        // Se viene eliminata 1 riga allora la query è andata a buon fine
        if (res == 1) return 0;
    }
    catch (err) {
        // Altrimenti viene generato un errore catturato qui
        return -1;
    }
}

// Funzione per prendere il massimo id evento presente nel db
async function getMaxID() {
    var query = 'SELECT max(id) FROM Evento;';

    // Esegui la query
    try {
        return (await runQuery(query))[0].max;
    }
    catch (err) {
        console.log(err);
    }
}

// Funzione per prendere la lista delle immagini disponibili
async function getImagesList() {
    var query = 'SELECT Nome, Titolo FROM ImgMapping;';

    // Esegui la query
    try {
        return (await runQuery(query));
    }
    catch (err) {
        console.log(err);
    }
}

/*Funzione per inserire un nuovo evento
 * Restituisce dei codici di errore a seconda del risultato della query:
 * 0 = inserimento effettuato con successo
 * -1 = query fallita
*/
async function insertEvent(event) {
    // Ricava l'id massimo presente per assegnare il successivo
    var id = await getMaxID();
    id += 1; // ID successivo

    // Imposta la query
    var query = 'INSERT INTO Evento VALUES (';
    query += id + ',';
    query += '\'' + event.organizzatore + '\',';
    query += '\'' + event.titolo + '\',';
    query += '\'' + event.tipo + '\',';
    query += '\'' + event.luogo + '\',';
    query += '\'' + event.data + '\',';
    query += '\'' + event.posti + '\',';
    query += '\'' + event.descrizione + '\',';
    query += 'true,false,';
    query += '\'' + event.immagine + '\');';

    // Esegui la query
    try {
        var res = await runInsDelUpd(query);
        // Se viene inserita 1 riga allora la query è andata a buon fine
        if (res == 1) return 0;
    }
    catch (err) {
        // Altrimenti viene generato un errore catturato qui
        return -1;
    }
}

/*Funzione per eliminare un evento esistente
 * Restituisce dei codici di errore a seconda del risultato della query:
 * 0 = rimozione effettuata con successo
 * -1 = query fallita
*/
async function deleteEvent(eventID) {
    // Rimuovi tutti gli utenti prenotati a quell'evento
    var remUser = 'DELETE FROM Prenotazione WHERE ID_Evento = ' + eventID + ';';

    // Imposta la query
    var query = 'DELETE FROM Evento WHERE id = ' + eventID + ';';

    // Esegui le query
    try {
        // Rimuovi gli eventuali utenti
        await runInsDelUpd(remUser);

        // Rimuovi l'evento
        var res = await runInsDelUpd(query);
        
        // Se viene tolta 1 riga allora la query è andata a buon fine
        if (res == 1) return 0;
    }
    catch (err) {
        // Altrimenti viene generato un errore catturato qui
        return -1;
    }
}

/* Funzione per cambiare i dati di un utente
 * Restituisce dei codici di errore a seconda del risultato della query:
 *  0 = query eseguita con successo
 *  -1 = query fallita
 *  -2 = password inserita nel form non corretta
*/
async function changeUser(user) {
    // Verifica che la password attuale immessa sia corretta
    var pwdQuery = "SELECT Passwd FROM Utente WHERE Email = \'" + user.email + "\';";
    
    // Esegui la query
    try {
        var pwd = await runQuery(pwdQuery);

        // Se la password è corretta
        if (cjs.MD5(user.oldpwd).toString() == pwd[0].passwd) {
            // Query per l'inserimento
            var query = 'UPDATE Utente SET ';
            query += 'Nome = \'' + user.nome + '\',';
            query += 'Cognome = \'' + user.cognome + '\',';
            query += 'DataNascita = \'' + user.datanasc + '\',';
            query += 'Passwd = \'' + cjs.MD5(user.newpwd).toString() + '\' ';
            query += 'WHERE Email = \'' + user.email + '\';';
        
            // Esegui la query
            try {
                var res = await runInsDelUpd(query);
                // Se viene sostituita 1 riga allora la query è andata a buon fine
                if (res == 1) return 0;
            }
            catch (err) {
                // Altrimenti viene generato un errore catturato qui
                console.log(err);
                return -1;
            } 
        }
        // Password inserita non corretta
        else return -2;
    }
    catch (err) {
        // Altrimenti viene generato un errore catturato qui
        console.log(err);
        return -1;
    }
}

/* Funzione per la ricerca della password di un utente (login)
*  Restituisce dei codici a seconda del risultato ottenuto:
*   nome utente = Credenziali corrette
*   -1 = Password errata
*   -2 = Utente non registrato
*/
async function logUser(user) {
    // Query per la ricerca della password
    var query = 'SELECT passwd, nome FROM Utente WHERE email = \'' + user.email + '\';';

    // Esegui la query
    try {
        var res = await runQuery(query);

        // Se viene restituito un risultato dalla query
        if (res.length > 0) {
            // Genera e confronta gli hash
            var hash = cjs.MD5(user.password).toString();

            if (res[0]['passwd'] == hash) return res[0]['nome'];
            else return -1;
        }
        else return -2;
    }
    catch (err) {
        console.log(err);
    }
}

// Funzione per prendere il livello di privilegi di un utente
async function getLevel(email) {
    // Imposta la query
    var query = 'SELECT privilegi FROM Utente WHERE email = \'' + email + '\';';

    // Esegui la query
    try {
        return await runQuery(query);
    }
    catch (err) {
        console.log(err);
        return -1;
    }
}

/* Funzione per inserire una nuova prenotazione nel db
 * Restituisce dei codici a seconda del risultato ottenuto:
 *  0 = Inserimento effettuato con successo
 *  -1 = Errore nelle query
 *  -2 = Posti non disponibili
 *  -3 = Utente già registrato all'evento
*/
async function book(id, user) {
    // Controlla che la persona non sia già prenotata per questo evento
    var query = "SELECT * FROM Prenotazione WHERE Email_Utente = \'" + user.email +
        "\' AND ID_Evento = " + id;

    try {
        var res = await runQuery(query);

        // Se l'utente non è già iscritto
        if (res.length == 0) {
            // Controlla che i posti disponibili ci siano ancora
            query = "SELECT PostiDisponibili FROM Evento WHERE ID = " + id;

            try {
                res = await runQuery(query);

                // Se i posti ci sono allora prenota
                if (res[0]['postidisponibili'] > 0) {
                    // Imposta il timestamp della prenotazione
                    var now = new Date();
                    var timestamp = now.getFullYear() + '-' +
                        (now.getMonth() + 1).toString() + '-' +
                        now.getDate() + ' ' +
                        now.getHours() + ':' +
                        now.getMinutes() + ':' +
                        now.getSeconds();

                    query = "INSERT INTO Prenotazione VALUES (" +
                        id + ", \'" + user.email + "\', \'" + timestamp + "\')";

                    try {
                        res = await runQuery(query);

                        // Se res.length è 0 allora la query è andata a buon fine
                        if (res.length == 0) return 0;
                    }
                    catch (err) {
                        // Altrimenti viene generato un errore catturato qui
                        console.log(err);
                        return -1;
                    }
                }
                // Altrimenti restituisci un errore (posti non disponibili)
                else return -2;
            }
            catch (err) {
                console.log(err);
                return -1;
            }
        }
        // Altrimenti restituisci un errore (utente giò registrato all'evento)
        else return -3;
    }
    catch (err) {
        console.log(err);
        return -1;
    }
}

// Funzione per la ricerca di eventi
async function search(src) {
    // Imposta la query
    var query = "SELECT Titolo, Tipo, DataOra, PostiDisponibili, Descrizione, ID, Immagine,\
                Luogo, Organizzatore, Disponibile\
                FROM Evento WHERE Titolo ILIKE \'%" + src + "%\' ORDER BY ID;"

    // Esegui la query
    try {
        return await runQuery(query);
    }
    catch (err) {
        console.log(err);
        return -1;
    }
}

// Funzione per la visualizzazione delle prenotazioni effettuate
async function prenotazioni(user) {
    // Imposta la query
    var query = "SELECT Titolo, Evento.DataOra, ID FROM Evento JOIN Prenotazione\
                ON ID_Evento = ID WHERE Disponibile = true AND Email_Utente =\'" + user + "\';"

    // Esegui la query
    try {
        return await runQuery(query);
    }
    catch (err) {
        console.log(err);
        return -1;
    }
}

// Funzione per la visualizzazione delle prenotazioni effettuate nello storico
async function storico(user) {
    // Imposta la query
    var query = "SELECT Titolo, Evento.DataOra, Luogo FROM Evento JOIN Prenotazione\
                ON ID_Evento = ID WHERE Passato = true AND Email_Utente =\'" + user + "\';"

    // Esegui la query
    try {
        return await runQuery(query);
    }
    catch (err) {
        console.log(err);
        return -1;
    }
}

// Funzione per la visualizzazione degli eventi creati (organizzatore)
async function organizzazioni(org) {
    // Imposta la query
    var query = "SELECT Titolo, DataOra, ID FROM Evento\
                WHERE Organizzatore =\'" + org + "\';"

    // Esegui la query
    try {
        return await runQuery(query);
    }
    catch (err) {
        console.log(err);
        return -1;
    }
}

// Funzione per la richiesta di diventare organizzatore
async function beOrganizer(email) {
    // Imposta la query
    var query = "UPDATE Utente SET Privilegi = 3 WHERE Email = \'" + email + "\';";

    // Esegui la query
    try {
        var res = await runInsDelUpd(query);
        // Se viene sostituita 1 riga allora la query è andata a buon fine
        if (res == 1) return 0;
    }
    catch (err) {
        console.log(err);
        return -1;
    }
}

// Funzione per prendere tutte le nuove richieste per diventare organizzatori
async function getRequests() {
    // Imposta la query
    var query = 'SELECT Nome, Cognome, Email FROM Utente WHERE Privilegi = 3;';

    // Esegui la query
    try {
        return await runQuery(query);
    }
    catch (err) {
        console.log(err);
        return -1;
    }
}

// Funzione per accettare una richiesta per diventare organizzatori
async function acceptRequest(email) {
    // Imposta la query
    var query = "UPDATE Utente SET Privilegi = 1 WHERE Email = \'" + email + "\';";

    // Esegui la query
    try {
        var res = await runInsDelUpd(query);
        // Se viene sostituita 1 riga allora la query è andata a buon fine
        if (res == 1) return 0;
    }
    catch (err) {
        console.log(err);
        return -1;
    }
}

// Funzione per respingere una richiesta per diventare organizzatori
async function declineRequest(email) {
    // Imposta la query
    var query = "UPDATE Utente SET Privilegi = 0 WHERE Email = \'" + email + "\';";

    // Esegui la query
    try {
        var res = await runInsDelUpd(query);
        // Se viene sostituita 1 riga allora la query è andata a buon fine
        if (res == 1) return 0;
    }
    catch (err) {
        console.log(err);
        return -1;
    }
}

/* Funzione per disdire una prenotazione effettuata
 * Restituisce dei codici di errore:
 *  0 = Disdetta effettuata con successo
 *  -1 = Errore nelle query
 *  -2 = Disdetta fallita
*/
async function unbook(id, user) {
    // Imposta la query
    var query = "DELETE FROM Prenotazione WHERE Email_Utente =\'" + user + "\'\
                AND ID_Evento =" + id + ";"

    // Esegui la query
    try {
        var res = await runInsDelUpd(query);

        if (res == 1)
            return 0;
        else return -2;
    }
    catch (err) {
        console.log(err);
        return -1;
    }
}

// Funzione per eliminare il profilo di un utente
async function deleteUser(email) {
    // Rimuovi tutte le prenotazioni dell'utente
    var remBooks = 'DELETE FROM Prenotazione WHERE Email_Utente = \'' + email + '\';';

    // Imposta la query
    var query = "DELETE FROM Utente WHERE Email = \'" + email + "\';"

    // Esegui la query
    try {
        // Rimuovi le prenotazioni
        await runInsDelUpd(remBooks);

        // Rimuovi l'utente
        var res = await runInsDelUpd(query);

        // Se viene eliminata 1 riga allora la query è andata a buon fine
        if (res == 1) return 0;
        else return -1;
    }
    catch (err) {
        console.log(err);
        return -1;
    }
}

// Funzione per prendere i dati di un utente (sezione impostazioni)
async function getUserData(email) {
    // Imposta la query
    var query = "SELECT Nome, Cognome, Datanascita FROM Utente WHERE email = \'" + email + "\';"

    // Esegui la query
    try {
        return await runQuery(query);
    }
    catch (err) {
        console.log(err);
        return -1;
    }
}

// Funzione per ricavare i dati della stampa evento
async function getPrintData(id, user) {
    // Imposta la query
    var query = "SELECT Nome, Cognome, Email, ID, Titolo, Luogo,\
                Evento.DataOra AS edataora, Prenotazione.DataOra AS pdataora\
                FROM Evento JOIN Prenotazione ON ID_Evento = ID\
                JOIN Utente ON Email_Utente = Email\
                WHERE ID = " + id + " AND Email = \'" + user + "\';"

    // Esegui la query
    try {
        return await runQuery(query);
    }
    catch (err) {
        console.log(err);
        return -1;
    }
}

// Funzione per formattare la data e l'ora nel formato italiano
function formatDate(date) {
    var args = date.split(' ');

    var giorno = args[0];
    var mese = args[1];
    var data = args[2];
    var anno = args[3];
    var ora = args[4].slice(0, 5);
    // Altri argomenti ignorati

    // Traduzione del giorno
    switch (giorno) {
        case 'Mon':
            giorno = 'Lunedì';
            break;
        case 'Tue':
            giorno = 'Martedì';
            break;
        case 'Wed':
            giorno = 'Mercoledì';
            break;
        case 'Thu':
            giorno = 'Giovedì';
            break;
        case 'Fri':
            giorno = 'Venerdì';
            break;
        case 'Sat':
            giorno = 'Sabato';
            break;
        case 'Sun':
            giorno = 'Domenica';
            break;
    };

    // Traduzione del mese
    switch (mese) {
        case 'Jan':
            mese = 'Gennaio';
            break;
        case 'Feb':
            mese = 'Febbraio';
            break;
        case 'Mar':
            mese = 'Marzo';
            break;
        case 'Apr':
            mese = 'Aprile';
            break;
        case 'May':
            mese = 'Maggio';
            break;
        case 'Jun':
            mese = 'Giugno';
            break;
        case 'Jul':
            mese = 'Luglio';
            break;
        case 'Aug':
            mese = 'Agosto';
            break;
        case 'Sep':
            mese = 'Settembre';
            break;
        case 'Oct':
            mese = 'Ottobre';
            break;
        case 'Nov':
            mese = 'Novembre';
            break;
        case 'Dec':
            mese = 'Dicembre';
            break;
    }

    var data = giorno + " " + data + " " + mese + " " + anno + " " + ora;
    return data;
}


// Esporta i moduli
module.exports = {
    config,
    loadMainListing,
    loadHighlights,
    loadNext,
    loadPassed,
    getMaxID,
    getImagesList,
    insertEvent,
    insertUser,
    deleteEvent,
    changeUser,
    logUser,
    getLevel,
    book,
    search,
    prenotazioni,
    storico,
    organizzazioni,
    beOrganizer,
    getRequests,
    acceptRequest,
    declineRequest,
    unbook,
    deleteUser,
    getUserData,
    getPrintData,
    formatDate    
}