let express = require('express');
let app = express();
let session = require('express-session');
let server = require('http').createServer(app);
let io = require('socket.io').listen(server);
const mysql = require('mysql');

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'chat'
});

yangterhubung = []

app.set('views', './views');
app.set('view engine', 'ejs');

server.listen(3000);
console.log('Server sedang Berjalan...')

app.get('/', function (req, res) {
  res.render('login');
})

app.get('/index', (req, res) => {
  if (req.session.loggedin) {
    res.render('index', {user_login: req.session});
  }else {
    res.redirect('/');
  }
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/signin', (req, res) => {
  connection.query(
    'SELECT * FROM cn_user WHERE username = ? AND password = ?',
    [req.body.username, req.body.password],
    (error, results) => {
      if (results.length > 0) {
        req.session.loggedin = true;
				req.session.username = req.body.username;
				req.session.name = results[0].name;
        res.redirect('/index');
      }else {
        res.redirect('/');
      }
    }
  );
});

app.get('/logout', function(req, res){
	req.session.destroy((err) => {
			if(err) {
					return console.log(err);
			}
			res.redirect('/');
	});
});

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
