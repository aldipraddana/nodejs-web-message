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
  database: 'chat',
	multipleStatements: true
});

yangterhubung = []

app.set('views', './views');
app.set('view engine', 'ejs');

server.listen(3000);
console.log('Server sedang Berjalan...')

app.get('/', function (req, res) {
  res.render('login');
})

app.get('/index/:id_receiver', (req, res) => {
  if (req.session.loggedin) {
		connection.query(
			`SELECT cf.id_group_chat FROM cn_user cu
			 JOIN cn_friend cf on cf.id_user = cu.id_user or cf.id_friend = cu.id_user
			 WHERE cu.id_user = ${req.session.id_user}
       AND (cf.id_user = ${req.params.id_receiver} or cf.id_friend = ${req.params.id_receiver});SELECT name FROM cn_user WHERE id_user = ${req.params.id_receiver}`,
			(error, results) => {
				// if (error) throw error;
				console.log(results[1][0].name);
				// console.log(results);
				res.render('index', {user_login: req.session, data_receiver: results[1][0], group: results[0][0]});
			});
  }else {
    res.redirect('/');
  }
});

app.get('/list', (req, res) => {
  if (req.session.loggedin) {
		connection.query(
			`SELECT * FROM cn_user WHERE id_user != ${req.session.id_user}`,
			(error, results) => {
				res.render('list', {items: results, user_login: req.session});
			}
		);

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
				req.session.id_user = results[0].id_user;
        res.redirect('/list');
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

	//makeprivateroom
	socket.on('myprivatechatroom',function(data){
		console.log(data);
		socket.join(data.my_friend);
		io.emit('notification',{notification_alert:"You have a message!"})
	});

  // send message
  // socket.on('send_message', function(data) {
  //   io.sockets.emit('new message', {msg: data})
  // })

	socket.on('send_message', function (data) {
		console.log(`new_message_${data.group}`);
		io.sockets.emit(`new_message_${data.group}`, { msg: data.message });
	});



})
