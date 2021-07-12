### let、const、var
（1）块级作用域：块作用域由 { }包括，let和const具有块级作用域，var不存在块级作用域。块级作用域解决了ES5中的两个问题：
- 内层变量可能覆盖外层变量
- 用来计数的循环变量泄露为全局变量

（2）变量提升：var存在变量提升，let和const不存在变量提升，即在变量只能在声明之后使用，否在会报错。
（3）给全局添加属性：浏览器的全局对象是window，Node的全局对象是global。var声明的变量为全局变量，并且会将该变量添加为全局对象的属性，但是let和const不会。
（4）重复声明：var声明变量时，可以重复声明变量，后声明的同名变量会覆盖之前声明的遍历。const和let不允许重复声明变量。
（5）暂时性死区：在使用let、const命令声明变量之前，该变量都是不可用的。这在语法上，称为暂时性死区。使用var声明的变量不存在暂时性死区。
（6）初始值设置：在变量声明时，var 和 let 可以不用设置初始值。而const声明变量必须设置初始值。
（7）指针指向：let和const都是ES6新增的用于创建变量的语法。 let创建的变量是可以更改指针指向（可以重新赋值）。但const声明的变量是不允许改变指针的指向。

![](image/2021-07-09-15-37-56.png)

>红宝书的说法是let和const理论上也存在变量提升（应该是执行上下文创建变量对象VO时也会初始化他们）但是因为存在暂时性死区就不能提前调用，判断了。

---
- 函数提升优先于变量提升，函数提升会把整个函数挪到作用域顶部，变量提升只会把声明挪到作用域顶部
- var 存在提升，我们能在声明之前使用。let、const 因为暂时性死区的原因，不能在声明前使用
- var 在全局作用域下声明变量会导致变量挂载在 window 上，**其他两者不会**
- let 和 const 作用基本一致，但是后者声明的变量不能再次赋值

#### const对象的属性可以修改吗
const保证的并不是变量的值不能改动，而是**变量指向的那个内存地址不能改动**。对于基本类型的数据（数值、字符串、布尔值），其值就保存在变量指向的那个内存地址，因此等同于常量。

但对于引用类型的数据（主要是对象和数组）来说，变量指向数据的内存地址，保存的只是一个指针，**const只能保证这个指针是固定不变的**，至于它指向的数据结构是不是可变的，就完全不能控制了。

### 箭头函数
#### 箭头函数与普通函数的区别
##### 1. 箭头函数比普通函数更加简洁
>如果函数体不需要返回值，且只有一句话，可以给这个语句前面加一个void关键字。最常见的就是调用一个函数：
>```js
>let fn = () => void doesNotReturn();
>```

##### 2. 箭头函数没有自己的this
箭头函数不会创建自己的this， 所以它没有自己的this，它只会在自己作用域的**上一层继承this**。所以箭头函数中this的指向**在它在定义时已经确定了，之后不会改变**。

```js
var id = 'GLOBAL';
var obj = {
  id: 'OBJ',
  a: function(){
    console.log(this.id);
  },
  b: () => {
    console.log(this.id);
  }
};
obj.a();    // 'OBJ'
obj.b();    // 'GLOBAL'
new obj.a()  // undefined
new obj.b()  // Uncaught TypeError: obj.b is not a constructor
```
对象obj的方法b是使用箭头函数定义的，这个函数中的this就永远指向它定义时所处的全局执行环境中的this，即便这个函数是作为对象obj的方法调用，this依旧指向Window对象。需要注意，**定义对象的大括号{}是无法形成一个单独的执行环境的**，它依旧是处于全局执行环境中。

##### 3. call()、apply()、bind()等方法不能改变箭头函数中this的指向
```js
var id = 'Global';
let fun1 = () => {
    console.log(this.id)
};
fun1();                     // 'Global'
fun1.call({id: 'Obj'});     // 'Global'
fun1.apply({id: 'Obj'});    // 'Global'
fun1.bind({id: 'Obj'})();   // 'Global'
```

##### 4. 箭头函数不能作为构造函数使用
构造函数在new的步骤，实际上第二步就是将函数中的this指向该对象。 但是由于箭头函数时没有自己的this的，且this指向外层的执行环境，且不能改变指向，所以不能当做构造函数使用。

###### 如果new一个箭头函数的会怎么样
箭头函数、没有prototype、没有自己的this指向、不可以使用arguments、自然不可以new。
![](image/2021-07-09-16-06-25.png)

new操作符的实现步骤如下：
1. 创建一个对象
2. 将构造函数的作用域赋给新对象（也就是将对象的__proto__属性指向构造函数的prototype属性）
3. 指向构造函数中的代码，构造函数中的this指向该对象（也就是为这个对象添加属性和方法）
4. 返回新的对象

所以，上面的第二、三步，箭头函数都是没有办法执行的。
会报错

##### 5. 箭头函数没有自己的arguments、没有prototype

##### 6. 箭头函数不能用作Generator函数，不能使用yeild关键字

### 扩展运算符
扩展运算符内部调用的是数据结构的 **Iterator 接口**，因此只要具有 Iterator 接口的对象，都可以使用扩展运算符，比如 Generator 返回的遍历器对象。
```js
const go = function*(){
  yield 1;
  yield 2;
  yield 3;
};

[...go()] // [1, 2, 3]
```

如果对没有 Iterator 接口的对象，使用扩展运算符，将会报错。

### Generator
是ES6里面的新数据类型，像一个函数，可以返回多次。特点就是函数有个*号。返回一个遍历器(Iterator)对象。

调用的话就是不断调用next() 返回当前的value 值 done的状态

return() 直接忽略所有yield ，返回最终的结果

可以随心所欲的交出和恢复函数的执行权。

### Proxy
Proxy **用于修改某些操作的默认行为**，等同于在语言层面做出修改，所以属于一种“元编程”（meta programming），即对编程语言进行编程。

Proxy 可以理解成，**在目标对象之前架设一层“拦截”**，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。Proxy 这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“代理器”。

e.g.
```js
let p = new Proxy(target, handler)
```
target 代表需要添加代理的对象，handler 用来自定义对象中的操作，比如可以用来自定义 set 或者 get 函数。

接下来我们通过 Proxy 来实现一个数据响应式
```js
let onWatch = (obj, setBind, getLogger) => {
  let handler = {
    set(target, property, value, receiver) {
      setBind(value, property)
      return Reflect.set(target, property, value)
    },
    get(target, property, receiver) {
      getLogger(target, property)
      return Reflect.get(target, property, receiver)
    }
  }
  return new Proxy(obj, handler)
}

let obj = { a: 1 }
let p = onWatch(
  obj,
  (v, property) => {
    console.log(`监听到属性${property}改变为${v}`)
  },
  (target, property) => {
    console.log(`'${property}' = ${target[property]}`)
  }
)
p.a = 2 // 监听到属性a改变
p.a // 'a' = 2
```
在上述代码中，我们通过自定义 set 和 get 函数的方式，在原本的逻辑中插入了我们的函数逻辑，实现了在对对象任何属性进行读写时发出通知。

####  Proxy 支持的拦截操作
一共 13 种。

>见 https://es6.ruanyifeng.com/?search=EPSILON&x=4&y=8#docs/proxy

### 模块
和commonJS的区别?

### 其他
>见 https://www.yuque.com/cuggz/interview/vgbphi#3fb2aa8bcb617ca0de8bfafd7da899e3
>https://es6.ruanyifeng.com/?search=EPSILON&x=4&y=8