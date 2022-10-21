/*
util.promisify 方法

*/
//引入 util 模块
const util = require('util');
//引入 fs 模块
const fs = require('fs');
//把fs.readFile方法传递进去 将返回一个新函数
let minReadFile = util.promisify(fs.readFile);

//返回的新函数就是promise对象
minReadFile('./resource/content.txt').then(value => {
  console.log(value.toString());
});