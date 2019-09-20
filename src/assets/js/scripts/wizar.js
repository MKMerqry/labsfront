$(function() {
    $('#form-wizard').steps({
        headerTag: "h6",
        bodyTag: "section",
        titleTemplate: '<span class="step-number">#index#</span> #title#',
        onStepChanging: function(event, currentIndex, newIndex) {
            var form = $(this);
            // Always allow going backward even if the current step contains invalid fields!
            if (currentIndex > newIndex) {
                return true;
            }

            // Clean up if user went backward before
            if (currentIndex < newIndex) {
                // To remove error styles
                $(".body:eq(" + newIndex + ") label.error", form).remove();
                $(".body:eq(" + newIndex + ") .error", form).removeClass("error");
            }

            // Disable validation on fields that are disabled or hidden.
            form.validate().settings.ignore = ":disabled,:hidden";

            // Start validation; Prevent going forward if false
            return form.valid();
        },
        onFinishing: function(event, currentIndex) {
            var form = $(this);
            form.validate().settings.ignore = ":disabled";
            return form.valid();
        },
        onFinished: function(event, currentIndex) {
            toastr.success('Submitted!');
        }
    }).validate({
        errorPlacement: function errorPlacement(error, element) {
            error.insertAfter(element);
        },
        rules: {
            confirm: {
                equalTo: "#password"
            }
        },
        errorClass: "help-block error",
        highlight: function(e) {
            $(e).closest(".form-group").addClass("has-error")
        },
        unhighlight: function(e) {
            $(e).closest(".form-group").removeClass("has-error")
        },
    });
})
