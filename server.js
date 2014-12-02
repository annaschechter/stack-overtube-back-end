var app = require('express')();
var server = require('http').createServer(app);
var bodyParser = require('body-parser');
var models = require('./models');

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

app.get('/', function(req, res) {
	res.render('index');
});

app.post('/askquestion', function(req, res) {
	var question = req.body;
	var username = req.body.author;
	models.User.find({where:{username: username}}).complete(function(err, user) {
		models.Question.create({ title: question.title,
														 description: question.description, 
														 codeSnippet: question.codeSnippet, 
														 githubRepo: question.githubRepo, 
														 votes: question.votes,
														 UserId: user.id
														});
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

app.post('/postreply', function(req, res) {
	var reply = req.body;
	var username = req.body.author;
	models.User.find( {where:{username: username}} ).complete(function(err, user) {
		models.Reply.create({ link: reply.link,
													QuestionId: reply.questionId, 
													UserId: user.id 
												});
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



