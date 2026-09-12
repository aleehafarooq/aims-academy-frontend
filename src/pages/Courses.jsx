import { useState } from "react";

const juniorSubjects = [
  "English",
  "Urdu",
  "Science",
  "Maths",
  "History",
  "Islamiyat",
  "Geography",
  "Computer",
];

const seniorBasicSubjects = [
  "Maths",
  "English",
  "Urdu",
  "Islamiyat",
  "Al-Quran",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer",
];

const class11UniversalSubjects = [
  "English",
  "Urdu",
  "Islamic Studies / Ethics",
  "Al-Quran",
];

const class12UniversalSubjects = [
  "English",
  "Urdu",
  "Pakistan Studies",
  "Al-Quran",
];

const streams = {
  Medical: ["Biology", "Chemistry", "Physics"],

  "Pre-Engineering": [
    "Physics",
    "Chemistry",
    "Maths",
  ],

  ICS: [],

  "I.Com": [],
};

const icomClass11Subjects = [
  "Principles of Accounting",
  "Principles of Economics",
  "Principles of Commerce",
  "Business Mathematics",
];

const icomClass12Subjects = [
  "Principles of Accounting",
  "Principles of Banking / Computer Studies",
  "Commercial Geography",
  "Business Statistics",
];

const icsGroups = [
  [
    "Computer Science",
    "Mathematics",
    "Physics",
  ],
  [
    "Computer Science",
    "Mathematics",
    "Statistics",
  ],
  [
    "Computer Science",
    "Economics",
    "Statistics",
  ],
];

function SubjectList({ subjects }) {
  return (
    <ul className="subject-list">
      {subjects.map((subject) => (
        <li key={subject}>{subject}</li>
      ))}
    </ul>
  );
}

function Courses() {
  const [category, setCategory] = useState("juniors");
  const [selectedClass, setSelectedClass] = useState("1");
  const [selectedStream, setSelectedStream] = useState("Medical");

  const juniorClasses = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
  ];

  const seniorClasses = [
    "Pre-9",
    "9",
    "10",
    "11",
    "12",
  ];

  const isJunior = category === "juniors";
  const isSenior = category === "seniors";

  return (
    <main className="courses-page">

      {/* Header */}
      <section className="courses-header">
        <p className="section-label">
          ACADEMIC PROGRAMS
        </p>

        <h1>Our Courses</h1>

        <p>
          Explore the academic programs offered at
          AIMS Academy from Junior classes to Senior
          classes.
        </p>
      </section>

      {/* Category Selection */}
      <section className="course-category-section">

        <button
          className={`category-card ${
            isJunior ? "active" : ""
          }`}
          onClick={() => {
            setCategory("juniors");
            setSelectedClass("1");
          }}
        >
          <span>01</span>

          <h2>Juniors</h2>

          <p>Classes 1 to 8</p>
        </button>

        <button
          className={`category-card ${
            isSenior ? "active" : ""
          }`}
          onClick={() => {
            setCategory("seniors");
            setSelectedClass("Pre-9");
          }}
        >
          <span>02</span>

          <h2>Seniors</h2>

          <p>Pre-9 to Class 12</p>
        </button>

      </section>

      {/* Classes */}
      <section className="classes-section">

        <div className="classes-header">
          <div>
            <p className="section-label">
              {isJunior
                ? "JUNIOR PROGRAM"
                : "SENIOR PROGRAM"}
            </p>

            <h2>
              Select a Class
            </h2>
          </div>
        </div>

        <div className="class-buttons">
          {(isJunior
            ? juniorClasses
            : seniorClasses
          ).map((className) => (
            <button
              key={className}
              className={
                selectedClass === className
                  ? "class-button active"
                  : "class-button"
              }
              onClick={() =>
                setSelectedClass(className)
              }
            >
              Class {className}
            </button>
          ))}
        </div>

        {/* Subjects */}
        <div className="subjects-container">

          <div className="subjects-heading">
            <p className="section-label">
              CLASS {selectedClass}
            </p>

            <h2>Subjects</h2>
          </div>

          {/* Junior Subjects */}
          {isJunior && (
            <div className="subjects-card">

              <h3>
                Class {selectedClass}
              </h3>

              <SubjectList
                subjects={juniorSubjects}
              />

            </div>
          )}

          {/* Pre-9, 9 and 10 */}
          {isSenior &&
            ["Pre-9", "9", "10"].includes(
              selectedClass
            ) && (
              <div className="subjects-card">

                <h3>
                  Class {selectedClass}
                </h3>

                <SubjectList
                  subjects={seniorBasicSubjects}
                />

                <div className="subject-note">

                  <strong>
                    Optional Subject:
                  </strong>

                  <p>
                    Computer can be selected according
                    to the student's admission choice.
                  </p>

                </div>

              </div>
            )}

          {/* Class 11 */}
          {selectedClass === "11" && (
            <div className="subjects-card">

              <h3>
                Class 11 — Universal Subjects
              </h3>

              <SubjectList
                subjects={class11UniversalSubjects}
              />

              <div className="stream-section">

                <h3>
                  Select Stream
                </h3>

                <div className="stream-buttons">

                  {Object.keys(streams).map(
                    (stream) => (
                      <button
                        key={stream}
                        className={
                          selectedStream === stream
                            ? "stream-button active"
                            : "stream-button"
                        }
                        onClick={() =>
                          setSelectedStream(stream)
                        }
                      >
                        {stream}
                      </button>
                    )
                  )}

                </div>

                {/* I.Com */}
                {selectedStream === "I.Com" && (
                  <div className="stream-subjects">

                    <h4>
                      I.Com — Commerce Subjects
                    </h4>

                    <SubjectList
                      subjects={
                        icomClass11Subjects
                      }
                    />

                  </div>
                )}

                {/* Medical / Pre-Engineering */}
                {selectedStream !== "I.Com" &&
                  selectedStream !== "ICS" && (
                    <div className="stream-subjects">

                      <h4>
                        {selectedStream}
                      </h4>

                      <SubjectList
                        subjects={
                          streams[selectedStream]
                        }
                      />

                    </div>
                  )}

                {/* ICS Groups */}
                {selectedStream === "ICS" && (
                  <div className="ics-groups">

                    <h4>
                      ICS Groups
                    </h4>

                    {icsGroups.map(
                      (group, index) => (
                        <div
                          className="ics-group"
                          key={index}
                        >

                          <strong>
                            Group {index + 1}
                          </strong>

                          <SubjectList
                            subjects={group}
                          />

                        </div>
                      )
                    )}

                  </div>
                )}

              </div>
            </div>
          )}

          {/* Class 12 */}
          {selectedClass === "12" && (
            <div className="subjects-card">

              <h3>
                Class 12 — Universal Subjects
              </h3>

              <SubjectList
                subjects={class12UniversalSubjects}
              />

              <div className="stream-section">

                <h3>
                  Select Stream
                </h3>

                <div className="stream-buttons">

                  {Object.keys(streams).map(
                    (stream) => (
                      <button
                        key={stream}
                        className={
                          selectedStream === stream
                            ? "stream-button active"
                            : "stream-button"
                        }
                        onClick={() =>
                          setSelectedStream(stream)
                        }
                      >
                        {stream}
                      </button>
                    )
                  )}

                </div>

                {/* I.Com */}
                {selectedStream === "I.Com" && (
                  <div className="stream-subjects">

                    <h4>
                      I.Com — Commerce Subjects
                    </h4>

                    <SubjectList
                      subjects={
                        icomClass12Subjects
                      }
                    />

                  </div>
                )}

                {/* Medical / Pre-Engineering */}
                {selectedStream !== "I.Com" &&
                  selectedStream !== "ICS" && (
                    <div className="stream-subjects">

                      <h4>
                        {selectedStream}
                      </h4>

                      <SubjectList
                        subjects={
                          streams[selectedStream]
                        }
                      />

                    </div>
                  )}

                {/* ICS Groups */}
                {selectedStream === "ICS" && (
                  <div className="ics-groups">

                    <h4>
                      ICS Groups
                    </h4>

                    {icsGroups.map(
                      (group, index) => (
                        <div
                          className="ics-group"
                          key={index}
                        >

                          <strong>
                            Group {index + 1}
                          </strong>

                          <SubjectList
                            subjects={group}
                          />

                        </div>
                      )
                    )}

                  </div>
                )}

              </div>
            </div>
          )}

        </div>

      </section>

    </main>
  );
}

export default Courses;
