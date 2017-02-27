'use strict';
var path = require('path'),
	pgp = require('pg-promise');
    // Helper for linking to external query files:
function sqlPath(file) {
    var fullPath = path.join(__dirname, file); // generating full path;
    return new pgp.QueryFile(fullPath, {minify: true});
}
var clHelper = {
  sqlPath : sqlPath
};
module.exports = clHelper;