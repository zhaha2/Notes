[vue开发看这篇文章就够了](https://segmentfault.com/a/1190000012692321)
https://www.yuque.com/cuggz/interview/hswu8g#8d6cd1d13b8d85c0090dd20084f39044
[30 道 Vue 面试题，内含详细讲解（涵盖入门到精通，自测 Vue 掌握程度）](https://github.com/fengshi123/blog/issues/14)
[Vue 面试知识点总结【持续更新中～】](https://segmentfault.com/a/1190000019633325)

>源码
>https://ustbhuangyi.github.io/vue-analysis/
>https://juejin.cn/post/6844903986978357256#heading-0
>http://zhouweicsu.github.io/blog/2017/03/07/vue-2-0-reactivity/

[vue生命周期探究（一）](https://segmentfault.com/a/1190000008879966)
![](image/2021-07-16-21-30-35.png)
![](image/2021-07-19-17-06-22.png)

稍后[基于Vue实现一个简易MVVM](https://juejin.cn/post/6844904099704471559#heading-14)

[剖析Vue原理&实现双向绑定MVVM](https://segmentfault.com/a/1190000006599500)
看 [0 到 1 掌握：Vue 核心之数据双向绑定](https://juejin.cn/post/6844903903822086151#heading-13)

[深入剖析：Vue核心之虚拟DOM](https://github.com/fengshi123/blog/blob/master/articles/%E6%B7%B1%E5%85%A5%E5%89%96%E6%9E%90%EF%BC%9AVue%E6%A0%B8%E5%BF%83%E4%B9%8B%E8%99%9A%E6%8B%9FDOM.md)

[Vue2.0 v-for 中 :key 到底有什么用？](https://www.zhihu.com/question/61064119)

---

[Vue3.0 新特性以及使用经验总结](https://juejin.cn/post/6940454764421316644#heading-15)


## 问题

### vue框架有什么特点

数据驱动、组件化

#### MVVM

MVVM是Model-View-ViewModel缩写，也就是把MVC中的Controller演变成ViewModel。Model层代表数据模型，View代表UI组件，ViewModel是View和Model层的桥梁，数据会绑定到viewModel层并自动将数据渲染到页面中，视图变化的时候会通知viewModel层更新数据。


### 双向绑定（响应式）

#### Vue的工作原理（响应式原理）

Vue响应式底层实现方法是 Object.defineProperty() 方法，该方法中存在一个getter和setter的可选项，可以对属性值的获取和设置造成影响

当你把一个普通的 JavaScript 对象传入 Vue 实例作为 data 选项，Vue 将遍历此对象所有的 property，并使用 Object.defineProperty 把这些 property 全部转为 getter/setter。

- 这些 getter/setter 对用户来说是不可见的，但是在内部它们让 Vue 能够追踪依赖，在 property 被访问和修改时通知变更。

- 每个组件实例都对应一个 watcher 实例，它会在组件渲染的过程中把“接触”过的数据 property 记录为依赖。之后当依赖项的 setter 触发时，会通知 watcher，从而使它关联的组件重新渲染。

>作者：Jieunsi
链接：https://www.nowcoder.com/discuss/670720?type=0&order=0&pos=13&page=1&ncTraceId=&channel=-1&source_id=discuss_tag_nctrack

>[Vue2.0 源码阅读：响应式原理](http://zhouweicsu.github.io/blog/2017/03/07/vue-2-0-reactivity/) 注释多

#### 数组
改写了7种方法，就是本身能改变数组的7个api

![](image/2021-09-24-18-32-15.png)

#### 为什么双向绑定不会陷入死循环

1. 从Vue响应式的原理来问
  可能是重写的getter中
```js
//如果数据发生变化才会更新数据
if (reactiveValue !== newValue) {...}
```

2. 从v-model原理来问
可能是如v-model的双向绑定，使用改写data中数据再v-bind的方法写值, 并不会触发元素的input和change事件，所以也不会再调用v-on对应的方法。
<!-- 用于setter对于input是直接写值, 因此input标签的input事件并没有被触发. -->

```html
<input v-model="sth" />
//  等同于
<input 
    v-bind:value="message" 
    v-on:input="message=$event.target.value"
>
```

>https://segmentfault.com/q/1010000008243687

#### vm.$set 的实现原理

- 如果目标是数组，直接使用数组的 splice 方法触发相应式；
- 如果目标是对象，会先判读属性是否存在、对象是否是响应式，最终如果要对属性进行响应式处理，则是通过调用 defineReactive 方法进行响应式处理

#### 为什么3.0用proxy取代Object.defineProperty

- Proxy可以**直接监听整个对象而非属性**（Proxy返回的是一个新对象,我们可以只操作新的对象达到目的,而Object.defineProperty只能遍历对象属性直接修改。）
而defineProperty只能对当前对象的**其中一个属性**进行劫持
- Proxy可以直接监听数组的变化

```js
const p = new Proxy({
    a: 1,
    b: 2,
}, {
    get: function(obj, value) {
        console.log('get', obj, value);
        return Reflect.get(obj, value);
    },
    set: function(obj, prop, value) {
        console.log('set', obj, prop, value);
        return Reflect.set(obj, prop, value);
    },
})

---
const a = new Proxy([1,2], {
    get: function(obj, prop) {
        console.log('get', obj, prop);
        return Reflect.get(obj, prop);
    },
    set: function(obj, prop, value) {
        console.log('set', obj, prop, value);
        return Reflect.set(obj, prop, value);
    },
});
a.push(1);

// get [1,2] push
// get [1,2] length
// set [1,2] 2 1
// set [1,2, 1] length 3
```

---
proxy本身也不能深度监听对象，**也要递归监听子对象**。但他可以监听整个对象，新增属性可以监听到。

>Proxy本身就可以察觉到新增属性和对数组的原生方法的调用，所以无需额外的代码就可以实现响应式。但是对于深度监听（也就是嵌套对象的监听），我们是在 get 方法里递归调用了 reactive 方法。这里需要强调的是，和vue2使用Object.defineProperty不同，Object.defineProperty是在一上来遍历整个数据结构来实现深度监听，这里用Proxy是在get的时候（访问属性时）才动态的去深度监听，所以Proxy在深度监听性能更好


>[面试官: 实现双向绑定Proxy比defineproperty优劣如何?](https://juejin.cn/post/6844903601416978439#heading-13)

---
- Object.definedProperty的作用是劫持一个对象的属性，劫持属性的getter和setter方法，在对象的属性发生变化时进行特定的操作。而   Proxy劫持的是整个对象。
- Proxy会返回一个代理对象，我们只需要操作新对象即可，而Object.defineProperty只能遍历对象属性直接修改。
- Object.definedProperty不支持数组，更准确的说是不支持数组的各种API，因为如果仅仅考虑arry[i] = value 这种情况，是可以劫持   的，但是这种劫持意义不大。而Proxy可以支持数组的各种API。
- 尽管Object.defineProperty有诸多缺陷，但是其兼容性要好于Proxy。

>作者：伊人a
链接：https://juejin.cn/post/6989422484722286600

#### 依赖收集

Dep(依赖)就是帮我们收集**究竟要通知到哪里的**。 虽然data中有text和message属性，但是只有message被渲染到页面上，至于text无论怎么变化都影响不到视图的展示，因此我们**仅仅对message进行收集即可**，可以避免一些无用的工作。
那这个时候message的Dep就收集到了一个依赖，这个依赖就是用来管理data中message变化的。

实际上在mounted回调之前，会实例化当前组件的Watcher，这个阶段会根据render函数中需要的变量去data选项中获取值，就触发了data中变量对应的get方法，就会把当前Watcher添加到变量对应的Dep维护的订阅者数组中去。

**watch和computed选项的依赖收集**

- 当使用watch属性时，也就是开发者自定义的监听某个data中属性的变化。比如监听message的变化，message变化时我们就要通知到watch这个钩子，让它去执行回调函数。
这个时候message的Dep就收集到了两个依赖，第二个依赖就是用来管理watch中message变化的。

- 当开发者自定义computed计算属性时，如下messageT属性，是依赖message的变化的。因此message变化时我们也要通知到computed，让它去执行回调函数。
  
这个时候message的Dep就收集到了三个依赖，这个依赖就是用来管理computed中message变化的。

图示如下：一个属性可能有多个依赖，每个响应式数据都有一个Dep来管理它的依赖。

![](image/2021-08-16-11-47-06.png)

回顾一下，Vue响应式原理的核心就是Observer、Dep、Watcher。

- Observer中进行响应式的绑定，在数据被读的时候，触发get方法，执行Dep来收集依赖，也就是收集Watcher。
- 在数据被改的时候，触发set方法，通过对应的所有依赖(Watcher)，去执行更新。比如watch和computed就执行开发者自定义的回调方法。

>[Vue响应式原理-理解Observer、Dep、Watcher](https://juejin.cn/post/6844903858850758670)

---
Vue是一个实现数据驱动视图的框架~~ 我们都知道，Vue能够实现当一个数据变更时，视图就进行刷新，而且用到这个数据的其他地方也会同步变更；而且，这个数据必须是在有被依赖的情况下，视图和其他用到数据的地方才会变更。 所以，Vue要能够知道一个数据是否被使用，实现这种机制的技术叫做依赖收集根据Vue官方文档的介绍，其原理如下图所示：

![](image/2021-08-01-11-10-16.png)

---
```js
new Vue({
    template: 
        `<div>
            <span>text1:</span> {{text1}}
            <span>text2:</span> {{text2}}
        <div>`,
    data: {
        text1: 'text1',
        text2: 'text2',
        text3: 'text3'
    }
});
```
这里text3改变不会导致重新渲染，因为没对他进行依赖收集

##### Watcher

**每个组件实例都对应一个 watcher 实例**，它会在组件渲染的过程中把“接触”过的数据 property 记录为依赖。之后当依赖项的 setter 触发时，会通知 watcher，从而使它关联的组件重新渲染。
(一个Vue组件实例对应一个Watcher。)

**Vue里面有3种对象能创建Watcher实例**：component，watch，computed。

Watcher类的实现比较复杂，因为他的实例分为渲染 watcher（render-watcher）、计算属性 watcher（computed-watcher）、侦听器 watcher（normal-watcher）三种，
这三个实例分别是在三个函数中构建的：mountComponent 、initComputed和Vue.prototype.$watch。

- normal-watcher：我们在组件钩子函数watch 中定义的，都属于这种类型，即**只要监听的属性改变了，都会触发定义好的回调函数**，这类watch的expression是计算属性中的属性名。

- computed-watcher：我们在组件钩子函数computed中定义的，都属于这种类型，每一个 computed 属性，最后都会生成一个对应的 watcher 对象，但是这类 watcher 有个特点：当计算属性依赖于其他数据时，属性并不会立即重新计算，**只有之后其他地方需要读取属性的时候，它才会真正计算**，即具备 lazy（懒计算）特性。这类watch的expression是我们写的回调函数的字符串形式。

- render-watcher：每一个组件都会有一个 render-watcher, 当 data/computed 中的属性改变的时候，会调用该 render-watcher 来更新组件的视图。这类watch的expression是 function () {vm._update(vm._render(), hydrating);}。

除了功能上的区别，这三种 watcher 也有固定的执行顺序，分别是：computed-render -> normal-watcher -> render-watcher。

这样安排是有原因的，这样就能尽可能的保证，在更新组件视图的时候，computed 属性已经是最新值了，如果 render-watcher 排在 computed-render 前面，就会导致页面更新的时候 computed 值为旧数据。

---
观察者函数经过Watcher是这么被包装的： - 模板渲染：this._watcher = new Watcher(this, render, this._update) - 计算属性：

```js
computed: {
    name() {
        return `${this.firstName} ${this.lastName}`;
    }
}
/*
会形成
new Watcher(this, function name() {
    return `${this.firstName} ${this.lastName}`
}, callback);
*/
```

>作者：一只小考拉
链接：https://juejin.cn/post/6844903702881386504

---
当我们去实例化一个渲染 watcher 的时候，首先进入 watcher 的构造函数逻辑，然后会执行它的 `this.get()` 方法，进入 get 函数，首先会执行 `pushTarget(this)`

实际上就是把 Dep.target 赋值为当前的渲染 watcher 并压栈（为了恢复用）。接着又执行了 `this.getter` 对应就是 `updateComponent` 函数，这实际上就是在执行：

`vm._update(vm._render(), hydrating)`

它会先执行` vm._render()` 方法，因为之前分析过这个**方法会生成 渲染 VNode**，并且在这个过程中会对 vm 上的数据访问，这个时候就**触发**了数据对象的 getter。

>也就是模板编译在beforeMount就做好了，但是Vnode在`new Watcher`的时候（beforeMount之后mounted之前）才生成

>看 https://ustbhuangyi.github.io/vue-analysis/v2/reactive/getters.html#%E8%BF%87%E7%A8%8B%E5%88%86%E6%9E%90 源码
>看 https://github.com/AnnVoV/blog/issues/7 源码 很详细

#### 如何监听Array的变化

`Object.defineProperty`对数组进行响应式化是有缺陷的。

虽然我们可以监听到索引的改变(Vue只是没有使用这个方式去监听数组索引的变化，因为尤大认为**性能消耗太大**，于是在性能和用户体验之间做了取舍)。。但是`defineProperty`不能检测到数组长度的变化，准确的说是**通过改变length而增加的长度不能监测到**。这种情况无法触发任何改变。

**而且监听数组所有索引的的代价也比较高**，综合一些其他因素，Vue用了另一个方案来处理。

observe方法中，如果发现是数组，则调用`observeArray`方法处理。

在Vue初始化的过程中，给data中的每个数据都挂载了当前的Observer实例，又在这个实例上挂载了dep。这样就能保证我们在数组拦截器中访问到dep了

---
Vue在array.js中更准确的表达是拦截了数组的原型,重写了methodsToPatch中七个方法，并将重写后的原型暴露出去。

![](image/![](image/2021-08-16-12-01-13.png).png)

```js
const arrayProto = Array.prototype // 获取Array的原型

function def (obj, key) {
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        value: function(...args) {
            console.log(key); // 控制台输出 push
            console.log(args); // 控制台输出 [Array(2), 7, "hello!"]
            
            // 获取原生的方法
            let original = arrayProto[key];
            // 将开发者的参数传给原生的方法，保证数组按照开发者的想法被改变
            const result = original.apply(this, args);

            // do something 比如通知Vue视图进行更新
            console.log('我的数据被改变了，视图该更新啦');
            this.text = 'hello Vue';
            return result;
        }
    });
}

// 新的原型
let obj = {
    push() {}
}

// 重写赋值
def(obj, 'push');

let arr = [0];

// 重写数组的原型指向
arr.__proto__ = obj;

// 执行push
arr.push([1, 2], 7, 'hello!');
console.log(arr);
```

#### 子组件如何修改props

不管是react还是vue，父级组件与子组件的通信都是通过props来实现的，在vue中父组件的props遵循的是单向数据流，用官方的话说就是，父级的props的更新会向下流动到子组件中，反之则不行。也就是说，子组件不应该去修改props。但实际开发过程中，可能会有一些情况试图去修改props数据.

1. 用父子组件传值的方式（如$emit ）改变父组件传来的值来间接地改变props
   
2. 如果这个props的值以原始数据传入，但是子组件对其需要转换**且不希望改变父组件中原值**。这种情况，最好使用computed来定义一个计算属性，如下：
```js
props: ['size'],
computed: {
  normalizedSize: function () {
    return this.size.trim().toLowerCase()
  }
}
```

3. JavaScript 中对象和数组是通过引用传入的，所以对于一个数组或对象类型的 prop 来说，在**子组件中改变这个对象或数组本身将会影响到父组件的状态**。
    如果非得需要修改传入的prop为对象的属性，而又不想破坏原对象，可以考虑**深拷贝**这个对象。
>vue2.0中，子组件中不能修改父组件的状态，否则**在控制台中会报错**。
但是这仅限于props为非数组及对象等引用类型数据，譬如字符串，数字等
**如果props是对象的话**，在子组件内修改props的话，父组件是不会报错的。

### 渲染 虚拟DOM

![](image/2021-08-01-14-57-38.png)

[虚拟DOM的实现原理和优劣对比](https://blog.csdn.net/WU5229485/article/details/103685353)

#### 虚拟 DOM 的好处

​ 虚拟 DOM 就是为了解决浏览器性能问题而被设计出来的。如前，若一次操作中有 10 次更新 DOM 的动作，虚拟 DOM 不会立即操作 DOM，而是将这 10 次更新的 diff 内容保存到本地一个 JS 对象中，最终将这个 JS 对象一次性 attch 到 DOM 树上，再进行后续操作，避免大量无谓的计算量。所以，用 JS 对象模拟 DOM 节点的好处是，**页面的更新可以先全部反映在 JS 对象**(虚拟 DOM )上，**操作内存中的 JS 对象的速度显然要更快**，等更新完成后，再将最终的 JS 对象映射成真实的 DOM，交由浏览器去绘制。

每个DOM上的属性多达 228 个，而这些属性有 90% 多对我们来说都是无用的。VNode 就是简化版的真实 DOM 元素，保留了我们要的属性，并新增了一些在 diff 过程中需要使用的属性，例如 isStatic。（Virtual DOM 就是一个js对象，用它来更轻量地描述DOM）

#### 为什么要有虚拟 DOM
在以前还没有框架的时候，前端开发几乎都是靠原生 JavaScript 或者是 JQuery 一把梭进行 DOM 操作的。那么为什么 React 和 Vue 都采用了虚拟 DOM 呢？我理解的虚拟 DOM 的优势是：

- 跨平台渲染。借助虚拟 DOM 后 FrontEnd 可以进行移动端、小程序等开发。因为虚拟 DOM 本身只是一个 JavaScript 对象，所以可以先由 FE 们写 UI 并抽象成一个虚拟 DOM，再由安卓、IOS、小程序等原生实现根据虚拟 DOM 去渲染页面（React Native、Weex）。

- 函数式的 UI 编程。将 UI 抽象成对象的形式，相当于可以以编写 JavaScript 的形式来写 UI。

#### 虚拟 DOM 一定会更快吗
我的理解是不一定。如果一个页面的**整个 DOM 结构都改变了的话**，使用虚拟 DOM 不仅一样要绘制渲染整个视图，而且还要进行 Diff 算法，会比直接操作真实 DOM 更慢，所以虚拟 DOM 带来的性能优势并不是绝对的。

而且不管框架如何封装、掩盖底层操作，终究是需要去调用到 DOM 相关的 api 更新页面的。并且它可能还包含了其他一些 Diff、polyfill、封装逻辑等，这样是不会比我们直接进行 DOM 操作更新 UI 快的。只是，难道我们每修改数据，就要手动操作 DOM 吗？虽然这样会更快，但带来的是很差的代码可读性和可维护性，这样得不偿失。所以正如尤雨溪说的，这是一个性能 VS 可维护性的取舍问题。

---
虚拟DOM的优劣如何?
优点:

- 保证性能下限: 虚拟DOM可以经过diff找出最小差异,然后**批量进行patch**,这种操作虽然比不上手动优化,但是比起粗暴的DOM操作性能要好很多,因此虚拟DOM可以保证性能下限
- 无需手动操作DOM: 虚拟DOM的diff和patch都是在一次更新中自动进行的,我们无需手动操作DOM,极大提高开发效率
- 跨平台: 虚拟DOM本质上是JavaScript对象,而DOM与平台强相关,相比之下虚拟DOM可以进行更方便地跨平台操作,例如服务器渲染、移动端开发等等

缺点:

无法进行极致优化: 在一些性能要求极高的应用中虚拟DOM无法进行针对性的极致优化,比如VScode采用直接手动操作DOM的方式进行极端的性能优化

>作者：寻找海蓝96
链接：https://juejin.cn/post/6844903903968903175

>源码 看 https://github.com/AnnVoV/blog/issues/7
>稍后 https://zhouweicsu.github.io/blog/2017/04/21/vue-2-0-template/
>稍后 https://www.jianshu.com/p/af0b398602bc

#### diff算法

创建一个React元素树之后，在更新的时候将创建一个新的React元素树，React使用Diff算法对元素树进行比对，只更新发生了改变的部分，避免多余的性能消耗。
主要是三个思想，可以从这三个谈：
- 永远只比较同层节点。
- 不同的两个节点产生两个不同的树。
- 通过key值指定哪些更新是相同的。
(尽可能的复用旧的节点)

采用先序深度优先遍历的算法

只有当新旧子节点的类型都是多个子节点时，核心 Diff 算法才派得上用场

Vue 2.X进行diff时，调用patch打补丁函数，**一边比较一边给真实的DOM打补丁**

>作者：洛霞
链接：https://www.nowcoder.com/discuss/459995?channel=-1&source_id=profile_follow_post_nctrack

---
**你怎么理解Vue中的diff算法?**

在js中,渲染真实DOM的开销是非常大的, 比如我们修改了某个数据,如果直接渲染到真实DOM, 会引起整个dom树的重绘和重排。那么有没有可能实现只更新我们修改的那一小块dom而不要更新整个dom呢？此时我们就需要先根据真实dom生成虚拟dom， 当虚拟dom某个节点的数据改变后会生成有一个新的Vnode, 然后新的Vnode和旧的Vnode作比较，发现有不一样的地方就直接修改在真实DOM上，然后使旧的Vnode的值为新的Vnode。

diff的过程就是调用patch函数，比较新旧节点，一边比较一边给真实的DOM打补丁。在采取diff算法比较新旧节点的时候，比较只会在同层级进行。
在patch方法中，首先进行树级别的比较

- new Vnode不存在就删除 old Vnode
- old Vnode 不存在就增加新的Vnode
- 都存在就执行diff更新
  
当确定需要执行diff算法时，比较两个Vnode，包括三种类型操作：属性更新，文本更新，子节点更新
- 新老节点均有子节点，则对子节点进行diff操作，调用updatechidren
- 如果老节点没有子节点而新节点有子节点，先清空老节点的文本内容，然后为其新增子节点
- 如果新节点没有子节点，而老节点有子节点的时候，则移除该节点的所有子节点
- 老新老节点都没有子节点的时候，进行文本的替换

updateChildren

将Vnode的子节点Vch和oldVnode的子节点oldCh提取出来。
oldCh和vCh各有两个头尾的变量StartIdx和EndIdx，它们的2个变量相互比较，一共有4种比较方式。如果4种比较都没匹配，如果设置了key，就会用key进行比较，在比较的过程中，变量会往中间靠，一旦StartIdx>EndIdx表明oldCh和vCh至少有一个已经遍历完了，就会结束比较。

>作者：伊人a
链接：https://juejin.cn/post/6989422484722286600。

---
虚拟 DOM 后的渲染流程：

- 将真实 DOM 抽象成虚拟 DOM。

- 数据改变时，将新的真实 DOM 再抽象成另一个新的虚拟 DOM。

- 采用深度优先遍历新旧两个虚拟 DOM，如果两个虚拟 DOM 节点值得比较，就递归比较它们的子节点，否则直接创建新的 DOM 节点。

当对新旧两个虚拟 DOM 做 Diff 时，Vue 采用的思想是同级比较、深度递归、双端遍历。

**同级比较**
同级比较指的是只比对两个相同层级的 VNode，如果两者不一样了，就不再去 Diff 它们的子节点，更不会去跨层级比较，而是直接更新它。这是因为在我们平时的操作，很少出现将一个 DOM 节点进行跨层级移动，比如将原来的父节点移动到它子节点的位置上。所以 Diff 算法就没有为这个极少数的情况专门去跨层级 Diff，毕竟为此得不偿失，这也是 Diff 算法时间复杂度能从 O(n^3) 优化到 O(n) 的原因之一。

![](image/2021-08-06-16-29-31.png)

**深度递归**
深度递归指的是比较两个虚拟 DOM 时采用深度优先的先序遍历策略，**先比较完一个子节点后，就去比较这个子节点的子孙节点**，都递归完后再来遍历它的兄弟节点。


>稍后 https://juejin.cn/post/6844904078196097031#heading-27

>看 [详解vue的diff算法](https://juejin.cn/post/6844903607913938951)
  [vue diff算法 patch](https://www.cnblogs.com/mengfangui/p/9984135.html)

>看 http://blog.dangosky.com/2020/05/07/Vue2-%E7%9A%84-Diff-%E7%AE%97%E6%B3%95/#!

>https://github.com/fengshi123/blog/blob/master/articles/%E6%B7%B1%E5%85%A5%E5%89%96%E6%9E%90%EF%BC%9AVue%E6%A0%B8%E5%BF%83%E4%B9%8B%E8%99%9A%E6%8B%9FDOM.md 看diff例子


#### key

key 的特殊 attribute 主要用在 Vue 的虚拟 DOM 算法，在新旧 nodes 对比时辨识 VNodes。如果不使用 key，Vue 会使用一种最大限度减少动态元素并且**尽可能的尝试就地修改/复用相同类型元素**的算法。而使用 key 时，它会基于 key 的变化重新排列元素顺序，**并且会移除 key 不存在的元素**。

有相同父元素的子元素必须有独特的 key。重复的 key 会造成渲染错误。

最常见的用例是结合 v-for

>https://cn.vuejs.org/v2/api/#key

---
1. 深度遍历的时候当前节点SameNode算法会通过key判断两个节点是否值得比较(主要先考虑这点)
- key的作用主要是为了**更高效的对比**虚拟DOM中每个节点是否是相同节点;
- Vue在patch过程中判断两个节点是否是相同节点,key是一个必要条件，渲染一组列表时，key往往是唯一标识，所以如果不定义key的话，Vue只能认为比较的两个节点是同一个，哪怕它们实际上不是，这导致了**频繁更新元素，使得整个patch过程比较低效，影响性能**;
- 从源码中可以知道，Vue判断两个节点是否相同时主要判断两者的key和元素类型等，因此如果不设置key,它的值就是undefined，则可能**永远认为这是两个相同的节点，只能去做更新操作，这造成了大量的dom更新操作**，明显是不可取的。

2. 比较孩子节点的时候会根据key进行节点复用（见下）（这里答得时候混淆了，实际上上面一点是主要原因，**子节点之间判断相同也是用的SameNode算法（深度递归）**）
---
**使用 Vue 时我们常常会给节点赋予一个独一无二的 key，通过双端比较的过程能不能明白这是为什么**

我的理解是，如果我们编码时没有给节点一个 key 的话，它在上述4种比较方法都匹配不到后就会直接创建新的真实 DOM 节点并插入到相应位置。而创建一个真实 DOM 节点其实消耗是挺大的，看下图可以发现，我们创建一个 div 节点，它的初始属性都有 293 个。所以在能复用原 DOM 节点的时候就应该尽量复用，而不是重新创建。

Diff 过程的几种比较方法中，最好的是首首/尾尾/首尾/尾首比较，其次是通过 key 比较。那么为啥说首首比较这四种方法要优于通过 key 比较呢？不要忘了，通过 key 比较，不管是通过对象直接找到对应的 key，还是通过遍历一个个去找，它们都得先遍历一边旧子节点列表（第二种方法可能还不止遍历一次）再建立哈希表，而且通过对象直接找还得花费 O(n) 的空间复杂度。所以综合起来通过首首比较这四种方法进行比对，还是要优于通过 key 比对的。

##### 为什么不能用 index 作为 key

如果你用 index 作为 key，那么在删除第二项的时候，index 就会从 1 2 3 变成 1 2(因为 **index 永远都是连续的**，所以不可能是 1 3），那么 Vue 依然会认为你删除的是第三项。

index 永远都是连续的，比如删除一个元素，他后面的所有index都会改变。而key应该是一个独一无二的值，**index改变了他的key也改变了**，Vue就会错误的复用这些元素。

>看 [轻松理解为什么不用Index作为key](https://juejin.cn/post/6844904133430870024)

---
新旧 children 中的节点只有顺序是不同的时候，最佳的操作应该是通过移动元素的位置来达到更新的目的，key是children中节点的唯一标识，以便能够在旧 children 的节点中找到可复用的节点。

##### key应该用什么数据类型

官网上说要用字符串或数字

源码中：
![](image/2021-09-04-15-35-13.png)

##### 列表中不使用key 可以优化性能？

1. 长列表中每个列表项都可以看作一个组件。设置key的情况下，其中一半在更新时只需要调换位置，另外一半会被移除，然后会新增一半的DOM，如果我手动快速拖动滚动条，那可能所有DOM都要被删除然后重新创建。
2. 不设置key的情况下，20个Item都不会被删除，在这种情况下快速拖动滚动条，就不需要重新创建DOM了，但**每个Item每次都会被就地复用**，缺点就是原本可以只进行移动的节点也被就地复用了

也就是说长列表中不用key或者用index作key，SameNode方法认为所有新旧节点都是相同的，直接复用旧的DOM，**省去创建新DOM的操作**，这种情况不用key可能性能反而更高？

但是Vue 推荐所有组件都有一个独一无二的key。

>作者：南方以南
链接：https://juejin.cn/post/6844904008667103240

#### 异步更新与nextTick

>看 [全面解析Vue.nextTick实现原理](https://juejin.cn/post/6844903590293684231#heading-0)

- vue用异步队列的方式来控制DOM更新和nextTick回调先后执行
        
- microtask因为其高优先级特性，能确保队列中的微任务在一次事件循环前被执行完毕

- 因为兼容性问题，vue不得不做了microtask向macrotask的降级方案

---

nextTick 可以让我们在下次 DOM 更新循环结束之后执行延迟回调，用于获得更新后的 DOM。在修改数据之后立即使用这个方法，获取更新后的 DOM。

只要观察到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据改变。如果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作上非常重要。
然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。Vue 在内部尝试对异步队列使用原生的 Promise.then 和 MessageChannel，如果执行环境不支持，会采用 setTimeout(fn, 0) 代替。

```js

// watcher.js
update () {
    if (this.lazy) {
        // 如果是计算属性
        this.dirty = true
    } else if (this.sync) {
        // 如果要同步更新
        this.run()
    } else {
        // 进入更新队列
        queueWatcher(this)
    }
}
```

e.g.
```js
export default {
  data () {
    return {
      msg: 0
    }
  },
  mounted () {
    this.msg = 1
    this.msg = 2
    this.msg = 3
  },
  watch: {
    msg () {
      console.log(this.msg)
    }
  }
}

// 只会输出一次：3
```

---
实际上nextTick就是一个异步方法，也许和你使用的setTimeout没有太大的区别。

<!-- 总结就是Promise > MutationObserver > setImmediate > setTimeout。 -->

对于 macro task 的实现，优先检测是否支持原生 setImmediate，这是一个高版本 IE 和 Edge 才支持的特性，不支持的话再去检测是否支持原生的 MessageChannel，如果也不支持的话就会降级为 setTimeout 0；而对于 micro task 的实现，则检测浏览器是否原生支持 Promise 或 MutationObserver，不支持的话直接指向 macro task 的实现。

总结就是Promise > MutationObserver > setImmediate > setTimeout。

再总结一下优先级：**microtask (jobs) 优先。**

因为在执行微任务之后还会执行渲染操作

如果task队列如果有大量的任务等待执行时，将dom的变动作为microtasks而不是宏任务（task）能**更快的将变化呈现给用户**。
如果task里排队的队列比较多，同时遇到多次的微任务队列执行完。nextTick作为宏任务插入，很有可能之前触发多次浏览器渲染，但是依旧没有执行我们真正的修改dom任务

- 在一轮event loop中多次修改同一dom，只有最后一次会进行绘制。
- 渲染更新（Update the rendering）会在event loop中的tasks和microtasks完成后进行，但并不是每轮event loop都会更新渲染，这取决于是否修改了dom和浏览器觉得是否有必要在此时立即将新状态呈现给用户。如果在一帧的时间内（时间并不确定，因为浏览器每秒的帧数总在波动，16.7ms只是估算并不准确）修改了多处dom，浏览器可能将变动积攒起来，只进行一次绘制，这是合理的。
- 如果希望在每轮event loop都即时呈现变动，可以使用requestAnimationFrame。

>作者：青舟同学
链接：https://juejin.cn/post/6844903918472790023

>2.5版本改为宏任务优先，但是2.6版本改回去了
![](image/2021-09-07-17-29-50.png)

---
我也有简单了解nextTick实现，它会在callbacks里面加入我们传入的函数，然后用timerFunc异步方式调用它们，首选的异步方式会是Promise。这让我明白了为什么可以在nextTick中看到dom操作结果。

---
nextTick为什么总能拿到最新的DOM

因为调用顺序不同！Vue文档中说明，在修改响应式数据后调用nextTick，可获取更新后的DOM。注意了！有顺序要求！

[Vue nextTick 机制](https://juejin.cn/post/6844903599655370765#heading-1)

### 生命周期

Vue 实例有一个完整的生命周期，也就是从开始创建、初始化数据、编译模版、挂载Dom -> 渲染、更新 -> 渲染、卸载等75一系列过程，我们称这是Vue的生命周期。 

![](image/2021-07-31-13-32-40.png)

流程图
![](image/2021-07-31-13-32-51.png)

>看 https://github.com/AnnVoV/blog/issues/7 源码 很详细

---
分阶段说比较好

1.初始化阶段:new Vue()到created之间的阶段
    1.1 配置：始化配置项，合并配置，如果有全局配置合并得到根组件的配置上
    1.2 initLifecycle：组件关系属性的初始化，比如`$parent root chidren`这种
    1.3 initEvents：自定义事件
    1.4 initRender：初始化插槽，获取`this.$slots`， this._c就是createElement方法，也就是h方法
    1.5 callHook：beforecreate函数
    1.6 initInjections：初始化inject选项，做响应式处理
    1.7 initState：响应式原理的核心，处理 props methods computed，data watch
    1.8 initProvide：处理provide
    1.9 callHook：create函数

2.模版编译阶段:在created钩子函数与beforMount钩子函数之间
    2.1 获取模版，将html编译成ast tree，将ast tree解析成render函数，挂载到`vm.$options.render`
    2.2 mountComponent:
        2.2.1 判断`vm.$options.render`
        2.2.2 beforeMount函数
        2.2.3 updateComponent：调用了 `vm_update(vm._render(),...)`，
        2.2.4 new Watcher(),此时会传入updateComponent函数,并随后执行此函数，执行后会发生一些函数执行，
              `Vue._render`：执行由vue-loader生成的render函数或者自己写的render函数，最终返回一个由`createComponent`(非createPatchFunction内部的)产生的`vnode.
              createComponent`(非createPatchFunction内部):创建组件虚拟节点，此函数返回一个vnode，表示vue组件的`vnode.
              vm._update`:接收上面的vnode参数，这里面会触发`VM.__patch__`函数，这个函数里面最终返回的结果就是我们在html页面写的空的div,但是里面有了真实的内容，此时页面可以看到内容了，
        2.2.5 触发mount钩子函数，这个mount钩子每个组件实例会在自己的insert hook中调用

3.挂载阶段:beforeMount钩子函数到mounted钩子函数之间

4.卸载阶段：调用vm.$destroy方法后，Vue.js的生命周期会进入卸载阶段。
这里面好多小点，比如computed的缓存原理，和watch的区别，响应式原理，provide/inject原理

#### 什么是 mixin

- Mixin 使我们能够为 Vue 组件编写可插拔和可重用的功能。
- 如果希望在多个组件之间重用一组组件选项，例如生命周期 hook、 方法等，则可以将其编写为 mixin，并在组件中简单的引用它。
- 然后将 mixin 的内容合并到组件中。如果你要在 mixin 中定义生命周期 hook，那么它在执行时将优化于组件自已的 hook。
  >data执行组件先于mixin
  生命周期执行mixin先于组件
  若组件和mixin的methods重名，则取组件的methods

### v-model

#### 在v-model上怎么用Vuex中state的值？
需要通过computed计算属性来转换。

```js
<input v-model="message">
// ...
computed: {
    message: {
        get () {
            return this.$store.state.message
        },
        set (value) {
            this.$store.commit('updateMessage', value)
        }
    }
}
```

#### 自定义组件使用v-model

[vue自定义组件实现 v-model双向绑定数据](https://juejin.cn/post/6967234522614071310)

父组件直接写
```html
<radio class="right" :options="options" v-model="checked"></radio>
```
不用再写上回调了

实际上：
```html
<input v-model="searchText">
```
等价于
```html
<input
  v-bind:value="searchText"
  v-on:input="searchText = $event.target.value"
>
```

>Vue2中一个标签里面最多只能有一个 v-model。

### 你都做过哪些 Vue 的性能优化

对象层级不要过深，否则性能就会差
不需要响应式的数据不要放到 data 中（可以用 Object.freeze() 冻结数据； 或将数据放在vue实例外；或自定义option中）
v-if 和 v-show 区分使用场景
computed 和 watch 区分使用场景
v-for 遍历必须加 key，key 最好是 id 值，且避免同时使用 v-if
大数据列表和表格性能优化-虚拟列表/虚拟表格
防止内部泄漏，组件销毁后把全局变量和事件销毁
图片懒加载
路由懒加载(按需加载也是用箭头函数，只不过直接写在实例的components里面)
第三方插件的按需引入
适当采用 keep-alive 缓存组件
防抖、节流运用
服务端渲染 SSR or 预渲染
服务端开启gzip压缩等

>作者：Big shark@LX
链接：https://juejin.cn/post/6961222829979697165

>看 [总结我对Vue项目上线做的一些基本优化](https://juejin.cn/post/6850037281559543821)

### Object.freeze() 是“浅冻结”
[Vue性能提升之Object.freeze()](https://juejin.cn/post/6844903922469961741#heading-6)

Vue添加响应式的时候会先判断configurable是否为true，因为后面会劫持数据，改写get和set方法。所以freeze了就不能响应式了。

### React VS Vue
[React VS Vue —— 你需要知道的前端两大“框架”的异同](http://www.yangyong.xyz/2019/07/29/react-vs-vue/)

### Vuex

[Vuex面试题汇总](https://juejin.cn/post/6844903993374670855#heading-2)

#### vuex原理

##### 插件原理
使用Vue.use(vuex)时，会调用vuex的install方法
applyMixin方法使用vue混入机制，vue的生命周期beforeCreate钩子函数前混入vuexInit方法. 在所有组件的 beforeCreate生命周期注入了设置 this.$store这样一个对象。

![](image/2021-10-02-10-15-35.png)

##### 响应式state原理：

```js
function resetStoreVM (store, state, hot) {
  const oldVm = store._vm

  // 设置 getters 属性
  store.getters = {}
  const wrappedGetters = store._wrappedGetters
  const computed = {}
  // 遍历 wrappedGetters 属性
  forEachValue(wrappedGetters, (fn, key) => {
    // 给 computed 对象添加属性
    computed[key] = partial(fn, store)
    // 重写 get 方法
    // store.getters.xx 其实是访问了store._vm[xx]，其中添加 computed 属性
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key],
      enumerable: true // for local getters
    })
  })

  const silent = Vue.config.silent
  Vue.config.silent = true
  // 创建Vue实例来保存state，同时让state变成响应式
  // store._vm._data.$$state = store.state
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed
  })
  Vue.config.silent = silent

  // 只能通过commit方式更改状态
  if (store.strict) {
    enableStrictMode(store)
  }
}
```

从上面源码，我们可以看出Vuex的state状态是响应式，是借助vue的data是响应式，**将state存入vue实例组件的data中**；Vuex的getters则是借助vue的计算属性computed实现数据实时监听。

>[Vuex从使用到原理解析](https://zhuanlan.zhihu.com/p/78981485)
[JS每日一题: 请简述一下vuex实现原理](https://segmentfault.com/a/1190000018251844)
[手写Vuex核心原理，再也不怕面试官问我Vuex原理](https://juejin.cn/post/6855474001838342151#heading-3)

#### 页面刷新 Vuex数据丢失

在做vue项目的过程中有时候会遇到一个问题，就是进行页面刷新的时候，页面的数据会丢失，出现这个问题的原因是因为当用vuex做全局状态管理的时候，**store中的数据是保存在运行内存中**的，页面刷新时会**重新加载vue实例，store中的数据就会被重新赋值**，因此数据就丢失了

解决办法
- 最先想到的应该就是利用localStorage/sessionStorage将数据储存在外部
- computed

>https://segmentfault.com/a/1190000038950555

#### mapState, mapGetters, mapActions, mapMutations

当一个组件需要获取多个状态时候，将这些状态都声明为计算属性会有些重复和冗余。为了解决这个问题，我们可以使用 mapState 辅助函数帮助我们生成计算属性
mapMutations 其实跟mapState 的作用是类似的，将组件中的 methods 映射为 store.commit 调用

( mapState工具函数会将store中的state映射到**局部计算属性**中。(少按几个键)
直接使用 this.xx 即可使用到对应computed中对应的属性了)

>https://www.cnblogs.com/tugenhua0707/p/9794423.html

### vue-router

#### hash 模式

hash 模式是一种把前端路由的路径用井号 # 拼接在真实 URL 后面的模式。当井号 # 后面的路径发生变化时，浏览器并不会重新发起请求，而是会触发 `hashchange` 事件。

它的特点在于：hash 虽然出现在 URL 中，但不会被包括在 HTTP 请求中，对后端完全没有影响，因此改变 hash 不会重新加载页面。

```html
<a href="#/a">A页面</a>
<a href="#/b">B页面</a>
<div id="app"></div>
<script>
  function render() {
    app.innerHTML = window.location.hash
  }
  window.addEventListener('hashchange', render)
  render()
</script>
```

总结一下 hash 模式的优缺点：

- 优点：浏览器兼容性较好，连 IE8 都支持
- 缺点：路径在井号 # 的后面，比较丑

#### history 模式

history API 是 H5 提供的新特性，允许开发者直接更改前端路由，即更新浏览器 URL 地址而不重新发起请求。

根据 Mozilla Develop Network 的介绍，调用 history.pushState() 相比于直接修改 hash(调用`window.location = "#foo"`)，存在以下优势：
- pushState() 设置的新 URL 可以是与当前 URL 同源的任意 URL；而 hash 只可修改 # 后面的部分，因此只能设置与当前 URL 同文档的 URL；
- pushState() 设置的新 URL 可以与当前 URL 一模一样，这样也会把记录添加到栈中；而 hash 设置的新值必须与原来不一样才会触发动作将记录添加到栈中；
- pushState() 通过 stateObject 参数可以添加任意类型的数据到记录中；而 hash 只可添加短字符串；
- pushState() 可额外设置 title 属性供后续使用。

>作者：旭1478080873000
链接：https://juejin.cn/post/6844903552519766029
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

```html
<a href="javascript:toA();">A页面</a>
<a href="javascript:toB();">B页面</a>
<div id="app"></div>
<script>
  function render() {
    app.innerHTML = window.location.pathname
  }
  function toA() {
    history.pushState({}, null, '/a')
    render()
  }
  function toB() {
    history.pushState({}, null, '/b')
    render()
  }
  window.addEventListener('popstate', render)
</script>
```

history API 提供了丰富的函数供开发者调用，我们不妨把控制台打开，然后输入下面的语句来观察浏览器地址栏的变化：

```js
history.replaceState({}, null, '/b') // 替换路由
history.pushState({}, null, '/a') // 路由压栈
history.back() // 返回
history.forward() // 前进
history.go(-2) // 后退2次
```

上面的代码监听了 popstate 事件，该事件能监听到：

- 用户点击浏览器的前进和后退操作
- 手动调用 history 的 back、forward 和 go 方法

监听不到：

- history 的 pushState 和 replaceState方法

这也是为什么上面的 toA 和 toB 函数内部需要**手动调用 render 方法**的原因。

浏览器在刷新的时候，会**按照路径发送真实的资源请求**，如果这个路径是前端通过 history API 设置的 URL，那么在服务端往往不存在这个资源，于是就返回 404 了。上面的参数的意思就是如果后端资源不存在就返回 history.html 的内容。

因此在线上部署基于 history API 的单页面应用的时候，一定要后端配合支持才行，否则会出现大量的 404。以最常用的 Nginx 为例，只需要在配置的 location / 中增加下面一行即可：

`try_files $uri /index.html;`

---
在用户手动输入 URL 后回车，或者刷新（重启）浏览器的时候。
1. hash 模式下，**仅** hash 符号之前的内容会被包含在请求中，如 http://www.abc.com，因此对于后端来说，即使没有做到对路由的全覆盖，也不会返回 404 错误。
2. history 模式下，前端的 URL 必须和实际向后端发起请求的 URL 一致，如 http://www.abc.com/book/id。 如果后端缺少对 /book/id 的路由处理，将返回 404 错误。Vue-Router 官网里如此描述：“不过这种模式要玩好，还需要后台配置支持……所以呢，你要在服务端增加一个**覆盖所有情况的候选资源**：如果 URL 匹配不到任何静态资源，则应该返回同一个 index.html 页面，这个页面就是你 app 依赖的页面。”

总结一下 history 模式的优缺点：

- 优点：路径比较正规，没有井号 #
- 缺点：兼容性不如 hash，且需要服务端支持，否则一刷新页面就404了

#### 两种模式对比
调用 history.pushState() 相比于直接修改 hash，存在以下优势:
- pushState() 设置的新 URL 可以是与当前 URL 同源的任意 URL；而 hash 只可修改 # 后面的部分，因此只能设置与当前 URL 同文档的 URL；
- pushState() 设置的新 URL 可以与当前 URL 一模一样，这样也会把记录添加到栈中；而 hash 设置的新值必须与原来不一样才会触发动作将记录添加到栈中；
- pushState() 通过 stateObject 参数可以添加任意类型的数据到记录中；而 hash 只可添加短字符串；
- pushState() 可额外设置 title 属性供后续使用。
- hash模式下，仅hash符号之前的url会被包含在请求中，后端如果没有做到对路由的全覆盖，也不会返回404错误；history模式下，前端的url必须和实际向后端发起请求的url一致，如果没有对用的路由处理，将返回404错误。

#### router和route的区别

route为当前router跳转对象里面可以获取name、path、query、params等

router为VueRouter实例，想要导航到不同URL，则使用router.push方法

#### 路由守卫

路由钩子函数有三种：
1：全局钩子： beforeEach、 afterEach、beforeResolve
2：单个路由里面的钩子：  beforeEnter
3: 组件路由：beforeRouteEnter、 beforeRouteUpdate、 beforeRouteLeave

##### 完整的导航解析流程

1. 导航被触发。
2. 在失活的组件里调用 beforeRouteLeave 守卫。
3. 调用全局的 beforeEach 守卫。
4. 在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
5. 在路由配置里调用 beforeEnter。
6. 解析异步路由组件。
7. 在被激活的组件里调用 beforeRouteEnter。
8. 调用全局的 beforeResolve 守卫 (2.5+)。
9. 导航被确认。
10. 调用全局的 afterEach 钩子。
11. 触发 DOM 更新。
12. 调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。

>https://router.vuejs.org/zh/guide/advanced/navigation-guards.html#%E7%BB%84%E4%BB%B6%E5%86%85%E7%9A%84%E5%AE%88%E5%8D%AB

#### 路由传参方式

1. params
2. query

>https://www.yuque.com/cuggz/interview/hswu8g#c469615d0862372ef564ec1f3c5f0cdd

#### vue匹配不到路由跳转登录页或其他页面

两种方法
https://www.cxyzjd.com/article/woshidamimi0/84837727

#### 手写路由

稍后 [面试官: 你了解前端路由吗?](https://juejin.cn/post/6844903589123457031#heading-13)

### v-if v-show

#### v-if 原理

基于数据驱动的理念，当 v-if 指令对应的 value 为 false 的时候会预先**创建一个注释节点**。value 发生变化时，命中派发更新的逻辑，对新旧组件树进行 patch，从而完成使用 v-if 指令元素的动态显示隐藏。

![](image/2021-07-31-13-40-17.png)

>https://segmentfault.com/a/1190000039005215

---
编译过程中，一个模版会经历 baseParse、transform、generate 这三个过程，最后由 generate 生成可以执行的代码（render 函数）。

```js
render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_ctx.visible)
    ? (_openBlock(), _createBlock("div", { key: 0 }))
    : _createCommentVNode("v-if", true)
}
```

可以看到，一个简单的使用 v-if 指令的模版编译生成的 render 函数最终会返回一个三目运算表达式。首先，让我们先来认识一下其中几个变量和函数的意义：

- _ctx 当前组件实例的上下文，即 this
- _openBlock() 和 _createBlock() 用于构造 Block Tree 和 Block VNode，它们主要用于靶向更新过程
- _createCommentVNode() 创建注释节点的函数，通常用于占位
显然，如果当 visible 为 false 的时候，会在当前模版中创建一个注释节点（也可称为占位节点），反之则创建一个真实节点（即它自己）。例如当 visible 为 false 时渲染到页面上会是这样：

![](image/2021-09-02-16-34-01.png)

#### 区别

编译的区别
- v-show其实就是在控制css
- v-if切换有一个局部编译/卸载的过程，切换过程中合适地销毁和重建内部的事件监听和子组件
  
编译的条件
- v-show都会编译，初始值为false，只是将display设为none，但它也编译了
- v-if初始值为false，就不会编译了
  
本质区别
- v-show本质就是通过设置css中的display设置为none，控制隐藏
- v-if是动态的向DOM树内添加或者删除DOM元素

### computed watch

1. computed是计算属性，类似于过滤器,对绑定到视图的数据进行处理,并监听变化进而执行对应的方法
   计算属性是基于它们的依赖进行缓存的。**只在相关依赖发生改变时它们才会重新求值**。
  **下一次获取** computed 的值时才会重新计算 computed 的值 (懒计算，不会以改变就立即计算新值，而是下次get时再计算)。
2. watch是一个侦听的动作，用来观察和响应 Vue 实例上的数据变动。

computed主要用于对同步数据的处理，watch则主要用于观测某个值的变化去完成一段开销较大的或者异步的复杂业务逻辑

>见 https://www.yuque.com/cuggz/interview/hswu8g#d72e59d5f3d78b8cf5d8038e0e12803e

>源码 [我想用大白话讲清楚watch和computed](https://juejin.cn/post/6924911113012248590) Watcher

#### computed的缓存原理：
1、初始化computed的时候，遍历拿到里面的key，是函数直接赋值，不是函数获取getter，
2、把每个key都实例化一个watcher，传入一个对象{vm,getter,null,懒执行配置}
3、执行的时候，默认watcher.dirty = true，得到函数执行结果，赋值给watch.value，将watcher.dirty置为false,一次渲染中，只执行一次computed，后续访问不会执行，直到下一次更新下会执行，watcher.update之后才会把ditry置为true，不然每次执行都直接返回value
4、将key代理到vue实例上，支持this.computedKey访问

### keep-alive 原理

#### 组件实现原理

keep-alive 组件是抽象组件，在对应父子关系时会跳过抽象组件，它只对包裹的子组件做处理，主要是根据LRU策略缓存组件 VNode，最后在 render 时返回子组件的 VNode。

>在初始化阶段会调用 initLifecycle，里面判断父级是否为抽象组件，如果是抽象组件，就选取抽象组件的上一级作为父级，忽略与抽象组件和子组件之间的层级关系。

keep-alive 组件没有编写 template 模板，而是由 render 函数决定渲染结果。

如果 keep-alive 存在多个子元素，keep-alive **要求同时只有一个子元素被渲染**。所以在开头会获取插槽内的子元素，调用 getFirstComponentChild 获取到第一个子元素的 VNode。

- 第一步：获取keep-alive包裹着的第一个子组件对象及其组件名；
- 第二步：根据设定的黑白名单（include与exclude）进行条件匹配，决定是否缓存。不匹配，直接返回组件实例（VNode），否则执行第三步；
- 第三步：根据组件ID和tag生成缓存Key，并在缓存对象中查找是否已缓存过该组件实例。如果存在，直接取出缓存值并更新该key在this.keys中的位置（更新key的位置是实现LRU置换策略的关键），否则执行第四步；
- 第四步：在this.cache对象中存储该组件实例并保存key值，之后检查缓存的实例数量是否超过max的设置值，超过则根据LRU置换策略删除最近最久未使用的实例（即是下标为0的那个key）。
- 第五步：最后并且很重要，将该组件实例的keepAlive属性值设置为true, 表示它是被缓存的组件。
- keep-alive 在 mounted 会监听 include 和 exclude 的变化，属性发生改变时调整缓存和 keys 的顺序，最终调用的也是 pruneCacheEntry。

#### 组件渲染流程

Vue在初始化生命周期的时候，为组件实例建立父子关系会根据abstract属性决定是否忽略某个组件。在keep-alive中，设置了abstract: true，那Vue就会跳过该组件实例。
最后构建的组件树中就不会包含keep-alive组件，那么由组件树渲染成的DOM树自然也不会有keep-alive相关的节点了。

---
被缓存的组件实例会为其设置keepAlive = true，而在初始化组件钩子函数中, 当vnode.componentInstance（这个值第一次实例的时候为undefined，所以第一次还是会走生命周期函数）和keepAlive同时为 true 时，不再进入$mount过程，那mounted之前的所有钩子函数（beforeCreate、created、mounted）都不再执行。

在patch的阶段，最后会执行invokeInsertHook函数，而这个函数就是去调用组件实例（VNode）自身的insert钩子：
在这个钩子里面，调用了activateChildComponent函数递归地去执行所有子组件的activated钩子函数：

>[彻底揭秘keep-alive原理](https://juejin.cn/post/6844903837770203144#heading-6)
[Vue源码解析，keep-alive是如何实现缓存的？](https://juejin.cn/post/6862206197877964807#heading-4)

### slot
插槽，其实就相当于占位符。它在组件中给占了一个位置，当父组件调用这个组件的时候，父组件可以在插槽中添入内容来决定插槽如何展示。插槽又分为 匿名插槽、具名插槽、作用域插槽。

- 默认插槽：又名匿名插槽，当slot没有指定name属性值的时候一个默认显示插槽，一个组件内只有有一个匿名插槽。 
- 具名插槽：带有具体名字的插槽，也就是带有name属性的slot，一个组件可以出现多个具名插槽。 
- 作用域插槽：默认插槽、具名插槽的**一个变体**，可以是匿名插槽，也可以是具名插槽，该插槽的不同点是在子组件渲染作用域插槽时，**可以将子组件内部的数据传递给父组件**，**让父组件根据子组件的传递过来的数据决定如何渲染该插槽。**

#### 作用域插槽

当你想在一个插槽中使用数据时，要注意一个问题作用域的问题，Vue 官方文档中说了**父级模板里的所有内容都是在父级作用域中编译的**；子模板里的所有内容都是在子作用域中编译的;

为了让 子组件中的数据 在父级的插槽 内容中可用我们可以将 数据 作为 元素的一个特性绑定上去： v-bind:text="text"

![](image/2021-09-23-18-17-52.png)

![](image/2021-09-23-18-17-58.png)

https://juejin.cn/post/6970621849835307045#heading-2

### Vue SSR

Vue.js 是构建客户端应用程序的框架。默认情况下，可以在浏览器中输出 Vue 组件，进行生成 DOM 和操作 DOM。然而，也可以将同一个组件渲染为服务端的 HTML 字符串，将它们直接发送到浏览器，最后将这些静态标记"激活"为客户端上完全可交互的应用程序。
即：SSR大致的意思就是vue在客户端将标签渲染成的整个 html 片段的工作在服务端完成，服务端形成的html 片段直接返回给客户端这个过程就叫做服务端渲染。

服务端渲染 SSR 的优缺点如下：
（1）服务端渲染的优点：

更好的 SEO： 因为 SPA 页面的内容是通过 Ajax 获取，而搜索引擎爬取工具并不会等待 Ajax 异步完成后再抓取页面内容，所以在 SPA 中是抓取不到页面通过 Ajax 获取到的内容；而 SSR 是直接由服务端返回已经渲染好的页面（数据已经包含在页面中），所以搜索引擎爬取工具可以抓取渲染好的页面；

更快的内容到达时间（首屏加载更快）： SPA 会等待所有 Vue 编译后的 js 文件都下载完成后，才开始进行页面的渲染，文件下载等需要一定的时间等，所以首屏渲染需要一定的时间；SSR 直接由服务端渲染好页面直接返回显示，无需等待下载 js 文件及再去渲染等，所以 SSR 有更快的内容到达时间；

（2) 服务端渲染的缺点：

更多的开发条件限制： 例如服务端渲染只支持 beforCreate 和 created 两个钩子函数，这会导致一些外部扩展库需要特殊处理，才能在服务端渲染应用程序中运行；并且与可以部署在任何静态文件服务器上的完全静态单页面应用程序 SPA 不同，服务端渲染应用程序，需要处于 Node.js server 运行环境；

更多的服务器负载：在 Node.js  中渲染完整的应用程序，显然会比仅仅提供静态文件的  server 更加大量占用CPU 资源 (CPU-intensive - CPU 密集)，因此如果你预料在高流量环境 ( high traffic ) 下使用，请准备相应的服务器负载，并明智地采用缓存策略。

>作者：我是你的超级英雄
链接：https://juejin.cn/post/6844903918753808398

--- 
![](image/2021-09-05-11-29-03.png)
>服务端渲染就是在浏览器请求页面URL的时候，服务端将我们需要的HTML文本组装好，并返回给浏览器，这个HTML文本被浏览器解析之后，不需要经过 JavaScript 脚本的执行，即可直接构建出希望的 DOM 树并展示到页面中。这个服务端组装HTML的过程，叫做服务端渲染。

随着单页应用（SPA）的发展，程序员们渐渐发现 SEO（Search Engine Optimazition，即搜索引擎优化）出了问题，而且随着应用的复杂化，JavaScript 脚本也不断的臃肿起来，使得首屏渲染相比于 Web1.0时候的服务端渲染，也慢了不少。

自己选的路，跪着也要走下去。于是前端团队选择了使用 nodejs 在服务器进行页面的渲染，进而再次出现了服务端渲染。大体流程与客户端渲染有些相似，首先是浏览器请求URL，前端服务器接收到URL请求之后，根据不同的URL，前端服务器向后端服务器请求数据，请求完成后，前端服务器会组装一个携带了具体数据的HTML文本，并且返回给浏览器，浏览器得到HTML之后开始渲染页面，同时，浏览器加载并执行 JavaScript 脚本，给页面上的元素绑定事件，让页面变得可交互，当用户与浏览器页面进行交互，如跳转到下一个页面时，浏览器会执行 JavaScript 脚本，向后端服务器请求数据，获取完数据之后再次执行 JavaScript 代码动态渲染页面。
![](image/2021-09-05-11-32-22.png)

>https://github.com/yacan8/blog/issues/30

### 组件化

通过组件化，我们可以把共同的功能抽离成组件实现代码的复用和解耦，可以减小开发和维护的难度。

分为：
- 业务组件
  通常是根据最小业务状态抽象而出，有些业务组件也具有一定的复用性，但大多数是一次性组件
- 通用组件
  可以在一个或多个APP内通用的组件
  
先对页面不同的功能分割成不同的部分，然后对这些不同的部分进行抽象，找出他们有共同的功能的部分抽离成组件。
同时要保证每个组件它的功能尽可能单一，尽量减少组件的依赖来提高组件的可复用性减小耦合度，组件的接口尽量清晰明确。
我们还可以在组件中设置插槽提高它的可复用性，外部组件可以自己选择在插槽中插入想要的内容。

https://juejin.cn/post/6844903917470351367#heading-73

https://juejin.cn/post/6844903821513064456#heading-9