const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const admin = require('firebase-admin');
const server = require('http').createServer(app);
const engine = require('ejs-locals');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
var time = new Date;

var serviceAccount = require('./env/nancy-hmw-044-c8d37b8c6c68.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://nancy-hmw-044.firebaseio.com'
});

var db = admin.firestore();

db.settings({ timestampsInSnapshots: true });

const usersCollection = db.collection('users');

app.use(bodyParser.urlencoded({
	extended:true
}));

app.use(methodOverride("_method"));

app.use("/public", express.static(path.join(__dirname, 'public')));
app.engine('ejs', engine);
app.set("view engine", "ejs");


app.get('/', function (req,res){
	usersCollection.get()
	.then(snapshot => {
		res.render('index.ejs', {
			dataToUse: snapshot
		});
	})
	.catch((err) => {
		console.log('Error getting documents', err);
	});
	
});

app.get('/users/:id', function (req, res) {
	var dataToUse = {}
	var allWeights = usersCollection.doc(req.params.id).collection('weight');
	var allBloodSugars = usersCollection.doc(req.params.id).collection('bloodsugar');
	var allBloodPressures = usersCollection.doc(req.params.id).collection('bloodpressure');
	allWeights.get()
	.then(function (weights){
		dataToUse.weights = weights
	})
	.catch(function(err){
		console.log('Error getting document', err);
	})
	allBloodPressures.get()
	.then(function(bloodPressures){
		dataToUse.bloodPressures = bloodPressures;
		dataToUse.bloodPressures.forEach(function(bp){
		})
	})
	.catch(function(err){
		console.log('Error getting document', err);
	})
	allBloodSugars.get()
	.then(function(bloodSugars){
		dataToUse.bloodSugars = bloodSugars;
		res.render('user.ejs',{
			weights: dataToUse.weights,
			bloodSugars: dataToUse.bloodSugars,
			bloodPressures: dataToUse.bloodPressures
		});
	})
	.catch(function(err){
		console.log('Error getting document', err);
	})
});

app.get('/users/:id/:type/new', function(req, res){
	res.render('new.ejs',{type: req.params.type})
})

app.post('/users/:id/:type/new', function(req, res){
	var user;
	switch(req.params.type){
		case 'bloodpressure':
		var user = usersCollection.doc(req.params.id).collection('bloodpressure');
		user.add({
			systolic: req.body.systolic,
			diastolic: req.body.diastolic,
			timestamp: time.toUTCString()
		}).then(function() {
			res.redirect('/')
		});
		break
		case 'bloodsugar':
		var user = usersCollection.doc(req.params.id).collection('bloodsugar');
		user.add({
			bloodSugar: req.body.bloodsugar,
			timestamp: time.toUTCString()
		}).then(function() {
			res.redirect('/')
		});
		break
		case 'weight':
		var user = usersCollection.doc(req.params.id).collection('weight');
		user.add({
			weight: req.body.weight,
			timestamp: time.toUTCString()
		}).then(function() {
			res.redirect('/')
		});
		break
	}
});



server.listen(port);



// app.get('/', function (req, res){
//     models.User.findAll().success(function (users){
//         res.render('index.ejs', {
//             all_Users : users 
//         })
//     });
// });

