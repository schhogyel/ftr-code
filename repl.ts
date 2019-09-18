#!/usr/bin/env ts-node

//Input prompts
function questionPrompt(question: any) {
  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise<string>((resolve, error) => {
    rl.question(question, (answer: any) => {
      rl.close();
      resolve(answer);
    });
  });
}

//Store anwer in a object
function storeAnswer() {
  interface answerObj {
    [key: string]: any;
  }
  let answerObj: answerObj = {};

  function addAnswer(answer: string) {
    answerObj[answer] = (answerObj[answer] || 0) + 1;
  }

  return {
    answer: answerObj,
    addAnswer: addAnswer
  };
}

//display answer on console
function printAnswer(answer: any) {
  let answerArray = [];
  for (let [key, value] of Object.entries(answer)) {
    answerArray.push(`${key}: ${value}`);
  }
  console.log(`>> ${answerArray.join(", ")}`);
}

//timer function with start and pause
function timer(callbackFn: any) {
  let startTime: any;
  let secondsLeft: any;
  let timerId: any = null;
  let interval: any;

  function start(delay: any) {
    interval = delay;
    let startTimeStamp = Date.now();
    startTime = startTimeStamp;
    timerId = setInterval(() => {
      callbackFn();
    }, delay * 1000);
  }

  function pause() {
    clearInterval(timerId);
    let secondElaspedFromStart = Math.floor((Date.now() - startTime) / 1000);
    let secondsPassesAfterInterval = secondElaspedFromStart % interval;
    secondsLeft = interval - secondsPassesAfterInterval;
  }

  function resume() {
    timerId = setTimeout(() => {
      callbackFn();
      start(interval);
    }, secondsLeft);
  }

  return {
    start,
    pause,
    resume
  };
}

//caculate square
function isSquare(n: number) {
  return n > 0 && Math.sqrt(n) % 1 === 0;
}

//check if it belongs to fibonacci sequence
function isFibonacci(n: number) {
  return isSquare(5 * n * n + 4) || isSquare(5 * n * n - 4);
}

//main function
async function main() {
  let timerStatus: "start" | "pause";

  const { addAnswer, answer } = storeAnswer();
  const { start, pause, resume } = timer(() => printAnswer(answer));

  const time = await questionPrompt(
    ">> Please input the number of time in seconds between emitting numbers and their frequency\n"
  );
  const interval = Number(time);
  if (!Number.isNaN(interval)) {
    start(interval);
    timerStatus = "start";
    let answer = await questionPrompt(">> Please enter the first number\n");
    addAnswer(answer);

    while (answer) {
      if (answer === "quit") {
        console.log("Thanks for playing, Goodbye");
        process.exit(0);
      } else if (timerStatus === "pause" && answer !== "resume") {
        answer = await questionPrompt(">> Please type Resume\n");
      } else if (typeof answer === "string" && answer.trim() === "halt") {
        pause();
        answer = await questionPrompt(">> Timer halted\n");
        timerStatus = "pause";
      } else if (typeof answer === "string" && answer.trim() === "resume") {
        resume();
        answer = await questionPrompt(">> Resuming\n");
        timerStatus = "start";
      } else {
        answer = await questionPrompt(">> Please enter the next number\n");
        if (!Number.isNaN(Number(answer))) {
          isFibonacci(Number(answer)) && console.log(">> FIB\n");
          addAnswer(answer);
        }
      }
    }
  }

  process.on("SIGINT", function() {
    process.exit(0);
  });
}

main();
