var ou = require('../')
var ko = require('knockout');
var assert = require('assert');


describe('set get', function() {
    it('should set data', function() {
        var o = {
            a: ko.observable('a')
        }

        ou.setData(o, {
            a: 1,
            b: 2
        });

        assert.equal(o.a(), 1);
        assert.equal(o.b, undefined)
    })

    it('should get data', function() {
        var o = {
            a: ko.observable('a'),
            b: ko.observableArray(),
            c: ko.computed({
                read: function() {
                    return 'c'
                },
                write: function() {}
            }),
            d: 1
        }


        assert.deepEqual(ou.getData(o), {
            a: 'a',
            b: [],
            c: 'c'
        })
    })
})