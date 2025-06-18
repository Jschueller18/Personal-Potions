// Data Validator Module
// Handles form validation logic

import { 
    isHidden, 
    isUseCaseSelected, 
    shouldSkipValidation, 
    showErrorMessage, 
    hideErrorMessage, 
    showGroupErrorMessage, 
    hideGroupErrorMessage 
} from './validationHelpers.js';

function validateOtherTextField(input, otherCheckboxId, errorMessage) {
    const otherCheckbox = document.getElementById(otherCheckboxId);
    if (otherCheckbox && otherCheckbox.checked) {
        if (!input.value.trim()) {
            showErrorMessage(input, errorMessage);
            return false;
        } else {
            hideErrorMessage(input);
            return true;
        }
    }
    return true;
}

function validateRequiredInput(input) {
    if (shouldSkipValidation(input)) {
        return true;
    }

    // Handle special "Other" text fields
    if (input.id === 'usage-other-text') {
        return validateOtherTextField(input, 'usage-other', 'Please specify your other usage.');
    }
    
    if (input.id === 'flavor-other-text') {
        return validateOtherTextField(input, 'flavor-other', 'Please specify your other flavor preference.');
    }

    // Regular validation for other required fields
    if (!input.value.trim() && !input.id.includes('-other-text')) {
        showErrorMessage(input, 'This field is required.');
        return false;
    } else if (!input.id.includes('-other-text')) {
        hideErrorMessage(input);
        return true;
    }
    
    return true;
}

function validateCheckboxGroup(groupName, section) {
    const checkboxes = section.querySelectorAll(`input[type="checkbox"][name="${groupName}"]`);
    const container = checkboxes[0].closest('.checkbox-group');
    
    if (shouldSkipValidation(container)) {
        return true;
    }
    
    const isGroupValid = Array.from(checkboxes).some(checkbox => checkbox.checked);
    
    if (!isGroupValid) {
        showGroupErrorMessage(container, 'Please select at least one option.');
        return false;
    } else {
        hideGroupErrorMessage(container);
        return true;
    }
}

export function validateCurrentSection(formSections, currentSectionIndex) {
    const currentSection = formSections[currentSectionIndex];
    const requiredInputs = currentSection.querySelectorAll('[required]:not([type="checkbox"])');
    const requiredCheckboxGroups = new Set();
    
    // Collect checkbox groups that have at least one required checkbox
    currentSection.querySelectorAll('input[type="checkbox"][required]').forEach(checkbox => {
        requiredCheckboxGroups.add(checkbox.name);
    });
    
    let isValid = true;
    
    // Validate normal required fields
    requiredInputs.forEach(input => {
        if (!validateRequiredInput(input)) {
            isValid = false;
        }
    });
    
    // Validate checkbox groups
    requiredCheckboxGroups.forEach(groupName => {
        if (!validateCheckboxGroup(groupName, currentSection)) {
            isValid = false;
        }
    });
    
    return isValid;
}

export function validateAllSections(formSections) {
    let isValid = true;
    let hasInteracted = false; // Track if user has interacted with the form
    
    // Validate each section
    formSections.forEach(section => {
        const requiredInputs = section.querySelectorAll('[required]:not([type="checkbox"])');
        const requiredCheckboxGroups = new Set();
        
        // Collect checkbox groups that have at least one required checkbox
        section.querySelectorAll('input[type="checkbox"][required]').forEach(checkbox => {
            requiredCheckboxGroups.add(checkbox.name);
        });
        
        // Validate normal required fields
        requiredInputs.forEach(input => {
            if (shouldSkipValidation(input)) {
                return;
            }
            
            if (!input.value.trim()) {
                isValid = false;
                // Only show validation errors if user has interacted with the form
                if (hasInteracted) {
                    showErrorMessage(input, 'This field is required.');
                }
            } else {
                hideErrorMessage(input);
            }
        });
        
        // Validate checkbox groups
        requiredCheckboxGroups.forEach(groupName => {
            const checkboxes = section.querySelectorAll(`input[type="checkbox"][name="${groupName}"]`);
            const container = checkboxes[0].closest('.checkbox-group');
            
            if (shouldSkipValidation(container)) {
                return;
            }
            
            const isGroupValid = Array.from(checkboxes).some(checkbox => checkbox.checked);
            
            if (!isGroupValid) {
                isValid = false;
                if (hasInteracted) {
                    showGroupErrorMessage(container, 'Please select at least one option.');
                }
            } else {
                hideGroupErrorMessage(container);
            }
        });
    });
    
    return isValid;
} 