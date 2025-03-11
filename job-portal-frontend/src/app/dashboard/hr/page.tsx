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

const  HRDashboard = () => {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<{ id: number; userId :number; jobId:number;job:Job }[]>([]);
  const [profile, setProfile] = useState<{ name: string; email: string; resume?: string } | null>(null);
  const [showApplications, setShowApplications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
   const [company, setCompany] = useState("");
   const [location, setLocation] = useState("");
   const [salary, setSalary] = useState("");
   const [loading, setLoading] = useState(false);
   const [message, setMessage] = useState("");
   
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/jobs");
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

  

    fetchJobs();
    
  }, [router]);


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
    setShowProfile(true);
    setShowApplications(false); // Hide applications when profile is shown
  } catch (error) {
    console.error("Error fetching profile:", error);
  }
};

// create job function
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  try {
    const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first");
        router.push("/login");
        return;
      }
    const response = await axios.post( 
      "http://localhost:5000/api/jobs",
      
      { title, description, company, location, salary },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setMessage("Job posted successfully!");
    setTitle("");
    setDescription("");
    setCompany("");
    setLocation("");
    setSalary("");
    setShowForm(false);
  } catch (error) {
    setMessage("Failed to create job post.");
  } finally {
    setLoading(false);
  }
};




  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center bg-white p-4 shadow-md">
        <h1 className="text-gray-900 font-bold">HR Dashboard</h1>
      
        <div className="flex items-center">
        <button onClick={() => setShowForm(true)} className="bg-green-500 px-4 py-2 rounded-lg">
          Create Job Post
        </button>
      </div>

      {/* Job Post Form */}
      {showForm && (
        <div className="mt-6 p-4 bg-white shadow-lg rounded-lg">
          <h2 className="text-gray-500 font-semibold mb-2">Create a Job Post</h2>
          {message && <p className="text-green-600">{message}</p>}
          <form onSubmit={handleSubmit} className="space-y-4 text-gray-500">
            <input type="text" placeholder="Job Title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-2 border rounded" />
            <textarea placeholder="Job Description" value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full p-2 border rounded"></textarea>
            <input type="text" placeholder="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} required className="w-full p-2 border rounded" />
            <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required className="w-full p-2 border rounded" />
            <input type="number" placeholder="Salary (optional)" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full p-2 border rounded" />
            
            <div className="flex space-x-4">
              <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
                {loading ? "Posting..." : "Submit"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-red-500 text-white px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
        
        
        
       
        <div className="flex items-center">
          <button
            onClick={fetchProfile}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            My Profile
          </button>
        </div>
          
        {showProfile && (
          <div className="mt-6 bg-white p-4 shadow-md rounded-md">
            <h2 className="text-gray-500 font-semibold">name :{profile?.name}</h2>
            <p className="text-gray-500 mt-2">email :{profile?.email}</p>
          
          </div>
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
            <p className="text-gray-500 mt-2">{job.company}</p>
            <p className="text-gray-500 mt-2">{job.location}</p>
            <p className="text-gray-500 mt-2">Salary: {job.salary}</p>
            <p className="text-gray-500 mt-2">Posted on: {job.createdAt}</p >
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default HRDashboard;
