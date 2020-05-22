let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let projectSchema = new Schema({
  "tid": String,
  "sid": Array,
  "name": String,
  "require": String,
  "tel": String,
  "time": String,
  "last_id": String,
  "limit": String
});

module.exports = mongoose.model('project', projectSchema);
