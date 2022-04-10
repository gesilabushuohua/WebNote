# Vue

vue 源码，项目 package.json 查看项目入口
对着 生命周期图 对比更有效
## 使用

```javascript
import Vue from 'vue';

new Vue({
  render: h => h(component),
  // router
}).$mount('#app');
```



## Vue 实例

![](.\images\vue实例.png)



## initData

```javascript
function initData {
  let data = vm.$options.data
  // 组件复用，不为函数，实例保持同一个对象的引用，导致数据污染
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)   // data.call(vm, vm)
    : data || {}
  
  // 数据响应式处理
  observe(data, true /* asRootData */)  
}
```



## initComputed

![](.\images\vue-computed.png)

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
        // this.get-> pushTarget(computed-watcher) 当前 Dep.target 指向 computed-watcher
        // -> this.getter.call(vm, vm) 即 this.xxx 触发 data.get data-dep 收集到 computed-watcher, computed-watcher 收集 data-dep
        // popTarget() 当前 Dep.target 指向 render-watcher
        
        // this.dirty = false  
        // data set, data dep 中 watcher update 时 this.dirty = true 重新计算 
      }
       
      if (Dep.target) {
        // computer dep 收集到 render-watcher
        // render-watcher 不收重复 dep  
        watcher.depend()
      }
      return watcher.value  
   } 
} 
```



## computed 、watch 对比

- computed 具有缓存，默认只有 getter
- watch 可以定义函数

## mount 模板解析
对照 Vue 生命周期
1. has el option ？ (no， el 非 dom 节点， document.createElement('div'))
2. has template ？
3. yes template to render function
4. no complier el getoutHtml to template, to 3
5. create vm.$el replace el with it

### template to render funtion
 <template><div v-for="index in 8">{{index}}</div></template> 转换成 html 过程

```javascript
    // parseHTML->stack 解析字符串->ASTElement 对象
    const ast = parse(template.trim(), options);
    // 标记 type === 3， text，node.static = true 标记 text 
    optimize(ast, options);
    /** render 字符串
    `_c('validate',{props:{
            field:${JSON.stringify(el.validate.field)},
            groups:${JSON.stringify(el.validate.groups)},
            validators:${JSON.stringify(el.validators)},
            result:${JSON.stringify(result)},
            child:${code}}
          })`
    */
    const code = generate(ast, options);
    // render: `with(this){return ${code}}`,
    const render = code.render;
    // options.render = new Function(code) 返回为 html string
    options.render = createFunction(compiled.render, fnGenErrors)

    // render function to vm.$el 的过程
```

## KeepAlive

```javascript
// 挂载组件 KeepAlive
extend(Vue.options.components, builtInComponents)

const slot = this.$slots.default
const vnode: VNode = getFirstComponentChild(slot)

if (cache[key]) {
  vnode.componentInstance = cache[key].componentInstance
  // make current key freshest
   remove(keys, key)
   keys.push(key)
} else {
   cache[key] = vnode
   eys.push(key)
   // prune oldest entry
   if (this.max && keys.length > parseInt(this.max)) {
      pruneCacheEntry(cache, keys[0], keys, this._vnode)
    }
}
```



## path 中 Diff

vue 中 **Vue.prototype.patch** 实现

diff 只会同层级进行，不会跨层级比较

![](.\images\diff.jpg)

```javascript
// 新旧节点对比
function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    // 
    let oldStartIdx = 0
    let newStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    let oldStartVnode = oldCh[0]
    let oldEndVnode = oldCh[oldEndIdx]
    let newEndIdx = newCh.length - 1
    let newStartVnode = newCh[0]
    let newEndVnode = newCh[newEndIdx]
    let oldKeyToIdx, idxInOld, vnodeToMove, refElm

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    const canMove = !removeOnly

    if (process.env.NODE_ENV !== 'production') {
      checkDuplicateKeys(newCh)
    }

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx]
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
        oldEndVnode = oldCh[--oldEndIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        //排序  
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
        oldStartVnode = oldCh[++oldStartIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        // 排序   
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
        oldEndVnode = oldCh[--oldEndIdx]
        newStartVnode = newCh[++newStartIdx]
      } else {
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
        } else {
          // 具有相同节点  
          vnodeToMove = oldCh[idxInOld]
          if (sameVnode(vnodeToMove, newStartVnode)) {
            // 对比移动节点  
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
            oldCh[idxInOld] = undefined
            // 插入节点
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
          }
        }
        newStartVnode = newCh[++newStartIdx]
      }
    }

    
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(oldCh, oldStartIdx, oldEndIdx)
    }
  }
```

设置 key 和不设置 key 的区别

- 不设置 key，新旧节点头尾两端相互比较
- 设置 key，除了头尾两端比较外，还会使用 key 生成的对象  createKeyToOldIdx 中查找匹配的阶段，设置 key 可以高效利用 dom

```javascript
function createKeyToOldIdx (children, beginIdx, endIdx) {
  let i, key
  const map = {}
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key
    if (isDef(key)) map[key] = i
  }
  return map
}
```



## $nextTick

```javascript
export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    timerFunc()
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}

// 事件循环，宏任务、微任务，栗子 for(let i) { setTimeout(()=>{ console.log(i) }, 0) }
 timerFunc = () => {
    p.then(flushCallbacks)
    if (isIOS) setTimeout(noop)
  }
 timerFunc = () => {
    setImmediate(flushCallbacks)
 }
 timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
 
 function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}
 
```



## 技巧

### 枚举

```javascript
/*
{
  1: "ELEMENT"
  4: "STATEFUL_COMPONENT"
  8: "TEXT_CHILDREN"
  16: "ARRAY_CHILDREN"
  32: "SLOTS_CHILDREN"
  ARRAY_CHILDREN: 16
  ELEMENT: 1
  SLOTS_CHILDREN: 32
  STATEFUL_COMPONENT: 4
  TEXT_CHILDREN: 8
}
*/
var ShapeFlags;
(function (ShapeFlags) {
    ShapeFlags[ShapeFlags["ELEMENT"] = 1] = "ELEMENT";
    ShapeFlags[ShapeFlags["STATEFUL_COMPONENT"] = 4] = "STATEFUL_COMPONENT";
    ShapeFlags[ShapeFlags["TEXT_CHILDREN"] = 8] = "TEXT_CHILDREN";
    ShapeFlags[ShapeFlags["ARRAY_CHILDREN"] = 16] = "ARRAY_CHILDREN";
    ShapeFlags[ShapeFlags["SLOTS_CHILDREN"] = 32] = "SLOTS_CHILDREN";
})(ShapeFlags || (ShapeFlags = {}));
```



