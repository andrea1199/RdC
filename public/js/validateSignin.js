// Funzione per mostrare la password
function showPwd() {
    if ($('#password').attr('type') == 'password') {
        $('#password').attr('type', 'text');
        $('#pwdEye').removeClass('fa-eye');
        $('#pwdEye').addClass('fa-eye-slash');
    }
    else {
        $('#password').attr('type', 'password');
        $('#pwdEye').removeClass('fa-eye-slash');
        $('#pwdEye').addClass('fa-eye');
    }
}
