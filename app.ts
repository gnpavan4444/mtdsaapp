// Enums for difficulty levels
enum Difficulty {
    Easy = 'easy',
    Medium = 'medium',
    Hard = 'hard',
}

document.getElementById('createTestBtn')?.addEventListener('click', createTests);
document.getElementById('submitBtn')?.addEventListener('click', submitAnswers);
document.getElementById('showResultsButton')?.addEventListener('click', showResultsPage);

let correctAnswers: number[] = [];
let questions: string[] = [];
let actualAnswers: string[] = [];
let correctCount: number = 0;

function createTests() {
    const testsContainer = document.getElementById('testsContainer');
    const difficultyLevel = selectDifficulty();
    const selectedOperation = selectOperation();

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

    let numberOfTests = 1;

    // Validate multiple tests option
    const enableMultipleTestsCheckbox = document.getElementById('enableMultipleTests') as HTMLInputElement;
    if (enableMultipleTestsCheckbox?.checked) {
        // Validate the number of tests input
        numberOfTests = parseInt((document.getElementById('numberOfTests') as HTMLInputElement).value, 10) || 1;
        if (numberOfTests <= 0) {
            alert('Please enter a valid number of tests.');
            return;
        }
    }

    // Create tests only if difficulty level and operation are selected
    for (let i = 1; i <= numberOfTests; i++) {
        const test = document.createElement('div');
        test.innerHTML = `<h3>Test ${i}</h3>`;
        test.innerHTML += `<p>${generateQuestion(selectedOperation, difficultyLevel)}</p>`;
        testsContainer?.appendChild(test);
    }
}

function selectDifficulty(): Difficulty | undefined {
    const difficultyRadioButtons = document.getElementsByName('difficulty');
    let selectedDifficultyLevel: Difficulty | undefined;

    // Find the selected difficulty
    difficultyRadioButtons.forEach((radioButton) => {
        if ((radioButton as HTMLInputElement).checked) {
            selectedDifficultyLevel = (radioButton as HTMLInputElement).value as Difficulty;
        }
    });

    console.log('Selected Difficulty:', selectedDifficultyLevel); // Add this line for debugging

    if (!selectedDifficultyLevel) {
        alert('Please select a difficulty level');
        return;
    }
    return selectedDifficultyLevel;
}

function selectOperation(): string | undefined {
    const operationRadioButtons = document.getElementsByName('operation');
    let selectedOperation: string | undefined;

    // Find the selected operation
    operationRadioButtons.forEach((radioButton) => {
        if ((radioButton as HTMLInputElement).checked) {
            selectedOperation = (radioButton as HTMLInputElement).value;
        }
    });

    if (!selectedOperation) {
        alert('Please select an operation type');
        return;
    }

    return selectedOperation;
}

function generateQuestion(operator: string, difficultyLevel: Difficulty): string {
    let num1 = getRandomNumber(difficultyLevel);
    let num2 = getRandomNumber(difficultyLevel);

    // Adjust numbers based on operator
    switch (operator) {
        case 'subtraction':
            // Ensure subtraction numbers are not negative
            if (num1 < num2) {
                const temp = num1;
                num1 = num2;
                num2 = temp;
            }
            break;
        case 'division':
            // Ensure division numbers are properly divisible and num1 > num2
            num2 = num2 === 0 ? 1 : num2;
            const newNum1 = num1 * num2;
            num1 = newNum1;
            break;
        // Add cases for other operators if needed

        // For 'addition' and 'multiplication', no special handling needed
    }

    // Map operator to a more readable symbol
    const operatorSymbol = {
        'addition': '+',
        'subtraction': '-',
        'multiplication': '×',
        'division': '÷',
    }[operator];

    // Evaluate the result
    const result = eval(`${num1} ${operatorSymbol} ${num2}`);

    // Display the question and result in the UI
    return `${num1} ${operatorSymbol} ${num2} = <input type="text" class="answerInput" data-operator="${operatorSymbol}" data-num1="${num1}" data-num2="${num2}" data-result="${result}">`;
}



function getRandomNumber(difficulty: Difficulty): number {
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
    const userAnswers = document.querySelectorAll('.answerInput') as NodeListOf<HTMLInputElement>;
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';

    correctAnswers = [];
    actualAnswers = [];

    let unansweredFound = false;
    let firstUnansweredField: HTMLInputElement | null = null;

    userAnswers.forEach((answerInput) => {
        const operator = answerInput.dataset.operator;
        const num1 = parseInt(answerInput.dataset.num1 || '0', 10);
        const num2 = parseInt(answerInput.dataset.num2 || '0', 10);
        questions.push(`${num1} ${operator} ${num2}`);
        const expectedAnswer = eval(`${num1} ${operator} ${num2}`);

        correctAnswers.push(expectedAnswer);

        const answerValue = answerInput.value.trim();
        actualAnswers.push(answerValue);

        if (answerValue === '') {
            unansweredFound = true;
            answerInput.style.borderColor = 'red';

            if (!firstUnansweredField) {
                firstUnansweredField = answerInput;
            }
        } else {
            answerInput.style.borderColor = '';
        }

        if (parseInt(answerValue, 10) === expectedAnswer) {
            answerInput.style.border = '4px solid green';
            correctCount++;
        } else {
            answerInput.style.border = '4px solid red';
        }
    });

    if (unansweredFound) {
        alert('Please answer all questions.');
        if (firstUnansweredField) {
            firstUnansweredField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    } else {
        const marksValue = document.getElementById('marksValue');
        if (marksValue) {
            marksValue.textContent = correctCount.toString();
        }
        showResultsButton();
        userAnswers.forEach((userInput) => {
            userInput.disabled = true;
            userInput.style.backgroundColor = 'silver';
        });
    }
}

function showResultsButton() {
    document.getElementById('showResultsButton')!.style.display = 'block';
    document.getElementById('createTestBtn')!.style.display = 'none';
    document.getElementById('submitBtn')!.style.display = 'none';
}

function showResultsPage() {
    document.getElementById('mainPage')!.style.display = 'none';
    document.getElementById('resultsPage')!.style.display = 'block';
    const dynamicImage: HTMLImageElement = document.getElementById('dynamicImage') as HTMLImageElement;
    const percentageCorrect = (correctCount / questions.length) * 100;
    if (percentageCorrect > 90) {
        dynamicImage.setAttribute('src', './images/image_perfect.gif');
    } else if (percentageCorrect >= 80) {
        dynamicImage.setAttribute('src', './images/img_happy.gif');
    } else {
        dynamicImage.setAttribute('src', './images/img.gif');
    }

    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '<h3>Results:</h3>';
    const sampleElement = document.getElementById('numberOfMarks');
    sampleElement.innerHTML = `Number of marks are ${correctCount}`;

    correctAnswers.forEach((correctAnswer, index) => {
        resultsContainer.innerHTML += `<p>Question ${index + 1}: ${questions[index]} => Your Answer - ${actualAnswers[index]} => Correct Answer - ${correctAnswer}</p>`;
    });
}

function backToMainPage() {
    document.getElementById('mainPage')!.style.display = 'block';
    document.getElementById('resultsPage')!.style.display = 'none';
}

function newTest() {
    createTests();
    backToMainPage();
    const marksValue = document.getElementById('marksValue');
    marksValue!.textContent = '';
    document.getElementById('showResultsButton')!.style.display = 'none';
    document.getElementById('submitBtn')!.style.display = 'block';
    correctCount = 0;
}

document.getElementById('backBtn')?.addEventListener('click', backToMainPage);
document.getElementById('newTestBtn')?.addEventListener('click', newTest);
