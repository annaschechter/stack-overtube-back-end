var app = require('express')();
var server = require('http').createServer(app);
var bodyParser = require('body-parser');
var models = require('./models');
var fs = require('fs');
var AWS = require('aws-sdk');
var uuid = require('node-uuid');
var busboy = require('connect-busboy');
var s3 = new AWS.S3();
var keyName = "interface.js"

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next();
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}))

app.set('view engine', 'ejs');
app.set('views',__dirname + '/views');
app.use(busboy());

app.get('/', function(req, res) {
	res.render('index');
});

app.post('/upload', function(req, res) {
	var fstream;
	// console.log(req.busboy);
	req.pipe(req.busboy);
	req.busboy.on('file', function(fieldname, file, filename) {
		console.log("uploading: "+filename)
		fstream = fs.createWriteStream(__dirname + '/views/' + filename);
		file.pipe(fstream);
		fstream.on('close', function() {
				console.log("Its done")
			var params = { Bucket: 'annas-second-test-bucket',  Key: 'pablofile.txt', Body: fs.readFileSync(__dirname + '/views/' + filename)}
			var amazon = fs.createWriteStream(__dirname + '/views/' + filename);
			s3.putObject(params).createReadStream().pipe(amazon);
			console.log(amazon);
		});
	});
});

app.post('/askquestion', function(req, res) {
	var question = req.body;
	models.Question.create({ title: question.title,
													 description: question.description, 
													 codeSnippet: question.codeSnippet, 
													 githubRepo: question.githubRepo, 
													 votes: question.votes,
													 UserId: question.userId,
													});
});

app.get('/allquestions', function(req, res) {
	models.Question.all().complete(function(err, questions) {
		res.send(questions);
	});
});

app.get('/question/:questionid', function(req, res) {
	var id = req.params.questionid;
	models.Question.find( {where:{id: id}} ).complete(function(err, question) {
		models.Reply.findAll( {where: {QuestionId: id}} ).complete(function(err, reply) {
			res.send({"question": question, "reply": reply});
		});
	});

});

app.post('/postreply/:questionid', function(req, res) {
	var reply = req.body;
	var id = req.params.questionid;
	models.Reply.create({ link: reply.link,
												QuestionId: id, 
												description: reply.description, 
												UserId: reply.userId 
											});
});

app.post('/newuser', function(req, res) {
	var user = req.body;
	models.User.create({ username: user.username, 
											 firstname: user.firstname, 
											 lastname: user.lastname, 
											 email: user.email, 
											 password: user.password 
											});
});

app.get('/user/:userid', function(req, res) {
	var user = req.body;
	models.User.find( {where: {id: req.params.userid}} ).complete(function(err, user) {
		res.send({"firstname": user.firstname, "username": user.username})
	})
})


module.exports = app



