// app/routes.js
var fs = require('fs');
var mysql = require('mysql');
var dbconfig = require('../config/database');
var con = mysql.createConnection(dbconfig.connection);

module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		// res.render('index.ejs'); // load the index.ejs file
		if (req.isAuthenticated() == true){
			res.redirect('/profile');
		}else{
			res.render('index.ejs', { message: req.flash('loginMessage') });
		}
		// res.render('content/login/login');
		// console.log(__dirname + '/..');
		// var data = fs.readFileSync('../' + __dirname + '/content/dashboard/index.html', 'utf-8');
		// res.end(data);
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {
		// passport.authenticate();
		// console.log(passport.authenticate());
		// render the page and pass in any flash data if it exists
		if (req.isAuthenticated() == true){
			res.redirect('/profilFe');
		}else{
			res.render('login.ejs', { message: req.flash('loginMessage') });
		}
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		var sql = 'SELECT `id`, `name`, `time_create` FROM `tree`';
		var rel = [];
		var query = con.query(sql,function (err, result, fields) {
		    if (err) throw err;
		    for(var i = 0; i < result.length; i++){
		    	rel.push(result[i]);
		    }
		   //  console.log(JSON.stringify(rel));
		  	// console.log(rel.lenght);
		  	
		  	res.render('content/dashboard/index.ejs', {
					user : req.user, // get the user out of session and pass to template
					query: JSON.stringify(rel)
				});
	  	});
	});

	app.get('/add_tree', function(req, res) {
		var id = con.query('SELECT COUNT(id) FROM `tree` WHERE 1') + 1;
		var date = new Date();
		// test
		var dateObj = new Date();
		var month = dateObj.getUTCMonth() + 1; //months from 1-12
		var day = dateObj.getUTCDate();
		var year = dateObj.getUTCFullYear();

		newdate = year + "-" + month + "-" + day;

		console.log(newdate);
		var sql = 'INSERT INTO `tree`(`name`, `time_create`, `humimax`, `humimin`, `humi`) VALUES ("' + req.query.name + '","' + newdate + '","' + req.query.humimax + '","' + req.query.humimin + '","' + req.query.humi + '")';
		var rel = [];
		var query = con.query(sql,function (err, result, fields) {
		    res.send("ok");
	  	});
	});

	app.get('/load_list_tree', function(req, res){
		var sql = 'SELECT `id`, `name`, `time_create` FROM `tree`';
		var rel = [];
		var query = con.query(sql,function (err, result, fields) {
		    if (err) throw err;
		    for(var i = 0; i < result.length; i++){
		    	rel.push(result[i]);
		    }
		    res.send(JSON.stringify(rel));
	  	});
	});

	app.get('/delete_tree', isLoggedIn, function(req, res){
		var sql = 'DELETE FROM `tree` WHERE id=' + req.query.id;
		var query = con.query(sql,function (err, result, fields) {
		    res.send("ok");
	  	});
	});

	app.get("/setting", function(req, res){
		var sql = 'SELECT * FROM `setting`';
		var rel = [];
		var query = con.query(sql, function(err, result, fields){
			if (err) throw err;
			for(var i = 0; i < result.length; i++){
				rel.push(result[i]);
			}
		});
		res.render("content/setting/index.ejs", {
			page: "./body.ejs",
			query: JSON.stringify(rel)
		});
	});

	app.get("/get_data_tree", function(req, res){
		console.log(req.query.id);
		var sql = 'SELECT * FROM `log` INNER JOIN tree ON tree.id = log.id_tree WHERE tree.id = ' + req.query.id;
		
		var rel = [];
		var query = con.query(sql,function (err, result, fields) {
		    if (err) throw err;
		    for(var i = 0; i < result.length; i++){
		    	rel.push(result[i]);
		    }
			res.send(JSON.stringify(rel));
	  	});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
	
	// Receive data from SIM900A
	app.get('/embedded_2017/receive_data_sim900a', function(req, res){
		var date = new Date();
		// test
		var dateObj = new Date();
		var month = dateObj.getUTCMonth() + 1; //months from 1-12
		var day = dateObj.getUTCDate();
		var year = dateObj.getUTCFullYear();

		var newdate = year + "-" + month + "-" + day;
		// res.send(newdate);
		var sql = "INSERT INTO `log`(`id_tree`, `time`, `total_time`, `humidity`) VALUES (" + req.query.id + ", '" + newdate + "', " + req.query.total_time + ", " + req.query.humi + ");";
		// res.send(sql);
		var rel = [];
		var query = con.query(sql,function (err, result, fields) {
		    // if (err) throw err;
		    // for(var i = 0; i < result.length; i++){
		    	// rel.push(result[i]);
		    // }
			res.send("receive success");
	  	});
		// res.send("hello");
	});
	
	// Setting
	app.get("/abc", function (req, res){
		var sql = "Select * from setting";
		var rel = [];
		var query = con.query(sql,function (err, result, fields) {
		    if (err) throw err;
		    for(var i = 0; i < result.length; i++){
		    	rel.push(result[i]);
		    }
		    var data = "";
		    if (rel.length !== 0) {
                data += rel[0].w1+ "." + rel[0].w2+ "." + rel[0].w3+ "." + rel[0].w4+ "." + rel[0].hour;
            }
            console.log(data);
			res.send(data);
	  	});
	});
	
	app.post('/save_setting', function(req, res){
		var sql = "UPDATE `setting` SET `hour` = " + req.body.hour + ", `w1` = " + req.body.w1 + ",`w2` = " + req.body.w2 + ",`w3` =" + req.body.w3 + ",`w4`=" + req.body.w4 + "";
		var query = con.query(sql,function (err, result, fields) {
		    if (err) throw err;
		    // for(var i = 0; i < result.length; i++){
		    	// rel.push(result[i]);
		    // }
		    // var data = "";
		    // data += rel[0].total_time + "." + rel[0].hour;
			res.redirect('/setting');
	  	});
	} );
	
	app.get("/load_data_to_setting", function(req, res){
		var sql = "Select * from setting;";
		var rel = [];
		var query = con.query(sql,function (err, result, fields) {
		    if (err) throw err;
		    for(var i = 0; i < result.length; i++){
		    	rel.push(result[i]);
		    }
			res.send(JSON.stringify(rel));
	  	});
	});

	app.get("/humi_often", isLoggedIn, function(req, res){
		var sql = 'Select * from tree_humidity ;';
		var rel = [];
		var query = con.query(sql,function (err, result, fields) {
		    if (err) throw err;
		    for(var i = 0; i < result.length; i++){
		    	rel.push(result[i]);
		    }
			res.render("content/humi-often/index.ejs", {
				query: JSON.stringify(rel)
			});
	  	});
	})
	
	// test 
	app.get("/test", function(req, res){
		// console.log(req.query.start_date);
		// return 1;
		var sql = "insert into `tree_humidity`(`tree_id`, `start_date`, `value`)  values(1, '" + req.query.start_date + "', " + req.query.value + ")";
		res.send(sql);
		var rel = [];
		var query = con.query(sql,function (err, result, fields) {
		    if (err) throw err;
		    for(var i = 0; i < result.length; i++){
		    	rel.push(result[i]);
		    }
			res.send(rel);
	  	});
	});
	
	app.get("/embedded_2017/humidity-update", function (req, res) {
	    var tree_id = 1;
	    var device_id = 1;
	    if (req.query.humi != undefined) {
            var humidity = req.query.humi;
        }
	    else {
            res.send({'res': 1});
            console.log('request update humidity invalid!');
	    }
        var sql = "insert into tree_humidity(tree_id, device_id, value, start_date) values(" + tree_id +"," + device_id + "," + humidity + "," + req.query.time + ");";
        var query = con.query(sql,function (err, result, fields) {
            if (err) throw err;
            res.send({'res': 0});
        });
    })
};

// route middleware to make sure
function isLoggedIn(req, res, next) {
	console.log(req.isAuthenticated());
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated()){
		return next();
	}	else{
		// if they aren't redirect them to the home page
		res.redirect('/');
	}
}
