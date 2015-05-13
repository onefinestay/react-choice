"use strict";

var React = require('react/addons');
var fs = require('fs');
var _ = require('lodash');

var Header = require('./components/header.jsx');
var Footer = require('./components/footer.jsx');
var GithubRibbon = require('./components/github-ribbon.jsx');
var CodeSnippet = require('./components/code-snippet.jsx');
var Install = require('./components/install.jsx');
var Features = require('./components/features.jsx');
var CustomRender = require('./components/custom-render.jsx');

var Choice = require('../src');

var singleExample = fs.readFileSync(__dirname + '/code-snippets/single.jsx', 'utf8');
var multipleExample = fs.readFileSync(__dirname + '/code-snippets/multiple.jsx', 'utf8');

var COUNTRIES = require('./data/countries.js');

var Index = React.createClass({
  getDefaultProps: function() {
    return {};
  },

  render: function() {
    var options = _.map(COUNTRIES, function(option) {
      return (
        <Choice.Option key={option.value} value={option.value}>
          {option.label}
        </Choice.Option>
      );
    });

    return (
      <main id="app">
        <Header />
        <GithubRibbon />

        <div className="content">
          <div className="examples">
            <div className="example-single">
              <div className="example">
                <h2>Single Choice</h2>
                <Choice.Select placeholder="Select a country">
                  {options}
                </Choice.Select>

                <CodeSnippet language="javascript" toggle={false}>
                  {singleExample}
                </CodeSnippet>
              </div>
            </div>

            <div className="example-multiple">
              <div className="example">
                <h2>Multiple Choice</h2>
                <Choice.SelectMultiple placeholder="Select a country">
                  {options}
                </Choice.SelectMultiple>

                <CodeSnippet language="javascript" toggle={false}>
                  {multipleExample}
                </CodeSnippet>
              </div>
            </div>
            <div style={{clear: 'both'}}></div>
          </div>

          <Features />
          <Install />
          <div className="tutorials">
            <h2>Tutorials</h2>
            <CustomRender />
          </div>
        </div>

        <Footer />
      </main>
    );
  }
});

module.exports = Index;
