import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const mailtoLink = `mailto:tharika213@gmail.com?subject=${encodeURIComponent(`Portfolio inquiry from ${formData.name}`)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;

    window.location.href = mailtoLink;
    setStatus('Opening your email app with your message…');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="footer section contact-section">
      <div className="contact-card">
        <div className="contact-copy">
          <p className="eyebrow">Let&apos;s connect</p>
          <h2>Contact</h2>
          <p>
            <a href="mailto:tharika213@gmail.com" className="contact-link">
              Email: tharika213@gmail.com
            </a>
          </p>
          <p>Share your name, email, and message and I&apos;ll receive it directly.</p>
          <div className="social-links">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link">GitHub</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn</a>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Your Name</label>
          <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required />

          <label htmlFor="email">Your Email</label>
          <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />

          <label htmlFor="message">Your Message</label>
          <textarea id="message" name="message" value={formData.message} onChange={handleChange} required />

          <button type="submit" className="button primary">Send Message</button>
          {status ? <p className="form-status">{status}</p> : null}
        </form>
      </div>
    </section>
  );
}