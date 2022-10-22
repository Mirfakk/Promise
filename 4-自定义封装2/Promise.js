//自定义Promise，用于覆盖内置的Promise
/*
这里的executor为执行器函数
(resolve, reject) => { resolve('ok!');}
*/
function Promise(executor) {
  //用this.添加属性
  this.PromiseState = 'pending';//默认值是pending
  this.PromiseResult = 'null';
  //用于保存回调函数,为了保存多个回调函数，变为数组
  this.callbacks = [];
  //保存实例对象的 this 的值
  const self = this;//这里指向的就是实例，而不是window

  //由于new Promise中有两个形参函数时resolve和reject，这里需要定义才能够在executor中来传递。
  //由于Promise对象实例化时调用resolve方法会传递实参，所以这里需要定义data形参用于传递。
  function resolve(data) {
    //判断状态是否为初始值，如果不是则停止执行后续代码
    if (self.PromiseState !== 'pending') return;
    // console.log(this);//此时this指向的是window
    //1.修改对象状态，状态是实例对象上的属性（promiseState）
    self.PromiseState = 'fulfilled';//默认值是pending
    //2.设置对象结果值,(promiseResult)，这里是result传递进来的实参
    self.PromiseResult = data;
    //遍历，调用成功的回调函数,这里的item就是callbacks中的数组
    self.callbacks.forEach(item => {
      //在这调用成功的回调函数，并且传递实参
      item.onResolved(data);
    })
  }
  function reject(data) {
    //判断状态是否为初始值，如果不是则停止执行后续代码
    if (self.PromiseState !== 'pending') return;
    // console.log(this);//此时this指向的是window
    //1.修改对象状态，状态是实例对象上的属性（promiseState）
    self.PromiseState = 'rejected';//默认值是pending
    //2.设置对象结果值,(promiseResult)，这里是result传递进来的实参
    self.PromiseResult = data;
    //遍历，调用成功的回调函数,这里的item就是callbacks中的数组
    self.callbacks.forEach(item => {
      //在这调用失败的回调函数，并且传递实参
      item.onRejected(data);
    })
  }
  //在执行器函数这里使用try。catch
  try {
    //同步"调用执行器"函数
    executor(resolve,reject);//这里就是调用执行体函数
  } catch (e) {//这里的e就是throw抛出的异常值
    //catch能够接受到throw抛出的异常
    //在这里修改Promise状态为失败，只需要调用一次reject方法即可
    //并且抛出的结果值就是Promise对象失败的结果值(PromiseResult)
    reject(e);
  }

  
}

//添加then方法,Promise原型链上的then，里面包含两个形参，对应着调用该方法的两个实参。
Promise.prototype.then = function(onResolved,onRejected) {
  //在此调用回调函数，执行前需要先判断状态，根据状态执行相对应的回调函数
  //这里的this指向的就是实例对象
  if (this.PromiseState == 'fulfilled') {
    //形参传递的是实例对象成功状态的结果值，在PromiseState中保存
    onResolved(this.PromiseResult);
  }
  if (this.PromiseState == 'rejected') {
    onRejected(this.PromiseResult);
  }
  if (this.PromiseState == 'pending') {
    //保存回调函数，在改变状态后再进行回调
    //因为不确定状态为成功或者失败，所以不能执行
    this.callbacks.push({
      //这里采用键值对的形式，键和值相等可省略
      onResolved: onResolved,
      onRejected: onRejected
    });
  }
}