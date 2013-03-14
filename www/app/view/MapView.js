templates.MapView = "app/view/MapView.html";

window.MapView = Backbone.View.extend({
    
    scroll: false,
    
    initialize: function(options) {
        this.render();
        this.view = this.$el;
        this.initMap();
    },
        
    events:{
        "click a": "openExternalLink"
    },
        
    render: function (eventName) {
        $(this.el).html(this.template());
        this.setElement(this.$("#mapView"));
        
        var style = " ";
        if ( window.viewNavigator && window.viewNavigator.history.length >= 1 ) {
            this.backLabel = '返回';
            style = "margin-left: 65px;";
        }
        this.titleActions = $('<div id="goSearch" class="ui-input-search ui-shadow-inset ui-btn-corner-all ui-btn-shadow ui-icon-search ui-body-c" style="' + style + '">地点、顺风车、出租车、餐饮、住宿、购物</div>');
        var self = this;
        this.titleActions.on( "click", function(event){
            self.goSearch(event);
        } );
        
        return this;
    },
        
    initMap: function() {

        setTimeout( function() {
            var map = new BMap.Map('map', {enableHighResolution: false});

            window.infoWin = new BaiduMap.InfoWindow(map);            

            var point = new BMap.Point(116.404, 39.915);
            if (window.localStorage.getItem("mypostion_latitude") && window.localStorage.getItem("mypostion_longitude")) {
                point = new BMap.Point(window.localStorage.getItem("mypostion_longitude"), window.localStorage.getItem("mypostion_latitude"));
            }
            var mapLevel = BaiduMap.MAP_MAXLEVEL - 1;
            if (window.localStorage.getItem("mymap_level")) {
                //坑爹啊！必须转化成整数，否则需要先缩小才能放大!!切记!!!
                mapLevel = parseInt(window.localStorage.getItem("mymap_level"));
            }
            map.centerAndZoom(point, mapLevel);

            map.enableKeyboard();
            map.enableInertialDragging();
            map.enableContinuousZoom();

            map.addControl(new BaiduMap.GeolocationControl({enableAutoLocation: true, locationIcon: new BMap.Icon("assets/img/center.png", new BMap.Size(18, 18)) }));
            map.addControl(new BMap.MapTypeControl({ anchor: BMAP_ANCHOR_TOP_RIGHT, offset: new BMap.Size(2, 2) }));
            map.addControl(new BaiduMap.ScaleControl());
            map.addControl(new BaiduMap.NavigationControl());
        }, 150);
    },

    goSearch: function() {
        var serchView = new SearchView();
        window.viewNavigator.pushView( serchView );
    },
            
    openExternalLink: function (event) {
                       
    	event.stopImmediatePropagation();
        event.preventDefault();

	return false;
    }
});