import { Link } from 'react-router-dom'

const STEPS = [
  {
    n: '01',
    title: 'Report',
    icon: 'bi-pencil-square',
    text: 'Spot a broken light, a leaking tap, a wobbly chair? File a report in under a minute with a title, category, location and photo.',
  },
  {
    n: '02',
    title: 'Track',
    icon: 'bi-signpost-split',
    text: 'Every report becomes a ticket you can follow — see it move from Unresolved to In Progress to Resolved.',
  },
  {
    n: '03',
    title: 'Resolve',
    icon: 'bi-check2-circle',
    text: 'Campus admins pick up the ticket, work on the issue, and mark it resolved once it is fixed.',
  },
]

const WHY_CARDS = [
  {
    icon: 'bi-lightning-charge',
    title: 'Easy Reporting',
    text: 'A short form — title, category, location, photo — is all it takes to file a problem.',
  },
  {
    icon: 'bi-eye',
    title: 'Transparent Progress',
    text: 'No more wondering what happened to your report. Status updates are visible the moment admins make them.',
  },
  {
    icon: 'bi-building-check',
    title: 'Better Campus',
    text: 'Small fixes add up — a campus where problems get reported gets problems that get solved.',
  },
  {
    icon: 'bi-speedometer2',
    title: 'Quick Issue Tracking',
    text: 'Filter and scan through open tickets fast, whether you are a student or an admin.',
  },
]

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="cf-hero">
        <div className="container">
          <div className="row align-items-center gy-5">
            <div className="col-lg-6">
              <span className="cf-hero-eyebrow">
                CampusPulse <i className="bi bi-star-fill"></i>
              </span>
              <h1 className="mt-3 mb-3">
                Make Your Campus Better, One Problem at a Time.
              </h1>
              <p className="lead mb-2">
                Report campus problems easily and help create a cleaner, safer
                and better campus.
              </p>
              <p className="cf-hero-tagline mb-4">
                Know the Issue. Track the Progress. Improve the Campus.
              </p>
              <Link to="/login" className="btn btn-cf-amber btn-lg px-4 py-3 mt-2">
                Try It Now <i className="bi bi-arrow-right ms-2"></i>
              </Link>
            </div>

            <div className="col-lg-6">
              <div className="cf-hero-card p-4 mx-auto" style={{ maxWidth: 380 }}>
                <div className="cf-ticket-id mb-2">#CP-0129</div>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h3 className="h6 mb-0">Leaking tap near hostel block</h3>
                  <span className="cf-badge cf-badge-inprogress">
                    <i className="bi bi-tools"></i>In Progress
                  </span>
                </div>
                <p className="text-muted small mb-3">
                  Wash-area tap has been leaking for a week, wasting water.
                </p>
                <div className="d-flex gap-3 small text-muted">
                  <span><i className="bi bi-droplet me-1"></i>Plumbing</span>
                  <span><i className="bi bi-geo-alt me-1"></i>Hostel Block 2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="cf-section">
        <div className="container">
          <div className="text-center mb-5">
            <span className="cf-eyebrow">How it works</span>
            <h2 className="mt-2">From noticing to fixing, in three steps</h2>
          </div>

          <div className="row g-4">
            {STEPS.map((step) => (
              <div className="col-md-4" key={step.n}>
                <div className="cf-card p-4 h-100">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <span className="cf-step-num">{step.n}</span>
                    <i className={`bi ${step.icon} fs-3`} style={{ color: 'var(--cf-teal)' }}></i>
                  </div>
                  <h3 className="h5">{step.title}</h3>
                  <p className="text-muted mb-0">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="cf-perforation" />

      {/* Why CampusPulse */}
      <section className="cf-section" style={{ background: 'var(--cf-surface)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="cf-eyebrow">Why CampusPulse</span>
            <h2 className="mt-2">Built for the way campuses actually run</h2>
          </div>

          <div className="row g-4">
            {WHY_CARDS.map((card) => (
              <div className="col-sm-6 col-lg-3" key={card.title}>
                <div className="cf-card p-4 h-100 text-center">
                  <div
                    className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: 'rgba(47,158,143,0.12)',
                      color: 'var(--cf-teal-deep)',
                    }}
                  >
                    <i className={`bi ${card.icon} fs-4`}></i>
                  </div>
                  <h3 className="h6">{card.title}</h3>
                  <p className="text-muted small mb-0">{card.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About preview */}
      <section className="cf-section">
        <div className="container">
          <div className="row align-items-center gy-4 cf-card p-4 p-lg-5">
            <div className="col-lg-7">
              <span className="cf-eyebrow">About CampusPulse</span>
              <h2 className="mt-2 mb-3">A shared ledger for small campus problems</h2>
              <p className="text-muted mb-0">
                CampusPulse gives students a simple way to report everyday problems —
                broken lights, leaking taps, damaged furniture — and gives admins a
                clear queue to manage and resolve them. Every ticket stays visible
                to the student who filed it, so progress is never a mystery.
              </p>
            </div>
            <div className="col-lg-5 text-lg-end">
              <Link to="/about" className="btn btn-cf-outline me-2">Learn more</Link>
              <Link to="/login" className="btn btn-cf-indigo">Try It Now</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
