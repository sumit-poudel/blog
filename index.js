import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";

const port = 3000;
const _dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const d = new Date();

let year; let ok;
let postArray = [];

app.use(express.urlencoded({ extended: true }));
app.use(middle);
app.use(express.static("public"));
function middle(req, res, next) {
  year = d.getFullYear();

  next();
}

app.get("/", (req, res) => {
  res.render(_dirname + "/views/index.ejs", {
    year: year,
    postArray,
  });
});
app.get("/ed", (req, res) => {
  res.render(_dirname + "/views/ed.ejs", {
    year: year,
    postArray,
    act:"update"
  });
});
app.get("/create", (req, res) => {
  res.render(_dirname + "/views/create.ejs", {
    title:"<h3>Write a blog for page</h3>",
    year: year,
    act:"submit",
    key:"required"
  });
});
app.post("/edit", (req, res) => {
      ok=req.body.postId;
  res.render(_dirname + "/views/create.ejs", {
    title:"<h3>Edit blog(empty box for nochange)</h3>",
    year: year,
    act:"update",
    key:" "
  });
});
app.post("/update",(req,res)=>{
  console.log(req.body.author);
  console.log(req.body.blog);
  let index = postArray.findIndex((post) => {
    return ok == post.id;});
  console.log(`ayeko post id ${index}`);
  if(index!=-1){
    postArray[index].id=index;
    postArray[index].blog=req.body.blog.trim()==""?postArray[index].blog:req.body.blog;
    postArray[index].author=req.body.author.trim()==""?postArray[index].author:req.body.author;
  }
  res.redirect("/");
})

app.post("/submit", (req, res) => {
  console.log(req.body.author);
  console.log(req.body.blog);
  let time = Date.now();
  console.log(`baneko post id ${time}`)
  postArray.push({
    id: time,
    blog: req.body.blog,
    author: req.body.author,
  });
  res.redirect("/");
});
app.post("/delete", (req, res) => {
  console.log("delete called" + req.body.postId);
  let index = postArray.findIndex((post) => {
    return req.body.postId == post.id;
  });
  postArray.splice(index, 1);
  res.redirect("/");
});

app.listen(port, (error) => {
  if (error) console.log("Error on starting the server ");
  console.log("server started at port" + port);
});
