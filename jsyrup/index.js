if (!(typeof module == 'undefined')) {
    module.exports = {
        ModelFactory: require(__dirname+'/model').ModelFactory,
        SQLDataSource: require(__dirname+'/datasources/sql').SQLDataSource
    };
} else {
    jsyrup = {};
}
