import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, GitCompare, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              CV Analyzer Pro
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            AI-powered CV analysis with field-specific insights. Get detailed feedback on your CV 
            or compare it with job descriptions to optimize your ATS score.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-primary cursor-pointer group">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl">CV Analysis</CardTitle>
              <CardDescription className="text-base">
                Analyze your CV against your chosen career field. Get insights on whether 
                your CV is suitable for your target position.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>Field-specific skill evaluation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>Career suitability assessment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>Detailed recommendations</span>
                </li>
              </ul>
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => navigate("/cv-analysis")}
              >
                Analyze CV
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-accent cursor-pointer group">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <GitCompare className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl">CV vs Job Description</CardTitle>
              <CardDescription className="text-base">
                Compare your CV with a specific job description. Calculate ATS compatibility 
                and get targeted skill improvement suggestions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>ATS score calculation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>Missing skills identification</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  <span>Keyword optimization tips</span>
                </li>
              </ul>
              <Button 
                className="w-full bg-gradient-accent hover:opacity-90" 
                size="lg"
                onClick={() => navigate("/cv-comparison")}
              >
                Compare CV
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-6">Supported Career Fields</h2>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {[
              "Data Analysis",
              "Economics & Business",
              "Human Resources",
              "Political Analysis",
              "Statistics",
              "Public Relations"
            ].map((field) => (
              <div
                key={field}
                className="px-4 py-2 bg-card rounded-full border border-border text-sm font-medium"
              >
                {field}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
