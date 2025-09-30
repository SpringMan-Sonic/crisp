import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import { FcDocument } from "react-icons/fc";
import { GoPerson } from "react-icons/go";
import { Button } from "../ui/button";
import { GrDocumentText } from "react-icons/gr";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "sonner";
import { ImSpinner } from "react-icons/im";
import { FaSpinner } from "react-icons/fa6";
import UserInfoForm from "./userInfoForm";
import { useDispatch, useSelector } from "react-redux";
import InterviewChat from "./interviewChat";
import DetailedEvaluation from "./detailedEvalaution";
import { resetCurrentInterview } from "@/store/interviewSlice";
import ResumeInterview from "./resumeInterview";


export const STATUS = {
  SHOWINFONEED:false,
  SHOWUPLOADRESUME:true,
  SHOWCHAT:false
}

export default function Interviewee() {

   const [status,setStatus]=useState(STATUS)

  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);
  const [userInfo,setUserInfo]=useState(null);
  const [fileName,setFileName]=useState(null)

  const {currentStatus , pastInterviews}= useSelector((state)=>state.interview)
  const dispatch = useDispatch()
 
  const fileChangeHandler = async (e)=>{
        const reader = new FileReader();

        setUserInfo(null);
        setError(null);
        
        setFileName(e.target.files[0].name);
        
       reader.onload=(e)=>{
        
        const fileContent = e.target.result;
        if (fileContent) {
        ExtractInfo(fileContent);
      } else {
         setError("Could not read the file content.");
      }

       }
       reader.onerror=()=>{
         setError("An error occurred while reading the file.");
          console.error("Error reading file");
       }

       reader.readAsDataURL(e.target.files[0]);

  }
   
 async  function ExtractInfo (fileDataUrl){
         try {
          
           setLoading(true)
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
           const genAi=new GoogleGenerativeAI(apiKey)

           const model=genAi.getGenerativeModel({model: "gemini-2.5-flash-lite-preview-06-17"})

          //  Extracted base 64 part form data uri so that we can send it to gemini api
           const parts = fileDataUrl.split(';base64,');
      if (parts.length !== 2) {
        throw new Error("Invalid Data URL format. Please upload a valid file.");
      }
      const mimeType = parts[0].split(':')[1];
      const base64Data = parts[1];
       
      //created medai part of the prompt
      const pdfPart={
      inlineData:{
        data:base64Data,
        mimeType:mimeType,
      }
    }


        const prompt = `
        You are an expert resume parser. 
        Analyze the provided resume document and extract the full name, email address, and phone number.
        Respond ONLY with a valid JSON object in the following format:
        {
          "name": "...",
          "email": "...",
          "phone": "..."
        }
        If a piece of information is not found, the value should be null.
      `;
       
      //generateing the content
      const result = await model.generateContent([pdfPart,prompt]);
      const response=await result.response;
      const text=response.text();
       const cleanedText=text.replace(/```(?:json)?\n?/g, "").trim();

        const jsObject = JSON.parse(cleanedText);

        setUserInfo(jsObject);

        if(jsObject && Object.keys(jsObject).length>0){
          toast.success("Details fetched successfully.")
          
          setStatus({SHOWINFONEED:true , SHOWUPLOADRESUME:false,SHOWCHAT:false})

        }


         } catch (err) {
           console.error("Error during extraction:", err);
            setError(err.message || "An unknown error occurred during extraction.");
            toast.error(err.message || "An unknown error occurred during extraction.")
         }finally{
                   setLoading(false);
         }
 } 

 function performanceClose(){
        dispatch(resetCurrentInterview());
 }

  return (
    <div className="mb-10">
      <Card className={"mt-0 pt-0 "}>
        <CardHeader className={" border-b flex pb-0 py-4 "}>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center">
              <GoPerson className="h-6 w-6 font-bold text-white " />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gradient-secondary">
                Interviewee Portal
              </h2>
              <CardDescription>AI-Powered Technical Interview</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className={"p-4"}>
          <div className="bg-muted/40 rounded-lg h-full  min-h-60 p-4 ">
            {/* resume Uplaod UI */}
            {(status.SHOWUPLOADRESUME && currentStatus==='not-started') && (
              <div className="flex flex-col items-center justify-center h-full   space-y-2">
                <Upload className="h-12 w-12 text-purple-500" />
                <h3 className="text-xl font-bold">
                  Welcome to Crisp AI Interview
                </h3>
                <p className="text-subhead mb-4 text-center">
                  Upload your resume to get started with the AI-powered
                  technical interview
                </p>

                <div>
                  <label
                    htmlFor="resume"
                    className="cursor-pointer gradient-primary text-white flex items-center gap-2 px-2 py-1 rounded-lg font-semibold justify-center"
                      aria-label="Upload your resume, only PDF or Word documents supported"
                  >
                   
                    {loading ? (
                      <>
                      <FaSpinner className="animate-spin h-4 w-4" />
                      Parsing...
                      </>
                    ): (
                      <>
                       <GrDocumentText />
                       Upload resume
                      </>
                    )}
                  </label>

                  <input
                    type="file"
                    id="resume"
                    className="hidden"
                    onChange={fileChangeHandler} // handle file
                    accept=".pdf,.doc,.docx"
                  />
                  <p className="text-xs text-subhead mt-1 text-center">Accepted formats: PDF, DOC, DOCX</p>

                </div>
              </div>
            )}
            {status.SHOWINFONEED && <UserInfoForm userInfo={userInfo} setUserInfo={setUserInfo} fileName={fileName} setFileName={setFileName} setStatus={setStatus}/>}
            {(status.SHOWCHAT && currentStatus === "pending") && <InterviewChat/>}
            {(currentStatus === "pending" && !status.SHOWCHAT) && <ResumeInterview resumeInterviewhandler={()=>setStatus((prev)=>{
              return {...prev,SHOWCHAT:true}
            })}/>}
            {(currentStatus === "completed" && pastInterviews.length ) && <DetailedEvaluation interviewData={pastInterviews[pastInterviews.length - 1]} clickHandler={performanceClose} showExit={true}/>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}