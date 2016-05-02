/* global beforeAll, describe, it, expect */
'use strict';
var helpers = require('yeoman-test');
var path = require('path');
var pathExists = require('path-exists');
var fs = require('fs');

describe('WpLibBox Create box', function () {
  var tmpdir;
  var data = {
    hostname: 'test-site.dev',
    box_name: 'test-site',
    box_description: 'description test-site',
    author_email: 'example@example.org',
    author_name: 'Example Example',
    author_role: 'maintainer',
    author_url: 'http://example.org'
  };
  var gen = helpers
    .run(path.join(__dirname, '../generators/app'))
    .inTmpDir(function (tmpdir2) {
      tmpdir = tmpdir2;
    })
    .withArguments('test-site')
    .withPrompts(data);
  describe('default', function () {
    beforeAll(function (done) {
      gen.on('end', done);
    });
    it('creates a box', function () {
      expect(pathExists.sync('test-site')).toBeTruthy();
    });
    it('creates a host folder', function () {
      expect(pathExists.sync('test-site/www/' + data.hostname.replace(/\./, '-'))).toBeTruthy();
    });
    it('copies required files', function () {
      expect(pathExists.sync('test-site/Vagrantfile')).toBeTruthy();
    });

    it('creates Vagrantfile with correct data', function () {
      var file = fs.readFileSync(tmpdir + '/test-site/Vagrantfile');
      expect(file).toContain('wplib.box');
    });
    it('creates .hosts file with correct data', function () {
      var file = fs.readFileSync(tmpdir + '/test-site/www/.hosts');
      expect(file).toContain('test-site.dev');
    });
    it('creates wp-config.php file with correct data', function () {
      var file = fs.readFileSync(tmpdir + '/test-site/www/test-site-dev/wp-config.php');
      expect(file).toContain('$_SERVER[\'HTTP_HOST\'] = \'test-site.dev\';');
      expect(file).toContain('define( \'DB_NAME\', \'test_site_dev\' )');
    });
  });
});