var mkdirp = require('mkdirp')
  , path = require('path');

exports = module.exports = function mkdirs(nested, done) {

  var processDir
    , count = 0
    , loop = 0
    , callback;

  callback = function callback(err) {
    if (loop === count - 1 && done) {
      done(err);
    } else {
      loop++;
    }
  };

  processDir = function processDir(base, dirs, mode, fn) {
    var i
      , len
      , item
      , subPath
      , mkdirFunc;

    if (typeof fn === 'undefined' && typeof mode === 'function') {
      fn = mode;
      mode = undefined;
    }

    if (Array.isArray(dirs)) {
      for (i = 0, len = dirs.length; i < len; i++) {
        processDir(base, dirs[i]);
      }
    } else if (typeof dirs === 'object') {
      for (item in dirs) {
        if (dirs.hasOwnProperty(item) && item !== '$children' && item !== '$callback') {
          if (item === '$mode') {
            processDir(base, '', dirs[item], function(subPath) {
              if (dirs.$children) {
                processDir(subPath, dirs.$children);
              }
              dirs.$callback && dirs.$callback(subPath);
            });
          } else if (typeof dirs[item] === 'function') {
            processDir(base, item, dirs[item]);
          } else {
            processDir(path.join(base, item), dirs[item]);
          }
        }
      }
    } else if (typeof dirs === 'string') {
      subPath = path.join(base, dirs) + '/';
      count++;
      mkdirFunc = function(err) {
        if (err) done(err);
        fn && fn(subPath);
        callback && callback(null);
      };
      if (mode) {
        mkdirp(subPath, mode, mkdirFunc);
      } else {
        mkdirp(subPath, mkdirFunc);
      }
    }
  }

  processDir('', nested);
};  