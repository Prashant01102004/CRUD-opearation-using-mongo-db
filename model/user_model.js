const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
});

const myuser = mongoose.model('User', userSchema);
module.exports = myuser;