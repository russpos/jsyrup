if (require || !jsyrup)
    var jsyrup = require('../../jsyrup');

describe('Datasource', function() {
    var MyDataSource;

    beforeEach(function() {
        MyDataSource = jsyrup.DataSource({});
    });

    describe('when creating', function() {
        it('should exist', function() {
            expect(MyDataSource).toBeDefined();
        });
    });

});
