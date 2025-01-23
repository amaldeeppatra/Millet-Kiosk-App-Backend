require('dotenv').config();
const express = require("express");
const session = require('express-session');
const app = express();
const PORT = process.env.PORT;

const mongoose = require("mongoose");

require('https').globalAgent.options.rejectUnauthorized = false;

const passport = require('./config/passport');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/newProduct');
const getProdByCat = require('./routes/getProduct');

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

mongoose.connect(process.env.MONGO_URI).then((e) => console.log("Mongodb connected"));

app.use('/auth', authRoutes);
app.use('/product', productRoutes);
app.use('/products', getProdByCat);

app.get('/', (req, res) => {
  res.send('running')
})

app.listen(PORT, () => console.log(`Server running at ${PORT}`));