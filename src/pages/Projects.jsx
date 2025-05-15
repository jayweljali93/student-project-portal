// src/components/Projects.jsx
import React, { useState } from 'react';
import '../styles/Projects.css';

const Projects = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    if (!title || !description || !price || !file) {
      setMessage('❌ Please fill all fields and select a ZIP file.');
      return;
    }

    if (!file.name.endsWith('.zip')) {
      setMessage('❌ Only ZIP files are allowed.');
      return;
    }

    try {
      setUploading(true);
      setMessage('Uploading...');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);

      const response = await fetch('https://upload-5v3q.onrender.com/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('✅ Project uploaded successfully!');
        setTitle('');
        setDescription('');
        setPrice('');
        setFile(null);
      } else {
        setMessage(`❌ Upload failed: ${result.error}`);
      }
    } catch (error) {
      console.error(error);
      setMessage('❌ Error uploading project.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="project-upload-card">
      <h2>📤 Upload New Project</h2>
      <p className="upload-subtitle">Fill in the details and upload your .zip file</p>

      <input
        type="text"
        placeholder="Project Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Project Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
      ></textarea>

      <input
        type="number"
        placeholder="Project Price (INR)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <input
        type="file"
        accept=".zip"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button className="upload-btn" onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload Project'}
      </button>

      {message && <p className="upload-message">{message}</p>}
    </div>
  );
};

export default Projects;
