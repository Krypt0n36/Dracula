const rs = require('randomstring');
require('./../crypton/index.js');
const { ipcRenderer, remote } = require('electron')
const fs = require('fs')
const path = require('path')
window.$ = window.Jquery = require('./js/jquery.min.js');


//console.log(remote.getGlobal('filepath'))

$('#modal').hide();
window.filepath = remote.getGlobal('filepath');





$('#randomize').on('click', function () {
    let value = rs.generate({
        length: 32,
        charset: 'alphanumeric'
    })
    $('#key').val(value);
    $('#rkey').val(value);
    $('#key').attr('type', 'text');
    $('#rkey').attr('type', 'text');

})

$('#rkey').on('change', function () {
    let value = $('#key').val();
    let rvalue = $('#rkey').val();
    if (value != rvalue) {
        $('#rkey').addClass('is-invalid');
    } else {
        $('#rkey').removeClass('is-invalid');

    }
})


function exitApp() {
    var window = remote.getCurrentWindow();
    window.close();
}


$('#encrypt').on('click', function () {
    let key = $('#key').val();
    let rkey = $('#rkey').val();
    if (key != rkey || key.length == 0) {
        $('#rkey').addClass('is-invalid');
    } else {
        $('#modal').fadeIn('fast');
        crypton.encryptAsync({
            file: window.filepath,
            password: key
        }, function () {
            // When error occupied
            let tone = new Audio;
            tone.src = 'sfx/done.mp3';
            $('#status-icon').attr('src', 'images/error.svg');
            $('#status-label').html('Opps');
            $('#status').append('<span>Couldnt encrypt file, please make sure you have the permission to read/write it.</span>');
            $('#status').append('<button type="button" onclick="exitApp()" class="btn btn-outline-secondary mt-3">Close</button>');
            tone.play();
            
        }, function () {
            //When the file is successfully encrypted!!
            let tone = new Audio;
            tone.src = 'sfx/done.mp3';
            $('#status-icon').attr('src', 'images/success.svg');
            $('#status-label').html('Done');
            $('#status').append('<span>Your file has been encrypted successfully.</span>');
            $('#status').append('<button type="button" onclick="exitApp()" class="btn btn-outline-secondary mt-3">Close</button>');
            tone.play();
            // Check if the user checked the "override" option
            if(document.getElementById('override-checkbox').checked){
                fs.unlinkSync(window.filepath)
            }
        })
    }

});



$('#decrypt').on('click', function () {
    let key = $('#key').val();
    $('#modal').fadeIn('fast');
    crypton.decryptAsync({
        file: window.filepath,
        password: key
    }, function () {
        // When error occupied
        let tone = new Audio;
        tone.src = 'sfx/done.mp3';
        $('#status-icon').attr('src', 'images/error.svg');
        $('#status-label').html('Opps');
        $('#status').append('<span>Couldnt decrypt file, please make sure you have the permission to read/write it.</span>');
        $('#status').append('<button type="button" onclick="exitApp()" class="btn btn-outline-secondary mt-3">Close</button>');
        tone.play();
    }, function () {
        //When the file is successfully encrypted!!
        let tone = new Audio;
        tone.src = 'sfx/done.mp3';
        $('#status-icon').attr('src', 'images/success.svg');
        $('#status-label').html('Done');
        $('#status').append('<span>Your file has been decrypted successfully.</span>');
        $('#status').append('<button type="button" onclick="exitApp()" class="btn btn-outline-secondary mt-3">Close</button>');
        tone.play();
        if(document.getElementById('override-checkbox').checked){
            fs.unlinkSync(window.filepath)
        }
    })

})


