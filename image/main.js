// Modules to control application life and create native browser window
const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const encode = require("./cryptography/encode");
const decode = require("./cryptography/decode");
const path = require('path')
const fs =	require('fs');
const args = process.argv.slice(2);
let windows = {};
let processes = 0;

function createWindow () {
  let file = args[0] ?? "";
  let edited = false;
  let processID = processes++;
  let content = '';
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  })

  function updateProcess() {
    windows[processID] = {
      win: mainWindow,
      file,
      edited,
      content,
      open: () => {
        mainWindow.webContents.send("open", (()=>{
          let params = {};
      
          if (file === "") {
            params.file = "untitled.kig";
            params.contents = "";
          } else {
            params.file = file;
            let ctx;
            try {
              ctx = decode(fs.readFileSync(file, 'utf8'));
              fs.writeFileSync("out.txt", ctx)
            } catch (err) {
              ctx = "";
              dialog.showErrorBox('Error', err.message);
              // console.log(typeof (err.message))
            }
            params.contents = ctx;
            content = ctx;
          }
          file = params.file;
          return params;
        })())
      },
      save: () => {
        try {
          fs.writeFileSync(file, encode(content));
          edited = false;
        } catch (err) {
          dialog.showErrorBox('Error', err.message);
          // console.log(typeof (err.message))
        }
      }
    }
  }

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  ipcMain.on("content-update", (event, arg) => {
    edited = arg.edited;
    content = arg.content;
    updateProcess()
  })

  ipcMain.on("save", (event, arg) => {
    windows[processID].save()
    updateProcess()
    windows[processID].open()
  })

  mainWindow.on("close", (event) => {
    if (edited) {
      event.preventDefault();
      const confirmSaveDialog = (callback) => {
        const options = {
          type: 'question',
          buttons: ['Save', 'Cancel', 'Don\'t Save'],
          defaultId: 0,
          message: 'Do you want to save changes?',
          detail: 'Your changes will be lost if you don\'t save them.',
          cancelId: 1
        };
      
        dialog.showMessageBox(null, options).then((response) => {
          callback(response.response);
        }).catch((err) => {
          console.log(err);
        });
      };
      
      // Example usage:
      confirmSaveDialog((response) => {
        if (response === 0) {
          // Save
          windows[processID].save();
          mainWindow.close()
        } else if (response === 1) {
          // Cancel
          console.log('Cancel');
        } else {
          // Don't Save
          edited = false;
          mainWindow.close()
        }
      });
    }
  })

  updateProcess()
  windows[processID].open()

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
