
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Poll, parseOptions } from "@/types/poll";
import PieChartVisualization from "@/components/PieChartVisualization";

const ViewPoll = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  const [votingInProgress, setVotingInProgress] = useState(false);

  // Set up realtime subscription for votes
  useEffect(() => {
    if (!id) return;
    
    const channel = supabase
      .channel('public:votes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'votes', filter: `poll_id=eq.${id}` },
        (payload) => {
          // Update the poll votes when a new vote comes in
          if (poll && poll.votes) {
            const newVotes = { ...poll.votes };
            const optionIndex = payload.new.option_index;
            newVotes[optionIndex] = (newVotes[optionIndex] || 0) + 1;
            
            setPoll({
              ...poll,
              votes: newVotes
            });
            
            setVoteCount(prev => prev + 1);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, poll]);

  // Fetch poll data
  useEffect(() => {
    const fetchPoll = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch poll data
        const { data: pollData, error: pollError } = await supabase
          .from('polls')
          .select('id, question, options, created_at')
          .eq('id', id)
          .single();
          
        if (pollError) throw pollError;
        
        // Fetch votes for this poll
        const { data: votesData, error: votesError } = await supabase
          .from('votes')
          .select('option_index')
          .eq('poll_id', id);
          
        if (votesError) throw votesError;
        
        // Check if user has already voted
        let userVoted = false;
        if (user) {
          const { data: userVote } = await supabase
            .from('votes')
            .select('id')
            .eq('poll_id', id)
            .eq('user_id', user.id)
            .maybeSingle();
            
          userVoted = !!userVote;
        }
        
        const parsedOptions = parseOptions(pollData.options);
        
        // Count votes for each option
        const votes: Record<number, number> = {};
        parsedOptions.forEach((_: string, index: number) => {
          votes[index] = votesData.filter(v => v.option_index === index).length;
        });
        
        // Set poll data
        setPoll({
          id: pollData.id,
          question: pollData.question,
          options: parsedOptions,
          votes,
          createdAt: pollData.created_at
        });
        
        // Calculate total votes
        setVoteCount(votesData.length);
        setHasVoted(userVoted);
        
      } catch (error: any) {
        console.error('Error fetching poll:', error);
        toast({
          title: "Error loading poll",
          description: error.message || "There was a problem loading this poll.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPoll();
  }, [id, user, toast]);

  const handleSubmitVote = async () => {
    if (selectedOption === null || !poll || !id) return;
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to vote on this poll.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    setVotingInProgress(true);
    
    try {
      // Insert vote in Supabase
      const { error } = await supabase
        .from('votes')
        .insert({ 
          poll_id: id,
          option_index: selectedOption,
          user_id: user?.id || null
        });
        
      if (error) throw error;
      
      // Update local state (this will be refreshed by the realtime subscription)
      setHasVoted(true);
      
      toast({
        title: "Vote submitted!",
        description: "Thank you for participating in this poll.",
      });
      
    } catch (error: any) {
      console.error('Error submitting vote:', error);
      toast({
        title: "Error submitting vote",
        description: error.message || "There was a problem submitting your vote.",
        variant: "destructive",
      });
    } finally {
      setVotingInProgress(false);
    }
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
        <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading poll...</p>
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
              disabled={selectedOption === null || votingInProgress}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {votingInProgress ? "Submitting..." : user ? "Submit Vote" : "Sign in to Vote"}
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
