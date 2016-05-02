angular.module('starter.addVital', [])

    .controller('addVitalCtrl', function($scope, $rootScope, $ionicActionSheet,
        date_picker, local_json, generic_http_post_service) {

        $scope.temp = {};
        $scope.init = function() {
            $scope.temp.change = false;
            $scope.getVitalList();
        }//end 

        $scope.closeModal1 = function() {
            if ($scope.temp.change) // this line willfire event to refresh data of vital in other pages if something has been added successsfully
                $scope.session_variables.vital_modal_removed = true;
            $scope.closeModal();
        }
        $scope.getVitalList = function() {
            $scope.session_variables.vitalList = local_json.getVital();
        }//end 

        $scope.addVitals = function() {

            if (!$scope.temp.VitalNatureId) {
                $scope.showAlertWindow_Titled("Error", "Please select vital nature");
                return;
            }

            if (!$scope.temp.VitalReading) {
                $scope.showAlertWindow_Titled("Error", "Please enter vital readings");
                return;
            }

            $scope.showLoader('Please wait...');
            $scope.requestData = {};
            $scope.requestData.UserRoleID = '' + $scope.session_variables.login_data.userroleid;
            $scope.requestData.Mrno = '' + $scope.session_variables.login_data.mrno;
            $scope.requestData.VitalOtherInfo = $scope.temp.VitalOtherInfo;
            $scope.requestData.VitalReading = '' + $scope.temp.VitalReading;
            $scope.requestData.VitalRemarks = $scope.temp.VitalRemarks;
            $scope.requestData.VitalNatureId = '' + $scope.temp.VitalNatureId;
            generic_http_post_service.getDetails(generic_http_post_service.getServices().POST_PATIENT_VITAL,
                $scope.requestData, $scope.addVitals_callback);
        }

        $scope.addVitals_callback = function(data) {
            $scope.hideLoader();
            if (data == "true") {
                $scope.temp.change = true;
                $scope.showAlertWindow_Titled("Success", "vital added");
            } else {
                $scope.showAlertWindow_Titled("Error", JSON.stringify(data));
            }
        }//end 
        
        
    });
