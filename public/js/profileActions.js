// Per cambiare la classe dei pulsanti nella navbar
$(window).resize(function () {
    if ($(window).width() < 836) {
        $("#prof-tab").removeClass("nav-tabs");
        $("#prof-tab").addClass("flex-column nav-pills");
    }

    if ($(window).width() >= 836) {
        $("#prof-tab").addClass("nav-tabs");
        $("#prof-tab").removeClass("flex-column nav-pills");
    }
});

// Funzione per disdire una prenotazione
function unbook(id) {
    console.log("Disdetta per evento ID=" + id);

    // Reindirizza alla pagina di disdetta
    window.location.replace("/unbook=" + id);
    return;
}

// Funzione per stampare una prenotazione
function stampa(id) {
    console.log("Stampa per evento ID=" + id);

    // Reindirizza alla pagina di stampa
    window.location.replace("/stampa=" + id);
    return;
}

// Funzione per eliminare un evento (organizzatore)
function remove(id) {
    console.log("Rimozione evento ID=" + id);

    // Reindirizza alla pagina di rimozione
    window.location.replace("/remove=" + id);
    return;
}

// Funzione per accettare una nuova richiesta di organizzatore (organizzatore)
function acceptUser(email) {
    console.log("Accetta organizzatore utente=" + email);

    // Reindirizza alla pagina di accettazione
    window.location.replace("/acceptUser=" + email);
    return;
}

// Funzione per respingere una nuova richiesta di organizzatore (organizzatore)
function declineUser(email) {
    console.log("Respingi organizzatore utente=" + email);

    // Reindirizza alla pagina di respinta
    window.location.replace("/declineUser=" + email);
    return;
}

// Funzione per mostrare la tab di gestione delle prenotazioni (organizzatore)
function showPrenotazioni() {
    $('#prenotazioni').attr('class', 'tab-pane fade show active ');
    $('#prenotazioniTab').attr('class', 'nav-link active');

    $('#creaEventoPage').attr('class', 'tab-pane fade');
    $('#creaTab').attr('class', 'nav-link');

    $('#rimozioni').attr('class', 'tab-pane fade');
    $('#rimuoviTab').attr('class', 'nav-link');
    
    $('#admin').attr('class', 'tab-pane fade');
    $('#adminTab').attr('class', 'nav-link');

    $('#storico').attr('class', 'tab-pane fade');
    $('#storicoTab').attr('class', 'nav-link');
}

// Funzione per mostrare la tab per creare un evento (organizzatore)
function showEvento() {
    $('#prenotazioni').attr('class', 'tab-pane fade ');
    $('#prenotazioniTab').attr('class', 'nav-link');

    $('#creaEventoPage').attr('class', 'tab-pane fade show active');
    $('#creaTab').attr('class', 'nav-link active');
    
    $('#rimozioni').attr('class', 'tab-pane fade');
    $('#rimuoviTab').attr('class', 'nav-link');
    
    $('#admin').attr('class', 'tab-pane fade');
    $('#adminTab').attr('class', 'nav-link');

    $('#storico').attr('class', 'tab-pane fade');
    $('#storicoTab').attr('class', 'nav-link');
}

// Funzione per mostrare la tab per rimuovere un evento (organizzatore)
function showRimozione() {
    $('#prenotazioni').attr('class', 'tab-pane fade ');
    $('#prenotazioniTab').attr('class', 'nav-link');

    $('#creaEventoPage').attr('class', 'tab-pane fade');
    $('#creaTab').attr('class', 'nav-link ');

    $('#rimozioni').attr('class', 'tab-pane fade show active');
    $('#rimuoviTab').attr('class', 'nav-link active');
    
    $('#admin').attr('class', 'tab-pane fade');
    $('#adminTab').attr('class', 'nav-link');

    $('#storico').attr('class', 'tab-pane fade');
    $('#storicoTab').attr('class', 'nav-link');
}

// Funzione per mostrare la tab amministratore (organizzatore)
function showAdmin() {
    $('#prenotazioni').attr('class', 'tab-pane fade ');
    $('#prenotazioniTab').attr('class', 'nav-link');

    $('#creaEventoPage').attr('class', 'tab-pane fade');
    $('#creaTab').attr('class', 'nav-link ');

    $('#rimozioni').attr('class', 'tab-pane fade');
    $('#rimuoviTab').attr('class', 'nav-link');
    
    $('#admin').attr('class', 'tab-pane fade show active');
    $('#adminTab').attr('class', 'nav-link active');

    $('#storico').attr('class', 'tab-pane fade');
    $('#storicoTab').attr('class', 'nav-link');
}

// Funzione per mostrare la tab dello storico (organizzatore)
function showStorico() {
    $('#prenotazioni').attr('class', 'tab-pane fade ');
    $('#prenotazioniTab').attr('class', 'nav-link');

    $('#creaEventoPage').attr('class', 'tab-pane fade');
    $('#creaTab').attr('class', 'nav-link ');

    $('#rimozioni').attr('class', 'tab-pane fade');
    $('#rimuoviTab').attr('class', 'nav-link');
    
    $('#admin').attr('class', 'tab-pane fade');
    $('#adminTab').attr('class', 'nav-link');

    $('#storico').attr('class', 'tab-pane fade show active');
    $('#storicoTab').attr('class', 'nav-link active');
}

// Funzione per mostrare le prenotazioni (utente normale)
function showPrenotazioniNormal() {
    $('#prenotazioniNormal').attr('class', 'tab-pane fade show active');
    $('#prenotazioniNormalTab').attr('class', 'nav-link active');

    $('#beOrganizer').attr('class', 'tab-pane fade');
    $('#beOrganizerTab').attr('class', 'nav-link');

    $('#storicoNormal').attr('class', 'tab-pane fade');
    $('#storicoNormalTab').attr('class', 'nav-link');
}

// Funzione per mostrare la tab per essere organizzatore (utente normale)
function showBeOrganizer() {
    $('#prenotazioniNormal').attr('class', 'tab-pane fade');
    $('#prenotazioniNormalTab').attr('class', 'nav-link');

    $('#beOrganizer').attr('class', 'tab-pane fade show active');
    $('#beOrganizerTab').attr('class', 'nav-link active');

    $('#storicoNormal').attr('class', 'tab-pane fade');
    $('#storicoNormalTab').attr('class', 'nav-link');
}

// Funzione per mostrare la tab dello storico (utente normale)
function showStoricoNormal() {
    $('#prenotazioniNormal').attr('class', 'tab-pane fade');
    $('#prenotazioniNormalTab').attr('class', 'nav-link');

    $('#beOrganizer').attr('class', 'tab-pane fade');
    $('#beOrganizerTab').attr('class', 'nav-link');

    $('#storicoNormal').attr('class', 'tab-pane fade show active');
    $('#storicoNormalTab').attr('class', 'nav-link active');
}

// Funzione per settare la data minima e massima di creazione di un evento
function setDates() {
    var nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    $('#dateTime').attr('min', tomorrow.toISOString().slice(0, 16));
    $('#dateTime').attr('max', nextYear.toISOString().slice(0, 16));
}

// Funzione per richiedere di essere un organizzatore
function richiediOrg(email) {
    console.log("Richiesta privilegi per utente=" + email);

    // Crea una nuova richiesta verso il server
    // Le risposte vengono poi gestite dalla funzione displayRes
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = displayRes;
    httpRequest.open("GET", '/beOrganizer=' + email, true);
    httpRequest.send();
}

// Funzione per mostrare la risposta del server
function displayRes(res) {
    // Controlla che la risposta sia stata ricevuta e stampa il risultato
    if (res.target.readyState == 4 && res.target.status == 200) {
        if (res.target.responseText.slice(0,3) == '[1]') {
            $("#contentDiv").html(res.target.responseText.slice(3));
            $("#btnRichiedi").hide();
        }
        else
            $("#contentDiv").html(res.target.responseText.slice(3));
    }
}

// Funzione per la validazione del form
function validaCreazione() {
    // Tutti i requisiti sono già soddisfatti dai campi required
    // Non sono necessari controlli
    return true;
}
