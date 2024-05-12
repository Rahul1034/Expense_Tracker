const express = require("express")
const app=express()
const path=require("path")
const hbs=require("hbs")
const collection=require("./mongodb")
const bodyParser = require('body-parser');
const { constants } = require("buffer")
const tempelatePath = path.join(__dirname,'../tempelates')
app.use(express.static(path.join(__dirname, '../src')));
app.use(express.static(path.join(__dirname, '../tempelates')));

app.use(express.json())
app.set("view engine","hbs")
app.set("views", tempelatePath)
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'finance.html'));
});

app.get('/login', (req, res) => {
  res.render('login');
});
app.get("/signup",(req,res)=>{
    res.render("signup")
});

app.post("/signup",async (req,res)=>{
  const data = {
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
    confirm_password: req.body.confirm_password
  };

  let message;

  if (!data.name || !data.email || !data.password || !data.confirm_password) {
    message = "All fields are required.";
    res.render('signup', { message });
  } else if (data.password !== data.confirm_password) {
    message = "Passwords do not match.";
    res.render('signup', { message });
  } else {
    const existingUser = await collection.findOne({ email: data.email });
    if (existingUser) {
      message = "Email already exists!";
      res.render('signup', { message });
    } else {
      await collection.insertMany(data);
      res.render('home');
    }
  }

});

app.post("/login", async (req, res) => {
    try {
      const check = await collection.findOne({ email: req.body.email });
  
      if (check) {

        if (check.password === req.body.password) {
          res.redirect("http://localhost:3001");
        } else {
          res.send("Wrong Password");
        }
      } else {
        res.send("Wrong Details");
      }
    } catch (error) {
      console.log(error);
      res.send("Error Occurred");
    }
  });
  

app.listen(3000,()=>{
    console.log("port connected");
})