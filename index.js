const express = require("express");

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

app.get("/",(req, res) => {
  res.render('index', {users})
});

app.get("/create", csrfProtection,(req, res) => {
  res.render('create-normal', {csrfToken: req.csrfToken()})
});

app.post('/create', formValidation,(req, res) => {
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

app.post('/create-interesting', formValidation,(req, res) => {
  const { firstName, lastName, email, age, favoriteBeatle, iceCream} = req.body;
  if (!age) req.errors.push("age is required");
  if (!parseInt(age, 10) || parseInt(age, 10)<0 || parseInt(age, 10)>120) req.errors.push('age must be a valid age');
  if (!favoriteBeatle) req.errors.push("favoriteBeatle is required")
  if (favoriteBeatle==="Scooby-Doo") req.errors.push("favoriteBeatle must be a real Beatle member")


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
