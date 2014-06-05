var ko = require('knockout');
var peekObservable = ko.utils.peekObservable;
var oba = ko.observableArray;
var ob = ko.observable;
var _ = require('lodash');

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
    _.forEach(model, function(o, key) {
        if (isWriteable(o, key)) {
            names.push(key);
        }
    });
    return names;
};

var setData = function(model, o, manual) {
    _.forEach(o, function(value, key) {
        if (manual && (key in manual)) {
            manual[key].call(model, value);
        }
        else {
            var ob = model[key];
            if (isWriteable(ob, key)) {
                ob(cloneIfIsArray(value));
            }
        }
    })
};

var cloneIfIsArray = function(value) {
    return _.isArray(value) ? value.slice() : value;
};

var getData = function(model) {
    return getDataPropertyNames(model).reduce(function(all, key) {                   
        all[key] = peekObservable(model[key]);
        return all;
    }, {});
};

// var fromJS = function(o) {
//     if (_.isArray(o)) {
//         return oba(o.map(fromJS));
//     }
//     if (_.isPlainObject(o)) {
//         return _.reduce(o, function(ret, value, key) {
//             ret[key] = fromJS(value);
//             return ret;
//         }, {});
//     }
//     return ob(o);
// };

module.exports = {
    getData: getData,
    setData: setData,
    // fromJS: fromJS,
    observable: function(model, props) {
        _.forEach(props, function(value, key) {
            model[key] = (_.isArray(value) ? oba : ob)(cloneIfIsArray(value));
        });
    },
    computed: function(model, props) {
        _.forEach(props, function(value, key) {
            model[key] = ko.computed(value, model);
        });
    }
};