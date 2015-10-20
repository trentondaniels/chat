var app = angular.module('CS201Chat', []);

/* Client Side Socket
    Recieves a message from the server and adds it to the chat stream
*/
//Will have to change URL to whatever is being used 
var socketio = io.connect("http://utkk4a021056.trentondaniels.koding.io:8080");
socketio.on("message_to_client", function(data) {
    var name = document.getElementById("name").textContent;
    document.getElementById("chatlog").innerHTML = (document.getElementById("chatlog").innerHTML) +
    "<div class='row'><hr/>" + "<span class='chatBubble' id='" + data['idNum'] +"'>" + "<strong>" + 
    data['name'] + "</strong>" + data['message'] + "</span></div>";
    document.getElementById(data['idNum']).style.padding = '10px'
    document.getElementById(data['idNum']).style.color = 'white'
    document.getElementById(data['idNum']).style.borderRadius = '25px'
    //Color codes the comments, blue if from that user, red otherwise
    if (name === data['name']) {
         document.getElementById(data['idNum']).style.backgroundColor = 'blue'
         document.getElementById(data['idNum']).style.float = 'right';
    }
    else {
        document.getElementById(data['idNum']).style.backgroundColor = 'red';
        document.getElementById(data['idNum']).style.float = 'left';
    }
    document.getElementById("chatlog").scrollTop = document.getElementById("chatlog").scrollHeight;
});
