import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Mohamed's comprehensive data for AI responses
const MOHAMED_DATA = {
  personal: {
    name: "Mohamed Ibrahim",
    title: "Full-Stack Developer",
    location: "Portugal",
    email: "mohamed@example.com", // Replace with real email
    linkedin: "https://linkedin.com/in/your-profile",
    github: "https://github.com/MohamedIbrahem4"
  },
  experience: {
    current: {
      company: "Teleperformance Portugal",
      role: "Full-Stack Developer",
      duration: "2023 - Present",
      responsibilities: [
        "Developing scalable web applications using React and Next.js",
        "Building robust backend APIs with NestJS and TypeScript", 
        "Optimizing database performance and implementing caching strategies",
        "Leading code reviews and mentoring junior developers"
      ]
    },
    skills: {
      frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "JavaScript"],
      backend: ["NestJS", "Node.js", "Express", "REST APIs", "GraphQL"],
      database: ["PostgreSQL", "MongoDB", "Redis", "Prisma"],
      tools: ["Git", "Docker", "AWS", "Vercel", "CI/CD"]
    }
  },
  projects: [
    {
      name: "NilToum Connect",
      type: "Job Platform",
      description: "A comprehensive job matching platform connecting employers with candidates",
      technologies: ["Next.js", "NestJS", "PostgreSQL", "TypeScript", "Tailwind CSS"],
      features: [
        "Advanced job search and filtering",
        "Real-time messaging system",
        "AI-powered job matching",
        "Comprehensive user profiles",
        "Payment integration for premium features"
      ],
      challenges: [
        "Implementing real-time notifications",
        "Optimizing search performance with large datasets",
        "Building secure authentication system"
      ],
      architecture: "Microservices with API Gateway, separate frontend and backend, Redis for caching"
    },
    {
      name: "E-Commerce Platform",
      type: "Web Application", 
      description: "Modern e-commerce solution with inventory management",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      features: ["Product catalog", "Shopping cart", "Payment processing", "Admin dashboard"],
      challenges: ["Payment security", "Inventory synchronization", "Performance optimization"]
    }
  ]
};

export async function POST(request: NextRequest) {
  try {
    const { message, action, visitorIntent } = await request.json();
    
    // Determine what type of response to generate
    const responseType = determineResponseType(message, action);
    
    let systemPrompt = "";
    
    switch (responseType) {
      case 'RESUME_GENERATION':
        systemPrompt = createResumePrompt(visitorIntent);
        break;
      case 'PROJECT_DEMO':
        systemPrompt = createProjectDemoPrompt();
        break;
      case 'TECHNICAL_INTERVIEW':
        systemPrompt = createInterviewPrompt();
        break;
      default:
        systemPrompt = createGeneralPrompt();
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;
    
    return NextResponse.json({ 
      response,
      responseType,
      actionSuggestions: generateActionSuggestions(responseType)
    });
    
  } catch (error: unknown) {
    console.error('AI Error:', error);
    return NextResponse.json(
      { error: 'AI service temporarily unavailable' },
      { status: 500 }
    );
  }
}

function determineResponseType(message: string, action?: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (action) return action;
  
  // Resume generation keywords
  if (lowerMessage.includes('resume') || lowerMessage.includes('cv') || 
      lowerMessage.includes('download') || lowerMessage.includes('hire')) {
    return 'RESUME_GENERATION';
  }
  
  // Project demo keywords  
  if (lowerMessage.includes('show me') || lowerMessage.includes('demo') ||
      lowerMessage.includes('project') || lowerMessage.includes('walk through')) {
    return 'PROJECT_DEMO';
  }
  
  // Technical interview keywords
  if (lowerMessage.includes('how would you') || lowerMessage.includes('explain') ||
      lowerMessage.includes('technical') || lowerMessage.includes('code') ||
      lowerMessage.includes('architecture')) {
    return 'TECHNICAL_INTERVIEW';
  }
  
  return 'GENERAL';
}

function createResumePrompt(visitorIntent?: string): string {
  const intentFocus = visitorIntent === 'RECRUITER' ? 
    'technical skills and employment readiness' :
    visitorIntent === 'CLIENT' ? 
    'project delivery and business value' :
    'comprehensive technical background';

  return `You are Mohamed Ibrahim's AI assistant specializing in resume generation. 

MOHAMED'S DATA: ${JSON.stringify(MOHAMED_DATA, null, 2)}

When someone asks for a resume or CV, provide a structured response focusing on ${intentFocus}.

Format your response as:
1. Brief introduction
2. Key highlights relevant to the visitor
3. Offer to generate a custom PDF resume
4. Ask what specific aspects they'd like emphasized

Be professional, confident, and highlight Mohamed's unique strengths.`;
}

function createProjectDemoPrompt(): string {
  return `You are Mohamed Ibrahim's AI assistant specializing in interactive project demonstrations.

MOHAMED'S DATA: ${JSON.stringify(MOHAMED_DATA, null, 2)}

When someone asks about projects:
1. Enthusiastically introduce the relevant project
2. Highlight key technical achievements
3. Explain the business impact
4. Offer to show specific features or code examples
5. Use action words like "Let me show you..." or "I'll demonstrate..."

Always offer to navigate them to specific sections of the portfolio.
Be engaging and make them excited about the technical work.`;
}

function createInterviewPrompt(): string {
  return `You are Mohamed Ibrahim in a technical interview setting.

MOHAMED'S DATA: ${JSON.stringify(MOHAMED_DATA, null, 2)}

Respond as Mohamed would in a technical interview:
1. Answer questions with specific examples from real projects
2. Explain your thought process and decision-making
3. Mention challenges you've overcome
4. Show enthusiasm for problem-solving
5. Reference actual code architecture and solutions

Be confident, detailed, and demonstrate deep technical knowledge.
Always relate answers back to real project experience.`;
}

function createGeneralPrompt(): string {
  return `You are Mohamed Ibrahim's AI assistant with comprehensive knowledge about his portfolio.

MOHAMED'S DATA: ${JSON.stringify(MOHAMED_DATA, null, 2)}

Provide helpful, professional responses about Mohamed's:
- Experience and background
- Technical skills and projects  
- Availability and contact information
- Career achievements

Keep responses informative but concise. Always offer to provide more specific information or demonstrate capabilities.`;
}

function generateActionSuggestions(responseType: string): string[] {
  switch (responseType) {
    case 'RESUME_GENERATION':
      return [
        "Generate Custom PDF Resume",
        "View Technical Skills",
        "See Work Experience", 
        "Download Portfolio"
      ];
    case 'PROJECT_DEMO':
      return [
        "Show NilToum Connect Demo",
        "View Project Architecture",
        "See Code Examples",
        "Explore Live Projects"
      ];
    case 'TECHNICAL_INTERVIEW':
      return [
        "Ask Another Technical Question",
        "See Code Implementation",
        "Discuss Architecture Decisions",
        "View Problem-Solving Examples"
      ];
    default:
      return [
        "Learn About Projects",
        "View Resume",
        "Ask Technical Questions",
        "Contact Mohamed"
      ];
  }
}