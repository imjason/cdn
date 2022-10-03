function BackTOP() {
    $("#btn").hide();
    $(function () {
        $(window).scroll(function () {
            if ($(window).scrollTop() > 50) {
                $("#btn").fadeIn(200);
            } else {
                $("#btn").fadeOut(200);
            }
        });
        $("#btn").click(function () {
            $('body,html').animate({
                    scrollTop: 0
                },
                500);
            return false;
        });
    });
    $(function () {
        $("#say").click(function () {
            $('body,html').animate({
                    scrollTop: $('html, body').get(0).scrollHeight
                },
                500);
            return false;
        });
    })
}

$('#readmode').click(function () {
        $('body').toggleClass('read-mode')
    })
    
function SiderMenu() {
    $('#main-container').toggleClass('open');
    $('.iconflat').css('width', '50px').css('height', '50px');
    $('.openNav').css('height', '50px');
    $('#main-container,#mo-nav,.openNav').toggleClass('open')
}

function switchNightMode() {
    $('<div class="Cuteen_DarkSky"><div class="Cuteen_DarkPlanet"></div></div>').appendTo($("body")), setTimeout(
        function () {
            (volantis.dark.mode == "dark") 
            ? 
            ($("html").addClass("DarkMode"),
            $('#modeicon').attr("xlink:href", "#icon-sun")) 
            : 
            ($("html").removeClass("DarkMode"),
            $('#modeicon').attr("xlink:href", "#icon-_moon")), 
            setTimeout(function () {
                $(".Cuteen_DarkSky").fadeOut(1e3, function () {
                    $(this).remove()
                })
            }, 2e3)
        }), 50
}

function checkNightMode() {
    if ($("html").hasClass("n-f")) {
        $("html").removeClass("day");
        $("html").addClass("DarkMode");
        $('#modeicon').attr("xlink:href", "#icon-sun")
        return;
    }
    if ($("html").hasClass("d-f")) {
        $("html").removeClass("DarkMode");
        $("html").addClass("day");
        $('#modeicon').attr("xlink:href", "#icon-_moon")
        return;
    }
    if (volantis.dark.mode == "dark") {
        $("html").addClass("DarkMode");
        $('#modeicon').attr("xlink:href", "#icon-sun")
    } else {
        $("html").removeClass("DarkMode");
        $('#modeicon').attr("xlink:href", "#icon-_moon")
    }
}
BackTOP();
window.addEventListener('load', ()=>{
    volantis.dark.push(()=>{
        switchNightMode();
    })
}, {once: true})
