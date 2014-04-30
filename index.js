var fs = require('fs');
var path = require('path');
var async = require('async');

module.exports = function(details) {
  var checkFileForModifiedImports = async.memoize(function(filepath, fileCheckCallback) {
    fs.readFile(filepath, 'utf8', function(error, data) {
      var directoryPath = path.dirname(filepath);
      var regex = /@import (?:\([^)]+\) )?["'](.+?)(\.less)?["']/g
      var match;

      function checkNextImport() {
        if ((match = regex.exec(data)) === null) {
          return fileCheckCallback(false); // all @import files has been checked.
        }

        var importFilePath = path.join(directoryPath, match[1] + '.less');
        fs.exists(importFilePath, function(exists) {
          if (!exists) { // @import file does not exists.
            return checkNextImport(); // skip to next
          }

          fs.stat(importFilePath, function(error, stats) {
            if (stats.mtime > details.time) { // @import file has been modified, -> include it.
              fileCheckCallback(true);
            } else { // @import file has not been modified but, lets check the @import's of this file.
              checkFileForModifiedImports(importFilePath, function(hasModifiedImport) {
                if (hasModifiedImport) {
                  fileCheckCallback(true);
                } else {
                  checkNextImport();
                }
              });
            }
          });
        });
      };

      checkNextImport();
    });
  });

  return checkFileForModifiedImports;
};