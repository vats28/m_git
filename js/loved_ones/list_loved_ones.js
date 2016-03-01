angular.module('starter.listLoved', [])

    .controller('listLovedCtrl', function($scope, generic_http_post_service, date_picker) {

        $scope.temp= {};
        $scope.init = function(){
            $scope.getLovedOneList();
        }//edn
        
        

        $scope.getLovedOneList = function() {
             $scope.temp.lovedone_list = [];
            $scope.showLoader("Fetching data...");
            try {
                $scope.requestData = {};
                $scope.requestData.UserPrimaryRoleID = ''+$scope.session_variables.login_data.userroleid;
                //alert(generic_http_post_service.getServices().GET_HEALTH_CONDITION_TYPE);
                generic_http_post_service.getDetails_httpget(generic_http_post_service.getServices().GET_LOVEDONE,
                    $scope.requestData, $scope.getLovedOneList_callback);
            } catch (error) {
                $scope.hideLoader();
                alert(error);
            }
        }//end

        $scope.getLovedOneList_callback = function (data) {
            $scope.hideLoader();
          //  alert(JSON.stringify(data));
            if (JSON.stringify(data) != '[]') {
                $scope.temp.lovedone_list = data;
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
        
        $scope.call = function(number){
            $scope.showConfirm('Are you sure?','Call this number<br/>'+ number, number,  $scope.call_callback);
        }

        $scope.call_callback = function(number){
            launchCall(number);
        }

        $scope.email = function(email){
            $scope.showConfirm('Are you sure?','Email to this<br/>'+ email, email, $scope.email_callback);
        }

        $scope.email_callback = function(email){
            launchMail(email);
        }

        $scope.showMedicalChart = function(){
            $scope.showAlertWindow_Titled('Sorry','No medical chart found for this one');
        }
        
        $scope.openMedicalRecord = function(item){
            $scope.session_variables.selected_lovedone = item;
            $scope.jumpTo('app.medical_records_loved_one');
        }//ned 
    });
