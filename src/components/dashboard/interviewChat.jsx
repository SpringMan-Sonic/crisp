import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import { IoIosSend } from "react-icons/io";
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

  const { currentInterview } = useSelector((state) => state.interview);
  const {
    interviewChat = [],
    questions = [],
    currentQuestionIndex = 0,
    remainingTime = 0,
    answers = [],
  } = currentInterview || {};

  const dispatch = useDispatch();
  const hasInterviewStarted = interviewChat && interviewChat.length > 3;

  function handleStartInterview() {
    dispatch(
      addMessage({
        text: "I'm ready.",
        sender: "user",
        timeStamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      })
    );

    dispatch(
      addMessage({
        text: "Perfect. Here is question one for you.",
        sender: "bot",
        timeStamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      })
    );

    setTimeout(() => {
      dispatch(
        addMessage({
          text: questions[0]?.question,
          sender: "bot",
          timeStamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        })
      );

      dispatch(setQuestionIndex({ quesIndex: 0 }));
      setDisable(false);
    }, 500);
  }

  function onChangeHandler(e) {
    setAnswer(e.target.value);
  }

  function handleAnswerSubmition() {
    dispatch(addAnswer({ answer: answer.trim() || "No answer" }));
    setAnswer("");

    if (currentQuestionIndex >= questions.length - 1) {
      handleFinalEvaluation();
    }
  }

  async function handleFinalEvaluation() {
    try {
      setEvaluatingStatus(STATUS.LOADING);
      // mock evaluation for UI demo
      setTimeout(() => setEvaluatingStatus(STATUS.FINISHED), 1500);
    } catch (err) {
      toast.error(err.message || "Something went wrong during evaluation.");
      setEvaluatingStatus(STATUS.ERROR);
    }
  }

  function viewEvaluationOnClick() {
    if (evaluatingStatus === STATUS.ERROR) {
      handleFinalEvaluation();
    }
  }

  useEffect(() => {
    if (remainingTime <= 0) return;
    const intervalId = setInterval(() => dispatch(setRemainingTime()), 1000);
    return () => clearInterval(intervalId);
  }, [remainingTime, dispatch]);

  useEffect(() => {
    if (remainingTime === 0 && answers.length < 5) handleAnswerSubmition();
  }, [remainingTime]);

  return (
    <div className="min-h-[70vh] p-4 rounded-xl bg-gradient-to-b from-[#0b1d3a] to-[#10294d] text-white flex flex-col space-y-4 shadow-xl">
      
      {/* Chat Area */}
      <ScrollArea className="flex-1 w-full p-3 bg-[#112b4f] rounded-lg shadow-inner overflow-y-auto">
        {interviewChat.length > 0 ? (
          <div className="space-y-3">
            {interviewChat.map((msg, idx) => (
              <Message key={idx} message={msg} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-300">Your interview will appear here...</p>
        )}
      </ScrollArea>

      {/* Start Interview Button */}
      {!hasInterviewStarted ? (
        <div className="flex justify-center">
          <Button
            onClick={handleStartInterview}
            className="bg-gradient-to-r from-[#1a2b55] to-[#0c1b3c] hover:from-[#223366] hover:to-[#0f1d3c] text-yellow-400 font-bold px-6 py-2 rounded-lg shadow-md"
          >
            Click here when you're ready
          </Button>
        </div>
      ) : (
        <>
          {answers.length >= questions.length ? (
            <div className="flex justify-center">
              <Button
                disabled={evaluatingStatus === STATUS.LOADING}
                onClick={viewEvaluationOnClick}
                className="bg-gradient-to-r from-[#1a2b55] to-[#0c1b3c] text-yellow-400 font-semibold px-6 py-2 rounded-lg flex items-center gap-2 shadow-md hover:brightness-110"
              >
                {evaluatingStatus === STATUS.LOADING && <FaSpinner className="animate-spin h-5 w-5" />}
                {evaluatingStatus === STATUS.LOADING && " Brewing your results... ☕"}
                {evaluatingStatus === STATUS.ERROR && "Something Went Wrong. Retry"}
                {evaluatingStatus === STATUS.FINISHED && "See Evaluation Details"}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <Textarea
                disabled={disable}
                onChange={onChangeHandler}
                value={answer}
                ref={inputRef}
                placeholder="Type your answer here..."
                className="flex-1 bg-[#0e1f3d] text-white placeholder-gray-400 rounded-lg p-3 shadow-inner max-h-28"
              />
              <div className="flex flex-col gap-2 sm:w-24">
                <p
                  className={`text-center font-bold rounded-md py-1 ${
                    remainingTime < 11 ? "text-red-500" : "text-yellow-400"
                  } bg-[#112b4f] shadow-md`}
                >
                  {remainingTime}s
                </p>
                <Button
                  onClick={handleAnswerSubmition}
                  disabled={disable}
                  className="bg-yellow-400 text-[#0b1d3a] rounded-lg p-2 flex justify-center items-center hover:brightness-105 shadow-md"
                >
                  <IoIosSend />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
