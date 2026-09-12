import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  Plus,
  Search,
  X,
  GraduationCap,
  MessageCircle,
  Printer,
} from "lucide-react";

function Results() {
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [editingResult, setEditingResult] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [studentSearch, setStudentSearch] = useState("");

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    studentId: "",
    examName: "Monthly Test",
    examYear: new Date().getFullYear().toString(),
    subjects: [],
    notes: "",
  });

  const token = localStorage.getItem("adminToken");

  /* =================================
     API HEADERS
  ================================= */

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  /* =================================
     FETCH STUDENTS
  ================================= */

  const fetchStudents = async () => {
    try {
      setStudentsLoading(true);

      const response = await fetch(
        "https://aims-academy-backend-production-a580.up.railway.app/api/students",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch students."
        );
      }

      setStudents(data.students || data.data || []);
    } catch (error) {
      console.error("Fetch students error:", error);
      setError(error.message);
    } finally {
      setStudentsLoading(false);
    }
  };

  /* =================================
     FETCH RESULTS
  ================================= */

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://aims-academy-backend-production-a580.up.railway.app/api/results",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch results."
        );
      }

      setResults(data.results || data.data || []);
    } catch (error) {
      console.error("Fetch results error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchResults();
  }, []);

  /* =================================
     FIND STUDENT
  ================================= */

  const getStudent = (studentId) => {
    return students.find(
      (student) => student.studentId === studentId
    );
  };

  /* =================================
     SUBJECTS
  ================================= */

  const getSubjectsForStudent = (student) => {
    if (!student) {
      return [];
    }

    const className = String(
      student.className || ""
    ).toLowerCase();

    const category = String(
      student.category || ""
    ).toLowerCase();

    const stream = String(
      student.stream || ""
    ).toLowerCase();

    /* =================================
       JUNIORS
    ================================= */

    if (
      category === "junior" ||
      [
        "1st",
        "2nd",
        "3rd",
        "4th",
        "5th",
        "6th",
        "7th",
        "8th",
      ].some((item) => className.includes(item))
    ) {
      return [
        "English",
        "Urdu",
        "Science",
        "Maths",
        "History",
        "Islamiyat",
        "Geography",
        "Computer",
      ];
    }

    /* =================================
       PRE-9 / 9 / 10
    ================================= */

    if (
      className.includes("pre-9") ||
      className.includes("9th") ||
      className.includes("10th")
    ) {
      const subjects = [
        "Maths",
        "English",
        "Urdu",
        "Islamiyat",
        "Al-Quran",
        "Physics",
        "Chemistry",
      ];

      if (
        student.optionalSubject === "Biology"
      ) {
        subjects.push("Biology");
      }

      if (
        student.optionalSubject === "Computer"
      ) {
        subjects.push("Computer");
      }

      return subjects;
    }

    /* =================================
       11TH / 12TH
    ================================= */

    if (
      className.includes("11th") ||
      className.includes("12th")
    ) {
      const subjects = [
        "English",
        "Urdu",
        "Islamiyat",
        "Al-Quran",
      ];

      if (stream === "medical") {
        subjects.push(
          "Biology",
          "Chemistry",
          "Physics"
        );
      } else if (
        stream === "pre-engineering"
      ) {
        subjects.push(
          "Physics",
          "Chemistry",
          "Mathematics"
        );
      } else if (stream === "ics") {
        subjects.push(
          "Computer Science",
          "Mathematics",
          "Physics"
        );
      }

      return subjects;
    }

    if (
      Array.isArray(student.subjects) &&
      student.subjects.length > 0
    ) {
      return student.subjects;
    }

    return [];
  };

  /* =================================
     CALCULATE GRADE
  ================================= */

  const calculateGrade = (percentage) => {
    const value = Number(percentage);

    if (value >= 80) return "A+";
    if (value >= 70) return "A";
    if (value >= 60) return "B";
    if (value >= 50) return "C";
    if (value >= 40) return "D";

    return "F";
  };

  /* =================================
     CALCULATE STATUS
  ================================= */

  const calculateStatus = (subjects) => {
    if (!subjects.length) {
      return "Fail";
    }

    const hasFailedSubject = subjects.some(
      (subject) => {
        const totalMarks = Number(
          subject.totalMarks || 0
        );

        const obtainedMarks = Number(
          subject.obtainedMarks || 0
        );

        if (totalMarks <= 0) {
          return true;
        }

        return (
          (obtainedMarks / totalMarks) * 100 <
          40
        );
      }
    );

    return hasFailedSubject
      ? "Fail"
      : "Pass";
  };

  /* =================================
     FORM CALCULATION
  ================================= */

  const calculatedResult = useMemo(() => {
    const totalMarks =
      formData.subjects.reduce(
        (sum, subject) =>
          sum +
          Number(subject.totalMarks || 0),
        0
      );

    const obtainedMarks =
      formData.subjects.reduce(
        (sum, subject) =>
          sum +
          Number(
            subject.obtainedMarks || 0
          ),
        0
      );

    const percentage =
      totalMarks > 0
        ? (obtainedMarks / totalMarks) * 100
        : 0;

    const grade =
      calculateGrade(percentage);

    const status =
      calculateStatus(formData.subjects);

    return {
      totalMarks,
      obtainedMarks,
      percentage,
      grade,
      status,
    };
  }, [formData.subjects]);

  /* =================================
     FORMAT PERCENTAGE
  ================================= */

  const formatPercentage = (value) => {
    const number = Number(value || 0);

    return `${number.toFixed(1)}%`;
  };

  /* =================================
     HANDLE STUDENT SELECTION
  ================================= */

  const handleStudentSelect = (student) => {
    const subjects =
      getSubjectsForStudent(student).map(
        (subject) => ({
          name: subject,
          totalMarks: 100,
          obtainedMarks: "",
        })
      );

    setFormData((previous) => ({
      ...previous,
      studentId: student.studentId,
      subjects,
    }));

    setStudentSearch(
      `${student.name} - ${student.studentId}`
    );
  };

  /* =================================
     ADD RESULT
  ================================= */

  const handleAddResult = () => {
    setEditingResult(null);

    setFormData({
      studentId: "",
      examName: "Monthly Test",
      examYear:
        new Date().getFullYear().toString(),
      subjects: [],
      notes: "",
    });

    setStudentSearch("");
    setError("");
    setShowModal(true);
  };

  /* =================================
     EDIT RESULT
  ================================= */

  const handleEditResult = (result) => {
    const student = getStudent(
      result.studentId
    );

    setEditingResult(result);

    setFormData({
      studentId: result.studentId,
      examName: result.examName,
      examYear: result.examYear,
      subjects: (
        result.subjects || []
      ).map((subject) => ({
        name: subject.name,
        totalMarks:
          Number(subject.totalMarks || 0),
        obtainedMarks:
          Number(
            subject.obtainedMarks || 0
          ),
      })),
      notes: result.notes || "",
    });

    if (student) {
      setStudentSearch(
        `${student.name} - ${student.studentId}`
      );
    }

    setError("");
    setShowModal(true);
  };

  /* =================================
     UPDATE SUBJECT MARKS
  ================================= */

  const handleSubjectMarksChange = (
    index,
    value
  ) => {
    setFormData((previous) => {
      const subjects = [
        ...previous.subjects,
      ];

      subjects[index] = {
        ...subjects[index],
        obtainedMarks: value,
      };

      return {
        ...previous,
        subjects,
      };
    });
  };

  /* =================================
     UPDATE TOTAL MARKS
  ================================= */

  const handleSubjectTotalChange = (
    index,
    value
  ) => {
    setFormData((previous) => {
      const subjects = [
        ...previous.subjects,
      ];

      subjects[index] = {
        ...subjects[index],
        totalMarks: value,
      };

      return {
        ...previous,
        subjects,
      };
    });
  };

  /* =================================
     SAVE RESULT
  ================================= */

  const handleSaveResult = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.studentId) {
      setError(
        "Please select a student."
      );
      return;
    }

    if (!formData.subjects.length) {
      setError(
        "No subjects are available for this student."
      );
      return;
    }

    const invalidMarks =
      formData.subjects.some(
        (subject) => {
          const obtained = Number(
            subject.obtainedMarks
          );

          const total = Number(
            subject.totalMarks
          );

          return (
            subject.obtainedMarks === "" ||
            Number.isNaN(obtained) ||
            Number.isNaN(total) ||
            total <= 0 ||
            obtained < 0 ||
            obtained > total
          );
        }
      );

    if (invalidMarks) {
      setError(
        "Please enter valid marks for every subject."
      );
      return;
    }

    const duplicateResult =
      results.find((result) => {
        const isSameStudent =
          result.studentId ===
          formData.studentId;

        const isSameExam =
          result.examName ===
          formData.examName;

        const isSameYear =
          String(result.examYear) ===
          String(formData.examYear);

        const isCurrentResult =
          editingResult &&
          result.resultId ===
            editingResult.resultId;

        return (
          isSameStudent &&
          isSameExam &&
          isSameYear &&
          !isCurrentResult
        );
      });

    if (duplicateResult) {
      setError(
        "A result for this student, examination and year already exists."
      );
      return;
    }

    const payload = {
      studentId: formData.studentId,
      examName: formData.examName,
      examYear: formData.examYear,
      subjects: formData.subjects.map(
        (subject) => ({
          name: subject.name,
          totalMarks:
            Number(
              subject.totalMarks
            ),
          obtainedMarks:
            Number(
              subject.obtainedMarks
            ),
        })
      ),
      totalMarks:
        calculatedResult.totalMarks,
      obtainedMarks:
        calculatedResult.obtainedMarks,
      percentage:
        calculatedResult.percentage,
      grade:
        calculatedResult.grade,
      status:
        calculatedResult.status,
      notes: formData.notes.trim(),
    };

    try {
      const url = editingResult
        ? `https://aims-academy-backend-production-a580.up.railway.app/api/results/${editingResult.resultId}`
        : "https://aims-academy-backend-production-a580.up.railway.app/api/results";

      const method = editingResult
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save result."
        );
      }

      setShowModal(false);
      setEditingResult(null);
      setStudentSearch("");

      await fetchResults();
    } catch (error) {
      console.error(
        "Save result error:",
        error
      );

      setError(error.message);
    }
  };

  /* =================================
     DELETE RESULT
  ================================= */

  const handleDeleteResult = async (
    result
  ) => {
    const student = getStudent(
      result.studentId
    );

    const confirmed = window.confirm(
      `Are you sure you want to delete the result of ${
        student?.name || "this student"
      }?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `https://aims-academy-backend-production-a580.up.railway.app/api/results/${result.resultId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete result."
        );
      }

      if (
        selectedResult?.resultId ===
        result.resultId
      ) {
        setSelectedResult(null);
        setShowDetailsModal(false);
      }

      await fetchResults();
    } catch (error) {
      console.error(
        "Delete result error:",
        error
      );

      window.alert(error.message);
    }
  };

  /* =================================
     VIEW RESULT
  ================================= */

  const handleViewResult = (result) => {
    setSelectedResult(result);
    setShowDetailsModal(true);
  };

  /* =================================
     PRINT RESULT
  ================================= */

  const handlePrintResult = () => {
    if (!selectedResult) {
      return;
    }

    const student = getStudent(
      selectedResult.studentId
    );

    if (!student) {
      window.alert(
        "Student information could not be found."
      );
      return;
    }

    const iframe =
      document.createElement("iframe");

    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";

    document.body.appendChild(iframe);

    const subjectRows = (
      selectedResult.subjects || []
    )
      .map((subject) => {
        const totalMarks = Number(
          subject.totalMarks || 0
        );

        const obtainedMarks = Number(
          subject.obtainedMarks || 0
        );

        const percentage =
          totalMarks > 0
            ? (
                (obtainedMarks /
                  totalMarks) *
                100
              ).toFixed(1)
            : "0.0";

        return `
          <tr>
            <td>${subject.name}</td>
            <td>${totalMarks}</td>
            <td>${obtainedMarks}</td>
            <td>${percentage}%</td>
          </tr>
        `;
      })
      .join("");

    const printDocument = iframe.contentWindow.document;

    printDocument.open();

    printDocument.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>AIMS Academy Result</title>

        <style>
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 40px;
            font-family: Arial, sans-serif;
            color: #222;
            background: white;
          }

          .sheet {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
          }

          .header {
            text-align: center;
            border-bottom: 3px solid #222;
            padding-bottom: 18px;
            margin-bottom: 25px;
          }

          .academy {
            font-size: 30px;
            font-weight: 800;
            letter-spacing: 1px;
          }

          .title {
            font-size: 22px;
            font-weight: 700;
            margin-top: 8px;
          }

          .exam {
            margin-top: 8px;
            font-size: 15px;
          }

          .student-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px 30px;
            margin-bottom: 25px;
          }

          .info-item {
            font-size: 14px;
          }

          .label {
            font-weight: 700;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }

          th,
          td {
            border: 1px solid #444;
            padding: 10px;
            text-align: center;
            font-size: 14px;
          }

          th {
            font-weight: 700;
          }

          td:first-child,
          th:first-child {
            text-align: left;
          }

          .summary {
            margin-top: 25px;
            border: 1px solid #444;
            padding: 15px;
          }

          .summary-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
          }

          .summary-item {
            text-align: center;
          }

          .summary-label {
            font-size: 12px;
            font-weight: 700;
          }

          .summary-value {
            margin-top: 5px;
            font-size: 17px;
            font-weight: 800;
          }

          .notes {
            margin-top: 20px;
            padding: 12px;
            border: 1px solid #ccc;
          }

          .footer {
            text-align: center;
            margin-top: 45px;
            font-size: 12px;
          }

          @media print {
            body {
              padding: 20px;
            }

            @page {
              size: A4;
              margin: 15mm;
            }
          }
        </style>
      </head>

      <body>
        <div class="sheet">

          <div class="header">
            <div class="academy">
              AIMS ACADEMY
            </div>

            <div class="title">
              STUDENT RESULT SHEET
            </div>

            <div class="exam">
              ${selectedResult.examName}
              -
              ${selectedResult.examYear}
            </div>
          </div>

          <div class="student-info">

            <div class="info-item">
              <span class="label">
                Student Name:
              </span>
              ${student.name || "N/A"}
            </div>

            <div class="info-item">
              <span class="label">
                Student ID:
              </span>
              ${selectedResult.studentId}
            </div>

            <div class="info-item">
              <span class="label">
                Father Name:
              </span>
              ${student.fatherName || "N/A"}
            </div>

            <div class="info-item">
              <span class="label">
                Class:
              </span>
              ${student.className || "N/A"}
            </div>

          </div>

          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Total Marks</th>
                <th>Obtained Marks</th>
                <th>Percentage</th>
              </tr>
            </thead>

            <tbody>
              ${subjectRows}
            </tbody>
          </table>

          <div class="summary">

            <div class="summary-grid">

              <div class="summary-item">
                <div class="summary-label">
                  TOTAL MARKS
                </div>

                <div class="summary-value">
                  ${selectedResult.totalMarks}
                </div>
              </div>

              <div class="summary-item">
                <div class="summary-label">
                  OBTAINED
                </div>

                <div class="summary-value">
                  ${selectedResult.obtainedMarks}
                </div>
              </div>

              <div class="summary-item">
                <div class="summary-label">
                  PERCENTAGE
                </div>

                <div class="summary-value">
                  ${formatPercentage(
                    selectedResult.percentage
                  )}
                </div>
              </div>

              <div class="summary-item">
                <div class="summary-label">
                  GRADE
                </div>

                <div class="summary-value">
                  ${selectedResult.grade}
                </div>
              </div>

            </div>

            <div style="
              text-align:center;
              margin-top:15px;
              font-weight:700;
            ">
              RESULT:
              ${selectedResult.status}
            </div>

          </div>

          ${
            selectedResult.notes
              ? `
                <div class="notes">
                  <strong>Remarks:</strong>
                  ${selectedResult.notes}
                </div>
              `
              : ""
          }

          <div class="footer">
            AIMS Academy Administration
          </div>

        </div>
      </body>
      </html>
    `);

    printDocument.close();

    iframe.onload = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();

      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    };
  };

  /* =================================
     WHATSAPP RESULT
  ================================= */

  const handleWhatsAppResult = () => {
    if (!selectedResult) {
      return;
    }

    const student = students.find(
      (item) =>
        item.studentId ===
        selectedResult.studentId
    );

    if (!student) {
      window.alert(
        "Student information could not be found."
      );
      return;
    }

    if (!student.phone) {
      window.alert(
        "No phone number is available for this student."
      );
      return;
    }

    let phoneNumber =
      String(student.phone).replace(
        /\D/g,
        ""
      );

    /* =================================
       PAKISTANI NUMBER FORMAT

       03XXXXXXXXX
       ↓
       923XXXXXXXXX
    ================================= */

    if (
      phoneNumber.startsWith("03")
    ) {
      phoneNumber =
        "92" +
        phoneNumber.substring(1);
    }

    /* =================================
       SUBJECT-WISE RESULT
    ================================= */

    const subjectLines = (
      selectedResult.subjects || []
    )
      .map((subject) => {
        const totalMarks =
          Number(
            subject.totalMarks || 0
          );

        const obtainedMarks =
          Number(
            subject.obtainedMarks || 0
          );

        const percentage =
          totalMarks > 0
            ? (
                (obtainedMarks /
                  totalMarks) *
                100
              ).toFixed(1)
            : "0.0";

        return `• ${subject.name}: ${obtainedMarks}/${totalMarks} (${percentage}%)`;
      })
      .join("\n");

    /* =================================
       RESULT MESSAGE
    ================================= */

    const message = `
*AIMS ACADEMY*
━━━━━━━━━━━━━━━━━━

📄 *STUDENT RESULT*

👤 Student: ${student.name || "N/A"}
🆔 Student ID: ${selectedResult.studentId}
🏫 Class: ${student.className || "N/A"}

📝 Examination: ${selectedResult.examName}
📅 Year: ${selectedResult.examYear}

━━━━━━━━━━━━━━━━━━
*SUBJECT PERFORMANCE*
━━━━━━━━━━━━━━━━━━

${subjectLines}

━━━━━━━━━━━━━━━━━━
*OVERALL RESULT*
━━━━━━━━━━━━━━━━━━

📊 Total Marks: ${selectedResult.totalMarks}
✅ Obtained Marks: ${selectedResult.obtainedMarks}
📈 Percentage: ${formatPercentage(
      selectedResult.percentage
    )}
🏆 Grade: ${selectedResult.grade}
📌 Result: ${selectedResult.status}

${
  selectedResult.notes
    ? `\n📝 Remarks: ${selectedResult.notes}\n`
    : ""
}

━━━━━━━━━━━━━━━━━━

Thank you for choosing
*AIMS Academy*.

This result has been issued by
AIMS Academy Administration.
    `.trim();

    /* =================================
       OPEN WHATSAPP
    ================================= */

    const whatsappUrl =
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        message
      )}`;

    window.open(
      whatsappUrl,
      "_blank"
    );
  };

  /* =================================
     FILTER RESULTS
  ================================= */

  const filteredResults =
    results.filter((result) => {
      const student = getStudent(
        result.studentId
      );

      const search =
        searchTerm.toLowerCase();

      return (
        student?.name
          ?.toLowerCase()
          .includes(search) ||
        result.studentId
          ?.toLowerCase()
          .includes(search) ||
        result.examName
          ?.toLowerCase()
          .includes(search) ||
        result.examYear
          ?.toLowerCase()
          .includes(search)
      );
    });

  /* =================================
     FILTER STUDENTS
  ================================= */

  const filteredStudents =
    students.filter((student) => {
      const search =
        studentSearch.toLowerCase();

      return (
        student.name
          ?.toLowerCase()
          .includes(search) ||
        student.studentId
          ?.toLowerCase()
          .includes(search)
      );
    });

  /* =================================
     STATISTICS
  ================================= */

  const totalResults =
    results.length;

  const passedResults =
    results.filter(
      (result) =>
        result.status === "Pass"
    ).length;

  const failedResults =
    results.filter(
      (result) =>
        result.status === "Fail"
    ).length;

  const averagePercentage =
    results.length > 0
      ? results.reduce(
          (sum, result) =>
            sum +
            Number(
              result.percentage || 0
            ),
          0
        ) / results.length
      : 0;

  /* =================================
     RENDER
  ================================= */

  return (
    <div className="results-page">

      {/* =================================
          HEADER
      ================================= */}

      <div className="results-header">

        <div>
          <div className="section-label">
            ACADEMIC MANAGEMENT
          </div>

          <h1>Results</h1>

          <p className="results-description">
            Create, manage and review
            student examination results.
          </p>
        </div>

        <button
          className="results-add-button"
          onClick={handleAddResult}
        >
          <Plus size={18} />
          Add Result
        </button>

      </div>

      {/* =================================
          ERROR
      ================================= */}

      {error && (
        <div
          style={{
            marginBottom: "20px",
            padding: "12px 16px",
            borderRadius: "8px",
            background: "#fee2e2",
            color: "#991b1b",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      {/* =================================
          STATISTICS
      ================================= */}

      <div className="results-stats">

        <div className="results-stat-card">
          <div className="results-stat-icon">
            <GraduationCap size={22} />
          </div>

          <div>
            <span>Total Results</span>
            <strong>{totalResults}</strong>
          </div>
        </div>

        <div className="results-stat-card">
          <div className="results-stat-icon">
            <GraduationCap size={22} />
          </div>

          <div>
            <span>Passed</span>
            <strong>{passedResults}</strong>
          </div>
        </div>

        <div className="results-stat-card">
          <div className="results-stat-icon">
            <GraduationCap size={22} />
          </div>

          <div>
            <span>Failed</span>
            <strong>{failedResults}</strong>
          </div>
        </div>

        <div className="results-stat-card">
          <div className="results-stat-icon">
            <GraduationCap size={22} />
          </div>

          <div>
            <span>Average</span>
            <strong>
              {formatPercentage(
                averagePercentage
              )}
            </strong>
          </div>
        </div>

      </div>

      {/* =================================
          MANAGEMENT SECTION
      ================================= */}

      <div className="results-management-section">

        <div className="results-section-header">

          <div>
            <h2>Result Records</h2>
            <p>
              All student results stored
              in MongoDB.
            </p>
          </div>

          <div className="results-record-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search results..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
            />
          </div>

        </div>

        {loading ? (
          <div className="results-empty-state">
            <div className="results-empty-icon">
              <GraduationCap size={30} />
            </div>

            <h3>Loading results...</h3>
          </div>
        ) : filteredResults.length ===
          0 ? (
          <div className="results-empty-state">

            <div className="results-empty-icon">
              <GraduationCap size={30} />
            </div>

            <h3>No results found</h3>

            <p>
              Add an examination result
              to get started.
            </p>

            <button
              className="results-empty-button"
              onClick={handleAddResult}
            >
              <Plus size={18} />
              Add Result
            </button>

          </div>
        ) : (
          <div className="results-table-wrapper">

            <table className="results-table">

              <thead>
                <tr>
                  <th>Student</th>
                  <th>Examination</th>
                  <th>Year</th>
                  <th>Percentage</th>
                  <th>Grade</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredResults.map(
                  (result) => {
                    const student =
                      getStudent(
                        result.studentId
                      );

                    return (
                      <tr
                        key={
                          result.resultId
                        }
                      >

                        <td>
                          <div className="results-student-cell">

                            <div className="results-student-icon">
                              <GraduationCap
                                size={17}
                              />
                            </div>

                            <div>
                              <strong>
                                {
                                  student?.name ||
                                  "Unknown Student"
                                }
                              </strong>

                              <span>
                                {
                                  result.studentId
                                }
                              </span>
                            </div>

                          </div>
                        </td>

                        <td>
                          {result.examName}
                        </td>

                        <td className="results-year">
                          {result.examYear}
                        </td>

                        <td>
                          {formatPercentage(
                            result.percentage
                          )}
                        </td>

                        <td>
                          <span className="results-grade">
                            {result.grade}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`result-status ${
                              result.status ===
                              "Pass"
                                ? "pass"
                                : "fail"
                            }`}
                          >
                            {result.status}
                          </span>
                        </td>

                        <td>
                          <div className="results-actions">

                            <button
                              title="View"
                              onClick={() =>
                                handleViewResult(
                                  result
                                )
                              }
                            >
                              <Eye
                                size={17}
                              />
                            </button>

                            <button
                              title="Edit"
                              onClick={() =>
                                handleEditResult(
                                  result
                                )
                              }
                            >
                              <Pencil
                                size={17}
                              />
                            </button>

                            <button
                              title="Delete"
                              className="results-delete-action"
                              onClick={() =>
                                handleDeleteResult(
                                  result
                                )
                              }
                            >
                              <Trash2
                                size={17}
                              />
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  }
                )}
              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* =================================
          ADD / EDIT MODAL
      ================================= */}

      {showModal && (
        <div className="results-modal-overlay">

          <div className="results-modal">

            <div className="results-modal-header">

              <div>
                <h2>
                  {editingResult
                    ? "Edit Result"
                    : "Add Result"}
                </h2>

                <p>
                  Enter the student's
                  examination marks.
                </p>
              </div>

              <button
                className="results-modal-close"
                onClick={() =>
                  setShowModal(false)
                }
              >
                <X size={20} />
              </button>

            </div>

            <form
              className="results-form"
              onSubmit={
                handleSaveResult
              }
            >

              {/* STUDENT */}

              <div className="results-form-section">

                <h3>Student Information</h3>

                <div className="results-form-grid">

                  <div className="results-form-field results-form-full">

                    <label>
                      Student
                    </label>

                    <div className="results-student-search">

                      <Search
                        size={18}
                      />

                      <input
                        type="text"
                        placeholder="Search student..."
                        value={
                          studentSearch
                        }
                        onChange={(
                          event
                        ) => {
                          setStudentSearch(
                            event.target
                              .value
                          );
                        }}
                        disabled={
                          !!editingResult
                        }
                      />

                    </div>

                    {!editingResult &&
                      studentSearch && (
                        <div className="results-student-dropdown">

                          {filteredStudents.length ===
                          0 ? (
                            <div className="results-dropdown-empty">
                              No students
                              found.
                            </div>
                          ) : (
                            filteredStudents
                              .slice(0, 8)
                              .map(
                                (
                                  student
                                ) => (
                                  <button
                                    type="button"
                                    key={
                                      student.studentId
                                    }
                                    className="results-student-option"
                                    onClick={() =>
                                      handleStudentSelect(
                                        student
                                      )
                                    }
                                  >
                                    <div className="results-option-icon">
                                      <GraduationCap
                                        size={
                                          17
                                        }
                                      />
                                    </div>

                                    <div>
                                      <strong>
                                        {
                                          student.name
                                        }
                                      </strong>

                                      <span>
                                        {
                                          student.studentId
                                        }
                                      </span>
                                    </div>
                                  </button>
                                )
                              )
                          )}

                        </div>
                      )}

                    {formData.studentId && (
                      <div className="results-selected-student">

                        <strong>
                          {
                            getStudent(
                              formData.studentId
                            )?.name
                          }
                        </strong>

                        <span>
                          {
                            formData.studentId
                          }
                        </span>

                      </div>
                    )}

                  </div>

                </div>

              </div>

              {/* EXAMINATION */}

              <div className="results-form-section">

                <h3>
                  Examination Information
                </h3>

                <div className="results-form-grid">

                  <div className="results-form-field">

                    <label>
                      Examination
                    </label>

                    <select
                      value={
                        formData.examName
                      }
                      onChange={(
                        event
                      ) =>
                        setFormData(
                          (
                            previous
                          ) => ({
                            ...previous,
                            examName:
                              event
                                .target
                                .value,
                          })
                        )
                      }
                    >
                      <option>
                        Monthly Test
                      </option>

                      <option>
                        Mid Term
                      </option>

                      <option>
                        Final Term
                      </option>

                      <option>
                        Annual Examination
                      </option>
                    </select>

                  </div>

                  <div className="results-form-field">

                    <label>
                      Year
                    </label>

                    <input
                      type="text"
                      value={
                        formData.examYear
                      }
                      onChange={(
                        event
                      ) =>
                        setFormData(
                          (
                            previous
                          ) => ({
                            ...previous,
                            examYear:
                              event
                                .target
                                .value,
                          })
                        )
                      }
                    />

                  </div>

                </div>

              </div>

              {/* MARKS */}

              <div className="results-form-section">

                <div className="results-subject-info">

                  <div>
                    <h3>
                      Subject Marks
                    </h3>

                    <p>
                      Enter marks obtained
                      by the student.
                    </p>
                  </div>

                </div>

                <div className="results-marks-table">

                  <div className="results-marks-header">
                    <span>
                      Subject
                    </span>

                    <span>
                      Total Marks
                    </span>

                    <span>
                      Obtained Marks
                    </span>
                  </div>

                  {formData.subjects.map(
                    (
                      subject,
                      index
                    ) => (
                      <div
                        className="results-marks-row"
                        key={
                          subject.name
                        }
                      >

                        <strong>
                          {
                            subject.name
                          }
                        </strong>

                        <input
                          type="number"
                          min="1"
                          value={
                            subject.totalMarks
                          }
                          onChange={(
                            event
                          ) =>
                            handleSubjectTotalChange(
                              index,
                              event
                                .target
                                .value
                            )
                          }
                        />

                        <input
                          type="number"
                          min="0"
                          max={
                            subject.totalMarks
                          }
                          value={
                            subject.obtainedMarks
                          }
                          onChange={(
                            event
                          ) =>
                            handleSubjectMarksChange(
                              index,
                              event
                                .target
                                .value
                            )
                          }
                        />

                      </div>
                    )
                  )}

                </div>

                {/* CALCULATION */}

                <div className="results-calculation">

                  <div>
                    <span>
                      Total Marks
                    </span>

                    <strong>
                      {
                        calculatedResult.totalMarks
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Obtained Marks
                    </span>

                    <strong>
                      {
                        calculatedResult.obtainedMarks
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Percentage
                    </span>

                    <strong>
                      {formatPercentage(
                        calculatedResult.percentage
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Grade
                    </span>

                    <strong>
                      {
                        calculatedResult.grade
                      }
                    </strong>
                  </div>

                  <div
                    className={
                      calculatedResult.status ===
                      "Pass"
                        ? "results-pass"
                        : "results-fail"
                    }
                  >
                    <span>
                      Status
                    </span>

                    <strong>
                      {
                        calculatedResult.status
                      }
                    </strong>
                  </div>

                </div>

              </div>

              {/* NOTES */}

              <div className="results-form-section">

                <div className="results-form-field results-form-full">

                  <label>
                    Remarks / Notes
                  </label>

                  <textarea
                    rows="4"
                    placeholder="Enter any remarks..."
                    value={
                      formData.notes
                    }
                    onChange={(
                      event
                    ) =>
                      setFormData(
                        (
                          previous
                        ) => ({
                          ...previous,
                          notes:
                            event
                              .target
                              .value,
                        })
                      )
                    }
                  />

                </div>

              </div>

              {/* ACTIONS */}

              <div className="results-form-actions">

                <button
                  type="button"
                  className="results-cancel-button"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="results-save-button"
                >
                  {editingResult
                    ? "Update Result"
                    : "Save Result"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* =================================
          RESULT DETAILS MODAL
      ================================= */}

      {showDetailsModal &&
        selectedResult && (
          <div className="results-modal-overlay">

            <div className="results-details-modal">

              <div className="results-modal-header">

                <div>
                  <h2>
                    Result Details
                  </h2>

                  <p>
                    {
                      selectedResult.examName
                    }{" "}
                    -{" "}
                    {
                      selectedResult.examYear
                    }
                  </p>
                </div>

                <button
                  className="results-modal-close"
                  onClick={() =>
                    setShowDetailsModal(
                      false
                    )
                  }
                >
                  <X size={20} />
                </button>

              </div>

              <div className="results-details-student">

                <div>
                  <span>
                    Student
                  </span>

                  <strong>
                    {
                      getStudent(
                        selectedResult.studentId
                      )?.name ||
                      "Unknown Student"
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Student ID
                  </span>

                  <strong>
                    {
                      selectedResult.studentId
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Class
                  </span>

                  <strong>
                    {
                      getStudent(
                        selectedResult.studentId
                      )?.className ||
                      "N/A"
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Father Name
                  </span>

                  <strong>
                    {
                      getStudent(
                        selectedResult.studentId
                      )?.fatherName ||
                      "N/A"
                    }
                  </strong>
                </div>

              </div>

              {/* SUMMARY */}

              <div className="results-details-summary">

                <div>
                  <span>
                    Total Marks
                  </span>

                  <strong>
                    {
                      selectedResult.totalMarks
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Obtained Marks
                  </span>

                  <strong>
                    {
                      selectedResult.obtainedMarks
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Percentage
                  </span>

                  <strong>
                    {formatPercentage(
                      selectedResult.percentage
                    )}
                  </strong>
                </div>

                <div>
                  <span>
                    Grade
                  </span>

                  <strong>
                    {
                      selectedResult.grade
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Status
                  </span>

                  <strong>
                    {
                      selectedResult.status
                    }
                  </strong>
                </div>

              </div>

              {/* SUBJECTS */}

              <div className="results-details-subjects">

                <h3>
                  Subject Performance
                </h3>

                <div className="results-details-table">

                  <div className="results-details-table-header">
                    <span>
                      Subject
                    </span>

                    <span>
                      Total
                    </span>

                    <span>
                      Obtained
                    </span>

                    <span>
                      Percentage
                    </span>
                  </div>

                  {(
                    selectedResult.subjects ||
                    []
                  ).map(
                    (subject) => {
                      const totalMarks =
                        Number(
                          subject.totalMarks ||
                            0
                        );

                      const obtainedMarks =
                        Number(
                          subject.obtainedMarks ||
                            0
                        );

                      const percentage =
                        totalMarks >
                        0
                          ? (
                              (obtainedMarks /
                                totalMarks) *
                              100
                            ).toFixed(
                              1
                            )
                          : "0.0";

                      return (
                        <div
                          className="results-details-table-row"
                          key={
                            subject.name
                          }
                        >
                          <span>
                            {
                              subject.name
                            }
                          </span>

                          <span>
                            {
                              totalMarks
                            }
                          </span>

                          <span>
                            {
                              obtainedMarks
                            }
                          </span>

                          <span>
                            {
                              percentage
                            }
                            %
                          </span>
                        </div>
                      );
                    }
                  )}

                </div>

              </div>

              {/* NOTES */}

              {selectedResult.notes && (
                <div className="results-details-notes">

                  <strong>
                    Remarks
                  </strong>

                  <p>
                    {
                      selectedResult.notes
                    }
                  </p>

                </div>
              )}

              {/* FOOTER */}

              <div className="results-details-footer">

                <button
                  type="button"
                  className="results-print-button"
                  onClick={
                    handlePrintResult
                  }
                >
                  <Printer size={18} />
                  Print Result
                </button>

                <button
                  type="button"
                  className="results-whatsapp-button"
                  onClick={
                    handleWhatsAppResult
                  }
                >
                  <MessageCircle
                    size={18}
                  />
                  Send via WhatsApp
                </button>

                <button
                  type="button"
                  className="results-cancel-button"
                  onClick={() =>
                    setShowDetailsModal(
                      false
                    )
                  }
                >
                  Close
                </button>

              </div>

            </div>

          </div>
        )}

    </div>
  );
}

export default Results;