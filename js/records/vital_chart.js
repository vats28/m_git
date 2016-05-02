angular.module('starter.vital', [])

    .controller('vitalCtrl', function($scope) {
        $scope.temp = {};
        $scope.$on('refresh_pat_vital', function(event, data) {
            $scope.getVital_records();
        });

        $scope.init = function() {
            $scope.create_graph($scope.session_variables.vitalRecordList[0].VitalNatureId);
        }//end

        $scope.create_graph = function(VitalNatureId) {
            if (!VitalNatureId) {
                return;
            }
            try {
                $scope.lineChartData = {};
                $scope.lineChartData.labels = [];
                $scope.lineChartData.datasets = [];

                var x = {};
                x.data = [];

                $scope.lineChartData.labels.push("0");
                x.data.push(0);
                var count = 1
                angular.forEach($scope.session_variables.vitalRecordList, function(value, key) {

                    if (value["VitalNatureId"] == VitalNatureId) {
                        $scope.lineChartData.labels.push(count++);
                        x.data.push(value["Readings"]);
                    }
                });
                $scope.lineChartData.datasets.push(x);
                $scope.activeData = $scope.lineChartData;

                $scope.temp.VitalNatureId = VitalNatureId;
            } catch (error) {
                alert(error);
            }
        }//end 


        $scope.addVitals = function() {
            $scope.showModal('templates/popups/add_vitals.html')
        }//end



        $scope.getVital_records = function() {
            $scope.getVital_records_main($scope.getVital_records_callback);
        }//end
        $scope.getVital_records_callback = function(data) {
            console.log(JSON.stringify(data));
            if (data.success == 0) {
                $scope.showToast("Error in fetching vital records");
                return;

            }
            if (JSON.stringify(data).trim().length > 10) {
                $scope.session_variables.isVitalDataAvailable = true;
                $scope.session_variables.vitalRecordList = data;
                //$scope.create_graph($scope.session_variables.vitalRecordList[0].VitalNatureId);
            } else {
                $scope.showAlertWindow_Titled("Error", "Vital records not available");
            }
        }//end
    });
