// Function to load formulation data
async function loadFormulation() {
    const urlParams = new URLSearchParams(window.location.search);
    const customerId = urlParams.get('customerId');
    
    if (!customerId) {
        showError('No customer ID provided');
        return;
    }
    
    try {
        // Attempt to load data from localStorage
        const storedData = localStorage.getItem(customerId);
        if (!storedData) {
            throw new Error('No data found for this submission ID.');
        }
        
        // Parse the stored form data
        const formData = JSON.parse(storedData);
        console.log('Loaded form data from localStorage:', formData);
        
        // Generate representative formulation based on form data
        const mockFormulation = {
            ingredients: [
                { name: 'Sodium Chloride', amount: 500, unit: 'mg' },
                { name: 'Potassium Citrate', amount: 400, unit: 'mg' },
                { name: 'Magnesium Glycinate', amount: 120, unit: 'mg' },
                { name: 'Calcium Lactate', amount: 200, unit: 'mg' }
            ],
            instructions: 'Mix one scoop with 16-20 oz of water. Adjust to taste.',
            metadata: {}
        };
        
        // Add usage-specific metadata
        if (formData.usage && formData.usage.includes('hangover')) {
            mockFormulation.metadata.hangover = {
                recommendedTiming: formData['hangover-timing'] || 'Before and after drinking',
                servingsPerDay: '1-2 servings',
                additionalRecommendations: [
                    'Drink plenty of water before bed',
                    'Consider adding B-vitamins for additional support',
                    'Use before alcohol consumption for best results'
                ]
            };
        }
        
        // Display the formulation
        displayFormulation(mockFormulation);
        
        // Add demo message
        const container = document.getElementById('formulation-container');
        if (container) {
            const demoMessage = document.createElement('div');
            demoMessage.className = 'demo-message';
            demoMessage.innerHTML = `
                <p><strong>DEVELOPMENT MODE:</strong> This is a simulation using locally stored data. 
                In production, formulations would be calculated by our server based on your inputs.</p>
            `;
            container.prepend(demoMessage);
        }
        
    } catch (error) {
        console.error('Error loading formulation:', error);
        showError(error.message || 'Failed to load formulation data');
    }
}

// Function to load recommendations from external API (simplified for local demo)
async function loadRecommendations(formulationData) {
    try {
        // Create mock recommendation data
        const mockRecommendations = {
            content: `
                <h3>Additional Recommendations</h3>
                <ul>
                    <li>For best results, consume within 30 minutes of mixing</li>
                    <li>Store powder in a cool, dry place</li>
                    <li>Consider taking your electrolyte mix after exercise for optimal recovery</li>
                </ul>
            `
        };
        
        // Display recommendations
        displayRecommendations(mockRecommendations);
    } catch (error) {
        console.error('Error loading recommendations:', error);
        // Don't show error to user, just log it
    }
}

// Function to display recommendations
function displayRecommendations(recommendations) {
    const recommendationsDiv = document.getElementById('recommendations');
    const contentDiv = document.getElementById('recommendations-content');
    
    if (!recommendationsDiv || !contentDiv) return;
    
    if (recommendations && recommendations.content) {
        contentDiv.innerHTML = recommendations.content;
        recommendationsDiv.style.display = 'block';
    }
}

// Function to display formulation data
function displayFormulation(data) {
    const container = document.getElementById('formulation-container');
    if (!container) return;
    
    // Clear existing content
    container.innerHTML = '';
    
    // Create formulation display
    const formulation = document.createElement('div');
    formulation.className = 'formulation';
    
    // Add basic information
    formulation.innerHTML = `
        <h2>Your Personalized Formulation</h2>
        <div class="formulation-details">
            <h3>Ingredients</h3>
            <ul>
                ${data.ingredients.map(ing => `
                    <li>${ing.name}: ${ing.amount}${ing.unit}</li>
                `).join('')}
            </ul>
            
            <h3>Instructions</h3>
            <p>${data.instructions}</p>
            
            ${data.metadata && data.metadata.hangover ? `
                <h3>Hangover-Specific Recommendations</h3>
                <div class="hangover-recommendations">
                    <ul>
                        <li><strong>Recommended Timing:</strong> ${data.metadata.hangover.recommendedTiming}</li>
                        <li><strong>Servings per day:</strong> ${data.metadata.hangover.servingsPerDay}</li>
                    </ul>
                    
                    ${data.metadata.hangover.additionalRecommendations && 
                      data.metadata.hangover.additionalRecommendations.length > 0 ? `
                        <h4>Additional Recommendations</h4>
                        <ul>
                            ${data.metadata.hangover.additionalRecommendations.map(rec => 
                                `<li>${rec}</li>`
                            ).join('')}
                        </ul>
                    ` : ''}
                </div>
            ` : ''}
        </div>
    `;
    
    container.appendChild(formulation);
}

// Function to show error messages
function showError(message) {
    const errorContainer = document.getElementById('error-container');
    if (!errorContainer) return;
    
    errorContainer.innerHTML = `
        <div class="error-message">
            <p>${message}</p>
            <button onclick="window.location.href='index.html'">Return to Form</button>
        </div>
    `;
}

// Load formulation data when the page loads
document.addEventListener('DOMContentLoaded', loadFormulation);