let express = require('express');
let session = require('express-session');
let expressFileupload = require('express-fileupload');
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
app.use('/jsjq', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/font', express.static(__dirname + '/font')); // redirect root
app.use('/img', express.static(__dirname + '/img')); // redirect to img

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

app.use(expressFileupload());

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
          `SELECT id_chat, user_id, message, time_chat FROM cn_chat WHERE id_group_chat = '${results[0][0].id_group_chat}' AND who = '${req.session.username}' ORDER BY id_chat ASC;
          SELECT img_profile FROM cn_user WHERE id_user = ${req.session.id_user}`,
          (error_, return_two) => {
            if (error) throw error;

            if (results[0][0] == undefined) {
              res.redirect('/list');
            } else {
              // console.log(history_chat);
              res.render('index', {
                user_login: req.session,
                data_receiver: results[1][0],
                group: results[0][0],
                history_chat: return_two[0],
                img_profile: return_two[1][0].img_profile
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
      `SELECT cu.*
      FROM cn_friend cf, cn_user cu
      WHERE cf.id_user = ${req.session.id_user}
      AND cf.id_friend = cu.id_user;
      SELECT cc.*, cu.name, cu.id_user id_friend, cu.username, cu.img_profile
      FROM cn_chat cc, cn_user cu
      WHERE id_chat IN (SELECT MAX(id_chat)
                        FROM cn_chat WHERE id_group_chat LIKE '%${req.session.username}%'
                        AND who = '${req.session.username}'
                        GROUP BY id_group_chat)
      AND cu.username = SUBSTRING_INDEX(cc.id_group_chat, "_", (CASE WHEN SUBSTRING_INDEX(cc.id_group_chat, "_", -1) = '${req.session.username}' THEN 1 ELSE -1 END));
      SELECT img_profile FROM cn_user WHERE id_user = ${req.session.id_user}`,
      (error, results) => {
        res.render('list', {
          items: results[0],
          chat_list: results[1],
          user_login: req.session,
					flash: req.flash('login'),
          img_profile: results[2][0].img_profile
        });
      }
    );

  } else {
    res.redirect('/');
  }
});

app.post('/check_username', (req, res) => {
  connection.query(
    `SELECT username FROM cn_user WHERE username = '${req.body.username}'`,
    (error, results) => {
      if (results.length > 0) {
        res.json(1);
      }else {
        res.json(0);
      }
    }
  )
})


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
        req.session.username = results[0].username;
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
		`SELECT * FROM cn_friend WHERE id_friend = ${req.body.id_friend} AND id_user = ${req.session.id_user}`,
		(error, results) => {
      // console.log(results);
      let hasil;
      if (results.length > 0) {
        hasil = 0;
      }else {
        hasil = 1;
      }
      res.json(hasil);
		}
	)
});

app.post('/add_friend', (req, res) => {
  if (req.session.loggedin) {
	connection.query(
    `INSERT INTO cn_friend (id_user, id_friend, id_group_chat) VALUES (?, ?, ?);
     SELECT img_profile FROM cn_user WHERE id_user = ${req.body.id_friend}`,
    [req.session.id_user, req.body.id_friend, req.body.id_group_chat],
		(error, results) => {
      if (results[0].affectedRows) {
        res.json({success:1,img_profile_friend:`${results[1][0].img_profile}`});
      }
		}
	)
 }
});

app.post('/uploadpp', function(req, res) {
  let thefile = req.files.img;
  if (req.session.loggedin) {

  }
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded. Back');
  }else if (thefile.mimetype.split('/')[0] != 'image') {
    return res.status(400).send('file must be image. Back');
  }
  let name_file = +new Date() + thefile.md5;
  let path = __dirname + '/img/ak47/' + name_file + '.' + thefile.name.split('.')[1];
  let for_save = '/img/ak47/' + name_file + '.' + thefile.name.split('.')[1];
  thefile.mv(path, function(err) {
    if (err){
      return res.status(500).send(err);
    }else {
      connection.query(
        `SELECT img_profile FROM cn_user WHERE id_user = ${req.session.id_user}`,
        (error, img_data) => {
          if (img_data.length > 0) {
            fs.unlink(__dirname+img_data[0].img_profile, (err) => {
              if (err) {
                console.error(err)
              }
            })
          }

          //UPDATE
          connection.query(
            `UPDATE cn_user SET img_profile = ? WHERE id_user = ?`,
            [for_save, req.session.id_user],
        		(error, results) => {
              if (error) {
                return res.status(400).send('Service Unracable, try again later. Back');
              }else {
                res.redirect('/list');
              }
        		}
        	)

        }
      )
    }
  });
});

app.post('/delete_chat', (req, res) => {
  if (req.session.loggedin) {
    connection.query(
      `SELECT cf.id_group_chat FROM cn_user cu
       JOIN cn_friend cf on cf.id_user = cu.id_user or cf.id_friend = cu.id_user
       WHERE cu.id_user = ${req.session.id_user}
       AND (cf.id_user = ${req.body.id_friend} or cf.id_friend = ${req.body.id_friend});`,
      (error, result_1) => {
        connection.query(
          `DELETE FROM cn_chat WHERE id_group_chat = '${result_1[0].id_group_chat}' AND who = '${req.session.username}'`,
          (error, results) => {
            if (results.affectedRows) {
              res.json(1);
            }else {
              res.json(0);
            }
        })
      })
  }
});

app.get('/logout', function(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
    res.redirect('/');
  });
});

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
    let explode = data.group.split('_');
    function pad(val) {
      var str = "" + val;
      var pad = "00";
      var ans = pad.substring(0, pad.length - str.length) + str;
      return ans;
    }

    let dt = new Date();
    let time = pad(dt.getHours()) + ":" + pad(dt.getMinutes()) + " " + dt.getDate() + "/" + pad(dt.getMonth()+1) + "/" + dt.getFullYear();
    connection.query(
    `INSERT INTO cn_chat (message, id_group_chat, user_id, time_chat, who) VALUES
    ('${data.message}', '${data.group}', ${data.id_me}, '${time}', '${explode[0]}'),
    ('${data.message}', '${data.group}', ${data.id_me}, '${time}', '${explode[1]}')`,
      (error, results) => {
        console.log(error);
        console.log(results);
        if (results != undefined) {
          if (results.affectedRows) {

            io.sockets.emit(`new_message_${data.group}`, {
              msg: data.message,
              sender: data.username,
              time: time
            });

            io.sockets.emit(`notification_${data.receiver}`, {
              msg: data.message,
              sender: data.username,
              receiver: data.receiver,
              time: time,
              id_receiver: data.id_me,
              name:data.name,
              img_profile: data.img_profile
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
