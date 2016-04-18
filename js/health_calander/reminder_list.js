angular.module('starter.reminderList', [])

    .controller('reminderListCtrl', function($scope, $ionicActionSheet, generic_http_post_service, $timeout ) {

        // $scope.data = {};
        //         $scope.data.id = Math.floor((Math.random() * 100000) + 1000);;//new Date().getMilliseconds();
        //         $scope.data.title = $scope.getValueInJson($scope.temp.purpose_list, $scope.temp.purpose_id, "purpose_id", "purpose") + ' at ' + $scope.temp.from_date + ' ' + $scope.temp.from_time;//'Doctor Visit';
        //         $scope.data.text = $scope.temp.event_description;
        //         $scope.data.firstAt = new Date(2016,3,13,0,27,0,0);//$scope.parseDate($scope.temp.from_date, date_picker.convertTo24HourFormat($scope.temp.from_time));
        //         $scope.data.at = new Date(2016, 3, 13, 0, 30, 0, 0);//$scope.parseDate($scope.temp.to_date, date_picker.convertTo24HourFormat($scope.temp.to_time));
        //         $scope.data.data = { 
        //             id: $scope.data.id, 
        //             place: $scope.temp.place, 
        //             from_time:$scope.data.at, 
        //             to_time:$scope.data.at, 
        //             loved_one: $scope.temp.selected_lovedone};

        $scope.array_list = [];
        $scope.init = function() {
            //1.  get reminder list
            $scope.getReminderList();
            //2. make recent reminder in first row
        }



        $scope.getReminderList = function() {

            var local_notification_list = JSON.parse($scope.GetInLocalStorage($scope.localStorageKeys.LOCAL_NOTIFICATIONS));
            if (local_notification_list) {
                $scope.array_list = local_notification_list;
            } else {
                $scope.showAlertWindow_Titled("Oh Ohh!", "No reminders found");
            }
        }

        $scope.$on('onHeaderMoreButtonClick', function(event, data) {
            if (data == 'app.reminder_list')
                $scope.onHeaderMoreButtonClick();
        });

        $scope.onHeaderMoreButtonClick = function() {
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    { text: 'Add More Reminders' }
                ],
                titleText: 'Option',
                cancelText: 'Cancel',
                cancel: function() {
                    // add cancel code..
                },
                buttonClicked: function(index) {
                    if (index == 0) {
                        $scope.showModal('templates/popups/set_reminder.html');

                    }

                    $timeout(function() {
                        hideSheet();
                    }, 200);

                }
            });
        }//end 
    });
