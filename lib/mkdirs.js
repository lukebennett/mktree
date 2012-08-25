var mkdirp = require('mkdirp');

exports = module.exports = function mkdirs(nested, done) {

  var processDir
    , count = 0
    , loop = 0
    , callback;

  callback = function callback() {
    if (loop === count - 1 && done) {
      done();
    } else {
      loop++;
    }
  };

  processDir = function processDir(base, dirs, fn) {
    var i
      , len
      , item
      , path;

    if (Array.isArray(dirs)) {
      for (i = 0, len = dirs.length; i < len; i++) {
        processDir(base, dirs[i]);
      }
    } else if (typeof dirs === 'object') {
      for (item in dirs) {
        if (dirs.hasOwnProperty(item)) {
          if (typeof dirs[item] === 'function') {
            processDir(base, item, dirs[item]);
          } else {
            processDir(base + item + '/', dirs[item]);
          }
        }
      }
    } else if (typeof dirs === 'string') {
      path = base + dirs + '/';
      count++;
      mkdirp(path, 0755, function(err) {
        if (err) throw err;
        fn && fn(path);
        callback && callback();
      })
    }
  }

  processDir('', nested);
};