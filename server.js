const express = require("express")
const bodyparser = require("body-parser")
const session = require("express-session")
const cookieparser = require("cookie-parser")
const mongoose = require("mongoose")
const path = require('path')
const {User} = require("./user.js")
const {Poem} = require("./poem.js")
const {likedpoem} = require("./likedpoem.js")


const app = express()

mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost:27017/userss19", {
	useNewUrlParser : true
})

const urlencoder = bodyparser.urlencoded({
	extended:false
})

app.use(express.static(__dirname + "/public"))

app.use(session({
	secret : "secret name",
	name : "chocolate cookie",
	resave : true,
	saveUninitialized : true,
	cookie:{
		maxAge:1000*60*60*24*365
	}
}))
app.use(cookieparser())


// Handlebars
const exphbs  = require('express-handlebars');
app.engine( 'hbs', exphbs( {
    extname: '.hbs',
    defaultLayout: 'layout',
    layoutsDir: path.join(__dirname, "views/layouts/"),
    partialsDir: path.join(__dirname, 'views/partials')
  }));
app.set('view engine', '.hbs');



app.get("/", (req, res)=>{
	//read cookie
	//see preferred font size
    
	if(req.session.username){
        Poem.find({
            author : req.session.username
        }, (err,docs)=>{
		if(err){
			res.send(err)
		}else{
			console.log(docs)
			res.render("profile.hbs", {
                username:req.session.username,
                _id:req.session._id,
                fullname:req.session.fullname,
                info:req.session.info,
				poems:docs
			})
		}
		  })
//		res.render("home.hbs", {
//			username:req.session.username,
//			poems:docs
//		})
	}
	else{
		res.render("login.hbs")
	}
})

app.get("/home", (req, res)=>{
	//read cookie
	//see preferred font size
    
	if(req.session.username){
        Poem.find({}, (err,docs)=>{
		if(err){
			res.send(err)
		}else{
			console.log(docs)
			res.render("home.hbs", {
                username:req.session.username,
                _id:req.session._id,
				poems:docs
			})
		}
		  })

	}
	else{
		res.sendFile(__dirname + "/public/login.html")
	}
})

app.post("/login", urlencoder, (req, res)=>{
		 let username = req.body.un
		 let password = req.body.pw
		 
		// no need for username:username if same name 
		 User.findOne({
			 username,
			 password
		 }, (err, doc)=>{
			 if(err){
				 res.send(err)
			 }
			 else if(!doc){
				 res.send("User does not exist")
			 }
			 else{
				 console.log(doc)
				 req.session.username = doc.username
                 req.session._id = doc._id
                 req.session.fullname = doc.fullname
                 req.session.info = doc.info
				 res.redirect("/")
			 }
		 })
})

//if same property name and variable, no need to put us:us only us
app.post("/register", urlencoder, (req,res)=>{
	let username = req.body.un 
	let password = req.body.pw
	
	let user = new User({
		username,
		password
	})
	
	user.save().then((doc)=>{
		//if operation goes well
		console.log(doc)
		req.session.username = doc.username
		res.redirect("/")
	}, (err)=>{
		//if operation goes wrong
		res.send(err)
	})
})

//---------------------------------------------------------------------
app.get("/users", (req,res)=>{
	//load all data of all users
	console.log("GET /users")
	User.find({}, (err,docs)=>{
		if(err){
			res.send(err)
		}else{
			console.log(docs)
			res.render("admin.hbs", {
				users:docs
			})
		}
		  })
})

app.get("/poems", (req,res)=>{
	//load all data of all users
	console.log("GET /poems")
	Poem.find({}, (err,docs)=>{
		if(err){
			res.send(err)
		}else{
			console.log(docs)
			res.render("profile.hbs", {
				poems:docs
			})
		}
		  })
})



app.get("/edit", (req,res)=>{
    console.log("GET /id")
	Poem.findOne({
		_id : req.query.id
	}, (err,doc)=>{
		if(err){
			res.send(err)
		}else{
			console.log(doc)
			res.render("edit.hbs", {
				poem:doc,
                username:req.session.username
			})
		}
	})
})



app.get("/profile", (req,res)=>{
	//get the user to be edited (ID)
	Poem.find({
		author : req.session.username
	}, (err,docs)=>{
		if(err){
			res.send(err)
		}else{
			console.log("wew")
			console.log(req.session.username)
			res.render("profile.hbs", {
                username:req.session.username,
                _id:req.session._id,
                fullname:req.session.fullname,
                info:req.session.info,
				poems:docs
			})
		}
	})
})

app.get("/search", (req,res)=>{
    let titlesearch = req.query.searchval
	Poem.find({
		title : titlesearch
	}, (err,docs)=>{
		if(err){
			res.send(err)
		}else{
			console.log("wew")
			console.log(req.session.username)
			res.render("search.hbs", {
                username:req.session.username,
                _id:req.session._id,
				poems:docs
			})
		}
	})
})


app.get("/addpage", (req,res)=>{
	//
	res.render("add.hbs")
})

app.get("/compose", (req,res)=>{
	res.render("compose.hbs",{
        username:req.session.username
    })
    
})


app.post("/add", urlencoder, (req,res)=>{
	let username = req.body.un 
	let password = req.body.pw 
	
	let user = new User({
		username,
		password
	})
	
	user.save().then((doc)=>{
		res.redirect("/users")
	}, (err)=>{
		res.send(err)
	})
})

app.post("/addpoem", urlencoder, (req,res)=>{
	let title = req.body.title 
	let content = req.body.poem
    let author = req.session.username
	
	let poem = new Poem({
		title,
		content,
        author:author
	})
	
	poem.save().then((doc)=>{
		res.redirect("/profile")
	}, (err)=>{
		res.send(err)
	})
})

app.get("/addlikes", (req,res)=>{ 
	Poem.find({
		_id : req.query.id
	}, (err,doc)=>{
		if(err){
			res.send(err)
		}else{
			let liked = new likedpoem({
                owner: req.session.username,
                poem:doc
            })
            liked.save().then((doc)=>{
                console.log("LIKED!!!")
            })
            }
	})
})

app.get("/info", (req,res)=>{
    console.log("GET /id")
	User.findOne({
		username : req.session.username
	}, (err,doc)=>{
		if(err){
			res.send(err)
		}else{
			console.log(doc)
			res.render("info.hbs", {
				user:doc
			})
		}
	})
})

app.get("/logout", (req,res)=>{
    res.render("login.hbs")
})


app.post("/delete", urlencoder, (req,res)=>{
	console.log("POST /delete")
	console.log(req.body.id)
	Poem.deleteOne({
		_id:req.body.id
	},(err, docs)=>{
		if(err){
			res.send(err)
		}else{
			res.redirect("/home")
		}
	})
})

app.post("/update", urlencoder, (req,res)=>{
	//UPDATE into USERS set (un, pw) values (?,?)
	//WHERE _id:id
	console.log("POST /update")
	Poem.update({
		_id:req.query.id 
	},{
		title:req.body.title,
		content:req.body.content
	}, (err, doc)=>{
		if(err){
			res.send(err)
		}else{
			res.redirect("/")
		}
	})
})

app.post("/updateinfo", urlencoder, (req,res)=>{
	//UPDATE into USERS set (un, pw) values (?,?)
	//WHERE _id:id
	console.log("POST /update")
	User.update({
		_id:req.query.id 
	},{
		fullname:req.body.fullname,
		info:req.body.content
	}, (err, doc)=>{
		if(err){
			res.send(err)
		}else{
			res.redirect("/")
		}
	})
})

//---------------------------------------------------------------------

app.post("/preferences", urlencoder, (req,res)=>{
	let fs = req.body.fontsize
	res.cookie("font size", fs, {
		maxAge:1000*60*60*24*365
	})
	res.redirect("/")
})
		
app.listen(9000, ()=>{
		console.log("NOW LISTENING")
		})