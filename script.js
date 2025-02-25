// Show/hide "Other" text fields when corresponding checkboxes/radio buttons are clicked
document.addEventListener('DOMContentLoaded', function() {
    // Handle "Other" options toggling
    const otherOptions = [
        {checkbox: 'usage-other', container: 'usage-other-container'},
        {checkbox: 'condition-other', container: 'condition-other-container'},
        {checkbox: 'flavor-other', container: 'flavor-other-container'}
    ];
    
    otherOptions.forEach(option => {
        const checkbox = document.getElementById(option.checkbox);
        const container = document.getElementById(option.container);
        
        if (checkbox && container) {
            checkbox.addEventListener('change', function() {
                container.style.display = this.checked ? 'block' : 'none';
                if (!this.checked) {
                    const textField = container.querySelector('input[type="text"]');
                    if (textField) textField.value = '';
                }
            });
        }
    });
    
    // Handle sweetener type visibility based on sweetener amount
    const sweetenerAmount = document.getElementById('sweetener-amount');
    const sweetenerTypeContainer = document.getElementById('sweetener-type-container');
    
    if (sweetenerAmount && sweetenerTypeContainer) {
        sweetenerAmount.addEventListener('change', function() {
            sweetenerTypeContainer.style.display = 
                (this.value === 'none') ? 'none' : 'block';
            
            if (this.value === 'none') {
                document.getElementById('sweetener-type').value = '';
            }
        });
    }
    
    // Handle condition checkboxes - if "None" is selected, uncheck others
    const conditionNone = document.getElementById('condition-none');
    const conditionCheckboxes = document.querySelectorAll('input[name="conditions"]');
    
    if (conditionNone && conditionCheckboxes.length > 0) {
        conditionNone.addEventListener('change', function() {
            if (this.checked) {
                conditionCheckboxes.forEach(checkbox => {
                    if (checkbox !== this) {
                        checkbox.checked = false;
                        
                        // If "Other" is unchecked, hide its text field
                        if (checkbox.id === 'condition-other') {
                            document.getElementById('condition-other-container').style.display = 'none';
                            document.getElementById('condition-other-text').value = '';
                        }
                    }
                });
            }
        });
        
        // If any other condition is checked, uncheck "None"
        conditionCheckboxes.forEach(checkbox => {
            if (checkbox !== conditionNone) {
                checkbox.addEventListener('change', function() {
                    if (this.checked) {
                        conditionNone.checked = false;
                    }
                });
            }
        });
    }
    
    // Form submission handler
    const form = document.getElementById('survey-form');
    
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = "Processing...";
            submitButton.disabled = true;
            
            // Collect all form data
            const formData = new FormData(this);
            let formDataObj = {};
            
            // Process checkbox groups (usage, conditions)
            formDataObj.usage = formData.getAll('usage').join(', ');
            formDataObj.conditions = formData.getAll('conditions').join(', ');
            
            // Process all other form fields
            for (const [key, value] of formData.entries()) {
                if (key !== 'usage' && key !== 'conditions') {
                    formDataObj[key] = value;
                }
            }
            
            // Log the data being sent (for debugging)
            console.log("Form data being sent:", formDataObj);
            
            // Convert to URL parameters for Google Apps Script
            const formDataParams = new URLSearchParams();
            Object.keys(formDataObj).forEach(key => {
                formDataParams.append(key, formDataObj[key]);
            });
            
            // Your Google Apps Script Web App URL - replace with your new deployment URL if needed
            const scriptURL = 'https://script.google.com/macros/s/AKfycbxc59PAIKEBZHMq6mI8pAnF9e8cpaNKk_1CfchKsTBR8zs6vzN8990E9zA7g1vhokI3/exec';
            
            // Try sending as URL-encoded form data
            fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors', // Important for cross-origin requests
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formDataParams
            })
            .then(() => {
                // Show success message
                const responseMessage = document.getElementById('response-message');
                responseMessage.textContent = "Thank you for completing the survey! We'll create your personalized electrolyte mix and send the details to your email.";
                responseMessage.className = 'success-message';
                
                // Reset form
                form.reset();
                
                // Reset any shown "Other" fields
                document.getElementById('usage-other-container').style.display = 'none';
                document.getElementById('condition-other-container').style.display = 'none';
                document.getElementById('flavor-other-container').style.display = 'none';
                document.getElementById('sweetener-type-container').style.display = 'none';
                
                // Scroll to response message
                responseMessage.scrollIntoView({ behavior: 'smooth' });
            })
            .catch(error => {
                console.error('Error:', error);
                const responseMessage = document.getElementById('response-message');
                responseMessage.textContent = "There was a problem submitting your survey. Please try again or contact us for assistance.";
                responseMessage.className = 'error-message';
            })
            .finally(() => {
                // Restore button state
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            });
        });
    }
});
