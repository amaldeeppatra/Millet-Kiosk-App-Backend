require('dotenv').config();
const express = require("express");
const session = require('express-session');
const cors = require("cors");
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
const searchRoutes = require('./routes/search');

// app.use(cors({ origin: ['http://10.2.99.211:5173', 'http://localhost:5173', 'https://millet-kiosk-app.vercel.app', 'http://10.2.105.237:5173'], credentials: true }));
app.use(cors({ credentials: true }));

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
app.use('/search', searchRoutes);

app.get('/', (req, res) => {
  res.send('running')
})

app.listen(PORT, () => console.log(`Server running at ${PORT}`));