$(function() {
    var isSP = !window.matchMedia('(min-width:769px)').matches;
    var isPC = window.matchMedia('(min-width:769px)').matches;

    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        var href = $(this).attr("href");
        var target = $(href == "#" || href == "" ? 'html' : href);
        var position = target.offset().top;
        $("html, body").animate({
            scrollTop: position
        }, 800, "swing");
    });

    $(window).scroll(function() {
        var floatingStartPos = $(".adlp-main").offset().top;
        if (window.pageYOffset > floatingStartPos) {
            $(".adlp-floating").fadeIn();
        } else {
            $(".adlp-floating").fadeOut();
        }
    });

    $(".adlp-accordion .adlp-accordion__header").on("click", function() {
        $(this).next(".adlp-accordion__body").slideToggle();
        $(this).toggleClass("--open");
    });
    $(".js-toggle").on("click", function() {
        $(this).next().slideToggle();
    });

    // フォーム送信後にthank.htmlへ遷移
    /*
$("#contact-form").on("submit", function(event) {
    event.preventDefault();
    setTimeout(function() {
        window.location.href = "file:///Users/iwatsukiyuuki/Downloads/master-key_t1/thank.html";
    }, 500);
    this.submit();
});
*/

});

var appendAttr = function(visibility, click, click2, check, floating) {
    var num = 1;
    return {
        viewArea: function() {
            var sectionList = document.querySelectorAll('[data-type="visibility"]');
            Array.prototype.slice.call(sectionList).forEach(function(section) {
                section.classList.add(visibility + num++);
            });
            return num = 1;
        },
        cvArea: function() {
            var btnList = document.querySelectorAll('[data-type="click"]');
            Array.prototype.slice.call(btnList).forEach(function(btn) {
                btn.classList.add(click + num++);
            });
            return num = 1;
        },
        checkArea: function() {
            var checkList = document.querySelectorAll('[data-type="check"]');
            Array.prototype.slice.call(checkList).forEach(function(checkElm) {
                checkElm.classList.add(check + num++);
            });
            return (num = 1);
        },
        floatingArea: function() {
            var floatingList = document.querySelectorAll('[data-type="floating"]');
            Array.prototype.slice.call(floatingList).forEach(function(floatingElm) {
                floatingElm.classList.add(floating + num++);
            });
            return (num = 1);
        },
        setRel: function() {
            var aList = document.querySelectorAll('a');
            Array.prototype.slice.call(aList).forEach(function(els) {
                if (els.hasAttribute('target') === false) {
                    return;
                }
                if (els.getAttribute('target') !== '_blank') {
                    return;
                }
                els.setAttribute('rel', 'noopener noreferrer');
            });
        }
    };
}('view_area_', 'cv_area_', "click_area_", "check_list_", "floating_area_");

document.addEventListener('DOMContentLoaded', () => {
    Promise.all([
        appendAttr.viewArea(),
        appendAttr.cvArea(),
        appendAttr.checkArea(),
        appendAttr.floatingArea(),
        appendAttr.setRel()
    ]);
});