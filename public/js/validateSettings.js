// Funzione per mostrare la vecchia password
function showSetPwd0() {
    if ($('#oldPsw').attr('type') == 'password') {
        $('#oldPsw').attr('type', 'text');
        $('#pwdEye0').removeClass('fa-eye');
        $('#pwdEye0').addClass('fa-eye-slash');
    }
    else {
        $('#oldPsw').attr('type', 'password');
        $('#pwdEye0').removeClass('fa-eye-slash');
        $('#pwdEye0').addClass('fa-eye');
    }
}

// Funzione per mostrare la prima (nuova) password
function showSetPwd1() {
    if ($('#password').attr('type') == 'password') {
        $('#password').attr('type', 'text');
        $('#pwdEye1').removeClass('fa-eye');
        $('#pwdEye1').addClass('fa-eye-slash');
    }
    else {
        $('#password').attr('type', 'password');
        $('#pwdEye1').removeClass('fa-eye-slash');
        $('#pwdEye1').addClass('fa-eye');
    } 
}

// Funzione per mostrare la seconda (nuova) password
function showSetPwd2() {
    if ($('#password_repeat').attr('type') == 'password') {
        $('#password_repeat').attr('type', 'text');
        $('#pwdEye2').removeClass('fa-eye');
        $('#pwdEye2').addClass('fa-eye-slash');
    }
    else {
        $('#password_repeat').attr('type', 'password');
        $('#pwdEye2').removeClass('fa-eye-slash');
        $('#pwdEye2').addClass('fa-eye');
    }
}

// Verifica la lunghezza minima della password
function checkLghSet() {
    if ($('#password').val().length < 8) {
        $('#password').attr('style', 'border-color: red');
        $('#message').attr('style', 'color: red');
        $('#message').html('La password deve contenere almeno 8 caratteri');
        return false;
    } else {
        $('#password').attr('style', 'border-color: green');
        $('#message').attr('style', 'color: green');
        $('#message').html('');
        return true;
    }
}

// Funzione per verificare la correttezza delle password immesse
function checkPwdMatch() {
    if ($('#password').val() == $('#password_repeat').val()) {
        $('#message').html('');
        $('#password').attr('style', 'border-color: green');
        $('#password_repeat').attr('style', 'border-color: green');
        return true;
    } else {
        $('#message').attr('style', 'color: red');
        $('#message').html('Le password non corrispondono');
        $('#password_repeat').attr('style', 'border-color: red');
        return false;
    }
}

// Funzione per abilitare la modifica della form
function enableChanges() {
    $("#btnModifica").hide();
    $('#btnSubmit').removeAttr('hidden');
    $('#btnReset').removeAttr('hidden');
    $('#nome').removeAttr('readonly');
    $('#cognome').removeAttr('readonly');
    $('#oldPsw').removeAttr('readonly');
    $('#password').removeAttr('readonly');
    $('#password_repeat').removeAttr('readonly');
}

// Funzione per disabilitare la modifica della form (torna allo stato precedente)
function disableChanges() {
    $("#btnModifica").show();
    $('#btnSubmit').attr('hidden', true);
    $('#btnReset').attr('hidden', true);
    $('#nome').attr('readonly', true);
    $('#cognome').attr('readonly', true);
    $('#oldPsw').attr('readonly', true);
    $('#password').attr('readonly', true);
    $('#password_repeat').attr('readonly', true);
}

// Funzione per il controllo dei campi immessi prima della submit
function validaForm() {
    return checkLghSet() && checkPwdMatch();
}
