import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FIELD_SKILLS = {
  "data-analysis": {
    hard: [
      "Python", "R", "SQL", "Tableau", "Power BI", "Excel", "Pandas", "NumPy",
      "Data Visualization", "Statistical Analysis", "Machine Learning", "ETL",
      "Data Mining", "Big Data", "Apache Spark", "Hadoop", "Data Cleaning",
      "Predictive Modeling", "A/B Testing", "Data Warehousing"
    ],
    soft: [
      "Critical Thinking", "Problem Solving", "Attention to Detail",
      "Communication", "Business Acumen", "Curiosity", "Analytical Thinking",
      "Presentation Skills", "Stakeholder Management", "Time Management"
    ]
  },
  "economics": {
    hard: [
      "Econometrics", "Financial Modeling", "Cost-Benefit Analysis", "Excel",
      "Statistical Software (Stata, SPSS)", "Market Research", "Forecasting",
      "Business Valuation", "Risk Analysis", "Feasibility Studies", "Economic Theory",
      "Regression Analysis", "Financial Analysis", "Budget Planning", "Policy Analysis"
    ],
    soft: [
      "Analytical Thinking", "Strategic Planning", "Communication", "Report Writing",
      "Critical Thinking", "Decision Making", "Presentation Skills", "Negotiation",
      "Research Skills", "Problem Solving", "Attention to Detail"
    ]
  },
  "hr": {
    hard: [
      "Recruitment", "HRIS Systems", "Performance Management", "Compensation & Benefits",
      "Labor Law", "Talent Acquisition", "Applicant Tracking Systems", "Onboarding",
      "Employee Relations", "Training & Development", "HR Analytics", "Payroll",
      "Compliance", "Organizational Development", "Workforce Planning"
    ],
    soft: [
      "Communication", "Empathy", "Conflict Resolution", "Active Listening",
      "Confidentiality", "Negotiation", "Interpersonal Skills", "Emotional Intelligence",
      "Problem Solving", "Adaptability", "Ethics", "Relationship Building"
    ]
  },
  "politics": {
    hard: [
      "Policy Analysis", "Research Methodology", "Political Theory", "Legislative Process",
      "Campaign Management", "Public Opinion Research", "Data Analysis", "Writing",
      "International Relations", "Constitutional Law", "Statistical Analysis",
      "Strategic Communication", "Lobbying", "Stakeholder Engagement", "Media Relations"
    ],
    soft: [
      "Critical Thinking", "Communication", "Negotiation", "Public Speaking",
      "Strategic Thinking", "Diplomacy", "Leadership", "Networking", "Persuasion",
      "Cultural Awareness", "Adaptability", "Ethics", "Debate Skills"
    ]
  },
  "statistics": {
    hard: [
      "Statistical Modeling", "R", "Python", "SAS", "SPSS", "Probability Theory",
      "Hypothesis Testing", "Regression Analysis", "Experimental Design", "Sampling Methods",
      "Time Series Analysis", "Bayesian Statistics", "Survey Design", "Data Analysis",
      "Statistical Software", "Machine Learning", "Data Visualization", "SQL"
    ],
    soft: [
      "Analytical Thinking", "Attention to Detail", "Problem Solving", "Communication",
      "Critical Thinking", "Research Skills", "Report Writing", "Presentation Skills",
      "Collaboration", "Time Management", "Logical Reasoning"
    ]
  },
  "pr": {
    hard: [
      "Media Relations", "Press Release Writing", "Crisis Communication", "Social Media Management",
      "Event Planning", "Content Creation", "Brand Management", "Digital Marketing",
      "Media Monitoring", "SEO", "Analytics Tools", "Adobe Creative Suite", "Campaign Management",
      "Influencer Relations", "Copywriting", "Public Speaking", "Strategic Communication"
    ],
    soft: [
      "Communication", "Creativity", "Relationship Building", "Adaptability",
      "Crisis Management", "Strategic Thinking", "Networking", "Persuasion",
      "Multitasking", "Emotional Intelligence", "Attention to Detail", "Storytelling"
    ]
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cvContent, jobDescription, field, mode } = await req.json();
    
    if (!cvContent || !field || !mode) {
      throw new Error("Missing required parameters");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const fieldSkills = FIELD_SKILLS[field as keyof typeof FIELD_SKILLS];
    if (!fieldSkills) {
      throw new Error("Invalid field specified");
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (mode === "cv-only") {
      systemPrompt = `You are an expert CV analyzer specializing in ${field}. Your task is to analyze a CV and determine if the candidate is suitable for a career in ${field}.

Evaluate based on:
1. Relevant skills and experience for ${field}
2. Educational background
3. Career progression and growth
4. Project experience and achievements

Provide your analysis in JSON format:
{
  "suitable": "yes" | "no" | "maybe",
  "assessment": "Detailed explanation of your decision",
  "hardSkills": ["missing hard skill 1", "missing hard skill 2"],
  "softSkills": ["missing soft skill 1", "missing soft skill 2"],
  "recommendations": ["recommendation 1", "recommendation 2"]
}

Key skills for ${field}:
Hard Skills: ${fieldSkills.hard.join(", ")}
Soft Skills: ${fieldSkills.soft.join(", ")}`;

      userPrompt = `Analyze this CV for suitability in ${field}:\n\n${cvContent}`;
    } else {
      systemPrompt = `You are an expert ATS (Applicant Tracking System) analyzer specializing in ${field}. Your task is to compare a CV with a job description and provide an ATS compatibility score and detailed feedback.

Evaluate based on:
1. Keyword matching between CV and job description
2. Relevant skills and experience
3. Qualifications and requirements match
4. Industry-specific terminology

Provide your analysis in JSON format:
{
  "atsScore": number (0-100),
  "assessment": "Detailed explanation of the match",
  "hardSkills": ["missing hard skill 1", "missing hard skill 2"],
  "softSkills": ["missing soft skill 1", "missing soft skill 2"],
  "recommendations": ["recommendation 1", "recommendation 2"]
}

Key skills for ${field}:
Hard Skills: ${fieldSkills.hard.join(", ")}
Soft Skills: ${fieldSkills.soft.join(", ")}`;

      userPrompt = `Compare this CV with the job description and calculate ATS score:\n\nCV:\n${cvContent}\n\nJob Description:\n${jobDescription}`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API Error:", response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-cv function:", error);
    const errorMessage = error instanceof Error ? error.message : "Analysis failed";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
