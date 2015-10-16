var app = angular.module('CS201Chat', []);

/* Client Side Socket
    Recieves a message from the server and adds it to the chat stream
*/
//Will have to change URL to whatever is being used 
var socketio = io.connect("http://utkk4a021056.trentondaniels.koding.io:1337");
socketio.on("message_to_client", function(data) {
    document.getElementById("chatlog").innerHTML = ("<hr/>" + data['name'] +
    data['message'] + document.getElementById("chatlog").innerHTML);
});