#!/usr/bin/env node

const express = require( "express" );
const basicAuth = require('express-basic-auth');
const localtunnel = require('localtunnel');
const filemanager = require('rich-filemanager-node');
const conf = __dirname + "/public/config/filemanager.config.json";
const fs = require('fs');
const os = require('os');
const path = require('path');

let PATH = null;
if(os.platform() === 'linux' || 'darwin') {
	PATH = '/usr/local/lib/node_modules';
}
else {
	let username = os.userInfo().username;
	PATH = path.join('C:', 'Users', username, 'AppData', 'Roaming', 'npm', 'node_modules');
}

const {cli} = require('./cli');

var app = express();

//Listen for requests
const port = 5000;

cli(() => {

	if (!fs.existsSync(config.get('folder'))) {
		return console.error('Directory does not exist or path not recognized!')
	}

	//----------------Middlewares------------------------
	//Authentication
	function myAuthorizer(username, password) {
		const userMatches = basicAuth.safeCompare(username, config.get('username'));
		const passwordMatches = basicAuth.safeCompare(password, config.get('password'));

		return userMatches & passwordMatches
	}
	app.use(basicAuth({ authorizer: myAuthorizer, challenge: true }));
	//static files from zeeka-filemanager module
	app.use(express.static(path.join(PATH, 'zeeka', 'node_modules', 'zeeka-filemanager')));
	// Static files from the file-explorer public folder
	app.use(express.static(__dirname + '/public'));
	//Filemanager route
	app.use('/filemanager', filemanager(config.get('folder'), conf));
	//----------------Middlewares------------------------

	app.listen(port, function () {
		//Launching Tunnel
		localtunnel(port, { subdomain: config.get('subdomain') }, (err, tunnel) => {
			if (err) throw err;
			console.log(`Zeeka is live on ${tunnel.url}`);
			// Launch the dashboard in the browser
			const opn = require("opn");
			opn(tunnel.url);
			//On Exit
			tunnel.on('close', () => {
				console.log('File Sharing Stopped');
			});
		});
	});
});