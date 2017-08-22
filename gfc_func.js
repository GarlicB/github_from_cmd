var child_process = require('child_process');
var execSync = child_process.execSync;
var https = require('https');
var readline = require('readline');
var writable = require('stream').Writable;

var mutableStdout = new writable({
  write: function(chunk, encoding, callback) {
    if (!this.muted)
      process.stdout.write(chunk, encoding);
    callback();
  }
});

/**
 * @param {String} option keywords 'pr' or 'cp'.
 */
exports.inputRL = function(info, assign_info) {

  var rl = readline.createInterface({
    input: process.stdin,
    output: mutableStdout,
    terminal: true
  });

  var i = 0;

  var recursiveRL = function recursiveRL(value) {

    if (i < Object.keys(info.add).length) {
      rl.question(value + ': ', function(answer) {
        info.add[Object.keys(info.add)[i]] = answer;
        i++;
        recursiveRL(Object.keys(info.add)[i]);
      });

      if (Object.keys(info.add)[i] === 'pw')
        mutableStdout.muted = true;

      else
        mutableStdout.muted = false;

    } else {
      assign_info = Object.assign(assign_info, info.add);
      ghAPI(info);
      rl.close();
    }
  };
  recursiveRL(Object.keys(info.add)[i]);
}

/**
 * @param {String} value The shell command.
 * @return {String} data The extra command.
 */
exports.cmd = function(value) {
  try {
    return execSync(value).toString().replace(/\n/g, '');
  } catch (err) {
    return 0;
  }
}

/**
 * @param {Object} info The information.
 * pw will replace the personal access token.
 */
function ghAPI(info) {

  var options = {
    auth: info.base.id + ':' + info.base.pw,
    hostname: 'api.github.com',
    path: info.base.path,
    method: info.base.mtd,
    headers: {
      'User-Agent': 'Node js',
      'Content-Type': 'application/json'
    }
  };

  var req = https.request(options, function(res) {
    var body = '';

    res.on('data', function(contents) {
      body += contents;
    });

    res.on('end', function() {
      if (body !== '')
        info.base.result = JSON.parse(body.toString());

      info.base.status = res.statusCode;
      console.log('\n', info.base.result);
      detail_work(info);
    });
  });

  req.on('error', function(e) {
    console.log('Error!', e.message);
  });
  if (info.base.mtd === 'POST')
    req.write(JSON.stringify(info.post));

  req.end();
}

function detail_work(info) {
  var addPAT = 'git config --local --add gfc.';
  var getPAT = 'git config --local --get gfc.';
  var delPAT = 'git config --local --unset gfc.';

  if (info.base.path === '/authorizations' && info.base.status === 201) {
    var ori = exports.cmd('git remote get-url origin').split("/");

    console.log('Get new token');
    console.log('Setting...');

    execSync(addPAT + 'User ' + info.base.id);
    execSync(addPAT + 'Token ' + info.base.result.token);
    execSync(addPAT + 'Tokid ' + info.base.result.id);
    execSync(addPAT + 'Origin ' + ori[3] + '/' + ori[4]);
    info.base.path = '/repos/' + ori[3] + '/' + ori[4];
    info.base.mtd = 'GET';
    ghAPI(info);
  }

  if (info.base.result.parent) {
    execSync(addPAT + 'Upstream ' + info.base.result.parent.full_name);
  }
}
