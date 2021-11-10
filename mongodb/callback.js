const addSum = (a, b, callback) => {
    setTimeout(() => {
        if (typeof a !== 'number' || typeof b !== 'number') {
            return callback('a, b must be numbers');
        }
        callback(undefined, a + b);
    }, 3000);
};

// addSum(10, 'asdf', callback);
// callback hell이 발생할 수 있음 - 복잡해짐
addSum(10, 20, (error1, sum1) => {
    if (error1) return console.log({ error1 });
    console.log({ sum1 });
    addSum(sum1, 15, (error2, sum2) => {
        if (error2) return console.log({ error2 });
        console.log({ sum2 });
    });
});