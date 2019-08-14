/**js 继承方式*/

// 父类
function father(name) {
  this.name = name;
  this.say = function() {
    console.log('say');
  };
}
father.prototype.action = function() {
  console.log('action');
};

//  原型链继承
function children1() {
  this.name = 'children1';
}
children1.prototype = new father();

//  构造函数继承
function children2(name) {
  father.call(this, name);
  this.age = 8;
}

/* class classType {
  constructor() {
    father.call(this, 'classType');
    this.age = 18;
  }
} */

//  组合继承，组合原型链继承和构造函数继承
function children3(name) {
  father.call(this, name);
}
children3.prototype = new father();

//  原型链继承
(function() {
  //  输出对象，承载继承的原型
  function contain(obj) {
    function fn() {}
    fn.prototype = obj;
    return new fn();
  }
  let fa = new father();
  let children4 = contain(fa);
});

//  寄生式继承
(function() {
  //  输出对象，承载继承的原型
  function contain(obj) {
    function fn() {}
    fn.prototype = obj;
    return new fn();
  }
  //  原型链继承再套一层，传递参数
  function subObject(obj, name) {
    let sub = contain(obj);
    sub.name = name;
  }
  let fa = new father();
  let children4 = subObject(fa, 'children4');
});
