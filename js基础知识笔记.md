#  序、编译原理

##### 分词/词法分析

将代码分解成词法单元

var a = 2;  

分解为 var、a、=、2、;



##### 解析/语法分析

将词法单元数组转换成由元素逐级嵌套的语法结构树，抽象语法树（Abstract Syntax Tree, AST）



##### 代码生成

将 **AST** 转换为可执行代码的过程。

简单来说，将 var a = 2; 的 **AST** 转化成一组机器指令，来创建一个叫a的变量（包括分配内存等），并将一个值存储在a中。

# 一、作用域和闭包

##### 函数作用域

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

**立即执行函数**表达式，**IIFE**

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

倒置代码运行顺序，将需要运行的函数放在第二位，在 **IIFE** 执行之后当作参数传递进去。
```javascript
var a = 2;
(function IIFE( def ) {
	def( window );
})(function def( global ) {
	var a = 3;
	console.log( a ); // 3
	console.log( global.a ); // 2
});
```



##### 作用域提升

**变量声明**被提升。

编译阶段中的一部分工作就是找到所有的声明，并用合适的作用域将它们关联起来。

未编译前代码

```javascript
a = 2;
var a;
console.log( a );//2
```

```javascript
console.log( a );//undeifned
var a = 2;
```

经编译后按照如下形式进行执行

```javascript
var a;
a = 2;
console.log( a );//2
```

```javascript
var a;
console.log( a );// undefined
a = 2;
```

**函数声明**和**变量声明**都会被提升，但是**函数会被首先提升**，然后才是变量。

代码

```javascript
foo(); // 1
var foo;
function foo() {
	console.log( 1 );
} 
foo = function() {
	console.log( 2 );
};
```

代码会被引擎理解为如下形式：

```javascript
function foo() {
	console.log( 1 );
} 
foo(); // 1
foo = function() {
	console.log( 2 );
};
```

我们习惯将 var a =  2 ; 看作一个声明，而实际上javascript 并不这么认为，它将 var a 和 a = 2 当作两个单独的声明，第一个是编译阶段的任务，而第二个则是执行阶段的任务。这意味着无论作用域中的声明出现在什么地方，都将在代码本身被执行前首先进行处理。这个过程形象地想象成所有地声明都会被移动到各自作用域地最顶端，这个过程被称为提升。

使用 let 进行的声明不会在块作用域中提升。



##### 作用域闭包

闭包，即使函数是在当前词法**作用域之外**执行，**函数**可以**记住并访问所在词法地作用域**，开发中闭包主要用于**封装变量**，收敛权限。

```javascript
function foo() {
	var a = 2;
	function bar() {
		console.log( a );
	}
	return bar;
}
var baz = foo();
baz(); // 2 —— 朋友， 这就是闭包的效果。

baz = null; //释放对闭包的引用
```

```javascript
function fun(n,o) {
console.log(o) 
return { 
   fun:function(m){ 
     return fun(m,n); 
  } 
 }
} 
var a = fun(0); //undefined,执行第一次函数
a.fun(1);//0, 执行第二层，返回一个函数 fun  
a.fun(2);//0，执行第二次，返回一个函数 fun  
a.fun(3);//0,执行第二次，，返回一个函数 fun  
```

闭包，函数在创建、调用过程，发生了什么事？

闭包常见方式，在一个函数内部**创建**另一个函数；

调用过程中，函数执行后，函数内部**参数的变化**，及返回**结果**；

# 二、this和对象原型


当前内容，用于对象创建、关联和扩展。

##### 关键字this及其指向

**this的意义**，this 提供了一种更优雅的方式来隐式“传递”一个对象的引用（与显示传递上下文对象相较），因此可以将 API 设计得更加简洁并且易于复用。在对象和原型中，函数可以自动引用合适的上下问对象。

this指向函数本身这个说法是**有误**的；this和词法作用域查找混合使用时无法实现的。

this是在运行时进行绑定的，它的上下文取决于函数的调用时的各种条件。当一个函数被调用时，会创建一个活动记录。这个记录会包含函数在哪里被调用（调用栈）、函数调用方法、传入的参数等信息。this就是记录的其中一个属性，会在函数执行过程中用到。

**this 绑定规则**

默认绑定

隐式绑定

```javascript
function foo() {
	console.log( this.a );
}
var obj = {
	a: 2,
	foo: foo
};
obj.foo(); // 2
```

显示绑定，call()  appl() 

```javascript
function foo() {
	console.log( this.a );
}
var obj = {
	a:2
};
foo.call( obj ); // 2
```

new绑定

使用 new 来调用函数，或者说发生构造函数调用时，会自动执行下面的操作

- 创建（或者说构造） 一个全新的对象；
- 这个新对象会被执行 [[ 原型 ]] 连接；
- 这个新对象会绑定到函数调用的 this;
- 如果 函数没有返回其他对象，那么 new 表达式中的函数调用会自动返回这个新对象。

```javascript
function foo(a) {
	this.a = a;
}
var bar = new foo(2);
console.log( bar.a ); // 2
```

this 优先级

new 绑定(函数在new中调用)，函数通过call apply绑定，函数在某个上下文对象中调用，默认调用

ES6 箭头函数与this**，箭头函数 this 始终指向函数定义时的 this，而非执行时，根据外层作用域决定this



##### 对象

对象通过两种形式定义：声明（文字）形式和构造形式。

```javascript
//文字语法
var myObj = {
key: value
// ...
};
//构造形式
var myObj = new Object();
myObj.key = value;
```

存储在对象内部的值，我们称之属性，是这些属性得名称，它们就像指针（从技术角度来说就是引用）一样，指向这些值真正存储位置。

对象计算属性

```javascript
var prefix = "foo";
var myObject = {
[prefix + "bar"]:"hello",
[prefix + "baz"]: "world"
};
myObject["foobar"]; // hello
myObject["foobaz"]; // world
```



##### proto  和 prototype

__proto__ ， 每一个对象对应一个原型对象，并从原先对象继承属性和方法

对象 proto **属性**的值就是它所对应的**原型对象**

```javascript
var one = {x: 1};
var two = new Object();
one.__proto__ === Object.prototype // true
two.__proto__ === Object.prototype // true
one.toString === one.__proto__.toString // true
```



# 三、类型和语法

类型和语法



# 四、异步和性能

异步和性能



# 五、ES6

对象解析

设置默认值

