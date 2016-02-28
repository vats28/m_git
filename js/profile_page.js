angular.module('starter.profilePage', [])
    .controller('profilePageCtrl', function ($scope, $timeout, $ionicModal,
        generic_http_post_service, date_picker, form_validator, generic_camera_service, fileTransfer) {
        $scope.x = {};
        $scope.x.IsloggedIn = true;
        // $scope.session_variables.username = 'ravi@gmail.com';
        // $scope.session_variables.password = '123';
        $scope.init = function () {
            try {
                //alert($scope.userData.name);
            } catch (err) {
                //alert(err);
                $scope.showLoginBox();
            }
        }

        $scope.showLoginBox = function () {
            $timeout(function () {
                //alert('timeout');
                $scope.x.IsloggedIn = false; //close the popup after 3 seconds for some reason
            }, 200);
        }


        $scope.doLogin = function () {
            //alert('wcdw');
            try {
                if (!$scope.session_variables.username) {
                    $scope.showAlertWindow_Titled('Sorry', 'Please enter username or email-id');
                    return;
                }
                if (!$scope.session_variables.password) {
                    $scope.showAlertWindow_Titled('Sorry', 'Please enter password');
                    return;
                }
            } catch (error) {
                alert(error);
            }

            $scope.showLoader("Logging in...");
            $scope.requestData = {};
            $scope.requestData.username = $scope.session_variables.username;
            $scope.requestData.pwd = '' + $scope.session_variables.password;
            generic_http_post_service.getDetails(generic_http_post_service.getServices().LOGIN, $scope.requestData, $scope.doLogin_callback);
        };//end doLogin

        $scope.doLogin_callback = function (data) {
            $scope.hideLoader();
            //$scope.jumpTo('app.medical_records');
            //return;
            //alert(JSON.stringify(data));
            if (data.success == 1) {
                $scope.session_variables.isLoggedIn = false;
                $scope.session_variables.login_data = data;

                //store login credentials

                try {
                    $scope.SaveLoginCredential(JSON.stringify(data))
                } catch (error) {
                    alert(error)
                }
                ;


                $scope.clearHistory();
                $scope.disableBack();
                $scope.jumpTo('app.medical_records');
            } else {
                $scope.showAlertWindow_Titled("Error", data.msg, null, null);
            }
        }


        
        //$scope.userData.profilePic = "img/a_logo.png";
        //$scope.userData.dob = '2010-10-16';//17/06/2014';// "mmm dd, yyyy";
        // $scope.userData.gender = 1;
       
       
        
        
        $scope.setGender = function (value) {
            // alert(JSON.stringify(value));
            $scope.userData.gender = value;
        }
        //$scope.getAge = function (dateString) {
        //    var retval = 'Invalid';
        //    try {
        //        var dateArr = dateString.split('/');
        //        retval = date_picker.getAge()
        //    } catch (error) {
        //
        //    }
        //    return
        //}


        $scope.doProfileUpdate = function () {

            try {
                if (!$scope.userData.name) {
                    $scope.showAlertWindow_Titled('Sorry', 'Please enter your name');
                    return;
                }
                if (!$scope.userData.dob) {
                    $scope.showAlertWindow_Titled('Sorry', 'Please enter dob');
                    return;
                }

                if (!form_validator.IsValidPhoneNumber($scope.userData.mobile)) {

                    $scope.showAlertWindow_Titled('Sorry', 'Please enter valid mobile number');
                    return;
                }
                if (!$scope.userData.gender) {
                    $scope.showAlertWindow_Titled('Sorry', 'Please select a gender');
                    return;
                }
                if (!form_validator.IsValidEmail($scope.userData.email)) {
                    $scope.showAlertWindow_Titled('Sorry', 'Please enter valid email');
                    return;
                }
                if (!$scope.userData.pass) {
                    $scope.showAlertWindow_Titled('Sorry', 'Please enter password');
                    return;
                }
                if (!$scope.userData.cfm_pass) {
                    $scope.showAlertWindow_Titled('Sorry', 'Please enter verify password');
                    return;
                }
                if ($scope.userData.cfm_pass != $scope.userData.pass) {
                    $scope.showAlertWindow_Titled('Sorry', 'Value in verify password and password box should be same');
                    return;
                }

                // if (!$scope.userData.profilePic) {
                //     $scope.showAlertWindow_Titled('Sorry', 'Please upload image');
                //     return;
                // }
                $scope.showLoader("Please wait...");
                $scope.requestData = {};
                $scope.requestData.patName = $scope.userData.name;
                $scope.requestData.DOB = $scope.userData.dob;//yyyy-mm-dd
                $scope.requestData.subTenantId = "0";
                $scope.requestData.genderId = '' + $scope.userData.gender;
                $scope.requestData.areaId = "0";
                $scope.requestData.mobile = '' + $scope.userData.phone;
                $scope.requestData.uName = $scope.userData.email;
                $scope.requestData.pwd = '' + $scope.userData.pass;


                //alert(generic_http_post_service.getServices().PAT_REGISTER);
                //alert(JSON.stringify($scope.requestData));
                generic_http_post_service.getDetails(generic_http_post_service.getServices().PAT_REGISTER, $scope.requestData, $scope.doRegistration_callback);

            } catch (error) {
                alert(error);
            }

        };//end doLogin

        $scope.doRegistration_callback = function (data) {
            $scope.hideLoader();
            //alert(JSON.stringify(data));
            try {
                $scope.session_variables.login_data = {};
                if (data.success == 1) {

                    $scope.session_variables.login_data.userid = data.userId;

                    //store login credentials
                    //$scope.SaveLoginCredential(JSON.stringify(data));

                    $scope.showAlertWindow_Titled("Success", data.msg, $scope.showRecordsAfterRegister, null);

                } else {
                    $scope.showAlertWindow_Titled("Error", data.msg, null, null);
                }
            } catch (error) {
                alert(error);
            }
        }

        $scope.showRecordsAfterRegister = function () {
            $scope.clearHistory();
            $scope.disableBack();
            $scope.closeRegisterModal();
            $scope.jumpTo('app.medical_records');
        }


        $scope.pickDob = function () {
            var allowOld = true;
            var allowFuture = false;
            date_picker.getDate('date', $scope.pickDob_callback, allowOld, allowFuture);
        };
        $scope.pickDob_callback = function (data) {
            var format = "dd/mm/yyyy";
            //$scope.userData.dob = date_picker.getDateInFormat(data.currDate, format);
            $scope.userData.dob = data.currDate;
        }


        $scope.userData.IsShowCamButton = false;
        $scope.showCameraOption = function () {
            $scope.userData.IsShowCamButton = true;
            // $scope.templateUrl('Please select', "templates/popups/pickImage.html", $scope);
        }//end 

        
        $scope.takePicture = function () {
            $scope.userData.IsShowCamButton = false;
            generic_camera_service.callCamera($scope.takePicture_callback);
        }

        $scope.openGallery = function () {
            $scope.userData.IsShowCamButton = false;
            generic_camera_service.callGallery($scope.takePicture_callback);
        }

        $scope.takePicture_callback = function (data, err) {
            if (data == -1) {
                $scope.showAlertWindow_Titled("oh ohh", err);
                return;
            }
            $scope.userData.profilePic = data;
            $scope.uploadMedicalRecord();
        }


        $scope.getDateWithMonthName = function (dateString) {
            if (dateString.indexOf('/') != 1) {
                var arr = dateString.substring(0, 10).split('/');
                dateString = arr[2] + '-' + arr[0] + '-' + arr[1];
                // alert(dateString);
            }
            return date_picker.getDateWithMonthName(dateString);
        }

        $scope.uploadMedicalRecord = function () {
            $scope.showProgressLoader();
            try {


                var options = new FileUploadOptions();
                options.fileKey = "file";
                options.fileName = 'temp.jpeg';//$scope.userData.profilePic.substr($scope.userData.profilePic.lastIndexOf('/') + 1);
                options.mimeType = "image/jpeg";
                options.chunkedMode = true;

                var params = {};
                //params.MRNO = "12";
                //params.UserRoleID = '' + $scope.session_variables.login_data.userroleid;

                options.params = params;
                fileTransfer.uploadFile($scope.fileupload_callback, generic_http_post_service.getServices().UPLOAD_PAT_IMAGE,
                    $scope.userData.profilePic, options);

            } catch (error) {
                alert(error);
            }
            // var ft = new FileTransfer();
            // ft.upload($scope.userData.profilePic, encodeURI(generic_http_post_service.getServices().FILE_UPLOAD), 
            //             $scope.fileupload_callback, $scope.fileupload_callback, options);
        }//end upload rec
        
        
        $scope.fileupload_callback = function (data, subData) {
            
            //data = data.response;
            //alert(JSON.stringify(data + ' ' + subData));
            if (data == -1) {
                $scope.showAlertWindow_Titled("Error", subData);
                $scope.hideLoader();
            }
            else if (data == -2) {
                //$scope.showAlertWindow_Titled("Progress ", subData + '%');
                $scope.session_variables.progressText = 'progress ' + subData + '%';
                // $scope.hideLoader();
            } else {
                data.response = JSON.parse(data.response);
                $scope.afterSuccessfullUpload(data.response.filepath);
            }
        }//end fileupload 
        
            
        $scope.afterSuccessfullUpload = function (filepath) {
            $scope.showLoader("Updating record");
            $scope.requestData = {};
            $scope.requestData.PatDemoid = '' + $scope.session_variables.login_data.patdemoid;
            $scope.requestData.UserRoleID = '' + $scope.session_variables.login_data.userroleid;
            $scope.requestData.ProfileFilePath = '' + filepath;
            $scope.filepath  =filepath;
           // alert(JSON.stringify($scope.requestData));
            generic_http_post_service.getDetails(generic_http_post_service.getServices().UPDATE_PAT_IMAGE,
                $scope.requestData, $scope.afterSuccessfullUpload_callback);


        }

        $scope.afterSuccessfullUpload_callback = function (data) {
            $scope.hideLoader();
            if (data.success == 1) {
                $scope.userData.profFilePath =  $scope.filepath;
                $scope.showAlertWindow_Titled("Success", "File uploaded");
            } else {
                $scope.showAlertWindow_Titled("Error", data.msg);
            }
        }//end 

    });






