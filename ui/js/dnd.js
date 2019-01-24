//import { ipcRenderer } from "electron";
const {shell} = require('electron')
//const {ipcRenderer, remote} = require('electron')



$("#about_me").on('click', ()=>{
    shell.openExternal('https://github.com/Krypt0n36')
})



$('#encrypt-dd-area').on('dragOver', (ev)=>{
    console.log('File in dropzone!')
    ev.preventDefault();
})

$('#encrypt-dd-area').on('click', ()=>{
    //ipcRenderer.send('showFileDialog');
    selected_file = ipcRenderer.sendSync('selectFileDialog', 'encrypt');
})
$('#decrypt-dd-area').on('click', ()=>{
    selected_file = ipcRenderer.sendSync('selectFileDialog', 'decrypt');

});

