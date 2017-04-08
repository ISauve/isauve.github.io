$(document).ready(function(){
    adjustPageHeights();
    adjustPageWidths();
    mouseOverSkills();

    $(window).bind('resize', function() {
        adjustPageHeights();
        adjustPageWidths();
    });

    $(window).bind('scroll', function() {
        parallaxScroll();
    });

    $('.contact_title').click(contactMe);
    $('.work_title').click(viewMyWork);

    // creates the 'fading' animation on the experience logos
    $('.experience').hover(function() {
        $('.experience').not(this).css("opacity", 0.5);
    }, function() {
        $('.experience').css("opacity", 1);
    });

    // allows popovers
    $('[data-toggle="popover"]').popover();

    // fade page in once it's all loaded
    $('#main-content').fadeIn('slow');
});

function navigate() {
    $('html, body').animate({
        scrollTop: $("#anchor_top").offset().top
    }, 1500);
}

function adjustPageHeights() {
    var windowHeight = $(window).height();
    var windowWidth = $(window).width();

    // Height: 545px (min)   Width: 100%
    var $first = $('.first_page');
    var $second = $('.second_page');
    var $third = $('.third_page');
    var $footer = $('.footer');
    var $all = $('.first_page, .second_page, .third_page');

    // Width: 248px         Height: 60px (-> need an offset of 30)
    var $firstBtwn = $('.first_btwn');
    var $secondBtwn = $('.second_btwn');

    $firstBtwn.css('left', windowWidth/2 - 124 + 'px');
    $secondBtwn.css('left', windowWidth/2 - 150 + 'px');

    var bottom;
    if (windowHeight > 545) {
        $all.css('height', windowHeight + 'px');
        $first.css('top', windowHeight + 'px');
        $firstBtwn.css('top', (windowHeight*2.5 - 30) + 'px');
        $second.css('top', (windowHeight*3) + 'px');
        $secondBtwn.css('top', (windowHeight*4.5 - 30) + 'px');
        $third.css('top', (windowHeight*5) + 'px');
        bottom = windowHeight*5 + $third.height();
        $footer.css('top', bottom + 'px');
        // note that the footer height also gets adjusted in parallaxScroll
        return;
    }

    $all.css('height', 545 + 'px');
    $first.css('top', windowHeight + 'px');
    $firstBtwn.css('top', (windowHeight + 545*1.5 - 30) + 'px');
    $second.css('top', (windowHeight + 545*2) + 'px');
    $secondBtwn.css('top', (windowHeight + 545*3.5 - 30) + 'px');
    $third.css('top', (windowHeight + 545*4) + 'px');
    bottom = windowHeight + 545*4 + $third.height();
    $footer.css('top', bottom + 'px');
}

function parallaxScroll(){
    var window_top = $(window).scrollTop();
    var windowHeight = $(window).height();

    var $first = $('.first_bk');
    var $second = $('.second_bk');

    $first.css('top', (150-(window_top*0.2)) +'px');
    $second.css('top', (300-(window_top*0.2)) +'px');

    // the writing on the title page (making it 'scroll up' quickly)
    $('.title_page').css('top', windowHeight/2 - window_top*0.9 + 'px');

    var first_pg_top = $('.first_page').offset().top;
    var second_pg_top = $('.second_page').offset().top;
    var $title_bk = $('.title_page_bk');

    if (window_top > first_pg_top ) {           // scrolling past first page (About me)
        $title_bk.css({
            'position': 'absolute',
            'top': windowHeight + 'px'
        });

        if (windowHeight > 545) {
            $title_bk.css("height", windowHeight + 'px');
        } else {
            $title_bk.css("height", 545 + 'px');
        }
    } else {
        $title_bk.css( {
            'position': 'fixed',
            'top': '0px'
        });
    }

    if (window_top > second_pg_top) {
        $first.css('display', 'none');
    } else {
        $first.css('display', 'block');
    }
}

function adjustPageWidths() {
    var windowWidth = $(window).width();
    var $third_page = $('.third_page');
    var $switch = $('.switch');
    var $switch2 = $('.switch_2');

    var height = $switch.height();
    $switch.css("margin-top", -height/2 + 'px');

    // Second page:
    if (windowWidth < 780) {
        $('.wrap').css("display", "none");
        $('.wrapSmall').css("display", "block");
    } else {
        $('.wrap').css("display", "block");
        $('.wrapSmall').css("display", "none");
    }
    
    // First page:
    if (windowWidth < 970) {
        $('.hide').css("display", "none");
        $('.adjust').removeClass('w450');
        $('.center').addClass('vertical');
    } else {
        $('.hide').css("display", "table-cell");
        $('.adjust').addClass('w450');
        $('.center').removeClass('vertical');
    }

    // Third page:
    if (windowWidth < 1028) {
        $third_page.css("height", "1026px");

        $switch2.addClass('vertical');
        $switch2.removeClass('horizontal');
        $switch2.html(
            '<tr>' +
                '<td class="skill lang"> Languages </td> ' +
            '</tr>' +
            '<tr>' +
                '<td class="skill fw"> Tools </td> ' +
            '</tr>' +
            '<tr>' +
                '<td class="skill tools"> Software </td> ' +
            '</tr>'
        );

        var windowHeight =  $(window).height();
        if (windowHeight > 545) {
            $('.footer').css('top',  windowHeight*5 + $third_page.height()+ 'px');
        } else {
            $('.footer').css('top', windowHeight + 545*4 + $third_page.height() + 'px');
        }
    } else {
        $switch2.addClass('horizontal');
        $switch2.removeClass('vertical');
        $switch2.html(
            '<tr>' +
            '<td class="skill lang"> Languages </td> ' +
            '<td class="skill fw"> Tools </td> ' +
            '<td class="skill tools"> Software </td> ' +
            '</tr>'
        )
    }

    mouseOverSkills(); // need to re-fire it so the selectors bind to the new html
}

var trackerG = 0;
function contactMe() {
    trackerG++;
    var $underline = $('.contact_underline');
    var $title = $('.contact_title');

    $title.unbind("click");
    setTimeout(function(){
        $('.contact_title').bind("click", contactMe);
    }, 2000);

    if (trackerG%2 == 0) {
        $('.contact_content').fadeOut(800, function() {
            $underline.css("margin-top", "62px");
            $underline.animate({"margin-top": "0px"}, 800);
            $title.css("margin-top", "-31px");
            $title.animate({"margin-top": "0px"}, 800);
        });
        return;
    }

    $underline.animate({"margin-top": "62px"}, 800, function() {
        $('.contact_content').fadeIn(800);
        $underline.css("margin-top", "0px");
    });
    $title.animate({"margin-top": "-31px"}, 800);

}

var trackerG2 = 0;
function viewMyWork() {
    trackerG2++;
    var $underline = $('.work_underline');
    var $title = $('.work_title');

    $title.unbind("click");
    setTimeout(function(){
        $('.work_title').bind("click", viewMyWork);
    }, 2000);

    if (trackerG2%2 == 0) {
        $('.work_content').fadeOut(800, function() {
            $underline.css("margin-top", "200px");
            $underline.animate({"margin-top": "0px"}, 800);
            $title.css("margin-top", "-100px");
            $title.animate({"margin-top": "0px"}, 800);
        });
        return;
    }

    $underline.animate({"margin-top": "200px"}, 800, function() {
        $('.work_content').fadeIn(800);
        $underline.css("margin-top", "0px");
    });
    $title.animate({"margin-top": "-100px"}, 800);

}

function mouseOverSkills() {
    var $languages = $('.lang');
    var $frameworks = $('.fw');
    var $tools = $('.tools');

    $languages.mouseenter(function() {
        $languages.html(
            'C++' +
            '<br>HTML5 and CSS3 ' +
            '<br>JavaScript' +
            '<br>PHP' +
            '<br>Java' +
            '<br>Python3' +
            '<br>MATLAB'
        )
    }).mouseleave(function() {
        $languages.html('Languages');
    });

    $frameworks.mouseenter(function() {
        $frameworks.html(
            'Node.js and Express.js' +     // environment
            '<br>Twilio' +      // API
            '<br>Firebase' +    // database
            '<br>Redis' +     // data structure store
            '<br>jQuery ' +         // library
            '<br>Bootstrap' +   // framework
            '<br>AJAX' +        // technique
            '<br>SASS'        // extension

        )
    }).mouseleave(function() {
        $frameworks.html('Tools');
    });

    $tools.mouseenter(function() {
        $tools.html(
            'GitHub' +
            '<br>JetBrains IDEs' +
            '<br>Final Cut Pro' +
            '<br>Microsoft Office Suite' +
            '<br>AutoCAD' +
            '<br>Photoshop'
        )
    }).mouseleave(function() {
        $tools.html('Software');
    });

    $('.lang, .fw, .tools').mouseenter(function() {
        $(this).css({
            "font-size": "0.25em",
            "line-height": "35px"
        });
    }).mouseleave(function() {
        $(this).css({
            "font-size": "0.5em",
            "line-height": "300px"
        });
    })

}