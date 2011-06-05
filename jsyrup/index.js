if (!(typeof module == 'undefined')) {
    module.exports = {
        ModelFactory: require(__dirname+'/model').ModelFactory,
        DataSource: require(__dirname+'/datasource').DataSource
    };
} else {
    jsyrup = {};
}
