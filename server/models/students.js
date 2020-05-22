let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let studentSchema = new Schema({
  "sid": String,
  "spwd": String,
  "sname": String,
  "cidarr": Array
});

module.exports = mongoose.model('student', studentSchema);
