//Basic Express WS handling
debugger;
const express = require('express');
const hbs = require('hbs');

var app = express();

var HTML = '<h1>Hello Express World!!!</h1>';
var aboutJson = {
	name:'Cha',
	age: 27,
	likes: ['fut','code']
};

app.set('view engine', 'hbs'); //Use HBS as view engine
app.use(express.static(__dirname + '/public')); //include all files in the specified dir

//Middleware
app.use((request, response, next) => {
	var now = new Date().toString();
	console.log('New request @ ' + now + ' ' + request.method + ' for: ' + request.url + ' from: ' + request.ip);
	next();
	
});

//handler setup
app.get('/', (request,response) => { // URL,requestHandlerResponse
	response.send(HTML); //resp a alguien que hace un HTTP request (body)
	// response.send(aboutJson);
});

//additional pages
app.get('/about', (request,response) => {
	response.send('Site created by Cha!');
	
}); 

//hbs parcials
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('currDate', ()=> {
	var date = new Date();  //
	var month = date.toLocaleString('en-us', { month: 'long' });
	return month.toString() + ' ' + date.getFullYear().toString();
});

//Helper as a function with a param
hbs.registerHelper('screamIt',(textToScream)=>{
	return textToScream.toUpperCase();
}); 

//Handlebars
app.get('/aboutHBS', (request,response) => {
	response.render('aboutHBS.hbs', {
		nextVerse: 'I think I though I saw you laugh'
	});
});




//Conection to DB
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();


var users = 'empty'
client.query('SELECT * FROM public."Users";', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
	users = users + '<b>' + JSON.stringify(row);
  }
  client.end();
});

app.get('/DB', (request,response) => {
	response.send("resp: " + users);
	
});


//Heroku Port Env Var
const port = process.env.PORT || 3000;

//Start Web Server
app.listen(port, ()=>{
	console.log('server is up in port 3000');
}); //3000=port. Para hacer un request localhost:3000
