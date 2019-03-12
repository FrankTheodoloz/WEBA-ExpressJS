var createError = require('http-errors');
var express = require('express');
var path = require('path');
var util = require("util");
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var resource = require("express-resource");
// var http = require("http");

//routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//mise en forme du html
app.locals.pretty = true;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//favicon
var serveFavicon = require("serve-favicon");
app.use(serveFavicon("public/favicon.png"));

//all methods
app.all("/admin", function (req, res, next) {
    res.setHeader("X-All", "Tous");
    next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

var methodOverride = require("method-override");
//method-override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method;
        delete req.body._method;
        return method
    }
}));


//REST routes
app.resource("clients", require("./routes/clients.js"));

//put on /admin (method-override)
app.put("/admin", function (req, res) {
    res.end("<h1>Méthode PUT sur Admin</h1>")

});

//routes list
app.get("/admin", function (req, res) {
    var html = "<pre>";
    app._router.stack.forEach(function (r, i) {
        // if (r.path === "/users") {
        //     delete app._router.stack.get[i]
        // }else
        if (r.route || r.name === 'router') {
            html += util.inspect(r.route) + "<br/>"
        }
    });
    html += "</pre>";
    res.end(html);
});

//route RegEx
app.get(/abcd*e/, function (req, res, next) {
    if (req.url === "/abcddde") next();
    var html = "<p>L'url est de la forme :</p>";
    html += "<li>/abce</li>";
    html += "<li>/abcde</li>";
    html += "<li>mais pas /abcdde</li>";
    html += "<li>/abcdddde</li>";
    html += "</ul>";
    res.end(html);
});
app.get("/abcddde", function (req, res) {
    res.end(req.url);
});

// test routes
app.get("/test", function getTest1(req, res, next) {
        console.log("get1");
        next();
        console.log("get1 fin");
    },
    function getTest2(req, res, next) {
        console.log("get2");
        next("route"); //va à la route suivante
        console.log("get2 fin");
    },
    function getTest3(req, res, next) { //ignorée
        console.log("get3");
        next();
        console.log("get3 fin");
    });

app.get("/test", function getTest4(req, res) {
    console.log("get4");
    res.send("<h1>get4</h1>");
    console.log("get4 fin");
});
app.all("/test", function (req, res) {
    res.writeHead(404);
    res.end("POST /test1 : Erreur 404");
});
app.all("/test2", function (req, res) {
    res.status(404);
    res.end("NEW /test2 : Erreur 404");
});

//test header
app.get("/testheader1", function (req, res) {
    // res.setHeader("Content-type", "text/html; charset=utf8");
    res.set({"X-name": "Value"});
    res.send("<h1>é</h1>"); //default html et utf8
});
app.get("/testheader2", function (req, res) {
    // res.setHeader("Content-type", "text/html; charset=utf8");
    res.set({"X-name": "Value"});
    res.end("<h1>é</h1>");
});
app.get("/testheader3", function (req, res) {
    res.set({"Content-type": "text/html; charset=utf8", "X-name": "Value"});
    res.end("<h1>é</h1>");
});
app.get("/testheader4", function (req, res) {
    res.setHeader("Content-type", "text/plain; charset=utf8");
    res.end("<h1>é</h1>");
});
app.get("/testJson1", function (req, res) {
    res.charset = "utf8";
    res.json({Nom: "Théodoloz"});
});
app.get("/testJson2", function (req, res) {
    res.setHeader("Content-type", "application/json; charset=utf8");
    res.end(JSON.stringify({Nom: "Théodoloz"}));
});
app.get("/testStatic", function (req, res) {

});

//tests template pug
app.get("/tmpl", function (req, res) {
    app.set("infos", {
        titre: "To do list",
        bottom: "Revenir à la page d'accueil"
    });
    app.render("templates.pug", {
        points: [
            {no: "1", detail: "Acheter du pain"},
            {no: "2", detail: "Sortir le chien"},
            {no: "3", detail: "Se coucher tôt"}
        ]
    }, function (err, html) {
        console.log("test template " + html);
        if (err) {
            console.log(err)
        }
        html = html.replace("pain", "lait");
        res.send(html);
    });

});

//Route params avec app.param
app.param("id", function (req, res, next, id) {
    console.log("Valeur de param id avec app.params :" + id);
    console.log("Egalement accessible dans req.params : " + req.params.id);
    if (!id.match(/^\d+$/)) next(new Error("id doit être un entier"));
    else next();
});

//tests template EJS (default)
app.get("/nombres", function (req, res) {
    res.render("nombres");
});

app.get("/fournisseurs", function (req, res) {
    res.render("fournisseurs", {
        titre: "Liste des fournisseurs",
        fournisseurs: [
            {nom: "1000Ordi", adresse: "Rue Jacques-Grosselin 13, 1227 Carouge"},
            {nom: "Prodimex", adresse: "Rue Antoine-Jolivet 7, 1227 Carouge"}
        ]
    })
});

//Route params (? = optionnal)
app.get("/testparam/:id?", function (req, res, next) {
    res.end("Valeur de :id : " + req.params.id);
});

//catch erreur route
/*
app.all(/.*./, function(req,res){
    res.writeHead(404);
    res.end("Erreur 404 perso" + req.url);
});
*/

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// console.log(app._router.stack);

module.exports = app;
