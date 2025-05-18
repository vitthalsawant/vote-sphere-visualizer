
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Poll } from "@/types/poll";
import PollPreview from "@/components/PollPreview";

const Index = () => {
  const [polls, setPolls] = useLocalStorage<Poll[]>("polls", []);
  const [expandedPoll, setExpandedPoll] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedPoll(expandedPoll === id ? null : id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Poll Creator
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Create interactive polls with beautiful 3D visualizations
          </p>
        </div>
        <Button asChild className="bg-purple-600 hover:bg-purple-700">
          <Link to="/create">
            <Plus className="mr-2 h-4 w-4" /> Create Poll
          </Link>
        </Button>
      </div>

      {polls.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {polls.map((poll) => (
            <Card 
              key={poll.id} 
              className="overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 pb-4">
                <CardTitle className="text-xl font-bold text-gray-800 truncate">
                  {poll.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>{poll.options.length} options</span>
                  <span>{poll.votes ? Object.values(poll.votes).reduce((a, b) => a + b, 0) : 0} votes</span>
                </div>
                {expandedPoll === poll.id && (
                  <div className="mt-4 animate-fade-in">
                    <PollPreview poll={poll} />
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between bg-gray-50 py-3 px-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleExpand(poll.id)}
                >
                  {expandedPoll === poll.id ? "Hide Details" : "View Details"}
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link to={`/poll/${poll.id}`}>Open Poll</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <h3 className="text-2xl font-medium text-gray-600 mb-4">No Polls Created Yet</h3>
          <p className="text-gray-500 mb-6">Create your first poll to get started!</p>
          <Button asChild className="bg-purple-600 hover:bg-purple-700">
            <Link to="/create">
              <Plus className="mr-2 h-4 w-4" /> Create Your First Poll
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Index;
