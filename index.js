//REQUIRES
var express = require('express');
var bodyParser = require('body-parser');
var ejsLayouts = require('express-ejs-layouts');


//APP VARIABLES
app = express();
var db = require('./models'); //boilerplate


//SET/USE STATEMENTS
app.set('view engine', 'ejs'); //boilerplate
app.use(ejsLayouts); //boilerplate
app.use(bodyParser.urlencoded({extended: false})); //boilerplate


//ROUTES
//goes to home page of site
app.get('/',function(req,res){
  console.log("home querystring:", req.query);
  res.render('site/home');
});

//goes to all articles
app.get('/articles/index', function(req,res){
  db.news.findAll().then(function(articles){
    res.render('articles/index',{articles:articles});
  });
});

//goes to article submission page
app.get('/articles/new', function(req,res){
  res.render('articles/new');
});

//posts article to articles
app.post('/articles/new',function(req,res){
  console.log(req.body);
  db.news.create(req.body).then(function(article){
    res.redirect('index');
  });
});

app.get('/articles/show/:id', function(req,res){
  db.news.findById(req.params.id).then(function(article){
    res.render('articles/show',{article:article});
  });
});

app.get('/about', function(req,res){
  res.render('site/about');
});

app.get('/contact', function(req,res){
  res.render('site/contact');
});

app.get('/search', function(req,res){
  console.log("search querystring:", req.query);
  var q = req.query.search;

  console.log(q+'');
  console.log("got to search results ??dog");

  function isMatch(article,q){
    q = q.toLowerCase();
    console.log("match?", article.get('title'));
    // Wrong and bad. We must use .get() function
    // to access instance attributes.
    // var title = article.title.toLowerCase();
    // var content = article.body.toLowerCase();
    var title = article.get('title').toLowerCase();
    var content = article.get('body').toLowerCase();
    if(title.indexOf(q)>=0||content.indexOf(q)>=0){
      return true;
    }
    return false;
  }

  db.news.findAll().then(function(articles){
    var searchResults = [];

    //filter results
    for(var i=0; i<articles.length; i++){
      if(isMatch(articles[i],q)){
        searchResults.push(articles[i]);
      }
    }
    res.render('site/search',{searchResults:searchResults});
  });
});


//LISTEN
app.listen(3000); //boilerplate
