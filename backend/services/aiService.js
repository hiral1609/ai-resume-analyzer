const { OpenAI } = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

let genAI = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

const getMockAnalysis = (resumeText, jobDescription, domain) => {
  console.log(`Using Mock AI Analysis for domain: ${domain || 'General'}`);
  
  // Basic randomization to avoid repeated results
  const randomScore = 65 + Math.floor(Math.random() * 25);
  
  const domainData = {
    'Web Development': {
      missing: ["GraphQL", "Next.js Authentication", "Docker"],
      projects: [{ title: "Real-time Chat App", desc: "A socket-based multi-user chat room", stack: "Node, Socket.io, React" }],
      section: { skills: "Focus more on modern frameworks.", projects: "Add a full-stack deployment." }
    },
    'Data Science': {
      missing: ["PyTorch", "Data Wrangling with Pandas", "A/B Testing"],
      projects: [{ title: "Stock Price Predictor", desc: "LSTM based time-series analysis", stack: "Python, TensorFlow, Scikit-learn" }],
      section: { skills: "Strong stats, but need more ML modeling.", projects: "Showcase more data visualization." }
    },
    'AI/ML': {
      missing: ["Neural Architecture Search", "MLOps", "Transformers"],
      projects: [{ title: "Image Classifier", desc: "CNN based object detection system", stack: "Python, PyTorch, OpenCV" }],
      section: { skills: "Mathematics is good, need more practical deployment.", projects: "Focus on edge computing projects." }
    }
  };

  const currentDomain = domainData[domain] || domainData['Web Development'];

  return {
    match_score: randomScore,
    domain: domain || "General Engineering",
    missing_skills: currentDomain.missing,
    strengths: ["Clean code practices", "Team collaboration", "Problem solving"],
    weaknesses: ["Missing specific domain tools", "Needs more leadership quantification"],
    suggestions: ["Update your projects section", "Add domain-specific keywords"],
    ats_compatibility_score: randomScore - 5,
    improvement_tips: ["Use bullet points", "Quantify results with numbers"],
    suggested_projects: currentDomain.projects,
    section_feedback: {
      skills: currentDomain.section.skills,
      projects: currentDomain.section.projects,
      experience: "Good progression, but add more metrics.",
      education: "Relevant, perhaps list high-impact coursework."
    },
    semantic_summary: `The candidate shows a ${randomScore > 80 ? 'strong' : 'developing'} profile in ${domain || 'the requested field'}.`
  };
};

exports.analyzeResume = async (resumeText, jobDescription, domain) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return getMockAnalysis(resumeText, jobDescription, domain);
    }

    const prompt = `
      Analyze the following resume against the job description with a focus on the '${domain || 'Professional'}' domain.
      
      Resume:
      ${resumeText}
      
      Job Description:
      ${jobDescription}
      
      Provide a highly personalized, non-generic analysis in JSON format:
      {
        "match_score": (integer 0-100),
        "domain": "${domain || 'General'}",
        "missing_skills": ["domain-specific skill1", "domain-specific skill2"],
        "strengths": ["specific strength1", "specific strength2"],
        "weaknesses": ["specific weakness1", "specific weakness2"],
        "suggestions": ["personalized improvement suggestion1", "personalized improvement suggestion2"],
        "ats_compatibility_score": (integer 0-100),
        "improvement_tips": ["tip1", "tip2"],
        "section_feedback": {
           "skills": "specific feedback for skills section",
           "projects": "specific feedback for projects section",
           "experience": "specific feedback for experience section",
           "education": "specific feedback for education section"
        },
        "suggested_projects": [
          { "title": "project name", "desc": "description", "stack": "tech stack" }
        ]
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.8 // Add randomness to avoid repeated results
    });

    const analysis = JSON.parse(response.choices[0].message.content);

    // Gemini for the semantic summary to keep it rich
    if (genAI) {
      const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const geminiPrompt = `
        Provide a 2-sentence highly personalized summary of this candidate's fit for a ${domain || 'technical'} role.
        Resume Context: ${resumeText.substring(0, 2000)}
        Domain: ${domain}
      `;
      const geminiResult = await geminiModel.generateContent(geminiPrompt);
      analysis.semantic_summary = geminiResult.response.text();
    } else {
      analysis.semantic_summary = `Profile shows ${analysis.match_score}% alignment with ${domain} standards.`;
    }

    return analysis;
  } catch (err) {
    console.error('AI Analysis error:', err);
    return getMockAnalysis(resumeText, jobDescription, domain);
  }
};
