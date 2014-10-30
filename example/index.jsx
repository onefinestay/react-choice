"use strict";

var React = require('react/addons');
var fs = require('fs');

var Header = require('./components/header.jsx');
var Footer = require('./components/footer.jsx');
var GithubRibbon = require('./components/github-ribbon.jsx');
var CodeSnippet = require('./components/code-snippet.jsx');
var Install = require('./components/install.jsx');
var Features = require('./components/features.jsx');

var Choice = require('../');

var singleExample = fs.readFileSync(__dirname + '/code-snippets/single.jsx', 'utf8');

var Index = React.createClass({
  getDefaultProps: function() {
    return {};
  },

  render: function() {
    var options = [];
    for (var i = 0; i < 10; i++) {
      options.push({
        value: "" + i,
        label: "" + i
      });
    }

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
            <div className="example">

              <Choice.Single options={options} placeholder="Select an option" />

              <CodeSnippet language="javascript">
                {singleExample}
              </CodeSnippet>
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
