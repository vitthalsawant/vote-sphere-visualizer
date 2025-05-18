
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, ArrowLeft } from "lucide-react";
import { nanoid } from "nanoid";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const CreatePoll = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a poll.",
        variant: "destructive",
      });
      navigate("/auth");
    }
  }, [isAuthenticated, navigate, toast]);

  const handleAddOption = () => {
    if (options.length < 10) {
      setOptions([...options, ""]);
    } else {
      toast({
        title: "Maximum options reached",
        description: "You can add up to 10 options.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = [...options];
      newOptions.splice(index, 1);
      setOptions(newOptions);
    } else {
      toast({
        title: "Minimum options required",
        description: "A poll must have at least 2 options.",
        variant: "destructive",
      });
    }
  };

  const handleChangeOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async () => {
    // Validate form
    if (!question.trim()) {
      toast({
        title: "Question required",
        description: "Please enter a question for your poll.",
        variant: "destructive",
      });
      return;
    }

    const filteredOptions = options.filter(opt => opt.trim() !== "");
    if (filteredOptions.length < 2) {
      toast({
        title: "Options required",
        description: "Please add at least 2 options.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create new poll in Supabase
      const { data: poll, error } = await supabase
        .from('polls')
        .insert({
          question: question.trim(),
          options: filteredOptions,
          user_id: user?.id,
          is_public: true,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Poll created!",
        description: "Your poll has been created successfully.",
      });

      // Redirect to the new poll
      navigate(`/poll/${poll.id}`);
    } catch (error: any) {
      toast({
        title: "Error creating poll",
        description: error.message || "There was a problem creating your poll.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Button variant="ghost" className="mb-6" onClick={() => navigate("/")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Polls
      </Button>
      
      <Card>
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
          <CardTitle className="text-2xl font-bold text-gray-800">Create a New Poll</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="question">Poll Question</Label>
              <Input
                id="question"
                placeholder="What would you like to ask?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <Label>Poll Options</Label>
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleChangeOption(index, e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveOption(index)}
                    disabled={options.length <= 2}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button
                variant="outline"
                className="w-full"
                onClick={handleAddOption}
                disabled={options.length >= 10}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Option
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 flex justify-end gap-4">
          <Button variant="outline" onClick={() => navigate("/")}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isSubmitting ? "Creating..." : "Create Poll"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreatePoll;
