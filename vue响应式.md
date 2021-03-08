## Vue 响应式图

https://github.com/gesilabushuohua/WebNote/blob/master/images/vue%E5%93%8D%E5%BA%94%E5%BC%8F.png

## Vue 响应式实现

```javascript
// 响应式实现
// 基于 Object.defineProperty 实现

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


function defineReactive(obj, key, val) {
  const dep = new Dep();

  Object.defineProperty(obj, key, {
    enumerable: true, // 属性可枚举
    configurable: true, // 属性可被修改或删除
    get: function reactiveGetter() {
      // 依赖收集， object.key 触发
      // 将当前的 watcher 对象存入 dep subs 中
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

function observer(value) {
  if(!value || (typeof value !== 'object')) {
    return;
  }

  Object.keys(value).forEach(key => {
    defineReactive(value, key, value[key]);
  });
}

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
```

