/*
===============================================================================
  Gulp Vue-Split
  Copyright 2016 Sebastian Software GmbH <https://www.sebastian-software.de>
===============================================================================
*/

import through from "through2";
import File from "vinyl";
import postcss from "postcss";
import postcssModules from "postcss-modules";
import series from "async/series";
import pathModule from "path";
import crc from "crc";
import gutil from "gulp-util";

var memCache = {};

export function generateHash(filename) {
  const relPath = pathModule.relative(process.cwd(), filename);
  return crc.crc32(relPath).toString(16);
}

export function generateScopedName(name, filename) {
  return `${name}-SealineWidget`;
}

export default function postcssModulesPlugin(plugins = [], config) {
  var moduleMapping = null;

  function processStyle(done, text, path, base) {
    if (!text) return done();

    return postcss([...plugins, postcssModules({
      generateScopedName: generateScopedName,
      getJSON: function (cssFileName, json) {
        moduleMapping = JSON.stringify(json);
      }
    })]).process(text, {
      from: path
    }).then(result => {
      if (memCache[path] === moduleMapping) return done();

      memCache[path] = moduleMapping;

      const fileObj = new File({
        contents: new Buffer(moduleMapping),
        path: path.replace(".scss", ".scss.json"),
        base: base
      });

      return done(null, fileObj);
    });
  }

  function transform(file, encoding, callback) {
    /* eslint no-invalid-this: 0 */

    if (file.isNull()) return callback(null, file);

    if (file.isStream()) return callback(new gutil.PluginError("gulp-postcss-modules-sealine", "Streams are not supported"));

    var self = this;

    var filePath = file.path;
    var fileBase = file.base;
    var fileContent = file.contents.toString("utf8");

    return series([function (done) {
      processStyle(done, fileContent, filePath, fileBase);
    }], (err, results) => {
      if (err) return callback(new gutil.PluginError("gulp-postcss-modules-sealine", err));

      results.forEach(resultFile => resultFile && self.push(resultFile));
      return callback();
    });
  }

  return through.obj(transform);
}
//# sourceMappingURL=index.js.map