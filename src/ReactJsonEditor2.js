'use strict';

var _ = require('lodash');
var React = require('react');
var Cursor = require('react-cursor');
var TreeView = require('react-treeview');
var JsonLeafEditor = require('./JsonLeafEditor');

var JsonEditor = React.createClass({
    getDefaultProps: function () {
        return {
            targetCursor: undefined, // the app state that we're targetting
            toggleOnDoubleClick: false,
            canToggle: true
        };
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        var unchanged =
            // cursor is a special object with function values - not JSON serializable
            _.isEqual(_.omit(this.props, 'targetCursor'), _.omit(nextProps, 'targetCursor')) &&
            // but the JsonEditor understands cursors so we can do the right thing
            _.isEqual(this.props.targetCursor.value, nextProps.targetCursor.value) &&
            _.isEqual(this.state, nextState);
        return !unchanged;
    },

    render: function () {
        var editorCursor = this.props.targetCursor; //Cursor.build(this.state, this.setState.bind(this), _.cloneDeep);

        return (
            <div>
                <TreeView nodeLabel="JsonEditor">
                    {buildConfig(editorCursor)}
                </TreeView>
            </div>
        );
    }
});


// time to parse it into a format the tree view recognizes
// [
//   {displayNode: bla, children: [bla, bla]},
//   {displayNode: bla, children: [bla, bla]},
// ]

function buildConfigArray (nodes) {
    // array of cursors
    // convert the array into an object where the key is the index
    var xs = _.object(_.map(nodes, function (node, i) {
        return [i, node];
    }));

    return _.map(xs, buildConfigObject); // recursion
}

function buildConfigObject (cursor, key) {
    var node = cursor.value;
    // node is an: object, array, or primitive
    // if its an array, we need to turn it into a map, and name each element in the array
    if (node instanceof Array) {
        // expand Cursor[List[T]] into List[Cursor[T]]
        var acc = [];
        _.each(cursor.value, function (el, i) {
            acc.push(cursor.refine(i));
        });
        var nodeLabel = key + ' [' + node.length + ']';
        return (
            <div>
                <TreeView nodeLabel={displayNodeLabel(nodeLabel)}>
                    {buildConfigArray(acc)}
                </TreeView>
            </div>
        );
    }
    else if (node instanceof Object) { // {a:'a', b:'b'}
        return (
            <div>
                <TreeView nodeLabel={displayNodeLabel(key)}>
                    {mapCursorKV(cursor, buildConfigObject)}
                </TreeView>
            </div>
         );
    }
    else { // primitive
        return <TreeView nodeLabel={displayLeaf(key, cursor)} />
    }
}

function buildConfig (rootNode) {
    if (rootNode instanceof Array) return buildConfigArray(rootNode);
    return [buildConfigObject(rootNode, 'root')];
}

function displayLeaf (key, cursor) {
    return (
        <span>
            <code>{key}: </code>
            <JsonLeafEditor cursor={cursor} />
        </span>
    );
}

function displayNodeLabel (label) {
    return (<code>{label}</code>);
}

function mapCursorKV (cursor, f) {
    // map over the kv pairs, using f(cursor.refine[key], key) rather than f(obj[key], key)
    var acc = [];
    _.each(_.keys(cursor.value), function (key) {
        var val = f(cursor.refine(key), key);
        acc.push(val); // not [key, val]
    });
    return acc; // like _.map, it is call site's responsibility to call _.object if desired
}


module.exports = JsonEditor;