import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
    const [user, setUser] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [adminApps, setAdminApps] = useState([]);
    const [view, setView] = useState('login');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('candidate');
    const [resume, setResume] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [editId, setEditId] = useState(null); // Track the job being edited
    const [formData, setFormData] = useState({ title: '', company: '', salary: '', location: '', desc: '' });

    useEffect(() => {
        if (user) {
            fetchJobs();
            if (user.role === 'admin') fetchAdminData();
        }
    }, [user]);

    const fetchJobs = async () => {
        const res = await axios.get('http://127.0.0.1:5000/api/jobs');
        setJobs(res.data);
    };

    const fetchAdminData = async () => {
        const res = await axios.get('http://127.0.0.1:5000/api/admin/apps');
        setAdminApps(res.data);
    };

    const handleLinkedInImport = () => {
        alert("🔗 LinkedIn Profile Imported!");
        setEmail("annasaji2020@gmail.com"); 
    };

    // Logic for both Create and Full Update
    const handleSubmit = async () => {
        if (!formData.title || !formData.company) return alert("Please fill Title and Company");
        
        if (editId) {
            await axios.put(`http://127.0.0.1:5000/api/jobs/${editId}`, formData);
            alert("✅ Job Updated Successfully!");
        } else {
            await axios.post('http://127.0.0.1:5000/api/jobs', formData);
            alert("🚀 New Job Published!");
        }
        
        setFormData({ title: '', company: '', salary: '', location: '', desc: '' });
        setEditId(null);
        fetchJobs();
    };

    const startEdit = (job) => {
        setEditId(job._id);
        setFormData({ title: job.title, company: job.company, salary: job.salary, location: job.location, desc: job.desc });
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to form
    };

    const handleApply = async (jobTitle) => {
        if (!resume) return alert("Please select a resume file first!");
        const data = new FormData();
        data.append('resume', resume);
        data.append('jobTitle', jobTitle);
        data.append('email', user.email);

        await axios.post('http://127.0.0.1:5000/api/apply', data);
        alert("✅ Applied! Your resume has been parsed.");
        setResume(null);
    };

    if (view !== 'dashboard') {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md text-center border-8 border-slate-800">
                    <h1 className="text-4xl font-black text-blue-600 mb-2 italic">JobPortal Pro</h1>
                    <p className="text-gray-400 mb-6 font-bold uppercase text-[10px] tracking-widest">MERN Stack System</p>
                    <button onClick={handleLinkedInImport} className="w-full bg-[#0077b5] text-white font-bold py-4 rounded-2xl mb-8 shadow-lg">Import LinkedIn Profile</button>
                    <input type="email" value={email} placeholder="Email" className="w-full border-2 p-4 rounded-2xl mb-4 outline-none focus:border-blue-500" onChange={(e) => setEmail(e.target.value)} />
                    <select className="w-full border-2 p-4 rounded-2xl mb-8 bg-white font-bold text-gray-600 cursor-pointer" onChange={(e) => setRole(e.target.value)}>
                        <option value="candidate">Candidate Dashboard</option>
                        <option value="employer">Employer Dashboard</option>
                        <option value="admin">Admin Moderation</option>
                    </select>
                    <button onClick={() => { if(!email) return alert("Enter Email"); setUser({email, role}); setView('dashboard'); }} className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition">ENTER PORTAL</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <nav className="bg-white border-b p-6 flex justify-between items-center px-12 sticky top-0 z-50 shadow-sm">
                <h1 className="text-2xl font-black text-blue-600 italic">JobPortal Pro</h1>
                <div className="flex items-center gap-6">
                    <span className="text-xs font-black text-blue-600 uppercase">Role: {user.role}</span>
                    <button onClick={() => setView('login')} className="text-red-500 font-black hover:underline">LOGOUT</button>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto py-12 px-8">
                {/* 🔍 SEARCH / JOB MATCHING */}
                <input type="text" placeholder="🔍 Search skills, company or titles..." className="w-full p-6 rounded-[1.5rem] border-2 border-blue-100 mb-10 shadow-sm focus:border-blue-500 outline-none" onChange={(e) => setSearchTerm(e.target.value)} />

                {/* ADMIN VIEW */}
                {user.role === 'admin' && (
                    <section className="bg-white p-8 rounded-[2rem] border border-orange-100 mb-10">
                        <h2 className="text-2xl font-black mb-6 text-orange-600">Admin Control Panel</h2>
                        <table className="w-full text-left text-sm">
                            <thead><tr className="text-gray-400 text-[10px] uppercase tracking-widest"><th>Candidate</th><th>Job</th><th className="text-right">Action</th></tr></thead>
                            <tbody>
                                {adminApps.map(app => (
                                    <tr key={app._id} className="border-t">
                                        <td className="py-4 font-bold">{app.candidateEmail}</td>
                                        <td className="py-4">{app.jobTitle}</td>
                                        <td className="py-4 text-right"><a href={`http://127.0.0.1:5000/${app.resumePath}`} target="_blank" rel="noreferrer" className="text-blue-600 font-bold underline">VIEW PDF</a></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                )}

                {/* EMPLOYER FORM (Handle Create & Full Update) */}
                {user.role === 'employer' && (
                    <section className="bg-white p-10 rounded-[2rem] border-2 border-blue-50 shadow-sm mb-12">
                        <h2 className="text-2xl font-black mb-8">{editId ? "📝 Edit Job Listing" : "🚀 Post Job Opportunity"}</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <input placeholder="Title" value={formData.title} className="border-2 p-4 rounded-xl" onChange={e => setFormData({...formData, title: e.target.value})} />
                            <input placeholder="Company" value={formData.company} className="border-2 p-4 rounded-xl" onChange={e => setFormData({...formData, company: e.target.value})} />
                            <input placeholder="Salary (e.g. 18,50,000)" value={formData.salary} className="border-2 p-4 rounded-xl" onChange={e => setFormData({...formData, salary: e.target.value})} />
                            <input placeholder="Location" value={formData.location} className="border-2 p-4 rounded-xl" onChange={e => setFormData({...formData, location: e.target.value})} />
                            <textarea placeholder="Description" value={formData.desc} className="border-2 p-4 rounded-xl col-span-2 h-24" onChange={e => setFormData({...formData, desc: e.target.value})} />
                            <button onClick={handleSubmit} className={`col-span-2 font-black py-4 rounded-xl shadow-lg transition ${editId ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}>
                                {editId ? "UPDATE JOB DATA" : "PUBLISH TO PORTAL"}
                            </button>
                            {editId && <button onClick={() => {setEditId(null); setFormData({title:'',company:'',salary:'',location:'',desc:''})}} className="col-span-2 text-gray-400 font-bold mt-2">Cancel Edit</button>}
                        </div>
                    </section>
                )}

                {/* JOB LISTINGS */}
                <div className="grid gap-6">
                    {jobs.filter(job => job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.company.toLowerCase().includes(searchTerm.toLowerCase())).map(job => (
                        <div key={job._id} className="bg-white p-8 rounded-[2rem] border shadow-sm flex justify-between items-center group hover:shadow-lg transition-all">
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold group-hover:text-blue-600 transition">{job.title}</h3>
                                <p className="text-blue-600 font-bold mb-4">{job.company} • <span className="text-gray-400 font-medium">{job.location}</span></p>
                                <p className="text-gray-500 italic text-sm">"{job.desc}"</p>
                            </div>
                            <div className="text-right ml-10">
                                <p className="text-3xl font-black text-gray-900 mb-6">₹{job.salary}</p>
                                {user.role === 'candidate' ? (
                                    <div className="flex flex-col items-end gap-3">
                                        <input type="file" onChange={(e) => setResume(e.target.files[0])} className="text-[10px] text-gray-400 cursor-pointer" />
                                        <button onClick={() => handleApply(job.title)} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg">Apply Now</button>
                                    </div>
                                ) : (
                                    <div className="flex gap-4 items-center justify-end">
                                        <button onClick={() => startEdit(job)} className="text-blue-500 font-bold text-xs hover:underline">Full Edit</button>
                                        <button onClick={() => axios.delete(`http://127.0.0.1:5000/api/jobs/${job._id}`).then(fetchJobs)} className="text-red-500 font-black text-xs hover:underline">Remove</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}