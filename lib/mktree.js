var mkdirp = require('mkdirp')
  , path = require('path');

exports = module.exports = function mktree(tree, done) {

  var count = 0
    , loop = 0;

  function callback(err) {
    if (loop === count - 1 && done) {
      done(err);
    } else {
      loop++;
    }
  };

  function processTree(base, input, mode, fn) {
    var item
      , subPath
      , mkdirFunc;

    if (typeof fn === 'undefined' && typeof mode === 'function') {
      fn = mode;
      mode = undefined;
    }

    if (Array.isArray(input)) {
      input.forEach(function(dir) {
        processTree(base, dir);
      });
    } else if (typeof input === 'object') {
      for (item in input) {
        if (input.hasOwnProperty(item) && item !== '$children' && item !== '$callback') {
          if (item === '$mode') {
            processTree(base, '', input[item], function(subPath) {
              if (input.$children) {
                processTree(subPath, input.$children);
              }
              input.$callback && input.$callback(subPath);
            });
          } else if (typeof input[item] === 'function') {
            processTree(base, item, input[item]);
          } else {
            processTree(path.join(base, item), input[item]);
          }
        }
      }
    } else if (typeof input === 'string') {
      subPath = path.join(base, input) + '/';
      count++;
      mkdirFunc = function mkDirFunc(err) {
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

  processTree('', tree);
};  