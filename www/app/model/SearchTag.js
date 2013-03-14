window.SearchTag = Backbone.Model.extend({
    
    initialize: function() {
        this.subTags = new SearchTagList();
        this.subTags.parentId = this.id;
        this.subTags.disableInclude = this.disableInclude;
    },
    
    sync: function(method, model, options) {
        var dao = new SearchTagDAO(localLifeDB);
        switch (method) {
            case "read":
                if(model.id) {
                    dao.findById(model.id, function(data) {
                        options.success(data);
                    });
                }
            
                if(model.parentId) {
                    dao.findByParent(model.parentId, model.disableInclude, function(data) {
                        options.success(data);
                    });
                }
                break;
        }
    }
});

window.SearchTagList = Backbone.Collection.extend({
    
    model: SearchTag,
    
    findByName: function(key) {
        var dao = new SearchTagDAO(localLifeDB),
            self = this;
        dao.findByName(key, function(data) {
            self.reset(data);
        });
    },
    
    getPrefectNormal: function() {
        var dao = new SearchTagDAO(localLifeDB),
            self = this;
        dao.getPrefectNormal(function(data) {
            self.reset(data);
        });
    },
    
    getPrefectNear: function() {
        var dao = new SearchTagDAO(localLifeDB),
            self = this;
        dao.getPrefectNear(function(data) {
            self.reset(data);
        });
    }
});