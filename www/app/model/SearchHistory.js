window.SearchHistory = Backbone.Model.extend({
    idAttribute: "keyword",
    defaults: {
	keyword: '',
        point: null,
        category: false,
        lastVisit: new Date()
    }
});

var searchHisStack = Backbone.Collection.extend({
    model: SearchHistory,
    localStorage: new Store('searchHis-backbone'),
    comparator: function( sh1, sh2 ) {
        if(sh1.get('lastVisit') > sh2.get('lastVisit')) return -1;
        if(sh1.get('lastVisit') < sh2.get('lastVisit')) return 1;
        return 0;
    }
});

window.searchHises = new searchHisStack();