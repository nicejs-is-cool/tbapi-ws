
const EventEmitter = require('events')
var io = require('socket.io-client')
var tbheaders = require('trollbox-headers').headers()
const socket = io('http://www.windows93.net:8081', tbheaders)

class EventSubscriber extends EventEmitter {}
EventSubscriber.instance = new EventSubscriber();

var statedata = {
    messages: {
        cache: []
    },
    users: {
        cache: []
    },
    rooms: {
        cache: {}
    }
}
socket.on('_connected', function(data){ // and once we're connected...
    //socket.emit('user joined', 'TBApi', "red","","","") // ...our bot can join!
    console.log('tbapi connected')
    cacheRooms();
})
socket.on('message', function(data) {
    //if (data.msg == "ping") {socket.send('Pong!')}
    
    EventSubscriber.instance.emit('onMessage',data)
})
socket.on('user joined',function(data) {
    EventSubscriber.instance.emit('onUserJoined',data);
})
socket.on('user left',function(data) {
    EventSubscriber.instance.emit('onUserLeft',data);
})

socket.on('update users',function(data) {
    statedata.users.cache = Object.entries(data).map((x,y) => {return {id: x[0], ...x[1]}})
    EventSubscriber.instance.emit('onUserUpdate',data)
    cacheRooms();
})
socket.on('disconnect',() => {
    EventSubscriber.instance.emit('onBotDisconnect')
})
function cacheRooms() {
    if (Object.keys(statedata.rooms.cache).length > 0) EventSubscriber.instance.emit('onRoomsUpdate')
    var cache = {}
    statedata.users.cache.forEach(user => {
        if (user.room) {
            if (!cache[user.room]) cache[user.room] = {users: []};
            cache[user.room].users.push(user);

        }
    })
    statedata.rooms.cache = cache;
}

module.exports = {
    getSentMessages() {
        return statedata.messages.cache;
    },
    getOnlineUsers() {
        return statedata.users.cache;
    },
    getRooms() {
        return statedata.rooms.cache;
    },
    subscribeForEvent(event,callback) {
        EventSubscriber.instance.on(event,callback);
    },
    subscribeForEventOnce(event,callback) {
        EventSubscriber.instance.once(event,callback);
    }
}