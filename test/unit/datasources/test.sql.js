if (typeof require != 'undefined' || !jsyrup)
    var jsyrup = require('../../../jsyrup');

describe('when creating', function() {
    var ds, modelClass;

    beforeEach(function() {
        ds = new jsyrup.SQLDataSource();

        modelClass = jsyrup.ModelFactory({
            key: 'id',

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
        });
        
        
    });
    

});

