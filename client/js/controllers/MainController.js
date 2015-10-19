app.controller('MainController', function($scope, $http, $window) {
    $scope.userName = null;
    $scope.userLogged = false;
    $scope.users = [];
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
        var socketio = io.connect("http://utkk4a021056.trentondaniels.koding.io:8080");
        var msg = ": " + document.getElementById("message_input").value;
        var user = $scope.userName;
        socketio.emit("message_to_server", { message : msg, name : user});
        };
});