//Declare base variables
const BAS_URL = "https://opentdb.com/api.php?amount=11";
const TOTAL_CATEGORIES = "https://opentdb.com/api_category.php";
let index = 0;
let score = 0;

// Fetch data from API
async function fetchData(url) {
  const response = await fetch(url);
  return response.json();
}

// Fetch data of categories from API
async function fetchCategoriesAPI() {
  const data = await fetchData(TOTAL_CATEGORIES);
  return data.trivia_categories;
}

// Fetch questions and return object with questions and answers
async function fetchQuestionsAPI(url) {
  const data = await fetchData(url);
  if (data.response_code === 0) {
    const questions = data.results;
    const list = [];
    questions.forEach((element) => {
      const question = {
        question: decodeSpecialChars(element.question),
        answers: shuffle(
          element.incorrect_answers.concat(element.correct_answer)
        ),
        correct: decodeSpecialChars(element.correct_answer),
      };
      list.push(question);
    });
    return list;
  }
  return false;
}

// decodes special HTML characters
let decodeSpecialChars = (specialCharacterString) => {
  const text = document.createElement("textarea");
  text.innerHTML = specialCharacterString;
  return text.value;
};

// Shuffling algorithm
let shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

// Decides title based off the API's title
let questionTitle = (string) => {
  const title = document.getElementById("title");
  title.innerText = string;
};

// Hides buttons from the div
let hideButtons = () => {
  const div = document.getElementById("buttons");
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
};

// Shows the question number on the bottom
let showQuestionNumber = () => {
  let questionNumber = index + 1;
  const h1Element = document.getElementById("question-number");
  h1Element.classList.add("number");
  h1Element.innerText = questionNumber + "/10";
};

// Function to set button for every question
let setQuestionButtons = (list, answers, correct) => {
  const div = document.getElementById("buttons");
  showQuestionNumber();
  answers.forEach((element) => {
    const button = document.createElement("button");
    const text = document.createTextNode(decodeSpecialChars(element)); // This decodes special characters from some answers
    button.appendChild(text);
    button.classList.add("btn");
    div.appendChild(button);
    button.addEventListener("click", () =>
      questionButtonEventHandler(button, correct, list)
    );
  });
};

// Event for question buttons
let questionButtonEventHandler = (button, correctAnswer, list) => {
  const pressedButton = button.innerText;
  if (pressedButton === correctAnswer) {
    score++;
    alert("Correct answer!");
  } else {
    alert("That is wrong :(\nCorrect Answer: " + correctAnswer);
  }
  index++;
  hideButtons();
  startQuiz(list);
};

// Removes the question number from the bottom
let removeQuestionNumber = () => {
  const h1Element = document.getElementById("question-number");
  h1Element.classList.remove("number");
  h1Element.innerText = "";
};

// Shows a restart button when the quiz is over
let showRestartButton = () => {
  removeQuestionNumber();
  const div = document.getElementById("buttons");
  const button = document.createElement("button");
  const text = document.createTextNode("Restart");
  button.classList.add("btn");
  button.appendChild(text);
  div.appendChild(button);
  button.addEventListener("click", () => document.location.reload(true));
};

// Starts the game, loads one question at a time, show the end score once the number of questions has reached the length of the list
let startQuiz = (questionList) => {
  const numberOfQuestions = questionList.length - 1;
  if (index === numberOfQuestions) {
    questionTitle("Well done! Your score was " + score + "/10!");
    showRestartButton();
    return;
  }
  questionTitle(questionList[index].question);
  setQuestionButtons(
    questionList,
    questionList[index].answers,
    questionList[index].correct
  );
};

// Makes categories from API into buttons
async function setCategoryButtons() {
  const categories = await fetchCategoriesAPI();
  const buttonList = document.getElementById("buttons");

  for (const category of categories) {
    const button = document.createElement("button");
    const text = document.createTextNode(category.name);
    button.setAttribute("id", category.id);
    button.classList.add("btn");
    button.appendChild(text);
    buttonList.appendChild(button);
    button.addEventListener("click", () => categoryButtonEventHandler(button));
  }
}

// Event for the category buttons to handle the correct category
async function categoryButtonEventHandler(button) {
  const url = BAS_URL + "&category=" + button.id;
  const list = await fetchQuestionsAPI(url);
  if (list === false) {
    alert("Oops, something went wrong. Please try again later.");
    return;
  }
  hideButtons();
  startQuiz(list);
}

let main = () => {
  questionTitle("Quiz Categories");
  setCategoryButtons();
};

main();
