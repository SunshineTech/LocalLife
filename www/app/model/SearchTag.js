window.SearchTag = Backbone.Model.extend({
    
    initialize: function() {
        this.subList = new SearchTagList();
        this.subList.parentId = this.id;
    },
    
    sync: function(method, model, options) {
        
    }
});

window.SearchTagList = Backbone.Collection.extend({
    model: SearchTag
});