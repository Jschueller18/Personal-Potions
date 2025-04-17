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
    
    // Explicitly hide the submit button on page load
    if (submitBtn) {
        submitBtn.style.display = 'none';
    }
    
    // Debug elements
    const debugArea = document.getElementById('debug-area');
    const debugMessage = document.getElementById('debug-message');
    const viewDataBtn = document.getElementById('view-data-btn');
    
    // Enable debug mode with URL parameter ?debug=true
    const urlParams = new URLSearchParams(window.location.search);
    const debugMode = urlParams.get('debug') === 'true';
    
    // Check for success parameter in URL
    const success = urlParams.get('success');
    if (success === 'true' && responseMessage) {
        responseMessage.textContent = "Thank you! Your personalized electrolyte mix details will be sent to your email shortly.";
        responseMessage.style.color = "#1E4A2D";
        responseMessage.classList.add('visible');
        
        // Scroll to top to show success message
        window.scrollTo(0, 0);
    }
    
    if (debugMode && debugArea) {
        debugArea.style.display = 'block';
        console.log('Debug mode enabled');
        
        // Check for previous submissions
        const latestSubmissionId = localStorage.getItem('personalPotionsLatestSubmission');
        if (latestSubmissionId) {
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

    // Form data object to store all responses
    let formData = {};

    // Debug buttons
    console.log('Submit button found:', !!submitBtn);
    if (submitBtn) {
        console.log('Submit button initial display:', getComputedStyle(submitBtn).display);
    }

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
    
    const dailyDrinkCheckbox = document.getElementById('daily-drink');
    const dailyMixDetails = document.getElementById('daily-mix-details');
    
    const menstrualSupportCheckbox = document.getElementById('menstrual-support');
    const menstrualDetails = document.getElementById('menstrual-details');
    
    const hangoverSupportCheckbox = document.getElementById('hangover-support');
    const hangoverDetails = document.getElementById('hangover-details');

    // Current section index
    let currentSectionIndex = 0;
    
    // Initialize tooltips and tooltip handling
    initTooltips();
    initElectrolyteTooltips();
    
    // Initialize
    updateFormProgress();
    
    // Ensure first section is visible on page load
    goToSection(0);
    
    // Handle electrolyte tooltip functionality
    function initElectrolyteTooltips() {
        // Electrolyte tooltip handling
        const tooltipButtons = document.querySelectorAll('.electrolyte-link');
        const tooltipContainers = document.querySelectorAll('.electrolyte-tooltip');
        
        tooltipButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('data-tooltip');
                
                tooltipContainers.forEach(container => {
                    if (container.id === targetId) {
                        container.style.display = container.style.display === 'block' ? 'none' : 'block';
                    } else {
                        container.style.display = 'none';
                    }
                });
            });
        });
        
        // Close tooltips when clicking the X button
        document.querySelectorAll('.tooltip-close').forEach(closeBtn => {
            closeBtn.addEventListener('click', function() {
                this.closest('.electrolyte-tooltip').style.display = 'none';
            });
        });
    }
    
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
    
    // Daily mix details conditional logic
    if (dailyDrinkCheckbox) {
        dailyDrinkCheckbox.addEventListener('change', function() {
            dailyMixDetails.style.display = this.checked ? 'block' : 'none';
        });
        
        // Check on page load
        if (dailyDrinkCheckbox.checked) {
            dailyMixDetails.style.display = 'block';
        }
    }
    
    // Menstrual support details conditional logic
    if (menstrualSupportCheckbox) {
        menstrualSupportCheckbox.addEventListener('change', function() {
            menstrualDetails.style.display = this.checked ? 'block' : 'none';
        });
        
        // Check on page load
        if (menstrualSupportCheckbox.checked) {
            menstrualDetails.style.display = 'block';
        }
    }
    
    // Hangover cure details conditional logic
    if (hangoverSupportCheckbox) {
        hangoverSupportCheckbox.addEventListener('change', function() {
            hangoverDetails.style.display = this.checked ? 'block' : 'none';
        });
        
        // Check on page load
        if (hangoverSupportCheckbox.checked) {
            hangoverDetails.style.display = 'block';
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
    
    // Add direct click handler for submit button
    if (submitBtn) {
        console.log('Adding click event to submit button');
        submitBtn.addEventListener('click', function(e) {
            console.log('Submit button clicked');
            // Prevent default to avoid double submission
            e.preventDefault();
            
            // Trigger form submission manually
            if (form) {
                // Final validation
                if (validateCurrentSection()) {
                    // Save current section data
                    saveCurrentSectionData();
                    
                    // Manually dispatch form submit event
                    console.log('Dispatching form submit event');
                    const submitEvent = new Event('submit', {
                        'bubbles': true,
                        'cancelable': true
                    });
                    form.dispatchEvent(submitEvent);
                }
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
            
            // Format data for the backend API
            // Map our form data to match exactly what the backend expects
            const customerData = {
                // Personal information - exact field matches
                firstName: formData.firstName || '',
                lastName: formData.lastName || '',
                email: formData.email,
                age: parseInt(formData.age) || 0,
                weight: parseInt(formData.weight) || 0,
                biologicalSex: formData.sex === 'male' ? 'male' : 
                               formData.sex === 'female' ? 'female' : 
                               formData.sex || '',
                
                // Usage - ensure it's always an array with valid enum values
                usage: Array.isArray(formData.usage) ? formData.usage.map(item => 
                    // Map usage values to ensure they match backend enums
                    item === 'sweat' ? 'sweat' :
                    item === 'daily' ? 'daily' :
                    item === 'bedtime' ? 'bedtime' :
                    item === 'menstrual' ? 'menstrual' :
                    item === 'hangover' ? 'hangover' : item
                ) : (formData.usage ? [formData.usage] : []),
                
                // Map common fields - ensure enum values match backend expectations
                activityLevel: formData.activityLevel === 'sedentary' ? 'sedentary' :
                              formData.activityLevel === 'lightly-active' ? 'lightly-active' :
                              formData.activityLevel === 'moderately-active' ? 'moderately-active' :
                              formData.activityLevel === 'very-active' ? 'very-active' :
                              'moderately-active',
                
                sweatLevel: formData.sweatLevel === 'minimal' ? 'minimal' :
                           formData.sweatLevel === 'light' ? 'light' :
                           formData.sweatLevel === 'moderate' ? 'moderate' :
                           formData.sweatLevel === 'heavy' ? 'heavy' :
                           formData.sweatLevel === 'excessive' ? 'excessive' :
                           'moderate',
                
                goals: formData.goals || '',
                
                dietType: formData.dietType === 'omnivore' ? 'omnivore' :
                         formData.dietType === 'vegetarian' ? 'vegetarian' :
                         formData.dietType === 'vegan' ? 'vegan' :
                         formData.dietType === 'pescatarian' ? 'pescatarian' :
                         formData.dietType === 'other' ? 'other' :
                         'omnivore',
                
                // Intake estimations with enum validation
                sodiumIntake: ['low', 'moderate', 'high'].includes(formData.sodiumIntake) ? 
                             formData.sodiumIntake : 'moderate',
                potassiumIntake: ['low', 'moderate', 'high'].includes(formData.potassiumIntake) ? 
                                formData.potassiumIntake : 'moderate',
                magnesiumIntake: ['low', 'moderate', 'high'].includes(formData.magnesiumIntake) ? 
                                formData.magnesiumIntake : 'moderate',
                calciumIntake: ['low', 'moderate', 'high'].includes(formData.calciumIntake) ? 
                              formData.calciumIntake : 'moderate',
                
                // Include any other potentially useful fields
                hydrationChallenges: Array.isArray(formData.hydrationChallenges) ? 
                                    formData.hydrationChallenges : [],
                healthConditions: Array.isArray(formData.conditions) ? 
                                 formData.conditions : []
            };
            
            // Format validation - check if required fields are present
            const requiredFields = ['firstName', 'lastName', 'email', 'biologicalSex'];
            const missingFields = requiredFields.filter(field => !customerData[field]);
            
            if (missingFields.length > 0) {
                console.warn('Warning: Missing required fields:', missingFields);
            }
            
            // Log data for debugging and testing
            console.log('Submitting to backend API:', customerData);
            console.log('Original form data:', formData);
            console.log('Form validation complete - all required fields present:', missingFields.length === 0);
            
            // Show loading message
            responseMessage.textContent = "Submitting your information...";
            responseMessage.style.color = "#333";
            responseMessage.classList.add('visible');
            
            // Send data to our backend API
            fetch('/api/customers/survey', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(customerData),
                // Add credentials to ensure cookies are sent
                credentials: 'same-origin'
            })
            .then(response => {
                console.log('Response status:', response.status);
                if (!response.ok) {
                    return response.text().then(text => {
                        console.error('Error response body:', text);
                        throw new Error(`Server error: ${response.status} ${text || response.statusText}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('Success response:', data);
                
                // Log successful submission details for testing
                if (data.customer) {
                    console.log('Customer created successfully:', {
                        id: data.customer._id,
                        name: `${data.customer.firstName} ${data.customer.lastName}`,
                        email: data.customer.email
                    });
                }
                
                if (data.formulation) {
                    console.log('Formulation generated successfully:', {
                        id: data.formulation._id,
                        useCase: data.formulation.useCase,
                        servingsPerDay: data.formulation.recommendedServingsPerDay
                    });
                }
                
                responseMessage.textContent = "Thank you! Your personalized electrolyte mix details will be sent to your email shortly.";
                responseMessage.style.color = "#1E4A2D";
                
                // If we have a customerId and formulation, redirect to results page
                if (data.customer && data.customer._id) {
                    console.log('Redirecting to results page with customer ID:', data.customer._id);
                    setTimeout(() => {
                        window.location.href = `/results.html?customerId=${data.customer._id}`;
                    }, 2000);
                } else {
                    console.log('No customer ID found in response, resetting form');
                    // Otherwise just reset the form
                    form.reset();
                    formData = {}; // Reset stored data
                    // Reset to first section
                    goToSection(0);
                }
            })
            .catch(error => {
                console.error('Submission error:', error);
                
                // Check if this is a network error (likely server not running)
                if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('Server error')) {
                    console.log('Server connection failed - using fallback submission');
                    
                    // Fallback to email submission or local storage
                    responseMessage.textContent = "Thank you for your submission! Since the server is in development mode, your data has been saved locally.";
                    responseMessage.style.color = "#1E4A2D";
                    responseMessage.classList.add('visible');
                    
                    // Store in localStorage as fallback
                    try {
                        const submissionId = 'submission_' + new Date().getTime();
                        localStorage.setItem(submissionId, JSON.stringify(customerData));
                        localStorage.setItem('personalPotionsLatestSubmission', submissionId);
                        console.log('Saved submission data to localStorage as fallback with ID:', submissionId);
                        
                        // Show success message and reset form after delay
                        setTimeout(() => {
                            form.reset();
                            formData = {}; // Reset stored data
                            goToSection(0);
                            
                            // Keep success message visible
                            responseMessage.textContent += " You may now start a new submission or view previous submissions in your browser's console.";
                        }, 2000);
                        
                    } catch (storageError) {
                        console.error('LocalStorage error:', storageError);
                        
                        // Add a button to send via email
                        const mailtoLink = `mailto:support@personalpotions.com?subject=Survey Submission&body=Form data: ${encodeURIComponent(JSON.stringify(customerData))}`;
                        const emailButton = document.createElement('button');
                        emailButton.textContent = 'Send via Email Instead';
                        emailButton.classList.add('primary-btn');
                        emailButton.style.marginTop = '15px';
                        emailButton.addEventListener('click', function() {
                            window.location.href = mailtoLink;
                        });
                        
                        responseMessage.appendChild(document.createElement('br'));
                        responseMessage.appendChild(emailButton);
                    }
                } else {
                    // Regular error
                    responseMessage.textContent = "There was an issue submitting your form. Please try again or contact us directly.";
                    responseMessage.style.color = "#d9534f";
                }
            });
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
        
        // Show/hide prev/next/submit buttons
        if (currentSectionIndex === 0) {
            prevBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'inline-block';
        }
        
        if (currentSectionIndex === formSections.length - 1) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'inline-block';
            console.log('Last section reached, displaying submit button');
        } else {
            nextBtn.style.display = 'inline-block';
            submitBtn.style.display = 'none';
        }
    }
    
    // Function to update the progress bar and labels
    function updateFormProgress() {
        // Update progress bar width
        const progressPercentage = ((currentSectionIndex + 1) / formSections.length) * 100;
        progressBar.style.width = progressPercentage + '%';
        
        // Update section labels
        progressLabels.forEach(function(label, index) {
            if (index <= currentSectionIndex) {
                label.classList.add('active');
            } else {
                label.classList.remove('active');
            }
        });
    }

    // Function to validate the current section (basic validation example)
    function validateCurrentSection() {
        const currentSection = formSections[currentSectionIndex];
        const requiredInputs = currentSection.querySelectorAll('[required]:not([type="checkbox"])');
        const requiredCheckboxGroups = new Set();
        
        // Collect checkbox groups that have at least one required checkbox
        currentSection.querySelectorAll('input[type="checkbox"][required]').forEach(checkbox => {
            requiredCheckboxGroups.add(checkbox.name);
        });
        
        // Validate normal required fields (text, select, etc.)
        let isValid = true;
        
        requiredInputs.forEach(input => {
            // Skip validation if the input is in a hidden container
            if (isHidden(input)) {
                return;
            }
            
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('invalid');
                
                // Add error message if not already present
                let errorMessage = input.nextElementSibling;
                if (!errorMessage || !errorMessage.classList.contains('error-message')) {
                    errorMessage = document.createElement('p');
                    errorMessage.classList.add('error-message', 'visible');
                    errorMessage.textContent = 'This field is required.';
                    input.parentNode.insertBefore(errorMessage, input.nextSibling);
                } else {
                    errorMessage.classList.add('visible');
                }
            } else {
                input.classList.remove('invalid');
                
                // Remove any existing error message visibility
                const errorMessage = input.nextElementSibling;
                if (errorMessage && errorMessage.classList.contains('error-message')) {
                    errorMessage.classList.remove('visible');
                }
            }
        });
        
        // Validate checkbox groups (at least one checkbox in each required group should be checked)
        requiredCheckboxGroups.forEach(groupName => {
            const checkboxes = currentSection.querySelectorAll(`input[type="checkbox"][name="${groupName}"]`);
            const container = checkboxes[0].closest('.checkbox-group');
            
            // Skip validation if the container is hidden
            if (isHidden(container)) {
                return;
            }
            
            let isGroupValid = false;
            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    isGroupValid = true;
                }
            });
            
            if (!isGroupValid) {
                isValid = false;
                
                // Add error message if not already present
                let errorMessage = container.nextElementSibling;
                if (!errorMessage || !errorMessage.classList.contains('error-message')) {
                    errorMessage = document.createElement('p');
                    errorMessage.classList.add('error-message', 'visible');
                    errorMessage.textContent = 'Please select at least one option.';
                    container.parentNode.insertBefore(errorMessage, container.nextSibling);
                } else {
                    errorMessage.classList.add('visible');
                }
            } else {
                // Remove any existing error message visibility
                const errorMessage = container.nextElementSibling;
                if (errorMessage && errorMessage.classList.contains('error-message')) {
                    errorMessage.classList.remove('visible');
                }
            }
        });
        
        return isValid;
    }
    
    // Helper function to check if an element is hidden
    function isHidden(el) {
        return (el.offsetParent === null || getComputedStyle(el).display === 'none');
    }
    
    // Function to validate all sections
    function validateAllSections() {
        // Remember current section
        const originalSection = currentSectionIndex;
        let allValid = true;
        
        // Check each section
        for (let i = 0; i < formSections.length; i++) {
            goToSection(i);
            const sectionValid = validateCurrentSection();
            if (!sectionValid) {
                allValid = false;
                break;
            }
        }
        
        // Return to original section if not valid
        if (!allValid) {
            goToSection(currentSectionIndex);
        } else {
            // Otherwise return to the section we were on
            goToSection(originalSection);
        }
        
        return allValid;
    }
});
