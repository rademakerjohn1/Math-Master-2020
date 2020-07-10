document.addEventListener("DOMContentLoaded", function (event) {

    var stats = JSON.parse(window.localStorage.getItem('stats')) || [];

    var operatorBtns = document.querySelectorAll(".operator-chooser");
    var difficultyBtns = document.querySelectorAll(".difficulty-chooser");

    let difficulty;
    let operator;
    let correct;
    let incorrect;

    let mixed = false;

    for (const operatorBtn of operatorBtns) {
        operatorBtn.addEventListener("click", function (event) {
            event.preventDefault();
            operator = operatorBtn.id;
            if (operator === "mixed") mixed = true;
            toggleSectionDisplay("operator-buttons", "difficulty-buttons");
        })
    }

    for (const difficultyBtn of difficultyBtns) {
        difficultyBtn.addEventListener("click", function (event) {
            event.preventDefault();
            timer();
            document.getElementById("corner-link").removeAttribute("href");
            difficulty = difficultyBtn.id;
            toggleSectionDisplay("configure-settings", "question-section");
            questionInit()
        });
    }

    function toggleSectionDisplay(section1, section2) {
        document.getElementById(section1).style.display = "none";
        document.getElementById(section2).style.display = "initial";
    }

    function timer() {
        let seconds = 90;
        correct = incorrect = 0;
        document.getElementById("timer").innerHTML = `Time: ${seconds}`;
        var timer = setInterval(() => {
            seconds--;
            document.getElementById("timer").innerHTML = `Time: ${seconds}`;
            if (seconds === 0) endQuiz(timer)
        }, 1000)
    }

    function questionInit() {
        document.getElementById("user-answer").value = "";
        if (mixed) {
            let operatorSet = ["+", "-", "*", "/"];
            operator = operatorSet[Math.floor(Math.random() * 4)];
        } 
        switch (difficulty) {
            case "easy":
                generateEasy();
                break;
            case "medium":
                generateMedium();
                break;
            case "hard":
                generateHard();
                break;
        }
    }

    function generateEasy() {
        let num1, num2;
        if (operator === "+" || operator === "-" || operator === "*") {
            num1 = Math.floor(Math.random() * 12) + 1;
            num2 = Math.floor(Math.random() * 12) + 1;
        } else if (operator === "/") {
            num1 = Math.floor(Math.random() * 99) + 1;
            num2 = Math.floor(Math.random() * 12) + 1;
        }
        initEvaluate(num1, num2, operator)
    }

    function generateMedium() {
        let num1, num2;
        if (operator === "+" || operator === "-") {
            num1 = Math.floor(Math.random() * (100 - 11) + 11);
            num2 = Math.floor(Math.random() * (100 - 11) + 11);
        } else if (operator === "*") {
            num1 = Math.floor(Math.random() * (100 - 11) + 11);
            num2 = Math.floor(Math.random() * 10) + 1;
        } else if (operator === "/") {
            num1 = Math.floor(Math.random() * (999 - 100) + 100);
            num2 = Math.floor(Math.random() * 10) + 1;
        }
        initEvaluate(num1, num2, operator);
    }

    function generateHard() {
        let num1, num2;
        if (operator === "+" || operator === "-") {
            num1 = Math.floor(Math.random() * (999 - 100) + 100);
            num2 = Math.floor(Math.random() * (999 - 100) + 100);
        } else if (operator === "*") {
            num1 = Math.floor(Math.random() * (99 - 11) + 11);
            num2 = Math.floor(Math.random() * (99 - 11) + 11);
        } else if (operator === "/") {
            num1 = Math.floor(Math.random() * (9999 - 1000) + 1000);
            num2 = Math.floor(Math.random() * (99 - 11) + 11);
        }
        initEvaluate(num1, num2, operator);
    }

    function initEvaluate(num1, num2, operator) {
        let result = evaluateResult(num1, num2, operator);
        if (!result) questionInit();
        else renderQuestion(num1, num2, operator);
    }

    function evaluateResult(num1, num2, operation) {
        switch (operation) {
            case "+":
                return num1 + num2;
            case "-":
                if (num1 < num2) {
                    break;
                } else if (num1 >= num2) {
                    return num1 - num2;
                }
            case "*":
                if (num1 === 1 || num2 === 1) {
                    break;
                } else {
                    return num1 * num2;
                };
            case "/":
                if (num1 < num2 || num1 % num2 !== 0 || num2 === 1 || num1 === num2) {
                    break;
                } else if (num1 >= num2 && num1 % num2 === 0) {
                    return num1 / num2;
                }
        }
    }

    function renderQuestion(num1, num2, operator) {
        document.getElementById("question").innerHTML = `${num1} ${operator} ${num2}`;
        document.getElementById("user-answer").focus();
    }

    document.getElementById("answer-btn").addEventListener("click", function (event) {
        event.preventDefault();
        let answer = eval(document.getElementById("question").innerHTML);
        let userAnswer = parseInt(document.getElementById("user-answer").value);
        checkUserAnswer(answer, userAnswer);
    })

    function checkUserAnswer(answerNum, userNum) {
        if (!userNum || userNum === NaN) {
            document.getElementById("answer-alert").innerHTML = "Please enter a number!";
            alertClassToggle("answer-alert", "alert-success", "alert-danger");
        } else {
            if (userNum !== answerNum) {
                alertClassToggle("answer-alert", "alert-success", "alert-danger");
                incorrect++;
                document.getElementById("answer-alert").innerHTML = "Incorrect!"
            } else if (userNum === answerNum) {
                alertClassToggle("answer-alert", "alert-danger", "alert-success");
                correct++;
                document.getElementById("answer-alert").innerHTML = "Correct!"
            }
            questionInit();
        }
        alertDisplayToggle("answer-alert");
    }

    function alertClassToggle(alert, a, b) {
        if (document.getElementById(alert).classList.contains(a)) {
            document.getElementById(alert).classList.remove(a);
            document.getElementById(alert).classList.add(b);
        }
    }

    function alertDisplayToggle(id) {
        document.getElementById(id).style.display = "block";
        setTimeout(() => {
            document.getElementById(id).style.display = "none";
        }, 1000);
    }

    function endQuiz(interval) {
        clearInterval(interval);
        setTimeout(() => {
            renderFeedback();
        }, 1000)
    }

    function renderFeedback() {
        toggleSectionDisplay("question-section", "feedback-section");
        document.getElementById("user-name").focus();
        let final = calculateScore(correct, incorrect)
        if (final === 100) {
            message = "Wow! Perfect!"
        } else if (final > 89 && final < 100) {
            message = "Great job!"
        } else if (final > 69 && final < 90) {
            message = "Not too bad!"
        } else if (final < 70) {
            message = "Keep trying!"
        } else if (final === "N/A") {
            message = "Did you forget to answer?"
        }
        document.getElementById("readout").innerHTML =
            `You answered ${correct} out of ${correct + incorrect} questions correctly. ${message}`;
    }

    function calculateScore(a, b) {
        if (a + b === 0) return "N/A";
        else return Math.round((a / (a + b)) * 100);
    }

    function formatTime() {
        let time = new Date(Date.now()).toLocaleString().split(",")[1].trim();
        let arr = time.split(":")
        console.log(arr);
        return `${arr[0]}:${arr[1]} ${arr[2].slice(3)}`;
    }

    document.getElementById("user-name-btn").addEventListener("click", function (event) {

        event.preventDefault();

        if (mixed) operator = "mixed";

        let userName = document.getElementById("user-name").value;
        
        if (!userName || userName.length === 1 || !isNaN(userName)) {
            document.getElementById("name-alert").innerHTML = "Please enter your first and last initials!";
            document.getElementById("name-alert").style.display = "block";
            alertDisplayToggle("name-alert");
            return;
        }

        var userStats = {
            user: userName,
            operation: operator,
            difficulty: difficulty,
            correct: correct,
            incorrect: incorrect,
            score: calculateScore(correct, incorrect),
            date: new Date(Date.now()).toLocaleString().split(",")[0],
            time: formatTime()
        };

        stats.push(userStats);
        window.localStorage.setItem('stats', JSON.stringify(stats));
        window.location.href = "stats.html"
    })
    
    document.getElementById("user-answer").addEventListener("keyup", handleKey(event, "answer-btn"))
    document.getElementById("user-name").addEventListener("keyup", handleKey(event, "user-name-btn"))

    function handleKey(e, id) {
        if (e.keyCode === 13) document.getElementById(id).click();
    }
});
