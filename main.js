#!/usr/bin/env node

var gfc = require('./gfc_func.js');
var get_gfc = 'git config --local --get gfc.';
var info = {
  base: {},
  add: {},
  post: {}
};

info.base.keyword = process.argv[2];
info.base.id = gfc.cmd(get_gfc + 'User');
info.base.pw = gfc.cmd(get_gfc + 'Token');
info.base.ups = gfc.cmd(get_gfc + 'Upstream');
info.base.ori = gfc.cmd(get_gfc + 'Origin');

var assign_info = info.base;
var dest = info.base.ups;

if (!info.base.ups)
  dest = info.base.ori;

if (!info.base.pw)
  process.argv[2] = 'token'

switch (process.argv[2]) {
  case 'token':
    console.log('You do not have a token. Please make the one!');
    info.base.mtd = 'POST', info.base.path = '/authorizations';
    info.add.id = '', info.add.pw = '';
    info.post.note = 'Token(github_from_cmd)';
    info.post.scopes = 'repo';
    break;

  case 'pr':
    console.log('Write about pull-request (title/body)');
    info.base.mtd = 'POST', info.base.path = '/repos/' +
      dest + '/pulls';
    info.add.title = '', info.add.body = '';
    info.post.base = process.argv[3];
    info.post.head = info.base.ori.split("/")[0] +
      ':' + gfc.cmd('git symbolic-ref --short HEAD');
    assign_info = info.post
    break;

  case 'cp':
    gfc.cmd(
      'git fetch https://github.com/' + dest + ' pull/' +
      process.argv[3] + '/head:pr-' + process.argv[3]);
    break;

  default:
    console.log('no options :<');
    return 0;
    break;
}

if (Object.keys(info.add).length > 0)
  gfc.inputRL(info, assign_info);
