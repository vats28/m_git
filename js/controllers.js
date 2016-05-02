angular.module('starter.controllers', [])

    .controller('AppCtrl', function($scope, $state, $sce, $ionicModal, $ionicPopup, $ionicPopover, $cordovaFileOpener2,
        $ionicHistory, $ionicScrollDelegate, $ionicLoading, $ionicSideMenuDelegate, $ionicPlatform, generic_http_post_service,
        $timeout, date_picker, $rootScope) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        $scope.headerButton = {};
        $scope.$on('$ionicView.enter', function(e) {
            if ($scope.modal)
                $scope.closeModal();//just in case if a modal is opened then it get closed on changing page

            var stateId = $ionicHistory.currentView().stateId;

            if (stateId == "app.medical_records") {
                $scope.headerButton.showVitalChart = true;
                $scope.headerButton.showHomeIcon = false;
            } else if (stateId == "app.landing") {
                $ionicHistory.clearCache()
            } else {
                $scope.headerButton.showVitalChart = false;
                $scope.headerButton.showHomeIcon = true;
            }
        });


        $ionicPlatform.registerBackButtonAction(function(event) {
            var stateId = $ionicHistory.currentView().stateId;

            if (stateId == "app.medical_records") {
                //do nothing
                backAsHome.trigger(function() {
                    //console.log("Success");
                }, function() {
                    //console.log("Error");
                })
            } else {
                $scope.goBackScreen();
            }

        }, 100);




        $scope.lineChartData = {
            "labels": [],
            "datasets": [{ "data": [] }]
        }
        $scope.activeData = $scope.lineChartData;
        $scope.lineChartData2 = {
            "labels": [],
            "datasets": [{ "data": [] }]
        };

        $scope.activeData2 = $scope.lineChartData2;






        $scope.header_title = "";

        // Form data for the login modal
        $scope.loginData = {};
        $scope.session_variables = {};
        $scope.userData = {};// just to show values in profile edit page
        $scope.session_variables.login_data = {};
        $scope.selectedLovedOne = {};
        $scope.InTesting = false;
        $scope.app_data = {};
        $scope.app_data.title = "mCURA";
        $scope.LOGIN_STORE_KEY = 'mcura_login_credentials';

        $scope.style = {};
        $scope.style.opacity = {
            FULL: 'opacity: 1;',
            ACTIVE: 'opacity: 0.3;',
            LIGHT: 'opacity: 0.5;',
        };

        $scope.localStorageKeys = Object.freeze({
            RELATION_LIST: 'mcura_relation',
            HOSPITAL_LIST: 'hospital_list',
            RECORD_NATURE_LIST: 'record_nature_list',
            USER_DATA: 'user_data',
            LOVED_ONE_LIST: 'loved_one_list',
            LOCAL_NOTIFICATIONS: 'local_notifications'
        });

        $scope.validationClass = Object.freeze({
            ERROR: 'ion-asterisk assertive',
            OK: 'ion-checkmark balanced'/*'ion-thumbsdown energized'*/
        });

        $scope.menu = {};


        $scope.doLogout = function() {
            $scope.session_variables = {};
            $scope.session_variables.isLoggedIn = false;
            $scope.RemoveInLocalStorage($scope.LOGIN_STORE_KEY);
            $scope.jumpTo('app.logout');
            $scope.disableBack();
            $scope.clearHistory();
            $scope.clearLocalStorage();
            $scope.jumpTo('app.landing');
        }

        $scope.schedule_notification = function(data) {
            //alert(JSON.stringify(data));
            try {
                cordova.plugins.notification.local.schedule(data);
            } catch (error) {
                alert("schedule_notification error : " + error);
            }
        }

        $scope.update_notification = function(data) {
            cordova.plugins.notification.local.update({
                id: 1,
                title: "Updated Notification"
            });
        }

        $scope.cancel_notification = function(ids) {

            cordova.plugins.notification.local.cancel(ids, function() {
                // Notifications were cancelled
                $scope.showToast("This notification will be removed as time expired");
                console.log("Notification removed");
            }, scope);
        }

        $scope.trigger_notification = function(data) {
            // Notification has reached its trigger time (Tomorrow at 8:45 AM)
            cordova.plugins.notification.local.on("trigger", function(notification) {
                // if (notification.id != 10)
                //     return;

                // // After 10 minutes update notification's title 
                // setTimeout(function() {
                //     cordova.plugins.notification.local.update({
                //         id: 10,
                //         title: "Meeting in 5 minutes!"
                //     });
                // }, 600000);
            });
        }

        $scope.onHeaderMoreButtonClick = function() {
            var stateId = $ionicHistory.currentView().stateId;
            $rootScope.$broadcast('onHeaderMoreButtonClick', stateId);
        }




        $scope.clearLocalStorage = function() {
            $scope.RemoveInLocalStorage($scope.localStorageKeys.RELATION_LIST);
            $scope.RemoveInLocalStorage($scope.localStorageKeys.HOSPITAL_LIST);
            $scope.RemoveInLocalStorage($scope.localStorageKeys.RECORD_NATURE_LIST);
            $scope.RemoveInLocalStorage($scope.localStorageKeys.USER_DATA);
            $scope.RemoveInLocalStorage($scope.localStorageKeys.LOVED_ONE_LIST);
        }//end

        $scope.showAlertWindow = function(text) {
            $ionicPopup.alert({
                title: text,
                //cancelType: 'color_grey',// String (default: 'button-default'). The type of the Cancel button.
                okType: 'positive'// String (default: 'OK'). The text of the OK button.
            }).then(function(res) {
                console.log('Your log ', res);
            });
        }

        $scope.showAlertWindow_Titled = function(title, template, callback, oktext) {

            $ionicPopup.alert({
                title: title,
                template: '<div align="center">' + template + '</div>',
                okText: oktext != null ? oktext : 'OK',
                okType: 'button-dark'
            }).then(function(res) {
                if (callback != null && callback != undefined) {
                    callback();
                }
                //this.close();
            });
        }//end


        // An alert dialog
        var alertPopup;
        $scope.templateUrl = function(_title, _templateUrl, _scope) {
            alertPopup = $ionicPopup.alert({
                title: _title,
                templateUrl: _templateUrl,
                scope: _scope
            });

            alertPopup.then(function(res) {
                // console.log('Thank you for not eating my delicious ice cream cone');
            });
        };

        $scope.templateUrl_close = function() {
            alertPopup.close();
            alertPopup = null;
        }

        $scope.testAlertWindow = function(msg) {
            if ($scope.InTesting)
                alert(msg);
        }// end  testAlertWindow

        $scope.doubleBack = function() {
            /*$ionicHistory.goBack();
             $ionicHistory.goBack();*/
            var backView = $ionicHistory.viewHistory().views[$ionicHistory.viewHistory().backView.backViewId];//$scope.$viewHistory.views[$scope.$viewHistory.backView.backViewId];
            $ionicHistory.viewHistory().forcedNav = {
                viewId: backView.viewId,
                navAction: 'moveBack',
                navDirection: 'back'
            };
            backView && backView.go();
        }// end

        $scope.goBackScreen = function() {
            $ionicHistory.goBack();

        }// end



        $scope.clearCache = function() {

            $ionicHistory.clearCache();

        }//end

        $scope.clearCacheAndHistory = function() {
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();

        }//end

        $scope.clearHistory = function() {
            $ionicHistory.clearHistory();

        }//end

        $scope.disableBack = function() {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            /* $ionicViewService.nextViewOptions({

             });*/
        }// end

        $scope.enableBack = function() {

            $ionicHistory.nextViewOptions({
                disableBack: false
            });
            /* $ionicViewService.nextViewOptions({

             });*/
        }// end

        $scope.scrollTop = function() {
            $ionicScrollDelegate.scrollTop();
        }

        $scope.jumpTo = function(pageName, type) {
            try {
                if (type == "popup") {
                    $scope.showModal(pageName);
                } else {
                    $state.go(pageName);
                }
            } catch (err) {
                alert(err);
            }
        }//end

        $scope.jumpTo_cacheFalse = function(pageName) {
            try {

                //$scope.jumpTo(pageName);
                $state.go(pageName, { cache: false })
            } catch (err) {
                alert(err);
            }
        }//end

        $scope.enableSideMenuDrag = function() {
            $ionicSideMenuDelegate.canDragContent(true);
        }

        $scope.disableSideMenuDrag = function() {
            $ionicSideMenuDelegate.canDragContent(false);
        }

        $scope.resizePage = function() {
            $ionicScrollDelegate.resize();
        }

        $scope.showLoader = function(msg, _duration) {
            $ionicLoading.show({
                template: '<ion-spinner icon="lines" class="spinner-energized" style="float: left;"></ion-spinner>' + '<span style="margin-left: 5px;">' + msg + '</span>',
                duration: _duration ? _duration : undefined
            });
        };
        $scope.hideLoader = function() {
            $ionicLoading.hide();
        };

        $scope.getDateWithMonthName = function(dateString) {
            // alert(date_picker.getDateWithMonthName(dateString));
            return date_picker.getDateWithMonthName(dateString);
        }

        $scope.progressText = 'Uploading file ...';
        $scope.showProgressLoader = function() {
            $ionicLoading.show({
                template: '<ion-spinner icon="lines" class="spinner-energized" style="float: left;"></ion-spinner>' + '<span style="margin-left: 5px;" ng-bind="session_variables.progressText"></span>'//'<span class="icon spin ion-loading-d"></span> ' + msg

            });
        };



        $scope.showToast = function(msg) {

            $ionicLoading.show({
                template: msg,
                delay: 500,
                duration: 2000

            });
        };

        // A confirm dialog
        $scope.showConfirm = function(title, template, data, callback) {
            $ionicPopup.confirm({
                title: title,
                template: '<div align="center">' + template + '</div>',
                okType: 'button-assertive',
                cancelType: 'button-dark'
            }).then(function(res) {
                if (res) {
                    console.log('You are sure');
                    if (callback) {
                        callback(data);
                    }
                } else {
                    console.log('You are not sure');
                }
            });
        };//end

        $scope.SaveInLocalStorage = function(key, value) {
            window.localStorage.setItem(key, value);
        }//end

        $scope.GetInLocalStorage = function(key) {
            return window.localStorage.getItem(key);
        }//end

        $scope.RemoveInLocalStorage = function(key) {
            window.localStorage.removeItem(key);
        }//end


        $scope.$on('local_notification', function(event, data) {
            //  $scope.showAlertWindow_Titled(data.title, data.text);
            // console.log("again : " + JSON.stringify(data));
            var event_data = JSON.parse(data.data);
            // console.log("again.data : " + data.data);
            try {

                $scope.jumpTo('app.reminder_list');
                $scope.session_variables.currentNotification = data;

                //check if time expired to cancel this notification
                if ($scope.isNoticationExpired(event_data.to_time)) {
                    $scope.cancel_notification([data.id]);
                }

            } catch (error) {
                //alert('local_notification error : ' + error);
            }
        });

        $scope.isNoticationExpired = function(to_time) {

            console.log("to_time : " + to_time);
            var retval = false;
            try {
                if (new Date() > to_time) {
                    retval = true;
                }
            } catch (error) {
                console.log("isNoticationExpired : " + error);
            }

        }//edn 

        $scope.SaveLoginCredential = function(data) {

            try {
                $scope.SaveInLocalStorage($scope.LOGIN_STORE_KEY, data)
            } catch (err) {
                alert(err);
            }
        }//end func





        $scope.menu.list = [
            /*{
             id: 1,
             name: "Emergency Contact",
             icon: "ion-ios-telephone",
             target: "app.list_loved_ones"
             },
             {
             id: 2,
             name: "Vital/ clinical Parameters",
             icon: "ion-stats-bars"
             },*/
            {
                id: 17,
                name: "File Manager",
                icon: "ion-clipboard",
                target: "app.file_manager"
            },
            {
                id: 3,
                name: "Medical records",
                icon: "ion-clipboard",
                target: "app.medical_records"
            },
            {
                id: 13,
                name: "Status tracker",
                icon: "ion-ios-body",
                target: "app.health_status"
            },
            {
                id: 16,
                name: "Reminders",
                icon: "ion-android-notifications",
                target: "app.reminder_list",
            },
            {
                id: 15,
                name: "Prescription",
                icon: "ion-ios-list",
                target: "app.fav_pres"
            },
            {
                id: 4,
                name: "Insurance",
                icon: "ion-umbrella",
                target: "app.insurance"
            },
            {
                id: 5,
                name: "Medical bills",
                icon: "ion-ios-list"
            },
            {
                id: 6,
                name: "Identity library",
                icon: "ion-ios-book"
            },
            {
                id: 7,
                name: "My Health Accounts",
                icon: "ion-person"
            },
            {
                id: 8,
                name: "My Health Pics",
                icon: "ion-image"
            },
            {
                id: 9,
                name: "My Social habits",
                icon: "ion-paper-airplane"
            },
            {
                id: 10,
                name: "My health providers",
                icon: "ion-ios-medkit"
            },
            {
                id: 11,
                name: "Register",
                icon: "ion-ios-medkit",
                target: "app.register"
            },
            {
                id: 12,
                name: "Dashboard",
                icon: "ion-home",
                target: "app.dashboard"
            },

        ];


        $scope.openImagesPopup = function(filePath) {
            $scope.session_variables.allImages = [];
            $scope.session_variables.allImages.push({ src: filePath });
            $scope.activeSlide = 0;
            $scope.showModal('templates/utils/image-popover.html');
        }


        $scope.showModal = function(templateUrl) {
            // $ionicBackdrop.retain();

            $ionicModal.fromTemplateUrl(templateUrl, {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });
        }

        $scope.file_opener = function(path, appType) {
            $cordovaFileOpener2.open(
                path,//'/sdcard/Download/starwars.pdf',
                appType//'application/pdf'
            ).then(function() {
                // file opened successfully
                console.log('file open successfully');
            }, function(err) {
                console.log(err);
                // An error occurred. Show a message to the user
            });
        }//end 
        $scope.showPopover = function(templateUrl, $event) {
            // $ionicBackdrop.retain();

            // $ionicPopover.fromTemplateUrl(templateUrl, {
            //     scope: $scope,
            //     // animation: 'slide-in-up'
            // }).then(function(popover) {
            //     $scope.popover = popover;
            //     $scope.popover.show($event);
            // });

            // .fromTemplateUrl() method
            $ionicPopover.fromTemplateUrl(templateUrl, {
                scope: $scope
            }).then(function(popover) {
                $scope.popover = popover;
            });

            $timeout(function() {
                $scope.popover.show($event);
            }, 100)
        }

        // Close the modal
        $scope.closeModal = function() {
            // $ionicBackdrop.release();
            $scope.modal.hide();
            $scope.modal.remove()
        };

        $scope.$on('modal.removed', function() {
            // Execute action
            if ($scope.session_variables.vital_modal_removed) {
                alert('1');
                $scope.session_variables.vital_modal_removed = false;
                $rootScope.$broadcast('refresh_pat_vital', null);
            }
        });

        $scope.closePopover = function() {
            $scope.popover.hide();
            $scope.popover.remove();
        };

        //to trust videopath for html player
        $scope.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
        }


        $scope.getRelation = function(callback) {
            $scope.showLoader("Fetching data...");
            $scope.requestData = {};
            $scope.requestData.UserRoleID = '' + $scope.session_variables.login_data.userroleid;
            //alert(generic_http_post_service.getServices().GET_HEALTH_CONDITION_TYPE);
            generic_http_post_service.getDetails_httpget(generic_http_post_service.getServices().GET_RELATIONSHIP_MASTER,
                $scope.requestData, callback);
        }//end


        $scope.GetMedicalRecordNature_main = function(callback) {
            $scope.plusIconClicked = true;
            //$scope.showLoader("Fetching record natures...");
            $scope.requestData = {};
            generic_http_post_service.getDetails_httpget(generic_http_post_service.getServices().GET_MEDICAL_RECORD_NATURE,
                $scope.requestData, callback);
        }

        $scope.GetFavouriteHospital_main = function(callback) {
            // $scope.showLoader("Fetching favourite hospitals...");
            $scope.requestData = {};
            generic_http_post_service.getDetails_httpget(generic_http_post_service.getServices().GET_MEDICAL_RECORD_NATURE,
                $scope.requestData, callback);
        }

        $scope.GetSubtenants = function(callback) {
            $scope.requestData = {};
            //$scope.requestData.areaId = 1;
            //$scope.requestData.subTenant = 1;
            $scope.requestData.UserRoleID = '' + $scope.session_variables.login_data.userroleid;
            generic_http_post_service.getDetails_httpget(generic_http_post_service.getServices().GET_SUBTENANT_SEARCH,
                $scope.requestData, callback);
        }



        $scope.getLovedOneList_main = function(callback) {
            $scope.requestData = {};
            $scope.requestData.UserPrimaryRoleID = '' + $scope.session_variables.login_data.userroleid;
            generic_http_post_service.getDetails_httpget(generic_http_post_service.getServices().GET_LOVEDONE,
                $scope.requestData, callback);
        }//end

        //http://test.tn.mcura.com/health_dev.svc/Json/GetVital?UserRoleID=1551       

        $scope.getVital_main = function(callback) {
            $scope.requestData = {};
            $scope.requestData.UserRoleID = '' + $scope.session_variables.login_data.userroleid;
            generic_http_post_service.getDetails_httpget(generic_http_post_service.getServices().GET_VITAL,
                $scope.requestData, callback);
        }//end


        $scope.getVital_records_main = function(callback) {
            $scope.requestData = {};
            $scope.requestData.UserRoleID = '' + $scope.session_variables.login_data.userroleid;
            $scope.requestData.MRNO = '' + $scope.session_variables.login_data.mrno;
            generic_http_post_service.getDetails_httpget(generic_http_post_service.getServices().GET_VITAL_RECORDS,
                $scope.requestData, callback);
        }//end


        $scope.getUserData_main = function(callback) {

            $scope.showLoader("Fetching details...", 10000);
            // alert(JSON.stringify($scope.session_variables.login_data));
            $scope.requestData = {};
            $scope.requestData.userId = $scope.session_variables.login_data.userid;
            generic_http_post_service.getDetails_httpget(generic_http_post_service.getServices().GET_PAT_DETAILS,
                $scope.requestData, callback);
        }
        //

        $scope.getAge = function(dateString) {
            if (!dateString)
                return;
            try {
                dateString = dateString.split(' ')[0];
                var arr = dateString.substring(0, 10).split('/');
                return date_picker.getAge(arr[1], arr[0], arr[2]);//d, m, y
            } catch (error) {
                alert(error);
            }
        }//end getAge




        $scope.isNumberKey = function(evt) {
            var charCode = (evt.which) ? evt.which : event.keyCode;
            if ((charCode >= 97 && charCode <= 122)
                || (charCode >= 65 && charCode <= 90)) {
                //do nothing
            } else {
                evt.preventDefault();
            }
        }


        $scope.getValueInJson = function(arr, keyvalue, keyname, required_key) {
            var retval = "";
            var keepGoing = true;

            angular.forEach(arr, function(value, key) {
                if (keepGoing) {
                    if (value[keyname] == keyvalue) {
                        retval = value[required_key];
                        keepGoing = false;
                    }
                }
            });

            return retval;
        }


        $scope.getDateWithMonthName = function(dateString) {
            return date_picker.getDateWithMonthName(dateString);
        }//end 


    });
