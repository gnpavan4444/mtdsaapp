var _a, _b, _c, _d;
(_a = document.getElementById('createTestBtn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', createTests);
(_b = document.getElementById('submitBtn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', submitAnswers);
var correctAnswers = [];
function createTests() {
    var testsContainer = document.getElementById('testsContainer');
    testsContainer.innerHTML = '';
    correctAnswers = []; // Reset correctAnswers array
    for (var i = 1; i <= 4; i++) {
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
    // Ensure subtraction numbers are not negative
    if (operator === '-' && num1 < num2) {
        var temp = num1;
        num1 = num2;
        num2 = temp;
    }
    // Ensure division numbers are properly divisible and num1 > num2
    if (operator === '/') {
        num2 = num2 === 0 ? 1 : num2;
        var newNum1 = num1 * num2;
        num1 = newNum1;
    }
    return "".concat(num1, " ").concat(operator, " ").concat(num2, " = <input type=\"text\" class=\"answerInput\" data-operator=\"").concat(operator, "\" data-num1=\"").concat(num1, "\" data-num2=\"").concat(num2, "\">");
}
function submitAnswers() {
    var userAnswers = document.querySelectorAll('.answerInput');
    var resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';
    correctAnswers = []; // Reset correctAnswers array
    var correctCount = 0;
    var unansweredFound = false;
    var firstUnansweredField = null;
    userAnswers.forEach(function (answerInput) {
        var operator = answerInput.dataset.operator;
        var num1 = parseInt(answerInput.dataset.num1 || '0', 10);
        var num2 = parseInt(answerInput.dataset.num2 || '0', 10);
        var expectedAnswer = eval("".concat(num1, " ").concat(operator, " ").concat(num2));
        correctAnswers.push(expectedAnswer); // Store correct answers for displaying later
        var answerValue = answerInput.value.trim();
        if (answerValue === '') {
            unansweredFound = true;
            answerInput.style.borderColor = 'red';
            if (!firstUnansweredField) {
                firstUnansweredField = answerInput;
            }
        }
        else {
            answerInput.style.borderColor = ''; // Reset border color
        }
        if (answerValue === '' || parseInt(answerValue, 10) !== expectedAnswer) {
            correctCount++;
        }
    });
    if (unansweredFound) {
        // Display message and scroll to the first unanswered field
        alert('Please answer all questions.');
        if (firstUnansweredField) {
            firstUnansweredField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    else {
        var marksValue = document.getElementById('marksValue');
        if (marksValue) {
            marksValue.textContent = correctCount.toString();
        }
        // Display results page
        showResultsPage();
    }
}
function showResultsPage() {
    document.getElementById('mainPage').style.display = 'none';
    document.getElementById('resultsPage').style.display = 'block';
    var resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '<h3>Results:</h3>';
    correctAnswers.forEach(function (correctAnswer, index) {
        resultsContainer.innerHTML += "<p>Question ".concat(index + 1, ": Correct Answer - ").concat(correctAnswer, "</p>");
    });
}
function backToMainPage() {
    document.getElementById('mainPage').style.display = 'block';
    document.getElementById('resultsPage').style.display = 'none';
}
function newTest() {
    createTests();
    backToMainPage();
}
// Event listeners for the buttons on the results page
(_c = document.getElementById('backBtn')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', backToMainPage);
(_d = document.getElementById('newTestBtn')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', newTest);
