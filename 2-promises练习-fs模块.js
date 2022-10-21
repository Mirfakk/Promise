//引入node.js的fs模块
const { reject } = require('assert');
const fs = require('fs');
const { resolve } = require('path');

//使用fs模块读取文件

//回调函数形式
//第一个参数是目标文件路径，第二个是回调函数，函数里包含读取成功和失败的结果
// fs.readFile('./resource/content.txt', (err,data) => {
//    //如果错误，抛出错误
//   if (err) throw err;
//   //没有错误，输出文件内容,toString转为字符串
//   console.log(data.toString());
// })

//Promise 形式进行封装
let p = new Promise((resolve, reject) => {
  //异步任务
  fs.readFile('./resource/content.txt', (err, data) => {
    //如果失败,调用回调函数，并且把err失败结果传进去
    if (err) reject(err);
    //如果成功,调用回调函数，把结果传进去
    resolve(data);
  })
});

//调用then，对结果做处理
//这里只有一个参数可以省略小括号
p.then(value => {
    console.log(value.toString());
}, reason => {
    console.log(reason);
});