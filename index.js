/*
    MIT License http://www.opensource.org/licenses/mit-license.php
    Author Tobias Koppers @sokra
    Edited Guilherme Bernal @lbguilherme
*/
module.exports = function(content) {
    this.cacheable && this.cacheable();
    if (!this.emitFile) throw new Error("emitFile is required from module system");
    var query = loaderUtils.parseQuery(this.query);
    var url = loaderUtils.interpolateName(this, query.name || "[hash].[ext]", {
        context: query.context || this.options.context,
        content: content,
        regExp: query.regExp
    });
    this.emitFile(url, content);
    return "try { global.process.dlopen(module, __webpack_public_path__ + " + JSON.stringify(url) + "); } catch(e) { " +
        "throw new Error('Cannot load native module ' + " + JSON.stringify(url) + " + ': ' + e); }";
}
