window.SearchTagListView = Backbone.View.extend({
    
    initialize: function(options) {
        this.disableInclude = options.disableInclude;
        this.callback = options.callback;
        this.model.on("reset", this.render, this);
    },
    
    events:{
        "click ul": "listItemClick"
    },
    
    render: function (eventName) {
        var ul = $('ul', this.el);
        ul.empty();
        _.each(this.model.models, function(searchTag) {
            ul.append(new SearchTagItemView({model: searchTag}).render().el);
        }, this);
        
        return this;
    },
        
    listItemClick: function( event ) {
        
        var target = $( event.target );
        if (target.get(0).nodeName.toUpperCase() !== "A") {
            target = target.parent();
        }
    
        var href = target.get(0).href;
        var tagId = href.substr(href.indexOf('#') + 6);
        
        var className = target.get(0).className;        
        if(className.indexOf('list-disclosure') === 0) {

            if(this.target && this.target !== target) {
                this.sublist.css('display', 'none');
                this.target.removeClass('sublist-open');
            }
        
            var targetLi = target.parent();
            if (targetLi.get(0).nodeName.toUpperCase() !== "LI") {
                targetLi = target.parent();
            }
        
            var sublistEL = $('#tagList-' + tagId, this.el);
            if(sublistEL.length <= 0) {
                var sublist = $('<li class="subList" id="#tagList-' + tagId + '"><ul class="tableview tableview-links"></ul></li>');
                targetLi.after(sublist);
                var searchTag = new SearchTag({id: tagId});
                searchTag.subTags.fetch();
                var listView = new SearchTagListView({el: sublistEL, model: searchTag.subTags});
                listView.render();               
            }
            
            if(className === 'list-disclosure') {
                target.addClass('sublist-open');
                sublistEL.css('display', '');
                this.target = target;
                this.sublist = sublistEL;
            } else {
                sublistEL.css('display', 'none');
                target.removeClass('sublist-open');
            }
        } else {
            this.callback(tagId, this.model.get(tagId).name);
        }
    
        return false;
    }
});