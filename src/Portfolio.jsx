import { useState, useEffect, useCallback } from "react";
import "./Portfolio.css";
import { Icons } from "./icons.jsx";
import {
  useTypewriter,
  useScrollProgress,
  useSectionObserver,
  useFadeObserver,
  useSkillBarObserver,
  useTimelineObserver,
  useTilt,
  useToast,
  useMagnetic,
} from "./hooks.js";

/* ===== DATA ===== */
const NAV_SECTIONS = [
  "about",
  "workflow",
  "skills",
  "projects",
  "education",
  "contact",
];
const ROLES = ["Full Stack Developer", "React Specialist", "UI/UX Enthusiast"];

const SKILLS = {
  Languages: {
    icon: "code",
    bars: [
      { name: "TypeScript", pct: 80 },
      { name: "JavaScript", pct: 90 },
      { name: "HTML / CSS", pct: 92 },
    ],
  },
  Frameworks: {
    icon: "layers",
    bars: [
      { name: "React.js / Next.js", pct: 88 },
      { name: "Node.js / Express.js", pct: 82 },
      { name: "Redux Toolkit", pct: 78 },
      { name: "Tailwind CSS", pct: 85 },
    ],
  },
  Databases: {
    icon: "database",
    bars: [
      { name: "PostgreSQL / Supabase", pct: 78 },
      { name: "MySQL", pct: 72 },
      { name: "MongoDB", pct: 72 },
      { name: "Firebase", pct: 70 },
    ],
  },
  "DevOps & Tools": {
    icon: "tool",
    bars: [
      { name: "Git / GitHub", pct: 88 },
      { name: "Vercel / Railway", pct: 80 },
      { name: "Postman", pct: 82 },
      { name: "REST APIs", pct: 85 },
    ],
  },
  "AI-Assisted Development": {
    icon: "code",
    bars: [
      { name: "Codex", pct: 85 },
      { name: "GitHub Copilot", pct: 82 },
      { name: "Claude", pct: 80 },
    ],
  },
};

const EXTRA_TAGS = [
  "JWT",
  "Responsive Design",
  "Role-Based Authorization",
  "Scrum",
  "Agile",
  "Deployment",
  "Clean Code",
];

const PROJECTS = [
  {
    num: "01",
    title: "Năm Sự Logistics & Transportation Management Platform",
    role: "Full Stack Developer",
    desc: "A full-stack logistics and business operations platform built for a transportation company, supporting order processing, warehouse operations, inventory management, HR, payroll, accounting, delivery workflows, and vehicle management.",
    tech: [
      "React",
      "TypeScript",
      "Vite",
      "React Router",
      "TanStack Query",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "Supabase PostgreSQL",
      "JWT",
      "Cloudinary",
      "Zalo API",
    ],
    highlights: [
      "Built 89 route-based UI screens, 64 unique page components, and 20+ reusable React components.",
      "Implemented JWT authentication, role-based authorization, system configuration, and secure file uploads with Cloudinary.",
      "Developed REST API endpoints for order management, purchasing, inventory, warehouse, delivery, HR, attendance, payroll, accounting, and debt tracking.",
      "Integrated Zalo notifications to support operational workflows and business communications.",
      "Deployed and maintained the platform for real business operations, currently supporting approximately 10 daily users.",
    ],
    github: "https://github.com/htung0403/nhaxenamsu",
    live: "https://nhaxenamsu.vercel.app",
    liveLabel: "Live Site",
  },
  {
    num: "02",
    title: "AI Financial Platform",
    role: "Full Stack Developer",
    desc: "A real-time financial dashboard with AI-powered insights, featuring dark/light theme, code splitting for performance, and mobile-first responsive architecture.",
    tech: [
      "React",
      "TypeScript",
      "shadcn/ui",
      "Redux Toolkit",
      "Recharts",
      "Vercel CI/CD",
    ],
    highlights: [
      "Real-time financial data dashboard",
      "Dark / light theme system",
      "Code splitting & lazy loading",
      "Mobile-first responsive architecture",
    ],
    github: "https://github.com/htung0403/AI-financial-platform",
    live: "https://aifinancialplatform.vercel.app",
    isFreelance: true,
    workflow:
      "Sử dụng AI Agent để generate boilerplate, review logic, và debug — focus vào architecture và client requirements",
    outcomes: [
      "Delivered in 3 weeks solo",
      "Client retention: 2 follow-up projects",
    ],
  },
  {
    num: "03",
    title: "Nam Phuoc 1 Primary School Website",
    role: "Full Stack Developer",
    desc: "A full-stack web application for a primary school to manage blog posts and announcements, featuring a CMS for staff and teachers and running in production.",
    tech: [
      "React",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "Supabase",
      "REST API",
      "cPanel",
    ],
    highlights: [
      "Deployed a production website for a real school.",
      "Built blog and news posting features.",
      "Developed an admin dashboard for content management.",
      "Implemented responsive UI for mobile and desktop users.",
    ],
    github: "https://github.com/htung0403/NamPhuoc1-MERN",
    live: "https://namphuoc1.edu.vn",
    liveLabel: "Live Site",
  },
];

const TIMELINE = [
  {
    date: "2021 — Present",
    title: "HCMC University of Education and Technology",
    sub: "Bachelor of Science, Information Technology",
  },
  {
    date: "June 2025",
    title: "Software Development with Scrum",
    sub: "Certification — Axon Active Vietnam",
  },
];

/* ===== SMALL COMPONENTS ===== */
function FadeUp({ children, className = "", delay = 0 }) {
  const ref = useFadeObserver();
  return (
    <div
      ref={ref}
      className={`fade-up ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function SkillBar({ name, pct, animated }) {
  return (
    <div className="skill-bar-wrap">
      <div className="skill-bar-header">
        <span className="skill-bar-name">{name}</span>
      </div>
      <div className="skill-bar-track">
        <div
          className="skill-bar-fill"
          style={{ width: animated ? `${pct}%` : "0%" }}
        />
      </div>
    </div>
  );
}

function ProjectCard({ project, index }) {
  const { ref, handleMove, handleLeave } = useTilt();
  const fadeRef = useFadeObserver();
  const slideClass = index % 2 === 0 ? "slide-left" : "slide-right";

  return (
    <div ref={fadeRef} className={slideClass}>
      <div
        ref={ref}
        className="project-card"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        <div className="project-info">
          {project.isFreelance && (
            <div className="ai-badge">Built with AI Agent Workflow</div>
          )}
          <div className="project-number">{project.num}</div>
          <h3 className="project-title">{project.title}</h3>
          {project.isFreelance && (
            <p className="project-role" style={{ color: "var(--amber)" }}>
              Freelance Project
            </p>
          )}
          {!project.isFreelance && (
            <p className="project-role">{project.role}</p>
          )}
          <p className="project-desc">{project.desc}</p>

          {project.workflow && (
            <div className="workflow-box">
              <span className="workflow-label">AI-Assisted Workflow</span>
              <p className="workflow-note">{project.workflow}</p>
            </div>
          )}

          <div className="project-tech">
            {project.tech.map((t) => (
              <span key={t} className="project-tech-tag">
                {t}
              </span>
            ))}
          </div>

          {project.outcomes && (
            <div className="outcome-grid">
              {project.outcomes.map((o) => (
                <div key={o} className="outcome-tag">
                  <span>◈</span> {o}
                </div>
              ))}
            </div>
          )}

          <div className="project-links" style={{ marginTop: "1.5rem" }}>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              {Icons.github} <span>Code</span>
            </a>
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link"
              >
                {Icons.external} <span>{project.liveLabel ?? "Live Demo"}</span>
              </a>
            )}
          </div>
        </div>
        <div className="project-meta">
          <ul className="project-highlights">
            {project.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ===== MAIN COMPONENT ===== */
export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const typedRole = useTypewriter(ROLES);
  const scrollProgress = useScrollProgress();
  const activeSection = useSectionObserver(NAV_SECTIONS);
  const { msg, show, copy } = useToast();
  const [skillRef, skillAnimated] = useSkillBarObserver();
  const [tlRef, tlHeight] = useTimelineObserver();
  const btn1Ref = useMagnetic(15);
  const btn2Ref = useMagnetic(10);
  const [heroVisible, setHeroVisible] = useState([false, false, false, false]);

  // Hero stagger
  useEffect(() => {
    const timers = heroVisible.map((_, i) =>
      setTimeout(
        () =>
          setHeroVisible((prev) => {
            const n = [...prev];
            n[i] = true;
            return n;
          }),
        200 + i * 150,
      ),
    );
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll listeners
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  }, []);

  const heroStyle = (i) => ({
    opacity: heroVisible[i] ? 1 : 0,
    transform: heroVisible[i] ? "translateY(0)" : "translateY(30px)",
    transition: "opacity 0.7s ease, transform 0.7s ease",
  });

  return (
    <>
      {/* Scroll progress */}
      <div
        className="scroll-progress"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Navbar */}
      <nav
        className={`navbar ${scrolled ? "scrolled" : ""}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <a
          href="#"
          className="nav-logo"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          VH<span>T</span>
        </a>
        <ul className={`nav-links ${mobileOpen ? "open" : ""}`}>
          {NAV_SECTIONS.map((s) => (
            <li key={s}>
              <button
                className={`nav-link ${activeSection === s ? "active" : ""}`}
                onClick={() => scrollToSection(s)}
              >
                {s}
              </button>
            </li>
          ))}
          <li>
            <a
              href="https://github.com/htung0403"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-cta"
            >
              {Icons.github} GitHub
            </a>
          </li>
        </ul>
        <button
          className={`mobile-toggle ${mobileOpen ? "open" : ""}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Hero */}
      <section className="hero" id="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="hero-content">
          <div style={heroStyle(0)}>
            <div className="hero-badge">
              <span className="dot" /> Open to Fresher Roles
            </div>
          </div>
          <h1 className="hero-name" style={heroStyle(1)}>
            Võ Hoàng
            <br />
            Tùng
          </h1>
          <div className="hero-role" style={heroStyle(2)}>
            {"> "}
            {typedRole}
            <span className="cursor" />
          </div>
          <p className="hero-bio" style={heroStyle(2)}>
            Full Stack Developer
            <br />
            Freelance Full Stack Developer since Nov 2025
            <br />
            Building production-ready React & Node.js applications
          </p>
          <div className="hero-buttons" style={heroStyle(3)}>
            <button
              ref={btn1Ref}
              className="btn-primary"
              onClick={() => scrollToSection("projects")}
            >
              View Projects {Icons.external}
            </button>
            <button
              ref={btn2Ref}
              className="btn-secondary"
              onClick={() => scrollToSection("contact")}
            >
              Get in Touch
            </button>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section" id="about">
        <FadeUp>
          <div className="section-header">
            <p className="section-label">About</p>
            <h2 className="section-title">
              <span className="glitch">Who I Am</span>
            </h2>
          </div>
        </FadeUp>
        <div className="about-grid">
          <FadeUp delay={100}>
            <div className="about-text">
              <p>
                I'm a <strong>Full Stack Developer</strong> with{" "}
                <strong>freelance experience since Nov 2025</strong>, building
                production-ready web applications for real clients. I specialize
                in{" "}
                <strong>
                  React, Next.js, TypeScript, Node.js, Express, and PostgreSQL,
                </strong>
                with a strong focus on responsive interfaces, REST APIs, clean
                architecture, and maintainable code.
              </p>
              <p>
                I have delivered solutions for logistics, education, and internal
                business management, including{" "}
                <strong>
                  order management, warehouse operations, inventory tracking, HR,
                  payroll, and accounting workflows.
                </strong>
                My work involves gathering requirements, building features,
                fixing bugs, and maintaining systems used in real business
                operations.
              </p>
              <p>
                I also use AI-assisted development tools such as{" "}
                <strong>Codex, GitHub Copilot, and Claude</strong> to support
                prototyping, debugging, refactoring, and technical research while
                carefully reviewing generated code before applying it to
                production codebases.
              </p>
            </div>
          </FadeUp>
          <FadeUp delay={250}>
            <div className="about-highlights">
              <div className="highlight-card">
                <div className="highlight-value">5+</div>
                <div className="highlight-label">Projects Shipped</div>
              </div>
              <div className="highlight-card">
                <div className="highlight-value">795</div>
                <div className="highlight-label">TOEIC Score</div>
              </div>
              <div className="highlight-card">
                <div className="highlight-value">14+</div>
                <div className="highlight-label">Pages Built</div>
              </div>
              <div className="highlight-card">
                <div className="highlight-value">{Icons.globe}</div>
                <div className="highlight-label">Bình Thạnh, HCM</div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* How I Work */}
      <section className="section" id="workflow">
        <FadeUp>
          <div className="section-header">
            <p className="section-label">Workflow</p>
            <h2 className="section-title">
              <span className="glitch">How I Work</span>
            </h2>
          </div>
        </FadeUp>
        <FadeUp delay={100}>
          <div className="how-card">
            <div className="how-content">
              <p className="how-quote">
                I use tools like <span>Codex, GitHub Copilot, and Claude</span>{" "}
                as development assistants—not replacements for engineering
                decisions. While AI helps streamline repetitive coding,
                debugging, refactoring, and technical research, I remain
                responsible for understanding existing codebases, following
                coding standards, testing changes, and delivering{" "}
                <span>maintainable software</span>.
              </p>
              <div className="how-metrics">
                <div className="how-metric-item">
                  <span className="how-metric-val">AI-Assisted</span>
                  <span className="how-metric-label">Workflow</span>
                </div>
                <div className="how-metric-item">
                  <span className="how-metric-val">Existing</span>
                  <span className="how-metric-label">Codebases</span>
                </div>
                <div className="how-metric-item">
                  <span className="how-metric-val">Coding</span>
                  <span className="how-metric-label">Standards</span>
                </div>
                <div className="how-metric-item">
                  <span className="how-metric-val">Production</span>
                  <span className="how-metric-label">Quality</span>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* Skills */}
      <section
        className="section"
        id="skills"
        style={{ background: "var(--bg-secondary)" }}
      >
        <FadeUp>
          <div className="section-header">
            <p className="section-label">Skills</p>
            <h2 className="section-title">
              <span className="glitch">Tech Stack</span>
            </h2>
          </div>
        </FadeUp>
        <div className="skills-container" ref={skillRef}>
          <div className="skills-categories">
            {Object.entries(SKILLS).map(([cat, { icon, bars }], ci) => (
              <FadeUp key={cat} delay={ci * 120}>
                <div className="skill-category">
                  <h3 className="skill-cat-title">
                    <span className="skill-cat-icon">{Icons[icon]}</span> {cat}
                  </h3>
                  {bars.map((b) => (
                    <SkillBar key={b.name} {...b} animated={skillAnimated} />
                  ))}
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={500}>
            <div className="skill-tags" style={{ marginTop: "2rem" }}>
              {EXTRA_TAGS.map((t) => (
                <span key={t} className="skill-tag">
                  {t}
                </span>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Projects */}
      <section className="section" id="projects">
        <FadeUp>
          <div className="section-header">
            <p className="section-label">Projects</p>
            <h2 className="section-title">
              <span className="glitch">Featured Work</span>
            </h2>
          </div>
        </FadeUp>
        <div className="projects-container">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.num} project={p} index={i} />
          ))}
        </div>
      </section>

      {/* Education & Certification */}
      <section
        className="section"
        id="education"
        style={{ background: "var(--bg-secondary)" }}
      >
        <FadeUp>
          <div className="section-header">
            <p className="section-label">Education</p>
            <h2 className="section-title">
              <span className="glitch">Background</span>
            </h2>
          </div>
        </FadeUp>
        <div className="timeline-container" ref={tlRef}>
          <div className="timeline-line" style={{ height: tlHeight }} />
          {TIMELINE.map((item, i) => (
            <FadeUp key={i} delay={i * 200}>
              <div className="timeline-item">
                <div
                  className={`timeline-dot ${tlHeight > 0 ? "pulsing" : ""}`}
                />
                <div className="timeline-content">
                  <p className="timeline-date">{item.date}</p>
                  <h3 className="timeline-title">{item.title}</h3>
                  <p className="timeline-subtitle">{item.sub}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="section" id="contact">
        <FadeUp>
          <div className="contact-container">
            <p className="section-label" style={{ justifyContent: "center" }}>
              Contact
            </p>
            <h2 className="contact-title">Let's Work Together</h2>
            <p className="contact-desc">
              Feel free to reach out for collaborations, internship
              opportunities, or just a friendly hello.
            </p>
            <div className="contact-items">
              <div
                className="contact-item"
                onClick={() => copy("htung0403@gmail.com", "Email")}
              >
                <span className="contact-item-icon">{Icons.mail}</span>
                <span className="contact-item-text">htung0403@gmail.com</span>
              </div>
              <div
                className="contact-item"
                onClick={() => copy("0901340403", "Phone")}
              >
                <span className="contact-item-icon">{Icons.phone}</span>
                <span className="contact-item-text">0901340403</span>
              </div>
              <div
                className="contact-item"
                onClick={() => copy("Bình Thạnh, TP.HCM", "Location")}
              >
                <span className="contact-item-icon">{Icons.location}</span>
                <span className="contact-item-text">Bình Thạnh, TP.HCM</span>
              </div>
            </div>
            <div className="social-links">
              <a
                href="https://github.com/htung0403"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="GitHub"
              >
                {Icons.github}
              </a>
              <a
                href="mailto:htung0403@gmail.com"
                className="social-link"
                aria-label="Email"
              >
                {Icons.mail}
              </a>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>
          Designed & built by{" "}
          <a href="https://github.com/htung0403">Võ Hoàng Tùng</a> —{" "}
          {new Date().getFullYear()}
        </p>
      </footer>

      {/* Scroll to top */}
      <button
        className={`scroll-top ${showTop ? "visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
      >
        {Icons.arrowUp}
      </button>

      {/* Toast */}
      <div className={`toast ${show ? "show" : ""}`}>{msg}</div>
    </>
  );
}
