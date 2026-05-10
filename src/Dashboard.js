import React, { useState } from 'react';
import axios from 'axios';

// --- APNA LIVE BACKEND URL ---
const API_BASE_URL = "https://fact-checker-api-8qgm.onrender.com";

function Dashboard() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [claims, setClaims] = useState([]); // extractedText ko yahan se hata diya gaya hai

    // 1. PDF Upload & Extraction
    const handleUpload = async () => {
        if (!file) return alert("Please select a file first!");

        const formData = new FormData();
        formData.append('pdf', file);

        try {
            setMessage("⏳ Processing... Extracting claims from PDF.");
            const res = await axios.post(`${API_BASE_URL}/api/claims/upload`, formData);
            
            setMessage("✅ " + res.data.message);
            // setExtractedText call yahan se delete kar di gayi hai
            
            const initialClaims = res.data.claims.map(c => ({
                text: c,
                status: 'Pending',
                explanation: ''
            }));
            setClaims(initialClaims);
        } catch (err) {
            console.error("Full Error:", err);
            setMessage("❌ Error: " + (err.response?.data?.error || err.message));
        }
    };

    // 2. AI Verification Functionality
    const verifyClaim = async (index, claimText) => {
        try {
            const updatedClaims = [...claims];
            updatedClaims[index] = { ...updatedClaims[index], status: "Verifying..." };
            setClaims(updatedClaims);

            const res = await axios.post(`${API_BASE_URL}/api/claims/verify`, { claimText });
            
            const finalClaims = [...claims];
            finalClaims[index] = { 
                text: claimText, 
                status: res.data.status, 
                explanation: res.data.explanation 
            };
            setClaims(finalClaims);
        } catch (err) {
            alert("❌ AI verification failed!");
            const failedClaims = [...claims];
            failedClaims[index] = { ...failedClaims[index], status: "Error" };
            setClaims(failedClaims);
        }
    };

    // Status styling helper
    const getStatusBadgeStyle = (status) => {
        const base = { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' };
        
        switch(status) {
            case 'Verified': 
                return { ...base, backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' };
            case 'Inaccurate': 
                return { ...base, backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffeeba' };
            case 'False': 
                return { ...base, backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' };
            case 'Verifying...': 
                return { ...base, backgroundColor: '#e2e3e5', color: '#383d41', border: '1px solid #d6d8db' };
            default: 
                return { ...base, backgroundColor: '#f8f9fa', color: '#6c757d', border: '1px solid #dee2e6' };
        }
    };

    return (
        <div style={{ padding: '30px', fontFamily: 'Arial', maxWidth: '1100px', margin: 'auto' }}>
            <h1 style={{ textAlign: 'center', color: '#333' }}>🚀 Fact-Checker Dashboard</h1>
            
            <div style={{ 
                border: '2px dashed #007bff', 
                padding: '30px', 
                borderRadius: '10px', 
                textAlign: 'center',
                backgroundColor: '#f8f9fa' 
            }}>
                <h3>Upload PDF for Fact-Checking</h3>
                <input 
                    type="file" 
                    accept="application/pdf" 
                    onChange={(e) => setFile(e.target.files[0])} 
                    style={{ marginBottom: '20px' }}
                />
                <br />
                <button 
                    onClick={handleUpload} 
                    style={{ 
                        padding: '10px 25px', 
                        cursor: 'pointer', 
                        backgroundColor: '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '5px',
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }}
                >
                    Upload & Extract Claims
                </button>
            </div>

            {message && <p style={{ fontWeight: 'bold', marginTop: '20px', color: '#0056b3', textAlign: 'center' }}>{message}</p>}

            {claims.length > 0 && (
                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', marginTop: '20px' }}>
                    <div style={{ flex: 1, padding: '15px', backgroundColor: '#f0f7ff', borderRadius: '8px', textAlign: 'center', border: '1px solid #b8daff' }}>
                        <h4 style={{ margin: 0 }}>Total Claims</h4>
                        <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0 0 0' }}>{claims.length}</p>
                    </div>
                    <div style={{ flex: 1, padding: '15px', backgroundColor: '#d4edda', borderRadius: '8px', textAlign: 'center', border: '1px solid #c3e6cb' }}>
                        <h4 style={{ margin: 0 }}>Verified</h4>
                        <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0 0 0', color: '#155724' }}>
                            {claims.filter(c => c.status === 'Verified').length}
                        </p>
                    </div>
                    <div style={{ flex: 1, padding: '15px', backgroundColor: '#f8d7da', borderRadius: '8px', textAlign: 'center', border: '1px solid #f5c6cb' }}>
                        <h4 style={{ margin: 0 }}>Flagged</h4>
                        <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0 0 0', color: '#721c24' }}>
                            {claims.filter(c => c.status === 'False' || c.status === 'Inaccurate').length}
                        </p>
                    </div>
                </div>
            )}

            {claims && claims.length > 0 && (
                <div style={{ marginTop: '40px' }}>
                    <h3>🔍 Identified Claims (Fact-Check with Gemini AI)</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#007bff', color: 'white', textAlign: 'left' }}>
                                <th style={{ padding: '12px', border: '1px solid #dee2e6' }}>Statement</th>
                                <th style={{ padding: '12px', border: '1px solid #dee2e6', width: '120px' }}>Status</th>
                                <th style={{ padding: '12px', border: '1px solid #dee2e6' }}>AI Explanation & Real Facts</th>
                                <th style={{ padding: '12px', border: '1px solid #dee2e6', width: '150px', textAlign: 'center' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {claims.map((item, index) => (
                                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa' }}>
                                    <td style={{ padding: '12px', border: '1px solid #dee2e6', fontSize: '14px' }}>
                                        {item.text}
                                    </td>
                                    <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                                        <span style={getStatusBadgeStyle(item.status)}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px', border: '1px solid #dee2e6', fontSize: '13px', fontStyle: 'italic', color: '#555' }}>
                                        {item.explanation || "Click verify to check live data..."}
                                    </td>
                                    <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                                        <button 
                                            onClick={() => verifyClaim(index, item.text)}
                                            disabled={item.status === "Verifying..."}
                                            style={{ 
                                                backgroundColor: item.status === "Verifying..." ? '#ccc' : '#28a745', 
                                                color: 'white', 
                                                border: 'none', 
                                                padding: '8px 12px', 
                                                cursor: item.status === "Verifying..." ? 'not-allowed' : 'pointer', 
                                                borderRadius: '4px',
                                                fontSize: '13px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {item.status === "Verifying..." ? "Checking..." : "Verify AI"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Dashboard;