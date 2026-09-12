import { useState } from "react";
import {
  BookOpen,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Users,
  FlaskConical,
  Calculator,
  Monitor,
  Languages,
  Globe,
  BookMarked,
  Atom,
  BarChart3,
} from "lucide-react";

function Courses() {
  /* =================================
     COURSE DATA
  ================================= */

  const juniorCourses = [
    {
      className: "Class 1",
      subjects: [
        "English",
        "Urdu",
        "Science",
        "Maths",
        "History",
        "Islamiyat",
        "Geography",
        "Computer",
      ],
    },
    {
      className: "Class 2",
      subjects: [
        "English",
        "Urdu",
        "Science",
        "Maths",
        "History",
        "Islamiyat",
        "Geography",
        "Computer",
      ],
    },
    {
      className: "Class 3",
      subjects: [
        "English",
        "Urdu",
        "Science",
        "Maths",
        "History",
        "Islamiyat",
        "Geography",
        "Computer",
      ],
    },
    {
      className: "Class 4",
      subjects: [
        "English",
        "Urdu",
        "Science",
        "Maths",
        "History",
        "Islamiyat",
        "Geography",
        "Computer",
      ],
    },
    {
      className: "Class 5",
      subjects: [
        "English",
        "Urdu",
        "Science",
        "Maths",
        "History",
        "Islamiyat",
        "Geography",
        "Computer",
      ],
    },
    {
      className: "Class 6",
      subjects: [
        "English",
        "Urdu",
        "Science",
        "Maths",
        "History",
        "Islamiyat",
        "Geography",
        "Computer",
      ],
    },
    {
      className: "Class 7",
      subjects: [
        "English",
        "Urdu",
        "Science",
        "Maths",
        "History",
        "Islamiyat",
        "Geography",
        "Computer",
      ],
    },
    {
      className: "Class 8",
      subjects: [
        "English",
        "Urdu",
        "Science",
        "Maths",
        "History",
        "Islamiyat",
        "Geography",
        "Computer",
      ],
    },
  ];

  const basicSeniorCourses = [
    {
      className: "Pre-9",
      subjects: [
        "Maths",
        "English",
        "Urdu",
        "Islamiyat",
        "Al-Quran",
        "Physics",
        "Chemistry",
        "Biology",
        "Computer",
      ],
      note: "Computer or Biology may be selected as the optional subject.",
    },
    {
      className: "9th",
      subjects: [
        "Maths",
        "English",
        "Urdu",
        "Islamiyat",
        "Al-Quran",
        "Physics",
        "Chemistry",
        "Biology",
        "Computer",
      ],
      note: "Computer or Biology may be selected as the optional subject.",
    },
    {
      className: "10th",
      subjects: [
        "Maths",
        "English",
        "Urdu",
        "Islamiyat",
        "Al-Quran",
        "Physics",
        "Chemistry",
        "Biology",
        "Computer",
      ],
      note: "Computer or Biology may be selected as the optional subject.",
    },
  ];

  const seniorStreams = [
    {
      className: "11th",
      streams: [
        {
          name: "Medical",
          subjects: [
            "English",
            "Urdu",
            "Islamiyat",
            "Al-Quran",
            "Biology",
            "Chemistry",
            "Physics",
          ],
        },
        {
          name: "Pre-Engineering",
          subjects: [
            "English",
            "Urdu",
            "Islamiyat",
            "Al-Quran",
            "Physics",
            "Chemistry",
            "Maths",
          ],
        },
        {
          name: "ICS",
          groups: [
            {
              name: "Computer Science, Mathematics, Physics",
              subjects: [
                "English",
                "Urdu",
                "Islamiyat",
                "Al-Quran",
                "Computer Science",
                "Mathematics",
                "Physics",
              ],
            },
            {
              name: "Computer Science, Mathematics, Statistics",
              subjects: [
                "English",
                "Urdu",
                "Islamiyat",
                "Al-Quran",
                "Computer Science",
                "Mathematics",
                "Statistics",
              ],
            },
            {
              name: "Computer Science, Economics",
              subjects: [
                "English",
                "Urdu",
                "Islamiyat",
                "Al-Quran",
                "Computer Science",
                "Economics",
              ],
            },
          ],
        },
      ],
    },
    {
      className: "12th",
      streams: [
        {
          name: "Medical",
          subjects: [
            "English",
            "Urdu",
            "Islamiyat",
            "Al-Quran",
            "Biology",
            "Chemistry",
            "Physics",
          ],
        },
        {
          name: "Pre-Engineering",
          subjects: [
            "English",
            "Urdu",
            "Islamiyat",
            "Al-Quran",
            "Physics",
            "Chemistry",
            "Maths",
          ],
        },
        {
          name: "ICS",
          groups: [
            {
              name: "Computer Science, Mathematics, Physics",
              subjects: [
                "English",
                "Urdu",
                "Islamiyat",
                "Al-Quran",
                "Computer Science",
                "Mathematics",
                "Physics",
              ],
            },
            {
              name: "Computer Science, Mathematics, Statistics",
              subjects: [
                "English",
                "Urdu",
                "Islamiyat",
                "Al-Quran",
                "Computer Science",
                "Mathematics",
                "Statistics",
              ],
            },
            {
              name: "Computer Science, Economics",
              subjects: [
                "English",
                "Urdu",
                "Islamiyat",
                "Al-Quran",
                "Computer Science",
                "Economics",
              ],
            },
          ],
        },
      ],
    },
  ];

  /* =================================
     PAGE STATES
  ================================= */

  const [activeSection, setActiveSection] =
    useState("Junior");

  const [expandedClass, setExpandedClass] =
    useState(null);

  const [expandedStream, setExpandedStream] =
    useState(null);

  const [expandedGroup, setExpandedGroup] =
    useState(null);

  /* =================================
     ICON HELPER
  ================================= */

  const getSubjectIcon = (subject) => {
    const subjectLower = subject.toLowerCase();

    if (subjectLower.includes("math")) {
      return <Calculator size={16} />;
    }

    if (
      subjectLower.includes("science") ||
      subjectLower.includes("physics") ||
      subjectLower.includes("chemistry") ||
      subjectLower.includes("biology")
    ) {
      return <FlaskConical size={16} />;
    }

    if (
      subjectLower.includes("computer") ||
      subjectLower.includes("statistics")
    ) {
      return <Monitor size={16} />;
    }

    if (
      subjectLower.includes("english") ||
      subjectLower.includes("urdu")
    ) {
      return <Languages size={16} />;
    }

    if (
      subjectLower.includes("history") ||
      subjectLower.includes("islamiyat") ||
      subjectLower.includes("quran")
    ) {
      return <BookMarked size={16} />;
    }

    if (subjectLower.includes("geography")) {
      return <Globe size={16} />;
    }

    if (subjectLower.includes("economics")) {
      return <BarChart3 size={16} />;
    }

    return <BookOpen size={16} />;
  };

  /* =================================
     TOGGLE CLASS
  ================================= */

  const toggleClass = (className) => {
    setExpandedClass(
      expandedClass === className
        ? null
        : className
    );
  };

  /* =================================
     TOGGLE STREAM
  ================================= */

  const toggleStream = (key) => {
    setExpandedStream(
      expandedStream === key
        ? null
        : key
    );
  };

  /* =================================
     TOGGLE GROUP
  ================================= */

  const toggleGroup = (key) => {
    setExpandedGroup(
      expandedGroup === key
        ? null
        : key
    );
  };

  /* =================================
     SUBJECT LIST
  ================================= */

  const SubjectList = ({ subjects }) => {
    return (
      <div className="courses-subject-grid">
        {subjects.map((subject) => (
          <div
            className="courses-subject-card"
            key={subject}
          >
            <div className="courses-subject-icon">
              {getSubjectIcon(subject)}
            </div>

            <span>{subject}</span>
          </div>
        ))}
      </div>
    );
  };

  /* =================================
     RENDER
  ================================= */

  return (
    <section className="courses-page">

      {/* =================================
          PAGE HEADER
      ================================= */}

      <div className="courses-header">

        <div>
          <p className="section-label">
            ACADEMIC MANAGEMENT
          </p>

          <h1>
            Courses
          </h1>

          <p className="courses-description">
            Manage classes, subjects, streams,
            and academic groups for AIMS Academy.
          </p>
        </div>

        <div className="courses-header-icon">
          <GraduationCap size={28} />
        </div>

      </div>

      {/* =================================
          OVERVIEW
      ================================= */}

      <div className="courses-stats">

        <div className="courses-stat-card">

          <div className="courses-stat-icon">
            <Users size={20} />
          </div>

          <div>
            <p>Junior Classes</p>
            <h3>8</h3>
          </div>

        </div>

        <div className="courses-stat-card">

          <div className="courses-stat-icon">
            <GraduationCap size={20} />
          </div>

          <div>
            <p>Senior Classes</p>
            <h3>5</h3>
          </div>

        </div>

        <div className="courses-stat-card">

          <div className="courses-stat-icon">
            <BookOpen size={20} />
          </div>

          <div>
            <p>Junior Subjects</p>
            <h3>8</h3>
          </div>

        </div>

        <div className="courses-stat-card">

          <div className="courses-stat-icon">
            <Atom size={20} />
          </div>

          <div>
            <p>Senior Streams</p>
            <h3>3</h3>
          </div>

        </div>

      </div>

      {/* =================================
          SECTION TABS
      ================================= */}

      <div className="courses-tabs">

        <button
          type="button"
          className={
            activeSection === "Junior"
              ? "courses-tab active"
              : "courses-tab"
          }
          onClick={() =>
            setActiveSection("Junior")
          }
        >
          <Users size={17} />
          Junior
        </button>

        <button
          type="button"
          className={
            activeSection === "Senior"
              ? "courses-tab active"
              : "courses-tab"
          }
          onClick={() =>
            setActiveSection("Senior")
          }
        >
          <GraduationCap size={17} />
          Senior
        </button>

      </div>

      {/* =================================
          JUNIOR SECTION
      ================================= */}

      {activeSection === "Junior" && (

        <div className="courses-content">

          <div className="courses-section-heading">

            <div>
              <p className="section-label">
                JUNIOR SECTION
              </p>

              <h2>
                Classes 1–8
              </h2>

              <p>
                Core subjects offered to junior
                students.
              </p>
            </div>

          </div>

          <div className="courses-class-list">

            {juniorCourses.map((course) => {

              const isExpanded =
                expandedClass ===
                course.className;

              return (
                <div
                  className={
                    isExpanded
                      ? "courses-class-card expanded"
                      : "courses-class-card"
                  }
                  key={course.className}
                >

                  <button
                    type="button"
                    className="courses-class-header"
                    onClick={() =>
                      toggleClass(
                        course.className
                      )
                    }
                  >

                    <div className="courses-class-title">

                      <div className="courses-class-icon">
                        <GraduationCap
                          size={19}
                        />
                      </div>

                      <div>
                        <strong>
                          {course.className}
                        </strong>

                        <span>
                          {course.subjects.length}{" "}
                          subjects
                        </span>
                      </div>

                    </div>

                    {isExpanded ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}

                  </button>

                  {isExpanded && (

                    <div className="courses-class-body">

                      <SubjectList
                        subjects={
                          course.subjects
                        }
                      />

                    </div>

                  )}

                </div>
              );
            })}

          </div>

        </div>

      )}

      {/* =================================
          SENIOR SECTION
      ================================= */}

      {activeSection === "Senior" && (

        <div className="courses-content">

          <div className="courses-section-heading">

            <div>
              <p className="section-label">
                SENIOR SECTION
              </p>

              <h2>
                Senior Classes
              </h2>

              <p>
                Secondary and higher secondary
                academic programs.
              </p>
            </div>

          </div>

          {/* =================================
              PRE-9 / 9TH / 10TH
          ================================= */}

          <div className="courses-subsection">

            <div className="courses-subsection-header">

              <div>

                <h3>
                  Pre-9, 9th & 10th
                </h3>

                <p>
                  General senior subjects with
                  optional subject selection.
                </p>

              </div>

            </div>

            <div className="courses-class-list">

              {basicSeniorCourses.map(
                (course) => {

                  const isExpanded =
                    expandedClass ===
                    course.className;

                  return (
                    <div
                      className={
                        isExpanded
                          ? "courses-class-card expanded"
                          : "courses-class-card"
                      }
                      key={course.className}
                    >

                      <button
                        type="button"
                        className="courses-class-header"
                        onClick={() =>
                          toggleClass(
                            course.className
                          )
                        }
                      >

                        <div className="courses-class-title">

                          <div className="courses-class-icon">
                            <GraduationCap
                              size={19}
                            />
                          </div>

                          <div>

                            <strong>
                              {course.className}
                            </strong>

                            <span>
                              {course.subjects.length}{" "}
                              subjects
                            </span>

                          </div>

                        </div>

                        {isExpanded ? (
                          <ChevronUp
                            size={20}
                          />
                        ) : (
                          <ChevronDown
                            size={20}
                          />
                        )}

                      </button>

                      {isExpanded && (

                        <div className="courses-class-body">

                          <SubjectList
                            subjects={
                              course.subjects
                            }
                          />

                          <div className="courses-note">
                            {course.note}
                          </div>

                        </div>

                      )}

                    </div>
                  );
                }
              )}

            </div>

          </div>

          {/* =================================
              11TH / 12TH
          ================================= */}

          <div className="courses-subsection">

            <div className="courses-subsection-header">

              <div>

                <h3>
                  11th & 12th
                </h3>

                <p>
                  Select a stream and academic
                  group for higher secondary students.
                </p>

              </div>

            </div>

            <div className="courses-class-list">

              {seniorStreams.map(
                (course) => {

                  const classKey =
                    course.className;

                  const isExpanded =
                    expandedClass ===
                    classKey;

                  return (
                    <div
                      className={
                        isExpanded
                          ? "courses-class-card expanded"
                          : "courses-class-card"
                      }
                      key={classKey}
                    >

                      <button
                        type="button"
                        className="courses-class-header"
                        onClick={() =>
                          toggleClass(
                            classKey
                          )
                        }
                      >

                        <div className="courses-class-title">

                          <div className="courses-class-icon">
                            <GraduationCap
                              size={19}
                            />
                          </div>

                          <div>

                            <strong>
                              {classKey}
                            </strong>

                            <span>
                              3 streams available
                            </span>

                          </div>

                        </div>

                        {isExpanded ? (
                          <ChevronUp
                            size={20}
                          />
                        ) : (
                          <ChevronDown
                            size={20}
                          />
                        )}

                      </button>

                      {isExpanded && (

                        <div className="courses-class-body">

                          <div className="courses-stream-list">

                            {course.streams.map(
                              (stream) => {

                                const streamKey =
                                  `${classKey}-${stream.name}`;

                                const streamExpanded =
                                  expandedStream ===
                                  streamKey;

                                return (
                                  <div
                                    className="courses-stream-card"
                                    key={
                                      streamKey
                                    }
                                  >

                                    <button
                                      type="button"
                                      className="courses-stream-header"
                                      onClick={() =>
                                        toggleStream(
                                          streamKey
                                        )
                                      }
                                    >

                                      <div>

                                        <strong>
                                          {
                                            stream.name
                                          }
                                        </strong>

                                        <span>
                                          {stream.groups
                                            ? `${stream.groups.length} groups`
                                            : `${stream.subjects.length} subjects`}
                                        </span>

                                      </div>

                                      {streamExpanded ? (
                                        <ChevronUp
                                          size={18}
                                        />
                                      ) : (
                                        <ChevronDown
                                          size={18}
                                        />
                                      )}

                                    </button>

                                    {streamExpanded && (

                                      <div className="courses-stream-body">

                                        {/* NORMAL STREAM */}

                                        {stream.subjects && (

                                          <SubjectList
                                            subjects={
                                              stream.subjects
                                            }
                                          />

                                        )}

                                        {/* ICS GROUPS */}

                                        {stream.groups && (

                                          <div className="courses-group-list">

                                            {stream.groups.map(
                                              (group) => {

                                                const groupKey =
                                                  `${streamKey}-${group.name}`;

                                                const groupExpanded =
                                                  expandedGroup ===
                                                  groupKey;

                                                return (
                                                  <div
                                                    className="courses-group-card"
                                                    key={
                                                      groupKey
                                                    }
                                                  >

                                                    <button
                                                      type="button"
                                                      className="courses-group-header"
                                                      onClick={() =>
                                                        toggleGroup(
                                                          groupKey
                                                        )
                                                      }
                                                    >

                                                      <div>

                                                        <strong>
                                                          {
                                                            group.name
                                                          }
                                                        </strong>

                                                        <span>
                                                          {
                                                            group.subjects
                                                              .length
                                                          }{" "}
                                                          subjects
                                                        </span>

                                                      </div>

                                                      {groupExpanded ? (
                                                        <ChevronUp
                                                          size={17}
                                                        />
                                                      ) : (
                                                        <ChevronDown
                                                          size={17}
                                                        />
                                                      )}

                                                    </button>

                                                    {groupExpanded && (

                                                      <div className="courses-group-body">

                                                        <SubjectList
                                                          subjects={
                                                            group.subjects
                                                          }
                                                        />

                                                      </div>

                                                    )}

                                                  </div>
                                                );
                                              }
                                            )}

                                          </div>

                                        )}

                                      </div>

                                    )}

                                  </div>
                                );
                              }
                            )}

                          </div>

                        </div>

                      )}

                    </div>
                  );
                }
              )}

            </div>

          </div>

        </div>

      )}

    </section>
  );
}

export default Courses;
