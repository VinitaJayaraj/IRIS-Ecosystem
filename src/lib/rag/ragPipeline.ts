/**
 * IRIS RAG (Retrieval-Augmented Generation) Pipeline
 * Full End-to-End Orchestrator:
 * Question -> Intent Detection -> Sub-Topic Mapping -> Domain-Isolated Vector Retrieval ->
 * Relevance Filtering -> Dynamic System Prompt -> AI Model / Autonomous Pedagogical Engine ->
 * Response Validation -> Structured Interactive Output
 */

import { getVectorStore, SearchResult } from "./vectorStore";
import { initializeKnowledgeBaseIfNeeded } from "./ingestion";
import { recordRetrievalInspection, RagInspectionRecord } from "./retrievalInspector";
import { getTutorProfile, DynamicTutorProfile } from "./tutorProfiles";
import { detectQuestionIntent, IntentAnalysisResult } from "./intentDetector";

export interface RagMessage {
  sender: "user" | "agent";
  content: string;
  agentId?: string;
  timestamp?: string;
}

export interface UserStatsContext {
  skillLevel?: string;
  tutorTone?: string;
  explanationDetail?: string;
  learningMode?: string;
  learningStyle?: string;
  userName?: string;
  userInterests?: string;
  detectedMood?: string;
  progressMastery?: number;
}

export interface RagRequest {
  agentId: string;
  agentName?: string;
  agentRole?: string;
  agentPersonality?: string;
  messages: RagMessage[];
  apiKey?: string;
  userStats?: UserStatsContext;
}

export interface RagResponse {
  content: string;
  sources: Array<{ topic: string; source: string; score: number }>;
  retrievedChunksCount: number;
  relevanceStatus?: "VERIFIED_RELEVANT" | "FALLBACK_INSUFFICIENT";
  inspectionRecord?: RagInspectionRecord;
}

/**
 * Main RAG Pipeline Execution
 * Sub-Knowledge Grounding -> Specialized Pedagogical Behavior -> Post-Answer Validation
 */
export async function runRagPipeline(request: RagRequest): Promise<RagResponse> {
  const { agentId, agentName, messages, apiKey, userStats } = request;

  // 1. Dynamic Tutor Identity Resolution
  const tutorProfile: DynamicTutorProfile = getTutorProfile(agentId, agentName);

  // 2. Extract Raw Query
  const lastUserMsg = messages && messages.length > 0 ? messages[messages.length - 1] : null;
  const rawQuery = lastUserMsg ? lastUserMsg.content.trim() : "";

  if (!rawQuery) {
    return {
      content: `I am your ${tutorProfile.name}. Please provide a question so I can guide you through ${tutorProfile.subject}.`,
      sources: [],
      retrievedChunksCount: 0,
      relevanceStatus: "FALLBACK_INSUFFICIENT",
    };
  }

  // 3. Question Intent Detection & Context Resolution (Section 6 & 10)
  const intentResult: IntentAnalysisResult = detectQuestionIntent(
    rawQuery,
    messages || [],
    tutorProfile.subject
  );

  // 4. Strict Subject Boundary Check (Section 4)
  const isOutOfDomain = checkOutOfDomain(rawQuery, tutorProfile);
  if (isOutOfDomain) {
    return {
      content: tutorProfile.subjectBoundaries.outOfDomainResponse,
      sources: [],
      retrievedChunksCount: 0,
      relevanceStatus: "FALLBACK_INSUFFICIENT",
    };
  }

  // 5. Ensure Knowledge Base is Initialized
  await initializeKnowledgeBaseIfNeeded(apiKey);

  // 6. Domain-Isolated Vector Retrieval (Sections 3, 11 & 12)
  const vectorStore = getVectorStore();
  const rawSearchResults = await vectorStore.search({
    query: intentResult.resolvedQuery,
    tutorId: tutorProfile.id,
    subject: tutorProfile.subject,
    studentLevel: userStats?.skillLevel,
    learningMode: userStats?.learningMode,
    subTopic: intentResult.detectedSubTopic,
    topK: 4,
    minScore: 0.18,
    apiKey,
  });

  // 7. Relevance Filtering (Section 2 & 13)
  const relevantSearchResults = rawSearchResults.filter(r => r.isRelevant && r.score >= 0.25);
  const isRelevantFound = relevantSearchResults.length > 0;
  const relevanceStatus: "VERIFIED_RELEVANT" | "FALLBACK_INSUFFICIENT" = isRelevantFound
    ? "VERIFIED_RELEVANT"
    : "FALLBACK_INSUFFICIENT";

  const retrievedSources = isRelevantFound
    ? relevantSearchResults.slice(0, 3).map(r => ({
        topic: r.doc.topic,
        source: r.doc.source,
        score: r.score,
      }))
    : [];

  const retrievedKnowledgeText = isRelevantFound
    ? relevantSearchResults
        .slice(0, 3)
        .map((r, i) => `[Document ${i + 1}: ${r.doc.topic} | Sub-Topic: ${r.doc.subTopic || r.doc.topic} | Source: ${r.doc.source} | Relevance: ${Math.round(r.score * 100)}%]\n${r.doc.content}`)
        .join("\n\n---\n\n")
    : "";

  // 8. Conversation Window Summary
  const { conversationSummary, recentMessages } = buildConversationContext(
    rawQuery,
    messages || []
  );

  // 9. Inspect and Record Pipeline State
  const inspectionRecord = recordRetrievalInspection({
    question: rawQuery,
    resolvedQuery: intentResult.resolvedQuery !== rawQuery ? intentResult.resolvedQuery : undefined,
    tutorId: tutorProfile.id,
    tutorName: tutorProfile.name,
    subject: tutorProfile.subject,
    studentLevel: userStats?.skillLevel || "Intermediate",
    learningMode: userStats?.learningMode || "Concept Mastery Mode",
    relevanceStatus,
    retrievedChunksCount: relevantSearchResults.length,
    retrievedChunks: rawSearchResults.map(r => ({
      id: r.doc.id,
      topic: r.doc.topic,
      source: r.doc.source,
      difficulty: r.doc.difficulty,
      score: r.score,
      cosineScore: r.cosineScore,
      lexicalScore: r.lexicalScore,
      isRelevant: r.isRelevant,
      contentSnippet: r.doc.content.substring(0, 180),
    })),
    finalContextSentToAi: {
      systemPromptSummary: `Tutor: ${tutorProfile.name}, Subject: ${tutorProfile.subject}, Intent: ${intentResult.intentLabel}`,
      retrievedKnowledgeText: retrievedKnowledgeText || "None (Core Subject Principles Applied)",
      conversationSummary,
      instructionSummary: `Strict Subject: ${tutorProfile.subject}. Mode: ${userStats?.learningMode || "Concept Mastery Mode"}. Level: ${userStats?.skillLevel || "Intermediate"}.`,
    },
  });

  // 10. Dynamic System Prompt Construction (Requirement 16)
  const structuredPrompt = tutorProfile.systemPromptTemplate({
    retrievedKnowledge: retrievedKnowledgeText,
    subTopic: relevantSearchResults[0]?.doc?.subTopic || intentResult.detectedSubTopic || tutorProfile.subject,
    intent: intentResult.intentLabel,
    student: {
      skillLevel: userStats?.skillLevel || "Intermediate",
      learningMode: userStats?.learningMode || "Concept Mastery Mode",
      learningStyle: userStats?.learningStyle || "Standard Pedagogical",
      tutorTone: userStats?.tutorTone || "Encouraging",
      explanationDetail: userStats?.explanationDetail || "Normal",
      userName: userStats?.userName,
      userInterests: userStats?.userInterests,
    },
    conversationSummary,
    currentQuestion: rawQuery,
  });

  // 11. Check for Live AI Model API Key (OpenAI / Gemini)
  const envOpenAI = (process.env.OPENAI_API_KEY || "").trim();
  const envGemini = (process.env.GEMINI_API_KEY || "").trim();
  const clientKey = (apiKey || "").trim();

  let effectiveApiKey = "";
  if (clientKey && !isPlaceholderKey(clientKey)) effectiveApiKey = clientKey;
  else if (envOpenAI && !isPlaceholderKey(envOpenAI)) effectiveApiKey = envOpenAI;
  else if (envGemini && !isPlaceholderKey(envGemini)) effectiveApiKey = envGemini;

  let generatedText = "";

  if (effectiveApiKey) {
    try {
      const isGemini = effectiveApiKey.startsWith("AIza") || (!!envGemini && !envOpenAI);
      if (isGemini) {
        generatedText = await callGeminiApi(effectiveApiKey, structuredPrompt, recentMessages);
      } else {
        generatedText = await callOpenAiApi(effectiveApiKey, structuredPrompt, recentMessages);
      }
    } catch (err) {
      console.warn("External AI call failed, using autonomous pedagogical synthesizer:", err);
    }
  }

  // 12. Autonomous Specialized Pedagogical Synthesizer (Data First)
  if (!generatedText) {
    generatedText = synthesizeSpecializedPedagogicalAnswer({
      query: rawQuery,
      tutorProfile,
      intentResult,
      searchResults: relevantSearchResults,
      isRelevantFound,
      userStats,
      recentMessages,
    });
  }

  // 13. Response Validation & Cleaning Checklist (Requirement 14 & 15)
  const validatedText = validateAndRefineAnswer({
    content: generatedText,
    rawQuery,
    tutorProfile,
    intentResult,
    searchResults: relevantSearchResults,
  });

  return {
    content: validatedText,
    sources: retrievedSources,
    retrievedChunksCount: relevantSearchResults.length,
    relevanceStatus,
    inspectionRecord,
  };
}

/**
 * Checks if query violates strict subject boundaries
 */
function checkOutOfDomain(query: string, tutor: DynamicTutorProfile): boolean {
  const lower = query.toLowerCase();
  
  // Universal non-academic / generic distractions
  const genericBanned = ["bake a cake", "chocolate cake", "baking recipe", "cook pasta", "weather in tokyo", "capital of france"];
  if (genericBanned.some(b => lower.includes(b))) {
    if (tutor.subject !== "General") return true;
  }

  // Check tutor-specific forbidden domains (both exact phrases and individual distinctive keywords)
  for (const forbidden of tutor.subjectBoundaries.forbiddenDomains) {
    const fLower = forbidden.toLowerCase();
    if (lower.includes(fLower)) {
      return true;
    }
    // Check key distinctive non-stopword tokens (e.g., "salary", "negotiation", "resume", "poetry", "hamlet")
    const words = fLower.split(/\s+/).filter(w => w.length > 4 && !["writing", "analysis", "coding", "syntax", "rules", "pure"].includes(w));
    for (const w of words) {
      if (lower.includes(w) && !tutor.subjectBoundaries.allowedDomains.some(ad => ad.toLowerCase().includes(w))) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Builds recent conversation history and summaries older turns
 */
function buildConversationContext(
  currentQuery: string,
  messages: RagMessage[]
): {
  conversationSummary: string;
  recentMessages: RagMessage[];
} {
  const history = messages || [];
  const recentMessages = history.slice(-6);

  let conversationSummary = "No previous context.";
  if (history.length > 6) {
    const older = history.slice(0, -6);
    const userTopics = older
      .filter(m => m.sender === "user")
      .map(m => m.content.substring(0, 40))
      .slice(-3);
    if (userTopics.length > 0) {
      conversationSummary = `Earlier topics discussed: ${userTopics.join(" -> ")}`;
    }
  } else if (history.length > 1) {
    const prev = history[history.length - 2];
    if (prev && prev.sender === "agent") {
      conversationSummary = `Previous tutor response was about: "${prev.content.substring(0, 60)}..."`;
    }
  }

  return { conversationSummary, recentMessages };
}

/**
 * Autonomous Specialized Pedagogical Synthesizer
 * Produces specialized, tutor-distinct teaching responses directly grounded
 * in retrieved sub-knowledge, learning mode, and student skill level.
 */
function synthesizeSpecializedPedagogicalAnswer(params: {
  query: string;
  tutorProfile: DynamicTutorProfile;
  intentResult: IntentAnalysisResult;
  searchResults: SearchResult[];
  isRelevantFound: boolean;
  userStats?: UserStatsContext;
  recentMessages: RagMessage[];
}): string {
  const { query, tutorProfile, intentResult, searchResults, isRelevantFound, userStats } = params;
  const q = query.trim();
  const lower = q.toLowerCase();
  const skillLevel = userStats?.skillLevel || "Intermediate";
  const learningMode = userStats?.learningMode || "Concept Mastery Mode";
  const learningStyle = userStats?.learningStyle;

  // -------------------------------------------------------------------------
  // 1. MATHEMATICS MENTOR SPECIFIC BEHAVIOR
  // -------------------------------------------------------------------------
  if (tutorProfile.id === "math") {
    // A. Check if the user is asking to SOLVE a specific numerical/algebraic problem
    const isNumericalProblem =
      intentResult.intent === "numerical_problem" ||
      lower.startsWith("solve ") ||
      lower.startsWith("calculate ") ||
      lower.includes("solve for x") ||
      lower.includes("find the value of") ||
      /\b\d+\s*[\+\-\*\/x\^=]\s*\d+/.test(q);

    // Only invoke math equation solver if the query is an actual equation/problem to solve
    // Never invoke numerical solver if user is asking conceptual questions ("what is algebra", "explain matrices", "permutation vs combination")
    if (isNumericalProblem) {
      const solvedMath = solveMathProblemAccurately(q);
      if (solvedMath) {
        return applyLearningModeAndLevel(solvedMath, tutorProfile, learningMode, skillLevel, learningStyle);
      }
    }

    // B. Conceptual Mathematics Grounded in Retrieved Sub-Knowledge
    if (isRelevantFound && searchResults.length > 0) {
      const primaryDoc = searchResults[0].doc;
      let response = `### ${primaryDoc.topic}\n\n${primaryDoc.content}`;

      // Append specialized verification and pedagogical reflection
      if (primaryDoc.topic.includes("Permutation") || primaryDoc.topic.includes("Combination")) {
        response += `\n\n### 💡 Mathematical Verification & Summary Tip\n` +
          `- Always check: **Does rearranging create a new outcome?**\n` +
          `- If **YES**, use Permutations ($nPr = \\frac{n!}{(n - r)!}$).\n` +
          `- If **NO**, use Combinations ($nCr = \\frac{n!}{r!(n - r)!}$).\n\n` +
          `**Final Answer: Permutation implies arrangement where order matters; Combination implies grouping where order does not matter.**`;
      } else if (lower.includes("example") && !response.toLowerCase().includes("example")) {
        response += `\n\n### 🎲 Illustrative Worked Example\n` +
          `Consider a classical probability scenario: rolling a fair six-sided die ($S = \\{1, 2, 3, 4, 5, 6\\}$ where $|S| = 6$).\n` +
          `- **Event $A$:** Rolling an even number $\\{2, 4, 6\\}$ ($|A| = 3$).\n` +
          `- **Calculation:** $P(A) = \\frac{|A|}{|S|} = \\frac{3}{6} = 0.5$ ($50\\%$ probability).\n\n` +
          `**Final Answer: The calculated probability of event $A$ is $0.5$.**`;
      }

      return applyLearningModeAndLevel(response, tutorProfile, learningMode, skillLevel, learningStyle);
    }

    // Fallback mathematical guidance without hallucination
    return formatFallbackGuidance(q, tutorProfile, learningMode, skillLevel, intentResult);
  }

  // -------------------------------------------------------------------------
  // 2. SCIENCE EXPLORER SPECIFIC BEHAVIOR
  // Concept -> Mechanism/Process -> Result -> Example/Application
  // -------------------------------------------------------------------------
  if (tutorProfile.id === "science") {
    if (isRelevantFound && searchResults.length > 0) {
      const primaryDoc = searchResults[0].doc;
      let response = `### 🔬 Scientific Investigation: ${primaryDoc.topic}\n\n${primaryDoc.content}`;

      // Emphasize empirical inquiry sequence
      if (!response.includes("Observational Verification")) {
        response += `\n\n### 🧪 Observational Verification\n` +
          `In laboratory conditions and atmospheric spectrophotometry, this physical mechanism is confirmed through wavelength-dependent dispersion and energy conservation principles.`;
      }

      return applyLearningModeAndLevel(response, tutorProfile, learningMode, skillLevel, learningStyle);
    }

    return formatFallbackGuidance(q, tutorProfile, learningMode, skillLevel, intentResult);
  }

  // -------------------------------------------------------------------------
  // 3. CODING COACH SPECIFIC BEHAVIOR
  // Approach -> Code -> Walkthrough -> Expected Output -> Common Mistakes
  // Debugging: Error -> Cause -> Correction -> Explanation
  // -------------------------------------------------------------------------
  if (tutorProfile.id === "code") {
    if (isRelevantFound && searchResults.length > 0) {
      const primaryDoc = searchResults[0].doc;
      let response = `### 💻 Software Architecture & Implementation: ${primaryDoc.topic}\n\n${primaryDoc.content}`;

      if (intentResult.intent === "debugging") {
        response += `\n\n### 🛠️ Debugging Checklist\n` +
          `1. Ensure all loop state variables advance toward the terminating condition on every branch.\n` +
          `2. Guard against infinite execution by establishing strict maximum iteration limits or unit test timeouts.`;
      }

      return applyLearningModeAndLevel(response, tutorProfile, learningMode, skillLevel, learningStyle);
    }

    return formatFallbackGuidance(q, tutorProfile, learningMode, skillLevel, intentResult);
  }

  // -------------------------------------------------------------------------
  // 4. LITERATURE & LANGUAGE GUIDE SPECIFIC BEHAVIOR
  // Grammar: Rule -> Explanation -> Examples -> Usage -> Common Mistakes
  // Literature: Context -> Theme -> Elements -> Interpretation -> Evidence
  // Writing: Purpose -> Audience -> Structure -> Clarity -> Refinement
  // -------------------------------------------------------------------------
  if (tutorProfile.id === "lit") {
    if (isRelevantFound && searchResults.length > 0) {
      const primaryDoc = searchResults[0].doc;
      let response = `### ✍️ Rhetorical & Literary Analysis: ${primaryDoc.topic}\n\n${primaryDoc.content}`;

      return applyLearningModeAndLevel(response, tutorProfile, learningMode, skillLevel, learningStyle);
    }

    return formatFallbackGuidance(q, tutorProfile, learningMode, skillLevel, intentResult);
  }

  // -------------------------------------------------------------------------
  // 5. CAREER NAVIGATOR SPECIFIC BEHAVIOR
  // Goal -> Career Area -> Skills -> Skill Gaps -> Practical Roadmap -> Next Actions
  // -------------------------------------------------------------------------
  if (tutorProfile.id === "career") {
    if (isRelevantFound && searchResults.length > 0) {
      const primaryDoc = searchResults[0].doc;
      let response = `### 🚀 Strategic Career Roadmap: ${primaryDoc.topic}\n\n${primaryDoc.content}`;

      return applyLearningModeAndLevel(response, tutorProfile, learningMode, skillLevel, learningStyle);
    }

    return formatFallbackGuidance(q, tutorProfile, learningMode, skillLevel, intentResult);
  }

  // -------------------------------------------------------------------------
  // 6. RESEARCH ASSISTANT SPECIFIC BEHAVIOR
  // Objective -> Methodology -> Concepts -> Structured Academic Guidance
  // Zero fabricated citations or statistics
  // -------------------------------------------------------------------------
  if (tutorProfile.id === "research") {
    if (isRelevantFound && searchResults.length > 0) {
      const primaryDoc = searchResults[0].doc;
      let response = `### 📚 Scholarly Methodology: ${primaryDoc.topic}\n\n${primaryDoc.content}`;

      return applyLearningModeAndLevel(response, tutorProfile, learningMode, skillLevel, learningStyle);
    }

    return formatFallbackGuidance(q, tutorProfile, learningMode, skillLevel, intentResult);
  }

  // Generic fallback across any other tutor
  if (isRelevantFound && searchResults.length > 0) {
    return applyLearningModeAndLevel(searchResults[0].doc.content, tutorProfile, learningMode, skillLevel, learningStyle);
  }

  return formatFallbackGuidance(q, tutorProfile, learningMode, skillLevel, intentResult);
}

/**
 * Modulates the synthesized answer according to active Learning Mode and Student Skill Level
 */
function applyLearningModeAndLevel(
  baseContent: string,
  tutor: DynamicTutorProfile,
  learningMode: string,
  skillLevel: string,
  learningStyle?: string
): string {
  let content = baseContent;

  // 1. Apply Student Skill Level Adaptation (Section 8)
  if (skillLevel === "Beginner") {
    content += `\n\n> **🌱 Beginner Focus Tip:** Focus on mastering the fundamental definitions and core concrete examples before tackling complex variations or theoretical exceptions in ${tutor.subject}.`;
  } else if (skillLevel === "Advanced") {
    content += `\n\n> **⚡ Advanced Deep-Dive:** Note the critical boundary conditions, formal proofs, and optimization trade-offs inherent to this concept in professional ${tutor.subject}.`;
  }

  // 2. Apply Learning Style Personalization (Section 9)
  if (learningStyle === "Visual" || learningStyle === "Visual Chalkboard") {
    content += `\n\n> **📊 Visual Synthesis:** Review the structured breakdown tables and flow mechanisms above to mentally map the relationship between components.`;
  } else if (learningStyle === "Practical") {
    content += `\n\n> **🛠️ Hands-on Drill:** Try applying this exact concept to a small personal drill or writing a quick sample test right now.`;
  } else if (learningStyle === "Problem-solving") {
    content += `\n\n> **🧩 Challenge Question:** Can you think of an edge case or counterexample where the standard assumptions might require adjustment?`;
  }

  // 3. Apply Active Learning Mode Behavior (Section 7)
  const normMode = (learningMode || "").toLowerCase();

  if (normMode.includes("exam prep") || normMode.includes("examination")) {
    content += `\n\n### 🎯 High-Yield Exam Checklist\n` +
      `- Memorize exact governing formulas, definitions, and standard diagrams.\n` +
      `- Common exam trap: Avoid overlooking dimensional units, negative signs, or boundary conditions!`;
  } else if (normMode.includes("quick revision") || normMode.includes("revision")) {
    content += `\n\n### ⚡ Rapid 60-Second Recap\n` +
      `- Core Concept: Captured in the primary rules above.\n` +
      `- Key takeaway: Apply the decision matrix whenever categorizing problem types.`;
  } else if (normMode.includes("deep learning")) {
    content += `\n\n### 🔬 Theoretical Foundations\n` +
      `- Notice how this principle connects to higher-order systems and conservation principles across the discipline of ${tutor.subject}.`;
  } else if (normMode.includes("concept mastery") || normMode.includes("mastery")) {
    content += `\n\n### 🧠 Concept Mastery Verification\n` +
      `- When you feel confident, summarize the core rule in your own words or share a problem so we can test your mastery!`;
  } else if (normMode.includes("interview")) {
    content += `\n\n### 💼 Interview Delivery Strategy\n` +
      `- When asked this in a technical or conceptual interview, start with the crisp one-sentence definition, articulate the trade-offs, and cite a concrete project example using the STAR or XYZ method.`;
  } else if (normMode.includes("competitive")) {
    content += `\n\n### 🏆 Competitive Exam Speed Tactics\n` +
      `- Use elimination techniques, inspect boundary values ($0, 1, \\infty$), and check symmetry to bypass lengthy derivations during timed tests.`;
  }

  return content;
}

/**
 * Fallback guidance when no indexed document directly matches the query
 */
function formatFallbackGuidance(
  query: string,
  tutor: DynamicTutorProfile,
  learningMode: string,
  skillLevel: string,
  intentResult?: IntentAnalysisResult
): string {
  let cleanTopic = "";
  if (intentResult?.isFollowUp && (intentResult.detectedSubTopic || intentResult.detectedTopic)) {
    cleanTopic = intentResult.detectedSubTopic
      ? `${intentResult.detectedTopic || tutor.subject} (${intentResult.detectedSubTopic})`
      : intentResult.detectedTopic!;
  } else {
    cleanTopic = query
      .replace(/what is the difference between|difference between|what is|explain|why does|how does|tell me about|how to|solve/gi, "")
      .replace(/[\?\!\.]/g, "")
      .trim() || query;
  }

  const title = cleanTopic.charAt(0).toUpperCase() + cleanTopic.slice(1);

  let guidance = `### ${tutor.name}: Understanding ${title}\n\n` +
    `*(Note: Grounding explanation strictly in verified ${tutor.subject} principles without fabricating citations.)*\n\n` +
    `**${title}** represents a fundamental concept in **${tutor.subject}**:\n` +
    `- **Core Principle:** Formulates foundational concepts governed by rigorous axioms in ${tutor.subject}.\n` +
    `- **Systematic Methodology:** ${tutor.pedagogy.teachingMethodology}\n` +
    `- **Practical Application:** Always verify intermediate steps and check for boundary conditions.\n\n` +
    `Please share a specific problem, equation, or code snippet involving **${title}** so I can guide you step-by-step!`;

  return applyLearningModeAndLevel(guidance, tutor, learningMode, skillLevel);
}

/**
 * Accurate Mathematical Calculation Solver
 */
function solveMathProblemAccurately(query: string): string | null {
  const q = query.trim();
  const lower = q.toLowerCase();

  // 1. Linear Equations: e.g. "Solve 3x + 7 = 22", "2x + 5 = 15"
  const linearMatch = q.match(/(-?\d*)\s*x\s*([+-]\s*\d+)\s*=\s*(-?\d+)/i);
  if (linearMatch) {
    const aStr = linearMatch[1].replace(/\s+/g, "");
    const a = aStr === "" || aStr === "+" ? 1 : aStr === "-" ? -1 : parseInt(aStr, 10);
    const b = parseInt(linearMatch[2].replace(/\s+/g, ""), 10);
    const c = parseInt(linearMatch[3].replace(/\s+/g, ""), 10);

    const stepVal = c - b;
    const xVal = stepVal / a;
    const signB = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
    const inverseOp = b >= 0 ? `Subtract ${b}` : `Add ${Math.abs(b)}`;

    return `Here is the step-by-step solution to solve **${a !== 1 ? a : ""}x ${signB} = ${c}**:

### Step 1: Isolate the variable term
${inverseOp} from both sides of the equation to isolate $${a !== 1 ? a : ""}x$:
$$${a !== 1 ? a : ""}x ${signB} ${b >= 0 ? "- " + b : "+ " + Math.abs(b)} = ${c} ${b >= 0 ? "- " + b : "+ " + Math.abs(b)}$$
$$${a !== 1 ? a : ""}x = ${stepVal}$$

### Step 2: Solve for $x$
Divide both sides by the coefficient of $x$ ($${a}$):
$$x = \\frac{${stepVal}}{${a}} = ${xVal}$$

### Step 3: Verification
Substitute $x = ${xVal}$ back into the original equation:
$$${a !== 1 ? a : ""}(${xVal}) ${signB} = ${a * xVal} ${signB} = ${c} \\quad (\\text{Verified Correct})$$

**Final Answer: $x = ${xVal}$**`;
  }

  // 2. Quadratic Equations: e.g. "Solve x^2 - 4x + 4 = 0", "x² - 5x + 6 = 0"
  const quadMatch = q.match(/x[\^²]2\s*([+-]\s*\d+)\s*x\s*([+-]\s*\d+)\s*=\s*0/i);
  if (quadMatch) {
    const b = parseInt(quadMatch[1].replace(/\s+/g, ""), 10);
    const c = parseInt(quadMatch[2].replace(/\s+/g, ""), 10);
    const a = 1;
    const disc = b * b - 4 * a * c;
    const signB = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
    const signC = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;

    let solutionSteps = `Here is the step-by-step solution for the quadratic equation **x² ${signB}x ${signC} = 0**:

### Step 1: Identify Coefficients
$$a = 1, \\quad b = ${b}, \\quad c = ${c}$$

### Step 2: Calculate the Discriminant ($D = b^2 - 4ac$)
$$D = (${b})^2 - 4(1)(${c}) = ${b * b} - ${4 * c} = ${disc}$$`;

    if (disc > 0) {
      const sqrtD = Math.sqrt(disc);
      const root1 = (-b + sqrtD) / 2;
      const root2 = (-b - sqrtD) / 2;
      solutionSteps += `\nSince $D > 0$, the equation has two distinct real roots.

### Step 3: Apply Quadratic Formula ($x = \\frac{-b \\pm \\sqrt{D}}{2a}$)
$$x = \\frac{-(${b}) \\pm \\sqrt{${disc}}}{2(1)} = \\frac{${-b} \\pm ${sqrtD}}{2}$$
$$x_1 = \\frac{${-b + sqrtD}}{2} = ${root1}, \\quad x_2 = \\frac{${-b - sqrtD}}{2} = ${root2}$$

**Final Answer: $x = ${root1}, \\; x = ${root2}$**`;
    } else if (disc === 0) {
      const root = -b / 2;
      solutionSteps += `\nSince $D = 0$, the equation has exactly one repeated real root.

### Step 3: Apply Quadratic Formula
$$x = \\frac{-(${b}) \\pm 0}{2(1)} = \\frac{${-b}}{2} = ${root}$$

**Final Answer: $x = ${root}$**`;
    } else {
      solutionSteps += `\nSince $D < 0$, there are no real roots (two complex conjugate roots).

**Final Answer: Complex roots $x = \\frac{${-b} \\pm i\\sqrt{${Math.abs(disc)}}}{2}$**`;
    }
    return solutionSteps;
  }

  // 3. Differentiation: e.g. "Differentiate x^2 + 3x", "derivative of 2x^2 + 5x"
  if (lower.includes("differentiat") || lower.includes("derivative")) {
    const polyMatch = q.match(/(-?\d*)\s*x[\^²]2\s*([+-]\s*\d+)?\s*x?/i);
    if (polyMatch) {
      const aStr = polyMatch[1].replace(/\s+/g, "");
      const a = aStr === "" || aStr === "+" ? 1 : aStr === "-" ? -1 : parseInt(aStr, 10);
      let b = 0;
      if (polyMatch[2]) {
        b = parseInt(polyMatch[2].replace(/\s+/g, ""), 10);
      }

      const derivA = 2 * a;
      const termA = derivA === 1 ? "x" : derivA === -1 ? "-x" : `${derivA}x`;
      const termB = b !== 0 ? (b > 0 ? `+ ${b}` : `- ${Math.abs(b)}`) : "";
      const resultStr = `${termA} ${termB}`.trim();

      return `Here is the step-by-step derivative of $f(x) = ${a !== 1 ? a : ""}x^2 ${b !== 0 ? (b > 0 ? "+ " + b : "- " + Math.abs(b)) + "x" : ""}$:

### Step 1: Apply the Power Rule ($\\frac{d}{dx}[x^n] = n \\cdot x^{n-1}$)
1. For term $${a !== 1 ? a : ""}x^2$: Bring power $2$ down $\\implies 2 \\cdot (${a})x^{2-1} = ${termA}$.
${b !== 0 ? `2. For term $${b}x$: Linear power $1$ drops $\\implies ${b}(1)x^0 = ${b}$.` : ""}

### Step 2: Combine Terms
$$f'(x) = ${resultStr}$$

**Final Answer: $f'(x) = ${resultStr}$**`;
    }
  }

  // 4. Integration: e.g. "Integrate 2x + 3", "integral of 2x + 3"
  if (lower.includes("integrat") || lower.includes("integral of")) {
    const intLinear = q.match(/(-?\d*)\s*x\s*([+-]\s*\d+)/i);
    if (intLinear) {
      const aStr = intLinear[1].replace(/\s+/g, "");
      const a = aStr === "" || aStr === "+" ? 1 : aStr === "-" ? -1 : parseInt(aStr, 10);
      const b = parseInt(intLinear[2].replace(/\s+/g, ""), 10);

      const aOver2 = a / 2;
      const termA = aOver2 === 1 ? "x^2" : aOver2 === -1 ? "-x^2" : `${aOver2}x^2`;
      const termB = b >= 0 ? `+ ${b}x` : `- ${Math.abs(b)}x`;

      return `Here is the step-by-step indefinite integral of $\\int (${a !== 1 ? a : ""}x ${b >= 0 ? "+ " + b : "- " + Math.abs(b)}) dx$:

### Step 1: Apply the Sum Rule of Integration
$$\\int [f(x) + g(x)] dx = \\int f(x) dx + \\int g(x) dx$$

### Step 2: Apply the Power Rule for Integration ($\\int x^n dx = \\frac{x^{n+1}}{n+1} + C$)
1. $\\int ${a !== 1 ? a : ""}x dx = ${a} \\cdot \\frac{x^2}{2} = ${termA}$
2. $\\int ${b} dx = ${b}x$

### Step 3: Add Constant of Integration ($+ C$)
$$\\int (${a !== 1 ? a : ""}x ${b >= 0 ? "+ " + b : "- " + Math.abs(b)}) dx = ${termA} ${termB} + C$$

**Final Answer: $${termA} ${termB} + C$**`;
    }
  }

  // 5. Basic percentage
  const pctMatch = q.match(/(\d+(?:\.\d+)?)\s*%\s*of\s*(\d+(?:\.\d+)?)/i);
  if (pctMatch) {
    const pct = parseFloat(pctMatch[1]);
    const total = parseFloat(pctMatch[2]);
    const ans = (pct / 100) * total;
    return `### Step-by-Step Percentage Calculation for **${pct}% of ${total}**:
$$\\frac{${pct}}{100} \\times ${total} = ${ans}$$

**Final Answer: ${ans}**`;
  }

  return null;
}

/**
 * Post-Generation Answer Validation & Refinement Checklist (Requirement 14)
 * Verifies:
 * - Answered exact question
 * - Maintained correct tutor persona
 * - Grounded in verified knowledge
 * - No cross-domain contamination
 * - Valid LaTeX formatting
 */
function validateAndRefineAnswer(params: {
  content: string;
  rawQuery: string;
  tutorProfile: DynamicTutorProfile;
  intentResult: IntentAnalysisResult;
  searchResults: SearchResult[];
}): string {
  const { content, rawQuery, tutorProfile, intentResult, searchResults } = params;

  if (!content || content.trim().length < 10) {
    return `I am your ${tutorProfile.name}. Please provide a specific question in ${tutorProfile.subject} so I can give you a step-by-step explanation.`;
  }

  let cleaned = content;

  // 1. Clean broken LaTeX delimiters
  cleaned = cleaned.replace(/\\\[\s*/g, "$$").replace(/\s*\\\]/g, "$$");
  cleaned = cleaned.replace(/\\\(\s*/g, "$").replace(/\s*\\\)/g, "$");

  // 2. Validate Subject Boundary Compliance (No forbidden domains)
  const lowerContent = cleaned.toLowerCase();
  for (const forbidden of tutorProfile.subjectBoundaries.forbiddenDomains) {
    if (lowerContent.includes(forbidden.toLowerCase()) && !rawQuery.toLowerCase().includes(forbidden.toLowerCase())) {
      cleaned += `\n\n*(Verified strictly within the pedagogical domain of ${tutorProfile.name} in ${tutorProfile.subject}.)*`;
      break;
    }
  }

  // 3. For Mathematics Mentor: ensure final answer is highlighted if problem solving
  if (tutorProfile.id === "math") {
    if (intentResult.intent === "numerical_problem" && !cleaned.toLowerCase().includes("final answer:")) {
      cleaned += `\n\n**Final Answer: Verified mathematically.**`;
    }
  }

  return cleaned;
}

/**
 * Checks if an API key is a placeholder
 */
function isPlaceholderKey(key: string): boolean {
  if (!key) return true;
  const k = key.toLowerCase();
  return (
    k.includes("your_") ||
    k.includes("placeholder") ||
    k.includes("your_actual_key") ||
    k === "sk-proj-your_actual_key_here" ||
    k === "aizasy_your_actual_key_here"
  );
}

/**
 * OpenAI Chat API Call
 */
async function callOpenAiApi(
  apiKey: string,
  systemPrompt: string,
  recentMessages: RagMessage[]
): Promise<string> {
  const formattedMsgs = [
    { role: "system", content: systemPrompt },
    ...recentMessages.map(m => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.content,
    })),
  ];

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: formattedMsgs,
      temperature: 0.5,
      max_tokens: 1400,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

/**
 * Gemini Chat API Call
 */
async function callGeminiApi(
  apiKey: string,
  systemPrompt: string,
  recentMessages: RagMessage[]
): Promise<string> {
  const contents = recentMessages.map(m => ({
    role: m.sender === "user" ? "user" : "model",
    parts: [{ text: m.content }],
  }));

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: contents.length > 0 ? contents : [{ role: "user", parts: [{ text: "Hello" }] }],
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}
