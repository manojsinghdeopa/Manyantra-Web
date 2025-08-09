async function getAnimalSpeech(text, animal) {
    const apiUrl = "https://us-central1-blackblock-14d67.cloudfunctions.net/textToSpeech";

    try {
        // Sending POST request with text and selected animal
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: text, animal: animal }),
        });

        if (!response.ok) throw new Error("Failed to generate speech");

        // Convert response to Blob and create audio URL
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        // Play the generated sound
        const audio = new Audio(audioUrl);
        audio.play();

    } catch (error) {
        console.error("Error:", error);
        alert("Error generating animal voice");
    }
}

// Example: Call function when a button is clicked
document.getElementById("generateButton").addEventListener("click", function () {
    const text = document.getElementById("textInput").value;
    const animal = document.getElementById("animalSelect").value;
    getAnimalSpeech(text, animal);
});
