var _ = require('lodash');
var React = require('react');
var Cursor = require('react-cursor').Cursor;
var JsonEditor = require('../../');

var StateEditor = React.createClass({

    getInitialState: function () {
        return {
            a: 10,
            b: '20',
            c: null,
            d: {
                foo: {
                    bar: 42,
                    baz: 55,
                    buzz: 'womp'
                }
            },
            e: [
                { name: 'Alice', id: 0 },
                { name: 'Bob', id: 1 },
                { name: 'Charlie', id: 2 },
                { name: 'David', id: 3 }
            ]
        };
    },


    render: function () {
        var rootCursor = Cursor.build(this);
        return (
            <div className="App">
                <div className="row">
                    <div className="col">
                        State
                        <pre>{JSON.stringify(this.state, undefined, 2)}</pre>
                    </div>
                    <div className="col">
                        Editor
                        <JsonEditor targetCursor={rootCursor} />
                    </div>
                    <div className="col">
                        Second editor, because we can
                        <JsonEditor targetCursor={rootCursor} />
                    </div>
                </div>
                <hr/>
                <div>
                    <button onClick={this.saveState}> Save state </button>
                </div>
            </div>
        );
    },
    saveState: function() {
        console.log(JSON.stringify(this.state));
    }
});

module.exports = StateEditor;