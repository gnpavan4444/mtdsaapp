document.getElementById('createTestBtn')?.addEventListener('click', createTests);
document.getElementById('submitBtn')?.addEventListener('click', submitAnswers);

let correctAnswers: number[] = [];

function createTests() {
    const testsContainer = document.getElementById('testsContainer');
    testsContainer.innerHTML = '';
    correctAnswers = []; // Reset correctAnswers array

    for (let i = 1; i <= 4; i++) {
        const test = document.createElement('div');
        test.innerHTML = `<h3>Test ${i}</h3>`;
        test.innerHTML += `<p>${generateQuestion('+')}</p>`;
        test.innerHTML += `<p>${generateQuestion('-')}</p>`;
        test.innerHTML += `<p>${generateQuestion('*')}</p>`;
        test.innerHTML += `<p>${generateQuestion('/')}</p>`;
        testsContainer?.appendChild(test);
    }
}

function generateQuestion(operator: string): string {
    let num1 = Math.floor(Math.random() * 10) + 1;
    let num2 = Math.floor(Math.random() * 10) + 1;

    // Ensure subtraction numbers are not negative
    if (operator === '-' && num1 < num2) {
        const temp = num1;
        num1 = num2;
        num2 = temp;
    }

    // Ensure division numbers are properly divisible and num1 > num2
    if (operator === '/') {
        num2 = num2 === 0 ? 1 : num2;
        const newNum1 = num1 * num2;
        num1 = newNum1;
    }

    return `${num1} ${operator} ${num2} = <input type="text" class="answerInput" data-operator="${operator}" data-num1="${num1}" data-num2="${num2}">`;
}

function submitAnswers() {
    const userAnswers = document.querySelectorAll('.answerInput') as NodeListOf<HTMLInputElement>;
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';

    correctAnswers = []; // Reset correctAnswers array

    let correctCount = 0;
    let unansweredFound = false;
    let firstUnansweredField: HTMLInputElement | null = null;

    userAnswers.forEach((answerInput) => {
        const operator = answerInput.dataset.operator;
        const num1 = parseInt(answerInput.dataset.num1 || '0', 10);
        const num2 = parseInt(answerInput.dataset.num2 || '0', 10);
        const expectedAnswer = eval(`${num1} ${operator} ${num2}`);

        correctAnswers.push(expectedAnswer); // Store correct answers for displaying later

        const answerValue = answerInput.value.trim();

        if (answerValue === '') {
            unansweredFound = true;
            answerInput.style.borderColor = 'red';

            if (!firstUnansweredField) {
                firstUnansweredField = answerInput;
            }
        } else {
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
    } else {
        const marksValue = document.getElementById('marksValue');
        if (marksValue) {
            marksValue.textContent = correctCount.toString();
        }

        // Display results page
        showResultsPage();
    }
}

function showResultsPage() {
    document.getElementById('mainPage')!.style.display = 'none';
    document.getElementById('resultsPage')!.style.display = 'block';

    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '<h3>Results:</h3>';

    correctAnswers.forEach((correctAnswer, index) => {
        resultsContainer.innerHTML += `<p>Question ${index + 1}: Correct Answer - ${correctAnswer}</p>`;
    });
}

function backToMainPage() {
    document.getElementById('mainPage')!.style.display = 'block';
    document.getElementById('resultsPage')!.style.display = 'none';
}

function newTest() {
    createTests();
    backToMainPage();
}

// Event listeners for the buttons on the results page
document.getElementById('backBtn')?.addEventListener('click', backToMainPage);
document.getElementById('newTestBtn')?.addEventListener('click', newTest);
