/*
  封装一个函数 minReadFile 读取文件内容
  参数： path 文件路径
  返回： promise 对象
*/

function minReadFile(path) {
  return new Promise((resolve,reject) => {
      //在对象里使用fs模块
    const fs = require('fs');
    fs.readFile(path, (err, data) => {
      //判断
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  })
}

//这里直接链式调用
minReadFile('./resource/content.txt').then((val) => {
    //读取成功,输出文件内容
  console.log(val.toString());
}, (reason) => {
  console.log(reason);
});