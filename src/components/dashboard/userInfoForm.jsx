import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PiExamLight } from "react-icons/pi";
import { RxCross2 } from "react-icons/rx";
import { STATUS } from "./interviewee";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FaSpinner } from "react-icons/fa6";
import { CgSandClock } from "react-icons/cg";
import { useDispatch } from "react-redux";
import { startInterview } from "@/store/interviewSlice";
import { toast } from "sonner";

export default function UserInfoForm({
  userInfo,
  fileName,
  setFileName,
  setUserInfo,
  setStatus,
}) {
  const [formField, setFormField] = useState(userInfo);
  const [allValuePresent, setAllValuePresent] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

 

  function onChangeHandler(e) {
    const { name: key, value } = e.target;

    setFormField((prev) => {
      return { ...prev, [key]: value };
    });
  }

  function fileNameOnClickHandler() {
    setFileName("");
    setUserInfo({ email: null, phone: null, name: null });
    setStatus(STATUS);
  }

  const validateForm = () => {
    const { name, email, phone } = formField;

    if (!name || name.trim() === "") {
      toast.error("Please enter your name.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    const phoneRegex = /^(?:\+91)?[6-9]\d{9}$/;
    if (!phone || !phoneRegex.test(phone.replace(/\s/g, ""))) {
      toast.error("Please enter a valid 10-digit Indian phone number.");
      return false;
    }

    return true;
  };

  

  async function prepareQuestion(e) {
    e.preventDefault();

     if (!validateForm()) {
      return;
    }

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const genAi = new GoogleGenerativeAI(apiKey);
    const model = genAi.getGenerativeModel({ model: "gemini-2.5-flash-lite-preview-06-17"  });

    const prompt = `You are an expert technical interviewer hiring for a Full Stack Developer role with a focus on React and Node.js.

Your task is to generate a total of 6 interview questions. The questions must be structured as follows:
- 2 questions of "Easy" difficulty. These should be quick, factual questions that can be answered in 2-3 words or in one line
- 2 questions of "Medium" difficulty. These should require a brief explanation of a core concept
- 2 questions of "Hard" difficulty. These should ask for a more in-depth explanation, a comparison of concepts, or a scenario-based problem 

Crucially, each question must be realistically answerable by a qualified candidate within the allotted time limit specified below.

You must respond ONLY with a valid JSON array of objects. Do not include any introductory text, explanations, or code formatting like \`\`\`json. The array should be the only thing in your response.

Each object in the array must have the following three keys:
1.  "question": The text of the interview question (string).
2.  "difficulty": The difficulty level, which must be one of "Easy", "Medium", or "Hard" (string).
3.  "timer": The time allotted in seconds for the question. This must be 20 for "Easy", 60 for "Medium", and 120 for "Hard" (number).

Here is an example of the required output structure:
[
  {
    "question": "What is the difference between 'let' and 'const' in JavaScript?",
    "difficulty": "Easy",
    "timer": 20
  },
  {
    "question": "Explain the concept of virtual DOM in React.",
    "difficulty": "Easy",
    "timer": 20
  },
  {
    "question": "Describe the event loop in Node.js.",
    "difficulty": "Medium",
    "timer": 60
  },
  {
    "question": "How do you handle authentication in a full-stack React/Node.js application?",
    "difficulty": "Medium",
    "timer": 60
  },
  {
    "question": "Explain how you would implement server-side rendering (SSR) for a React application and discuss its benefits.",
    "difficulty": "Hard",
    "timer": 120
  },
  {
    "question": "Describe a scenario where you would use WebSockets in a Node.js backend and how you would scale it for many concurrent connections.",
    "difficulty": "Hard",
    "timer": 120
  }
]
`;

// !Intro message for interview Chat
    const introMessages = [
      {
        sender: "bot",
        text: `Hello ${formField.name}! I've reviewed your resume. Welcome to the interview.`,
        timeStamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      {
        sender: "bot",
        text: "We will go through 6 questions with varying difficulty. The timer for each question will be visible near the textbox.",
        timeStamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      {
    sender: "bot",
    text: "Let me know when you're ready to begin.",
    timeStamp: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  },
    ];

    try {
      setLoading(true);

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
       const cleanedText=text.replace(/```(?:json)?\n?/g, "").trim();
      const questionsArray = JSON.parse(cleanedText);

      if (questionsArray && questionsArray.length) {
        toast.success("The interview is about to begin. All the best!");
        dispatch(
          startInterview({
            contactDetails: formField,
            questions: questionsArray,
            introMessages:introMessages
          })
        );
        setStatus((prev) => {
          return { ...prev, SHOWINFONEED: false, SHOWCHAT: true };
        });

        setUserInfo(null);
        setFileName(null);
      }
    } catch (err) {
      toast.error(
        err.message || "An unknown error occurred while generating questions."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (userInfo.name && userInfo.email && userInfo.phone) {
      setAllValuePresent(true);
    }
  }, []);

  return (
    <>
      <div className="flex flex-col items-center">
        {allValuePresent ? (
          <p className="text-center font-semibold">
            Great! I've processed your resume. Let me verify your information.
          </p>
        ) : (
          <p className="text-center font-semibold">
            Almost done. Please complete the missing fields below.
          </p>
        )}

        <Button
          className={
            "bg-input mt-3 min-w-[30%] text-white text-sm font-bold cursor-pointer hover:bg-input/60"
          }
          onClick={fileNameOnClickHandler}
        >
          <p className="max-w-52 sm:max-w-xs  text-ellipsis whitespace-nowrap overflow-hidden">
            {fileName}
          </p>
          <RxCross2 className="h-2 w-2" />
        </Button>

        <form
          className="w-full flex flex-col items-center gap-2 mt-3"
          onSubmit={prepareQuestion}
        >
          <div className="space-y-1 sm:w-[70%] w-full ">
            <Label className={"text-subhead"}>Name</Label>
            <Input
              required={true}
              onChange={onChangeHandler}
              name="name"
              value={formField.name}
              type="text"
              className="bg-blue-200"
            />
          </div>

          <div className="space-y-1 sm:w-[70%] w-full ">
            <Label className={"text-subhead"}>Email</Label>
            <Input
              required={true}
              onChange={onChangeHandler}
              name="email"
              value={formField.email}
              type="email"
            />
          </div>

          <div className="space-y-1 sm:w-[70%] w-full ">
            <Label className={"text-subhead"}>Phone</Label>
            <Input
              required={true}
              onChange={onChangeHandler}
              name="phone"
              value={formField.phone}
              type={"phone"}
            />
          </div>

          <Button
          disabled={loading}
            className={
              "gradient-primary text-white mt-4 cursor-pointer font-bold"
              
            }
            type="submit"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin h-4 w-4" />
                Preparing your session...
                {/* <CgSandClock className="animate-spin h-4 w-4" /> */}
              </>
            ) : (
              <>
                <PiExamLight />
                Let the interview begin!
              </>
            )}
          </Button>
        </form>
      </div>
    </>
  );
}