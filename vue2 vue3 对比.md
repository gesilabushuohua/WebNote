# vue2 vue3 变动

## 创建实例
```javascript
// vue 2
const app = new Vue({ 
  // 选项
});

// vue 3
const app = Vue.createApp({
  // 选项
});
```

## 动态参数
在指令参数重使用 Javascript 表达式，方法是用方括号括起来
```html
<a v-bind:[key]="url">...</a>
<!-- 缩写 -->
<a :[key]="url">...</a>

<a v-on:[event]="doSomething">...</a>
<!-- 缩写 -->
<a @[event]="doSomething">...</a>
```

## 异步加载 suspensible
suspensible 定义组件是否可挂起，默认 为 true

## 组合式 API
组合式 API，将同一个逻辑关注点相关代码收集在一起。

### setup
setup 选项在组件创建之前执行，一旦 props 被解析，就将作为组合式 API 的入口（注：在setup 中避免使用 this，因为组件实例未创建完成）。
setup 有两参数，setup(props, context)
setup 中 props 不能使用 ES6 解构，会消除 prop 的响应式。
context 可以使用 ES6 解构，可解析出 attrs\slots\emit\expose

#### expose 
expose 将组件的方法通过模板 ref 暴露给父组件

```javascript
import { h, ref } from 'vue';
export default {
  setup(props, { expose }) {
    const count = ref(0);
    const increment = () => ++count.value;

    expose({
      increment
    })

    return () => h('div', count.value);
  }
}
```
这个 increment 方法可以通过父组件的模板 ref 访问。

### ref 响应式变量
通过新的 ref 函数使任何响应式变量在任何地方起作用，即 ref 为值创建了个响应式引用。

```javascript
import { ref } from 'vue';

// 组件内
setup(props) {
  const counter = ref(0);
  counter.value = 1;
  console.log(counter.value);
}
```

## Teleport 
Teleport 提供了一种干净的方法，可以控制在 DOM 中哪个父节点下渲染 HTML，而不必求租于全局状态或将其拆分成两个组件。
可以解决抽离公共组件多层嵌套问题，顶部插入 dom z-index 等父级 css 影响。

```javascript
<template>
  <teleport to="body"><h1> parent dom is body <h1></teleport>
</template>
```

## reactive 和 ref
reactive  为 Javascript 对象创建响应式状态，可以使用 reactive 方法，相当于 Vue 2.x 中的 Vue.observable()

ref 创建独立响应式值，返回一个可变的响应式对象，该对象作为一个响应式的引用维护内部的值，只包含一个名为 value 的property

### reactive 
reactive 使用结构的 property 响应式都会丢失
```javascript
import { reactive, toRefs } from 'vue'

const book = reactive({
  author: 'Vue Team',
  year: '2020',
  title: 'Vue 3 Guide',
  description: 'You are reading this book right now ;)',
  price: 'free'
})

let { author, title } = toRefs(book)

title.value = 'Vue 3 Detailed Guide' // 我们需要使用 .value 作为标题，现在是 ref
console.log(book.title) // 'Vue 3 Detailed Guide'
```
注，setup props，解构都会失去响应式

## readonly
readonly 可以基于原始对象创建一个只读的 proxy 对象。

## 待更新 2020/04/06