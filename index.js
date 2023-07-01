const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port=process.env.PORT || 4000;

//body parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
//body parser

//connect database
mongoose.connect("mongodb://localhost:27017/crud",{useNewUrlParser:true});
const db=mongoose.connection;
db.on('error', ()=>{console.log('error');});
db.once("open", ()=>{console.log('open');});

app.set("view engine","ejs"); 
app.use(express.static('public'));

//routing home route



const myuserSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: Number,
  });

app.get('/add', (req, res)=>{
    res.render('form');
});
  
const myuser = mongoose.model('User', myuserSchema);
app.post('/add', async (req, res) => {
    const adduser = new myuser({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone
    });
    try {
      const savedUser = await adduser.save();
      if(savedUser)res.redirect('/');
    } catch (error) {
      console.log('error in posting', error);
    }
  });
app.get("/",async(req,res)=>{

  myuser.find().then(user =>{
      // console.log(user);
    res.render('index',{mydata:user});
  }
  );
})

//update my data
app.get("/edit/:id", (req, res) => {
  myuser.findById(req.params.id).then(user => {
    res.render("update_form", { 
      updatedata: user
    });
  }).catch(error => {
    console.log('error in finding user by ID:', error);
    res.redirect('/');
  });
});


app.post('/update/:id',(req,res)=>{
  myuser.findByIdAndUpdate({_id:req.params.id},req.body).then(user =>{
    res.redirect('/');
  });
});

//delete item
app.get('/delete/:id',(req,res)=>{
  myuser.findByIdAndDelete({_id:req.params.id}).then(user=>{
    res.redirect('/'); 
  })
});


app.listen(port, ()=>{
    console.log('listening on port');
});