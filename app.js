const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
const cors = require('cors');

// cors

var corsOptions = {
    origin: ['http://localhost:4200/', 'https://eclipse-news.netlify.app/'],
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

//middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use('/public/uploads', express.static(path.join('public/uploads')));

//routes

const categoryRoutes = require('./routes/category');
const newsRoutes = require('./routes/news');
const authRoutes = require('./routes/auth');
const authorRoutes = require('./routes/author');
const opinionsRoutes = require('./routes/opinions');
const liveUpdatesRoutes = require('./routes/liveUpdates');

app.use(`${process.env.API}/categories`, categoryRoutes);
app.use(`${process.env.API}/news`, newsRoutes);
app.use(`${process.env.API}/auth`, authRoutes);
app.use(`${process.env.API}/authors`, authorRoutes);
app.use(`${process.env.API}/opinions`, opinionsRoutes);
app.use(`${process.env.API}/liveUpdates`, liveUpdatesRoutes);

app.use((err, req, res, next) => {
    // Handle the error
    res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;
