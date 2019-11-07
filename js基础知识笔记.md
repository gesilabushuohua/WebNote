# 序、编译原理

###### 分词/词法分析

将代码分解成词法单元

var a = 2;  

分解为 var、a、=、2、;



###### 解析/语法分析

将词法单元数组转换成由元素逐级嵌套的语法结构树，抽象语法树（Abstract Syntax Tree, AST）



###### 代码生成

将AST转换为可执行代码的过程。

简单来说，将 var a = 2; 的AST转化成一组机器指令，来创建一个叫a的变量（包括分配内存等），并将一个值存储在a中。

# 一、作用域和闭包

###### 函数作用域

**作用域**是根据名称**查找变量**的一套规则。

作用域链，多个作用域嵌套，查找变量。

**匿名函数**，常用就是回调参数

```javascript
setTimeout(function(){
 console.log('I wait 1 second');
},1000);
```

**具名函数**，给函数命名比较方便追踪代码

```javascript
setTimeout(function timeoutHandler(){
 console.log('I wait 1 second');
},1000);
```

**立即执行函数**表达式，IIFE

```javascript
var a = 2;
(function foo() {
	var a = 3;
	//变量按作用域链，逐层向上查找
    console.log(a);//3
})();
//同层，向上查找
console.log(a);//2

//第一个()将函数变成表达式
//第二个()执行这个函数

```

另一种改进方式，执行功能一致

```javascript
(function(){...}())
```

进阶用法，将它们当作函数调用并传递参数进去

```javascript
var a = 2;
(function IIFE( global ) {
	var a = 3;
	console.log( a ); // 3
	console.log( global.a ); // 2
})( window );
console.log( a ); // 2
```

倒置代码运行顺序，将需要运行的函数放在第二位，在IIFE执行之后当作参数传递进去。

```
var a = 2;
(function IIFE( def ) {
	def( window );
})(function def( global ) {
	var a = 3;
	console.log( a ); // 3
	console.log( global.a ); // 2
});
```



###### 作用域提升

使用 let 进行的声明不会在块作用域中提升。





###### 闭包





# 二、this和对象原型

###### this指向



###### 原型链



###### Object、Function 原型链

# 三、类型和语法

类型和语法

# 四、异步和性能

异步和性能

# 五、ES6

对象解析

设置默认值

