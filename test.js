var bot = require('./bot')
bot.subscribeForEvent('onMessage',(data) => {
    console.log(`${data.nick}> ${data.msg}`);
})
bot.subscribeForEvent('onRoomsUpdate',() => {
    var rooms = bot.getRooms();
    console.log(rooms)
})