const POINTS = [
  { icon: 'bi-pencil-square', title: 'Problem reporting', text: 'Students file a ticket for any small campus problem in under a minute.' },
  { icon: 'bi-signpost-split', title: 'Status tracking', text: 'Every ticket carries a clear status — Unresolved, In Progress, Resolved.' },
  { icon: 'bi-clipboard-check', title: 'Admin management', text: 'Admins see every open ticket in one queue and move it forward as work happens.' },
  { icon: 'bi-building-check', title: 'Better campus maintenance', text: 'A visible, shared queue means small issues get fixed before they become big ones.' },
]

// ---------------------------------------------------------------------------
// TODO: this is the team you'll want to personalize. Swap in real names,
// roles, photos and links. `photo` can be any image URL — drop your own
// picture in /public (e.g. /team/me.jpg) and point to it here, or keep the
// generated placeholder avatar until you do.
// ---------------------------------------------------------------------------
import ysb from './ysb.jpeg'
import KS from './KS.png'

const TEAM = [
  {
    name: 'Yedla Sai Bhavani',
    role: 'Frontend Developer',
    bio: 'Developed the frontend and designed the UI and user experience.',
    photo: ysb,
    github: 'https://github.com/saibhavaniyedla',
    linkedin: 'https://linkedin.com/in/sai-bhavani-yedla',
    email: 'saibhavaniyedla35@gmail.com',
  },
  {
    name: 'Kamsani Shravani',
    role: 'Frontend Developer',
    bio: 'Helped with frontend development, UI design, and styling.',
    photo: KS,
    github: 'https://github.com/shravanikamsani',
    linkedin: 'https://linkedin.com/in/shravani-kamsani',
    email: 'shravanikamsani@gmail.com',
  },
]

export default function About() {
  return (
    <div>
      <section className="cf-hero cf-section-tight">
        <div className="container">
          <span className="cf-hero-eyebrow">
            About CampusPulse <i className="bi bi-star-fill"></i>
          </span>
          <h1 className="mt-3 mb-2">What is CampusPulse?</h1>
          <p className="lead mb-1" style={{ maxWidth: 640 }}>
            CampusPulse provides students with a simple way to report campus
            problems and allows administrators to track and manage their progress.
          </p>
          <p className="cf-hero-tagline mb-0">
            Know the Issue. Track the Progress. Improve the Campus.
          </p>
        </div>
      </section>

      <section className="cf-section">
        <div className="container">
          <div className="row g-4">
            {POINTS.map((p) => (
              <div className="col-sm-6" key={p.title}>
                <div className="cf-card p-4 h-100 d-flex gap-3">
                  <i className={`bi ${p.icon} fs-3 flex-shrink-0`} style={{ color: 'var(--cf-teal)' }}></i>
                  <div>
                    <h3 className="h6 mb-1">{p.title}</h3>
                    <p className="text-muted small mb-0">{p.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cf-card p-4 p-lg-5 mt-4">
            <h2 className="h4 mb-3">Two roles, one shared queue</h2>
            <div className="row g-4">
              <div className="col-md-6">
                <h3 className="h6" style={{ color: 'var(--cf-teal-deep)' }}>
                  <i className="bi bi-mortarboard me-2"></i>Students report and track
                </h3>
                <p className="text-muted small mb-0">
                  Students file new problems and watch their own reports move
                  through the queue — they can never set or change a status.
                </p>
              </div>
              <div className="col-md-6">
                <h3 className="h6" style={{ color: 'var(--cf-teal-deep)' }}>
                  <i className="bi bi-shield-check me-2"></i>Admins view and manage
                </h3>
                <p className="text-muted small mb-0">
                  Admins see every reported problem campus-wide and are the only
                  ones who can move a ticket to In Progress or Resolved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Who We Are ---------- */}
      <section className="cf-section cf-section-alt">
        <div className="container">
          <div className="text-center mx-auto mb-5" style={{ maxWidth: 620 }}>
            <span className="cf-eyebrow">The team</span>
            <h2 className="mt-2 mb-3">Who We Are</h2>
            <div className="cf-brand-chip mx-auto mb-3">
              <i className="bi bi-star-fill"></i> CampusPulse
            </div>
            <p className="cf-tagline mb-0">
              "Know the Issue. Track the Progress. Improve the Campus."
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            {TEAM.map((member) => (
              <div className="col-sm-10 col-md-6 col-lg-5" key={member.name}>
                <div className="cf-team-card h-100">
                  <div className="cf-team-photo-wrap">
                    <img src={member.photo} alt={member.name} className="cf-team-photo" />
                  </div>
                  <h3 className="h5 mb-1 text-center">{member.name}</h3>
                  <p className="cf-team-role text-center mb-3">{member.role}</p>
                  <p className="text-muted small text-center mb-4">{member.bio}</p>
                  <div className="cf-team-socials">
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} on GitHub`}
                      title="GitHub"
                    >
                      <i className="bi bi-github"></i>
                    </a>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} on LinkedIn`}
                      title="LinkedIn"
                    >
                      <i className="bi bi-linkedin"></i>
                    </a>
                    <a
                      href={`mailto:${member.email}`}
                      aria-label={`Email ${member.name}`}
                      title="Email"
                    >
                      <i className="bi bi-envelope-fill"></i>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
