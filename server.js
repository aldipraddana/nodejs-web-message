let express = require('express');
let session = require('express-session');
let app = express();

let server = require('http').createServer(app);
let io = require('socket.io').listen(server);
let flash = require('connect-flash');
const mysql = require('mysql');
const path = require('path');

// prepare server
// app.use('/api', api); // redirect API calls
app.use('/custom', express.static(__dirname + '/node_modules/custom/')); // redirect root
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use(flash());
app.use(express.static('public'));
app.use(express.urlencoded({
  extended: false
}));

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

app.get('/', function(req, res) {
  res.render('login', {flash_login: req.flash('login')});
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
        if (results[0][0] == undefined) {
          res.redirect('/list');
        } else {
          res.render('index', {
            user_login: req.session,
            data_receiver: results[1][0],
            group: results[0][0]
          });
        }
      });
  } else {
    res.redirect('/');
  }
});

app.get('/list', (req, res) => {
  if (req.session.loggedin) {
    connection.query(
      `SELECT * FROM cn_user WHERE id_user != ${req.session.id_user}`,
      (error, results) => {
        res.render('list', {
          items: results,
          user_login: req.session,
					flash: req.flash('login')
        });
      }
    );

  } else {
    res.redirect('/');
  }
});

app.get('/signup', (req, res) => {
	connection.query(
		'INSERT INTO cn_user (username, email, password) VALUES (?, ?, ?)',
		[req.body.username, req.body.email, req.body.password],
		(error, results) => {

		}
	)
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

				req.flash('login', 1);
        res.redirect('/list');
      } else {
				req.flash('login', 'Wrong Password or Username!');
        res.redirect('/');
      }
    }
  );
});

app.get('/logout', function(req, res) {
  req.session.destroy((err) => {
    if (err) {
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
  socket.on('myprivatechatroom', function(data) {
    console.log(data);
    // socket.join(data.my_friend);
    io.emit('notification', {
      notification_alert: "You have a message!"
    })
  });

  // send message
  socket.on('send_message', function(data) {
    console.log('sender : ', `new_message_${data.username}`);
    io.sockets.emit(`new_message_${data.group}`, {
      msg: data.message,
      sender: data.username
    });
  });


})
