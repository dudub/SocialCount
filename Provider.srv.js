(function() {

    angular.module('SocialCount')
        .factory('ProviderService', ProviderService);


    function ProviderService() {

        var _config;

        activate();

        return {
            providers: ['Facebook', 'Pinterest'],
            getConfig: getConfig,
            getProviderConfig: getProviderConfig
        };
    }

    ///////////////////////////////
    function activate() {
        _config = getConfig();
    }

    function getConfig() {
        return {
            Facebook: {
                url: 'https://graph.facebook.com/fql?q=SELECT like_count, total_count, share_count, click_count, comment_count FROM link_stat WHERE url = "__PAGE_URL__"',
                buildResultFunc: function(responseData) {
                    var counters = [];
                    var data = responseData.data[0];
                    if (data) {

                        counters.push({ name: "Comments", count: data.comment_count });
                        counters.push({ name: "Likes", count: data.like_count });
                        counters.push({ name: "Shares", count: data.share_count });
                        counters.push({ name: "Clicks", count: data.click_count });
                        counters.push({ name: "Total", count: data.total_count });
                    }

                    return counters;
                },
                method: 'get'
            },
            Pinterest: {
                url: "http://api.pinterest.com/v1/urls/count.json?callback=JSON_CALLBACK&url=__PAGE_URL__",
                buildResultFunc: function(responseData) {
                    return [{ name: "Pins", count: responseData.count }];
                },
                method: 'jsonp'
            }

        };
    }

    function getProviderConfig(name) {
        return _config[name];
    }

})();
