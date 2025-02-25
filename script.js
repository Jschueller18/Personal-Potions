function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Log what we received for debugging
  Logger.log("Received data: " + JSON.stringify(e));
  
  // Get form data - fix the parameter access
  var formData;
  if (e.postData) {
    // If data comes as POST data
    try {
      formData = JSON.parse(e.postData.contents);
    } catch (e) {
      // If it's not valid JSON, try to parse as URL parameters
      formData = e.parameter || {};
    }
  } else {
    // Fallback to parameter if postData doesn't exist
    formData = e.parameter || {};
  }
  
  // Check if headers exist, if not add them
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  if (headers.length === 0 || headers[0] === "") {
    sheet.appendRow([
      "Timestamp",
      "First Name",
      "Last Name",
      "Email",
      "Age",
      "Weight (lbs)",
      "Biological Sex",
      "Usage Type",
      "Usage Other",
      "Goals",
      "Sodium Intake",
      "Potassium Intake",
      "Magnesium Intake",
      "Calcium Intake",
      "Supplements",
      "Activity Level",
      "Sweat Level",
      "Health Conditions",
      "Condition Other",
      "Flavor",
      "Flavor Other",
      "Flavor Intensity",
      "Sweetener Amount",
      "Sweetener Type",
      "Additional Info"
    ]);
  }
  
  // Add timestamp and form data to sheet
  sheet.appendRow([
    new Date(),
    formData["first-name"] || "",
    formData["last-name"] || "",
    formData["email"] || "",
    formData["age"] || "",
    formData["weight"] || "",
    formData["biological-sex"] || "",
    formData["usage"] || "",
    formData["usage-other-text"] || "",
    formData["goals"] || "",
    formData["sodium-intake"] || "",
    formData["potassium-intake"] || "",
    formData["magnesium-intake"] || "",
    formData["calcium-intake"] || "",
    formData["supplements"] || "",
    formData["activity-level"] || "",
    formData["sweat-level"] || "",
    formData["conditions"] || "",
    formData["condition-other-text"] || "",
    formData["flavor"] || "",
    formData["flavor-other-text"] || "",
    formData["flavor-intensity"] || "",
    formData["sweetener-amount"] || "",
    formData["sweetener-type"] || "",
    formData["additional-info"] || ""
  ]);
  
  // Return success
  return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
}

// Add a test function that you can run manually
function testDoPost() {
  // Create a test object similar to what the form would send
  var testData = {
    parameter: {
      "first-name": "Test",
      "last-name": "User",
      "email": "test@example.com"
      // You can add more test fields here
    }
  };
  
  // Call doPost with the test data
  doPost(testData);
  
  Logger.log("Test completed");
}
