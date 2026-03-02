'use client';

import Link from "next/link";
import { useState, useEffect } from "react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About Me", href: "/about" },
  { label: "Speeches", href: "/speeches" },
  { label: "Blog", href: "/blog" },
  { label: "Covid India Task Force", href: "/covid-india-task-force" },
  { label: "Covid Lifeline", href: "/covid-lifeline" },
  { label: "Media Support", href: "/media-support" },
  { label: "Awards", href: "/awards" },
  { label: "Videos", href: "/videos" },
  { label: "Publications", href: "/publications" },
  { label: "Gallery", href: "/gallery" },
  { label: "Messages", href: "/messages" },
];

function FacebookIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.03 4.388 11.026 10.125 11.927v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.313 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.875v2.266h3.328l-.532 3.49h-2.796v8.437C19.612 23.099 24 18.103 24 12.073z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function Footer() {
  const [visitCount, setVisitCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/visits', { method: 'POST' })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => setVisitCount(typeof d.count === 'number' ? d.count : 23000))
      .catch(() => setVisitCount(23000));
  }, []);

  return (
    <footer style={{ background: "#000f2b", color: "#ffffff" }}>
      {/* Main Footer Content */}
      <div
        className="px-4 py-12"
        style={{ maxWidth: "1240px", margin: "0 auto" }}
      >
        <div
          className="grid gap-10"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          {/* Column 1: About */}
          <div>
            {/* Logo mark */}
            <div className="flex items-center gap-3 mb-5">
              <span
                className="flex items-center justify-center rounded-full text-white font-bold text-sm shrink-0"
                style={{
                  width: "44px",
                  height: "44px",
                  background: "linear-gradient(135deg, #9dca00 0%, #71b230 100%)",
                  fontFamily: "Sarala, sans-serif",
                }}
              >
                RI
              </span>
              <div>
                <p
                  className="font-bold text-lg m-0 leading-tight"
                  style={{ fontFamily: "Sarala, sans-serif", color: "#ffffff" }}
                >
                  Rtn. Ashok Mahajan
                </p>
                <p
                  className="text-sm m-0"
                  style={{ color: "#9dca00", fontFamily: "PT Sans, sans-serif" }}
                >
                  Past R.I. Director
                </p>
              </div>
            </div>

            <p
              className="text-sm leading-relaxed m-0"
              style={{
                color: "#b0bac9",
                fontFamily: "PT Sans, sans-serif",
                maxWidth: "280px",
              }}
            >
              Rtn. Ashok Mahajan is a distinguished Rotarian and social leader
              who has served as Past Director of Rotary International, dedicated
              to humanitarian service, community development, and global peace.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://www.facebook.com/ashokmahajan883"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow on Facebook"
                className="flex items-center justify-center rounded-full transition-colors duration-200"
                style={{
                  width: "38px",
                  height: "38px",
                  background: "rgba(255,255,255,0.08)",
                  color: "#b0bac9",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "#9dca00";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#b0bac9";
                }}
              >
                <FacebookIcon />
              </a>
              <a
                href="https://twitter.com/ashokmahajan883"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow on Twitter / X"
                className="flex items-center justify-center rounded-full transition-colors duration-200"
                style={{
                  width: "38px",
                  height: "38px",
                  background: "rgba(255,255,255,0.08)",
                  color: "#b0bac9",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "#9dca00";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#b0bac9";
                }}
              >
                <TwitterIcon />
              </a>
              <a
                href="https://www.linkedin.com/in/ashokmahajan883"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Connect on LinkedIn"
                className="flex items-center justify-center rounded-full transition-colors duration-200"
                style={{
                  width: "38px",
                  height: "38px",
                  background: "rgba(255,255,255,0.08)",
                  color: "#b0bac9",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "#9dca00";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#b0bac9";
                }}
              >
                <LinkedInIcon />
              </a>
            </div>

            {/* Visitor Counter */}
            <div className="mt-6">
              <p className="m-0 text-3xl font-bold" style={{ color: "#ffffff", fontFamily: "Sarala, sans-serif" }}>
                {visitCount !== null ? visitCount.toLocaleString() : "…"}
              </p>
              <p className="m-0 text-xs mt-1 flex items-center gap-1" style={{ color: "#9dca00", fontFamily: "PT Sans, sans-serif" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Total Visitors
              </p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3
              className="text-base font-bold mb-5 pb-3 border-b"
              style={{
                fontFamily: "Sarala, sans-serif",
                color: "#ffffff",
                borderColor: "rgba(255,255,255,0.12)",
              }}
            >
              Quick Links
            </h3>
            <ul className="footer-links-grid list-none m-0 p-0 grid gap-1.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm no-underline transition-colors duration-200 flex items-center gap-1.5"
                    style={{
                      fontFamily: "PT Sans, sans-serif",
                      color: "#b0bac9",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = "#9dca00";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = "#b0bac9";
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: "#71b230",
                        flexShrink: 0,
                      }}
                    />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3
              className="text-base font-bold mb-5 pb-3 border-b"
              style={{
                fontFamily: "Sarala, sans-serif",
                color: "#ffffff",
                borderColor: "rgba(255,255,255,0.12)",
              }}
            >
              Contact Us
            </h3>
            <ul className="list-none m-0 p-0 flex flex-col gap-4">
              {/* Address */}
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0" style={{ color: "#9dca00" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <address
                  className="not-italic text-sm leading-relaxed"
                  style={{ color: "#b0bac9", fontFamily: "PT Sans, sans-serif" }}
                >
                  1001, Marathon Galaxy 1,<br />
                  LBS Marg, Mulund (W),<br />
                  Mumbai - 400080,<br />
                  Maharashtra, India
                </address>
              </li>

              {/* Office Phone */}
              <li className="flex gap-3 items-start">
                <span className="mt-0.5 shrink-0" style={{ color: "#9dca00" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6.06 6.06l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <div style={{ fontFamily: "PT Sans, sans-serif" }}>
                  <p className="text-xs m-0 mb-0.5" style={{ color: "#71b230" }}>Office</p>
                  <a
                    href="tel:+912241313832"
                    className="text-sm no-underline transition-colors duration-200"
                    style={{ color: "#b0bac9" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#9dca00"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#b0bac9"; }}
                  >
                    +91 22 41313832
                  </a>
                </div>
              </li>

              {/* Mobile Phone */}
              <li className="flex gap-3 items-start">
                <span className="mt-0.5 shrink-0" style={{ color: "#9dca00" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                    <line x1="12" y1="18" x2="12.01" y2="18" />
                  </svg>
                </span>
                <div style={{ fontFamily: "PT Sans, sans-serif" }}>
                  <p className="text-xs m-0 mb-0.5" style={{ color: "#71b230" }}>Mobile</p>
                  <a
                    href="tel:+919820183481"
                    className="text-sm no-underline transition-colors duration-200"
                    style={{ color: "#b0bac9" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#9dca00"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#b0bac9"; }}
                  >
                    +91 9820183481
                  </a>
                </div>
              </li>

              {/* Email */}
              <li className="flex gap-3 items-start">
                <span className="mt-0.5 shrink-0" style={{ color: "#9dca00" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <div style={{ fontFamily: "PT Sans, sans-serif" }}>
                  <p className="text-xs m-0 mb-0.5" style={{ color: "#71b230" }}>Email</p>
                  <a
                    href="mailto:ashokmahajan883@gmail.com"
                    className="text-sm no-underline transition-colors duration-200 break-all"
                    style={{ color: "#b0bac9" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#9dca00"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#b0bac9"; }}
                  >
                    ashokmahajan883@gmail.com
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />

      {/* Copyright Bar */}
      <div
        className="px-4 py-4 flex flex-col items-center justify-between gap-2"
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
        }}
      >
        <p
          className="text-sm text-center m-0"
          style={{ color: "#6b7a90", fontFamily: "PT Sans, sans-serif" }}
        >
          &copy; 2024 Ashok Mahajan. All Rights Reserved.
        </p>
        <p
          className="text-xs text-center m-0"
          style={{ color: "#4a5568", fontFamily: "PT Sans, sans-serif" }}
        >
          Designed &amp; Developed with dedication to service above self.
        </p>
      </div>

      {/* Font import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sarala:wght@400;700&family=PT+Sans:wght@400;700&display=swap');
      `}</style>
    </footer>
  );
}
