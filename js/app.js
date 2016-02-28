// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'ngCordovaOauth', 'starter.controllers', 'starter.landing',
    'starter.dashboard', 'starter.mediRec', 'starter.profilePage', 'starter.addLoved', 'starter.listLoved',
    'starter.vital',
    'utils.date_picker', 'utils.http_post', 'utils.validations', 'ion-fab-button',
    'utils.camera', 'utils.fileTransfer', 'utils.audio', 'utils.native_play_audio'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function ($cordovaPush, $rootScope) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
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


        });

    })


    .config(function ($stateProvider, $urlRouterProvider) {
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
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/landing');
    });


// $('.quiz-qa h3').click(function(e) {
//   if ($(this).hasClass("deleted")) {
//     e.stopImmediatePropagation();
//     return false;
//    }
// });
// $('.quiz-qa').accordion();
