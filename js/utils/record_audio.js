'use.strict'
/*
 * common/constants.js
 *
 * (c) 2014 Vincent Maliko http://frnchnrd.com
 * License: MIT
 */

angular.module('utils.audio', [])

    .factory('audio_service', function ($cordovaCapture) {

        function captureAudio(callback, limit, duration) {
            try {

                    var options = { limit: limit, duration: duration };

                    $cordovaCapture.captureAudio(options).then(function(audioData) {
                        // Success! Audio data is here
                        callback(audioData);
                    }, function(err) {
                        // An error occurred. Show a message to the 
                        //alert(101 + JSON.stringify(err));
                        callback(-1, err);
                    });
            } catch (err) {
                 //alert(102 + err);
                callback(-1, err);
            }
        }

        return {
            callAudioRecorder: function (callback, limit, duration) {
                captureAudio(callback, limit, duration);
            }
        }
    });
