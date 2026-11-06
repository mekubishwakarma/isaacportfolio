
const form = document.getElementById("portfolioForm");
const message = document.getElementById("message");

// Save portfolio details
if (form) {
    form.addEventListener("submit", async function(event) {
        event.preventDefault();

        const portfolio = {
            name: document.getElementById("name").value.trim(),
            college: document.getElementById("college").value.trim(),
            course: document.getElementById("course").value.trim(),
            email: document.getElementById("email").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            location: document.getElementById("location").value.trim(),
            about: document.getElementById("about").value.trim(),
            skills: document.getElementById("skills").value.trim(),
            projects: document.getElementById("projects").value.trim()
        };

        try {
            message.textContent = "Saving your portfolio...";
            message.style.color = "#67e8f9";

            const response = await fetch("/api/portfolios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(portfolio)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Unable to save portfolio");
            }

            // Redirect to the separate portfolio webpage
            window.location.href = `/portfolio/${result.portfolio._id}`;

        } catch (error) {
            message.textContent = error.message;
            message.style.color = "#f87171";
        }
    });
}

// Load details on the portfolio display page
const detailsContainer = document.getElementById("portfolioDetails");

if (detailsContainer) {
    loadPortfolioDetails();
}

async function loadPortfolioDetails() {
    const id = window.location.pathname.split("/").pop();

    try {
        const response = await fetch(`/api/portfolios/${id}`);

        if (!response.ok) {
            throw new Error("Portfolio not found");
        }

        const data = await response.json();

        document.getElementById("displayName").textContent = data.name;

        function addDetail(label, value) {
            const section = document.createElement("div");
            section.className = "detail-item";

            const heading = document.createElement("h3");
            heading.textContent = label;

            const paragraph = document.createElement("p");
            paragraph.textContent = value || "Not provided";

            section.appendChild(heading);
            section.appendChild(paragraph);

            detailsContainer.appendChild(section);
        }

        addDetail("College", data.college);
        addDetail("Course", data.course);
        addDetail("Email", data.email);
        addDetail("Phone", data.phone);
        addDetail("Location", data.location);
        addDetail("About Me", data.about);
        addDetail("Skills", data.skills);
        addDetail("Projects", data.projects);

    } catch (error) {
        detailsContainer.textContent = error.message;
    }
}
