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
Promise.prototype.then = function(onResolved, onRejected) {
  const self = this;
 return new Promise((resolve, reject) => {
     //封装callback函数,这里的type是传递进来的onResolves或者onREjected
   function callback(type) {
      try {
      //获取回调函数的执行结果
      let result = type(self.PromiseResult);
      //判断
      if (result instanceof Promise) {
        result.then(v => {
          resolve(v);
        }, r => {
          reject(r);
        })
      } else {
        resolve(result)
      }
    }catch(e){
      reject(e);//e是失败的结果
   }
  }
    
  //在此调用回调函数，执行前需要先判断状态，根据状态执行相对应的回调函数
  //这里的this指向的就是实例对象
   if (this.PromiseState == 'fulfilled') {
    //形参传递的是实例对象成功状态的结果值，在PromiseState中保存
    //直接调用封装好的函数
     callback(onResolved);
    // try{//获取回调函数的执行结果
    // let result = onResolved(this.PromiseResult);
    // //判断是否为promise实例对象
    // if (result instanceof Promise) {
    //   //如果是promise，那一定可以调用then方法
    //   result.then((value) => {
    //     //如果promise是成功，走value
    //     //调用的还是resolve,这里的value是res的成功结果
    //     resolve(value);
    //   }, (reason) => {
    //      //如果promise是失败，走reason
    //     reject(reason);
    //   })
    // } else {
    //   //如果返回的不是promise对象，那么结果的对象为"成功"，这里return的结果就是result
    //   resolve(result);
    //   }
    // }catch(e){
    //   //一旦接收到抛出的错误结果，改变返回promise的状态为失败
    //   //并且设置失败的结果值
    //   reject(e);
    // }
  }
   if (this.PromiseState == 'rejected') {
     //直接调用封装好的函数
     callback(onRejected);
     
  //   try {
  //     //获取回调函数的执行结果
  //     let result = onRejected(this.PromiseResult);
  //     //判断
  //     if (result instanceof Promise) {
  //       result.then(v => {
  //         resolve(v);
  //       }, r => {
  //         reject(r);
  //       })
  //     } else {
  //       resolve(result)
  //     }
  //   }catch(e){
  //     reject(e);//e是失败的结果
  //  }
  }
  if (this.PromiseState == 'pending') {
    //保存回调函数，在改变状态后再进行回调
    //因为不确定状态为成功或者失败，所以不能执行
    this.callbacks.push({
      //这里采用键值对的形式，键和值相等可省略
      onResolved: function() {
        callback(onResolved);
        // try {
        //   //执行成功的回调函数
        // //成功结果就是当前实例对象当中的PromiseResult
        // let result = onResolved(self.PromiseResult);
        // //判断结果是否为Promise对象
        // if (result instanceof Promise) {
        //   //如果是，则根据成功失败执行对应的回调函数
        //   result.then((value) => { 
        //     //成功调用resolve，并且将参数传递
        //     resolve(value);
        //   }, (reason) => {
        //     //失败调用reject，并且将参数传递
        //     reject(reason);
        //   })
        // } else {
        //   //若不是Promise对象，则状态为成功html25行的res状态为成功
        //   resolve(result);
        // }
        // } catch (e) {
        //   reject(e);
        // }
      },
      onRejected: function() {
        callback(onRejected);
      //   try {
      //     //执行失败的回调函数
      //   //失败结果就是当前实例对象当中的PromiseResult
      //     let result = onRejected(self.PromiseState);
      //     if (result instanceof Promise) {
      //       result.then((value) => { 
      //         resolve(value);
      //       }, (reason) => {
      //         reject(reason);
      //       })
      //     } else {
      //       resolve(result);
      //     }
      //   } catch (e) {
      //     reject(e);
      //  }
      }
    });
    }
  })
}