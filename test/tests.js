var assert = require('assert')
  , mktree = require('../')
  , rimraf = require('rimraf')
  , fs = require('fs')
  , path = require('path')
  , baseDir = 'test/tmp'
  , cwd = process.cwd();

function checkPath(dir, done) {
  path.exists(dir, function(exists) {
    if (!exists) {
      assert.fail(exists, true, dir + ' does not exist');
    } else {
      assert.ok(dir + ' exists');
    }
    done && done();
  });
};

beforeEach(function(done) {
  rimraf(baseDir, function() {
    fs.mkdir(baseDir, function(err) {
      if (err) done(err);
      process.chdir(baseDir);
      done();
    });
  });
});

afterEach(function(done) {
  process.chdir(cwd);
  rimraf(baseDir, done);
});

describe('mktree', function() {

  describe('with a string', function() {
    it('should create a single directory', function(done) {
      var dir = 'foo';
      mktree(dir, function(err) {
        if (err) throw err;
        checkPath(dir, done);
      });
    });
  });

  describe('with an array', function() {
    it('should create multiple directories', function(done) {
      var dirs = ['foo', 'bar', 'baz']
        , i = 0;
      mktree(dirs, function(err) {
        if (err) throw err;
        dirs.forEach(function(dir) {
          checkPath(dir, function() {
            i++;
            if (i === dirs.length) {
              done();
            }
          });
        });
      });
    });
  });

  describe('with an object', function() {
    it('should create a nested subdirectory', function(done) {
      var tree = {
        foo: 'bar'      
      };
      mktree(tree, function(err) {
        if (err) throw err;
        checkPath('foo/bar', done);
      });
    });

    it('should create multiple nested subdirectories at the same level', function(done) {
      var dirs = ['bar', 'baz', 'qux']
        , i = 0
        , tree = {
            foo: dirs
          };
      mktree(tree, function(err) {
        if (err) throw err;
        dirs.forEach(function(dir) {
          checkPath('foo/' + dir, function() {
            i++;
            if (i === dirs.length) {
              done();
            }
          });
        });
      });
    });

    it('should create multiple nested subdirectories at different levels', function(done) {
      var dirs = ['baz', 'qux']
        , i = 0
        , tree = {
            foo: {
              bar: dirs
            }
          };
      mktree(tree, function(err) {
        if (err) throw err;
        dirs.forEach(function(dir) {
          checkPath('foo/bar/' + dir, function() {
            i++;
            if (i === dirs.length) {
              done();
            }
          });
        });
      });
    });

    it('should create a directory and fire a callback', function(done) {
      var dirs = ['baz', 'qux']
        , callbackFired = false
        , tree = {
            foo: function() { callbackFired = true; }
          };
      mktree(tree, function(err) {
        if (err) throw err;
        checkPath('foo', function() {
          assert.equal(callbackFired, true, 'Callback did not fire');
          done();
        });
      });
    });

    it('should create a directory with a given mode', function(done) {
      var mode = 0644
        , tree = {
            foo: {
              $mode: mode
            }
          };
      mktree(tree, function(err) {
        if (err) throw err;
        checkPath('foo', function() {
          fs.stat('foo', function(err, stats) {
            if (err) throw err;
            assert.equal(stats && stats.mode & 0777, mode);
            done();
          });
        });
      });
    });

    it('should create multiple directories with different modes', function(done) {
      var mode = 0700
        , mode2 = 0644
        , tree = {
            foo: {
              $mode: mode,
              $children: ['bar', { baz: { $mode: mode2 } }]
            }
          };
      mktree(tree, function(err) {
        if (err) throw err;
        checkPath('foo', function() {
          fs.stat('foo', function(err, stats) {
            if (err) throw err;
            assert.equal(stats && stats.mode & 0777, mode);
            
            checkPath('foo/baz', function() {
              fs.stat('foo/baz', function(err, stats) {
                if (err) throw err;
                assert.equal(stats && stats.mode & 0777, mode2);
                done();
              });
            });
          });
        });
      });
    });

    it('should create multiple directories with different modes and multiple callbacks', function(done) {
      var mode = 0700
        , mode2 = 0700
        , results = ''
        , tree = {
            foo: {
              $mode: mode
             ,$children: ['bar', {
                baz: {
                  $mode: mode2
                 ,$callback: function(path) {
                    results += '2' + path;
                  }
                 ,$children: [{ qux: function(path) { results += '3' + path; } }]
                }
              }]
             ,$callback: function(path) {
                results += '1' + path;
              }
            }
          };
      mktree(tree, function(err) {
        if (err) throw err;
        checkPath('foo', function() {
          fs.stat('foo', function(err, stats) {
            if (err) throw err;
            assert.equal(stats && stats.mode & 0777, mode);
            
            checkPath('foo/baz', function() {
              fs.stat('foo/baz', function(err, stats) {
                if (err) throw err;
                assert.equal(stats && stats.mode & 0777, mode2);
                
                checkPath('foo/baz/qux', function() {
                  fs.stat('foo/baz', function(err, stats) {
                    if (err) throw err;
                    assert.equal(results, '1foo2foo/baz3foo/baz/qux');
                    done();
                  });
                });

              });
            });
          });
        });
      });
    });

  });
});