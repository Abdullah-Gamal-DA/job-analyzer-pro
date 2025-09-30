import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AnalysisResults } from "@/components/AnalysisResults";

const CVComparison = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedField, setSelectedField] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const fields = [
    { value: "data-analysis", label: "Data Analysis" },
    { value: "economics", label: "Economics & Business" },
    { value: "hr", label: "Human Resources" },
    { value: "politics", label: "Political Analysis" },
    { value: "statistics", label: "Statistics" },
    { value: "pr", label: "Public Relations" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const fileType = selectedFile.type;
      
      if (!fileType.includes("pdf") && !fileType.includes("document")) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or DOCX file",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleCompare = async () => {
    if (!file || !selectedField || !jobDescription.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide all required information",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        
        const { data, error } = await supabase.functions.invoke("analyze-cv", {
          body: {
            cvContent: content,
            jobDescription: jobDescription,
            field: selectedField,
            mode: "comparison",
          },
        });

        if (error) throw error;

        setAnalysisResult(data);
        toast({
          title: "Comparison complete!",
          description: "Your CV has been compared with the job description",
        });
      };
      
      reader.readAsText(file);
    } catch (error: any) {
      toast({
        title: "Comparison failed",
        description: error.message || "Failed to compare CV. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">CV vs Job Description</CardTitle>
              <CardDescription>
                Compare your CV with a job description to get ATS score and optimization tips
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Career Field</label>
                <Select value={selectedField} onValueChange={setSelectedField}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select career field" />
                  </SelectTrigger>
                  <SelectContent>
                    {fields.map((field) => (
                      <SelectItem key={field.value} value={field.value}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Upload CV</label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="cv-upload"
                  />
                  <label
                    htmlFor="cv-upload"
                    className="cursor-pointer text-sm text-muted-foreground"
                  >
                    {file ? (
                      <span className="text-foreground font-medium">{file.name}</span>
                    ) : (
                      <span>Click to upload or drag and drop (PDF, DOCX)</span>
                    )}
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Job Description</label>
                <Textarea
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleCompare}
                disabled={isAnalyzing || !file || !selectedField || !jobDescription.trim()}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Compare & Analyze"
                )}
              </Button>
            </CardContent>
          </Card>

          {analysisResult && (
            <div className="mt-8">
              <AnalysisResults result={analysisResult} mode="comparison" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CVComparison;
