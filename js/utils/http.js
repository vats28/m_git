'use.strict'
/*
 * common/constants.js
 *
 * (c) 2014 Vincent Maliko http://frnchnrd.com
 * License: MIT
 */

angular.module('utils.http_post', [])

    .factory('generic_http_post_service', function ($http, $timeout) {
        var server_host = 'http://test.tn.mcura.com/';
        var server_api_path = 'ConsumerService.svc/Json/';
        var dev_server_host = 'http:/dev.mcura.com/';
        var dev_server_api_path = 'ConsumerService.svc/Json/';
        var services_address = Object.freeze({
            LOGIN: server_host + server_api_path + 'GetLogin',
            PAT_REGISTER: server_host + server_api_path + 'PatDemographicsInsert',
            PAT_MED_HISTORY_INSERT: server_host + server_api_path + 'PatMedHistoryInsert',//GetPatDetails?userId={USERID}
            GET_PAT_DETAILS: server_host + server_api_path + 'GetPatDetails',
            POST_ALLERGY: server_host + server_api_path + 'PostAllergy',
            POST_HEALTH_CONDITION: server_host + server_api_path + 'PostHealthCondtion',
            POST_EMERGENCY_CONTACT: server_host + server_api_path + 'EmergencyContactInsert',
            GET_ALLERGY_TYPE: server_host + server_api_path + 'GetAllergyType',
            GET_ALLERGY: server_host + server_api_path + 'GetAllergy',
            GET_HEALTH_CONDITION_TYPE: server_host + server_api_path + 'GetHealthConditionType',
            GET_HEALTH_CONDITIONS: server_host + server_api_path + 'GetHealthHConditions',
            GET_RELATIONSHIP_MASTER: server_host + server_api_path + 'GetRelationship_master',
            FILE_UPLOAD: server_host + server_api_path + 'FileUpload',
            //FILE_UPLOAD: server_host + server_api_path + 'FileUploadImage',
            //FILE_UPLOAD: 'http://dev.mcura.com/ConsumerService.svc/Json/FileUpload',
            //FILE_UPLOAD: 'http://dev.mcura.com/ConsumerService.svc/Json/FileUploadNew',
            GET_MEDICAL_RECORD_NATURE: server_host + server_api_path + 'GetMedicalRecordNature',
            PAT_MED_RECORD_INSERT: server_host + server_api_path + 'PatMedRecordsInsert',
            UPLOAD_PAT_IMAGE: server_host + server_api_path + 'UploadPatImage',
            UPDATE_PAT_IMAGE: server_host + server_api_path + 'UpdatePatImage',
            REGISTER_LOVEDONE: server_host + server_api_path + 'Register_Lovedone',
            GET_LOVEDONE: server_host + server_api_path + 'GetLovedones',
            USER_PRIVACY_SHARING_INSERT: server_host + server_api_path + 'UserPrivacySharingInsert',
            ADD_ACTION_REMINDER: server_host + server_api_path + 'AddActionReminder',
            GET_SUBTENANT_SEARCH: server_host + server_api_path + 'GetSubTenantSearch',
            GET_VITAL: server_host + server_api_path + 'GetVital',
            GET_VITAL_RECORDS: server_host + server_api_path + 'GetPatVitalRecords',
            //http://dev.mcura.com/ConsumerService.svc/Json/GetSubTenantSearch?areaId={AREAID}&subTenant={SUBTENANT}
            //AddActionReminder
            
    //         {"UserPrimaryRoleID":1551, "ActionDescription":"Doctor Visit", 
    //         "DateToBeCompleted":"2016/03/04", "AssociatedMcuraId": 1651, "ReminderNature":"app", 
    // "AD":[{"AssociatedMcuraId":1651, "DependentActiondetId":0, 
    // "ReminderBefore": 6, "ReminderIntervalInHrs":"5", "Stepno":1, "StepStatus":1, "StepDescription":"Call to Doctor"}]
                    //}
                    
                    
        });

        var networkError = {
            success: 0,
            failure_title: 'Error',
            failure_msg: 'No Network Connectivity',
            error_code: 101
        };
        var networkTimeout = {
            success: 0,
            failure_title: 'Error',
            failure_msg: 'ohh oh! connection timeout',
            error_code: 101
        };
        var isTimedOut = false;
        return {
            getHost: function () { return server_host },
            getServices: function () { return services_address },
            getDetails: function (API, requestData, callback) {
                isTimedOut = true;

                $http.post(API, requestData).
                    success(function (data, status, headers, config) {
                        //alert("data" + JSON.stringify(data));
                        isTimedOut = false;
                        try {
                            // window.analytics.trackEvent('webservice', API, 'success', 'http_post');
                        } catch (err) {

                        }
                        callback(data);
                    }).
                    error(function (data, status, headers, config) {
                        // alert("data" + JSON.stringify(data));
                        console.log("status : " + JSON.stringify(status));
                        //  alert("headers" + JSON.stringify(headers));
                        //  alert("config" + JSON.stringify(config));
                        // window.analytics.trackEvent('webservice', API, 'fail', 'http_post');
                        isTimedOut = false;
                        callback(networkError);
                    });

                //call timeout if gets late in calling
                /* $timeout(function () {
                 if(isTimedOut)
                 callback(networkTimeout);
                 }, 10000);// five seconds timeout*/
            },
            getDetails_httpget: function (API, requestData, callback) {
                isTimedOut = true;
                // alert("data" + JSON.stringify(requestData));
                API += '?';
                angular.forEach(requestData, function (value, key) {
                    API += key + '=' + value + '&';
                });

                //alert(API);
                $http.get(API, {timeout: 1000 * 10}).
                    success(function (data, status, headers, config) {

                        isTimedOut = false;
                        callback(data);
                    }).
                    error(function (data, status, headers, config) {
                        //alert("data" + JSON.stringify(data));
                        console.log("status : " + JSON.stringify(status));
                        //alert("headers" + JSON.stringify(headers));
                        //alert("config" + JSON.stringify(config));
                        isTimedOut = false;
                        callback(networkError);
                    });

            }
        }
    });
