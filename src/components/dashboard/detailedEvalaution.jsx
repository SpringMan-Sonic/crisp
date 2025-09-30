import { IoPerson } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Progress } from "../ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RxCross2 } from "react-icons/rx";
import { BiLogOut } from "react-icons/bi";
const getColorAccToScore = (score) => {
  if (score <= 30) return "[&>div]:bg-red-500";
  if (score <= 50) return "[&>div]:bg-orange-400";
  if (score <= 70) return "[&>div]:bg-yellow-400";
  return "[&>div]:bg-green-500";
};

export default function DetailedEvaluation({ interviewData, total = 60 , clickHandler , showExit =false ,extraCSS ="" }) {
  const { score, aiSummary, questionWiseScore, contactDetails, questions } =
    interviewData;

  const scoreVal = (score / total) * 100;
  console.log(interviewData);
  return (
    <div className="flex flex-col gap-6">
      <div className="relative border-b pb-4">
         <h2 className=" text-2xl font-bold text-center ">
        Performance Breakdown 🏆
       
      </h2>
        {showExit && <BiLogOut className="absolute cursor-pointer h-8 w-8 top-0 text-purple-600" onClick={clickHandler}/>}
      </div>
     

      <div className={`flex  gap-6 flex-col ${extraCSS}`}>
        {/* contact info */}
        <div className="flex gap-6 flex-col sm:flex-row items-center">
          <div className="w-24 h-24 text-center rounded-full bg-input/80 text-white flex items-center justify-center">
            <IoPerson className="text-white h-16 w-16 " />
          </div>

          <div className="bg-input/80 text-white p-2 rounded-lg flex-1">
            <p className="pb-1 border-b">
              <span className="font-bold text-white">Name: </span>
              {contactDetails.name}
            </p>
            <p className="pb-1 border-b">
              <span className="font-bold">Email: </span>
              {contactDetails.email}
            </p>
            <p className="pb-1 border-b">
              <span className="font-bold">Phone: </span>
              {contactDetails.phone}
            </p>
          </div>
        </div>
        {/* Score Progress Bar */}
        <div className="">
          <h3 className="text-xl font-bold pb-2">{`Score: ${score} / ${total}`}</h3>
          <Progress
            value={scoreVal || 0}
            className={`w-full ${getColorAccToScore(
              scoreVal
            )} [&>div]:rounded-r-[5px] `}
          />
        </div>

        {/* Interview Summary */}
        <div className="space-y-4">
            <h3 className="text-xl  font-bold  border-b pb-2 ">
            Interview Summary
          </h3>
           <div className="bg-input/80 text-white flex-1 p-2 rounded-lg">
          <p>{aiSummary}</p>
        </div>
        </div>
       

        {/* Question Wise Score */}
        <div className="space-y-2">
          <h3 className="text-xl  font-bold  border-b pb-2">
            Detailed Performance Analysis
          </h3>
          <Accordion type="single" collapsible>
            {questionWiseScore.map((item, ind) => {
              return (
                <AccordionItem key={ind+1} value={`item-${ind+1}`}>
                  <AccordionTrigger  className={""}>
                    <div className="flex justify-end w-full flex-col ">
                      <p>
                      <span className="mr-2 font-bold">{`Ques ${ind+1}.`}</span>
                      {questionWiseScore[ind].question}
                    </p>
                    
                    <p className="text-gradient-secondary font-semibold " >{`(${item.difficulty})`}  <span className="ml-4">{`Score: ${item.score}/${item.outof}`}</span></p>
                    </div>

                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="bg-input/80 p-2 rounded-lg text-white">
                      <span className="mr-2 font-bold">{`Ans.`}</span>
                      {questionWiseScore[ind].answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>
    </div>
  );
}


