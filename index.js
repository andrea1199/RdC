const express = require('express');
const {engine} = require('express-handlebars');
const db = require('./lib/db');
const bodyParser = require('body-parser');
const session = require('express-session'); 

const SESS_NAME = 'session';
const SECRET_STR = 'segreto';

const app = express();
app.listen(3000); // Porta 3000 per il server

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Per usare file di stile css e script javascript
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true}));

// Per l'uso della sessione 
app.use(session({
    secret: SECRET_STR,
    resave: false,
    saveUninitialized: false,
    unset: 'destroy',
    name: SESS_NAME,
    cookie: {maxAge: 1000*60*60*1}, // Durata max. 1 ora
}));

// Funzione per reindirizzare un utente alla pagina di login qualora non fosse loggato
const redirectLogin = (req, res, next) => {
    if (!req.session.user) {
        res.redirect('/login');
    }
    else next();
}

// Funzione per reindirizzare un utente alla home qualora fosse loggato
const redirectHome = (req, res, next) => {
    if (req.session.user) {
        res.redirect('/');
    }
    else next();
}

// Render della homepage
app.get('/', async (req, res) => {
    // Incrementa il contatore di visualizzazioni della pagina
    req.session.views += 1;
    // console.log("[DEBUG] SessionID:" + req.sessionID);
    // console.log("[DEBUG] Session:");
    // console.log(req.session);

    // Esegui la query per il main listing
    var query = await db.loadMainListing();

    // Formatta tutte le date ottenute
    query.forEach (elem => {
        elem['dataora'] = db.formatDate(elem['dataora'].toString());
    });
    
    // Se l'utente è loggato allora visualizza il dropdown in alto a destra
    if (req.session.user) {
        logged = true;
        utente = req.session.user.nome;

        // Esegui la query per vedere tutte le prenotazioni dell'utente
        var prenotazioni = await db.prenotazioni(req.session.user.email);
        
        // Ricava gli ID degli eventi prenotati
        var s = []
        prenotazioni.forEach (elem => {
            s.push(elem['id']);
        });

        // Imposta il campo prenotato
        query.forEach (elem => {
            if (s.includes(elem['id']))
                elem['prenotato'] = true;
            else elem['prenotato'] = false;
        });
    }
    // Altrimenti mostra solo i pulsanti di login e registrazione
    else {
        logged = false;
        utente = '';
    }

    res.render('home', {
        title: "Home", 
        style: "style-main.css",
        js: "homeActions.js", 
        mainList: query,
        utente: utente,
        log: logged
    });
});

// Render della homepage con eventi Highlights
app.get('/highlights', async (req, res) => {
    // Incrementa il contatore di visualizzazioni della pagina
    req.session.views += 1;
    // console.log("[DEBUG] SessionID:" + req.sessionID);
    // console.log("[DEBUG] Session:");
    // console.log(req.session);

    // Esegui la query per il main listing
    var query = await db.loadHighlights();
    
    // Formatta tutte le date ottenute
    query.forEach (elem => {
        elem['dataora'] = db.formatDate(elem['dataora'].toString());
    });

    // Se l'utente è loggato allora visualizza il dropdown in alto a destra
    if (req.session.user) {
        logged = true;
        utente = req.session.user.nome;

        // Esegui la query per vedere tutte le prenotazioni dell'utente
        var prenotazioni = await db.prenotazioni(req.session.user.email);
        
        // Ricava gli ID degli eventi prenotati
        var s = []
        prenotazioni.forEach (elem => {
            s.push(elem['id']);
        });

        // Imposta il campo prenotato
        query.forEach (elem => {
            if (s.includes(elem['id']))
                elem['prenotato'] = true;
            else elem['prenotato'] = false;
        });
    }
    // Altrimenti mostra solo i pulsanti di login e registrazione
    else {
        logged = false;
        utente = '';
    }

    res.render('home', {
        title: "Highlights", 
        style: "style-main.css",
        js: "homeActions.js", 
        mainList: query,
        utente: utente,
        log: logged
    });
});

// Render della homepage con eventi "Prossimamente"
app.get('/next', async (req, res) => {
    // Incrementa il contatore di visualizzazioni della pagina
    req.session.views += 1;
    // console.log("[DEBUG] SessionID:" + req.sessionID);
    // console.log("[DEBUG] Session:");
    // console.log(req.session);

    // Esegui la query per il main listing
    var query = await db.loadNext();
    
    // Formatta tutte le date ottenute
    query.forEach (elem => {
        elem['dataora'] = db.formatDate(elem['dataora'].toString());
    });

    // Se l'utente è loggato allora visualizza il dropdown in alto a destra
    if (req.session.user) {
        logged = true;
        utente = req.session.user.nome;

        // Esegui la query per vedere tutte le prenotazioni dell'utente
        var prenotazioni = await db.prenotazioni(req.session.user.email);
        
        // Ricava gli ID degli eventi prenotati
        var s = []
        prenotazioni.forEach (elem => {
            s.push(elem['id']);
        });

        // Imposta il campo prenotato
        query.forEach (elem => {
            if (s.includes(elem['id']))
                elem['prenotato'] = true;
            else elem['prenotato'] = false;
        });
    }
    // Altrimenti mostra solo i pulsanti di login e registrazione
    else {
        logged = false;
        utente = '';
    }

    res.render('home', {
        title: "Prossimamente", 
        style: "style-main.css",
        js: "homeActions.js", 
        mainList: query,
        utente: utente,
        log: logged
    });
});

// Render della homepage con eventi passati
app.get('/passed', async (req, res) => {
    // Incrementa il contatore di visualizzazioni della pagina
    req.session.views += 1;
    // console.log("[DEBUG] SessionID:" + req.sessionID);
    // console.log("[DEBUG] Session:");
    // console.log(req.session);

    // Esegui la query per il main listing
    var query = await db.loadPassed();
    
    // Formatta tutte le date ottenute
    query.forEach (elem => {
        elem['dataora'] = db.formatDate(elem['dataora'].toString());
    });

    // Se l'utente è loggato allora visualizza il dropdown in alto a destra
    if (req.session.user) {
        logged = true;
        utente = req.session.user.nome;
    }
    // Altrimenti mostra solo i pulsanti di login e registrazione
    else {
        logged = false;
        utente = '';
    }

    res.render('home', {
        title: "Eventi passati", 
        style: "style-main.css",
        js: "homeActions.js", 
        mainList: query,
        utente: utente,
        log: logged
    });
});

// Render della pagina di registrazione
app.get('/signup', redirectHome, (req, res) => {
    // Incrementa il contatore di visualizzazioni della pagina
    req.session.views += 1;
    // console.log("[DEBUG] SessionID:" + req.sessionID);
    // console.log("[DEBUG] Session:");
    // console.log(req.session);

    res.render('signup', {
        title: "Registrati", 
        style: "style-signup.css",
        js: "validateSignup.js"
    });
});

// Per registrare un nuovo utente
app.post('/signupValid', (req, res) => {
    // Incrementa il contatore di visualizzazioni della pagina
    req.session.views += 1;

    // Inserisci i dati nel db
    var user = {
        nome: req.body.nome,
        cognome: req.body.cognome,
        datanasc: req.body.data,
        sesso: req.body.sesso,
        email: req.body.email,
        password: req.body.password,
        validato: true,
        privilegi: 0
    };

    db.insertUser(user).then(sign => {
        // Se c'è un errore nella registrazione
        if (sign == -1) {
            console.log(">>Registrazione errata: email esistente (" + user.email + ")");

            res.render('signup', {
                title: "Registrati", 
                style: "style-signup.css",
                js: "validateSignup.js",
                error: 'La mail esiste già. Prova ad accedere'
            });
            return;
        }
        // Altrimenti vai avanti e crea la sessione
        else {
            console.log(">>Nuovo utente registrato: " + req.body.email);
            
            req.session.user = {
                email: user.email,
                nome: user.nome.charAt(0).toUpperCase() + user.nome.slice(1)
            };
            req.session.views = 0;
    
            // Torna alla home
            return res.redirect('/');
        }
    });
});

// Render della pagina di login
app.get('/login', redirectHome, (req, res) => {
    // Incrementa il contatore di visualizzazioni della pagina
    req.session.views += 1;
    // console.log("[DEBUG] SessionID:" + req.sessionID);
    // console.log("[DEBUG] Session:");
    // console.log(req.session);

    res.render('signin', {
        title: "Login", 
        style: "style-signin.css",
        js: "validateSignin.js"
    });
});

// Per prendere i dati del login
app.post('/loginValid', (req, res) => {
    // Incrementa il contatore di visualizzazioni della pagina
    req.session.views += 1;
    console.log(">>Nuova richiesta di login: " + req.body.email);

    var user = {
        email: req.body.email,
        password: req.body.password
    };

    // Verifica le credenziali immesse
    db.logUser(user).then(log => {
        if (typeof log === 'string') {
            console.log(">>Utente loggato: " + user.email);

            // Imposta la sessione
            req.session.user = {
                email: user.email,
                nome: log.charAt(0).toUpperCase() + log.slice(1)
            }
            req.session.views = 0;

            // Torna alla home
            return res.redirect('/');
        }
        else if (log == -1) {
            console.log(">>Accesso errato: pwd errata (" + user.email + ")");
            
            res.render('signin', {
                title: "Login", 
                style: "style-signin.css",
                js: "validateSignin.js",
                email: req.body.email,
                error: 'La password non è corretta. Riprova'
            });
            return;
        }
        else if (log == -2) {
            console.log(">>Accesso errato: mail errata (" + user.email + ")");

            res.render('signin', {
                title: "Login", 
                style: "style-signin.css",
                js: "validateSignin.js",
                email: req.body.email,
                error: 'La mail non è registrata. Riprova'
            });
            return;
        }
    });
});

// Render della pagina di impostazioni
app.get('/settings', redirectLogin, async (req, res) => {
    // Incrementa il contatore di visualizzazioni della pagina
    req.session.views += 1;

    // Se l'utente è loggato allora visualizza il dropdown in alto a destra
    if (req.session.user) {
        logged = true;
        utente = req.session.user.nome;
    }

    // Prendi i dati utente da mettere nei campi
    var userData = await db.getUserData(req.session.user.email);

    // Esegui la query per prendere il livello di privilegi
    var livello = (await db.getLevel(req.session.user.email))[0].privilegi;

    // Formatta la data in YYYY-MM-DD
    var d = new Date(userData[0].datanascita);
    var data = d.getFullYear() + '-';
    if (d.getMonth() < 8) data += '0' 
    data += (d.getMonth() + 1) + '-';
    if (d.getDate() < 10) data += '0' 
    data += d.getDate();

    res.render('settings', {
        title: "Impostazioni", 
        style: "style-settings.css",
        js: "validateSettings.js",
        log: logged,
        utente: utente,
        nome: userData[0].nome,
        cognome: userData[0].cognome,
        data: data,
        privilegi: livello == 0
    });
});

// Intercetta i cambi dati del profilo utente
app.post('/changeUser', redirectLogin, async (req, res) => {
    // Incrementa il contatore di visualizzazioni della pagina
    req.session.views += 1;

    // Inserisci i dati nel db
    var user = {
        nome: req.body.nome,
        cognome: req.body.cognome,
        datanasc: req.body.data,
        email: req.session.user.email,
        oldpwd: req.body.oldPsw,
        newpwd: req.body.password
    };

    // Nel caso l'aggiornamento dei dati non vada a buon fine
        // Se l'utente è loggato allora visualizza il dropdown in alto a destra
        if (req.session.user) {
            logged = true;
            utente = req.session.user.nome;
        }

        // Prendi i dati utente da mettere nei campi
        var userData = await db.getUserData(req.session.user.email);

        // Esegui la query per prendere il livello di privilegi
        var livello = (await db.getLevel(req.session.user.email))[0].privilegi;

        // Formatta la data in YYYY-MM-DD
        var d = new Date(userData[0].datanascita);
        var data = d.getFullYear() + '-';
        if (d.getMonth() < 8) data += '0' 
        data += (d.getMonth() + 1) + '-';
        if (d.getDate() < 10) data += '0' 
        data += d.getDate();

    // Prova a effettuare il cambiamento
    db.changeUser(user).then(b => {
        // Se è andato a buon fine
        if (b == 0) {
            console.log(">>Cambio dati effettuato (" + req.session.user.email + ")");
            
            res.render('settings', {
                title: "Impostazioni", 
                style: "style-settings.css",
                js: "validateSettings.js",
                log: logged,
                utente: utente,
                nome: userData[0].nome,
                cognome: userData[0].cognome,
                data: data,
                privilegi: livello == 0,
                success: 'Cambio dati effettuato con successo. \
                    Effettua il logout per rendere effettive le modifiche.'
            });
            return;
        }
        // Se c'è un errore nelle query
        else if (b == -1) {
            console.log(">>Errore nel cambio dati (query) (" + user.email + ")");

            res.render('settings', {
                title: "Impostazioni", 
                style: "style-settings.css",
                js: "validateSettings.js",
                log: logged,
                utente: utente,
                nome: userData[0].nome,
                cognome: userData[0].cognome,
                data: data,
                privilegi: livello == 0,
                error: 'Errore durante l\'aggiornamento dei dati. Riprova'
            });
            return;
        }
        // Se la password inserita non è corretta
        else if (b == -2) {
            console.log(">>Errore nel cambio dati (pwd errata) (" + user.email + ")");

            res.render('settings', {
                title: "Impostazioni", 
                style: "style-settings.css",
                js: "validateSettings.js",
                log: logged,
                utente: utente,
                nome: userData[0].nome,
                cognome: userData[0].cognome,
                data: data,
                privilegi: livello == 0,
                error: 'Attenzione: la password attuale non è corretta. Riprova'
            });
            return;
        }
    });
});

// Render della pagina di profilo
app.get('/profile', redirectLogin, async (req, res) => {
    // Incrementa il contatore di visualizzazioni della pagina
    req.session.views += 1;

    // Se l'utente è loggato allora visualizza il dropdown in alto a destra
    if (req.session.user) {
        logged = true;
        utente = req.session.user.nome;
    }

    // Esegui la query per le prenotazioni
    var query = await db.prenotazioni(req.session.user.email);

    // Esegui la query per lo storico
    var storico = await db.storico(req.session.user.email);

    // Esegui la query per prendere il livello di privilegi
    var livello = (await db.getLevel(req.session.user.email))[0].privilegi;

    var orgs = false;
    var email = null;
    var reqs = false;

    // Se sei un organizzatore 
    if (livello == 1) {
        // Cerca anche gli eventi organizzati
        var org = await db.organizzazioni(req.session.user.email);
        orgs = org.length > 0;

        // Formatta tutte le date ottenute
        org.forEach (elem => {
            elem['dataora'] = db.formatDate(elem['dataora'].toString());
        });

        // Cerca anche eventuali richieste di diventare organizzatore
        var richieste = await db.getRequests();
        reqs = richieste.length > 0;

        // Ricava la lista delle immagini disponibili
        var images = await db.getImagesList();
    }

    // Altrimenti sei un utente normale che può chiedere di essere organizzatore
    else email = req.session.user.email;
    
    // Formatta tutte le date ottenute
    query.forEach (elem => {
        elem['dataora'] = db.formatDate(elem['dataora'].toString());
    });
    storico.forEach (elem => {
        elem['dataora'] = db.formatDate(elem['dataora'].toString());
    });

    res.render('profile', {
        title: "Profilo", 
        //style: "style-settings.css", // Usa lo stesso stile di settings
        style: "style-profile.css",
        js: "profileActions.js",
        prenotazioni: query,
        notEmpty: query.length > 0,
        log: logged,
        utente: utente,
        privilegi: livello == 1,
        numOrg: orgs,
        organizzazioni: org,
        email: email,
        richiesta: livello == 3,
        utenti: richieste,
        requests: reqs, 
        storico: storico,
        notEmptyStorico: storico.length > 0,
        images: images
    });
});

// Render della pagina di logout
app.get('/logout', redirectLogin, (req, res) => {
    console.log(">>Utente uscito: " + req.session.user.email);

    // Elimina la sessione
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }

        res.clearCookie(SESS_NAME);
    });
    
    res.render('logout', {
        title: "Logout"
    });
});

// Intercetta le cancellazioni dei profili utente
app.get('/deleteUser', redirectLogin, (req, res) => {
    // Incrementa il contatore di visualizzazioni della pagina
    req.session.views += 1;

    var email = req.session.user.email;

    // Prova a registrare la prenotazione
    db.deleteUser(email).then(b => {
        if (b == 0) {
            console.log(">>[Elim. utente] Eliminazione effettuata (" + email + ")");

            // Redireziona alla pagina di logout
            res.redirect('/logout');
            res.end();
        }
        else if (b == -1) {
            console.log(">>[Elim. utente] Errore nella query (" + email + ")");

            // Redireziona alla pagina delle impostazioni
            res.redirect('/settings');
            res.end();
        }
    });
});

app.post('/createEvent', redirectLogin, (req, res) => {
    // Incrementa il contatore di visualizzazioni della pagina
    req.session.views += 1;

    // Recupera i dati inseriti
    var event = {
        organizzatore: req.session.user.email,
        titolo: req.body.titolo,
        luogo: req.body.location,
        tipo: req.body.eventType,
        data: req.body.dateTime,
        posti: req.body.posti,
        descrizione: req.body.descrizione,
        immagine: req.body.imgEvent
    };

    // Inserisci l'evento nel db
    db.insertEvent(event).then(b => {
        // Se c'è un errore nell'inserimento dell'evento
        if (b == -1) {
            console.log(">>Errore in inserimento evento (" + user.email + ")");

            //TBC
            res.redirect("/profile");
            res.end();
            return;
        }
        // Altrimenti vai avanti e redireziona alla home
        else if (b == 0) {
            console.log(">>Inserimento evento effettuato (" + req.session.user.email + ")");
            
            //TBC
            res.redirect("/");
            res.end();
            return;
        }
    });
});

// Intercetta le prenotazioni degli eventi
app.get('/book=*', redirectLogin, (req, res) => {
    // Incrementa il contatore di visualizzazioni della pagina
    req.session.views += 1;

    // Ottieni l'ID della prenotazione
    var id = req.originalUrl.split('book=')[1];

    // Prova a registrare la prenotazione
    db.book(id, req.session.user).then(b => {
        if (b == 0) {
            console.log(">>[Pren.evento] Prenotazione OK");

            // Redireziona alla pagina del profilo
            res.redirect('/profile');
            res.end();
        }
        else if (b == -1) {
            console.log(">>[Pren.evento] Errore nella query");

            // Avvisa l'utente dell'errore
            res.write("Errore interno durante la prenotazione. Riprova");
            res.end();
        }
        else if (b == -2) {
            console.log(">>[Pren.evento] Posti non disp");

            // Avvisa l'utente dell'errore
            res.write("Siamo spiacenti, ma i posti disponibili sono terminati!");
            res.end();
        }
        else if (b == -3) {
            console.log(">>[Pren.evento] Utente già registrato");

            // Avvisa l'utente dell'errore
            res.write("Attenzione! Sei già prenotato per questo evento. Visita il tuo profilo.");
            res.end();
        }
    });
});

// Intercetta le richieste di essere organizzatori degli eventi
app.get('/beOrganizer=*', redirectLogin, (req, res) => {
    // Incrementa il contatore di visualizzazioni della pagina
    req.session.views += 1;

    // Ottieni l'email dell'utente
    var email = req.originalUrl.split('beOrganizer=')[1];

    // Prova a registrare la prenotazione
    db.beOrganizer(email).then(b => {
        if (b == 0) {
            console.log(">>[Richiesta organ.] Richiesta OK");

            // Avvisa l'utente del successo
            res.write("[1]Richiesta inserita con successo. A breve potresti diventare un organizzatore");
            res.end();
        }
        else if (b == -1) {
            console.log(">>[Richiesta organ.] Errore nella query");

            // Avvisa l'utente dell'errore
            res.write("[0]Errore interno durante la richiesta. Riprova");
            res.end();
        }
    });
});

// Intercetta le accettazioni delle richieste di essere organizzatori degli eventi
app.get('/acceptUser=*', redirectLogin, (req, res) => {
    // Incrementa il contatore di visualizzazioni della pagina
    req.session.views += 1;

    // Ottieni l'email dell'utente
    var email = req.originalUrl.split('acceptUser=')[1];

    // Prova a registrare la prenotazione
    db.acceptRequest(email).then(b => {
        if (b == 0) {
            console.log(">>[Richiesta organ.] Richiesta Accettata (" + email + ")");

            // Redireziona alla pagina del profilo
            res.redirect('/profile');
            res.end();
        }
        else if (b == -1) {
            console.log(">>[Richiesta organ.] Errore nella query (" + email + ")");

            // Redireziona alla pagina del profilo
            res.redirect('/profile');
            res.end();
        }
    });
});

// Intercetta le declinazioni delle richieste di essere organizzatori degli eventi
app.get('/declineUser=*', redirectLogin, (req, res) => {
    // Incrementa il contatore di visualizzazioni della pagina
    req.session.views += 1;

    // Ottieni l'email dell'utente
    var email = req.originalUrl.split('declineUser=')[1];

    // Prova a registrare la prenotazione
    db.declineRequest(email).then(b => {
        if (b == 0) {
            console.log(">>[Richiesta organ.] Richiesta Respinta (" + email + ")");

            // Redireziona alla pagina del profilo
            res.redirect('/profile');
            res.end();
        }
        else if (b == -1) {
            console.log(">>[Richiesta organ.] Errore nella query (" + email + ")");

            // Redireziona alla pagina del profilo
            res.redirect('/profile');
            res.end();
        }
    });
});

// Intercetta le eliminazioni degli eventi
app.get('/remove=*', redirectLogin, (req, res) => {
    // Incrementa il contatore di visualizzazioni della pagina
    req.session.views += 1;

    // Ottieni l'ID della prenotazione
    var id = req.originalUrl.split('remove=')[1];

    // Prova a registrare la prenotazione
    db.deleteEvent(id).then(b => {
        if (b == 0) {
            console.log(">>[Rimozione.evento] Rimozione OK");

            // Redireziona alla pagina del profilo
            res.redirect('/profile');
            res.end();
        }
        else if (b == -1) {
            console.log(">>[Rimozione.evento] Errore nella query");

            //TBC
            res.redirect("/");
            res.end();
            return;            
        }
    });
});

// Intercetta le disdette degli eventi
app.get('/unbook=*', redirectLogin, (req, res) => {
    // Incrementa il contatore di visualizzazioni della pagina
    req.session.views += 1;

    // Ottieni l'ID della prenotazione
    var id = req.originalUrl.split('unbook=')[1];

    // Prova a registrare la prenotazione
    db.unbook(id, req.session.user.email).then(b => {
        // Se è andata a buon fine l'eliminazione
        if (b == 0) 
            console.log(">>[Pren.evento] Disdetta OK");

        // Altrimenti se c'è stato un errore nella query
        else if (b == -1)
            console.log(">>[Pren.evento] Errore nella query");

        // Altrimenti se non c'è stata un'eliminazione
        else if (b == -2) 
            console.log(">>[Pren.evento] Disdetta FAILED");

        // Redireziona alla pagina del profilo
        res.redirect('/profile');
        res.end();
    });
});

// Intercetta le ricerche di eventi
app.get('/search=*', async (req, res) => {
    // Incrementa il contatore di visualizzazioni della pagina
    req.session.views += 1;

    // Ottieni il testo della ricerca
    var src = req.originalUrl.split('search=')[1];

    // Esegui la query
    var query = await db.search(src);

    // Formatta tutte le date ottenute
    query.forEach (elem => {
        elem['dataora'] = db.formatDate(elem['dataora'].toString());
    });

    // Se l'utente è loggato allora visualizza il dropdown in alto a destra
    if (req.session.user) {
        logged = true;
        utente = req.session.user.nome;

        // Esegui la query per vedere tutte le prenotazioni dell'utente
        var prenotazioni = await db.prenotazioni(req.session.user.email);
        
        // Ricava gli ID degli eventi prenotati
        var s = []
        prenotazioni.forEach (elem => {
            s.push(elem['id']);
        });

        // Imposta il campo prenotato
        query.forEach (elem => {
            if (s.includes(elem['id']))
                elem['prenotato'] = true;
            else elem['prenotato'] = false;
        });
    }
    // Altrimenti mostra solo i pulsanti di login e registrazione
    else {
        logged = false;
        utente = '';
    }

    // Se la query non restituisce risultati allora segnalalo
    if (query.length == 0) 
        error = 'La ricerca non ha prodotto risultati! Riprova';
    else error = false;

    // Renderizza la nuova pagina
    res.render('home', {
        title: "Ricerca", 
        style: "style-main.css",
        js: "homeActions.js", 
        mainList: query,
        utente: utente,
        log: logged,
        error: error
    });
});

// Intercetta le richieste di stampa degli eventi
app.get('/stampa=*', redirectLogin, async (req, res) => {
    // Incrementa il contatore di visualizzazioni della pagina
    req.session.views += 1;

    // Ottieni l'ID dell'evento
    var id = req.originalUrl.split('stampa=')[1];

    // Esegui la query
    var query = await db.getPrintData(id, req.session.user.email);
    
    // Formatta tutte le date ottenute
    query.forEach (elem => {
        elem['edataora'] = db.formatDate(elem['edataora'].toString());
        elem['pdataora'] = db.formatDate(elem['pdataora'].toString());
    });

    // Renderizza la pagina
    res.render('print', {
        title: "Stampa", 
        style: "style-print.css",
        js: "qrcode.min.js",
        dati: query
    });
});


// Pagina 404 (errore)
app.use((req, res) => {
    res.render('404', {
        title: "Error404", 
        style: "style-main.css",
    });
});
