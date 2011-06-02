var model = require('../../src/model'),
    assert = require('assert'),
    EventKlass = model.ModelFactory({
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
    }),
    instance = new EventKlass();

// When Creating a model class...

(function() {
    assert.ok(EventKlass, 'should exist');
    assert.ok(EventKlass instanceof Function, 'should be a function');
})();

// When creating an instance of a model class...
(function() {
    assert.strictEqual(instance.get('foo'), undefined,
            'should return undefined for made up vars');

    assert.strictEqual(instance.get('id'), null,
            'should return null for vars with no default');

    assert.strictEqual(instance.get('is_cool'), true,
            'should respect boolean defaults');

    assert.strictEqual(instance.get('name'),  'Dave',
            'should respect text defaults');

    assert.strictEqual(instance.get('count'), 10,
            'should respect integer defaults');
})();

// When modifying an instance
(function() {
    assert.throws(function() { instance.set('id', 3);  },
            'should not allow setting un mutable fields');

    assert.throws(function() { instance.set('foo', 'bar'); },
            'should not allow setting a made up var');

    instance.set('count', '123');
    assert.strictEqual(instance.get('count'), 123,
            'should co-erce string to integer');

    instance.set('is_cool', 0);
    assert.strictEqual(instance.get('is_cool'), false,
            'should co-erce integer to boolean');

    instance.set('name', 200);
    assert.strictEqual(instance.get('name'), '200',
            'should co-erce integer to string');
})();


// When dumping and loading data
(function() {
    instance.set('name',    'John');
    instance.set('count',   62);
    instance.set('is_cool', true);

    var dump  = instance.dump(),
        inst2 = new EventKlass();

    assert.strictEqual(dump.name,   'John', 'should have correct name');
    assert.strictEqual(dump.count,   62,    'should have correct count');
    assert.strictEqual(dump.is_cool, true,  'should have correct is_cool');
    assert.strictEqual(dump.id,      null,  'should have null id');

    dump.id = 2;
    inst2.load(dump);

    assert.strictEqual(inst2.get('name'),   'John', 'should have correct name');
    assert.strictEqual(inst2.get('count'),   62,    'should have correct count');
    assert.strictEqual(inst2.get('is_cool'), true,  'should have correct is_cool');
    assert.strictEqual(inst2.get('id'),      2,     'should have correct id');
})();

// When adding methods to a class
(function() {
    instance.set('name', 'jimmy');
    instance.upperName();
    assert.equal(instance.get('name'), 'JIMMY',
        'should run methods on instance');
})();

