/*
  封装一个函数 minReadFile 读取文件内容
  需在node.js环境下
  参数： path 文件路径
  返回： promise 对象
*/

function minReadFile(path) {
  //返回的Promise对象
  return new Promise((reslove, reject) => {
      //导入fs模块,并且使用其readFile方法
    //readFile第一个参数是路径，第二个参数是回调函数
    require('fs').readFile(path, (err, data) => {
        //判断
      if (err) {
        reject(err);
      } else {
         reslove(data);
      }
      //如果成功
    });
  })
}

//调用封装好的方法后面是链式调用
minReadFile('./resource/content.txt')
  .then((value) => {
  //成功的回调函数
  console.log(value.toString());
}, (reason) => {
  //失败的回调函数
  console.log(reason);
  });