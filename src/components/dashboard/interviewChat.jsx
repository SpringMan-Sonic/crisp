import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import { IoIosSend } from "react-icons/io";
import { GrSend } from "react-icons/gr";
import { Button } from "../ui/button";
import Message from "./message";
import { useDispatch, useSelector } from "react-redux";
import {
  addAnswer,
  addMessage,
  completeInterview,
  setQuestionIndex,
  setRemainingTime,
} from "@/store/interviewSlice";
import { FaSpinner } from "react-icons/fa6";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "sonner";

const STATUS = {
  LOADING: "loading",
  ERROR: "error",
  FINISHED: "finished",
};
export default function InterviewChat() {
  const inputRef = useRef(null);

  const [disable, setDisable] = useState(false);
  const [answer, setAnswer] = useState("");

  const [evaluatingStatus, setEvaluatingStatus] = useState(STATUS.LOADING);

  const { currentInterview, currentStatus } = useSelector((state) => state.interview);

  
  const {
    interviewChat = [],
    questions = [],
    currentQuestionIndex = 0,
    remainingTime = 0,
    answers = [],
  } = currentInterview || {};

  const dispatch = useDispatch();

  const hasInterviewStarted = interviewChat && interviewChat.length > 3;

  // Actual interview start handler
  function handleStartInterview() {
    dispatch(
      addMessage({
        text: "I'm ready.",
        sender: "user",
        timeStamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      })
    );

    // info message
    dispatch(
      addMessage({
        text: "Perfect. Here is question one for you.",
        sender: "bot",
        timeStamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      })
    );

    //adding first question
    setTimeout(() => {
      dispatch(
        addMessage({
          text: questions[0].question,
          sender: "bot",
          timeStamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        })
      );

      dispatch(setQuestionIndex({ quesIndex: 0 }));
      setDisable(false);
    }, 500);
  }

  //textarea onChange handler
  function onChangeHandler(e) {
    setAnswer(e.target.value);
  }

  //handle Submit answer or NextQuestion
  function handleAnswerSubmition() {
    const dispatchObject = {
      answer: answer.trim() || "No answer",
    };
    dispatch(addAnswer(dispatchObject));

    setAnswer("");

    if (currentQuestionIndex >= questions.length - 1 ) {
      handleFinalEvaluation();
    }
  }

  //!Function to evaluate score
  async function handleFinalEvaluation() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const genAi = new GoogleGenerativeAI(apiKey);
    const model = genAi.getGenerativeModel({ model: "gemini-2.5-flash-lite-preview-06-17"  });

    const prompt = `
    You are an expert technical interviewer evaluating a candidate's performance for a Full Stack Developer role (React/Node.js).

I will provide you with two JSON arrays:
1.  'questions': An array of the questions asked.
2.  'answers': An array of the candidate's answers for each corresponding question.

Your task is to analyze the answers and provide a comprehensive evaluation based on the following marking scheme:
- **Easy** questions are out of 5 points.
- **Medium** questions are out of 10 points.
- **Hard** questions are out of 15 points.

Score each answer based on its accuracy, clarity, and technical depth relative to the question's difficulty.

You must respond ONLY with a single, valid JSON object. Do not include any introductory text, explanations, or markdown formatting like '''json.

The JSON object must have the following keys:
1.  "questionWiseScore": An array of objects, where each object represents a question and its evaluation. Each object in this array MUST contain the following keys:
    - "question": The original question text (string).
    - "answer": The candidate's answer (string).
    - "score": The score you awarded for the answer (number).
    - "outof": The maximum possible score for that question based on its difficulty (5, 10, or 15) (number).
    - "difficulty": The difficulty of the question (string).
2.  "score": The total score, which is the sum of all the individual scores from the 'questionWiseScore' array (number).
3.  "aiSummary": A brief, 2-3 sentence summary of the candidate's overall performance, highlighting strengths and areas for improvement.

Here is the interview data:

Questions:
${JSON.stringify(questions)}

Answers:
${JSON.stringify(answers)}
    `;

    try {
      setEvaluatingStatus(STATUS.LOADING);

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
       const cleanedText=text.replace(/```(?:json)?\n?/g, "").trim();
      const evaluation = JSON.parse(cleanedText);
      console.log("Evalaution : ",evaluation);
      dispatch(completeInterview(evaluation)) //dispatch action 
      setEvaluatingStatus(STATUS.FINISHED);
    } catch (err) {
      const errMessage =
        err.message || "An unknown error occurred while evaluating questions.";
      toast.error(errMessage);
      setEvaluatingStatus(STATUS.ERROR);
    }
  }

  function viewEvaluationOnCLick(){
    if(evaluatingStatus===STATUS.ERROR){
              handleFinalEvaluation();
    }else{
      console.log("Okdks a as")
    }
  }

  useEffect(() => {
    // Don't start a timer if time is already up
    if (remainingTime <= 0) {
      return;
    }

    //update remaining time each second
    const intervalId = setInterval(() => {
      dispatch(setRemainingTime());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [remainingTime, dispatch]);

  useEffect(() => {
    if (remainingTime === 0 && answers.length < 5) {
      console.log("Auto-submitting answer...");
      handleAnswerSubmition();
    }
  }, [remainingTime]);

  return (
    <div className="-z-10">
      <ScrollArea className={"h-[60vh] w-full mb-4"}>
        {interviewChat && interviewChat.length > 0 ? (
          <div className="space-y-4">
            {interviewChat.map((item, index) => {
              return <Message key={index} message={item} />;
            })}
          </div>
        ) : (
          <></>
        )}
      </ScrollArea>
      {!hasInterviewStarted ? (
        <>
          <div className="w-full flex justify-center">
            <Button
              onClick={handleStartInterview}
              className={"cursor-pointer "}
            >
              Click here when you're ready
            </Button>
          </div>
        </>
      ) : (
        <>
          {
            // if all questions and answer completed
            answers && answers.length>=6 ? (
              <div className="w-full flex justify-center">
                <Button disabled = {evaluatingStatus===STATUS.LOADING } onClick={viewEvaluationOnCLick}  className={"cursor-pointer "}>
                  {evaluatingStatus===STATUS.LOADING  && (
                    <>
                      <FaSpinner className="animate-spin h-4 w-4" />
                      Brewing your results... ☕
                      {/* <CgSandClock className="animate-spin h-4 w-4" /> */}
                    </>
                  ) }
                   
                   {
                    evaluatingStatus===STATUS.ERROR && (
                    <>Something Went Wrong. Retry</>
                  )
                   }

                   {
                    evaluatingStatus===STATUS.FINISHED && (
                    <>See Evaluation Details</>
                  )
                   }
                </Button>
              </div>
            ) : (
              <div className="mt-2 flex gap-4 flex-col sm:flex-row ">
                <Textarea
                  disabled={disable}
                  onChange={onChangeHandler}
                  value={answer}
                  ref={inputRef}
                  className={" max-h-20"}
                  placeholder="Type your answer here."
                />
                <div className="flex sm:flex-col gap-1">
                  <p
                    className={`bg-sky-50 ${
                      remainingTime < 11 ? "text-red-700" : "text-black"
                    } sm:h-full rounded-md text-center w-[50%]  sm:w-full  flex items-center justify-center text-xs font-bold`}
                  >
                    {remainingTime}s
                  </p>
                  <Button
                    onClick={handleAnswerSubmition}
                    disabled={disable}
                    className=" sm:h-[47%] flex-1 text-white gradient-primary cursor-pointer"
                  >
                    <IoIosSend />
                    {/* <GrSend /> */}
                  </Button>
                </div>
              </div>
            )
          }
        </>
      )}
    </div>
  );
}