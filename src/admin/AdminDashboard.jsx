import { useEffect, useState } from "react";
import {
  Users,
  ClipboardCheck,
  CreditCard,
  FileText,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  /* =================================
     API
  ================================= */

  const API_BASE_URL =
    "https://aims-academy-backend-production-a580.up.railway.app/api";

  /* =================================
     DASHBOARD DATA
  ================================= */

  const [totalStudents, setTotalStudents] = useState(0);

  const [attendancePercentage, setAttendancePercentage] =
    useState(0);

  const [collectedFees, setCollectedFees] = useState(0);

  const [pendingFees, setPendingFees] = useState(0);

  const [totalResults, setTotalResults] = useState(0);

  /* =================================
     GET TODAY
  ================================= */

  const getToday = () => {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(
      2,
      "0"
    );

    const day = String(today.getDate()).padStart(
      2,
      "0"
    );

    return `${year}-${month}-${day}`;
  };

  /* =================================
     GET AUTH HEADERS
  ================================= */

  const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  /* =================================
     LOAD TOTAL STUDENTS
  ================================= */

  const loadStudents = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        setTotalStudents(0);
        return [];
      }

      const response = await fetch(
        `${API_BASE_URL}/students`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Students request failed: ${response.status}`
        );
      }

      const data = await response.json();

      const students = Array.isArray(data.students)
        ? data.students
        : [];

      /* ---------------------------------
         ONLY ACTIVE STUDENTS
      --------------------------------- */

      const activeStudents = students.filter(
        (student) =>
          student.status !== "Inactive"
      );

      setTotalStudents(activeStudents.length);

      return activeStudents;
    } catch (error) {
      console.error(
        "Dashboard students error:",
        error
      );

      setTotalStudents(0);

      return [];
    }
  };

  /* =================================
     LOAD TODAY'S ATTENDANCE
  ================================= */

  const loadTodayAttendance = async (activeStudents) => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        setAttendancePercentage(0);
        return;
      }

      const today = getToday();

      /* ---------------------------------
         GET ALL ATTENDANCE FOR TODAY
      --------------------------------- */

      const response = await fetch(
        `${API_BASE_URL}/attendance?date=${encodeURIComponent(
          today
        )}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Attendance request failed: ${response.status}`
        );
      }

      const data = await response.json();

      console.log(
        "Today's attendance API response:",
        data
      );

      /* ---------------------------------
         GET ATTENDANCE DOCUMENTS
      --------------------------------- */

      let attendanceDocuments = [];

      if (Array.isArray(data.attendance)) {
        attendanceDocuments = data.attendance;
      } else if (
        data.attendance &&
        Array.isArray(data.attendance.records)
      ) {
        attendanceDocuments = [data.attendance];
      }

      /* ---------------------------------
         CALCULATE TOTALS
      --------------------------------- */

      let totalMarkedStudents = 0;
      let totalPresentStudents = 0;

      attendanceDocuments.forEach(
        (attendanceDocument) => {
          if (
            !attendanceDocument ||
            !Array.isArray(
              attendanceDocument.records
            )
          ) {
            return;
          }

          attendanceDocument.records.forEach(
            (record) => {
              const recordStudentId =
                record.studentId ||
                record.student?._id ||
                record.student?.studentId;

              /* ---------------------------------
                 CHECK ACTIVE STUDENT
              --------------------------------- */

              const studentExists =
                activeStudents.some(
                  (student) =>
                    String(student.studentId) ===
                      String(recordStudentId) ||
                    String(student._id) ===
                      String(recordStudentId)
                );

              if (!studentExists) {
                return;
              }

              totalMarkedStudents++;

              /* ---------------------------------
                 COUNT PRESENT
              --------------------------------- */

              if (
                String(record.status).toLowerCase() ===
                "present"
              ) {
                totalPresentStudents++;
              }
            }
          );
        }
      );

      /* ---------------------------------
         CALCULATE PERCENTAGE
      --------------------------------- */

      const percentage =
        totalMarkedStudents > 0
          ? Math.round(
              (totalPresentStudents /
                totalMarkedStudents) *
                100
            )
          : 0;

      console.log(
        "Today's Attendance:",
        {
          date: today,
          attendanceDocuments:
            attendanceDocuments.length,
          totalMarkedStudents,
          totalPresentStudents,
          percentage,
        }
      );

      setAttendancePercentage(
        percentage
      );
    } catch (error) {
      console.error(
        "Dashboard attendance error:",
        error
      );

      setAttendancePercentage(0);
    }
  };

  /* =================================
     LOAD FEES FROM MONGODB
  ================================= */

  const loadFees = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        setCollectedFees(0);
        setPendingFees(0);
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/fees`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Fees request failed: ${response.status}`
        );
      }

      const data = await response.json();

      const feeRecords = Array.isArray(data.fees)
        ? data.fees
        : [];

      /* ---------------------------------
         COLLECTED FEES
      --------------------------------- */

      const collectedAmount =
        feeRecords
          .filter(
            (record) =>
              record.paymentStatus === "Paid"
          )
          .reduce(
            (total, record) =>
              total +
              (Number(
                record.totalAmount
              ) || 0),
            0
          );

      /* ---------------------------------
         PENDING FEES
      --------------------------------- */

      const pendingAmount =
        feeRecords
          .filter(
            (record) =>
              record.paymentStatus !== "Paid"
          )
          .reduce(
            (total, record) =>
              total +
              (Number(
                record.totalAmount
              ) || 0),
            0
          );

      setCollectedFees(
        collectedAmount
      );

      setPendingFees(
        pendingAmount
      );
    } catch (error) {
      console.error(
        "Dashboard fees error:",
        error
      );

      setCollectedFees(0);
      setPendingFees(0);
    }
  };

  /* =================================
     LOAD RESULTS FROM MONGODB
  ================================= */

  const loadResults = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        setTotalResults(0);
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/results`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Results request failed: ${response.status}`
        );
      }

      const data = await response.json();

      console.log(
        "Dashboard results API response:",
        data
      );

      /* ---------------------------------
         SUPPORT THE POSSIBLE API FORMATS
      --------------------------------- */

      let resultRecords = [];

      if (Array.isArray(data.results)) {
        resultRecords = data.results;
      } else if (Array.isArray(data.data)) {
        resultRecords = data.data;
      } else if (Array.isArray(data)) {
        resultRecords = data;
      }

      setTotalResults(
        resultRecords.length
      );
    } catch (error) {
      console.error(
        "Dashboard results error:",
        error
      );

      setTotalResults(0);
    }
  };

  /* =================================
     LOAD ALL DASHBOARD DATA
  ================================= */

  const loadDashboardData = async () => {
    const activeStudents =
      await loadStudents();

    await loadTodayAttendance(
      activeStudents
    );

    await loadFees();

    await loadResults();
  };

  /* =================================
     FORMAT RUPEES
  ================================= */

  const formatRs = (amount) => {
    return `Rs. ${Number(
      amount || 0
    ).toLocaleString("en-PK")}`;
  };

  /* =================================
     INITIAL LOAD
  ================================= */

  useEffect(() => {
    loadDashboardData();

    /* ---------------------------------
       UPDATE WHEN LOCAL STORAGE CHANGES
    --------------------------------- */

    const handleStorageChange = () => {
      loadDashboardData();
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    /* ---------------------------------
       UPDATE WHEN WINDOW GETS FOCUS
    --------------------------------- */

    const handleFocus = () => {
      loadDashboardData();
    };

    window.addEventListener(
      "focus",
      handleFocus
    );

    /* ---------------------------------
       UPDATE WHEN TAB BECOMES VISIBLE
    --------------------------------- */

    const handleVisibilityChange = () => {
      if (
        document.visibilityState ===
        "visible"
      ) {
        loadDashboardData();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    /* ---------------------------------
       CLEANUP
    --------------------------------- */

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );

      window.removeEventListener(
        "focus",
        handleFocus
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  /* =================================
     RENDER
  ================================= */

  return (
    <section className="admin-dashboard">

      {/* =================================
          DASHBOARD HEADER
      ================================= */}

      <div className="admin-dashboard-header">

        <div>

          <p className="section-label">
            ADMIN DASHBOARD
          </p>

          <h2>
            Welcome to AIMS Academy
          </h2>

          <p className="admin-dashboard-description">
            Manage students, attendance, fees,
            results, courses, news, and academy
            reports from one place.
          </p>

        </div>

      </div>

      {/* =================================
          STATISTICS
      ================================= */}

      <div className="admin-stats-grid">

        {/* TOTAL STUDENTS */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <Users size={22} />
          </div>

          <div>

            <p>
              Total Students
            </p>

            <h3>
              {totalStudents}
            </h3>

          </div>

        </div>

        {/* TODAY'S ATTENDANCE */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <ClipboardCheck size={22} />
          </div>

          <div>

            <p>
              Today's Attendance
            </p>

            <h3>
              {attendancePercentage}%
            </h3>

          </div>

        </div>

        {/* COLLECTED FEES */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <CreditCard size={22} />
          </div>

          <div>

            <p>
              Collected Fees
            </p>

            <h3>
              {formatRs(collectedFees)}
            </h3>

          </div>

        </div>

        {/* PENDING FEES */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <CreditCard size={22} />
          </div>

          <div>

            <p>
              Pending Fees
            </p>

            <h3>
              {formatRs(pendingFees)}
            </h3>

          </div>

        </div>

        {/* RESULTS */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <FileText size={22} />
          </div>

          <div>

            <p>
              Results
            </p>

            <h3>
              {totalResults}
            </h3>

          </div>

        </div>

      </div>

      {/* =================================
          QUICK ACTIONS
      ================================= */}

      <div className="admin-dashboard-section">

        <div className="admin-section-header">

          <div>

            <p className="section-label">
              QUICK ACTIONS
            </p>

            <h3>
              Manage Academy
            </h3>

          </div>

        </div>

        <div className="admin-quick-actions">

          {/* STUDENTS */}

          <button
            type="button"
            className="admin-action-card"
            onClick={() =>
              navigate(
                "/admin/students"
              )
            }
          >

            <Users size={22} />

            <div>

              <h4>
                Students
              </h4>

              <p>
                Add and manage students
              </p>

            </div>

            <ArrowRight size={18} />

          </button>

          {/* ATTENDANCE */}

          <button
            type="button"
            className="admin-action-card"
            onClick={() =>
              navigate(
                "/admin/attendance"
              )
            }
          >

            <ClipboardCheck size={22} />

            <div>

              <h4>
                Attendance
              </h4>

              <p>
                Manage student attendance
              </p>

            </div>

            <ArrowRight size={18} />

          </button>

          {/* FEES */}

          <button
            type="button"
            className="admin-action-card"
            onClick={() =>
              navigate(
                "/admin/fees"
              )
            }
          >

            <CreditCard size={22} />

            <div>

              <h4>
                Fees
              </h4>

              <p>
                Manage student fee records
              </p>

            </div>

            <ArrowRight size={18} />

          </button>

          {/* RESULTS */}

          <button
            type="button"
            className="admin-action-card"
            onClick={() =>
              navigate(
                "/admin/results"
              )
            }
          >

            <FileText size={22} />

            <div>

              <h4>
                Results
              </h4>

              <p>
                Manage student results
              </p>

            </div>

            <ArrowRight size={18} />

          </button>

        </div>

      </div>

    </section>
  );
}

export default AdminDashboard;
