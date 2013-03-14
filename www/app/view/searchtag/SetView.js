templates.SearchTagView = "app/view/searchtag/SetView.html";

window.SearchTagView = Backbone.View.extend({
    
    backLabel: '返回',
    title: '搜索标签设置',
    
    initialize: function(options) {
        var tag = new SearchTag({id: 0, disableInclude: true});
        tag.subTags.fetch();
        this.model = tag.subTags;
        this.render();
        this.view = this.$el;
    },
    
    render: function(eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        this.setElement(this.$("#searchTagSetView"));
        //var template = _.template(templates.searchTagSetView);
        //this.$el.html(template(this.model.toJSON()));
        //this.setElement(this.$("#searchTagSetView"));
        
        this.listView = new SearchTagListView({el: $('#searchTagSetView', this.el), model: this.model, disableInclude: true, callback: editTag});
        this.listView.render();
        
        return this;
    },
        
    editTag: function(tagId, tagName) {
        
    }
});