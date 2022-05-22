const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  username: {type: String, required: true},
  title: {type: String, required: true},
  message: {type: String, required: true},
  date: {type: Date, default: Date.now}
})

MessageSchema.virtual('date_formatted').get(function() {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_SHORT);
})

module.exports = mongoose.model('Message', MessageSchema);