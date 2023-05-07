var express = require('express');
var cors = require("cors");
var mongoose = require('mongoose');
var http = require('http')
require('dotenv').config();
const {Server} = require("socket.io")

// initiate app
var app = express();

//
app.use(cors());

const serverhttp = http.createServer(app);
const io = new Server(serverhttp, {
  cors: {
    origin: ['http://localhost:' + process.env.PORT, 'https://accelerometerrl.onrender.com'],
    methods: ["GET", "POST"]
  }
})

// 
var mainSchema = new mongoose.Schema({}, {
  strict: false,
  collection: 'main'
});
var mainModel = mongoose.model('Main', mainSchema);

// connect to MongoDB
if (process.env.NODE_ENV === 'development') {
  // Define the development db
  mongoose.connect('mongodb://127.0.0.1/AlbufeiraWS');
} else if (process.env.NODE_ENV === 'production') {
  // Define the production db
  mongoose.connect(process.env.MONGODB_URI);
};

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
  console.log('database opened');
});

app.get('/', function (request, response) {
  response.render('gonogo.html');
});

app.get('/accelerometer', function (request, response) {
  response.render('iphone_accelerometer.html');
});




app.post('/gonogoDb', function (request, response) {
  mainModel.create({
    "GONOGOdata": request.body
  });
  console.log('received GONOGO data')
  response.end();
})

//
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// set views
app.use(express.static(__dirname + '/public/'));
app.set('views', __dirname + '/public/');


// lauch
if (process.env.NODE_ENV === 'production') {
  // Define the production db
  serverhttp.listen(process.env.PORT, function () {
    console.log("Listening on port %d", serverhttp.address().port);
  });
}
