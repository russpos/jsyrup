jasmine = require('../node_modules/jasmine-node/lib/jasmine-node/index');
jasmine.executeSpecsInFolder(__dirname+'/unit', undefined, false, true);

console.log(' * All tests passed');
