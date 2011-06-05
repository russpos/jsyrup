if (typeof require != 'undefined' || !jsyrup)
    var jsyrup = require('../../../jsyrup');

describe('when creating', function() {
    var ds, modelClass, callback;

    beforeEach(function() {
        ds = new jsyrup.SQLDataSource();
        callback = jasmine.createSpy();

        modelClass = jsyrup.ModelFactory({
            key: 'id',
            datasources: {
                sql: 'items'
            },

            schema: {
                id: { type: 'Integer' },
                name: { type: 'Text' }
            }
        });
    });

    it('should exists', function() {
        expect(ds).toBeDefined();
    });

    it('should have a craete method', function() {
        expect(ds.create).toBeFunction();
    });

    describe('when creating', function() {

        var instance;

        beforeEach(function() {
            instance = new modelClass();
            instance.set('name', 'Fred');
        });

        it('should create', function() {
            spyOn(ds, '_execute');
            ds.create(instance, callback);
            expect(ds._execute).toHaveBeenCalledWith(
                "INSERT INTO items (items.name) VALUES ($1)",
                ['Fred'], callback);
        });
    });

    describe('when updating', function() {
        var instance;

        beforeEach(function() {
            instance = new modelClass();
            instance.load({ id: 3, name: 'Frank' });
        });

        it('should update', function() {
            spyOn(ds, '_execute');
            ds.update(instance, callback);
            expect(ds._execute).toHaveBeenCalledWith(
                "UPDATE items SET items.name = $1 WHERE items.id = $2",
                ['Frank', 3], callback);
        });
    });
});

