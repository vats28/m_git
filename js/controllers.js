angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $state, $ionicModal, $ionicPopup,
        $ionicHistory, $ionicScrollDelegate, $ionicLoading, $ionicSideMenuDelegate, generic_http_post_service, $timeout, date_picker) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        $scope.headerButton = {};
        $scope.$on('$ionicView.enter', function (e) {
            var stateId = $ionicHistory.currentView().stateId;

            if (stateId == "app.medical_records") {
                $scope.headerButton.showVitalChart = true;
            } else if (stateId == "app.landing") {
                $ionicHistory.clearCache()   
            } else {
                $scope.headerButton.showVitalChart = false;
            }
        });

        // Form data for the login modal
        $scope.loginData = {};
        $scope.session_variables = {};
        $scope.userData = {};// just to show values in profile edit page
        $scope.session_variables.login_data = {};
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
        });


        $scope.menu = {};


        $scope.doLogout = function () {
            $scope.session_variables = {};
            $scope.session_variables.isLoggedIn = false;
            $scope.RemoveInLocalStorage($scope.LOGIN_STORE_KEY);
            $scope.jumpTo('app.logout');
            $scope.disableBack();
            $scope.clearHistory();
            $scope.jumpTo('app.landing');
        }

        $scope.showAlertWindow = function (text) {
            $ionicPopup.alert({
                title: text,
                //cancelType: 'color_grey',// String (default: 'button-default'). The type of the Cancel button.
                okType: 'positive'// String (default: 'OK'). The text of the OK button.
            }).then(function (res) {
                console.log('Your log ', res);
            });
        }

        $scope.showAlertWindow_Titled = function (title, template, callback, oktext) {

            $ionicPopup.alert({
                title: title,
                template: '<div align="center">' + template + '</div>',
                okText: oktext != null ? oktext : 'OK',
                okType: 'button-dark'
            }).then(function (res) {
                if (callback != null && callback != undefined) {
                    callback();
                }
                //this.close();
            });
        }//end


        // An alert dialog
        var alertPopup;
        $scope.templateUrl = function (_title, _templateUrl, _scope) {
            alertPopup = $ionicPopup.alert({
                title: _title,
                templateUrl: _templateUrl,
                scope: _scope
            });

            alertPopup.then(function (res) {
                // console.log('Thank you for not eating my delicious ice cream cone');
            });
        };

        $scope.templateUrl_close = function () {
            alertPopup.close();
            alertPopup = null;
        }

        $scope.testAlertWindow = function (msg) {
            if ($scope.InTesting)
                alert(msg);
        }// end  testAlertWindow

        $scope.doubleBack = function () {
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

        $scope.goBackScreen = function () {
            $ionicHistory.goBack();

        }// end

        $scope.clearCache = function () {

            $ionicHistory.clearCache();

        }//end

        $scope.clearCacheAndHistory = function () {
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();

        }//end

        $scope.clearHistory = function () {
            $ionicHistory.clearHistory();

        }//end

        $scope.disableBack = function () {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            /* $ionicViewService.nextViewOptions({

             });*/
        }// end

        $scope.enableBack = function () {

            $ionicHistory.nextViewOptions({
                disableBack: false
            });
            /* $ionicViewService.nextViewOptions({

             });*/
        }// end

        $scope.scrollTop = function () {
            $ionicScrollDelegate.scrollTop();
        }

        $scope.jumpTo = function (pageName) {
            try {
                $state.go(pageName);
            } catch (err) {
                alert(err);
            }
        }//end

        $scope.jumpTo_cacheFalse = function (pageName) {
            try {

                //$scope.jumpTo(pageName);
                $state.go(pageName, { cache: false })
            } catch (err) {
                alert(err);
            }
        }//end

        $scope.enableSideMenuDrag = function () {
            $ionicSideMenuDelegate.canDragContent(true);
        }

        $scope.disableSideMenuDrag = function () {
            $ionicSideMenuDelegate.canDragContent(false);
        }

        $scope.resizePage = function () {
            $ionicScrollDelegate.resize();
        }

        $scope.showLoader = function (msg) {
            $ionicLoading.show({
                template: '<ion-spinner icon="lines" class="spinner-energized" style="float: left;"></ion-spinner>' + '<span style="margin-left: 5px;">' + msg + '</span>'//'<span class="icon spin ion-loading-d"></span> ' + msg

            });
        };
        $scope.hideLoader = function () {
            $ionicLoading.hide();
        };

        $scope.progressText = 'Uploading file ...';
        $scope.showProgressLoader = function () {
            $ionicLoading.show({
                template: '<ion-spinner icon="lines" class="spinner-energized" style="float: left;"></ion-spinner>' + '<span style="margin-left: 5px;" ng-bind="session_variables.progressText"></span>'//'<span class="icon spin ion-loading-d"></span> ' + msg

            });
        };



        $scope.showToast = function (msg) {

            $ionicLoading.show({
                template: msg,
                delay: 500,
                duration: 2000

            });
        };

        // A confirm dialog
        $scope.showConfirm = function (title, template, data, callback) {
            $ionicPopup.confirm({
                title: title,
                template: '<div align="center">' + template + '</div>',
                okType: 'button-assertive',
                cancelType: 'button-dark'
            }).then(function (res) {
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

        $scope.SaveInLocalStorage = function (key, value) {
            window.localStorage.setItem(key, value);
        }//end

        $scope.GetInLocalStorage = function (key) {
            return window.localStorage.getItem(key);
        }//end

        $scope.RemoveInLocalStorage = function (key) {
            window.localStorage.removeItem(key);
        }//end


        $scope.SaveLoginCredential = function (data) {

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
                id: 3,
                name: "Medical records",
                icon: "ion-clipboard",
                target: "app.medical_records"
            },
            {
                id: 13,
                name: "Prescription",
                icon: "ion-ios-list",
                target: "app.fav_pres"
            },
            {
                id: 4,
                name: "Insurance",
                icon: "ion-umbrella"
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
            }

        ];


        $scope.openImagesPopup = function (filePath) {
            $scope.session_variables.allImages = [];
            $scope.session_variables.allImages.push({ src: filePath });
            $scope.activeSlide = 0;
            $scope.showModal('templates/utils/image-popover.html');
        }


        $scope.showModal = function (templateUrl) {
            // $ionicBackdrop.retain();

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
            // $ionicBackdrop.release();
            $scope.modal.hide();
            $scope.modal.remove()
        };


        $scope.getRelation = function (callback) {
            $scope.showLoader("Fetching data...");
            $scope.requestData = {};
            $scope.requestData.UserRoleID = '' + $scope.session_variables.login_data.userroleid;
            //alert(generic_http_post_service.getServices().GET_HEALTH_CONDITION_TYPE);
            generic_http_post_service.getDetails_httpget(generic_http_post_service.getServices().GET_RELATIONSHIP_MASTER,
                $scope.requestData, callback);
        }//end

        $scope.getAge = function (dateString) {
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
    });
