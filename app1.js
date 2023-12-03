var _a, _b;
(_a = document.getElementById('createTestBtn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', createTests);
(_b = document.getElementById('submitBtn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', submitAnswers);
function createTests() {
    var testsContainer = document.getElementById('testsContainer');
    testsContainer.innerHTML = '';
    for (var i = 1; i <= 10; i++) {
        var test = document.createElement('div');
        test.innerHTML = "<h3>Test ".concat(i, "</h3>");
        test.innerHTML += "<p>".concat(generateQuestion('+'), "</p>");
        test.innerHTML += "<p>".concat(generateQuestion('-'), "</p>");
        test.innerHTML += "<p>".concat(generateQuestion('*'), "</p>");
        test.innerHTML += "<p>".concat(generateQuestion('/'), "</p>");
        testsContainer === null || testsContainer === void 0 ? void 0 : testsContainer.appendChild(test);
    }
}
function generateQuestion(operator) {
    var num1 = Math.floor(Math.random() * 10) + 1;
    var num2 = Math.floor(Math.random() * 10) + 1;
    return "".concat(num1, " ").concat(operator, " ").concat(num2, " = ");
}
function submitAnswers() {
    var userAnswers = document.getElementById('answersInput').value.split(',');
    var resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';
    var correctCount = 0;
    userAnswers.forEach(function (answer, index) {
        var testNumber = Math.floor(index / 4) + 1;
        var operator = ['+', '-', '*', '/'][index % 4];
        var expectedAnswer = eval(generateQuestion(operator));
        if (parseInt(answer.trim()) === expectedAnswer) {
            correctCount++;
        }
        else {
            resultsContainer.innerHTML += "<p>Test ".concat(testNumber, ", Question ").concat(index % 4 + 1, ": Incorrect</p>");
        }
    });
    resultsContainer.innerHTML += "<h3>Result: ".concat(correctCount, " out of 40 correct</h3>");
}
