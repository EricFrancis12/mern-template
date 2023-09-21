require('dotenv').config();

const fs = require('fs');
const path = require('path');

const cookieParser = require('cookie-parser');

const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use(express.static('public'));
app.use(express.static('app/public'));
app.use(express.static('app/build'));
app.use(express.urlencoded({ extended: true }));

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || process.env.MONGODB_URI_LOCAL)
    .then(() => console.log('Connected to DB'))
    .catch(err => console.error(`Error connecting to DB: ${err}`));



const routes = fs.readdirSync(path.resolve(__dirname, './backend/routes'));
routes.forEach(route => {
    const router = require(`./backend/routes/${route}/${route}`);
    app.use(`/${route}`, router);
});

app.get('/', (req, res) => {
    res.status(200).sendFile('./build/index.html', { root: './' });
});

app.get('/*', (req, res) => {
    res.status(200).sendFile('./build/index.html', { root: './' });
});



const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
