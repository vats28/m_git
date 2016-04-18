angular.module('starter.insurance', [])

    .controller('insuranceCtrl', function ($scope, date_picker, generic_http_post_service) {
        
        $scope.insuranceList = [
            {
                "policy":"ICICI PRU LIFE",
                "policy_num":"183276378",
                "policy_cover":"-NA-",
                "expiry_date":"2016-04-10",
                "renew_date":"2016-05-10",
            },
        ];
        
        
    });
