const socketService = (socket) =>
{
    socket.on('new-group-message', (groupId)=>{
        socket.broadcast.emit('group-message', groupId);
    })
}

module.exports = socketService;