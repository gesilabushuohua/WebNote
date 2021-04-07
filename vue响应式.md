## Vue 响应式流程图

![](.\images\vue响应式.png)

## 数据处理

```javascript
//  数组、数据类型处理
if (Array.isArray(value)) {
   // 重写数组 push pop shift unshift splice sort reverse 
   if (hasProto) {
      protoAugment(value, arrayMethods)
   } else {
     copyAugment(value, arrayMethods, arrayKeys)
   }
      this.observeArray(value)
} else {
   this.observe(value)
}

// 数组重写
const result = original.apply(this, args)
 // notify change
 ob.dep.notify()

// 判断是否为对象
function isObject (obj: mixed): boolean %checks {
  return obj !== null && typeof obj === 'object'
}

// 遍历数据， 简化
function observe (value) {
  if(!isObject(value))  { return }
  const keys = value.keys(value)
  
  // 深度遍历
  for (let i = 0; i < keys.length; i++) {
    observe(value, keys[i])
    // 代理
    defineReactive(value, keys[i])  
  }
}
```

### 数组重写

```javascript
// 源码
function observe(value) {
  ob = new Observer(value)  
}

// 数组处理
class Observer {
  constructor (value) {
    if (Array.isArray(value)) {
      // 给数组对象设置新的原型对象，屏蔽原生数组变异方法  
      if (hasProto) {
        protoAugment(value, arrayMethods)
      } else {
        copyAugment(value, arrayMethods, arrayKeys)
      }
      this.observeArray(value)
    }  
  }  
}

const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

function protoAugment (target, src: Object) {
  target.__proto__ = src
}

function copyAugment (target: Object, src: Object, keys: Array<string>) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]


methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    // 数组更新  
    // notify change
    ob.dep.notify()
    return result
  })
})
```



## Object.defineProperty 代理

```javascript
class Vue {
  // Vue 构造类
  constructor(options) {
    this._data = options.data;
    observer(this._data);

    // 新建一个Watcher观察者对象，这时候Dep.target会指向这个Watcher对象
    // 源代码中, ./instance/index.js->stateMixin->Vue.prototype.$watch->new Watcher
    new Watcher();

    // 触发test属性的get函数
    console.log(this._data.test);
  }
}

function observer(value) {
  if(!value || (typeof value !== 'object')) {
    return;
  }

  Object.keys(value).forEach(key => {
    defineReactive(value, key, value[key]);
  });
}
```



```javascript
// 基于 Object.defineProperty 实现
function defineReactive(obj, key, val) {
  const dep = new Dep();

  Object.defineProperty(obj, key, {
    enumerable: true, // 属性可枚举
    configurable: true, // 属性可被修改或删除
    get: function reactiveGetter() {
      // 依赖收集， object.key 触发
      // 将当前的 watcher 对象存入 dep subs 中
      // Dep.target 全局唯一
      dep.addSub(Dep.target);
      return val;
    },
    set: function reactiveSetter(newVal) {
      if(newVal === val) return;
      val = newVal; 
      // 通知 watcher 对象更新视图
      dep.notify();
    }
  });
}
```

```javascript
// 订阅者 Dep, 存放 Watcher 观察者对象
class Dep {
  constructor() {
    // 存放 watcher 对象数组
    this.wats = [];
  }

  // subs 添加 Watcher 对象
  addSub(wat) {
    this.wats.push(wat);
  }

  // 通知所有 Watcher 对象更新视图
  notify() {
    this.wats.forEach(wat => {
      wat.update();
    })
  }
}


// 观察者 Watcher
class Watcher {
  constructor() {
    // 在创建 Watcher 时将该对象复制给 Dep.target 在 get 中会用到
    Dep.target = this;
  }

  // 更新视图
  update() {

  }
}

Dep.target = null;
```



### 缺点

#### 无法检测对象属性的新增或删除

this.productData = Object.assign({}, this.productData, res) 

更新 data[key] 的属性，引起数据更新

#### 无法监听数组

- Object.defineProperty  可以检测数组变动；
- 出于 vue 对性能的取舍；
- 栗子，arr[5] = xxx, 可能是新增属性；
- 栗子，arr[1000] 有效值也许仅有几个，另外遍历属性添加监听，消耗大；

## proxy 代理

```javascript
// es6 proxy 实现
// proxy 不需要深度遍历监听，性能高于 Object.defineProperty
// 可监听数组对象变化
function defineReactive(target) {
  const dep = new Dep();
  return new Proxy(target, {
    set(target, key, value, receiver) {
      trigger();  
    },
    get(target, key, receiver) {
      // target[key]
      return Reflect.get(target, key receive);  
    }  
  });
}

```



## 参考：

[Vue为什么不能检测数组变动]: https://segmentfault.com/a/1190000015783546

