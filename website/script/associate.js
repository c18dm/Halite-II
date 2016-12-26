$(function() {
    var customEmailForm = {
        $firstField: $("#firstField"),
        $secondField: $("#secondField"),
        $messageBox: $("#messageBox"),
        $submitButton: $("#customSubmitButton"),
        init: function(submitCallback) {
            this.submitCallback = submitCallback;
            this.$submitButton.click(this, this.onClick.bind(this));         
            this.$firstField.keypress(this, this.keypress.bind(this));         
            this.$secondField.keypress(this, this.keypress.bind(this));         
        },
        render: function() {
            this.$emailLoc.html(this.email);
        },
        onClick: function() {
            if(this.$firstField.val() != this.$secondField.val()) {
                this.displayMessage("Email Mismatch", "The two emails that you entered do not match.", false);
            } else if(this.$firstField.val() == "" || this.$secondField.val() == "") {
                this.displayMessage("Empty Fields", "Please fill your email twice in the boxes below.", false);
            } else {
                this.displayMessage("Success", "We've sent a verification email to "+this.$firstField.val()+". Redirecting to the front page.", true);
                this.submitCallback(this.$firstField.val(), getSelectedText("selectionLevel"), getSelectedText("selectionHighSchool"), getSelectedText("selectionScrimmage"));
                setTimeout( function(){ window.location.href = "index.php" }, 2000 );
               
            }
        },
        keypress: function(e) {
            if(e.which == 13) this.onClick();
        },
        displayMessage: function(title, message, isSuccess) {
            this.$messageBox.append($("<div class='alert "+(isSuccess ? "alert-success" : "alert-danger")+" alert-dismissible' role='alert'><button type='button' class='close' id='messageCloseButton' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>"+title+"</strong>&nbsp;&nbsp;"+message+"</div>"))
        }
    }

    function getSelectedText(classId) {
        return $("#"+classId+">option:selected").html();
    }

    function populateSelection(selectionId, selectionList) {
        var selection = document.getElementById(selectionId);
        for (i = selection.options.length - 1; i >= 0; i--) {
            selection.remove(i);
        }
        for( var item in selectionList ){
            var option = document.createElement('option');
            option.innerHTML = selectionList[item];
            option.value = selectionList[item];
            selection.append(option);
        }

    }

    function render() {
        $("#highSchoolItems").css("display", "none");
        $("#associateMessage").css("display", "block");
        $("#forms").css("display", "block");
    }

    function updateScrimmageDropDown() {
        var school = getSelectedText("selectionHighSchool")
        var state = getValidHighSchoolByName(school)[0]['state'];
        var scrimmages = getValidScrimmagesByState(state).map(function(x){ return x['name'] });
        populateSelection("selectionScrimmage", scrimmages);
    }

    var schools = getValidHighSchools().map(function(x){ return x['name'] });
    populateSelection("selectionHighSchool", schools);
    updateScrimmageDropDown();
    render();

    document.getElementById("selectionLevel").onchange = function(){
        if(getSelectedText("selectionLevel") == "High-School") {
            $("#highSchoolItems").css("display", "block");
        } else {
            $("#highSchoolItems").css("display", "none");
        }
    }

    document.getElementById("selectionHighSchool").onchange = function(){
        updateScrimmageDropDown();
    }

    customEmailForm.init(function(email, level, institution, scrimmage) {
        if(level != "High-School") {
            newEmailForProfessional(email, level);
        } else {
            newEmailForHighSchool(email, level, institution, scrimmage);
        }
    });
});
