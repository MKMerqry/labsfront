/* ------------------------------------------------------------------------------
*  # Main JS file
*  # The main js file is common for all demos
* ---------------------------------------------------------------------------- */

// CORE APP OBJECT
// ======================

var APP = function() {
    this.ASSETS_PATH = './assets/';
};

var APP = new APP();

// APP UI SETTINGS

APP.UI = {
	scrollTop: 0, // Minimal scrolling to show scrollTop button
};

$(window).on('load resize scroll', function () {
    if ($(this).width() < 992) $('body').removeClass('sidebar-mini').addClass('drawer-sidebar');
});

$(function () {
	// BACK TO TOP
	$(window).scroll(function() {
		if($(this).scrollTop() > APP.UI.scrollTop) $('.to-top').fadeIn();
        else $('.to-top').fadeOut();
	});


    // LAYOUT SETTINGS
    // ======================
    
    // drawer sidebar
    $('#_drawerSidebar').change(function(){
        if( $(this).is(':checked') ) {
            $('body').addClass('drawer-sidebar');
        } else {
            $('body').removeClass('drawer-sidebar');
        }
        setTimeout(function(){
            $('body').removeClass('sidebar-mini');
        },200);
    });

    // fixed navbar
    $('#_fixedNavbar').change(function() {
        if($(this).is(':checked')) $('body').addClass('fixed-navbar');
        else $('body').removeClass('fixed-navbar');
    });

    // THEMES COLOR CHANGE

    $('.color-skin-box input:radio').change(function() {
        var val = $(this).val();
        if(val != 'default') {
            if(! $('#theme-style').length ) {
                $('head').append( "<link href='assets/css/themes/"+val+".css' rel='stylesheet' id='theme-style' >" );
            } else $('#theme-style').attr('href', 'assets/css/themes/'+val+'.css');
        } else $('#theme-style').remove();
    });    

    //  TO TOP
	$('.to-top').click(function(e) {
		$("html, body").animate({scrollTop:0},500);
	});


    //  CHAT
    $('.chat-list [data-toggle="show-chat"]').click(function(){
        $(this).parents('.chat-panel').addClass('opened');
    });
    $('.messenger-return').click(function(){
        $(this).parents('.chat-panel').removeClass('opened');
    });

    // LOGS
    $('.log-tabs a').click(function(){
        $(this).addClass('active').siblings().removeClass('active');
        if($(this).attr('data-type') == 'all') {
            $('.logs-list li').show();
        } else {
            $('.logs-list li').hide().filter('[data-type="'+$(this).attr('data-type')+'"]').show();
        }
    });


    // TOGGLE THEME-CONFIG BOX
	
	$('.theme-config-toggle').on('click', function() {
		$(this).parents('.theme-config').backdrop();
	});

    // SEARCH BAR CLOSE
    $('.input-search-close').click(function(){
        closeShined();
    });


    // Backdrop functional

    $.fn.backdrop = function() {
	    $(this).toggleClass('shined');
	    $('body').toggleClass('has-backdrop');
        return $(this);
	};

    $('.backdrop').click(closeShined);

    function closeShined() {
        $('body').removeClass('has-backdrop');
        $('.shined').removeClass('shined');
    }

    // Session timeout form validate
    
    $('#timeout-form').validate({
        errorClass:"help-block",
        rules: {
            timeout_count: {required:true,digits:true},
        },
        highlight:function(e){$(e).closest(".form-group").addClass("has-error").closest('.timeout-modal').addClass("has-error");},
        unhighlight:function(e){$(e).closest(".form-group").removeClass("has-error").closest('.timeout-modal').removeClass("has-error");},
    });


});