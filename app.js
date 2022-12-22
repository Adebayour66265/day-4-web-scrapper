const express = require('express');
const app = express();
const getRoutes = require('./routes/getRoutes');

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));


app.use('/api', getRoutes)

const PORT = 3000;
app.listen(PORT, () => {
    console.log('App is Listing to PORT');
})