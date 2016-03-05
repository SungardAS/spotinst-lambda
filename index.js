var projectHandler = require('lambda-formation').project.handler;

module.exports.handler = function () {
    projectHandler.apply(this, arguments);
};
