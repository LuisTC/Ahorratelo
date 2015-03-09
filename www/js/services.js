angular.module('starter.services', [])

.factory('Timestamp', function() {
  var self = this;

  self.convert = function(date) {
    return date.getTime() / 1000;
  };

  self.parse = function(timestamp) {
    return new Date(timestamp * 1000);
  };

  return self;
})

.factory('$localStorage', function($window) {
  var self = this;

  this.set = function(key, value) {
    $window.localStorage[key] = value;
  };

  this.get = function(key, default_value) {
    return $window.localStorage[key] || default_value;
  };

  this.set_object = function(key, value) {
    $window.localStorage[key] = JSON.stringify(value);
  };

  this.get_object = function(key) {
    return JSON.parse($window.localStorage[key] || '{}');
  };

  return self;
})

.factory('DB', function($q, $window, $cordovaSQLite, $localStorage, DB_CONFIG, DB_DATA) {
  var self = this;
  self.db;

  self.init = function() {
    var q = $q.defer();

    try {
      self.db = $cordovaSQLite.openDB({ name: DB_CONFIG.name });
    } catch(err) {
      self.db = $window.openDatabase(DB_CONFIG.name, '1.0', 'database', 1);
    }

    q.resolve(self.db);

    if(!$localStorage.get('loaded', false)) {
      self.create(DB_CONFIG.tables);
      self.populate(DB_DATA.tables);
      
      $localStorage.set('loaded', true);
    }

    return q.promise;
  };

  self.query = function(query, bindings) {
    bindings = typeof bindings !== 'undefined' ? bindings : [];
    var deferred = $q.defer();

    self.db.transaction(function(transaction) {
      transaction.executeSql(query, bindings, function(transaction, result) {
        deferred.resolve(result);
      }, function(transaction, error) {
        deferred.reject(error);
      });
    });
 
    return deferred.promise;
  };

  self.create = function(tables) {
    angular.forEach(tables, function(table) {
      var fields = table.fields.map( function(field) { return field.name + ' ' + field.type; } );
      var keys = [];

      var primary = 'PRIMARY KEY(' + table.keys.primary.join() + ')';
      keys.push(primary);

      angular.forEach(table.keys.foreign, function(key) {
        var foreign = 'FOREIGN KEY' + '(' + key.fields[0].join() + ')' +' REFERENCES ' + key.table + '(' + key.fields[1].join() + ')';
        keys.push(foreign);
      });

      var query = 'CREATE TABLE IF NOT EXISTS ' + table.name + '(' + fields.join() + ',' + keys.join() + ')';

      self.query(query).then(function(result) {
        console.log('Table created: ' + table.name);
      }, function(err) {
        console.log(err);
      });
    });
  };

  self.populate = function(tables) {
    angular.forEach(tables, function(table) {
      var fields = table.fields;
      var parameters = self.parameters(fields.length);
      var query = 'INSERT INTO ' + table.name + '(' + fields.join() + ')' + ' VALUES(' + parameters.join() + ')';

      angular.forEach(table.values, function(value) {
        self.query(query, value).then(function(result) {
          console.log("insertId: " + result.insertId);
        }, function(err) {
          console.log(err);
        });
      });
    });
  };

  self.parameters = function(length) {
    var list = new Array(length);

    for(var i = 0; i < length; i++) {
      list[i] = '?';
    }

    return list;
  };

  self.fetch_all = function(result) {
    var output = [];

    for (var i = 0; i < result.rows.length; i++) {
      output.push(result.rows.item(i));
    }

    return output;
  };

  self.fetch = function(result) {
    return result.rows.item(0);
  };

  return self;
})

.factory('Category', function(DB) {
    var self = this;
    
    self.all = function() {
        return DB.query('SELECT category_id, name, url FROM category')
        .then(function(result) {
            return DB.fetch_all(result);
        });
    };
    
    self.get = function(id) {
        return DB.query('SELECT category_id, name, url FROM category WHERE category_id = ?', [id])
        .then(function(result) {
            return DB.fetch(result);
        });
    };
    
    return self;
})

.factory('Expense', function(DB, Timestamp) {
  var self = this;

  self.all = function() {
    return DB.query('SELECT expense_id, infodate, category_id, amount FROM expense')
    .then(function(result) {
        return DB.fetch_all(result);
    });
  };

  self.get = function(id) {
    return DB.query('SELECT expense_id, infodate, category_id, amount FROM expense WHERE expense_id = ?', [id])
    .then(function(result) {
        return DB.fetch(result);
    });
  };

  self.filter = function(range) {
    return DB.query('SELECT e.expense_id, e.infodate, e.category_id, e.amount, c.name, c.url FROM expense e JOIN category c ON (e.category_id = c.category_id) WHERE infodate BETWEEN ? AND ?', range)
    .then(function(result) {
      return DB.fetch_all(result);
    });
  };

  self.insert = function(data) {
    var values = [Timestamp.convert(data.infodate), data.category_id, data.amount];

    var query = 'INSERT INTO expense(infodate, category_id, amount) values(?, ?, ?)';
    return DB.query(query, values);
  };

  return self;
})