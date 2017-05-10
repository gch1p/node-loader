/*
    MIT License http://www.opensource.org/licenses/mit-license.php
    Author Tobias Koppers @sokra
    Edited Guilherme Bernal @lbguilherme
    Edited Evgeny Zinoviev @gch1p
*/

const loaderUtils = require("loader-utils");

module.exports = function(content) {
  this.cacheable && this.cacheable();
  if (!this.emitFile) throw new Error("emitFile is required from module system");

  let query = loaderUtils.parseQuery(this.query);
  if (query.emitFile) {
    let url = loaderUtils.interpolateName(this, query.name || "[hash].[ext]", {
      context: query.context || this.options.context,
      content: content,
      regExp: query.regExp
    });
    this.emitFile(url, content);

    let modulePath = !query.absolutePath
      ? '__webpack_public_path__+' + JSON.stringify(url)
      : "require('path').join(__dirname, __webpack_public_path__, "+JSON.stringify(url)+")"

    return "try { global.process.dlopen(module, " + modulePath + "); } catch(e) { " +
      "throw new Error('Cannot load native module ' + " + JSON.stringify(url) + " + ': ' + e); }";
  } else {
    return "try {global.process.dlopen(module, " + JSON.stringify(this.resourcePath) + "); } catch(e) {" +
      "throw new Error('Cannot open ' + " + JSON.stringify(this.resourcePath) + " + ': ' + e);}";
  }
}
module.exports.raw = true;
