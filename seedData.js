// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// require('dotenv').config();

// // Import models
// const User = require('./models/User');
// const Content = require('./models/Content');
// const Quiz = require('./models/Quiz');
// const Progress = require('./models/Progress');
// const QuizResult = require('./models/QuizResult');

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// const seedData = async () => {
//   try {
//     console.log('🌱 Starting database seeding...');

//     // Clear existing data
//     await User.deleteMany({});
//     await Content.deleteMany({});
//     await Quiz.deleteMany({});
//     await Progress.deleteMany({});
//     await QuizResult.deleteMany({});

//     console.log('✅ Cleared existing data');

//     // Create Users
//     const admin = await User.create({
//       name: 'Admin User',
//       email: 'admin@vidyasetu.com',
//       password: 'password123',
//       role: 'admin',
//       isActive: true
//     });

//     const teacher1 = await User.create({
//       name: 'Dr. Priya Sharma',
//       email: 'priya.sharma@vidyasetu.com',
//       password: 'password123',
//       role: 'teacher',
//       grade: '10',
//       school: 'Delhi Public School',
//       location: 'New Delhi, India',
//       isActive: true
//     });

//     const teacher2 = await User.create({
//       name: 'Prof. Rajesh Kumar',
//       email: 'rajesh.kumar@vidyasetu.com',
//       password: 'password123',
//       role: 'teacher',
//       grade: '12',
//       school: 'Kendriya Vidyalaya',
//       location: 'Mumbai, India',
//       isActive: true
//     });

//     const students = [];
    
//     students.push(await User.create({
//       name: 'Aarav Patel',
//       email: 'aarav.patel@student.com',
//       password: 'password123',
//       role: 'student',
//       grade: '10',
//       school: 'Rural High School',
//       location: 'Gujarat, India',
//       isActive: true
//     }));

//     students.push(await User.create({
//       name: 'Diya Singh',
//       email: 'diya.singh@student.com',
//       password: 'password123',
//       role: 'student',
//       grade: '10',
//       school: 'Government School',
//       location: 'Rajasthan, India',
//       isActive: true
//     }));

//     students.push(await User.create({
//       name: 'Arjun Reddy',
//       email: 'arjun.reddy@student.com',
//       password: 'password123',
//       role: 'student',
//       grade: '12',
//       school: 'Community School',
//       location: 'Telangana, India',
//       isActive: true
//     }));

//     console.log('✅ Created users');

//     // Create Content
//     const contents = await Content.insertMany([
//       // MATHEMATICS - Grade 10
//       {
//         title: 'Introduction to Algebra',
//         description: 'Learn the basics of algebraic expressions and equations with practical examples',
//         subject: 'Mathematics',
//         grade: '10',
//         contentType: 'video',
//         textContent: `# Introduction to Algebra

// ## What is Algebra?
// Algebra is a branch of mathematics that uses letters and symbols to represent numbers and quantities in formulas and equations. It helps us solve problems where some information is unknown.

// ## Key Concepts:
// 1. **Variables**: Letters (x, y, z) that represent unknown values
// 2. **Constants**: Fixed numbers (5, -3, 0.5)
// 3. **Expressions**: Combinations of variables and constants (3x + 5)
// 4. **Equations**: Mathematical statements showing equality (2x + 3 = 11)

// ## Basic Operations:
// - **Addition**: 3x + 2x = 5x
// - **Subtraction**: 5y - 2y = 3y
// - **Multiplication**: 3 × 4x = 12x
// - **Division**: 15x ÷ 3 = 5x

// ## Example Problems:
// 1. Simplify: 4a + 3a - 2a = 5a
// 2. Solve: x + 7 = 15 → x = 8
// 3. Expand: 3(x + 2) = 3x + 6

// ## Real-Life Applications:
// - Calculating shopping discounts
// - Planning budgets
// - Measuring distances and speeds`,
//         difficulty: 'beginner',
//         tags: ['algebra', 'math', 'basics', 'variables', 'equations'],
//         createdBy: teacher1._id,
//         isPublished: true,
//         views: 150,
//         downloads: 45,
//         likes: [students[0]._id, students[1]._id]
//       },
//       {
//         title: 'Quadratic Equations - Complete Guide',
//         description: 'Master quadratic equations, factoring, and the quadratic formula with step-by-step solutions',
//         subject: 'Mathematics',
//         grade: '10',
//         contentType: 'pdf',
//         textContent: `# Quadratic Equations - Complete Guide

// ## Definition
// A quadratic equation is a polynomial equation of degree 2, in the form:
// **ax² + bx + c = 0** where a ≠ 0

// ## Methods to Solve Quadratic Equations:

// ### 1. Factoring Method
// Example: x² - 5x + 6 = 0
// - Factor: (x - 2)(x - 3) = 0
// - Solutions: x = 2 or x = 3

// ### 2. Quadratic Formula
// **x = (-b ± √(b² - 4ac)) / 2a**

// Example: 2x² + 5x - 3 = 0
// - a = 2, b = 5, c = -3
// - x = (-5 ± √(25 + 24)) / 4
// - x = (-5 ± 7) / 4
// - x = 0.5 or x = -3

// ### 3. Completing the Square
// Example: x² + 6x + 5 = 0
// - x² + 6x = -5
// - x² + 6x + 9 = -5 + 9
// - (x + 3)² = 4
// - x + 3 = ±2
// - x = -1 or x = -5

// ## The Discriminant (Δ)
// Δ = b² - 4ac tells us about roots:
// - Δ > 0: Two distinct real roots
// - Δ = 0: One repeated root
// - Δ < 0: No real roots (complex roots)

// ## Applications:
// - Projectile motion in physics
// - Area and optimization problems
// - Business profit calculations
// - Engineering design`,
//         difficulty: 'intermediate',
//         tags: ['quadratic', 'equations', 'algebra', 'factoring', 'formula'],
//         createdBy: teacher1._id,
//         isPublished: true,
//         views: 120,
//         downloads: 38,
//         likes: [students[0]._id]
//       },
//       {
//         title: 'Trigonometry Fundamentals',
//         description: 'Understanding angles, ratios, and their applications in real-world problems',
//         subject: 'Mathematics',
//         grade: '10',
//         contentType: 'text',
//         textContent: `# Trigonometry Fundamentals

// ## Introduction
// Trigonometry is the study of relationships between angles and sides of triangles.

// ## Basic Trigonometric Ratios (SOH-CAH-TOA):
// For a right-angled triangle:
// - **sin θ = Opposite / Hypotenuse**
// - **cos θ = Adjacent / Hypotenuse**
// - **tan θ = Opposite / Adjacent**

// ## Reciprocal Functions:
// - cosec θ = 1/sin θ
// - sec θ = 1/cos θ
// - cot θ = 1/tan θ

// ## Standard Angles:
// | Angle | 0° | 30° | 45° | 60° | 90° |
// |-------|-------|-------|-------|-------|-------|
// | sin | 0 | 1/2 | 1/√2 | √3/2 | 1 |
// | cos | 1 | √3/2 | 1/√2 | 1/2 | 0 |
// | tan | 0 | 1/√3 | 1 | √3 | ∞ |

// ## Important Identities:
// 1. sin²θ + cos²θ = 1
// 2. 1 + tan²θ = sec²θ
// 3. 1 + cot²θ = cosec²θ

// ## Real-Life Applications:
// - Architecture and construction
// - Navigation and GPS
// - Astronomy
// - Computer graphics and animation`,
//         difficulty: 'intermediate',
//         tags: ['trigonometry', 'angles', 'ratios', 'geometry'],
//         createdBy: teacher1._id,
//         isPublished: true,
//         views: 95,
//         downloads: 28
//       },
//       {
//         title: 'Arithmetic Progressions (AP)',
//         description: 'Learn about sequences, series, and finding nth terms in arithmetic progressions',
//         subject: 'Mathematics',
//         grade: '10',
//         contentType: 'video',
//         textContent: `# Arithmetic Progressions

// ## Definition
// An Arithmetic Progression (AP) is a sequence where the difference between consecutive terms is constant.

// Example: 2, 5, 8, 11, 14... (common difference d = 3)

// ## Key Formulas:

// ### 1. nth Term
// **aₙ = a + (n-1)d**
// - a = first term
// - d = common difference
// - n = term number

// Example: Find 10th term of 3, 7, 11, 15...
// - a = 3, d = 4
// - a₁₀ = 3 + (10-1)×4 = 3 + 36 = 39

// ### 2. Sum of n Terms
// **Sₙ = n/2[2a + (n-1)d]**
// or
// **Sₙ = n/2[a + l]** where l is the last term

// Example: Sum of first 20 terms of 5, 10, 15, 20...
// - a = 5, d = 5, n = 20
// - S₂₀ = 20/2[2×5 + (20-1)×5]
// - S₂₀ = 10[10 + 95] = 1050

// ## Practice Problems:
// 1. Is 301 a term in AP: 5, 11, 17, 23...?
// 2. Find sum: 7 + 13 + 19 + ... + 205
// 3. How many terms of AP: 9, 17, 25... sum to 636?

// ## Applications:
// - Savings calculations
// - Seating arrangements
// - Distance-time problems`,
//         difficulty: 'intermediate',
//         tags: ['arithmetic', 'progression', 'sequences', 'series'],
//         createdBy: teacher1._id,
//         isPublished: true,
//         views: 78,
//         downloads: 22
//       },

//       // SCIENCE - Grade 10
//       {
//         title: 'Photosynthesis - The Life Process',
//         description: 'Complete understanding of how plants convert sunlight into chemical energy',
//         subject: 'Science',
//         grade: '10',
//         contentType: 'video',
//         textContent: `# Photosynthesis - The Life Process

// ## Definition
// Photosynthesis is the process by which green plants use sunlight to synthesize food (glucose) from carbon dioxide and water, releasing oxygen as a byproduct.

// ## Chemical Equation:
// **6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂**

// ## Site of Photosynthesis:
// - **Organelle**: Chloroplast
// - **Pigment**: Chlorophyll (green pigment)
// - **Location**: Mainly in leaves

// ## Two Stages:

// ### 1. Light Reaction (Light-dependent)
// - **Where**: Thylakoid membranes of chloroplast
// - **Requirements**: Light, water, chlorophyll
// - **Products**: ATP, NADPH, O₂
// - Water is split: 2H₂O → 4H⁺ + O₂

// ### 2. Dark Reaction (Calvin Cycle)
// - **Where**: Stroma of chloroplast
// - **Requirements**: CO₂, ATP, NADPH
// - **Products**: Glucose (C₆H₁₂O₆)
// - Can occur in light or dark

// ## Factors Affecting Photosynthesis:
// 1. **Light Intensity**: More light = faster rate (up to saturation point)
// 2. **CO₂ Concentration**: Higher CO₂ = increased rate
// 3. **Temperature**: Optimal at 25-35°C
// 4. **Water**: Essential reactant
// 5. **Chlorophyll**: More chlorophyll = better efficiency

// ## Importance:
// - Produces oxygen for all living beings
// - Food source for entire food chain
// - Removes CO₂ from atmosphere
// - Maintains ecological balance

// ## Experiments:
// 1. **Starch test**: Proves light is necessary
// 2. **Destarching**: Shows chlorophyll is essential
// 3. **Oxygen evolution**: Demonstrates O₂ production`,
//         difficulty: 'beginner',
//         tags: ['biology', 'plants', 'photosynthesis', 'chloroplast', 'life-processes'],
//         createdBy: teacher1._id,
//         isPublished: true,
//         views: 200,
//         downloads: 60,
//         likes: [students[1]._id, students[2]._id]
//       },
//       {
//         title: 'Newton\'s Laws of Motion Explained',
//         description: 'Comprehensive guide to the three fundamental laws governing motion and force',
//         subject: 'Science',
//         grade: '10',
//         contentType: 'text',
//         textContent: `# Newton's Laws of Motion

// ## First Law (Law of Inertia)
// **"An object at rest stays at rest, and an object in motion stays in motion with constant velocity unless acted upon by an external force."**

// ### Examples:
// - Passengers jerk forward when bus suddenly stops
// - A ball keeps rolling on smooth surface
// - Seat belts protect during sudden stops

// ### Inertia:
// - Tendency of objects to resist change in motion
// - Depends on mass (heavier = more inertia)

// ## Second Law (F = ma)
// **"Force equals mass times acceleration"**
// **F = ma**

// ### Key Points:
// - Force is proportional to acceleration
// - Direction of force = direction of acceleration
// - SI Unit: Newton (N) = kg⋅m/s²

// ### Examples:
// 1. Pushing a car (heavy mass needs more force)
// 2. Cricket ball acceleration when hit
// 3. Rocket propulsion

// ### Problems:
// - A 5 kg object accelerates at 2 m/s²
// - Force = 5 × 2 = 10 N

// ## Third Law (Action-Reaction)
// **"For every action, there is an equal and opposite reaction"**

// ### Important:
// - Forces always occur in pairs
// - Act on different objects
// - Equal in magnitude, opposite in direction

// ### Examples:
// 1. Walking: Foot pushes ground backward, ground pushes foot forward
// 2. Swimming: Hands push water backward, water pushes body forward
// 3. Rocket launch: Gas expelled downward, rocket pushed upward
// 4. Jumping: Legs push ground down, ground pushes body up

// ## Applications:
// - Vehicle safety systems
// - Sports biomechanics
// - Space exploration
// - Engineering design

// ## Practice Problems:
// 1. Calculate force on 10kg object with acceleration 5m/s²
// 2. Why do we fall forward when bus brakes suddenly?
// 3. Explain how rockets work using third law`,
//         difficulty: 'intermediate',
//         tags: ['physics', 'motion', 'newton', 'force', 'mechanics'],
//         createdBy: teacher2._id,
//         isPublished: true,
//         views: 180,
//         downloads: 52,
//         likes: [students[0]._id, students[2]._id]
//       },
//       {
//         title: 'Chemical Reactions and Equations',
//         description: 'Understanding types of reactions, balancing equations, and chemical changes',
//         subject: 'Science',
//         grade: '10',
//         contentType: 'pdf',
//         textContent: `# Chemical Reactions and Equations

// ## What is a Chemical Reaction?
// A process where substances (reactants) transform into new substances (products) with different properties.

// ## Indicators of Chemical Reaction:
// 1. Change in color
// 2. Evolution of gas
// 3. Formation of precipitate
// 4. Change in temperature
// 5. Change in state

// ## Chemical Equation:
// **Reactants → Products**

// Example: 2H₂ + O₂ → 2H₂O

// ## Balancing Chemical Equations:
// **Law of Conservation of Mass**: Mass is neither created nor destroyed

// ### Steps:
// 1. Count atoms on both sides
// 2. Add coefficients to balance
// 3. Verify all atoms are balanced

// ### Example:
// Unbalanced: Fe + O₂ → Fe₂O₃
// Balanced: 4Fe + 3O₂ → 2Fe₂O₃

// ## Types of Chemical Reactions:

// ### 1. Combination Reaction
// Two or more substances combine to form one product
// - **C + O₂ → CO₂**
// - **CaO + H₂O → Ca(OH)₂**

// ### 2. Decomposition Reaction
// One substance breaks into two or more products
// - **2H₂O → 2H₂ + O₂** (electrolysis)
// - **CaCO₃ → CaO + CO₂** (thermal decomposition)

// ### 3. Displacement Reaction
// More reactive element displaces less reactive one
// - **Zn + CuSO₄ → ZnSO₄ + Cu**
// - **Fe + CuSO₄ → FeSO₄ + Cu**

// ### 4. Double Displacement Reaction
// Exchange of ions between two compounds
// - **NaCl + AgNO₃ → AgCl + NaNO₃**
// - **Na₂SO₄ + BaCl₂ → BaSO₄ + 2NaCl**

// ### 5. Redox Reactions
// Simultaneous oxidation and reduction
// - **CuO + H₂ → Cu + H₂O**
//   (CuO reduced, H₂ oxidized)

// ## Oxidation and Reduction:
// - **Oxidation**: Loss of electrons/gain of oxygen
// - **Reduction**: Gain of electrons/loss of oxygen

// ## Applications:
// - Cooking food
// - Rusting of iron
// - Digestion in body
// - Battery operation
// - Photography`,
//         difficulty: 'intermediate',
//         tags: ['chemistry', 'reactions', 'equations', 'balancing', 'oxidation'],
//         createdBy: teacher1._id,
//         isPublished: true,
//         views: 145,
//         downloads: 41
//       },
//       {
//         title: 'Human Digestive System',
//         description: 'Journey of food through the digestive tract and nutrient absorption',
//         subject: 'Science',
//         grade: '10',
//         contentType: 'video',
//         textContent: `# Human Digestive System

// ## Overview
// The digestive system breaks down food into nutrients that can be absorbed by the body.

// ## Parts of Digestive System:

// ### 1. Mouth (Buccal Cavity)
// - **Mechanical**: Teeth chew food
// - **Chemical**: Saliva contains enzyme salivary amylase
// - **Action**: Starch → Maltose
// - Forms bolus (ball of food)

// ### 2. Esophagus (Food Pipe)
// - Muscular tube (25 cm long)
// - **Peristalsis**: Wave-like muscle contractions
// - Transports food to stomach
// - No digestion occurs here

// ### 3. Stomach
// - J-shaped muscular bag
// - **Gastric juice contains**:
//   - HCl: Kills bacteria, activates pepsin
//   - Pepsin enzyme: Proteins → Peptides
//   - Mucus: Protects stomach lining
// - Food stays 2-4 hours
// - Forms chyme (semi-liquid food)

// ### 4. Small Intestine (6-7 meters)
// **Most important part for digestion and absorption**

// #### Parts:
// a) **Duodenum** (25 cm)
//    - Receives bile from liver
//    - Receives pancreatic juice
   
// b) **Jejunum** (2.5 m)
//    - Major digestion site
   
// c) **Ileum** (3.5 m)
//    - Major absorption site
//    - Has villi for increased surface area

// #### Complete Digestion:
// - **Proteins** → Amino acids
// - **Carbohydrates** → Glucose
// - **Fats** → Fatty acids + Glycerol

// ### 5. Large Intestine (1.5 meters)
// - Absorbs water and minerals
// - Forms solid waste (feces)
// - Has helpful bacteria
// - Stores waste temporarily

// ### 6. Rectum and Anus
// - Storage and elimination of waste

// ## Digestive Glands:

// ### 1. Salivary Glands
// - Secrete saliva
// - Contains salivary amylase

// ### 2. Liver (Largest gland)
// - Produces bile (no enzymes)
// - Bile emulsifies fats
// - Stored in gall bladder

// ### 3. Pancreas
// - Secretes pancreatic juice
// - Contains:
//   - Trypsin (protein digestion)
//   - Lipase (fat digestion)
//   - Amylase (starch digestion)

// ## Summary of Digestion:

// | Food | Enzyme | Product |
// |------|--------|---------|
// | Starch | Amylase | Glucose |
// | Protein | Pepsin, Trypsin | Amino acids |
// | Fats | Lipase + Bile | Fatty acids |

// ## Time for Digestion:
// - Total: 24-72 hours
// - Stomach: 2-4 hours
// - Small intestine: 3-5 hours
// - Large intestine: 10-12 hours

// ## Health Tips:
// - Chew food properly
// - Drink adequate water
// - Eat fiber-rich food
// - Regular meals
// - Avoid junk food`,
//         difficulty: 'intermediate',
//         tags: ['biology', 'digestion', 'human-body', 'nutrition', 'enzymes'],
//         createdBy: teacher2._id,
//         isPublished: true,
//         views: 167,
//         downloads: 48
//       },
//       {
//         title: 'Electricity - Current, Resistance & Circuits',
//         description: 'Master the fundamentals of electric current, Ohm\'s law, and circuit analysis',
//         subject: 'Science',
//         grade: '10',
//         contentType: 'text',
//         textContent: `# Electricity Fundamentals

// ## Electric Current
// **Definition**: Flow of electric charge through a conductor

// ### Formula:
// **I = Q/t**
// - I = Current (Ampere, A)
// - Q = Charge (Coulomb, C)
// - t = Time (seconds, s)

// ### Direction:
// - Conventional current: Positive to negative
// - Electron flow: Negative to positive

// ## Electric Potential & Voltage
// **Potential Difference (V)**: Work done to move unit charge
// **V = W/Q**
// - V = Voltage (Volt, V)
// - W = Work (Joule, J)
// - Q = Charge (Coulomb, C)

// ## Ohm's Law
// **"Current through conductor is directly proportional to voltage across it"**

// ### Formula:
// **V = IR**
// - V = Voltage (V)
// - I = Current (A)
// - R = Resistance (Ω)

// ### Example:
// If V = 12V and R = 4Ω, then:
// I = V/R = 12/4 = 3A

// ## Resistance
// **Opposition to flow of current**

// ### Factors Affecting Resistance:
// 1. **Length (l)**: R ∝ l (longer = more resistance)
// 2. **Area (A)**: R ∝ 1/A (thicker = less resistance)
// 3. **Material**: Different resistivity (ρ)
// 4. **Temperature**: Higher temp = more resistance

// ### Formula:
// **R = ρl/A**

// ## Series and Parallel Circuits:

// ### Series Circuit:
// - **Current**: Same through all (I₁ = I₂ = I₃)
// - **Voltage**: Divides (V = V₁ + V₂ + V₃)
// - **Resistance**: R_total = R₁ + R₂ + R₃

// ### Parallel Circuit:
// - **Current**: Divides (I = I₁ + I₂ + I₃)
// - **Voltage**: Same across all (V₁ = V₂ = V₃)
// - **Resistance**: 1/R_total = 1/R₁ + 1/R₂ + 1/R₃

// ## Electric Power
// **Rate of doing work or consuming energy**

// ### Formulas:
// - **P = VI** (Power = Voltage × Current)
// - **P = I²R** (using Ohm's law)
// - **P = V²/R**
// - Unit: Watt (W) or Joule/second

// ## Electric Energy
// **E = P × t = VIt**
// - Commercial unit: kWh (kilowatt-hour)
// - 1 kWh = 1000W × 3600s = 3.6 × 10⁶ J

// ### Example:
// 100W bulb for 10 hours:
// Energy = 100W × 10h = 1000Wh = 1 kWh = 1 Unit

// ## Heating Effect of Current
// **H = I²Rt** (Joule's Law)
// - Heat produced in conductor
// - Used in: Heaters, irons, bulbs, fuses

// ## Practical Applications:
// 1. **Household wiring**: Parallel connection
// 2. **Fuse**: Protects from overloading
// 3. **MCB**: Modern circuit breaker
// 4. **Earthing**: Safety measure

// ## Important Points:
// - Voltmeter: Connected in parallel (high resistance)
// - Ammeter: Connected in series (low resistance)
// - Good conductors: Copper, aluminum, silver
// - Insulators: Rubber, plastic, wood`,
//         difficulty: 'intermediate',
//         tags: ['physics', 'electricity', 'current', 'ohm-law', 'circuits'],
//         createdBy: teacher1._id,
//         isPublished: true,
//         views: 134,
//         downloads: 39
//       },

//       // ENGLISH - Grade 10
//       {
//         title: 'English Grammar Essentials',
//         description: 'Complete guide to parts of speech, tenses, and sentence structure',
//         subject: 'English',
//         grade: '10',
//         contentType: 'text',
//         textContent: `# English Grammar Essentials

// ## Parts of Speech

// ### 1. Noun
// Person, place, thing, or idea
// - **Common**: boy, city, book
// - **Proper**: Ram, Delhi, Monday
// - **Collective**: team, family, crowd
// - **Abstract**: love, happiness, freedom

// ### 2. Pronoun
// Replaces noun
// - **Personal**: I, you, he, she, it, we, they
// - **Possessive**: my, your, his, her, our, their
// - **Reflexive**: myself, yourself, himself
// - **Demonstrative**: this, that, these, those

// ### 3. Verb
// Action or state of being
// - **Action**: run, write, think
// - **Linking**: is, am, are, was, were
// - **Helping**: have, has, will, shall, can, may

// ### 4. Adjective
// Describes noun
// - **Quality**: beautiful, tall, smart
// - **Quantity**: many, few, some
// - **Demonstrative**: this, that, these, those

// ### 5. Adverb
// Modifies verb, adjective, or another adverb
// - **Manner**: quickly, slowly, carefully
// - **Time**: now, yesterday, soon
// - **Place**: here, there, everywhere
// - **Frequency**: always, often, never

// ### 6. Preposition
// Shows relationship
// - in, on, at, by, with, from, to, under, over

// ### 7. Conjunction
// Connects words or clauses
// - **Coordinating**: and, but, or, so, yet
// - **Subordinating**: because, although, if, when

// ### 8. Interjection
// Expresses emotion
// - Wow! Oh! Alas! Hurray! Ouch!

// ## Tenses

// ### Present Tense:
// 1. **Simple Present**: I write
// 2. **Present Continuous**: I am writing
// 3. **Present Perfect**: I have written
// 4. **Present Perfect Continuous**: I have been writing

// ### Past Tense:
// 1. **Simple Past**: I wrote
// 2. **Past Continuous**: I was writing
// 3. **Past Perfect**: I had written
// 4. **Past Perfect Continuous**: I had been writing

// ### Future Tense:
// 1. **Simple Future**: I will write
// 2. **Future Continuous**: I will be writing
// 3. **Future Perfect**: I will have written
// 4. **Future Perfect Continuous**: I will have been writing

// ## Sentence Types:

// ### By Structure:
// 1. **Simple**: One independent clause
//    - "I love reading."
   
// 2. **Compound**: Two independent clauses
//    - "I love reading, and she loves writing."
   
// 3. **Complex**: Independent + dependent clause
//    - "I love reading because it's educational."
   
// 4. **Compound-Complex**: Multiple independent + dependent
//    - "I love reading, and she loves writing because it's creative."

// ### By Function:
// 1. **Declarative**: Makes statement (.)
// 2. **Interrogative**: Asks question (?)
// 3. **Imperative**: Gives command (.)
// 4. **Exclamatory**: Shows emotion (!)

// ## Active and Passive Voice:

// ### Active: Subject performs action
// - "The cat chased the mouse."

// ### Passive: Subject receives action
// - "The mouse was chased by the cat."

// ## Direct and Indirect Speech:

// ### Direct: Exact words
// - She said, "I am happy."

// ### Indirect: Reported speech
// - She said that she was happy.

// ## Common Errors to Avoid:
// 1. Subject-verb agreement
// 2. Pronoun-antecedent agreement
// 3. Misplaced modifiers
// 4. Run-on sentences
// 5. Sentence fragments`,
//         difficulty: 'beginner',
//         tags: ['grammar', 'english', 'language', 'tenses', 'parts-of-speech'],
//         createdBy: teacher2._id,
//         isPublished: true,
//         views: 95,
//         downloads: 30
//       },
//       {
//         title: 'Writing Skills - Essays and Letters',
//         description: 'Learn to write compelling essays, formal and informal letters with examples',
//         subject: 'English',
//         grade: '10',
//         contentType: 'pdf',
//         textContent: `# Writing Skills Guide

// ## Essay Writing

// ### Structure of an Essay:

// #### 1. Introduction (Opening)
// - Hook: Grab reader's attention
// - Background information
// - Thesis statement: Main idea

// #### 2. Body (3-4 paragraphs)
// - Each paragraph = one main point
// - Topic sentence
// - Supporting details and examples
// - Evidence and explanation
// - Transition to next paragraph

// #### 3. Conclusion (Closing)
// - Restate thesis in new words
// - Summarize main points
// - Final thought or call to action

// ### Types of Essays:

// #### Narrative Essay
// Tells a story
// **Example Topic**: "A Memorable Day in My Life"

// #### Descriptive Essay
// Describes person, place, thing
// **Example Topic**: "My Favorite Place"

// #### Argumentative Essay
// Presents argument with evidence
// **Example Topic**: "Should Students Wear Uniforms?"

// #### Expository Essay
// Explains or informs
// **Example Topic**: "Benefits of Reading"

// ### Tips for Good Essays:
// 1. Plan before writing (outline)
// 2. Use varied vocabulary
// 3. Write clear topic sentences
// 4. Provide specific examples
// 5. Use transition words
// 6. Proofread and edit

// ## Letter Writing

// ### Formal Letter Format:

// \`\`\`
// Your Address
// City, PIN

// Date

// Receiver's Name
// Receiver's Address
// City, PIN

// Subject: [Purpose of letter]

// Dear Sir/Madam,

// [Opening paragraph: Introduction and purpose]

// [Body paragraphs: Details and information]

// [Closing paragraph: Request or conclusion]

// Yours sincerely/faithfully,
// Your Name
// \`\`\`

// ### Types of Formal Letters:

// #### 1. Application Letter
// - Job application
// - School admission
// - Leave application

// #### 2. Complaint Letter
// - Product/service complaint
// - Civic issues

// #### 3. Official Letter
// - To principal/editor/authorities

// ### Informal Letter Format:

// \`\`\`
// Your Address
// City, PIN

// Date

// Dear [Name],

// [Opening: Friendly greeting and purpose]

// [Body: Share news, experiences, feelings]

// [Closing: Warm wishes]

// Your loving friend/cousin,
// Your Name
// \`\`\`

// ### Types of Informal Letters:
// - To friends
// - To family members
// - Thank you letters
// - Invitation letters

// ## Article Writing

// ### Structure:
// 1. **Heading**: Catchy title
// 2. **By-line**: Author name
// 3. **Opening**: Engaging introduction
// 4. **Body**: Main content (2-3 paragraphs)
// 5. **Conclusion**: Summary or message

// ### Topics Examples:
// - "Importance of Environmental Conservation"
// - "Role of Technology in Education"
// - "Healthy Lifestyle for Students"

// ## Report Writing

// ### Format:
// 1. **Heading**: What, where, when
// 2. **By-line**: Reporter's name
// 3. **Introduction**: Brief overview
// 4. **Body**: Details in logical order
// 5. **Conclusion**: Outcome or summary

// ### Example Topics:
// - School event report
// - Accident report
// - Sports day report

// ## Notice Writing

// ### Format:
// \`\`\`
// [Organization Name]
// NOTICE

// Date: [DD/MM/YYYY]
// Subject: [Brief subject]

// [Body: Who, what, when, where, why]

// [Name]
// [Designation]
// \`\`\`

// ### Key Points:
// - Keep it brief (50-80 words)
// - Use simple language
// - Put in a box
// - Mention all important details

// ## Useful Phrases:

// ### Opening:
// - I am writing to...
// - With reference to...
// - I would like to inform you...

// ### Connecting:
// - Moreover, Furthermore
// - However, Nevertheless
// - In addition, Besides
// - Therefore, Consequently

// ### Closing:
// - I look forward to...
// - Thanking you in anticipation
// - Hoping for a favorable response
// - Please feel free to contact me`,
//         difficulty: 'intermediate',
//         tags: ['writing', 'essays', 'letters', 'english', 'composition'],
//         createdBy: teacher2._id,
//         isPublished: true,
//         views: 112,
//         downloads: 34
//       },

//       // SOCIAL STUDIES - Grade 10
//       {
//         title: 'Indian Freedom Struggle - Complete Overview',
//         description: 'Comprehensive study of India\'s independence movement from 1857 to 1947',
//         subject: 'Social Studies',
//         grade: '10',
//         contentType: 'video',
//         textContent: `# Indian Freedom Struggle (1857-1947)

// ## First War of Independence (1857)

// ### Causes:
// 1. **Political**: Doctrine of Lapse, annexations
// 2. **Economic**: British exploitation, high taxes
// 3. **Social**: Interference in customs
// 4. **Military**: Discrimination, low pay
// 5. **Immediate**: Greased cartridges issue

// ### Key Leaders:
// - Mangal Pandey (Bengal)
// - Rani Lakshmibai (Jhansi)
// - Bahadur Shah Zafar (Delhi)
// - Nana Saheb (Kanpur)
// - Tantia Tope (Central India)

// ### Result:
// - Revolt suppressed
// - End of East India Company rule
// - Direct British Crown rule (1858)

// ## Early Nationalist Movement

// ### Formation of Indian National Congress (1885)
// - Founder: A.O. Hume
// - First President: W.C. Bonnerjee
// - Moderate Phase (1885-1905)
// - Leaders: Dadabhai Naoroji, Gopal Krishna Gokhale

// ### Partition of Bengal (1905)
// - By Lord Curzon
// - Divided on religious lines
// - Led to Swadeshi Movement
// - Annulled in 1911

// ## Extremist Phase (1905-1919)

// ### Leaders:
// - Bal Gangadhar Tilak ("Swaraj is my birthright")
// - Bipin Chandra Pal
// - Lala Lajpat Rai
// - These three known as "Lal-Bal-Pal"

// ### Revolutionary Movement:
// - Bhagat Singh, Sukhdev, Rajguru
// - Chandrashekhar Azad
// - Subhash Chandra Bose (INA)

// ## Gandhian Era (1919-1947)

// ### 1. Non-Cooperation Movement (1920-22)
// **Causes**: Jallianwala Bagh Massacre (1919), Khilafat issue
// **Methods**: 
// - Boycott of foreign goods
// - Surrender of titles
// - Non-payment of taxes
// **Result**: Stopped after Chauri Chaura incident

// ### 2. Civil Disobedience Movement (1930-34)
// **Started**: Dandi March (Salt Satyagraha)
// - Gandhi walked 240 miles to make salt
// - Breaking salt law
// - Mass participation

// ### 3. Quit India Movement (1942)
// **Slogan**: "Do or Die"
// **Demand**: Immediate independence
// **Result**: Leaders arrested, mass protests

// ## Important Events:

// ### Jallianwala Bagh Massacre (1919)
// - General Dyer ordered firing
// - 1000+ killed in Amritsar
// - Nationwide protests

// ### Simon Commission (1928)
// - All British members
// - Indians boycotted with "Simon Go Back"

// ### Poorna Swaraj (1930)
// - Complete independence declared
// - January 26, 1930
// - Tricolor flag hoisted

// ### Cripps Mission (1942)
// - Promised dominion status
// - Rejected by Congress

// ### Cabinet Mission (1946)
// - Plan for united India
// - Failed due to differences

// ## Path to Independence

// ### August 1947:
// - India gained independence on August 15
// - Partition into India and Pakistan
// - Mountbatten as last Viceroy
// - Jawaharlal Nehru - First PM
// - Dr. Rajendra Prasad - First President

// ## Legacy:

// ### Freedom Fighters:
// - Mahatma Gandhi (Father of Nation)
// - Jawaharlal Nehru (Chacha Nehru)
// - Sardar Vallabhbhai Patel (Iron Man)
// - Subhash Chandra Bose (Netaji)
// - Dr. B.R. Ambedkar (Architect of Constitution)

// ### Impact:
// - Democracy established
// - Constitution adopted (1950)
// - Inspiration for other colonies
// - Non-violence as powerful tool

// ## Important Dates:
// - 1857: First War of Independence
// - 1885: Indian National Congress formed
// - 1905: Partition of Bengal
// - 1919: Jallianwala Bagh Massacre
// - 1920: Non-Cooperation Movement
// - 1930: Dandi March, Civil Disobedience
// - 1942: Quit India Movement
// - 1947: Independence on August 15`,
//         difficulty: 'intermediate',
//         tags: ['history', 'independence', 'india', 'freedom-struggle', 'gandhi'],
//         createdBy: teacher2._id,
//         isPublished: true,
//         views: 140,
//         downloads: 42,
//         likes: [students[1]._id]
//       },
//       {
//         title: 'Democracy and Diversity',
//         description: 'Understanding democratic principles, rights, and challenges in diverse societies',
//         subject: 'Social Studies',
//         grade: '10',
//         contentType: 'text',
//         textContent: `# Democracy and Diversity

// ## What is Democracy?

// ### Definition:
// Government of the people, by the people, for the people

// ### Key Features:
// 1. **Popular Sovereignty**: People are source of power
// 2. **Free and Fair Elections**: Regular elections
// 3. **Rule of Law**: Everyone equal before law
// 4. **Fundamental Rights**: Protected freedoms
// 5. **Independent Judiciary**: Fair justice system
// 6. **Freedom of Press**: Media independence

// ## Types of Democracy:

// ### 1. Direct Democracy
// - People directly participate in decisions
// - Example: Ancient Athens, Swiss cantons
// - Suitable for small populations

// ### 2. Representative Democracy
// - People elect representatives
// - Example: India, USA, UK
// - Suitable for large populations

// ## Social Diversity

// ### Sources of Diversity:
// 1. **Religious**: Hindu, Muslim, Christian, etc.
// 2. **Linguistic**: 22 official languages in India
// 3. **Regional**: Different states and cultures
// 4. **Caste**: Traditional social divisions
// 5. **Economic**: Rich and poor classes

// ### Managing Diversity:

// #### Belgium Model:
// - Power shared among linguistic groups
// - Federal system
// - Equal representation in government

// #### Sri Lanka Problem:
// - Majoritarianism led to conflict
// - Tamil minority discriminated
// - Led to civil war

// ### Indian Approach:
// 1. **Secularism**: No official religion
// 2. **Federalism**: Power distribution
// 3. **Reservation**: For disadvantaged groups
// 4. **Cultural rights**: Protected minorities

// ## Power Sharing

// ### Why Share Power?

// #### Prudential Reasons:
// - Reduces conflict
// - Ensures stability
// - Better governance

// #### Moral Reasons:
// - Right thing to do
// - Everyone deserves say
// - Respects diversity

// ### Forms of Power Sharing:

// #### 1. Horizontal Distribution
// - **Legislature**: Makes laws (Parliament)
// - **Executive**: Implements laws (Government)
// - **Judiciary**: Interprets laws (Courts)
// - Checks and balances

// #### 2. Vertical Distribution (Federalism)
// - **Central Government**: National issues
// - **State Government**: Regional issues
// - **Local Government**: Local issues (Panchayats)

// #### 3. Social Division
// - Different groups share power
// - Minority rights protected
// - Community government (Belgium)

// #### 4. Political Parties & Pressure Groups
// - Multiple parties compete
// - Interest groups voice concerns
// - Civil society participation

// ## Challenges to Democracy:

// ### 1. Inequality
// - Economic disparities
// - Social discrimination
// - Gender inequality

// ### 2. Corruption
// - Misuse of power
// - Bribery and nepotism
// - Lack of transparency

// ### 3. Communalism
// - Religious conflicts
// - Vote bank politics
// - Polarization

// ### 4. Casteism
// - Caste-based discrimination
// - Violence against lower castes
// - Reservation debates

// ### 5. Regionalism
// - Demands for separate states
// - Regional parties
// - Inter-state conflicts

// ## Strengthening Democracy:

// ### 1. Political Reforms
// - Electoral reforms
// - Right to Information (RTI)
// - Lokpal for corruption

// ### 2. Social Reforms
// - Education for all
// - Women empowerment
// - Eradication of untouchability

// ### 3. Economic Reforms
// - Poverty alleviation
// - Employment generation
// - Inclusive growth

// ### 4. Citizen Participation
// - Active voting
// - Public debates
// - Social movements

// ## Rights in Democracy:

// ### Fundamental Rights (India):
// 1. **Right to Equality**
// 2. **Right to Freedom**
// 3. **Right against Exploitation**
// 4. **Right to Freedom of Religion**
// 5. **Cultural and Educational Rights**
// 6. **Right to Constitutional Remedies**

// ### Directive Principles:
// - Guidelines for government
// - Social and economic rights
// - Not enforceable by courts

// ## Importance of Democracy:

// ### Advantages:
// 1. Represents people's will
// 2. Protects fundamental rights
// 3. Peaceful conflict resolution
// 4. Promotes equality
// 5. Allows correction of mistakes
// 6. Improves decision quality
// 7. Enhances dignity

// ### Limitations:
// 1. Slow decision-making
// 2. Not always wisest decisions
// 3. Corruption and malpractice
// 4. Role of money and power
// 5. Elected leaders may not serve

// ## Conclusion:
// Democracy is not perfect but best available system. Requires active participation, tolerance, and constant improvement.`,
//         difficulty: 'intermediate',
//         tags: ['democracy', 'civics', 'diversity', 'rights', 'government'],
//         createdBy: teacher1._id,
//         isPublished: true,
//         views: 89,
//         downloads: 26
//       },

//       // COMPUTER SCIENCE - Grade 10
//       {
//         title: 'Introduction to Python Programming',
//         description: 'Learn Python basics - variables, data types, operators, and control structures',
//         subject: 'Computer Science',
//         grade: '10',
//         contentType: 'text',
//         textContent: `# Introduction to Python Programming

// ## Why Python?
// - Easy to learn and read
// - Versatile (web, data science, AI)
// - Large community support
// - Extensive libraries
// - Free and open-source

// ## Getting Started

// ### Python Basics:

// #### 1. Variables and Data Types

// \`\`\`python
// # Variables (no declaration needed)
// name = "Aarav"          # String
// age = 15                # Integer
// height = 5.6            # Float
// is_student = True       # Boolean

// # Print output
// print("Hello, World!")
// print("My name is", name)
// \`\`\`

// #### 2. Data Types

// **Numeric Types:**
// - **int**: Whole numbers (5, -10, 1000)
// - **float**: Decimal numbers (3.14, -0.5)
// - **complex**: Complex numbers (3+4j)

// **Sequence Types:**
// - **str**: Strings ("Hello")
// - **list**: [1, 2, 3, "four"]
// - **tuple**: (1, 2, 3) - immutable

// **Other Types:**
// - **bool**: True/False
// - **dict**: {"name": "Aarav", "age": 15}
// - **set**: {1, 2, 3} - unique elements

// ### 3. Operators

// #### Arithmetic:
// \`\`\`python
// a, b = 10, 3
// print(a + b)    # Addition: 13
// print(a - b)    # Subtraction: 7
// print(a * b)    # Multiplication: 30
// print(a / b)    # Division: 3.333...
// print(a // b)   # Floor division: 3
// print(a % b)    # Modulus: 1
// print(a ** b)   # Power: 1000
// \`\`\`

// #### Comparison:
// \`\`\`python
// print(10 == 10)   # Equal: True
// print(10 != 5)    # Not equal: True
// print(10 > 5)     # Greater than: True
// print(10 <= 15)   # Less than or equal: True
// \`\`\`

// #### Logical:
// \`\`\`python
// print(True and False)  # False
// print(True or False)   # True
// print(not True)        # False
// \`\`\`

// ## Control Structures

// ### 1. If-Else Statements

// \`\`\`python
// age = 16

// if age >= 18:
//     print("You can vote")
// elif age >= 13:
//     print("You are a teenager")
// else:
//     print("You are a child")
// \`\`\`

// ### 2. Loops

// #### For Loop:
// \`\`\`python
// # Loop through range
// for i in range(5):
//     print(i)  # Prints 0, 1, 2, 3, 4

// # Loop through list
// fruits = ["apple", "banana", "cherry"]
// for fruit in fruits:
//     print(fruit)

// # Loop through string
// for char in "Python":
//     print(char)
// \`\`\`

// #### While Loop:
// \`\`\`python
// count = 0
// while count < 5:
//     print(count)
//     count += 1
// \`\`\`

// ### 3. Break and Continue

// \`\`\`python
// # Break: Exit loop
// for i in range(10):
//     if i == 5:
//         break
//     print(i)  # Prints 0-4

// # Continue: Skip iteration
// for i in range(5):
//     if i == 2:
//         continue
//     print(i)  # Prints 0,1,3,4
// \`\`\`

// ## Functions

// ### Defining Functions:

// \`\`\`python
// def greet(name):
//     """Function to greet person"""
//     return f"Hello, {name}!"

// # Call function
// message = greet("Aarav")
// print(message)  # Hello, Aarav!

// # Function with default parameter
// def power(base, exponent=2):
//     return base ** exponent

// print(power(5))      # 25 (5²)
// print(power(5, 3))   # 125 (5³)
// \`\`\`

// ## Lists and List Operations

// \`\`\`python
// # Create list
// numbers = [1, 2, 3, 4, 5]
// mixed = [1, "two", 3.0, True]

// # Access elements
// print(numbers[0])    # 1 (first)
// print(numbers[-1])   # 5 (last)
// print(numbers[1:3])  # [2, 3] (slice)

// # Modify list
// numbers.append(6)         # Add to end
// numbers.insert(0, 0)      # Insert at position
// numbers.remove(3)         # Remove value
// numbers.pop()             # Remove last
// numbers.sort()            # Sort list
// numbers.reverse()         # Reverse list

// # List comprehension
// squares = [x**2 for x in range(5)]
// print(squares)  # [0, 1, 4, 9, 16]
// \`\`\`

// ## Strings

// \`\`\`python
// text = "Python Programming"

// # String methods
// print(text.upper())         # PYTHON PROGRAMMING
// print(text.lower())         # python programming
// print(text.split())         # ['Python', 'Programming']
// print(text.replace("P", "J"))  # Jython Jrogramming
// print(len(text))            # 18
// print("Python" in text)     # True

// # String formatting
// name = "Aarav"
// age = 15
// print(f"My name is {name} and I am {age}")
// \`\`\`

// ## Dictionary

// \`\`\`python
// # Create dictionary
// student = {
//     "name": "Aarav",
//     "age": 15,
//     "grade": "10th",
//     "subjects": ["Math", "Science"]
// }

// # Access values
// print(student["name"])       # Aarav
// print(student.get("age"))    # 15

// # Modify dictionary
// student["age"] = 16          # Update
// student["school"] = "DPS"    # Add new
// del student["grade"]         # Remove

// # Loop through dictionary
// for key, value in student.items():
//     print(f"{key}: {value}")
// \`\`\`

// ## Input and Output

// \`\`\`python
// # Input from user
// name = input("Enter your name: ")
// age = int(input("Enter your age: "))

// # Output
// print(f"Hello {name}, you are {age} years old")

// # File operations
// # Write to file
// with open("data.txt", "w") as file:
//     file.write("Hello, Python!")

// # Read from file
// with open("data.txt", "r") as file:
//     content = file.read()
//     print(content)
// \`\`\`

// ## Practice Programs

// ### 1. Check Even/Odd:
// \`\`\`python
// num = int(input("Enter number: "))
// if num % 2 == 0:
//     print("Even")
// else:
//     print("Odd")
// \`\`\`

// ### 2. Factorial:
// \`\`\`python
// def factorial(n):
//     if n == 0:
//         return 1
//     else:
//         return n * factorial(n-1)

// print(factorial(5))  # 120
// \`\`\`

// ### 3. Fibonacci Series:
// \`\`\`python
// def fibonacci(n):
//     a, b = 0, 1
//     for _ in range(n):
//         print(a, end=" ")
//         a, b = b, a + b

// fibonacci(10)  # 0 1 1 2 3 5 8 13 21 34
// \`\`\`

// ## Best Practices:
// 1. Use meaningful variable names
// 2. Add comments for clarity
// 3. Follow PEP 8 style guide
// 4. Use functions for reusable code
// 5. Handle exceptions properly
// 6. Test your code thoroughly`,
//         difficulty: 'beginner',
//         tags: ['python', 'programming', 'coding', 'computer-science', 'basics'],
//         createdBy: teacher1._id,
//         isPublished: true,
//         views: 156,
//         downloads: 47
//       }
//     ]);

//     console.log('✅ Created content');

//     // Create Quizzes
//     const quizzes = await Quiz.insertMany([
//       {
//         title: 'Algebra Fundamentals Quiz',
//         description: 'Test your knowledge of basic algebra concepts',
//         subject: 'Mathematics',
//         grade: '10',
//         duration: 15,
//         passingScore: 60,
//         difficulty: 'beginner',
//         createdBy: teacher1._id,
//         isPublished: true,
//         attempts: 45,
//         questions: [
//           {
//             questionText: 'What is 2x + 3 = 11? Solve for x.',
//             questionType: 'mcq',
//             options: [
//               { text: 'x = 3', isCorrect: false },
//               { text: 'x = 4', isCorrect: true },
//               { text: 'x = 5', isCorrect: false },
//               { text: 'x = 6', isCorrect: false }
//             ],
//             correctAnswer: 'x = 4',
//             explanation: 'Subtract 3 from both sides: 2x = 8, then divide by 2: x = 4',
//             points: 1
//           },
//           {
//             questionText: 'Is (x + 2)(x - 2) = x² - 4?',
//             questionType: 'true-false',
//             correctAnswer: 'True',
//             explanation: 'This is the difference of squares formula',
//             points: 1
//           },
//           {
//             questionText: 'Simplify: 3x + 5x',
//             questionType: 'short-answer',
//             correctAnswer: '8x',
//             explanation: 'Combine like terms: 3x + 5x = 8x',
//             points: 1
//           }
//         ]
//       },
//       {
//         title: 'Photosynthesis Quiz',
//         description: 'Test your understanding of photosynthesis',
//         subject: 'Science',
//         grade: '10',
//         duration: 10,
//         passingScore: 70,
//         difficulty: 'beginner',
//         createdBy: teacher1._id,
//         isPublished: true,
//         attempts: 38,
//         questions: [
//           {
//             questionText: 'Which organelle is responsible for photosynthesis?',
//             questionType: 'mcq',
//             options: [
//               { text: 'Mitochondria', isCorrect: false },
//               { text: 'Chloroplast', isCorrect: true },
//               { text: 'Nucleus', isCorrect: false },
//               { text: 'Ribosome', isCorrect: false }
//             ],
//             correctAnswer: 'Chloroplast',
//             explanation: 'Chloroplasts contain chlorophyll and are the site of photosynthesis',
//             points: 1
//           },
//           {
//             questionText: 'Does photosynthesis produce oxygen?',
//             questionType: 'true-false',
//             correctAnswer: 'True',
//             explanation: 'Oxygen is released as a byproduct of photosynthesis',
//             points: 1
//           }
//         ]
//       },
//       {
//         title: 'Quadratic Equations Challenge',
//         description: 'Advanced quiz on quadratic equations',
//         subject: 'Mathematics',
//         grade: '10',
//         duration: 20,
//         passingScore: 75,
//         difficulty: 'advanced',
//         createdBy: teacher1._id,
//         isPublished: true,
//         attempts: 22,
//         questions: [
//           {
//             questionText: 'Solve: x² - 5x + 6 = 0',
//             questionType: 'mcq',
//             options: [
//               { text: 'x = 2, 3', isCorrect: true },
//               { text: 'x = 1, 6', isCorrect: false },
//               { text: 'x = -2, -3', isCorrect: false },
//               { text: 'x = 0, 5', isCorrect: false }
//             ],
//             correctAnswer: 'x = 2, 3',
//             explanation: 'Factor: (x-2)(x-3) = 0, so x = 2 or x = 3',
//             points: 2
//           },
//           {
//             questionText: 'What is the discriminant of x² + 4x + 4 = 0?',
//             questionType: 'short-answer',
//             correctAnswer: '0',
//             explanation: 'Discriminant = b² - 4ac = 16 - 16 = 0',
//             points: 2
//           }
//         ]
//       }
//     ]);

//     console.log('✅ Created quizzes');

//     // Create Progress for students
//     const progressData = [];
    
//     // Student 0 progress
//     progressData.push({
//       student: students[0]._id,
//       content: contents[0]._id,
//       status: 'completed',
//       progressPercentage: 100,
//       timeSpent: 45,
//       completedAt: new Date(),
//       lastAccessedAt: new Date()
//     });

//     progressData.push({
//       student: students[0]._id,
//       content: contents[1]._id,
//       status: 'in-progress',
//       progressPercentage: 65,
//       timeSpent: 30,
//       lastAccessedAt: new Date()
//     });

//     // Student 1 progress
//     progressData.push({
//       student: students[1]._id,
//       content: contents[2]._id,
//       status: 'completed',
//       progressPercentage: 100,
//       timeSpent: 50,
//       completedAt: new Date(),
//       lastAccessedAt: new Date()
//     });

//     progressData.push({
//       student: students[1]._id,
//       content: contents[0]._id,
//       status: 'in-progress',
//       progressPercentage: 40,
//       timeSpent: 20,
//       lastAccessedAt: new Date()
//     });

//     await Progress.insertMany(progressData);
//     console.log('✅ Created progress records');

//     // Create Quiz Results
//     const quizResults = await QuizResult.insertMany([
//       {
//         quiz: quizzes[0]._id,
//         student: students[0]._id,
//         score: 3,
//         totalPoints: 3,
//         percentage: 100,
//         passed: true,
//         timeTaken: 12,
//         attemptNumber: 1,
//         startedAt: new Date(Date.now() - 3600000),
//         submittedAt: new Date(),
//         answers: [
//           { questionId: quizzes[0].questions[0]._id, userAnswer: 'x = 4', isCorrect: true, pointsEarned: 1 },
//           { questionId: quizzes[0].questions[1]._id, userAnswer: 'True', isCorrect: true, pointsEarned: 1 },
//           { questionId: quizzes[0].questions[2]._id, userAnswer: '8x', isCorrect: true, pointsEarned: 1 }
//         ]
//       },
//       {
//         quiz: quizzes[1]._id,
//         student: students[1]._id,
//         score: 2,
//         totalPoints: 2,
//         percentage: 100,
//         passed: true,
//         timeTaken: 8,
//         attemptNumber: 1,
//         startedAt: new Date(Date.now() - 7200000),
//         submittedAt: new Date(),
//         answers: [
//           { questionId: quizzes[1].questions[0]._id, userAnswer: 'Chloroplast', isCorrect: true, pointsEarned: 1 },
//           { questionId: quizzes[1].questions[1]._id, userAnswer: 'True', isCorrect: true, pointsEarned: 1 }
//         ]
//       },
//       {
//         quiz: quizzes[0]._id,
//         student: students[1]._id,
//         score: 2,
//         totalPoints: 3,
//         percentage: 66.67,
//         passed: true,
//         timeTaken: 14,
//         attemptNumber: 1,
//         startedAt: new Date(Date.now() - 5400000),
//         submittedAt: new Date(),
//         answers: [
//           { questionId: quizzes[0].questions[0]._id, userAnswer: 'x = 4', isCorrect: true, pointsEarned: 1 },
//           { questionId: quizzes[0].questions[1]._id, userAnswer: 'False', isCorrect: false, pointsEarned: 0 },
//           { questionId: quizzes[0].questions[2]._id, userAnswer: '8x', isCorrect: true, pointsEarned: 1 }
//         ]
//       }
//     ]);

//     console.log('✅ Created quiz results');

//     console.log('\n🎉 Database seeding completed successfully!\n');
//     console.log('📊 Summary:');
//     console.log(`   - Users: ${1 + 2 + students.length} (1 admin, 2 teachers, ${students.length} students)`);
//     console.log(`   - Content: ${contents.length}`);
//     console.log(`   - Quizzes: ${quizzes.length}`);
//     console.log(`   - Progress records: ${progressData.length}`);
//     console.log(`   - Quiz results: ${quizResults.length}`);
//     console.log('\n👤 Login credentials:');
//     console.log('   Admin: admin@vidyasetu.com / password123');
//     console.log('   Teacher: priya.sharma@vidyasetu.com / password123');
//     console.log('   Student: aarav.patel@student.com / password123');

//     process.exit(0);
//   } catch (error) {
//     console.error('❌ Error seeding database:', error);
//     process.exit(1);
//   }
// };

// seedData();
