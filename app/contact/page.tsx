// app/contact/page.tsx
'use client';

import { useState } from 'react';
import { database, ref, push } from '@/lib/firebase';
import { getAuth } from "firebase/auth";
import "./contact.css";

const ContactPage: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; message?: string } = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format';
    if (!message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setStatus('');

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      // ✅ userId or "guest"
      const userId = user ? user.uid : "guest";

      // ✅ Convert timestamp to IST (Indian Standard Time)
      const timestamp = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      });

      // ✅ Store under userId branch
      const inquiriesRef = ref(database, `contact-us/${userId}`);
      await push(inquiriesRef, {
        name,
        email,
        message,
        timestamp,
      });

      setStatus('Thank you for your inquiry! We will get back to you soon.');
      setName('');
      setEmail('');
      setMessage('');

      // ✅ Remove success message after 2 seconds
      setTimeout(() => setStatus(''), 2000);

    } catch (error) {
      setStatus('Error submitting inquiry. Please try again later.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="contact-container">
      <header className="contact-header">
        <h1>Contact Us</h1>
        <p>Have questions or need assistance? Reach out to our team!</p>
      </header>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`input ${errors.name ? 'error' : ''}`}
            placeholder="Enter your name"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`input ${errors.email ? 'error' : ''}`}
            placeholder="Enter your email"
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`textarea ${errors.message ? 'error' : ''}`}
            placeholder="Tell us how we can help you"
          />
          {errors.message && <span className="error-message">{errors.message}</span>}
        </div>
        <button type="submit" className="button">
          Send Message
        </button>
      </form>
      {status && (
        <p className={`status ${status.includes('Error') ? 'error-status' : ''}`}>
          {status}
        </p>
      )}
    </div>
  );
};

export default ContactPage;
