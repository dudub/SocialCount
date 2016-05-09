(function() {

    angular.module('SocialCount')
        .service('SocialCountService', SocialCountService);


    function SocialCountService($http, $log, $q, ProviderService) {

        const PAGE_URL_CONST = "__PAGE_URL__";

        return {
            getSocialCount: getSocialCount
        }
        ///////////////////


        function getSocialCount(provider, pageurl, callback) {
            var _promises = [];

            provider = Array.isArray(provider) ? provider : [provider];
            pageurl = Array.isArray(pageurl) ? pageurl : [pageurl];

            var providersAndPages = buildProvidersPagesPairs(provider, pageurl);

            providersAndPages.forEach(function(pair) {
                var promise = getSingleSocialCountAsync(pair.provider, pair.page);
                _promises.push(promise);
            });

            promisesHandler(_promises, callback);

        }

        /*        function promisesHandler(promises, callback) {
                    $q.all(promises).then(function(results) {

                        var pages = [];
                        results.forEach(function(item) {
                            var page = findPage(pages, item.page);
                            if (!page) {
                                page = {
                                    page: item.page,
                                    providers: []
                                };
                                pages.push(page);
                            }

                            page.providers.push({
                                provider: item.provider,
                                counters: item.data
                            });
                        });

                        return callback(pages);
                    });
                }*/

        function promisesHandler(promises, callback) {
            $q.all(promises).then(function(results) {

                var providers = [];
                results.forEach(function(item) {
                    var provider = findProvider(providers, item.provider);
                    if (!provider) {
                        provider = {
                            provider: item.provider,
                            pages: []
                        };
                        providers.push(provider);
                    }

                    provider.pages.push({
                        page: item.page,
                        counters: item.data
                    });
                });

                return callback(providers);
            });
        }

        function buildProvidersPagesPairs(providers, pages) {
            var arr = [];
            providers.forEach(function(prov) {
                pages.forEach(function(page) {
                    arr.push({ provider: prov, page: page });
                });
            });

            return arr;
        }

        function findProvider(arr, providerName) {
            var result = arr.find(function(item) {
                return item.provider === providerName;
            });
            return result;
        }

/*        function findPage(arr, pageUrl) {
            var result = arr.find(function(item) {
                return item.page === pageUrl;
            });
            return result;
        }*/

        function getProviderUrl(provider, page) {
            var providerConfig = ProviderService.getProviderConfig(provider);
            var url = providerConfig.url.replace(PAGE_URL_CONST, page);
            return url;
        }

        function getSingleSocialCountAsync(provider, pageurl) {
            var deferred = $q.defer();
            var providerConfig = ProviderService.getProviderConfig(provider);
            var url = getProviderUrl(provider, pageurl);
            var method = providerConfig.method;


            $http({
                    url: url,
                    method: method
                })
                .success(function(data, status, headers, config) {

                    var result = {
                        page: pageurl,
                        provider: provider,
                        data: providerConfig.buildResultFunc(data)
                    };
                    deferred.resolve(result);
                })
                .error(function(data, status, headers, config) {
                    alert('error');
                });

            return deferred.promise;
        }
    }
})();
