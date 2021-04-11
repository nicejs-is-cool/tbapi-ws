var bot = require('./bot')
//var express = require('express');
//var http = require('http');

//var app = express();
//var server = http.createServer(app);
var io = require('socket.io')(3000);


// app.get('/',(req,res) => {
//     res.send('use socket.io for this website')
// })

io.on('connection', socket => {
    console.log('someone connected!')
    socket.on('subscribeEvent',(eventname) => {
        bot.subscribeForEvent(eventname,(...args) => {
            socket.emit('event:'+eventname,...args);
        })
    })
    socket.on('subscribeEventOnce',(eventname) => {
        bot.subscribeForEventOnce(eventname,(...args) => {
            socket.emit('event:'+eventname,...args);
        })
    })
    socket.on('getRooms',() => {
        socket.emit('rooms',bot.getRooms())
    })
    socket.on('getOnlineUsers',() => {
        socket.emit('onlineusers',bot.getOnlineUsers())
    })
    socket.on('getAllMessages',() => {
        socket.emit('onlineusers',bot.getSentMessages())
    })
    
})

// server.listen(3000)