# vue 之 computed

关键代码
```javascript
Dep.target = null
const targetStack = []

export function pushTarget (_target: Watcher) {
  if (Dep.target) targetStack.push(Dep.target)
  Dep.target = _target
}

export function popTarget () {
  Dep.target = targetStack.pop()
}

class Watcher {
  constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: Object
  ) {
    vm._watchers.push(this)
    this.get()
  }

  get () {
    pushTarget(this)
    popTarget()
  }

   evaluate () {
    this.value = this.get()
    this.dirty = false
  }
}
```


## computed 缓存 watched
```javascript
const watchers = vm._computedWatchers = Object.create(null)
// computed warcher 压入 targetStack
watchers[key] = new Watcher(
        vm,
        getter || noop, // cb 回调事件
        noop,
        { lazy: true }
      )
vm._watchers.push(this)
```

## watch 监听数据
// watcher warcher 压入 targetStack
```javascript
createWatcher(vm, key, handler);
vm.$watch(keyOrFn, handler, options)
watcher = new Watcher(vm, expOrFn, cb, options)
vm._watchers.push(this)
```

## data 之 get 依赖收集
```javascript
// 依赖收集之前，一个 data[key] 一个 dep
// watch 现在为 全局 watche，与 watcher 共享一个
const dep = new Dep()

// get Dep.target watchers 执行到哪
Dep.target && dep.depend() 

// dep.depend()
Dep.target && Dep.target.addDep(this)

// watcher addDep， watcher-> newDeps 记录 dep
this.newDeps.push(dep)
dep.addSub(this)

// dep addSub,  dep -> this.subs 收集 watcher
this.subs.push(sub)
```

## set update
```javascript
dep.notify()
subs[i].update()

// watcher 执行 call
queueWatcher(this)
```

## computed 依赖收集，data -> computed 更新

```javascript
function initComputed () {
  const watchers = vm._computedWatchers = Object.create(null)
  // 每个 computed 创建一个 watcher
  watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        { lazy: true }  // this.dirty = this.lazy = true
   )
  defineComputed()  
}

function  defineComputed () {
  const shouldCache = !isServerRendering()  
  sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef)
    sharedPropertyDefinition.set = noop  
  
  // 拦截 get  this.xxx 触发
  Object.defineProperty(target, key, sharedPropertyDefinition)  
}

function createComputedGetter () {
   return function computedGetter () {
     const watcher = this._computedWatchers && this._computedWatchers[key]
     // true, 计算属性需要重新计算
     if (watcher.dirty) {
        watcher.evaluate()
        // this.get-> pushTarget(computed[key]-watcher) 当前 Dep.target 指向 computed[key]-watcher
        // -> this.getter.call(vm, vm) 即 this.xxx 触发 data.get data[key]-dep 收集到 computed[key]-watcher, computed[key]-watcher 收集 data[key]-dep，具体查阅，前文《data 之 get 依赖收集》
        // popTarget() 当前 Dep.target 指向 render-watcher
        
        // this.dirty = false  
        // data set, data dep 中 watcher update 时 this.dirty = true 重新计算 
      }
       
      if (Dep.target) {
        // computer[key]-dep 收集到 render-watcher
        // render-watcher 不收重复 dep  
        watcher.depend()
      }
      return watcher.value  
   } 
} 
```

TODO render-watcher 指的是什么 ？ 
TODO 为什么 computer[key]-dep 收集到 render-watcher

