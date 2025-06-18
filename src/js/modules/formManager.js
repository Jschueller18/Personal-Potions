// Form Manager Module
// Handles form data collection, navigation, and state management

export function collectAllFormData() {
    console.log('Collecting all form data before submission');
    const formData = {}; // Reset to avoid stale data

    // --- Basic Personal Information ---
    formData['first-name'] = document.getElementById('first-name')?.value || '';
    formData['last-name'] = document.getElementById('last-name')?.value || '';
    formData['email'] = document.getElementById('email')?.value || '';
    formData['age'] = document.getElementById('age')?.value ? Number(document.getElementById('age').value) : null;
    formData['weight'] = document.getElementById('weight')?.value ? Number(document.getElementById('weight').value) : null;
    formData['biological-sex'] = document.querySelector('input[name="biological-sex"]:checked')?.value || '';
    formData['feedback'] = document.getElementById('additional-info')?.value || '';

    // --- Usage & Goals ---
    formData.usage = Array.from(document.querySelectorAll('input[name="usage"]:checked')).map(cb => cb.value);

    // --- Conditional Usage Details ---
    if (formData.usage.includes('daily')) {
        formData['daily-goals'] = Array.from(document.querySelectorAll('input[name="daily-goals"]:checked')).map(cb => cb.value);
        formData['water-intake'] = document.getElementById('water-intake')?.value || null;
    }
    if (formData.usage.includes('sweat')) {
        formData['workout-duration'] = document.getElementById('workout-duration')?.value || null;
        formData['workout-intensity'] = document.getElementById('workout-intensity')?.value || null;
    }
    if (formData.usage.includes('bedtime')) {
        formData['sleep-goals'] = Array.from(document.querySelectorAll('input[name="sleep-goals"]:checked')).map(cb => cb.value);
    }
    if (formData.usage.includes('menstrual')) {
        formData['menstrual-symptoms'] = Array.from(document.querySelectorAll('input[name="menstrual-symptoms"]:checked')).map(cb => cb.value);
        formData['symptom-severity'] = document.getElementById('symptom-severity')?.value || null;
        formData['menstrual-flow'] = document.getElementById('menstrual-flow')?.value || null;
        formData['water-retention'] = document.getElementById('water-retention')?.value || null;
        formData['muscle-tension'] = document.getElementById('muscle-tension')?.value || null;
        formData['menstrual-status'] = document.getElementById('menstrual-status')?.value || null;
    }
    if (formData.usage.includes('hangover')) {
        // Convert hangover symptoms to array and filter out empty values
        const hangoverSymptomsElement = document.getElementById('hangover-symptoms');
        if (hangoverSymptomsElement) {
            const symptoms = hangoverSymptomsElement.value
                .split(',')
                .map(s => s.trim())
                .filter(s => s);
            formData['hangover-symptoms'] = symptoms;
        }
        
        // Ensure hangover timing is one of the valid values, default to 'during' if invalid
        const hangoverTimingElement = document.getElementById('hangover-timing');
        if (hangoverTimingElement) {
            const timing = hangoverTimingElement.value;
            formData['hangover-timing'] = ['before', 'during', 'after'].includes(timing) ? 
                timing : 'during';
        } else {
            formData['hangover-timing'] = 'during';
        }
    }

    // --- Dietary Information ---
    formData['diet-type'] = document.getElementById('diet-type')?.value || '';
    formData['protein-intake'] = document.getElementById('protein-intake')?.value || '';
    formData['sodium-intake'] = document.getElementById('sodium-intake')?.value ? Number(document.getElementById('sodium-intake').value) : null;
    formData['potassium-intake'] = document.getElementById('potassium-intake')?.value ? Number(document.getElementById('potassium-intake').value) : null;
    formData['magnesium-intake'] = document.getElementById('magnesium-intake')?.value ? Number(document.getElementById('magnesium-intake').value) : null;
    formData['calcium-intake'] = document.getElementById('calcium-intake')?.value ? Number(document.getElementById('calcium-intake').value) : null;
    formData['dairy-intake'] = document.getElementById('dairy-intake')?.value ? Number(document.getElementById('dairy-intake').value) : null;
    formData['sodium-supplement'] = document.getElementById('sodium-supplement')?.value ? Number(document.getElementById('sodium-supplement').value) : null;
    formData['potassium-supplement'] = document.getElementById('potassium-supplement')?.value ? Number(document.getElementById('potassium-supplement').value) : null;
    formData['magnesium-supplement'] = document.getElementById('magnesium-supplement')?.value ? Number(document.getElementById('magnesium-supplement').value) : null;
    formData['calcium-supplement'] = document.getElementById('calcium-supplement')?.value ? Number(document.getElementById('calcium-supplement').value) : null;

    // --- Health Profile ---
    formData['activity-level'] = document.getElementById('activity-level')?.value || '';
    formData['exercise-type'] = Array.from(document.querySelectorAll('input[name="exercise-type"]:checked')).map(cb => cb.value);
    formData['sweat-level'] = document.getElementById('sweat-level')?.value || '';
    formData['vitamin-d-status'] = document.getElementById('vitamin-d-status')?.value || '';
    formData['bone-health'] = Array.from(document.querySelectorAll('input[name="bone-health"]:checked')).map(cb => cb.value);
    formData['conditions'] = Array.from(document.querySelectorAll('input[name="conditions"]:checked')).map(cb => cb.value);
    formData['hydration-challenges'] = Array.from(document.querySelectorAll('input[name="hydration-challenges"]:checked')).map(cb => cb.value);

    // --- Flavor Preferences ---
    formData['flavor'] = document.querySelector('input[name="flavor"]:checked')?.value || '';
    formData['flavor-intensity'] = document.getElementById('flavor-intensity')?.value || '';
    formData['sweetener-amount'] = document.getElementById('sweetener-amount')?.value || '';
    formData['sweetener-type'] = document.getElementById('sweetener-type')?.value || '';

    // Debug: log the full collected formData
    console.log('All form data collected (new schema):', formData);
    
    return formData;
}

export function saveCurrentSectionData(formData, currentSectionIndex, formSections) {
    if (!formSections[currentSectionIndex]) return;
    
    const currentSection = formSections[currentSectionIndex];
    const inputs = currentSection.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        if (input.type === 'checkbox' || input.type === 'radio') {
            if (input.checked) {
                if (input.type === 'checkbox') {
                    if (!formData[input.name]) {
                        formData[input.name] = [];
                    }
                    if (!formData[input.name].includes(input.value)) {
                        formData[input.name].push(input.value);
                    }
                } else {
                    formData[input.name] = input.value;
                }
            }
        } else {
            formData[input.name || input.id] = input.value;
        }
    });
}

export function updateSubmitButtonState(formSections, validateAllSections) {
    const submitBtn = document.getElementById('submit-btn');
    if (!submitBtn) return;
    
    const isValid = validateAllSections(formSections);
    
    if (isValid) {
        submitBtn.classList.remove('inactive-submit');
        submitBtn.disabled = false;
    } else {
        submitBtn.classList.add('inactive-submit');
        submitBtn.disabled = true;
    }
}

export function initSuccessMessage() {
    // Check for success parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const responseMessage = document.getElementById('response-message');
    
    if (success === 'true' && responseMessage) {
        responseMessage.textContent = "Thank you! Your personalized electrolyte mix details will be sent to your email shortly.";
        responseMessage.style.color = "#1E4A2D";
        responseMessage.classList.add('visible');
        
        // Scroll to top to show success message
        window.scrollTo(0, 0);
    }
} 