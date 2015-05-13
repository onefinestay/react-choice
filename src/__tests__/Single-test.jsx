/* global describe, beforeEach, afterEach, it, initDOM, cleanDOM */
import assert from 'assert';
import sinon from 'sinon';

var React;
var TestUtils;


describe("Single select", () => {
  beforeEach(() => {
    initDOM();
    React = require('react/addons');
    TestUtils = React.addons.TestUtils;
  });

  afterEach(() => {
    cleanDOM();
  });

  it("renders with options", () => {
    const Choice = require('../');

    const choices = [
      [1, 'foo'],
      [2, 'bar'],
      [3, 'fizz'],
      [4, 'buzz']
    ];

    var stub = TestUtils.renderIntoDocument(
      <Choice.Select value={3}>
        {choices.map((choice) => {
          return <Choice.Option key={choice[0]} value={choice[0]}>{choice[1]}</Choice.Option>;
        })}
      </Choice.Select>
    );
    assert.equal(stub.refs.input.getDOMNode().value, 3);
  });

  it("filters based on search", () => {
    const Choice = require('../');

    const choices = [
      [1, 'foo'],
      [2, 'bar'],
      [3, 'fizz'],
      [4, 'buzz']
    ];

    var stub = TestUtils.renderIntoDocument(
      <Choice.Select>
        {choices.map((choice) => {
          return <Choice.Option key={choice[0]} value={choice[0]}>{choice[1]}</Choice.Option>;
        })}
      </Choice.Select>
    );

    // focus on text input
    TestUtils.Simulate.focus(stub.refs.textInput);

    const options = stub.refs.options;
    let results = TestUtils.scryRenderedDOMComponentsWithClass(options, 'react-choice-option');
    assert.equal(results.length, 4);

    // search
    TestUtils.Simulate.change(stub.refs.textInput, {target: {value: 'f'}});
    results = TestUtils.scryRenderedDOMComponentsWithClass(options, 'react-choice-option');
    assert.equal(results.length, 2);
  });

  it("clicking on result fires onSelect callback", () => {
    const Choice = require('../');

    const choices = [
      [1, 'foo'],
      [2, 'bar'],
      [3, 'fizz'],
      [4, 'buzz']
    ];

    const onSelect = sinon.spy();

    var stub = TestUtils.renderIntoDocument(
      <Choice.Select value={1} onSelect={onSelect}>
        {choices.map((choice) => {
          return <Choice.Option key={choice[0]} value={choice[0]}>{choice[1]}</Choice.Option>;
        })}
      </Choice.Select>
    );

    // focus on text input
    TestUtils.Simulate.focus(stub.refs.textInput);

    const options = stub.refs.options;
    let results = TestUtils.scryRenderedDOMComponentsWithClass(options, 'react-choice-option');

    TestUtils.Simulate.mouseDown(results[1]);

    assert(onSelect.calledOnce);

    const args = onSelect.args[0];

    assert.equal(args[0].target.value, 2);
  });
});
