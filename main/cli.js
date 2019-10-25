const Conf = require('conf');
global.config = new Conf({projectName: 'zeeka'});
const {prompt} = require('enquirer');

const questions = [
    {
        type: 'input',
        name: 'folder',
        message: 'Directory To Share',
        initial: config.get('folder')
    },
    {
        type: 'input',
        name: 'username',
        message: 'Username',
        initial: config.get('username')
    },
    {
        type: 'password',
        name: 'password',
        message: 'Password'
    },
    {
        type: 'input',
        name: 'subdomain',
        message: 'Prefered Subdomain',
        initial: config.get('subdomain')
    }
];

function cli(callback) {
    prompt(questions).then((answers) => {
        config.set('folder', answers.folder);
        config.set('username', answers.username);
        config.set('password', answers.password);
        config.set('subdomain', answers.subdomain);
        if(callback)
            callback();
    }).catch(console.error);
}

module.exports = {cli};