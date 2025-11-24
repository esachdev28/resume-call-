"use client"

// Data Store
let resumeData = {
  personal: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    title: "",
    summary: "",
  },
  education: [],
  experience: [],
  skills: [],
  projects: [],
}

// Theme Management
const themeToggle = document.getElementById("themeToggle")
const htmlElement = document.documentElement

// Initialize theme from localStorage
const savedTheme = localStorage.getItem("resumeMateTheme") || "light"
htmlElement.setAttribute("data-theme", savedTheme)

themeToggle.addEventListener("click", () => {
  const currentTheme = htmlElement.getAttribute("data-theme")
  const newTheme = currentTheme === "light" ? "dark" : "light"
  htmlElement.setAttribute("data-theme", newTheme)
  localStorage.setItem("resumeMateTheme", newTheme)
})

// Load data from localStorage
function loadData() {
  const saved = localStorage.getItem("resumeMateData")
  if (saved) {
    resumeData = JSON.parse(saved)
    renderEducation()
    renderExperience()
    renderSkills()
    renderProjects()
    populateFormFields()
  }
}

// Save data to localStorage
function saveData() {
  localStorage.setItem("resumeMateData", JSON.stringify(resumeData))
}

// Populate form fields from data
function populateFormFields() {
  document.getElementById("fullName").value = resumeData.personal.fullName
  document.getElementById("email").value = resumeData.personal.email
  document.getElementById("phone").value = resumeData.personal.phone
  document.getElementById("location").value = resumeData.personal.location
  document.getElementById("title").value = resumeData.personal.title
  document.getElementById("summary").value = resumeData.personal.summary
}

// Toggle section
function toggleSection(header) {
  const section = header.closest(".form-section")
  section.classList.toggle("active")
}

// Update preview in real-time
function updatePreview() {
  // Update personal info
  resumeData.personal.fullName = document.getElementById("fullName").value || "Your Name"
  resumeData.personal.email = document.getElementById("email").value
  resumeData.personal.phone = document.getElementById("phone").value
  resumeData.personal.location = document.getElementById("location").value
  resumeData.personal.title = document.getElementById("title").value || "Professional Title"
  resumeData.personal.summary = document.getElementById("summary").value

  // Update preview
  document.getElementById("previewName").textContent = resumeData.personal.fullName
  document.getElementById("previewTitle").textContent = resumeData.personal.title

  const contactInfo = []
  if (resumeData.personal.email) contactInfo.push(resumeData.personal.email)
  if (resumeData.personal.phone) contactInfo.push(resumeData.personal.phone)
  if (resumeData.personal.location) contactInfo.push(resumeData.personal.location)

  document.getElementById("previewContact").innerHTML = contactInfo.map((info) => `<span>${info}</span>`).join("")

  if (resumeData.personal.summary) {
    document.getElementById("previewSummary").style.display = "block"
    document.querySelector("#previewSummary .resume-summary").textContent = resumeData.personal.summary
  } else {
    document.getElementById("previewSummary").style.display = "none"
  }

  saveData()
}

// Education Functions
function addEducation() {
  const education = {
    id: Date.now(),
    school: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
  }
  resumeData.education.push(education)
  renderEducation()
  saveData()
}

function removeEducation(id) {
  resumeData.education = resumeData.education.filter((e) => e.id !== id)
  renderEducation()
  updatePreview()
  saveData()
}

function updateEducation(id, field, value) {
  const education = resumeData.education.find((e) => e.id === id)
  if (education) {
    education[field] = value
    updatePreview()
    saveData()
  }
}

function renderEducation() {
  const container = document.getElementById("educationList")
  container.innerHTML = resumeData.education
    .map(
      (edu) => `
        <div class="entry-card">
            <div class="entry-card-header">
                <div>
                    <div class="entry-card-title">${edu.school || "School Name"}</div>
                    <div class="entry-card-subtitle">${edu.degree || "Degree"}</div>
                </div>
                <button class="remove-btn" onclick="removeEducation(${edu.id})">×</button>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>School/University</label>
                    <input type="text" class="form-input" value="${edu.school}" onInput="updateEducation(${edu.id}, 'school', this.value)">
                </div>
                <div class="form-group">
                    <label>Degree</label>
                    <input type="text" class="form-input" value="${edu.degree}" onInput="updateEducation(${edu.id}, 'degree', this.value)">
                </div>
            </div>
            <div class="form-group">
                <label>Field of Study</label>
                <input type="text" class="form-input" value="${edu.field}" onInput="updateEducation(${edu.id}, 'field', this.value)">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Start Date</label>
                    <input type="text" class="form-input" placeholder="e.g., 2019" value="${edu.startDate}" onInput="updateEducation(${edu.id}, 'startDate', this.value)">
                </div>
                <div class="form-group">
                    <label>End Date</label>
                    <input type="text" class="form-input" placeholder="e.g., 2023" value="${edu.endDate}" onInput="updateEducation(${edu.id}, 'endDate', this.value)">
                </div>
            </div>
        </div>
    `,
    )
    .join("")

  updateEducationPreview()
}

function updateEducationPreview() {
  const container = document.getElementById("previewEducation")
  if (resumeData.education.length === 0) {
    document.getElementById("previewEducationSection").style.display = "none"
    return
  }

  document.getElementById("previewEducationSection").style.display = "block"
  container.innerHTML = resumeData.education
    .map(
      (edu) => `
        <div class="resume-entry">
            <div class="resume-entry-header">
                <div class="resume-entry-title">${edu.school}</div>
                <div class="resume-entry-date">${edu.startDate}${edu.endDate ? " - " + edu.endDate : ""}</div>
            </div>
            <div class="resume-entry-subtitle">${edu.degree}${edu.field ? " in " + edu.field : ""}</div>
        </div>
    `,
    )
    .join("")
}

// Experience Functions
function addExperience() {
  const experience = {
    id: Date.now(),
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    description: "",
  }
  resumeData.experience.push(experience)
  renderExperience()
  saveData()
}

function removeExperience(id) {
  resumeData.experience = resumeData.experience.filter((e) => e.id !== id)
  renderExperience()
  updatePreview()
  saveData()
}

function updateExperience(id, field, value) {
  const experience = resumeData.experience.find((e) => e.id === id)
  if (experience) {
    experience[field] = value
    updatePreview()
    saveData()
  }
}

function renderExperience() {
  const container = document.getElementById("experienceList")
  container.innerHTML = resumeData.experience
    .map(
      (exp) => `
        <div class="entry-card">
            <div class="entry-card-header">
                <div>
                    <div class="entry-card-title">${exp.position || "Position"}</div>
                    <div class="entry-card-subtitle">${exp.company || "Company"}</div>
                </div>
                <button class="remove-btn" onclick="removeExperience(${exp.id})">×</button>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Company</label>
                    <input type="text" class="form-input" value="${exp.company}" onInput="updateExperience(${exp.id}, 'company', this.value)">
                </div>
                <div class="form-group">
                    <label>Position</label>
                    <input type="text" class="form-input" value="${exp.position}" onInput="updateExperience(${exp.id}, 'position', this.value)">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Start Date</label>
                    <input type="text" class="form-input" placeholder="e.g., Jan 2022" value="${exp.startDate}" onInput="updateExperience(${exp.id}, 'startDate', this.value)">
                </div>
                <div class="form-group">
                    <label>End Date</label>
                    <input type="text" class="form-input" placeholder="e.g., Present" value="${exp.endDate}" onInput="updateExperience(${exp.id}, 'endDate', this.value)">
                </div>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea class="form-input" rows="3" onInput="updateExperience(${exp.id}, 'description', this.value)">${exp.description}</textarea>
            </div>
        </div>
    `,
    )
    .join("")

  updateExperiencePreview()
}

function updateExperiencePreview() {
  const container = document.getElementById("previewExperience")
  if (resumeData.experience.length === 0) {
    document.getElementById("previewExperienceSection").style.display = "none"
    return
  }

  document.getElementById("previewExperienceSection").style.display = "block"
  container.innerHTML = resumeData.experience
    .map(
      (exp) => `
        <div class="resume-entry">
            <div class="resume-entry-header">
                <div class="resume-entry-title">${exp.position}</div>
                <div class="resume-entry-date">${exp.startDate}${exp.endDate ? " - " + exp.endDate : ""}</div>
            </div>
            <div class="resume-entry-subtitle">${exp.company}</div>
            ${exp.description ? `<div class="resume-entry-description">${exp.description}</div>` : ""}
        </div>
    `,
    )
    .join("")
}

// Skills Functions
function addSkill() {
  const input = document.getElementById("skillInput")
  const skill = input.value.trim()
  if (skill) {
    resumeData.skills.push(skill)
    input.value = ""
    renderSkills()
    saveData()
  }
}

function handleSkillKeyPress(event) {
  if (event.key === "Enter") {
    addSkill()
  }
}

function removeSkill(skill) {
  resumeData.skills = resumeData.skills.filter((s) => s !== skill)
  renderSkills()
  updatePreview()
  saveData()
}

function renderSkills() {
  const container = document.getElementById("skillsList")
  container.innerHTML = resumeData.skills
    .map(
      (skill) => `
        <div class="skill-badge">
            ${skill}
            <button onclick="removeSkill('${skill.replace(/'/g, "\\'")}')">×</button>
        </div>
    `,
    )
    .join("")

  updateSkillsPreview()
}

function updateSkillsPreview() {
  const container = document.getElementById("previewSkills")
  if (resumeData.skills.length === 0) {
    document.getElementById("previewSkillsSection").style.display = "none"
    return
  }

  document.getElementById("previewSkillsSection").style.display = "block"
  container.innerHTML = resumeData.skills
    .map(
      (skill) => `
        <div class="resume-skill">${skill}</div>
    `,
    )
    .join("")
}

// Projects Functions
function addProject() {
  const project = {
    id: Date.now(),
    title: "",
    description: "",
    url: "",
  }
  resumeData.projects.push(project)
  renderProjects()
  saveData()
}

function removeProject(id) {
  resumeData.projects = resumeData.projects.filter((p) => p.id !== id)
  renderProjects()
  updatePreview()
  saveData()
}

function updateProject(id, field, value) {
  const project = resumeData.projects.find((p) => p.id === id)
  if (project) {
    project[field] = value
    updatePreview()
    saveData()
  }
}

function renderProjects() {
  const container = document.getElementById("projectsList")
  container.innerHTML = resumeData.projects
    .map(
      (proj) => `
        <div class="entry-card">
            <div class="entry-card-header">
                <div>
                    <div class="entry-card-title">${proj.title || "Project Title"}</div>
                </div>
                <button class="remove-btn" onclick="removeProject(${proj.id})">×</button>
            </div>
            <div class="form-group">
                <label>Project Title</label>
                <input type="text" class="form-input" value="${proj.title}" onInput="updateProject(${proj.id}, 'title', this.value)">
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea class="form-input" rows="3" onInput="updateProject(${proj.id}, 'description', this.value)">${proj.description}</textarea>
            </div>
            <div class="form-group">
                <label>URL</label>
                <input type="url" class="form-input" placeholder="https://example.com" value="${proj.url}" onInput="updateProject(${proj.id}, 'url', this.value)">
            </div>
        </div>
    `,
    )
    .join("")

  updateProjectsPreview()
}

function updateProjectsPreview() {
  const container = document.getElementById("previewProjects")
  if (resumeData.projects.length === 0) {
    document.getElementById("previewProjectsSection").style.display = "none"
    return
  }

  document.getElementById("previewProjectsSection").style.display = "block"
  container.innerHTML = resumeData.projects
    .map(
      (proj) => `
        <div class="resume-entry">
            <div class="resume-entry-title">${proj.title}</div>
            ${proj.description ? `<div class="resume-entry-description">${proj.description}</div>` : ""}
            ${proj.url ? `<div class="resume-entry-subtitle"><a href="${proj.url}" target="_blank">${proj.url}</a></div>` : ""}
        </div>
    `,
    )
    .join("")
}

// PDF Download
document.getElementById("downloadBtn").addEventListener("click", () => {
  window.print()
})

// Reset Resume
function resetResume() {
  if (confirm("Are you sure you want to reset all data? This cannot be undone.")) {
    resumeData = {
      personal: { fullName: "", email: "", phone: "", location: "", title: "", summary: "" },
      education: [],
      experience: [],
      skills: [],
      projects: [],
    }
    localStorage.removeItem("resumeMateData")
    location.reload()
  }
}

// Initialize
loadData()
updatePreview()

// Auto-save on input
document.addEventListener("input", debounce(saveData, 500))

function debounce(func, delay) {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}
