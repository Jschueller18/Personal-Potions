// Validation Helper Functions
// Common utilities for form validation

export function isHidden(el) {
    return (el.offsetParent === null || getComputedStyle(el).display === 'none');
}

export function isUseCaseSelected(detailsId) {
    // Map details IDs to their corresponding checkbox values
    const useCaseMap = {
        'sweat-replacement-details': 'sweat',
        'bedtime-details': 'bedtime',
        'daily-mix-details': 'daily',
        'menstrual-details': 'menstrual',
        'hangover-details': 'hangover'
    };
    
    const useCaseValue = useCaseMap[detailsId];
    if (!useCaseValue) return false;
    
    const checkbox = document.querySelector(`input[name="usage"][value="${useCaseValue}"]`);
    return checkbox && checkbox.checked;
}

export function shouldSkipValidation(input) {
    // Skip validation if the input is in a hidden container
    if (isHidden(input)) {
        return true;
    }
    
    // Skip validation if the input is in a hidden parent
    let parent = input.parentElement;
    while (parent) {
        if (isHidden(parent)) {
            return true;
        }
        parent = parent.parentElement;
    }
    
    // Skip validation if the input is in a hidden use case details section
    if (input.closest('.use-case-details') && !isUseCaseSelected(input.closest('.use-case-details').id)) {
        return true;
    }
    
    return false;
}

export function showErrorMessage(element, message) {
    element.classList.add('invalid');
    
    let errorMessage = element.nextElementSibling;
    if (!errorMessage || !errorMessage.classList.contains('error-message')) {
        errorMessage = document.createElement('p');
        errorMessage.classList.add('error-message', 'visible');
        errorMessage.textContent = message;
        element.parentNode.insertBefore(errorMessage, element.nextSibling);
    } else {
        errorMessage.classList.add('visible');
    }
}

export function hideErrorMessage(element) {
    element.classList.remove('invalid');
    
    const errorMessage = element.nextElementSibling;
    if (errorMessage && errorMessage.classList.contains('error-message')) {
        errorMessage.classList.remove('visible');
    }
}

export function showGroupErrorMessage(container, message) {
    container.classList.add('error');
    
    let errorMessage = container.nextElementSibling;
    if (!errorMessage || !errorMessage.classList.contains('error-message')) {
        errorMessage = document.createElement('p');
        errorMessage.classList.add('error-message', 'visible');
        errorMessage.textContent = message;
        container.parentNode.insertBefore(errorMessage, container.nextSibling);
    } else {
        errorMessage.classList.add('visible');
    }
}

export function hideGroupErrorMessage(container) {
    container.classList.remove('error');
    
    const errorMessage = container.nextElementSibling;
    if (errorMessage && errorMessage.classList.contains('error-message')) {
        errorMessage.classList.remove('visible');
    }
} 