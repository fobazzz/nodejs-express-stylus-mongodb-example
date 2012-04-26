
// ПОДКЛЮЧАЕМ ЗАВИСИМЫЕ МОДУЛИ

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// НАСТРОЙКА ПРИЛОЖЕНИЯ

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());

  app.use(express.methodOverride());
  app.use(require('stylus').middleware({
            force: false                // если стоит false (по умолчанию) - то будет компилить только если были изменения в .styl файле
          , src: __dirname + '/stylus'
          , dest: __dirname + '/public'
          , compress: true
          , linenos: true
          , debug: false                // показывает в консоли дебаг
        }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));  
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// MONGO

var mongo = require('mongodb'),
  Server = mongo.Server,
  Db = mongo.Db,
	BSON = mongo.BSONPure
	
var server = new Server('localhost', 27017, {auto_reconnect: true, poolSize: 1 }) // poolSize - колличество одновременных tcp коннектов
var db = new Db('exampleDb', server)

db.open(function(err, db){
	if(err) console.log(err)
})
		
// РОУТЫ

// главная страница
app.get('/', function(req, res){
	
	db.collection('users', function(err, collection) {
		if(err) console.log(err)
		else {
			collection.find().toArray(function(err, users) {
				if(err) console.log(err)
				else {
					//console.log(users)
					res.render('index', { users: users })
				}
			});

		}
	})

})

// сохранение нового пользователя
app.post('/save', function(req, res){

	db.collection('users', function(err, collection) {
		if(err) console.log(err)
		else {
			var user = req.body.user // не безопасно естественно :) но для тестов нас сойдет
			collection.insert(user, {safe:true}, function(err, result) {
				console.log('User inserted', result)
			})
		}
	})

	res.redirect('/')
})

// удаление пользователя (вообще нужно использовать POST, но для демонстрации и так сойдет )
app.get('/users/:id/delete', function(req, res){

	db.collection('users', function(err, collection) {
		if(err) console.log(err)
		else {

			collection.remove({ '_id': new BSON.ObjectID(req.params.id) }, {safe:true}, function(err, result) {
				console.log('User deleted', result, req.params.id)
			})
		}
	})

	res.redirect('/')
})

// ЗАПУСК ПРИЛОЖЕНИЯ

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
