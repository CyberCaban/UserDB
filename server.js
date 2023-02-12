// dotenv эта штука нужна чтобы хранить глобальные переменные в файле .env
// а реквайр нужен чтобы подцепить эти переменные из файла
require("dotenv").config()

var Datastore = require('nedb');
var db = new Datastore({filename : 'data', timestampData: true});
db.loadDatabase();
// db.insert({login : "admin", password: "admin"});

//инит экспресса
const express = require('express')
const app = express()
const urlencodedParser = express.urlencoded({extended: false});

//задаем движок для страниц
app.set('view engine', 'ejs')

//рендерим страницу (по умолчанию из директории views)
app.get('/', (req, res) => {
    res.render('regPage')
})
    
app.get('/loginPage', (req, res) => {
    res.render('loginPage')
})

app.get('/regPage', (req, res) => {
    res.render('regPage')
})

//принимаем значения со страницы
app.post('/register', urlencodedParser, (req, res, next) => {
    const userData = {
        login: req.body.UserLogin,
        password: req.body.UserPassword
    }
    db.insert(userData)
    console.log(userData);
    res.send(userData)
    next()
})

app.post('/login', urlencodedParser, (req, res, next) => {
    const userData = {
        login: req.body.UserLogin,
        password: req.body.UserPassword
    }

    console.log(userData);

    db.find( userData , function (err, docs) {
        if (docs != []) {
            console.log(docs);
        }
    });

    res.send(userData)
    next()
})

// db.find({ login: 'dima', password: '123'}, function (err, docs) {
//     console.log(docs);
// });

app.listen(process.env.PORT)