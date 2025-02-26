// Show/hide "Other" text fields when corresponding checkboxes/radio buttons are clicked
document.addEventListener('DOMContentLoaded', function() {
    // Add this at the beginning of your script.js file, inside the DOMContentLoaded event listener

// Progress Bar and Multi-step Form Logic
const sections = document.querySelectorAll('.form-section');
const progressLabels = document.querySelectorAll('.progress-label');
const progressBar = document.getElementById('form-progress');
let currentSection = 0;

// Add navigation buttons to each section except the last one
sections.forEach((section, index) => {
  // Add active class to first section
  if (index === 0) {
    section.classList.add('active-section');
  }
  
  // Create navigation buttons
  const navDiv = document.createElement('div');
  navDiv.className = 'form-navigation';
  
  if (index > 0) {
    const prevButton = document.createElement('button');
    prevButton.type = 'button';
    prevButton.className = 'nav-button prev-button';
    prevButton.textContent = 'Previous';
    prevButton.addEventListener('click', () => goToSection(index - 1));
    navDiv.appendChild(prevButton);
  } else {
    // Create empty div for spacing when there's no prev button
    const spacer = document.createElement('div');
    navDiv.appendChild(spacer);
  }
  
  if (index < sections.length - 1) {
    const nextButton = document.createElement('button');
    nextButton.type = 'button';
    nextButton.className = 'nav-button next-button';
    nextButton.textContent = 'Next';
    nextButton.addEventListener('click', () => {
      // Validate current section before moving forward
      if (validateSection(index)) {
        goToSection(index + 1);
      }
    });
    navDiv.appendChild(nextButton);
  } else {
    // Move submit button to navigation area for last section
    const submitContainer = document.createElement('div');
    submitContainer.className = 'submit-container';
    
    // Create a new submit button
    const submitButton = document.querySelector('button[type="submit"]').cloneNode(true);
    
    // Hide the original submit button
    document.querySelector('button[type="submit"]').style.display = 'none';
    
    submitContainer.appendChild(submitButton);
    section.appendChild(submitContainer);
  }
  
  section.appendChild(navDiv);
});

// Add click events to progress labels
progressLabels.forEach((label, index) => {
  label.addEventListener('click', () => {
    // Only allow clicking if all previous sections are validated
    let canProceed = true;
    for (let i = 0; i < index; i++) {
      if (!validateSection(i)) {
        canProceed = false;
        break;
      }
    }
    
    if (canProceed) {
      goToSection(index);
    }
  });
});

// Function to validate a section
function validateSection(sectionIndex) {
  const section = sections[sectionIndex];
  const requiredFields = section.querySelectorAll('input[required], select[required], textarea[required]');
  const checkboxGroups = section.querySelectorAll('input[type="checkbox"][required]');
  
  // Check regular required fields
  let isValid = true;
  requiredFields.forEach(field => {
    if (!field.value) {
      isValid = false;
      field.classList.add('invalid');
      
      // Add error message if it doesn't exist
      let errorMsg = field.nextElementSibling;
      if (!errorMsg || !errorMsg.classList.contains('error-message')) {
        errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.textContent = 'This field is required';
        field.parentNode.insertBefore(errorMsg, field.nextSibling);
      }
    } else {
      field.classList.remove('invalid');
      const errorMsg = field.nextElementSibling;
      if (errorMsg && errorMsg.classList.contains('error-message')) {
        errorMsg.remove();
      }
    }
  });
  
  // Handle checkbox groups (we only need one checkbox checked for the group to be valid)
  checkboxGroups.forEach(checkbox => {
    const name = checkbox.getAttribute('name');
    const groupChecked = section.querySelector(`input[name="${name}"]:checked`);
    
    if (!groupChecked) {
      isValid = false;
      // Find the checkbox group container
      const container = checkbox.closest('.checkbox-group');
      container.classList.add('invalid');
      
      // Add error message if it doesn't exist
      let errorMsg = container.nextElementSibling;
      if (!errorMsg || !errorMsg.classList.contains('error-message')) {
        errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.textContent = 'Please select at least one option';
        container.parentNode.insertBefore(errorMsg, container.nextSibling);
      }
    } else {
      const container = checkbox.closest('.checkbox-group');
      container.classList.remove('invalid');
      const errorMsg = container.nextElementSibling;
      if (errorMsg && errorMsg.classList.contains('error-message')) {
        errorMsg.remove();
      }
    }
  });
  
  return isValid;
}

// Function to go to a specific section
function goToSection(index) {
  // Update active section
  sections.forEach(section => section.classList.remove('active-section'));
  sections[index].classList.add('active-section');
  
  // Update progress bar
  const progress = ((index + 1) / sections.length) * 100;
  progressBar.style.width = `${progress}%`;
  
  // Update active label
  progressLabels.forEach(label => label.classList.remove('active'));
  progressLabels[index].classList.add('active');
  
  // Update current section index
  currentSection = index;
  
  // Scroll to top of form
  document.getElementById('survey').scrollIntoView({ behavior: 'smooth' });
}

// Add error message styles to the CSS
document.head.insertAdjacentHTML('beforeend', `
  <style>
    .invalid {
      border-color: #dc3545 !important;
    }
    
    .error-message {
      color: #dc3545;
      font-size: 0.85rem;
      margin-top: 0.25rem;
    }
    
    .checkbox-group.invalid {
      padding: 5px;
      border-radius: 4px;
      background-color: rgba(220, 53, 69, 0.05);
    }
  </style>
`);
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
            // Convert nutrient intake values to daily servings
formDataObj = calculateDailyServings(formDataObj);
            // Log the data being sent (for debugging)
            console.log("Form data being sent:", formDataObj);
            
            // Convert to URL parameters for Google Apps Script
            const formDataParams = new URLSearchParams();
            Object.keys(formDataObj).forEach(key => {
                formDataParams.append(key, formDataObj[key]);
            });
            
            // Your Google Apps Script Web App URL - replace with your new deployment URL if needed
            const scriptURL = 'https://script.google.com/macros/s/AKfycbw3A7vNKP0DJTCC79FvnsDnYvmhiOsWtQ0z3fBKJeLP1QIQZMduEhU5pNbu71FcseqK/exec';
            
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
// Function to convert servings per week to daily values
function calculateDailyServings(formDataObj) {
  // Array of nutrient intake fields
  const nutrientFields = ['sodium-intake', 'potassium-intake', 'magnesium-intake', 'calcium-intake'];
  
  // Clone the original data object to avoid modifying it directly
  const convertedData = {...formDataObj};
  
  nutrientFields.forEach(field => {
    const value = formDataObj[field];
    
    if (value) {
      let dailyValue;
      
      // Convert string values to numeric daily values
      if (value === '0') {
        dailyValue = 0;
      } else if (value === '1-3') {
        // Average of 1-3 servings per week = 2 / 7 days
        dailyValue = (2 / 7).toFixed(2);
      } else if (value === '4-6') {
        // Average of 4-6 servings per week = 5 / 7 days
        dailyValue = (5 / 7).toFixed(2);
      } else if (value === '7') {
        // 7 servings per week = 1 per day
        dailyValue = 1;
      } else if (value === '14') {
        // 14 servings per week = 2 per day
        dailyValue = 2;
      } else if (value === '21') {
        // 21 servings per week = 3 per day
        dailyValue = 3;
      } else if (value === '28') {
        // 28 servings per week = 4 per day
        dailyValue = 4;
      } else if (value === '35+') {
        // 35+ servings per week = 5+ per day
        dailyValue = 5;
      } else {
        // For any other values, use as is
        dailyValue = value;
      }
      
      // Add a new field with the daily value
      convertedData[field + '-daily'] = dailyValue;
    }
  });
  
  return convertedData;
}
