'use.strict'
/*
 * common/constants.js
 *
 * (c) 2014 Vincent Maliko http://frnchnrd.com
 * License: MIT
 */

angular.module('utils.validations', [])

    .factory('form_validator', function ($cordovaCamera, $cordovaCapture) {

        function _IsValidEmail(email) {
            var result = false;
            try {
                var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                result = re.test(email);
            } catch (error) {

            }
            return result;
        }

        function _IsValidPhoneNumber(number) {
            var result = false;
            try {
                var phoneno = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
                result = number.match(phoneno);
            } catch (error) {

            }
            return result;
        }

        return {
            IsValidEmail: function (email) {
                return _IsValidEmail(email);
            },
            IsValidPhoneNumber: function (phone) {
                return _IsValidPhoneNumber(phone);
            }
        }
    });
