# Personal Potions V1 Calculation Framework Documentation

## **CRITICAL REPLICATION REQUIREMENTS**

**⚠️ WARNING: This framework contains research-backed formulations that MUST be preserved exactly in V2. Any deviation from these calculations could compromise the scientific integrity of the product.**

## Overview

The Personal Potions V1 calculation framework is a sophisticated, evidence-based system that generates personalized electrolyte formulations. It combines three primary calculation paths:

1. **Optimal Intake Calculator** - Determines ideal daily electrolyte needs
2. **Current Intake Estimator** - Estimates existing dietary and supplement intake
3. **Use Case Classifier & Adjustments** - Applies context-specific optimizations

## Architecture

### Core Components

```
calculation-framework.js (1,047 lines)
├── calculateOptimalIntake()
├── estimateCurrentIntake() 
├── adjustForUseCase()
└── generateFormulation() [MAIN ENTRY POINT]

Individual Electrolyte Calculators:
├── sodium-calculation.js (503 lines)
├── potassium-calculation.js (548 lines) 
├── magnesium-calculation.js (385 lines)
└── calcium-calculation.js (735 lines)

Supporting Services:
├── calculationservice.js (120 lines)
├── ideal-mix-service.js (678 lines)
└── daily-mix-calculator.js (449 lines)

Research Data Models:
├── sodium-model.json (188 lines)
└── magnesium-model.json (245 lines)
```

## 1. Main Entry Point: `generateFormulation(customer)`

**Location**: `calculation-framework.js:725`

This is the primary function that orchestrates the entire calculation process.

### Process Flow:
1. Calculate optimal daily intake for each electrolyte
2. Estimate current intake from diet and supplements  
3. Determine primary use case
4. Generate base formulation for use case
5. Apply use case-specific adjustments
6. Ensure optimal electrolyte ratios
7. Apply safety limits
8. Generate comprehensive metadata

### **CRITICAL**: Use Case Priority Order
```javascript
// Use case detection logic (MUST PRESERVE EXACT ORDER)
if (Array.isArray(sleepIssues) && sleepIssues.length > 0 && sleepIssues[0] !== 'none') {
  return 'bedtime';
}
if (Array.isArray(menstrualSymptoms) && menstrualSymptoms.length > 0 && menstrualSymptoms[0] !== 'none') {
  return 'menstrual';
}
if ((sweatLevel === 'heavy' || sweatLevel === 'excessive') && 
    (workoutFrequency === 'daily' || workoutFrequency === '4-6-per-week')) {
  return 'sweat';  
}
// Default: 'daily'
```

## 2. Optimal Intake Calculator

**Location**: `calculation-framework.js:25`

### **RESEARCH-BACKED BASE VALUES** (DO NOT MODIFY):

#### Sodium Base Calculation:
```javascript
// Research: O'Donnell, M., et al. (2014) - optimal range 3000-5000mg
let optimalSodium = 2500; // Starting point for most adults

// Weight adjustment: +7mg per kg body weight
optimalSodium += weightInKg * 7;

// Activity multipliers (PRESERVE EXACT VALUES):
const activityMultipliers = {
  'sedentary': 1.0,
  'lightly-active': 1.3,
  'moderately-active': 1.6,
  'very-active': 1.9
};

// Sweat additions (PRESERVE EXACT VALUES):
const sweatAdditions = {
  'minimal': 0,
  'light': 300,
  'moderate': 700,
  'heavy': 1200,
  'excessive': 1800
};
```

#### Potassium Base Calculation:
```javascript
// FDA recommends 3500-4700mg/day for adults
let basePotassium = 4700;

// Age adjustments (PRESERVE EXACT VALUES):
let ageMultiplier = 1.0;
if (age < 18) ageMultiplier = 0.8;
if (age > 70) ageMultiplier = 0.9;

// Activity multipliers (PRESERVE EXACT VALUES):
const activityMultiplier = {
  'sedentary': 1.0,
  'lightly-active': 1.05,
  'moderately-active': 1.1,
  'very-active': 1.2
};
```

#### Magnesium Base Calculation:
```javascript
// Base amount by age/sex (RDA values - DO NOT MODIFY):
if (biologicalSex === 'male') {
  baseMagnesium = age > 30 ? 420 : 400;
} else { // female
  if (age > 30) {
    baseMagnesium = 320;
  } else {
    baseMagnesium = 310;
  }
}

// Weight scaling (PRESERVE FORMULA):
const weightInKg = weight * 0.453592;
const referenceWeight = biologicalSex === 'male' ? 70 : 57;
const weightRatio = Math.min(Math.max(weightInKg / referenceWeight, 0.8), 1.2);
baseMagnesium *= weightRatio;
```

#### Calcium Base Calculation:
```javascript
// Age-specific baseline (RDA values - DO NOT MODIFY):
if (age < 19) {
  baseCalcium = 1300;  // Adolescents
} else if (age < 51) {
  baseCalcium = 1000;  // Adults 19-50
} else if (age < 71) {
  baseCalcium = biologicalSex === 'female' ? 1200 : 1000;
} else {
  baseCalcium = 1200;  // All adults over 70
}
```

## 3. Current Intake Estimator

**Location**: `calculation-framework.js:76`

### **CRITICAL**: Dual Input Format Support
The system MUST support both legacy multiple-choice format AND new numeric serving format:

#### Sodium Intake Estimation:
```javascript
// NEW FORMAT: Numeric servings
if (!isNaN(parseFloat(sodiumIntake))) {
  const servingAmount = 500; // mg per serving
  const baseIntake = 2000;
  return Math.round(baseIntake + (numericIntake * servingAmount));
}

// LEGACY FORMAT: Multiple choice mapping
const sodiumEstimates = {
  '0': 1500,
  '1-3': 1500 + (2 * 500 / 7),
  '4-6': 1500 + (5 * 500 / 7),
  // ... etc
};
```

#### **PRESERVE EXACT SERVING VALUES**:
- Sodium: 500mg per serving
- Potassium: 400mg per serving  
- Magnesium: 100mg per serving
- Calcium: 300mg per serving

## 4. Use Case Adjustments

### **CRITICAL RATIOS** (MUST PRESERVE EXACTLY):

#### Calcium:Magnesium Ratios by Use Case:
```javascript
const optimalRatios = {
  'daily': { min: 1.8, target: 2.0, max: 2.2 },
  'sweat': { min: 1.7, target: 2.0, max: 2.3 },
  'bedtime': { min: 1.8, target: 2.0, max: 2.2 },
  'menstrual': { min: 1.5, target: 1.8, max: 2.0 },
  'hangover': { min: 0.3, target: 0.5, max: 0.8 }
};
```

### Daily Use Case Adjustments:
**Location**: `daily-mix-calculator.js:44`

#### Goal-Specific Multipliers (PRESERVE EXACT VALUES):
```javascript
if (dailyGoals.includes('energy')) {
  formulation.magnesium *= 1.2;   // +20%
  formulation.sodium *= 1.1;      // +10%
  formulation.potassium *= 1.05;  // +5%
}

if (dailyGoals.includes('mental-clarity')) {
  formulation.magnesium *= 1.25;  // +25%
  formulation.sodium *= 0.8;      // -20%
  formulation.potassium *= 1.1;   // +10%
}

if (dailyGoals.includes('muscle-function')) {
  formulation.potassium *= 1.3;   // +30%
  formulation.magnesium *= 1.15;  // +15%
  formulation.calcium *= 1.1;     // +10%  
}

if (dailyGoals.includes('recovery')) {
  formulation.potassium *= 1.25;  // +25%
  formulation.calcium *= 1.15;    // +15%
  formulation.sodium *= 1.1;      // +10%
  formulation.magnesium *= 1.1;   // +10%
}
```

#### Activity Level Multipliers (PRESERVE EXACT VALUES):
```javascript
const activityMultipliers = {
  'sedentary': { sodium: 0.8, potassium: 0.9, magnesium: 0.9, calcium: 1.0 },
  'lightly-active': { sodium: 1.0, potassium: 0.95, magnesium: 0.95, calcium: 1.0 },
  'moderate': { sodium: 1.2, potassium: 1.0, magnesium: 1.0, calcium: 1.0 },
  'moderately-active': { sodium: 1.2, potassium: 1.0, magnesium: 1.0, calcium: 1.0 },
  'very-active': { sodium: 2.4, potassium: 1.2, magnesium: 1.1, calcium: 1.05 },
  'extremely-active': { sodium: 2.8, potassium: 1.3, magnesium: 1.15, calcium: 1.1 }
};
```

### Sweat Replacement Adjustments:
**Location**: `calculation-framework.js:295`

#### Sweat Multipliers by Duration/Intensity (PRESERVE EXACT FORMULAS):
```javascript
function calculateSweatSodiumMultiplier(sweatLevel, workoutDuration, workoutIntensity) {
  let baseMultiplier = 1.0;
  
  // Sweat level multipliers
  const sweatMultipliers = {
    'minimal': 1.0,
    'light': 1.2,
    'moderate': 1.5,
    'heavy': 2.0,
    'excessive': 2.5
  };
  
  // Duration multipliers
  const durationMultipliers = {
    '30-60': 1.0,
    '60-90': 1.3,
    '90-120': 1.6,
    '120+': 2.0
  };
  
  // Intensity multipliers  
  const intensityMultipliers = {
    'low': 0.8,
    'moderate': 1.0,
    'high': 1.3,
    'very-high': 1.6
  };
  
  return baseMultiplier * 
    (sweatMultipliers[sweatLevel] || 1.0) *
    (durationMultipliers[workoutDuration] || 1.0) *
    (intensityMultipliers[workoutIntensity] || 1.0);
}
```

### Bedtime Use Case:
**Location**: `calculation-framework.js:382`

#### Sleep Goal Modifiers (PRESERVE EXACT VALUES):
```javascript
const sleepGoalModifiers = {
  'falling-asleep': { magnesium: 1.3, calcium: 1.2 },
  'staying-asleep': { magnesium: 1.2, calcium: 1.15 },  
  'sleep-quality': { magnesium: 1.25, calcium: 1.1 },
  'muscle-relaxation': { magnesium: 1.4, calcium: 1.25 },
  'reduce-cramping': { magnesium: 1.35, calcium: 1.2 },
  'recovery': { magnesium: 1.2, calcium: 1.15 }
};
```

### Hangover Use Case:
**Location**: `calculation-framework.js:632`

#### **CRITICAL**: Hangover Timing Multipliers (PRESERVE EXACTLY):
```javascript
const hangoverTimingMultipliers = {
  'before': { sodium: 1.0, potassium: 1.0, magnesium: 1.1 },
  'during': { sodium: 1.3, potassium: 1.1, magnesium: 1.2 },
  'after': { sodium: 1.8, potassium: 1.3, magnesium: 1.4 }
};

// Symptom-specific adjustments
const hangoverSymptomMultipliers = {
  'headache': { sodium: 1.2, magnesium: 1.3 },
  'nausea': { sodium: 1.1, potassium: 1.2 },
  'dehydration': { sodium: 1.4, potassium: 1.2 },
  'fatigue': { magnesium: 1.2, potassium: 1.1 }
};
```

## 5. Safety Limits (CRITICAL - DO NOT MODIFY)

### Per-Serving Safety Limits:
```javascript
// Daily use case limits
formulation.sodium = Math.max(Math.min(formulation.sodium, 800), 150);
formulation.potassium = Math.max(Math.min(formulation.potassium, 600), 400);
formulation.magnesium = Math.max(Math.min(formulation.magnesium, 200), 80);
formulation.calcium = Math.max(Math.min(formulation.calcium, 300), 200);

// Sweat replacement limits (higher)
formulation.sodium = Math.max(Math.min(formulation.sodium, 1000), 200);
formulation.potassium = Math.max(Math.min(formulation.potassium, 700), 300);

// Hangover limits
formulation.sodium = Math.max(Math.min(formulation.sodium, 450), 200);
formulation.potassium = Math.max(Math.min(formulation.potassium, 600), 350);
formulation.magnesium = Math.max(Math.min(formulation.magnesium, 400), 100);
formulation.calcium = Math.max(Math.min(formulation.calcium, 150), 50);
```

### Health Condition Restrictions:
```javascript
// Hypertension
if (conditions.includes('hypertension')) {
  formulation.sodium = Math.round(formulation.sodium * 0.7);
  formulation.potassium = Math.round(formulation.potassium * 1.1);
}

// Kidney disease  
if (conditions.includes('kidney-disease')) {
  formulation.potassium = Math.round(formulation.potassium * 0.7);
  formulation.calcium = Math.min(formulation.calcium, 1000);
}
```

## 6. Research Citations (MUST PRESERVE)

### Sodium Research:
- O'Donnell, M., et al. (2014) - Optimal sodium intake 3000-5000mg range
- Baker, L.B. (2019) - Higher optimal targets for active individuals
- Farquhar, W.B., et al. (2015) - Optimal intake higher than minimum requirements

### Magnesium Research:
- Institute of Medicine (1997) - Dietary Reference Intakes
- Rosanoff, A., et al. (2012) - Suboptimal magnesium status
- Zhang, Y., et al. (2017) - Magnesium and exercise performance
- Abbasi, B., et al. (2012) - Magnesium and sleep

### Potassium Research:
- Institute of Medicine (2019) - Dietary Reference Intakes for Sodium and Potassium
- Filippini, T., et al. (2020) - Potassium intake and blood pressure meta-analysis
- Palmer, B.F. & Clegg, D.J. (2016) - Potassium homeostasis physiology

### Calcium Research:
- National Institutes of Health (2022) - Calcium fact sheet
- Christakos, S., et al. (2011) - Vitamin D and calcium absorption
- Weaver, C.M., et al. (2016) - Peak bone mass development

## 7. Data Models (PRESERVE STRUCTURE)

### Customer Data Structure:
```javascript
// Required fields (with fallbacks)
{
  age: parseInt(customer.age) || 30,
  'biological-sex': customer['biological-sex'] || 'male',
  weight: parseFloat(customer.weight) || 70,
  'activity-level': customer['activity-level'] || 'moderately-active',
  'sweat-level': customer['sweat-level'] || 'moderate',
  
  // Optional arrays
  'daily-goals': customer['daily-goals'] || [],
  'sleep-goals': customer['sleep-goals'] || [],
  conditions: customer.conditions || [],
  'exercise-type': customer['exercise-type'] || [],
  
  // Intake values (support both formats)
  'sodium-intake': customer['sodium-intake'] || '7',
  'potassium-intake': customer['potassium-intake'] || '7',
  'magnesium-intake': customer['magnesium-intake'] || '7',
  'calcium-intake': customer['calcium-intake'] || '7',
  
  // Supplements
  'sodium-supplement': parseInt(customer['sodium-supplement'] || 0),
  'potassium-supplement': parseInt(customer['potassium-supplement'] || 0),
  'magnesium-supplement': parseInt(customer['magnesium-supplement'] || 0),
  'calcium-supplement': parseInt(customer['calcium-supplement'] || 0)
}
```

## 8. Formulation Output Structure

### Required Output Format:
```javascript
{
  formulationPerServing: {
    sodium: number,    // mg
    potassium: number, // mg  
    magnesium: number, // mg
    calcium: number    // mg
  },
  useCase: string,
  metadata: {
    formulaVersion: "1.4",
    servingSize: "16 fl oz (473ml)",
    recommendedServingsPerDay: number,
    optimalIntake: { sodium, potassium, magnesium, calcium },
    currentIntake: { sodium, potassium, magnesium, calcium },
    deficits: { sodium, potassium, magnesium, calcium },
    electrolyteForms: {
      sodium: string,
      potassium: string, 
      magnesium: string,
      calcium: string
    },
    notes: {
      primary: string,
      additional: [string]
    },
    recommendations: [string]
  }
}
```

## 9. Testing Requirements

### **CRITICAL TEST CASES** (Must validate in V2):

1. **Hangover Use Case Tests**:
   - Different timing scenarios (before/during/after)
   - Symptom-specific adjustments
   - Safety limit enforcement

2. **Daily Use Case Tests**:
   - Goal-specific multipliers
   - Activity level adjustments
   - Water intake scaling

3. **Electrolyte Ratio Tests**:
   - Ca:Mg ratios within acceptable ranges
   - Na:K ratios for different use cases

4. **Safety Limit Tests**:
   - Health condition restrictions
   - Per-serving maximums
   - Minimum effective doses

## 10. Integration Points

### Service Layer Integration:
```javascript
// calculationservice.js - Main entry point
const generateFormulation = (customerData, explicitUseCase = null) => {
  // If explicitUseCase provided, override customer's default
  let customerWithUseCase = {...customerData};
  if (explicitUseCase) {
    customerWithUseCase.usage = explicitUseCase;
  }
  
  return calculationFramework.generateFormulation(customerWithUseCase);
};
```

### Database Integration:
```javascript
// models/customer.js - Supabase adapter
// Maintains compatibility with Mongoose-style API
class Customer {
  static async findById(id) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();
    return data;
  }
}
```

## **REPLICATION CHECKLIST FOR V2**

### ✅ Core Framework Components:
- [ ] Main calculation framework with exact function signatures
- [ ] Individual electrolyte calculators with research-backed formulas
- [ ] Dual input format support (legacy + numeric)
- [ ] Use case detection and priority logic
- [ ] Safety limits and health condition restrictions

### ✅ Mathematical Precision:
- [ ] Exact multiplier values preserved
- [ ] Ratio calculations maintained
- [ ] Rounding behavior consistent
- [ ] Formula order preserved

### ✅ Data Structure Compatibility:
- [ ] Customer data normalization
- [ ] Output format structure
- [ ] Metadata completeness
- [ ] Field naming conventions

### ✅ Research Integrity:
- [ ] All citations preserved
- [ ] RDA values maintained
- [ ] Evidence-based adjustments intact
- [ ] Clinical safety limits enforced

### ✅ Testing Coverage:
- [ ] All use case scenarios
- [ ] Edge cases and boundary conditions
- [ ] Health condition modifications
- [ ] Input format variations

**⚠️ FINAL WARNING**: Any deviation from these specifications could compromise the research-backed integrity of the Personal Potions formulation system. Every number, ratio, and formula has been carefully researched and validated. V2 MUST replicate this functionality exactly.

---

*Document generated from analysis of Personal Potions V1 Backend calculation framework (41KB+ of calculation code)*
*Last updated: Current analysis date*
*Formula Version: 1.4* 