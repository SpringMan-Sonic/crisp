
import { FaRegEye } from "react-icons/fa6";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { DialogTrigger } from "../ui/dialog";

export default function CandidateCard({ candidateData, onOpenDialog, total = 60 }) {

  const getScoreColor = (score) => {
    score = (score / total) * 100;
    if (score >= 80) {
      return 'bg-green-100 border-green-500 text-green-700';
    }
    if (score >= 50) {
      return 'bg-yellow-100 border-yellow-500 text-yellow-700';
    }
    return 'bg-red-100 border-red-500 text-red-700';
  };

  return (
    <div>
      <Card>
        <CardHeader className={"border-b flex flex-row justify-between items-center"}>
          <div>
            <CardTitle className={"text-xl font-bold "}>{candidateData.contactDetails?.name}</CardTitle>
            <CardDescription>
              <p className={`rounded-lg py-1 px-3 border-2  w-fit text-xs font-bold ${getScoreColor(candidateData.score)}`}>{`Score: ${candidateData.score}/60`}</p>
            </CardDescription>
          </div>
          <DialogTrigger asChild>
            <div onClick={onOpenDialog} className="h-8 w-8 bg-white hover:opacity-85 rounded-lg p-1 flex items-center justify-center cursor-pointer">
              <FaRegEye className="h-4 w-4 text-black" />
            </div>
          </DialogTrigger>
        </CardHeader>
        <CardContent>
          <h3 className="text-xl font-semibold">Interview Summary</h3>
          <p className=" overflow-hidden line-clamp-3 text-subhead ">{candidateData.aiSummary}</p>
        </CardContent>
      </Card>
    </div>
  );
}