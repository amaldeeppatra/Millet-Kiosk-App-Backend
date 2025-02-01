require('dotenv').config();
const express = require("express");
const session = require('express-session');
const bodyParser = require('body-parser'); 
const path = require('path');
const app = express();
const PORT = process.env.PORT;

const mongoose = require("mongoose");

require('https').globalAgent.options.rejectUnauthorized = false;

const passport = require('./config/passport');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/newProduct');
const getProdByCat = require('./routes/getProduct');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'views')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI).then((e) => console.log("Mongodb connected"));

app.use('/auth', authRoutes);
app.use('/product', productRoutes);
app.use('/products', getProdByCat);

app.get('/', (req, res) => {
  res.send('running')
})

app.listen(PORT, () => console.log(`Server running at ${PORT}`));