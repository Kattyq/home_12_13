let http = require('http'),
    static = require('node-static'),
    file = new static.Server('.')

let port = '3000',
    host = '127.0.0.1';

http.createServer(function(request, response) {
   request.addListener('end', function() {
       file.serve(request,response);
   }).resume();

}).listen(port, host, function() {
    console.log('Server running at http://' + host + ':' + port);
});

