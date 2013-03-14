templates.SearchTagItemView = "app/views/searchtag/ItemView.html";

window.SearchTagItemView = Backbone.View.extend({
    
    tagName: "li",
    
    initialize: function () {
        this.model.bind("change", this.render, this);
    },
    
    render: function(eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        
        var self = this;
        $('<img height="36" width="36" class="list-icon"/>')
                .attr('src', this.model.get('userImg') ? this.model.get('userImg') : this.model.get('img'))
                .load(
                    function() {
                        $('.imgHolder', self.el).html(this);
                    }
                ).on('error', function(event) {
                    $('.imgHolder', self.el).remove();
                });
        
        return this;
    }
});