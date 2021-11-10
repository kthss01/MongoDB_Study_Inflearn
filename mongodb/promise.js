// resolve 성공했을 때 reject 실패했을 때
const addSum = (a, b) => new Promise((resolve, reject) => {
    setTimeout(() => {
        if (typeof a !== 'number' || typeof b !== 'number') {
            reject('a, b must be numbers');
        }
        resolve(a + b);
    }, 3000);
});

addSum(10, 20)
// addSum(10, 'ㅁ')
    .then(sum => console.log({ sum })) // 파라미터 하나면 () 빼도 됨
    .catch(error => console.log({ error }));