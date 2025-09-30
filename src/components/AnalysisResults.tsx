import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle, TrendingUp } from "lucide-react";

interface AnalysisResultsProps {
  result: any;
  mode: "cv-only" | "comparison";
}

export const AnalysisResults = ({ result, mode }: AnalysisResultsProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "destructive";
  };

  return (
    <div className="space-y-6">
      {mode === "comparison" && result.atsScore !== undefined && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>ATS Compatibility Score</span>
              <Badge variant={getScoreBadge(result.atsScore) as any} className="text-2xl px-4 py-2">
                {result.atsScore}%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className={getScoreColor(result.atsScore)} />
              <p className="text-muted-foreground">
                {result.atsScore >= 80 && "Excellent! Your CV is highly compatible with this job."}
                {result.atsScore >= 60 && result.atsScore < 80 && "Good match, but there's room for improvement."}
                {result.atsScore < 60 && "Consider updating your CV to better match this position."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            {mode === "cv-only" ? "Suitability Assessment" : "Overall Assessment"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3">
            {result.suitable === true || result.suitable === "yes" ? (
              <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-1" />
            ) : result.suitable === false || result.suitable === "no" ? (
              <XCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
            ) : (
              <AlertCircle className="w-6 h-6 text-warning flex-shrink-0 mt-1" />
            )}
            <p className="text-foreground whitespace-pre-wrap">{result.assessment}</p>
          </div>
        </CardContent>
      </Card>

      {result.hardSkills && result.hardSkills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Missing Hard Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.hardSkills.map((skill: string, index: number) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {result.softSkills && result.softSkills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Missing Soft Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.softSkills.map((skill: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {result.recommendations && result.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {result.recommendations.map((rec: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-foreground">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
