require('dotenv').config();

const express = require('express')
const db = require('./db')

const path = require('path')
const cors = require('cors')
var session = require('express-session') 

const memberRouter = require('./routes/member');
const feedRouter = require('./routes/feed');
const followRouter = require('./routes/follow');
const activitiesRouter = require('./routes/activities');

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors({
    origin : ["http://localhost:3000", "http://localhost:3001"] ,
    credentials : true
})) 
app.use(session({
    secret: 'test1234',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly : true, 
        secure : false,
        maxAge : 1000 * 60 * 30 
    }
}))

app.use('/member', memberRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/feed', feedRouter);
app.use('/follow', followRouter);
app.use('/activities', activitiesRouter);

app.listen(3005, () => {
    console.log("서버 실행 중!");
})