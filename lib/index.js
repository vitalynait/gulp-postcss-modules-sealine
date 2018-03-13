"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateHash = generateHash;
exports.generateScopedName = generateScopedName;
exports.default = postcssModulesPlugin;

var _through = require("through2");

var _through2 = _interopRequireDefault(_through);

var _vinyl = require("vinyl");

var _vinyl2 = _interopRequireDefault(_vinyl);

var _postcss = require("postcss");

var _postcss2 = _interopRequireDefault(_postcss);

var _postcssModules = require("postcss-modules");

var _postcssModules2 = _interopRequireDefault(_postcssModules);

var _series = require("async/series");

var _series2 = _interopRequireDefault(_series);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _crc = require("crc");

var _crc2 = _interopRequireDefault(_crc);

var _gulpUtil = require("gulp-util");

var _gulpUtil2 = _interopRequireDefault(_gulpUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /*
                                                                                                                                                                                                    ===============================================================================
                                                                                                                                                                                                      Gulp Vue-Split
                                                                                                                                                                                                      Copyright 2016 Sebastian Software GmbH <https://www.sebastian-software.de>
                                                                                                                                                                                                    ===============================================================================
                                                                                                                                                                                                    */

var memCache = {};

function generateHash(filename) {
  var relPath = _path2.default.relative(process.cwd(), filename);
  return _crc2.default.crc32(relPath).toString(16);
}

function generateScopedName(name, filename) {
  return name + "-SealineWidget";
}

function postcssModulesPlugin() {
  var plugins = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var config = arguments[1];

  var moduleMapping = null;

  function processStyle(done, text, path, base) {
    if (!text) return done();

    return (0, _postcss2.default)([].concat(_toConsumableArray(plugins), [(0, _postcssModules2.default)({
      generateScopedName: generateScopedName,
      getJSON: function getJSON(cssFileName, json) {
        moduleMapping = JSON.stringify(json);
      }
    })])).process(text, {
      from: path
    }).then(function (result) {
      if (memCache[path] === moduleMapping) return done();

      memCache[path] = moduleMapping;

      var fileObj = new _vinyl2.default({
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

    if (file.isStream()) return callback(new _gulpUtil2.default.PluginError("gulp-postcss-modules-sealine", "Streams are not supported"));

    var self = this;

    var filePath = file.path;
    var fileBase = file.base;
    var fileContent = file.contents.toString("utf8");

    return (0, _series2.default)([function (done) {
      processStyle(done, fileContent, filePath, fileBase);
    }], function (err, results) {
      if (err) return callback(new _gulpUtil2.default.PluginError("gulp-postcss-modules-sealine", err));

      results.forEach(function (resultFile) {
        return resultFile && self.push(resultFile);
      });
      return callback();
    });
  }

  return _through2.default.obj(transform);
}
//# sourceMappingURL=index.js.map