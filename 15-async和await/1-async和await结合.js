const fs = require('fs');
const util = require('util');
const minReadFile = util.promisify(fs.readFile);

async function main() {
  try {
    //读取文件内容
  let data1 = await minReadFile('./resource/11.html');
  let data2 = await minReadFile('./resource/2.html');
  let data3 = await minReadFile('./resource/3.html');
  console.log(data1 + data2 + data3);
  } catch (e) {
    //通过catch捕获错误结果
    console.log(e);
  }
}
main();
