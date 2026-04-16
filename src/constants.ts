import { Subject } from "./types";

export const SUBJECTS: Subject[] = [
  {
    id: "math",
    name: "Mathematics",
    icon: "Calculator",
    color: "bg-blue-500",
    description: "Algebra, Geometry, and Trigonometry.",
    topics: [
      "Real Numbers",
      "Sets",
      "Polynomials",
      "Pair of Linear Equations",
      "Quadratic Equations",
      "Trigonometry",
      "Statistics",
      "Progressions",
      "Coordinate Geometry",
      "Similar Triangles",
      "Tangents and Secants",
      "Mensuration",
      "Probability"
    ]
  },
  {
    id: "science",
    name: "Physical Science",
    icon: "Beaker",
    color: "bg-blue-500",
    description: "Physics and Chemistry.",
    topics: [
      "Chemical Reactions",
      "Acids & Bases",
      "Metals & Non-metals",
      "Light",
      "Human Eye",
      "Electricity"
    ]
  },
  {
    id: "biology",
    name: "Biological Science",
    icon: "Activity",
    color: "bg-blue-500",
    description: "Biology and Life Sciences.",
    topics: [
      "Nutrition",
      "Respiration",
      "Transportation",
      "Excretion",
      "Coordination",
      "Reproduction",
      "Coordination in Life Processes",
      "Heredity",
      "Our Environment",
      "Natural Resources"
    ]
  },
  {
    id: "english",
    name: "English",
    icon: "BookOpen",
    color: "bg-blue-500",
    description: "Grammar, Literature, and Writing.",
    topics: ["Grammar", "Prose", "Poetry"]
  },
  {
    id: "social",
    name: "Social Studies",
    icon: "Globe",
    color: "bg-blue-500",
    description: "History, Geography, Civics, and Economics.",
    topics: [
      "Resources",
      "Agriculture",
      "Industries",
      "Indian Constitution",
      "Democracy"
    ]
  },
  {
    id: "telugu",
    name: "Telugu",
    icon: "Languages",
    color: "bg-blue-500",
    description: "First Language Literature and Grammar.",
    topics: ["Matrubhasha", "Vyakaranamu", "Padya Bhagamu", "Gadya Bhagamu", "Upavachakamu"]
  },
  {
    id: "hindi",
    name: "Hindi",
    icon: "Languages",
    color: "bg-blue-500",
    description: "Second Language Literature and Grammar.",
    topics: ["Vyakaran", "Kavita", "Kahani", "Nibandh", "Patra Lekhan"]
  },
  {
    id: "art",
    name: "Art & Drawing",
    icon: "Image",
    color: "bg-blue-500",
    description: "Sketching, Painting, and Visual Arts.",
    topics: ["Basic Sketching", "Color Theory", "Perspective Drawing", "Still Life"]
  },
];

export const REVISION_NOTES = [
  {
    category: "Algebra",
    notes: [
      { title: "Difference of Squares", formula: "a² - b² = (a + b)(a - b)" },
      { title: "Square of Sum", formula: "(a + b)² = a² + 2ab + b²" },
      { title: "Square of Difference", formula: "(a - b)² = a² - 2ab + b²" }
    ]
  },
  {
    category: "Trigonometry",
    notes: [
      { title: "Sine Ratio", formula: "sin θ = Opposite / Hypotenuse" },
      { title: "Cosine Ratio", formula: "cos θ = Adjacent / Hypotenuse" },
      { title: "Tangent Ratio", formula: "tan θ = Opposite / Adjacent" },
      { title: "Identity 1", formula: "sin² θ + cos² θ = 1" }
    ]
  },
  {
    category: "Science (Chemistry)",
    notes: [
      { title: "Neutralization", formula: "Acid + Base = Salt + Water" },
      { title: "Photosynthesis", formula: "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂" }
    ]
  },
  {
    category: "Science (Physics)",
    notes: [
      { title: "Ohm's Law", formula: "V = I × R" },
      { title: "Power", formula: "P = V × I" },
      { title: "Current Unit", formula: "Measured by Ammeter (Ampere)" }
    ]
  },
  {
    category: "Social Studies",
    notes: [
      { title: "Agriculture", formula: "Primary activity: Farming & Cultivation" },
      { title: "Industry", formula: "Secondary activity: Production & Processing" }
    ]
  },
  {
    category: "App Design",
    notes: [
      { title: "Theme", formula: "Blue + White (Clean & Professional)" },
      { title: "Buttons", formula: "Large & Accessible (Min 44px)" },
      { title: "Navigation", formula: "Simple & Intuitive (Tab Bar)" }
    ]
  }
];

export const SUBJECT_NOTES: Record<string, { title: string; content: string }[]> = {
  science: [
    {
      title: "Chemical Reactions",
      content: `### Chemical Reactions
      
**Combination Reaction:**
A reaction in which two or more substances combine to form a single new substance.

**Decomposition Reaction:**
A reaction in which a single compound breaks down into two or more simpler substances.

**Example:**
\`2H₂ + O₂ → 2H₂O\` (Combination of Hydrogen and Oxygen to form Water)`
    },
    {
      title: "Electricity",
      content: `### Electricity
      
**Ohm's Law:**
The current through a conductor between two points is directly proportional to the voltage across the two points.
**Formula:** \`V = I × R\`

### 📝 Important Questions
1. **Define Oxidation:** The loss of electrons or an increase in oxidation state by a molecule, atom, or ion.
2. **State Ohm's Law:** V = IR, where V is voltage, I is current, and R is resistance.
3. **Difference between Metals & Non-metals:**
   - **Metals:** Malleable, ductile, good conductors of heat and electricity.
   - **Non-metals:** Brittle, non-ductile, poor conductors (except graphite).`
    }
  ],
  social: [
    {
      title: "Resources",
      content: `### Resources
      
Anything that can be used to satisfy a need is a resource.

**Types of Resources:**
1. **Natural Resources:** Drawn from nature and used without much modification (e.g., air, water, soil).
2. **Human-made Resources:** Natural substances become resources only when their original form has been changed (e.g., buildings, bridges, roads).
3. **Human Resources:** Refers to the number (quantity) and abilities (physical and mental) of the people.`
    },
    {
      title: "Democracy",
      content: `### Democracy
      
Democracy is a form of government in which the rulers are elected by the people.

**Key Features:**
- **Free and Fair Elections:** Citizens can choose their representatives without fear.
- **Equal Rights:** Every citizen has an equal say in the decision-making process.
- **Rule of Law:** The government must function according to the constitution.

### 📝 Important Questions
1. **What is democracy?** A system of government by the whole population or all the eligible members of a state, typically through elected representatives.
2. **Types of resources:** Natural, Human-made, and Human resources.`
    }
  ],
  english: [
    {
      title: "Tenses",
      content: `### Tenses
      
Tenses denote the time of an action or state of being.

**1. Present Tense:**
Used to describe actions happening now or habitual actions.
*Example:* I eat an apple.

**2. Past Tense:**
Used to describe actions that have already happened.
*Example:* I ate an apple.

**3. Future Tense:**
Used to describe actions that will happen in the future.
*Example:* I will eat an apple.

### 📝 Important Questions
1. **Identify Tense:** "She has been working since morning." (Answer: Present Perfect Continuous)
2. **Write Paragraph:** Write a short paragraph (50-60 words) about your daily routine using the Simple Present Tense.`
    }
  ],
  art: [
    {
      title: "Basic Sketching",
      content: `### Basic Sketching
      
Sketching is the foundation of all visual arts. It involves creating rough outlines and shapes.

![Sketching Example](https://picsum.photos/seed/sketch/800/400)

**Key Techniques:**
- **Hatching:** Parallel lines to create shade.
- **Cross-hatching:** Intersecting lines for deeper shadows.
- **Stippling:** Using dots to create texture.`
    },
    {
      title: "Color Theory",
      content: `### Color Theory
      
Understanding how colors interact is crucial for any artist.

![Color Wheel](https://picsum.photos/seed/colors/800/400)

**Primary Colors:**
1. Red
2. Blue
3. Yellow

**Secondary Colors:**
- Green (Blue + Yellow)
- Orange (Red + Yellow)
- Purple (Red + Blue)`
    }
  ]
};

export const SAMPLE_QUIZ: Record<string, any[]> = {
  math: [
    {
      id: "m1",
      question: "What is the value of x in the equation 2x + 5 = 15?",
      options: ["5", "10", "7.5", "20"],
      correctAnswer: 0,
      explanation: "2x = 15 - 5 => 2x = 10 => x = 5.",
    },
    {
      id: "m2",
      question: "The sum of the measures of all angles of a triangle is:",
      options: ["90°", "180°", "270°", "360°"],
      correctAnswer: 1,
      explanation: "By the angle sum property of a triangle, the sum is always 180°.",
    },
  ],
  science: [
    {
      id: "s1",
      question: "Which gas is essential for photosynthesis?",
      options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
      correctAnswer: 2,
      explanation: "Plants take in Carbon Dioxide and release Oxygen during photosynthesis.",
    },
  ],
};
