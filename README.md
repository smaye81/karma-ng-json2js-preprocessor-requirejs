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
Inject json fixture into your test case:
```js
describe('me', function(){
    beforeEach(module('served/data.json'));

    it('should not fail', function() {
        var testFixture;
        inject(function (_servedData_) {
            testFixture = _servedData_;
        });

        expect(testFixture).toEqual({
            prop: 'val'
        });
    });

});
```

----

## Contributing

To continuously run tests during development, run `karma start`.

Travis build information can be found [here](https://travis-ci.org/smaye81/karma-ng-json2js-preprocessor-requirejs)

For more information on Karma see the [homepage].

[homepage]: http://karma-runner.github.com