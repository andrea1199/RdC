// Fading dei blocchi evento
$(document).ready(function () {
    $(".card").fadeIn(1500);
});

// Funzione per prenotare un evento
function prenota(id) {
    console.log("Prenotazione per evento ID=" + id);

    // Crea una nuova richiesta di prenotazione verso il server
    // Le risposte vengono poi gestite dalla funzione displayError
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = displayError;
    httpRequest.open("GET", '/book=' + id, true);
    httpRequest.send();
}

// Funzione per gestire l'errore (eventuale) restituito dal server
function displayError(error) {
    // Se non c'è stato alcun errore allora reindirizza alla pagina che dice il server
    if (error.target.responseURL.endsWith("/profile")) {
        window.location.replace(error.target.responseURL);
        return;
    }

    // Altrimenti controlla che la risposta sia stata ricevuta e stampa l'errore
    if (error.target.readyState == 4 && error.target.status == 200) {
        var n = error.target.responseURL.split("book=")[1];
        if (n.length != 0) {
            $("#e"+n+" #desc").attr("hidden", true);
            $("#e"+n+" #message").html(error.target.responseText);
        }
    }
}

// Funzione per la ricerca di un evento dalla barra di testo
function search() {
    // Recupera il testo all'interno della barra
    var src = $("#src").val();

    // Reindirizza alla pagina di ricerca
    window.location.replace("/search=" + src);
    return;
}
