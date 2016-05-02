angular.module('starter.listLoved', [])

    .controller('listLovedCtrl', function ($scope, generic_http_post_service, date_picker, $rootScope) {

        $scope.temp = {};
        $scope.progressDone = false;
        $scope.init = function () {
            $scope.progressDone = false;
            $scope.getLovedOneList();
        }//edn
        
        $rootScope.$on('lovedOneAdded', function(event, data) { 
            //alert('here');
            $scope.getLovedOneList_main($scope.getLovedOneList_callback);
        });
        
        

        $scope.getLovedOneList = function () {
            $scope.temp.lovedone_list = [];
            // $scope.showLoader("Fetching data...");
            // try {
            //     $scope.requestData = {};
            //     $scope.requestData.UserPrimaryRoleID = ''+$scope.session_variables.login_data.userroleid;
            //     //alert(generic_http_post_service.getServices().GET_HEALTH_CONDITION_TYPE);
            //     generic_http_post_service.getDetails_httpget(generic_http_post_service.getServices().GET_LOVEDONE,
            //         $scope.requestData, $scope.getLovedOneList_callback);
            // } catch (error) {
            //     $scope.hideLoader();
            //     alert(error);
            // }
            
            
            var array_loved_one = null;
            try {
                array_loved_one = JSON.parse($scope.GetInLocalStorage($scope.localStorageKeys.LOVED_ONE_LIST));
            } catch (error) { }

            if (!array_loved_one) {
                $scope.getLovedOneList_main($scope.getLovedOneList_callback);
            } else {
                $scope.session_variables.array_loved_one = array_loved_one;
                $scope.getLovedOneList_callback($scope.session_variables.array_loved_one);
            }
        }//end

        $scope.getLovedOneList_callback = function (data) {
            // $scope.hideLoader();
            //  alert(JSON.stringify(data));
          
            $scope.progressDone = true;
            
            if(data.success == 0){
                return;
            }
            
            if (JSON.stringify(data) != '[]') {
                $scope.temp.lovedone_list = data;                
                $scope.SaveInLocalStorage($scope.localStorageKeys.LOVED_ONE_LIST, JSON.stringify($scope.temp.lovedone_list));
            } else {
                $scope.temp.lovedone_list = null;
                // $scope.showAlertWindow_Titled("Sorry", "No data");
            }
        }

        //$scope.getAge = function(dateString){
        //    var retval = '-NA-';
        //    try {
        //        var arr = (dateString.substring(0, 9)).split('/');
        //        retval = date_picker.getAge(arr[0], arr[1], arr[2]);//function(date, month, year) {
        //    }catch(error){
        //        alert(error);
        //    }
        //    return retval;
        //}
        
        $scope.call = function (number) {
            $scope.showConfirm('Are you sure?', 'Call this number<br/>' + number, number, $scope.call_callback);
        }

        $scope.call_callback = function (number) {
            launchCall(number);
        }

        $scope.email = function (email) {
            $scope.showConfirm('Are you sure?', 'Email this to<br/>' + email, email, $scope.email_callback);
        }

        $scope.email_callback = function (email) {
            launchMail(email);
        }

        $scope.showMedicalChart = function () {
            $scope.showAlertWindow_Titled('Sorry', 'No medical chart found for this one');
        }

        $scope.openMedicalRecord = function (item) {
            console.log(JSON.stringify(item));
            $scope.session_variables.selected_lovedone = item;
            $scope.jumpTo('app.medical_records_loved_one');
        }//ned 
        
        
        $scope.showShareModal = function (item) {
            $scope.session_variables.selectedLovedOne = item;
            // alert(JSON.stringify($scope.session_variables.selectedLovedOne));
            $scope.showModal('templates/popups/shareRecords.html');
        }
    });
