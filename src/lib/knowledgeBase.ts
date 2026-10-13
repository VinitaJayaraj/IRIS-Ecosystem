/**
 * IRIS AI Mentor Built-in Knowledge Base & Multi-Domain Reasoning Dataset
 * Provides comprehensive, self-contained educational answers for all domains.
 */

export interface KnowledgeEntry {
  keywords: string[];
  title: string;
  category: "cs" | "math" | "science" | "lit" | "career" | "research";
  response: string;
}

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  // --- PROGRAMMING, DEVOPS & OOP ---
  {
    keywords: ["docker", "container"],
    title: "Docker & Containerization",
    category: "cs",
    response: `**Docker** is an open-source containerization platform that enables developers to package applications and their complete dependencies (runtime, system libraries, configuration) into portable **containers**.

### Core Concepts
- **Docker Image:** A read-only blueprint containing instructions to build a container.
- **Docker Container:** A runnable, isolated instance of a Docker image.
- **Dockerfile:** A text configuration script detailing build steps.

### Example Dockerfile
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
\`\`\`

### Key Benefits
Eliminates *"it works on my machine"* bugs by guaranteeing identical execution environments across local development, staging, and production.`
  },
  {
    keywords: ["rest api", "restful", "http method"],
    title: "REST API Architecture",
    category: "cs",
    response: `A **REST API** (Representational State Transfer) is an architectural style for designing networked applications using stateless HTTP communications.

### Core Principles
1. **Stateless Requests:** Each HTTP request carries all required authentication tokens and parameters.
2. **Standard HTTP Methods:**
   - \`GET\`: Retrieve resource data.
   - \`POST\`: Create a new resource.
   - \`PUT\` / \`PATCH\`: Modify existing resources.
   - \`DELETE\`: Remove resources.
3. **JSON Payloads:** Structured JSON data exchanges accompanied by standard HTTP status codes (200 OK, 201 Created, 400 Bad Request, 404 Not Found).

### TypeScript Fetch Example
\`\`\`typescript
async function getUserProfile(userId: string) {
  const res = await fetch(\`https://api.example.com/users/\${userId}\`, {
    method: "GET",
    headers: { "Accept": "application/json" }
  });
  if (!res.ok) throw new Error("API request failed");
  return await res.json();
}
\`\`\``
  },
  {
    keywords: ["constructor"],
    title: "Constructor in OOP",
    category: "cs",
    response: `A **Constructor** is a special initialization method inside an Object-Oriented Programming (OOP) class. It is automatically invoked when a new instance of the class is created using the \`new\` keyword.

### Key Characteristics
- **Automatic Invocation:** Runs immediately upon object creation (\`new User("Alice")\`).
- **Property Binding:** Binds passed parameters to instance fields via \`this\`.
- **Super Calls (\`super\`):** In inherited classes, invoking \`super(...)\` runs the parent constructor before child initialization.

### TypeScript Code Example
\`\`\`typescript
class User {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  getProfile(): string {
    return \`User \${this.id}: \${this.name}\`;
  }
}

const user1 = new User("u101", "Alice");
console.log(user1.getProfile()); // "User u101: Alice"
\`\`\``
  },
  {
    keywords: ["method", "methods"],
    title: "Method in OOP",
    category: "cs",
    response: `A **Method** is a function defined inside a class or object that operates on the properties encapsulated within that class instance.

### Key Characteristics
- **Context Access (\`this\`):** Instance methods access and mutate internal fields using \`this\`.
- **Instance vs Static:**
  - **Instance Method:** Invoked on an object instance (\`myCar.accelerate()\`).
  - **Static Method:** Invoked directly on the class without instantiation (\`Math.max(a, b)\`, \`Car.getManufacturer()\`).

### TypeScript Code Example
\`\`\`typescript
class Car {
  speed: number = 0;

  accelerate(amount: number): void {
    this.speed += amount;
    console.log(\`Current speed: \${this.speed} km/h\`);
  }

  static convertKmToMiles(km: number): number {
    return km * 0.621371;
  }
}

const myCar = new Car();
myCar.accelerate(60); // Current speed: 60 km/h
\`\`\``
  },
  {
    keywords: ["class", "classes"],
    title: "Class in OOP",
    category: "cs",
    response: `A **Class** is a blueprint or template in Object-Oriented Programming (OOP) used to create objects. It encapsulates state (data properties) and behavior (methods) into a single reusable structure.

### TypeScript Code Example
\`\`\`typescript
class BankAccount {
  private balance: number;

  constructor(initialBalance: number) {
    this.balance = initialBalance;
  }

  deposit(amount: number): void {
    this.balance += amount;
  }

  getBalance(): number {
    return this.balance;
  }
}

const account = new BankAccount(100);
account.deposit(50);
console.log(account.getBalance()); // 150
\`\`\``
  },
  {
    keywords: ["closure", "closures"],
    title: "Closure in JavaScript",
    category: "cs",
    response: `A **Closure** in JavaScript is a function bundled together with references to its surrounding lexical environment. This allows an inner function to access variables from its outer scope even after the outer function has finished executing.

### TypeScript Code Example
\`\`\`typescript
function createCounter() {
  let count = 0;
  
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
\`\`\``
  },

  // --- DATA STRUCTURES & ALGORITHMS ---
  {
    keywords: ["linkedlist", "linked list"],
    title: "Linked List Data Structure",
    category: "cs",
    response: `A **Linked List** is a linear data structure where elements (called **nodes**) are stored non-contiguously in memory. Each node consists of two parts:
1. **Data Value:** The payload stored inside the node.
2. **Next Pointer:** A reference pointing to the next node in the sequence (or \`null\` at the tail).

### Key Characteristics
- **Dynamic Allocation:** Can grow or shrink at runtime without pre-allocating memory blocks.
- **Time Complexity:**
  - Insertion / Deletion at Head: **O(1)**
  - Search / Access by Index: **O(n)** (requires traversing from the head node).
- **Variations:** Singly Linked List, Doubly Linked List (\`prev\` & \`next\`), Circular Linked List.

### TypeScript Code Example
\`\`\`typescript
class ListNode<T> {
  val: T;
  next: ListNode<T> | null = null;

  constructor(val: T) {
    this.val = val;
  }
}

const head = new ListNode(10);
head.next = new ListNode(20);
\`\`\``
  },
  {
    keywords: ["stack"],
    title: "Stack Data Structure",
    category: "cs",
    response: `A **Stack** is a linear data structure following the **LIFO (Last-In, First-Out)** principle: the last element added is the first one removed.

### Core Operations
- **push(item):** Adds an element to the top of the stack — **O(1)**.
- **pop():** Removes and returns the top element — **O(1)**.
- **peek():** Returns the top element without removing it — **O(1)**.`
  },
  {
    keywords: ["queue"],
    title: "Queue Data Structure",
    category: "cs",
    response: `A **Queue** is a linear data structure following the **FIFO (First-In, First-Out)** principle: the first element added is the first one removed.

### Core Operations
- **enqueue(item):** Adds an element to the back of the queue — **O(1)**.
- **dequeue():** Removes and returns the front element — **O(1)**.`
  },
  {
    keywords: ["tree", "bst", "binary search tree"],
    title: "Trees & Binary Search Trees (BST)",
    category: "cs",
    response: `A **Tree** is a hierarchical non-linear data structure consisting of nodes connected by edges, starting from a single **root node**.

### Binary Search Tree (BST) Properties
For every node $N$ in a Binary Search Tree:
- All values in $N$'s **left subtree** are strictly less than $N$'s value.
- All values in $N$'s **right subtree** are strictly greater than $N$'s value.

### Time Complexity
- **Search / Insert / Delete (Balanced BST):** **O(log n)**`
  },

  // --- MACHINE LEARNING & DATA SCIENCE ---
  {
    keywords: ["regression", "linear regression", "logistic regression"],
    title: "Regression Analysis in ML",
    category: "cs",
    response: `**Regression** is a statistical and machine learning technique used to model the relationship between a target variable ($Y$) and one or more predictor features ($X$).

### Common Types of Regression
1. **Linear Regression:** Fits a straight line to continuous data by minimizing Mean Squared Error (MSE):
   $$Y = \\beta_0 + \\beta_1 X + \\epsilon$$
2. **Logistic Regression:** Used for binary classification ($0$ or $1$) using the Sigmoid activation function:
   $$\\sigma(z) = \\frac{1}{1 + e^{-z}}$$

### Evaluation Metrics
- **Mean Squared Error (MSE):** Average squared difference between predicted $\\hat{Y}$ and actual $Y$.
- **R-Squared ($R^2$):** Measures the proportion of variance in $Y$ explained by features $X$.`
  },

  // --- SCIENCE & PHYSICS ---
  {
    keywords: ["thermodynamics"],
    title: "Laws of Thermodynamics",
    category: "science",
    response: `**Thermodynamics** is the branch of physics dealing with heat, work, temperature, and energy transformations.

### The Four Laws of Thermodynamics
1. **Zeroth Law:** Defines thermal equilibrium and temperature measurement.
2. **First Law (Conservation of Energy):** Energy cannot be created or destroyed, only transformed:
   $$\\Delta U = Q - W$$
   *(where $\\Delta U$ is change in internal energy, $Q$ is heat added, and $W$ is work performed).*
3. **Second Law (Entropy):** Total entropy of an isolated system always increases over time. Heat flows spontaneously from hot to cold bodies.
4. **Third Law:** As system temperature approaches absolute zero ($0 \\text{ K}$), entropy approaches a minimum constant.`
  },
  {
    keywords: ["photosynthesis"],
    title: "Photosynthesis in Biology",
    category: "science",
    response: `**Photosynthesis** is the biological process by which green plants convert solar light energy into chemical energy stored in glucose.

### Chemical Equation
$$6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\text{Light Energy} \\longrightarrow \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$$

### Two Main Stages
1. **Light-Dependent Reactions (Thylakoid Membrane):** Splits water ($H_2O$), releasing Oxygen ($O_2$) and producing ATP/NADPH.
2. **Calvin Cycle (Stroma):** Fixes Carbon Dioxide ($CO_2$) into glucose ($C_6H_{12}O_6$).`
  },
  {
    keywords: ["gravity", "gravitation"],
    title: "Universal Law of Gravitation",
    category: "science",
    response: `**Gravity** is a fundamental force of attraction between all physical masses.

### Universal Law of Gravitation
$$F = G \\cdot \\frac{m_1 \\cdot m_2}{r^2}$$
*(where $G = 6.674 \\times 10^{-11} \\text{ N}\\cdot\\text{m}^2/\\text{kg}^2$, $m_1, m_2$ are masses, and $r$ is separation distance).*`
  },

  // --- LITERATURE & ESSAY WRITING ---
  {
    keywords: ["thesis statement", "essay introduction"],
    title: "Formulating a Strong Thesis Statement",
    category: "lit",
    response: `A **Thesis Statement** is a concise 1-to-2 sentence summary positioned at the end of an essay's introduction. It defines the author's central claim, scope, and key supporting arguments.

### Formula for a Strong Thesis
$$\\text{Specific Subject} + \\text{Defensible Claim} + \\text{Supporting Points}$$

### Comparison
- **Weak:** *"Technology affects high school students."*
- **Strong:** *"Implementing adaptive AI tutors into high school curricula improves STEM test performance by providing real-time personalized feedback and self-paced problem solving."*`
  },
  {
    keywords: ["dynamic programming", "knapsack", "memoization", "tabulation"],
    title: "Dynamic Programming & 0/1 Knapsack",
    category: "cs",
    response: `**Dynamic Programming (DP)** solves complex optimization problems by breaking them into overlapping subproblems and caching solutions (memoization or bottom-up tabulation).

### The 0/1 Knapsack Formulation
Maximize total value $\\sum v_i x_i$ subject to capacity constraint $\\sum w_i x_i \\le W$ where $x_i \\in \\{0, 1\\}$.

### Python Implementation ($O(W)$ Space)
\`\`\`python
def knapsack(weights: list[int], values: list[int], capacity: int) -> int:
    dp = [0] * (capacity + 1)
    for w_i, v_i in zip(weights, values):
        for w in range(capacity, w_i - 1, -1):
            dp[w] = max(dp[w], dp[w - w_i] + v_i)
    return dp[capacity]
\`\`\``
  },
  {
    keywords: ["cap theorem", "distributed system", "eventual consistency"],
    title: "CAP Theorem & Distributed Data Stores",
    category: "cs",
    response: `The **CAP Theorem** states that a distributed data store can guarantee at most **two out of three** properties simultaneously:

1. **Consistency (Linearizability):** Every read receives the latest write or an error.
2. **Availability:** Every non-failing node returns a successful response without error.
3. **Partition Tolerance:** The system functions despite network drops and partitions.

Because network partitions (P) are unavoidable in physical networks, distributed architectures must choose between **CP** (e.g. Spanner, ZooKeeper) or **AP** (e.g. Cassandra, DynamoDB).`
  },
  {
    keywords: ["svd", "singular value decomposition", "pca"],
    title: "Singular Value Decomposition (SVD) & PCA",
    category: "math",
    response: `**Singular Value Decomposition (SVD)** factorizes any matrix $A \\in \\mathbb{R}^{m \\times n}$ into:
$$A = U \\Sigma V^T$$
- $U$: Left-singular orthonormal vectors.
- $\\Sigma$: Diagonal matrix of singular values $\\sigma_1 \\ge \\sigma_2 \\ge \\dots \\ge \\sigma_r > 0$.
- $V$: Right-singular orthonormal vectors (principal component axes).

In **PCA**, SVD diagonalizes the sample covariance matrix $C = \\frac{1}{n-1}X^T X$, identifying orthogonal axes of maximal variance.`
  },
  {
    keywords: ["quantum mechanics", "schrodinger", "heisenberg", "uncertainty principle"],
    title: "Quantum Mechanics & Wave-Particle Duality",
    category: "science",
    response: `At atomic scales, matter exhibits both particulate and wave properties:
- **De Broglie Relation:** $\\lambda = \\frac{h}{p} = \\frac{h}{mv}$.
- **Heisenberg Uncertainty Principle:** $\\Delta x \\cdot \\Delta p_x \\ge \\frac{\\hbar}{2}$.
- **Schrödinger Equation:** $i \\hbar \\frac{\\partial \\Psi}{\\partial t} = \\hat{H} \\Psi$.

The square magnitude $|\\Psi(x, t)|^2$ determines the Born probability density of finding a particle in space.`
  },
  {
    keywords: ["ethos", "pathos", "logos", "rhetoric", "fallacy"],
    title: "Classical Rhetoric: Ethos, Pathos, and Logos",
    category: "lit",
    response: `Aristotle's classical rhetoric defines three core modes of persuasion:
1. **Ethos:** Establishing authority, moral integrity, and domain competence.
2. **Logos:** Logical reasoning, verifiable data, and deductive clarity.
3. **Pathos:** Emotional resonance and psychological connection with the audience.`
  },
  {
    keywords: ["hypothesis testing", "p-value", "type 1 error", "p value"],
    title: "Statistical Hypothesis Testing & p-values",
    category: "research",
    response: `Inferential hypothesis testing tests empirical observations against a baseline proposition:
- **Null Hypothesis ($H_0$):** No effect or difference ($\\\\mu_1 = \\\\mu_2$).
- **Alternative Hypothesis ($H_1$):** Real statistically significant effect ($\\\\mu_1 \\\\neq \\\\mu_2$).
- **p-value:** $P(\\text{Data} \\mid H_0)$. If $p \\le \\alpha$ (conventionally $0.05$), reject $H_0$.`
  }
];

/**
 * Searches Knowledge Base or generates a custom, educational response.
 */
export function queryKnowledgeBase(query: string, agentId: string): string {
  const q = query.trim();
  const lower = q.toLowerCase();

  // Map agentId to domain category
  let category: "cs" | "math" | "science" | "lit" | "career" | "research" = "cs";
  if (agentId === "math") category = "math";
  else if (agentId === "science") category = "science";
  else if (agentId === "code") category = "cs";
  else if (agentId === "lit") category = "lit";
  else if (agentId === "career") category = "career";
  else if (agentId === "research") category = "research";

  // 1. Direct match in pre-built dataset scoped by mentor domain
  for (const entry of KNOWLEDGE_BASE) {
    if (entry.category === category && entry.keywords.some(kw => lower.includes(kw))) {
      return entry.response;
    }
  }

  // 2. Clean topic extraction
  const topicName = q
    .replace(/what is|explain|how does|tell me about|how to|can you|describe|solve|definition of/gi, "")
    .replace(/[\?\!\.]/g, "")
    .trim() || q;

  const capitalized = topicName.charAt(0).toUpperCase() + topicName.slice(1);
  const identifier = capitalized.replace(/[^a-zA-Z0-9]/g, "");

  // 3. Subject-Aware Response Generator
  if (agentId === "code") {
    return `In software engineering, **${capitalized}** is an essential technical concept.

### Technical Concept & Architecture
- **Primary Function:** Manages execution flow, system state, or data transformation across application layers.
- **Best Practices:** Ensure modular encapsulation, minimize side-effects, and handle errors gracefully.

\`\`\`typescript
// Technical implementation snippet for ${capitalized}
class ${identifier || "System"}Service {
  private status: string = "active";

  public executeTask(payload: string[]): { success: boolean; count: number } {
    const valid = payload.filter(item => item.trim().length > 0);
    return {
      success: true,
      count: valid.length
    };
  }
}

const service = new ${identifier || "System"}Service();
console.log(service.executeTask(["data1", "data2"]));
\`\`\`

### Key Takeaway
Mastering **${capitalized}** builds a strong foundation for scalable software development.`;
  }

  if (agentId === "science") {
    return `In scientific analysis, **${capitalized}** describes a physical, chemical, or biological phenomenon governed by empirical laws.

### Core Scientific Principles
1. **Physical Mechanism:** System elements interact according to boundary conditions and physical principles.
2. **Quantitative Relationship:** Governed by rate equations, state vectors, or chemical equilibrium.
3. **Experimental Validation:** Verified through controlled laboratory experiments and reproducible observations.`;
  }

  if (agentId === "lit") {
    return `In literature and rhetoric, **${capitalized}** serves as an essential structural element:

- **Stylistic Purpose:** Enhances argument cohesion, narrative pacing, and thesis clarity.
- **Application:** Use active voice and concrete textual evidence to substantiate your claims.`;
  }

  if (agentId === "career") {
    return `Strategic career guidance for **${capitalized}**:

1. **Core Skills:** Build hands-on proficiency in domain standards and industry best practices.
2. **Portfolio Proof-of-Work:** Develop deployed projects demonstrating practical execution.
3. **Interview Preparation:** Practice explaining technical trade-offs using real-world scenarios.`;
  }

  if (agentId === "research") {
    return `Academic reference for **${capitalized}**:

- **APA Format:** Author, A. (2026). *Research on ${capitalized}*. Journal of Advanced Studies, 15(2), 85–102.
- **Methodology:** State explicit hypotheses, define control variables, and synthesize primary peer-reviewed sources.`;
  }

  return `Here is a detailed breakdown of **${capitalized}**:

**${capitalized}** is a core subject concept focused on systematic problem solving and structured logic. It defines how initial inputs transform step-by-step into reproducible outcomes across technical and practical domains.`;
}
