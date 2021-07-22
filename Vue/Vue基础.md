[vue开发看这篇文章就够了](https://segmentfault.com/a/1190000012692321)
https://www.yuque.com/cuggz/interview/hswu8g#8d6cd1d13b8d85c0090dd20084f39044
[30 道 Vue 面试题，内含详细讲解（涵盖入门到精通，自测 Vue 掌握程度）
](https://github.com/fengshi123/blog/issues/14)


[vue生命周期探究（一）](https://segmentfault.com/a/1190000008879966)
![](image/2021-07-16-21-30-35.png)
![](image/2021-07-19-17-06-22.png)

[剖析Vue原理&实现双向绑定MVVM](https://segmentfault.com/a/1190000006599500)
看 [0 到 1 掌握：Vue 核心之数据双向绑定](https://juejin.cn/post/6844903903822086151#heading-13)

[深入剖析：Vue核心之虚拟DOM](https://github.com/fengshi123/blog/blob/master/articles/%E6%B7%B1%E5%85%A5%E5%89%96%E6%9E%90%EF%BC%9AVue%E6%A0%B8%E5%BF%83%E4%B9%8B%E8%99%9A%E6%8B%9FDOM.md)

[Vue2.0 v-for 中 :key 到底有什么用？](https://www.zhihu.com/question/61064119)

---
nextTick 可以让我们在下次 DOM 更新循环结束之后执行延迟回调，用于获得更新后的 DOM。
[你真的理解$nextTick么](https://juejin.cn/post/6844903843197616136#heading-6)
[Vue nextTick 机制](https://juejin.cn/post/6844903599655370765#heading-1)

[Vue3.0 新特性以及使用经验总结](https://juejin.cn/post/6940454764421316644#heading-15)


### 问题

#### 为什么3.0用proxy取代Object.defineProperty
https://www.jianshu.com/p/860418f0785c

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

#### router和route的区别
route为当前router跳转对象里面可以获取name、path、query、params等

router为VueRouter实例，想要导航到不同URL，则使用router.push方法

#### 你都做过哪些 Vue 的性能优化

对象层级不要过深，否则性能就会差
不需要响应式的数据不要放到 data 中（可以用 Object.freeze() 冻结数据）
v-if 和 v-show 区分使用场景
computed 和 watch 区分使用场景
v-for 遍历必须加 key，key 最好是 id 值，且避免同时使用 v-if
大数据列表和表格性能优化-虚拟列表/虚拟表格
防止内部泄漏，组件销毁后把全局变量和事件销毁
图片懒加载
路由懒加载
第三方插件的按需引入
适当采用 keep-alive 缓存组件
防抖、节流运用
服务端渲染 SSR or 预渲染

>作者：Big shark@LX
链接：https://juejin.cn/post/6961222829979697165
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

#### Object.freeze() 是“浅冻结”
[Vue性能提升之Object.freeze()](https://juejin.cn/post/6844903922469961741#heading-6)

Vue添加响应式的时候会先判断configurable是否为true，因为后面会劫持数据，改写get和set方法。所以freeze了就不能响应式了。

#### 说一下diff算法
稍后 [详解vue的diff算法](https://juejin.cn/post/6844903607913938951)

作者：洛霞
链接：https://www.nowcoder.com/discuss/459995?channel=-1&source_id=profile_follow_post_nctrack
来源：牛客网

创建一个React元素树之后，在更新的时候将创建一个新的React元素树，React使用Diff算法对元素树进行比对，只更新发生了改变的部分，避免多余的性能消耗。
主要是三个思想，可以从这三个谈：
7.1. 永远只比较同层节点。
7.2. 不同的两个节点产生两个不同的树。
7.3. 通过key值指定哪些更新是相同的。

#### React VS Vue
[React VS Vue —— 你需要知道的前端两大“框架”的异同](http://www.yangyong.xyz/2019/07/29/react-vs-vue/)

### Vuex

#### 页面刷新 Vuex数据丢失

在做vue项目的过程中有时候会遇到一个问题，就是进行页面刷新的时候，页面的数据会丢失，出现这个问题的原因是因为当用vuex做全局状态管理的时候，**store中的数据是保存在运行内存中**的，页面刷新时会**重新加载vue实例，store中的数据就会被重新赋值**，因此数据就丢失了

解决办法
- 最先想到的应该就是利用localStorage/sessionStorage将数据储存在外部
- computed

>https://segmentfault.com/a/1190000038950555