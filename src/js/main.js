// Main Application Entry Point
// Coordinates all modules and handles application initialization

import { initDietaryEstimation } from './modules/dietaryEstimator.js';
import { 
    initElectrolyteTooltips, 
    initTooltips, 
    initConditionalSections, 
    initUseCaseHandlers,
    goToSection,
    updateFormProgress
} from './modules/uiManager.js';
import { 
    validateCurrentSection, 
    validateAllSections 
} from './modules/dataValidator.js';
import { 
    collectAllFormData, 
    saveCurrentSectionData, 
    updateSubmitButtonState,
    initSuccessMessage
} from './modules/formManager.js';
import { initDebugMode, generateRandomFormData } from './utils/debug.js';
import { isUseCaseSelected } from './modules/validationHelpers.js';

// Import API client and status checker
let apiClient;
let statusChecker;

// Load API modules
Promise.all([
    import('../api-client.js'),
    import('../api-status-checker.js')
]).then(([apiModule, statusModule]) => {
    apiClient = apiModule;
    statusChecker = statusModule;
    
    // Initialize API status checker when modules are loaded
    statusModule.initStatusChecker();
}).catch(error => {
    console.error('Error loading API modules:', error);
});

document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const form = document.getElementById('survey-form');
    const formSections = document.querySelectorAll('.form-section');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    
    // Initialize submit button state
    if (submitBtn) {
        submitBtn.classList.add('inactive-submit');
    }
    
    // Initialize debug mode
    initDebugMode();
    
    // Initialize success message handling
    initSuccessMessage();
    
    // Form data object to store all responses
    let formData = {};
    let currentSectionIndex = 0;
    
    // Initialize all UI components
    initTooltips();
    initElectrolyteTooltips();
    initConditionalSections();
    initDietaryEstimation();
    
    // Initialize use case handlers with save function
    initUseCaseHandlers(() => saveCurrentSectionData(formData, currentSectionIndex, formSections));
    
    // Initialize form navigation
    updateFormProgress(currentSectionIndex, formSections.length);
    
    // Ensure first section is visible on page load
    const updatedIndex = goToSection(0, formSections, currentSectionIndex);
    currentSectionIndex = updatedIndex;
    
    // Navigation button event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            const newIndex = goToSection(currentSectionIndex - 1, formSections, currentSectionIndex);
            currentSectionIndex = newIndex;
            updateSubmitButtonState(formSections, validateAllSections);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            // Only validate current section
            if (validateCurrentSection(formSections, currentSectionIndex)) {
                const newIndex = goToSection(currentSectionIndex + 1, formSections, currentSectionIndex);
                currentSectionIndex = newIndex;
            }
        });
    }

    // Submit button logic
    if (submitBtn) {
        submitBtn.style.display = 'inline-block';
        updateSubmitButtonState(formSections, validateAllSections);
        
        submitBtn.addEventListener('click', async function() {
            if (!validateAllSections(formSections)) {
                const errorBubble = document.getElementById('submit-error-bubble');
                if (errorBubble) {
                    errorBubble.textContent = 'Please fill in all required fields.';
                    errorBubble.style.display = 'block';
                    setTimeout(() => {
                        errorBubble.style.display = 'none';
                    }, 4000);
                }
                return;
            }
            
            // If valid, proceed with form submission
            const submissionData = collectAllFormData();
            
            console.log('Sending data to API...');
            
            // Show loading message
            const errorBubble = document.getElementById('submit-error-bubble');
            if (errorBubble) {
                errorBubble.textContent = 'Processing submission...';
                errorBubble.style.display = 'block';
                errorBubble.style.backgroundColor = '#3498db';
            }
            
            try {
                // Use API client if available, otherwise fall back to demo mode
                let response;
                if (apiClient) {
                    response = await apiClient.submitSurvey(submissionData);
                } else {
                    // Fallback if API client failed to load
                    const formId = `submission_${Date.now()}`;
                    localStorage.setItem('personalPotionsLatestSubmission', formId);
                    localStorage.setItem(formId, JSON.stringify(submissionData));
                    
                    response = {
                        success: true,
                        customer: {
                            id: formId
                        }
                    };
                }
                
                // Handle successful response
                console.log('Success response:', response);
                
                if (errorBubble) {
                    errorBubble.textContent = 'Submission successful!';
                    errorBubble.style.backgroundColor = '#4CAF50';
                }
                
                // Redirect to results page after a short delay
                setTimeout(() => {
                    window.location.href = `/results.html?customerId=${response.customer.id}`;
                }, 1000);
                
            } catch (error) {
                console.error('Error submitting form:', error);
                
                if (errorBubble) {
                    errorBubble.textContent = 'Submission failed. Please try again.';
                    errorBubble.style.backgroundColor = '#e74c3c';
                }
            }
        });
    }
}); 