if (typeof jsyrup == 'undefined') jsyrup = {};
jsyrup.ModelFactory = (function() {

    var Model = function Model(datasource) {
        this.datasource = datasource;
    },

        /**
         * Validate property. Casts the given value based on the type 
         * of the column defined in schema.
         *
         * @param {Object} schema Column definition
         * @param {mixed} value The value being casted
         * @return {mixed} The casted, validated value
         */
        _validateProperty = function _validateProperty(schema, value) {
            if (value === null || value === undefined) return null;
            if (schema.type == 'Integer') return parseInt(value);
            if (schema.type == 'Boolean') return !!value;
            if (schema.type == 'Text')    return ''+value;
        };

    Model.prototype.init = function init() {
        var _data = {}, _this = this;

        /**
         * Initializes the private _data structure with the proper
         * defaults
         *
         * @return {void}
         */
        var _initializeData = function _initializeData() {
            var col;
            for (col in _this.definition.schema) {
                _data[col] = null;
                if (_this.definition.schema[col]['default']) {
                    _data[col] = _this.definition.schema[col]['default'];
                }
            }
        };

        /**
         * Gets a dump of the inertnal data strucutre.  Should be JSON
         * serializable.
         */
        this.dump = function dump() {
            var dump = {};
            for (col in _data) {
                dump[col] = _data[col];
            }
            return dump;
        };

        /**
         * Loads a dump of this object's data structure.
         *
         * @param {Object} obj The dump object.
         */
        this.load = function load(obj) {
            for (col in obj) {
                if (this.definition.schema[col].mutable)
                    this.set(col, obj[col]);
                else
                    _data[col] = obj[col];
            }
        };

        /**
         * Sets the internal data structure's property name to
         * the given value
         *
         * @param {String} name The name of the property to set
         * @param {mixed}  value The value we're setting it to
         * @throws Throws an error if any issues  occur
         * @return {mixed} The value that was set, after any type
         *  casting.
         */
        this.set = function set(name, value) {
            if (!_this.definition.schema[name])
                throw "No schema property "+name;

            var schema = _this.definition.schema[name];

            if (!(typeof schema.mutable == 'undefined') && 
                !schema.mutable)
                throw "Property '"+name+"' is not mutable"

            value = _validateProperty(schema, value);
            _data[name] = value;
            return value;
        };

        /**
         * Gets the property named by name
         *
         * @param {String} name The name of property you are getting
         * @return {mixed} The value of name.  If there is no property
         *  named, it will return undefined.
         */
        this.get = function get(name) {
            if (_this.definition.schema[name])
                return _data[name];
            return undefined;
        };

        this.setUp = function setUp() {
            _initializeData();
        };
    };

    /**
     * Creates this new instance in the datasource.
     *
     * @param {Function} callback Function to be called
     *  when the create method returns
     * @return {void}
     */
    Model.prototype.create = function(callback) {
        if (!this.definition.key)
            throw "Model does not have a primary key set!";

        if (!this.datasource || !this.datasource.create)
            throw "No datasource bound to model";

        this.datasource.create(this, callback);
    };

    /**
     * Extends the schema object provided in a definition to have
     * with the defaults.
     *
     * @param {Object} definition Model class definition
     * @return {Object} Definition object, with the schema extended.
     */
    var _extendSchema = function _extendSchema(definition) {
        var schema = {};
        if (typeof definition.schema == 'undefined') {
            throw "No schema provided";
        }

        for (column in definition.schema) {
            schema[column] = {
                'type': 'Integer',
                'mutable': true,
                'nullable': false,
                'default': null
            };
            for (prop in definition.schema[column]) {
                schema[column][prop] = definition.schema[column][prop];
            }
        }
        definition.schema = schema;
        return definition;
    };

    /**
     * Appends methods to the prototype of the given class constructor
     *
     * @param {Function} klass Class constructor function
     * @param {Object} definition The object containing the definition for 
     *      this class.
     * @return {void}
     */
    var _addMethods = function _addMethods(klass, definition) {
        if (!definition.methods) return;
        for (methodName in definition.methods) {
            var method = definition.methods[methodName];
            klass.prototype[methodName] = function() {
                method.apply(this, arguments);
            };
        }
    };

    /**
     * ModelFactory
     *
     * Creates sub-classes of Model based on the definition object
     * passed to it.
     */
    var ModelFactory = function ModelFactory(definition) {
        var klass = function(datasource) {
            this.datasource = datasource;
            this.init();
            this.setUp();
        };

        klass.prototype = new Model();
        definition = _extendSchema(definition);
        klass.prototype.definition = definition;
        _addMethods(klass, definition);
        return klass;
    };

    return ModelFactory;
})();

if (exports) exports.ModelFactory = jsyrup.ModelFactory;
