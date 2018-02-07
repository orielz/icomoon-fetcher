const _ = require('underscore');
const path = require('path');
const fs = require('fs-extra');
const {setTimeout} = require('timers');

const idle = function(ms) { return new Promise((resolve, reject) => setTimeout(resolve, ms)) };
const getMostRecentFileName = (dir) => _.max(fs.readdirSync(dir), (f) => fs.statSync(path.join(dir, f)).ctime);

module.exports = {
    idle,
    getMostRecentFileName    
}