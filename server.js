let express = require('express');
let session = require('express-session');
let app = express();

let server = require('http').createServer(app);
let io = require('socket.io').listen(server);
let flash = require('connect-flash');
const mysql = require('mysql');
const path = require('path');
const jquery = require('jquery');
const fs = require('fs');

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
	let flash_data = req.flash('login');
	let flash_ = '';
	if (flash_data != '') {
		flash_ = flash_data[0];
	}else {
		flash_ = 'Succ';
	}
	console.log(flash_);
	res.render('login', {flash_login: flash_data, type: flash_.substr(0, 4) == 'Succ' ? 'signup' : 'signin'});
})

app.get('/index/:id_receiver', (req, res) => {
  if (req.session.loggedin) {
    connection.query(
      `SELECT cf.id_group_chat FROM cn_user cu
			 JOIN cn_friend cf on cf.id_user = cu.id_user or cf.id_friend = cu.id_user
			 WHERE cu.id_user = ${req.session.id_user}
       AND (cf.id_user = ${req.params.id_receiver} or cf.id_friend = ${req.params.id_receiver});
       SELECT name, id_user FROM cn_user WHERE id_user = ${req.params.id_receiver};`,
      (error, results) => {
        if (error) throw error;

        connection.query(
          `SELECT id_chat, user_id, message, time_chat FROM cn_chat WHERE id_group_chat = '${results[0][0].id_group_chat}' ORDER BY id_chat ASC`,
          (error_, history_chat) => {
            if (error) throw error;

            if (results[0][0] == undefined) {
              res.redirect('/list');
            } else {
              // console.log(history_chat);
              res.render('index', {
                user_login: req.session,
                data_receiver: results[1][0],
                group: results[0][0],
                history_chat: history_chat
              });
            }

          });

      });
  } else {
    res.redirect('/');
  }
});

app.get('/list', (req, res) => {
  if (req.session.loggedin) {
    connection.query(
      `SELECT cu.* FROM cn_friend cf, cn_user cu WHERE cf.id_user = ${req.session.id_user} and cf.id_friend = cu.id_user`,
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


app.post('/signup', (req, res) => {
	connection.query(
		'INSERT INTO cn_user (username, name, password) VALUES (?, ?, ?)',
		[req.body.username, req.body.name, req.body.password],
		(error, results) => {
			req.flash('login', 'Successfully added account, please login...');
			res.redirect('/');
		}
	)
});

app.post('/signin', (req, res) => {
  connection.query(
    'SELECT * FROM cn_user WHERE username = ? AND password = ?',
    [req.body.username, req.body.password],
    (error, results) => {
      if (results.length > 0) {

        // try {
        //   const data_ = fs.readFileSync(__dirname + '/test.txt'), 'utf8')
        //   console.log(data_);
        // } catch (err) {
        //   console.error(err);
        // }

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

app.post('/find', (req, res) => {
	connection.query(
		`SELECT * FROM cn_user WHERE username LIKE '%${req.body.username}%' and id_user != ${req.session.id_user}`,
		(error, results) => {
      let hasil;
      if (results.length > 0) {
        hasil = results;
      }else {
        hasil = 0;
      }
      res.render('result', {
        user_login: req.session,
        items: hasil,
      });
		}
	)
});

app.post('/cek_friend', (req, res) => {
	connection.query(
		`SELECT * FROM cn_friend WHERE id_friend != ${req.body.id_friend}`,
		(error, results) => {
      let hasil;
      if (results.length > 0) {
        hasil = 1;
      }else {
        hasil = 0;
      }
      res.json(hasil);
		}
	)
});

app.post('/add_friend', (req, res) => {
	connection.query(
    `INSERT INTO cn_friend (id_user, id_friend, id_group_chat) VALUES (?, ?, ?)`,
    [req.session.id_user, req.body.id_friend, req.body.id_group_chat],
		(error, results) => {
      res.json({success:1});
		}
	)
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

  // send message
  socket.on('send_message', function(data) {
    connection.query(
    'INSERT INTO cn_chat (message, id_group_chat, user_id, time_chat) VALUES (?, ?, ?, ?)',
      [data.message, data.group, data.id_me, data.time_chat],
      (error, results) => {
        if (results != undefined) {
          if (results.affectedRows) {

            io.sockets.emit(`new_message_${data.group}`, {
              msg: data.message,
              sender: data.username,
              time: data.time_chat
            });

            io.sockets.emit(`notification_${data.receiver}`, {
              msg: data.message,
              sender: data.username,
              receiver: data.receiver
            });
            // console.log('data receiver '+data.receiver);
          }else {
            io.sockets.emit(`new_message_${data.group}`, {
              msg: '~',
              sender: '~'
            });
          }
        }else {
          io.sockets.emit(`new_message_${data.group}`, {
            msg: '~*',
            sender: '~*'
          });
        }

      }
    )
  });


})
