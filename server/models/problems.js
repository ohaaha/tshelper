let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let problemSchema = new Schema({
  "sid": String,
  "question": String,
  "answer": Array,
  "time": String
});

module.exports = mongoose.model('problem', problemSchema);
