angular.module('starter.mediRec', [])

    .controller('mediRecCtrl', function ($scope, $timeout, $ionicModal, $cordovaMedia, $ionicLoading,
        $ionicPopup, generic_http_post_service,
        date_picker, form_validator, fileTransfer, audio_service, generic_camera_service,
        native_play_audio) {


        $scope.recNatureIcons = Object.freeze({
            LAB: 'ion-ios-flask-outline',
            NOTE: 'ion-ios-paper-outline',
            IMAGE: 'ion-ios-photos-outline',
        });


        $scope.array_list = {};


        $scope.init = function () {

            //$scope.session_variables.isLoggedIn = true;
            $scope.getUserData();
        }

        $scope.getUserData = function () {
            $scope.showLoader("Fetching details...");
            // alert(JSON.stringify($scope.session_variables.login_data));
            $scope.requestData = {};
            $scope.requestData.userId = $scope.session_variables.login_data.userid;
            generic_http_post_service.getDetails_httpget(generic_http_post_service.getServices().GET_PAT_DETAILS,
                $scope.requestData, $scope.getUserData_callback);
        }

        $scope.getUserData_callback = function (data) {
            $scope.hideLoader();
            //alert(JSON.stringify(data));
            if (data.success == 1) {
                $scope.array_list = data;
                $scope.session_variables.profFilePath = data.profFilePath;
                $scope.session_variables.name = data.name;
                $scope.session_variables.gender = data.gender;
                $scope.session_variables.login_data.mrno = data.mrno;
                $scope.session_variables.login_data.patdemoid = data.patdemoid;
                
                //for profileupdate page
                $scope.userData.name = data.name;

                if (data.profFilePath) {//getHost
                    if (data.profFilePath.indexOf('http:') == -1) {// means string doesn't contain urlhost
                        $scope.userData.profFilePath = generic_http_post_service.getHost() + data.profFilePath;
                    } else {
                        $scope.userData.profFilePath = data.profFilePath;
                    }
                    //console.log($scope.userData.profFilePath);
                }

                $scope.userData.gender = data.gender;
                $scope.userData.mrno = data.mrno;
                $scope.userData.dob = data.DOB;
                $scope.userData.mobile = data.ContactDetails.mobile;
                $scope.userData.email = data.ContactDetails.email;
                //userData.email
                if (data.gender.toLowerCase() == "male") {
                    $scope.userData.gender = 1;
                } else if (data.gender.toLowerCase() == "female") {
                    $scope.userData.gender = 2;
                } else {
                    $scope.userData.gender = 3;
                }

            } else {
                $scope.showAlertWindow_Titled("Error", data.msg, null, null);
            }
        }


        /*
         * if given group is the selected group, deselect it
         * else, select the given group
         */
        $scope.toggleGroup = function (group) {
            group.show = !group.show;
        };
        $scope.isGroupShown = function (group) {
            if (group)
                return group.show;
        };


        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/medical_records/popovers/add_medical_records.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Open the login modal
        $scope.showAddMedRecModel = function () {
            $scope.modal.show();
        };

        // Triggered in the login modal to close it
        $scope.closeAddMedRecModel = function () {
            $scope.modal.hide();
        };


        // Perform the login action when the user submits the login form
        $scope.onAddRecSelect = function (index) {

            $timeout(function () {
                $scope.closeAddMedRecModel();
            }, 1000);
        };


        //this section for image-capture/pick-image
        $scope.showUploadOption = function () {
            $scope.showGenericImageUploadSheet($scope.showUploadOption_callback);
        }

        $scope.showUploadOption_callback = function (data, err) {
            if (data == -1) {
                $scope.showAlertWindow_Titled(null, err);
                return;
            }
            //alert('showUploadOption_callback');

        }


        //this section for gallery
        $scope.openGallery = function () {
            generic_camera_service.callGallery($scope.openGallery_callback);
        }

        $scope.openGallery_callback = function (data, err) {
            if (data == -1) {
                $scope.showAlertWindow_Titled(null, err);
                return;
            }
            alert(JSON.stringify(data));
            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = 'temp.jpeg';//$scope.reg.profilePic.substr($scope.reg.profilePic.lastIndexOf('/') + 1);
            options.mimeType = "image/jpeg";
            options.chunkedMode = true;
            $scope.uploadMedicalRecord(options, data);

        }
        //this section for camera
        $scope.openCamera = function () {
            generic_camera_service.callCamera($scope.openCamera_callback);
        }

        $scope.openCamera_callback = function (data, err) {
            if (data == -1) {
                $scope.showAlertWindow_Titled("oh ohh", err);
                return;
            }
            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = 'temp.jpeg';//$scope.reg.profilePic.substr($scope.reg.profilePic.lastIndexOf('/') + 1);
            options.mimeType = "image/jpeg";
            options.chunkedMode = true;
            $scope.uploadMedicalRecord(options, data);

        }
        //this section for video-capture
        $scope.openVideo = function () {
            generic_camera_service.callVideo($scope.openVideo_callback);
        }

        $scope.openVideo_callback = function (data, err) {

            if (data == -1) {
                $scope.showAlertWindow_Titled("Sorry", err.message);
                return;
            }
            //alert(JSON.stringify(data));
            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = 'temp.mp4';//$scope.reg.profilePic.substr($scope.reg.profilePic.lastIndexOf('/') + 1);
            options.mimeType = "video/mp4";
            options.chunkedMode = true;
            alert(data[0].fullPath);
            $scope.uploadMedicalRecord(options, data[0].fullPath);
        }


        //this section for video-capture
        $scope.recordAudio = function () {
            //$scope.onShowAudioRecorder($scope.recordAudio_callback);
            audio_service.callAudioRecorder($scope.recordAudio_callback);
        }

        $scope.recordAudio_callback = function (data, err) {
            if (data == -1) {
                $scope.showAlertWindow_Titled("Sorry", err.message);
                return;
            }
            //alert(JSON.stringify(data));
            var fullPath = data[0].fullPath;
            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = "temp.mp3";//fullPath.substr(fullPath.lastIndexOf('/') + 1);
            options.mimeType = "audio/mp3";
            options.chunkedMode = true;
            // alert(data[0].fullPath);
            $scope.uploadMedicalRecord(options, fullPath);
        }


        $scope.session_variables.my_rec_nature = "";



        $scope.GetMedicalRecordNature = function () {
            $scope.showLoader("Fetching data...");
            $scope.requestData = {};
            generic_http_post_service.getDetails_httpget(generic_http_post_service.getServices().GET_MEDICAL_RECORD_NATURE,
                $scope.requestData, $scope.GetMedicalRecordNature_callback);
        }

        $scope.GetMedicalRecordNature_callback = function (data) {
            $scope.hideLoader();
            if (data != null && data != []) {
                $scope.session_variables.array_rec_nature = data;

                $scope.showAddMedRecPopup();
            } else {
                $scope.showAlertWindow_Titled("Sorry", "No data");
            }
        }

        $scope.showAddMedRecPopup = function () {


            $ionicPopup.show({
                template: //'<div class="card list" >' +
                '<div class="list">' +
                '<select ng-model="session_variables.my_rec_nature" class="select-center-100"  >' +
                '<option value="">-- select record nature --</option>' +
                '<option ng-repeat="item in session_variables.array_rec_nature" value="{{item.RecNatureId}}">' +
                '{{item.RecNatureProperty}}' +
                '</option>' +
                '</select>' +
                '</div>' +
                // '</div>' +
                '<div class=" list popu" >' +

                '<div class="item tabs tabs-secondary  stable-bg tabs-icon-top height-60">' +
                '<a class="tab-item" ng-click="openCamera()" >' +
                '<i class="icon ion-camera "></i> Capture Image' +

                '</a>' +
                '<a class="tab-item" ng-click="openVideo()" >' +
                '<i class="icon ion-ios-videocam " ></i> Capture Video' +

                '</a>' +
                '</div>' +
                '</div>' +

                '<div class=" list popu" >' +

                '<div class="item tabs tabs-secondary  stable-bg tabs-icon-top height-60" >' +
                '<a class="tab-item" >' +
                '<i class="icon ion-aperture " ng-click="openGallery()"></i>Gallery' +

                '</a>' +
                '<a class="tab-item"  >' +
                '<i class="icon ion-music-note " ng-click="recordAudio()"></i> Record Audio' +

                '</a>' +
                '</div>' +
                '</div>' +

                '<div class=" list popu" >' +

                '<div class="item tabs tabs-secondary  stable-bg tabs-icon-top height-60">' +
                '<a class="tab-item"  >' +
                '<i class="icon ion-android-textsms " ng-click="writeText()"></i>Text Written' +

                '</a>' +
                '<a class="tab-item" >' +
                '<i class="icon ion-bag " ng-click="uploadData()"></i>Data' +

                '</a>' +
                '</div>' +
                '</div>',
                /*   templateUrl: 'templates/medical_records/popovers/add_medical_records.html',*/
                title: 'Add Medical Record',
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancel',
                        type: 'button-dark',
                        onTap: function (e) {

                            return false;
                        }
                    },
                ]
            }).then(function (res) {


            });
        }//end method
        
        
        $scope.uploadData = function () {
            $scope.showAlertWindow_Titled('Coming soon', 'Feature will be added in later version');
        }
        $scope.uploadFile = function () {
            $scope.showAlertWindow_Titled('Coming soon', 'Feature will be added in later version');
        }
        $scope.writeText = function () {
            $scope.showAlertWindow_Titled('Coming soon', 'Feature will be added in later version');
        }


        $scope.medRec_temp = {};
        $scope.medRec_temp.myvitals = {};
        $scope.validationClass = Object.freeze({
            ERROR: 'ion-asterisk assertive',
            OK: 'ion-checkmark balanced'/*'ion-thumbsdown energized'*/
        });
        $scope.showAddVitalPopup = function () {


            $ionicPopup.show({
                template: '<div class="card list" >' +
                '<div class="item">' +
                '<select ng-model="medRec_temp.myvitals.id" style="width: 100%"  >' +
                '<option value="">-- select vital type --</option>' +
                '<option ng-repeat="item in session_variables.array_rec_nature" value="{{item.id}}">' +
                '{{item.name}}' +
                '</option>' +
                '</select>' +
                '</div>' +
                '</div>' +
                '<div class="card list" >' +
                '<form >' +

                '<label class="item item-input" >' +
                '<input type="text"  data-ng-model="medRec_temp.myvitals.reading"  placeholder="Reading">' +
                '<i class="{{ validationClass.ERROR }}" ng-if ="!medRec_temp.myvitals.reading"></i>' +
                '</label>' +
                '<label class="item item-input">' +
                '<input type="text" data-ng-model="medRec_temp.myvitals.other_info"  placeholder="Other Info">' +
                '</label>' +
                '<label class="item item-input">' +
                '<input type="text" data-ng-model="medRec_temp.myvitals.remarks"  placeholder="Remarks">' +
                '</label>' +
                '</form>' +
                '</div>',
                /*   templateUrl: 'templates/medical_records/popovers/add_medical_records.html',*/
                title: 'Add Vitals',
                scope: $scope,
                buttons: [

                    {
                        text: 'Save',
                        type: 'color_green',
                        onTap: function (e) {

                            if (!$scope.medRec_temp.myvitals.reading) {
                                //don't allow the user to close unless he enters all fields
                                //$scope.validateTextBoxes();
                                $scope.showAlertWindow_Titled('Sorry', 'Please provide all parameters');
                                e.preventDefault();
                            } else {
                                return $scope.medRec_temp.myvitals;
                            }
                        }
                    },
                    {
                        text: 'Cancel',
                        type: 'color_grey',
                        onTap: function (e) {

                            $scope.medRec_temp.myvitals = {};
                            return false;
                        }
                    },
                ]
            }).then(function (res) {


            });
        }//end method


        $scope.medRec_temp.mycontacts = {};


        $scope.GetRelation_showPopup = function () {
            $scope.showLoader("Fetching data...");
            $scope.requestData = {};
            $scope.requestData.UserRoleID = '' + $scope.session_variables.login_data.userroleid;
            //alert(generic_http_post_service.getServices().GET_HEALTH_CONDITION_TYPE);
            generic_http_post_service.getDetails_httpget(generic_http_post_service.getServices().GET_RELATIONSHIP_MASTER,
                $scope.requestData, $scope.GetRelation_showPopup_callback);
        }

        $scope.GetRelation_showPopup_callback = function (data) {
            $scope.hideLoader();
            //alert(JSON.stringify(data));
            if (data != null && data != []) {
                $scope.medRec_temp.mycontacts.array_relations = data;
                $scope.showEmerContPopup();
            } else {
                $scope.showAlertWindow_Titled("Sorry", "No data");
            }
        }
        
        //save emergency contact
        $scope.saveEmergencyContact = function () {
            $scope.showLoader('Please wait ...');
            //{"Name":"Sandeep","ContactNo":"9313808620", "ContactNo2":"0", "UserRoleID":"12",  "RelationshipID":"1"}
            $scope.requestData = {};
            $scope.requestData.Name = '' + $scope.medRec_temp.mycontacts.name;
            $scope.requestData.ContactNo = '' + $scope.medRec_temp.mycontacts.contact;
            $scope.requestData.ContactNo2 = '' + $scope.medRec_temp.mycontacts.additional;
            $scope.requestData.UserRoleID = '' + $scope.session_variables.login_data.userroleid;
            $scope.requestData.RelationshipID = '' + $scope.medRec_temp.mycontacts.relation_id;
            alert(JSON.stringify($scope.requestData));
            generic_http_post_service.getDetails(generic_http_post_service.getServices().POST_EMERGENCY_CONTACT,
                $scope.requestData, $scope.saveEmergencyContact_Callback);

        }

        $scope.saveEmergencyContact_Callback = function (data) {
            $scope.hideLoader();
            try {
                if (data.success == 1) {
                    $scope.showAlertWindow_Titled("Success", data.msg, $scope.init, null);
                } else {
                    $scope.showAlertWindow_Titled("Error", data.msg, null, null);
                }
            } catch (error) {
                alert(error);
            }
        }

        $scope.showEmerContPopup = function () {


            $ionicPopup.show({
                template: '<div class="card list" >' +
                '<div class="item">' +
                '<select ng-model="medRec_temp.mycontacts.relation_id" style="width: 100%"  >' +
                '<option value="">-- select relation --</option>' +
                '<option ng-repeat="item in medRec_temp.mycontacts.array_relations" value="{{item.Relationship_id}}">' +
                '{{item.Name}}' +
                '</option>' +
                '</select>' +
                '</div>' +
                '</div>' +
                '<div class="card list" >' +
                '<form >' +

                '<label class="item item-input" >' +
                '<input type="text"  data-ng-model="medRec_temp.mycontacts.name"  placeholder="Name">' +
                '<i class="{{ validationClass.ERROR }} input_icon_right" ng-if ="!medRec_temp.mycontacts.name"></i>' +
                '</label>' +
                '<label class="item item-input">' +
                '<input type="tel" maxlength="10" data-ng-model="medRec_temp.mycontacts.contact"  placeholder="Contact">' +
                '<i class="{{ validationClass.ERROR }} input_icon_right" ng-if ="!medRec_temp.mycontacts.contact"></i>' +
                '</label>' +
                '<label class="item item-input">' +
                '<input type="tel" maxlength="10" data-ng-model="medRec_temp.mycontacts.additional"  placeholder="Additional Contact">' +
                // '<i class="{{ validationClass.ERROR }} input_icon_right" ng-if ="!medRec_temp.mycontacts.additional"></i>' +
                '</label>' +
                '</form>' +
                '</div>',
                /*   templateUrl: 'templates/medical_records/popovers/add_medical_records.html',*/
                title: 'Add Emergency Contact',
                scope: $scope,
                buttons: [

                    {
                        text: 'Save',
                        type: 'button-assertive',
                        onTap: function (e) {
                            //!form_validator.IsValidPhoneNumber($scope.reg.mobile)
                            if (!$scope.medRec_temp.mycontacts.relation_id) {
                                //don't allow the user to close unless he enters all fields
                                //$scope.validateTextBoxes();
                                $scope.showAlertWindow_Titled('Sorry', 'Please select a relation from dropdown');
                                e.preventDefault();
                            } else if (!$scope.medRec_temp.mycontacts.name) {
                                //don't allow the user to close unless he enters all fields
                                //$scope.validateTextBoxes();
                                $scope.showAlertWindow_Titled('Sorry', 'Please enter name');
                                e.preventDefault();
                            } else if (!form_validator.IsValidPhoneNumber($scope.medRec_temp.mycontacts.contact)) {
                                //don't allow the user to close unless he enters all fields
                                //$scope.validateTextBoxes();
                                $scope.showAlertWindow_Titled('Sorry', 'Please enter valid contact no.');
                                e.preventDefault();
                            } else {
                                $scope.saveEmergencyContact();
                                return $scope.medRec_temp.mycontacts;
                            }
                        }
                    },
                    {
                        text: 'Cancel',
                        type: 'button-dark',
                        onTap: function (e) {

                            $scope.medRec_temp.mycontacts = {};
                            return false;
                        }
                    },
                ]
            }).then(function (res) {


            });
        }//end method


        $scope.medRec_temp.myallergy = {};

        $scope.GetAllergyType = function () {
            $scope.showLoader("Fetching data...");
            $scope.requestData = {};
            $scope.requestData.UserRoleID = '' + $scope.session_variables.login_data.userroleid;
            generic_http_post_service.getDetails_httpget(generic_http_post_service.getServices().GET_ALLERGY_TYPE,
                $scope.requestData, $scope.GetAllergyType_callback);
        }

        $scope.GetAllergyType_callback = function (data) {
            $scope.hideLoader();
            //alert(JSON.stringify(data));
            if (data != null && data != []) {
                $scope.medRec_temp.myallergy.array_allergyType = data;
                $scope.showAddAllergy();
            } else {
                $scope.showAlertWindow_Titled("Sorry", "No data");
            }
        }


        $scope.GetAllergy = function () {
            $scope.showLoader("Fetching data...");
            $scope.requestData = {};
            $scope.requestData.UserRoleID = '' + $scope.session_variables.login_data.userroleid;
            $scope.requestData.AllergyType = '' + $scope.medRec_temp.myallergy.allergyType_id;
            // alert(JSON.stringify($scope.requestData));
            generic_http_post_service.getDetails_httpget(generic_http_post_service.getServices().GET_ALLERGY,
                $scope.requestData, $scope.GetAllergy_callback);
        }

        $scope.GetAllergy_callback = function (data) {
            $scope.hideLoader();
            // alert(JSON.stringify(data));
            if (data != null && data != []) {
                $scope.medRec_temp.myallergy.array_allergy = data;
            } else {
                $scope.showAlertWindow_Titled("Sorry", "No data");
            }
        }
        
        
        //save allergy
        $scope.saveAllergy = function (data) {
            $scope.showLoader('Please wait ...');

            //{"MRNO":"12","AllergyId":"1", "ExistsFrom":"12/12/2016", "UserRoleID":"12"}
            $scope.requestData = {};
            $scope.requestData.MRNO = '' + $scope.session_variables.login_data.mrno;
            $scope.requestData.AllergyId = '' + $scope.medRec_temp.myallergy.allergy_id;
            $scope.requestData.ExistsFrom = '' + $scope.medRec_temp.myallergy.exist_from;
            $scope.requestData.UserRoleID = '' + $scope.session_variables.login_data.userroleid;
            alert(JSON.stringify($scope.requestData));
            generic_http_post_service.getDetails(generic_http_post_service.getServices().POST_ALLERGY, $scope.requestData, $scope.saveAllergy_Callback);

        }

        $scope.saveAllergy_Callback = function (data) {
            $scope.hideLoader();
            try {
                if (data.success == 1) {
                    $scope.showAlertWindow_Titled("Success", data.msg, $scope.init, null);
                } else {
                    $scope.showAlertWindow_Titled("Error", data.msg, null, null);
                }
            } catch (error) {
                alert(error);
            }
        }
        //end save allergy




        $scope.showAddAllergy = function () {


            $ionicPopup.show({
                template: '<div class="card list" >' +
                '<div class="item">' +

                '<select ng-model="medRec_temp.myallergy.allergyType_id" style="width: 100%" ng-change="GetAllergy()"  >' +
                '<option value="">-- select type --</option>' +
                '<option ng-repeat="item in medRec_temp.myallergy.array_allergyType"  value="{{item.AllergyTypeId}}">' +
                '{{item.AllergyTypeProperty}}' +
                '</option>' +
                '</select>' +

                '<br/><br/>' +

                '<select ng-model="medRec_temp.myallergy.allergy_id" style="width: 100%"  >' +
                '<option value="">-- select allery --</option>' +
                '<option ng-repeat="item in medRec_temp.myallergy.array_allergy" value="{{item.AllergyId}}">' +
                '{{item.AllergyName}}' +
                '</option>' +
                '</select>' +
                '</div>' +

                '<div class="list" >' +
                // '<label class="item item-input item-icon-right">' +
                // '<i class="ion icon icon-right ion-calendar"></i>' +
                // '<input type="date"  placeholder="Exist From" data-ng-model="medRec_temp.myallergy.exist_from"  >' +
                // '</label>' +
                '<div class="item item-icon-left" ng-click="pickDate(dateScopes.allergy)" >' +
                '<i class="ion icon icon-right ion-calendar"></i>' +
                '<h2 style="line-height:2;" ng-bind=" getDateWithMonthName(medRec_temp.myallergy.exist_from)" >23 oct, 2015</h2>' +
                '<p style="line-height:2;" ng-if="!medRec_temp.myallergy.exist_from">--Select--</p>' +
                '</div>' +
                '</div>',
                /*   templateUrl: 'templates/medical_records/popovers/add_medical_records.html',*/
                title: 'Add Allergy',
                scope: $scope,
                buttons: [

                    {
                        text: 'Save',
                        type: 'button-assertive',
                        onTap: function (e) {
                            //alert($scope.medRec_temp.myallergy.allergyType_id + ' ' + $scope.medRec_temp.myallergy.allergy_id + ' '+ $scope.medRec_temp.myallergy.exist_from );
                            if (!$scope.medRec_temp.myallergy.allergy_id || !$scope.medRec_temp.myallergy.allergyType_id
                                || !$scope.medRec_temp.myallergy.exist_from) {
                                //don't allow the user to close unless he enters all fields
                                $scope.showAlertWindow_Titled('Sorry', 'Please provide all parameters');
                                e.preventDefault();
                            } else {
                                $scope.saveAllergy();
                                return $scope.medRec_temp.myallergy;
                            }
                        }
                    },
                    {
                        text: 'Cancel',
                        type: 'button-dark',
                        onTap: function (e) {

                            $scope.medRec_temp.myallergy = {};
                            return false;
                        }
                    },
                ]
            }).then(function (res) {


            });
        }//end method

        $scope.medRec_temp.myHealthCondition = {};
        // $scope.medRec_temp.myHealthCondition.exist_from = '2016-02-29';
        $scope.fetchHealthConditions = function () {
            $scope.GetHealthConditionType();
            $scope.GetHealthHConditions();
        }

        $scope.GetHealthConditionType = function () {
            $scope.showLoader("Fetching data...");
            $scope.requestData = {};
            $scope.requestData.UserRoleID = '' + $scope.session_variables.login_data.userroleid;
            //alert(generic_http_post_service.getServices().GET_HEALTH_CONDITION_TYPE);
            generic_http_post_service.getDetails_httpget(generic_http_post_service.getServices().GET_HEALTH_CONDITION_TYPE,
                $scope.requestData, $scope.GetHealthConditionType_callback);
        }

        $scope.GetHealthConditionType_callback = function (data) {
            $scope.hideLoader();
            //alert(JSON.stringify(data));
            if (data != null && data != []) {
                $scope.medRec_temp.myHealthCondition.array_hc_type = data;
            } else {
                $scope.showAlertWindow_Titled("Sorry", "No data");
            }
        }


        $scope.GetHealthHConditions = function () {
            $scope.showLoader("Fetching data...");
            $scope.requestData = {};
            $scope.requestData.UserRoleID = '' + $scope.session_variables.login_data.userroleid;
            //alert(JSON.stringify($scope.requestData));
            generic_http_post_service.getDetails_httpget(generic_http_post_service.getServices().GET_HEALTH_CONDITIONS,
                $scope.requestData, $scope.GetHealthHConditions_callback);
        }

        $scope.GetHealthHConditions_callback = function (data) {
            $scope.hideLoader();
            if (data != null && data != []) {
                $scope.medRec_temp.myHealthCondition.array_hc = data;

                $scope.showAddHealthCondition();
            } else {
                $scope.showAlertWindow_Titled("Sorry", "No data");
            }
        }
        
        //save health condition
        $scope.saveHealthCondition = function () {
            $scope.showLoader('Please wait ...');
            //{"MRNO":"12","HealthConditionTypeID":"1", "ExistsFrom":"12/12/2016", "UserRoleID":"12",  "HealthConditionID":"1"}
            $scope.requestData = {};
            $scope.requestData.MRNO = '' + $scope.session_variables.login_data.mrno;
            $scope.requestData.HealthConditionTypeID = '' + $scope.medRec_temp.myHealthCondition.type_id;
            $scope.requestData.ExistsFrom = '' + $scope.medRec_temp.myHealthCondition.exist_from;
            $scope.requestData.UserRoleID = '' + $scope.session_variables.login_data.userroleid;
            $scope.requestData.HealthConditionID = '' + $scope.medRec_temp.myHealthCondition.id;
            // alert(JSON.stringify($scope.requestData));
            generic_http_post_service.getDetails(generic_http_post_service.getServices().POST_HEALTH_CONDITION,
                $scope.requestData, $scope.saveHealthCondition_Callback);

        }

        $scope.saveHealthCondition_Callback = function (data) {
            $scope.hideLoader();
            try {
                if (data.success == 1) {
                    $scope.showAlertWindow_Titled("Success", data.msg, $scope.init, null);
                } else {
                    $scope.showAlertWindow_Titled("Error", data.msg, null, null);
                }
            } catch (error) {
                alert(error);
            }
        }
        //end save health condition

        $scope.showAddHealthCondition = function () {


            $ionicPopup.show({
                template: '<div class="card list" >' +
                '<div class="item">' +

                '<select ng-model="medRec_temp.myHealthCondition.type_id" style="width: 100%"  >' +
                '<option value="">-- select type --</option>' +
                '<option ng-repeat="item in medRec_temp.myHealthCondition.array_hc_type" value="{{item.HConTypeId}}">' +
                '{{item.HConTypeProperty}}' +
                '</option>' +
                '</select>' +

                '<br/><br/>' +

                '<select ng-model="medRec_temp.myHealthCondition.id" style="width: 100%"  >' +
                '<option value="">-- select category --</option>' +
                '<option ng-repeat="item in medRec_temp.myHealthCondition.array_hc" value="{{item.HConId}}">' +
                '{{item.HCondition}}' +
                '</option>' +
                '</select>' +

                '</div>' +


                '<div class="list" >' +
                // '<label class="item item-input item-icon-right">' +
                // '<i class="ion icon icon-right ion-calendar"></i>' +
                // '<input type="date"  placeholder="Exist From" data-ng-model="medRec_temp.myHealthCondition.exist_from"  >' +
                // '</label>' +
                '<div class="item item-icon-left" ng-click="pickDate(dateScopes.health)" >' +
                '<i class="ion icon icon-right ion-calendar"></i>' +
                '<h2 style="line-height:2;" ng-bind=" getDateWithMonthName(medRec_temp.myHealthCondition.exist_from)" >23 oct, 2015</h2>' +
                '<p style="line-height:2;" ng-if="!medRec_temp.myHealthCondition.exist_from">--Select--</p>' +
                '</div>' +
                '</div>',
                /*   templateUrl: 'templates/medical_records/popovers/add_medical_records.html',*/
                title: 'Add Heath Condition',
                scope: $scope,
                buttons: [

                    {
                        text: 'Save',
                        type: 'button-assertive',
                        onTap: function (e) {

                            if (!$scope.medRec_temp.myHealthCondition.id || !$scope.medRec_temp.myHealthCondition.type_id
                                || !$scope.medRec_temp.myHealthCondition.exist_from) {
                                //don't allow the user to close unless he enters all fields
                                //$scope.validateTextBoxes();
                                $scope.showAlertWindow_Titled('Sorry', 'Please provide all parameters');
                                e.preventDefault();
                            } else {
                                $scope.saveHealthCondition();
                                return $scope.medRec_temp.myallergy;
                            }
                        }
                    },
                    {
                        text: 'Cancel',
                        type: 'button-dark',
                        onTap: function (e) {

                            $scope.medRec_temp.myallergy = {};
                            return false;
                        }
                    },
                ]
            }).then(function (res) {


            });





            $scope.showImages = function (index) {
                $scope.activeSlide = index;
                $scope.showModal('templates/image-popover.html');
            }

            $scope.playVideo = function () {
                $scope.showModal('templates/video-popover.html');
            }

            $scope.showModal = function (templateUrl) {
                $ionicModal.fromTemplateUrl(templateUrl, {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                });
            }

            // Close the modal
            $scope.closeModal = function () {
                $scope.modal.hide();
                $scope.modal.remove()
            };
        }//end method
        
        


        $scope.medRec_temp.myhistory = {};





        $scope.saveMedicalHistory = function () {
            $scope.showLoader('Please wait ...');
            $scope.requestData = {};
            $scope.requestData.MRNO = '' + $scope.session_variables.login_data.mrno;
            $scope.requestData.Date = '' + $scope.medRec_temp.myhistory.date;
            $scope.requestData.UserRoleID = '' + $scope.session_variables.login_data.userroleid;
            $scope.requestData.Text = '' + $scope.medRec_temp.myhistory.history;
            //alert(JSON.stringify($scope.requestData));
            generic_http_post_service.getDetails(generic_http_post_service.getServices().PAT_MED_HISTORY_INSERT, $scope.requestData, $scope.saveMedicalHistory_Callback);

        }

        $scope.saveMedicalHistory_Callback = function (data) {
            $scope.hideLoader();
            try {
                if (data.success == 1) {
                    $scope.showAlertWindow_Titled("Success", data.msg, $scope.init, null);
                } else {
                    $scope.showAlertWindow_Titled("Error", data.msg, null, null);
                }
            } catch (error) {
                alert(error);
            }
        }


        $scope.showHistoryPopup = function () {


            $ionicPopup.show({
                template: '<div class="card list" >' +
                '<div class="item item-icon-left" ng-click="pickDate(dateScopes.history)" >' +
                '<i class="ion icon icon-right ion-calendar"></i>' +
                '<h2 style="line-height:2;" ng-bind=" getDateWithMonthName(medRec_temp.myhistory.date)" >23 oct, 2015</h2>' +
                '<p style="line-height:2;" ng-if="!medRec_temp.myhistory.date">--Select--</p>' +
                '</div>' +
                '</div>' +
                '<div class="card list" >' +
                '<form >' +
                '<label class="item item-input " >' +
                ' <textarea rows="5"' +
                'placeholder="eg: Anything about medical history or related problems" data-ng-model="medRec_temp.myhistory.history" ></textarea>' +
                //'<input type="text"  data-ng-model="medRec_temp.myhistory.history"  placeholder="Name">' +
                //'<i class="icon icon-right {{ validationClass.ERROR }}" ng-if ="!medRec_temp.myhistory.history"></i>' +
                '</label>' +
                '</form>' +
                '</div>',
                /*   templateUrl: 'templates/medical_records/popovers/add_medical_records.html',*/
                title: 'Add Medical Past History',
                scope: $scope,
                buttons: [

                    {
                        text: 'Save',
                        type: 'button-assertive',
                        onTap: function (e) {
                            if (!$scope.medRec_temp.myhistory.history || !$scope.medRec_temp.myhistory.date) {
                                //don't allow the user to close unless he enters all fields
                                //$scope.validateTextBoxes();
                                $scope.showAlertWindow_Titled('Sorry', 'Please provide all parameters');
                                e.preventDefault();
                            } else {
                                $scope.saveMedicalHistory($scope.medRec_temp.myhistory);
                                return $scope.medRec_temp.myhistory;
                            }
                        }
                    },
                    {
                        text: 'Cancel',
                        type: 'button-dark',
                        onTap: function (e) {

                            $scope.medRec_temp.myhistory = {};
                            return false;
                        }
                    },
                ]
            }).then(function (res) {


            });
        }//end method

        $scope.getDateWithMonthName = function (dateString) {
            // alert(date_picker.getDateWithMonthName(dateString));
            return date_picker.getDateWithMonthName(dateString);
        }


        $scope.currDateScope = null;
        $scope.dateScopes = {};
        $scope.dateScopes.history = 'history';
        $scope.dateScopes.allergy = 'allergy';
        $scope.dateScopes.health = 'health';
        $scope.dateScopes.contact = 'contact';
        $scope.pickDate = function (value) {
            //alert(value);
            $scope.currDateScope = value;//'history', 'allergy', 'health', 'contact' ;
            var allowOld = true;
            var allowFuture = false;
            date_picker.getDate('date', $scope.pickdate_callback, allowOld, allowFuture);
        };
        $scope.pickdate_callback = function (data) {
            var format = "dd/mm/yyyy";
            // alert(JSON.stringify(data));
            //$scope.reg.dob = date_picker.getDateInFormat(data.currDate, format);
            if ($scope.currDateScope == $scope.dateScopes.history) {
                $scope.medRec_temp.myhistory.date = data.currDate;
            } else if ($scope.currDateScope == $scope.dateScopes.allergy) {
                $scope.medRec_temp.myallergy.exist_from = data.currDate;
            } else if ($scope.currDateScope == $scope.dateScopes.health) {
                $scope.medRec_temp.myHealthCondition.exist_from = data.currDate;
            } else if ($scope.currDateScope == $scope.dateScopes.contact) {
                $scope.medRec_temp.myhistory.date = data.currDate;
            }
            // alert($scope.medRec_temp.myhistory.date + '  '+ $scope.currDateScope);
        }


       

        //save medicTION
        $scope.saveMedication = function (data) {
            $scope.showLoader('Please wait ...');
            $scope.requestData = {};
            $scope.requestData.MRNO = '' + $scope.session_variables.login_data.mrno;
            $scope.requestData.Date = '' + date_picker.convertDateToString(data.date);
            $scope.requestData.UserRoleID = '' + $scope.session_variables.login_data.userroleid;
            $scope.requestData.Text = '' + data.history;
            //alert(JSON.stringify($scope.requestData));
            generic_http_post_service.getDetails(generic_http_post_service.getServices().PAT_MED_HISTORY_INSERT, $scope.requestData, $scope.saveMedication_Callback);

        }

        $scope.saveMedication_Callback = function (data) {
            $scope.hideLoader();
            try {
                if (data.success == 1) {
                    $scope.showAlertWindow_Titled("Success", data.msg, null, null);
                } else {
                    $scope.showAlertWindow_Titled("Error", data.msg, null, null);
                }
            } catch (error) {
                alert(error);
            }
        }
        //end save medication
        
       
        



        $scope.clipSrc = 'img/coffee.MOV';
        $scope.session_variables.allImages = [];
        $scope.openMediaFile = function (item) {
            try {
                var filePath = '';
                if (!item.image_path) {
                    filePath = item.file_path;
                } else {
                    filePath = item.image_path;
                }
                var fileName = filePath.substr(filePath.lastIndexOf('/') + 1);
                var fileType = filePath.substr(filePath.lastIndexOf('.') + 1);
                filePath = item.url + '/' + filePath;
                //alert(fileType);
                if (fileType.toLowerCase() == 'jpg' || fileType.toLowerCase() == 'jpeg'
                    || fileType.toLowerCase() == 'png' || fileType.toLowerCase() == 'gif') {
                    //alert('its an image');
                    //filePath = 'https://www.qualitylogoproducts.com/custom-mugs/elgrande-mug-15ozwhite-superextralarge.jpg';
                    $scope.session_variables.allImages = [];
                    $scope.session_variables.allImages.push({ src: filePath });
                    //   alert(JSON.stringify($scope.allImages));
                    $scope.showImages(0);
                } else if (fileType.toLowerCase() == 'mov' || fileType.toLowerCase() == 'mp4'
                    || fileType.toLowerCase() == 'wmv') {
                    //alert('its a video');
                    $scope.clipSrc = filePath;
                    $scope.playVideo();
                } else if (fileType.toLowerCase() == 'mp3' || fileType.toLowerCase() == '3gpp') {
                    //  native_play_audio.playSimple(data);
                    //(callback, url, targetPath, options)
                    //fileTransfer.downloadFile($scope.downloadAudioAndplay, filePath, fileName);
                    $scope.play(filePath);
                } else {
                    $scope.showAlertWindow_Titled('Sorry', 'Unsupported file type');
                }
            } catch (error) {
                alert(error);
            }
        }

        $scope.downloadAudioAndplay = function (data, error) {
            alert(JSON.stringify(data))
            if (data == -1) {//means error
                $scope.showAlertWindow_Titled('Sorry', error);
            } else if (data == -2) {

            } else {
                alert('filePath ' + data.nativeURL)
                native_play_audio.playSimple(data.nativeURL);
            }

        }


        $scope.play = function (src) {
            try {
                //alert('aa  ' + src);
                var media = new Media(src, null, null, mediaStatusCallback);
                media.play(media);
                //$cordovaMedia.play(media);
            } catch (error) {
                alert(error);
            }
        }

        var mediaStatusCallback = function (status) {
            if (status == 1) {
                $ionicLoading.show({ template: 'Loading...' });
            } else {
                $ionicLoading.hide();
            }
        }

        $scope.showImages = function (index) {
            $scope.activeSlide = index;
            $scope.showModal('templates/utils/image-popover.html');
        }

        $scope.playVideo = function () {
            $scope.showModal('templates/utils/video-popover.html');
            // var ref = window.open($scope.clipSrc, '_blank', 'location=no');
        }

        // $scope.showModal = function (templateUrl) {
        //     $ionicModal.fromTemplateUrl(templateUrl, {
        //         scope: $scope,
        //         animation: 'slide-in-up'
        //     }).then(function (modal) {
        //         $scope.modal = modal;
        //         $scope.modal.show();
        //     });
        // }

        // // Close the modal
        // $scope.closeModal = function () {
        //     $scope.modal.hide();
        //     $scope.modal.remove()
        // };



        $scope.uploadMedicalRecord = function (options, filePath) {
            $scope.showProgressLoader();
            try {


                // var options = new FileUploadOptions();
                // options.fileKey = "file";
                // options.fileName = 'temp.jpeg';//$scope.reg.profilePic.substr($scope.reg.profilePic.lastIndexOf('/') + 1);
                // options.mimeType = "image/jpeg";
                // options.chunkedMode = true;

                var params = {};
                //params.MRNO = "12";
                //params.UserRoleID = '' + $scope.session_variables.login_data.userroleid;

                options.params = params;
                alert(JSON.stringify(options));
                fileTransfer.uploadFile($scope.fileupload_callback, generic_http_post_service.getServices().FILE_UPLOAD,
                    filePath, options);

            } catch (error) {
                alert(error);
            }
            // var ft = new FileTransfer();
            // ft.upload($scope.reg.profilePic, encodeURI(generic_http_post_service.getServices().FILE_UPLOAD), 
            //             $scope.fileupload_callback, $scope.fileupload_callback, options);
        }//end upload rec
        
        
        $scope.fileupload_callback = function (data, subData) {
            
            //data = data.response;
            //alert(JSON.stringify(data + ' ' + subData));
            try {


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
                    $scope.afterSuccessfullUpload(data.response.filepath)
                }
            } catch (error) {
                $scope.hideLoader();
                alert(error);
            }
        }//end fileupload callback
        
        
        $scope.afterSuccessfullUpload = function (filepath) {
            $scope.showLoader("Uploading records");
            $scope.requestData = {};
            $scope.requestData.UserRoleID = '' + $scope.session_variables.login_data.userroleid;
            $scope.requestData.RecNatureId = '' + $scope.session_variables.my_rec_nature;
            $scope.requestData.FilePath = '' + filepath;
            alert(JSON.stringify($scope.requestData));
            generic_http_post_service.getDetails(generic_http_post_service.getServices().PAT_MED_RECORD_INSERT,
                $scope.requestData, $scope.afterSuccessfullUpload_callback);


        }

        $scope.afterSuccessfullUpload_callback = function (data) {
            $scope.hideLoader();
            if (data.success == 1) {
                $scope.showAlertWindow_Titled("Success", "File uploaded");
            } else {
                $scope.showAlertWindow_Titled("Error", data.msg);
            }
        }//end 
        
        
        $scope.getAge = function (dateString) {
            if (!dateString)
                return;
            try {
                var arr = dateString.substring(0, 10).split('/');
                return date_picker.getAge(arr[1], arr[0], arr[2]);//d, m, y
            } catch (error) {
                alert(error);
            }
        }//end getAge

    });
