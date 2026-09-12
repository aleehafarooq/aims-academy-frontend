import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  X,
  Clock3,
  Users,
  Save,
  RotateCcw,
  Search,
  BarChart3,
} from "lucide-react";

const API_BASE_URL = "https://aims-academy-backend-production-a580.up.railway.app/api";

function Attendance() {
  /* =================================
     STUDENTS
  ================================= */

  const [students, setStudents] = useState([]);

  /* =================================
     CLASS OPTIONS
  ================================= */

  const juniorClasses = [
    "Class 1",
    "Class 2",
    "Class 3",
    "Class 4",
    "Class 5",
    "Class 6",
    "Class 7",
    "Class 8",
  ];

  const seniorClasses = [
    "Pre-9",
    "9th",
    "10th",
    "11th",
    "12th",
  ];

  const allClasses = [...juniorClasses, ...seniorClasses];

  /* =================================
     DATE HELPERS
  ================================= */

  const getToday = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const getCurrentMonth = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");

    return `${year}-${month}`;
  };

  /* =================================
     PAGE STATES
  ================================= */

  const [selectedDate, setSelectedDate] = useState(getToday());
  const [selectedClass, setSelectedClass] = useState("");
  const [attendance, setAttendance] = useState({});
  const [savedMessage, setSavedMessage] = useState("");

  /* =================================
     MONTHLY REPORT STATES
  ================================= */

  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [monthlyAttendanceData, setMonthlyAttendanceData] = useState({});

  /* =================================
     AUTH HELPER
  ================================= */

  const getToken = () => localStorage.getItem("adminToken");

  /* =================================
     LOAD STUDENTS FROM MONGODB
  ================================= */

  useEffect(() => {
    const controller = new AbortController();

    const fetchStudents = async () => {
      try {
        const token = getToken();

        const response = await fetch(`${API_BASE_URL}/students`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load students.");
        }

        setStudents(Array.isArray(data.students) ? data.students : []);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to load students:", error);
          setStudents([]);
        }
      }
    };

    fetchStudents();

    return () => controller.abort();
  }, []);

  /* =================================
     ACTIVE STUDENTS
  ================================= */

  const activeStudents = useMemo(() => {
    return students.filter(
      (student) => student.status !== "Inactive"
    );
  }, [students]);

  /* =================================
     STUDENTS FOR SELECTED CLASS
  ================================= */

  const classStudents = useMemo(() => {
    if (!selectedClass) {
      return [];
    }

    return activeStudents.filter(
      (student) => student.className === selectedClass
    );
  }, [activeStudents, selectedClass]);

  /* =================================
     LOAD DAILY ATTENDANCE FROM MONGODB
  ================================= */

  useEffect(() => {
    if (!selectedDate || !selectedClass) {
      setAttendance({});
      setSavedMessage("");
      return;
    }

    const controller = new AbortController();

    const fetchDailyAttendance = async () => {
      try {
        const token = getToken();
        const params = new URLSearchParams({
          date: selectedDate,
          className: selectedClass,
        });

        const response = await fetch(
          `${API_BASE_URL}/attendance?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load attendance.");
        }

        if (data.attendance && Array.isArray(data.attendance.records)) {
          const savedAttendance = {};

          data.attendance.records.forEach((record) => {
            if (record.studentId && record.status) {
              savedAttendance[record.studentId] = record.status;
            }
          });

          setAttendance(savedAttendance);
        } else {
          const defaultAttendance = {};

          classStudents.forEach((student) => {
            if (student.studentId) {
              defaultAttendance[student.studentId] = "Present";
            }
          });

          setAttendance(defaultAttendance);
        }

        setSavedMessage("");
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to load daily attendance:", error);
          setAttendance({});
        }
      }
    };

    fetchDailyAttendance();

    return () => controller.abort();
  }, [selectedDate, selectedClass, classStudents]);

  /* =================================
     UPDATE ATTENDANCE
  ================================= */

  const updateAttendance = (studentId, status) => {
    setAttendance((previous) => ({
      ...previous,
      [studentId]: status,
    }));

    setSavedMessage("");
  };

  /* =================================
     MARK ALL STUDENTS
  ================================= */

  const markAll = (status) => {
    const updatedAttendance = {};

    classStudents.forEach((student) => {
      if (student.studentId) {
        updatedAttendance[student.studentId] = status;
      }
    });

    setAttendance(updatedAttendance);
    setSavedMessage("");
  };

  /* =================================
     SAVE ATTENDANCE TO MONGODB
  ================================= */

  const saveAttendance = async () => {
    if (
      !selectedDate ||
      !selectedClass ||
      classStudents.length === 0
    ) {
      return;
    }

    try {
      const token = getToken();

      const records = classStudents
        .filter((student) => student.studentId)
        .map((student) => ({
          studentId: student.studentId,
          status: attendance[student.studentId] || "Present",
        }));

      const response = await fetch(`${API_BASE_URL}/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: selectedDate,
          className: selectedClass,
          records,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to save attendance.");
      }

      setSavedMessage("Attendance saved successfully.");

      setTimeout(() => {
        setSavedMessage("");
      }, 3000);

      if (selectedStudent && selectedMonth) {
        const savedMonth = selectedDate.slice(0, 7);

        if (
          selectedStudent.className === selectedClass &&
          selectedMonth === savedMonth
        ) {
          setMonthlyAttendanceData((previous) => ({
            ...previous,
            [selectedDate]:
              attendance[selectedStudent.studentId] || "Present",
          }));
        }
      }
    } catch (error) {
      console.error("Failed to save attendance:", error);
      setSavedMessage("Unable to save attendance.");
    }
  };

  /* =================================
     RESET ATTENDANCE
  ================================= */

  const resetAttendance = () => {
    if (classStudents.length === 0) {
      return;
    }

    const defaultAttendance = {};

    classStudents.forEach((student) => {
      if (student.studentId) {
        defaultAttendance[student.studentId] = "Present";
      }
    });

    setAttendance(defaultAttendance);
    setSavedMessage("");
  };

  /* =================================
     DAILY STATISTICS
  ================================= */

  const totalStudents = classStudents.length;

  const presentStudents = classStudents.filter(
    (student) => attendance[student.studentId] === "Present"
  );

  const absentStudents = classStudents.filter(
    (student) => attendance[student.studentId] === "Absent"
  );

  const leaveStudents = classStudents.filter(
    (student) => attendance[student.studentId] === "Leave"
  );

  const presentCount = presentStudents.length;
  const absentCount = absentStudents.length;
  const leaveCount = leaveStudents.length;

  /* =================================
     ATTENDANCE PERCENTAGE
  ================================= */

  const attendancePercentage =
    totalStudents > 0
      ? Math.round((presentCount / totalStudents) * 100)
      : 0;

  /* =================================
     MONTHLY SEARCH RESULTS
  ================================= */

  const matchingStudents = useMemo(() => {
    const search = studentSearch.trim().toLowerCase();

    if (!search) {
      return [];
    }

    return activeStudents.filter((student) => {
      const name = String(student.name || "").toLowerCase();
      const studentId = String(student.studentId || "").toLowerCase();

      return name.includes(search) || studentId.includes(search);
    });
  }, [studentSearch, activeStudents]);

  /* =================================
     SELECTED STUDENT
  ================================= */

  const selectedStudent = useMemo(() => {
    return (
      activeStudents.find(
        (student) => student.studentId === selectedStudentId
      ) || null
    );
  }, [activeStudents, selectedStudentId]);

  /* =================================
     GET DAYS IN MONTH
  ================================= */

  const getDaysInMonth = (monthValue) => {
    if (!monthValue) {
      return [];
    }

    const [year, month] = monthValue.split("-").map(Number);

    if (!year || !month) {
      return [];
    }

    const numberOfDays = new Date(year, month, 0).getDate();
    const days = [];

    for (let day = 1; day <= numberOfDays; day++) {
      const date = `${year}-${String(month).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;

      days.push(date);
    }

    return days;
  };

  /* =================================
     LOAD MONTHLY ATTENDANCE FROM MONGODB
  ================================= */

  useEffect(() => {
    if (!selectedStudent || !selectedMonth) {
      setMonthlyAttendanceData({});
      return;
    }

    const controller = new AbortController();

    const fetchMonthlyAttendance = async () => {
      try {
        const token = getToken();
        const params = new URLSearchParams({
          studentId: selectedStudent.studentId,
          month: selectedMonth,
        });

        const response = await fetch(
          `${API_BASE_URL}/attendance/monthly?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load monthly attendance."
          );
        }

        setMonthlyAttendanceData(
          data.attendance && typeof data.attendance === "object"
            ? data.attendance
            : {}
        );
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to load monthly attendance:", error);
          setMonthlyAttendanceData({});
        }
      }
    };

    fetchMonthlyAttendance();

    return () => controller.abort();
  }, [selectedStudent, selectedMonth]);

  /* =================================
     MONTHLY ATTENDANCE
  ================================= */

  const monthlyAttendance = useMemo(() => {
    if (!selectedStudent || !selectedMonth) {
      return [];
    }

    const days = getDaysInMonth(selectedMonth);

    return days.map((date) => ({
      date,
      status: monthlyAttendanceData[date] || null,
    }));
  }, [selectedStudent, selectedMonth, monthlyAttendanceData]);

  /* =================================
     MONTHLY STATISTICS
  ================================= */

  const markedMonthlyAttendance = monthlyAttendance.filter(
    (record) => record.status
  );

  const monthlyPresent = monthlyAttendance.filter(
    (record) => record.status === "Present"
  ).length;

  const monthlyAbsent = monthlyAttendance.filter(
    (record) => record.status === "Absent"
  ).length;

  const monthlyLeave = monthlyAttendance.filter(
    (record) => record.status === "Leave"
  ).length;

  const monthlyMarkedDays = markedMonthlyAttendance.length;

  const monthlyPercentage =
    monthlyMarkedDays > 0
      ? Math.round((monthlyPresent / monthlyMarkedDays) * 100)
      : 0;

  /* =================================
     FORMAT DATE
  ================================= */

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "";
    }

    return new Date(`${dateValue}T00:00:00`).toLocaleDateString(
      "en-PK",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  /* =================================
     FORMAT DAY
  ================================= */

  const formatDay = (dateValue) => {
    if (!dateValue) {
      return "";
    }

    return new Date(`${dateValue}T00:00:00`).toLocaleDateString(
      "en-PK",
      {
        weekday: "long",
      }
    );
  };

  /* =================================
     RENDER
  ================================= */

  return (
    <section className="attendance-page">
      {/* =================================
          PAGE HEADER
      ================================= */}

      <div className="attendance-header">
        <div>
          <p className="section-label">
            ATTENDANCE MANAGEMENT
          </p>

          <h1>Attendance</h1>

          <p className="attendance-description">
            Record daily attendance and view detailed student
            attendance reports.
          </p>
        </div>
      </div>

      {/* =================================
          DAILY ATTENDANCE
      ================================= */}

      <div className="attendance-section-title">
        <div>
          <p className="section-label">DAILY ATTENDANCE</p>

          <h2>Record Attendance</h2>
        </div>
      </div>

      {/* =================================
          FILTER SECTION
      ================================= */}

      <div className="attendance-controls">
        <div className="attendance-control-field">
          <label>
            <CalendarDays size={16} />
            Attendance Date
          </label>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="attendance-control-field">
          <label>
            <Users size={16} />
            Select Class
          </label>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Select Class</option>

            {allClasses.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* =================================
          NO CLASS SELECTED
      ================================= */}

      {!selectedClass && (
        <div className="attendance-empty">
          <div className="attendance-empty-icon">
            <CalendarDays size={34} />
          </div>

          <h2>Select a class to begin</h2>

          <p>
            Choose a date and class above to view students and
            record attendance.
          </p>
        </div>
      )}

      {/* =================================
          CLASS SELECTED
      ================================= */}

      {selectedClass && (
        <>
          {/* =================================
              DAILY STATISTICS
          ================================= */}

          <div className="attendance-stats">
            <div className="attendance-stat-card">
              <div className="attendance-stat-icon">
                <Users size={20} />
              </div>

              <div>
                <p>Total Students</p>
                <h3>{totalStudents}</h3>
              </div>
            </div>

            <div className="attendance-stat-card">
              <div className="attendance-stat-icon">
                <Check size={20} />
              </div>

              <div>
                <p>Present</p>
                <h3>{presentCount}</h3>
              </div>
            </div>

            <div className="attendance-stat-card">
              <div className="attendance-stat-icon">
                <X size={20} />
              </div>

              <div>
                <p>Absent</p>
                <h3>{absentCount}</h3>
              </div>
            </div>

            <div className="attendance-stat-card">
              <div className="attendance-stat-icon">
                <Clock3 size={20} />
              </div>

              <div>
                <p>Leave</p>
                <h3>{leaveCount}</h3>
              </div>
            </div>
          </div>

          {/* =================================
              DAILY ATTENDANCE TABLE
          ================================= */}

          <div className="attendance-table-section">
            <div className="attendance-table-header">
              <div>
                <h2>{selectedClass} Attendance</h2>

                <p>{formatDate(selectedDate)}</p>
              </div>

              {classStudents.length > 0 && (
                <div className="attendance-quick-actions">
                  <button
                    type="button"
                    onClick={() => markAll("Present")}
                  >
                    <Check size={16} />
                    All Present
                  </button>

                  <button
                    type="button"
                    onClick={() => markAll("Absent")}
                  >
                    <X size={16} />
                    All Absent
                  </button>

                  <button
                    type="button"
                    onClick={resetAttendance}
                  >
                    <RotateCcw size={16} />
                    Reset
                  </button>
                </div>
              )}
            </div>

            {classStudents.length === 0 ? (
              <div className="attendance-no-students">
                <Users size={40} />

                <h3>No Students Found</h3>

                <p>
                  There are no active students registered in{" "}
                  {selectedClass}.
                </p>
              </div>
            ) : (
              <>
                <div className="attendance-table-wrapper">
                  <table className="attendance-table">
                    <thead>
                      <tr>
                        <th>Student ID</th>
                        <th>Student Name</th>
                        <th>Father's Name</th>
                        <th>Attendance</th>
                      </tr>
                    </thead>

                    <tbody>
                      {classStudents.map((student) => {
                        const status =
                          attendance[student.studentId] || "Present";

                        return (
                          <tr key={student.studentId}>
                            <td>
                              <strong>
                                {student.studentId}
                              </strong>
                            </td>

                            <td>{student.name}</td>

                            <td>{student.fatherName || "—"}</td>

                            <td>
                              <div className="attendance-status-buttons">
                                <button
                                  type="button"
                                  className={
                                    status === "Present"
                                      ? "attendance-status-button present active"
                                      : "attendance-status-button present"
                                  }
                                  onClick={() =>
                                    updateAttendance(
                                      student.studentId,
                                      "Present"
                                    )
                                  }
                                >
                                  <Check size={15} />
                                  Present
                                </button>

                                <button
                                  type="button"
                                  className={
                                    status === "Absent"
                                      ? "attendance-status-button absent active"
                                      : "attendance-status-button absent"
                                  }
                                  onClick={() =>
                                    updateAttendance(
                                      student.studentId,
                                      "Absent"
                                    )
                                  }
                                >
                                  <X size={15} />
                                  Absent
                                </button>

                                <button
                                  type="button"
                                  className={
                                    status === "Leave"
                                      ? "attendance-status-button leave active"
                                      : "attendance-status-button leave"
                                  }
                                  onClick={() =>
                                    updateAttendance(
                                      student.studentId,
                                      "Leave"
                                    )
                                  }
                                >
                                  <Clock3 size={15} />
                                  Leave
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* =================================
                    FOOTER
                ================================= */}

                <div className="attendance-footer">
                  <div className="attendance-summary">
                    <strong>Attendance:</strong>

                    <span>{attendancePercentage}%</span>

                    <small>
                      {presentCount} of {totalStudents} students
                      present
                    </small>
                  </div>

                  <div className="attendance-footer-actions">
                    {savedMessage && (
                      <span className="attendance-saved-message">
                        ✓ {savedMessage}
                      </span>
                    )}

                    <button
                      type="button"
                      className="attendance-save-button"
                      onClick={saveAttendance}
                    >
                      <Save size={17} />
                      Save Attendance
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* =================================
              DAILY PRESENT / ABSENT / LEAVE
          ================================= */}

          {classStudents.length > 0 && (
            <div className="attendance-report-grid">
              {/* PRESENT */}

              <div className="attendance-report-card">
                <div className="attendance-report-card-header">
                  <div>
                    <p className="section-label">PRESENT</p>

                    <h3>Present Students</h3>
                  </div>

                  <span className="attendance-report-count">
                    {presentCount}
                  </span>
                </div>

                <div className="attendance-report-list">
                  {presentStudents.length === 0 ? (
                    <p className="attendance-report-empty">
                      No students marked present.
                    </p>
                  ) : (
                    presentStudents.map((student) => (
                      <div
                        className="attendance-report-student"
                        key={student.studentId}
                      >
                        <div>
                          <strong>{student.name}</strong>

                          <small>{student.studentId}</small>
                        </div>

                        <span className="attendance-report-status present">
                          <Check size={14} />
                          Present
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* ABSENT */}

              <div className="attendance-report-card">
                <div className="attendance-report-card-header">
                  <div>
                    <p className="section-label">ABSENT</p>

                    <h3>Absent Students</h3>
                  </div>

                  <span className="attendance-report-count">
                    {absentCount}
                  </span>
                </div>

                <div className="attendance-report-list">
                  {absentStudents.length === 0 ? (
                    <p className="attendance-report-empty">
                      No students marked absent.
                    </p>
                  ) : (
                    absentStudents.map((student) => (
                      <div
                        className="attendance-report-student"
                        key={student.studentId}
                      >
                        <div>
                          <strong>{student.name}</strong>

                          <small>{student.studentId}</small>
                        </div>

                        <span className="attendance-report-status absent">
                          <X size={14} />
                          Absent
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* LEAVE */}

              <div className="attendance-report-card">
                <div className="attendance-report-card-header">
                  <div>
                    <p className="section-label">LEAVE</p>

                    <h3>Leave Students</h3>
                  </div>

                  <span className="attendance-report-count">
                    {leaveCount}
                  </span>
                </div>

                <div className="attendance-report-list">
                  {leaveStudents.length === 0 ? (
                    <p className="attendance-report-empty">
                      No students marked on leave.
                    </p>
                  ) : (
                    leaveStudents.map((student) => (
                      <div
                        className="attendance-report-student"
                        key={student.studentId}
                      >
                        <div>
                          <strong>{student.name}</strong>

                          <small>{student.studentId}</small>
                        </div>

                        <span className="attendance-report-status leave">
                          <Clock3 size={14} />
                          Leave
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* =================================
          MONTHLY ATTENDANCE REPORT
      ================================= */}

      <div className="attendance-monthly-section">
        <div className="attendance-section-title">
          <div>
            <p className="section-label">ATTENDANCE REPORT</p>

            <h2>Student Monthly Attendance</h2>

            <p className="attendance-description">
              Search for a student to view their complete attendance
              record for a selected month.
            </p>
          </div>
        </div>

        {/* =================================
            MONTHLY CONTROLS
        ================================= */}

        <div className="attendance-monthly-controls">
          <div className="attendance-control-field">
            <label>
              <Search size={16} />
              Search Student
            </label>

            <input
              type="text"
              value={studentSearch}
              onChange={(e) => {
                setStudentSearch(e.target.value);
                setSelectedStudentId("");
              }}
              placeholder="Search by name or Student ID"
            />

            {studentSearch.trim() &&
              matchingStudents.length > 0 &&
              !selectedStudent && (
                <div className="attendance-search-results">
                  {matchingStudents.slice(0, 8).map((student) => (
                    <button
                      type="button"
                      key={student.studentId}
                      onClick={() => {
                        setSelectedStudentId(student.studentId);
                        setStudentSearch(student.name);
                      }}
                    >
                      <span>
                        <strong>{student.name}</strong>

                        <small>
                          {student.studentId} •{" "}
                          {student.className}
                        </small>
                      </span>
                    </button>
                  ))}
                </div>
              )}
          </div>

          <div className="attendance-control-field">
            <label>
              <CalendarDays size={16} />
              Select Month
            </label>

            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </div>
        </div>

        {/* =================================
            NO STUDENT SELECTED
        ================================= */}

        {!selectedStudent && (
          <div className="attendance-monthly-empty">
            <div className="attendance-empty-icon">
              <BarChart3 size={34} />
            </div>

            <h3>Search for a student</h3>

            <p>
              Search by student name or Student ID to view their
              monthly attendance report.
            </p>
          </div>
        )}

        {/* =================================
            SELECTED STUDENT REPORT
        ================================= */}

        {selectedStudent && (
          <div className="attendance-student-report">
            {/* =================================
                STUDENT INFORMATION
            ================================= */}

            <div className="attendance-student-report-header">
              <div>
                <p className="section-label">
                  STUDENT ATTENDANCE
                </p>

                <h2>{selectedStudent.name}</h2>

                <p>
                  Student ID:{" "}
                  <strong>{selectedStudent.studentId}</strong>
                  {" • "}
                  Class:{" "}
                  <strong>{selectedStudent.className}</strong>
                </p>
              </div>
            </div>

            {/* =================================
                MONTHLY STATISTICS
            ================================= */}

            <div className="attendance-monthly-stats">
              <div className="attendance-stat-card">
                <div className="attendance-stat-icon">
                  <Users size={20} />
                </div>

                <div>
                  <p>Marked Days</p>

                  <h3>{monthlyMarkedDays}</h3>
                </div>
              </div>

              <div className="attendance-stat-card">
                <div className="attendance-stat-icon">
                  <Check size={20} />
                </div>

                <div>
                  <p>Present</p>

                  <h3>{monthlyPresent}</h3>
                </div>
              </div>

              <div className="attendance-stat-card">
                <div className="attendance-stat-icon">
                  <X size={20} />
                </div>

                <div>
                  <p>Absent</p>

                  <h3>{monthlyAbsent}</h3>
                </div>
              </div>

              <div className="attendance-stat-card">
                <div className="attendance-stat-icon">
                  <Clock3 size={20} />
                </div>

                <div>
                  <p>Leave</p>

                  <h3>{monthlyLeave}</h3>
                </div>
              </div>

              <div className="attendance-stat-card">
                <div className="attendance-stat-icon">
                  <BarChart3 size={20} />
                </div>

                <div>
                  <p>Attendance</p>

                  <h3>{monthlyPercentage}%</h3>
                </div>
              </div>
            </div>

            {/* =================================
                MONTHLY HISTORY
            ================================= */}

            <div className="attendance-history-section">
              <div className="attendance-table-header">
                <div>
                  <h2>Attendance History</h2>

                  <p>
                    {new Date(
                      `${selectedMonth}-01T00:00:00`
                    ).toLocaleDateString("en-PK", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="attendance-table-wrapper">
                <table className="attendance-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Day</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {monthlyAttendance.map((record) => (
                      <tr key={record.date}>
                        <td>{formatDate(record.date)}</td>

                        <td>{formatDay(record.date)}</td>

                        <td>
                          {!record.status && (
                            <span className="attendance-history-status unmarked">
                              Not Marked
                            </span>
                          )}

                          {record.status === "Present" && (
                            <span className="attendance-history-status present">
                              <Check size={15} />
                              Present
                            </span>
                          )}

                          {record.status === "Absent" && (
                            <span className="attendance-history-status absent">
                              <X size={15} />
                              Absent
                            </span>
                          )}

                          {record.status === "Leave" && (
                            <span className="attendance-history-status leave">
                              <Clock3 size={15} />
                              Leave
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Attendance;
