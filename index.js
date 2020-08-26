const express = require("express");

const app = express();
const port = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");
const csrf = require("csurf");

app.set("view engine", "pug");
app.use(express.urlencoded());
app.use(cookieParser());
const csrfProtection = csrf({ cookie: true });

app.get("/", (req, res) => {
  res.render('index', {users})
});

app.get("/create", (req, res) => {
  res.render('create-normal')
})

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
