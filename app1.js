var _a, _b;
(_a = document.getElementById('createTestBtn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', createTests);
(_b = document.getElementById('submitBtn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', submitAnswers);
function createTests() {
    const testsContainer = document.getElementById('testsContainer');
    testsContainer.innerHTML = '';
    for (let i = 1; i <= 10; i++) {
        const test = document.createElement('div');
        test.innerHTML = `<h3>Test ${i}</h3>`;
        test.innerHTML += `<p>${generateQuestion('+')}</p>`;
        test.innerHTML += `<p>${generateQuestion('-')}</p>`;
        test.innerHTML += `<p>${generateQuestion('*')}</p>`;
        test.innerHTML += `<p>${generateQuestion('/')}</p>`;
        testsContainer === null || testsContainer === void 0 ? void 0 : testsContainer.appendChild(test);
    }
}
function generateQuestion(operator) {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    return `${num1} ${operator} ${num2} = `;
}
function submitAnswers() {
    const userAnswers = document.getElementById('answersInput').value.split(',');
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';
    let correctCount = 0;
    userAnswers.forEach((answer, index) => {
        const testNumber = Math.floor(index / 4) + 1;
        const operator = ['+', '-', '*', '/'][index % 4];
        const expectedAnswer = eval(generateQuestion(operator));
        if (parseInt(answer.trim()) === expectedAnswer) {
            correctCount++;
        }
        else {
            resultsContainer.innerHTML += `<p>Test ${testNumber}, Question ${index % 4 + 1}: Incorrect</p>`;
        }
    });
    resultsContainer.innerHTML += `<h3>Result: ${correctCount} out of 40 correct</h3>`;
}
