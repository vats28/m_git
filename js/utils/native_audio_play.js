'use.strict'
/*
 * common/constants.js
 *
 * (c) 2014 Vincent Maliko http://frnchnrd.com
 * License: MIT
 */

angular.module('utils.native_play_audio', [])

    .factory('native_play_audio', function ($cordovaNativeAudio) {




        function playComplex(path) {
            alert(path);
            try {

                $cordovaNativeAudio
                //.preloadComplex('click', 'audio/music.mp3', 1, 1)
                    .preloadComplex('click', path, 1, 1)
                    .then(function (msg) {
                        alert(msg);
                    }, function (error) {
                        alert(error);
                    });

                $cordovaNativeAudio.loop('music');
            } catch (error) {
                alert(error);
            }
        }//end
        
        function playSimple(path) {
            try {
                $cordovaNativeAudio
                .preloadSimple('click', 'audio.mp3')
                    // .preloadSimple('click', path)
                    .then(function (msg) {
                        alert(msg);
                    }, function (error) {
                        alert(error);
                    });

                $cordovaNativeAudio.play('click');
            } catch (error) {
                alert(error);
            }
        }//end

        function playStop() {

            $cordovaNativeAudio.stop('music');
            $cordovaNativeAudio.unload('click');
            $cordovaNativeAudio.unload('music');
        };


        return {
            playComplex: function (filePath) {
                playComplex(filePath);
            },
            playSimple: function (filePath) {
                playSimple(filePath);
            },
            playStop: function (filePath) {
                playSimple(filePath);
            }
        }
    });
