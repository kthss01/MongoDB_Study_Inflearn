// resolve 성공했을 때 reject 실패했을 때
const addSum = (a, b) => new Promise((resolve, reject) => {
    setTimeout(() => {
        if (typeof a !== 'number' || typeof b !== 'number') {
            reject('a, b must be numbers');
        }
        resolve(a + b);
    }, 1000);
});

// callback hell 이 개선된 모습
addSum(10, 20)
// addSum(10, 'ㅁ')
    // .then(sum1 => {
    //     console.log({ sum1 });
    //     // return addSum(sum1, 'ab');
    //     return addSum(sum1, 30);
    // }) // 파라미터 하나면 () 빼도 됨
    // .then(sum2 => console.log({ sum2 })) // 파라미터 하나면 () 빼도 됨
    .then(sum => addSum(sum, 1))
    .then(sum => addSum(sum, 1))
    .then(sum => addSum(sum, 1))
    .then(sum => addSum(sum, 1))
    .then(sum => addSum(sum, 1))
    .then(sum => console.log({ sum })) // 파라미터 하나면 () 빼도 됨
    .catch(error => console.log({ error }));