import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, MessageCircle } from "lucide-react";
import { useState } from "react";
import Interviewee from "./interviewee";
import Interviewer from "./interviewer";

export default function MainContent() {
  const [activeTab, setActiveTab] = useState("Interviewee");

  return (
    <div className="mt-28 sm:px-6 px-4">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value)}
        className="h-full"
      >

        
        

        {/* Tabs List */}
        <TabsList className="mb-6 bg-[#0e1f3d] rounded-lg shadow-inner h-12 flex">
          {/* Interviewee Tab */}
          <TabsTrigger
            value="Interviewee"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all ${
              activeTab === "Interviewee"
                ? "bg-gradient-to-r from-[#1a2b55] to-[#0c1b3c] text-yellow-400 font-bold shadow-lg"
                : "text-gray-300 hover:bg-[#112b4f]"
            }`}
          >
            <MessageCircle className="h-5 w-5" />
            Interviewee
          </TabsTrigger>

          {/* Interviewer Tab */}
          <TabsTrigger
            value="Interviewer"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all ${
              activeTab === "Interviewer"
                ? "bg-gradient-to-r from-[#1a2b55] to-[#0c1b3c] text-yellow-400 font-bold shadow-lg"
                : "text-gray-300 hover:bg-[#112b4f]"
            }`}
          >
            <BarChart3 className="h-5 w-5" />
            Interviewer
          </TabsTrigger>
        </TabsList>

        {/* Tabs Content */}
        <TabsContent value="Interviewee" className="bg-[#0b1d3a] rounded-lg p-4 shadow-inner">
          <Interviewee />
        </TabsContent>
        <TabsContent value="Interviewer" className="bg-[#0b1d3a] rounded-lg p-4 shadow-inner">
          <Interviewer />
        </TabsContent>
      </Tabs>
    </div>
  );
}
