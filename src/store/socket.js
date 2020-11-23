const io = require('socket.io-client');
const socket = io.connect('https://fleamarket-82.herokuapp.com/');

module.exports = socket; 