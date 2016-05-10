(function() {

    angular.module('SocialCount')
        .controller('SocialCountController', SocialCountController);

    function SocialCountController($http, SocialCountService, ProviderService) {
        var vm = this;

        vm.urls = [{ url: 'http://getbootstrap.com' }, { url: 'http://materializecss.com' }]; //contains examples...
        vm.results = [];
        vm.providers = [];
        vm.getSocialCount = getSocialCount;
        vm.addUrl = addUrl;

        activate();
        
        return vm;

        ///////////////////////
        function activate() {
            vm.providers = ProviderService.providers.map(function(p) {
                return { name: p, selected: true };
            });
        }

        function addUrl() {
            vm.urls.push({ url: 'http://' });
        }

        function getSocialCount() {

            vm.results = [];

            var providers = getSelectedProviders();
            if(providers.length == 0){
            	alert('Please select some provider and try again...');
            	return;
            }

            var urls = vm.urls.map(function(u) {
                return u.url;
            })

            SocialCountService.getSocialCount(providers, urls, getSocialCallback);
        }

        function getSelectedProviders() {
            return vm.providers.filter(function(provider) {
                return provider.selected;
            }).map(function(provider) {
                return provider.name;
            });
        }

        function getSocialCallback(data) {
            vm.results = data;
        }
    }

})();
