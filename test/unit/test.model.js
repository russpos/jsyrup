if (require || !jsyrup)
    var jsyrup = require('../../jsyrup');

describe('when using ModelFactory', function() {
    var EventKlass, instance;

    beforeEach(function() {
        EventKlass = jsyrup.ModelFactory({
            schema: {
                id:      { type: 'Integer', mutable: false },
                count:   { type: 'Integer', default: 10 },
                is_cool: { type: 'Boolean', default: true },
                name:    { type: 'Text', default: 'Dave'}
            },

            methods: {
                upperName: function() {
                    this.set('name', this.get('name').toUpperCase());
                }
            }
        });
        instance = new EventKlass();
    });

    describe('When Creating a model class', function() {
        it('should be return a model class', function() {
            expect(EventKlass).toBeTruthy();
            expect(EventKlass instanceof Function).toBeTruthy();
        });
    });

    describe('When creating an instance of a model class', function() {
        it('should return undefined for made up vars', function() {
            expect(instance.get('foo')).toBe(undefined);
        });

        it('should return null for vars with no default', function() {
            expect(instance.get('id')).toBe(null);
        });

        it('should respect boolean defaults', function() {
            expect(instance.get('is_cool')).toEqual(true);
        });

        it('should respect text defaults', function() {
            expect(instance.get('name')).toEqual('Dave');
        });

        it('should respect integer defaults', function() {
            expect(instance.get('count')).toEqual(10);
        });

    });

    describe('When modifying an instance', function() {
        it('should not allow setting un mutable fields', function() {
            expect(function() { instance.set('id', 3);  }).toThrow();
        });

        it('should not allow setting a made up var', function() {
            expect(function() { instance.set('foo', 'bar'); }).toThrow();
        });

        it('should co-erce string to integer', function() {
            instance.set('count', '123');
            expect(instance.get('count')).toBeExactly(123);
        });

        it('should co-erce integer to boolean', function() {
            instance.set('is_cool', 0);
            expect(instance.get('is_cool')).toBeExactly(false);
        });

        it('should co-erce integer to string', function() {
            instance.set('name', 200);
            expect(instance.get('name'), '200');
        });
    });

    describe('When dumping and loading data', function() {

        var dump, inst2;
        beforeEach(function() {
            instance.set('name',    'John');
            instance.set('count',   62);
            instance.set('is_cool', true);

            dump  = instance.dump();
            inst2 = new EventKlass();
        });

        it('should have correct data in dump', function() {
            expect(dump.name).toBeExactly('John');
            expect(dump.count).toBeExactly(62);
            expect(dump.is_cool).toBeExactly(true);
            expect(dump.id).toBeExactly(null);
        });

        it('should load correct data from dump', function() {
            dump.id = 2;
            inst2.load(dump);
            expect(inst2.get('name')).toBeExactly('John');
            expect(inst2.get('count')).toBeExactly(62);
            expect(inst2.get('is_cool')).toBeExactly(true);
            expect(inst2.get('id')).toBeExactly(2);
        });
    });

    describe('When adding methods to a class', function() {
        it('should run methods on instance', function() {
            instance.set('name', 'jimmy');
            instance.upperName();
            expect(instance.get('name')).toEqual('JIMMY');
        });
    });

});
