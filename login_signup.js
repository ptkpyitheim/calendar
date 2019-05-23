

document.getElementById("loginBtn").addEventListener("click", loginAjax, false); // Bind the AJAX call to button click


document.getElementById("loginAsGuest").addEventListener("click", function() {
    localStorage.removeItem("theuser");
}, false); 



function loginAjax(event) {
    const username = document.getElementById("username").value; // Get the username from the form
    const password = document.getElementById("password").value; // Get the password from the form


    // Make a URL-encoded string for passing POST data:
    const data = { 'username': username, 'password': password };

    fetch("login_ajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(
            function name(data) {
                if(data.success === true) {
                    document.getElementById('isSuccess').innerHTML = "Logged in as: " + data.username;

                    //Source: https://stackoverflow.com/questions/2932782/global-variables-in-javascript-across-multiple-files
                    localStorage.setItem('theuser',data.username);

                    window.location.href = "calendar.html";
                }
                else {
                    document.getElementById('isSuccess').innerHTML = "You were not logged in. " + data.message;
                }
                //Empty input field after entering information.
                document.getElementById("username").value = "";
                document.getElementById("password").value = "";
            }
            
        );
}


//Toggling sign up button
$("#signupForm").toggle();
document.getElementById("signupToggle").addEventListener("click", function(event) {$("#signupForm").toggle();}, false); // Bind the AJAX call to button click


//Ajax sign up
document.getElementById("signupUser").addEventListener("click", signupAjax, false); // Bind the AJAX call to button click

function signupAjax(event) {
    const new_user = document.getElementById("new-user").value; 
    const new_password = document.getElementById("new-password").value;

    // Make a URL-encoded string for passing POST data:
    const data = { 'username': new_user, 'password': new_password };

    fetch("signup.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(
            function name(data) {
                if(data.success === true) {
                    console.log("consoling log Sign Up successful");
                }
                document.getElementById('isSuccess').innerHTML = data.message;

                //Empty input field after entering information.
                document.getElementById("new-user").value = "";
                document.getElementById("new-password").value = "";
                $("#signupForm").toggle();

            }
            
        );
}



