var _a, _b, _c, _d, _e;
// Enums for difficulty levels
var Difficulty;
(function (Difficulty) {
    Difficulty["Easy"] = "easy";
    Difficulty["Medium"] = "medium";
    Difficulty["Hard"] = "hard";
})(Difficulty || (Difficulty = {}));
(_a = document.getElementById('createTestBtn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', createTests);
(_b = document.getElementById('submitBtn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', submitAnswers);
(_c = document.getElementById('showResultsButton')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', showResultsPage);
var correctAnswers = [];
var questions = [];
var actualAnswers = [];
var correctCount = 0;
function createTests() {
    var testsContainer = document.getElementById('testsContainer');
    var difficultyLevel = selectDifficulty();
    var selectedOperation = selectOperation();
    // Validate difficulty level and operation selection
    if (!difficultyLevel || !selectedOperation) {
        alert('Please select both difficulty level and operation.');
        return;
    }
    testsContainer.innerHTML = '';
    correctAnswers = [];
    questions = [];
    actualAnswers = [];
    correctCount = 0;
    var numberOfTests = 10;
    // Validate multiple tests option
    var enableMultipleTestsCheckbox = document.getElementById('enableMultipleTests');
    if (enableMultipleTestsCheckbox === null || enableMultipleTestsCheckbox === void 0 ? void 0 : enableMultipleTestsCheckbox.checked) {
        // Validate the number of tests input
        numberOfTests = parseInt(document.getElementById('numberOfTests').value, 10) || 1;
        if (numberOfTests <= 0) {
            alert('Please enter a valid number of tests.');
            return;
        }
    }
    // Create tests only if difficulty level and operation are selected
    for (var i = 1; i <= numberOfTests; i++) {
        var test = document.createElement('div');
        test.innerHTML = "<h3>Question ".concat(i, "</h3>");
        test.innerHTML += "<p>".concat(generateQuestion(selectedOperation, difficultyLevel), "</p>");
        testsContainer === null || testsContainer === void 0 ? void 0 : testsContainer.appendChild(test);
    }
    var submitButton = document.getElementById("submitBtn");
    submitButton.style.display = "block";
}
function selectDifficulty() {
    var difficultyRadioButtons = document.getElementsByName('difficulty');
    var selectedDifficultyLevel;
    // Find the selected difficulty
    difficultyRadioButtons.forEach(function (radioButton) {
        if (radioButton.checked) {
            selectedDifficultyLevel = radioButton.value;
        }
    });
    console.log('Selected Difficulty:', selectedDifficultyLevel); // Add this line for debugging
    if (!selectedDifficultyLevel) {
        alert('Please select a difficulty level');
        return;
    }
    return selectedDifficultyLevel;
}
function selectOperation() {
    var operationRadioButtons = document.getElementsByName('operation');
    var selectedOperation;
    // Find the selected operation
    operationRadioButtons.forEach(function (radioButton) {
        if (radioButton.checked) {
            selectedOperation = radioButton.value;
        }
    });
    if (!selectedOperation) {
        alert('Please select an operation type');
        return;
    }
    return selectedOperation;
}
function generateQuestion(operator, difficultyLevel) {
    var num1 = getRandomNumber(difficultyLevel);
    var num2 = getRandomNumber(difficultyLevel);
    // Adjust numbers based on operator
    switch (operator) {
        case 'subtraction':
            // Ensure subtraction numbers are not negative
            if (num1 < num2) {
                var temp = num1;
                num1 = num2;
                num2 = temp;
            }
            break;
        case 'division':
            // Ensure division numbers are properly divisible and num1 > num2
            num2 = num2 === 0 ? 1 : num2;
            var newNum1 = num1 * num2;
            num1 = newNum1;
            break;
        // Add cases for other operators if needed
        // For 'addition' and 'multiplication', no special handling needed
    }
    // Map operator to a more readable symbol
    var operatorSymbol = {
        'addition': '+',
        'subtraction': '-',
        'multiplication': '*',
        'division': '/',
    }[operator];
    // Evaluate the result
    var result = eval("".concat(num1, " ").concat(operatorSymbol, " ").concat(num2));
    // Display the question and result in the UI
    return "".concat(num1, " ").concat(operatorSymbol, " ").concat(num2, " = <input type=\"text\" class=\"answerInput\" data-operator=\"").concat(operatorSymbol, "\" data-num1=\"").concat(num1, "\" data-num2=\"").concat(num2, "\" data-result=\"").concat(result, "\">");
}
function getRandomNumber(difficulty) {
    switch (difficulty) {
        case Difficulty.Easy:
            return Math.floor(Math.random() * 8) + 2;
        case Difficulty.Medium:
            return Math.floor(Math.random() * 18) + 2;
        case Difficulty.Hard:
            return Math.floor(Math.random() * 20 + 11.5);
        default:
            return 0;
    }
}
function submitAnswers() {
    var userAnswers = document.querySelectorAll('.answerInput');
    var resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';
    correctAnswers = [];
    actualAnswers = [];
    var unansweredFound = false;
    var firstUnansweredField = null;
    userAnswers.forEach(function (answerInput) {
        var operator = answerInput.dataset.operator;
        var num1 = parseInt(answerInput.dataset.num1 || '0', 10);
        var num2 = parseInt(answerInput.dataset.num2 || '0', 10);
        questions.push("".concat(num1, " ").concat(operator, " ").concat(num2));
        var expectedAnswer = eval("".concat(num1, " ").concat(operator, " ").concat(num2));
        correctAnswers.push(expectedAnswer);
        var answerValue = answerInput.value.trim();
        actualAnswers.push(answerValue);
        if (answerValue === '') {
            unansweredFound = true;
            answerInput.style.borderColor = 'red';
            if (!firstUnansweredField) {
                firstUnansweredField = answerInput;
            }
        }
        else {
            answerInput.style.borderColor = '';
        }
        if (parseInt(answerValue, 10) === expectedAnswer) {
            answerInput.style.border = '4px solid green';
            correctCount++;
        }
        else {
            answerInput.style.border = '4px solid red';
        }
    });
    if (unansweredFound) {
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
        showResultsButton();
        userAnswers.forEach(function (userInput) {
            userInput.disabled = true;
            userInput.style.backgroundColor = 'silver';
        });
    }
}
function showResultsButton() {
    document.getElementById('showResultsButton').style.display = 'block';
    document.getElementById('createTestBtn').style.display = 'none';
    document.getElementById('submitBtn').style.display = 'none';
}
function showResultsPage() {
    document.getElementById('mainPage').style.display = 'none';
    document.getElementById('resultsPage').style.display = 'block';
    var dynamicImage = document.getElementById('dynamicImage');
    var percentageCorrect = (correctCount / questions.length) * 100;
    if (percentageCorrect > 90) {
        dynamicImage.setAttribute('src', './images/image_perfect.gif');
    }
    else if (percentageCorrect >= 80) {
        dynamicImage.setAttribute('src', './images/img_happy.gif');
    }
    else {
        dynamicImage.setAttribute('src', './images/img.gif');
    }
    var resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '<h3>Results:</h3>';
    var sampleElement = document.getElementById('numberOfMarks');
    sampleElement.innerHTML = "Number of marks are ".concat(correctCount);
    correctAnswers.forEach(function (correctAnswer, index) {
        resultsContainer.innerHTML += "<p>Question ".concat(index + 1, ": ").concat(questions[index], " => Your Answer - ").concat(actualAnswers[index], " => Correct Answer - ").concat(correctAnswer, "</p>");
    });
}
function backToMainPage() {
    document.getElementById('mainPage').style.display = 'block';
    document.getElementById('resultsPage').style.display = 'none';
}
function newTest() {
    createTests();
    backToMainPage();
    var marksValue = document.getElementById('marksValue');
    marksValue.textContent = '';
    document.getElementById('showResultsButton').style.display = 'none';
    document.getElementById('submitBtn').style.display = 'block';
    correctCount = 0;
}
(_d = document.getElementById('backBtn')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', backToMainPage);
(_e = document.getElementById('newTestBtn')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', newTest);
