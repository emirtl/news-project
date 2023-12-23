const app = require('./app');
const mongoose = require('mongoose');

mongoose
    .connect(
        `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@master.xebze3l.mongodb.net/${process.env.DB_NAME}`
    )
    .then(() => console.log('connected to db'))
    .catch((e) => console.log(e));

const PORT = process.env.PORT | 9000;
app.listen(PORT, () => {
    console.log('connected to port 9000');
});
