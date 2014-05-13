var util = require('util');


var TEMPLATE = 'angular.module(\'%s\', []).value(\'%s\', %s);\n';

var REQUIRE_MODULE_TPL = 'require([\'angular\'], function(angular) {' +
    TEMPLATE +
    '});\n';

var SINGLE_MODULE_TPL = '(function(module) {\n' +
    'try {\n' +
    '  module = angular.module(\'%s\');\n' +
    '} catch (e) {\n' +
    '  module = angular.module(\'%s\', []);\n' +
    '}\n' +
    'module.run(function($templateCache) {\n' +
    '  $templateCache.put(\'%s\',\n    \'%s\');\n' +
    '});\n' +
    '})();\n';

var createJson2JsPreprocessor = function(logger, basePath, config) {
        config = config || {};
    var enableRequireJs = config.enableRequireJs;

        var log = logger.create('preprocessor.json2js'),
            stripPrefix = new RegExp('^' + (config.stripPrefix || '')),
            prependPrefix = config.prependPrefix || '',
            valueIdFromPath = config.cacheIdFromPath ||
                function (filepath) {
                    return prependPrefix + filepath.replace(stripPrefix, '');
                };

        return function (content, file, done) {
            log.info('Processing "%s".', file.originalPath);

            var jsonPath = valueIdFromPath(file.originalPath.replace(basePath + '/', '')),
                valueName = jsonPath
                    .replace(/\.json$/, '')
                    .replace(/(?:-|\/)([a-zA-Z0-9])/g, function (all, letter) {
                        return letter.toUpperCase();
                    });
            file.path = file.path + '.js';

            if (enableRequireJs) {
                log.info(util.format(REQUIRE_MODULE_TPL, jsonPath, valueName, content));
                done(util.format(REQUIRE_MODULE_TPL, jsonPath, valueName, content));
            } else{
                log.info(util.format(TEMPLATE, jsonPath, valueName, content));
                done(util.format(TEMPLATE, jsonPath, valueName, content));
//                if(moduleName) {
//                    done(util.format(SINGLE_MODULE_TPL, moduleName, moduleName, htmlPath, escapeContent(content)));
//                } else {
//                    done(util.format(TEMPLATE, htmlPath, htmlPath, escapeContent(content)));
//                }
            }


        };
};

createJson2JsPreprocessor.$inject = ['logger', 'config.basePath', 'config.ngJson2JsPreprocessor'];

module.exports = createJson2JsPreprocessor;