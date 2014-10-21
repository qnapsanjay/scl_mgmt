myApp.controller("appCtrl", function($scope) {
    $scope.login_error = "";
    $scope.login = {};
    $scope.forgotpassword = {};
    $scope.signup = {};
    $scope.changepassword = {};
    $scope.change_password = function(changepassword) {
        $scope.changepassword = changepassword;
        $.ajax({
            url: $("#host_name").val() + "users/reset",
            type: 'POST',
            data: $scope.changepassword,
            dataType: 'json',
            success: function(data) {
                if (data.status == "success") {
                } else {
                    $scope.login_error = data.message;
                }
            },
            error: function(error) {
                $scope.login_error = error;
            }
        });
    };
    $scope.show_change_password_form = function() {
        $('#signup').hide();
        $('#forgotpassword').hide();
        $('#change-password').show();
    };

    $scope.show_signup_form = function() {
        $("#signup").dialog({
            title: false,
            modal: false,
            resizable: false,
            width: 400
        });
        $('#signup').show();
        $('#forgotpassword').hide();
        $('#change-password').hide();
    };
    $scope.show_login_form = function() {
        $('#signup').hide();
        $('#forgotpassword').hide();
        $('#change-password').hide();
    };
    $scope.show_forgot_pass_form = function() {
        $("#forgotpassword").dialog({
            title: false,
            modal: false,
            resizable: false,
            width: 400
        });
        $('#signup').hide();
        $('#forgotpassword').show();
        $('#change-password').hide();
    };
    $scope.do_login = function(login) {
        $scope.login = login;
        $scope.login_error = "";
        if ($scope.login.username == undefined || $scope.login.username == "") {
            $scope.login_error = "Username or Email required";
            return false;
        }
        if ($scope.login.password == undefined || $scope.login.password == "") {
            $scope.login_error = "Password required";
            return false;
        }

        $.ajax({
            url: $("#host_name").val() + "auth/login",
            type: 'POST',
            data: $scope.login,
            dataType: 'json',
            success: function(data) {
                if (data.status == "success") {
                    window.location.href = document.referrer;
                } else {
                    $scope.login_error = data.message;
                    if (!$scope.$$phase)
                        $scope.$apply();
                }
            },
            error: function(error) {
                $scope.login_error = error;
            }
        });
    };

    $scope.send_forgot_password_link = function(forgotpassword) {
        $scope.forgotpassword = forgotpassword;
        if ($scope.forgotpassword.email != "^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$") {
            $scope.login_error = "Enter a valid Username";
            return false;
        }
        if ($scope.forgotpassword.email == undefined || $scope.forgotpassword.email == "") {
            $scope.login_error = "Email is required";
            return false;
        }

        $.ajax({
            url: $("#host_name").val() + "auth/forgot_password",
            type: 'POST',
            data: $scope.forgotpassword,
            dataType: 'json',
            success: function(data) {
                if (data.status == "success") {
                    $('#login_form').dialog('close');
                } else {
                    $scope.login_error = data.message;
                    if (!$scope.$$phase)
                        $scope.$apply();
                }
            },
            error: function(error) {
                $scope.login_error = error;
                if (!$scope.$$phase)
                    $scope.$apply();
            }
        });
    };
    $('#birth_date').datetimepicker({
        changeMonth: true,
        changeYear: true,
        timeFormat: 'hh:mm:ss',
        dateFormat: 'yy-mm-dd',
        maxDate: 0
    });
    $('#edit_birthdate').datetimepicker({
        changeMonth: true,
        changeYear: true,
        timeFormat: 'hh:mm:ss',
        dateFormat: 'yy-mm-dd',
        maxDate: 0
    });

    $scope.do_signup = function(signup) {
        $scope.signup = signup;

        if ($scope.signup.first_name == undefined || $scope.signup.first_name == "") {
            $scope.login_error = "First name is required";
            return false;
        }
        if ($scope.signup.last_name == undefined || $scope.signup.last_name == "") {
            $scope.login_error = "Last name is required";
            return false;
        }
        if ($scope.signup.gender == undefined || $scope.signup.gender == "") {
            $scope.login_error = "Gender not selected";
            return false;
        }
        if ($scope.signup.email == undefined || $scope.signup.email == "") {
            $scope.login_error = "Email is required";
            return false;
        }
        if ($scope.signup.email == "/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/") {
            $scope.login_error = "Enter a valid Username";
            return false;
        }
        if ($scope.signup.mobile == undefined || $scope.signup.mobile == "") {
            $scope.login_error = "Mobile is required";
            return false;
        }
        if ($scope.signup.spassword == undefined || $scope.signup.spassword == "") {
            $scope.login_error = "Password is required";
            return false;
        }
        if ($scope.signup.cpassword == undefined || $scope.signup.cpassword == "") {
            $scope.login_error = "Confirm password required";
            return false;
        }
        if ($scope.signup.cpassword != $scope.signup.spassword) {
            $scope.login_error = "Password and confirm password not match";
            return false;
        }
        if ($scope.signup.birth_date == undefined || $scope.signup.birth_date == "") {
            $scope.login_error = "Birth date is required";
            return false;
        }
        if ($scope.signup.birth_place == undefined || $scope.signup.birth_place == "") {
            $scope.login_error = "Birth place is required";
            return false;
        }
        if ($scope.signup.termsandcond == undefined || $scope.signup.termsandcond == "") {
            $scope.login_error = "Terms and conditions must be selected";
            return false;
        }

        $scope.login_error = "";
        $.ajax({
            url: $("#host_name").val() + "auth/signup",
            type: 'POST',
            data: $scope.signup,
            dataType: 'json',
            success: function(data) {
                if (data.status == "success") {
                    window.location.href = document.referrer;
                } else {
                    $scope.login_error = data.message;
                    if (!$scope.$$phase)
                        $scope.$apply();
                }
            },
            error: function(error) {
                $scope.login_error = error;
                if (!$scope.$$phase)
                    $scope.$apply();
            }
        });
    };
});