
const EventEmitter = require('events');

var url = 'https://totalsyr.com'

class Logger extends EventEmitter {
    log(message) {
        // Send an HTTP request
        console.log(message);

        // Raise an event
        this.emit('messageLogged', {id: 1, url: url})
    }
}

module.exports = Logger;