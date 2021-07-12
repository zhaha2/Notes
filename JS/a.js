function test(a, b) {
  console.log(b);
  return {
    test: function(c) {
      return test(c, a)
    }
  }
}

var retA = test(0);
retA.test(2);
retA.test(4);
retA.test(8);
console.log('------');
var retB = test(0).test(2).test(4).test(8);
console.log('------');
var retC = test(good).test(bad);
retC.test(good);
retC.test(bad);

console.log(a);
function a() {
  console.log('func');
}
