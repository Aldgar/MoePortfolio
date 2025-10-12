import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI only if API key is available
let openai: OpenAI | null = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Mohamed's comprehensive data for AI responses
const MOHAMED_DATA = {
  personal: {
    name: "Mohamed Ibrahim",
    title: "Full-Stack Developer",
    location: "Lisbon, Portugal",
    email: "aldgar1988@protonmail.com",
    whatsapp: "+351 914 14 33 40",
    linkedin: "https://www.linkedin.com/in/mohamed-ibrahim-539308180/",
    github: "https://github.com/Aldgar",
    portfolioWebsite: "Available on this website's contact section",
  },
  experience: {
    current: {
      role: "Full-Stack Developer",
      duration: "1+ years of experience",
      focus: "Building scalable web applications and modern software solutions",
      responsibilities: [
        "Developing scalable web applications using React and Next.js",
        "Building robust backend APIs with NestJS and Node.js",
        "Working with databases like MongoDB and PostgreSQL",
        "Implementing modern UI/UX with TypeScript and Tailwind CSS",
        "Creating full-stack solutions from concept to deployment",
      ],
    },
    skills: {
      frontend: [
        "React",
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "JavaScript",
      ],
      backend: ["NestJS", "Node.js", "Express", "REST APIs", "GraphQL"],
      database: ["PostgreSQL", "MongoDB", "Redis", "Prisma"],
      tools: ["Git", "Docker", "AWS", "Vercel", "CI/CD"],
    },
  },
  projects: [
    {
      name: "NilToum Connect",
      type: "Job Platform (in development)",
      description:
        "A comprehensive job matching platform bridging the employment gap by offering a localized, community-driven hiring solution for regions often left out of global job networks",
      technologies: [
        "Next.js",
        "NestJS",
        "MongoDB",
        "TypeScript",
        "Tailwind CSS",
        "Prisma",
        "Supabase",
        "Docker",
        "Turborepo",
        "NextAuth.js",
        "Jest",
      ],
      features: [
        "Job board with skill-based profile matching",
        "User authentication with Google login",
        "Application tracking for candidates and recruiters",
        "Mobile-first, low-bandwidth-optimized UI",
        "Component-driven development with design system foundation",
        "CI/CD pipeline with GitHub Actions",
      ],
      challenges: [
        "Building for underserved regions with slow networks",
        "Implementing microservices-inspired modular structure",
        "Balancing performance, time-to-market, and infrastructure costs",
        "Creating scalable architecture for future growth",
      ],
      architecture:
        "Turborepo monorepo with Next.js frontend and NestJS backend, MongoDB with Prisma, containerized with Docker",
      github: "https://github.com/Aldgar/NilToum",
    },
    {
      name: "MonDo",
      type: "Social Media Platform",
      description:
        "A modern, responsive social media platform with real-time features and sleek design",
      technologies: [
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "MongoDB",
        "Clerk",
        "ShadCn",
        "WebSockets",
      ],
      features: [
        "User authentication with Clerk",
        "Real-time updates using WebSockets",
        "RESTful API for data management",
        "Responsive design",
        "Modern UI with ShadCn components",
      ],
      challenges: [
        "Implementing real-time features",
        "User management and authentication",
        "Responsive design across devices",
      ],
      website: "https://mon-do.vercel.app",
    },
    {
      name: "Users Dashboard",
      type: "Management System",
      description:
        "A user management dashboard with secure authentication and scalable architecture",
      technologies: [
        "React",
        "Express.js",
        "MongoDB",
        "Tailwind CSS",
        "Zod",
        "Supabase",
        "Docker",
      ],
      features: [
        "Secure user authentication",
        "RESTful API for data handling",
        "Performance-optimized design",
        "Containerized deployment",
      ],
      challenges: [
        "Ensuring security and scalability",
        "Efficient data handling",
        "Performance optimization",
      ],
      github: "https://github.com/Aldgar/Express.js-assesment",
    },
    {
      name: "Managers Dashboard",
      type: "Full-Stack Dashboard",
      description:
        "A comprehensive dashboard for managing managers with Next.js and NestJS integration",
      technologies: [
        "Next.js",
        "NestJS",
        "MongoDB",
        "TypeScript",
        "Tailwind CSS",
        "NextAuth.js",
        "Docker",
        "Supabase",
      ],
      features: [
        "Manager authentication using NextAuth.js",
        "Full-stack integration between Next.js and NestJS",
        "RESTful API with NestJS",
        "Containerized deployment",
      ],
      challenges: [
        "Seamless frontend-backend integration",
        "Secure authentication implementation",
        "Scalable architecture design",
      ],
      github: "https://github.com/Aldgar/Project-Managers-Backend-With-Nestjs",
    },
    {
      name: "AI-Powered Portfolio",
      type: "Personal Website",
      description:
        "This intelligent portfolio website with contextual AI assistant and admin functionality",
      technologies: ["Next.js", "TypeScript", "OpenAI API", "Tailwind CSS"],
      features: [
        "Contextual AI chat assistant with conversation memory",
        "Admin dashboard with authentication",
        "Responsive design",
        "Contact form integration",
        "Professional portfolio showcase",
      ],
      challenges: [
        "Implementing conversation memory for AI",
        "Creating contextual AI responses",
        "Building secure admin authentication",
        "Optimizing AI performance and response quality",
      ],
    },
  ],
};

export async function POST(request: NextRequest) {
  let message = "";
  let conversationHistory: Array<{ role: string; content: string }> = [];
  let responseType = "GENERAL";

  try {
    const requestData = await request.json();
    message = requestData.message;
    const action = requestData.action;
    const visitorIntent = requestData.visitorIntent;
    conversationHistory = requestData.conversationHistory || [];

    // Determine what type of response to generate
    responseType = determineResponseType(message, action);

    // If OpenAI is not available, return fallback response
    if (!openai) {
      const fallbackResponse = generateIntelligentFallback(
        message,
        conversationHistory
      );
      return NextResponse.json({
        response: fallbackResponse,
        responseType: "FALLBACK",
        actionSuggestions: generateContextualSuggestions(
          message,
          fallbackResponse,
          conversationHistory
        ),
      });
    }

    let systemPrompt = "";

    switch (responseType) {
      case "RESUME_GENERATION":
        systemPrompt = createResumePrompt(visitorIntent, conversationHistory);
        break;
      case "PROJECT_DEMO":
        systemPrompt = createProjectDemoPrompt(conversationHistory);
        break;
      case "TECHNICAL_INTERVIEW":
        systemPrompt = createInterviewPrompt(conversationHistory);
        break;
      default:
        systemPrompt = createGeneralPrompt(conversationHistory);
    }

    // Build conversation messages with history
    const conversationMessages: Array<{
      role: "system" | "user" | "assistant";
      content: string;
    }> = [{ role: "system", content: systemPrompt }];

    // Add recent conversation history for context
    if (conversationHistory.length > 0) {
      conversationHistory.forEach((msg: { role: string; content: string }) => {
        if (msg.role === "user" || msg.role === "assistant") {
          conversationMessages.push({
            role: msg.role as "user" | "assistant",
            content: msg.content,
          });
        }
      });
    }

    // Add current message
    conversationMessages.push({ role: "user", content: message });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: conversationMessages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;

    return NextResponse.json({
      response,
      responseType,
      actionSuggestions: generateContextualSuggestions(
        message,
        response,
        conversationHistory
      ),
    });
  } catch (error: unknown) {
    console.error("AI Error:", error);

    // Provide contextual fallback responses based on conversation history
    const fallbackResponse = generateIntelligentFallback(
      message,
      conversationHistory
    );

    return NextResponse.json({
      response: fallbackResponse,
      responseType,
      actionSuggestions: generateContextualSuggestions(
        message,
        fallbackResponse,
        conversationHistory
      ),
    });
  }
}

function determineResponseType(message: string, action?: string): string {
  const lowerMessage = message.toLowerCase();

  if (action) return action;

  // Resume generation keywords
  if (
    lowerMessage.includes("resume") ||
    lowerMessage.includes("cv") ||
    lowerMessage.includes("download") ||
    lowerMessage.includes("hire")
  ) {
    return "RESUME_GENERATION";
  }

  // Project demo keywords
  if (
    lowerMessage.includes("show me") ||
    lowerMessage.includes("demo") ||
    lowerMessage.includes("project") ||
    lowerMessage.includes("walk through")
  ) {
    return "PROJECT_DEMO";
  }

  // Technical interview keywords
  if (
    lowerMessage.includes("how would you") ||
    lowerMessage.includes("explain") ||
    lowerMessage.includes("technical") ||
    lowerMessage.includes("code") ||
    lowerMessage.includes("architecture")
  ) {
    return "TECHNICAL_INTERVIEW";
  }

  return "GENERAL";
}

function createResumePrompt(
  visitorIntent?: string,
  conversationHistory: Array<{ role: string; content: string }> = []
): string {
  const conversationContext =
    conversationHistory.length > 0
      ? `\n\nConversation History:\n${conversationHistory.map((msg) => `${msg.role}: ${msg.content}`).join("\n")}`
      : "";

  const intentFocus =
    visitorIntent === "RECRUITER"
      ? "technical skills and employment readiness"
      : visitorIntent === "CLIENT"
        ? "project delivery and business value"
        : "comprehensive technical background";

  return `You are Mohamed Ibrahim's AI assistant specializing in resume generation. 

MOHAMED'S DATA: ${JSON.stringify(MOHAMED_DATA, null, 2)}

${conversationContext}

IMPORTANT: For PDF resume requests, say: "I can help you get Mohamed's resume right now! You can download his complete CV directly from this website. Just scroll down to the 'Download My CV' section, or I can provide you with the direct download link: /Mohamed-Ibrahim-Full-Stack-Software-Developer-Resume.pdf

This resume includes his full technical skills, experience, and project portfolio. Would you like me to highlight any specific aspects of his background?"

Focus on ${intentFocus} while being contextual to previous conversation.

Be professional, confident, and reference previous topics when relevant.`;
}

function createProjectDemoPrompt(
  conversationHistory: Array<{ role: string; content: string }> = []
): string {
  const conversationContext =
    conversationHistory.length > 0
      ? `\n\nConversation History:\n${conversationHistory.map((msg) => `${msg.role}: ${msg.content}`).join("\n")}`
      : "";

  return `You are Mohamed Ibrahim's AI assistant specializing in interactive project demonstrations.

MOHAMED'S DATA: ${JSON.stringify(MOHAMED_DATA, null, 2)}

${conversationContext}

When discussing projects, be contextual to previous conversation:
1. Reference previous topics when relevant
2. Build on what was already discussed
3. Highlight technical achievements contextually
4. Explain business impact with conversation awareness
5. Offer specific features based on conversation flow

Always be engaging and reference the conversation history naturally.`;
}

function createInterviewPrompt(
  conversationHistory: Array<{ role: string; content: string }> = []
): string {
  const conversationContext =
    conversationHistory.length > 0
      ? `\n\nConversation History:\n${conversationHistory.map((msg) => `${msg.role}: ${msg.content}`).join("\n")}`
      : "";

  return `You are Mohamed Ibrahim in a technical interview setting.

MOHAMED'S DATA: ${JSON.stringify(MOHAMED_DATA, null, 2)}

${conversationContext}

Respond as Mohamed would in a technical interview, being contextual:
1. Reference previous conversation when relevant
2. Answer with specific examples from real projects
3. Build on technical topics already discussed
4. Show enthusiasm for problem-solving
5. Connect current responses to conversation history

Be confident, detailed, and maintain conversation continuity.`;
}

function createGeneralPrompt(
  conversationHistory: Array<{ role: string; content: string }> = []
): string {
  const conversationContext =
    conversationHistory.length > 0
      ? `\n\nConversation History:\n${conversationHistory.map((msg) => `${msg.role}: ${msg.content}`).join("\n")}`
      : "";

  const lastUserMessage =
    conversationHistory.filter((msg) => msg.role === "user").slice(-1)[0]
      ?.content || "";

  return `You are Mohamed Ibrahim's intelligent AI assistant. You provide contextual, personalized responses based on conversation history.

MOHAMED'S DATA: ${JSON.stringify(MOHAMED_DATA, null, 2)}

${conversationContext}

IMPORTANT INSTRUCTIONS:
1. ALWAYS reference previous conversation when relevant
2. For resume/PDF requests: Say "I can help you get Mohamed's resume right now! You can download his complete CV directly from this website. Just scroll down to the 'Download My CV' section or use this direct link: /Mohamed-Ibrahim-Full-Stack-Software-Developer-Resume.pdf"
3. For contact requests: Use ONLY the contact information from MOHAMED_DATA above (aldgar1988@protonmail.com, +351 914 14 33 40, Lisbon Portugal)
4. For hiring/employment inquiries: Be enthusiastic and professional! Mohamed is actively seeking opportunities. Highlight his skills, experience, and availability.
5. Be contextual - build on previous topics discussed
6. Provide dynamic responses that feel like a real conversation
7. Never use generic pre-written answers or hardcoded contact info

Current context: ${lastUserMessage ? `Responding to: "${lastUserMessage}"` : "Starting conversation"}

Respond as Mohamed's intelligent assistant with full conversation awareness.`;
}

function generateContextualSuggestions(
  userMessage: string,
  aiResponse: string | null,
  conversationHistory: Array<{ role: string; content: string }> = []
): string[] {
  const message = userMessage.toLowerCase();
  const response = (aiResponse || "").toLowerCase();

  // Analyze conversation context
  const hasAskedAboutProjects = conversationHistory.some(
    (msg) =>
      msg.content.toLowerCase().includes("project") ||
      msg.content.toLowerCase().includes("portfolio")
  );
  const hasAskedAboutSkills = conversationHistory.some(
    (msg) =>
      msg.content.toLowerCase().includes("skill") ||
      msg.content.toLowerCase().includes("technology")
  );
  const hasAskedAboutExperience = conversationHistory.some(
    (msg) =>
      msg.content.toLowerCase().includes("experience") ||
      msg.content.toLowerCase().includes("work")
  );
  const hasAskedAboutContact = conversationHistory.some(
    (msg) =>
      msg.content.toLowerCase().includes("contact") ||
      msg.content.toLowerCase().includes("hire")
  );

  // Context-aware suggestions based on current conversation
  if (message.includes("project") || response.includes("project")) {
    return [
      "Tell me more about NilToum Connect",
      "What technologies did you use?",
      "Can I see the GitHub repository?",
      "What challenges did you face?",
      "Show me another project",
    ];
  }

  if (
    message.includes("skill") ||
    message.includes("technology") ||
    response.includes("skill")
  ) {
    return [
      "How long have you been using React?",
      "Tell me about your backend expertise",
      "What's your experience with databases?",
      "Do you know cloud technologies?",
      "What about mobile development?",
    ];
  }

  if (
    message.includes("experience") ||
    message.includes("work") ||
    response.includes("experience")
  ) {
    return [
      "What do you do at Teleperformance?",
      "Tell me about your career progression",
      "What's your biggest achievement?",
      "Do you lead a team?",
      "What's your typical workday like?",
    ];
  }

  if (
    message.includes("hire") ||
    message.includes("contact") ||
    message.includes("resume") ||
    response.includes("contact") ||
    message.includes("opportunity") ||
    message.includes("job")
  ) {
    return [
      "Download CV PDF now",
      "What's your availability?",
      "Discuss project requirements",
      "View portfolio & experience",
    ];
  }

  if (
    message.includes("resume") ||
    message.includes("cv") ||
    response.includes("resume")
  ) {
    return [
      "Create PDF resume for frontend role",
      "Generate backend developer resume",
      "Make full-stack resume",
      "Customize for startup position",
      "Download complete portfolio",
    ];
  }

  // Default suggestions based on what hasn't been asked yet
  const suggestions = [];

  if (!hasAskedAboutProjects) suggestions.push("Show me your best projects");
  if (!hasAskedAboutSkills) suggestions.push("What are your technical skills?");
  if (!hasAskedAboutExperience)
    suggestions.push("Tell me about your experience");
  if (!hasAskedAboutContact) suggestions.push("How can I hire you?");

  // Add some follow-up questions based on the response
  if (response.includes("react") || response.includes("next.js")) {
    suggestions.push("What's your React expertise level?");
  }
  if (response.includes("node") || response.includes("backend")) {
    suggestions.push("Tell me about your backend work");
  }

  // Ensure we have at least 4 suggestions
  while (suggestions.length < 4) {
    const additional = [
      "What makes you unique as a developer?",
      "Tell me about your problem-solving approach",
      "What's your ideal work environment?",
      "Show me code examples",
      "What are you currently learning?",
    ];

    for (const suggestion of additional) {
      if (!suggestions.includes(suggestion) && suggestions.length < 4) {
        suggestions.push(suggestion);
      }
    }
    break;
  }

  return suggestions.slice(0, 4);
}

function generateIntelligentFallback(
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }> = []
): string {
  const message = userMessage.toLowerCase();

  // Contextual responses based on conversation history
  const hasAskedAboutProjects = conversationHistory.some(
    (msg) =>
      msg.content.toLowerCase().includes("project") ||
      msg.content.toLowerCase().includes("portfolio")
  );

  const hasAskedAboutContact = conversationHistory.some(
    (msg) =>
      msg.content.toLowerCase().includes("contact") ||
      msg.content.toLowerCase().includes("email")
  );

  // PDF Resume requests
  if (
    message.includes("resume") ||
    message.includes("pdf") ||
    message.includes("cv")
  ) {
    return "Great! I can help you get Mohamed's resume right away! 📄\n\nYou can download his complete CV directly from this website:\n• Scroll down to the 'Download My CV' section\n• Or use this direct link: /Mohamed-Ibrahim-Full-Stack-Software-Developer-Resume.pdf\n\nThis resume includes his full technical skills, 1+ years of experience, and detailed project portfolio. Would you like me to highlight any specific aspects of his background?";
  }

  // Project inquiries
  if (
    message.includes("project") ||
    message.includes("work") ||
    message.includes("portfolio")
  ) {
    if (hasAskedAboutProjects) {
      return "Since you're interested in Mohamed's projects, I'd recommend checking out NilToum Connect - his most comprehensive full-stack application. It's a job platform built with Next.js, NestJS, and PostgreSQL. Would you like to know more about the technical implementation or see other projects?";
    }
    return "Mohamed has several impressive projects! His flagship project is NilToum Connect, a comprehensive job matching platform. He's also built AI-powered solutions and modern web applications. What type of project interests you most?";
  }

  // Contact requests
  if (
    message.includes("contact") ||
    message.includes("email") ||
    message.includes("reach")
  ) {
    return `${hasAskedAboutContact ? "As mentioned earlier, here's" : "Here's"} Mohamed's contact information:\n📧 Email: aldgar1988@protonmail.com\n📱 WhatsApp: +351 914 14 33 40\n📍 Location: Lisbon, Portugal\n\nHe's always open to discussing new opportunities and collaborations!`;
  }

  // Skills inquiries
  if (
    message.includes("skill") ||
    message.includes("tech") ||
    message.includes("experience")
  ) {
    return "Mohamed is a full-stack developer with 1+ years of experience. His technical stack includes React, Next.js, Node.js, TypeScript, Python, and AWS. He specializes in building scalable web applications and has experience with both frontend and backend development. What specific technology would you like to know more about?";
  }

  // Hiring/Employment inquiries
  if (
    message.includes("hire") ||
    message.includes("employment") ||
    message.includes("job") ||
    message.includes("work with") ||
    message.includes("recruit") ||
    message.includes("position") ||
    message.includes("opportunity")
  ) {
    return "Great question! Mohamed is actively open to new opportunities and collaborations. 🚀\n\n✅ **Available for:**\n• Full-time positions\n• Freelance projects\n• Contract work\n• Remote opportunities\n\n📧 **Get in touch:**\nEmail: aldgar1988@protonmail.com\nWhatsApp: +351 914 14 33 40\nLocation: Lisbon, Portugal\n\nHe's experienced in React, Next.js, Node.js, TypeScript, and modern web development. Feel free to reach out to discuss your project requirements!";
  }

  // Default contextual response
  if (conversationHistory.length > 0) {
    return `I understand you're asking about "${userMessage}". While I'm temporarily unable to provide my full AI capabilities, I can still help you learn about Mohamed's professional background. Please feel free to contact him directly at aldgar1988@protonmail.com for detailed discussions!`;
  }

  return "Hello! I'm Mohamed's AI assistant. While I'm temporarily experiencing some technical issues, I can still help you learn about his work. Mohamed is a full-stack developer specializing in React, Next.js, and modern web technologies. For detailed conversations, please reach out to him at aldgar1988@protonmail.com!";
}
