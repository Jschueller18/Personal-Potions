// Function to load formulation data
async function loadFormulation() {
    const urlParams = new URLSearchParams(window.location.search);
    const customerId = urlParams.get('customerId');
    
    if (!customerId) {
        showError('No customer ID provided');
        return;
    }
    
    try {
        const response = await fetch(`/api/formulations/generate/${customerId}`);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to load formulation data');
        }
        
        const data = await response.json();
        console.log('Formulation data:', data);
        
        // Display formulation data
        displayFormulation(data);
        
        /* TODO: External API Integration
         * This section needs to be updated once we have the external API details:
         * 1. Endpoint URL for recommendations
         * 2. Request/response format
         * 3. Error handling requirements
         * 4. Display format for recommendations
         * 
         * Current implementation is a placeholder and will need to be replaced
         * with the actual external API integration.
         */
        // await loadRecommendations(data);
        
    } catch (error) {
        console.error('Error loading formulation:', error);
        showError(error.message || 'Failed to load formulation data');
    }
}

// Function to load recommendations from external API
async function loadRecommendations(formulationData) {
    try {
        const response = await fetch('/api/recommendations/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                formulationData,
                customerId: new URLSearchParams(window.location.search).get('customerId')
            })
        });

        if (!response.ok) {
            throw new Error('Failed to load recommendations');
        }

        const recommendations = await response.json();
        displayRecommendations(recommendations);
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