
import { Poll } from "@/types/poll";

interface PollPreviewProps {
  poll: Poll;
}

const PollPreview = ({ poll }: PollPreviewProps) => {
  const totalVotes = poll.votes 
    ? Object.values(poll.votes).reduce((sum, count) => sum + count, 0) 
    : 0;
  
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">Total votes: {totalVotes}</p>
      {poll.options.map((option, index) => {
        const votePercentage = totalVotes > 0 ? Math.round((poll.votes?.[index] || 0) * 100 / totalVotes) : 0;
        
        return (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="truncate">{option}</span>
              <span>{poll.votes?.[index] || 0} votes</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${votePercentage || 0}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PollPreview;
