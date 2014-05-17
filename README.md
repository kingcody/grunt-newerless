grunt-newerless
===============

small function for using newer.override with less files; specifically ones with @import

## Install

```shell
npm install git://github.com/kingcody/grunt-newerless.git --save-dev
```

## Usage

```js
var newerless = require('grunt-newerless');

module.exports = function (grunt) {
  /*
  ...
  */
  grunt.initConfig({
    newer: {
      options: {
        override: function(details, include) {
          
          if (details.task == 'less') {
            newerless(details)(details.path, function(found) {
              include(found);
            });
          } else {
            include(false);
          }
        }
      }
    }
  });

  /*
  ...
  */
};

```
