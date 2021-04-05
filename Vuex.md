# Vuex

## 使用

```javascript
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})

// 将 store 放入 Vue 创建的 option 中
new Vue({
    el: '#app',
    store
})
```

Vuex Vue 的状态管理模式，核心在于理解其如何与 Vue 本身结合，如何利用 Vue 的响应式机制来实现核心的 Store 的响应式

## 数据流图

![](.\images\Vuex.jpg)



## 原理

### install

```javascript
Vue.mixin({ beforeCreate: vuexInit });

// Vuex init hook, injected into each instances init hooks list.
 function vuexInit () {
    const options = this.$options
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      // 在 new 的时候挂载
      this.$store = options.parent.$store
    }
  }
```

使用 Vue.use 的方法来安装插件，内部使用插件提供的 install 方法

```javascript
// @param plugin Function | Object
Vue.use = function (plugin) {
  const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
  if(installedPlugins.indexOf(plugin) > -1) {
    return this;
  }
    
  const args = toArray(argument, 1);
  args.unshift(this);
  if(typeof plugin.install === 'function') {
    plugin.install.apply(plugin, args);
  } else if(typeof plugin === 'function') {
    plugin.apply(null,args);          
  }  
  installedPlugins.push(plugin);
  return this;  
}
```

使用时，将 store 传入到 Vue 实例中，然后可在任意一个 vm 中通过 this.$store 来访问 Store 的实例



### 响应式

```javascript
class Store {
  constructor() {
    resetStoreVM(this, state) 
   }
    
   function resetStoreVM (store, state, hot) {
     // 对 state 进行响应式化  
     // 全局数据  
     store._vm = new Vue({
       data: {
         $$state: state
       },
       computed
      })   
   }
}

```

### commit 

```javascript
// 触发 mutation
commit (type, payload, _options) {
    const entry = this._mutations[type];
    entry.forEach(function commitIterator (handler) {
        handler(payload);
    });
}
```

### dispatch

```javascript
// 触发 action, 可以包含一步状态
dispatch (type, payload) {
  const entry = this._actions[type];

  const result entry.length > 1
    ? Promise.all(entry.map(handler => handler(payload)))
    : entry[0](payload);
}

return new Promise((resolve, reject) => {
      result.then(res => {
        try {
          this._actionSubscribers
            .filter(sub => sub.after)
            .forEach(sub => sub.after(action, this.state))
        } catch (e) {
          if (__DEV__) {
            console.warn(`[vuex] error in after action subscribers: `)
            console.error(e)
          }
        }
        resolve(res)
      }, error => {
        try {
          this._actionSubscribers
            .filter(sub => sub.error)
            .forEach(sub => sub.error(action, this.state, error))
        } catch (e) {
          if (__DEV__) {
            console.warn(`[vuex] error in error action subscribers: `)
            console.error(e)
          }
        }
        reject(error)
      })
    })
```

