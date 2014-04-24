var ko = require('knockout');
var ob = ko.observable;
var oba = ko.observableArray;
var peekObservable = ko.utils.peekObservable;

var forEach = function(o, fn) {
    Object.keys(o).forEach(function(key) {
        fn(o[key], key);
    })
};


var isWriteable = function(ob, key) {
    if (!ko.isWriteableObservable(ob)) {
        return false;
    }

    if (key.charAt(0) === '_') {
        return false;
    }

    return true;
};

var getDataPropertyNames = function(model) {
    var names = [];
    forEach(model, function(o, key) {
        if (isWriteable(o, key)) {
            names.push(key);
        }
    });
    return names;
};

var setData = function(model, o) {
    forEach(o, function(value, key) {
        var ob = model[key];
        if (isWriteable(ob, key)) {
            ob(value);
        }
    })
};

var getData = function(model) {
    return getDataPropertyNames(model).reduce(function(all, key) {                   
        all[key] = peekObservable(model[key]);
        return all;
    }, {});
};

module.exports = {
    getData: getData,
    setData: setData,
    observable: function(props, model) {
        forEach(props, function(value, key) {
            model[key] = ko.observable(value);
        });
    },
    observableArray: function(props, model) {
        forEach(props, function(value, key) {
            model[key] = ko.observableArray(value);
        });
    },
    computed: function(props, model) {
        forEach(props, function(value, key) {
            model[key] = ko.computed(value, model);
        });
    }
};