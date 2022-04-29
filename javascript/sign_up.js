function myFunction() {
  var x = document.getElementById("password");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}

// Regular expressions to validate the strength of the password.
function checkPassword(str) {
  var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/;
  return re.test(str);
}

function validate() {
  // Get name value
  if (document.sign_up.name.value === "") {
    alert("Please provide your name!");
    document.sign_up.Name.focus();
    return false;
  }

  // Validate email address
  if (document.sign_up.email.value == " ") {
    alert("Please provide your Email!");
    document.sign_up.EMail.focus();
    return false;
  }

  // Password verification.
  if (
    document.sign_up.password.value <=
    " && sign_up.password.value == sign_up.confirm_password.value"
  ) {
    if (!checkPassword(sign_up.password.value)) {
      alert(
        "The password you have entered is not valid it should have at least one number, one lowercase and one uppercase letter numbers or the underscore"
      );
      sign_up.password.focus();
      return false;
    }
  } else {
    alert(
      "Error: Please check that you've entered and confirmed your password!"
    );
    sign_up.password.focus();
    return false;
  }
}
