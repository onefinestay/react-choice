React Choice
======================

A React based customisable select box.

[Demo](http://onefinestay.github.io/react-choice/)

## Features

* Search text highlighting
* Single or multiple selection
* Custom results rendering

## Contribute

Please feel to contribute to this project by making pull requests. You can see a
list of tasks that can be worked on in the [issues list](https://github.com/onefinestay/react-choice/issues).

### Building example page

Once you have the repository cloned run the following commands to get started:

```shell
npm install
npm install -g webpack // we use webpack to build the js for the example page
```

Then in one shell run `gulp develop` and in another `webpack -w --colors --progress`.
This will start a local server at `http://localhost:9989` where you can see the
example page. It will also watch for any files changes and rebuild.
