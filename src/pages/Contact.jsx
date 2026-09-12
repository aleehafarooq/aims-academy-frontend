import { useState } from "react";

function Contact() {
  const [phone, setPhone] = useState("");

  const handlePhoneChange = (event) => {
    const value = event.target.value;
    // Allow numbers only
    const numbersOnly = value.replace(/\D/g, "");
    // Maximum 11 digits
    const limitedNumber = numbersOnly.slice(0, 11);
    setPhone(limitedNumber);
  };

  const whatsappMessage =
    "Hello AIMS Academy, I would like to get some information about admissions and courses.";

  const whatsappLink = `https://wa.me/923366084596?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const gmailLink =
    "https://mail.google.com/mail/?view=cm&fs=1&to=aimsacademy06@gmail.com";

  return (
    <main className="contact-page">
      {/* Header */}
      <section className="contact-header">
        <div className="contact-header-container">
          <p className="section-label">CONTACT US</p>
          <h1>Let's Talk.</h1>
          <p className="contact-header-description">
            Have a question about admissions, courses, academic programs, or
            AIMS Academy? Get in touch with us.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="contact-section">
        {/* Contact Information */}
        <div className="contact-information">
          <p className="section-label">GET IN TOUCH</p>
          <h2>We'd love to hear from you.</h2>
          <p className="contact-information-description">
            Whether you are a student, parent, or simply looking for more
            information about AIMS Academy, our team is here to help.
          </p>

          <div className="contact-details">
            {/* Business Phone */}
            <div className="contact-detail">
              <span>BUSINESS PHONE</span>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                <h3>03366084596</h3>
              </a>
              <p>Click to contact us on WhatsApp.</p>
            </div>

            {/* Email */}
            <div className="contact-detail">
              <span>EMAIL</span>
              <a
                href={gmailLink}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                <h3>aimsacademy06@gmail.com</h3>
              </a>
              <p>Click to send us an email through Gmail.</p>
            </div>

            {/* Location */}
            <div className="contact-detail">
              <span>LOCATION</span>
              <h3>Garden Town, Multan</h3>
              <p>AIMS Academy, Garden Town, Multan.</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-container">
          <form className="contact-form">
            {/* Name */}
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Phone */}
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="03XXXXXXXXX"
                inputMode="numeric"
                pattern="^03[0-9]{9}$"
                title="Please enter a valid 11-digit mobile number starting with 03"
                required
              />
              <small>
                Enter a valid 11-digit Pakistani mobile number.
              </small>
            </div>

            {/* Message */}
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="6"
                placeholder="Write your message..."
                required
              ></textarea>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="primary-button contact-submit"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="contact-cta">
        <p className="section-label">AIMS ACADEMY</p>
        <h2>We're here to help you move forward.</h2>
      </section>
    </main>
  );
}

export default Contact;