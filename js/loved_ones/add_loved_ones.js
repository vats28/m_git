angular.module('starter.addLoved', []).controller('addLovedCtrl', [
  '$scope',
  'generic_http_post_service',
  'date_picker',
  '$rootScope',
  function ($scope, generic_http_post_service, date_picker, $rootScope) {
    $scope.temp = {};
    $scope.temp.access = {};
    $scope.temp.dob = '2001-10-28';
    $scope.setGender = function (value) {
      // alert(JSON.stringify(value));
      $scope.temp.gender = value;
    };
    $scope.init = function () {
      //1 get relation list if stored in memory
      var relationList = null;
      try {
        relationList = JSON.parse($scope.GetInLocalStorage($scope.localStorageKeys.RELATION_LIST));
      } catch (error) {
        alert(error);
      }
      if (relationList) {
        $scope.temp.relation_list = relationList;
      } else {
        $scope.getRelation($scope.GetRelation_callback);
      }  //2 if relation list not stored then call it from server
    };
    //end
    $scope.GetRelation_callback = function (data) {
      $scope.hideLoader();
      //alert(JSON.stringify(data));
      if (data != null && data != []) {
        $scope.temp.relation_list = data;
        $scope.SaveInLocalStorage($scope.localStorageKeys.RELATION_LIST, JSON.stringify(data));
      } else {
        $scope.showAlertWindow_Titled('Sorry', 'No data');
      }
    };
    $scope.addLovedOnes = function () {
      try {
        if (!$scope.temp.name) {
          $scope.showAlertWindow_Titled('Error', 'Please enter name');
          return;
        }
        if (!$scope.temp.dob) {
          $scope.showAlertWindow_Titled('Error', 'Please enter date of birth');
          return;
        }
        if (!$scope.temp.gender) {
          $scope.showAlertWindow_Titled('Error', 'Please enter gender');
          return;
        }
        if (!$scope.temp.email) {
          $scope.showAlertWindow_Titled('Error', 'Please enter email');
          return;
        }
        if (!$scope.temp.mobile) {
          $scope.showAlertWindow_Titled('Error', 'Please enter phone/mobile');
          return;
        }
        if (!$scope.temp.relation_id) {
          $scope.showAlertWindow_Titled('Error', 'Please select relation');
          return;
        }
        if (!$scope.temp.access_type_id) {
          $scope.showAlertWindow_Titled('Error', 'Please select access authentication');
          return;
        }
        //{"UserPrimaryRoleID":"1551","LovedoneName":"SUNEEL KUMAR PANDEY",
        //    "LovedoneDOB":"07/07/1985", "GenderID":"1", "IsDependent":"1",
        //    "RelationshipID": "1", "LovedoneEmail":"pandey.suneel@gmail.com",
        //    "LovedoneMobile":"9313808620", "LovedAccessTypeid":"1"}
        $scope.showLoader('Fetching data...');
        $scope.requestData = {};
        $scope.requestData.UserPrimaryRoleID = '' + $scope.session_variables.login_data.userroleid;
        $scope.requestData.LovedoneName = '' + $scope.temp.name;
        $scope.requestData.LovedoneDOB = date_picker.getDateInFormat($scope.temp.dob, 'yyyy/mm/dd');
        $scope.requestData.GenderID = '' + $scope.temp.gender;
        $scope.requestData.IsDependent = '' + $scope.convertBoolToNum($scope.temp.dependent);
        $scope.requestData.RelationshipID = '' + $scope.temp.relation_id;
        $scope.requestData.LovedoneEmail = '' + $scope.temp.email;
        $scope.requestData.LovedoneMobile = '' + $scope.temp.mobile;
        $scope.requestData.LovedAccessTypeid = $scope.temp.access_type_id;
        //'' + $scope.convertBoolToNum($scope.temp.access.one)+','
        //+ $scope.convertBoolToNum($scope.temp.access.two)+','
        //+ $scope.convertBoolToNum($scope.temp.access.three)+','
        //+ $scope.convertBoolToNum($scope.temp.access.four);
        //  alert(JSON.stringify($scope.requestData));
        generic_http_post_service.getDetails(generic_http_post_service.getServices().REGISTER_LOVEDONE, $scope.requestData, $scope.addLovedOnes_callback);
      } catch (error) {
        alert(error);
        $scope.hideLoader();
      }
    };
    //end
    $scope.addLovedOnes_callback = function (data) {
      $scope.hideLoader();
      //alert(JSON.stringify(data));
      if (data.success == '1') {
        //$scope.temp = {};
        //$scope.temp.access ={};
        $scope.showAlertWindow_Titled('Success', 'New lovedone added successfully', $scope.goBackScreen);
        $rootScope.$broadcast('lovedOneAdded', 'success');
      } else {
        $scope.showAlertWindow_Titled('Sorry', data.msg);
      }
    };
    //end
    $scope.convertBoolToNum = function (value) {
      var retval = 0;
      if (value)
        retval = 1;
      return retval;
    };
    $scope.getDateWithMonthName = function (dateString) {
      return date_picker.getDateWithMonthName(dateString);
    };
    //end
    $scope.pickDob = function () {
      var allowOld = true;
      var allowFuture = false;
      date_picker.getDate('date', $scope.pickDob_callback, allowOld, allowFuture);
    };
    $scope.pickDob_callback = function (data) {
      $scope.temp.dob = data.currDate;
    };
  }
]);