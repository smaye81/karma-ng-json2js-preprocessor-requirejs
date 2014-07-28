var util = require('util');


var MODULE_TPL = 'angular.module(\'%s\', []).value(\'%s\', %s);\n';

var SINGLE_MODULE_TPL = '(function(module) {\n' +
    'try {\n' +
    '  module = angular.module(\'%s\');\n' +
    '} catch (e) {\n' +
    '  module = angular.module(\'%s\', []);\n' +
    '}\n' +
    'module.value(\'%s\', %s);\n' +
    '})();\n';

var REQUIRE_MODULE_TPL = 'require([\'angular\'], function(angular) {' +
    MODULE_TPL +
    '});\n';

var REQUIRE_SINGLE_MODULE_TPL = 'require([\'angular\'], function(angular) {' +
        SINGLE_MODULE_TPL +
        '});\n';



var createJson2JsPreprocessor = function (logger, basePath, config) {
    config = config || {};

    // If enableRequireJs was specified, use the value.  Otherwise, default to true
    var enableRequireJs = config.enableRequireJs !== undefined ? config.enableRequireJs : true;

    var log = logger.create('preprocessor.json2js'),
        stripPrefix = new RegExp('^' + (config.stripPrefix || '')),
        prependPrefix = config.prependPrefix || '',
        valueIdFromPath = config.cacheIdFromPath ||
            function (filepath) {
                return prependPrefix + filepath.replace(stripPrefix, '');
            };

    return function (content, file, done) {
        var moduleName = config.moduleName;
        var jsonPath = valueIdFromPath(file.originalPath.replace(basePath + '/', '')),
            valueName = jsonPath
                .replace(/\.json$/, '')
                .replace(/(?:-|\/)([a-zA-Z0-9])/g, function (all, letter) {
                    return letter.toUpperCase();
                });

        file.path = file.path + '.js';

        // If RequireJS has been enabled, then wrap the template in a define
        if (enableRequireJs) {

            if (moduleName) {
                // If a module name was specified, then use the Single Module template.  This ensures all the JSON
                //  files will be added as values to a single module defined in karma conf
                done(util.format(REQUIRE_SINGLE_MODULE_TPL, moduleName, moduleName, valueName, content));
            } else {
                // If no module name was specified in karma conf, then create a separate module for each file processed
                done(util.format(REQUIRE_MODULE_TPL, jsonPath, valueName, content));
            }
        } else {
            if (moduleName) {
                // If a module name was specified, then use the Single Module template.  This ensures all the JSON
                //  files will be added as values to a single module defined in karma conf
                done(util.format(SINGLE_MODULE_TPL, moduleName, moduleName, jsonPath, valueName, content));
            } else {
                // If no module name was specified in karma conf, then create a separate module for each file processed
                done(util.format(MODULE_TPL, jsonPath, valueName, content));
            }
        }


    };
};

createJson2JsPreprocessor.$inject = ['logger', 'config.basePath', 'config.ngJson2JsPreprocessor'];

module.exports = createJson2JsPreprocessor;