//#region IMPORTS
const url = require('url');
const path = require('path');
const https = require('https');
const uuid = require('uuid');
const axios = require('axios');
const { app, BrowserWindow, ipcMain } = require('electron');
//#endregion

//#region WINDOWS
let mainWindow;
let loginWindow;
let voterPortalWindow;
let ballotWindow;
//#endregion

//#region ELECTION VOTE
let Vote = {
    president:"",
    senate :"",
    hor:"",
    governor:"",
    hoa:"",
    lg:""
}
//#endregion

//#region  EVENT HANDLERS

//Creates a new window
function createNewWindow(width, height, showFrame, template, isFullscreen, parentWindow) {
    let window = new BrowserWindow({
        show: false,
        width: width,
        height: height,
        frame: showFrame,
        parent: parentWindow,
        fullscreen: isFullscreen,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    //window.webContents.openDevTools();
    window.loadFile(`./templates/${template}.html`);
    window.once('ready-to-show', () => {
        window.show();
    })
    return window;
}

// Loads the main window when the app starts
app.on('ready', () => {
    mainWindow = createNewWindow(2000, 2000, false, 'main', false);
    setTimeout(() => {
        loginWindow = createNewWindow(250, 320, false, 'login', false, mainWindow);
    }, 2000);
});

// handles login form submit event
ipcMain.on('onLoginSubmit', (e, credentials) => {
    let username = credentials.userName;
    let password = credentials.password;

    if (username === "m" && password === "m") {
        let code = `
        var p = document.getElementsByClassName ("menu-btn");
        for (butn of p) {
            butn.removeAttribute("disabled");
         }`;
        mainWindow.webContents.executeJavaScript(code);
        loginWindow.close();
    }
    else {
        let errorMessage = `alert("Wrong login")`;
        loginWindow.webContents.executeJavaScript(errorMessage);
        loginWindow.webContents.reloadIgnoringCache()
    }
});

// handles login form submit event
ipcMain.on('onBallotSubmit', (e, votedElection, votedParty) => {
    // voterPortalWindow.maximize();
});

// Handles ballot submit cancel
ipcMain.on('onBallotSubmitCancel', (e, selection) => {

});

// Handles Voter portal select event
ipcMain.on('onVoterPortalSelect', () => {
    voterPortalWindow = createNewWindow(2000, 5000, false, 'voterportal', false, mainWindow);
});

// handles login form submit event
ipcMain.on('onShowBallot', (e, electionTitle) => {
    ballotWindow = createNewWindow(2000, 2000, false, 'ballot', false, voterPortalWindow);
    let code2 = `var t= document.getElementById("election-title");
    t.innerText ="${electionTitle}"`;
    ballotWindow.webContents.executeJavaScript(code2);
});

// Handles Vote publish event 
ipcMain.on('votepublish-btn-click', (e, vote) => {
    vote.VoteUuId = uuid.v1();
    var votes = JSON.stringify([vote]);
    const options = {
        hostname: 'https://localhost',
        port: 44315,
        path: 'pendingvotes/addnew',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': votes.length,
        },
    }
    Post('https://localhost:44315/pendingvotes/addnew', votes)
});

// Posts data to the block chain end point
async function Post(url, data) {
    axios.post(url, data)
        .then(res => {
            console.log(`statusCode: ${res.statusCode}`)
            console.log(res)
        })
        .catch(error => {
            console.error(error)
        })
}

//#endregion


function assignVote(votedElection, votedParty) {

    switch (votedElection) {
        case 'PRESIDENTIAL ELECTION':
            break;
        case 'SENATORIAL ELECTION':
            // code block
            break;
        case 'HOUSE OF REPS ELECTION':
            // code block
            break;
        case 'GUBERNATORIAL ELECTION':
            // code block
            break;
        case 'HOUSE OF ASSEMBLY ELECTION':
            // code block
            break;
        case 'LG ELECTION':
            // code block
            break;
        default:
        // code block
    }

}



















// ipcMain.on('votepublish-btn-click', (e, vote) => {
//     vote.VoteUuId = uuid.v1();
//     var votes = JSON.stringify([vote]);
//     const options = {
//         hostname: 'https://localhost',
//         port: 44315,
//         path: 'pendingvotes/addnew',
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Content-Length': votes.length,
//         },
//     }

//     const req = https.request(options, (res) => {
//         console.log(`statusCode: ${res.statusCode}`)

//         res.on('votes', (d) => {
//             process.stdout.write(d)
//         })
//     })

//     req.on('error', (error) => {
//         console.error(error)
//     })
//     req.write(votes)
//     req.end()

// })