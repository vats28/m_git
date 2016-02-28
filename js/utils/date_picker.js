'use.strict'
/*
 * common/constants.js
 *
 * (c) 2014 Vincent Maliko http://frnchnrd.com
 * License: MIT
 */

angular.module('utils.date_picker', [])

    .factory('date_picker', function ($cordovaDatePicker) {

        function _getDate(dateOrTime, callback, allowOld, allowFuture) {
            try {
                var _maxDate, _minDate = undefined;
                if (!allowOld) {
                    _minDate = new Date() - 0;
                }
                if (!allowFuture) {
                    _maxDate = new Date() - 0;
                }
                var options = {
                    date: new Date(),
                    mode: dateOrTime,//'date', // or 'time'
                    minDate: _minDate,
                    maxDate: _maxDate,
                    allowOldDates: allowOld,
                    allowFutureDates: allowFuture,
                    doneButtonLabel: 'DONE',
                    doneButtonColor: '#F2F3F4',
                    cancelButtonLabel: 'CANCEL',
                    cancelButtonColor: '#000000'
                };

                $cordovaDatePicker.show(options).then(function (date) {
                    date = convertDate(date);
                    //alert(date.currDate);

                    callback(date);
                });

            } catch (err) {
                alert(err);
                callback(null, err);
            }
        }

        function convertDate(data) {
            try {
                var date = {};
                date.currDate = data.getFullYear() + "-" + padLeftZero(data.getMonth() + 1) + "-" + padLeftZero(data.getDate());
                //date.currDate = formatDate_with_month_name(date.currDate);
                var hours, ampm;

                if (data.getHours() > 12) {
                    hours = (data.getHours() - 12);
                    ampm = 'PM';
                } else {
                    hours = data.getHours();
                    ampm = 'AM';
                }

                date.currTime = padLeftZero(hours) + ":" + padLeftZero(data.getMinutes()) + " " + ampm;
            } catch (err) {
                alert(err);
            }
            return date;
        }

        function padLeftZero(data) {
            if (('' + data).length < 2)
                data = "0" + data;
            return data;
        }

        var month_names = new Array("Jan", "Feb", "Mar",
            "Apr", "May", "Jun", "Jul", "Aug", "Sep",
            "Oct", "Nov", "Dec");

        function formatDate_with_month_name(datestring) { //from 1928-10-25 to  may 21, 1988
            //  alert(datestring);
            var result = "";
            if (!datestring || datestring == "")
                return result;
            //alert(datestring);
            //var datArr = datestring.split('/');
            //var curr_date = new Date(datArr[2], datArr[1], datArr[0]); // new Date(y,m,d);
            var datArr = datestring.split('-');
            var curr_date = new Date(datArr[0], (datArr[1] - 1), datArr[2]); // new Date(y,m,d);
            result = month_names[curr_date.getMonth()] + ' ' + curr_date.getDate() + ', ' + curr_date.getFullYear();

            return result;
        }//end formatDate_with_month_name

        function ConvertDateToString(date, format) {
            var result = "";
            var datArr = result.split('-');
            if (format == "dd/mm/yyyy") {
                result = curr_date.getDate() + '/' + curr_date.getMonth() + '/' + curr_date.getFullYear();
            } else if (format == "yyyy-mm-dd") {
                result = data.getFullYear() + "-" + padLeftZero(data.getMonth() + 1) + "-" + padLeftZero(data.getDate());
            }

            return result;
        }//ned formattedDate

        function formattedDate(dateString, format) {
            var result = "";
            if (dateString == "")
                return result;
            //alert(datestring);
            var datArr = dateString.split('-');
            if (format == "dd/mm/yyyy") {
                var curr_date = new Date(datArr[0], datArr[1], datArr[2]); // new Date(y,m,d);
                result = curr_date.getDate() + '/' + curr_date.getMonth() + '/' + curr_date.getFullYear();
            } else if (format == "mm/dd/yyyy") {
                var curr_date = new Date(datArr[0], datArr[1], datArr[2]); // new Date(y,m,d);
                result = curr_date.getMonth() + '/' + curr_date.getDate() + '/' + curr_date.getFullYear();
            } else if (format == "yyyy/mm/dd") {
                var curr_date = new Date(datArr[0], datArr[1], datArr[2]); // new Date(y,m,d);
                result = curr_date.getFullYear() + '/' + curr_date.getMonth() + '/' + curr_date.getDate();
            }

            return result;
        }//ned formattedDate

        function _getAge(date, month, year) {
            var birthdate = new Date(year, month, date);// new Date(y,m,d);
            var cur = new Date();
            var diff = cur - birthdate; // This is the difference in milliseconds
            var age = Math.floor(diff / 31536000000); // Divide by 1000*60*60*24*365
            return age;
        }

        return {
            getDate: function (dateOrTime, callback, allowOld, allowFuture) {
                _getDate(dateOrTime, callback, allowOld, allowFuture);
            },
            getDateWithMonthName: function (dateString) {
                return formatDate_with_month_name(dateString);
            },
            getDateInFormat: function (dateString, format) {
                return formattedDate(dateString, format);
            },
            getAge: function (date, month, year) {
                return _getAge(date, month, year);
            },
            convertDateToString: function (date, format) { // new date(), yyyy-mm-dd
                return ConvertDateToString(date, format);
            }
        }
    });
