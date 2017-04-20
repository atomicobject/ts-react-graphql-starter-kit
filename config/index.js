const env = process.env.NODE_ENV || 'development';
const {merge,get} = require('lodash');
const defaults = require('./default.js')
const devConfig = require(`./development.js`)
const productionConfig = require(`./production.js`)
const testConfig = require(`./test.js`)

let envConfig;

switch (env) {
case 'production':
    envConfig = productionConfig;
    break;
case 'development':
    envConfig = devConfig;
    break;
case 'test':
    envConfig = testConfig;
    break;
default:
    throw new Error(`Unknown environment ${env}`)
}


const config = merge(defaults, envConfig);

module.exports = {
    get: (path) => get(config, path),
    config: config,
}