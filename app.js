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
    testsContainer.innerHTML = '';
    correctAnswers = []; // Reset correctAnswers array
    var difficultyLevel = selectDifficulty();
    for (var i = 1; i <= 5; i++) {
        var test = document.createElement('div');
        test.innerHTML = "<h3>Test ".concat(i, "</h3>");
        test.innerHTML += "<p>".concat(generateQuestion('+', difficultyLevel), "</p>");
        test.innerHTML += "<p>".concat(generateQuestion('-', difficultyLevel), "</p>");
        test.innerHTML += "<p>".concat(generateQuestion('*', difficultyLevel), "</p>");
        //test.innerHTML += `<p>${generateQuestion('/')}</p>`;
        testsContainer === null || testsContainer === void 0 ? void 0 : testsContainer.appendChild(test);
    }
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
    if (!selectedDifficultyLevel) {
        alert('Please select a difficulty level');
        return;
    }
    return selectedDifficultyLevel;
}
function generateQuestion(operator, difficultyLevel) {
    var num1 = getRandomNumber(difficultyLevel);
    var num2 = getRandomNumber(difficultyLevel);
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
function getRandomNumber(difficulty) {
    switch (difficulty) {
        case Difficulty.Easy:
            return Math.floor(Math.random() * 8) + 2;
        case Difficulty.Medium:
            return Math.floor(Math.random() * 18) + 2;
        case Difficulty.Hard:
            return Math.floor(Math.random() * 29) + 2;
        default:
            return 0;
    }
}
function submitAnswers() {
    var userAnswers = document.querySelectorAll('.answerInput');
    var resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';
    correctAnswers = []; // Reset correctAnswers array
    actualAnswers = [];
    var unansweredFound = false;
    var firstUnansweredField = null;
    userAnswers.forEach(function (answerInput) {
        var operator = answerInput.dataset.operator;
        var num1 = parseInt(answerInput.dataset.num1 || '0', 10);
        var num2 = parseInt(answerInput.dataset.num2 || '0', 10);
        questions.push("".concat(num1, " ").concat(operator, " ").concat(num2));
        var expectedAnswer = eval("".concat(num1, " ").concat(operator, " ").concat(num2));
        correctAnswers.push(expectedAnswer); // Store correct answers for displaying later
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
            answerInput.style.borderColor = ''; // Reset border color
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
        //alert(`Total marks are ${correctCount}`);
        // Display results page
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
    var dynamicImage = document.getElementById("dynamicImage");
    if (correctCount === 15) {
        dynamicImage.setAttribute("src", "./images/image_perfect.gif");
    }
    else if (correctCount > 10) {
        dynamicImage.setAttribute("src", "./images/img_happy.gif");
        //dynamicImage.src = "./images/img_happy.gif";
    }
    else {
        //dynamicImage.src = "./images/img.gif";
        dynamicImage.setAttribute("src", "./images/img.gif");
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
// Event listeners for the buttons on the results page
(_d = document.getElementById('backBtn')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', backToMainPage);
(_e = document.getElementById('newTestBtn')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', newTest);
