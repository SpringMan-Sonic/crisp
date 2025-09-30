import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { GoPeople } from "react-icons/go";
import { Input } from "../ui/input";
import { FaSortAlphaDown } from "react-icons/fa";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useEffect, useState } from "react";
import CandidateCard from "./candidateCard";
import { Dialog, DialogContent } from "../ui/dialog";
import DetailedEvaluation from "./detailedEvalaution";
import { useSelector } from "react-redux";

export default function Interviewer() {
  const { pastInterviews } = useSelector((state) => state.interview);
  const [sort, setSort] = useState("date");
  const [filteredInterviews, setFilteredInterviews] = useState(pastInterviews);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  function searchHandler(e) {
    setSearchTerm(e.target.value);
  }

  useEffect(() => {
    let interviews = [...pastInterviews];

    if (searchTerm) {
      interviews = interviews.filter((interview) =>
        interview.contactDetails.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sort === "score") {
      interviews.sort((a, b) => b.score - a.score);
    } else if (sort === "name") {
      interviews.sort((a, b) => a.contactDetails.name.localeCompare(b.contactDetails.name));
    } else if (sort === "date") {
      interviews.reverse();
    }

    setFilteredInterviews(interviews);
  }, [searchTerm, sort, pastInterviews]);

  return (
    <div className="min-h-screen flex justify-center p-6 bg-gradient-to-b from-[#0b1d3a] to-[#10294d]">
      <Card className="w-full max-w-5xl rounded-xl shadow-xl bg-[#112b4f] text-white">
        {/* Header */}
        <CardHeader className="flex flex-col border-b border-gray-700 p-4">
          <div className="flex items-center gap-4 pb-4 border-b border-gray-700">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#1a2b55] to-[#0c1b3c] flex items-center justify-center">
              <GoPeople className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-yellow-400">Interviewer Dashboard</h2>
              <CardDescription className="text-gray-300">
                Manage candidates and review interviews
              </CardDescription>
            </div>
          </div>

          {/* Search & Sort */}
          <div className="pt-4 flex flex-col sm:flex-row sm:gap-6 gap-3 w-full sm:w-[60%]">
            <Input
              placeholder="Search candidates by name..."
              value={searchTerm}
              onChange={searchHandler}
              className="bg-[#0e1f3d] text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 rounded-lg"
            />

            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="sm:w-48 w-full bg-[#0e1f3d] text-white rounded-lg flex items-center gap-2">
                <FaSortAlphaDown className="text-yellow-400" />
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent className="bg-[#0e1f3d] text-white">
                <SelectItem value="score">Sort by Score</SelectItem>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="name">Sort by Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="p-4">
          <div className="bg-[#0e1f3d] rounded-xl min-h-[400px] p-4 flex flex-col gap-4 shadow-inner">
            {filteredInterviews.length === 0 ? (
              <div className="text-center py-6">
                <GoPeople className="mx-auto w-16 h-16 text-yellow-400 mb-4" />
                <h3 className="text-xl font-semibold text-yellow-400 mb-2">No Completed Interviews</h3>
                <p className="text-gray-300">
                  {pastInterviews.length === 0
                    ? "Interviews will appear here once candidates complete them."
                    : "No candidates match your search criteria."}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredInterviews.map((item, idx) => (
                  <Dialog
                    key={idx}
                    onOpenChange={(isOpen) => !isOpen && setSelectedCandidate(null)}
                  >
                    <CandidateCard
                      candidateData={item}
                      onOpenDialog={() => setSelectedCandidate(item)}
                    />
                    {selectedCandidate && (
                      <DialogContent className="min-w-[90%] max-w-[90vw]">
                        <div className="h-[80vh]">
                          <DetailedEvaluation
                            extraCSS="h-[70vh] overflow-x-hidden overflow-y-auto"
                            interviewData={selectedCandidate}
                          />
                        </div>
                      </DialogContent>
                    )}
                  </Dialog>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
