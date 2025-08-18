import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BatchAllotmentForm.css';

const BatchAllotmentForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectOptions, setProjectOptions] = useState<any[]>([]);
  const [timeSlotOptions, setTimeSlotOptions] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    uid: '',
    receiptNo: '',
    name: '',
    fatherName: '',
    college: '',
    mobile: '',
    address: '',
    course: '',
    year: '',
    branch: '',
    duration: '',
    trade: '',
    slot: '',
    project: '',           // Stores "ProjectName (ProjectCode)"
    projectName: '',       // Separate for backend
    projectCode: '',       // Separate for backend
    photo: null as File | null,
  });

  // Pre-fill form if navigated with student data
  useEffect(() => {
    if (location.state?.student) {
      const student = location.state.student;
      setFormData((prev) => ({
        ...prev,
        uid: student.uniqueId,
        name: student.name,
        fatherName: student.fatherName,
        college: student.college,
        mobile: student.phone,
        address: student.address,
        course: student.course,
        year: '',
        branch: student.branch,
        duration: student.duration,
        trade: '',
        slot: student.trainingSlot,
        project:
          student.projectName && student.projectCode
            ? `${student.projectName} (${student.projectCode})`
            : '',
      }));
    }
  }, [location.state]);

  // Fetch projects dynamically
  useEffect(() => {
    if (formData.duration && formData.branch) {
      fetchFilteredProjects(formData.duration, formData.branch);
    } else {
      setProjectOptions([]);
    }
  }, [formData.duration, formData.branch]);

  // Update slots + projectCode  // Handle project selection
  useEffect(() => {
    if (formData.project && projectOptions.length > 0) {
      const selected = projectOptions.find(
        (p) => p.display === formData.project
      );
      if (selected) {
        setFormData((prev) => ({
          ...prev,
          projectName: selected.name,
          projectCode: selected.code,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        projectName: '',
        projectCode: '',
      }));
    }
  }, [formData.project, projectOptions]);

  const fetchFilteredProjects = async (duration: string, branch: string) => {
    try {
      setIsLoadingProjects(true);
      const url = `http://localhost:8080/api/projects?branch=${encodeURIComponent(
        branch
      )}&duration=${encodeURIComponent(duration)}`;
      console.log('Fetching projects from:', url);
      const res = await fetch(url);
      console.log('Response status:', res.status);
      const response = await res.json();
      console.log('API Response:', response);

      if (res.ok && response.success && Array.isArray(response.projects)) {
        // Set project options
        const projects = response.projects.map(project => ({
          ...project,
          display: `${project.name} (${project.code})`
        }));
        console.log('Processed projects:', projects);
        setProjectOptions(projects);
        
        // Extract and set unique time slots
        const allSlots = new Set<string>();
        response.projects.forEach(project => {
          if (project.slot1) allSlots.add(project.slot1);
          if (project.slot2) allSlots.add(project.slot2);
          if (project.slot3) allSlots.add(project.slot3);
          if (project.slot4) allSlots.add(project.slot4);
        });
        console.log('Available time slots:', Array.from(allSlots));
        setTimeSlotOptions(Array.from(allSlots));
      } else {
        setProjectOptions([]);
        setTimeSlotOptions([]);
      }
    } catch (error) {
      console.error('Error fetching filtered projects:', error);
      setProjectOptions([]);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData((prev) => ({ ...prev, photo: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    const payload = {
      ...formData,
      photo: undefined, // photo handling separate
    };

    try {
      const res = await fetch('http://localhost:8080/api/batch-allotment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert('Form submitted successfully!');
        // Redirect to StudentDashboard with the form data
        navigate('/student-dashboard', { state: { student: formData } });
      } else {
        alert(data.message || 'Submission failed');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-wrapper">
        <div className="form-header">Project Allocation Form</div>
        <form className="form" onSubmit={handleSubmit}>
          {/* Standard input fields */}
          {[
            { label: 'UID', name: 'UID' },
            { label: 'Receipt Number', name: 'receiptNo' },
            { label: 'Full Name', name: 'name' },
            { label: 'Fathers Name', name: 'fatherName' },
            { label: 'College Name', name: 'college' },
            { label: 'Mobile Number', name: 'mobile' },
            { label: 'Address', name: 'address', type: 'textarea' },
            { label: 'Course', name: 'course' },
          ].map(({ label, name, type }) => (
            <div className="form-group" key={name}>
              <label>{label}</label>
              {type === 'textarea' ? (
                <textarea
                  name={name}
                  value={(formData[name as keyof typeof formData] ?? '') as string}
                  onChange={handleChange}
                  required
                />
              ) : (
                <input
                  type="text"
                  name={name}
                  value={(formData[name as keyof typeof formData] ?? '') as string}
                  onChange={handleChange}
                  required
                />
              )}
            </div>
          ))}

          {/* Year Dropdown */}
          <div className="form-group">
            <label>Year</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
            >
              <option value="">Select Year</option>
              <option value="1st">1st</option>
              <option value="2nd">2nd</option>
              <option value="3rd">3rd</option>
              <option value="4th">4th</option>
            </select>
          </div>

          {/* Branch Dropdown */}
          <div className="form-group">
            <label>Branch</label>
            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
            >
              <option value="">Select Branch</option>
              <option value="CSE">CSE</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Electrical">Electrical</option>
              <option value="Electronics">Electronics</option>
              <option value="Civil">Civil</option>
            </select>
          </div>

          {/* Duration Dropdown */}
          <div className="form-group">
            <label>Duration</label>
            <select
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
            >
              <option value="">Select Duration</option>
              <option value="4weeks">4weeks</option>
              <option value="6weeks">6weeks</option>
            </select>
          </div>

          {/* Trade */}
          <div className="form-group">
            <label>Trade</label>
            <input
              type="text"
              name="trade"
              value={formData.trade}
              onChange={handleChange}
              required
            />
          </div>

          {/* Project Dropdown */}
          <div className="form-group">
            <label>Please Select the Project</label>
            <select
              name="project"
              value={formData.project}
              onChange={handleChange}
              required
              disabled={projectOptions.length === 0 || isLoadingProjects}
            >
              <option value="">
                {isLoadingProjects
                  ? 'Loading Projects...'
                  : projectOptions.length
                  ? 'Select Project'
                  : 'No Projects Available'}
              </option>
              {projectOptions.map((proj, i) => (
                <option
                  key={i}
                  value={proj.display || `${proj.name} (${proj.code})`}
                >
                  {proj.display || `${proj.name} (${proj.code})`}
                </option>
              ))}
            </select>
            {isLoadingProjects && <p>Loading projects...</p>}
          </div>

          {/* Time Slot Dropdown */}
          <div className="form-group">
            <label>Please Select the Date of Your Training Slot</label>
            <select
              name="slot"
              value={formData.slot}
              onChange={handleChange}
              required
            >
              <option value="">Select Slot</option>
              {timeSlotOptions.map((slot, i) => (
                <option key={i} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          {/* Photo Upload */}
          <div className="form-group">
            <label>Upload Your Passport Size Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>

          {/* Submit */}
          <div className="button-wrapper">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BatchAllotmentForm;
