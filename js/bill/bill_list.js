angular.module('starter.billList', [])

    .controller('billListCtrl', function($scope, date_picker, generic_http_post_service) {

        $scope.billList = [
            {
                bill_num: "1357625",
                hospital: "Shri Gangaram hospital",
                city:"delhi",
                amount: "7345.00",
                date: "2016-02-09",
            },
            {
                bill_num: "1456386",
                hospital: "Max Hospital",
                city:"Saket",
                amount: "7345.00",
                date: "2016-02-09",
            },
            {
                bill_num: "2635478",
                hospital: "Dr. Batra clinic",
                city:"delhi",
                amount: "7345.00",
                date: "2016-02-09",
            },
        ];
        
        $scope.init = function(){
            
        }//ned 
        
        
        $scope.getDateWithMonthName = function(dateString){
            return date_picker.getDateWithMonthName(dateString);
        }
    });
