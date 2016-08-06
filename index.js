var express = require('express');
var app = express();

var apiBase = 'https://young-hamlet-85537.herokuapp.com'

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
   response.send('Hello World!');
});



var proxy = require('express-http-proxy');
app.use('/proxy', proxy(apiBase));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});