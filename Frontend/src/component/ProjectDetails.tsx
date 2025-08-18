import React, { useState } from "react";
import "./ProjectDetails.css";

interface Project {
  projectName: string;
  projectCode: string;
  duration: string;
  branch: string;
  batch: string;
  timeSlots: string[];
}

const ProjectDetails: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([
    { projectName: "", projectCode: "", duration: "", branch: "", batch: "", timeSlots: [""] },
  ]);

  const handleChange = (
    index: number,
    field: keyof Omit<Project, "timeSlots">,
    value: string
  ) => {
    const updatedProjects = [...projects];
    updatedProjects[index][field] = value;
    setProjects(updatedProjects);
  };

  const handleSlotChange = (
    projectIndex: number,
    slotIndex: number,
    value: string
  ) => {
    const updatedProjects = [...projects];
    updatedProjects[projectIndex].timeSlots[slotIndex] = value;
    setProjects(updatedProjects);
  };

  const addTimeSlot = (projectIndex: number) => {
    const updatedProjects = [...projects];
    updatedProjects[projectIndex].timeSlots.push("");
    setProjects(updatedProjects);
  };

  const addProject = () => {
    setProjects([
      ...projects,
      { projectName: "", projectCode: "", duration: "", branch: "", batch: "", timeSlots: [""] },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projects),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert("Projects submitted successfully!");
        setProjects([
          { projectName: "", projectCode: "", duration: "", branch: "", batch: "", timeSlots: [""] },
        ]);
      } else {
        alert(data.message || "Submission failed!");
      }
    } catch (error) {
      console.error("Error submitting:", error);
      alert("Submission failed!");
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Admin Panel Form</h2>
      <form onSubmit={handleSubmit} className="form-wrapper">
        {projects.map((project, index) => (
          <div key={index} className="project-block">
            <input
              type="text"
              placeholder="Project Name"
              value={project.projectName}
              onChange={(e) => handleChange(index, "projectName", e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Project Code"
              value={project.projectCode}
              onChange={(e) => handleChange(index, "projectCode", e.target.value)}
              required
            />

            {/* Duration Dropdown */}
            <select
              value={project.duration}
              onChange={(e) => handleChange(index, "duration", e.target.value)}
              required
            >
              <option value="">Select Duration</option>
              <option value="4 Weeks">4 Weeks</option>
              <option value="6 Weeks">6 Weeks</option>
            </select>

            <input
              type="text"
              placeholder="Branch (e.g., CSE)"
              value={project.branch}
              onChange={(e) => handleChange(index, "branch", e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Batch Code (e.g., 10 Aug – 7 Sep)"
              value={project.batch}
              onChange={(e) => handleChange(index, "batch", e.target.value)}
              required
            />

            {project.timeSlots.map((slot, slotIndex) => (
              <input
                key={slotIndex}
                type="text"
                placeholder={`Time Slot ${slotIndex + 1} (e.g., 10:00 – 12:00)`}
                value={slot}
                onChange={(e) => handleSlotChange(index, slotIndex, e.target.value)}
                required
              />
            ))}

            <button
              type="button"
              className="add-button"
              onClick={() => addTimeSlot(index)}
            >
              + Add Another Time Slot
            </button>
          </div>
        ))}

        <button type="button" onClick={addProject} className="add-button">
          + Add Another Project
        </button>

        <button type="submit" className="submit-button">
          Submit All Projects
        </button>
      </form>
    </div>
  );
};

export default ProjectDetails;
