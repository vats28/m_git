angular.module('starter.setReminder', [])

    .controller('setReminderCtrl', function($scope, date_picker, generic_http_post_service) {

        $scope.temp = {};
        $scope.temp.purpose_list = [
            {
                purpose_id: 1,
                purpose: 'Doctor Visit'
            },
            {
                purpose_id: 2,
                purpose: 'Regular Visit'
            },
            {
                purpose_id: 3,
                purpose: 'Book Cab'
            },
        ];

        $scope.temp.repetition_list = [//"day" // "minute", "hour", "week", "month", "year"
            {
                id: 0,
                name: 'No repeat'
            },
            {
                id: "minute",
                name: 'Minute'
            },
            {
                id: "hour",
                name: 'Hourly'
            },
            {
                id: "day",
                name: 'Day'
            },
            {
                id: "week",
                name: 'Weekly'
            },
            {
                id: "month",
                name: 'Monthly'
            },
            {
                id: "year",
                name: 'Yearly'
            }
        ];

        $scope.init = function() {
            $scope.progressDone = false;

        }//end 

        $scope.getLovedOneList = function() {
            $scope.temp.lovedone_list = [];
            var array_loved_one = null;
            try {
                array_loved_one = JSON.parse($scope.GetInLocalStorage($scope.localStorageKeys.LOVED_ONE_LIST));
            } catch (error) { }

            if (!array_loved_one) {
                $scope.getLovedOneList_main($scope.getLovedOneList_callback);
            } else {
                $scope.session_variables.array_loved_one = array_loved_one;
                $scope.getLovedOneList_callback($scope.session_variables.array_loved_one);
            }
        }//end

        $scope.getLovedOneList_callback = function(data) {
            $scope.progressDone = true;

            if (data.success == 0) {
                return;
            }

            if (JSON.stringify(data) != '[]') {
                $scope.temp.lovedone_list = data;
                $scope.SaveInLocalStorage($scope.localStorageKeys.LOVED_ONE_LIST, JSON.stringify($scope.temp.lovedone_list));
            } else {
                $scope.temp.lovedone_list = null;
            }
        }


        $scope.pickDate = function(value) {
            //alert(value);
            $scope.currDateScope = value;//'history', 'allergy', 'health', 'contact' ;
            var allowOld = false;
            var allowFuture = true;
            date_picker.getDate('date', $scope.pickdate_callback, allowOld, allowFuture);
        };
        $scope.pickTime = function(value) {
            //alert(value);
            $scope.currDateScope = value;//'history', 'allergy', 'health', 'contact' ;
            var allowOld = false;
            var allowFuture = true;
            date_picker.getDate('time', $scope.pickdate_callback, allowOld, allowFuture);
        };
        $scope.pickdate_callback = function(data) {
            var format = "dd/mm/yyyy";
            alert(JSON.stringify(data));
            //$scope.reg.dob = date_picker.getDateInFormat(data.currDate, format);
            if ($scope.currDateScope == 1) {
                $scope.temp.from_date = data.currDate;
            } else if ($scope.currDateScope == 2) {
                $scope.temp.from_time = data.currTime;
            } else if ($scope.currDateScope == 3) {
                $scope.temp.to_date = data.currDate;
            } else if ($scope.currDateScope == 4) {
                $scope.temp.to_time = data.currTime;
            }
            // alert($scope.medRec_temp.myhistory.date + '  '+ $scope.currDateScope);
        }

        $scope.saveReminder = function() {
            //1. save on server 

            //2. save on local
            // Schedule notification for tomorrow to remember about the meeting
            try {

                // $scope.temp.from_date = "2016-04-24";
                // $scope.temp.from_time = "11:00 AM";
                // $scope.temp.to_date = "2016-04-24";
                // $scope.temp.to_time = "01:05 PM";

                //      alert(JSON.stringify($scope.temp.selected_lovedone));

                $scope.data = {};
                $scope.data.id = Math.floor((Math.random() * 100000) + 1000);;//new Date().getMilliseconds();
                $scope.data.title = $scope.getValueInJson($scope.temp.purpose_list, $scope.temp.purpose_id, "purpose_id", "purpose");//'Doctor Visit';
                $scope.data.text = $scope.temp.event_description;//+  '<br/>At ' + $scope.temp.from_date + ' ' + $scope.temp.from_time;;
                
                var time = date_picker.convertTo24HourFormat($scope.temp.from_time);
                var time2 = date_picker.convertTo24HourFormat($scope.temp.to_time);
                $scope.data.at = $scope.parseDate($scope.temp.to_date, time2);//new Date(2016, 3, 13, 0, 30, 0, 0);//
                
                $scope.data.data = {
                    id: $scope.data.id,
                    place: $scope.temp.place,
                    from_time: $scope.parseDate($scope.temp.to_date, time),
                    to_time: $scope.parseDate($scope.temp.to_date, time2),
                    time_place: 'at ' + $scope.temp.place + ' on ' + $scope.temp.to_date + ' ' + $scope.temp.to_time,
                    loved_one: $scope.temp.selected_lovedone
                };

                $scope.data.every = $scope.temp.repetition_id == 0 ? undefined : $scope.temp.repetition_id;

               // alert(JSON.stringify($scope.data));

                //save it in local storage
                var local_notification_list = JSON.parse($scope.GetInLocalStorage($scope.localStorageKeys.LOCAL_NOTIFICATIONS));
                if (local_notification_list) {
                    local_notification_list.push($scope.data);
                } else {
                    local_notification_list = [];
                    local_notification_list.push($scope.data);
                }
                $scope.SaveInLocalStorage($scope.localStorageKeys.LOCAL_NOTIFICATIONS, JSON.stringify(local_notification_list));

                //schdule it
                //$scope.schedule_notification($scope.data);

                $scope.showAlertWindow_Titled("Success", "Reminder scheduled", $scope.closeModal);
            } catch (error) {
                alert("Error in scheduling : " + error);
            }
        }//

        $scope.parseDate = function(date, time) {
            var dateArr = date.split('-');
            var timeArr = time.split(':');
            // alert(JSON.stringify(parseInt(dateArr[0])+","+ parseInt(dateArr[1] - 1)+","+ parseInt(dateArr[2])+","+ parseInt(timeArr[0])+","+ parseInt(timeArr[1])+","+ 0+","+ 0));
            var date = new Date(parseInt(dateArr[0]), parseInt(dateArr[1] - 1), parseInt(dateArr[2]), parseInt(timeArr[0]), parseInt(timeArr[1]), 0, 0);
            //   alert("date : " + date);
            return date;
        }


        $scope.onLovedOneChange = function() {
            $scope.temp.selected_lovedone = $scope.temp.lovedone_list[$scope.temp.loved_one_id.split('_')[1]];
            var t = "";
        }
    });
