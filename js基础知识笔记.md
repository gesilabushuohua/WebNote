  本文主要为 《你不知道的Javascript的秘密》摘抄笔记，个人 js 基础大纲，非原创。

# 序、编译原理

### 分词/词法分析

将代码分解成词法单元

var a = 2;  

分解为 var、a、=、2、;



### 解析/语法分析

将词法单元数组转换成由元素逐级嵌套的语法结构树，抽象语法树（Abstract Syntax Tree, AST）



### 代码生成

将 **AST** 转换为可执行代码的过程。

简单来说，将 var a = 2; 的 **AST** 转化成一组机器指令，来创建一个叫a的变量（包括分配内存等），并将一个值存储在a中。

# 一、作用域和闭包

### 函数作用域

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



### 作用域提升

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

**var、let 、const 变量区别**，在于变量存储范围？？？？？



### 作用域闭包

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

# 二、this、对象、原型


this和原型，主要用于对象创建、关联和扩展。

### 关键字 this 

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



### 对象

#### 概念

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

  在对象的文字形式中声明一个函数表达式， 这个函数也不会“属于” 这个对象——
它们只是对于相同函数对象的多个引用。

```javascript
var myObject = {
foo: function() {
console.log( "foo" );
}
};
var someFoo = myObject.foo;
someFoo; // function foo(){..}
myObject.foo; // function foo(){..}
```



#### 对象拷贝

```javascript
function anotherFunction() { /*..*/ }
var anotherObject = {
	c: true
};
var anotherArray = [];
var myObject = {
	a: 2,
	b: anotherObject, // 引用，不是复本！
	c: anotherArray, // 另一个引用！
	d: anotherFunction
};
anotherArray.push( anotherObject, myObject );
```

浅拷贝，复制出的新对象的 a 会复制旧对象中 a 的引用值。

深拷贝，会复制 myObject、anotherObject、anotherArray，而 anotherArray 引用了前两对象，这样就会由于循环导致死循环。对于这类问题，有一种巧妙地复制方法 (这种方法需要保证对象是 JSON 安全的)：

```javascript
var newObj = JSON.parse( JSON.stringify( someObj ) );
```

浅拷贝只复制值，改变对象值不会影响另一个，深拷贝复制属性的引用，改变对象值会改变对象的值。

javascript 中函数无比如法（标准、可靠的方法）真正的复制，只要复制对共享函数对象的引入，如果修改了共享的函数对象，添加了一个属性，原有的对象都会受到影响。

疑点**：什么情况下，修改拷贝对象的值会改变另一对象的值？

**答案**：参考 [Js引用类型赋值](https://juejin.im/post/5becd0e9e51d4543cd17310c)

js 引用类型赋值，js 具有两种数据类型，值类型(基本类型)和引用类型。详情阅读类型和语法之类型



#### 属性

es5 前 Javascript 语言本身没有提供可以检测属性特征的方法，比如判断属性是否只读，es5 开始，所有的属性都具备了属性描述符。

对象所有属性都有名称，属性的特征，包括值、可列举、可配置、可写、get、set。

```javascript
var myObject = {
	a:2
};
Object.getOwnPropertyDescriptor( myObject, "a" );
// 打印
/*
{
 value: 2, //值
 writable: true,//可写，是否可写值
 enumerable: true,//可列举，在 for..in 中
 //可配置，是否可以使用 defineProperty 方法来修改属性描述符，修改为false，单向操作，无法撤销
 configurable: true
 }
 */

```

在创建普通属性时属性描述符会使用默认值，我们也可以使用 object.defineProperty(..)来添加一个新属性或者修改一个已有属性并对特性进行设置。

getter、setter部分改写默认操作，只能应用在单属性上，无法应用在整个对象上，getter是一个隐藏函数，会在获取属性值时调用，setter 也是一个隐藏函数，在设置属性值时调用。

setter，会覆盖单个属性默认[[ put ]]，也就是赋值操作，通常来说getter和setter 是成对出现的，只定义 一个的话通常会产生意料之外的行为。

```javascript
var myObject = {
	// 给 a 定义一个 getter
	get a() {
		return this._a_;
	},
	// 给 a 定义一个 setter
	set a(val) {
		this._a_ = val * 2;
	}
};
myObject.a = 2;
myObject.a; // 4
```



#### 不变性

设置属性或对象不变的方法

```javascript
var myObject = {};

// 1、设置属性 不可读，不可配置
Object.defineProperty( myObject, "FAVORITE_NUMBER", {
value: 42,
writable: false,
configurable: false
} );

//2、禁止扩展
Object.preventExtensions( myObject );

//3、密封
//Object.seal 创建一个“密封”的对象，这个方法实际上会在一个现有对象上调用
//Object.preventExtensions(..) 并把所有现有属性标记为 configurable:false 
Object.seal(myObject);

//4、冻结
Object.freeze(myObject);
```



#### Object  构造函数方法

```javascript
//通过复制一个或多个对象来创建一个新的对象
Object.assign();

//使用指定原型对象属性创建一个新对象
Object.create();

//给对象添加一个属性并指定该属性的配置
Object.definePropertie();

//给对象添加多个属性并分别指定它们的配置
Object.defineProperties();

//返回给定对象自身可枚举属性的 [key, value] 数组
Object.entries();

//冻结对象,其他代码不能删除或更改任何属性
Object.freeze();

//返回对象指定的属性配置
Object.getOwnPropertyDescriptor();

//返回一个数组,它包含了指定对象所有的可枚举或不可枚举的属性名
Object.getOwnPropertyNames();

//返回一个数组,它包含了指定对象自身所有的符号属性
Object.getOwnPropertySymbols();

//返回指定对象的原型对象
Object.getPrototypeOf();

//比较两个值是否相同,所有 NaN 值都相等（这与==和===不同）
Object.is();

//判断对象是否可扩展
Object.isExtensible();

//判断对象是否已经冻结
Object.isFrozen();

//判断对象是否已经密封
Object.isSealed();

//返回一个包含所有给定对象自身可枚举属性名称的数组
Object.keys();

//防止对象的任何扩展
Object.preventExtensions();

//防止其他代码删除对象的属性
Object.seal();

//设置对象的原型（即内部 [[Prototype]] 属性）
Object.setPrototypeOf();

//返回给定对象自身可枚举值的数组
Object.values();

```



### 混合对象“类”

本节主要介绍，实例化(instantiation)、继承(inheritance)、(相对)多态(polymorphism)、混入(mixin)。

javascript 开发者使用混入来模拟类的复制行为，分为显性和隐式。

显示混入，手动实现复制功能

```javascript
function mixin( sourceObj, targetObj ) {
	for (var key in sourceObj) {
	// 只会在不存在的情况下复制
		if (!(key in targetObj)) {
			targetObj[key] = sourceObj[key];
		}
	}
return targetObj;
}
```





### 原型  [ [  Prototype ] ]

javascript 中的对象有一个特殊的 [[ Prototype ]] 内置属性，其实就是对其他对象的引用。基本所有的对象在创建时 [[ Prototype]] 属性都会赋予一个非空的值。

对于默认的 [[ Get ]] 操作（访问对象属性）来说，如果无法在对象本身找到需要的属性，就会继续访问对象的 [[ Prototype ]] 链。

 所有普通的 prototype 链最终都会指向内置的 Object.prototype，所有普通的对象都源于（或者把 prototype 链的顶端设置为）这个Object.prototype 对象，所以它包含了 javascript 中许多通用的功能。

```javascript
myObject.foo = "bar";
```

如果 foo 即存在 myObject,也存在原型链上层，那就会发生屏蔽，myObject 中包含的 foo 属性会屏蔽原型链上层的所有foo 属性，因为 myObject.foo 总会选择原型链中最底层的 foo 属性。

这个限制只存在 = 赋值中，使用 Object.definePrototype 并不会受到影响。

```javascript
function Foo() {
}
var a = new Foo();
Object.getPrototypeOf( a ) === Foo.prototype; // true
```

上述代码中最后得到两个对象，它们之间互相关联，并没有初始化一个类，也没有复制任何行为行为到一个对象中，只是让这两个对象互相关联。

 继承意味着复制，javascript并不会复制对象属性。相反，javascript 会在两个对象之间创建一个关联，这样一个对象就可以委托访问另一个对象的属性和函数。委托这个术语更加准确的描述 javascript 中的对象关联机制。

```javascript
function Foo() {
}
Foo.prototype.constructor === Foo; // true
var a = new Foo();
a.constructor === Foo; // true
a; // {}
```

Foo 函数本身并不是构造函数，然而，当普通函数前加上 new 关键字之后，就会把这个函数调用变成一个构造函数调用。实际上， new 会劫持所有普通函数并用构造对象的形式来调用它。函数不是构造函数，但是当且仅当使用 new 时，函数调用会变成“构造函数调用”，换句话说，在Javascript 中对于构造函数最准确的解释是，所有带 new 的**函数调用**。

new 关键字会进行如下操作：

1. 创建一个空的简单Javascript 对象；
2. 链接该对象到另一个对象；
3. 将步骤1新创建的对象作为 this 的上下文；
4. 如果该函数没有返回函数，则返回 this；



ES6 之前通过设置 ._proto_属性来，修改对象 [[ Prototype ]] 关联。 

```javascript
// ES6 之前需要抛弃默认的 Bar.prototype
Bar.ptototype = Object.create( Foo.prototype );
// ES6 开始可以直接修改现有的 Bar.prototype
Object.setPrototypeOf( Bar.prototype, Foo.prototype );
```

Object.create() 会创 建一个对象，并把这个对象的 [[ Prototype ]] 关联到指定的对象。

[[prototype]] 机制就是指对象中的一个内部连接引用另一个对象。



### proto  和 prototype

假设有对象啊，如何寻找对象a 委托的对象(如果存在的话)呢?在传统的面向类环境中，检查一个实例(javascript中的对象)的集成祖先(javascript） 中的委托关联)通常被称为内省（或者反射）。

```javascript
//可以直接获取一个对象的[[prototype]]链
Object.getPrototypeOf(a);
```

绝大多数（非所有）浏览器也支持一种非标准的方法来访问内部[[prototype]]属性。

```javascript
a.__proto__ === Foo.prototype; // true
```

.__proto__ 属性神奇地引用内部 [[Prototype]] 对象，甚至可以通过 .__proto__._proto_...来遍历原型链，和 .constructor 一样，._proto_ 实际上并不存在你正在使用的对象中，和其他的常用函数一样，存在于内置的 Object.prototype中。此外，._proto_看起来像一个属性，但实际上更像一个 getter/setter，._proto_的实现大致是这样的：

```javascript
Object.defineProperty( Object.prototype, "__proto__", {
	get: function() {
		return Object.getPrototypeOf( this );
	},
	set: function(o) {
		// ES6 中的 setPrototypeOf(..)
		Object.setPrototypeOf( this, o );
		return o;
	}
} );
```

因此，访问 a._proto_时，实际上是调用了 a._proto_()，虽然 getter函数存在于 Object.prototype对象中，但是它的 this 指向对象a，所以和 Object.getPrototype(a)结果相同。._proto_ 是可设置属性，之前的代码中使用 es6 的 Object.setPrototype 进行设置。

出于各种原因，以继承结尾的术语，包括原型继承和其他面向对象的术语都无法帮助理解 Javascript 的真实机制，不仅仅限制思维模式。相比**委托**更合适，因为对象之间的关系不是复制而是委托。





# 三、类型和语法

js 类型

- Null
- Undefined
- Boolean
- Number
- String
- Object
- Symbal es6

除 Object 外，其他统称基本类型。

```javascript
typeof null === 'object';//true
```

null 比较特殊，typeof 对它处理有问题，正确的结果应是 null

### 数组

### 类型判断

# 四、异步和性能

异步和性能



# 五、ES6

对象解析

设置默认值

封装

Proxy 代理

  