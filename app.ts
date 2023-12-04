document.getElementById('createTestBtn')?.addEventListener('click', createTests);
document.getElementById('submitBtn')?.addEventListener('click', submitAnswers);
document.getElementById('showResultsButton')?.addEventListener('click', showResultsPage);

let correctAnswers: number[] = [];
let questions: string[] = [];
let actualAnswers:string[] = [];
let correctCount:number = 0; 

function createTests() {
    const testsContainer = document.getElementById('testsContainer');
    testsContainer.innerHTML = '';
    correctAnswers = []; // Reset correctAnswers array

    for (let i = 1; i <= 5; i++) {
        const test = document.createElement('div');
        test.innerHTML = `<h3>Test ${i}</h3>`;
        test.innerHTML += `<p>${generateQuestion('+')}</p>`;
        test.innerHTML += `<p>${generateQuestion('-')}</p>`;
        test.innerHTML += `<p>${generateQuestion('*')}</p>`;
        //test.innerHTML += `<p>${generateQuestion('/')}</p>`;
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
    actualAnswers = [];

    let unansweredFound = false;
    let firstUnansweredField: HTMLInputElement | null = null;

    userAnswers.forEach((answerInput) => {
        const operator = answerInput.dataset.operator;
        const num1 = parseInt(answerInput.dataset.num1 || '0', 10);
        const num2 = parseInt(answerInput.dataset.num2 || '0', 10);
        questions.push(`${num1} ${operator} ${num2}`);
        const expectedAnswer = eval(`${num1} ${operator} ${num2}`);

        correctAnswers.push(expectedAnswer); // Store correct answers for displaying later

        const answerValue = answerInput.value.trim();
        actualAnswers.push(answerValue);

        if (answerValue === '') {
            unansweredFound = true;
            answerInput.style.borderColor = 'red';

            if (!firstUnansweredField) {
                firstUnansweredField = answerInput;
            }
        } else {
            answerInput.style.borderColor = ''; // Reset border color
        }


        if (parseInt(answerValue, 10) === expectedAnswer) {
            answerInput.style.border = '4px solid green';
            correctCount++;
        } else {
            answerInput.style.border = '4px solid red';
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
        //alert(`Total marks are ${correctCount}`);

        // Display results page
        showResultsButton();
        userAnswers.forEach((userInput) => {
            userInput.disabled = true;
            userInput.style.backgroundColor = 'silver';
        })
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
    const dynamicImage:HTMLImageElement = document.getElementById("dynamicImage") as HTMLImageElement;
    if (correctCount > 10) {
        dynamicImage.setAttribute("src", "./images/img_happy.gif");
        //dynamicImage.src = "./images/img_happy.gif";
    } else {
        //dynamicImage.src = "./images/img.gif";
        dynamicImage.setAttribute("src", "./images/img.gif");
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

// Event listeners for the buttons on the results page
document.getElementById('backBtn')?.addEventListener('click', backToMainPage);
document.getElementById('newTestBtn')?.addEventListener('click', newTest);
