// UI Manager Module
// Handles tooltips, conditional form sections, and UI interactions

export function initElectrolyteTooltips() {
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

export function initTooltips() {
    const tooltips = document.querySelectorAll('.tooltip-icon');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', function() {
            // Nothing needed here, CSS handles the display
        });
    });
}

export function initConditionalSections() {
    // Get conditional elements
    const usageOtherCheckbox = document.getElementById('usage-other');
    const usageOtherContainer = document.getElementById('usage-other-container');
    
    const flavorOtherRadio = document.getElementById('flavor-other');
    const flavorOtherContainer = document.getElementById('flavor-other-container');
    
    const sweetenerAmount = document.getElementById('sweetener-amount');
    const sweetenerTypeContainer = document.getElementById('sweetener-type-container');

    const femaleRadio = document.getElementById('sex-female');
    const femaleSpecificQuestions = document.getElementById('female-specific-questions');

    // Event listeners for "Other" options
    if (usageOtherCheckbox) {
        usageOtherCheckbox.addEventListener('change', function() {
            usageOtherContainer.style.display = this.checked ? 'block' : 'none';
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
    
    // Conditional logic for female-specific questions
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
}

export function initUseCaseHandlers(saveCurrentSectionData) {
    // Add event listeners for use case selection
    document.querySelectorAll('input[name="usage"]').forEach(input => {
        input.addEventListener('change', function() {
            // Get all selected use cases
            const selectedUseCases = Array.from(document.querySelectorAll('input[name="usage"]:checked')).map(cb => cb.value);
            console.log('Selected use cases:', selectedUseCases);
            
            // Handle each use case section
            const workoutSection = document.getElementById('sweat-replacement-details');
            const bedtimeSection = document.getElementById('bedtime-details');
            const dailySection = document.getElementById('daily-mix-details');
            const menstrualSection = document.getElementById('menstrual-details');
            const hangoverSection = document.getElementById('hangover-details');
            
            // Show/hide sections based on selected use cases
            if (workoutSection) {
                workoutSection.style.display = selectedUseCases.includes('sweat') ? 'block' : 'none';
            }
            if (bedtimeSection) {
                bedtimeSection.style.display = selectedUseCases.includes('bedtime') ? 'block' : 'none';
            }
            if (dailySection) {
                dailySection.style.display = selectedUseCases.includes('daily') ? 'block' : 'none';
            }
            if (menstrualSection) {
                menstrualSection.style.display = selectedUseCases.includes('menstrual') ? 'block' : 'none';
            }
            if (hangoverSection) {
                hangoverSection.style.display = selectedUseCases.includes('hangover') ? 'block' : 'none';
            }
            
            // Save the current section data
            if (saveCurrentSectionData) {
                saveCurrentSectionData();
            }
        });
    });
}

export function updateFormProgress(currentSectionIndex, totalSections) {
    const progressBar = document.getElementById('form-progress');
    const progressLabels = document.querySelectorAll('.progress-label');
    
    if (progressBar) {
        const progressPercentage = ((currentSectionIndex + 1) / totalSections) * 100;
        progressBar.style.width = progressPercentage + '%';
    }
    
    // Update progress labels
    progressLabels.forEach((label, index) => {
        if (index <= currentSectionIndex) {
            label.classList.add('active');
        } else {
            label.classList.remove('active');
        }
    });
}

export function goToSection(index, formSections, currentSectionIndex) {
    // Hide all sections
    formSections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show target section
    if (formSections[index]) {
        formSections[index].style.display = 'block';
        currentSectionIndex = index;
    }
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    
    if (prevBtn) {
        prevBtn.style.display = index === 0 ? 'none' : 'inline-block';
    }
    
    if (nextBtn) {
        nextBtn.style.display = index === formSections.length - 1 ? 'none' : 'inline-block';
    }
    
    if (submitBtn) {
        submitBtn.style.display = index === formSections.length - 1 ? 'inline-block' : 'none';
    }
    
    // Update progress
    updateFormProgress(index, formSections.length);
    
    // Scroll to top of form
    const surveySection = document.getElementById('survey');
    if (surveySection) {
        surveySection.scrollIntoView({ behavior: 'smooth' });
    }
    
    return currentSectionIndex;
} 