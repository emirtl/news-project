const app = require('./app');
const mongoose = require('mongoose');
const cors = require('cors');

// cors

var corsOptions = {
    origin: 'https://eclipse-news.netlify.app', // ONLY allow your Netlify domain
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
    credentials: true, // If your frontend sends cookies or authorization headers, set this to true
};

app.use(cors(corsOptions));

mongoose
    .connect(
        `mongodb+srv://${process.env.MONGOOSE_USER}:${process.env.MONGOOSE_PASSWORD}@master.xebze3l.mongodb.net/${process.env.MONGOOSE_DATABSE_NAME}`
    )
    .then(() => console.log('connected to db'))
    .catch((e) => console.log(e));

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
    console.log('connected to port 9000');
});
