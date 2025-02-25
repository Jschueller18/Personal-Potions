/* script.js */
document.getElementById("survey-form").addEventListener("submit", function(event) {
    event.preventDefault();

    let formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        feedback: document.getElementById("feedback").value
    };

    fetch("https://docs.google.com/spreadsheets/d/1-CG8yGdx_DU0U-l5f05Sh1803C1NE_UFZk1HDr-JaiU/edit?gid=0#gid=0", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById("response-message").innerText = "Thank you for your feedback!";
        document.getElementById("survey-form").reset();
    })
    .catch(error => console.error("Error:", error));
});