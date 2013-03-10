document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    loadTemplates( appTemplatesLoaded );
}

function appTemplatesLoaded() {
    $("body").empty();
    
    var homeView;
    if(window.localStorage.getItem("preference_homeView")) {
        homeView = new (window.localStorage.getItem("preference_homeView"))();
    } else {
        homeView = new MapView();
    }
    
    //Setup the ViewNavigator
    window.viewNavigator = new ViewNavigator( 'body' );	
    window.viewNavigator.pushView( homeView );
    document.addEventListener("backbutton", onBackKey, false);
}

function onBackKey( event ) {
    if(window.unBackable) {
        event.preventDefault();
        window.unBackable = false;
        return false;
    }
    
    if ( window.viewNavigator.history.length > 1 ) {
        event.preventDefault();
        window.viewNavigator.popView();
        return false;
    }
    
    NativeUtil.showConfirm(
        '您确定要退出乐卡本地生活吗？',
        function(confirm) {
            if(confirm) {
                navigator.app.exitApp();
            } else {
                event.preventDefault();
                return false;
            }
        }
    );
}

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);