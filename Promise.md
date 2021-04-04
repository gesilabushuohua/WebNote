

## Promise

表示异步操作的最终完成（或失败）及其结果值。

实现步骤：

- state 状态、value 成功返回值、reson 失败返回值、resolve：function 改变 state 状态 value 赋值、reject：function 改变 state 状态 reson 赋值
- then 实现，then(onFulfilled, onRejected)，state === 'fulfilled' onFulfilled(this.value)，state === 'rejected' onRejected(this.resaon)
- 解决异步实现， state === pending ， 使用成功、失败存放数组，resolve 中 forEach(fn=>fn()), then 中 state === 'peding' ， onResolvesCallbacks.push(()=>{ onFulfilled(this.value) })
- 链式调用，then 返回 promise，称为 promise2
- resolvePromise 解决不同 promise 代码相互套用
- onFulfilled | onRejected 返回普通值时 value => value
- onFulfilled | onRejected 必须异步调用，使用 setTimeout

### 使用

```javascript
const wait = () => {
  return new Promise((resolve, reject) => {
  	setTimeout(resolve, 200);
  }	
}

Promise().reaolve()
Promise().reject()    
```



### 实现

```javascript
class myPromise {
  constructor(exector) {

    // 标记状态
    this.state = 'pending';

    // Promise A+ 规范
    this.value = undefined;
    this.reason = undefined;

    // 成功、失败存放数组，解决异步问题
    this.onResolvesCallbacks = [];
    this.onRejectCallback = [];
    

    const resolve = val => {
      if(this.state === 'pengding') {
        this.state === 'fufilled';
        this.value = val;
        this.onResolvesCallbacks.forEach(fn => fn());
      }
    }

    const reject = reson => {
      if(this.state === 'pending') {
        this.state = 'reject';
        this.reson = reson;
        this.onRejectCallback.forEach(fn => fn());
      }
    }

    try {
      exector(resolve, reject);
    } catch(err) {
      reject(err);
    }
    
  }

  // onFulfiled function
  then(onFulfiled, onRejected) {
    // 如果不是函数，直接忽略 onFulfiled，直接返回 value
    onFulfiled = typeof onFulfiled === 'function' ? onFulfiled : value => value;
    // 如果不是函数，直接扔出错误 
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err};
    
    const fulfilledasync = setTimeout(() => {
      try {
        const x = onFulfiled(this.value);
        resolvePromise(promise2, x, resolve, reject);
      } catch(err) {
        reject(err);
      }
    }, 0);

    const rejectasync = setTimeout(() => {
      try {
        const x = onRejected(this.reson);
        resolvePromise(promise2, x, resolve, reject);
      } catch(err) {
        reject(err);
      }
    }, 0);


    // 声明返回的 promise 2
    const promise2 = new Promise((resolve, reject) => {
      if(this.state === 'fulfilled') {
        fulfilledasync();
      }
  
      if(this.state === 'rejected') {
        rejectasync();
      }
  
      // 当状态为 pending 时
      if(this.state === 'pending') {
        this.onResolvesCallbacks.push(()=> {
          fulfilledasync();
        });
  
        this.onRejectCallback.push(() => {
          rejectasync();
        });
      }
    });

    // 返回 promise 完成链式
    return promise2;
  } 
}

function resolvePromise(promise2, x, resolve, reject) {
  // 循环引用报错
  if(x === promise2) {
    return reject(new TypeError('chaining cycle detected for promise'));
  }

  // 防止多次调用
  let called;
  // x 不是 null 且 x 是对象或函数
  if(x!==null && (typeof x === 'object' || typeof x === 'function')) {
    try{
      let then = x.then;
      // 如果 then 是函数，默认是 promise
      if(typeof then === 'function') {
        then.call(x, y => {
          if(called) return;
          called = true;
          resolvePromise(promise2, y, resolve, reject);
        }, err => {
          if(called) return;
          called = true;
          reject(err);
        });
      } else {
        resolve(x);
      }
    } catch(e) {
      if(called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
}

// resolve 方法
myPromise.resolve = function(val) {
  return new myPromise((resolve,reject) => {
    resolve(val);
  });
};

// reject 方法
myPromise.reject = function(val) {
  return new myPromise((resolve,reject) => {
    reject(val);
  });
}

// race 
myPromise.race = function(promises) {
  return new Promise((resolve,reject) => {
    for(let i = 0; i< promises.length;i++) {
      promises[i].then(resolve, reject);
    }
  });
}

// all 获取所有 promise，都执行 then，然后吧结果放到数组，一起返回
myPromise.all = function(promises) {
  let arr = [];
  let i = 0;
  function processData(index, data, resolve) {
    arr[index] = data;
    i++;
    if(i === promises.length) {
      resolve(arr)
    }
  }
  return new myPromise((resolve, reject) => {
    for(let i = 0; i < promises.length; i++) {
      promises[i].then(data => {
        processData(i, data, resolve);
      }, reject);
    }
  });
}

```



## 参考：

https://promisesaplus.com/

https://juejin.cn/post/6844903625769091079