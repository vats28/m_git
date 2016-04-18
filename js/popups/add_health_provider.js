angular.module('starter.addHealthProvider', [])

    .controller('addHealthProviderCtrl', function ($scope,generic_camera_service, generic_http_post_service,fileTransfer) {

        $scope.session_variables.facility_type_list = [
            {
                id: 1,
                type: "Doctor"
            },
            {
                id: 2,
                type: "Lab"
            },
            {
                id: 3,
                type: "Clinic"
            },
            {
                id: 4,
                type: "Pharmacy"
            },
            {
                id: 5,
                type: "Therapist"
            },
        ];

        $scope.showCameraOption = function () {
            $scope.IsShowCamButton = true;
        }//end 
        
          $scope.takePicture = function () {
            $scope.IsShowCamButton = false;
            generic_camera_service.callCamera($scope.takePicture_callback, '240px',  '320px');
        }

        $scope.openGallery = function () {
            $scope.IsShowCamButton = false;
            generic_camera_service.callGallery($scope.takePicture_callback);
        }
        
        $scope.takePicture_callback = function (data, err) {
            if (data == -1) {
                $scope.showAlertWindow_Titled("oh ohh", err);
                return;
            }
            $scope.profilePic = data;
            $scope.uploadMedicalRecord();
        }
        
          $scope.uploadMedicalRecord = function () {
            $scope.showProgressLoader();
            try {


                var options = new FileUploadOptions();
                options.fileKey = "file";
                options.fileName = 'temp.jpeg';//$scope.reg.profilePic.substr($scope.reg.profilePic.lastIndexOf('/') + 1);
                options.mimeType = "image/jpeg";
                options.chunkedMode = true;

                var params = {};
                //params.MRNO = "12";

                options.params = params;
                fileTransfer.uploadFile($scope.fileupload_callback, generic_http_post_service.getServices().UPLOAD_PAT_IMAGE,
                    $scope.profilePic, options);

            } catch (error) {
                alert(error);
            }
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
                $scope.profilePicPath = data.response.filepath;
                $scope.hideLoader();

            }
        }//end fileupload callback
        
    });
