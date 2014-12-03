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
app.set('view engine', 'ejs');
app.set('views',__dirname + '/views');

app.get('/', function(req, res) {
	res.render('index');
});

app.post('/askquestion', function(req, res) {
	var question = req.body;
	var username = req.body.author;
	models.User.find({where:{username: username}}).complete(function(err, user) {
		if(!!err) {
			res.send(err)
		} else if(!user) {
			res.send("No user found!")
		} else {
				models.Question.create({ title: question.title,
													 description: question.description,
													 codeSnippet: question.codeSnippet,
													 githubRepo: question.githubRepo,
													 votes: 0,
													 UserId: user.id
													});
				res.send("Question added successfully");
			}
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
		if(!!err){
			res.send(err)
		} else if(!user) {
			res.send("No user found!")
		} else {
			models.Reply.create({ link: reply.link,
														QuestionId: reply.questionId,
														UserId: user.id,
														votes: 0
													});
		res.send("Reply saved successfully");
		}
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

app.post('/upquestionvotes/:questionid', function(req, res){
	var questionId = req.params.questionid;
	models.Question.find( {where:{id: questionId}} ).complete(function(err, question) {
		if(!!err){
			res.send(err)
		} else if(!question) {
			res.send("No question found!")
		} else {
			question.updateAttributes({
				votes: question.votes + 1
			}).success(function(err, resp) {
				res.send("Vote saved successfully");
			})
		}

	});
})

app.post('/upreplyvotes/:replyid', function(req, res){
	var replyId = req.params.replyid;
	models.Reply.find( {where:{id: replyId}} ).complete(function(err, reply) {
		if(!!err){
			res.send(err)
		} else if(!reply) {
			res.send("No reply found!")
		} else {
			reply.updateAttributes({
				votes: reply.votes + 1
			}).success(function(err, resp) {
				res.send("Vote saved successfully");
			})
		}

	});
})


module.exports = app



