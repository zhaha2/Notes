[前端面试常考的手写代码不是背出来的！](https://juejin.cn/post/6844904073351675912#heading-39)

[「中高级前端面试」手写代码合集](https://juejin.cn/post/6902060047388377095#heading-40)
https://juejin.cn/post/6844903911686406158#heading-13
https://juejin.cn/post/6875152247714480136#heading-35
https://www.yuque.com/cuggz/interview/pkg93q#8BKRR

稍后 [手写代码（二）](https://jinjingxuan.github.io/2020/03/20/%E9%9D%A2%E8%AF%95-%E6%89%8B%E5%86%99%E4%BB%A3%E7%A0%81%EF%BC%88%E4%BA%8C%EF%BC%89/)


### 实现搜索框

### 实现有并行限制的Promise调度器
https://juejin.cn/post/6854573217013563405
稍后 https://juejin.cn/post/6916317088521027598#heading-2

```js
class Scheduler {
  constructor() {
    this.queue = [];
    this.maxCount = 2;
    this.runCounts = 0;
  }
  add(promiseCreator) {
    this.queue.push(promiseCreator);
    this.request();
  }
  // 题目没要求用taskStart启动
  // taskStart() {
  //   for (let i = 0; i < this.maxCount; i++) {
  //     this.request();
  //   }
  // }
  // 每次从队列中取出Promise Generator并执行
  request() {
    if (!this.queue || !this.queue.length || this.runCounts >= this.maxCount) {
      return;
    }
    this.runCounts++;

    this.queue.shift()().then(() => {
      this.runCounts--;
      this.request();
    });
  }
}
   
const timeout = time => new Promise(resolve => {
  setTimeout(resolve, time);
})
  
const scheduler = new Scheduler();
  
const addTask = (time,order) => {
  scheduler.add(() => timeout(time).then(()=>console.log(order)))
}
  
  
addTask(1000, '1');
addTask(500, '2');
addTask(300, '3');
addTask(400, '4');
// scheduler.taskStart()
// 2
// 3
// 1
// 4
```

---
稍后
```js
class Scheduler {
    constructor() {
        this.needRunTasks = []
        this.runTasks = []
    }
    add(prmoiseFn) {
        return new Promise((resolve, reject) => {
            prmoiseFn.resolve = resolve; //保存Promise状态,现在不能执行
            if (this.runTasks.length < 2) {
                this.run(prmoiseFn)
            } else {
                this.needRunTasks.push(prmoiseFn)
            }
        })
    }
    run(prmoiseFn) {
        this.runTasks.push(prmoiseFn)
        prmoiseFn().then(() => {
            prmoiseFn.resolve()
            this.runTasks.splice(this.runTasks.indexOf(prmoiseFn), 1) //移除执行后的任务
            if (this.needRunTasks.length > 0) {
                this.run(this.needRunTasks.shift())
            }
        })
    }
}

const timeout = (time) => new Promise(resolve => setTimeout(resolve, time))
const scheduler = new Scheduler()
const addTask = (time, order) => scheduler.add(() => timeout(time)).then(() => console.log(order))

addTask(400, 4)
addTask(200, 2)
addTask(300, 3)
addTask(100, 1)
```

#### 并行请求，顺序输出
```js
var promises = function () {
  return [1000, 4000, 2000].map(current => {
    return new Promise(function (resolve, reject) {
      console.log(current+'Start')
      setTimeout(() => {
        console.log(current)
        resolve(current)
      }, current)
    })
  })
}

Promise.all(promises()).then((res) => {
  console.log('end')
  console.log(res);
})
```

Primise.all结果数组是按放进去的顺序而不是回调的顺序。

---
并行请求+串行输出
```js
const p1 = new Promise((resolve, reject) => {
  console.log('p1 Start');
  setTimeout(() => {
    console.log(1000);
    resolve(1000)
  }, 1000);
})
const p2 = new Promise((resolve, reject) => {
  console.log('p2 Start');
  setTimeout(() => {
    console.log(4000);
    resolve(4000)
  }, 4000);
})
const p3 = new Promise((resolve, reject) => {
  console.log('p3 Start');
  setTimeout(() => {
    console.log(2000);
    resolve(2000)
  }, 2000);
})

p1.then(res => {
  console.log('res'+res);
  // 重点
  return p2
}).then(res => {
  console.log('res'+res);
  return p3
}).then(res => {
  console.log('res'+res);
  console.log('end');
})
```
then方法返回的是一个新的Promise实例（注意，不是原来那个Promise实例）。因此可以采用链式写法，即then方法后面再调用另一个then方法。

采用链式的then，可以指定一组按照次序调用的回调函数。这时，前一个回调函数，有可能返回的还是一个Promise对象（即有异步操作），这时后一个回调函数，就会等待该Promise对象的状态发生变化，才会被调用。

### JS基础

#### 手写Promise
[BAT前端经典面试问题：史上最最最详细的手写Promise教程](https://juejin.cn/post/6844903625769091079#heading-9)

or [实现一个简版promise](http://interview.poetries.top/docs/handwritten.html#_7-%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E7%AE%80%E7%89%88promise)

#### Promise.all

一般来说，Promise.all 用来处理多个并发请求，也是为了页面数据构造的方便，将一个页面所用到的在不同接口的数据一起请求过来，不过，如果其中一个接口失败了，多个请求也就失败了，页面可能啥也出不来，这就看当前页面的耦合程度了

```js
Promise.all = function(promises) {
  return new Promise((resolve, reject) => {
    let result = [],
        index = 0,
        len = promises.length
    if(len === 0) {
      resolve(result)
      return;
    }
   
    for(let i=0; i<len; i++) {
      // 为什么不直接 promise[i].then, 考虑 promise[i] 可能不是一个 promise 对象
      Promise.resolve(promise[i]).then(data => {
        result[i] = data
        index++
        if(index === len) resolve(result)
      }).catch(err => {
        reject(err)
      })
    }
  })
}

---
// 我的版本
Promise.all = function(promises) {
    // 坑 别忘了返回的是new promise
    return new Promise((resolve, reject) => {
        const result = [], 
        len = promises.length;

        // promises为空直接返回
        if (!len) {
            resolve(result);
            return;
        }

        for(let p of promises){
          // 为什么不直接 promise[i].then, 考虑 promise[i] 可能不是一个 promise 对象
            Promise.resolve(p).then(data => {
                result.push(data);
                if(result.length === len) resolve(result);
            }).catch(err => {
                reject(err)
            })
        }
    }) 
}
```

#### Promise.race

Promise.race 只要有一个 promise 执行完，直接 resolve 并停止执行。

```js
Promise.race = function(promises) {
  return new Promise((resolve, reject) => {
    let len = promises.length
    if(len === 0) return;
    for(let i=0; i<len; i++) {
      // promises[i] 可能不是一个 promise 对象
      Promise.resolve(promises[i]).then(data => {
        resolve(data)
        // 别忘了直接return
        return;
      }).catch(err => {
        reject(err)
        return;
      })
    }
  })
}
```

简写
```js
Promise.race = function(promiseArr) {
  return new Promise((resolve, reject) => {
    promiseArr.forEach(p => {
      // 如果不是Promise实例需要转化为Promise实例
      Promise.resolve(p).then(
        val => resolve(val),
        err => reject(err),
      )
    })
  })
}
```

#### sleep
```js
function sleep(fn, time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(fn);
        }, time);
    }); 
}

// 测试用例
let index = 0;

function fn() {
    console.log('我要吃饭了', index++);
}

// 关键是await
async function play() {
    let a = await sleep(fn, 1000);
    a();
    let b = await sleep(fn, 2000);
    b()
    let c = await sleep(fn, 3000);
    c()
}

play();
```

#### 防抖

函数防抖是指在事件被触发 n 秒后再执行回调，如果在这 n 秒内事件又被触发，则重新计时。

eg. 像仿百度搜索，就应该用防抖，当我连续不断输入时，不会发送请求；当我一段时间内不输入了，才会发送一次请求；如果小于这段时间继续输入的话，时间会重新计算，也不会发送请求。

```js
// func是用户传入需要防抖的函数
// wait是等待时间
const debounce = (func, wait = 50) => {
  // 缓存一个定时器id
  let timer = null
  // 这里返回的函数是每次用户实际调用的防抖函数
  // 如果已经设定过定时器了就清空上一次的定时器
  // 开始一个新的定时器，延迟执行用户传入的方法
  return function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      // 别忘了this指向
      func.apply(this, args)
    }, wait)
  }
}

---
let debounceAjax = debounce(ajax, 500)

inputb.addEventListener('keyup', function (e) {
  debounceAjax(e.target.value)
})
```

应用参考 [7分钟理解JS的节流、防抖及使用场景](https://juejin.cn/post/6844903669389885453)

#### 节流

函数节流是指规定一个单位时间，在这个单位时间内，只能有一次触发事件的回调函数执行，如果在同一个单位时间内某事件被触发多次，只有一次能生效。节流可以使用在 scroll 函数的事件监听上，通过事件节流来降低事件调用的频率。

例:（连续不断动都需要调用时用，设一时间间隔），像dom的拖拽，如果用消抖的话，就会出现卡顿的感觉，因为只在停止的时候执行了一次，这个时候就应该用节流，在一定时间内多次执行，会流畅很多

节流常应用于鼠标不断点击触发、监听滚动事件。

```js
// func是用户传入需要防抖的函数
// wait是等待时间
const throttle = (func, wait = 50) => {
  // 上一次执行该函数的时间
  let lastTime = 0
  return function(...args) {
    // 当前时间
    // let now = +new Date()
    let now = new Date().getTime()
    // 将当前时间和上一次执行函数时间对比
    // 如果差值大于设置的等待时间就执行函数
    if (now - lastTime > wait) {
      lastTime = now
      func.apply(this, args)
    }
  }
}
```

**结合应用场景**

debounce

- search搜索联想，用户在不断输入值时，用防抖来节约请求资源。
- window触发resize的时候，不断的调整浏览器窗口大小会不断的触发这个事件，用防抖来让其只触发一次


throttle

- 鼠标不断点击触发，mousedown(单位时间内只触发一次)
- 监听滚动事件，比如是否滑到底部自动加载更多，用throttle来判断

#### 类型判断

```js
function getType(value) {
  // 判断数据是 null 的情况
  if (value === null) {
    return value + "";
  }
  // 判断数据是引用类型的情况
  if (typeof value === "object") {
    // 比如 [object Array]
    return Object.prototype.toString.call(obj)
              .replace('[object ', '').replace(']', '').toLowerCase()
  } else {
    // 判断数据是基本数据类型的情况和函数的情况
    return typeof value;
  }
}
```

#### instanceof 

```js
function myInstanceof(left, right) {
  let proto = Object.getPrototypeOf(left), // 获取对象的原型
      prototype = right.prototype; // 获取构造函数的 prototype 对象

  // 判断构造函数的 prototype 对象是否在对象的原型链上
  while (true) {
    if (!proto) return false;
    if (proto === prototype) return true;

    proto = Object.getPrototypeOf(proto);
  }
}
```

#### 柯里化

- 柯里化的定义：接收一部分参数，返回一个函数接收剩余参数，接收足够参数后，执行原函数。
- 好处：减少代码冗余，增加可读性，是一种简洁的实现函数委托的方式。

举个简单的 🌰：
```js
function multiFn(x, y, z) {
    return x * y * z
}
function curry() { ... } // 假设有一个 curry 函数可以做到柯里化
let multi = curry(multiFn)
multi(2, 3, 4)
multi(2)(3)(4)
multi(2, 3)(4)
multi(2)(3, 4)   // 以上结果都是 24，柯里化将参数拆开自由绑定，结果不变。
let seniorMulti = multi(2) // seniorMulti 可以多次使用
seniorMulti(3)(4) // 当我们觉得重复传递参数 2 总是冗余时，可以这样。
```

当柯里化函数接收到足够参数后，就会执行原函数，如何去确定何时达到足够的参数呢？

有两种思路：

- 通过函数的 length 属性，获取函数的形参个数，形参的个数就是所需的参数个数
- 在调用柯里化工具函数时，手动指定所需的参数个数
  
将这两点结合一下，实现一个简单 curry 函数

**通用版**
```js
function curry(fn, args = []) {
    var length = fn.length;
    // var args = args || [];
    return function(){
        newArgs = args.concat(Array.prototype.slice.call(arguments));
        if (newArgs.length < length) {
            return curry.call(this,fn,newArgs);
        }else{
            return fn.apply(this,newArgs);
        }
    }
}
```

我的版本
```js
function curry(fn, args = []) {
  const length = fn.length;

  return function (...newArgs) {
    const curArgs = [...args, ...newArgs]

    if (curArgs.length === length) {
      return fn.apply(this, curArgs)
    } else {
      // 递归返回科里化的函数，等待参数的传入
      return curry.call(this, fn, curArgs)
    }
  }
}   
```

**ES6写法**
```js
const curry = fn =>
    judge = (...args) =>
        args.length === fn.length
            ? fn(...args)
            : (arg2) => judge(...args, arg2)
```

#### Promise封装AJAX

```js
// promise 封装实现：
function getJSON(url) {
  // 创建一个 promise 对象
  let promise = new Promise(function(resolve, reject) {
    let xhr = new XMLHttpRequest();
    // 新建一个 http 请求
    // async: 布尔值，表示请求是否为异步，默认为true. 不写也行
    xhr.open("GET", url, true);
    // 设置状态的监听函数
    xhr.onreadystatechange = function() {
      // 记住这些属性的名称
      if (this.readyState !== 4) return;
      // 当请求成功或失败时，改变 promise 的状态
      if (this.status === 200) {
        resolve(this.response);
      } else {
        reject(new Error(this.statusText));
      }
    };
    // 设置错误监听函数
    xhr.onerror = function() {
      reject(new Error(this.statusText));
    };
    // 设置响应的数据类型
    xhr.responseType = "json";
    // 设置请求头信息
    xhr.setRequestHeader("Accept", "application/json");
    // 发送 http 请求
    xhr.send(null);
  });
  return promise;
}
```

#### 浅拷贝

多种方法看这里 [实现浅拷贝](https://www.yuque.com/cuggz/interview/pkg93q#TT8E3)


```js
const shallowClone = (target) => {
  if (typeof target === 'object' && target !== null) {
    // 根据 target 的类型判断是新建一个数组还是对象
    // 函数不需要单独处理（没有对象中的那些属性）
    const cloneTarget = Array.isArray(target) ? []: {}
    for (let prop in target) {
      if (target.hasOwnProperty(prop)) { // 是否是自身（非继承）属性
          cloneTarget[prop] = target[prop] // 只考虑一层对象
      }
    }
    return cloneTarget
  } else {
    return target // 基础类型直接返回
  }
}

// 或者你可以
console.log(Object.assign({}, obj))
console.log({...obj})

console.log(Object.assign(array, ...sources))
console.log(array.concat())
console.log(array.slice())
console.log([...array])
```

**注意**
浅拷贝，复制来的**基本数据类型**（第一层）还是真的复制了。改变原值，拷贝来的值不会改变。

```js
let obj1 = {a:1,b:{c:1}}
let obj2 = {...obj1};
obj1.a = 2;
console.log(obj1); //{a:2,b:{c:1}}
console.log(obj2); //{a:1,b:{c:1}}
obj1.b.c = 2;
console.log(obj1); //{a:2,b:{c:2}}
console.log(obj2); //{a:1,b:{c:2}}
```

#### 深拷贝

- 浅拷贝：浅拷贝指的是将一个对象的属性值复制到另一个对象，如果有的属性的值为引用类型的话，那么会将这个引用的地址复制给对象，因此两个对象会有同一个引用类型的引用。浅拷贝可以使用  Object.assign 和展开运算符来实现。
- 深拷贝：深拷贝相对浅拷贝而言，如果遇到属性值为引用类型的时候，它新建一个引用类型并将对应的值复制给它，因此对象获得的一个新的引用类型而不是一个原有类型的引用。深拷贝对于一些对象可以使用 JSON 的两个函数来实现，但是由于 JSON 的对象格式比 js 的对象格式更加严格，所以如果属性值里边出现函数或者 Symbol 类型的值时，会转换失败

1. JSON.stringify()
- JSON.parse(JSON.stringify(obj))是目前比较常用的深拷贝方法之一，它的原理就是利用JSON.stringify 将js对象序列化（JSON字符串），再使用JSON.parse来反序列化(还原)js对象。
- 这个方法可以简单粗暴的实现深拷贝，但是还存在问题，拷贝的对象中如果有**函数，undefined，symbol, RegExp对象**，当使用过JSON.stringify()进行处理之后，都会消失。
- 会**抛弃对象的constructor**,所有的构造函数会指向Object
- 对象有**循环引用**,会报错

1. 函数库lodash的_.cloneDeep方法
  ```js
  var _ = require('lodash');
  var obj1 = {
      a: 1,
      b: { f: { g: 1 } },
      c: [1, 2, 3]
  };
  var obj2 = _.cloneDeep(obj1);
  console.log(obj1.b.f === obj2.b.f);// false
  ```

3. 手写实现深拷贝函数
```js
function deepClone(obj) {
    // 如果是 值类型 或 null，则直接return
     // 注意 函数也是直接返回，因为他不可遍历(但是是浅拷贝)
    //  实际上函数不需要深拷贝，lodash也是直接返回的
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
            // 数组的键名可以用数字也可以用字符串，这里是字符串
            copy[key] = deepClone(obj[key])
            // typeof copy[key] === "object" ? deepCopy(copy[key]) : copy[key];
        }
    }
    
    return copy
} 
```

————————————————
版权声明：本文为CSDN博主「Tautus」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/Snoopyqiuer/article/details/101106303

---
针对循环引用的实现

```js
// 循环引用
var circle = {}
circle.circle = circle
//或者
var a = {}, b = {}
a.b = b
b.a = a
```

```js
/**
 * js深拷贝(包括 循环引用 的情况)
 * 
 * @param {*} originObj
 * @param {*} [map=new WeakMap()]  使用hash表记录所有的对象的引用关系，初始化为空
 * @returns
 */
function deepClone( originObj, map = new WeakMap() ) {
    //空或者非对象则返回本身
    // 注意 函数也是直接返回，因为他不可遍历
    if(!originObj || typeof originObj !== 'object') return originObj;  
 
    //如果这个对象已经被记录则直接返回
    if(map.has(originObj)) {
        return  map.get(originObj);
    }
    //这个对象还没有被记录，将其引用记录在map中，进行拷贝    
    let result = Array.isArray(originObj) ? [] : {};  //拷贝结果
    // 其实这种方式获取的数组的key也是字符串 而arr.'1'不能获取值会报错 要a['1']
    let keys = Object.keys(originObj); //originObj的全部key集合

    map.set(originObj, result); //记录引用关系, 在这个阶段就可以set了
    //拷贝
    for(let key of keys) {
        // 用[]，针对数组的情况
        result[key] = deepClone(originObj[key], map);
    }
    return result;
  }
```

>[解决循环引用和相同引用的js深拷贝实现(BFS)](https://segmentfault.com/a/1190000021682472)

---
深拷贝一个函数

```js
function cloneFunction(func) {
    const bodyReg = /(?<={)(.|\n)+(?=})/m;
    const paramReg = /(?<=\().+(?=\)\s+{)/;
    const funcString = func.toString();
    if (func.prototype) {
        console.log('普通函数');
        const param = paramReg.exec(funcString);
        const body = bodyReg.exec(funcString);
        if (body) {
            console.log('匹配到函数体：', body[0]);
            if (param) {
                const paramArr = param[0].split(',');
                console.log('匹配到参数：', paramArr);
                // 关键步，要把函数体放进去
                return new Function(...paramArr, body[0]);
            } else {
              // 关键步，要把函数体放进去
                return new Function(body[0]);
            }
        } else {
            return null;
        }
    } else {
        return eval(funcString);
    }
}
```

#### 静态属性
写一个函数 Foo 要求:
```js
var a = new Foo() // => {id: 1}
var b = new Foo() // => {id: 2}
```

1. 静态属性
```js
class Foo {
  static id = 1

  constructor() {
    this.id = Foo.id++
  }
}

// 或
// var Foo = function (){
//   this.id = Foo.prototype.id++
  
// }

// Foo.prototype.id= 1;

a = new Foo()
b = new Foo()
```

2. 闭包
```js
var Foo = (function (){
  var id = 0
  return function() {
    id++
    return {id}
  }
})()

// 或
// var Foo = (function (){
//   var id = 1
//   return function() {
//     this.id = id++
//   }
// })()


// Foo是一个闭包
// 也可以用 new，因为构造函数返回对象的话
// new 返回的就是return后面的对象
a = new Foo()
b = new Foo()
```

#### 隐式转换
```js
//实现一个 Cash 类，期望执行下面代码：

const cash1 = new Cash(105);

const cash2 = new Cash(66);

const cash3 = cash1.add(cash2);

const cash4 = Cash.add(cash1, cash2);

const cash5 = new Cash(cash1 + cash2);


console.log(`${cash3}`, `${cash4}`, `${cash5}`);

// 希望输出结果为：

// 1元7角1分，1元7角1分 ，1元7角1分
```
这题主要考察隐式转换，需要自己实现 toString 和 valueOf

注意：**模板字符串调用的是对象的toString方法**

```js
class Cash {
    constructor(num) {
        this.num = num
    }
    add(c1) {
         // 对象相加也是先调用valueOf 再toString
        return new Cash(this + c1)
    }
    static add(c1, c2) {
        return new Cash(c1 + c2)
    }
    // valueOf 用于处理 cash1 + cash2
    valueOf() {
        return this.num
    }
    // toString 用于处理 cash3 => `${cash3}`
    toString() {
        // const sum=`${this.num}`
        // const sum = String(this.num)
        const sum = this.num.toString()
        return `${sum.slice(0, sum.length-2)}元${sum[sum.length-2]}角${sum[sum.length-1]}分`
    }
}
```

#### (a == 1 && a == 2 && a == 3)

```js
if(a == 1 && a == 2 && a == 3){
    console.log('succeed')
}
```

1. valueOf隐式转换
```js
const a = (function() {
    let i = 1;
    return {
        valueOf: function() {
            return i++;
        }
    }
})();

console.log(a == 1 && a == 2 && a == 3); // true
```

2. 定义一个全局的属性,用defineProperty
```js
let i = 1;

// 坑 注意是defineProperty不是defineProperties
// 坑 ！！注意a 要用字符串形式 'a'
Object.defineProperty(this, 'a' , {
  get() {
    return i++;
  }
})

console.log(a == 1 && a == 2 && a == 3); // true
```


### 数组方法

#### map
```js
// context 可选 执行 callback 函数时值被用作this。 别忘了
Array.prototype.myMap = function(callback, context){
  // 转换类数组
  var arr = Array.prototype.slice.call(this),//由于是ES5所以就不用...展开符了
      mappedArr = [], 
      i = 0;

  for (; i < arr.length; i++ ){
    // 把当前值、索引、当前数组返回去。调用的时候传到函数参数中 [1,2,3,5].myMap((x)=>x*2)

    // [1,2,3,5].myMap((x,y)=>{
    // console.log(x);
    // console.log(y);
    // return x + y
    // }
    // 这里x就是arr[i]， y就是传入的i
    mappedArr.push(callback.call(context, arr[i], i, this));
  }
  return mappedArr;
}
```

#### reduce
```js
// reduce回调不支持传this
Array.prototype.myReduce = function(fn, initialValue) {
    // if (this === null || this === undefined) 
    // 	throw new TypeError(`Cannot read property 'reduce' of ${this}`)
    // // 处理回调类型异常
    // if (Object.prototype.toString.call(callbackFn) !== '[object Function]')
    // 	throw new TypeError(`${callbackFn} is not a function`)

  var arr = Array.prototype.slice.call(this);
  var res, startIndex;
  res = initialValue === undefined ? arr[0] : initialValue; // 不传默认取数组第一项
  startIndex = initialValue === undefined ? 1 : 0;
  for(var i = startIndex; i < arr.length; i++) {
    // 把初始值、当前值、索引、当前数组返回去。调用的时候传到函数参数中 [1,2,3,4].reduce((initVal,curr,index,arr))
    res = fn.call(null, res, arr[i], i, this); 
  }
  return res;
}
```

我的版本
```js
Array.prototype.myReduce = function(fn, initialValue) {
  // If...
  let arr = this;
  let res = initialValue === undefined ? arr[0] : initialValue,
      index = initialValue === undefined ? 1 : 0;

  for (; index < arr.length; index++) {
    res = fn.call(null,res,arr[index],index,arr)
  }

  return initialValue
}
```

#### filter
```js
Array.prototype.myFilter=function(callback, context=window){

  let len = this.length
      newArr = [],
      i=0

  for(; i < len; i++){
    if(callback.apply(context, [this[i], i , this])){
      newArr.push(this[i]);
    }
  }
  return newArr;
}
```

### 数组

#### 数组扁平化

https://juejin.cn/post/6844904025993773063#heading-12

##### flat()

直接调用 ES6 中的 flat 方法来实现数组扁平化。flat 方法的语法：`arr.flat([depth])`

其中 depth 是 flat 的参数，depth 是可以传递数组的展开深度（默认不填、数值是 1），即展开一层数组。如果层数不确定，参数可以传进 Infinity，代表不论多少层都要展开

```js
const res1 = arr.flat(Infinity);
```

##### JSON 方法
```js
let arr = [1, [2, [3, [4, 5]]], 6];
function flatten(arr) {
  let str = JSON.stringify(arr);
  str = str.replace(/(\[|\])/g, '');

  str = '[' + str + ']';
  return JSON.parse(str); 
  // 或者
  // str.split(',')
}
console.log(flatten(arr)); //  [1, 2, 3, 4，5]
```

##### split 和 toString 
可以通过 split 和 toString 两个方法来共同实现数组扁平化，由于数组会默认带一个 toString 的方法，所以可以把数组直接转换成逗号分隔的字符串，然后再用 split 方法把字符串重新转换为数组，如下面的代码所示：

```js
let arr = [1, [2, [3, 4]]];
function flatten(arr) {
    return arr.toString().split(',');
}
console.log(flatten(arr)); //  [1, 2, 3, 4，5]
```

不推荐使用 toString + split 方法，因为操作字符串是和危险的事情（数组全是数字就没什么问题）

##### 扩展运算符
```js
let arr = [1, [2, [3, 4]]];
function flatten(arr) {
    while (arr.some(item => Array.isArray(item))) {
      // 一层一层地展开
        arr = [].concat(...arr);
    }
    return arr;
}
console.log(flatten(arr)); //  [1, 2, 3, 4]
```

>- concat的参数可以是数组或是一堆参数
>- some() 方法测试数组中是不是至少有1个元素通过了被提供的函数测试。它返回的是一个Boolean类型的值。

##### reduce
```js
function flatten(arr) {
    return arr.reduce(function(prev, next){
         // 也是递归
        return prev.concat(Array.isArray(next) ? flatten(next) : next)
    }, [])
}
```

##### 递归
```js
function flatten(arr) {
  let result = [];

  for(let i = 0; i < arr.length; i++) {
    if(Array.isArray(arr[i])) {
      // 注意这里不是push
      result = result.concat(flatten(arr[i]));
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}
```

##### 指定深度

```js
  function flatten(arr, dep) {
    let result = [];

    for (const i of arr) {
      if (Array.isArray(i) && dep > 0) {
        result = result.concat(flatten(i, dep - 1))
      } else {
        result.push(i)
      }
    }

    return result;
  }

  const arr = [1, [2, 3, [4, 5, 6]], 7]
  console.log(flatten(arr, 1))     // [1, 2, 3, [4,5,6], 7]
```

reduce
```js
// reduce + 递归
function flat(arr, num = 1) {
  return num > 0
    ? arr.reduce(
        (pre, cur) =>
          pre.concat(Array.isArray(cur) ? flat(cur, num - 1) : cur),
        []
      )
    : arr.slice();
}
```

#### 数组去重

##### Set or Map
```js
function unique(arr) {
    return [...new Set(arr)];
    // or
    // Array.from(new Set(array)); 
}

// 或者可以这样，利用 Map
const unique5 = arr => {
  const map = new Map();
  const res = [];
  for (let i = 0; i < arr.length; i++) {
    if (!map.has(arr[i])) {
      map.set(arr[i], true)
      res.push(arr[i]);
    }
  }
  return res;
}
```

##### ES5手动实现Map
```js
const array = [1, 2, 3, 5, 1, 5, 9, 1, 2, 8];

uniqueArray(array); // [1, 2, 3, 5, 9, 8]

function uniqueArray(array) {
  let map = {};
  let res = [];
  for(var i = 0; i < array.length; i++) {
    if(!map.hasOwnProperty([array[i]])) {
      map[array[i]] = true;
      res.push(array[i]);
    }
  }
  return res;
}
```

##### 排序后去重
```js
function unique(arr) {
    let res = []
    let sortedArray = arr.concat().sort()
    let lastVal
    for (let i=0; i<sortedArray.length; i++) {
        // 如果是第一个元素或者相邻的元素不相同
        if (!i || lastVal !== sortedArray[i])
        	res.push(sortedArray[i])
        lastVal = sortedArray[i]
    }
    return res
}

// 【更好】或者可以这样，利用排序 + filter
function unique(arr) {
    return arr.concat().sort().filter(function(item, index, array){
        return !index || item !== arr[index - 1]
    })
}
```

##### Array.filter() 加 indexOf/includes
```js
function distinct(a, b) {
    let arr = a.concat(b);
    return arr.filter((item, index)=> {
        //return arr.indexOf(item) === index
        return arr.includes(item)
    })
}
```

#### 类数组转化为数组
类数组转换为数组的方法有这样几种：
- 通过 call 调用数组的 slice 方法来实现转换
`Array.prototype.slice.call(arrayLike);`

- 通过 call 调用数组的 splice 方法来实现转换
`Array.prototype.splice.call(arrayLike, 0);`

- 通过 apply 调用数组的 concat 方法来实现转换
`Array.prototype.concat.apply([], arrayLike);`

- 通过 Array.from 方法来实现转换
`Array.from(arrayLike);`

- 扩展运算符(注意它只能作用于 iterable 对象)
  `var args = [...arguments];`

#### 对象数组去重
```js
const responseList = [
  { id: 1, a: 1 },
  { id: 2, a: 2 },
  { id: 3, a: 3 },
  { id: 1, a: 4 },
];
const result = responseList.reduce((acc, cur) => {
    const ids = acc.map(item => item.id);
    return ids.includes(cur.id) ? acc : [...acc, cur];
}, []);
console.log(result); // -> [ { id: 1, a: 1}, {id: 2, a: 2}, {id: 3, a: 3} ]
```

我的版本
```js
function unique(arr) {
  const set = new Set();

  return arr.filter((item)=>{
    if (set.has(item.id)) return false;
    set.add(item.id);
    return true;
  })
}
```

#### 随机打乱数组

1. 简单版
```js
[12,4,16,3].sort(function() {
    return .5 - Math.random();
});
```

但是这个不够随机。原因在于：
>v8 在处理 sort 方法时，使用了插入排序和快排两种方案。当目标数组长度小于10时，使用插入排序；反之，使用快排。

其实不管用什么排序方法，大多数排序算法的时间复杂度介于 O(n) 到 O(n2) 之间，元素之间的比较次数通常情况下要远小于 n(n-1)/2，也就意味着有一些元素之间根本就没机会相比较（也就没有了随机交换的可能），这些 sort 随机排序的算法自然也不能真正随机。

通俗的说，其实我们使用 array.sort 进行乱序，理想的方案或者说纯乱序的方案是：数组中每两个元素都要进行比较，这个比较有 50% 的交换位置概率。如此一来，总共比较次数一定为 n(n-1)。而在 sort 排序算法中，大多数情况都不会满足这样的条件。因而当然不是完全随机的结果了。

2. Fisher–Yates shuffle 洗牌算法

```js
Array.prototype.shuffle = function() {
    const array = this;
    let len = array.length, i;
    while (len) {
      // len为剩余未交换数组长度，i为随机交换位置
      // 坑 这里因为用floor 所以第一次len为 result.length
     // 而不是 result.length-1
        i = Math.floor(Math.random() * len--);
        [array[len], array[i]] = [array[i], array[len]];
    }
    return array;
}
```

>[如何将一个 JavaScript 数组打乱顺序？](https://www.zhihu.com/question/68330851/answer/266506621)

### 应用

#### JSONP
利用`<script>`标签不受跨域限制的特点，缺点是只能支持 get 请求

- 创建script标签
- 设置script标签的src属性，以问号传递参数，设置好回调函数callback名称
- 插入到html文本中
- 调用回调函数，res参数就是获取的数据

---
JSONP 是服务器与客户端跨源通信的常用方法。最大特点就是简单易用，没有兼容性问题，老式浏览器全部支持，服务端改造非常小。

它的做法如下。

1. 第一步，网页添加一个`<script>`元素，向服务器请求一个脚本，这不受同源政策限制，可以跨域请求。

```html
<script src="http://api.foo.com?callback=bar"></script>
```

注意，请求的脚本网址有一个`callback`参数（`?callback=bar`），用来告诉服务器，客户端的回调函数名称（`bar`）。

2. 第二步，服务器收到请求后，拼接一个字符串，将 JSON 数据放在函数名里面，作为字符串返回（`bar({...})`）。

3. 第三步，客户端会将服务器返回的字符串，作为代码解析，因为浏览器认为，这是`<script>`标签请求的脚本内容。这时，客户端只要定义了`bar()`函数，就能在该函数体内，拿到服务器返回的 JSON 数据。

下面看一个实例。首先，网页动态插入`<script>`元素，由它向跨域网址发出请求。

```javascript
function addScriptTag(src) {
  var script = document.createElement('script');
  // 默认 不设置也行
  script.setAttribute('type', 'text/javascript');
  script.src = src;
  document.body.appendChild(script);
}

window.onload = function () {
  addScriptTag('http://example.com/ip?callback=foo');
}

function foo(data) {
  console.log('Your public IP address is: ' + data.ip);
};
```

上面代码通过动态添加`<script>`元素，向服务器`example.com`发出请求。注意，该请求的查询字符串有一个`callback`参数，用来指定回调函数的名字，这对于 JSONP 是必需的。

服务器收到这个请求以后，会将数据放在回调函数的参数位置返回。

```javascript
foo({
  'ip': '8.8.8.8'
});
```

由于`<script>`元素请求的脚本，直接作为代码运行。这时，只要浏览器定义了`foo`函数，该函数就会立即调用。**作为参数的 JSON 数据被视为 JavaScript 对象**，而不是字符串，因此**避免了使用`JSON.parse`的步骤**。

---
```js
const jsonp = (opts = {}) => {
    // 通过一个callback参数所对应的函数名来把数据进行写入
    opts.url = `${opts.url}?callback=${opts.callback}`;
    // 在你需要传递其他参数(param)时，需要遍历后拼接到url上
    for (let key in opts.data) {
        if (opts.data.hasOwnProperty(key)) {
            opts.url += `&${key}=${opts.data[key]}`;
        }
    }
    // 主要是依靠script的src属性加载内容没有跨域情况
    const script = document.createElement('script');
    script.src = opts.url;
    // 在script脚本执行完毕后，再删除此脚本
    script.onload = () => {
        document.body.removeChild(script);
    }
    // 把创建好的script脚本添加到body中
    document.body.appendChild(script);
};

// 测试用例
jsonp({
    url: 'http://localhost:8888/cors',
    data: {
        wd: 'nba',
        from: 'home'
    },
    // 接收数据的函数
    callback: 'getData'
});

function getData(data) {
    // 通过jsonp拿到的真实数据
    console.log(data);
}
```

#### 图片懒加载
图片懒加载 实现的方式一般有三种：

- clientHeight、scrollTop 和 offsetTop
- getBoundingClientRect
- IntersectionObserver

>[js实现图片懒加载原理](https://blog.csdn.net/w1418899532/article/details/90515969?utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-4.control&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-4.control)

[见 如何判断元素是否到达可视区域](../css/03-css布局.md###6.如何判断元素是否到达可视区域 )

##### clientHeight、scrollTop 和 offsetTop
![](image/2021-07-14-15-52-39.png)

可以看到图片的 offsetTop 小于 紫色 的线（scrollHeight + clientHeight）就会显示在窗口中。

注意offsetTop是针对外层元素的，不一定是body元素

scrollTop是指某个**可滚动区块**（比如overflow:auto）向下滚动的距离，比如向下滚动了10个像素，那么这个元素的scrollTop属性值就是10，这个属性的值是可读写的，且不需要设置position
这里的scrollTop是html文档卷起的长度

当前可视区域的高度，在现代浏览器及 IE9 以上的浏览器中，可以使用window.innerHeight属性获取，在低版本的 IE 中使用document.documentElment.clientHeight 获取



可以给img标签统一自定义属性data-src='default.png'，当检测到图片出现在窗口之后再补充src属性，此时才会进行图片资源加载。

```js
let imgs = document.getElementsByTagName("img"), count = 0
// 首次加载
lazyLoad()
// 通过监听 scroll 事件来判断图片是否到达视口，别忘了防抖节流
window.addEventListener('scroll', throttle(lazyLoad, 160))
function lazyLoad() {
    let viewHeight = window.innerHeight || document.documentElement.clientHeight //视口高度
    //滚动条卷去的高度
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    for(let i=count; i<imgs.length; i++) {
    	// 元素现在已经出现在视口中
    	if(imgs[i].offsetTop < scrollTop + viewHeight) {
      	    if(imgs[i].getAttribute("src") !== "default.jpg") continue;
      	    imgs[i].src = imgs[i].getAttribute("data-src")
            // 或者
            // img.src = img.dataset.src;
      	    count ++
    	}
    }
}
```

#####  getBoundingClientRect
dom 元素的 getBoundingClientRect().top 属性可以直接判断图片是否出现在了当前视口。
>getClientRects() 返回的值是相对于**视图窗口**的**左上角**来计算的。
>如果你需要获得相对于整个网页左上角定位的属性值，那么只要给top、left属性值加上当前的滚动位置（通过 window.scrollX 和 window.scrollY），这样就可以获取与当前的滚动位置无关的值。
>https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect

![](image/2021-08-28-22-06-35.png)

```js
// 只修改一下 lazyLoad 函数
function lazyLoad() {
    for(let i=count; i<imgs.length; i++) {
        if(imgs[i].getBoundingClientRect().top < document.documentElement.clientHeight) {
      	    if(imgs[i].getAttribute("src") !== "default.jpg") continue;
      	    imgs[i].src = imgs[i].getAttribute("data-src")
            count ++
    	}
    }
}
```

##### IntersectionObserver 
IntersectionObserver 浏览器内置的 API，实现了监听 window 的 scroll 事件、判断是否在视口中 以及 节流 三大功能。该 API 需要 polyfill。

```js
let imgs = document.getElementsByTagName("img")
const observer = new IntersectionObserver((entries) => {
    entries.forEach(item => {
        // isIntersecting是一个Boolean值，判断目标元素当前是否可见
        if (item.isIntersecting) {
            item.target.src = item.target.dataset.src;
            // 图片加载后即停止监听该元素
            observer.unobserve(item.target);
        }
    })
    }
})
Array.from(imgs).forEach(item => observer.observe(item)) // 调用
```
>[IntersectionObserver实现懒加载](https://hxy1997.xyz/2021/04/01/IntersectionObserver%E5%AE%9E%E7%8E%B0%E6%87%92%E5%8A%A0%E8%BD%BD/)
>http://www.ruanyifeng.com/blog/2016/11/intersectionobserver_api.html

#### 滚动加载

```js
window.addEventListener('scroll', function() {
  const clientHeight = document.documentElement.clientHeight;
  const scrollTop = document.documentElement.scrollTop;
  // Element.scrollHeight 这个只读属性是一个元素内容高度的度量，
  // 包括由于溢出导致的视图中不可见内容。 即文档总高度
  const scrollHeight = document.documentElement.scrollHeight;
  if (clientHeight + scrollTop >= scrollHeight) {
    // 检测到滚动至页面底部，进行后续操作
    // ...
  }
}, false);
```

#### 渲染几万条数据不卡住页面
渲染大数据时，合理使用createDocumentFragment和requestAnimationFrame，将操作切分为一小段一小段执行。

利用requestAnimationFrame在浏览器最小的重绘间隔（16.6ms）执行回调的特点，每帧重绘一次

```js
setTimeout(() => {
  // 插入十万条数据
  const total = 100000;
  // 一次插入的数据
  const once = 20;
  // 插入数据需要的次数
  const loopCount = Math.ceil(total / once);
  let countOfRender = 0;
  const ul = document.querySelector('ul');
  // 添加数据的方法
  function add() {
    const fragment = document.createDocumentFragment();
    for(let i = 0; i < once; i++) {
      const li = document.createElement('li');
      li.innerText = Math.floor(Math.random() * total);
      fragment.appendChild(li);
    }
    ul.appendChild(fragment);
    countOfRender += 1;
    loop();
  }
  function loop() {
    if(countOfRender < loopCount) {
      window.requestAnimationFrame(add);
    }
  }
  loop();
}, 0)
```

>https://chengnuo1.gitbooks.io/my-gitbook/content/interviewQuestions/requestAnimationFrame.html

#### rem的实现原理
```js
function setRem(){
    let doc=document.documentElement;
    let width=doc.getBoundingClientRect().width;
    let rem=width/10
    // 别忘了加px
    doc.style.fontsize=rem+'px';

    // or
    // document.documentElement.style.fontSize = document.documentElement.clientWidth / 10 + 'px';
}
addEventListener("resize",setRem);
```

#### 将VirtualDom转化为真实DOM结构

```js
// vnode结构：
// {
//   tag,
//   attrs,
//   children,
// }

//Virtual DOM => DOM
function render(vnode, container) {
  container.appendChild(_render(vnode));
}
function _render(vnode) {
  // 如果是数字类型转化为字符串
  if (typeof vnode === 'number') {
    vnode = String(vnode);
  }
  // 字符串类型直接就是文本节点
  if (typeof vnode === 'string') {
    return document.createTextNode(vnode);
  }
  // 普通DOM
  const dom = document.createElement(vnode.tag);
  if (vnode.attrs) {
    // 遍历属性
    Object.keys(vnode.attrs).forEach(key => {
      const value = vnode.attrs[key];
      dom.setAttribute(key, value);
    })
  }
  // 子数组进行递归操作
  vnode.children.forEach(child => render(child, dom));
  return dom;
}
```

#### 打印出当前网页使用了多少种HTML元素
```js
const fn = () => {
  return [...new Set([...document.querySelectorAll('*')]
          .map(el => el.tagName))].length;
}
```

#### 跨浏览器tab页通信

##### window.open + postMessage 

postMessage本身是不限制同源的
也可以用event.souce找到父窗口

```js
// 父页面
window.addEventListener('message', function(e) {
  console.log(e.data);
},false);

// target为新窗口打开 或者_blank也行
let child = window.open('/','target')
child.postMessage('Hello World!','*')

// 子页面
window.addEventListener('message', function(e) {
  console.log(e.data);
  console.log(e.origin);
  e.source.postMessage('Nice to see you', '*');
},false);

window.opener.postMessage('Nice to see you', '*');
```

##### LocalStorage（两个同源页面）
```js
// 页面1
window.addEventListener('storage', function (e) {
    console.log(e.newValue);
    console.log(e.key);
});

// 页面2
// 注意：localStorage要存JSON格式的数据
window.localStorage.setItem('key', JSON.stringify('value'));
```

##### Shared Worker

##### 非同源页面之间的通信
**iframe + postMessage**

**WebSocket**

#### 实现sticky

##### offsetTop

我们知道 offsetTop 是相对**定位父级**（类似于absolute定位？）的偏移量，倘若需要滚动吸顶的元素出现定位父级元素，那么 offsetTop 获取的就不是元素距离页面顶部的距离。

我们可以自己对 offsetTop 做以下处理：

```js
getOffset: function(obj,direction){
    let offsetL = 0;
    let offsetT = 0;
    while( obj!== window.document.body && obj !== null ){
        offsetL += obj.offsetLeft;
        offsetT += obj.offsetTop;
        obj = obj.offsetParent;
    }
    if(direction === 'left'){
        return offsetL;
    }else {
        return offsetT;
    }
}

// 使用
...
window.addEventListener('scroll', self.handleScrollTwo);
...
handleScrollTwo: function() {
    let self = this;
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    let offsetTop = self.getOffset(self.$refs.pride_tab_fixed);
    // let offsetTop = scroll.getBoundingClientRect().top;
    // 划到了顶部就吸顶
    // 被划上去了scrollTop就小于offsetTop了
    // 正好和懒加载相反
    self.titleFixed = scrollTop > offsetTop;
}
...
```

##### getBoundingClientRect

这个 API 可以告诉你页面中某个元素相对浏览器视窗上下左右的距离。

```js
handleScroll: function () {
  let offsetTop = this.$refs.pride_tab_fixed.getBoundingClientRect().top;
  this.titleFixed = offsetTop < 0;
  // some code
}

···
window.addEventListener('scroll', this.handleScroll);
```

>[【前端词典】5 种滚动吸顶实现方式的比较[性能升级版]](https://juejin.cn/post/6844903815041269774)

#### Promise串行输出

立即输出1，2s后输出2，3s后输出3

1. 循环

```js
const promise1 = ()=>Promise.resolve(1)
const promise2 = ()=> new Promise(resolve=>{
  setTimeout(() => {
    // 注意 回调再resolve
    resolve(2)
  }, 2000);
})
const promise3 = ()=> new Promise(resolve=>{
  setTimeout(() => {
    resolve(3)
  }, 3000);
})

const promiseList = [promise1,promise2,promise3]

---
function promiseChain(tasks) {
  // 执行器
  let promise = Promise.resolve()

  tasks.forEach(task => {
      promise = promise
                  .then(task)
                  .then(res => {
                    console.log(res);
                  })
    })
    return promise
}

---
promiseChain(promiseList) .then(() => console.log('finished'))
```

2. reduce

```js
function promiseChain2(tasks) {
  return tasks.reduce((pre, cur)=> {
    return pre.then(cur)
             .then(res => console.log(res))
  }, Promise.resolve())
}
```

3. Async/Await

```js
async function promiseChain3(tasks) {
  for (const task of tasks) {
    await task()
  }
}
```

#### 串行2
只能用这个log函数，来实现升序打印0到100
```js
const log=(callback)=>{
    log.count = log.count || 0;
    var count = log.count++
    setTimeout(()=>{
        console.log(count)
        callback && callback()
    },Math.random()*1000%10)
}
```

```js
async function a() {
  let p = Promise.resolve();

  for (let i = 1; i <= 100; i++) {
    p = p.then(()=>{
      return new Promise((res, rej)=>{
        // 注意 回调再resolve
        // 不然就直接执行了
        log(res);
      })
    })
  }
}

a()
```

或者await
```js
async function a() {
  for (let index = 0; index <= 100; index++) {
    await new Promise((res)=>{
      log(res)
    }) 
  }
}
a()
```

#### lazy man
用Promise写个Lazyman函数，返回的对象提供eat和sleep两个函数，支持链式调用

```js
var lazyman = new LazyMan('jack')
lazyman.sleep(2).eat('meat').sleep(1).eat('apple').sleepAtFirst(1).eat('food')

// 3s 后
// I'm Jack、eat meat
// 1s 后
// eat apple、eat food
```

自己的 
```js
function LazyMan(name) {
  this.promiseLazyMan = new Promise(resolve => {
    //因为需要在所有的then在同步代码中绑定好之后才能开始执行,
    // 所以放在setTimeOut里
    setTimeout(() => {
      this.atFirst = this.atFirst ? this.atFirst : 0;
      console.log(`I'm ${name}`);
      resolve()
    }, this.atFirst * 1000);
  })
}

LazyMan.prototype.eat = function(food) {
  this.promiseLazyMan = this.promiseLazyMan.then(() => {
    console.log(`eat ${food}`);
  })

  // 链式调用
  return this
}

LazyMan.prototype.sleep = function(time) {
  this.promiseLazyMan = this.promiseLazyMan.then(() => {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(`I slept ${time}`);
        resolve()
      }, time*1000);
    })
  })

  // 链式调用
  return this
}

// 这里不对
LazyMan.prototype.sleepAtFirst = function (time) { 
  this.atFirst = time;
  console.log('I sleep at first');
  return this;
}

var lazyman = new LazyMan('jack')
lazyman.sleep(2).eat('meat').sleep(3).eat('apple').sleepAtFirst(70).eat('food')
```

>稍后 https://wtaufpziv.github.io/2020/04/09/lazyman%E7%9A%84promise%E5%AE%9E%E7%8E%B0/

### 设计模式

> [「中高级前端面试」手写代码合集(二)](https://juejin.cn/post/6904079136299024398/#heading-1)
> [观察者模式/发布-订阅模式](https://www.yuque.com/cuggz/feplus/qu6lup#gLzlo)

#### 观察者模式
![](image/2021-07-14-21-29-20.png)

```js
// Subject
var Jack = {
    subscribers: {
        'any': []
    },
	//添加订阅
    subscribe: function (type = 'any', fn) {
        if (!this.subscribers[type]) {
            this.subscribers[type] = [];
        }
        this.subscribers[type].push(fn); //将订阅方法保存在数组里
    },
	//退订
    unsubscribe: function (type = 'any', fn) {
        this.subscribers[type] =
            this.subscribers[type].filter(function (item) { 
                return item !== fn;
            }); //将退订的方法从数组中移除
    },
	//发布订阅
    publish: function (type = 'any', ...args) {
        this.subscribers[type].forEach(function (item) { 
            item(...args);	//根据不同的类型调用相应的方法
        });
    }
};

// Observer
var Tom = {
    readNews: function (info) {
        console.log(info);
    }
};

//Tom订阅Jack的报纸
Jack.subscribe('娱乐', Tom.readNews);
Jack.subscribe('体育', Tom.readNews);

//Tom 退订娱乐新闻：
Jack.unsubscribe('娱乐', Tom.readNews);

//发布新报纸：
Jack.publish('娱乐', 'S.H.E演唱会惊喜登台')
Jack.publish('体育', '欧国联-意大利0-1客负葡萄牙');
```

#### 发布订阅模式(实现一个Event类)

>[「中高级前端面试」手写代码合集(二)](https://juejin.cn/post/6904079136299024398/#heading-3)
>[从一道面试题简单谈谈发布订阅和观察者模式](https://juejin.cn/post/6844904018964119566#heading-0)


```js
class EventEmitter {
    constructor() {
        // 维护事件及监听者
        this.listeners = {}
    }
    /**
     * 注册事件监听者
     * @param {String} type 事件类型
     * @param {Function} cb 回调函数
     */
    on(type, cb) {
        if (!this.listeners[type]) {
            this.listeners[type] = []
        }
        this.listeners[type].push(cb)
    }
    /**
     * 发布事件
     * @param {String} type 事件类型
     * @param  {...any} args 参数列表，把emit传递的参数赋给回调函数
     */
    emit(type, ...args) {
        if (this.listeners[type]) {
            this.listeners[type].forEach(cb => {
                cb(...args)
            })
        }
    }

     once(event,callback){ //为事件注册单次监听器
        // 包装后的回调函数
        let wrapFanc = (...args) => {
            callback.apply(this, args)
            this.off(event,wrapFanc)
        }
        this.on(event,wrapFanc)
        return this
    }

    // // 消息退订 可替换下面的off
    // unsubscribe(type, cb) {
    //     if (!this._subsMap[type] ||
    //         !this._subsMap[type].includes(cb)) return
    //     const idx = this._subsMap[type].indexOf(cb)
    //     this._subsMap[type].splice(idx, 1)
    // } 

    /**
     * 移除某个事件的一个监听者
     * @param {String} type 事件类型
     * @param {Function} cb 回调函数
     */
    off(type, cb) {
        if (this.listeners[type]) {
            const targetIndex = this.listeners[type].findIndex(item => item === cb)
            if (targetIndex !== -1) {
                this.listeners[type].splice(targetIndex, 1)
            }
            if (this.listeners[type].length === 0) {
                delete this.listeners[type]
            }
        }
    }
    /**
     * 移除某个事件的所有监听者
     * @param {String} type 事件类型
     */
    offAll(type) {
        if (this.listeners[type]) {
            delete this.listeners[type]
        }
    }
}
// 创建事件管理器实例
const ee = new EventEmitter()
// 注册一个chifan事件监听者
ee.on('chifan', function() { console.log('吃饭了，我们走！') })
// 发布事件chifan
ee.emit('chifan')
// 也可以emit传递参数
ee.on('chifan', function(address, food) { console.log(`吃饭了，我们去${address}吃${food}！`) })
ee.emit('chifan', '三食堂', '铁板饭') // 此时会打印两条信息，因为前面注册了两个chifan事件的监听者

// 测试移除事件监听
const toBeRemovedListener = function() { console.log('我是一个可以被移除的监听者') }
ee.on('testoff', toBeRemovedListener)
ee.emit('testoff')
ee.off('testoff', toBeRemovedListener)
ee.emit('testoff') // 此时事件监听已经被移除，不会再有console.log打印出来了

// 测试移除chifan的所有事件监听
ee.offAll('chifan')
console.log(ee) // 此时可以看到ee.listeners已经变成空对象了，再emit发送chifan事件也不会有反应了
```

### 算法

#### 斐波那契数列

```js
// 返回数列第n个数，
// 递归
function fn (n){
    if(n==0 || n == 1)
        return n;
    return fn(n-2)+fn(n-1)
}

// 尾递归
function fibonacci(n, n1, n2) {
    if(n <= 1) {
        return n2
    }
    return fibonacci(n - 1, n2, n1 + n2)
}

// 或者使用迭代（动态规划），时间复杂度为 O(n)，推荐！
function fibonacci(n) {
    let n1 = 1,
        n2 = 1,
        sum = 1
    for(let i = 3; i <= n; i += 1) {
        sum = n1 + n2
        // n1为上一个sum，n2为新的sum
        n1 = n2
        n2 = sum
    }
    return sum
}
```

#### 青蛙跳台阶

就是斐波那契

递归（会超时）
```js
/**
 * @param {number} n
 * @return {number}
 */
var numWays = function(n) {
    if (n === 0 || n === 1) {
        return 1
    }
    return numWays(n - 1) + numWays(n - 2)
};
```

迭代
```js
var numWays = function(n) {
    let a = 1, b = 1, sum = 1

    for (let i = 2; i <= n; i++ ) {
        sum = a + b
        a = b
        b = sum
    }

    return sum 
};
```

超出大小，精度不准,用BigInt
```js
var numWays = function(n) {
    let a = 1n, b = 1n, sum = 1n

    for (let i = 2; i <= n; i++ ) {
        sum = a + b
        a = b
        b = sum
    }

    return sum % 1000000007n
};
```

#### 大数相加
```js
function sumBigNumber(a, b) {
  let res = '';
  let temp = 0;
  
  a = a.split('');
  b = b.split('');
  
  while (a.length || b.length || temp) {
    // ~~相当于取整，等于Math.floor
    // 这里主要是转为数字
    // 注意这里用parseInt的话条件会比较苛刻，因为
    // 如果a.pop或b.pop其中一个为空时，parseInt就会输出NAN了，而~~输出0
    temp += ~~a.pop() + ~~b.pop();
    res = (temp % 10) + res;
    temp  = temp > 9
  }
  return res.replace(/^0+/, '');
}
```

>补充 ~~undefined 输出 0
> +undefined和parseInt（undefined）输出NAN

#### 排序
[十大经典排序算法总结（JavaScript描述）](https://juejin.cn/post/6844903444365443080)

![](image/2021-08-26-20-58-43.png)

v8 排序采用的算法跟数组的长度有关，当数组长度小于等于 10 时，采用插入排序，大于 10 的时候，采用快速排序。(实际上是快排和插入的结合，当快排递归得到的子序列较短时，用插入)。

##### 插入类

1. 直接插入

<1>.从第一个元素开始，该元素可以认为已经被排序；
<2>.取出下一个元素，在已经排序的元素序列中从后向前扫描；
<3>.如果该元素（已排序）大于新元素，将该元素移到下一位置；
<4>.重复步骤3，直到找到已排序的元素小于或者等于新元素的位置；
<5>.将新元素插入到该位置后；
<6>.重复步骤2~5。

```js
function insertionSort(array) {
  for (let i = 1; i < array.length; i++) {
    // 前面已经有序，比前面大则直接插在后面
    if (array[i - 1] <= array[i]) continue;

    const key = array[i];
    let j;
    // 注意判断条件
    for (j = i - 1; j >= 0 && array[j] >= key; j--) {
      // j元素后移
      // 坑 注意是移动 不是交换
      array[j+1] = array[j]
    }
    // 在当前位置插入key
    array[j + 1] = key;
  }
}
```
2. 希尔排序

缩小增量 优化的插排

##### 交换类
1. 冒泡排序

```js
function bubbleSort(array) {
  const len = array.length;
  for (let i = 0; i < len; i++) {
    let flag = false;

    for (let j = 0; j < len - i - 1; j++) {
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        flag = true;
      }
    }
    if (flag === false) return;
  }
}
```


2. 快速排序

```js
var sortArray = function(nums) {
  const sort = (nums, left = 0, right = nums.length - 1) => {
    // 坑 别忘了边界条件
    if (left >= right) return;

    const pivot = partition(nums, left, right);
    sort(nums, left, pivot - 1);
    sort(nums, pivot + 1, right);
  }

  // 将pivot(当前部分数组中第一个元素)左边都放比它小的，右边都是比它大的
  const partition = (nums, left, right) => {
    /* 
      通常的、没有经过充分考虑的选择是将第一个元素做为"基准“。
      如果输入是随机的，那么这是可以接受的，但是如果输入是预排序的或是反序的，
      那么这样的”基准“就是一个劣质的分割，因为所以的元素不是被划入S1就是被划入S2。
      实际上，如果第一个元素用作”基准“而且输入是预先排序的，那么快速排序花费的时间将是二次的，
      可是实际上却没干什么事，因此，使用第一个元素作为”基准“是绝对糟糕的。
    */
    // 随机选一个作为我们的主元 交换到最左
    const randIndex = Math.floor(Math.random() * (right - left + 1)) + left;
    [nums[left], nums[randIndex]] = [nums[randIndex], nums[left]];
    const pivot = nums[left];
    // // 坑 别写成array[0]了
    // const pivot = array[left];

    while (left < right) {
      // 找到右边第一个比pivot大的元素 交换到左边
      while (left < right && nums[right] >= pivot) right--;
      nums[left] = nums[right];

      while (left < right && nums[left] <= pivot) left++;
      nums[right] = nums[left];
    }

    // 坑 别忘了复原
    nums[left] = pivot;
    return left;
  }

  sort(nums);
  return nums;
};
const arr = [15, 10, 6, 34, 21, 66, 32]
quickSort(arr);
```

##### 选择类

1. 简单选择 

```js
function selectionSort(array) {
  for (let i = 0; i < array.length; i++) {
    let min = i;
    // 本次找出第i小的元素
    for (let j = i+1; j < array.length; j++) {
      if (array[j] <= array[min]) min = j;
    }
    [array[i], array[min]] = [array[min], array[i]];
  }
}
```

2. 堆排序

##### 归并排序

```js
function mergeSort(array, left = 0, right = array.length - 1) {
  if (left >= right) return;

  // 坑 别写错了
  const mid = Math.floor((left + right)/2)
  mergeSort(array, left, mid);  //递归对左子列排序
  mergeSort(array, mid + 1, right);  //递归对右子列排序
  merge(array, left, mid, right);   //左右数组合并
} 

// 合并数组
function merge (array, left, mid, right) {
  // 保存a的复制 不能直接改array的指向
  const temp = array.slice();
  // 坑 cur别写错了
  let i = left, j = mid+1, cur = left;

  for (; i <= mi  d && j <= right; cur++) {
    if (temp[i] <= temp[j]) {
      array[cur] = temp[i++];
    } else {
      array[cur] = temp[j++];
    }
  }

  // 把剩余部分连在后面 不能用concat 因为concat不改变原数组
  while (i <= mid) array[cur++] = temp[i++];
  while (j <= right) array[cur++] = temp[j++];
}
```

#### 二叉树遍历
https://www.jianshu.com/p/456af5480cee

#### 海量数据处理
https://blog.csdn.net/zyq522376829/article/details/47686867
https://blog.csdn.net/v_JULY_v/article/details/6279498

### 正则

[25+正则面试题详尽解析，让你轻松通过正则面试，让你少写2000行代码](https://juejin.cn/post/6999768570570178596#heading-66)
稍后 https://juejin.cn/post/6844903845227659271#heading-18


#### 驼峰

```js
var f = function(s) {
    return s.replace(/-\w/g, function(x) {
        // 这里匹配到的x是 -w这样的
        return x[1].toUpperCase();
    })
    // 或者 组匹配
     // return s.replace(/-(\w)/g, (match,key)=>key.toUpperCase())
}
```

#### 模板字符串

```js
function render(template, data) {
  const reg = /\$\{(\w+)\}/; // 模板字符串正则
  // /\${(\w+)}/ 大括号不加\也行
  if (reg.test(template)) { // 判断模板里是否有模板字符串

     // 查找当前模板里第一个模板字符串的字段
    // 注意第二个才是对应的（组匹配）字符串。["${aaa}", "aaa"]
    const name = reg.exec(template)[1]; 
    // 注意replace替换第一个匹配成功的值，加 g才替换所有
    // 注意 replace不改变原字符串!!
    // 将第一个模板字符串渲染
    template = template.replace(reg, data[name]); 
    return render(template, data); // 递归的渲染并返回渲染后的结构
  }
  return template; // 如果模板没有模板字符串直接返回
}
```

---
```js
function render(template, data) {
  const reg = /\$\{(\w+?)\}/g; // 模板字符串正则
  return template.replace(reg, (match, key) => data[key])
}
```

- 注意，replace传入函数的话，第一个参数为match即匹配到的字符串，这里就是 ${a}这种，后面的(key1,key2,...)为组匹配的内容（括号中的内容），比如这里就是 a.

- 如果希望replace不全部替换,用非贪婪（+?）。不过这里不加也对，因为后面的会替换前面的。

#### IPV4

```js
// 一位二位三位数分别处理（最大255）
var reg = /^((\d|[1-9]\d|1\d{2}|2([0-4]\d|5[0-5]))\.){3}((\d|[1-9]\d|1\d{2}|2([0-4]\d|5[0-5])))$/
```


#### 千位分隔符

```js
function parseToMoney(num) {
  num = parseFloat(num.toFixed(3));
  // 或者String(num).split('.');
  let [integer, decimal] = String.prototype.split.call(num, '.');
  // integer = integer.replace(/\d(?=(\d{3})+$)/g, '$&,');
  // '$&,'代表组匹配匹配到的字符串. 或者用函数:
  // 不加$结尾会贪婪模式，每次前进一个字符，只要后面有三个字符就匹配
  // 加上表示末尾跟着几个d组
  // 注意逗号写在后面
  integer = integer.replace(/\d(?=(\d{3})+$)/g, (match) => match + ',');
  return integer + (decimal ? '.' + decimal : '');
}
```

"a?b+$"：表示在字符串的末尾有零个或一个a跟着一个或几个b。

**注意：replace不改变原字符串！！**

#### 解析 URL
```js
function parseUrl(url) {
    // 非捕获组匹配
    // scheme://user:passwd@ 部分
    let schemeStr = '(?:([^/?#]+))?//(?:([^:]*)(?::?(.*))@)?',
    	// host:port path?query 部分
        urlStr = '(?:([^/?#:]*):?([0-9]+)?)?([^?#]*)(\\?(?:[^#]*))?',
    	// #fragment 部分
    	fragmentStr = '(#(?:.*))'
        
    let pattern = RegExp(`^${schemeStr}${urlStr}${fragmentStr}?`)
    let matched = url.match(pattern) || []
    return {
    	protocol: matched[1], // 协议
    	username: matched[2], // 用户名
    	password: matched[3], // 密码
    	hostname: matched[4], // 主机
    	port: matched[5],     // 端口
    	pathname: matched[6], // 路径
    	search: matched[7],   // 查询字符串 queryString
    	hash: matched[8],     // 锚点
    }
}

// 或者你可以这样
function parseUrl(url) {
    const urlObj = new URL(url)
    return {
    	protocol: urlObj.protocol,
        username: urlObj.username,
        password: urlObj.password,
        hostname: urlObj.hostname,
        port: urlObj.port,
        pathname: urlObj.pathname,
        search: urlObj.search,
        hash: urlObj.hash
    }
}
```

##### 单独解析查询字符串 queryString：
```js
function parseQueryString(query) {
    if (!query) return {}
    query = query.replace(/^\?/, '')
    const queryArr = query.split('&')
    const result = {}
    queryArr.forEach(query => {
    	let [key, value] = query.split('=')
        try {
            key = decodeURLComponent(key || '').replace(/\+/g, ' ')  // 解码
            value = decodeURLComponent(value || '').replace(/\+/g, ' ')
        } catch(e) {
            return console.log(e) // 非法字符不处理
        }
        const type = getQueryType(key)
        switch(type) {
            case 'ARRAY':
            	key = key.replace(/\[\]$/, '') // 对于形如 `list[]` 的解析成数组
                if (!result[key]) {
                    result[key] = [value]
                } else {
                    result[key].push(value)
                }
                break;
            case 'JSON':
            	key = key.replace(/\{\}$/, '') // 对于形如 obj{} 的解析为对象
                value = JSON.parse(value)
                result.json = value
                break;
            default:
                result[key] = value
        }
    })
    return result
}
function getQueryType (key) {
    if (key.endsWith('[]')) return 'ARRAY'
    if (key.endsWith('{}')) return 'JSON'
    return 'DEFAULT'
}

// 或者你可以这样，如果你做好了被面试官打si的准备...
// 简易版
function getUrlQuery(search) {
    let searchObj = {};
    for (let [key, value] of new URLSearchParams(search)) {
        searchObj[key] = value
    }
    return searchObj
}
```

---
```js
function parseParam(url) {
  const paramsStr = /.+\?(.+)$/.exec(url)[1]; // 将 ? 后面的字符串取出来
  const paramsArr = paramsStr.split('&'); // 将字符串以 & 分割后存到数组中
  let paramsObj = {};
  // 将 params 存到对象中
  paramsArr.forEach(param => {
    if (/=/.test(param)) { // 处理有 value 的参数
      let [key, val] = param.split('='); // 分割 key 和 value
      val = decodeURIComponent(val); // 解码
      val = /^\d+$/.test(val) ? parseFloat(val) : val; // 判断是否转为数字

      if (paramsObj.hasOwnProperty(key)) { // 如果对象有 key，则添加一个值
        paramsObj[key] = [].concat(paramsObj[key], val);
      } else { // 如果对象没有这个 key，创建 key 并设置值
        paramsObj[key] = val;
      }
    } else { // 处理没有 value 的参数
      paramsObj[param] = true;
    }
  })

  return paramsObj;
}
```

### CSS

#### flex 纵向对齐

如何使得divn靠右对齐而其他div靠左对齐
```
div.parent
  div1
  div2
  div3
  …
  divn
```

改变主轴方向,**flex只能设置`align-self`, 而`justify-self`是无效的**

```html
<style>
.container{
    display:flex;
    width:300px;
    height: 900px;
    background-color: bisque;

    flex-direction: column;
}
div div {
    border:blueviolet solid 2px;
    height: 100px;
    width: 200px;
}

div:last-child{
    align-self: flex-end;
}
</style>

<div class="container">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
</div>
```

**flex 横向 最后一个靠右**
```css
/* 最后一项加上 */
margin-left: auto;
```

#### 2

设置一个div阴影并且当鼠标移上去2s之后改变样式

```html
<style lang="less">
  .container{
      display:flex;
      width:300px;
      height: 300px;
      background-color: bisque;

      flex-direction: column;
  }
  .shadow {
      box-shadow: 2px 2px 5px;
  }
  </style>

<script>
  const div = document.querySelector('.container');
  div.addEventListener('mouseenter', () => {
      setTimeout(() => {
          // 这两种方法不行 因为Attribute是元素的直接属性
          // 相当于style的层级，而这里要改的是style的子属性
          // div.removeAttribute('background-color')
          // div.setAttribute('background-color', 'red')

          // 这两种也不行 是修改行内样式
          // div.setAttribute('style', '')
          // div.style.boxShaow = '0 0 0'

          // 修改类
          div.classList.remove('shadow');
      }, 500);
  })
</script>
```        

或者直接用js设置行内样式
```js
const div = document.querySelector('.container');
// js设置行内样式
div.setAttribute('style','box-shadow: 2px 2px 5px')
// 或者 注意'2px 2px 5px'前面不能有空格
// div.style.boxShadow = '2px 2px 5px';
div.addEventListener('mouseenter', () => {
    setTimeout(() => {
        div.removeAttribute('style')
        // 或者
      //  div.style.boxShadow = ''
    }, 500);
})
```