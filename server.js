let express = require('express')
let app = express()
let server = require('http').createServer(app)
let io = require('socket.io').listen(server)

// let fs = require('fs')
// let path = require('path')

yangterhubung = []

server.listen(3000);
console.log('Server sedang Berjalan...')

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

// app.use(express.static(path.join(__dirname, 'assets/bootstrap.min.css')))
// app.use(express.static(path.join(__dirname, 'assets/bootstrap.min.js')))

io.sockets.on('connection', function(socket) {
  yangterhubung.push(socket);
  console.log('banyak socket yang terhubung : %s', yangterhubung.length);
  //disconnect
  socket.on('disconnect', function(data) {
    yangterhubung.splice(yangterhubung.indexOf(socket), 1)
    console.log('Terputus: %s ', yangterhubung.length)
  })
  // send message
  socket.on('send message', function(data) {
    io.sockets.emit('new message', {msg: data})
  })
})
