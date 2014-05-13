define(function (require) {

    "use strict";

    describe('HeaderCtrl', function () {
        var angular = require('angular');
        var mocks = require('angular-mocks');

        var dataModule = require('test/stubs/data.json');
        var emptyModule = require('test/stubs/empty.json');

        var data;
        var empty;

        beforeEach(mocks.module("stubs"));

        beforeEach(function () {
            mocks.inject(function (_testStubsData_, _testStubsEmpty_) {
                data = _testStubsData_;
                empty = _testStubsEmpty_;
            });
        });

        it('should pass', function () {

            expect(data).toEqual({
                "data" : {
                    "prop1" : "one",
                    "prop2" : "two"
                }
            });
        });

        it('should pass again', function () {

            expect(empty).toEqual({});
        });
    });
});
