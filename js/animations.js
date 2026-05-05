// animations.js
// Handles the timed simulation of an AI analyzing the document

function simulateAIProcessing(fileName) {
    const dropZone = document.getElementById("drop-zone");
    const aiPanel = document.getElementById("ai-panel");
    const progressBar = document.getElementById("ai-progress-bar");
    const statusText = document.getElementById("ai-status-text");
    const subText = document.getElementById("ai-sub-text");
    
    // Steps
    const step1 = document.getElementById("step-1");
    const step2 = document.getElementById("step-2");
    const step3 = document.getElementById("step-3");
    
    // Reset state
    dropZone.style.display = "none";
    aiPanel.style.display = "block";
    progressBar.style.width = "0%";
    
    [step1, step2, step3].forEach(s => {
        s.className = "step"; // remove active/completed
        s.querySelector("i").className = "ph ph-circle";
    });

    // Sequence Simulation
    setTimeout(() => {
        // Step 1: Parsing
        statusText.innerText = "Parsing Document Layout";
        subText.innerText = `Reading text from: ${fileName}`;
        progressBar.style.width = "33%";
        step1.classList.add("active");
        step1.querySelector("i").className = "ph ph-spinner-gap";
    }, 500);

    setTimeout(() => {
        // Complete Step 1, Start Step 2
        step1.classList.remove("active");
        step1.classList.add("completed");
        step1.querySelector("i").className = "ph ph-check-circle";

        statusText.innerText = "Extracting Skills";
        subText.innerText = "Identifying key competencies and technologies using NLP.";
        progressBar.style.width = "66%";
        step2.classList.add("active");
        step2.querySelector("i").className = "ph ph-spinner-gap";
    }, 2500);

    setTimeout(() => {
        // Complete Step 2, Start Step 3
        step2.classList.remove("active");
        step2.classList.add("completed");
        step2.querySelector("i").className = "ph ph-check-circle";

        statusText.innerText = "Matching with Open Roles";
        subText.innerText = "Calculating similarity score with 'Senior Frontend Engineer'";
        progressBar.style.width = "90%";
        step3.classList.add("active");
        step3.querySelector("i").className = "ph ph-spinner-gap";
    }, 4500);

    setTimeout(() => {
        // Complete Step 3
        step3.classList.remove("active");
        step3.classList.add("completed");
        step3.querySelector("i").className = "ph ph-check-circle";

        progressBar.style.width = "100%";
        statusText.innerText = "Analysis Complete";
        subText.innerText = "Candidate profile successfully generated.";
        
        // Add a mock new candidate
        finishProcessingAndAddCandidate(fileName);
    }, 6500);
}

function finishProcessingAndAddCandidate(fileName) {
    setTimeout(() => {
        // Hide panel and restore drop zone
        const dropZone = document.getElementById("drop-zone");
        const aiPanel = document.getElementById("ai-panel");
        
        aiPanel.style.display = "none";
        dropZone.style.display = "block";
        
        // Add new candidate to the top of mockData
        const newName = fileName.split(".")[0] || "New Candidate";
        
        const newCandidate = {
            id: "c" + Date.now(),
            name: newName,
            email: newName.toLowerCase().replace(" ", ".") + "@example.com",
            role: "Frontend Engineer (Auto-Matched)",
            avatar: newName.charAt(0).toUpperCase(),
            score: Math.floor(Math.random() * (99 - 75 + 1) + 75), // Random high score
            status: "Reviewed",
            skills: ["JavaScript", "React", "CSS"],
            missingSkills: []
        };
        
        mockCandidates.unshift(newCandidate);
        renderCandidates(); // re-render table
        
        // Visual feedback for the new row could be added here
        
    }, 1500);
}
