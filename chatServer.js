var users = [];
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
        var add = urlObj.query["q"];
        var nameExists = false;
        for(i = 0; i < users.length; i++) {
            if (add === users[i]) {
                nameExists = true;
                break;
            }
        }
        if (!nameExists) {
            users.push(add);
            console.log("\tNew User Added");
            console.log("\t\tUsers: " + JSON.stringify(users) + "\n");
            response.end(JSON.stringify(users));
        }
        else {
            console.log("\tUser name rejected.\n")
            response.end(false);
        }
    }
    
/* GET: /users
    returns the array of users
*/
    else if (urlObj.pathname === '/users') {
        response.writeHead(200);
        console.log("hit endpoint '/users'")
        console.log("\tUsers: " + JSON.stringify(users) + "\n");
        response.end(JSON.stringify(users));
    }
    
/* Pseudo-DELETE (GET): /deleteUser
    deletes a user from the list if they
    leave the page (close tab, refresh, etc)
*/
    else if (urlObj.pathname === '/deleteUser') {
        var deleteUser = urlObj.query["q"];
        response.writeHead(200);
        console.log("hit endpoint '/deleteUser'");
        console.log("\tDeleting: " + deleteUser + "\n");
        for(var i = 0; i < users.length; i++) {
            if (deleteUser === users[i]) {
                users.splice(i, 1);
                break;
            }
        }
        response.end();
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
}).listen(8080);
 



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