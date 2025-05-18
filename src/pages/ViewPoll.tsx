
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Poll } from "@/types/poll";
import PieChartVisualization from "@/components/PieChartVisualization";

const ViewPoll = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [polls, setPolls] = useLocalStorage<Poll[]>("polls", []);
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  const [votedIds, setVotedIds] = useLocalStorage<string[]>("votedPolls", []);

  useEffect(() => {
    if (id) {
      const foundPoll = polls.find(p => p.id === id);
      if (foundPoll) {
        setPoll(foundPoll);
        
        // Calculate total votes
        const totalVotes = foundPoll.votes 
          ? Object.values(foundPoll.votes).reduce((sum, count) => sum + count, 0) 
          : 0;
        
        setVoteCount(totalVotes);
        
        // Check if user has already voted
        setHasVoted(votedIds.includes(id));
      }
      setLoading(false);
    }
  }, [id, polls, votedIds]);

  const handleSubmitVote = () => {
    if (selectedOption === null || !poll) return;

    // Update votes in the poll
    const updatedPoll = { 
      ...poll,
      votes: { 
        ...poll.votes,
        [selectedOption]: (poll.votes?.[selectedOption] || 0) + 1
      }
    };

    // Update poll in storage
    const updatedPolls = polls.map(p => p.id === poll.id ? updatedPoll : p);
    setPolls(updatedPolls);
    
    // Save that the user has voted on this poll
    setVotedIds([...votedIds, poll.id]);
    
    // Update local state
    setPoll(updatedPoll);
    setHasVoted(true);
    setVoteCount(voteCount + 1);

    toast({
      title: "Vote submitted!",
      description: "Thank you for participating in this poll.",
    });
  };

  const handleSharePoll = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Poll link has been copied to clipboard.",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8 text-center">
        Loading poll...
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Poll Not Found</h2>
        <p className="mb-6">The poll you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Button variant="ghost" className="mb-6" onClick={() => navigate("/")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Polls
      </Button>
      
      <Card className="mb-8">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
          <CardTitle className="text-2xl font-bold text-gray-800">{poll.question}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {!hasVoted ? (
            <RadioGroup value={selectedOption?.toString()} onValueChange={(value) => setSelectedOption(parseInt(value))}>
              <div className="space-y-3">
                {poll.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="text-lg">{option}</Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Total votes: {voteCount}</p>
              <div className="space-y-3">
                {poll.options.map((option, index) => {
                  const votePercentage = voteCount > 0 ? Math.round((poll.votes?.[index] || 0) * 100 / voteCount) : 0;
                  
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{option}</span>
                        <span>{poll.votes?.[index] || 0} votes ({votePercentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-purple-600 h-2.5 rounded-full" 
                          style={{ width: `${votePercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-gray-50 flex justify-between">
          <Button variant="outline" onClick={handleSharePoll}>
            <Share className="mr-2 h-4 w-4" /> Share Poll
          </Button>
          
          {!hasVoted && (
            <Button 
              onClick={handleSubmitVote} 
              disabled={selectedOption === null}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Submit Vote
            </Button>
          )}
        </CardFooter>
      </Card>

      {hasVoted && poll.votes && (
        <div className="relative h-[400px] mx-auto border border-gray-200 rounded-lg shadow-sm">
          <PieChartVisualization poll={poll} />
        </div>
      )}
    </div>
  );
};

export default ViewPoll;
