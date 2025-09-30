import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentStatus: "not-started", // 'not-started', 'pending', 'completed'
  currentInterview: null,
  pastInterviews: [],
};

const interviewSlice = createSlice({
  name: "interview",
  initialState,

  reducers: {
    //will setUp intitial state for an interview along with welcome messages
    startInterview: (state, action) => {
      state.currentStatus = "pending";
      state.currentInterview = {
        contactDetails: action.payload.contactDetails,
        questions: action.payload.questions,
        interviewChat: action.payload.introMessages,
        answers: [],
        currentQuestionIndex: 0,
        remainingTime: action.payload.questions[0].timer,
        score: null,
        questionWiseScore:[],
        aiSummary: null,
      };
    },

    //this will handle logics for adding user answer along with going to next question
    addAnswer: (state, action) => {
      if (state.currentInterview) {
     
         state.currentInterview.answers.push(action.payload.answer);
        //add user ans to interview chat;
        const userMessage = {
          sender: "user",
          text: action.payload.answer || "(No answer)",
          timeStamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        state.currentInterview.interviewChat.push(userMessage);

        //move to next question and update currentQuestion Index and timer;
        const nextIndex = state.currentInterview.currentQuestionIndex + 1;
        if (nextIndex < state.currentInterview.questions.length) {
          state.currentInterview.currentQuestionIndex = nextIndex;
          state.currentInterview.remainingTime =
            state.currentInterview.questions[nextIndex].timer;

          //bot reply
          const botMessage = {
            sender: "bot",
            text: state.currentInterview.questions[nextIndex].question,
            timeStamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };

          state.currentInterview.interviewChat.push(botMessage);
        } else {
          //when it is the last question
          state.currentInterview.interviewChat.push({
            text: "That's the last one. I'm compiling your results and will have them ready in just a moment.",
            sender: "bot",
            timeStamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          });
        }
      }
    },

    //this will need if need to add message to chat
    addMessage: (state, action) => {
      if (state.currentInterview) {
        state.currentInterview.interviewChat.push(action.payload);
      }
    },

    setQuestionIndex: (state, action) => {
      const quesIndex = action.payload.quesIndex;
      if (
        state.currentInterview &&
        quesIndex < state.currentInterview.questions.length
      ) {
        state.currentInterview.currentQuestionIndex = quesIndex;
        state.currentInterview.remainingTime =
          state.currentInterview.questions[quesIndex].timer;
      }
    },

    //for countdown
    setRemainingTime: (state) => {
      if (state.currentInterview && state.currentInterview.remainingTime > 0) {
        state.currentInterview.remainingTime -= 1;
      }
    },

    //this will call after evaluating the score
    completeInterview: (state, action) => {
      if (state.currentInterview) {
        state.currentInterview.score = action.payload.score;
        state.currentInterview.aiSummary = action.payload.aiSummary;
        state.currentInterview.questionWiseScore = action.payload.questionWiseScore;
        state.pastInterviews.push(state.currentInterview);
        state.currentInterview = null;
        state.currentStatus = "completed";
      }
    },

    resetCurrentInterview: (state) => {
      state.currentInterview = null;
      state.currentStatus = "not-started";
    },
  },
});

export default interviewSlice.reducer;

export const {
  startInterview,
  addAnswer,
  completeInterview,
  resetCurrentInterview,
  addMessage,
  setQuestionIndex,
  setRemainingTime,
} = interviewSlice.actions;
