
const questions = [
    { question: "What does HTML stand for?", options: ["Hyper Tool Markup Language", "Hyper Text Markup Language", "Hyperlinks Text Mark Language", "Home Tool Markup Language"], correct: 1 },
    { question: "Which tag is used for the largest heading?", options: ["<h6>", "<head>", "<h1>", "<heading>"], correct: 2 },
    { question: "Which attribute is used for an image source?", options: ["link", "src", "href", "path"], correct: 1 },
    { question: "Which CSS property changes text color?", options: ["font-color", "text-color", "color", "text-style"], correct: 2 },
    { question: "How do you write a comment in HTML?", options: ["// comment", "/* comment */", "<!-- comment -->", "# comment"], correct: 2 },
    { question: "Which CSS property controls spacing inside an element?", options: ["margin", "padding", "border", "spacing"], correct: 1 },
    { question: "Which tag is used to create a line break?", options: ["<lb>", "<br>", "<break>", "<line>"], correct: 1 },
    { question: "Which display property makes elements flexible?", options: ["block", "inline", "flex", "grid"], correct: 2 },
    { question: "Which property is used to center text?", options: ["align", "text-align", "center", "align-text"], correct: 1 },
    { question: "Which HTML element is used for a paragraph?", options: ["<para>", "<p>", "<text>", "<pg>"], correct: 1 },
    { question: "Which CSS property sets background color?", options: ["bg-color", "color", "background-color", "bgcolor"], correct: 2 },
    { question: "Which tag is used to create a hyperlink?", options: ["<a>", "<link>", "<href>", "<url>"], correct: 0 },
    { question: "What is the default position value in CSS?", options: ["relative", "absolute", "static", "fixed"], correct: 2 },
    { question: "Which unit is relative in CSS?", options: ["px", "cm", "em", "mm"], correct: 2 },
    { question: "Which property is used to make text bold?", options: ["font-style", "font-weight", "text-bold", "bold"], correct: 1 },
    { question: "Which HTML tag is used for lists?", options: ["<list>", "<ul>", "<li>", "Both B and C"], correct: 3 },
    { question: "Which CSS property controls element width?", options: ["size", "width", "length", "element-width"], correct: 1 },
    { question: "Which selector selects all elements?", options: ["#", ".", "*", "all"], correct: 2 },
    { question: "Which tag is used to insert a table row?", options: ["<td>", "<tr>", "<th>", "<row>"], correct: 1 },
    { question: "Which CSS property adds shadow to text?", options: ["text-shadow", "font-shadow", "shadow", "text-effect"], correct: 0 }
];

// Global variables
let timer;
let timeLeft = 30 * 60; // 30 minutes in seconds
let studentInfo = {};
let answers = [];
let score = 0;
let currentQuestion = 0;
let hasSubmitted = false;

// DOM elements
const registrationForm = document.getElementById('registration-form');
const testForm = document.getElementById('test-form');
const resultsDiv = document.getElementById('results');
const quizForm = document.getElementById('quiz-form');
const timerElement = document.getElementById('timer');
const timerText = document.getElementById('timer-text');
const progressBar = document.getElementById('progress');
const progressAnswered = document.getElementById('progress-answered');
const progressTotal = document.getElementById('progress-total');
const submitBtn = document.getElementById('submit-btn');
const submitSpinner = document.getElementById('submit-spinner');
const alreadyTakenMessage = document.getElementById('already-taken-message');
const questionNav = document.getElementById('question-nav');
const startTestBtn = document.getElementById('start-test-btn');

// Initialize the app
function init() {
    // Check if student has already taken the test
    checkIfTestTaken();

    // Set up event listeners
    document.getElementById('reg-form').addEventListener('submit', handleRegistration);
    submitBtn.addEventListener('click', handleSubmit);
}

// Check if test has already been taken by this enrollment number
function checkIfTestTaken() {
    const takenEnrollments = JSON.parse(localStorage.getItem('takenEnrollments') || '[]');
    const enrollmentInput = document.getElementById('enrollment');

    enrollmentInput.addEventListener('blur', function () {
        const enrollment = this.value.trim();
        if (enrollment && takenEnrollments.includes(enrollment)) {
            alreadyTakenMessage.classList.remove('hidden');
            startTestBtn.disabled = true;
        } else {
            alreadyTakenMessage.classList.add('hidden');
            startTestBtn.disabled = false;
        }
    });
}

// Handle registration form submission
function handleRegistration(e) {
    e.preventDefault();

    const enrollment = document.getElementById('enrollment').value.trim();
    const takenEnrollments = JSON.parse(localStorage.getItem('takenEnrollments') || '[]');

    // Double check if enrollment is already in the list
    if (takenEnrollments.includes(enrollment)) {
        alert('You have already taken this test with this enrollment number.');
        return;
    }

    // Get student info
    studentInfo = {
        name: document.getElementById('name').value,
        enrollment: enrollment,
        batch: document.getElementById('batch').value
    };

    // Initialize answers array
    answers = new Array(questions.length).fill(-1);

    // Show test form
    registrationForm.classList.add('hidden');
    testForm.classList.remove('hidden');
    timerElement.classList.remove('hidden');

    // Generate questions
    generateQuestions();
    generateQuestionNav();

    // Start timer
    startTimer();

    // Show notification
    alert('Assessment started! You have 30 minutes to complete.');
}

// Generate question navigation buttons
function generateQuestionNav() {
    for (let i = 0; i < questions.length; i++) {
        const btn = document.createElement('button');
        btn.className = 'question-nav-btn';
        btn.textContent = i + 1;
        btn.dataset.index = i;

        if (i === 0) btn.classList.add('current');

        btn.addEventListener('click', function () {
            // Hide all questions
            document.querySelectorAll('.question-container').forEach(q => {
                q.classList.add('hidden');
            });

            // Show selected question
            document.querySelector(`.question-container[data-index="${i}"]`).classList.remove('hidden');

            // Update navigation buttons
            document.querySelectorAll('.question-nav-btn').forEach(b => {
                b.classList.remove('current');
            });
            this.classList.add('current');

            currentQuestion = i;
        });

        questionNav.appendChild(btn);
    }
}

// Generate questions
function generateQuestions() {
    const questionsContainer = document.createElement('div');

    questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-container';
        questionDiv.dataset.index = index;

        // Hide all questions except the first one
        if (index !== 0) {
            questionDiv.classList.add('hidden');
        }

        const questionHeader = document.createElement('div');
        questionHeader.className = 'question-header';

        const questionNumber = document.createElement('div');
        questionNumber.className = 'question-number';
        questionNumber.textContent = index + 1;

        const questionText = document.createElement('div');
        questionText.className = 'question-text';
        questionText.textContent = q.question;

        questionHeader.appendChild(questionNumber);
        questionHeader.appendChild(questionText);
        questionDiv.appendChild(questionHeader);

        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'options';

        q.options.forEach((option, optionIndex) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option';

            const optionInput = document.createElement('input');
            optionInput.type = 'radio';
            optionInput.id = `q${index}o${optionIndex}`;
            optionInput.name = `q${index}`;
            optionInput.value = optionIndex;

            const optionLabel = document.createElement('label');
            optionLabel.htmlFor = `q${index}o${optionIndex}`;
            optionLabel.textContent = option;

            optionInput.addEventListener('change', () => {
                answers[index] = optionIndex;
                updateProgress();
                updateQuestionNav();
            });

            optionDiv.appendChild(optionInput);
            optionDiv.appendChild(optionLabel);
            optionsDiv.appendChild(optionDiv);
        });

        questionDiv.appendChild(optionsDiv);
        questionsContainer.appendChild(questionDiv);
    });

    quizForm.insertBefore(questionsContainer, submitBtn.parentElement);
}

// Update question navigation buttons
function updateQuestionNav() {
    document.querySelectorAll('.question-nav-btn').forEach((btn, index) => {
        if (answers[index] !== -1) {
            btn.classList.add('answered');
        } else {
            btn.classList.remove('answered');
        }
    });
}

// Update progress bar
function updateProgress() {
    const answered = answers.filter(a => a !== -1).length;
    const progress = (answered / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressAnswered.textContent = `${answered} answered`;
}

// Start timer
function startTimer() {
    updateTimerDisplay();

    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            clearInterval(timer);
            handleSubmit();
        }
    }, 1000);
}

// Update timer display
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerText.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Change color when time is running out
    if (timeLeft <= 300) { // Less than 5 minutes
        timerElement.classList.add('danger');
        timerElement.classList.remove('warning');
    } else if (timeLeft <= 600) { // Less than 10 minutes
        timerElement.classList.add('warning');
        timerElement.classList.remove('danger');
    }
}

// Handle test submission
function handleSubmit() {
    if (hasSubmitted) return;

    const unanswered = answers.filter(a => a === -1).length;
    let confirmMessage = 'Are you sure you want to submit the assessment?';

    if (unanswered > 0) {
        confirmMessage = `You have ${unanswered} unanswered question(s). Are you sure you want to submit?`;
    }

    if (!confirm(confirmMessage)) {
        return;
    }

    // Stop timer
    clearInterval(timer);

    // Disable submit button to prevent multiple submissions
    hasSubmitted = true;
    submitBtn.disabled = true;
    submitSpinner.classList.remove('hidden');

    // Calculate score
    score = 0;
    answers.forEach((answer, index) => {
        if (answer === questions[index].correct) {
            score++;
        }
    });

    // Save to Google Sheets
    saveToGoogleSheets().then(() => {
        // Mark this enrollment as taken
        const takenEnrollments = JSON.parse(localStorage.getItem('takenEnrollments') || '[]');
        takenEnrollments.push(studentInfo.enrollment);
        localStorage.setItem('takenEnrollments', JSON.stringify(takenEnrollments));

        // Show results
        showResults();
    }).catch(error => {
        console.error('Error saving to Google Sheets:', error);
        // Still show results even if saving fails
        showResults();
    }).finally(() => {
        submitSpinner.classList.add('hidden');
    });
}

// Save data to Google Sheets
function saveToGoogleSheets() {
    return new Promise((resolve, reject) => {
        const googleScriptURL = "https://script.google.com/macros/s/AKfycbxDJYWRWz994efI5neyZrCSNgXq8infenX8plUNlSbpwO8dl56jGrHPacPM5Q2cEYzwDw/exec";
        const dataToSend = {
            studentInfo: studentInfo,
            answers: answers,
            score: score,
            timestamp: new Date().toISOString()
        };

        fetch(googleScriptURL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend)
        })
            .then(response => {
                console.log('Data sent to Google Sheets');
                resolve();
            })
            .catch(error => {
                console.error('Fetch Error:', error);
                reject(error);
            });
    });
}

// Show results
function showResults() {
    // Hide test form
    testForm.classList.add('hidden');

    // Show results
    resultsDiv.classList.remove('hidden');

    // Calculate percentage
    const percentage = Math.round((score / questions.length) * 100);

    // Update score circle
    document.getElementById('score-circle').style.setProperty('--score-percent', `${percentage}%`);
    document.getElementById('score-text').textContent = `${percentage}%`;

    // Update stats
    const correct = score;
    const incorrect = answers.filter((a, i) => a !== -1 && a !== questions[i].correct).length;
    const unanswered = answers.filter(a => a === -1).length;

    document.getElementById('correct-count').textContent = correct;
    document.getElementById('incorrect-count').textContent = incorrect;
    document.getElementById('unanswered-count').textContent = unanswered;
    document.getElementById('score-percent').textContent = `${percentage}%`;

    // Update result message
    let message = '';
    if (percentage >= 80) {
        message = 'Excellent! You have a strong understanding of HTML & CSS.';
    } else if (percentage >= 60) {
        message = 'Good job! You have a solid foundation in HTML & CSS.';
    } else if (percentage >= 40) {
        message = 'Not bad! Consider reviewing HTML & CSS fundamentals.';
    } else {
        message = 'You need more practice with HTML & CSS concepts.';
    }
    document.getElementById('result-message').textContent = message;

    // Show student details
    document.getElementById('student-details').innerHTML = `
                <strong>Name:</strong> ${studentInfo.name}<br>
                <strong>Enrollment:</strong> ${studentInfo.enrollment}<br>
                <strong>Batch:</strong> ${studentInfo.batch}<br>
                <strong>Score:</strong> ${score}/${questions.length}
            `;

    // Show detailed results
    const resultDetails = document.getElementById('result-details');
    resultDetails.innerHTML = '<h3>Answer Review</h3>';

    questions.forEach((q, index) => {
        const resultQuestion = document.createElement('div');
        resultQuestion.className = 'result-question';

        const questionText = document.createElement('p');
        questionText.innerHTML = `<strong>Q${index + 1}:</strong> ${q.question}`;
        resultQuestion.appendChild(questionText);

        const correctAnswer = document.createElement('p');
        correctAnswer.className = 'correct-answer';
        correctAnswer.innerHTML = `<i class="fas fa-check-circle"></i> <strong>Correct Answer:</strong> ${q.options[q.correct]}`;
        resultQuestion.appendChild(correctAnswer);

        if (answers[index] !== -1) {
            const yourAnswer = document.createElement('p');
            if (answers[index] === q.correct) {
                yourAnswer.className = 'correct-answer';
                yourAnswer.innerHTML = `<i class="fas fa-check-circle"></i> <strong>Your Answer:</strong> ${q.options[answers[index]]}`;
            } else {
                yourAnswer.className = 'incorrect-answer';
                yourAnswer.innerHTML = `<i class="fas fa-times-circle"></i> <strong>Your Answer:</strong> ${q.options[answers[index]]}`;
            }
            resultQuestion.appendChild(yourAnswer);
        } else {
            const noAnswer = document.createElement('p');
            noAnswer.className = 'incorrect-answer';
            noAnswer.innerHTML = `<i class="fas fa-times-circle"></i> <strong>Your Answer:</strong> Not answered`;
            resultQuestion.appendChild(noAnswer);
        }

        resultDetails.appendChild(resultQuestion);
    });

    // Show notification
    alert(`Assessment submitted! Your score: ${score}/${questions.length}`);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
