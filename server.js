// dotenv эта штука нужна чтобы хранить глобальные переменные в файле .env
// а реквайр нужен чтобы подцепить эти переменные из файла
require("dotenv").config()

var Datastore = require('nedb');
var db = new Datastore({filename : 'users'});
db.loadDatabase();
// db.insert({login : "admin", password: "admin"});

//инит экспресса
const express = require('express')
const app = express()

//задаем движок для страниц
app.set('view engine', 'ejs')

//рендерим страницу (по умолчанию из директории views)
app.get('/', (req, res) => {
    res.render('index')
})

//принимаем значения со страницы
app.get('/users', (req, res, next) => {
    const userData = {
        login: req.query.UserLogin,
        password:req.query.UserPassword
    }
    db.insert(userData)
    console.log(userData);
    next()
})

app.listen(process.env.PORT)