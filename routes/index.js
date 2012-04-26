
/*
 * GET home page.
 */

exports.index = function(req, res){

	/*
	app.get('/', function(req, res){


	
	db.users.find({sex: "female"}, function(err, users) {
	  if( err || !users.length) {
	  	console.log("No female users found")
	  } else {
	  	
	  	console.log(users, users.length)
	  	
	  	var users_arr = [];

	  	users.forEach(function(femaleUser) {
	    	console.log(femaleUser)
	    	users_arr.push(femaleUser);
	  	});
	  	

	  	
	  	
	  }
	})
	
	res.render('index', { users: 1500 })

  
});
	*/
  res.render('index', { title: 'About page' })
}


/*
 * GET /about
 */

exports.about = function(req, res){
  res.render('about', { title: 'About page' })
}