if (typeof jsyrup == 'undefined') jsyrup = {};

jsyrup.SQLDataSource = function() {

    /**
     * Builds an INSERT statement based on the given model object to insert
     * a new one.
     *
     * @param {Model} model Model instance being created
     * @param {Function} callback Callback function to be executed
     * @return {void}
     */
    this.create = function create(model, callback) {
        this._modelAction("INSERT", model, callback);
    };

    this.update = function update(model, callback) {
        this._modelAction("UPDATE", model, callback);
    };

};

/**
 * Creates the data object that would get passed to buildQuery, based on the 
 * method and status of the model.
 *
 * @param {String} method The method being executed - INSERT, UPDATE, SELECT, or DELETE
 * @param {Model} model Model instance that the action is being performed on
 * @param {Function} callback Function to be called when the query completes
 */
jsyrup.SQLDataSource.prototype._modelAction = function _modelAction(method, model, callback) {
    var dump = model.dump(),
        table = model.definition.datasources.sql,
        key = dump[model.definition.key],
        data = {
            method: method,
            tables: [table],
            fields: {},
            conditions: {}
        };

    for (field in dump) {
        if (dump[field] === null && !model.definition.schema[field].nullable)
            continue;
        if (field == model.definition.key)
            continue;
        data.fields[table+'.'+field] = dump[field];
    }

    if (key) data.conditions[table+'.'+model.definition.key] = key;
    var queryParts = this._buildQuery(data);
    this._execute(queryParts[0], queryParts[1], callback);
};

/**
 * Executes a database query. This will probably be dialect (engine) dependent
 */
jsyrup.SQLDataSource.prototype._execute = function() {};

/**
 * Given an associative array of data, builds an SQL query
 * Attributes:
 *      method:     INSERT, SELECT, UPDATE, or DELETE
 *      tables:     Array of tables in query
 *      fields:     Array of table-name qualified fields
 */
jsyrup.SQLDataSource.prototype._buildQuery = function _buildQuery(data) {
    var tables = data.tables.join(', '),
        values = [],
        conditions = [],
        columns = [],
        columns;

    for (column in data.fields) {
        columns.push(column);
        values.push(data.fields[column]);
    }

    for (column in data.conditions) {
        conditions.push(column);
        values.push(data.conditions[column]);
    }

    return [this._query[data.method](tables, columns, conditions), values];
};

/**
 * Contains specific logic for assembling a query for each specific
 * query type - INSERT, SELECT, UPDATE, or DELETE.
 */
jsyrup.SQLDataSource.prototype._query = {

    /**
     * Creates an insert query
     */
    INSERT: function(tables, columns, conditions) {
        var length = columns.length, i = 0,
        values = [];

        while (i < length) {
            i++;
            values.push('$'+i);
        }

        return ["INSERT INTO ", tables, " (", columns.join(', '), ") VALUES (",
               values.join(', '), ')'].join('');

    },

    /**
     * Creates an update query
     */
    UPDATE: function(tables, columns, conditions) {
        var length = columns.length, i = 0,
            values = [],
            hasClause = false,
            clause = [];

        for (column in columns) {
            i++;
            values.push(columns[column]+' = $'+i);
        }

        for (column in conditions) {
            hasClause = true;
            i++;
            clause.push(conditions[column]+' = $'+i);
        }

        clause = (hasClause) ? ' WHERE '+clause.join(' AND '): '';

        return ["UPDATE ", tables, " SET ", values.join(', '), clause].join('');
    }
};


if (typeof exports != 'undefined') exports.SQLDataSource = jsyrup.SQLDataSource;
