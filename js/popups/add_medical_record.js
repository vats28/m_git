angular.module('starter.addMedicalRecord', [])

    .controller('addMedicalRecordCtrl', function($scope, $rootScope, date_picker, generic_http_post_service) {

        $scope.array_list = [
            {
                recNatureId1: 1,
                img1: 'icons/visit_summary.png',
                col1: 'Doctor Visit Summary',
                recNatureId2: 2,
                img2: 'icons/advice.png',
                col2: 'Doctor Advice'
            },
            {
                recNatureId1: 3,
                img1: 'icons/prescription.png',
                col1: 'Prescription',
                recNatureId2: 4,
                img2: 'icons/path_lab.png',
                col2: 'Path Lab'
            },
            {
                recNatureId1: 5,
                img1: 'icons/diagnosis_report.png',
                col1: 'Diagnosis Report',
                recNatureId2: 6,
                img2: 'icons/diagnosis_report.png',
                col2: 'Education Material'
            },
        ];

        $scope.flipImage = function(recNatureId, cls) {
            console.log(recNatureId + '  ' + cls);
            $scope.session_variables.my_rec_nature = recNatureId;
            $scope.visibleClass = cls;
        }//end 

        $scope.dataAction = function(action) {
            $rootScope.$broadcast('call_action', action);
            $scope.closeModal();
        }
    });
