const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const fs = require('fs');
const csso = require('csso');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');

const PORT = 3000;

app.use(bodyParser.urlencoded({extended: true}));
 
// Static Middleware
app.use(express.static(path.join(__dirname + '/public')));

app.engine('.html', require('ejs').__express);

//

app.use('/css', (req, res) => {
    const filePath = __dirname + req.url;
    if (filePath.endsWith('.css')) {
      const css = fs.readFileSync(filePath, 'utf8');
      const minifiedCss = csso.minify(css).css;
      res.header('Content-Type', 'text/css');
      res.send(minifiedCss);
    } else {
    }
  });


 
app.get('/', function (req, res) {
    res.render('pages/index');
});

// app.get('/js/index.js', function(req, res) {
//     res.set('Content-Type', 'text/javascript');
//     res.sendFile(path.join(__dirname, 'js', 'index.js'));
// });
  
app.get("/contact", function(req, res){
    res.render("pages/contact");
});

app.get("/games", function(req, res){
    res.render("pages/games");
});
// 


app.get("/about", function(req, res){
    res.render("pages/about");
});

app.get("/privacy", function(rew, res){
    res.render("pages/privacy");
});

app.get("/nft", function(req, res){
    res.render("pages/nft");
});


app.use(function(req, res, next) {
    res.status(404);
    res.render('pages/404', { title: '404 Page Not Found' });
  });
  
  
 
app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});
