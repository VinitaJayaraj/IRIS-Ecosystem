/**
 * IRIS Subject-Specific Knowledge Base Dataset
 * Comprehensive educational collections partitioned by tutor domain.
 * Covering all 6 AI Tutors with in-depth knowledge, formulas, code, and academic frameworks.
 */

export interface KnowledgeSeedItem {
  id: string;
  subject: "Mathematics" | "Science" | "Coding" | "Literature" | "Career" | "Research";
  tutor: string;
  tutorId: "math" | "science" | "code" | "lit" | "career" | "research";
  topic: string;
  subTopic?: string;
  source: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
  content: string;
}

export const INITIAL_KNOWLEDGE_BASE: KnowledgeSeedItem[] = [
  // =========================================================================
  // 1. MATHEMATICS MENTOR (math) - Algebra, Matrices, Calculus, Prob, Stats, etc.
  // =========================================================================
  {
    id: "math_algebra_fundamentals",
    subject: "Mathematics",
    tutor: "Mathematics Mentor",
    tutorId: "math",
    topic: "Algebra Fundamentals & Expressions",
    source: "Mathematics Curriculum - Core Algebra §1.1",
    difficulty: "Beginner",
    tags: ["algebra", "variables", "expressions", "equations", "constants", "coefficients"],
    content: `**Algebra** is a foundational branch of mathematics that uses symbols and letters (variables like $x, y, z$) to represent numbers, unknown quantities, and operational relationships.

### Core Components
1. **Variables:** Symbols representing unknown or changeable values (e.g., $x, y$).
2. **Constants:** Fixed numerical values that do not change (e.g., $5, -12, \\pi$).
3. **Coefficients:** Numerical factors multiplying a variable (in $4x$, the coefficient is $4$).
4. **Expressions:** Combinations of variables, constants, and operators without an equality sign (e.g., $3x + 7$).
5. **Equations:** Mathematical statements asserting that two expressions are equal (e.g., $3x + 7 = 22$).

### Fundamental Axioms
- **Addition/Subtraction Property of Equality:** If $a = b$, then $a + c = b + c$ and $a - c = b - c$.
- **Multiplication/Division Property of Equality:** If $a = b$ and $c \\neq 0$, then $a \\cdot c = b \\cdot c$ and $\\frac{a}{c} = \\frac{b}{c}$.
- **Distributive Property:** $a(b + c) = ab + ac$.`
  },
  {
    id: "math_solving_linear_equations",
    subject: "Mathematics",
    tutor: "Mathematics Mentor",
    tutorId: "math",
    topic: "Solving Linear Equations",
    source: "Mathematics Curriculum - Linear Systems §1.2",
    difficulty: "Beginner",
    tags: ["equations", "linear", "solve", "isolation", "single variable"],
    content: `A **Linear Equation** in one variable is an algebraic equation that can be written in the standard form $ax + b = c$ where $a, b, c$ are real numbers and $a \\neq 0$.

### Systematic Solving Methodology
1. **Simplify each side:** Expand parentheses using the distributive property and combine like terms.
2. **Isolate variable terms:** Use addition or subtraction to collect all variable terms on one side and constant numbers on the opposite side.
3. **Solve for the variable:** Divide both sides by the coefficient $a$.
4. **Verify the solution:** Substitute the calculated value back into the original equation.

### Step-by-Step Example: Solve $3x + 7 = 22$
1. **Subtract $7$ from both sides:**
   $$3x + 7 - 7 = 22 - 7 \\implies 3x = 15$$
2. **Divide both sides by $3$:**
   $$x = \\frac{15}{3} = 5$$
3. **Verification:**
   $$3(5) + 7 = 15 + 7 = 22 \\quad (\\text{Verified Correct})$$
**Final Answer: $x = 5$**`
  },
  {
    id: "math_quadratic_equations",
    subject: "Mathematics",
    tutor: "Mathematics Mentor",
    tutorId: "math",
    topic: "Quadratic Equations & Discriminant",
    source: "Mathematics Curriculum - Core Algebra §1.4",
    difficulty: "Intermediate",
    tags: ["quadratic", "roots", "discriminant", "factoring", "parabola", "equations"],
    content: `A **Quadratic Equation** is a second-order polynomial equation of the form:
$$ax^2 + bx + c = 0 \\quad (a \\neq 0)$$

### Quadratic Formula
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

### The Discriminant ($D = b^2 - 4ac$)
- **$D > 0$:** Two distinct real roots. The parabola crosses the x-axis at two distinct points.
- **$D = 0$:** Exactly one repeated real root ($x = -b / (2a)$). The parabola vertex touches the x-axis.
- **$D < 0$:** Two complex conjugate roots ($x = \\frac{-b \\pm i\\sqrt{|D|}}{2a}$). No real x-intercepts.

### Example: Solve $x^2 - 4x + 4 = 0$
- Coefficients: $a = 1, b = -4, c = 4$.
- Discriminant: $D = (-4)^2 - 4(1)(4) = 16 - 16 = 0$.
- Formula: $x = \\frac{-(-4) \\pm 0}{2(1)} = \\frac{4}{2} = 2$.
**Final Answer: $x = 2$ (single repeated real root)**`
  },
  {
    id: "math_polynomials_and_factoring",
    subject: "Mathematics",
    tutor: "Mathematics Mentor",
    tutorId: "math",
    topic: "Polynomials, Factoring & Binomial Theorem",
    source: "Mathematics Curriculum - Advanced Algebra §1.5",
    difficulty: "Intermediate",
    tags: ["polynomial", "factoring", "binomial theorem", "roots", "algebra"],
    content: `A **Polynomial** of degree $n$ is an expression $P(x) = a_n x^n + a_{n-1} x^{n-1} + \\dots + a_1 x + a_0$ where $a_n \\neq 0$.

### Fundamental Theorem of Algebra
Every non-zero single-variable polynomial of degree $n$ with complex coefficients has exactly $n$ complex roots (counting multiplicities).

### Binomial Theorem Formula
$$(a + b)^n = \\sum_{k=0}^{n} \\binom{n}{k} a^{n-k} b^k \\quad \\text{where } \\binom{n}{k} = \\frac{n!}{k!(n - k)!}$$

### Key Factoring Patterns
- Difference of Squares: $a^2 - b^2 = (a - b)(a + b)$
- Difference of Cubes: $a^3 - b^3 = (a - b)(a^2 + ab + b^2)$
- Sum of Cubes: $a^3 + b^3 = (a + b)(a^2 - ab + b^2)$`
  },
  {
    id: "math_logarithms_and_exponents",
    subject: "Mathematics",
    tutor: "Mathematics Mentor",
    tutorId: "math",
    topic: "Logarithms & Exponential Equations",
    source: "Mathematics Curriculum - Functions & Logarithms §1.6",
    difficulty: "Intermediate",
    tags: ["logarithms", "exponents", "natural log", "log rules", "exponential growth"],
    content: `A **Logarithm** is the inverse operation to exponentiation. The equation $\\log_b(x) = y$ is equivalent to $b^y = x$ ($b > 0, b \\neq 1$).

### Essential Logarithmic Properties
1. **Product Rule:** $\\log_b(xy) = \\log_b(x) + \\log_b(y)$
2. **Quotient Rule:** $\\log_b(x/y) = \\log_b(x) - \\log_b(y)$
3. **Power Rule:** $\\log_b(x^k) = k \\cdot \\log_b(x)$
4. **Change of Base Formula:** $\\log_b(x) = \\frac{\\ln(x)}{\\ln(b)} = \\frac{\\log_{10}(x)}{\\log_{10}(b)}$
5. **Inverse Rules:** $b^{\\log_b(x)} = x$ and $\\log_b(b^x) = x$`
  },
  {
    id: "math_matrices_definition",
    subject: "Mathematics",
    tutor: "Mathematics Mentor",
    tutorId: "math",
    topic: "Matrices Definition & Dimensions",
    source: "Mathematics Curriculum - Linear Algebra §2.1",
    difficulty: "Intermediate",
    tags: ["matrices", "matrix", "rows", "columns", "dimensions", "arrays"],
    content: `A **Matrix** (plural: **matrices**) is a rectangular array of numbers, symbols, or expressions arranged in horizontal **rows** and vertical **columns**.

### Dimensions ($m \\times n$)
A matrix with $m$ rows and $n$ columns has dimension $m \\times n$. Matrices organize multi-variable linear transformations cleanly. Each individual entry is indexed as $a_{ij}$, denoting the element in row $i$ and column $j$.

### Common Matrix Types
- **Square Matrix:** Equal rows and columns ($m = n$).
- **Identity Matrix ($I$):** Square matrix with $1$s along the main diagonal and $0$s everywhere else ($A \\cdot I = A$).
- **Zero Matrix ($O$):** All entries are zero.
- **Diagonal Matrix:** Non-zero entries only on the main diagonal.
- **Transpose ($A^T$):** Formed by swapping rows and columns: $(A^T)_{ij} = A_{ji}$.

### Matrix Representation
$$A = \\begin{pmatrix} a_{11} & a_{12} \\\\ a_{21} & a_{22} \\end{pmatrix}$$`
  },
  {
    id: "math_matrix_multiplication",
    subject: "Mathematics",
    tutor: "Mathematics Mentor",
    tutorId: "math",
    topic: "Matrix Multiplication & Properties",
    source: "Mathematics Curriculum - Linear Algebra §2.2",
    difficulty: "Intermediate",
    tags: ["matrix multiplication", "matrices", "dot product", "compatibility", "linear algebra", "multiplication rules", "matrix example"],
    content: `**Matrix Multiplication** is a binary operation that produces a single matrix $C$ from two matrices $A$ and $B$, written as $C = A \\cdot B$.

### Strict Compatibility Condition
Matrix multiplication $A \\cdot B$ is defined **if and only if** the number of columns in $A$ equals the number of rows in $B$.
If $A$ has dimension $m \\times n$ and $B$ has dimension $n \\times p$, the resulting product matrix $C$ has dimension $m \\times p$.

### Formula (Dot Product Rule)
The entry in row $i$ and column $j$ of matrix $C$ is the dot product of row $i$ of $A$ and column $j$ of $B$:
$$c_{ij} = \\sum_{k=1}^{n} a_{ik} \\cdot b_{kj}$$

### Multiplication Rules & Properties
1. **Non-Commutative:** In general, $A \\cdot B \\neq B \\cdot A$. The order of factors matters strictly!
2. **Associative:** $(A \\cdot B) \\cdot C = A \\cdot (B \\cdot C)$.
3. **Distributive:** $A \\cdot (B + C) = A \\cdot B + A \\cdot C$ and $(A + B) \\cdot C = A \\cdot C + B \\cdot C$.
4. **Identity Matrix:** $A \\cdot I_n = I_m \\cdot A = A$, where $I$ is the identity matrix.
5. **Scalar Multiplication Compatibility:** $k(A \\cdot B) = (kA) \\cdot B = A \\cdot (kB)$.

### Step-by-Step 2x2 Example
Multiply matrix $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$ and matrix $B = \\begin{pmatrix} 5 & 6 \\\\ 7 & 8 \\end{pmatrix}$:
- **Step 1 (Row 1 $\\cdot$ Col 1):** $c_{11} = (1)(5) + (2)(7) = 5 + 14 = 19$
- **Step 2 (Row 1 $\\cdot$ Col 2):** $c_{12} = (1)(6) + (2)(8) = 6 + 16 = 22$
- **Step 3 (Row 2 $\\cdot$ Col 1):** $c_{21} = (3)(5) + (4)(7) = 15 + 28 = 43$
- **Step 4 (Row 2 $\\cdot$ Col 2):** $c_{22} = (3)(6) + (4)(8) = 18 + 32 = 50$

$$C = A \\cdot B = \\begin{pmatrix} 19 & 22 \\\\ 43 & 50 \\end{pmatrix}$$`
  },
  {
    id: "math_determinants_and_inverse",
    subject: "Mathematics",
    tutor: "Mathematics Mentor",
    tutorId: "math",
    topic: "Determinants & Matrix Inverses",
    source: "Mathematics Curriculum - Linear Algebra §2.3",
    difficulty: "Intermediate",
    tags: ["determinant", "inverse matrix", "cramer's rule", "invertible", "singular matrix"],
    content: `The **Determinant** of a square matrix $A$ is a scalar value that describes scaling factor and invertibility of the transformation.

### 2x2 Determinant Formula
$$\\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc$$

### Invertibility Condition
A square matrix $A$ has an **inverse matrix** $A^{-1}$ (where $A \\cdot A^{-1} = I$) **if and only if $\\det(A) \\neq 0$** (non-singular).

### 2x2 Matrix Inverse Formula
$$A^{-1} = \\frac{1}{ad - bc} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$$`
  },
  {
    id: "math_eigenvalues_eigenvectors",
    subject: "Mathematics",
    tutor: "Mathematics Mentor",
    tutorId: "math",
    topic: "Eigenvalues and Eigenvectors",
    source: "Mathematics Curriculum - Linear Algebra §2.4",
    difficulty: "Advanced",
    tags: ["eigenvalues", "eigenvectors", "characteristic equation", "determinant", "linear transformations"],
    content: `In linear algebra, an **eigenvector** of a square matrix $A$ is a non-zero vector $\\mathbf{v}$ that, when multiplied by $A$, yields a scalar multiple of itself. The scalar $\\lambda$ is called the corresponding **eigenvalue**.

### Fundamental Equation
$$A \\mathbf{v} = \\lambda \\mathbf{v} \\iff (A - \\lambda I) \\mathbf{v} = \\mathbf{0}$$

### Characteristic Equation
For non-trivial solutions ($\\mathbf{v} \\neq \\mathbf{0}$), the matrix $(A - \\lambda I)$ must be singular, meaning its determinant equals zero:
$$\\det(A - \\lambda I) = 0$$

### Procedure to Find Eigenvalues & Eigenvectors
1. Compute the characteristic polynomial $\\det(A - \\lambda I) = 0$.
2. Solve the polynomial roots for eigenvalues $\\lambda_1, \\lambda_2, \\dots, \\lambda_n$.
3. For each eigenvalue $\\lambda_i$, substitute back into $(A - \\lambda_i I)\\mathbf{v} = \\mathbf{0}$ and solve the homogeneous system to find the eigenvector basis (eigenspace).`
  },
  {
    id: "math_calculus_limits",
    subject: "Mathematics",
    tutor: "Mathematics Mentor",
    tutorId: "math",
    topic: "Calculus - Limits & Continuity",
    source: "Mathematics Curriculum - Calculus §3.0",
    difficulty: "Intermediate",
    tags: ["limits", "continuity", "l'hopital's rule", "indeterminate forms", "calculus"],
    content: `A **Limit** describes the behavior of a function $f(x)$ as its input $x$ approaches a particular value $a$: $\\lim_{x \\to a} f(x) = L$.

### Continuity Definition
A function $f(x)$ is continuous at point $x = c$ if:
1. $f(c)$ is defined.
2. $\\lim_{x \\to c} f(x)$ exists.
3. $\\lim_{x \\to c} f(x) = f(c)$.

### L'Hôpital's Rule
For indeterminate limits of type $\\frac{0}{0}$ or $\\frac{\\pm\\infty}{\\pm\\infty}$:
$$\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\lim_{x \\to a} \\frac{f'(x)}{g'(x)}$$`
  },
  {
    id: "math_calculus_differentiation",
    subject: "Mathematics",
    tutor: "Mathematics Mentor",
    tutorId: "math",
    topic: "Calculus - Differentiation & Derivatives",
    source: "Mathematics Curriculum - Calculus §3.1",
    difficulty: "Intermediate",
    tags: ["differentiation", "derivative", "calculus", "rate of change", "tangent slope", "power rule"],
    content: `**Differentiation** is the branch of calculus that measures the instantaneous rate of change of a function. Geometrically, the derivative $f'(x)$ or $\\frac{dy}{dx}$ represents the **slope of the tangent line** to the curve $y = f(x)$ at any point $x$.

### Formal Definition (Limit of Difference Quotient)
$$f'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$$

### Essential Differentiation Rules
1. **Power Rule:** $\\frac{d}{dx}[x^n] = n \\cdot x^{n-1}$
2. **Constant Multiple Rule:** $\\frac{d}{dx}[c \\cdot f(x)] = c \\cdot f'(x)$
3. **Sum/Difference Rule:** $\\frac{d}{dx}[f(x) \\pm g(x)] = f'(x) \\pm g'(x)$
4. **Product Rule:** $\\frac{d}{dx}[u \\cdot v] = u'v + uv'$
5. **Quotient Rule:** $\\frac{d}{dx}\\left[\\frac{u}{v}\\right] = \\frac{u'v - uv'}{v^2}$
6. **Chain Rule:** $\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)$

### Example: Differentiate $f(x) = x^2 + 3x$
1. Apply the power rule to $x^2$: $\\frac{d}{dx}[x^2] = 2x^{2-1} = 2x$.
2. Apply the power rule to $3x$: $\\frac{d}{dx}[3x] = 3(1)x^0 = 3$.
3. Combine using the sum rule: $f'(x) = 2x + 3$.
**Final Answer: $f'(x) = 2x + 3$**`
  },
  {
    id: "math_calculus_integration",
    subject: "Mathematics",
    tutor: "Mathematics Mentor",
    tutorId: "math",
    topic: "Calculus - Integration & Antiderivatives",
    source: "Mathematics Curriculum - Calculus §3.2",
    difficulty: "Intermediate",
    tags: ["integration", "integral", "antiderivative", "area under curve", "calculus", "definite integral"],
    content: `**Integration** is the mathematical process of computing net accumulation, continuous sums, and the **area under a curve**. It is the inverse operation of differentiation (Fundamental Theorem of Calculus).

### Types of Integrals
1. **Indefinite Integral:** Represents a family of antiderivatives with an arbitrary constant of integration $+ C$:
   $$\\int f(x) dx = F(x) + C \\quad \\text{where } F'(x) = f(x)$$
2. **Definite Integral:** Computes the net signed area under $f(x)$ from $x = a$ to $x = b$:
   $$\\int_{a}^{b} f(x) dx = F(b) - F(a)$$

### Fundamental Integration Rules
- **Power Rule for Integration:** $\\int x^n dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\neq -1)$
- **Integration by Parts:** $\\int u dv = uv - \\int v du$
- **Exponential Rule:** $\\int e^x dx = e^x + C$
- **Reciprocal Rule:** $\\int \\frac{1}{x} dx = \\ln|x| + C$`
  },
  {
    id: "math_trigonometry_and_geometry",
    subject: "Mathematics",
    tutor: "Mathematics Mentor",
    tutorId: "math",
    topic: "Trigonometry & Coordinate Geometry",
    source: "Mathematics Curriculum - Trigonometry §3.5",
    difficulty: "Intermediate",
    tags: ["trigonometry", "sine", "cosine", "tangent", "pythagoras", "geometry", "identities"],
    content: `**Trigonometry** studies the relationships between side lengths and angles of triangles.

### Fundamental Pythagorean Identity
$$\\sin^2(\\theta) + \\cos^2(\\theta) = 1, \\quad 1 + \\tan^2(\\theta) = \\sec^2(\\theta), \\quad 1 + \\cot^2(\\theta) = \\csc^2(\\theta)$$

### Double-Angle Formulas
- $\\sin(2\\theta) = 2\\sin(\\theta)\\cos(\\theta)$
- $\\cos(2\\theta) = \\cos^2(\\theta) - \\sin^2(\\theta) = 2\\cos^2(\\theta) - 1 = 1 - 2\\sin^2(\\theta)$

### Law of Sines and Law of Cosines
- **Law of Sines:** $\\frac{a}{\\sin(A)} = \\frac{b}{\\sin(B)} = \\frac{c}{\\sin(C)}$
- **Law of Cosines:** $c^2 = a^2 + b^2 - 2ab\\cos(C)$`
  },
  {
    id: "math_probability_and_statistics",
    subject: "Mathematics",
    tutor: "Mathematics Mentor",
    tutorId: "math",
    topic: "Probability Theory & Statistics",
    source: "Mathematics Curriculum - Statistics & Probability §4.1",
    difficulty: "Intermediate",
    tags: ["probability", "statistics", "bayes", "conditional probability", "mean", "variance", "standard deviation"],
    content: `**Probability** quantifies the likelihood of an event occurring, bounded between $0$ (impossible event) and $1$ (certain event).

### Probability Axioms & Formulas
- **Classical Probability:** $P(A) = \\frac{\\text{Favorable outcomes}}{\\text{Total outcomes in sample space } S}$
- **Complement Rule:** $P(A') = 1 - P(A)$
- **Addition Rule:** $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$
- **Independent Events:** $P(A \\cap B) = P(A) \\cdot P(B)$
- **Conditional Probability:** $P(A|B) = \\frac{P(A \\cap B)}{P(B)}$
- **Bayes' Theorem:** $P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}$

### Statistical Measures
- **Mean ($\\mu$):** $\\frac{1}{N}\\sum_{i=1}^N x_i$
- **Variance ($\\sigma^2$):** $\\frac{1}{N}\\sum_{i=1}^N (x_i - \\mu)^2$
- **Standard Deviation ($\\sigma$):** $\\sqrt{\\text{Variance}}$

### Illustrative Worked Example
Consider rolling a fair six-sided die where the sample space is $S = \\{1, 2, 3, 4, 5, 6\\}$ with $|S| = 6$.
- **Event $A$:** Rolling an even number $\\{2, 4, 6\\}$ ($|A| = 3$).
- **Probability Calculation:**
  $$P(A) = \\frac{|A|}{|S|} = \\frac{3}{6} = \\frac{1}{2} = 0.5$$
Thus, there is a $50\\%$ probability of rolling an even number.`
  },

  // =========================================================================
  // 2. SCIENCE EXPLORER (science) - Physics, Chemistry, Biology, Experiments
  // =========================================================================
  {
    id: "science_newton_laws",
    subject: "Science",
    tutor: "Science Explorer",
    tutorId: "science",
    topic: "Newton's Laws of Motion",
    source: "Physics Principles - Classical Mechanics §2.1",
    difficulty: "Beginner",
    tags: ["physics", "newton", "force", "inertia", "acceleration", "laws of motion"],
    content: `Sir Isaac Newton formulated the three foundational laws of classical mechanics describing how physical forces govern the motion of material objects.

### 1. Newton's First Law (Law of Inertia)
An object at rest stays at rest, and an object in motion remains in uniform motion along a straight line unless acted upon by a non-zero external resultant net force:
$$\\sum \\vec{F} = 0 \\implies \\vec{v} = \\text{constant}$$

### 2. Newton's Second Law (Fundamental Law of Dynamics)
The acceleration $\\vec{a}$ of an object is directly proportional to the net force $\\vec{F}_{\\text{net}}$ acting on it and inversely proportional to its mass $m$:
$$\\vec{F}_{\\text{net}} = m \\cdot \\vec{a}$$
- Units: Force in Newtons ($\\text{N} = \\text{kg}\\cdot\\text{m}/\\text{s}^2$).
- Numerical Application: Pushing a $10\\text{ kg}$ box with $50\\text{ N}$ net force produces an acceleration of $a = \\frac{F}{m} = \\frac{50}{10} = 5\\text{ m/s}^2$.

### 3. Newton's Third Law (Action & Reaction)
When body $A$ exerts a force on body $B$, body $B$ simultaneously exerts an equal in magnitude and opposite in direction force on body $A$:
$$\\vec{F}_{AB} = -\\vec{F}_{BA}$$`
  },
  {
    id: "science_gravitation_and_orbits",
    subject: "Science",
    tutor: "Science Explorer",
    tutorId: "science",
    topic: "Universal Gravitation & Orbital Motion",
    source: "Physics Principles - Astrophysics & Gravitation §2.3",
    difficulty: "Intermediate",
    tags: ["gravity", "gravitation", "kepler", "orbital velocity", "escape velocity", "physics"],
    content: `**Universal Gravitation** is the mutual attractive force exerted between all masses in the universe.

### Universal Law of Gravitation Formula
$$F = G \\frac{m_1 m_2}{r^2}$$
*(where $G = 6.674 \\times 10^{-11} \\text{ N}\\cdot\\text{m}^2/\\text{kg}^2$, $m_1, m_2$ are masses, and $r$ is center-to-center distance).*

### Acceleration Due to Gravity ($g$)
At the surface of a planet of mass $M$ and radius $R$:
$$g = \\frac{GM}{R^2} \\approx 9.81 \\text{ m/s}^2 \\text{ (on Earth)}$$

### Escape Velocity ($v_{\\text{esc}}$)
The minimum launch velocity required to overcome gravitational binding energy without additional propulsion:
$$v_{\\text{esc}} = \\sqrt{\\frac{2GM}{R}} \\approx 11.2 \\text{ km/s} \\text{ (for Earth)}$$`
  },
  {
    id: "science_thermodynamics_laws",
    subject: "Science",
    tutor: "Science Explorer",
    tutorId: "science",
    topic: "Laws of Thermodynamics & Heat",
    source: "Physics Principles - Thermal Physics §4.2",
    difficulty: "Intermediate",
    tags: ["physics", "thermodynamics", "entropy", "heat", "energy conservation"],
    content: `**Thermodynamics** is the branch of physical science concerning temperature, heat, mechanical work, and the energy transformations of macroscopic systems.

### The Four Laws
1. **Zeroth Law (Thermal Equilibrium):** If bodies $A$ and $B$ are each in thermal equilibrium with body $C$, then $A$ and $B$ are in thermal equilibrium with each other. This establishes temperature as a valid state variable.
2. **First Law (Conservation of Energy):** Energy can neither be created nor destroyed, only converted from one form to another:
   $$\\Delta U = Q - W$$
   *(where $\\Delta U$ is change in internal energy, $Q$ is heat added to the system, and $W$ is work done by the system).*
3. **Second Law (Entropy & Directionality):** The total entropy ($S$) of any isolated thermodynamic system always increases over time for spontaneous processes: $\\Delta S_{\\text{universe}} \\ge 0$. Heat never spontaneously flows from a colder body to a hotter body.
4. **Third Law (Absolute Zero):** As the temperature of a pure crystalline substance approaches absolute zero ($0\\text{ K} = -273.15^\\circ\\text{C}$), its entropy approaches a constant minimum value (zero).`
  },
  {
    id: "science_electromagnetism_and_circuits",
    subject: "Science",
    tutor: "Science Explorer",
    tutorId: "science",
    topic: "Electromagnetism, Circuits & Ohm's Law",
    source: "Physics Principles - Electromagnetism §5.1",
    difficulty: "Intermediate",
    tags: ["physics", "electricity", "circuits", "ohm's law", "faraday", "magnetism"],
    content: `**Electromagnetism** governs the interaction of electric charges and magnetic fields.

### Fundamental Laws
1. **Coulomb's Law:** Electric force between charges $q_1, q_2$:
   $$F_e = k_e \\frac{|q_1 q_2|}{r^2} \\quad (k_e \\approx 8.99 \\times 10^9 \\text{ N}\\cdot\\text{m}^2/\\text{C}^2)$$
2. **Ohm's Law:** Voltage, current, and electrical resistance in linear conductors:
   $$V = I \\cdot R$$
3. **Faraday's Law of Induction:** A changing magnetic flux $\\Phi_B$ through a circuit induces an electromotive force (EMF):
   $$\\mathcal{E} = -\\frac{d\\Phi_B}{dt}$$`
  },
  {
    id: "science_chemical_bonding",
    subject: "Science",
    tutor: "Science Explorer",
    tutorId: "science",
    topic: "Chemical Bonding & Molecular Structure",
    source: "Chemistry Fundamentals - Chemical Bonding §1.3",
    difficulty: "Intermediate",
    tags: ["chemistry", "chemical bonding", "ionic", "covalent", "octet rule", "electronegativity"],
    content: `**Chemical Bonding** is the attractive interaction that holds atoms together in compounds, driven by the thermodynamic tendency to minimize potential energy and achieve stable valence electron configurations (the **Octet Rule**).

### Why Chemical Bonding Occurs
Atoms form bonds because bonded states represent a lower, more stable potential energy level than isolated atoms. By sharing or transferring valence electrons, atoms attain closed-shell noble gas electron configurations ($s^2 p^6$).

### Primary Types of Chemical Bonds
1. **Ionic Bonding:**
   - Occurs between metals (low electronegativity) and non-metals (high electronegativity).
   - Electrons are completely transferred, creating electrostatic attraction between positive cations (e.g., $\\text{Na}^+$) and negative anions (e.g., $\\text{Cl}^-$).
2. **Covalent Bonding:**
   - Occurs between non-metallic atoms with similar electronegativities.
   - Pairs of electrons are shared between atomic nuclei.
   - Can be **non-polar** (equal sharing, e.g., $\\text{O}_2, \\text{CH}_4$) or **polar** (unequal sharing due to electronegativity differences, e.g., $\\text{H}_2\\text{O}$).
3. **Metallic Bonding:**
   - Positive metal ions held together by a delocalized "sea of mobile conduction electrons".`
  },
  {
    id: "science_chemical_reactions_and_kinetics",
    subject: "Science",
    tutor: "Science Explorer",
    tutorId: "science",
    topic: "Chemical Kinetics, Equilibrium & Le Chatelier's Principle",
    source: "Chemistry Fundamentals - Physical Chemistry §2.4",
    difficulty: "Intermediate",
    tags: ["chemistry", "kinetics", "equilibrium", "le chatelier", "reaction rate", "activation energy"],
    content: `**Chemical Kinetics** explores the rates of chemical reactions, mechanisms of transformation, and factors influencing molecular collision speeds.

### Reaction Rate & Arrhenius Equation
The rate constant $k$ depends exponentially on temperature and activation energy $E_a$:
$$k = A \\cdot e^{-\\frac{E_a}{RT}}$$

### Le Chatelier's Principle
If a dynamic chemical equilibrium is disturbed by a change in temperature, pressure, or concentration, the position of equilibrium shifts in a direction that counteracts the disturbance:
- **Concentration:** Adding reactants shifts equilibrium forward toward products.
- **Pressure:** Increasing pressure shifts gas equilibrium toward the side with fewer gas moles.
- **Temperature:** For exothermic reactions ($\\Delta H < 0$), heating shifts equilibrium toward reactants.`
  },
  {
    id: "science_photosynthesis_biology",
    subject: "Science",
    tutor: "Science Explorer",
    tutorId: "science",
    topic: "Photosynthesis & Cellular Energy",
    source: "Biological Systems - Cellular Energy §3.1",
    difficulty: "Intermediate",
    tags: ["biology", "photosynthesis", "chloroplast", "calvin cycle", "light reactions", "glucose"],
    content: `**Photosynthesis** is the biochemical process by which photoautotrophic organisms (green plants, algae, cyanobacteria) convert solar light energy into chemical energy stored within organic carbohydrates (glucose).

### Overall Chemical Equation
$$6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\text{Light Energy} \\xrightarrow{\\text{Chlorophyll}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$$

### The Two Interdependent Stages
1. **Light-Dependent Reactions (Thylakoid Membrane):**
   - Chlorophyll pigments absorb photons, energizing electrons in Photosystems II and I.
   - Water molecules are photolytically split (photolysis): $2\\text{H}_2\\text{O} \\to 4\\text{H}^+ + 4e^- + \\text{O}_2$.
   - Oxygen is released as a byproduct, and energy carriers **ATP** and **NADPH** are generated via photophosphorylation.
2. **Light-Independent Reactions / Calvin Cycle (Chloroplast Stroma):**
   - The enzyme **RuBisCO** fixes atmospheric Carbon Dioxide ($\\text{CO}_2$) onto ribulose 1,5-bisphosphate (RuBP).
   - Consuming ATP and NADPH from the light stage, the cycle reduces 3-PGA into glyceraldehyde-3-phosphate (G3P), synthesizing glucose.`
  },
  {
    id: "science_cellular_respiration",
    subject: "Science",
    tutor: "Science Explorer",
    tutorId: "science",
    topic: "Cellular Respiration & ATP Synthesis",
    source: "Biological Systems - Metabolism §3.2",
    difficulty: "Intermediate",
    tags: ["biology", "respiration", "glycolysis", "krebs cycle", "mitochondria", "atp"],
    content: `**Cellular Respiration** is the metabolic pathway through which aerobic cells catabolize glucose into usable biochemical energy in the form of Adenosine Triphosphate (**ATP**).

### Overall Chemical Reaction
$$\\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 \\longrightarrow 6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\sim 30\\text{--}32\\text{ ATP}$$

### Three Main Stages
1. **Glycolysis (Cytoplasm):** 1 glucose ($6\\text{C}$) is cleaved into 2 pyruvate molecules ($3\\text{C}$), yielding net $2\\text{ ATP}$ and $2\\text{ NADH}$ anaerobically.
2. **Krebs Cycle / Citric Acid Cycle (Mitochondrial Matrix):** Acetyl-CoA is oxidized, generating electron carriers ($6\\text{ NADH}, 2\\text{ FADH}_2$) and $2\\text{ ATP}$.
3. **Electron Transport Chain & Oxidative Phosphorylation (Inner Membrane):** Chemiosmosis drives ATP synthase using a proton gradient, generating $\\sim 26\\text{--}28\\text{ ATP}$ with Oxygen as the final electron acceptor.`
  },

  // =========================================================================
  // 3. CODING COACH (code) - Fundamentals, Python, JS/TS, Java, DSA, DB, etc.
  // =========================================================================
  {
    id: "code_python_lists_datastructures",
    subject: "Coding",
    tutor: "Coding Coach",
    tutorId: "code",
    topic: "Python Lists & Sequence Operations",
    source: "Python Engineering - Built-in Data Structures §2.1",
    difficulty: "Beginner",
    tags: ["python", "list", "array", "data structures", "mutable", "indexing"],
    content: `A **Python List** is a built-in, mutable, ordered collection of heterogeneous elements stored as dynamic array references.

### Key Characteristics
- **Ordered:** Elements maintain insertion order accessible by zero-based indexing (\`lst[0]\`).
- **Mutable:** Elements can be added, updated, or removed in-place without creating a new list.
- **Dynamic Resizing:** Automatically allocates extra capacity using exponential growth amortized time.

### Common List Operations & Time Complexities
- Access by index: \`lst[i]\` — $O(1)$
- Append to tail: \`lst.append(item)\` — Amortized $O(1)$
- Insert at index: \`lst.insert(i, item)\` — $O(n)$ (requires shifting elements)
- Delete from tail: \`lst.pop()\` — $O(1)$
- Slicing: \`lst[start:stop:step]\` — $O(k)$ where $k$ is slice length

### Python Code Example
\`\`\`python
# Python list demonstration
fruits = ["apple", "banana", "cherry"]
fruits.append("orange")      # ["apple", "banana", "cherry", "orange"]
fruits[1] = "blackberry"     # In-place mutation

# List comprehension
squared = [x**2 for x in range(5)]  # [0, 1, 4, 9, 16]
print("Transformed:", squared)
\`\`\``
  },
  {
    id: "code_recursion_algorithms",
    subject: "Coding",
    tutor: "Coding Coach",
    tutorId: "code",
    topic: "Recursion & Call Stack Mechanics",
    source: "Algorithms & Complexity - Algorithmic Paradigms §3.2",
    difficulty: "Intermediate",
    tags: ["recursion", "call stack", "base case", "divide and conquer", "algorithms"],
    content: `**Recursion** is an algorithmic technique where a function solves a problem by calling itself with smaller instances of the same problem.

### The Two Mandatory Components
1. **Base Case:** The terminating condition that returns a direct result without making further recursive calls, preventing infinite loops and Stack Overflow errors.
2. **Recursive Step:** The logic that breaks the problem down and calls the function with sub-problems that advance toward the base case.

### Call Stack Execution Flow
Every recursive call pushes a new execution stack frame (storing local variables, parameters, and return address) onto the system call stack. Once the base case is hit, stack frames unwind and compute intermediate return values.

### Python Code Example: Factorial Calculation
\`\`\`python
def factorial(n: int) -> int:
    # 1. Base case
    if n <= 1:
        return 1
    # 2. Recursive step
    return n * factorial(n - 1)

print(factorial(5)) # Output: 120 (5 * 4 * 3 * 2 * 1)
\`\`\``
  },
  {
    id: "code_js_undefined_debugging",
    subject: "Coding",
    tutor: "Coding Coach",
    tutorId: "code",
    topic: "JavaScript Debugging - Why Functions Return Undefined",
    source: "JavaScript Architecture - Runtime Mechanics §1.4",
    difficulty: "Intermediate",
    tags: ["javascript", "debugging", "undefined", "return", "scope", "arrow functions"],
    content: `In JavaScript, a function returns \`undefined\` by default whenever execution finishes without encountering an explicit \`return\` statement with a value.

### Common Root Causes for Functions Returning Undefined
1. **Missing \`return\` Statement:**
   The function executes statements but forgets to return the computed value.
   \`\`\`javascript
   // Bug:
   function add(a, b) { const sum = a + b; } // returns undefined
   // Fix:
   function add(a, b) { return a + b; }
   \`\`\`
2. **Multiline Object Return in Arrow Functions:**
   Curly braces \`{}\` after an arrow are interpreted as a function block rather than an object literal.
   \`\`\`javascript
   // Bug: returns undefined
   const getUser = () => { name: "Alice" };
   // Fix: Wrap object in parentheses
   const getUser = () => ({ name: "Alice" });
   \`\`\`
3. **Async / Promise Misunderstanding:**
   Calling an \`async\` function without \`await\` returns a pending Promise object rather than the resolved data.
4. **Automatic Semicolon Insertion (ASI) on Line Break:**
   \`\`\`javascript
   // Bug: JS inserts ';' immediately after return
   return
     { status: "ok" }; // Unreachable code!
   // Fix:
   return { status: "ok" };
   \`\`\``
  },
  {
    id: "code_js_event_loop_and_async",
    subject: "Coding",
    tutor: "Coding Coach",
    tutorId: "code",
    topic: "JavaScript Event Loop, Microtasks & Async/Await",
    source: "JavaScript Architecture - Runtime Engine §2.1",
    difficulty: "Intermediate",
    tags: ["javascript", "event loop", "async await", "promises", "microtasks", "concurrency"],
    content: `JavaScript is single-threaded, using an **Event Loop** architecture to manage asynchronous non-blocking I/O operations.

### Queue Priority Hierarchy
1. **Call Stack:** Synchronous code executes immediately frame by frame.
2. **Microtask Queue (High Priority):** Resolved Promise callbacks (\`.then()\`, \`await\`), \`queueMicrotask()\`, \`MutationObserver\`. Executed completely after each synchronous tick before any macrotasks.
3. **Macrotask / Task Queue (Standard Priority):** \`setTimeout()\`, \`setInterval()\`, I/O events, UI rendering.

### Code Example
\`\`\`typescript
console.log("1: Synchronous");
setTimeout(() => console.log("4: Macrotask"), 0);
Promise.resolve().then(() => console.log("3: Microtask"));
console.log("2: Synchronous");
// Execution Order: 1 -> 2 -> 3 -> 4
\`\`\``
  },
  {
    id: "code_data_structures_linked_lists",
    subject: "Coding",
    tutor: "Coding Coach",
    tutorId: "code",
    topic: "Data Structures - Linked Lists vs Arrays",
    source: "Data Structures & Algorithms - Linear Structures §2.2",
    difficulty: "Intermediate",
    tags: ["data structures", "linked list", "arrays", "pointers", "complexity"],
    content: `A **Linked List** is a linear data structure consisting of discrete nodes where each node stores a data value and a pointer (reference) to the next node in sequence.

### Structural Comparison
- **Array:** Elements stored in contiguous memory blocks. Fast random access by index $O(1)$, but expensive resizing and insertions/deletions at the head $O(n)$.
- **Linked List:** Nodes scattered throughout memory connected via pointers. Dynamic size with $O(1)$ insertions/deletions at the head, but sequential traversal $O(n)$ to access an index.

### TypeScript Node Implementation
\`\`\`typescript
class ListNode<T> {
  val: T;
  next: ListNode<T> | null = null;

  constructor(val: T, next: ListNode<T> | null = null) {
    this.val = val;
    this.next = next;
  }
}

// Instantiate: 10 -> 20 -> null
const head = new ListNode(10, new ListNode(20));
\`\`\``
  },
  {
    id: "code_dsa_trees_and_bst",
    subject: "Coding",
    tutor: "Coding Coach",
    tutorId: "code",
    topic: "Data Structures - Binary Search Trees (BST)",
    source: "Data Structures & Algorithms - Tree Structures §3.1",
    difficulty: "Intermediate",
    tags: ["bst", "binary search tree", "trees", "traversals", "algorithms", "dsa"],
    content: `A **Binary Search Tree (BST)** is a node-based hierarchical data structure where each node contains at most two children.

### BST Invariant Property
For every node $N$ in the tree:
- All keys in $N$'s left subtree are strictly **less than** $N$'s key.
- All keys in $N$'s right subtree are strictly **greater than** $N$'s key.

### Time Complexities
- **Search / Insert / Delete (Balanced BST / AVL):** $O(\\log n)$
- **Search (Degenerate unbalanced tree):** $O(n)$

### In-Order Traversal
Visiting left $\\to$ root $\\to$ right produces elements in sorted ascending order!`
  },
  {
    id: "code_databases_sql_indexing",
    subject: "Coding",
    tutor: "Coding Coach",
    tutorId: "code",
    topic: "Databases - SQL Joins, Indexing & ACID Transactions",
    source: "Database Engineering - Relational Systems §4.1",
    difficulty: "Intermediate",
    tags: ["databases", "sql", "joins", "indexing", "acid", "transactions"],
    content: `Relational Database Management Systems (RDBMS) utilize structured schemas, relational algebra, and **ACID** properties to guarantee reliable transactions.

### ACID Principles
- **Atomicity:** All operations in a transaction succeed, or the entire transaction rolls back.
- **Consistency:** Database transitions only between valid states conforming to schema constraints.
- **Isolation:** Concurrent transactions execute without cross-contamination.
- **Durability:** Committed changes persist safely even during hardware failure.

### Database Indexing (B-Trees)
An index creates a balanced B-Tree auxiliary data structure over specific columns, reducing search complexity from a full table scan $O(n)$ to logarithmic lookup $O(\\log n)$.`
  },

  // =========================================================================
  // 4. LITERATURE & LANGUAGE GUIDE (lit) - Grammar, Vocabulary, Writing, etc.
  // =========================================================================
  {
    id: "lit_compound_sentences",
    subject: "Literature",
    tutor: "Literature & Language Guide",
    tutorId: "lit",
    topic: "Sentence Construction - Compound & Complex Sentences",
    source: "Language & Composition - Syntax Architecture §1.2",
    difficulty: "Beginner",
    tags: ["grammar", "sentence structure", "compound sentence", "conjunctions", "punctuation"],
    content: `A **Compound Sentence** is a sentence composed of at least two independent clauses (complete thoughts that could each stand alone as separate sentences) joined by a coordinating conjunction or a semicolon.

### Linking Independent Clauses
1. **Coordinating Conjunctions (FANBOYS):**
   - **F**or, **A**nd, **N**or, **B**ut, **O**r, **Y**et, **S**o.
   - Punctuation Rule: Place a comma immediately before the conjunction.
   - *Example:* "The researcher formulated an ambitious hypothesis**, but** the initial laboratory experiments yielded contradictory evidence."
2. **Semicolon Linking:**
   - Used when two independent clauses are closely linked conceptually without a conjunction.
   - *Example:* "The library closed early**;** the students continued their literature review at the campus lounge."

### Comparison with Other Sentence Types
- **Simple Sentence:** One independent clause (*"The author published the manuscript."*).
- **Compound Sentence:** Two independent clauses (*"The author published the manuscript, and critics praised its thematic depth."*).
- **Complex Sentence:** One independent clause + at least one dependent (subordinate) clause (*"Although critics praised the manuscript, sales remained modest."*).`
  },
  {
    id: "lit_academic_writing_improvement",
    subject: "Literature",
    tutor: "Literature & Language Guide",
    tutorId: "lit",
    topic: "Improving Academic & Critical Writing",
    source: "Rhetoric & Academic Writing - Stylistic Rigor §2.4",
    difficulty: "Intermediate",
    tags: ["writing", "academic writing", "thesis", "rhetoric", "cohesion", "clarity"],
    content: `Elevating academic writing requires shifting from passive reporting to analytical, thesis-driven argumentation characterized by clarity, precise diction, and structural cohesion.

### Key Strategies for High-Impact Academic Writing
1. **Formulate Defensible Thesis Statements:**
   Avoid vague statements of topic. Anchor arguments using the formula:
   $$\\text{Subject} + \\text{Defensible Claim} + \\text{Specific Supporting Rationale}$$
2. **Adopt the PEEL Paragraph Structure:**
   - **P (Point):** Clear topic sentence introducing the paragraph's core claim.
   - **E (Evidence):** Direct citations, textual evidence, or empirical findings.
   - **E (Explanation):** Analytical elaboration explaining *how* and *why* the evidence proves the claim.
   - **L (Link):** Concluding transition connecting back to the primary thesis.
3. **Eliminate Wordiness & Passive Hedging:**
   - *Weak:* "It could perhaps be argued that technology has an impact on learners."
   - *Refined:* "Adaptive learning platforms accelerate STEM knowledge retention by delivering real-time targeted feedback."
4. **Use Precise Academic Signposting:**
   Employ transitional markers (*Furthermore, Consequently, Conversely, Synthetically*) to guide the reader logically across arguments.`
  },
  {
    id: "lit_rhetorical_devices",
    subject: "Literature",
    tutor: "Literature & Language Guide",
    tutorId: "lit",
    topic: "Rhetorical Devices & Persuasive Appeals",
    source: "Literary Theory & Rhetoric - Persuasive Discourse §3.1",
    difficulty: "Intermediate",
    tags: ["rhetoric", "ethos", "pathos", "logos", "metaphor", "irony", "persuasion"],
    content: `Classical **Rhetoric** is the art of persuasive discourse and textual analysis, developed systematically since Aristotle.

### The Three Aristotelian Appeals
1. **Ethos (Credibility):** Persuasion through character, authority, and scholarly integrity.
2. **Logos (Logic):** Persuasion through empirical data, deductive syllogisms, and structured evidence.
3. **Pathos (Emotion):** Persuasion through vivid sensory imagery and emotional resonance.

### Prominent Literary Devices
- **Metaphor:** Direct figurative equivalence (*"Time is a thief"*).
- **Irony:** Contrast between expectation and reality (dramatic, situational, or verbal).
- **Antithesis:** Juxtaposition of contrasting ideas in parallel grammatical structure (*"Ask not what your country can do for you; ask what you can do for your country"*).`
  },

  // =========================================================================
  // 5. CAREER NAVIGATOR (career) - Pathways, Resumes, Interviews, Soft Skills
  // =========================================================================
  {
    id: "career_software_interview_prep",
    subject: "Career",
    tutor: "Career Navigator",
    tutorId: "career",
    topic: "Software Developer Interview Preparation",
    source: "Technical Career Guide - Interview Systems §3.1",
    difficulty: "Intermediate",
    tags: ["career", "interview", "software engineer", "resume", "star method", "coding interview"],
    content: `Thorough preparation for software engineering roles spans three foundational pillars: Data Structures & Algorithms, System Design / Architecture, and Behavioral STAR storytelling.

### Pillar 1: Coding & Algorithmic Problem Solving
- Focus on core patterns: Sliding Window, Two Pointers, Fast & Slow Pointers, BFS/DFS tree traversals, Dynamic Programming, and Topological Sort.
- Practice the **REACTO** interview framework:
  1. **R**epeat: Clarify the problem and constraints.
  2. **E**xamples: Test edge cases (empty input, null, negatives, duplicates).
  3. **A**pproach: Discuss time/space complexity tradeoffs before coding.
  4. **C**ode: Write modular, readable code with descriptive names.
  5. **T**est: Dry-run with an example trace.
  6. **O**ptimize: Identify bottlenecks and refine complexity.

### Pillar 2: System Design & Architecture
- Learn distributed systems principles: Load balancing, caching (Redis), relational vs NoSQL databases, message queues (Kafka/RabbitMQ), and database sharding.

### Pillar 3: Behavioral Storytelling (STAR Method)
Structure responses to leadership and conflict questions using:
- **S (Situation):** Set the business context and timeline.
- **T (Task):** Define your specific responsibility.
- **A (Action):** Highlight the technical decisions and actions *you* took.
- **R (Result):** Conclude with quantifiable business impact (e.g., "Reduced latency by 40%").`
  },
  {
    id: "career_resume_engineering",
    subject: "Career",
    tutor: "Career Navigator",
    tutorId: "career",
    topic: "Resume Engineering & The Google XYZ Formula",
    source: "Professional Pathways - Resume Blueprint §1.2",
    difficulty: "Beginner",
    tags: ["resume", "cv", "job preparation", "xyz formula", "ats optimization"],
    content: `A top-tier technical resume is not a list of job duties; it is a concise, quantified record of engineered outcomes formatted for Applicant Tracking Systems (ATS) and human recruiters.

### The Google XYZ Formula
Frame every bullet point using:
> *"Accomplished [X] as measured by [Y], by doing [Z]"*
- **Weak:** *"Worked on backend API services for user profile management."*
- **Engineered (XYZ):** *"Engineered a fault-tolerant Node.js profile microservice that reduced API P99 latency by 35% across 250,000 daily active users by implementing Redis multi-level caching."*

### Clean Architecture & Section Hierarchy
1. **Header:** Name, Contact, GitHub, LinkedIn, Portfolio.
2. **Technical Skills:** Grouped by Languages, Frameworks, Databases, Cloud & DevOps tools.
3. **Experience:** Reverse-chronological with 3–4 quantified XYZ bullets per role.
4. **Projects:** Production deployments showing architecture, tech stack, and live links.
5. **Education & Certifications:** Degree, institution, relevant honors.`
  },
  {
    id: "career_certifications_and_roadmaps",
    subject: "Career",
    tutor: "Career Navigator",
    tutorId: "career",
    topic: "Tech Career Roadmaps & Cloud Certifications",
    source: "Professional Pathways - Industry Certifications §2.2",
    difficulty: "Intermediate",
    tags: ["career roadmaps", "certifications", "cloud", "aws", "devops", "upskilling"],
    content: `Navigating modern technology career tracks requires strategically matching academic fundamentals with industry-validated certifications and proof-of-work repositories.

### High-ROI Cloud & DevOps Certifications
- **AWS Certified Solutions Architect – Associate:** Validates distributed computing architecture, VPC networking, IAM security, and cost optimization.
- **Google Cloud Associate Cloud Engineer:** Focuses on container deployments (GKE), Compute Engine, BigQuery, and IAM.
- **Certified Kubernetes Administrator (CKA):** Hands-on operational certification for container orchestration.

### Engineering Career Ladders
1. **Associate / Junior Engineer:** Focuses on bug fixes, clean code implementation, and team communication.
2. **Mid-Level Engineer:** Autonomously delivers features, writes unit tests, and conducts code reviews.
3. **Senior Engineer:** Leads system design, mentors peers, and owns cross-service reliability.
4. **Staff / Principal Architect:** Drives company-wide technology strategy and technical vision.`
  },

  // =========================================================================
  // 6. RESEARCH ASSISTANT (research) - Methodology, Problem, Gap, Literature, etc.
  // =========================================================================
  {
    id: "research_gap_identification",
    subject: "Research",
    tutor: "Research Assistant",
    tutorId: "research",
    topic: "Identifying & Formulating a Research Gap",
    source: "Academic Deep-Dive - Research Methodology §1.1",
    difficulty: "Advanced",
    tags: ["research gap", "problem statement", "methodology", "research questions", "novelty", "contribution"],
    content: `A **Research Gap** is an unexplored void, contradiction, or under-examined dimension within the existing body of published academic literature that warrants rigorous scientific investigation and provides a novel scientific contribution to the field.

### Major Types of Research Gaps
1. **Evidence Gap:** Prior empirical studies present contradictory or inconclusive findings on the same phenomenon.
2. **Methodological Gap:** Previous research relied on limited methodologies (e.g., only small-sample qualitative surveys) that require validation through large-scale quantitative experiments.
3. **Population/Context Gap:** Established theories have only been tested in specific demographics or geographic contexts (e.g., Western universities) and remain unexamined in novel settings.
4. **Practical/Application Gap:** A theoretical model exists but has not been implemented or evaluated in practical, real-world deployment.

### How to Systematically Discover Research Gaps
- Review the **"Future Work"** and **"Limitations"** sections of peer-reviewed papers published in the last 18–24 months.
- Map existing findings in a comparative **Literature Matrix** to identify uncharted intersections and formulate a novel research contribution.
- Formulate a clear, scoped Research Question that directly addresses the identified void.`
  },
  {
    id: "research_literature_review_methodology",
    subject: "Research",
    tutor: "Research Assistant",
    tutorId: "research",
    topic: "Writing a Systematic Literature Review",
    source: "Academic Deep-Dive - Scholarly Documentation §2.3",
    difficulty: "Advanced",
    tags: ["literature review", "systematic review", "prisma", "synthesis", "citations", "academic writing", "sources"],
    content: `A **Literature Review** is a critical, comprehensive synthesis and evaluation of published scholarship and peer-reviewed sources related directly to a research question or hypothesis.

### Step-by-Step Systematic Review Process (PRISMA Guidelines)
1. **Define Research Scope & Questions:** Formulate explicit inclusion and exclusion criteria before beginning search queries across primary citation sources.
2. **Multi-Database Search:** Query reputable scholarly indexes (IEEE Xplore, ACM Digital Library, PubMed, ScienceDirect, Google Scholar) using Boolean operators (\`AND\`, \`OR\`, \`NOT\`) to gather reliable sources.
3. **Screening & Selection:** Screen titles and abstracts to filter out non-peer-reviewed or tangential publications.
4. **Thematic Synthesis (Not Sequential Summaries):**
   - Do **NOT** summarize paper by paper (*"Smith (2022) said X. Jones (2023) said Y."*).
   - **DO** organize literature thematically around paradigms, contradictions, and evolving methodologies across evaluated sources (*"While early algorithmic models prioritized parameter scale (Smith, 2022), recent research demonstrates that retrieval-augmented grounding yields superior domain accuracy (Jones, 2023; Patel, 2025)."*).
5. **Critique & Position:** Highlight prevailing limitations in existing literature sources and position your own investigation as the logical solution.`
  },
  {
    id: "research_methodologies_and_sampling",
    subject: "Research",
    tutor: "Research Assistant",
    tutorId: "research",
    topic: "Quantitative vs Qualitative Research & Sampling",
    source: "Academic Deep-Dive - Experimental Design §2.1",
    difficulty: "Advanced",
    tags: ["methodology", "quantitative", "qualitative", "sampling", "hypothesis testing", "p-value"],
    content: `Selecting the appropriate **Research Methodology** determines the internal and external validity of empirical investigations.

### Quantitative vs Qualitative Methodologies
- **Quantitative Research:** Formulates testable hypotheses, measures numerical variables, and tests statistical significance (e.g., $t$-tests, ANOVA, regression, $p < 0.05$). Prioritizes generalizability and replicability.
- **Qualitative Research:** Investigates human experiences, meanings, and social phenomena via open-ended interviews, grounded theory, or thematic analysis. Prioritizes depth, nuance, and contextual validity.
- **Mixed-Methods Research:** Integrates both quantitative and qualitative methods to triangulate complex findings.

### Scientific Sampling Techniques
- **Probability Sampling:** Simple random, stratified random, and cluster sampling (minimizes selection bias).
- **Non-Probability Sampling:** Purposive sampling, snowball sampling, and convenience sampling.`
  },

  // ----------------------------------------------------
  // EXTENDED DATASET: MATHEMATICS MENTOR
  // ----------------------------------------------------
  {
    id: "math_vectors_algebra",
    subject: "Mathematics",
    tutor: "Mathematics Mentor",
    tutorId: "math",
    topic: "Vector Algebra, Dot Product & Cross Product",
    source: "Higher Mathematics - Linear Algebra & Vectors §4.1",
    difficulty: "Advanced",
    tags: ["vector algebra", "dot product", "cross product", "scalar product", "magnitude", "unit vector", "orthogonal"],
    content: `A **Vector** $\\vec{v} = \\langle v_1, v_2, v_3 \\rangle = v_1\\hat{i} + v_2\\hat{j} + v_3\\hat{k}$ represents a geometric entity possessing both magnitude $|\\vec{v}| = \\sqrt{v_1^2 + v_2^2 + v_3^2}$ and direction.

### The Dot Product (Scalar Product)
$$\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos(\\theta) = a_1 b_1 + a_2 b_2 + a_3 b_3$$
- **Orthogonality Condition:** Two non-zero vectors $\\vec{a}$ and $\\vec{b}$ are perpendicular if and only if $\\vec{a} \\cdot \\vec{b} = 0$.
- **Scalar Projection of $\\vec{b}$ onto $\\vec{a}$:** $\\text{proj}_{\\vec{a}} \\vec{b} = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{a}|}$.

### The Cross Product (Vector Product)
$$\\vec{a} \\times \\vec{b} = |\\vec{a}||\\vec{b}|\\sin(\\theta)\\hat{n} = \\begin{vmatrix} \\hat{i} & \\hat{j} & \\hat{k} \\\\ a_1 & a_2 & a_3 \\\\ b_1 & b_2 & b_3 \\end{vmatrix}$$
- Result is perpendicular to both $\\vec{a}$ and $\\vec{b}$.
- **Parallel Condition:** $\\vec{a} \\times \\vec{b} = \\vec{0} \\iff$ vectors are collinear or parallel.`
  },
  {
    id: "math_differential_equations",
    subject: "Mathematics",
    tutor: "Mathematics Mentor",
    tutorId: "math",
    topic: "Differential Equations - First-Order Linear & Separable",
    source: "Higher Mathematics - Calculus III §3.2",
    difficulty: "Advanced",
    tags: ["differential equations", "separable equations", "integrating factor", "first order differential", "calculus"],
    content: `A **Differential Equation** relates an unknown function $y(x)$ to its derivatives.

### 1. Separable Differential Equations
Form: $\\frac{dy}{dx} = g(x)h(y) \\implies \\frac{1}{h(y)} dy = g(x) dx$.
- **Solution Technique:** Integrate both sides: $\\int \\frac{1}{h(y)} dy = \\int g(x) dx + C$.

### 2. First-Order Linear Differential Equations
Standard Form:
$$\\frac{dy}{dx} + P(x)y = Q(x)$$
- **Integrating Factor (I.F.):**
$$I(x) = e^{\\int P(x) dx}$$
- **General Solution:**
$$y \\cdot I(x) = \\int [Q(x) \\cdot I(x)] dx + C$$`
  },
  {
    id: "math_complex_numbers",
    subject: "Mathematics",
    tutor: "Mathematics Mentor",
    tutorId: "math",
    topic: "Complex Numbers, Argand Plane & Euler's Formula",
    source: "Higher Mathematics - Complex Analysis §1.1",
    difficulty: "Intermediate",
    tags: ["complex numbers", "imaginary number", "euler formula", "argand plane", "modulus", "argument", "polar form"],
    content: `A **Complex Number** is expressed as $z = a + bi$, where $a = \\text{Re}(z)$ is the real part, $b = \\text{Im}(z)$ is the imaginary part, and $i = \\sqrt{-1}$ such that $i^2 = -1$.

### Modulus and Argument
- **Modulus (Absolute Value):** $|z| = r = \\sqrt{a^2 + b^2}$
- **Argument (Phase):** $\\theta = \\text{arg}(z) = \\arctan\\left(\\frac{b}{a}\\right)$
- **Complex Conjugate:** $\\bar{z} = a - bi$, with $z \\bar{z} = |z|^2 = a^2 + b^2$.

### Polar and Exponential Form (Euler's Formula)
$$e^{i\\theta} = \\cos(\\theta) + i\\sin(\\theta)$$
$$z = r(\\cos \\theta + i\\sin \\theta) = r e^{i\\theta}$$
- **Euler's Identity:** $e^{i\\pi} + 1 = 0$, connecting five fundamental constants: $e, i, \\pi, 1, 0$.`
  },
  {
    id: "math_statistics_dispersion",
    subject: "Mathematics",
    tutor: "Mathematics Mentor",
    tutorId: "math",
    topic: "Statistics - Variance, Standard Deviation & Normal Distribution",
    source: "Mathematics Fundamentals - Statistics & Probability §2.2",
    difficulty: "Intermediate",
    tags: ["statistics", "variance", "standard deviation", "mean", "median", "normal distribution", "z score"],
    content: `Measures of central tendency (mean $\\mu$, median, mode) describe the center of a distribution, while measures of dispersion quantify spread.

### Variance ($\\sigma^2$) and Standard Deviation ($\\sigma$)
For a dataset of $N$ values with mean $\\mu = \\frac{1}{N}\\sum_{i=1}^N x_i$:
- **Population Variance:** $\\sigma^2 = \\frac{1}{N}\\sum_{i=1}^N (x_i - \\mu)^2$
- **Standard Deviation:** $\\sigma = \\sqrt{\\sigma^2} = \\sqrt{\\frac{1}{N}\\sum_{i=1}^N (x_i - \\mu)^2}$
- **Sample Variance ($s^2$):** Divides by $n-1$ (Bessel's correction) to ensure an unbiased estimator.

### The Standard Normal Distribution & Z-Score
$$Z = \\frac{X - \\mu}{\\sigma}$$
- **Empirical 68-95-99.7 Rule:** 68.2% of observations fall within $\\mu \\pm 1\\sigma$, 95.4% within $\\mu \\pm 2\\sigma$, and 99.7% within $\\mu \\pm 3\\sigma$.`
  },

  // ----------------------------------------------------
  // EXTENDED DATASET: SCIENCE EXPLORER
  // ----------------------------------------------------
  {
    id: "science_electromagnetic_induction",
    subject: "Science",
    tutor: "Science Explorer",
    tutorId: "science",
    topic: "Electromagnetic Induction & Faraday's Laws",
    source: "Physics Principles - Electromagnetism §3.1",
    difficulty: "Advanced",
    tags: ["electromagnetic induction", "faraday law", "lenz law", "magnetic flux", "induced emf", "maxwell"],
    content: `**Electromagnetic Induction** is the production of an electromotive force (EMF) across an electrical conductor situated in a varying magnetic field.

### Magnetic Flux ($\\Phi_B$)
$$\\Phi_B = \\vec{B} \\cdot \\vec{A} = B A \\cos(\\theta)$$
Where $B$ is the magnetic field intensity (Tesla), $A$ is the loop surface area ($m^2$), and $\\theta$ is the angle between $\\vec{B}$ and the normal to the surface.

### Faraday's Law of Induction
$$\\mathcal{E} = -N \\frac{d\\Phi_B}{dt}$$
- The induced EMF ($\\mathcal{E}$) is directly proportional to the time rate of change of magnetic flux.

### Lenz's Law (The Negative Sign)
- The direction of the induced current creates an induced magnetic field that **opposes** the original change in magnetic flux that produced it (Conservation of Energy).`
  },
  {
    id: "science_organic_reaction_mechanisms",
    subject: "Science",
    tutor: "Science Explorer",
    tutorId: "science",
    topic: "Organic Chemistry Mechanisms - SN1 vs SN2 Reactions",
    source: "Chemistry Fundamentals - Organic Chemistry §2.2",
    difficulty: "Advanced",
    tags: ["organic chemistry", "sn1", "sn2", "nucleophile", "electrophile", "carbocation", "stereochemistry"],
    content: `Nucleophilic substitution reactions ($S_N$) involve an electron-rich nucleophile ($Nu^-$) replacing a leaving group ($LG$) on an $sp^3$ hybridized carbon substrate.

### $S_N2$ (Substitution Nucleophilic Bimolecular)
- **Mechanism:** One-step concerted process. The nucleophile attacks the back-side of the carbon while the leaving group departs simultaneously.
- **Kinetics:** Second-order: $\\text{Rate} = k[\\text{Substrate}][Nu^-]$.
- **Stereochemistry:** 100% Walden Inversion of configuration (umbrella flip).
- **Substrate Preference:** Methyl > Primary ($1^\\circ$) > Secondary ($2^\\circ$) > Tertiary ($3^\\circ$, unreactive due to steric hindrance).
- **Solvent:** Polar aprotic solvents (DMSO, Acetone, DMF).

### $S_N1$ (Substitution Nucleophilic Unimolecular)
- **Mechanism:** Two-step process. Step 1: Leaving group leaves, forming a planar carbocation intermediate. Step 2: Nucleophile attacks either face.
- **Kinetics:** First-order: $\\text{Rate} = k[\\text{Substrate}]$.
- **Stereochemistry:** Racemization (mix of retention and inversion).
- **Substrate Preference:** Tertiary ($3^\\circ$) > Secondary ($2^\\circ$) >> Primary ($1^\\circ$) due to carbocation hyperconjugation stability.
- **Solvent:** Polar protic solvents (Water, Ethanol).`
  },
  {
    id: "science_periodic_trends",
    subject: "Science",
    tutor: "Science Explorer",
    tutorId: "science",
    topic: "Periodic Table Trends & Electronegativity",
    source: "Chemistry Fundamentals - Inorganic Chemistry §1.4",
    difficulty: "Intermediate",
    tags: ["periodic trends", "electronegativity", "atomic radius", "ionization energy", "electron affinity", "effective nuclear charge"],
    content: `Periodic trends in the periodic table are dictated by electron configurations and **Effective Nuclear Charge** ($Z_{\\text{eff}} = Z - S$, where $Z$ is nuclear charge and $S$ is core shielding).

### 1. Atomic Radius
- **Across a Period (Left to Right):** Decreases. $Z_{\\text{eff}}$ increases pulling valence electrons closer to the nucleus.
- **Down a Group (Top to Bottom):** Increases. New principal energy levels ($n$) add shielding shells.

### 2. First Ionization Energy
- Energy required to remove the outermost valence electron from a gaseous atom.
- **Across a Period:** Increases due to higher $Z_{\\text{eff}}$ and smaller radius.
- **Down a Group:** Decreases due to greater atomic radius and electron shielding.

### 3. Electronegativity (Pauling Scale)
- The chemical property that describes the tendency of an atom to attract a shared pair of bonding electrons.
- Fluorine is the most electronegative element (3.98), Francium/Cesium the lowest (~0.7).
- Increases across a period, decreases down a group.`
  },
  {
    id: "science_cell_division_mitosis_meiosis",
    subject: "Science",
    tutor: "Science Explorer",
    tutorId: "science",
    topic: "Cell Division - Mitosis vs Meiosis Mechanisms",
    source: "Biological Systems - Cellular & Molecular Biology §2.1",
    difficulty: "Intermediate",
    tags: ["mitosis", "meiosis", "cell division", "chromosomes", "crossing over", "haploid", "diploid", "gametes"],
    content: `Eukaryotic cell division operates through two distinct nuclear division processes: Mitosis (somatic duplication) and Meiosis (gametogenesis).

### Mitosis (Equational Division)
- **Function:** Growth, tissue regeneration, and asexual reproduction.
- **Result:** Produces **two genetically identical diploid ($2n$)** daughter cells.
- **Phases:** Prophase $\\to$ Metaphase (chromosomes align at equator) $\\to$ Anaphase (sister chromatids pulled apart) $\\to$ Telophase / Cytokinesis.

### Meiosis (Reductional Division)
- **Function:** Gamete formation (sperm and egg cells in sexually reproducing organisms).
- **Result:** Produces **four genetically diverse haploid ($n$)** daughter cells.
- **Two Sequential Divisions:**
  - **Meiosis I:** Homologous chromosomes pair (synapsis) and undergo **crossing over** (genetic recombination in Prophase I), then separate.
  - **Meiosis II:** Sister chromatids separate (similar to mitosis) without intervening DNA replication.`
  },

  // ----------------------------------------------------
  // EXTENDED DATASET: CODING COACH
  // ----------------------------------------------------
  {
    id: "code_binary_search_trees",
    subject: "Coding",
    tutor: "Coding Coach",
    tutorId: "code",
    topic: "Binary Search Trees (BST) & Tree Traversals",
    source: "Data Structures & Algorithms - Non-Linear Structures §3.1",
    difficulty: "Intermediate",
    tags: ["binary search tree", "bst", "tree traversal", "inorder traversal", "preorder", "postorder", "binary tree"],
    content: `A **Binary Search Tree (BST)** is a node-based hierarchical data structure where each node has at most two children satisfying the **BST Invariant**:
- For every node $N$: all nodes in the left subtree have values $< N.\\text{val}$.
- All nodes in the right subtree have values $> N.\\text{val}$.

### Time Complexity
- **Search, Insert, Delete:** $O(\\log n)$ average for balanced trees (AVL, Red-Black); $O(n)$ worst-case for degenerate (linked-list shaped) trees.

### Depth-First Tree Traversals
1. **In-Order Traversal (Left, Root, Right):** Produces values in strictly ascending sorted order.
2. **Pre-Order Traversal (Root, Left, Right):** Ideal for serializing and cloning trees.
3. **Post-Order Traversal (Left, Right, Root):** Ideal for deleting trees and evaluating postfix expression trees.

\`\`\`python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorder_traversal(root):
    return inorder_traversal(root.left) + [root.val] + inorder_traversal(root.right) if root else []
\`\`\``
  },
  {
    id: "code_graph_algorithms_bfs_dfs",
    subject: "Coding",
    tutor: "Coding Coach",
    tutorId: "code",
    topic: "Graph Algorithms - Breadth-First Search (BFS) & Depth-First Search (DFS)",
    source: "Algorithms & Complexity - Graph Theory §4.1",
    difficulty: "Advanced",
    tags: ["graph algorithms", "bfs", "dfs", "breadth first search", "depth first search", "queue", "shortest path"],
    content: `A **Graph** $G = (V, E)$ consists of vertices $V$ and edges $E$. Traversals explore all reachable vertices while tracking visited sets to prevent infinite cycles.

### Breadth-First Search (BFS)
- **Data Structure:** FIFO Queue.
- **Traversal Strategy:** Explores neighbor-by-neighbor in concentric distance layers.
- **Use Cases:** Finds the **unweighted shortest path** between two vertices, level-order traversal, web crawlers.
- **Complexity:** Time $O(V + E)$, Space $O(V)$.

### Depth-First Search (DFS)
- **Data Structure:** LIFO Call Stack (Recursion) or explicit Stack.
- **Traversal Strategy:** Dives deep along a branch until dead end, then backtracks.
- **Use Cases:** Cycle detection, topological sorting (DAGs), finding connected components, maze solving.
- **Complexity:** Time $O(V + E)$, Space $O(V)$ (recursion depth).`
  },
  {
    id: "code_sorting_mergesort_quicksort",
    subject: "Coding",
    tutor: "Coding Coach",
    tutorId: "code",
    topic: "Sorting Algorithms - Merge Sort vs QuickSort",
    source: "Data Structures & Algorithms - Sorting & Searching §2.3",
    difficulty: "Intermediate",
    tags: ["sorting algorithms", "merge sort", "quicksort", "divide and conquer", "time complexity", "stable sort"],
    content: `Both Merge Sort and QuickSort employ the **Divide-and-Conquer** algorithmic paradigm.

### Merge Sort
- **Concept:** Recursively splits array into halves until singletons, then merges sorted sub-arrays.
- **Time Complexity:** $O(n \\log n)$ guaranteed in Best, Average, and Worst cases.
- **Space Complexity:** $O(n)$ auxiliary memory for merging buffers.
- **Stability:** **Stable** (preserves relative order of duplicate elements).

### QuickSort
- **Concept:** Chooses a pivot element, partitions array such that items $\\le$ pivot are left and $\\ge$ pivot are right, then recurses.
- **Time Complexity:** Average $O(n \\log n)$; Worst case $O(n^2)$ if pivot is poorly chosen (already sorted array with first element as pivot).
- **Space Complexity:** $O(\\log n)$ in-place call stack memory.
- **Stability:** **Unstable** in standard in-place partitioning (Lomuto or Hoare).`
  },
  {
    id: "code_oop_principles",
    subject: "Coding",
    tutor: "Coding Coach",
    tutorId: "code",
    topic: "Object-Oriented Programming (OOP) - The 4 Core Pillars",
    source: "Software Engineering Foundations - System Design §1.2",
    difficulty: "Intermediate",
    tags: ["oop", "object oriented programming", "encapsulation", "inheritance", "polymorphism", "abstraction"],
    content: `**Object-Oriented Programming (OOP)** structures software around objects containing data fields and operating methods.

### The 4 Foundational Pillars
1. **Encapsulation:** Bundling state (properties) and behavior (methods) within an object while hiding internal state via access modifiers (\`private\`, \`protected\`, \`public\`).
2. **Abstraction:** Exposing only essential interface contracts while concealing complex implementation mechanics (e.g., Abstract Classes and Interfaces).
3. **Inheritance:** Enabling a derived class (child) to inherit attributes and methods from an existing base class (parent), promoting code reuse (\`class Dog extends Animal\`).
4. **Polymorphism:** The ability of different classes to respond to the same interface or method call in their own specific way (Method Overriding at runtime and Method Overloading at compile-time).`
  },
  {
    id: "code_js_async_await_promises",
    subject: "Coding",
    tutor: "Coding Coach",
    tutorId: "code",
    topic: "JavaScript Async/Await, Promises & The Event Loop",
    source: "JavaScript Architecture - Runtime Engine §2.2",
    difficulty: "Intermediate",
    tags: ["javascript async", "promises", "async await", "event loop", "microtask queue", "macrotask"],
    content: `JavaScript executes in a single-threaded runtime driven by an **Event Loop** utilizing Call Stacks, Microtask Queues, and Macrotask (Callback) Queues.

### JavaScript Promises
A Promise represents an asynchronous operation with three states: \`pending\`, \`fulfilled\` ($resolve$), or \`rejected\` ($reject$).
\`\`\`javascript
const fetchData = () => new Promise((resolve, reject) => {
  setTimeout(() => resolve("Data loaded"), 1000);
});
\`\`\`

### Async / Await Syntax
- \`async\` declares a function that implicitly returns a Promise.
- \`await\` pauses execution inside the async function until the Promise settles without blocking the main browser thread.
- Always wrap in \`try { ... } catch (err) { ... }\` for resilient error handling.

### Microtasks vs Macrotasks
- **Microtasks** (\`Promise.then\`, \`queueMicrotask\`, \`MutationObserver\`) are processed **immediately** after the current synchronous stack empties, BEFORE any Macrotasks (\`setTimeout\`, \`setInterval\`, \`I/O\`).`
  },
  {
    id: "code_sql_joins_relational",
    subject: "Coding",
    tutor: "Coding Coach",
    tutorId: "code",
    topic: "Relational Databases - SQL Joins, Indexing & ACID",
    source: "Database Engineering - Relational Systems §1.3",
    difficulty: "Intermediate",
    tags: ["sql joins", "relational database", "inner join", "left join", "indexing", "acid transactions", "b-tree"],
    content: `Relational Database Management Systems (RDBMS like PostgreSQL, MySQL) store structured entities in relational tables normalized into Boyce-Codd or 3rd Normal Form (3NF).

### Types of SQL Joins
- **INNER JOIN:** Returns records with matching keys in both tables.
- **LEFT (OUTER) JOIN:** Returns all rows from left table and matched rows from right; unmatched right values yield \`NULL\`.
- **RIGHT JOIN:** Returns all rows from right table and matched rows from left.
- **FULL OUTER JOIN:** Returns all rows when there is a match in either left or right table.

### ACID Properties of Database Transactions
- **Atomicity:** All statements in a transaction succeed completely, or the entire transaction rolls back.
- **Consistency:** Moves database from one valid state to another satisfying all schema constraints.
- **Isolation:** Concurrent transactions execute without cross-contamination (Isolation levels: Read Committed, Serializable).
- **Durability:** Committed transactions persist safely even during unexpected system failure.`
  },
  {
    id: "code_database_normalization",
    subject: "Coding",
    tutor: "Coding Coach",
    tutorId: "code",
    topic: "Database Normalization - 1NF, 2NF, 3NF & BCNF",
    subTopic: "Relational Schema Normalization & Functional Dependencies",
    source: "Database Engineering - Normalization §1.4",
    difficulty: "Intermediate",
    tags: ["normalization", "database normalization", "1nf", "2nf", "3nf", "bcnf", "first normal form", "second normal form", "third normal form", "functional dependencies", "data redundancy", "anomalies"],
    content: `**Database Normalization** is a systematic architectural process in relational database design used to organize tables, attributes, and relationships to minimize data redundancy and prevent insertion, update, and deletion anomalies.

### The Core Normal Forms
1. **First Normal Form (1NF):** Eliminate repeating groups and ensure atomic values. Every column in a table must contain single, indivisible scalar values, and each record must be uniquely identified by a primary key.
2. **Second Normal Form (2NF):** Satisfies 1NF AND eliminates partial functional dependencies. Every non-key attribute must be fully functionally dependent on the ENTIRE primary key (no non-key attribute can depend on only a subset of a composite primary key).
3. **Third Normal Form (3NF):** Satisfies 2NF AND eliminates transitive functional dependencies. Non-key attributes must NOT depend on other non-key attributes ($X \\to Y$ is permissible only if $X$ is a superkey or $Y$ is a prime attribute).
4. **Boyce-Codd Normal Form (BCNF):** A stricter variant of 3NF where for every functional dependency $X \\to Y$, $X$ must strictly be a superkey.

### Practical Example
- **Unnormalized / Violating 2NF:** A table with composite key \`(StudentID, CourseID)\` containing \`CourseInstructorName\`. Because \`CourseInstructorName\` depends solely on \`CourseID\` (part of the key) rather than the whole composite key, it violates 2NF.
- **Normalized Solution:** Split into two relations: \`StudentEnrollment(StudentID, CourseID)\` and \`Courses(CourseID, CourseInstructorName)\`.`
  },

  // ----------------------------------------------------
  // EXTENDED DATASET: LITERATURE & LANGUAGE GUIDE
  // ----------------------------------------------------
  {
    id: "lit_literary_devices",
    subject: "Literature",
    tutor: "Literature & Language Guide",
    tutorId: "lit",
    topic: "Literary Devices - Symbolism, Irony & Foreshadowing",
    source: "Critical Literary Analysis - Rhetorical Devices §2.1",
    difficulty: "Intermediate",
    tags: ["literary devices", "symbolism", "irony", "foreshadowing", "verbal irony", "dramatic irony", "allegory"],
    content: `Literary devices enrich prose and poetry by conveying secondary layers of psychological and philosophical meaning beyond literal semantics.

### 1. Symbolism
- An object, character, color, or event that represents an abstract concept larger than its literal self.
- *Example:* The green light at the end of Daisy's dock in F. Scott Fitzgerald's *The Great Gatsby* symbolizes Gatsby's unattainable romantic illusion and the elusive American Dream.

### 2. The Three Dimensions of Irony
- **Verbal Irony:** A speaker says the opposite of what they truly mean (sarcasm).
- **Situational Irony:** An incongruity between what is reasonably expected to happen and what actually occurs.
- **Dramatic Irony:** The audience or reader knows crucial narrative truths that the characters within the story remain unaware of (e.g., in Sophocles' *Oedipus Rex*).

### 3. Foreshadowing
- Subtle narrative hints, symbolic motifs, or prognostic dialogues inserted early in a text indicating future narrative conflicts.`
  },
  {
    id: "lit_active_vs_passive_voice",
    subject: "Literature",
    tutor: "Literature & Language Guide",
    tutorId: "lit",
    topic: "Active vs Passive Voice & Stylistic Syntax",
    source: "Language & Composition - Grammar Mechanics §1.3",
    difficulty: "Beginner",
    tags: ["active voice", "passive voice", "syntax", "grammar", "verb tense", "sentence structure", "writing style"],
    content: `Voice determines whether the grammatical subject is performing the action or receiving the action of the verb.

### Active Voice (Actor $\\to$ Verb $\\to$ Receiver)
- **Structure:** [Subject/Actor] + [Transitive Verb] + [Direct Object].
- *Example:* *"The researcher published the breakthrough findings in Nature."*
- **Advantages:** Clear, direct, energetic, and concise.

### Passive Voice (Receiver $\\to$ Auxiliary Verb + Past Participle $\\to$ Actor)
- **Structure:** [Receiver Object] + [Form of *to be*] + [Past Participle] + (optional: *by* [Actor]).
- *Example:* *"The breakthrough findings were published in Nature by the researcher."*
- **When to Use Passive Voice:**
  1. When the actor is unknown or irrelevant (*"The ancient manuscript was preserved."*).
  2. In empirical scientific methodologies to maintain objective focus on procedure (*"The solution was heated to 80°C."*).`
  },
  {
    id: "lit_essay_thesis_structure",
    subject: "Literature",
    tutor: "Literature & Language Guide",
    tutorId: "lit",
    topic: "Thesis Statement Architecture & Essay Structure",
    source: "Rhetoric & Composition - Scholarly Prose §3.1",
    difficulty: "Intermediate",
    tags: ["thesis statement", "essay structure", "peel paragraph", "argumentative essay", "introduction", "conclusion"],
    content: `A persuasive academic essay requires an unambiguous argumentative blueprint centered on a defensible, non-obvious **Thesis Statement**.

### Formulating an Arguable Thesis Statement
A strong thesis is NOT a statement of undeniable fact (*"Climate change is real."*), but a testable, disputable claim supported by specific interpretive reasoning:
- *Formula:* Although [Counterargument / Context], [Specific Central Claim] because [Reason 1], [Reason 2], and [Reason 3].

### The PEEL Paragraph Framework
Every supporting body paragraph should follow the rigorous **PEEL** architecture:
- **P (Point):** Clear topic sentence asserting a single analytical argument supporting the thesis.
- **E (Evidence):** Concrete quotation, empirical data, or textual excerpt.
- **E (Explanation):** Analytical deconstruction explaining HOW and WHY the evidence validates the point.
- **L (Link):** Concluding transition connecting back to the macro thesis statement.`
  },
  {
    id: "lit_punctuation_comma_splices",
    subject: "Literature",
    tutor: "Literature & Language Guide",
    tutorId: "lit",
    topic: "Punctuation Mastery, Semicolons & Comma Splices",
    source: "Language & Composition - Punctuation & Style §1.1",
    difficulty: "Beginner",
    tags: ["punctuation", "comma splice", "semicolon", "colon", "run-on sentence", "independent clause"],
    content: `Proper punctuation establishes rhythmic clarity and syntactical accuracy in formal writing.

### The Comma Splice Error
A **Comma Splice** occurs when two independent clauses are joined with only a comma, which is grammatically incorrect:
- *Incorrect:* *"The experiment yielded contradictory results, the team decided to re-evaluate the hypothesis."*
- **Four Ways to Correct a Comma Splice:**
  1. **Add a Coordinating Conjunction (FANBOYS):** *"...contradictory results, **so** the team..."*
  2. **Use a Semicolon (\`;\`):** *"...contradictory results**;** the team..."*
  3. **Split into Two Periods (\`.\`):** *"...contradictory results**.** The team..."*
  4. **Subordinate one clause:** *"*Because* the experiment yielded contradictory results, the team..."*

### Semicolons vs Colons
- **Semicolon (\`;\`):** Joins two closely related independent clauses without a conjunction.
- **Colon (\`:\`):** Introduces an amplification, formal list, or quotation following a complete independent clause.`
  },

  // ----------------------------------------------------
  // EXTENDED DATASET: CAREER NAVIGATOR
  // ----------------------------------------------------
  {
    id: "career_star_method_behavioral",
    subject: "Career",
    tutor: "Career Navigator",
    tutorId: "career",
    topic: "The STAR Method for Behavioral Interviews",
    source: "Professional Pathways - Behavioral Mastery §2.1",
    difficulty: "Beginner",
    tags: ["star method", "behavioral interview", "interview questions", "situation task action result", "competency"],
    content: `Top technology and Fortune 500 companies use behavioral interviews to evaluate past behaviors as predictors of future job performance. The **STAR Framework** structures compelling, quantified answers.

### The 4 Components of STAR
1. **S - Situation (15%):** Set the specific context, timeframe, and background.
2. **T - Task (15%):** Clearly identify the challenge, responsibility, or obstacle you personally owned.
3. **A - Action (50% - Crucial):** Describe the concrete actions **YOU** spearheaded. Use *"I executed"*, *"I architected"*, *"I resolved"* instead of ambiguous *"we"* statements.
4. **R - Result (20%):** Conclude with tangible, quantified outcomes (*"Reduced p99 database latency by 42% and unlocked $180k in annual cloud compute savings"*).

### Common Pitfalls
- Lingering on background context rather than your own personal decisions.
- Omitting metrics, timelines, or business outcomes in the Result section.`
  },
  {
    id: "career_linkedin_networking",
    subject: "Career",
    tutor: "Career Navigator",
    tutorId: "career",
    topic: "LinkedIn Optimization & Strategic Professional Networking",
    source: "Professional Pathways - Personal Branding §3.2",
    difficulty: "Beginner",
    tags: ["linkedin", "networking", "personal brand", "cold outreach", "informational interview", "profile optimization"],
    content: `Over 85% of high-paying tech and professional roles are filled through warm referrals and optimized talent discovery platforms.

### High-Converting LinkedIn Profile Blueprint
1. **Headline:** Target Role + Key Specialization + Quantified Proof (*"Distributed Systems Engineer | Go, Kubernetes, Kafka | Building Real-Time Financial Infrastructure Serving 10M+ Daily Trans"*).
2. **About Section:** Narrative hook detailing your domain focus, key achievements, and current intellectual interests.
3. **Featured Section:** Pin high-impact GitHub repositories, published papers, or speaking slide decks.

### The Informational Interview Protocol
- Send personalized, concise outreach messages (under 100 words):
  *"Hi [Name], I've been closely following your engineering work at [Company] on distributed caches. As a backend developer building high-throughput systems, I'd love to ask two focused questions about how your team approaches latency SLAs if you have 10 minutes this month."*`
  },
  {
    id: "career_salary_negotiation",
    subject: "Career",
    tutor: "Career Navigator",
    tutorId: "career",
    topic: "Tech Salary & Total Compensation Negotiation",
    source: "Professional Pathways - Compensation Systems §4.1",
    difficulty: "Advanced",
    tags: ["salary negotiation", "total compensation", "equity", "rsu", "counter offer", "job offer"],
    content: `Negotiating compensation requires understanding **Total Compensation (TC)**:
$$\\text{Total Compensation} = \\text{Base Salary} + \\text{Annual Performance Bonus} + \\text{RSU / Equity Vesting} + \\text{Sign-on Bonus}$$

### The 5 Golden Rules of Negotiation
1. **Never Disclose Current or Desired Compensation Early:** Respond with: *"I want to focus on ensuring this role is an exceptional mutual technical fit first, and I trust your team offers competitive market rates for this level."*
2. **Anchor with Market Data:** Benchmark compensation levels via verified datasets (Levels.fyi, Blind).
3. **Express High Enthusiasm Before Countering:** Make it clear that you genuinely desire the role if terms align.
4. **Negotiate Multiple Levers:** If base salary is fixed by internal banding, negotiate sign-on bonuses, RSUs, or accelerated performance reviews.
5. **Always Counter in Writing with Clear Justification:** Ground requests in specific skills, competitive offers, or specialized domain mastery.`
  },
  {
    id: "career_transition_to_tech",
    subject: "Career",
    tutor: "Career Navigator",
    tutorId: "career",
    topic: "Career Transition to Software & AI Engineering",
    source: "Technical Career Guide - Industry Transition §1.1",
    difficulty: "Intermediate",
    tags: ["career transition", "switch to tech", "ai engineering", "software engineering", "portfolio projects", "proof of work"],
    content: `Switching careers into software development or artificial intelligence requires prioritizing tangible **Proof of Work** over traditional credentials.

### The 4-Phase Transition Roadmap
1. **Foundation Mastery (Months 1-3):** Master one versatile programming language (Python or TypeScript) and fundamentals (Data Structures, Git, REST APIs).
2. **Production-Grade Capstone Projects (Months 4-5):**
   - Build 2 full-stack, deployed applications with authentication, databases, and CI/CD pipelines.
   - Avoid generic tutorial clones (e.g., simple to-do lists); build end-to-end domain solutions with real users or benchmarked performance.
3. **Open Source & Public Contributions (Month 6):** Submit bug fixes or documentation improvements to established GitHub repositories.
4. **Targeted Job Applications & Referrals:** Apply via warm professional introductions rather than unsolicited cold submissions.`
  },

  // ----------------------------------------------------
  // EXTENDED DATASET: RESEARCH ASSISTANT
  // ----------------------------------------------------
  {
    id: "research_finer_questions_hypotheses",
    subject: "Research",
    tutor: "Research Assistant",
    tutorId: "research",
    topic: "Formulating Research Questions & Hypotheses (FINER Criteria)",
    source: "Academic Deep-Dive - Research Design §1.2",
    difficulty: "Intermediate",
    tags: ["finer criteria", "research questions", "hypothesis", "null hypothesis", "alternative hypothesis", "empirical design"],
    content: `A scientific investigation succeeds or fails based on the precision of its central research question and testable hypotheses.

### The FINER Criteria for Valid Research Questions
- **F - Feasible:** Adequate sample size, technical expertise, financial resources, and time.
- **I - Interesting:** Excites the investigator and scholarly community.
- **N - Novel:** Confirms, refutes, or extends existing literature findings.
- **E - Ethical:** Complies with institutional review boards (IRB) and causes no harm.
- **R - Relevant:** Impacts scientific theory, clinical policy, or technology practice.

### Null ($H_0$) vs. Alternative ($H_1$) Hypotheses
- **Null Hypothesis ($H_0$):** Asserts there is no statistically significant effect, difference, or relationship between examined variables.
- **Alternative Hypothesis ($H_1$):** Formulates the directional or non-directional experimental prediction that an effect or relationship exists.`
  },
  {
    id: "research_paper_imrad_structure",
    subject: "Research",
    tutor: "Research Assistant",
    tutorId: "research",
    topic: "Academic Paper Architecture - The IMRaD Format",
    source: "Academic Deep-Dive - Scholarly Publication §3.1",
    difficulty: "Intermediate",
    tags: ["imrad format", "research paper", "introduction", "methods", "results", "discussion", "scholarly publishing"],
    content: `The **IMRaD Format** (Introduction, Methods, Results, and Discussion) is the globally standardized structural convention for peer-reviewed scientific publications.

### Structural Breakdown of IMRaD
1. **Introduction (Why did you conduct the study?):**
   - Broad background context $\\to$ Specific problem statement $\\to$ Identified research gap $\\to$ Precise study objective.
2. **Methods (How did you do it?):**
   - Experimental protocol, sampling size, data collection instruments, software versions, and statistical analysis procedures documented with complete replicability.
3. **Results (What did you find?):**
   - Objective presentation of findings using structured tables, figures, and statistical tests ($p$-values, effect sizes) without subjective interpretation.
4. **Discussion (What does it mean?):**
   - Interpret results in context of prior literature, address limitations, and outline future research directions.`
  },
  {
    id: "research_citation_styles_plagiarism",
    subject: "Research",
    tutor: "Research Assistant",
    tutorId: "research",
    topic: "Academic Citations (APA 7th, IEEE) & Academic Integrity",
    source: "Academic Deep-Dive - Citation Standards §2.1",
    difficulty: "Beginner",
    tags: ["citation styles", "apa 7th", "ieee", "plagiarism", "academic integrity", "doi", "bibliography"],
    content: `Attribution acknowledges intellectual lineage, allows verification of claims, and upholds academic integrity.

### Major Scholarly Citation Styles
- **APA 7th Edition (Author-Date):** Widely used in social sciences, psychology, and education.
  - *In-text:* (Vaswani et al., 2017) or Vaswani et al. (2017).
  - *Reference List:* Vaswani, A., et al. (2017). Attention is all you need. *Advances in Neural Information Processing Systems*, 30, 5998–6008.
- **IEEE (Numerical):** Standard in computer science, robotics, and electrical engineering.
  - *In-text:* Numerical bracket citation: [1], [2] ordered sequentially by appearance in the paper.

### Forms of Plagiarism to Guard Against
- **Direct Plagiarism:** Verbatim copying without quotation marks and attribution.
- **Mosaic (Patchwriting):** Interweaving borrowed sentences with minor synonyms without restructuring the conceptual argument.
- **Self-Plagiarism:** Resubmitting previously published work without disclosure.`
  },
  {
    id: "research_statistical_significance",
    subject: "Research",
    tutor: "Research Assistant",
    tutorId: "research",
    topic: "Statistical Significance, P-Values & Effect Sizes",
    subTopic: "Quantitative Statistical Inference & Hypothesis Testing",
    source: "Academic Deep-Dive - Quantitative Analysis §3.2",
    difficulty: "Advanced",
    tags: ["statistical significance", "p-value", "effect size", "confidence interval", "type 1 error", "type 2 error", "cohen d"],
    content: `Empirical findings must be evaluated beyond sample variance through inferential statistics and hypothesis testing.

### Understanding the P-Value
- The **p-value** is the probability of observing results at least as extreme as the actual experimental data, assuming the null hypothesis ($H_0$) is strictly true.
- A conventional threshold of $\\alpha = 0.05$ denotes that if $p < 0.05$, the result is declared **statistically significant**, rejecting $H_0$.

### Why Effect Size Matters (Beyond P-Values)
- A very large sample size ($N > 100,000$) can produce a statistically significant $p < 0.001$ even for biologically or practically trivial differences.
- **Effect Size (e.g., Cohen's $d$, Pearson's $r$, $\\eta^2$):** Quantifies the real-world magnitude of the experimental effect independent of sample size:
  - Small ($d = 0.2$), Medium ($d = 0.5$), Large ($d = 0.8$).
- Always report 95% **Confidence Intervals (CI)** alongside p-values and effect sizes.`
  },

  // =========================================================================
  // SPECIALIZED SUB-KNOWLEDGE DATASET ENRICHMENT (ALL 6 TUTORS)
  // =========================================================================

  // 1. MATHEMATICS MENTOR: Permutations vs Combinations
  {
    id: "math_permutations_vs_combinations",
    subject: "Mathematics",
    tutor: "Mathematics Mentor",
    tutorId: "math",
    topic: "Permutations vs Combinations",
    subTopic: "Combinatorics & Counting Principles",
    source: "Discrete Mathematics - Combinatorics §2.1",
    difficulty: "Intermediate",
    tags: ["permutations", "combinations", "permutation", "combination", "combinatorics", "npr", "ncr", "factorial", "order matters", "selection"],
    content: `In combinatorics, **Permutations** and **Combinations** are fundamental counting techniques used to determine the number of possible outcomes when selecting $r$ items from a set of $n$ distinct objects. The primary distinction is whether the **order of selection matters**.

### 1. The Core Distinction
- **Permutation ($nPr$):** An ordered arrangement of objects. The sequence or order of arrangement **strictly matters**. Changing the order produces a distinct, unique outcome.
- **Combination ($nCr$):** An unordered selection or grouping of objects. The order of arrangement **does NOT matter**. Changing the order of the chosen items represents the identical group.

### 2. Mathematical Formulas
- **Permutations of $n$ items taken $r$ at a time:**
  $$P(n, r) = \\frac{n!}{(n - r)!}$$
- **Combinations of $n$ items taken $r$ at a time:**
  $$C(n, r) = \\binom{n}{r} = \\frac{n!}{r!(n - r)!}$$
- **Fundamental Relationship:**
  $$P(n, r) = r! \\times C(n, r) \\iff C(n, r) = \\frac{P(n, r)}{r!}$$
  Because each group of $r$ objects can be internally arranged in $r!$ ways, combinations divide out this redundancy.

### 3. Systematic Decision Rule
Ask: *"Does rearranging the selected items result in a new outcome?"*
- **YES $\\implies$ Permutation** (e.g., race podium finishes 1st/2nd/3rd, alphanumeric passwords, assigning distinct leadership roles like President/Secretary).
- **NO $\\implies$ Combination** (e.g., selecting a committee of 3 people, dealing a 5-card poker hand, choosing 4 toppings for a pizza).

### 4. Concrete Example: Choosing 3 People from a Group of 5 ($A, B, C, D, E$)
1. **Scenario A (Permutation - Order Matters):** Assigning President, Vice President, and Treasurer:
   $$P(5, 3) = \\frac{5!}{(5 - 3)!} = \\frac{5 \\times 4 \\times 3 \\times 2 \\times 1}{2 \\times 1} = 60 \\text{ arrangements}$$
2. **Scenario B (Combination - Order Does Not Matter):** Choosing a 3-person delegation committee:
   $$C(5, 3) = \\frac{5!}{3!(5 - 3)!} = \\frac{60}{3!} = \\frac{60}{6} = 10 \\text{ distinct committees}$$

**Summary Rule:** Permutation = Arrangement (Order Matters); Combination = Selection (Order Doesn't Matter).`
  },

  // 2. SCIENCE EXPLORER: Rayleigh Scattering & Blue Sky
  {
    id: "science_rayleigh_scattering_blue_sky",
    subject: "Science",
    tutor: "Science Explorer",
    tutorId: "science",
    topic: "Rayleigh Scattering & Why the Sky Appears Blue",
    subTopic: "Atmospheric Optics & Wave Dispersion",
    source: "Atmospheric Physics & Electrodynamics §4.2",
    difficulty: "Intermediate",
    tags: ["sky blue", "why sky is blue", "rayleigh scattering", "light scattering", "wavelength", "atmosphere", "optics", "sunset", "dispersion", "photons"],
    content: `The daytime sky appears blue due to an optical phenomenon known as **Rayleigh Scattering**—the elastic scattering of electromagnetic radiation by particles or gas molecules whose dimensions are significantly smaller than the wavelength of visible light.

### 1. The Governing Scientific Law: Rayleigh's Law
Rayleigh's scattering law establishes that the intensity of scattered light ($I$) is inversely proportional to the **fourth power** of its wavelength ($\\lambda$):
$$I \\propto \\frac{1}{\\lambda^4}$$
This mathematical dependence means that shorter wavelengths scatter exponentially more vigorously than longer wavelengths.

### 2. Interaction with Earth's Atmosphere
1. **Solar Spectrum:** Sunlight entering Earth's upper atmosphere is white light comprising all colors of the visible spectrum, ranging from red ($\\approx 700\\text{ nm}$) to blue/violet ($\\approx 400\\text{ nm}$).
2. **Atmospheric Molecules:** Earth's atmosphere is dominated by nitrogen ($N_2 \\approx 78\\%$) and oxygen ($O_2 \\approx 21\\%$), whose molecular diameters ($\\approx 0.3\\text{ nm}$) are thousands of times smaller than light wavelengths.
3. **Scattering Ratio Calculation:** Comparing blue light ($\\lambda \\approx 450\\text{ nm}$) and red light ($\\lambda \\approx 700\\text{ nm}$):
   $$\\frac{I_{\\text{blue}}}{I_{\\text{red}}} = \\left(\\frac{700}{450}\\right)^4 \\approx (1.555)^4 \\approx 5.85\\times$$
   Blue light is scattered nearly 6 to 10 times more effectively in every direction than red light!

### 3. Human Visual Perception (Why Not Violet?)
Although violet light has an even shorter wavelength ($\\approx 380\\text{ nm}$) and scatters even more than blue, the human retina contains three types of cone photoreceptors (S, M, and L). Our eyes are significantly more sensitive to blue and green wavelengths than violet, and sunlight itself contains a higher solar irradiance of blue than violet, causing the human visual cortex to perceive the sky as vibrant blue.

### 4. Observable Demonstration: Sunsets vs Daytime Sky
- **Daytime:** The sun is high overhead; sunlight takes the shortest optical path through the atmosphere, scattering blue light in all directions into our eyes.
- **Sunrise/Sunset:** Sunlight travels at a steep angle through a path length 10 to 30 times thicker. By the time the beam reaches our eyes, the vast majority of blue and green light has been scattered out of the line of sight, allowing only the unscattered, longer red, orange, and gold wavelengths to reach us.`
  },

  // 3. CODING COACH: Python Infinite Loops
  {
    id: "code_python_infinite_loops",
    subject: "Coding",
    tutor: "Coding Coach",
    tutorId: "code",
    topic: "Python Infinite Loops & Loop Termination Conditions",
    subTopic: "Control Flow, While Loops & Loop Invariants",
    source: "Python Architecture & Runtime Execution §1.4",
    difficulty: "Beginner",
    tags: ["infinite loop", "python loop", "while loop", "termination condition", "loop invariant", "counter", "break statement", "debugging"],
    content: `An **infinite loop** in Python occurs when a repetitive control-flow construct (primarily a \`while\` loop) continually evaluates its conditional expression to \`True\`, never transitioning to \`False\` and failing to reach an exit state.

### 1. Primary Causes of Infinite Loops in Python
1. **Missing State Mutation:** Forgetting to increment, decrement, or update the loop counter variable inside the loop body.
2. **Improper Comparison Operator:** Using exact inequality (\`!= 10\`) instead of inequality bounds (\`<= 10\`), causing a counter stepping by 2 or more to overshoot the sentinel value.
3. **Re-initializing Counter Inside the Loop:** Accidentally resetting the loop variable within the body on every iteration.
4. **Unreachable Break Conditions:** Placing \`break\` inside an \`if\` condition that can never mathematically be satisfied.

### 2. Concrete Debugging Walkthrough

#### Buggy Snippet (Infinite Loop):
\`\`\`python
# BUGGY CODE:
count = 1
while count <= 5:
    print(f"Number: {count}")
    # BUG: count is never incremented! count <= 5 is perpetually True!
\`\`\`

#### Root Cause Analysis:
In the buggy snippet, \`count\` remains \`1\` indefinitely. The loop condition \`1 <= 5\` is constantly evaluated, consuming CPU cycles without terminating.

#### Corrected Production Code:
\`\`\`python
# CORRECTED IMPLEMENTATION:
count = 1
while count <= 5:
    print(f"Number: {count}")
    count += 1  # Crucial: Advances state toward the termination condition

print("Loop successfully completed!")
\`\`\`

### 3. Expected Output:
\`\`\`text
Number: 1
Number: 2
Number: 3
Number: 4
Number: 5
Loop successfully completed!
\`\`\`

### 4. Defensive Best Practices
- **Prefer \`for ... in range(...)\` when the iteration count is known:** In Python, \`for i in range(1, 6)\` automatically manages state mutation and prevents infinite loops.
- **Safety Sentinel (Max Iterations Guard):**
  \`\`\`python
  max_iterations = 1000
  iterations = 0
  while condition:
      iterations += 1
      if iterations > max_iterations:
          raise TimeoutError("Guard triggered: Potential infinite loop detected")
      # loop logic
  \`\`\``
  },

  // 4. LITERATURE & LANGUAGE GUIDE: Metaphor vs Simile
  {
    id: "lit_metaphor_vs_simile",
    subject: "Literature",
    tutor: "Literature & Language Guide",
    tutorId: "lit",
    topic: "Metaphor vs Simile & Figurative Language",
    subTopic: "Rhetorical Devices & Figurative Comparison",
    source: "Rhetorical Analysis & Stylistics §2.3",
    difficulty: "Beginner",
    tags: ["metaphor", "simile", "difference between metaphor and simile", "figurative language", "rhetorical devices", "comparison", "tenor and vehicle"],
    content: `Both **metaphors** and **similes** are figures of speech used in literature, poetry, and persuasive rhetoric to illuminate a hidden relationship between two fundamentally dissimilar entities. The vital distinction lies in the **grammatical syntax and degree of imaginative identity** asserted between the subjects.

### 1. The Defining Grammatical Distinction
- **Simile:** An **explicit** figurative comparison between two distinct things using connecting words such as **"like"**, **"as"**, or **"than"**.
  - *Structure:* A is *like* B (or A is *as [adjective] as* B).
  - *Example:* *"The classroom was like a beehive."*
- **Metaphor:** An **implicit, direct** figurative equation stating that one thing *is* another without using comparative connective prepositions.
  - *Structure:* A *is* B.
  - *Example:* *"The classroom was a beehive."*

### 2. Analytical Mechanics: Tenor and Vehicle (I.A. Richards)
In rhetorical analysis, both devices consist of two structural elements:
- **The Tenor:** The actual subject, person, or concept being described (e.g., *the classroom*).
- **The Vehicle:** The figurative image invoked to describe the tenor (e.g., *the beehive*).
- While a **simile** preserves the conceptual distance between tenor and vehicle, a **metaphor** fuses them together, creating greater cognitive and emotional resonance.

### 3. Side-by-Side Literary Comparison
| Feature | Simile | Metaphor |
| :--- | :--- | :--- |
| **Connecting Words** | Uses *"like"*, *"as"*, *"than"* | Omits comparative prepositions |
| **Asserted Relationship** | Analogy / Resemblance | Symbolic Identity |
| **Cognitive Distance** | Keeps the two concepts distinct | Merges the two concepts into one |
| **Example 1** | *"Her voice was smooth like velvet."* | *"Her voice was pure velvet."* |
| **Example 2 (Shakespeare)**| *"My love is as a fever, longing still."* | *"All the world's a stage."* |

### 4. Stylistic Impact & When to Use Which
- Use a **simile** when you want a clear, gentle, or unexpected comparison that allows the reader to evaluate the resemblance side-by-side without confusing physical reality.
- Use a **metaphor** when you want heightened dramatic intensity, poetic compression, and transformative imagery that forces the reader to adopt an entirely new interpretive lens.`
  },

  // 5. CAREER NAVIGATOR: Data Analyst Career Blueprint
  {
    id: "career_data_analyst_roadmap",
    subject: "Career",
    tutor: "Career Navigator",
    tutorId: "career",
    topic: "Data Analyst Career Blueprint: Skills, Tools & Roadmap",
    subTopic: "Data Analytics & Tech Career Pathways",
    source: "Professional Pathways - Analytics & Data Roles §1.1",
    difficulty: "Intermediate",
    tags: ["data analyst role", "data analyst skills", "sql", "python", "tableau", "powerbi", "career roadmap", "portfolio projects", "business intelligence"],
    content: `A **Data Analyst** empowers organizations to make evidence-based decisions by translating complex raw data into actionable business intelligence, KPI dashboards, and statistical models.

### 1. The 4 Essential Technical Pillars for a Data Analyst
1. **Advanced SQL (Must-Have Foundation - 40% of Daily Work):**
   - Multi-table joins (INNER, LEFT, FULL OUTER).
   - Window Functions: \`ROW_NUMBER()\`, \`RANK()\`, \`DENSE_RANK()\`, \`LEAD()\`, \`LAG()\`, \`NTILE()\`.
   - Common Table Expressions (CTEs), Subqueries, Aggregate Groupings (\`GROUP BY\`, \`HAVING\`), and indexing optimization.
2. **Data Wrangling & Programming (Python or R - 25%):**
   - Python libraries: \`pandas\` for data manipulation, \`numpy\` for numerical arrays, \`matplotlib\` and \`seaborn\` for exploratory data analysis (EDA).
   - Cleaning missing values, standardizing dates, regex parsing, and handling categorical data.
3. **Business Intelligence & Visualization Tools (25%):**
   - In-depth mastery of either **Tableau** or **Microsoft Power BI** (including DAX measures and data modeling).
   - Designing intuitive executive-level dashboards that communicate metrics at a glance without clutter.
4. **Applied Statistics & Business Acumen (10%):**
   - Hypothesis testing, A/B testing design, statistical significance ($p$-values, confidence intervals), cohort analysis, and customer churn modeling.

### 2. Actionable 4-Phase Transition Roadmap
- **Phase 1 (Weeks 1-4) - SQL Fluency:** Solve 50+ medium-to-hard business case problems on LeetCode/StrataScratch. Master aggregation and window functions.
- **Phase 2 (Weeks 5-8) - Python for Data Analysis:** Complete 3 end-to-end data cleaning and exploratory analysis scripts using real-world public datasets (e.g., Kaggle, data.gov).
- **Phase 3 (Weeks 9-12) - Portfolio Capstone Projects:**
  - *Project 1:* Executive E-Commerce Sales & Profitability Dashboard (Power BI / Tableau Public).
  - *Project 2:* Customer Churn & Retention Machine Learning/Exploratory Analysis (Python + GitHub Repo).
- **Phase 4 (Weeks 13-16) - Resume Engineering & Interview Prep:**
  - Use the Google XYZ formula for resume bullet points (*"Engineered SQL pipeline analyzing 2.4M user transactions, identifying $140K in annual drop-off losses"*).
  - Practice articulating technical trade-offs using the STAR method for behavioral screens.

### 3. Immediate High-Yield Next Actions
1. Publish your best SQL and Python projects on GitHub with structured README documentation.
2. Host an interactive dashboard on Tableau Public or Power BI Service to demonstrate visual communication.`
  },

  // 6. RESEARCH ASSISTANT: Qualitative vs Quantitative Methodologies
  {
    id: "research_qualitative_vs_quantitative",
    subject: "Research",
    tutor: "Research Assistant",
    tutorId: "research",
    topic: "Qualitative vs Quantitative Research Methodologies",
    subTopic: "Research Design, Paradigms & Sampling Methods",
    source: "Academic Deep-Dive - Methodological Foundations §1.1",
    difficulty: "Intermediate",
    tags: ["qualitative vs quantitative research", "qualitative research", "quantitative research", "research methodology", "epistemology", "sampling", "data collection", "mixed methods"],
    content: `In scholarly research design, empirical inquiry is broadly divided into two foundational methodological paradigms: **Quantitative Research** and **Qualitative Research**. Understanding their ontological, epistemological, and methodological differences is essential for choosing a defensible study design.

### 1. Epistemological & Philosophical Foundations
- **Quantitative Research (Positivist / Post-Positivist Paradigm):**
  - Assumes an objective, external reality governed by deterministic natural or social laws that can be measured independently of the observer.
  - Emphasizes measurement, objectivity, generalizability, and testing pre-formulated hypotheses.
- **Qualitative Research (Constructivist / Interpretivist Paradigm):**
  - Assumes reality is socially constructed, multiple, and context-dependent.
  - Emphasizes subjective meaning, lived experiences, contextual depth, and generating new grounded theories.

### 2. Comprehensive Comparative Matrix
| Dimension | Quantitative Research | Qualitative Research |
| :--- | :--- | :--- |
| **Primary Objective** | Test hypotheses, quantify relationships, establish causal patterns | Explore underlying reasons, discover themes, generate hypotheses |
| **Logic & Reasoning** | **Deductive** ($Theory \\to Hypothesis \\to Observation \\to Confirmation$) | **Inductive** ($Observations \\to Patterns \\to Tentative Hypothesis \\to Theory$) |
| **Data Format** | Numerical, structured, categorical | Textual, narrative, visual, observational transcripts |
| **Collection Instruments**| Closed-ended surveys, experiments, sensor metrics, standardized tests | Semi-structured interviews, focus groups, participant observation, field notes |
| **Sampling Strategy** | Large, representative probability sampling (Random, Stratified, Power Analysis) | Small, purposive, snowball, or theoretical sampling until **thematic saturation** |
| **Data Analysis** | Descriptive & inferential statistics (t-tests, ANOVA, regression, p-values) | Thematic analysis, content analysis, grounded theory coding (open, axial, selective) |
| **Validity & Quality Criteria** | Internal validity, external validity (generalizability), reliability | Credibility, transferability, dependability, confirmability (Lincoln & Guba) |

### 3. Concrete Example Across Both Paradigms
- *Research Area:* Remote Work Productivity
  - **Quantitative Study:** *"A Multiple Regression Analysis of Remote Work Hours vs. Measured Code Commit Frequency across $N = 1,200$ Software Engineers."*
  - **Qualitative Study:** *"A Phenomenological Investigation into the Lived Experiences of Isolation and Work-Life Boundary Dissolution among $N = 18$ Remote Workers."*

### 4. Mixed-Methods Triangulation
Scholars frequently employ **Mixed-Methods Research** (e.g., Convergent Parallel or Explanatory Sequential designs), where quantitative statistics identify macro patterns and qualitative interviews explore the nuanced causal mechanisms behind those statistics.`
  },

  // =========================================================================
  // EXPANDED KNOWLEDGE MODULES: ADVANCED CS, MATH, SCIENCE, LIT, RESEARCH & CAREER
  // =========================================================================

  // --- CODING / COMPUTER SCIENCE ---
  {
    id: "code_dynamic_programming_knapsack",
    subject: "Coding",
    tutor: "Code Mentor",
    tutorId: "code",
    topic: "Dynamic Programming & 0/1 Knapsack Problem",
    subTopic: "Algorithms & Optimization Paradigms",
    source: "Algorithms & Computational Complexity §4.2",
    difficulty: "Advanced",
    tags: ["dynamic programming", "dp", "knapsack", "memoization", "tabulation", "optimal substructure", "overlapping subproblems"],
    content: `**Dynamic Programming (DP)** is an algorithmic paradigm that solves complex optimization problems by breaking them down into simpler overlapping subproblems, solving each subproblem exactly once, and storing the results in memory (memoization or tabulation).

### 1. The Two Core Prerequisites for DP
1. **Optimal Substructure:** An optimal solution to the overall problem incorporates optimal solutions to its subproblems.
2. **Overlapping Subproblems:** The recursive problem space revisits the same subproblems repeatedly rather than generating unique subproblems (which would require Divide & Conquer).

### 2. The 0/1 Knapsack Formulation
Given $n$ items, each with weight $w_i$ and value $v_i$, and a knapsack of maximum capacity $W$, determine the maximum value subset of items such that total weight does not exceed $W$.

**Recurrence Relation:**
Let $DP[i][w]$ be the maximum value achievable using a subset of the first $i$ items with remaining weight capacity $w$:
$$DP[i][w] = \\begin{cases} 
0 & \\text{if } i = 0 \\text{ or } w = 0 \\\\
DP[i-1][w] & \\text{if } w_i > w \\\\
\\max(DP[i-1][w], \\, v_i + DP[i-1][w - w_i]) & \\text{if } w_i \\le w
\\end{cases}$$

### 3. Python Space-Optimized Implementation ($O(W)$ Space)
\`\`\`python
def knapsack_01(weights: list[int], values: list[int], capacity: int) -> int:
    dp = [0] * (capacity + 1)
    for w_i, v_i in zip(weights, values):
        # Iterate backwards to avoid reusing the same item within the same step
        for w in range(capacity, w_i - 1, -1):
            dp[w] = max(dp[w], dp[w - w_i] + v_i)
    return dp[capacity]

# Example execution:
# weights = [2, 3, 4, 5], values = [3, 4, 5, 8], capacity = 5 -> Max Value: 8
\`\`\`
- **Time Complexity:** $O(n \\cdot W)$ (pseudo-polynomial)
- **Space Complexity:** $O(W)$`
  },
  {
    id: "code_os_concurrency_deadlocks",
    subject: "Coding",
    tutor: "Code Mentor",
    tutorId: "code",
    topic: "Concurrency, Mutexes, Semaphores & Deadlock Prevention",
    subTopic: "Operating Systems & Systems Programming",
    source: "Modern Operating Systems §3.4",
    difficulty: "Advanced",
    tags: ["concurrency", "operating systems", "mutex", "semaphore", "deadlock", "coffman conditions", "race conditions", "critical section"],
    content: `In multi-threaded concurrent computing, multiple threads or processes execute simultaneously, sharing common memory and system resources. Without synchronization, non-deterministic interleavings cause **race conditions**.

### 1. Synchronization Primitives
- **Mutex (Mutual Exclusion Lock):** A binary locking mechanism owned by a single thread at a time. Only the thread that acquired the lock may release it.
- **Counting Semaphore:** An integer counter initialized to $N$ permitting up to $N$ concurrent threads into a shared resource pool.
  - \`wait()\` (or \`P()\`) decrements the counter; blocks if counter $\\le 0$.
  - \`signal()\` (or \`V()\`) increments the counter, waking a queued thread.

### 2. The 4 Coffman Conditions for Deadlock
A **Deadlock** occurs when a set of concurrent processes are permanently blocked because each is holding a resource and waiting for another held by another process in the set. Deadlock can arise if and only if **all four** conditions hold simultaneously:
1. **Mutual Exclusion:** At least one resource is held in a non-shareable mode.
2. **Hold and Wait:** A process is holding at least one resource and requesting additional resources currently held by others.
3. **No Preemption:** Resources cannot be forcibly confiscated; they are released only voluntarily by the holding process.
4. **Circular Wait:** There exists a closed loop $P_0 \\to P_1 \\to P_2 \\dots \\to P_0$ where each process waits for a resource held by the next.

### 3. Deadlock Handling Strategies
- **Prevention:** Invalidate at least one Coffman condition (e.g., impose a strict global resource ordering to break Circular Wait).
- **Avoidance (Dijkstra's Banker's Algorithm):** Evaluate state safety dynamically before granting allocations.
- **Detection & Recovery:** Periodically construct a Resource Allocation Graph (Wait-For Graph) and terminate or roll back offending threads upon cycle detection.`
  },
  {
    id: "code_system_design_cap_theorem",
    subject: "Coding",
    tutor: "Code Mentor",
    tutorId: "code",
    topic: "Distributed Systems & The CAP Theorem",
    subTopic: "Software Architecture & Scalability",
    source: "Designing Data-Intensive Applications §9.1",
    difficulty: "Advanced",
    tags: ["system design", "cap theorem", "distributed systems", "consistency", "availability", "partition tolerance", "pacelc", "nosql"],
    content: `Formulated by Eric Brewer and formally proven by Gilbert & Lynch, the **CAP Theorem** states that any distributed data store can simultaneously provide at most **two out of three** fundamental guarantees:

### 1. The Three CAP Pillars
1. **Consistency (Linearizability):** Every read receives the most recent write or an error. All nodes see identical state at the same instant.
2. **Availability:** Every non-failing node returns a non-error response for every request (without guarantee that it contains the absolute latest write).
3. **Partition Tolerance:** The system continues to operate despite an arbitrary number of messages being dropped, delayed, or partitioned by network failures.

### 2. The Reality of Network Partitions (P is Non-Negotiable)
In real-world networks (LAN, WAN, Cloud VPCs), physical network partitions and packet drops are inevitable. Therefore, distributed architectures cannot choose "CA" across networks; **they must choose between CP and AP during a network partition:**
- **CP (Consistency + Partition Tolerance):** When a network partition occurs, writes or reads to partitioned nodes are blocked or rejected until consistency can be guaranteed (e.g., Google Spanner, Apache HBase, ZooKeeper, Raft/Paxos clusters).
- **AP (Availability + Partition Tolerance):** Nodes in all partitions accept reads and writes, returning stale data if necessary and reconciling differences asynchronously via **Eventual Consistency** (e.g., Amazon DynamoDB, Apache Cassandra, CouchDB).

### 3. The PACELC Extension
Daniel Abadi extended CAP: **If there is a Partition (P), trade off Availability (A) and Consistency (C); Else (E), trade off Latency (L) and Consistency (C).**`
  },
  {
    id: "code_ai_transformers_attention",
    subject: "Coding",
    tutor: "Code Mentor",
    tutorId: "code",
    topic: "Transformer Architecture & Multi-Head Self-Attention",
    subTopic: "Deep Learning & NLP Foundations",
    source: "Attention Is All You Need (Vaswani et al.) §3.1",
    difficulty: "Advanced",
    tags: ["transformers", "attention", "nlp", "deep learning", "machine learning", "self-attention", "query key value", "llm architecture"],
    content: `Introduced by Vaswani et al. in 2017, the **Transformer** replaced recurrent (RNN/LSTM) architectures by relying entirely on the **Self-Attention Mechanism**, enabling unprecedented parallelization across long sequential contexts.

### 1. Scaled Dot-Product Attention
Given input sequence representations packed into Query ($Q$), Key ($K$), and Value ($V$) matrices:
$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{Q K^T}{\\sqrt{d_k}}\\right) V$$
- $Q K^T$ computes pairwise token compatibility scores (similarity matrix).
- Scaling by $\\frac{1}{\\sqrt{d_k}}$ prevents vanishing gradients in the softmax function when dimensions are large.
- $\\text{softmax}(\\cdot)$ converts raw dot products into normalized probability attention weights summing to 1.
- Multiplying by $V$ computes a weighted context aggregation for each token.

### 2. Multi-Head Attention (MHA)
Rather than performing a single attention function, Multi-Head Attention projects $Q, K, V$ into $h$ distinct subspace representations:
$$\\text{MultiHead}(Q, K, V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h) W^O$$
$$\\text{where } \\text{head}_i = \\text{Attention}(Q W_i^Q, K W_i^K, V W_i^V)$$
This allows the model to simultaneously attend to syntactic agreements, semantic roles, and distant dependencies across disparate subspace projections.

### 3. Positional Encoding
Because self-attention is permutation invariant, sinusoidal or rotary positional encodings (RoPE) are added to input embeddings to convey token sequence order:
$$PE_{(pos, 2i)} = \\sin(pos / 10000^{2i/d_{model}})$$
$$PE_{(pos, 2i+1)} = \\cos(pos / 10000^{2i/d_{model}})$$`
  },

  // --- MATHEMATICS MENTOR ---
  {
    id: "math_linear_algebra_svd_pca",
    subject: "Mathematics",
    tutor: "Mathematics Mentor",
    tutorId: "math",
    topic: "Singular Value Decomposition (SVD) & Principal Component Analysis (PCA)",
    subTopic: "Linear Algebra & Dimensionality Reduction",
    source: "Introduction to Linear Algebra (Strang) §7.1",
    difficulty: "Advanced",
    tags: ["linear algebra", "svd", "pca", "eigenvalues", "covariance", "dimensionality reduction", "singular value decomposition"],
    content: `**Singular Value Decomposition (SVD)** is the definitive factorization of modern linear algebra, generalizing spectral decomposition to arbitrary rectangular matrices $A \\in \\mathbb{R}^{m \\times n}$.

### 1. Formal SVD Factorization
$$A = U \\Sigma V^T$$
- $U \\in \\mathbb{R}^{m \\times m}$: Orthogonal matrix whose columns are the **left-singular vectors** (eigenvectors of $A A^T$).
- $\\Sigma \\in \\mathbb{R}^{m \\times n}$: Diagonal matrix with non-negative real singular values $\\sigma_1 \\ge \\sigma_2 \\ge \\dots \\ge \\sigma_r > 0$ arranged in descending order.
- $V \\in \\mathbb{R}^{n \\times n}$: Orthogonal matrix whose columns are the **right-singular vectors** (eigenvectors of $A^T A$).

### 2. Principal Component Analysis (PCA) Connection
PCA projects zero-centered high-dimensional data $X \\in \\mathbb{R}^{n \\times p}$ onto orthogonal directions of maximal variance:
1. **Sample Covariance Matrix:** $C = \\frac{1}{n-1} X^T X$.
2. Decomposing $X$ via SVD yields $X = U \\Sigma V^T$.
3. Then $C = \\frac{1}{n-1} (V \\Sigma U^T)(U \\Sigma V^T) = V \\left(\\frac{\\Sigma^2}{n-1}\\right) V^T$.
4. Hence, the right-singular vectors $V$ are precisely the **principal component axes**, and the singular values $\\sigma_i^2 / (n-1)$ correspond to the variances explained by each component.

### 3. Eckart-Young-Mirsky Theorem
Truncating SVD to the top $k < r$ singular values yields the optimal rank-$k$ approximation matrix $A_k = \\sum_{i=1}^k \\sigma_i u_i v_i^T$ that minimizes Frobenius and spectral norm reconstruction error.`
  },
  {
    id: "math_discrete_graph_theory",
    subject: "Mathematics",
    tutor: "Mathematics Mentor",
    tutorId: "math",
    topic: "Discrete Mathematics: Graph Theory & Combinatorics",
    subTopic: "Foundations of Computer Science",
    source: "Discrete Mathematics and Its Applications (Rosen) §10.1",
    difficulty: "Intermediate",
    tags: ["graph theory", "discrete math", "eulerian path", "hamiltonian cycle", "adjacency matrix", "chromatic number", "trees"],
    content: `A **Graph** $G = (V, E)$ is a discrete structure consisting of a set of vertices (nodes) $V$ and a set of edges $E \\subseteq V \\times V$ connecting vertex pairs.

### 1. Fundamental Theorems
- **Handshaking Lemma:** In any undirected graph:
  $$\\sum_{v \\in V} \\deg(v) = 2 |E|$$
  *Corollary:* Every undirected graph has an even number of vertices of odd degree.
- **Eulerian Path & Circuit Criteria:**
  - An **Eulerian Circuit** (visits every edge exactly once and returns to start) exists if and only if every vertex has an **even degree** and all vertices with non-zero degree belong to a single connected component.
  - An **Eulerian Path** exists if and only if exactly **zero or two** vertices have odd degrees.
- **Hamiltonian Cycle:** A cycle that visits every *vertex* exactly once (NP-complete decision problem). Dirac's Theorem guarantees a Hamiltonian cycle if every vertex satisfies $\\deg(v) \\ge n / 2$ for $n \\ge 3$.

### 2. Matrix Representations
- **Adjacency Matrix $A$:** $A_{ij} = 1$ if $(v_i, v_j) \\in E$, else $0$.
  - *Key Property:* The entry $(A^k)_{ij}$ equals the exact number of distinct paths of length $k$ between $v_i$ and $v_j$.
- **Degree Matrix $D$:** Diagonal matrix where $D_{ii} = \\deg(v_i)$.
- **Graph Laplacian $L = D - A$:** Fundamental in spectral graph theory; the multiplicity of $0$ as an eigenvalue of $L$ equals the number of connected components in $G$.`
  },
  {
    id: "math_gradient_descent_optimization",
    subject: "Mathematics",
    tutor: "Mathematics Mentor",
    tutorId: "math",
    topic: "Mathematical Optimization & Gradient Descent Dynamics",
    subTopic: "Continuous Optimization & Machine Learning Calculus",
    source: "Numerical Optimization (Nocedal & Wright) §3.2",
    difficulty: "Advanced",
    tags: ["optimization", "gradient descent", "convexity", "hessian", "learning rate", "momentum", "stochastic gradient descent"],
    content: `Numerical optimization seeks a parameter vector $\\theta^* \\in \\mathbb{R}^d$ minimizing an objective loss function $f(\\theta): \\mathbb{R}^d \\to \\mathbb{R}$.

### 1. First-Order Gradient Descent
The gradient $\\nabla f(\\theta)$ points in the direction of steepest rate of increase. Gradient descent updates parameters along the negative gradient:
$$\\theta_{t+1} = \\theta_t - \\eta \\nabla f(\\theta_t)$$
where $\\eta > 0$ is the learning rate step size.

### 2. Convergence Rates & Convexity
- If $f(\\theta)$ is $L$-smooth (Lipschitz gradient) and convex: convergence rate is $O(1/t)$ for $\\eta \\le 1/L$.
- If $f(\\theta)$ is additionally $\\mu$-strongly convex: convergence rate is linear (geometric):
  $$\\|\\theta_t - \\theta^*\\| \\le \\left(1 - \\frac{\\mu}{L}\\right)^t \\|\\theta_0 - \\theta^*\\|$$
  where $\\kappa = L / \\mu$ is the **condition number**. High condition numbers create elongated ravines causing standard gradient descent to oscillate wildly.

### 3. Momentum Acceleration & Second-Order Intuition
- **Polyak Momentum:** Introduces velocity $v_t = \\beta v_{t-1} + \\eta \\nabla f(\\theta_t)$, accelerating along consistent directional gradients while damping high-frequency oscillations.
- **Newton-Raphson (Second-Order):** Employs the curvature Hessian matrix $H = \\nabla^2 f(\\theta)$:
  $$\\theta_{t+1} = \\theta_t - H^{-1} \\nabla f(\\theta_t)$$
  Achieves quadratic convergence near local optima without requiring learning rate tuning, but requires $O(d^3)$ computation per iteration.`
  },

  // --- SCIENCE MENTOR ---
  {
    id: "science_quantum_mechanics_wave_particle",
    subject: "Science",
    tutor: "Science Mentor",
    tutorId: "science",
    topic: "Quantum Mechanics: Wave-Particle Duality & Uncertainty",
    subTopic: "Modern Physics & Quantum Theory",
    source: "Principles of Quantum Mechanics (Shankar) §2.1",
    difficulty: "Advanced",
    tags: ["quantum mechanics", "wave particle duality", "heisenberg uncertainty", "schrodinger equation", "superposition", "planck constant"],
    content: `At microscopic atomic scales, matter and radiation exhibit simultaneous wave-like and particle-like properties, defying classical Newtonian intuition.

### 1. Wave-Particle Duality
- **Planck-Einstein Relation:** Energy of a photon is proportional to its frequency $\\nu$:
  $$E = h \\nu = \\hbar \\omega$$
- **De Broglie Wavelength:** Louis de Broglie hypothesized that any moving particle with momentum $p = mv$ has an associated matter wave:
  $$\\lambda = \\frac{h}{p} = \\frac{h}{mv}$$
  Confirmatory Davisson-Germer electron diffraction experiments demonstrated that electrons generate interference fringes identical to X-ray diffraction patterns.

### 2. The Heisenberg Uncertainty Principle
Werner Heisenberg demonstrated that canonical conjugate observables (such as position $x$ and momentum $p_x$) cannot be measured simultaneously with arbitrary precision:
$$\\Delta x \\cdot \\Delta p_x \\ge \\frac{\\hbar}{2}$$
where $\\hbar = \\frac{h}{2\\pi} \\approx 1.054 \\times 10^{-34} \\text{ J}\\cdot\\text{s}$. This is not an observational artifact of imperfect instruments, but an intrinsic mathematical property of Fourier transform wavepackets.

### 3. The Time-Dependent Schrödinger Equation
The quantum state of a particle is governed by its complex wavefunction $\\Psi(x, t)$:
$$i \\hbar \\frac{\\partial \\Psi}{\\partial t} = \\hat{H} \\Psi = \\left(-\\frac{\\hbar^2}{2m} \\nabla^2 + V(x, t)\\right) \\Psi$$
- **Born Probability Interpretation:** The quantity $|\\Psi(x, t)|^2 dx$ represents the probability density of finding the particle within volume element $dx$.`
  },
  {
    id: "science_astrophysics_general_relativity",
    subject: "Science",
    tutor: "Science Mentor",
    tutorId: "science",
    topic: "General Relativity, Gravitational Waves & Black Holes",
    subTopic: "Astrophysics & Gravitation",
    source: "Spacetime and Geometry: General Relativity (Carroll) §5.3",
    difficulty: "Advanced",
    tags: ["general relativity", "astrophysics", "black holes", "gravitational waves", "einstein field equations", "schwarzschild radius", "spacetime"],
    content: `Published by Albert Einstein in 1915, **General Relativity** replaces the Newtonian concept of gravity as an instantaneous action-at-a-distance force with a geometric model: **mass and energy warp four-dimensional spacetime, and matter moves along spacetime geodesics**.

### 1. The Einstein Field Equations
$$G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8 \\pi G}{c^4} T_{\\mu\\nu}$$
- $G_{\\mu\\nu} = R_{\\mu\\nu} - \\frac{1}{2} R g_{\\mu\\nu}$ is the Einstein tensor describing the local curvature of spacetime.
- $T_{\\mu\\nu}$ is the Stress-Energy-Momentum tensor quantifying matter and energy distribution.
- Wheeler's summary: *"Spacetime tells matter how to move; matter tells spacetime how to curve."*

### 2. Schwarzschild Metric & Black Holes
For a static, spherically symmetric mass $M$, solving Einstein's vacuum equations ($T_{\\mu\\nu} = 0$) yields the Schwarzschild metric. When matter compresses within the **Schwarzschild Radius** $R_s$, escape velocity equals the speed of light $c$:
$$R_s = \\frac{2GM}{c^2}$$
Beyond this radius lies the **Event Horizon**, a boundary from which no matter or electromagnetic signal can escape, terminating in a gravitational singularity.

### 3. Gravitational Waves
Accelerating asymmetric mass distributions (e.g., binary black hole or neutron star inspirals) produce transverse ripples in spacetime metric propagating at speed $c$. First directly detected by LIGO/Virgo in 2015 (GW150914), confirming Einstein's century-old prediction.`
  },
  {
    id: "science_crispr_molecular_genetics",
    subject: "Science",
    tutor: "Science Mentor",
    tutorId: "science",
    topic: "CRISPR-Cas9 & The Central Dogma of Molecular Biology",
    subTopic: "Genetics & Biotechnology",
    source: "Molecular Biology of the Cell (Alberts) §8.2",
    difficulty: "Advanced",
    tags: ["crispr", "genetics", "dna", "rna", "molecular biology", "gene editing", "central dogma", "transcription", "translation"],
    content: `The **Central Dogma of Molecular Biology** describes the directional flow of genetic sequence information within biological systems:
$$\\text{DNA} \\xrightarrow{\\text{Transcription}} \\text{mRNA} \\xrightarrow{\\text{Translation}} \\text{Functional Protein}$$

### 1. Genetic Information Processing
1. **Transcription:** RNA Polymerase synthesizes a complementary pre-mRNA strand using a DNA template strand inside the nucleus.
2. **Post-Transcriptional Processing:** Pre-mRNA undergoes 5' capping, poly-A tail addition, and intron splicing via spliceosomes.
3. **Translation:** Ribosomes decode triplet codon sequences into specific amino acid chains using transfer RNA (tRNA) anticodons.

### 2. CRISPR-Cas9 Gene Editing Mechanism
Adapted from a bacterial adaptive immune system against bacteriophages, CRISPR-Cas9 provides precise sequence-specific genomic editing:
- **Single Guide RNA (sgRNA):** Engineered ~20-nucleotide synthetic RNA sequence complementary to the target genomic locus.
- **Protospacer Adjacent Motif (PAM):** A short recognition motif (5'-NGG-3' for *Streptococcus pyogenes* Cas9) immediately downstream of the target site.
- **Cas9 Endonuclease:** Binds the sgRNA, unzips genomic DNA, and upon guide-target hybridization, activates dual catalytic domains (HNH and RuvC) to induce a **double-strand break (DSB)** 3 base pairs upstream of the PAM site.

### 3. Cellular DNA Repair Pathways
- **NHEJ (Non-Homologous End Joining):** Error-prone pathway that rapidly rejoins severed ends, creating small insertions/deletions (indels) that cause frameshifts and knock out target genes.
- **HDR (Homology-Directed Repair):** Precise template-directed repair pathway utilized in the presence of an exogenous donor DNA template to insert specific therapeutic genetic sequences.`
  },

  // --- LITERATURE & HUMANITIES ---
  {
    id: "lit_critical_theory_frameworks",
    subject: "Literature",
    tutor: "Literature Mentor",
    tutorId: "lit",
    topic: "Critical Literary Theory & Textual Deconstruction",
    subTopic: "Hermeneutics & Cultural Analysis",
    source: "Literary Theory: An Introduction (Eagleton) §3.1",
    difficulty: "Advanced",
    tags: ["literary theory", "critical theory", "deconstruction", "structuralism", "postmodernism", "hermeneutics", "derrida", "roland barthes"],
    content: `**Critical Literary Theory** provides methodological lenses to interrogate text, authorship, ideology, and power structures rather than treating literature as an isolated moral artifact.

### 1. Major Theoretical Frameworks
- **Formalism & New Criticism:** Focuses strictly on the autonomous text ("the text itself"), analyzing irony, paradox, meter, and close reading without reference to authorial biography or historical context.
- **Structuralism (Ferdinand de Saussure):** Treats literature as part of a larger sign system. The linguistic sign consists of the **Signifier** (sound/letter image) and the **Signified** (mental concept), linked arbitrarily and acquiring meaning only through binary contrast ($day / night$).
- **Deconstruction (Jacques Derrida):** Challenges Western "logocentrism" and stable binary hierarchies. Derrida demonstrated that language is fundamentally unstable; meaning is endlessly deferred through *différance* (differing and deferring). Deconstructive reading identifies internal contradictions where texts subvert their own explicit theses.
- **The Death of the Author (Roland Barthes):** Rejects authorial intent as the ultimate meaning validator; a text is a multi-dimensional space where diverse writings blend and clash, and its unity lies in the reader's destination rather than the author's origin.

### 2. Socio-Political Hermeneutics
- **Marxist Literary Criticism:** Examines how texts reflect class struggles, commodification, and prevailing capitalist hegemony (Althusser's Ideological State Apparatuses).
- **Post-Colonialism (Edward Said, Gayatri Spivak):** Interrogates Eurocentric representations of the "Other" (Orientalism) and investigates subaltern agency within imperialist discourse.`
  },
  {
    id: "lit_rhetorical_appeals_fallacies",
    subject: "Literature",
    tutor: "Literature Mentor",
    tutorId: "lit",
    topic: "Classical Rhetoric: Aristotelian Appeals & Argumentation Fallacies",
    subTopic: "Rhetorical Criticism & Composition",
    source: "The Art of Rhetoric (Aristotle) §1.2",
    difficulty: "Intermediate",
    tags: ["rhetoric", "ethos", "pathos", "logos", "argumentation", "logical fallacies", "persuasion", "critical thinking"],
    content: `In classical rhetoric, argumentation is the structured art of effective or persuasive speaking and writing.

### 1. Aristotle's Three Rhetorical Modes of Persuasion
1. **Ethos (Credibility & Authority):** Establishing the speaker's moral character, domain competence, and trustworthiness. Audiences are persuaded when they perceive the communicator as possessing practical wisdom (*phronesis*), virtue (*arete*), and goodwill (*eunoia*).
2. **Logos (Logic & Empirical Reason):** Persuading through reasoned argumentation, valid syllogisms, inductive generalizations, verifiable data, and deductive clarity.
3. **Pathos (Emotional & Empathic Resonance):** Engaging the audience's emotional disposition, values, and psychological sensibilities to elicit receptive engagement.

### 2. Common Argumentation Fallacies
Flaws in logical reasoning that invalidate an argument's deductive soundness:
- **Ad Hominem:** Attacking the personal character or motives of the arguer rather than evaluating the substantive merits of their premise.
- **Straw Man:** Distorting, exaggerating, or misrepresenting an opponent's argument to make it easier to attack.
- **False Dilemma (Black-and-White Fallacy):** Presenting two alternative states as the only possibilities when viable intermediate options exist.
- **Post Hoc Ergo Propter Hoc:** Concluding that event $B$ was caused by event $A$ simply because $B$ occurred after $A$ (confusing correlation with causation).
- **Slippery Slope:** Asserting that a relatively small first step will inevitably trigger a catastrophic chain of events without establishing plausible causal mechanisms.`
  },

  // --- RESEARCH ASSISTANT ---
  {
    id: "research_hypothesis_testing_pvalues",
    subject: "Research",
    tutor: "Research Assistant",
    tutorId: "research",
    topic: "Statistical Hypothesis Testing, p-values & Power Analysis",
    subTopic: "Quantitative Empirical Methodology",
    source: "Statistical Methods for Research Workers (Fisher) §4.1",
    difficulty: "Advanced",
    tags: ["hypothesis testing", "p value", "type 1 error", "type 2 error", "statistical power", "null hypothesis", "significance level", "research methods"],
    content: `Inferential hypothesis testing evaluates whether empirical sample observations provide sufficient evidence to reject a default baseline proposition regarding a population parameter.

### 1. Formulating Dual Hypotheses
- **Null Hypothesis ($H_0$):** States there is no effect, no relationship, or no difference between conditions (e.g., $\\mu_1 - \\mu_2 = 0$).
- **Alternative Hypothesis ($H_1$ or $H_a$):** States there is an actual statistically meaningful effect or difference (e.g., $\\mu_1 - \\mu_2 \\neq 0$).

### 2. Decision Outcomes & Error Matrix
| Reality \\ Decision | Fail to Reject $H_0$ | Reject $H_0$ (Claim Effect) |
| :--- | :--- | :--- |
| **$H_0$ is True** | Correct Decision ($1 - \\alpha$) | **Type I Error (False Positive, $\\alpha$)** |
| **$H_0$ is False** | **Type II Error (False Negative, $\\beta$)** | **Correct Decision (Power $1 - \\beta$)** |

- **Significance Level ($\\alpha$):** The probability threshold for committing a Type I error (standard convention: $\\alpha = 0.05$).
- **Statistical Power ($1 - \\beta$):** The probability of correctly detecting a genuine effect of a given magnitude (standard target: $80\\%$ or $1 - \\beta = 0.80$).

### 3. Understanding the p-value
The **p-value** is the probability of obtaining test results at least as extreme as the observed sample data, **assuming that the null hypothesis is completely true**:
$$p = P(\\text{Data} \\mid H_0)$$
*Crucial Pitfall:* A p-value is **NOT** the probability that the null hypothesis is true, nor is it the probability that results occurred by chance. If $p \\le \\alpha$, reject $H_0$. Always report effect sizes (e.g., Cohen's $d$, Pearson's $r$, $\\eta^2$) alongside p-values to demonstrate substantive real-world significance.`
  },
  {
    id: "research_systematic_review_prisma",
    subject: "Research",
    tutor: "Research Assistant",
    tutorId: "research",
    topic: "Systematic Literature Reviews & The PRISMA Protocol",
    subTopic: "Evidence Synthesis & Meta-Analysis",
    source: "PRISMA 2020 Statement (Page et al.) §2.1",
    difficulty: "Intermediate",
    tags: ["systematic review", "prisma", "literature review", "meta analysis", "evidence synthesis", "research protocol", "inclusion criteria"],
    content: `A **Systematic Literature Review (SLR)** is a rigorous, reproducible synthesis of all empirical research meeting pre-specified eligibility criteria to answer a focused research question.

### 1. Systematic Review vs Traditional Narrative Review
- **Narrative Review:** Subjective, non-exhaustive literature summaries vulnerable to author selection bias and cherry-picking.
- **Systematic Review:** Pre-registered protocol (e.g., PROSPERO), explicit Boolean database search queries, dual independent screening, standardized risk-of-bias evaluation.

### 2. The 4 PRISMA Stages (Preferred Reporting Items for Systematic Reviews)
1. **Identification:**
   - Formulate search strings across multiple databases (IEEE Xplore, ACM Digital Library, PubMed, Scopus).
   - Document raw yields and eliminate duplicate records automatically.
2. **Screening:**
   - Screen remaining titles and abstracts against inclusion and exclusion criteria.
   - Discard obviously non-relevant studies with documented rationale.
3. **Eligibility:**
   - Retrieve full-text articles for remaining candidates.
   - Two independent reviewers assess complete texts against strict criteria (e.g., PICO: Population, Intervention, Comparator, Outcome).
4. **Included:**
   - Final corpus synthesized qualitatively or pooled statistically via **Meta-Analysis** (forest plots, funnel plots for publication bias).`
  },

  // --- CAREER / INDUSTRY ENGINEERING ---
  {
    id: "career_system_design_interview_url_shortener",
    subject: "Career",
    tutor: "Career Coach",
    tutorId: "career",
    topic: "System Design Interview: Designing a Scalable URL Shortener (TinyURL)",
    subTopic: "Software Engineering & Technical Interviews",
    source: "System Design Interview (Alex Xu) §4.1",
    difficulty: "Advanced",
    tags: ["system design", "technical interview", "tinyurl", "url shortener", "base62", "redis", "caching", "scalability", "rate limiting"],
    content: `Designing a scalable URL shortener (like TinyURL or Bitly) is a classic system design interview question testing API design, capacity estimation, hashing, and database architecture.

### 1. Requirements & Scope Clarification
- **Functional Requirements:**
  1. Given a long URL, generate a shorter unique alias (e.g., \`https://iris.io/aB3x9Q\`).
  2. Accessing the short URL redirects with HTTP 301 (Permanent) or 302 (Temporary).
  3. Custom alias support and optional TTL expiration.
- **Non-Functional Requirements:**
  - High availability ($99.99\\%$ uptime), ultra-low latency redirection ($< 20\\text{ ms}$), high read-to-write ratio ($100 : 1$).

### 2. Back-of-the-Envelope Estimation
- Assume $100\\text{M}$ new URLs created per month $\\implies \\approx 40$ write requests/sec.
- Read requests ($100 : 1$) $\\implies 4,000$ read requests/sec.
- 10-year storage: $100\\text{M} \\times 12 \\times 10 = 12\\text{B}$ records. At $500\\text{ bytes}$ per record $\\implies 6\\text{ TB}$ storage.

### 3. Encoding Architecture (Base62 vs MD5)
- Character set: $[0-9, a-z, A-Z] = 62$ characters.
- A 7-character Base62 string yields $62^7 \\approx 3.52 \\times 10^{12}$ ($3.5\\text{ Trillion}$) unique combinations, easily exceeding 10-year requirements.
- **Distributed ID Generator:** Use a distributed counter (Twitter Snowflake or ZooKeeper range reservation) to generate a unique 64-bit integer, then convert that integer to Base62 string.

### 4. High-Level Architecture Flow
\`\`\`
Client ---> API Gateway / Rate Limiter ---> Load Balancer
                                              |
                   +--------------------------+--------------------------+
                   |                                                     |
             Read Service                                          Write Service
                   |                                                     |
             Redis Cache (LRU)                               Distributed ID Generator
                   | (Cache Hit / Miss)                                  |
                   v                                                     v
          NoSQL DB (Cassandra / DynamoDB) <----------------------- Insert Record
\`\`\`
- **Database Choice:** Distributed NoSQL Key-Value store (DynamoDB or Cassandra) because queries are simple key-value lookups (\`hash_key -> original_url\`) requiring horizontal partitioning without relational JOIN complexity.`
  },
  {
    id: "career_behavioral_star_leadership",
    subject: "Career",
    tutor: "Career Coach",
    tutorId: "career",
    topic: "Engineering Leadership & The STAR Behavioral Framework",
    subTopic: "Behavioral Interviews & Career Advancement",
    source: "The Manager's Path (Camille Fournier) §6.2",
    difficulty: "Intermediate",
    tags: ["career", "interview prep", "star method", "behavioral interview", "leadership", "conflict resolution", "engineering culture"],
    content: `Top technology organizations evaluate senior engineering candidates using behavioral questions designed around competencies: conflict resolution, dealing with ambiguity, mentorship, and delivering under pressure.

### 1. The STAR Method Framework
- **Situation (15%):** Set the stage. Describe the specific project, business context, and technical dilemma. Provide clear constraints (deadline, scale, budget).
- **Task (10%):** Clarify your explicit personal ownership and responsibilities. What objective were *you* personally tasked with achieving?
- **Action (60%):** The focal core of your answer. Describe the specific technical and interpersonal decisions *you* made:
  - How did you evaluate competing tradeoffs?
  - How did you build consensus among stakeholders?
  - What proactive steps did you take when unexpected obstacles arose?
- **Result (15%):** Quantifiable, measurable outcomes:
  - Concrete metrics (e.g., *"Reduced API latency by 42%, cut cloud infrastructure cost by $18,000/month, and mentored 2 junior engineers through production rollout"*).
  - Key retrospective lessons learned.

### 2. High-Impact STAR Example: Resolving a Technical Deadlock
- **Situation:** Two senior developers on our team disagreed on choosing between gRPC and REST for our microservice communication upgrade, stalling the sprint for two weeks.
- **Task:** As tech lead, I needed to unblock development without alienating either engineer while choosing the objectively best architecture.
- **Action:** Rather than declaring a unilateral decision, I established an objective evaluation matrix based on latency benchmarks, payload sizes, and client SDK generation. I scheduled a 3-day time-boxed spike where each engineer prototyped a single high-throughput endpoint.
- **Result:** Empirical benchmark data showed gRPC reduced internal RPC latency by 68%. Both engineers agreed to adopt gRPC internally while maintaining REST gateways for public consumers. The project was delivered one week ahead of schedule.`
  },

  // =========================================================================
  // 7. EXPANDED RAG KNOWLEDGE - ADVANCED DOMAIN MASTERY (All 6 Tutors)
  // =========================================================================
  {
    id: "math_eigenvalues_eigenvectors",
    subject: "Mathematics",
    tutor: "Mathematics Mentor",
    tutorId: "math",
    topic: "Eigenvalues, Eigenvectors & Matrix Diagonalization",
    subTopic: "Linear Algebra & Spectral Theory",
    source: "Linear Algebra and Its Applications (Gilbert Strang) §5.1",
    difficulty: "Advanced",
    tags: ["eigenvalues", "eigenvectors", "linear algebra", "matrices", "diagonalization", "characteristic polynomial", "spectral theorem", "pca"],
    content: `In linear algebra, an **eigenvector** of a square matrix $A$ is a non-zero vector $\\mathbf{v}$ whose direction remains invariant when linear transformation $A$ is applied, being scaled only by a scalar factor $\\lambda$, known as the corresponding **eigenvalue**.

### 1. Fundamental Definition
$$A\\mathbf{v} = \\lambda\\mathbf{v} \\quad (\\mathbf{v} \\neq \\mathbf{0})$$
Rewriting in homogeneous form with the identity matrix $I$:
$$(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$$

### 2. Characteristic Equation
For a non-trivial solution ($\\mathbf{v} \\neq \\mathbf{0}$) to exist, the matrix $(A - \\lambda I)$ must be singular (non-invertible):
$$\\det(A - \\lambda I) = 0$$
This determinant expands into an $n$-degree polynomial in $\\lambda$, called the **characteristic polynomial**. The roots of this polynomial are the eigenvalues.

### 3. Step-by-Step Computational Example
Given matrix $A = \\begin{pmatrix} 4 & 1 \\\\ 2 & 3 \\end{pmatrix}$:
1. **Form the characteristic determinant:**
   $$\\det\\begin{pmatrix} 4 - \\lambda & 1 \\\\ 2 & 3 - \\lambda \\end{pmatrix} = (4 - \\lambda)(3 - \\lambda) - (1)(2) = 0$$
   $$\\lambda^2 - 7\\lambda + 12 - 2 = \\lambda^2 - 7\\lambda + 10 = 0$$
2. **Factor the polynomial:**
   $$(\\lambda - 5)(\\lambda - 2) = 0 \\implies \\lambda_1 = 5, \\quad \\lambda_2 = 2$$
3. **Find Eigenvector for $\\lambda_1 = 5$:**
   $$(A - 5I)\\mathbf{v} = \\begin{pmatrix} -1 & 1 \\\\ 2 & -2 \\end{pmatrix}\\begin{pmatrix} v_1 \\\\ v_2 \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 0 \\end{pmatrix} \\implies -v_1 + v_2 = 0 \\implies \\mathbf{v}_1 = \\begin{pmatrix} 1 \\\\ 1 \\end{pmatrix}$$
4. **Find Eigenvector for $\\lambda_2 = 2$:**
   $$(A - 2I)\\mathbf{v} = \\begin{pmatrix} 2 & 1 \\\\ 2 & 1 \\end{pmatrix}\\begin{pmatrix} v_1 \\\\ v_2 \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 0 \\end{pmatrix} \\implies 2v_1 + v_2 = 0 \\implies \\mathbf{v}_2 = \\begin{pmatrix} 1 \\\\ -2 \\end{pmatrix}$$

### 4. Real-World Applications
- **Principal Component Analysis (PCA):** Covariance matrix eigenvectors define principal orthogonal axes of maximum dataset variance.
- **Google PageRank:** Steady-state probability distribution of web surfing is the principal eigenvector ($\\lambda = 1$) of the Markov transition matrix.
- **Quantum Mechanics:** Physical observables (momentum, energy) are Hermitian operators whose eigenvalues represent measurable quantum states.`
  },
  {
    id: "math_bayes_theorem",
    subject: "Mathematics",
    tutor: "Mathematics Mentor",
    tutorId: "math",
    topic: "Bayes' Theorem & Bayesian Statistical Inference",
    subTopic: "Probability Theory & Decision Science",
    source: "Probability and Statistics (DeGroot & Schervish) §2.3",
    difficulty: "Intermediate",
    tags: ["bayes theorem", "conditional probability", "prior", "posterior", "likelihood", "statistics", "machine learning", "inference"],
    content: `**Bayes' Theorem** provides a rigorous mathematical framework for updating the probability of an event or hypothesis ($A$) as new empirical evidence or data ($B$) is observed.

### 1. Mathematical Formulation
$$P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}$$

Using the Law of Total Probability to expand marginal evidence $P(B)$ over exhaustive mutually exclusive hypotheses $A$ and $\\neg A$:
$$P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B|A)P(A) + P(B|\\neg A)P(\\neg A)}$$

### 2. The Four Pillars of Bayesian Reasoning
1. **Prior Probability $P(A)$:** Baseline degree of belief in hypothesis $A$ *before* observing current data.
2. **Likelihood $P(B|A)$:** Probability of observing evidence $B$ given that hypothesis $A$ is true.
3. **Marginal Evidence $P(B)$:** Total probability of observing evidence $B$ across all possible states.
4. **Posterior Probability $P(A|B)$:** Refined probability of hypothesis $A$ *after* conditioning on evidence $B$.

### 3. Canonical Medical Screening Example: Base Rate Neglect
- **Base disease prevalence:** $P(D) = 0.01$ ($1\\%$ of population).
- **Test Sensitivity (True Positive Rate):** $P(+\\mid D) = 0.99$ ($99\\%$).
- **False Positive Rate:** $P(+\\mid \\neg D) = 0.05$ ($5\\%$).
- **Question:** If a randomly selected patient tests positive ($+$), what is the exact probability they actually have the disease $P(D|{+})$?

**Calculation:**
$$P(+) = P(+\\mid D)P(D) + P(+\\mid \\neg D)P(\\neg D)$$
$$P(+) = (0.99)(0.01) + (0.05)(0.99) = 0.0099 + 0.0495 = 0.0594$$
$$P(D|{+}) = \\frac{0.0099}{0.0594} = \\frac{1}{6} \\approx 16.67\\%$$
Even with a $99\\%$ sensitive test, a positive patient has only a $\\approx 16.7\\%$ chance of true infection due to the low base rate ($1\\%$).`
  },
  {
    id: "science_photoelectric_effect",
    subject: "Science",
    tutor: "Science Explorer",
    tutorId: "science",
    topic: "Photoelectric Effect & Wave-Particle Duality",
    subTopic: "Quantum Physics & Modern Mechanics",
    source: "Concepts of Modern Physics (Arthur Beiser) §2.2",
    difficulty: "Advanced",
    tags: ["photoelectric effect", "photons", "einstein", "planck", "work function", "quantum mechanics", "light", "wave particle duality"],
    content: `The **Photoelectric Effect** is the emission of electrons (photoelectrons) from a metallic surface when exposed to electromagnetic radiation above a minimum threshold frequency. Albert Einstein explained this phenomenon in 1905 using Planck's quantum hypothesis, proving that light exhibits discrete, particle-like packets called **photons**.

### 1. Einstein's Photoelectric Equation
$$K_{\\max} = h\\nu - \\Phi = h\\nu - h\\nu_0$$
Where:
- $K_{\\max} = e V_s$: Maximum kinetic energy of ejected photoelectrons ($V_s$ is the stopping potential).
- $h$: Planck's constant ($6.626 \\times 10^{-34} \\text{ J}\\cdot\\text{s}$).
- $\\nu$: Frequency of incident photon (with $\\nu = c/\\lambda$).
- $\\Phi = h\\nu_0$: Work function of the metal (minimum energy required to liberate a surface electron).
- $\\nu_0$: Threshold frequency below which zero electrons are emitted, regardless of light intensity.

### 2. Failure of Classical Wave Theory vs. Quantum Resolution
| Classical Wave Theory Prediction | Experimental Observation | Quantum Photoelectric Explanation |
|---|---|---|
| Higher intensity increases electron kinetic energy | Kinetic energy depends strictly on light *frequency*, not intensity | Each photon delivers $E = h\\nu$ to exactly one electron. Higher intensity simply increases photon count (current), not energy per photon. |
| Measurable time delay for electrons to absorb enough wave energy | Electron ejection occurs instantaneously ($< 10^{-9}$ seconds) | One-to-one instantaneous elastic collision between photon and conduction electron. |
| Any frequency can liberate electrons if intensity is high enough | No emission occurs if $\\nu < \\nu_0$, regardless of intensity | If $h\\nu < \\Phi$, individual photon lacks sufficient energy to overcome metal binding barrier. |

### 3. Key Technological Implications
- **Photomultiplier Tubes (PMTs) & CMOS Sensors:** Form the basis of digital camera sensors, astronomical spectrographs, and solar photovoltaic cells.`
  },
  {
    id: "science_crispr_cas9",
    subject: "Science",
    tutor: "Science Explorer",
    tutorId: "science",
    topic: "CRISPR-Cas9 Precision Genome Editing",
    subTopic: "Molecular Biology & Genetic Engineering",
    source: "Molecular Biology of the Cell (Alberts et al.) §8.4",
    difficulty: "Advanced",
    tags: ["crispr", "cas9", "gene editing", "genetics", "pam sequence", "grna", "dna repair", "biotechnology", "molecular biology"],
    content: `**CRISPR-Cas9** (Clustered Regularly Interspaced Short Palindromic Repeats - CRISPR associated protein 9) is a revolutionary RNA-guided endonuclease system adapted from bacterial adaptive immune defenses that enables precise genomic sequence modifications in living organisms.

### 1. Biochemical Architecture
The CRISPR-Cas9 ribonucleoprotein complex consists of two primary components:
1. **Cas9 Endonuclease:** A multidomain enzyme containing two catalytic cleavage domains:
   - **RuvC domain:** Cleaves the non-complementary DNA strand.
   - **HNH domain:** Cleaves the complementary DNA strand hybridized with gRNA.
2. **Single Guide RNA (sgRNA):** An engineered $\\approx 100$-nucleotide construct fusing crRNA (20-nucleotide programmable target sequence) with tracrRNA (structural scaffold that anchors into Cas9).

### 2. Mechanism of Action
1. **Target Scanning & PAM Recognition:** The complex scans genomic DNA for a specific **Protospacer Adjacent Motif (PAM)**, canonically \`5'-NGG-3'\` in *Streptococcus pyogenes* Cas9. Cas9 cannot bind or unwind DNA without this motif.
2. **R-Loop Formation:** Upon locating a PAM, Cas9 unwinds the adjacent double helix, allowing the 20-nt guide RNA to base-pair with the complementary target DNA strand.
3. **Double-Strand Break (DSB):** Both catalytic domains cleave the phosphodiester backbone 3 base pairs upstream of the PAM site, creating a blunt double-strand break.

### 3. Cellular DNA Repair Pathways
Once Cas9 generates the DSB, host cellular repair mechanisms resolve the cut:
- **Non-Homologous End Joining (NHEJ):** Error-prone ligation pathway active in non-dividing cells. Often introduces random insertions/deletions (indels) causing frameshift mutations, resulting in targeted **gene knockout**.
- **Homology-Directed Repair (HDR):** High-fidelity repair pathway active during S/G2 phase. When an exogenous donor DNA template is co-introduced, HDR integrates precise genetic corrections or novel sequences (**gene knock-in**).`
  },
  {
    id: "code_dynamic_programming",
    subject: "Coding",
    tutor: "Coding Coach",
    tutorId: "code",
    topic: "Dynamic Programming: Memoization vs Tabulation",
    subTopic: "Algorithms & Time Complexity Optimization",
    source: "Introduction to Algorithms (CLRS) Chapter 15",
    difficulty: "Advanced",
    tags: ["dynamic programming", "dp", "memoization", "tabulation", "knapsack", "algorithms", "recursion", "complexity"],
    content: `**Dynamic Programming (DP)** is a mathematical algorithmic technique that solves complex optimization problems by breaking them down into simpler, overlapping subproblems, solving each subproblem exactly once, and caching its result.

### 1. Two Necessary Conditions for DP
1. **Optimal Substructure:** The globally optimal solution of the problem contains within it optimal solutions to its subproblems.
2. **Overlapping Subproblems:** The recursive problem decomposition visits the identical subproblem states repeatedly rather than generating unique new branches.

### 2. Memoization (Top-Down) vs. Tabulation (Bottom-Up)
| Dimension | Top-Down (Memoization) | Bottom-Up (Tabulation) |
|---|---|---|
| **Approach** | Recursive from root goal state downward | Iterative from base cases upward |
| **State Storage** | Hash Map or Array cache populated on demand | Pre-allocated $1\\text{D}$ or $2\\text{D}$ DP table |
| **Subproblem Coverage** | Computes only subproblems on actual call path | Computes all table entries in topological order |
| **Overhead** | Call stack recursion overhead ($O(N)$ stack depth) | Zero call stack overhead; cache-friendly sequential memory |

### 3. Classic 0/1 Knapsack Formulation
Given item weights $w$, values $v$, and knapsack weight capacity $W$:
$$dp[i][w] = \\max\\big(dp[i-1][w], \\; dp[i-1][w - w[i-1]] + v[i-1]\\big)$$

\`\`\`typescript
function knapsack(weights: number[], values: number[], W: number): number {
  const n = weights.length;
  // Space-optimized 1D array from right to left
  const dp: number[] = new Array(W + 1).fill(0);

  for (let i = 0; i < n; i++) {
    for (let w = W; w >= weights[i]; w--) {
      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
    }
  }
  return dp[W];
}
\`\`\`
**Time Complexity:** $O(n \\cdot W)$ | **Space Complexity:** $O(W)$ (optimized down from $O(n \\cdot W)$).`
  },
  {
    id: "code_btree_database_indexing",
    subject: "Coding",
    tutor: "Coding Coach",
    tutorId: "code",
    topic: "B-Trees, B+ Trees & Database Storage Indexing",
    subTopic: "Database Internals & Storage Systems",
    source: "Database Internals (Alex Petrov) §2.1",
    difficulty: "Advanced",
    tags: ["b-tree", "b+ tree", "database indexing", "sqlite", "storage engine", "disk io", "algorithms", "systems"],
    content: `Modern relational databases (including SQLite, PostgreSQL, and MySQL InnoDB) utilize **B+ Trees** as their core on-disk index structure to provide $O(\\log n)$ point queries, range lookups, and ordered iterations.

### 1. Why Not Binary Search Trees (BST / Red-Black Trees)?
- Binary search trees have a fanout of 2. For a table with $10^7$ rows, tree height is $\\log_2(10^7) \\approx 24$.
- Each tree traversal level across rotating disk or SSD sectors requires a physical block I/O. 24 random I/O operations per query results in severe latency bottlenecks.
- **B-Trees solve this by maximizing node fanout ($B > 100$)**: matching node size directly to filesystem page boundaries (e.g., $4\\text{ KB}$ or $16\\text{ KB}$). A tree with fanout $500$ can index billions of rows with height $3$ to $4$ (at most $3$ disk reads).

### 2. Architectural Difference: B-Tree vs. B+ Tree
- **Standard B-Tree:** Keys and row data payloads are stored in internal nodes as well as leaf nodes.
- **B+ Tree (Industry Standard):**
  - **Internal Nodes:** Store *only* routing keys and child page pointers, maximizing branching factor fan-out.
  - **Leaf Nodes:** Store all actual data records (or heap row pointers).
  - **Leaf Node Linked List:** Every leaf node has forward (and often backward) sibling pointers, enabling ultra-fast $O(k)$ range scans (\`WHERE age BETWEEN 20 AND 30\`) without re-traversing internal tree branches.

### 3. Practical Database Indexing Rules
1. **Leftmost Prefix Rule:** A composite index on \`(last_name, first_name, date_of_birth)\` accelerates queries on \`last_name\` or \`(last_name, first_name)\`, but *cannot* accelerate \`WHERE first_name = 'Alice'\`.
2. **Index Cardinality:** Build indexes on high-cardinality columns (unique IDs, emails) rather than low-cardinality fields (boolean status flags).`
  },
  {
    id: "lit_heros_journey_monomyth",
    subject: "Literature",
    tutor: "Literature Guide",
    tutorId: "lit",
    topic: "The Hero's Journey & Campbell's Monomyth Structure",
    subTopic: "Literary Theory & Narrative Archetypes",
    source: "The Hero with a Thousand Faces (Joseph Campbell) §1",
    difficulty: "Intermediate",
    tags: ["heros journey", "monomyth", "campbell", "archetypes", "storytelling", "narrative structure", "mythology", "literature"],
    content: `**The Hero's Journey (Monomyth)** is a universal narrative template identified by comparative mythologist Joseph Campbell. It asserts that foundational myths, classical epics, and contemporary storytelling from diverse world cultures share an identical underlying structural blueprint of psychological maturation.

### 1. The Tripartite Cycle: Departure, Initiation, Return
1. **Departure (Separation):** The protagonist is dislodged from their familiar, mundane life into a supernatural realm of danger and unknown rules.
2. **Initiation:** The hero encounters severe trials, confronts the fundamental shadow/abyss, experiences symbolic ego-death, and claims the ultimate reward.
3. **Return:** The hero returns to the ordinary world transformed, wielding the power or wisdom ("Elixir") to revitalize their original community.

### 2. Christopher Vogler's 12-Stage Storytelling Model
1. **The Ordinary World:** Baseline status quo establishing the hero's internal lack or flaw.
2. **Call to Adventure:** Disruptive incident presenting a challenge or quest.
3. **Refusal of the Call:** Hesitation, fear, or obligation causing the hero to resist.
4. **Meeting the Mentor:** Guidance, training, or magical talisman provided by a wise elder.
5. **Crossing the First Threshold:** Commitment to the adventure; crossing into the special world.
6. **Tests, Allies, and Enemies:** Navigating unfamiliar rules and discovering who to trust.
7. **Approach to the Inmost Cave:** Preparations for the greatest central challenge.
8. **The Ordeal:** Peak crisis; confronting mortality and experiencing psychological rebirth.
9. **Reward (Seizing the Sword):** Securing the coveted object, knowledge, or power.
10. **The Road Back:** Urgency to bring the reward home; facing consequences of the ordeal.
11. **The Resurrection:** Final climatic test where the hero applies everything learned.
12. **Return with the Elixir:** Reintegration into society as a transformed, complete individual.

### 3. Archetypal Characters (Carl Jung's Influence)
Campbell's model aligns with Jungian psychology: the **Shadow** represents repressed aspects of the self, the **Mentor** represents higher wisdom, the **Herald** forces change, and the **Trickster** challenges rigid dogma through irony.`
  },
  {
    id: "lit_narrative_points_of_view",
    subject: "Literature",
    tutor: "Literature Guide",
    tutorId: "lit",
    topic: "Narrative Points of View & Psychic Distance",
    subTopic: "Creative Writing & Rhetoric Craft",
    source: "The Art of Fiction (John Gardner) §4",
    difficulty: "Advanced",
    tags: ["point of view", "narrator", "perspective", "unreliable narrator", "free indirect discourse", "psychic distance", "craft", "fiction"],
    content: `**Point of View (POV)** governs the lens, scope, and psychological intimacy through which a narrative is mediated to the reader. Choosing a narrative perspective dictates narrative reliability, temporal immediacy, and emotional resonance.

### 1. The Spectrum of Narrative Perspectives
- **First-Person Protagonist ($I$, $we$):** The storyteller is the central actor. High emotional immediacy and voice, but restricted strictly to what the narrator perceives, remembers, or chooses to reveal.
- **First-Person Peripheral Witness:** An observer recounts someone else's story (e.g., Nick Carraway observing Jay Gatsby in *The Great Gatsby*).
- **Second-Person ($You$):** Rare, experimental mode casting the reader directly as the protagonist or addressing an internalized self (e.g., Jay McInerney's *Bright Lights, Big City*).
- **Third-Person Objective:** Strictly observable actions and dialogue without access to any character's internal thoughts (cinematic, fly-on-the-wall approach used in Hemingway's *Hills Like White Elephants*).
- **Third-Person Limited:** Anchors the narrative gaze into the mind of a single character ($he$, $she$, $they$). The prose is colored by that character's worldview, biases, and sensory observations.
- **Third-Person Omniscient:** An all-knowing narrator possessing god-like knowledge of all characters' thoughts, universal historical contexts, and future events (characteristic of 19th-century novels by Tolstoy or Dickens).

### 2. Free Indirect Discourse (FID)
Free indirect discourse is an advanced literary technique blending third-person objective narration with first-person colloquial interior idiom without quotation marks or attribution tags.
- *Direct speech:* She looked outside and thought, "Will he arrive before sundown?"
- *Indirect speech:* She looked outside and wondered if he would arrive before sundown.
- *Free indirect discourse:* She gazed past the frosted sill. Would he make it before sundown? He had better. The tea was turning cold.

### 3. John Gardner's 5 Levels of Psychic Distance
1. *Level 1 (Distant/Panoramic):* "It was winter of the year 1853. A large man walked down a country road."
2. *Level 2 (General Observational):* "The man was walking fast, his head ducked into the freezing wind."
3. *Level 3 (Personal Limited):* "Henry was in a hurry. If he missed the coach, he'd freeze before midnight."
4. *Level 4 (Close Internal):* "Where was that blasted coach? His boots were soaked through."
5. *Level 5 (Pure Sensory Immersion):* "Ice in the teeth. Blood pounding in the ears. Move, damn it, move."`
  },
  {
    id: "career_tech_offer_negotiation",
    subject: "Career",
    tutor: "Career Coach",
    tutorId: "career",
    topic: "Tech Offer Negotiation & Total Compensation Architecture",
    subTopic: "Compensation Strategy & Executive Negotiation",
    source: "Never Split the Difference (Chris Voss) & Levels.fyi Compensation Guidelines",
    difficulty: "Advanced",
    tags: ["compensation", "negotiation", "tech offer", "rsu", "equity", "base salary", "career", "interviews"],
    content: `Total Compensation (TC) in technology companies extends far beyond base annual salary. Maximizing career earnings requires understanding equity structures, vesting cliffs, and strategic negotiation tactics.

### 1. Total Compensation Architecture
$$\\text{Total Compensation (TC)} = \\text{Base Salary} + \\text{Annual Performance Bonus} + \\text{Annualized Equity (RSUs/Options)} + \\text{Sign-on Bonus}$$

- **Base Salary:** Fixed cash guaranteed every pay cycle. Subject to strict departmental level bands.
- **Restricted Stock Units (RSUs):** Units of public company stock that vest over time (canonically $4$-year vesting with a $1$-year "cliff" at $25\\%$ and quarterly vesting thereafter).
- **Stock Options (Startups):** The right to purchase private shares at a predetermined **Strike Price**. Value is realized only upon a liquidity event (IPO or acquisition) if the share valuation exceeds the strike price.
- **Sign-on Bonus:** Upfront one-time cash used by recruiters to bridge equity gaps or make up for forfeited bonuses from your previous employer.

### 2. Core Negotiation Principles
1. **Anchor with Market Data, Not Current Pay:** Never disclose your current salary or historical compensation. Anchor your expectations around verified peer percentiles ($75^{\\text{th}}$ to $90^{\\text{th}}$ percentile on Levels.fyi or Radford data).
2. **Establish a Strong BATNA:** (Best Alternative to a Negotiated Agreement). Having concurrent competing offers is the single most potent lever to drive counteroffers.
3. **Multi-Variable Bargaining:** When recruiters state that base salary is capped by HR level bands, shift focus to more flexible variables:
   - Increasing the **Sign-on Bonus** (often budgeted out of separate recruiting pools).
   - Asking for an additional **Equity Grant** or earlier performance review refreshers.
   - Negotiating remote status, title level (e.g., L5 vs L4), or accelerated vesting schedule.

### 3. High-Impact Negotiation Script Framework
> *"I am genuinely thrilled about the team's mission and the technical challenges in this role. Based on my cross-functional system architecture experience and competing discussions currently at the $[X]$ level, I was targeting a Total Compensation of $[Y]$. If we can reach $[Y]$ through an adjusted equity allocation or sign-on bonus, I am ready to sign immediately."*`
  },
  {
    id: "career_system_design_framework",
    subject: "Career",
    tutor: "Career Coach",
    tutorId: "career",
    topic: "System Design Interview 4-Stage Mastery Framework",
    subTopic: "Software Engineering Architecture & Interview Prep",
    source: "System Design Interview (Alex Xu) §1.1",
    difficulty: "Advanced",
    tags: ["system design", "distributed systems", "interview prep", "scalability", "caching", "sharding", "architecture", "career"],
    content: `Senior and Staff software engineering interviews evaluate a candidate's ability to design scalable, fault-tolerant, high-throughput distributed systems under ambiguous constraints.

### 1. The 45-Minute 4-Step Method
- **Step 1: Clarify Requirements & Scope (3–5 min):**
  - Functional requirements (what the system explicitly does: e.g., generate short URLs, redirect within $100\\text{ ms}$).
  - Non-functional requirements (scalability, 99.99% availability, latency, consistency vs availability trade-offs).
  - Back-of-the-envelope capacity estimation: Daily Active Users (DAU), Read-to-Write ratio, Queries Per Second (QPS), and 5-year storage volume.
- **Step 2: High-Level Architecture (10–12 min):**
  - Define clear REST/gRPC API signatures (\`POST /api/v1/urls\`, \`GET /{shortUrl}\`).
  - Outline core data model and choose storage paradigm (Relational SQL vs NoSQL Key-Value / Document store).
  - Draw end-to-end block diagram: Clients $\\rightarrow$ DNS / CDN $\\rightarrow$ Load Balancer $\\rightarrow$ Stateless Web Services $\\rightarrow$ Database.
- **Step 3: Deep Dive into Core Bottlenecks (15–20 min):**
  - **Caching:** In-memory Redis cluster for hot data lookups, eviction policy (LRU), cache invalidation strategy (Write-Through vs Cache-Aside).
  - **Data Partitioning & Sharding:** Horizontal database partitioning using consistent hashing keys to prevent hot spots.
  - **Data Replication:** Master-replica setup for read-heavy workloads with automated failover.
- **Step 4: Wrap Up & Failure Modes (5 min):**
  - Identify Single Points of Failure (SPOFs).
  - Telemetry: Distributed tracing, Prometheus metrics, circuit breakers, and rate limiting (Token Bucket algorithm).

### 2. Back-of-the-Envelope Reference Numbers Every Engineer Must Know
- $100\\text{ Million}$ daily active users with $10$ reads each $\\approx 10^9$ requests/day $\\approx 11,600\\text{ QPS}$.
- L1 cache reference: $1\\text{ ns}$ | L2 cache: $4\\text{ ns}$ | RAM access: $100\\text{ ns}$.
- NVMe SSD read: $100\\;\\mu\\text{s}$ | HDD seek: $10\\text{ ms}$ | Data center roundtrip: $500\\;\\mu\\text{s}$ | Intercontinental network roundtrip: $150\\text{ ms}$.`
  },
  {
    id: "research_prisma_framework",
    subject: "Research",
    tutor: "Research Assistant",
    tutorId: "research",
    topic: "PRISMA 2020 Statement for Systematic Reviews & Meta-Analyses",
    subTopic: "Academic Methodology & Evidence Synthesis",
    source: "BMJ 2021;372:n71 (Page MJ et al. - PRISMA 2020 Explanation and Elaboration)",
    difficulty: "Advanced",
    tags: ["prisma", "systematic review", "meta analysis", "evidence synthesis", "methodology", "research", "academic writing", "literature review"],
    content: `The **PRISMA 2020 Statement** (Preferred Reporting Items for Systematic Reviews and Meta-Analyses) is an internationally recognized 27-item checklist and 4-phase flow diagram designed to optimize methodological transparency, reproducibility, and rigor in scientific literature reviews.

### 1. The Four-Phase PRISMA Flow Diagram
1. **Identification:**
   - Search query formulation using Boolean operators across multiple academic databases (PubMed, IEEE Xplore, Scopus, Web of Science).
   - Inclusion of gray literature, clinical trial registries, and forward/backward citation tracking.
   - Algorithmic and manual deduplication of matching record sets.
2. **Screening:**
   - Title and abstract screening conducted independently by at least two blinded reviewers.
   - Clear documentation of inclusion/exclusion criteria (e.g., population, intervention, comparison, outcome / PICO).
3. **Eligibility:**
   - Retrieval of full-text articles for all candidate studies passing initial screening.
   - Methodological quality and Risk of Bias (RoB) appraisal using validated tools (e.g., Cochrane RoB 2 for randomized trials, ROBINS-I for non-randomized studies).
   - Explicit tabular logging of reasons for full-text exclusions.
4. **Included:**
   - Final corpus of included studies synthesized qualitatively and, where statistically appropriate, aggregated into quantitative meta-analysis forest plots.

### 2. Essential Best Practices for Research Papers
- **PROSPERO Pre-Registration:** Pre-register your systematic review protocol in the PROSPERO database before commencing data extraction to safeguard against selective outcome reporting.
- **Publication Bias Assessment:** Assess asymmetry in study effect sizes using **Funnel Plots** and Egger's linear regression test.`
  },
  {
    id: "research_controlling_confounders",
    subject: "Research",
    tutor: "Research Assistant",
    tutorId: "research",
    topic: "Controlling Confounders & Selection Bias in Empirical Studies",
    subTopic: "Quantitative Research Design & Biostatistics",
    source: "Designing Clinical Research (Hulley et al.) §9",
    difficulty: "Advanced",
    tags: ["confounder", "selection bias", "causal inference", "epidemiology", "biostatistics", "experimental design", "research methodology"],
    content: `In empirical research and causal inference, a **confounding variable** is an extraneous factor that distorts the estimated association between an independent exposure/treatment variable ($X$) and a dependent outcome variable ($Y$).

### 1. Criteria for a True Confounder
For a variable $Z$ to be a confounder:
1. It must be causally associated with the exposure $X$.
2. It must be an independent predictor of the outcome $Y$ in the absence of exposure $X$.
3. It must **not** lie on the causal pathway between $X$ and $Y$ (otherwise, it is a mediator, not a confounder).

### 2. Methods to Control Confounders
Methods for eliminating confounding operate at either the **Study Design Phase** or the **Data Analysis Phase**:

#### A. Design Phase Controls
- **Randomization (Gold Standard):** Random allocation of subjects ensures both known and unmeasured confounding variables are distributed equally between treatment and control groups (e.g., in double-blind RCTs).
- **Restriction:** Excluding subjects with specific confounding characteristics (e.g., restricting a cardiovascular study strictly to non-smokers aged 40–50). *Trade-off:* Reduces sample generalizability.
- **Matching:** Pairing each exposed participant with an unexposed participant sharing identical key covariates (e.g., matching age, sex, and socioeconomic background).

#### B. Analysis Phase Controls
- **Stratification:** Analyzing the exposure-outcome relationship separately across homogeneous subgroups of the confounder (e.g., Mantel-Haenszel odds ratio).
- **Multivariable Regression:** Including candidate confounders as covariates in a multiple linear, logistic, or Cox proportional hazards model ($Y = \\beta_0 + \\beta_1 X + \\beta_2 Z_1 + \\beta_3 Z_2 + \\epsilon$).
- **Propensity Score Matching (PSM):** Modeling the conditional probability of receiving treatment given observed baseline covariates ($e(X) = P(Z=1|X)$) and matching treated and untreated units with similar propensity scores.`
  }
];
