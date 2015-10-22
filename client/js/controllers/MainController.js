app.controller('MainController', function($scope, $http, $window) {
    $scope.userName = null;
    $scope.userLogged = false;
    $scope.users = [];
    $scope.socketio = io.connect("ec2-54-148-77-110.us-west-2.compute.amazonaws.com:3000");
/* closeLogIn()
    Checks the REST client for existing user name,
    adds the user and hides the div if the name 
    is not taken.  If it does exist an alert will 
    pop up and the div will remain visible.
*/
    $scope.closeLogIn = function() {
        $http.get("addUser?q=" + $scope.userName)
        .success(function(response) {
            if (!response) {
                $window.alert("That Name Already Exists!");
            }
            else {
                $scope.users = response;
                $scope.userLogged = true;
            }
        });
    };
    
    
/* refreshUsers()
    Accesses the REST client and retrieves
    a list of current users.
*/
    $scope.refreshUsers = function() {
        $http.get("users")
        .success(function(response) {
            $scope.users = response;
        });
    };
    
/* sendMessage()
    sends a message and user name to the server side socket.
*/
     $scope.sendMessage = function() {
        //Will have to change URL to whatever is being used 
        var msg = ": " + document.getElementById("message_input").value;
        var user = $scope.userName;
        $scope.socketio.emit("message_to_server", { message : msg, name : user});
        document.getElementById("message_input").value = "";
        };
        
       
       
/* Client Side Socket
    Recieves a message from the server and adds it to the chat stream
*/ 
    $scope.socketio.on("message_to_client", function(data) {
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
});