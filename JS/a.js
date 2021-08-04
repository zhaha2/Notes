// function test(a, b) {
//   console.log(b);
//   return {
//     test: function(c) {
//       return test(c, a)
//     }
//   }
// }

// var retA = test(0);
// retA.test(2);
// retA.test(4);
// retA.test(8);
// console.log('------');
// var retB = test(0).test(2).test(4).test(8);
// console.log('------');
// var retC = test('good').test('bad');
// retC.test('good');
// retC.test('bad');

function deepClone(obj) {
  // 如果是 值类型 或 null，则直接return
  if(typeof obj !== 'object' || obj === null) {
      return obj
  }
  
  // 定义结果对象 如果对象是数组，则定义结果数组
  let copy = Array.isArray(obj) ? [] : {};
  
  // 遍历对象的key
  for(let key in obj) {
      // 如果key是对象的自有属性
      if(obj.hasOwnProperty(key)) {
          // 递归调用深拷贝方法
          copy[key] = deepClone(obj[key])
          // typeof copy[key] === "object" ? deepCopy(copy[key]) : copy[key];
      }
  }
  
  return copy
} 

a = {
  a: 'a',
  b(){
    console.log(this.a);
    console.log(a);
  }
}

Promise.resolve().then(()=>{
  console.log(0);
  return Promise.resolve(4)
}).then((res)=>{
  console.log(res);
})

Promise.resolve().then(()=>{
  console.log(1);
}).then(()=>{
  console.log(2);
}).then(()=>{
  console.log(3);
}).then(()=>{
  console.log(5);
}).then(()=>{
  console.log(6);
})