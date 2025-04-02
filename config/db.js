const { Sequelize, DataTypes } = require('sequelize');
const { db, mysql_host } = require('./config');

let mysqlUrl = `mysql://root@${mysql_host}/${db}`;
const sequelize = new Sequelize(mysqlUrl);

sequelize.authenticate()
    .then(() => {
        console.log('Database connected');
    })
    .catch(err => {
        console.error('Error connecting to the database:', err.message);
        throw err;
    });

module.exports = sequelize;