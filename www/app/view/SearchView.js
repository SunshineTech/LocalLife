templates.SearchView = "app/view/SearchView.html";

window.SearchView = Backbone.View.extend({
    
    scroll: false,
    
    initialize: function(options) {        
        this.render();
        this.view = this.$el;
        //this.initSearchView();
    },
    
    render: function () {
        $(this.el).html(this.template());
        this.setElement(this.$("#searchView"));
        
        var style = " ";
        if ( window.viewNavigator && window.viewNavigator.history.length >= 1 ) {
            this.backLabel = '返回';
            style = "margin-left: 65px;";
        }

        var self = this;
        var searchKeyComp = this.searchKeyComp = $('<input data-type="search" class="ui-input-text ui-body-null" placeholder="地点、顺风车、出租车、餐饮、住宿、购物" autofocus autocomplete="off"/>');
        searchKeyComp.on({
            'focus click': function() {
                window.unBackable = true;
            },
            'blur': function() {
                window.unBackable = false;
            },
            'input': function() {
                self.onSearch(this.value);
            }
        });
    
        var clearText = this.clearText = $('<a href="#" class="ui-input-clear ui-btn ui-btn-icon-notext ui-btn-corner-all ui-shadow ui-btn-up-c ui-input-clear-hidden" title="清除文字" data-theme="c"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">清除文字</span><span class="ui-icon ui-icon-delete ui-icon-shadow"></span></span></a>');
        clearText.on('click', function() {
            searchKeyComp.attr("value","");
            self.onSearch(searchKeyComp.value);
        });
        
        this.titleActions = $('<div id="textSearch" class="ui-input-search ui-shadow-inset ui-btn-corner-all ui-btn-shadow ui-icon-search ui-body-c" style="' + style + '"></div>');
        this.titleActions.append(searchKeyComp);
        this.titleActions.append(clearText);
        
        this.headerActions = $('<a href="#" class="header-button header-button-icon header-button-right search" style="display: none"><button><img src="assets/img/search-icon.png" width="14" height="14"></button></a>');
        
        return this;
    },
        
    initSearchView: function() {
        
        var self = this;
        setTimeout(function() {
            var gallery, el, i, page,
            dots = document.querySelectorAll('#nav li'),
            slides = ['#searchResult', '#prefCateg', '#allCateg'];

            gallery = new SwipeView('#wrapper', {
                numberOfPages: slides.length,
                hastyPageFlip: true
            });

            // Load initial data
            for (i = 0; i < 3; i++) {
                page = i === 0 ? slides.length - 1 : i - 1;

                el = $(slides[page]);
                gallery.masterPages[i].appendChild(el);
            }

            gallery.onFlip(function() {
                var el, upcoming, i;

                for (i = 0; i < 3; i++) {
                    upcoming = gallery.masterPages[i].dataset.upcomingPageIndex;

                    if (upcoming !== gallery.masterPages[i].dataset.pageIndex) {
                        el = gallery.masterPages[i].querySelector('span');
                        el.innerHTML = slides[upcoming];
                    }
                }
            });
        }, 150);
    },

    onSearch: function(searchKey) {
        var key = $.trim(searchKey);
        
        if(key) {
            //this.searchKeyComp.attr("value", key);
            if(!this.displayHeaderActions) {
                this.displayHeaderActions = true;
                this.displaySearch(true);
            }
        } else {
            if(this.displayHeaderActions) {
                this.displayHeaderActions = false;
                this.displaySearch(false);
            }
        }
    },
        
    displaySearch: function(display) {
        if(display) {
            this.titleActions.css('margin-right', '42px');
            this.headerActions.css('display', '');
            this.clearText.removeClass('ui-input-clear-hidden');
        } else {
            this.titleActions.css('margin-right', '5px');
            this.headerActions.css('display', 'none');
            this.clearText.addClass('ui-input-clear-hidden');
        }
    }
});