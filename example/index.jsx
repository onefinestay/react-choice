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

var Choice = require('../');

var singleExample = fs.readFileSync(__dirname + '/code-snippets/single.jsx', 'utf8');
var multipleExample = fs.readFileSync(__dirname + '/code-snippets/multiple.jsx', 'utf8');

var COUNTRIES = require('./data/countries.json');

var Index = React.createClass({
  getDefaultProps: function() {
    return {};
  },

  render: function() {
    var options = _.map(COUNTRIES, function(option) {
      return <Choice.Option key={option.value} value={option.value}
        label={option.label} />;
    });

    return (
      <html>
        <head>
          <title>React Choice Demo</title>
          <link href='//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.0/styles/docco.min.css' rel='stylesheet' type='text/css'></link>
          <link href="css/index.css" rel="stylesheet"></link>
          <link href="css/choice/index.css" rel="stylesheet"></link>
        </head>
        <body>
          <Header />
          <GithubRibbon />

          <div className="content">
            <div className="examples">
              <div className="example-single">
                <div className="example">
                  <h2>Single Choice</h2>
                  <Choice.Single placeholder="Select a country">
                    {options}
                  </Choice.Single>

                  <CodeSnippet language="javascript" toggle={false}>
                    {singleExample}
                  </CodeSnippet>
                </div>
              </div>

              <div className="example-multiple">
                <div className="example">
                  <h2>Multiple Choice</h2>
                  <Choice.Multiple options={COUNTRIES} placeholder="Select a country" />

                  <CodeSnippet language="javascript" toggle={false}>
                    {multipleExample}
                  </CodeSnippet>
                </div>
              </div>
              <div style={{clear: 'both'}}></div>
            </div>

            <Features />
            <Install />
          </div>

          <Footer />

          <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.0/highlight.min.js" charSet="utf-8"></script>
          <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.0/languages/javascript.min.js" charSet="utf-8"></script>
          <script src="build/index.js"></script>
        </body>
      </html>
    );
  }
});

module.exports = Index;
