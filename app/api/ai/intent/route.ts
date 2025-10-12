import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type VisitorIntent = 'RECRUITER' | 'CLIENT' | 'COLLABORATOR' | 'STUDENT' | 'PEER' | 'UNKNOWN';

interface IntentAnalysis {
  intent: VisitorIntent;
  confidence: number;
  reasoning: string;
  suggestions: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { message, visitorData } = await request.json();
    
    // Try AI analysis first, fallback to keywords if needed
    const analysis = await analyzeIntentWithAI(message, visitorData);
    
    return NextResponse.json(analysis);
    
  } catch (error) {
    console.error('Intent Analysis Error:', error);

    // Parse message from request for fallback analysis
    const { message } = await request.json();

    // Fallback to keyword-based analysis if AI fails
    const fallbackAnalysis = analyzeVisitorIntent(message);
    return NextResponse.json(fallbackAnalysis);
  }
}

interface VisitorData {
  referrer?: string;
  userAgent?: string;
}

async function analyzeIntentWithAI(message: string, visitorData: VisitorData): Promise<IntentAnalysis> {
  const prompt = `
Analyze this visitor's intent for Mohamed Ibrahim's Full-Stack Developer portfolio:

Message: "${message}"
Referrer: ${visitorData?.referrer || 'direct'}
User Agent: ${visitorData?.userAgent?.slice(0, 50) || 'unknown'}

Determine the visitor type:
- RECRUITER: Looking to hire Mohamed for employment
- CLIENT: Wants to hire Mohamed for project/freelance work  
- COLLABORATOR: Seeking partnership or open source collaboration
- STUDENT: Learning from Mohamed or seeking guidance
- PEER: Fellow developer interested in technical discussions
- UNKNOWN: General browsing or unclear intent

Respond ONLY with valid JSON:
{
  "intent": "RECRUITER|CLIENT|COLLABORATOR|STUDENT|PEER|UNKNOWN",
  "confidence": 0.8,
  "reasoning": "Brief explanation",
  "keywords": ["keyword1", "keyword2"]
}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
    max_tokens: 200,
  });

  const aiResponse = completion.choices[0].message.content;
  
  try {
    const parsed = JSON.parse(aiResponse || '{}');
    
    return {
      intent: parsed.intent || 'UNKNOWN',
      confidence: Math.min(parsed.confidence || 0.5, 1),
      reasoning: `AI Analysis: ${parsed.reasoning || 'Analysis completed'}`,
      suggestions: generateSuggestions(parsed.intent || 'UNKNOWN')
    };
  } catch {
    console.log('AI response parsing failed, using keyword fallback');
    return analyzeVisitorIntent(message);
  }
}

// Keep keyword-based analysis as fallback
function analyzeVisitorIntent(message: string): IntentAnalysis {
  const lowerMessage = message.toLowerCase();
  
  const recruiterKeywords = ['hire', 'job', 'position', 'career', 'interview', 'resume', 'cv', 'salary', 'employment', 'opportunity', 'team', 'company'];
  const clientKeywords = ['project', 'build', 'develop', 'website', 'app', 'cost', 'price', 'budget', 'timeline', 'business', 'startup'];
  const collaboratorKeywords = ['collaborate', 'partner', 'together', 'team up', 'contribute', 'open source', 'github', 'work with'];
  const studentKeywords = ['learn', 'tutorial', 'how to', 'beginner', 'course', 'study', 'university', 'student', 'help me understand'];
  const peerKeywords = ['developer', 'programmer', 'code', 'tech', 'framework', 'library', 'architecture', 'best practices'];
  
  const scores = {
    RECRUITER: recruiterKeywords.filter(keyword => lowerMessage.includes(keyword)).length,
    CLIENT: clientKeywords.filter(keyword => lowerMessage.includes(keyword)).length,
    COLLABORATOR: collaboratorKeywords.filter(keyword => lowerMessage.includes(keyword)).length,
    STUDENT: studentKeywords.filter(keyword => lowerMessage.includes(keyword)).length,
    PEER: peerKeywords.filter(keyword => lowerMessage.includes(keyword)).length
  };
  
  const maxScore = Math.max(...Object.values(scores));
  const intent = Object.keys(scores).find(key => scores[key as keyof typeof scores] === maxScore) as VisitorIntent || 'UNKNOWN';
  const confidence = maxScore > 0 ? Math.min(maxScore / 3, 1) : 0.1;
  
  return {
    intent,
    confidence,
    reasoning: `Keyword Analysis: Found ${maxScore} matching terms`,
    suggestions: generateSuggestions(intent)
  };
}

function generateSuggestions(intent: VisitorIntent): string[] {
  const suggestionMap = {
    RECRUITER: [
      "View Mohamed's Resume",
      "Schedule Interview",
      "Check Availability",
      "Technical Skills Assessment"
    ],
    CLIENT: [
      "Get Project Quote",
      "View Portfolio",
      "Schedule Consultation",
      "Discuss Requirements"
    ],
    COLLABORATOR: [
      "GitHub Profile",
      "Open Source Projects", 
      "Partnership Opportunities",
      "Contact for Collaboration"
    ],
    STUDENT: [
      "Learning Resources",
      "Code Examples",
      "Mentorship Info",
      "Beginner Projects"
    ],
    PEER: [
      "Technical Discussion",
      "Best Practices",
      "Architecture Insights",
      "Connect on LinkedIn"
    ],
    UNKNOWN: [
      "Explore Portfolio", 
      "About Mohamed",
      "Contact Information",
      "Featured Projects"
    ]
  };
  
  return suggestionMap[intent] || suggestionMap.UNKNOWN;
}