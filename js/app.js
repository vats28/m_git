// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'ngCordovaOauth', 'ionicLazyLoad',
    'starter.controllers', 'starter.landing', 'starter.insurance', 'starter.additionalProfile',
    'starter.dashboard', 'starter.mediRec', 'starter.profilePage', 'starter.addLoved', 'starter.listLoved',
    'starter.vital', 'starter.mediRecLovedOne', 'starter.shareRecords', 'starter.familyCalander',
    'starter.healthStatus', 'starter.addHealthProvider', 'starter.billList', 'starter.setReminder',
    'starter.reminderList', 'starter.addMedicalRecord', 'starter.newFamilyCalander',
    'chartjs', 'ui.rCalendar',
    'utils.date_picker', 'utils.http_post', 'utils.validations', 'ion-fab-button',
    'utils.camera', 'utils.fileTransfer', 'utils.audio', 'utils.native_play_audio', 'ionic.contrib.ui.hscrollcards'])

    .run(function($ionicPlatform, $http, $cordovaPush, $rootScope, $timeout) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            //Server API Key : AIzaSyCBsncsp9BZUe_lyXA625nrdnM1bu2zaRM
            var androidConfig = {
                "senderID": "274951753555",
            };


            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }

            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
            if (window.cordova && window.cordova.logger) {
                window.cordova.logger.__onDeviceReady();
            }

            // $cordovaPush.register(androidConfig).then(function(result) {
            //     // Success
            //     alert(JSON.stringify(result));
            // }, function(err) {
            //     // Error

            //     alert('err  :  ' + JSON.stringify(err));
            // })

            // $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {

            //     alert('notification.event : ' + notification.event);
            //     switch (notification.event) {
            //         case 'registered':
            //             if (notification.regid.length > 0) {
            //                 alert('registration ID = ' + notification.regid);
            //             }
            //             break;

            //         case 'message':
            //             // this is the actual push notification. its format depends on the data model from the push server
            //             alert('message = ' + notification.message + ' msgCount = ' + notification.msgcnt);
            //             break;

            //         case 'error':
            //             alert('GCM error = ' + notification.msg);
            //             break;

            //         default:
            //             alert('An unknown GCM event has occurred');
            //             break;
            //     }
            // });


            // WARNING: dangerous to unregister (results in loss of tokenID)
            // $cordovaPush.unregister(options).then(function(result) {
            //     // Success!
            //     console.log('unregister  : ' + result);
            // }, function(err) {
            //     // Error
            //     console.log('unregister err : ' + err);
            // })

            try {



                // Join BBM Meeting when user has clicked on the notification 
                cordova.plugins.notification.local.on("click", function(notification) {
                    //if (notification.id == 10) {

                    //alert(JSON.stringify(notification));
                    $timeout(function() {
                        $rootScope.$broadcast('local_notification', notification);

                    }, 500);
                    //}
                });

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

            } catch (error) {
                alert(error);
            }
        });

    })


    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppCtrl'
            })

            .state('app.landing', {
                url: '/landing',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/landing.html'
                    }
                }
            })

            .state('app.profile_page', {
                url: '/profile_page',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/profile_page.html'
                    }
                }
            })

            .state('app.dashboard', {
                url: '/dashboard',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/dashboard.html'
                    }
                }
            })

            .state('app.medical_records', {
                url: '/medical_records',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/records/medical_records.html'
                    }
                }
            })

            .state('app.medical_records_loved_one', {
                url: '/medical_records_loved_one',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/records/medical_records_loved_one.html'
                    }
                }
            })

            .state('app.add_loved_ones', {
                url: '/add_loved_ones',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/loved_ones/add_loved_ones.html'
                    }
                }
            })

            .state('app.list_loved_ones', {
                url: '/list_loved_ones',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/loved_ones/list_loved_ones.html'
                    }
                }
            })

            .state('app.vital_chart', {
                url: '/vital_chart',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/records/vital_chart.html'
                    }
                }
            })

            .state('app.family_calander', {
                url: '/family_calander',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/health_calander/new_family_calander.html'
                    }
                }
            })

            .state('app.health_status', {
                url: '/health_status',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/health_calander/health_status.html'
                    }
                }
            })

            .state('app.bill_list', {
                url: '/bill_list',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/bill/bill_list.html'
                    }
                }
            })

            .state('app.insurance', {
                url: '/insurance',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/insurance/insurance.html'
                    }
                }
            })

            .state('app.reminder_list', {
                url: '/reminder_list',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/health_calander/reminder_list.html'
                    }
                }
            })

            .state('app.logout', {
                url: '/logout',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/logout.html'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/landing');


    })

    .filter('unique', function() {
        return function(collection, keyname) {
            var output = [],
                keys = [];

            angular.forEach(collection, function(item) {
                var key = item[keyname];
                if (keys.indexOf(key) === -1) {
                    keys.push(key);
                    output.push(item);
                }
            });
            return output;
        };
    });


// $('.quiz-qa h3').click(function(e) {
//   if ($(this).hasClass("deleted")) {
//     e.stopImmediatePropagation();
//     return false;
//    }
// });
// $('.quiz-qa').accordion();
