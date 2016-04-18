angular.module('starter.additionalProfile', [])

    .controller('additionalProfileCtrl', function ($scope, generic_http_post_service) {

        $scope.init = function () {
            if (!$scope.session_variables.login_data.aadhar) {
                $scope.session_variables.login_data.aadhar = '983883646474';
                $scope.session_variables.login_data.driving_licence = 'DL87627DFH56';
                $scope.session_variables.login_data.passport = 'LPP171978';
            }
        }

        $scope.saveAdditonalProfile = function () {
            $scope.showAlertWindow_Titled('Success', "Additional profile updated");
        }//end 

    });
