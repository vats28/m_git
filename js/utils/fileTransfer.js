'use.strict'
/*
 * common/constants.js
 *
 * (c) 2014 Vincent Maliko http://frnchnrd.com
 * License: MIT
 */

angular.module('utils.fileTransfer', [])

    .factory('fileTransfer', function ($cordovaFileTransfer, $cordovaFile) {

        var directory = "";
        function createDirectory(callback) {
            // CHECK
            //alert(0);
            
            $cordovaFile.checkDir(cordova.file.dataDirectory, "mcura_dir")
                .then(function (success) {
                    // success
                    alert('success ' + JSON.stringify(success));
                    directory =  success.nativeURL;
                }, function (error) {
                    // CREATE
                    $cordovaFile.createDir(cordova.file.dataDirectory, "mcura_dir", false)
                        .then(function (success) {
                            // success
                            alert('success ' + JSON.stringify(success));
                            directory =  success.nativeURL;
                        }, function (error) {
                           callback(-1, error);
                        });
                });
                
                return directory;
        }

        function download(callback, url, targetPath, options, trustHosts) {
            try {
                if (url == null && targetPath == null) {
                    callback(-1, 'parameters not supplied correctly !!');
                    return;
                }
                else {
                    //checking Internet connection availablity
                    /* var networkState = navigator.connection.type;
                     if (networkState == Connection.NONE) {
                         callback(-1, 'No Internet !!');
                         return;
                     }*/
                }
                targetPath = createDirectory(callback) + targetPath;
                alert(targetPath);
                $cordovaFileTransfer.download(url, targetPath)//, options, trustHosts)
                    .then(function (result) {
                        // Success!
                        alert('Success ' +JSON.stringify(result));;
                        callback(result);
                    }, function (err) {
                        // Error
                        alert(JSON.stringify(err));
                        callback(-1, err);
                    }, function (progress) {

                        alert(JSON.stringify(progress));
                        var downloadProgress = (progress.loaded / progress.total) * 100;
                        callback(-2, downloadProgress);
                    });

                //alert(2);
            } catch (err) {
                callback(-1, err);
            }
        }

        function upload(callback, server, filePath, options) {
            try {
                $cordovaFileTransfer.upload(server, filePath, options)
                    .then(function (result) {
                        // Success!
                        callback(result);
                    }, function (err) {
                        // Error
                        callback(-1, err);
                    }, function (progress) {
                        // constant progress updates
                        //alert(JSON.stringify(progress));
                        var uploadProgress = (progress.loaded / progress.total) * 100;
                        //alert(uploadProgress);
                        callback(-2, uploadProgress);
                    });
            } catch (err) {
                callback(-1, err);
            }
        }

        return {
            downloadFile: function (callback, url, targetPath, options) {

                download(callback, url, targetPath, options, true);
            },
            uploadFile: function (callback, server, filePath, options) {
                upload(callback, server, filePath, options)
            }
        }
    });
