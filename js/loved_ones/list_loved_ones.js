angular.module('starter.listLoved', [])

    .controller('listLovedCtrl', function($scope, generic_http_post_service, date_picker) {

        $scope.array_list_lovedones = [
            {
                id: 1,
                name: "Aish Gupta",
                age: "24",
                sex: "F",
                relation: "Daughter",
                last: "01/04/15 - Dr.Mala",
                next: "10/04/15 - ECG",
                drug: "BP-1/7-90/100 | BG-1/5-145",
                image: "img/aish.jpg",
                email: "aish@a.com",
                phone: "978989990",

            },
            {
                id: 2,
                name: "Amit Jain",
                age: "36",
                sex: "M",
                relation: "Brother",
                last: "05/05/15 - Dr.Vishwas",
                next: "10/05/15 - ECG",
                drug: "BP-1/7-80/100 | BG-1/5-145",
                image: "img/akshay.jpg",
                email: "aish@a.com",
                phone: "978989990",

            },
            {
                id: 3,
                name: "Ritesh Agrawal",
                age: "43",
                sex: "M",
                relation: "Cousin",
                last: "01/04/15 - Dr.Bharti",
                next: "10/04/15 - ECG",
                drug: "BP-1/7-90/100 | BG-1/5-145",
                image: "img/salman.jpg",
                email: "aish@a.com",
                phone: "978989990",

            },
            {
                id: 4,
                name: "Nisha Sharma",
                age: "21",
                sex: "F",
                relation: "Daughter",
                last: "01/04/15 - Dr.Sunitha",
                next: "10/04/15 - ECG",
                drug: "BP-1/7-90/100 | BG-1/5-145",
                image: "img/dipika.jpg",
                email: "aish@a.com",
                phone: "978989990",

            },
        ];

        $scope.temp= {};
        $scope.init = function(){
            $scope.getLovedOneList();
        }//edn

        $scope.getLovedOneList = function() {
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
    });
