const mongoose = require("mongoose");

mongoose.connect('mongodb://127.0.0.1/myDataBase');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'error when connecting to db'));

db.once('open', function(){
    console.log('Successfully connected to db');
});