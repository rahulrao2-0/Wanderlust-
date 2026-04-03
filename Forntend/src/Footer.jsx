import React, { useState } from "react";
import "./Footer.css";

const CompassRose = () => (
  <svg className="wl-compass-bg" viewBox="0 0 400 400" fill="white" xmlns="http://www.w3.org/2000/svg">
    <circle cx="200" cy="200" r="195" fill="none" stroke="white" strokeWidth="1" />
    <circle cx="200" cy="200" r="150" fill="none" stroke="white" strokeWidth="0.5" />
    <circle cx="200" cy="200" r="80" fill="none" stroke="white" strokeWidth="0.5" />
    <polygon points="200,10 208,192 200,185 192,192" fill="white" />
    <polygon points="200,390 208,208 200,215 192,208" fill="white" opacity="0.5" />
    <polygon points="10,200 192,208 185,200 192,192" fill="white" opacity="0.5" />
    <polygon points="390,200 208,192 215,200 208,208" fill="white" />
    <text x="200" y="25" textAnchor="middle" fontSize="14" fill="white" fontFamily="serif">N</text>
    <text x="200" y="385" textAnchor="middle" fontSize="10" fill="white" fontFamily="serif" opacity="0.5">S</text>
    <text x="382" y="205" textAnchor="middle" fontSize="10" fill="white" fontFamily="serif">E</text>
    <text x="18" y="205" textAnchor="middle" fontSize="10" fill="white" fontFamily="serif" opacity="0.5">W</text>
  </svg>
);

const socialLinks = [
  {
    title: "Instagram",
    href: "#",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    title: "Facebook",
    href: "#",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    title: "X / Twitter",
    href: "#",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    title: "YouTube",
    href: "#",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    title: "Pinterest",
    href: "#",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
      </svg>
    ),
  },
];

const destinations = [
  { flag: "🇯🇵", name: "Japan" },
  { flag: "🇮🇹", name: "Italy" },
  { flag: "🇲🇦", name: "Morocco" },
  { flag: "🇳🇿", name: "New Zealand" },
  { flag: "🇵🇪", name: "Peru" },
  { flag: "🇮🇸", name: "Iceland" },
  { flag: "🇮🇳", name: "India" },
];

const exploreLinks = [
  "Adventure Tours",
  "Luxury Escapes",
  "Cultural Journeys",
  "Honeymoon Packages",
  "Solo Travel",
  "Family Getaways",
  "Cruise Holidays",
];

const companyLinks = ["About Us", "Careers", "Press", "Blog"];

const contactInfo = [
  { text: "42 Explorer's Lane,\nMumbai, India 400001" },
  { text: "hello@wanderlust.in" },
  { text: "+91 98765 43210" },
  { text: "Mon–Sat, 9am – 7pm IST" },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="wl-footer">
      <div className="wl-footer-top-border" />
      <CompassRose />

      <div className="wl-footer-main">

        {/* Brand Column */}
        <div className="wl-brand-col">
          <div className="wl-brand-logo">
            Wander<span>lust</span>
          </div>
          <div className="wl-brand-tagline">Explore. Experience. Evolve.</div>
          <p className="wl-brand-desc">
            Curating extraordinary journeys for the restless soul. From hidden
            mountain villages to sun-drenched coastlines — every trip a story,
            every destination a revelation.
          </p>

          <div className="wl-newsletter-label">Join the Journey</div>
          <div className="wl-newsletter-form">
            <input
              className="wl-newsletter-input"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="wl-newsletter-btn">Subscribe</button>
          </div>

          <div className="wl-award-badge">
            <span className="wl-award-star">★</span>
            Best Travel Brand 2024
            <span className="wl-award-star">★</span>
          </div>
        </div>

        {/* Explore Column */}
        <div className="wl-link-col">
          <div className="wl-col-heading">Explore</div>
          <ul className="wl-footer-links">
            {exploreLinks.map((link) => (
              <li key={link}>
                <a href="#">{link}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Destinations Column */}
        <div className="wl-link-col">
          <div className="wl-col-heading">Destinations</div>
          <div className="wl-destinations">
            {destinations.map((dest) => (
              <div className="wl-dest-item" key={dest.name}>
                <span className="wl-dest-flag">{dest.flag}</span>
                {dest.name}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Column */}
        <div className="wl-link-col">
          <div className="wl-col-heading">Get in Touch</div>
          {contactInfo.map((item, i) => (
            <div className="wl-pin-row" key={i}>
              <div className="wl-pin" />
              <div className="wl-contact-item">
                {item.text.split("\n").map((line, j, arr) => (
                  <span key={j}>
                    {line}
                    {j < arr.length - 1 && <br />}
                  </span>
                ))}
              </div>
            </div>
          ))}

          <div className="wl-company-section">
            <div className="wl-col-heading wl-col-heading--sm">Company</div>
            <ul className="wl-footer-links">
              {companyLinks.map((link) => (
                <li key={link}>
                  <a href="#">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="wl-footer-divider" />

      {/* Bottom Bar */}
      <div className="wl-footer-bottom">
        <div className="wl-copyright">
          © 2025 <strong>Wanderlust</strong>. All rights reserved. Crafted with ❤️ for explorers.
        </div>

        <div className="wl-social-links">
          {socialLinks.map((s) => (
            <a key={s.title} className="wl-social-link" href={s.href} title={s.title}>
              {s.icon}
            </a>
          ))}
        </div>

        <div className="wl-legal-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Use</a>
          <a href="#">Sitemap</a>
        </div>
      </div>
    </footer>
  );
}