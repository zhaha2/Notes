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

const promise1 = ()=>Promise.resolve(1)
const promise2 = ()=> new Promise(resolve=>{
  setTimeout(() => {
    resolve(2)
  }, 2000);
})
const promise3 = ()=> new Promise(resolve=>{
  setTimeout(() => {
    resolve(3)
  }, 3000);
})

const promiseList = [promise1,promise2,promise3]

function promiseChain(tasks) {
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

promiseChain(promiseList) .then(() => console.log('finished'))

function promiseChain2(tasks) {
  return tasks.reduce((pre, cur)=> {
    return pre.then(cur)
      .then(res => console.log(res))
  }, Promise.resolve())
}