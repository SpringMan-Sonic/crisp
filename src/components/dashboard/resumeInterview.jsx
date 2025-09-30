import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { resetCurrentInterview } from "@/store/interviewSlice";

export default function ResumeInterview({ resumeInterviewhandler }) {
  const dispatch = useDispatch();

  return (
    <div className="flex justify-center items-center min-h-[50vh] p-6 bg-gradient-to-b from-[#0b1d3a] to-[#10294d]">
      <Card className="w-full max-w-md bg-[#112b4f] text-white rounded-xl shadow-xl">
        <CardHeader className="border-b border-gray-700 pb-2">
          <CardTitle className="text-yellow-400 text-xl font-bold">
            Interview in Progress
          </CardTitle>
          <CardDescription className="text-gray-300">
            It looks like you didn't finish your last interview session.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button
            onClick={() => dispatch(resetCurrentInterview())}
            variant="outline"
            className="flex-1 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-[#0b1d3a] transition-colors"
          >
            Start New Interview
          </Button>
          <Button
            onClick={resumeInterviewhandler}
            className="flex-1 bg-gradient-to-r from-[#1a2b55] to-[#0c1b3c] text-yellow-400 hover:from-[#0c1b3c] hover:to-[#1a2b55] transition-all"
          >
            Resume Interview
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
