/**
 * IRIS Question Intent Detector & Context Resolution
 * 
 * Accurately classifies user queries into educational intents:
 * - Definition
 * - Concept explanation
 * - Numerical problem
 * - Problem solving
 * - Code generation
 * - Debugging
 * - Comparison
 * - Summary
 * - Revision
 * - Practice
 * - Exam preparation
 * - Interview preparation
 * - Career guidance
 * - Research guidance
 * - Writing
 * - Clarification
 * - Follow-up question
 * 
 * Also handles multi-turn pronoun & ellipsis resolution.
 */

export type QuestionIntent =
  | "definition"
  | "concept_explanation"
  | "numerical_problem"
  | "problem_solving"
  | "code_generation"
  | "debugging"
  | "comparison"
  | "summary"
  | "revision"
  | "practice"
  | "exam_preparation"
  | "interview_preparation"
  | "career_guidance"
  | "research_guidance"
  | "writing"
  | "clarification"
  | "follow_up";

export interface IntentAnalysisResult {
  intent: QuestionIntent;
  intentLabel: string;
  isFollowUp: boolean;
  resolvedQuery: string;
  detectedTopic?: string;
  detectedSubTopic?: string;
  suggestedResponseStructure: string[];
}

export function detectQuestionIntent(
  rawQuery: string,
  history: Array<{ sender: "user" | "agent"; content: string }>,
  tutorSubject: string
): IntentAnalysisResult {
  const query = (rawQuery || "").trim();
  const lower = query.toLowerCase();

  const { isFollowUp, resolvedQuery, previousTopic, detectedSubTopic } = resolveFollowUpContext(query, history);

  // 2. Identify Intent
  let intent: QuestionIntent = "concept_explanation";
  let intentLabel = "Concept Explanation";

  // Debugging
  if (
    lower.includes("debug") ||
    lower.includes("error") ||
    lower.includes("exception") ||
    lower.includes("why does this") && lower.includes("loop") ||
    lower.includes("infinite loop") ||
    lower.includes("why is this returning") ||
    lower.includes("fix this code") ||
    lower.includes("doesn't work") ||
    lower.includes("bug in")
  ) {
    intent = "debugging";
    intentLabel = "Debugging & Error Resolution";
  }
  // Code Generation
  else if (
    lower.startsWith("code") ||
    lower.includes("write a function") ||
    lower.includes("write code") ||
    lower.includes("implement") ||
    lower.includes("create a script") ||
    lower.includes("how to code") ||
    (lower.includes("in python") || lower.includes("in javascript") || lower.includes("in typescript")) && !lower.includes("difference")
  ) {
    intent = "code_generation";
    intentLabel = "Code Generation & Implementation";
  }
  // Comparison
  else if (
    lower.includes("difference between") ||
    lower.includes("vs") ||
    lower.includes("versus") ||
    lower.includes("compare") ||
    lower.includes("how does") && lower.includes("differ from") ||
    lower.includes("distinguish between")
  ) {
    intent = "comparison";
    intentLabel = "Conceptual Comparison";
  }
  // Numerical / Mathematical Problem
  else if (
    (tutorSubject === "Mathematics" || lower.includes("solve") || lower.includes("calculate") || lower.includes("derivative of") || lower.includes("integral of")) &&
    (/\d+/.test(query) || lower.includes("solve") || lower.includes("calculate") || lower.includes("find x") || lower.includes("differentiate") || lower.includes("integrate")) &&
    !lower.includes("difference between") &&
    !lower.includes("what is algebra") &&
    !lower.includes("explain matrices")
  ) {
    intent = "numerical_problem";
    intentLabel = "Numerical Problem & Calculation";
  }
  // Definition
  else if (
    lower.startsWith("what is ") ||
    lower.startsWith("what are ") ||
    lower.startsWith("define ") ||
    lower.startsWith("definition of ") ||
    lower.includes("meaning of")
  ) {
    intent = "definition";
    intentLabel = "Formal Definition & Terminology";
  }
  // Exam Preparation
  else if (
    lower.includes("exam") ||
    lower.includes("test prep") ||
    lower.includes("important questions") ||
    lower.includes("high yield") ||
    lower.includes("marks") ||
    lower.includes("syllabus")
  ) {
    intent = "exam_preparation";
    intentLabel = "Exam Preparation & High-Yield Strategy";
  }
  // Interview Preparation
  else if (
    lower.includes("interview") ||
    lower.includes("mock question") ||
    lower.includes("behavioral question") ||
    lower.includes("star method") ||
    lower.includes("how to answer in interview")
  ) {
    intent = "interview_preparation";
    intentLabel = "Interview Preparation & STAR Coaching";
  }
  // Career Guidance
  else if (
    lower.includes("career") ||
    lower.includes("skills should i") ||
    lower.includes("roadmap") ||
    lower.includes("job role") ||
    lower.includes("data analyst role") ||
    lower.includes("software engineer role") ||
    lower.includes("resume") ||
    lower.includes("how to become a")
  ) {
    intent = "career_guidance";
    intentLabel = "Strategic Career Guidance & Skill Mapping";
  }
  // Research Guidance
  else if (
    lower.includes("research") ||
    lower.includes("literature review") ||
    lower.includes("hypothesis") ||
    lower.includes("methodology") ||
    lower.includes("citation") ||
    lower.includes("apa") ||
    lower.includes("finer")
  ) {
    intent = "research_guidance";
    intentLabel = "Academic Research Methodology";
  }
  // Writing & Grammar
  else if (
    lower.includes("grammar") ||
    lower.includes("writing") ||
    lower.includes("essay") ||
    lower.includes("thesis statement") ||
    lower.includes("passive voice") ||
    lower.includes("punctuation") ||
    lower.includes("rhetoric")
  ) {
    intent = "writing";
    intentLabel = "Writing, Rhetoric & Grammar Craft";
  }
  // Practice
  else if (
    lower.includes("practice") ||
    lower.includes("quiz me") ||
    lower.includes("give me a problem") ||
    lower.includes("exercise") ||
    lower.includes("test my knowledge")
  ) {
    intent = "practice";
    intentLabel = "Targeted Practice & Self-Assessment";
  }
  // Revision / Summary
  else if (
    lower.includes("summary") ||
    lower.includes("summarize") ||
    lower.includes("recap") ||
    lower.includes("quick revision") ||
    lower.includes("in short") ||
    lower.includes("key points")
  ) {
    intent = "summary";
    intentLabel = "Summary & Rapid Revision";
  }
  // Clarification / Follow-up
  else if (isFollowUp) {
    intent = "follow_up";
    intentLabel = "Contextual Follow-Up";
  }

  // 3. Determine Recommended Response Structure based on Intent
  const suggestedResponseStructure = getSuggestedResponseStructure(intent, tutorSubject);

  return {
    intent,
    intentLabel,
    isFollowUp,
    resolvedQuery,
    detectedTopic: previousTopic || extractTopicFromQuery(query),
    detectedSubTopic,
    suggestedResponseStructure,
  };
}

/**
 * Resolves follow-up pronouns and references (e.g. "Explain the second one", "give an example of it")
 */
function resolveFollowUpContext(
  currentQuery: string,
  history: Array<{ sender: "user" | "agent"; content: string }>
): {
  isFollowUp: boolean;
  resolvedQuery: string;
  previousTopic: string;
  detectedSubTopic?: string;
} {
  const q = currentQuery.trim();
  const lower = q.toLowerCase();

  let previousTopic = "";
  let previousAgentResponse = "";

  if (history && history.length > 0) {
    // Find last agent response and last user question
    for (let i = history.length - 1; i >= 0; i--) {
      const msg = history[i];
      if (msg.sender === "agent" && !previousAgentResponse) {
        previousAgentResponse = msg.content;
      }
      if (msg.sender === "user" && msg.content.trim() !== q && !previousTopic) {
        previousTopic = msg.content.trim();
      }
    }
  }

  // Check for follow-up triggers
  const pronounTriggers = [
    /\b(it|its|this|that|these|those|the second one|the first one|the third one|the last one|the former|the latter|second one|first one|third one)\b/i,
    /^(explain simply|simplify that|can you simplify that|in simpler terms|make it simpler|simpler example|give an example|give another example|another example|one more example|solve it|how so|why\??|why does that happen|more details|elaborate|clarify)\b/i,
    /^(what about|how about|can you explain)\s+(the second|the first|the third|it|this|that)\b/i,
  ];

  const isFollowUp = pronounTriggers.some(rgx => rgx.test(lower)) || (q.length < 30 && !lower.includes("what is") && !lower.includes("how to") && !lower.includes("solve "));

  let resolvedQuery = q;
  let detectedSubTopic: string | undefined = undefined;

  if (isFollowUp && previousTopic) {
    // A. Ordinal references ("the second one", "the first one", "the third one")
    if ((lower.includes("second") || lower.includes("2nd")) && previousAgentResponse) {
      const match2 =
        previousAgentResponse.match(/2\.\s+\*\*?([^\*\n\:]+)\*\*?/i) ||
        previousAgentResponse.match(/###\s*2\.\s*([^\n\:]+)/i) ||
        previousAgentResponse.match(/(?:second|2nd)\s*(?:normal form|rule|item|pillar)?\s*[:\-]??\s*\*\*?([^\*\n\:]+)\*\*?/i);
      if (match2 && match2[1]) {
        detectedSubTopic = match2[1].trim();
        resolvedQuery = `${previousTopic} ${detectedSubTopic} detailed breakdown`;
      } else {
        resolvedQuery = `${previousTopic} second concept detailed breakdown`;
      }
    } else if ((lower.includes("first") || lower.includes("1st")) && previousAgentResponse) {
      const match1 =
        previousAgentResponse.match(/1\.\s+\*\*?([^\*\n\:]+)\*\*?/i) ||
        previousAgentResponse.match(/###\s*1\.\s*([^\n\:]+)/i);
      if (match1 && match1[1]) {
        detectedSubTopic = match1[1].trim();
        resolvedQuery = `${previousTopic} ${detectedSubTopic} detailed breakdown`;
      } else {
        resolvedQuery = `${previousTopic} first concept detailed breakdown`;
      }
    } else if ((lower.includes("third") || lower.includes("3rd")) && previousAgentResponse) {
      const match3 =
        previousAgentResponse.match(/3\.\s+\*\*?([^\*\n\:]+)\*\*?/i) ||
        previousAgentResponse.match(/###\s*3\.\s*([^\n\:]+)/i);
      if (match3 && match3[1]) {
        detectedSubTopic = match3[1].trim();
        resolvedQuery = `${previousTopic} ${detectedSubTopic} detailed breakdown`;
      } else {
        resolvedQuery = `${previousTopic} third concept detailed breakdown`;
      }
    } 
    // B. "Give another example"
    else if (lower.includes("another example") || lower.includes("more example") || lower.includes("new example")) {
      resolvedQuery = `${previousTopic} alternative concrete worked example`;
    }
    // C. "Why?" or "Why does that happen?"
    else if (lower.startsWith("why") || lower === "why?" || lower === "why") {
      resolvedQuery = `${previousTopic} underlying physical mathematical reasoning mechanism why`;
    }
    // D. "Can you simplify that?"
    else if (lower.includes("simplify") || lower.includes("simpler") || lower.includes("simple terms")) {
      resolvedQuery = `${previousTopic} intuitive simple beginner explanation analogy`;
    }
    else {
      resolvedQuery = `${previousTopic} ${q}`;
    }
  }

  return { isFollowUp, resolvedQuery, previousTopic, detectedSubTopic };
}

function extractTopicFromQuery(query: string): string {
  return query
    .replace(/what is the difference between|difference between|what is|explain|why does|how does|can you tell me about|how to/gi, "")
    .replace(/[\?\!\.]/g, "")
    .trim();
}

function getSuggestedResponseStructure(intent: QuestionIntent, subject: string): string[] {
  switch (intent) {
    case "comparison":
      return [
        "Core Distinction & High-Level Summary",
        "Detailed Feature-by-Feature Comparison Table/Breakdown",
        "Concrete Illustrative Examples for Both Concepts",
        "When to Use or Choose Which (Decision Matrix)",
        "Common Misconceptions & Pitfalls",
      ];
    case "numerical_problem":
      return [
        "Problem Understanding & Given Values",
        "Governing Mathematical Formula/Method Selection",
        "Step-by-Step Algebraic Derivation & Calculation",
        "Verification / Sanity Check",
        "Emphasized **Final Answer: ...**",
      ];
    case "debugging":
      return [
        "Error Identification (What is going wrong)",
        "Root Cause Analysis (Why the error occurs)",
        "Corrected Code Solution",
        "Explanation of the Fix & State Flow",
        "Defensive Programming Best Practice",
      ];
    case "code_generation":
      return [
        "Architectural Approach & Data Structure Selection",
        "Clean, Commented Code Implementation",
        "Key Line Walkthrough & Mechanism",
        "Expected Output / Sample Execution",
        "Time & Space Complexity (Big-O)",
      ];
    case "definition":
      return [
        "Formal Definition & Core Meaning",
        "Essential Components / Key Axioms",
        "Intuitive Real-World or Numerical Example",
        "Why this concept is fundamental in " + subject,
      ];
    case "career_guidance":
      return [
        "Target Role Overview & Industry Expectations",
        "Essential Technical Stack & Core Competencies",
        "Hands-On Proof of Work / Capstone Projects",
        "Prioritized Actionable Roadmap (Phase-by-Phase)",
        "Immediate Next Steps & Interview Preparation",
      ];
    case "research_guidance":
      return [
        "Methodological Framing & Epistemological Stance",
        "Core Academic Concept & Structural Breakdown",
        "Design Standards & Quality Criteria",
        "Practical Scholarly Example / Application",
        "Scholarly Integrity & Citation Verification",
      ];
    default:
      return [
        "Conceptual Foundation & Definition",
        "Underlying Process or Mechanics",
        "Concrete Example or Application",
        "Key Takeaways & Educational Synthesis",
      ];
  }
}
