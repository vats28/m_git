'use.strict'
/*
 * common/constants.js
 *
 * (c) 2014 Vincent Maliko http://frnchnrd.com
 * License: MIT
 */

angular.module('utils.camera', [])

    .factory('generic_camera_service', function ($cordovaCamera, $cordovaCapture) {

        function onShowCamera(sourceType, callback, targetWidth, targetHeight) {
            try {
                var options = {
                    quality: 80,
                    destinationType: Camera.DestinationType.FILE_URI,// Camera.DestinationType.DATA_URL,
                    sourceType: sourceType == 'cam' ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.PHOTOLIBRARY,//Camera.PictureSourceType.CAMERA, PHOTOLIBRARY
                    //allowEdit: true,
                    encodingType: Camera.EncodingType.PNG,
                    targetWidth: targetWidth,
                    targetHeight: targetHeight,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: true,
                    // correctOrientation: true
                };


                $cordovaCamera.getPicture(options).then(function (imageData) {
                    try {
                        window.resolveLocalFileSystemURI(imageData, function (fileEntry) {
                            imageData = fileEntry.nativeURL;
                        });
                    } catch (error) {
                        alert(error);
                    }
                    callback(imageData);

                }, function (err) {
                    callback(-1, err);
                });
            } catch (err) {
                callback(-1, err);
            }
        }


        function captureVideo(callback, limit, duration) {
            var options = { limit: limit, duration: duration };

            $cordovaCapture.captureVideo(options).then(function (videoData) {
                callback(videoData);
            }, function (err) {
                // An error occurred. Show a message to the user
                callback(-1, err);
            });
        }

        return {
            callCamera: function (callback, targetWidth, targetHeight) {
                onShowCamera('cam', callback, targetWidth, targetHeight);
            },
            callGallery: function (callback, targetWidth, targetHeight) {
                onShowCamera('gal', callback, targetWidth, targetHeight);
            },
            callVideo: function (callback, limit, duration) {
                captureVideo(callback, limit, duration);
            }
        }
    });
