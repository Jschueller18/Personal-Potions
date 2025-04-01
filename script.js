document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const form = document.getElementById('survey-form');
    const formSections = document.querySelectorAll('.form-section');
    const progressBar = document.getElementById('form-progress');
    const progressLabels = document.querySelectorAll('.progress-label');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const responseMessage = document.getElementById('response-message');

    // Form data object to store all responses
    let formData = {};

    // Show "Other" text fields when "Other" option is selected
    const usageOtherCheckbox = document.getElementById('usage-other');
    const usageOtherContainer = document.getElementById('usage-other-container');
    
    const conditionOtherCheckbox = document.getElementById('condition-other');
    const conditionOtherContainer = document.getElementById('condition-other-container');
    
    const flavorOtherRadio = document.getElementById('flavor-other');
    const flavorOtherContainer = document.getElementById('flavor-other-container');
    
    const sweetenerAmount = document.getElementById('sweetener-amount');
    const sweetenerTypeContainer = document.getElementById('sweetener-type-container');

    // New conditional elements
    const femaleRadio = document.getElementById('sex-female');
    const femaleSpecificQuestions = document.getElementById('female-specific-questions');
    
    const sweatReplacementCheckbox = document.getElementById('sweat-replacement');
    const sweatReplacementDetails = document.getElementById('sweat-replacement-details');
    
    const bedtimeMixCheckbox = document.getElementById('bedtime-mix');
    const bedtimeDetails = document.getElementById('bedtime-details');

    // Current section index
    let currentSectionIndex = 0;
    
    // Initialize tooltips
    initTooltips();
    
    // Initialize
    updateFormProgress();
    
    // Ensure first section is visible on page load
    goToSection(0);
    
    // Add event listeners for tooltips
    function initTooltips() {
        const tooltips = document.querySelectorAll('.tooltip-icon');
        tooltips.forEach(tooltip => {
            tooltip.addEventListener('mouseenter', function() {
                // Nothing needed here, CSS handles the display
            });
        });
    }
    
    // Event listeners for "Other" options
    if (usageOtherCheckbox) {
        usageOtherCheckbox.addEventListener('change', function() {
            usageOtherContainer.style.display = this.checked ? 'block' : 'none';
        });
    }
    
    if (conditionOtherCheckbox) {
        conditionOtherCheckbox.addEventListener('change', function() {
            conditionOtherContainer.style.display = this.checked ? 'block' : 'none';
        });
    }
    
    if (flavorOtherRadio) {
        flavorOtherRadio.addEventListener('change', function() {
            flavorOtherContainer.style.display = this.checked ? 'block' : 'none';
        });
    }
    
    if (sweetenerAmount) {
        sweetenerAmount.addEventListener('change', function() {
            sweetenerTypeContainer.style.display = this.value === 'none' ? 'none' : 'block';
        });
    }
    
    // New conditional logic for female-specific questions
    if (femaleRadio) {
        femaleRadio.addEventListener('change', function() {
            if (this.checked) {
                femaleSpecificQuestions.style.display = 'block';
            }
        });
        
        // Also check on page load (in case of form reset/reload)
        if (femaleRadio.checked) {
            femaleSpecificQuestions.style.display = 'block';
        }
        
        // Hide when male is selected
        const maleRadio = document.getElementById('sex-male');
        if (maleRadio) {
            maleRadio.addEventListener('change', function() {
                if (this.checked) {
                    femaleSpecificQuestions.style.display = 'none';
                }
            });
        }
    }
    
    // New conditional logic for use case details
    if (sweatReplacementCheckbox) {
        sweatReplacementCheckbox.addEventListener('change', function() {
            sweatReplacementDetails.style.display = this.checked ? 'block' : 'none';
        });
        
        // Check on page load
        if (sweatReplacementCheckbox.checked) {
            sweatReplacementDetails.style.display = 'block';
        }
    }
    
    if (bedtimeMixCheckbox) {
        bedtimeMixCheckbox.addEventListener('change', function() {
            bedtimeDetails.style.display = this.checked ? 'block' : 'none';
        });
        
        // Check on page load
        if (bedtimeMixCheckbox.checked) {
            bedtimeDetails.style.display = 'block';
        }
    }

    // Add event listeners for progress navigation
    progressLabels.forEach(function(label, index) {
        label.addEventListener('click', function() {
            goToSection(index);
        });
    });

    // Add event listeners for prev/next/submit buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            goToSection(currentSectionIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (validateCurrentSection()) {
                // Save data from current section before moving
                saveCurrentSectionData();
                goToSection(currentSectionIndex + 1);
            }
        });
    }

    // Function to save data from the current section
    function saveCurrentSectionData() {
        const currentSection = formSections[currentSectionIndex];
        const inputs = currentSection.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                // Handle checkbox groups
                if (!formData[input.name]) {
                    formData[input.name] = [];
                }
                
                if (input.checked) {
                    if (!formData[input.name].includes(input.value)) {
                        formData[input.name].push(input.value);
                    }
                } else {
                    // Remove if unchecked
                    const index = formData[input.name].indexOf(input.value);
                    if (index > -1) {
                        formData[input.name].splice(index, 1);
                    }
                }
            } else if (input.type === 'radio') {
                // Only save radio if checked
                if (input.checked) {
                    formData[input.name] = input.value;
                }
            } else {
                // Text, number, select, etc.
                formData[input.name] = input.value;
            }
        });
        
        console.log('Saved data:', formData);
    }

    // Form submission
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Final data save
            saveCurrentSectionData();
            
            // Simple validation
            if (!validateAllSections()) {
                return;
            }
            
            // Show loading message
            responseMessage.textContent = "Submitting your information...";
            responseMessage.style.color = "#333";
            
            // Prepare data for submission
            const jsonData = JSON.stringify(formData);
            
            // In a real implementation, you would send this to your server
            console.log('Submitting data:', jsonData);
            
            // Simulate form submission (replace with actual submission code)
            setTimeout(function() {
                responseMessage.textContent = "Thank you! Your personalized electrolyte mix details will be sent to your email shortly.";
                responseMessage.style.color = "#1E4A2D";
                form.reset();
                formData = {}; // Reset stored data
                
                // Reset to first section
                goToSection(0);
            }, 2000);
        });
    }

    // Function to go to a specific section
    function goToSection(index) {
        // Validate boundaries
        if (index < 0) {
            index = 0;
        } else if (index >= formSections.length) {
            index = formSections.length - 1;
        }
        
        // Hide all sections
        formSections.forEach(function(section) {
            section.style.display = 'none';
        });
        
        // Show the current section
        formSections[index].style.display = 'block';
        
        // Update current index
        currentSectionIndex = index;
        
        // Update progress
        updateFormProgress();
        
        // Scroll to top of form
        form.scrollIntoView({ behavior: 'smooth' });
    }

    // Function to update the form progress
    function updateFormProgress() {
        // Update progress bar
        const progressPercentage = ((currentSectionIndex + 1) / formSections.length) * 100;
        progressBar.style.width = progressPercentage + '%';
        
        // Update progress labels
        progressLabels.forEach(function(label, index) {
            if (index <= currentSectionIndex) {
                label.classList.add('active');
            } else {
                label.classList.remove('active');
            }
        });
        
        // Update buttons
        prevBtn.style.display = currentSectionIndex === 0 ? 'none' : 'block';
        
        if (currentSectionIndex === formSections.length - 1) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
    }

    // Enhanced validation for the current section
    function validateCurrentSection() {
        const currentSection = formSections[currentSectionIndex];
        const requiredFields = currentSection.querySelectorAll('[required]');
        let valid = true;
        
        // Clear previous errors
        const errorElements = currentSection.querySelectorAll('.error');
        errorElements.forEach(el => {
            el.classList.remove('error');
        });
        
        // Remove any existing error messages
        const existingErrorMessages = currentSection.querySelectorAll('.error-message');
        existingErrorMessages.forEach(msg => msg.remove());
        
        requiredFields.forEach(function(field) {
            // Skip validation for hidden fields
            if (isHidden(field)) {
                return;
            }
            
            // Check if field is checkbox group
            if (field.type === 'checkbox') {
                const name = field.name;
                const checkedBoxes = currentSection.querySelectorAll(`input[name="${name}"]:checked`);
                
                if (checkedBoxes.length === 0 && field.required) {
                    valid = false;
                    
                    // Find the checkbox group container
                    const container = field.closest('.checkbox-group');
                    if (container) {
                        container.classList.add('error');
                        
                        // Add error message if not exists
                        if (!container.querySelector('.error-message')) {
                            const errorMsg = document.createElement('div');
                            errorMsg.className = 'error-message';
                            errorMsg.textContent = 'Please select at least one option';
                            container.parentElement.appendChild(errorMsg);
                        }
                    }
                }
            } 
            // Check other field types
            else if (field.value.trim() === '') {
                valid = false;
                field.classList.add('error');
                
                // Add error message if not exists
                const parent = field.parentElement;
                if (!parent.querySelector('.error-message')) {
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = 'This field is required';
                    parent.appendChild(errorMsg);
                }
            }
            // Additional validation for numeric fields
            else if (field.type === 'number' && field.value !== '') {
                const value = parseFloat(field.value);
                const min = field.hasAttribute('min') ? parseFloat(field.getAttribute('min')) : null;
                const max = field.hasAttribute('max') ? parseFloat(field.getAttribute('max')) : null;
                
                if ((min !== null && value < min) || (max !== null && value > max)) {
                    valid = false;
                    field.classList.add('error');
                    
                    // Add error message
                    const parent = field.parentElement;
                    if (!parent.querySelector('.error-message')) {
                        const errorMsg = document.createElement('div');
                        errorMsg.className = 'error-message';
                        errorMsg.textContent = `Value must be between ${min !== null ? min : 'any'} and ${max !== null ? max : 'any'}`;
                        parent.appendChild(errorMsg);
                    }
                }
            }
            // Email validation
            else if (field.type === 'email' && field.value !== '') {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(field.value)) {
                    valid = false;
                    field.classList.add('error');
                    
                    // Add error message
                    const parent = field.parentElement;
                    if (!parent.querySelector('.error-message')) {
                        const errorMsg = document.createElement('div');
                        errorMsg.className = 'error-message';
                        errorMsg.textContent = 'Please enter a valid email address';
                        parent.appendChild(errorMsg);
                    }
                }
            }
        });
        
        return valid;
    }
    
    // Helper function to check if an element is hidden
    function isHidden(el) {
        return (el.offsetParent === null) || 
               (el.style.display === 'none') || 
               (el.closest('.form-group') && el.closest('.form-group').style.display === 'none');
    }

    // Validate all sections
    function validateAllSections() {
        let valid = true;
        
        // Store current section
        const currentSection = currentSectionIndex;
        
        // Check each section
        for (let i = 0; i < formSections.length; i++) {
            goToSection(i);
            if (!validateCurrentSection()) {
                valid = false;
                break;
            }
        }
        
        // Return to the invalid section or the last section if all valid
        if (!valid) {
            // We're already at the invalid section
        } else {
            goToSection(formSections.length - 1);
        }
        
        return valid;
    }
});
