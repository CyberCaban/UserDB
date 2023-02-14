// dotenv эта штука нужна чтобы хранить глобальные переменные в файле .env
// а реквайр нужен чтобы подцепить эти переменные из файла
require("dotenv").config()

var Datastore = require('nedb');
var db = new Datastore({filename : 'data', timestampData: true});
db.loadDatabase();
// db.insert({login : "admin", password: "admin", adminAccess: true});

//инит экспресса
const express = require('express')
const app = express()

//задаем движок для страниц
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))

//рендерим страницу (по умолчанию из директории views)
app.get('/', (req, res) => {
    res.render('regPage')
})

// переходы на страницы
app.get('/loginPage', (req, res) => {
    res.render('loginPage')
})

app.get('/regPage', (req, res) => {
    res.render('regPage')
})

//принимаем значения со страницы
app.post('/register', (req, res) => {

    //try catch если что то пойдет не так
    try{
        //составляем данные юзера в один объект
        const userData = {
            login: req.body.UserLogin,
            password: req.body.UserPassword,
            adminAccess: false
        }
        
        // заносим в бд
        db.insert(userData)
        //перенаправляем на страницу логина
        res.redirect('/loginPage')
    } catch {
        //при неудаче редирект обратно
        res.redirect('/regPage')
    }
})

app.post('/login', (req, res, next) => {

    //пытаемся найти в бд совпадение по логину
    db.findOne( {login: req.body.UserLogin}, function (err, docs) {
        // console.log(docs);
        //если совпадений нет пишем что неправильный логин
        if (docs == null) {
            res.render('loginPage', { incorrect_: 'Incorrect Login' })
            next()
        }
        //в другом случае проверяем пароль
        else if (docs.password != req.body.UserPassword) {
            res.render('loginPage', { incorrect_: 'Incorrect Password' })
            next()
        } else {
            res.render('index', { name: req.body.UserLogin })
        }
    })
})

// db.find({ login: 'dima', password: '123'}, function (err, docs) {
//     console.log(docs);
// });

app.listen(process.env.PORT)