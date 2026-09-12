import logo from "../assets/aims-logo.jpg.jpeg";

function Home() {
  return (
    <main className="home-page">

      {/* ================================
          HERO SECTION
      ================================= */}

      <section className="hero-section">

        <div className="hero-content">

          <p className="hero-small-title">
            WELCOME TO AIMS ACADEMY
          </p>

          <h1>
            Building Knowledge.
            <br />
            Shaping Futures.
          </h1>

          <p className="hero-description">
            At AIMS Academy, we are committed to providing
            quality education in a supportive and engaging
            environment where students can build strong
            foundations, develop confidence, and prepare
            for a successful future.
          </p>

          <div className="hero-buttons">

            <a
              href="/courses"
              className="primary-button"
            >
              Explore Courses
            </a>

            <a
              href="/contact"
              className="secondary-button"
            >
              Contact Us
            </a>

          </div>

        </div>


        {/* Academy Visual */}

        <div className="hero-image-container">

          <div className="hero-image-content">

            <img
              src={logo}
              alt="AIMS Academy Logo"
              className="hero-logo"
            />

            <p>
              Excellence in Education
            </p>

          </div>

        </div>

      </section>


      {/* ================================
          ABOUT SECTION
      ================================= */}

      <section className="about-preview">

        <p className="section-label">
          ABOUT AIMS ACADEMY
        </p>

        <h2>
          Education that builds knowledge,
          confidence, and a brighter future.
        </h2>

        <p>
          AIMS Academy is dedicated to providing quality
          education in a supportive and disciplined learning
          environment. From junior classes to senior programs,
          we focus on developing strong academic foundations
          and helping students reach their full potential.
        </p>

        <a
          href="/about"
          className="primary-button"
        >
          Learn More About Us
        </a>

      </section>


      {/* ================================
          ACADEMIC PROGRAMS
      ================================= */}

      <section className="academic-section">

        <div className="section-heading">

          <p className="section-label">
            ACADEMIC PROGRAMS
          </p>

          <h2>
            Learning designed for every stage.
          </h2>

        </div>


        <div className="academic-cards">

          {/* Juniors */}

          <div className="academic-card">

            <span className="card-number">
              01
            </span>

            <h3>
              Juniors
            </h3>

            <p>
              Classes 1 to 8 with a carefully structured
              curriculum focused on building strong academic
              foundations, essential skills, and confidence.
            </p>

            <a href="/courses">
              Explore Junior Classes →
            </a>

          </div>


          {/* Seniors */}

          <div className="academic-card">

            <span className="card-number">
              02
            </span>

            <h3>
              Seniors
            </h3>

            <p>
              Pre-9 to Class 12 with comprehensive academic
              programs and specialized streams including
              Medical, Pre-Engineering, ICS, and I.Com.
            </p>

            <a href="/courses">
              Explore Senior Classes →
            </a>

          </div>

        </div>

      </section>


      {/* ================================
          WHY AIMS ACADEMY
      ================================= */}

      <section className="why-section">

        <div>

          <p className="section-label">
            WHY AIMS ACADEMY
          </p>

          <h2>
            A place where students can learn and grow.
          </h2>

          <p>
            We believe education is more than just
            completing a syllabus. Our approach focuses
            on academic excellence, personal development,
            and creating a positive learning environment.
          </p>

        </div>


        <div className="why-content">

          {/* Quality Education */}

          <div className="why-item">

            <span className="card-number">
              01
            </span>

            <h3>
              Quality Education
            </h3>

            <p>
              Focused academic learning with a strong
              foundation across all subjects and programs.
            </p>

          </div>


          {/* Dedicated Teachers */}

          <div className="why-item">

            <span className="card-number">
              02
            </span>

            <h3>
              Dedicated Teachers
            </h3>

            <p>
              Committed educators who guide students,
              explain concepts clearly, and encourage
              continuous improvement.
            </p>

          </div>


          {/* Student Development */}

          <div className="why-item">

            <span className="card-number">
              03
            </span>

            <h3>
              Student Development
            </h3>

            <p>
              Encouraging students to develop confidence,
              discipline, critical thinking, and
              problem-solving abilities.
            </p>

          </div>


          {/* Supportive Environment */}

          <div className="why-item">

            <span className="card-number">
              04
            </span>

            <h3>
              Supportive Environment
            </h3>

            <p>
              A positive and disciplined learning
              environment where students can focus,
              participate, and achieve their goals.
            </p>

          </div>

        </div>

      </section>


      {/* ================================
    FINAL ADMISSION CTA
================================= */}

<section className="home-cta">

<p className="section-label">
  READY TO START?
</p>

<h2>
  Begin Your Journey With AIMS Academy.
</h2>

<p>
  Give your child the right environment to learn,
  grow, and prepare for a successful future.
</p>

<div className="hero-buttons">

  <a
    href="/courses"
    className="primary-button"
  >
    Explore Courses
  </a>

  <a
    href="/contact"
    className="secondary-button"
  >
    Contact Us
  </a>

</div>

</section>

    </main>
  );
}

export default Home;
