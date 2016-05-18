var express = require('express');
var app = express();
var request = require('request');

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

// set the home page route
app.get('/', function(req, res) {
    var search = req.query.q || "api",
        page = req.query.page || 1,
        date = new Date(req.query.begin_date || '1964-09-23');
    var month = date.getMonth();
    var sdate = date.getDate();
    var begin_date = date.getFullYear() + ((month < 10) ? "0" : "") + month + ((sdate < 10) ? "0" : "") + sdate;
    console.log(begin_date)
    request.get({
        url: "https://api.nytimes.com/svc/search/v2/articlesearch.json",
        qs: {
            'api-key': "YOUR KEY GOES HERE",
            'q': search,
            'page': page,
            'begin_date': begin_date,
            'sort': 'newest'
        },
    }, function(err, response, body) {
        body = JSON.parse(body);
        // ejs render automatically looks in the views folder
        res.render('index', {
            "found": JSON.stringify(body),
            "q": search,
            "hits": body.response.meta.hits,
            "begin_date": begin_date,
            "page": page
        });
    })


});

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
