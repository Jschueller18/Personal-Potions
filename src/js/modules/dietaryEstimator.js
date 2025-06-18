// Dietary Estimation Module
// Handles nutrient data and dietary estimation functionality

export const NUTRIENT_DATA = {
    sodium: {
        servingSize: 500,
        averageAmerican: { servings: 6.8, mg: 3400 },
        recommended: { servingsMin: 4.6, servingsMax: 10, mgMin: 2300, mgMax: 5000 },
        note: "Higher for athletes/larger individuals",
        examples: ["1/4 tsp salt", "1 cup canned soup", "3 slices bacon", "1 fast food burger"],
        listUrl: "sodium-rich-foods.html"
    },
    potassium: {
        servingSize: 400,
        averageAmerican: { servings: 6.25, mg: 2500 },
        recommended: { servingsMin: 8.75, servingsMax: 17.5, mgMin: 3500, mgMax: 7000 },
        note: "Varies by activity level and size",
        examples: ["1 banana", "1/2 avocado", "1 cup leafy greens", "1/2 cup beans"],
        listUrl: "potassium-rich-foods.html"
    },
    magnesium: {
        servingSize: 100,
        averageAmerican: { servings: 2.5, mg: 250 },
        recommended: { servingsMin: 3.1, servingsMax: 7.5, mgMin: 310, mgMax: 750 },
        note: "Higher needs for athletes",
        examples: ["1 oz nuts", "1/2 cup beans", "1 oz dark chocolate", "2 tbsp peanut butter"],
        listUrl: "magnesium-rich-foods.html"
    },
    calcium: {
        servingSize: 300,
        averageAmerican: { servings: 3, mg: 900 },
        recommended: { servingsMin: 3.3, servingsMax: 6.7, mgMin: 1000, mgMax: 2000 },
        note: "Higher for younger/older adults",
        examples: ["1 cup milk", "1 cup yogurt", "1.5 oz cheese", "1/2 cup tofu"],
        listUrl: "calcium-rich-foods.html"
    }
};

export function initDietaryEstimation() {
    // Get toggle buttons
    const quickEstimateToggle = document.getElementById('quick-estimate-toggle');
    const detailedEstimateToggle = document.getElementById('detailed-estimate-toggle');
    
    // Get all quick estimate containers
    const quickEstimateContainers = document.querySelectorAll('.quick-estimate-container');
    
    // Handle toggle button clicks
    if (quickEstimateToggle && detailedEstimateToggle) {
        quickEstimateToggle.addEventListener('click', function() {
            // Activate quick estimate
            quickEstimateToggle.classList.add('active');
            detailedEstimateToggle.classList.remove('active');
            
            // Show quick estimate containers
            quickEstimateContainers.forEach(container => {
                container.style.display = 'block';
            });
        });
        
        detailedEstimateToggle.addEventListener('click', function() {
            // Activate detailed count
            detailedEstimateToggle.classList.add('active');
            quickEstimateToggle.classList.remove('active');
            
            // Hide quick estimate containers
            quickEstimateContainers.forEach(container => {
                container.style.display = 'none';
            });
        });
    }
    
    // Handle quick estimate radio buttons for each nutrient
    ['sodium', 'potassium', 'magnesium', 'calcium'].forEach(nutrient => {
        const radioButtons = document.querySelectorAll(`input[name="${nutrient}-estimate"]`);
        const inputField = document.getElementById(`${nutrient}-intake`);
        
        if (radioButtons.length && inputField) {
            radioButtons.forEach(radio => {
                radio.addEventListener('change', function() {
                    if (this.checked) {
                        // Calculate value based on selection
                        const baseValue = NUTRIENT_DATA[nutrient].averageAmerican.servings;
                        let factor = 1.0; // Default (average)
                        
                        if (this.value === 'low') {
                            factor = 0.5;
                        } else if (this.value === 'high') {
                            factor = 1.5;
                        }
                        
                        // Set the input value (rounded to 1 decimal place)
                        inputField.value = (baseValue * factor).toFixed(1);
                    }
                });
            });
        }
    });
    
    // Set initial state (quick estimate active)
    if (quickEstimateToggle && quickEstimateContainers.length) {
        // Make sure quick estimate is active on page load
        quickEstimateToggle.classList.add('active');
        detailedEstimateToggle.classList.remove('active');
        
        // Show quick estimate containers
        quickEstimateContainers.forEach(container => {
            container.style.display = 'block';
        });
    }
} 