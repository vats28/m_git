/**
 * Created by vats_ace on 2/20/2016.
 */

var setLat;
var setLon;
var _intentAddAppointment = false;


function showMap(address) {
    //alert(address);
    window.open("http://maps.google.com/?q=" + address, "_system");
}

function launchMail(email) {
    //alert("email : " + email);
    //window.open("mailto:?subject=Something to share with you...");
    window.location.href = "mailto:" + email + "?subject=Something to share with you...";
}

function launchCall(number) {
    //alert("number : " + number);
    //window.open('tel:' + number);
    window.location.href = 'tel:' + number;
}

function scope_search() {
    $scope.listScope = angular.element(document.querySelector('[ng-controller=MyDropList]')).scope();
    var scope = angular.element(document.querySelector('#outside')).scope();
    scope.$apply(function () {
        scope.msg = 'Superhero';
    })
}

function getController(controllerName) {
    var scope = angular.element(document.querySelector('[ng-controller=' + controllerName + ']')).scope();
    return scope;
}

function getJsonKey(jsonObject) {
    return Object.keys(jsonObject)
}//end

function closeKeyboard() {
    if (IsMobileDevice()) {
        cordova.plugins.Keyboard.close();
    }
}

function IsMobileDevice() {
    var retval = false;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // some code..
        retval = true;
    }
    retval;
}

var inAppBrowserbRef;
function launchInAppBrowser(url) {
    launchInAppBrowserWithZoom(url);
    //inAppBrowserbRef = window.open(url, '_blank');//, 'location=no');
    // inAppBrowserbRef.addEventListener('loadstart', inAppBrowserbLoadStart);
    //inAppBrowserbRef.addEventListener('loadstop', inAppBrowserbLoadStop);
    //inAppBrowserbRef.addEventListener('loaderror', inAppBrowserbLoadError);
    //inAppBrowserbRef.addEventListener('exit', inAppBrowserbClose);
}
function launchInAppBrowserWithZoom(url) {
    inAppBrowserbRef = window.open(url, '_blank', 'EnableViewPortScale=yes');
}


function inAppBrowserbLoadStart(event) {

    alert(event.type + ' - ' + event.url);
    msg = 'please wait ..';
    try {

        spinnerplugin.show();
    } catch (err) {
        alert('sdds' + err);
    }
    //navigator.notification.activityStart("Please Wait", "Its loading....");
    //alert(event.type + ' - ' + event.url);

}

function inAppBrowserbLoadStop(event) {

    //navigator.notification.activityStop();
    alert(event.type + ' - ' + event.url);
    try {
        spinnerplugin.hide();
    } catch (err) {
        alert('sdds' + err);
    }

}

function inAppBrowserbLoadError(event) {
    navigator.notification.activityStop();
    alert(event.type + ' - ' + event.message);
}

function inAppBrowserbClose(event) {
    //navigator.notification.activityStop();
    alert(event.type);
    inAppBrowserbRef.removeEventListener('loadstart', inAppBrowserbLoadStart);
    inAppBrowserbRef.removeEventListener('loadstop', inAppBrowserbLoadStop);
    inAppBrowserbRef.removeEventListener('loaderror', inAppBrowserbLoadError);
    inAppBrowserbRef.removeEventListener('exit', inAppBrowserbClose);
}


function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

function IsValidPhoneNumber(number) {
    var phoneno = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
    if (number.match(phoneno)) {
        return true;
    }
    else {
        return false;
    }
}

function GA_track_screen(screen_name){
    try {
        // window.analytics.trackView(screen_name);
    }catch (err){

    }
}

function GA_track_event(API, result, tag1, tag2 ){
    try {
        if(OS.IOS) {
            // window.analytics.trackEvent('webservice', API, result, 1);
            sendEvent('webservice', API, 'success', 1);
        }else{
            sendEvent('webservice', API, result, 1);
        }
    }catch(err){

    }
}



function scrollTop() {
    //alert("Called scrollTop");
    $rootScope.scrollTop();
}

