if (typeof jsyrup == 'undefined') jsyrup = {};

/**
 * Creates a new DataSource class
 */
jsyrup.DataSource = (function() {
    var DataSource = function(definition) {
        var source = function() {};
        return  source;
    };

    return DataSource;
})();

if (exports) exports.DataSource = jsyrup.DataSource;
