var users = [];
var namesOnly = [];
var http = require('http');
var fs = require('fs');
var url = require('url');
var ROOT_DIR = 'client';
var id = 0;

var chatRoom = http.createServer(function (request, response) {
    var urlObj = url.parse(request.url, true, false);
/* Pseudo-POST (Really it's a GET): /addUser
    takes the query "q" value and checks if it exists in the
    users array.  If it does it returns the array, if not it
    returns false.
*/
    if (urlObj.pathname === '/addUser') {
        response.writeHead(200);
        console.log("hit endpoint '/addUser'")
        var addUser = urlObj.query["q"];
        var addPassword = urlObj.query["p"];
        var nameExists = false;
        for(i = 0; i < users.length; i++) {
            if (addUser === users[i].name) {
                nameExists = true;
                break;
            }
        }
        if (!nameExists) {
            users.push({'name': addUser, 'password': addPassword});
            namesOnly.push(addUser)
            console.log("\tNew User Added");
            console.log("\t\tUsers: " + JSON.stringify(users) + "\n");
            response.end(JSON.stringify(namesOnly));
        }
        else if (nameExists) {
            console.log("\tUser name rejected.\n")
            response.end(false);
        }
    }
    /* GET: /login
        returns true if valid name and password
        false otherwise.
    */
    else if (urlObj.pathname === '/login') {
        response.writeHead(200);
        console.log("hit endpoint '/login'");
        var checkUser = urlObj.query["q"];
        var checkPassword = urlObj.query["p"];
        var validAuth = "false";
        for (i = 0; i < users.length; i++) {
            if (checkUser === users[i].name && checkPassword === users[i].password) {
                validAuth = "true";
                break;
            }
        }
        response.end(validAuth);
    }
    
/* GET: /users
    returns the array of users
*/
    else if (urlObj.pathname === '/users') {
        response.writeHead(200);
        console.log("hit endpoint '/users'")
        console.log("\tUsers: " + JSON.stringify(namesOnly) + "\n");
        response.end(JSON.stringify(namesOnly));
    }
    
/* Default
    Serves files from the client folder
*/
    else {
        fs.readFile(ROOT_DIR + urlObj.pathname, function (err,data) {
            if (err) {
                response.writeHead(404);
                response.end(JSON.stringify(err));
                return;
            }
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(data);
            response.end();
        });
    }
}).listen(3000);
 



/* Server-Side Socket
    It receives a message and name from a client and returns it to all
    active clients.
*/
var io = require('socket.io').listen(chatRoom);
io.sockets.on('connection', function(socket) {
    socket.on('message_to_server', function(data) {
        console.log(data);
        io.sockets.emit("message_to_client",{ message: data["message"], name: data["name"], idNum: id});
        id++;
    });
});