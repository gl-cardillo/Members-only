const User = require("../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { body, validationResult } = require("express-validator");

exports.singUpGet = (req, res, next) => {
  res.render("signupForm", { errors: [], username: "" });
};

exports.signUpPost = [
  body("username")
    .trim()
    .isLength(2)
    .withMessage("Username must be at least two character"),
  body("password")
    .trim()
    .isLength(6)
    .withMessage("Password must be at least 6 character"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
  async (req, res, next) => {
    const userExists = await User.find({ username: req.body.username });
    if (userExists.length > 0) {
      res.render("signupForm", { errors: [{ msg: "User already exists" }] });
      return;
    }
    const password = await bcrypt.hash(req.body.password, 10);
    const user = await new User({
      username: req.body.username,
      password: password,
      isMember: false,
      isAdmin: false
    });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("signupForm", { errors: errors.array()});
    } else {
      user.save((err) => {
        if (err) {
          return next(err);
        }
        passport.authenticate("local", {
          successRedirect: "/",
          failureRedirect: "/signup",
          failureFlash: true,
        })(req, res, next);
      });
    }
  },
];

exports.loginGet = (req, res, next) => {
  res.render("loginForm", { errors: []});
};

exports.loginPost = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
};

exports.logout = (req, res, next) => {
  req.logout();
  res.redirect("/");
};
exports.becomeMemberGet = (req, res, next) => {
  res.render("member", {error : false});
};

exports.becomeMemberPost = (req, res, next) => {
  if (req.body.passcode === process.env.MEMBER_PASSCODE) {
    User.findOneAndUpdate(
      { username: req.user.username },
      { isMember: true },
      function (err) {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      }
    );
  } else {
          res.render("member", {error: "Wrong passcode"});  
  }
};

exports.becomeAdminGet = (req, res, next) => {
  res.render("admin", {error : false});
};

exports.becomeAdminPost = (req, res, next) => {
  if (req.body.passcode === process.env.ADMIN_PASSCODE) {
    User.findOneAndUpdate(
      { username: req.user.username },
      { isMember: true, isAdmin: true },
      function (err) {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      }
    );
  } else {
    res.render("admin", {error: "Wrong passcode"});  
  }
};

exports.errorGet = (req, res, next) => {
  res.render("error");
};