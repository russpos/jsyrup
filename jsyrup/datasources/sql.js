if (typeof jsyrup == 'undefined') jsyrup = {};
jsyrup.SQLDataSource = function() {

    this.create = function create() {
    };

};
jsyrup.SQLDataSource.prototype._execute = function() {};

if (typeof exports != 'undefined') exports.SQLDataSource = jsyrup.SQLDataSource;
