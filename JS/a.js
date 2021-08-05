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

LazyMan.prototype.sleepAtFirst = function (time) { 
  this.atFirst = time;
  console.log('I sleep at first');
  return this;
}

var lazyman = new LazyMan('jack')
lazyman.sleep(2).eat('meat').sleep(3).eat('apple').sleepAtFirst(70).eat('food')