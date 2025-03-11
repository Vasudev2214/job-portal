"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Job {
  id: number;
  title: string;
  description: string;
  company: string;
  location: string;
  salary: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}
interface Application {
  id : number;
  userId: number;
  jobId: number;
  job: Job;
  

}
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  resume?: string;
  applications: Application[];
}

const Dashboard = () => {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<{ id: number; userId :number; jobId:number;job:Job }[]>([]);
  const [profile, setProfile] = useState<{ name: string; email: string; resume?: string } | null>(null);
  const [showApplications, setShowApplications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  
  
    // const [showPasswordForm, setShowPasswordForm] = useState(false);
    // const [passwordData, setPasswordData] = useState({
    //   currentPassword: "",
    //   newPassword: "",
    //   confirmPassword: "",
    // });
    // const handlePasswordChange = async (e: React.FormEvent) => {
    //   e.preventDefault();
    //   setMessage("");
    
    //   if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
    //     alert("Please fill in all fields!");
    //     return;
    //   }
    
    //   if (passwordData.newPassword !== passwordData.confirmPassword) {
    //     alert("New password and Confirm password do not match!");
    //     return;
    //   }
    
    //   setLoading(true);
    //   try {
    //     const response = await fetch("/api/change-password", {
    //       method: "PUT",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${localStorage.getItem("token")}`,
    //       },
    //       body: JSON.stringify({
    //         currentPassword: passwordData.currentPassword,
    //         newPassword: passwordData.newPassword,
    //       }),
    //     });
    
    //     const result = await response.json();
    //     if (!response.ok) throw new Error(result.message);
    
    //     alert("Password updated successfully!");
    //     setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    //     setShowPasswordForm(false); // Hide form after success
    //   } catch (error: any) {
    //     alert(error.message || "Something went wrong!");
    //   }
    //   setLoading(false);
    // };
    













  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/jobs");
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }
        const response = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        router.push("/login");
      }
    };

    fetchJobs();
    fetchUserProfile();
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResumeFile(e.target.files[0]);
    }
  };

  const uploadResume = async () => {
    if (!resumeFile) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:5000/api/users/upload-resume", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Resume uploaded successfully!");
      setUser((prev) => prev ? { ...prev, resume: response.data.resumeUrl } : null);
    } catch (error) {
      console.error("Error uploading resume:", error);
      alert("Failed to upload resume");
    } finally {
      setUploading(false);
    }
  };


  const applyForJob = async (jobId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first");
        router.push("/login");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/jobs/apply",
        { jobId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Applied successfully!");
    } catch (error) {
      console.error("Error applying for job:", error);
      alert("Already applied for this job");
    }
  };
  const handleApply = async (jobId: number) => {
    try {
      const token = localStorage.getItem("token"); // Get the auth token
      if (!token) {
        alert("Please log in first");
        return;
      }
  
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/apply-job`,
        { jobId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Error applying for job:", error);
      alert("Failed to apply. Please try again.");
    }
  };
  
  // Fetch My Applications
  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first");
        router.push("/login");
        return;
      }
      const response = await axios.get("http://localhost:5000/api/jobs/my-applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(response.data.applications);
      setShowApplications(true);
      setShowProfile(false); // Hide profile when applications are shown
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };
// Fetch User Profile
const fetchProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      router.push("/login");
      return;
    }
    const response = await axios.get("http://localhost:5000/api/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProfile(response.data);
    setFormData({ name: response.data.name, email: response.data.email });

    setShowProfile(true);
    setShowApplications(false); // Hide applications when profile is shown
  } catch (error) {
    console.error("Error fetching profile:", error);
  }
};
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};
const updateProfile = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const token = localStorage.getItem("token");

  // Create an object with only the fields that have values
  const updatedFields: Record<string, string> = {};
  if (formData.name.trim() !== "") {
    updatedFields.name = formData.name;
  }
  if (formData.email.trim() !== "") {
    updatedFields.email = formData.email;
  }

  // If no valid fields are provided, prevent the update
  if (Object.keys(updatedFields).length === 0) {
    alert("Please provide at least one field to update.");
    return;
  }

  try {
    const response = await axios.put("http://localhost:5000/api/auth/update-profile", updatedFields, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Profile updated successfully!");
    window.location.reload(); // Refresh page to reflect changes
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Failed to update profile");
  }
};


const deleteResume = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      router.push("/login");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete your resume?");
    if (!confirmDelete) return;

    await axios.delete("http://localhost:5000/api/users/delete-resume", {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Resume deleted successfully!");
    window.location.reload(); // Refresh the page after deletion
    fetchProfile(); // Refresh profile data
  } catch (error) {
    console.error("Error deleting resume:", error);
    alert("Already  deleted resume");
  }
};



  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center bg-white p-4 shadow-md">
        <h1 className="text-gray-900 font-bold">User Dashboard</h1>
        
        <div className="flex items-center">
          <button onClick={fetchApplications}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            My Applications
          </button>
          
        </div>
        
        {showApplications && (  
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((application) => (
              <div key={application.id} className="bg-white p-4 shadow-md rounded-md">
                <h2 className="text-gray-800 font-semibold">{application.job.title}</h2>
                <p className="text-gray-800 mt-2">{application.job.company}</p>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex items-center">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            My Profile
            
            
          </button>
          {showProfile && user && (
        <div className="mt-6 bg-white p-4 shadow-md rounded-md">
          <h2 className="text-gray-800 font-semibold">Name: {user.name}</h2>
          <p className="text-gray-800">Email: {user.email}</p>
          
          
  <div className="mt-2">
    <p className="text-gray-700"><strong>Resume:</strong> 
    <a href={user.resume} target="_blank" className="text-blue-600 underline">
      View Resume</a>
    </p>
    <button
      onClick={deleteResume}
      className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Delete Resume
    </button>
  </div>

          
          <input type="file" onChange={handleFileChange} className="text-gray-600 mt-4 border p-2" />
          <button onClick={uploadResume} disabled={uploading} 
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            {uploading ? "Uploading..." : "Upload Resume"}
          </button>
          
         
        </div>

      )}
      
      
          </div>
          {editMode ? (
          <form onSubmit={updateProfile} className="mt-4 space-y-4">
            <div className="space-y-2 text-gray-600" >
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-700 rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="text-gray-500 w-full p-2 border border-gray-900 rounded"
              />
            </div>
            
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="ml-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>


            {/* <div className="mt-4">
      <button
        onClick={() => setShowPasswordForm(!showPasswordForm)}
        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
      >
        Change Password
      </button>

      {showPasswordForm && (
        <form onSubmit={handlePasswordChange} className="mt-4 bg-white p-4 shadow-md rounded">
          {message && <p className="text-red-500">{message}</p>}

          <div className="mb-3">
            <label className="block text-gray-700">Current Password</label>
            <input
              type="password"
              className="w-full text-black p-2 border rounded"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="block text-gray-700">New Password</label>
            <input
              type="password"
              className="w-full text-black p-2 border rounded"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="block text-gray-700">Confirm New Password</label>
            <input
              type="password"
              className="w-full text-black p-2 border rounded"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      )}
    </div> */}

          </form>
        ) : (
          <>
            
            <button
              onClick={() => setEditMode(true)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Edit Profile
            </button>
          </>
        )}




        
        
        <div className="flex items-center">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
        
        
      </div>
       
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white p-4 shadow-md rounded-md">
            <h2 className="text-gray-500 font-semibold">{job.title}</h2>
            <p className="text-gray-500 mt-2">{job.description}</p>
            <button
              onClick={() => handleApply(job.id)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Apply
            </button>
          </div>

          











        ))}
      </div>
      
    

  
  
     
    </div>
  );
  
};

export default Dashboard;
