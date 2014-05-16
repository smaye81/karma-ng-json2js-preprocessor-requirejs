[![Build Status](https://travis-ci.org/smaye81/karma-ng-json2js-preprocessor-requirejs.svg?branch=master)](https://travis-ci.org/smaye81/karma-ng-json2js-preprocessor-requirejs)
[![NPM version](https://badge.fury.io/js/karma-ng-json2js-preprocessor-requirejs.svg)](http://badge.fury.io/js/karma-ng-json2js-preprocessor-requirejs)

# karma-ng-json2js-preprocessor-requirejs
=======================================
> A Karma preprocessor for adding JSON files as values to [AngularJS](http://angularjs.org/) modules on the fly (with [RequireJS](http://requirejs.org/) support)

## Installation

Run the following command from your shell

```bash
npm install karma-ng-json2js-preprocessor-requirejs --save-dev
```

This will add a dependency like the following to your 'package.json' file
```javascript
{
  "devDependencies": {
    "karma": "~0.10.9",
    "karma-ng-json2js-preprocessor-requirejs": "~0.1.1"
  }
}
```

## Configuration

Add the following configuration values to your Karma configuration file
```javascript

    preprocessors: {
      '**/*.json' : 'ng-json2js'
    },

    // Assuming your JSON files are in a 'stubs' directory
    files: [
      {pattern: 'stubs/*.json', included: false}
    ],

    ngJson2JsPreprocessor: {

      // Specify a module name if you would like all files to be added as values to a single module
      moduleName : "stubs",

      // Enable / Disable RequireJS support (default is true)
      enableRequireJs : true,

      // strip this from the file path
      stripPrefix: 'test/fixture/',

      // prepend this to the file path
      prependPrefix: 'served/',

      /* or define a custom transform function
      cacheIdFromPath: function(filepath) {
        return cacheId;
      }
      */
    }
  });
};
```

## How does it work ?

This preprocessor converts JSON files into Angular values.  Then, it adds these values as to Angular modules.  The
name of the value is the full path of the file converted to camelcase.

If you specify a moduleName in your Karma config, these values are all added to one module named after the value in
your Karma config file.  If you do not specify a module name, all files are added to their own module named after the
full path of the file.

For example, suppose you have this file: `test/stubs/data.json`  ...
```json
{
    prop: val
}
```
The configuration listed above wll result in a single Angular module created called 'stubs' with a value added to it
called 'testStubsData'.  The value of this Angular value will be the content of the JSON file.

Based on the configuration above, the following code is run during preprocessing for a file in `test/stubs/data.json`:

```js
require(['angular'], function(angular) {
   (function (module) {
        try {
            module = angular.module('stubs');
        } catch {
            module = angular.module('stubs', []);
        }

        module.value('testStubsData', {
            prop: 'val'
        });
    })();
});
```
Setting the enableRequireJs property to false will result in the above wrapping require block to be removed.

## Usage

Once configured, you then need to do 3 things to get the JSON values into your test:

1.  Require the module file using the path of the JSON file you need to inject
2.  Load the module using Angular mocks
3.  Read the value from your module

For example, using the above configuration, this is what a sample test would look like:

    describe('Widget Service Test', function () {
        var angular = require('angular');
        var mocks = require('angular-mocks');

        // Require the module containing the service you're testing as well as the name of the file you need to inject
        var widgetModule = require('modules/widgets');
        var data = require('test/stubs/data.json');

        var sut;

        var $httpBackend;
        var $rootScope;
        var mockData;

        // Create the modules
        beforeEach(mocks.module(widgetModule.name));
        beforeEach(mocks.module('stubs'));

        // The injected name of the value will be the full path of the file in camelCase (i.e. here its testStubsData)
        beforeEach(mocks.inject(function (_$rootScope_, _$httpBackend_, _$q_, WidgetService, testStubsData) {
            sut = WidgetService;
            $httpBackend = _$httpBackend_;
            $rootScope = _$rootScope_;
            mockData = testStubsData;
        }));


        it('should set the widgets property', function () {

            $httpBackend.when('GET', 'url/of/getWidgets/request').respond(JSON.stringify(mockData));

            sut.getWidgets();

            $httpBackend.flush();
            expect(sut.widgets).toBe(mockData);
        });

    });


## Contributing

To continuously run tests during development, run `karma start`.

Travis build information can be found [here](https://travis-ci.org/smaye81/karma-ng-json2js-preprocessor-requirejs)

For more information on Karma see the [homepage].

[homepage]: http://karma-runner.github.com