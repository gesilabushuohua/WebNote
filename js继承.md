/** js 继承方式
 *  参考来源 JavaScript 高级程序设计(第3版) 6.3 继承
 */

//  父类
function Father(name) {
  this.name = name;

  //  被所有子实例共享
  this.firuts = [];
}

Father.prototype.sayName = function() {
  console.log(`say ${this.name}`);
};

#   原型链继承

```javascript
function Son1(name) {
  this.name = name;
}

//  继承方法
Son1.prototype = new Father();
Son1.prototype.action = function() {
  console.log(`${this.name} action`);
};

/* 
let father = new Father('father');
let son1 =new Son1('son1');
console.log({father,son1});
father.sayName();
son1.sayName();

let son12 = new Son1('son12');
father.firuts.push('apple');
son1.firuts.push('orange');
son12.firuts.push('banana');

// 缺点，引用类型的(父类)原型属性会被所有实例共享
console.log(father.name, son1.name, son12.name);
console.log(father.firuts, son1.firuts, son12.firuts);  
*/

// 借用构造函数继承
function Son2(name) {
  //  继承属性
  Father.call(this, name);
}

/* 
let father = new Father('father');
let son2 =new Son2('son2');
console.log({father,son2});
//  缺点，没有办法复用函数
father.sayName();
son2.sayName(); 
*/
```

# 组合继承函数

```javascript
//组合继承函数（或伪经典继承），原型链和借用构造函数的组合
//  缺点，父类构造函数被调用两次
function Son3(name) {
  //  继承属性
  Father.call(this, name);
}

//  继承方法
Son3.prototype = new Father();

//  会改写引用属性
//  Son3.prototype = Father;

Son3.prototype.constructor = Son3;
Son3.prototype.sayName = function() {
  console.log(`say test 1  ${this.name}`);
};
Son3.prototype.action = function() {
  console.log(`${this.name} action`);
};

/* 
let father = new Father('father');
let son3 = new Son3('son3');
father.sayName();
son3.sayName(); 
*/

function Son32(name) {
  Father.call(this, name);
}

Son32.prototype = new Father();

//  会改写引用属性
//  Son3.prototype = Father;

Son32.prototype.constructor = Son32;
Son32.prototype.sayName = function() {
  console.log(`say test 2  ${this.name}`);
};

/* 
let son32 = new Son32('son32');
father.sayName();
son3.sayName();
son32.sayName();
son32.action();
son3.action();
console.log(father.name, son3.name, son32.name); 
*/
```

# 原型式继承

```javascript
//  原型式继承
function Son4(name) {
  this.name = name;
}

function myObject(obj) {
  function F() {}
  F.prototype = obj;
  return new F();
}

/* 
Son4.prototype = myObject(Father.prototype); 
*/

// es5 新增 Object.create 方法，行为与 myObject 相同
Son4.prototype = Object.create(Father.prototype);

/* 
let father = new Father('father');
let son4 = new Son4('son4');
father.sayName();
son4.sayName();  
*/

//  延伸，多对象共享相应值
//  摘自 JavaScript 高级程序设计(第3版) 6.3.4 原型式继承
/* 
let person = {
  name: "Nicholas",
  friends: ["Shelby", "Court", "Van"]
};

let anotherPerson = Object.create(person);
anotherPerson.name = "Greg";
anotherPerson.friends.push("Rob");

let yetAnotherPerson = Object.create(person);
yetAnotherPerson.name = "Linda";
yetAnotherPerson.friends.push("Barbie");

console.log(person.friends); //"Shelby,Court,Van,Rob,Barbie"
console.log({person,anotherPerson,yetAnotherPerson}); 
*/
```

# 寄生式继承

```javascript
//  寄生式继承，将原型式继承再次封装，在对象上扩展新方法（？，后期补充）
function Son5(name) {
  this.name = name;
}

Son5.prototype = Object.assign(Father.prototype);
Son5.prototype.action = function() {
  console.log(`${this.name} action`);
}

/* 
let son5 = new Son5('son5');
son5.action(); 
*/
```

#  寄生组合式继承

```javascript
//  寄生组合式继承
function Son6(name){
  Father.call(this,name);
  this.name = name;
}

Son6.prototype = Object.create(Father.prototype);
Son6.prototype.constructor = Son6;

/* 
//  基本模式
function inheritProto(subType, superType){
  //  Object.create 有兼容性限制
  //  创建原型副本
  let prototype = Object.create(superType.prototype); 
  //  弥补因重写原型失去的 constructor 属性
  prototype.constructor = subType;  
  //  将父辈赋值给 子类原先
  subType.prototype = prototype;  
} 
*/

let son6 = new Son6('son6');
son6.sayName();


let person = {
  name: "Nicholas",
  friends: ["Shelby", "Court", "Van"]
};

let anotherPerson = Object.create(person);
anotherPerson.name = "Greg";
anotherPerson.friends.push("Rob");

let yetAnotherPerson = Object.create(person);
yetAnotherPerson.name = "Linda";
yetAnotherPerson.friends.push("Barbie");

console.log(person.friends); //"Shelby,Court,Van,Rob,Barbie"
console.log({person,anotherPerson,yetAnotherPerson}); 
```

/*  扩展
1、js 原型链
 查阅 js_prototype

2、js call、apply、bind 的区别及其实现
 查阅 js_call_apply_bind
*/