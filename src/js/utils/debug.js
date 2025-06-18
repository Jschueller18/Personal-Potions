// Debug Utility Module
// Handles debug functionality - only loaded in development environment

export function initDebugMode() {
    // Enable debug mode with URL parameter ?debug=true
    const urlParams = new URLSearchParams(window.location.search);
    const debugMode = urlParams.get('debug') === 'true';
    
    if (!debugMode) return false;
    
    const debugArea = document.getElementById('debug-area');
    const debugMessage = document.getElementById('debug-message');
    const viewDataBtn = document.getElementById('view-data-btn');
    
    if (debugArea) {
        debugArea.style.display = 'block';
        console.log('Debug mode enabled');
        
        // Check for previous submissions
        const latestSubmissionId = localStorage.getItem('personalPotionsLatestSubmission');
        if (latestSubmissionId && debugMessage) {
            debugMessage.textContent = `Latest submission: ${latestSubmissionId}`;
        }
        
        // Add view data button functionality
        if (viewDataBtn) {
            viewDataBtn.addEventListener('click', function() {
                const latestId = localStorage.getItem('personalPotionsLatestSubmission');
                if (latestId) {
                    const submissionData = localStorage.getItem(latestId);
                    console.log('Latest submission data:', JSON.parse(submissionData));
                    alert('Submission data printed to console');
                } else {
                    alert('No submissions found');
                }
            });
        }
    }
    
    return true;
}

export function generateRandomFormData() {
    function getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    function selectRandomCheckboxes(name, probability = 0.5) {
        const checkboxes = document.querySelectorAll(`input[name="${name}"]`);
        checkboxes.forEach(checkbox => {
            checkbox.checked = Math.random() < probability;
        });
    }
    
    // Only run in debug mode
    if (!initDebugMode()) return;
    
    console.log('Generating random form data for testing...');
    
    // Personal Information
    document.getElementById('first-name').value = getRandomItem(['John', 'Jane', 'Alex', 'Sam', 'Chris']);
    document.getElementById('last-name').value = getRandomItem(['Smith', 'Johnson', 'Williams', 'Brown', 'Jones']);
    document.getElementById('email').value = 'test@example.com';
    document.getElementById('age').value = getRandomInt(18, 65);
    document.getElementById('weight').value = getRandomInt(120, 250);
    
    // Biological sex
    const sexOptions = document.querySelectorAll('input[name="biological-sex"]');
    if (sexOptions.length > 0) {
        getRandomItem(sexOptions).checked = true;
    }
    
    // Usage
    selectRandomCheckboxes('usage', 0.3);
    
    // Dietary
    document.getElementById('diet-type').value = getRandomItem(['omnivore', 'vegetarian', 'vegan', 'keto', 'paleo']);
    document.getElementById('protein-intake').value = getRandomItem(['low', 'moderate', 'high']);
    
    // Nutrient intakes
    document.getElementById('sodium-intake').value = (Math.random() * 10 + 1).toFixed(1);
    document.getElementById('potassium-intake').value = (Math.random() * 15 + 5).toFixed(1);
    document.getElementById('magnesium-intake').value = (Math.random() * 8 + 2).toFixed(1);
    document.getElementById('calcium-intake').value = (Math.random() * 6 + 2).toFixed(1);
    
    // Health Profile
    document.getElementById('activity-level').value = getRandomItem(['sedentary', 'light', 'moderate', 'high', 'extreme']);
    selectRandomCheckboxes('exercise-type', 0.4);
    document.getElementById('sweat-level').value = getRandomItem(['light', 'moderate', 'heavy']);
    
    // Flavor Preferences
    const flavorOptions = document.querySelectorAll('input[name="flavor"]');
    if (flavorOptions.length > 0) {
        getRandomItem(flavorOptions).checked = true;
    }
    
    document.getElementById('flavor-intensity').value = getRandomItem(['mild', 'moderate', 'strong']);
    document.getElementById('sweetener-amount').value = getRandomItem(['none', 'light', 'moderate', 'sweet']);
    
    console.log('Random form data generated successfully');
} 