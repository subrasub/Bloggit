var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    methodOverride  = require("method-override")
    
//Configuration
mongoose.connect("mongodb://localhost/blog_app")
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride("_method"))

//SCHEMA 

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
})
var Blog = mongoose.model("Blog", blogSchema)

app.get("/", function(req, res){
    res.redirect("/blogs")
})

app.get("/blogs", function(req, res){
    // res.render("index")
    Blog.find({}, function(err, blogs){
        if(err)
            console.log(err)
        else{
            console.log("Works!")
            res.render("index", {blogs: blogs})
        }
    })
})

app.get("/blogs/new", function(req, res){
    res.render("new")
})

app.post("/blogs", function(req, res){
    Blog.create(req.body.blog, function(err, n_blog){
        if(err){
            res.redirect("new")
        }
        else{
            res.redirect("/blogs")
            console.log("new blog created: " + Date.now())
        }
    })
})


app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, blog){
        if(err)
            res.redirect("/blogs")
        else{
            res.render("edit", {blog: blog})
        }
    })
})

app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, blog){
        if(err)
            res.redirect("/blogs")
        else{
            res.render("show", {blog: blog})
        }
    })
})

app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blogfound){
        if(err)
            res.redirect("/blogs")
        else{
            res.redirect("/blogs/"+req.params.id)
        }
    })
})

app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err, blog){
        if(err)
            res.redirect("/blogs")
        else
            res.redirect("/blogs")
    })
})


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Blog App is running!")
})