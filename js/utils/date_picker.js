'use.strict'
/*
 * common/constants.js
 *
 * (c) 2014 Vincent Maliko http://frnchnrd.com
 * License: MIT
 */

angular.module('utils.date_picker', [])

    .factory('date_picker', function ($cordovaDatePicker) {

        function _getDate(dateOrTime, callback, allowOld, allowFuture, minDate, maxDate) {
            try {
                //var _maxDate, _minDate = undefined;
                allowOld = allowOld != undefined ? allowOld : true;
                allowFuture = allowFuture != undefined ? allowFuture : true;
                if (!allowOld) {
                    if (minDate == null) {
                        minDate = new Date() - 0;
                    }
                }
                if (!allowFuture) {
                    if (maxDate == null) {
                        maxDate = new Date() - 0;
                    }
                }
                // alert('minDate  ' + minDate);
                //alert('maxDate  ' + maxDate);
                var options = {
                    date: new Date(),
                    mode: dateOrTime,//'date', // or 'time'
                    minDate: minDate,
                    maxDate: maxDate,
                    allowOldDates: allowOld,
                    allowFutureDates: allowFuture,
                    doneButtonLabel: 'DONE',
                    doneButtonColor: '#F2F3F4',
                    cancelButtonLabel: 'CANCEL',
                    cancelButtonColor: '#000000'
                };


                $cordovaDatePicker.show(options).then(function (date) {
                    date = convertDate(date);
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
        
        function convertTo24HourFormat(time) {
           var timeArr = time.trim().split(' ');
           var hour, min = 0;
           if(timeArr[1].toUpperCase() == "PM"){
               timeArr = timeArr[0].split(":");
               hour = parseInt(timeArr[0]) + 12;
               min = timeArr[1];
           }else{
               timeArr = timeArr[0].split(":");
               hour = parseInt(timeArr[0]);
               min = timeArr[1];
           }
           
           return hour+":"+min;
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

            var datArr = datestring.split('-');
            var curr_date = new Date(datArr[0], (datArr[1] - 1), datArr[2]); // new Date(y,m,d);
            result = month_names[curr_date.getMonth()] + ' ' + curr_date.getDate() + ', ' + curr_date.getFullYear();

            return result;
        }//end formatDate_with_month_name

        function ConvertDateToString(date, format) {
            var result = "";
            //var datArr = result.split('-');

            if (format == "dd/mm/yyyy") {
                result = padLeftZero(date.getDate()) + '/' + padLeftZero(date.getMonth() + 1) + '/' + date.getFullYear();
            } else if (format == "mm/dd/yyyy") {
                result = padLeftZero(date.getMonth() + 1) + '/' + padLeftZero(date.getDate()) + '/' + date.getFullYear();
            } else if (format == "yyyy-mm-dd") {
                result = date.getFullYear() + "-" + padLeftZero(date.getMonth() + 1) + "-" + padLeftZero(date.getDate());
            }

            return result;
        }//ned ConvertDateToString
        
        function ConvertStringToDate(date, format) {
            var result = null;
            try {
                var datArr;
                if (format == "dd/mm/yyyy") {
                    datArr = date.split('/');
                    result = new Date(datArr[2], parseInt(datArr[1]) - 1, datArr[0]);
                } else if (format == "mm/dd/yyyy") {
                    datArr = date.split('/');
                    result = new Date(datArr[2], parseInt(datArr[0]) - 1, datArr[1]);
                } else if (format == "yyyy-mm-dd") {
                    datArr = date.split('-');
                    result = new Date(datArr[0], parseInt(datArr[1]) - 1, datArr[2]);
                    // alert('hasbh' + result);
                }
            } catch (error) { alert(error); }

            return result;
        }//ned ConvertStringToDate

        function getDateInFormat(dateString, format) {
            var result = "";
            if (!dateString)
                return result;
            //alert(datestring);
            var datArr = dateString.split('-');
            var curr_date = new Date(datArr[0], datArr[1], datArr[2]); // new Date(y,m,d);
            if (format == "dd/mm/yyyy") {
                result = padLeftZero(curr_date.getDate()) + '/' + padLeftZero(curr_date.getMonth()) + '/' + curr_date.getFullYear();
            } else if (format == "mm/dd/yyyy") {
                result = padLeftZero(curr_date.getMonth()) + '/' + padLeftZero(curr_date.getDate()) + '/' + curr_date.getFullYear();
            } else if (format == "yyyy-mm-dd") {
                result = curr_date.getFullYear() + '-' + padLeftZero(curr_date.getMonth()) + '-' + padLeftZero(curr_date.getDate());
            } else if(format == 'yyyy/mm/dd'){
                result = curr_date.getFullYear() + '/' + padLeftZero(curr_date.getMonth()) + '/' + padLeftZero(curr_date.getDate());
            }

            return result;
        }//ned getDateInFormat
        
        function _getAge(date, month, year) {
            var birthdate = new Date(year, month, date);// new Date(y,m,d);
            var cur = new Date();
            var diff = cur - birthdate; // This is the difference in milliseconds
            var age = Math.floor(diff / 31536000000); // Divide by 1000*60*60*24*365
            return age;
        }

        function addDays(date, days) {
            return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
        }

        function isGreaterDate(startDate_string, endDate_string) {
            var retval = 0;
            try {
                var d1 = startDate_string.split("-");
                var d2 = endDate_string.split("-");
                var from = new Date(d1[0], parseInt(d1[1]) - 1, d1[2]);// y,m,d // -1 because months are from 0 to 11
                var to = new Date(d2[0], parseInt(d2[1]) - 1, d2[2]);
                if (from < to) {
                    retval = 1;
                }else if(from > to){
                    retval = 2;
                }else if(from == to){
                     retval = 3;
                }
            } catch (error) {

            }

            return retval;
        }//end
        
        

        return {
            getDate: function (dateOrTime, callback, allowOld, allowFuture, minDate, maxDate) {
                _getDate(dateOrTime, callback, allowOld, allowFuture, minDate, maxDate);
            },
            getDateWithMonthName: function (dateString) {
                return formatDate_with_month_name(dateString);
            },
            getDateInFormat: function (dateString, format) {
                return getDateInFormat(dateString, format);
            },
            getAge: function (date, month, year) {
                return _getAge(date, month, year);
            },
            convertDateToString: function (date, format) { // new date(), yyyy-mm-dd
                return ConvertDateToString(date, format);
            },
            ConvertStringToDate: function (date, format) { // new date(), yyyy-mm-dd
                return ConvertStringToDate(date, format);
            },
            convertTo24HourFormat: function (time) {
                return convertTo24HourFormat(time);
            },
            addDays: function (date, days) {
                return addDays(date, days);
            },
            isGreaterDate: function (startDate_string, endDate_string) {
                return isGreaterDate(startDate_string, endDate_string)
            }
        }
    });
