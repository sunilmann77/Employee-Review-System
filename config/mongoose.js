const mongoose = require('mongoose');

mongoose.connect('mongodb://0.0.0.0:27017/EmployeeReviewSystem_db01');

const db = mongoose.connection;

db.on('error,',console.error.bind(console,'Error connecting to mongodb'));

db.once('open', function() {
    console.log("Successfully connected to the database");
});

module.exports=db;

