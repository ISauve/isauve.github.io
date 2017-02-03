$(document).ready(function() {
    $(window).bind('resize', readjustWidth);
    readjustWidth();
});

function readjustWidth() {
    var windowWidth = $(window).width();
    var $text = $('#text');
    var $images = $('#images');
    var textHeight =  $text.height();

    if (windowWidth < 580) {
        $text.css({
            'left': '20px',
            'top': '20px',
            'width': 'auto',
            'right': '20px'
        });

        $images.css("display", "none");
        return;
    }

    if (windowWidth < 1000) {
        $text.css({
            'left': '20px',
            'top': '20px',
            'width': 'auto',
            'right': '20px'
        });

        $images.css({
            'left': '20px',
            'top': textHeight + 40 + 'px',
            'right': '20px',
            'display': 'block'
        });
        return;
    }

    $text.css({
        'left': '20px',
        'top': '20px',
        'width': '40%',
        'right': '0px'
    });

    $images.css({
        'left': '45%',
        'top': '20px',
        'right': '20px',
        'display': 'block'
    })
}