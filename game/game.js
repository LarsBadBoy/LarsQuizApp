const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];

let questions = [];

fetch(
    'https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple'
)
    .then((res) => {
        // console.log(res)
        // console.log(res.json())
        // var x = '{"response_code":0,"results":[{"category":"General Knowledge","type":"multiple","difficulty":"easy","question":"Where is the train station &quot;Llanfair&shy;pwllgwyngyll&shy;gogery&shy;chwyrn&shy;drobwll&shy;llan&shy;tysilio&shy;gogo&shy;goch&quot;?","correct_answer":"Wales","incorrect_answers":["Moldova","Czech Republic","Denmark"]},{"category":"General Knowledge","type":"multiple","difficulty":"easy","question":"What alcoholic drink is made from molasses?","correct_answer":"Rum","incorrect_answers":["Gin","Vodka","Whisky"]},{"category":"General Knowledge","type":"multiple","difficulty":"easy","question":"Which one of the following rhythm games was made by Harmonix?","correct_answer":"Rock Band","incorrect_answers":["Meat Beat Mania","Guitar Hero Live","Dance Dance Revolution"]},{"category":"General Knowledge","type":"multiple","difficulty":"easy","question":"Red Vines is a brand of what type of candy?","correct_answer":"Licorice","incorrect_answers":["Lollipop","Chocolate","Bubblegum"]},{"category":"General Knowledge","type":"multiple","difficulty":"easy","question":"Which of these colours is NOT featured in the logo for Google?","correct_answer":"Pink","incorrect_answers":["Yellow","Blue","Green"]},{"category":"General Knowledge","type":"multiple","difficulty":"easy","question":"Who is depicted on the US hundred dollar bill?","correct_answer":"Benjamin Franklin","incorrect_answers":["George Washington","Abraham Lincoln","Thomas Jefferson"]},{"category":"General Knowledge","type":"multiple","difficulty":"easy","question":"In which fast food chain can you order a Jamocha Shake?","correct_answer":"Arby&#039;s","incorrect_answers":["McDonald&#039;s","Burger King","Wendy&#039;s"]},{"category":"General Knowledge","type":"multiple","difficulty":"easy","question":"How many furlongs are there in a mile?","correct_answer":"Eight","incorrect_answers":["Two","Four","Six"]},{"category":"General Knowledge","type":"multiple","difficulty":"easy","question":"The Canadian $1 coin is colloquially known as a what?","correct_answer":"Loonie","incorrect_answers":["Boolie","Foolie","Moodie"]},{"category":"General Knowledge","type":"multiple","difficulty":"easy","question":"Which of the following blood component forms a plug at the site of injuries?","correct_answer":"Platelets","incorrect_answers":["Red blood cells","White blood cells","Blood plasma"]}]}'
        return res.json();
    })
    .then((loadedQuestions) => {
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });
            console.log(formattedQuestion)
            return formattedQuestion;
        });

        startGame();
    })
    .catch((err) => {
        console.error(err);
    });

//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 5;

startGame = () => {
    questionCounter = 0;
    score = 0;
    console.log("questions", [...questions])
    // availableQuesions = [...questions];
    var x = {answer : 1 , choice1 : "yesterday", choice2 : "tommorrow", choice3 : "today", choice4 : "future" , question: "gestern auf Englisch"}
    availableQuesions = [
        {answer : 2 , choice1 : "lost", choice2 : "tired", choice3 : "borring", choice4 : "line" , question: "müde auf Englisch"},
        {answer : 3 , choice1 : "cruse", choice2 : "reckless", choice3 : "journey", choice4 : "flight" , question: "Reise auf Englisch"},
        {answer : 3 , choice1 : "big", choice2 : "small", choice3 : "size", choice4 : "lock" , question: "Größe auf Englisch"},
        {answer : 2 , choice1 : "everyting", choice2 : "everything", choice3 : "everythin", choice4 : "everyything" , question: "alles auf Englisch"},
    ];
    console.log(availableQuesions)
    
    console.log(x)
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
};

getNewQuestion = () => {
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        //go to the end page
        return window.location.assign('../end/end.html');
    }
    questionCounter++;
    progressText.innerText = `Frage ${questionCounter}/${MAX_QUESTIONS}`;
    //Update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuesions.length);
    currentQuestion = availableQuesions[questionIndex];
    question.innerHTML = currentQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerHTML = currentQuestion['choice' + number];
    });

    availableQuesions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const classToApply =
            selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if (classToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});

incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
};
