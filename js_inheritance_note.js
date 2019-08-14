/**js 继承方式*/

// 父类
function father(name) {
  this.name = name;
  this.say = function() {
    console.log(`say${name}`);
  };
}
father.prototype.action = function() {
  console.log('action');
};

//  原型链继承
function childrenOne(name) {
  this.name = name;
}
childrenOne.prototype = new father();
let children1 = childrenOne('children1');

//  构造函数继承
function childrenTwo(name) {
  father.call(this, name);
  this.age = 8;
}
let children2 = new childrenTwo('children2');

/* class classType {
  constructor() {
    father.call(this, 'classType');
    this.age = 18;
  }
} */

//  组合继承，组合原型链继承和构造函数继承
function childrenThree(name) {
  father.call(this, name);
}
childrenThree.prototype = new father();
let children3 = new childrenThree('children3');

//  原型链继承
//  输出对象，承载继承的原型
function contain(obj) {
  function fn() {}
  fn.prototype = obj;
  return new fn();
}
let fa4 = new father();
let children4 = contain(fa4);

//  寄生式继承
//  输出对象，承载继承的原型
/* function contain(obj) {
  function fn() {}
  fn.prototype = obj;
  return new fn();
} */

//  原型链继承再套一层，传递参数
function subObject(obj, name) {
  let sub = contain(obj);
  sub.name = name;
}
let fa5 = new father();
let children5 = subObject(fa5, 'children5');

//  寄生组合式继承
//  组合 解决组合式两次调用构造函数属性的缺点
function sub(name) {
  father.call(this, name);
}

let fa6 = contain(father.prototype);
sub.prototype = fa6;
fa6.constructor = sub;
let children6 = new sub('children6');
