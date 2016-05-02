angular.module('starter.fileManager', [])

    .controller("fileManagerCtrl", function($scope, $ionicPlatform, $fileFactory) {


        $scope.init = function() {
            var fs = new $fileFactory();
            fs.getEntriesAtRoot().then(function(result) {
                $scope.files = result;
            }, function(error) {
                console.error(error);
            });

            $scope.getContents = function(path) {
                fs.getEntries(path).then(function(result) {
                    $scope.files = result;
                    $scope.files.unshift({ name: "[parent]" });
                    fs.getParentDirectory(path).then(function(result) {
                        result.name = "[parent]";
                        $scope.files[0] = result;
                    });
                });
            }
        }

    });