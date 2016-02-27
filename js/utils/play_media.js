'use.strict'
/*
 * common/constants.js
 *
 * (c) 2014 Vincent Maliko http://frnchnrd.com
 * License: MIT
 */

angular.module('services.common.camera', [])

    .factory('generic_camera_service', function ($cordovaCamera) {

        function onShowCamera(sourceType,callback, targetWidth, targetHeight) {
            try {
                var options = {
                    quality: 80,
                    destinationType: Camera.DestinationType.FILE_URI,// Camera.DestinationType.DATA_URL,
                    sourceType: sourceType,//Camera.PictureSourceType.CAMERA, PHOTOLIBRARY
                    allowEdit: true,
                    encodingType: Camera.EncodingType.PNG,
                    targetWidth: targetWidth,
                    targetHeight: targetHeight,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false,
                    correctOrientation: true
                };

                $cordovaCamera.getPicture(options).then(function (imageData) {
                    //var image = document.getElementById('myImage');
                   // image.src = "data:image/jpeg;base64," + imageData;
                    callback(imageData);
                }, function (err) {
                    // error
                });
            } catch (err) {
                alert(err);
            }
        }

        return {
            callCamera: function (callback, targetWidth, targetHeight) {
               var sourceType = Camera.PictureSourceType.CAMERA;
                onShowCamera(sourceType, callback, targetWidth, targetHeight);
            },
            callGallery: function (callback, targetWidth, targetHeight) {
               var sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
                onShowCamera(sourceType, callback, targetWidth, targetHeight);
            }
        }
    });
