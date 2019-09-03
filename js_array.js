// js Array API ，及底层代码实现
/* 
vue 实现多选逻辑 对比

array 基本使用遍历过滤
1、初始化数组，根据卡口、设备遍历所有项，设置 checked = false
2、勾选 checked = true | false, 状态变化重新渲染,@change 遍历所有值，Array.flter 过滤勾选设备 id 数组，根据数据判断 卡口 选择、有选、全选, vue fliter
3、提交数据， 获取上步获取数据

array include indexof slice 配合使用
1、初始化数组，根据卡口、设备长度，设置 [[],[],[],[]] 比上述减少步骤
2、勾选 checked = true | false, true array.push(id), false index=array.indexOf  array.slice(index,1),checked = Array.includes(id),
状态变化重新渲染，根据数据 判断卡口 状态， vue fliter 
3、提交数据 ，根据
*/
