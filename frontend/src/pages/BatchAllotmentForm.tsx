
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import './BatchAllotmentForm.css';

// const BatchAllotmentForm: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [isLoadingProjects, setIsLoadingProjects] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [projectOptions, setProjectOptions] = useState<any[]>([]);
//   const [timeSlotOptions, setTimeSlotOptions] = useState<string[]>([]);

//   const [formData, setFormData] = useState({
//     uid: '',
//     receiptNo: '',
//     name: '',
//     fatherName: '',
//     college: '',
//     mobile: '',
//     address: '',
//     course: '',
//     year: '',
//     branch: '',
//     duration: '',
//     trade: '',
//     slot: '',
//     project: '',           // Will store projectName (projectCode)
//     projectName: '',       // Separate field
//     projectCode: '',       // Separate field
//     photo: null as File | null,
//   });

//  useEffect(() => {
//   if (location.state?.student) {
//     const student = location.state.student;
//     setFormData((prev) => ({
//       ...prev,
//       uid: student.uniqueId,
//       name: student.name,
//       fatherName: student.fatherName,
//       college: student.college,
//       mobile: student.phone,
//       address: student.address,
//       course: student.course,
//       year: '',
//       branch: student.branch,
//       duration: student.duration,
//       trade: '',
//       slot: student.trainingSlot,
//       project:
//         student.projectName && student.projectCode
//           ? `${student.projectName} (${student.projectCode})`
//           : '',
//     }));
//   }
// }, [location.state]);


//   useEffect(() => {
//     if (formData.duration && formData.branch) {
//       fetchFilteredProjects(formData.duration, formData.branch);
//     } else {
//       setProjectOptions([]);
//     }
//   }, [formData.duration, formData.branch]);

//   useEffect(() => {
//     const selected = projectOptions.find(
//       (proj) => `${proj.projectName} (${proj.projectCode})` === formData.project
//     );
//     if (selected) {
//       setFormData((prev) => ({
//         ...prev,
//         projectName: selected.projectName,
//         projectCode: selected.projectCode,
//       }));
//       setTimeSlotOptions(selected.timeSlots || []);
//     } else {
//       setTimeSlotOptions([]);
//     }
//   }, [formData.project, projectOptions]);

//   const fetchFilteredProjects = async (duration: string, branch: string) => {
//     try {
//       setIsLoadingProjects(true);
//       const url = `https://script.google.com/macros/s/AKfycbwNAP1Tu6Epikkyj2YL_xM4N1b7z3EtwU-cQbgsmg_xImAC4WDX7ueBULbAlusyLeynbQ/exec?duration=${encodeURIComponent(duration)}&branch=${encodeURIComponent(branch)}`;
//       const res = await fetch(url);
//       const data = await res.json();

//       if (data.success && Array.isArray(data.projects)) {
//         setProjectOptions(data.projects);
//       } else {
//         setProjectOptions([]);
//       }
//     } catch (error) {
//       console.error('Error fetching filtered projects:', error);
//       setProjectOptions([]);
//     } finally {
//       setIsLoadingProjects(false);
//     }
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.[0]) {
//       setFormData((prev) => ({ ...prev, photo: e.target.files![0] }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     setIsSubmitting(true);
//     const payload = {
//       ...formData,
//       photo: undefined,
//     };

//     try {
//       const res = await fetch('https://script.google.com/macros/s/AKfycbwNAP1Tu6Epikkyj2YL_xM4N1b7z3EtwU-cQbgsmg_xImAC4WDX7ueBULbAlusyLeynbQ/exec', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();
//       console.log("Filtered projects:", data);

//       if (res.ok && data.success) {
//         alert('Form submitted successfully!');
//         navigate('/student-dashboard', {
//           state: {
//             student: {
//               uniqueId: formData.uid,
//               name: formData.name,
//               phone: formData.mobile,
//               fatherName: formData.fatherName,
//               college: formData.college,
//               course: formData.course,
//               branch: formData.branch,
//               address: formData.address,
//               duration: formData.duration,
//               trainingSlot: formData.slot,
//               projectName: formData.project,
//             },
//           },
//         });
//       } else {
//         alert(data.message || 'Submission failed');
//       }
//     } catch (err) {
//       console.error(err);
//       alert('Server error');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//   <div className="form-page">
//     <div className="form-wrapper">
//       <div className="form-header">Project Allocation Form</div>
//       <form className="form" onSubmit={handleSubmit}>
//     {/* UID to Course fields remain unchanged */}
//   {[
//     { label: 'UID', name: 'uid' },
//     { label: 'Receipt Number', name: 'receiptNo' },
//     { label: 'Full Name', name: 'name' },
//     { label: 'Father’s Name', name: 'fatherName' },
//     { label: 'College Name', name: 'college' },
//     { label: 'Mobile Number', name: 'mobile' },
//     { label: 'Address', name: 'address', type: 'textarea' },
//     { label: 'Course', name: 'course' },
//   ].map(({ label, name, type }) => (
//     <div className="form-group" key={name}>
//       <label>{label}</label>
//       {type === 'textarea' ? (
//         <textarea
//           name={name}
//           value={(formData[name as keyof typeof formData] ?? '') as string}
//           onChange={handleChange}
//           required
//         />
//       ) : (
//         <input
//           type="text"
//           name={name}
//           value={(formData[name as keyof typeof formData] ?? '') as string}
//           onChange={handleChange}
//           required
//         />
//       )}
//     </div>
//   ))}

//   {/* Year Dropdown */}
//   <div className="form-group">
//     <label>Year</label>
//     <select
//       name="year"
//       value={formData.year}
//       onChange={handleChange}
//       required
//     >
//       <option value="">Select Year</option>
//       <option value="1st">1st</option>
//       <option value="2nd">2nd</option>
//       <option value="3rd">3rd</option>
//       <option value="4th">4th</option>
//     </select>
//   </div>

//   {/* Branch Dropdown */}
//   <div className="form-group">
//     <label>Branch</label>
//     <select
//       name="branch"
//       value={formData.branch}
//       onChange={handleChange}
//       required
//     >
//       <option value="">Select Branch</option>
//       <option value="CSE">CSE</option>
//       <option value="Mechanical">Mechanical</option>
//       <option value="Electrical">Electrical</option>
//       <option value="Electronics">Electronics</option>
//       <option value="Civil">Civil</option>
//     </select>
//   </div>

//   {/* Duration Dropdown */}
//   <div className="form-group">
//     <label>Duration</label>
//     <select
//       name="duration"
//       value={formData.duration}
//       onChange={handleChange}
//       required
//     >
//       <option value="">Select Duration</option>
//       <option value="4weeks">4weeks</option>
//       <option value="6weeks">6weeks</option>
//     </select>
//   </div>

//   {/* Trade (text input) */}
//   <div className="form-group">
//     <label>Trade</label>
//     <input
//       type="text"
//       name="trade"
//       value={formData.trade}
//       onChange={handleChange}
//       required
//     />
//   </div>

 

//   {/* Project Dropdown */}
//   <div className="form-group">
//     <label>Please Select the Project</label>
//     <select
//       name="project"
//       value={formData.project}
//       onChange={handleChange}
//       required
//       disabled={projectOptions.length === 0 || isLoadingProjects}
//     >
//       <option value="">
//         {isLoadingProjects
//           ? 'Loading Projects...'
//           : projectOptions.length
//           ? 'Select Project'
//           : 'No Projects Available'}
//       </option>
//       {projectOptions.map((proj, i) => (
//         <option
//           key={i}
//           value={`${proj.projectName} (${proj.projectCode})`}
//         >
//           {proj.projectName} ({proj.projectCode})
//         </option>
//       ))}
//     </select>
//   </div>

//   {/* Time Slot Dropdown */}
//   <div className="form-group">
//     <label>Please Select the Date of Your Training Slot</label>
//     <select
//       name="slot"
//       value={formData.slot}
//       onChange={handleChange}
//       required
//     >
//       <option value="">Select Slot</option>
//       {timeSlotOptions.map((slot, i) => (
//         <option key={i} value={slot}>
//           {slot}
//         </option>
//       ))}
//     </select>
//   </div>

//   {/* Photo Upload */}
//   <div className="form-group">
//     <label>Upload Your Passport Size Photo</label>
//     <input
//       type="file"
//       accept="image/*"
//       onChange={handleFileChange}
//       required
//     />
//   </div>

//   {/* Submit Button */}
//   <div className="button-wrapper">
//     <button type="submit" disabled={isSubmitting}>
//       {isSubmitting ? 'Submitting...' : 'Submit'}
//     </button>
//   </div>
// </form>
//     </div>
//   </div>
// );

// };

// export default BatchAllotmentForm;
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BatchAllotmentForm.css";

interface Project {
  projectName: string;
  projectCode: string;
  slots: string[];
}

interface FormData {
  uid: string;
  receiptNo: string;
  name: string;
  fatherName: string;
  college: string;
  mobile: string;
  address: string;
  course: string;
  year: string;
  branch: string;
  duration: string;
  trade: string;
  slot: string;
  project: string;
}

const BatchAllotmentForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    uid: "",
    receiptNo: "",
    name: "",
    fatherName: "",
    college: "",
    mobile: "",
    address: "",
    course: "",
    year: "",
    branch: "",
    duration: "",
    trade: "",
    slot: "",
    project: "",
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  // Fetch projects when branch or duration changes
  useEffect(() => {
    if (formData.duration && formData.branch) {
      setIsLoadingProjects(true);
      axios
        .get(`/api/projects?duration=${formData.duration}&branch=${formData.branch}`)
        .then((res) => {
          if (res.data.success) {
            setProjects(res.data.projects);
          } else {
            setProjects([]);
          }
        })
        .catch((err) => {
          console.error("Error fetching projects", err);
          setProjects([]);
        })
        .finally(() => {
          setIsLoadingProjects(false);
        });
    } else {
      setProjects([]);
    }
  }, [formData.duration, formData.branch]);

  // Update slots when project changes
  useEffect(() => {
    if (formData.project) {
      const selectedProject = projects.find(
        (p) => p.projectName === formData.project
      );
      if (selectedProject) {
        setSlots(
          selectedProject.slots.filter((slot) => slot && slot.trim() !== "")
        );
      } else {
        setSlots([]);
      }
    } else {
      setSlots([]);
    }
  }, [formData.project, projects]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post("/api/batch-allotment", formData);
      alert("✅ Batch allotment stored successfully!");
      setFormData({
        uid: "",
        receiptNo: "",
        name: "",
        fatherName: "",
        college: "",
        mobile: "",
        address: "",
        course: "",
        year: "",
        branch: "",
        duration: "",
        trade: "",
        slot: "",
        project: "",
      });
      setSlots([]);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to store batch allotment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-wrapper">
        <div className="form-header">Project Allocation Form</div>
        <form className="form" onSubmit={handleSubmit}>
          {/* UID to Course */}
          {[
            { label: "UID", name: "uid" },
            { label: "Receipt Number", name: "receiptNo" },
            { label: "Full Name", name: "name" },
            { label: "Father’s Name", name: "fatherName" },
            { label: "College Name", name: "college" },
            { label: "Mobile Number", name: "mobile" },
            { label: "Address", name: "address", type: "textarea" },
            { label: "Course", name: "course" },
          ].map(({ label, name, type }) => (
            <div className="form-group" key={name}>
              <label>{label}</label>
              {type === "textarea" ? (
                <textarea
                  name={name}
                  value={formData[name as keyof FormData]}
                  onChange={handleChange}
                  required
                />
              ) : (
                <input
                  type="text"
                  name={name}
                  value={formData[name as keyof FormData]}
                  onChange={handleChange}
                  required
                />
              )}
            </div>
          ))}

          {/* Year Dropdown */}
          <div className="form-group">
            <label>Year</label>
            <select name="year" value={formData.year} onChange={handleChange} required>
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
            <select name="branch" value={formData.branch} onChange={handleChange} required>
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
            <select name="duration" value={formData.duration} onChange={handleChange} required>
              <option value="">Select Duration</option>
              <option value="4weeks">4 weeks</option>
              <option value="6weeks">6 weeks</option>
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
              disabled={projects.length === 0 || isLoadingProjects}
            >
              <option value="">
                {isLoadingProjects
                  ? "Loading Projects..."
                  : projects.length
                  ? "Select Project"
                  : "No Projects Available"}
              </option>
              {projects.map((p, i) => (
                <option key={i} value={p.projectName}>
                  {p.projectName} ({p.projectCode})
                </option>
              ))}
            </select>
          </div>

          {/* Slot Dropdown */}
          <div className="form-group">
            <label>Please Select the Date of Your Training Slot</label>
            <select
              name="slot"
              value={formData.slot}
              onChange={handleChange}
              required
              disabled={slots.length === 0}
            >
              <option value="">Select Slot</option>
              {slots.map((slot, i) => (
                <option key={i} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="button-wrapper">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BatchAllotmentForm;
