; (function ($) {
    $.fn.infiniteScroll = function (options) {

        var observer, filesControl = 0, markSelector, settings;
        settings = $.extend({
            files: [],
            preloaderColor: "#000",
            fadeDuration: 300,
            onLoadNewContent: function () { },
            onEnd: function () { }
        }, options);

        infiniteContentLoader = function (entry) {
            if (entry[0].isIntersecting && !$(".infiniteContentPreloader").is(":visible") && filesControl < settings.files.length) {
                $(".infiniteContentPreloader").toggle();
                var content = $("<div style='opacity:0'></div>");
                content.load(settings.files[filesControl], function (data) {
                    settings.onLoadNewContent();
                    $(".infiniteContentPreloader").toggle();                   
                    $('.' + markSelector).before(this);
                    $(this).fadeTo(settings.fadeDuration, 1)
                    filesControl++;
                });
            } else if(entry[0].isIntersecting && !$(".infiniteContentPreloader").is(":visible") && filesControl >= settings.files.length) {
                observer.disconnect();
                settings.onEnd();
            }
        }

        infiniteScroll = function (element) {
            markSelector = "infiniteContentMark_" + Date.now();
            var mark = `<div class="${markSelector}" style="width: 100%;"></div>`
            $(element).append(mark);

            $(document).ready(function () {
                $('.' + markSelector).html(`<div class="infiniteContentPreloader" style="width: 100px; height: 100px; margin: 0 auto; display: none;"><svg version="1.1" id="L4" xmlns="http://www.w3.org/2000/svg" xmlns: xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml: space="preserve">
                    <circle fill="${settings.preloaderColor}" stroke="none" cx="6" cy="50" r="6">
                        <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.1"></animate>
                    </circle>
                    <circle fill="${settings.preloaderColor}" stroke="none" cx="26" cy="50" r="6">
                        <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2"></animate>
                    </circle>
                    <circle fill="${settings.preloaderColor}" stroke="none" cx="46" cy="50" r="6">
                        <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.3"></animate>
                    </circle>
                </svg></div>`);

                if (!('IntersectionObserver' in window)) {
                    console.log("Intersection Observer API is not available");
                } else {
                    var options = {
                        root: null,
                        rootMargin: '0px',
                        threshold: 0
                    }
                    observer = new IntersectionObserver(infiniteContentLoader, options);
                    var infiniteContentMark = $('.' + markSelector).toArray()[0];
                    observer.observe(infiniteContentMark);
                }
            });
        }

        if (this.length > 0) {
            return infiniteScroll(this);
        }
    };
})(window.jQuery || window.Zepto);