const _ = require('underscore');
const path = require('path');
const fs = require('fs-extra');
const {setTimeout} = require('timers');

const idle = function(ms) { return new Promise((resolve, reject) => setTimeout(resolve, ms)) };
const getMostRecentFileName = (dir) => _.max(fs.readdirSync(dir), (f) => fs.statSync(path.join(dir, f)).ctime);
const catchAsyncErrors = (fn, errMessage) => { try { return fn() } catch(e) { if (errMessage) throw new Error(errMessage, e) } };
const log = (message) => console.log(`[icomoon-fetcher] ${message}`);

module.exports = {
    idle,
    getMostRecentFileName,
    catchAsyncErrors,
    log
}