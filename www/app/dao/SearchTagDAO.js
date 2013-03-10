window.SearchTagDAO = function(db) {
    this.db = db;
};

_.extend(SearchTagDAO.prototype, {
    
    _getResults: function(tx, results, callback) {
        
        var len = results.rows.length,
                tags = [],
                i = 0;
        
        for (; i < len; i = i + 1) {
            tags[i] = results.rows.item(i);
        }
 
        callback(tags);
    },
        
    findById: function(id, callback) {
    
        var self = this;
        this.db.transaction(
            function(tx) {
                var sql = "SELECT id, name, userImg, img, priority, enable, prefectNormal, prefectNear " +
                        "FROM searchTag " +
                        "WHERE id = ? ";
                
                tx.executeSql(sql, [id], function(tx, results) { self._getResults(tx, results, callback); });
            },
            function(tx) { NativeUtil.showAlert(tx.message, "查询标签时出错"); }
        );
    },

    findAllByParent: function(callback, parentId) {
        
        var self = this;
        this.db.transaction(
            function(tx) {
                var sql = "SELECT t.id, t.name, t.userImg, t.img, count(s.id) subCount " +
                        "FROM searchTag t LEFT JOIN searchTag s ON s.parentId = t.id " +
                        "WHERE t.parentId = ? " +
                        "GROUP BY t.id ORDER BY t.priority";
                
                tx.executeSql(sql, [parentId ? parentId : 0], function(tx, results) { self._getResults(tx, results, callback); });
            },
            function(tx) { NativeUtil.showAlert(tx.message, "查询下级标签时出错"); }
        );
    },
    
    findByParent: function(callback, parentId) {
        
        var self = this;
        this.db.transaction(
            function(tx) {
                var sql = "SELECT t.id, t.name, t.userImg, t.img, count(s.id) subCount " +
                        "FROM searchTag t LEFT JOIN searchTag s ON s.parentId = t.id AND s.enable = 1 " +
                        "WHERE t.enable = 1 AND t.parentId = ? " +
                        "GROUP BY t.id ORDER BY priority";
                
                tx.executeSql(sql, [parentId ? parentId : 0], function(tx, results) { self._getResults(tx, results, callback); });
            },
            function(tx) { NativeUtil.showAlert(tx.message, "查询下级标签时出错"); }
        );
    },
    
    findByName: function(callback, key) {
        
        if(key) {
            var self = this;
            this.db.transaction(
                function(tx) {
                    var sql = "SELECT id, name, userImg, img " +
                            "FROM searchTag " +
                            "WHERE name LIKE ? " +
                            "ORDER BY priority";

                    tx.executeSql(sql, [key + '%'], function(tx, results) { self._getResults(tx, results, callback); });
                },
                function(tx) { NativeUtil.showAlert(tx.message, "查询标签时出错"); }
            );
        } else {
            callback();
        }        
    },
    
    getPrefectNormal: function(callback) {
        
        this.db.transaction(
            function(tx) {
                var sql = "SELECT id, name, userImg, img " +
                        "FROM searchTag " +
                        "WHERE prefectNormal = 1 " +
                        "ORDER BY priority";
                
                tx.executeSql(sql, [], function(tx, results) { self._getResults(tx, results, callback); });
            },
            function(tx) { NativeUtil.showAlert(tx.message, "查询普通搜索推荐标签时出错"); }
        );
    },
    
    getPrefectNear: function(callback) {
        
        this.db.transaction(
            function(tx) {
                var sql = "SELECT id, name, userImg, img " +
                        "FROM searchTag " +
                        "WHERE prefectNear = 1 " +
                        "ORDER BY priority";
                
                tx.executeSql(sql, [], function(tx, results) { self._getResults(tx, results, callback); });
            },
            function(tx) { NativeUtil.showAlert(tx.message, "查询附近搜索标签时出错"); }
        );
    },

    // Check if searchTag table exists
    isInitialized: function(callback) {
        
        this.db.transaction(
            function(tx) {
                var sql = "SELECT name FROM sqlite_master WHERE type='table' AND name=:tableName";
                tx.executeSql(sql, ['searchTag'], function(tx, results) {
                    if (results.rows.length === 1) {
                        console.log('Database is initialized');
                        callback(true);
                    } else {
                        console.log('Database is not initialized');
                        callback(false);
                    }
                });
            },
            NativeUtil.showAlert(tx.message, "查询主表时出错")
        );
    },
    
    initialize: function(callback) {
        var self = this;
        this.isInitialized(function(result) {
            if (result) {
                callback();
            } else {
                self.createTable(function() {
                    //self.populate(callback);
                });
            }
        });
    },

    createTable: function(callback) {
        this.db.transaction(
             function(tx) {
                var sql = "CREATE TABLE IF NOT EXISTS searchTag ( " +
                        "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                        "name VARCHAR(10), " +
                        "userImg VARCHAR(50), "  + //用户定义图片
                        "img VARCHAR(50), "  +                        
                        "priority INTEGER, " +  //优先级
                        "enable INTEGER, " + //是否启用
                        "parentId INTEGER, " + //上级类别Id
                        "prefectNormal INTEGER, " + //是否普通搜索推荐
                        "prefectNear INTEGER, " + //是否附近搜索推荐
                        "userModified VARCHAR(50), " + //用户修改时间
                        "lastModified VARCHAR(50))";
                tx.executeSql(sql);
            },
            NativeUtil.showAlert(tx.message, "生成数据表出错"),
            function(tx) {
                callback();
            }
        );
    },

    // Populate searchTag table with init data for ou-of-the-box experience
    populate: function(callback) {
        this.db.transaction(
            function(tx) {
                console.log('Inserting searchTag');
                tx.executeSql("INSERT INTO searchTag (id, name, img, priority, enable, parentId, prefectNormal, prefectNear, lastModified) VALUES (12,'Steven','Wells',4,'Software Architect','Engineering','617-000-0012','781-000-0012','swells@fakemail.com','Boston, MA','pics/Steven_Wells.jpg','@fakeswells',NULL,'2010-06-0319:01:19',0)");
                
            },
            this.txErrorHandler,
            function(tx) {
                callback();
            }
        );
    },

    getLastSync: function(callback) {
        this.db.transaction(
            function(tx) {
                var sql = "SELECT MAX(lastModified) as lastSync FROM searchTag";
                tx.executeSql(sql, NativeUtil.showAlert(tx.message, "查询标签最后更新时间出错"),
                    function(tx, results) {
                        var lastSync = results.rows.item(0).lastSync;
                        console.log('Last local timestamp is ' + lastSync);
                        callback(lastSync);
                    }
                );
            }
        );
    },

    sync: function(cbSuccess, cbError) {

        var self = this;
        console.log('Starting synchronization...');
        this.getLastSync(function(lastSync){
            var syncURL = window.localStorage.getItem("syncURL");
            self.getChanges(syncURL, lastSync,
                function (changes) {
                    if (changes.length > 0) {
                        self.applyChanges(changes, cbSuccess, cbError);
                    } else {
                        console.log('Nothing to synchronize');
                        cbSuccess(0);
                    }
                },
                cbError
            );
        });
    },

    getChanges: function(syncURL, modifiedSince, cbSuccess, cbError) {
        console.log("Getting server changes since  " + modifiedSince + " at " + syncURL);
        $.ajax({
            url: syncURL,
            data: {modifiedSince: modifiedSince},
            dataType:"json",
            success:function (data) {
                console.log("The server returned " + data.length + " changes that occurred after " + modifiedSince);
                cbSuccess(data);
            },
            error: function(model, response) {
                cbError("Can't get changes from the server. Make sure you the synchronization endpoint is available.");
            }
        });
    },

    applyChanges: function(tags, cbSuccess, cbError) {
        
        this.db.transaction(
            function(tx) {
                var l = tags.length;
                var sql =
                    "INSERT OR REPLACE INTO searchTag " +
                    "(id, name, img, priority, enable, parentId, prefectNormal, prefectNear, lastModified) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                console.log('Inserting or Updating in local database:');
                var tag;
                for (var i = 0; i < l; i++) {
                    $('#count').html(i);
                    tag = tags[i];
                    console.log(tag.id + ' ' + tag.name + ' ' + tag.img + ' ' + tag.priority + ' ' + tag.enable + ' ' + tag.parentId + ' ' + tag.lastModified);
                    var params = [tag.id, tag.name, tag.img, tag.priority, tag.enable, tag.parentId, tag.prefectNormal, tag.prefectNear, tag.lastModified];
                    tx.executeSql(sql, params);
                }
                console.log('Synchronization complete (' + l + ' items synchronized)');
                cbSuccess(l);
            },
            function(tx) {
                cbError(tx.message);
            }
        );
    },

    dropTable: function(callback) {
        this.db.transaction(
            function(tx) {
                console.log('Dropping searchTag table');
                tx.executeSql('DROP TABLE IF EXISTS searchTag');
            },
            function(tx) { NativeUtil.showAlert(tx.message, "删除标签表时出错"); },
            function() {
                console.log('Table searchTag successfully DROPPED in local SQLite database');
                callback();
            }
        );
    },

    reset: function(callback) {
        var self = this;
        this.dropTable(function() {
           self.createTable(function(){
               callback();
           });
        });
    }
});