const Message = require("../models/messages");
const { body, validationResult } = require("express-validator");

exports.homeGet = (req, res, next) => {
  Message.find()
    .sort({ date: -1 })
    .exec(function (err, messages) {
      if (err) {
        return next(err);
      }
      res.render("home", { messages: messages });
    });
};

exports.messageGet = (req, res, next) => {
  res.render("messageForm", { errors: [],title: '', message: '' });
};

exports.messagePost = [
  body("title")
    .trim()
    .isLength(5)
    .withMessage("Title must be at least five character"),
  body("message")
    .trim()
    .isLength(10)
    .withMessage("Message must be at least ten character"),
  async (req, res, next) => {
    const message = await new Message({
      username: req.user.username,
      title: req.body.title,
      message: req.body.message,
      date: new Date(),
    });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("messageForm", { errors: errors.array(), title: req.body.title, message: req.body.message });
    } else {
      message.save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    }
  },
];

exports.deleteMessage = (req, res, next) => {
  Message.findByIdAndDelete(req.body.id, function (err, docs) {
    if (err) {next(err)}
  })
  res.redirect('/')
}