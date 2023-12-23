const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
const cors = require('cors');

//middlewares
app.use(cors());
app.use(express.json());
app.use('/public/uploads', express.static(path.join('public/uploads')));

//routes

const categoryRoutes = require('./routes/category');
const newsRoutes = require('./routes/news');
const authRoutes = require('./routes/auth');
const authorRoutes = require('./routes/author');

app.use(`${process.env.API}/categories`, categoryRoutes);
app.use(`${process.env.API}/news`, newsRoutes);
app.use(`${process.env.API}/auth`, authRoutes);
app.use(`${process.env.API}/authors`, authorRoutes);

module.exports = app;
