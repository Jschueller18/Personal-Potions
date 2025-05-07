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
    
    // Initialize nutrient data
    const NUTRIENT_DATA = {
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
    
    // Initialize the dietary estimation toggle and quick estimate functionality
    initDietaryEstimation();
    
    // Function to handle the dietary estimation toggle and quick estimate options
    function initDietaryEstimation() {
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
                // Personal information - extract correct field names
                firstName: formData['first-name'] || '',
                lastName: formData['last-name'] || '',
                email: formData.email,
                age: parseInt(formData.age) || 0,
                weight: parseInt(formData.weight) || 0,
                biologicalSex: formData['biological-sex'] || '',
                
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
                activityLevel: formData['activity-level'] || 'moderately-active',
                sweatLevel: formData['sweat-level'] || 'moderate',
                
                // REMOVED: goals field
                
                dietType: formData['diet-type'] || 'omnivore',
                
                // Intake estimations 
                sodiumIntake: formData['sodium-estimate'] || 'moderate',
                potassiumIntake: formData['potassium-estimate'] || 'moderate',
                magnesiumIntake: formData['magnesium-estimate'] || 'moderate',
                calciumIntake: formData['calcium-estimate'] || 'moderate',
                
                // Other fields
                hydrationChallenges: Array.isArray(formData.hydrationChallenges) ? 
                                    formData.hydrationChallenges : [],
                healthConditions: Array.isArray(formData.conditions) ? 
                                 formData.conditions : [],
                                 
                // Add other needed fields
                workoutDuration: formData['workout-duration'] || '',
                workoutIntensity: formData['workout-intensity'] || '',
                menstrualFlow: formData['menstrual-flow'] || '',
                symptomSeverity: formData['symptom-severity'] || '',
                waterIntake: formData['water-intake'] || '',
                waterRetention: formData['water-retention'] || '',
                muscleTension: formData['muscle-tension'] || '',
                
                // Supplements
                sodiumSupplement: parseInt(formData['sodium-supplement']) || null,
                potassiumSupplement: parseInt(formData['potassium-supplement']) || null,
                magnesiumSupplement: parseInt(formData['magnesium-supplement']) || null,
                calciumSupplement: parseInt(formData['calcium-supplement']) || null,
                
                // Nutrition details
                proteinIntake: formData['protein-intake'] || '',
                vitaminDStatus: formData['vitamin-d-status'] || '',
                menstrualStatus: formData['menstrual-status'] || '',
                dairyIntake: parseFloat(formData['dairy-intake']) || null,
                
                // Flavor preferences
                flavor: formData.flavor || '',
                flavorIntensity: formData['flavor-intensity'] || '',
                sweetenerAmount: formData['sweetener-amount'] || '',
                sweetenerType: formData['sweetener-type'] || '',
                
                // User feedback 
                feedback: formData.feedback || formData['additional-info'] || '',
                
                // Arrays from checkbox groups
                exerciseType: Array.isArray(formData['exercise-type']) ? 
                             formData['exercise-type'] : [],
                boneHealth: Array.isArray(formData['bone-health']) ? 
                           formData['bone-health'] : [],
                sleepGoals: Array.isArray(formData['sleep-goals']) ? 
                           formData['sleep-goals'] : [],
                menstrualSymptoms: Array.isArray(formData['menstrual-symptoms']) ? 
                                  formData['menstrual-symptoms'] : [],
                dailyGoals: Array.isArray(formData['daily-goals']) ? 
                           formData['daily-goals'] : []
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
            fetch('http://localhost:5000/api/customers/survey', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(customerData)
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
                    // Support both MongoDB (_id) and Supabase (id) formats
                    const customerId = data.customer._id || data.customer.id;
                    console.log('Customer created successfully:', {
                        id: customerId,
                        name: `${data.customer.firstName} ${data.customer.lastName}`,
                        email: data.customer.email
                    });
                }
                
                if (data.formulation) {
                    console.log('Formulation generated successfully:', {
                        id: data.formulation._id || data.formulation.id,
                        useCase: data.formulation.useCase,
                        servingsPerDay: data.formulation.recommendedServingsPerDay
                    });
                }
                
                responseMessage.textContent = "Thank you! Your personalized electrolyte mix details will be sent to your email shortly.";
                responseMessage.style.color = "#1E4A2D";
                
                // If we have a customerId and formulation, redirect to results page
                if (data.customer) {
                    // Support both MongoDB and Supabase ID formats
                    const customerId = data.customer._id || data.customer.id;
                    if (customerId) {
                        console.log('Redirecting to results page with customer ID:', customerId);
                        setTimeout(() => {
                            window.location.href = `/results.html?customerId=${customerId}`;
                        }, 2000);
                        return;
                    }
                }
                
                console.log('No customer ID found in response, resetting form');
                // Otherwise just reset the form
                form.reset();
                formData = {}; // Reset stored data
                // Reset to first section
                goToSection(0);
            })
            .catch(error => {
                console.error('Submission error:', error);
                
                // Always redirect to results, even if there's a server error
                if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('Server error')) {
                    console.log('Server connection failed - redirecting to results page');
                    
                    // Show success message
                    responseMessage.textContent = "Thank you! Redirecting to your results...";
                    responseMessage.style.color = "#1E4A2D";
                    responseMessage.classList.add('visible');
                    
                    // Generate a temporary ID for the results page
                    const tempId = 'temp_' + new Date().getTime();
                    
                    // Redirect to results page after brief delay
                    setTimeout(() => {
                        window.location.href = `/results.html?customerId=${tempId}`;
                    }, 2000);
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

    // === TEST DATA GENERATOR ===
    // Add event listener for the generate test data button
    const generateTestDataBtn = document.getElementById('generate-test-data');
    if (generateTestDataBtn) {
        generateTestDataBtn.addEventListener('click', function() {
            console.log('Generating random test data for form...');
            generateRandomFormData();
        });
    }
    
    // Function to generate random form data
    function generateRandomFormData() {
        // Helper function to get random item from array
        function getRandomItem(array) {
            return array[Math.floor(Math.random() * array.length)];
        }
        
        // Helper function to get random integer between min and max (inclusive)
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        
        // Helper function to randomly select checkboxes
        function selectRandomCheckboxes(name, probability = 0.5) {
            const checkboxes = document.querySelectorAll(`input[type="checkbox"][name="${name}"]`);
            checkboxes.forEach(checkbox => {
                checkbox.checked = Math.random() < probability;
            });
        }
        
        // Fill text inputs
        document.getElementById('first-name').value = getRandomItem(['John', 'Jane', 'Alex', 'Emma', 'Michael', 'Sarah', 'David']);
        document.getElementById('last-name').value = getRandomItem(['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis']);
        document.getElementById('email').value = `test${getRandomInt(100, 999)}@example.com`;
        document.getElementById('age').value = getRandomInt(18, 65);
        document.getElementById('weight').value = getRandomInt(100, 250);
        
        // Clear additional-info since we removed it from schema
        if (document.getElementById('additional-info')) {
            document.getElementById('additional-info').value = '';
        }
        
        // Fill feedback
        document.getElementById('feedback').value = getRandomItem([
            'This survey is great!', 
            'Looking forward to trying the product.', 
            'I have high expectations for this.', 
            '',
            'Please make the mix not too sweet.'
        ]);
        
        // Select biological sex - make sure one is always selected
        const maleRadio = document.getElementById('sex-male');
        const femaleRadio = document.getElementById('sex-female');
        
        // Make sure biological sex is always set
        if (Math.random() > 0.5) {
            maleRadio.checked = true;
            femaleRadio.checked = false;
            formData['biological-sex'] = 'male';
        } else {
            femaleRadio.checked = true;
            maleRadio.checked = false;
            formData['biological-sex'] = 'female';
        }
        
        // Save all data from current section
        saveCurrentSectionData();
        
        // Select random usage options
        selectRandomCheckboxes('usage');
        
        // Set activity level
        const activityLevels = ['sedentary', 'lightly-active', 'moderately-active', 'very-active'];
        const activityLevelSelect = document.getElementById('activity-level');
        if (activityLevelSelect) {
            activityLevelSelect.value = getRandomItem(activityLevels);
        }
        
        // Set sweat level
        const sweatLevels = ['minimal', 'light', 'moderate', 'heavy', 'excessive'];
        const sweatLevelSelect = document.getElementById('sweat-level');
        if (sweatLevelSelect) {
            sweatLevelSelect.value = getRandomItem(sweatLevels);
        }
        
        // Set diet type
        const dietTypes = ['omnivore', 'vegetarian', 'vegan', 'pescatarian'];
        const dietTypeSelect = document.getElementById('diet-type');
        if (dietTypeSelect) {
            dietTypeSelect.value = getRandomItem(dietTypes);
        }
        
        // Fill intake estimates for electrolytes
        const intakeLevels = ['low', 'moderate', 'high'];
        
        // Set sodium intake - Make sure we set estimate values that will be used in submission
        document.querySelectorAll('input[name="sodium-estimate"]').forEach(radio => {
            radio.checked = false;
        });
        const sodiumEstimate = getRandomItem(intakeLevels);
        const sodiumRadio = document.querySelector(`input[name="sodium-estimate"][value="${sodiumEstimate}"]`);
        if (sodiumRadio) {
            sodiumRadio.checked = true;
            // Set this estimate in formData directly to ensure it's picked up
            formData['sodium-estimate'] = sodiumEstimate;
        }
        document.getElementById('sodium-intake').value = getRandomInt(2, 8);
        
        // Set potassium intake
        document.querySelectorAll('input[name="potassium-estimate"]').forEach(radio => {
            radio.checked = false;
        });
        const potassiumEstimate = getRandomItem(intakeLevels);
        const potassiumRadio = document.querySelector(`input[name="potassium-estimate"][value="${potassiumEstimate}"]`);
        if (potassiumRadio) {
            potassiumRadio.checked = true;
            formData['potassium-estimate'] = potassiumEstimate;
        }
        document.getElementById('potassium-intake').value = getRandomInt(2, 8);
        
        // Set magnesium intake
        document.querySelectorAll('input[name="magnesium-estimate"]').forEach(radio => {
            radio.checked = false;
        });
        const magnesiumEstimate = getRandomItem(intakeLevels);
        const magnesiumRadio = document.querySelector(`input[name="magnesium-estimate"][value="${magnesiumEstimate}"]`);
        if (magnesiumRadio) {
            magnesiumRadio.checked = true;
            formData['magnesium-estimate'] = magnesiumEstimate;
        }
        document.getElementById('magnesium-intake').value = getRandomInt(1, 5);
        
        // Set calcium intake
        document.querySelectorAll('input[name="calcium-estimate"]').forEach(radio => {
            radio.checked = false;
        });
        const calciumEstimate = getRandomItem(intakeLevels);
        const calciumRadio = document.querySelector(`input[name="calcium-estimate"][value="${calciumEstimate}"]`);
        if (calciumRadio) {
            calciumRadio.checked = true;
            formData['calcium-estimate'] = calciumEstimate;
        }
        document.getElementById('calcium-intake').value = getRandomInt(1, 5);
        
        // Set supplement values
        document.getElementById('sodium-supplement').value = Math.random() < 0.3 ? getRandomInt(100, 1000) : '';
        document.getElementById('potassium-supplement').value = Math.random() < 0.3 ? getRandomInt(100, 1000) : '';
        document.getElementById('magnesium-supplement').value = Math.random() < 0.5 ? getRandomInt(100, 400) : '';
        document.getElementById('calcium-supplement').value = Math.random() < 0.3 ? getRandomInt(100, 1000) : '';
        
        // Set dairy intake (servings per day)
        const dairyIntakeElement = document.getElementById('dairy-intake');
        if (dairyIntakeElement) {
            // Generate a random number between 0 and 5 with one decimal place
            const randomDairyIntake = (Math.random() * 5).toFixed(1);
            dairyIntakeElement.value = randomDairyIntake;
            formData['dairy-intake'] = randomDairyIntake;
        }
        
        // Select random exercise types
        selectRandomCheckboxes('exercise-type');
        
        // Select random bone health options
        selectRandomCheckboxes('bone-health');
        
        // Select random health conditions
        selectRandomCheckboxes('conditions');
        
        // Set flavor preference
        const flavors = ['orange', 'lemon-lime', 'cocoa', 'mango'];
        const flavorOptions = document.querySelectorAll('input[name="flavor"]');
        flavorOptions.forEach(flavor => {
            flavor.checked = false;
        });
        const randomFlavor = document.querySelector(`input[name="flavor"][value="${getRandomItem(flavors)}"]`);
        if (randomFlavor) randomFlavor.checked = true;
        
        // Set flavor intensity
        const flavorIntensities = ['light', 'medium', 'high'];
        const flavorIntensitySelect = document.getElementById('flavor-intensity');
        if (flavorIntensitySelect) {
            flavorIntensitySelect.value = getRandomItem(flavorIntensities);
        }
        
        // Set sweetener amount
        const sweetenerAmounts = ['none', 'light', 'medium', 'high'];
        const sweetenerAmountSelect = document.getElementById('sweetener-amount');
        if (sweetenerAmountSelect) {
            sweetenerAmountSelect.value = getRandomItem(sweetenerAmounts);
        }
        
        // Set sweetener type
        const sweetenerTypes = ['stevia-erythritol', 'cane-sugar'];
        const sweetenerTypeSelect = document.getElementById('sweetener-type');
        if (sweetenerTypeSelect) {
            sweetenerTypeSelect.value = getRandomItem(sweetenerTypes);
        }
        
        // Set values for any select elements we might have missed
        document.querySelectorAll('select').forEach(select => {
            // Skip selects we've already handled and those with no options
            if (select.value || select.options.length <= 1) return;
            
            // Filter out the disabled option (usually the first one)
            const validOptions = Array.from(select.options).filter(option => !option.disabled);
            if (validOptions.length > 0) {
                const randomOption = getRandomItem(validOptions);
                select.value = randomOption.value;
            }
        });
        
        console.log('Random test data generated!');
        alert('Test data generated! Click Next to see data and continue through the form.');
    }
});
