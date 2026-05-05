// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
    renderCandidates();
    setupDragAndDrop();
    setupUploadButton();
});

function renderCandidates() {
    const tbody = document.getElementById("candidates-tbody");
    tbody.innerHTML = "";

    mockCandidates.forEach(cand => {
        const tr = document.createElement("tr");

        let badgeClass = "badge-gray";
        if (cand.status === "Shortlisted" || cand.status === "Interview") badgeClass = "badge-green";
        if (cand.status === "Reviewed") badgeClass = "badge-blue";
        if (cand.status === "Rejected") badgeClass = "badge-gray"; // or red if preferred
        
        let scoreClass = "score-low";
        if (cand.score >= 80) scoreClass = "score-high";
        else if (cand.score >= 60) scoreClass = "score-med";

        tr.innerHTML = `
            <td>
                <div class="candidate-info">
                    <div class="avatar">${cand.avatar}</div>
                    <div class="candidate-details">
                        <h4>${cand.name}</h4>
                        <p>${cand.email}</p>
                    </div>
                </div>
            </td>
            <td>${cand.role}</td>
            <td class="score-cell ${scoreClass}">${cand.score}% Match</td>
            <td><span class="badge ${badgeClass}">${cand.status}</span></td>
            <td><button class="secondary-btn" onclick="viewCandidate('${cand.id}')">View Notes</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function viewCandidate(id) {
    const cand = mockCandidates.find(c => c.id === id);
    if (!cand) return;

    document.getElementById("modal-avatar").innerText = cand.avatar;
    document.getElementById("modal-name").innerText = cand.name;
    document.getElementById("modal-role").innerText = cand.role;

    // Score Ring Animation
    const scoreText = document.getElementById("modal-score-text");
    const scoreRing = document.getElementById("modal-score-ring");
    
    scoreText.innerText = cand.score + "%";
    
    // Set circle color based on score
    if(cand.score >= 80) {
        scoreRing.style.stroke = "var(--text-green)";
        scoreText.style.color = "var(--text-green)";
    } else if(cand.score >= 60) {
        scoreRing.style.stroke = "var(--primary-color)";
        scoreText.style.color = "var(--primary-color)";
    } else {
        scoreRing.style.stroke = "var(--text-red)";
        scoreText.style.color = "var(--text-red)";
    }

    // Calculate dash offset: (100 - score) / 100 * 314
    const offset = ((100 - cand.score) / 100) * 314;
    scoreRing.style.strokeDashoffset = "314"; // reset context
    setTimeout(() => {
        scoreRing.style.strokeDashoffset = offset;
    }, 100);

    // Populate Skills
    const matchedSkillsContainer = document.getElementById("matched-skills");
    matchedSkillsContainer.innerHTML = "";
    cand.skills.forEach(skill => {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.innerText = skill;
        matchedSkillsContainer.appendChild(tag);
    });

    const missingSkillsContainer = document.getElementById("missing-skills");
    missingSkillsContainer.innerHTML = "";
    if (cand.missingSkills.length === 0) {
        missingSkillsContainer.innerHTML = "<span style='color:var(--text-muted); font-size:14px;'>No significant skill gaps identified.</span>";
    } else {
        cand.missingSkills.forEach(skill => {
            const tag = document.createElement("span");
            tag.className = "tag tag-missing";
            tag.innerText = skill;
            missingSkillsContainer.appendChild(tag);
        });
    }

    // Recommendation
    const aiText = document.getElementById("ai-recommendation-text");
    if (cand.score >= 80) {
        aiText.innerText = `Excellent technical fit for ${cand.role}. High overlap in core skills. Assess system design approach in the next round.`;
    } else if (cand.score >= 60) {
        aiText.innerText = "Candidate lacks some stated requirements. Focus interview on their ability to learn missing technologies rapidly.";
    } else {
        aiText.innerText = "Significant skill gaps detected. Recommend to reject or route to alternative roles.";
    }

    document.getElementById("candidate-modal").style.display = "flex";
}

function closeModal() {
    document.getElementById("candidate-modal").style.display = "none";
}

function setupUploadButton() {
    const btn = document.getElementById("upload-resume-btn");
    btn.addEventListener("click", () => {
        document.getElementById("file-input").click();
    });
}

function setupDragAndDrop() {
    const dropZone = document.getElementById("drop-zone");
    const fileInput = document.getElementById("file-input");

    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ["dragenter", "dragover"].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.add("dragover");
        }, false);
    });

    ["dragleave", "drop"].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove("dragover");
        }, false);
    });

    dropZone.addEventListener("drop", (e) => {
        let dt = e.dataTransfer;
        let files = dt.files;
        handleFiles(files);
    });

    fileInput.addEventListener("change", function() {
        handleFiles(this.files);
    });
}

function handleFiles(files) {
    if (files.length > 0) {
        // Start the AI Processing Animation
        simulateAIProcessing(files[0].name);
    }
}

// ----------------------------------------------------
// AI Resume Correction Simulation
// ----------------------------------------------------
function runAiCorrection() {
    const btn = document.getElementById("run-correction-btn");
    const resultsContainer = document.getElementById("correction-results");
    const loader = document.getElementById("correction-loader");
    const list = document.getElementById("correction-list");

    // Reset State
    btn.disabled = true;
    btn.innerHTML = `<i class="ph ph-spinner-gap" style="animation: spin 2s linear infinite"></i> Processing...`;
    resultsContainer.style.display = "block";
    loader.style.display = "flex";
    list.style.display = "none";
    list.innerHTML = "";

    // Simulate Network Request / Extraction
    setTimeout(() => {
        const dummyCorrections = [
            {
                old: "Worked on frontend features with team members.",
                new: "Led development of scalable frontend features across cross-functional teams."
            },
            {
                old: "Proficient at using HTML javascript and React.",
                new: "Proficient in HTML, JavaScript, and React.js."
            }
        ];

        dummyCorrections.forEach(corr => {
            const item = document.createElement("div");
            item.className = "correction-item";
            item.innerHTML = `
                <div class="old-text"><i class="ph ph-x-circle"></i> <span style="text-decoration: line-through;">${corr.old}</span></div>
                <div class="new-text"><i class="ph ph-check-circle"></i> <span>${corr.new}</span></div>
            `;
            list.appendChild(item);
        });

        loader.style.display = "none";
        list.style.display = "flex";
        btn.innerHTML = `<i class="ph ph-check"></i> Corrections Applied`;
        
        // Show an indicator
        const nameNode = document.getElementById("modal-name");
        if (!nameNode.innerHTML.includes("ph-magic-wand")) {
            nameNode.innerHTML += ` <i class="ph ph-magic-wand" style="color: var(--primary-color)" title="AI Corrected"></i>`;
        }

    }, 3000); // Simulated 3 seconds correction scan
}

// ----------------------------------------------------
// Basic Dashboard Interactivity
// ----------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    // Splash screen logic
    const splash = document.getElementById("splash-screen");
    const splashBar = document.querySelector(".splash-bar");
    const splashText = document.getElementById("splash-text");
    
    if (splash) {
        setTimeout(() => { splashBar.style.width = "40%"; splashText.innerText = "Parsing incoming resumes..."; }, 600);
        setTimeout(() => { splashBar.style.width = "75%"; splashText.innerText = "Matching skills..."; }, 1400);
        setTimeout(() => { splashBar.style.width = "100%"; splashText.innerText = "Dashboard Ready."; }, 2200);
        setTimeout(() => { 
            splash.style.opacity = "0"; 
            setTimeout(() => splash.style.display = "none", 500);
        }, 2800);
    }

    // Nav Items Active State
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(item => {
        item.addEventListener("click", (e) => {
            navItems.forEach(nav => nav.classList.remove("active"));
            e.currentTarget.classList.add("active");
            
            // Simple visual toast logic could go here
        });
    });

    // Search bar logic
    const searchInput = document.querySelector(".search-bar input");
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        const tbody = document.getElementById("candidates-tbody");
        const rows = tbody.querySelectorAll("tr");

        rows.forEach(row => {
            const name = row.querySelector(".candidate-details h4").innerText.toLowerCase();
            const role = row.querySelector("td:nth-child(2)").innerText.toLowerCase();
            if (name.includes(query) || role.includes(query)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    });

    // Mock generic buttons
    document.querySelectorAll(".filters .secondary-btn, .action-btn .ph-bell").forEach(btn => {
        btn.addEventListener("click", () => {
            btn.style.transform = "scale(0.95)";
            setTimeout(() => btn.style.transform = "none", 100);
        });
    });
});
