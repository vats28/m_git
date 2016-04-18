angular.module('starter.healthStatus', [])

    .controller('healthStatusCtrl', function ($scope, generic_http_post_service) {
        $scope.showModalAddHealthProvider = function () {
            $scope.showModal('templates/popups/add_health_provider.html');
        }//end 
            
          
        $scope.IsImage = function (path) {
            var fileType = path.substr(path.lastIndexOf('.') + 1);
            if (fileType.toLowerCase() == 'jpg' || fileType.toLowerCase() == 'jpeg'
                || fileType.toLowerCase() == 'png' || fileType.toLowerCase() == 'gif') {
                return true;
            }

            return false;
        }

        $scope.items = [];

        for (var i = 0; i <= 5; i++) {
            var tmp = [
                { desc: "Dr. Arun Mehta", image: "http://www.sethihospital.in/img/arunsaroha.png" },
                { desc: "Dr. Radhika Mishra", image: "http://www.vitals.com/v/upload/photo/Dr_Radhika_Kapoor.jpg" },
                { desc: "Dr. Suman Arora", image: "http://s3-ap-southeast-1.amazonaws.com/babychakraserviceproviders/serviceproviders/normal/13099/service_5666a47a9c1dc.jpg" },
                { desc: "Dr. Ankit Gupta", image: "http://cdn.fortishealthcare.com/0.32821400_1450096531_Dr.jpg" },
                { desc: "Dr. Ajay Agrawal", image: "http://cdn.fortishealthcare.com/0.59548100_1433481430_Dr.jpg" },
                { desc: "Dr. Sumit Seth", image: "https://www.ziffi.com/suggestadoc/images/doctors/sumit-talwar-general-surgeon-39332-128.jpg" }
            ];
            $scope.items = $scope.items.concat(tmp);
        };

    });
