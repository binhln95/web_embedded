try {
    require('./db-scripts/create_database');
    console.log("--------------------- CREATE LOG TABLE -----------------------");
    require('./db-scripts/create_log_table');
    console.log("--------------------- END CREATE LOG TABLE -----------------------");
    require('./db-scripts/create_sensor_table');
    require('./db-scripts/create_setting_table');
    require('./db-scripts/create_tree_humidity');
    require('./db-scripts/create_tree_table');
}
catch (e) {
    console.log('oh big error');
}