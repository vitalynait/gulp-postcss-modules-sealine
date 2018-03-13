A trivial solution for extracting CSS module data from PostCSS files.

Supports CSS module preprocessing for prevention of naming conflicts between components.

Uses a memory cache during runtime to omit regenerating files with probably unchanged content.

## Links

- [GitHub](https://github.com/vitalynait/gulp-postcss-modules-sealine)
- [NPM](https://www.npmjs.com/package/gulp-postcss-modules-sealine)


## Installation

Should be installed locally in your project source code:

```bash
npm install gulp-postcss-modules-sealine --save-dev
```


## Usage with Gulp

```js
import postcssModules from "gulp-postcss-modules-sealine"

gulp.task("postcss:modules", function() {
  return gulp.src("src/**/*.scss").
    pipe(postcssModules()).
    pipe(gulp.dest("."))
})
```

This generates the extract/processed `.scss.json` files to the same folder as the source `.scss` file.



## Copyright

Copyright 2016<br/>[Sealine][sponsor]
