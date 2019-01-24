const { Tray, dialog, app, BrowserWindow, nativeImage, ipcMain } = require('electron');
const parseArgs = require('electron-args');
const fs = require('fs')

if (handleSquirrelEvent(app)) {
    return;
}

const cli = parseArgs(`
    Drakula -- volume 1.0 -- KRYPT0N

    Usage:
        $ drakula [action] [filepath]

    Actions:
        enc      Encrypt file
        dec      Decrypt file

    Exemples:
        $ drakula -e mysecrets.txt
        $ drakula -d personal_photo.jpg

`, {
        alias: {
            h: 'help'
        },
        default: {
            auto: false
        }
    });


var action = cli.input[0];
global.filepath = cli.input[1];


ipcMain.on('setFpVariable', (event, filepath) => {
    global.filepath = filepath;
})






ipcMain.on('selectFileDialog', (event, arg) => {
    //console.log(arg)
    dialog.showOpenDialog({
        properties: ['openFile'],
        title: 'Select file'
        //filters: [{name:'All files', extensions:['*']}],
        //buttonLabel: 'Select'
    }, (filepaths) => {
        if (filepaths) {
            console.log(filepaths);
            global.filepath = filepaths[0];
            //check if the given path is a file or diretory
            if (arg == 'encrypt') {
                action = 'enc'
            } else {
                action = 'dec'
            }
            createWindow();
            event.returnValue = filepaths;
        } else {
            console.log('0 file selected!')
            event.returnValue = 0;
        }

    })

})








function handleSquirrelEvent(application) {
    if (process.argv.length === 1) {
        return false;
    }

    const ChildProcess = require('child_process');
    const path = require('path');

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function (command, args) {
        let spawnedProcess, error;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, {
                detached: true
            });
        } catch (error) { }

        return spawnedProcess;
    };

    const spawnUpdate = function (args) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            spawnUpdate(['--createShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-uninstall':
            spawnUpdate(['--removeShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-obsolete':
            application.quit();
            return true;
    }
};

function createWindow() {
    if (action == undefined) {
        var win = new BrowserWindow({
            width: 600,
            height: 400,
            frame: true,
            resizable: false,
            icon: __dirname + '/dracula.ico',
            title: 'Dracula'
        });
    } else {
        var win = new BrowserWindow({
            width: 350,
            height: 520,
            frame: true,
            resizable: false,
            icon: __dirname + '/dracula.ico',
            title: 'Dracula'
        });
    }
    win.setMenu(null);
    win.webContents.openDevTools()
    if (action == undefined) {
        win.loadFile('ui/index.html')
    } else if (action == 'enc') {
        win.loadFile('ui/encrypt_file.html');
    } else if (action == 'dec') {
        win.loadFile('ui/decrypt_file.html');
    } else {
        win.loadFile('ui/index.html');

    }
}
app.on('window-all-closed', () => {
    app.quit()
})

app.on('ready', createWindow);
