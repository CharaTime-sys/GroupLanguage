let i = 1;
let n = 25;
let fi = 1;
let fii = 1;
let bool = [1,2,3,3,[1,2,3]];
console.log(bool);
while (i <= n) {
  console.log(fi);
  let temp = fi + fii;
  fi = fii;
  fii = temp;
  i = i + 1;
}