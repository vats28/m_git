angular.module('starter.shareRecords', [])

    .controller('shareRecordsCtrl', function($scope, generic_http_post_service) {

        $scope.shareData = {};
        $scope.init = function() {
            try {
                $scope.GetMedicalRecordNature();
                $scope.GetFavouriteHospital();
                // $scope.getLovedOneList();
            } catch (error) {
                alert(error);
                $scope.hideLoader();
            }
        }

        $scope.GetMedicalRecordNature = function() {
            var array_rec_nature = null;
            try {
                array_rec_nature = JSON.parse($scope.GetInLocalStorage($scope.localStorageKeys.RECORD_NATURE_LIST));
            } catch (error) { }

            if (!array_rec_nature) {
                $scope.GetMedicalRecordNature_main($scope.GetMedicalRecordNature_callback);
            } else {
                $scope.session_variables.array_rec_nature = array_rec_nature;
                $scope.GetMedicalRecordNature_callback($scope.session_variables.array_rec_nature);
            }
        }

        $scope.GetMedicalRecordNature_callback = function(data) {
            $scope.fetchNature = true;
            if (data != null && data != []) {
                //alert('2');
                $scope.session_variables.array_rec_nature = data;
                $scope.SaveInLocalStorage($scope.localStorageKeys.RECORD_NATURE_LIST, JSON.stringify(data));

            } else {
                $scope.showAlertWindow_Titled("Sorry", "No data");
            }
        }


        $scope.GetFavouriteHospital = function() {
            var array_fav_hospitals = null;
            try {
                array_fav_hospitals = JSON.parse($scope.GetInLocalStorage($scope.localStorageKeys.HOSPITAL_LIST));
            } catch (error) { }

            if (!array_fav_hospitals) {
                $scope.GetSubtenants($scope.GetFavouriteHospital_callback);
            } else {
                $scope.session_variables.array_fav_hospitals = array_fav_hospitals;
                $scope.GetFavouriteHospital_callback($scope.session_variables.array_fav_hospitals);
            }
        }

        $scope.GetFavouriteHospital_callback = function(data) {
            $scope.fetchHospital = true;
            // $scope.hideLoader();
            if (data != null && data != []) {
                $scope.session_variables.array_fav_hospitals = data;
                $scope.SaveInLocalStorage($scope.localStorageKeys.HOSPITAL_LIST, JSON.stringify(data));
            } else {
                $scope.showAlertWindow_Titled("Sorry", "No data");
            }
        }//end 



        $scope.getLovedOneList = function() {
            if (!$scope.session_variables.lovedone_list) {
                $scope.getLovedOneList_main($scope.getLovedOneList_callback);
            } else {
                $scope.getLovedOneList_callback($scope.session_variables.lovedone_list);

            }

        }//end

        $scope.getLovedOneList_callback = function(data) {
            $scope.fetchLovedOne = true;
            if (JSON.stringify(data) != '[]') {
                $scope.session_variables.lovedone_list = data;
            } else {
                $scope.showAlertWindow_Titled("Sorry", "No loved one added");
            }
        }//end

        $scope.shareRecord = function() {
            if (!$scope.SubTenantId) {
                $scope.showAlertWindow_Titled("Sorry", "Please select a subtnant from which you want to share record");
                return;
            }
            if (!$scope.SharedSubTenantId && !$scope.shareData.shareToEmail) {
                $scope.showAlertWindow_Titled("Sorry", "Please select a subtnant to which you want to share record or enter email");
                return;
            }
            if (!$scope.shareData.RecNatureId) {
                $scope.showAlertWindow_Titled("Sorry", "Please select a record nature of which you want to share record");
                return;
            }

            $scope.showLoader("Please wait...");
            $scope.requestData = {};
            $scope.data = {};
            //"MRNO":2064, "UserRoleId":1551, "SubTenantId":203, "SharedSubTenantId":215, "RecNatureId":1, "Status":1
            $scope.requestData.oUserPrivacySharings = [];
            $scope.data.UserRoleID = '' + $scope.session_variables.selectedLovedOne.User_Id;
            $scope.data.MRNO = '' + $scope.session_variables.selectedLovedOne.Lovedones_mcura_id;
            $scope.data.SubTenantId = '' + $scope.SubTenantId;
            $scope.data.SharedSubTenantId = '' + $scope.SharedSubTenantId;
            $scope.data.RecNatureId = '' + $scope.shareData.RecNatureId;
            $scope.data.Status = '' + $scope.session_variables.selectedLovedOne.Loved_ones__access_type_id;
            $scope.requestData.oUserPrivacySharings.push($scope.data);
            $scope.requestData.email = '' + $scope.shareData.shareToEmail;
            //alert($scope.shareData.RecNatureId);
            //alert(JSON.stringify($scope.requestData));
            generic_http_post_service.getDetails(generic_http_post_service.getServices().USER_PRIVACY_SHARING_INSERT,
                $scope.requestData, $scope.shareRecord_callback);
        }//end



        $scope.shareRecord_callback = function(data) {
            $scope.hideLoader();
            if (data.success == 1) {
                $scope.showAlertWindow_Titled('Success', "Records shared", $scope.closeModal);
            } else {
                $scope.showAlertWindow_Titled('Error', "Some error occured");
            }
        }

    });
