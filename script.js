const jobForm = document.getElementById("jobForm");
const companyInput = document.getElementById("company");
const roleInput = document.getElementById("role");
const dateInput = document.getElementById("date");
const statusInput = document.getElementById("status");
const submitBtn = document.getElementById("submitBtn");

const jobContainer = document.getElementById("jobContainer");
const searchInput = document.getElementById("search");
const filterStatus = document.getElementById("filterStatus");

const totalJobs = document.getElementById("totalJobs");
const appliedJobs = document.getElementById("appliedJobs");
const interviewJobs = document.getElementById("interviewJobs");
const selectedJobs = document.getElementById("selectedJobs");

let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
let editingJobId = null;


// Show jobs when page opens
displayJobs();


// Add or update job
jobForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const company = companyInput.value.trim();
    const role = roleInput.value.trim();
    const date = dateInput.value;
    const status = statusInput.value;

    if (editingJobId !== null) {

        const job = jobs.find(function (item) {
            return item.id === editingJobId;
        });

        if (job) {
            job.company = company;
            job.role = role;
            job.date = date;
            job.status = status;
        }

        editingJobId = null;
        submitBtn.textContent = "Add Job";

    } else {

        const newJob = {
            id: Date.now(),
            company: company,
            role: role,
            date: date,
            status: status
        };

        jobs.push(newJob);
    }

    saveJobs();

    jobForm.reset();

    displayJobs();
});


// Save jobs
function saveJobs() {

    localStorage.setItem("jobs", JSON.stringify(jobs));

}


// Display jobs
function displayJobs(jobList = jobs) {

    jobContainer.innerHTML = "";

    if (jobList.length === 0) {

        jobContainer.innerHTML =
            '<div class="empty-message">No job applications found.</div>';

        updateStats();

        return;
    }

    jobList.forEach(function (job) {

        const jobCard = document.createElement("div");

        jobCard.classList.add("job-card");

        jobCard.innerHTML = `
            <h3>${job.role}</h3>

            <p>
                <strong>Company:</strong>
                ${job.company}
            </p>

            <p>
                <strong>Applied Date:</strong>
                ${formatDate(job.date)}
            </p>

            <span class="status ${job.status.toLowerCase()}">
                ${job.status}
            </span>

            <div class="actions">

                <button
                    class="edit-btn"
                    onclick="editJob(${job.id})">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteJob(${job.id})">
                    Delete
                </button>

            </div>
        `;

        jobContainer.appendChild(jobCard);
    });

    updateStats();
}


// Delete job
function deleteJob(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) {
        return;
    }

    jobs = jobs.filter(function (job) {
        return job.id !== id;
    });

    saveJobs();

    if (editingJobId === id) {

        editingJobId = null;

        jobForm.reset();

        submitBtn.textContent = "Add Job";
    }

    applyFilters();
}


// Edit job
function editJob(id) {

    const job = jobs.find(function (item) {
        return item.id === id;
    });

    if (!job) {
        return;
    }

    companyInput.value = job.company;
    roleInput.value = job.role;
    dateInput.value = job.date;
    statusInput.value = job.status;

    editingJobId = id;

    submitBtn.textContent = "Update Job";

    document.querySelector(".job-form").scrollIntoView({
        behavior: "smooth"
    });
}


// Search
searchInput.addEventListener("input", function () {

    applyFilters();

});


// Filter
filterStatus.addEventListener("change", function () {

    applyFilters();

});


// Search + Filter
function applyFilters() {

    const searchText = searchInput.value
        .toLowerCase()
        .trim();

    const selectedStatus = filterStatus.value;

    const filteredJobs = jobs.filter(function (job) {

        const companyMatch = job.company
            .toLowerCase()
            .includes(searchText);

        const roleMatch = job.role
            .toLowerCase()
            .includes(searchText);

        const searchMatch = companyMatch || roleMatch;

        const statusMatch =
            selectedStatus === "All" ||
            job.status === selectedStatus;

        return searchMatch && statusMatch;
    });

    displayJobs(filteredJobs);
}


// Update dashboard statistics
function updateStats() {

    totalJobs.textContent = jobs.length;

    appliedJobs.textContent = jobs.filter(function (job) {
        return job.status === "Applied";
    }).length;

    interviewJobs.textContent = jobs.filter(function (job) {
        return job.status === "Interview";
    }).length;

    selectedJobs.textContent = jobs.filter(function (job) {
        return job.status === "Selected";
    }).length;
}


// Format date
function formatDate(date) {

    if (!date) {
        return "";
    }

    const options = {
        day: "numeric",
        month: "short",
        year: "numeric"
    };

    return new Date(date).toLocaleDateString(
        "en-IN",
        options
    );
}