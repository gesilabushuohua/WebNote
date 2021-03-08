# Vue

## 初始化

响应式

生命周期

vue-cli 中加载 vue 文件之  vue-loader



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



