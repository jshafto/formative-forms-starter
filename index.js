const express = require("express");
const { body, validationResult } = require('express-validator');

const app = express();
const port = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");
const csrf = require("csurf");

app.set("view engine", "pug");
app.use(express.urlencoded());
app.use(cookieParser());
const csrfProtection = csrf({ cookie: true });

const formValidation = (req, res, next) => {
  const { firstName, lastName, email, password, confirmedPassword } = req.body;
  const errors = [];

  if(!firstName) errors.push("Please provide a first name.")
  if(!lastName) errors.push("Please provide a last name.")
  if(!email) errors.push("Please provide an email.")
  if(!password) errors.push("Please provide a password.")
  if(password !== confirmedPassword) errors.push("The provided values for the password and password confirmation fields did not match.")
  req.errors = errors;
  next()
}


const validator = [ formValidation,
  body('password').isLength({ min: 5 }).withMessage('must be at least 5 chars long'),
  body('password').matches(/\d/).withMessage('must contain a number'),
  body('email').isEmail().withMessage('must be an email address'),
]
const interestingValidator = [...validator,
  body('age').exists({checkFalsy:true}).withMessage('is required'),
  body('age').isInt({gt: 0, lt: 120}).withMessage('must be a valid age'),
  body('favoriteBeatle').exists({checkFalsy:true}).withMessage('is required'),
  body('favoriteBeatle').isIn(["John", "Paul", "George", "Ringo"]).withMessage('must be a real Beatle member')
];

app.get("/",(req, res) => {
  res.render('index', {users})
});

app.get("/create", csrfProtection,(req, res) => {
  res.render('create-normal', {csrfToken: req.csrfToken()})
});

app.post('/create',  validator, (req, res) => {
  const { firstName, lastName, email} = req.body;
  if (req.errors.length>0) {
    res.render('create-normal', {firstName, lastName, email, errors: req.errors});
    return;
  }
  users.push({
    id: users.length+1,
    firstName,
    lastName,
    email
  })

  res.redirect('/')


})

app.get("/create-interesting", csrfProtection, (req, res) => {
  res.render("create-interesting", {csrfToken: req.csrfToken()})
})

app.post('/create-interesting', interestingValidator ,(req, res) => {
  const { firstName, lastName, email, age, favoriteBeatle, iceCream} = req.body;
  let pwordErrs = validationResult(req)
  if (!pwordErrs.isEmpty()) req.errors.push(...pwordErrs.array().map(el=>`${el.param} ${el.msg}`))

  if (req.errors.length>0) {
    res.render('create-interesting', {firstName, lastName, email, age, favoriteBeatle, iceCream, errors: req.errors});
    return;
  }

  let likesIceCream = (iceCream) ? true : false;
  users.push({
    id: users.length+1,
    firstName,
    lastName,
    email,
    age,
    favoriteBeatle,
    likesIceCream
  })

  res.redirect('/')


});

const users = [
  {
    id: 1,
    firstName: "Jill",
    lastName: "Jack",
    email: "jill.jack@gmail.com"
  }
];

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
