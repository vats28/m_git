angular.module('starter.newFamilyCalander', [])

    .controller('newFamilyCalanderCtrl', function($scope, $timeout, generic_http_post_service) {
        'use strict';
        $scope.calendar = {};

        $scope.init = function() {
            $timeout(function() {
                $scope.loadEvents();
            }, 500);
        }//end 

        $scope.changeMode = function(mode) {
            $scope.calendar.mode = mode;
        };

        $scope.loadEvents = function() {
            $scope.calendar.eventSource = createRandomEvents();
        };

        $scope.onEventSelected = function(event) {
            console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
        };

        $scope.onViewTitleChanged = function(title) {
            $scope.viewTitle = title;
        };

        $scope.today = function() {
            $scope.calendar.currentDate = new Date();
        };

        $scope.isToday = function() {
            var today = new Date(),
                currentCalendarDate = new Date($scope.calendar.currentDate);

            today.setHours(0, 0, 0, 0);
            currentCalendarDate.setHours(0, 0, 0, 0);
            return today.getTime() === currentCalendarDate.getTime();
        };

        $scope.onTimeSelected = function(selectedTime) {
            console.log('Selected time: ' + selectedTime);
        };

        function createRandomEvents() {

            var local_notification_list = JSON.parse($scope.GetInLocalStorage($scope.localStorageKeys.LOCAL_NOTIFICATIONS));
            if (!local_notification_list) {
                $scope.showAlertWindow_Titled("Oh Ohh!", "No reminders found");
                return;
            }
           // console.log(local_notification_list);
            var events = [];//local_notification_list;
            for (var i = 0; i < local_notification_list.length; i++) {
                var date = new Date();
                var startTime;
                var endTime;
                
                startTime = new Date(local_notification_list[i].data.from_time);// new Date(date.getFullYear(), date.getMonth(), date.getDate() + startDay, 0, date.getMinutes() + startMinute);
                endTime = new Date(local_notification_list[i].data.to_time);// new Date(date.getFullYear(), date.getMonth(), date.getDate() + endDay, 0, date.getMinutes() + endMinute);
                // events.push({
                //     title: local_notification_list[i].title,
                //     startTime: startTime,
                //     endTime: endTime,
                //     allDay: false
                // });
                
                var event = local_notification_list[i];
                event.startTime = startTime;
                event.endTime = endTime;
                event.allDay = false;
                events.push(event);
            }
            return events;
        }
        
        

    });
