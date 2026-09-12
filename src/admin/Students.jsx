import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  X,
  UserRound,
  GraduationCap,
  MoreVertical,
  Eye,
  Edit3,
  Trash2,
} from "lucide-react";

function Students() {
  /* =================================
     STUDENT DATA
  ================================= */

  const API_BASE_URL = "https://aims-academy-backend-production-a580.up.railway.app/api";

  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [savingStudent, setSavingStudent] = useState(false);
  const [deletingStudentId, setDeletingStudentId] = useState(null);
  const [studentError, setStudentError] = useState("");

  /* =================================
     GET ADMIN TOKEN
  ================================= */

  const getAdminToken = () => {
    return localStorage.getItem("adminToken");
  };

  /* =================================
     FETCH STUDENTS FROM MONGODB
  ================================= */

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      setStudentError("");

      const token = getAdminToken();

      if (!token) {
        setStudentError(
          "Your admin session has expired. Please log in again."
        );
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/students`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminLoggedIn");
        localStorage.removeItem("adminInfo");

        setStudentError(
          "Your admin session has expired. Please log in again."
        );
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to fetch students."
        );
      }

      setStudents(
        Array.isArray(data.students)
          ? data.students
          : []
      );
    } catch (error) {
      console.error("Fetch students error:", error);

      setStudentError(
        error.message ||
          "Unable to load students from the database."
      );
    } finally {
      setLoadingStudents(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  /* =================================
     PAGE STATES
  ================================= */

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] =
    useState("All Classes");
  const [openMenu, setOpenMenu] = useState(null);

  const [selectedStudent, setSelectedStudent] =
    useState(null);

  const [showDetails, setShowDetails] =
    useState(false);

  const [editingStudentId, setEditingStudentId] =
    useState(null);

  /* =================================
     FORM DATA
  ================================= */

  const initialFormData = {
    name: "",
    fatherName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    address: "",
    category: "",
    className: "",

    /* Optional subject for Pre-9 / 9th / 10th */
    optionalSubject: "",

    /* 11th / 12th */
    stream: "",
    group: "",

    /* Final selected subjects */
    subjects: [],

    admissionDate: "",
    status: "Active",
  };

  const [formData, setFormData] =
    useState(initialFormData);

  const [phoneError, setPhoneError] =
    useState("");

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

  /* =================================
     PRE-9 / 9TH / 10TH
  ================================= */

  const optionalSubjectClasses = [
    "Pre-9",
    "9th",
    "10th",
  ];

  const optionalSubjects = [
    "Computer",
    "Biology",
  ];

  const secondaryCompulsorySubjects = [
    "Maths",
    "English",
    "Urdu",
    "Islamiyat",
    "Al-Quran",
    "Physics",
    "Chemistry",
  ];

  /* =================================
     JUNIOR SUBJECTS
  ================================= */

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

  /* =================================
     SENIOR STREAMS
  ================================= */

  const seniorStreams = [
    "Medical",
    "Pre-Engineering",
    "ICS",
  ];

  /* =================================
     ICS GROUPS
  ================================= */

  const icsGroups = [
    "Computer Science, Mathematics, Physics",
    "Computer Science, Mathematics, Statistics",
    "Computer Science, Economics",
  ];

  /* =================================
     11TH / 12TH COMMON SUBJECTS
  ================================= */

  const seniorCommonSubjects = [
    "English",
    "Urdu",
    "Islamiyat",
    "Al-Quran",
  ];

  /* =================================
     GET SUBJECTS FOR STUDENT
  ================================= */

  const getSubjectsForStudent = () => {
    const {
      category,
      className,
      optionalSubject,
      stream,
      group,
    } = formData;

    /* -----------------------------
       JUNIOR
    ----------------------------- */

    if (category === "Junior") {
      return juniorSubjects;
    }

    /* -----------------------------
       PRE-9 / 9TH / 10TH
    ----------------------------- */

    if (
      optionalSubjectClasses.includes(
        className
      )
    ) {
      if (!optionalSubject) {
        return secondaryCompulsorySubjects;
      }

      return [
        ...secondaryCompulsorySubjects,
        optionalSubject,
      ];
    }

    /* -----------------------------
       11TH / 12TH
    ----------------------------- */

    if (
      className === "11th" ||
      className === "12th"
    ) {
      if (!stream) {
        return seniorCommonSubjects;
      }

      if (stream === "Medical") {
        return [
          ...seniorCommonSubjects,
          "Biology",
          "Chemistry",
          "Physics",
        ];
      }

      if (stream === "Pre-Engineering") {
        return [
          ...seniorCommonSubjects,
          "Physics",
          "Chemistry",
          "Maths",
        ];
      }

      if (stream === "ICS") {
        if (
          group ===
          "Computer Science, Mathematics, Physics"
        ) {
          return [
            ...seniorCommonSubjects,
            "Computer Science",
            "Mathematics",
            "Physics",
          ];
        }

        if (
          group ===
          "Computer Science, Mathematics, Statistics"
        ) {
          return [
            ...seniorCommonSubjects,
            "Computer Science",
            "Mathematics",
            "Statistics",
          ];
        }

        if (
          group ===
          "Computer Science, Economics"
        ) {
          return [
            ...seniorCommonSubjects,
            "Computer Science",
            "Economics",
          ];
        }

        return seniorCommonSubjects;
      }
    }

    return [];
  };

  /* =================================
     UPDATE SUBJECTS
  ================================= */

  useEffect(() => {
    if (
      !formData.category ||
      !formData.className
    ) {
      return;
    }

    const subjects = getSubjectsForStudent();

    setFormData((previous) => ({
      ...previous,
      subjects,
    }));
  }, [
    formData.category,
    formData.className,
    formData.optionalSubject,
    formData.stream,
    formData.group,
  ]);

  /* =================================
     FORM HANDLER
  ================================= */

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    /* =================================
       PHONE VALIDATION
    ================================= */

    if (name === "phone") {
      const phoneValue =
        value.replace(/\D/g, "");

      setFormData((previous) => ({
        ...previous,
        phone: phoneValue,
      }));

      if (
        phoneValue.length > 0 &&
        !/^03\d{0,9}$/.test(phoneValue)
      ) {
        setPhoneError(
          "Phone number must start with 03."
        );
      } else if (
        phoneValue.length === 11
      ) {
        if (!/^03\d{9}$/.test(phoneValue)) {
          setPhoneError(
            "Enter a valid Pakistani mobile number."
          );
        } else {
          setPhoneError("");
        }
      } else {
        setPhoneError("");
      }

      return;
    }

    /* =================================
       CATEGORY
    ================================= */

    if (name === "category") {
      setFormData((previous) => ({
        ...previous,
        category: value,
        className: "",
        optionalSubject: "",
        stream: "",
        group: "",
        subjects: [],
      }));

      return;
    }

    /* =================================
       CLASS
    ================================= */

    if (name === "className") {
      setFormData((previous) => ({
        ...previous,
        className: value,
        optionalSubject: "",
        stream: "",
        group: "",
        subjects: [],
      }));

      return;
    }

    /* =================================
       OPTIONAL SUBJECT
    ================================= */

    if (name === "optionalSubject") {
      setFormData((previous) => ({
        ...previous,
        optionalSubject: value,
      }));

      return;
    }

    /* =================================
       STREAM
    ================================= */

    if (name === "stream") {
      setFormData((previous) => ({
        ...previous,
        stream: value,
        group: "",
      }));

      return;
    }

    /* =================================
       ICS GROUP
    ================================= */

    if (name === "group") {
      setFormData((previous) => ({
        ...previous,
        group: value,
      }));

      return;
    }

    /* =================================
       OTHER FIELDS
    ================================= */

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =================================
     OPEN ADD FORM
  ================================= */

  const openAddForm = () => {
    setFormData({
      ...initialFormData,
      admissionDate: "",
    });

    setPhoneError("");
    setEditingStudentId(null);
    setShowForm(true);
  };

  /* =================================
     OPEN EDIT FORM
  ================================= */

  const handleEditStudent = (student) => {
    setFormData({
      name: student.name || "",
      fatherName:
        student.fatherName || "",
      dateOfBirth:
        student.dateOfBirth || "",
      gender: student.gender || "",
      phone: student.phone || "",
      address: student.address || "",
      category: student.category || "",
      className:
        student.className || "",

      optionalSubject:
        student.optionalSubject || "",

      stream: student.stream || "",
      group: student.group || "",

      subjects:
        Array.isArray(student.subjects)
          ? student.subjects
          : [],

      admissionDate:
        student.admissionDate || "",

      status:
        student.status || "Active",
    });

    setEditingStudentId(
      student.studentId
    );

    setPhoneError("");
    setOpenMenu(null);
    setShowForm(true);
  };

  /* =================================
     SAVE / UPDATE STUDENT
  ================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    /* =================================
       PHONE VERIFICATION
    ================================= */

    if (
      !/^03\d{9}$/.test(
        formData.phone
      )
    ) {
      setPhoneError(
        "Enter a valid Pakistani mobile number (03XXXXXXXXX)."
      );

      return;
    }

    /* =================================
       OPTIONAL SUBJECT VERIFICATION
    ================================= */

    if (
      optionalSubjectClasses.includes(
        formData.className
      ) &&
      !formData.optionalSubject
    ) {
      window.alert(
        "Please select either Computer or Biology."
      );

      return;
    }

    /* =================================
       STREAM VERIFICATION
    ================================= */

    if (
      (formData.className === "11th" ||
        formData.className === "12th") &&
      !formData.stream
    ) {
      window.alert(
        "Please select a stream."
      );

      return;
    }

    /* =================================
       ICS GROUP VERIFICATION
    ================================= */

    if (
      (formData.className === "11th" ||
        formData.className === "12th") &&
      formData.stream === "ICS" &&
      !formData.group
    ) {
      window.alert(
        "Please select an ICS group."
      );

      return;
    }

    /* =================================
       FINAL SUBJECTS
    ================================= */

    const finalSubjects =
      getSubjectsForStudent();

    const token = getAdminToken();

    if (!token) {
      window.alert(
        "Your admin session has expired. Please log in again."
      );

      return;
    }

    setSavingStudent(true);
    setStudentError("");

    try {
      const studentPayload = {
        ...formData,
        subjects: finalSubjects,
      };

      let response;

      if (editingStudentId) {
        const studentToUpdate =
          students.find(
            (student) =>
              student.studentId ===
              editingStudentId
          );

        if (!studentToUpdate?._id) {
          throw new Error(
            "Student database ID was not found. Please refresh the page and try again."
          );
        }

        response = await fetch(
          `${API_BASE_URL}/students/${studentToUpdate._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(
              studentPayload
            ),
          }
        );
      } else {
        response = await fetch(
          `${API_BASE_URL}/students`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(
              studentPayload
            ),
          }
        );
      }

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminLoggedIn");
        localStorage.removeItem("adminInfo");

        throw new Error(
          "Your admin session has expired. Please log in again."
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            (editingStudentId
              ? "Failed to update student."
              : "Failed to add student.")
        );
      }

      if (editingStudentId) {
        setStudents((previous) =>
          previous.map((student) =>
            student._id === data.student._id
              ? data.student
              : student
          )
        );
      } else {
        setStudents((previous) => [
          data.student,
          ...previous,
        ]);
      }

      setFormData(initialFormData);
      setPhoneError("");
      setEditingStudentId(null);
      setShowForm(false);
      setOpenMenu(null);
    } catch (error) {
      console.error(
        "Save student error:",
        error
      );

      setStudentError(
        error.message ||
          "Unable to save the student."
      );

      window.alert(
        error.message ||
          "Unable to save the student."
      );
    } finally {
      setSavingStudent(false);
    }
  };

  /* =================================
     DELETE STUDENT
  ================================= */

  const handleDeleteStudent = async (
    student
  ) => {
    const confirmDelete =
      window.confirm(
        `Are you sure you want to delete ${student.name}?`
      );

    if (!confirmDelete) {
      return;
    }

    const token = getAdminToken();

    if (!token) {
      window.alert(
        "Your admin session has expired. Please log in again."
      );

      return;
    }

    if (!student._id) {
      window.alert(
        "Student database ID was not found. Please refresh the page and try again."
      );

      return;
    }

    setDeletingStudentId(
      student.studentId
    );
    setStudentError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/students/${student._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminLoggedIn");
        localStorage.removeItem("adminInfo");

        throw new Error(
          "Your admin session has expired. Please log in again."
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to delete student."
        );
      }

      setStudents((previous) =>
        previous.filter(
          (item) =>
            item._id !== student._id
        )
      );

      setOpenMenu(null);

      if (
        selectedStudent?._id ===
        student._id
      ) {
        setShowDetails(false);
        setSelectedStudent(null);
      }
    } catch (error) {
      console.error(
        "Delete student error:",
        error
      );

      setStudentError(
        error.message ||
          "Unable to delete the student."
      );

      window.alert(
        error.message ||
          "Unable to delete the student."
      );
    } finally {
      setDeletingStudentId(null);
    }
  };

  /* =================================
     VIEW STUDENT
  ================================= */

  const handleViewStudent = (
    student
  ) => {
    setSelectedStudent(student);
    setShowDetails(true);
    setOpenMenu(null);
  };

  /* =================================
     FILTER STUDENTS
  ================================= */

  const filteredStudents =
    students.filter(
      (student) => {
        const searchValue =
          search.toLowerCase();

        const matchesSearch =
          student.name
            .toLowerCase()
            .includes(searchValue) ||
          student.studentId
            .toLowerCase()
            .includes(searchValue) ||
          student.fatherName
            .toLowerCase()
            .includes(searchValue);

        const matchesClass =
          classFilter ===
            "All Classes" ||
          student.className ===
            classFilter;

        return (
          matchesSearch &&
          matchesClass
        );
      }
    );

  /* =================================
     RENDER
  ================================= */

  return (
    <section className="students-page">

      {/* =================================
          PAGE HEADER
      ================================= */}

      <div className="students-header">

        <div>

          <p className="section-label">
            STUDENT MANAGEMENT
          </p>

          <h1>
            Students
          </h1>

          <p className="students-description">
            Add, search, and manage all
            AIMS Academy students from
            one place.
          </p>

        </div>

        <button
          className="students-add-button"
          onClick={openAddForm}
          disabled={loadingStudents}
        >
          <Plus size={19} />
          Add Student
        </button>

      </div>

      {/* =================================
          STATISTICS
      ================================= */}

      <div className="students-stats">

        <div className="students-stat-card">

          <div className="students-stat-icon">
            <UserRound size={21} />
          </div>

          <div>

            <p>
              Total Students
            </p>

            <h3>
              {students.length}
            </h3>

          </div>

        </div>

        <div className="students-stat-card">

          <div className="students-stat-icon">
            <GraduationCap size={21} />
          </div>

          <div>

            <p>
              Active Students
            </p>

            <h3>
              {
                students.filter(
                  (student) =>
                    student.status ===
                    "Active"
                ).length
              }
            </h3>

          </div>

        </div>

      </div>

      {/* =================================
          DATABASE STATUS
      ================================= */}

      {studentError && (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px 16px",
            borderRadius: "10px",
            background: "#fff1f2",
            color: "#b42318",
            border: "1px solid #fecdd3",
            fontSize: "14px",
          }}
        >
          {studentError}
        </div>
      )}

      {/* =================================
          STUDENTS TABLE
      ================================= */}

      <div className="students-table-section">

        <div className="students-table-header">

          <div>

            <h2>
              All Students
            </h2>

            <p>
              {
                filteredStudents.length
              }{" "}
              student
              {filteredStudents.length !==
              1
                ? "s"
                : ""}
            </p>

          </div>

          <div className="students-filters">

            <div className="students-search">

              <Search size={18} />

              <input
                type="text"
                placeholder="Search students..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>

            <select
              value={classFilter}
              onChange={(e) =>
                setClassFilter(
                  e.target.value
                )
              }
              className="students-class-filter"
            >

              <option>
                All Classes
              </option>

              {juniorClasses.map(
                (className) => (
                  <option
                    key={className}
                    value={className}
                  >
                    {className}
                  </option>
                )
              )}

              {seniorClasses.map(
                (className) => (
                  <option
                    key={className}
                    value={className}
                  >
                    {className}
                  </option>
                )
              )}

            </select>

          </div>

        </div>

        {/* =================================
            TABLE
        ================================= */}

        <div className="students-table-wrapper">

          <table className="students-table">

            <thead>

              <tr>

                <th>
                  Student ID
                </th>

                <th>
                  Student
                </th>

                <th>
                  Father's Name
                </th>

                <th>
                  Class
                </th>

                <th>
                  Phone
                </th>

                <th>
                  Status
                </th>

                <th></th>

              </tr>

            </thead>

            <tbody>

              {loadingStudents ? (

                <tr>

                  <td
                    colSpan="7"
                    className="students-empty"
                  >

                    <div className="students-empty-content">

                      <UserRound size={42} />

                      <h3>
                        Loading Students...
                      </h3>

                      <p>
                        Fetching student records
                        from MongoDB.
                      </p>

                    </div>

                  </td>

                </tr>

              ) : filteredStudents.length ===
                0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="students-empty"
                  >

                    <div className="students-empty-content">

                      <UserRound size={42} />

                      <h3>
                        No Students Found
                      </h3>

                      <p>
                        Students added to
                        the academy will
                        appear here.
                      </p>

                    </div>

                  </td>

                </tr>

              ) : (

                filteredStudents.map(
                  (student) => (

                    <tr
                      key={
                        student.studentId
                      }
                    >

                      <td>
                        <strong>
                          {
                            student.studentId
                          }
                        </strong>
                      </td>

                      <td>
                        {student.name}
                      </td>

                      <td>
                        {
                          student.fatherName
                        }
                      </td>

                      <td>
                        {
                          student.className
                        }
                      </td>

                      <td>
                        {student.phone}
                      </td>

                      <td>

                        <span
                          className={
                            student.status ===
                            "Active"
                              ? "student-status active"
                              : "student-status inactive"
                          }
                        >
                          {
                            student.status
                          }
                        </span>

                      </td>

                      <td className="student-actions-cell">

                        <button
                          className="student-more-button"
                          aria-label="Student actions"
                          onClick={() =>
                            setOpenMenu(
                              openMenu ===
                                student.studentId
                                ? null
                                : student.studentId
                            )
                          }
                        >

                          <MoreVertical
                            size={18}
                          />

                        </button>

                        {openMenu ===
                          student.studentId && (

                          <div className="student-actions-menu">

                            <button
                              onClick={() =>
                                handleViewStudent(
                                  student
                                )
                              }
                            >
                              <Eye size={16} />

                              <span>
                                View Details
                              </span>
                            </button>

                            <button
                              onClick={() =>
                                handleEditStudent(
                                  student
                                )
                              }
                            >
                              <Edit3 size={16} />

                              <span>
                                Edit Student
                              </span>
                            </button>

                            <button
                              className="delete-action"
                              onClick={() =>
                                handleDeleteStudent(
                                  student
                                )
                              }
                              disabled={
                                deletingStudentId ===
                                student.studentId
                              }
                            >
                              <Trash2
                                size={16}
                              />

                              <span>
                                {deletingStudentId ===
                                student.studentId
                                  ? "Deleting..."
                                  : "Delete Student"}
                              </span>
                            </button>

                          </div>

                        )}

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =================================
          ADD / EDIT STUDENT MODAL
      ================================= */}

      {showForm && (

        <div
          className="student-modal-overlay"
          onClick={() => {
            setShowForm(false);
            setEditingStudentId(null);
            setFormData(
              initialFormData
            );
            setPhoneError("");
          }}
        >

          <div
            className="student-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="student-modal-header">

              <div>

                <p className="section-label">
                  {editingStudentId
                    ? "UPDATE RECORD"
                    : "NEW ADMISSION"}
                </p>

                <h2>
                  {editingStudentId
                    ? "Edit Student"
                    : "Add Student"}
                </h2>

              </div>

              <button
                type="button"
                className="student-modal-close"
                onClick={() => {
                  setShowForm(false);
                  setEditingStudentId(
                    null
                  );
                  setFormData(
                    initialFormData
                  );
                  setPhoneError("");
                }}
                aria-label="Close"
              >
                <X size={21} />
              </button>

            </div>

            {/* =================================
                FORM
            ================================= */}

            <form
              className="student-form"
              onSubmit={handleSubmit}
            >

              {/* =================================
                  PERSONAL INFORMATION
              ================================= */}

              <div className="student-form-section">

                <h3>
                  Personal Information
                </h3>

                <div className="student-form-grid">

                  <div className="student-form-field">

                    <label>
                      Student Name *
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={
                        formData.name
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="Enter student name"
                      required
                    />

                  </div>

                  <div className="student-form-field">

                    <label>
                      Father's Name *
                    </label>

                    <input
                      type="text"
                      name="fatherName"
                      value={
                        formData.fatherName
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="Enter father's name"
                      required
                    />

                  </div>

                  <div className="student-form-field">

                    <label>
                      Date of Birth
                    </label>

                    <input
                      type="date"
                      name="dateOfBirth"
                      value={
                        formData.dateOfBirth
                      }
                      onChange={
                        handleInputChange
                      }
                    />

                  </div>

                  <div className="student-form-field">

                    <label>
                      Gender *
                    </label>

                    <select
                      name="gender"
                      value={
                        formData.gender
                      }
                      onChange={
                        handleInputChange
                      }
                      required
                    >

                      <option value="">
                        Select Gender
                      </option>

                      <option value="Male">
                        Male
                      </option>

                      <option value="Female">
                        Female
                      </option>

                    </select>

                  </div>

                  <div className="student-form-field">

                    <label>
                      Phone Number *
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={
                        formData.phone
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="03XXXXXXXXX"
                      inputMode="numeric"
                      maxLength="11"
                      required
                    />

                    {phoneError && (

                      <span className="student-phone-error">
                        {phoneError}
                      </span>

                    )}

                    {!phoneError &&
                      formData.phone.length ===
                        11 &&
                      /^03\d{9}$/.test(
                        formData.phone
                      ) && (

                        <span className="student-phone-success">
                          ✓ Valid phone number
                        </span>

                      )}

                  </div>

                  <div className="student-form-field">

                    <label>
                      Admission Date *
                    </label>

                    <input
                      type="date"
                      name="admissionDate"
                      value={
                        formData.admissionDate
                      }
                      onChange={
                        handleInputChange
                      }
                      required
                    />

                  </div>

                  <div className="student-form-field student-form-full">

                    <label>
                      Address
                    </label>

                    <textarea
                      name="address"
                      value={
                        formData.address
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="Enter student's address"
                      rows="3"
                    />

                  </div>

                </div>

              </div>

              {/* =================================
                  ACADEMIC INFORMATION
              ================================= */}

              <div className="student-form-section">

                <h3>
                  Academic Information
                </h3>

                <div className="student-form-grid">

                  {/* CATEGORY */}

                  <div className="student-form-field">

                    <label>
                      Student Category *
                    </label>

                    <select
                      name="category"
                      value={
                        formData.category
                      }
                      onChange={
                        handleInputChange
                      }
                      required
                    >

                      <option value="">
                        Select Category
                      </option>

                      <option value="Junior">
                        Junior
                      </option>

                      <option value="Senior">
                        Senior
                      </option>

                    </select>

                  </div>

                  {/* CLASS */}

                  <div className="student-form-field">

                    <label>
                      Class *
                    </label>

                    <select
                      name="className"
                      value={
                        formData.className
                      }
                      onChange={
                        handleInputChange
                      }
                      required
                      disabled={
                        !formData.category
                      }
                    >

                      <option value="">
                        {formData.category
                          ? "Select Class"
                          : "Select Category First"}
                      </option>

                      {(formData.category ===
                      "Junior"
                        ? juniorClasses
                        : formData.category ===
                          "Senior"
                          ? seniorClasses
                          : []
                      ).map(
                        (className) => (

                          <option
                            key={
                              className
                            }
                            value={
                              className
                            }
                          >
                            {
                              className
                            }
                          </option>

                        )
                      )}

                    </select>

                  </div>

                </div>

                {/* =================================
                    SUBJECT SECTION
                ================================= */}

                {formData.className && (

                  <div className="student-subjects-section">

                    <div className="student-subjects-header">

                      <div>

                        <h3>
                          Subjects
                        </h3>

                        <p>
                          Subjects assigned
                          according to the
                          selected class and
                          stream.
                        </p>

                      </div>

                    </div>

                    {/* =================================
                        PRE-9 / 9TH / 10TH
                    ================================= */}

                    {optionalSubjectClasses.includes(
                      formData.className
                    ) && (

                      <div className="student-subject-group">

                        <div className="student-subject-group-title">
                          Compulsory Subjects
                        </div>

                        <div className="student-subject-list">

                          {secondaryCompulsorySubjects.map(
                            (subject) => (

                              <div
                                className="student-subject-item subject-fixed"
                                key={
                                  subject
                                }
                              >

                                <span className="subject-radio-display">
                                  <span className="subject-radio-dot" />
                                </span>

                                <span>
                                  {
                                    subject
                                  }
                                </span>

                                <small>
                                  Compulsory
                                </small>

                              </div>

                            )
                          )}

                        </div>

                        <div className="student-subject-group-title optional-title">
                          Select One Optional Subject
                        </div>

                        <div className="student-radio-options">

                          {optionalSubjects.map(
                            (subject) => (

                              <label
                                key={
                                  subject
                                }
                                className={
                                  formData.optionalSubject ===
                                  subject
                                    ? "student-radio-option selected"
                                    : "student-radio-option"
                                }
                              >

                                <input
                                  type="radio"
                                  name="optionalSubject"
                                  value={
                                    subject
                                  }
                                  checked={
                                    formData.optionalSubject ===
                                    subject
                                  }
                                  onChange={
                                    handleInputChange
                                  }
                                />

                                <span className="custom-radio" />

                                <span>
                                  {
                                    subject
                                  }
                                </span>

                              </label>

                            )
                          )}

                        </div>

                      </div>

                    )}

                    {/* =================================
                        JUNIOR SUBJECTS
                    ================================= */}

                    {formData.category ===
                      "Junior" && (

                      <div className="student-subject-group">

                        <div className="student-subject-group-title">
                          Class Subjects
                        </div>

                        <div className="student-subject-list">

                          {juniorSubjects.map(
                            (subject) => (

                              <div
                                className="student-subject-item subject-fixed"
                                key={
                                  subject
                                }
                              >

                                <span className="subject-radio-display">
                                  <span className="subject-radio-dot" />
                                </span>

                                <span>
                                  {
                                    subject
                                  }
                                </span>

                                <small>
                                  Assigned
                                </small>

                              </div>

                            )
                          )}

                        </div>

                      </div>

                    )}

                    {/* =================================
                        11TH / 12TH STREAM
                    ================================= */}

                    {(formData.className ===
                      "11th" ||
                      formData.className ===
                        "12th") && (

                      <div className="student-subject-group">

                        <div className="student-subject-group-title">
                          Select Stream
                        </div>

                        <div className="student-radio-options">

                          {seniorStreams.map(
                            (stream) => (

                              <label
                                key={
                                  stream
                                }
                                className={
                                  formData.stream ===
                                  stream
                                    ? "student-radio-option selected"
                                    : "student-radio-option"
                                }
                              >

                                <input
                                  type="radio"
                                  name="stream"
                                  value={
                                    stream
                                  }
                                  checked={
                                    formData.stream ===
                                    stream
                                  }
                                  onChange={
                                    handleInputChange
                                  }
                                />

                                <span className="custom-radio" />

                                <span>
                                  {
                                    stream
                                  }
                                </span>

                              </label>

                            )
                          )}

                        </div>

                      </div>

                    )}

                    {/* =================================
                        ICS GROUP
                    ================================= */}

                    {(formData.className ===
                      "11th" ||
                      formData.className ===
                        "12th") &&
                      formData.stream ===
                        "ICS" && (

                        <div className="student-subject-group">

                          <div className="student-subject-group-title">
                            Select ICS Group
                          </div>

                          <div className="student-radio-options vertical">

                            {icsGroups.map(
                              (group) => (

                                <label
                                  key={
                                    group
                                  }
                                  className={
                                    formData.group ===
                                    group
                                      ? "student-radio-option selected"
                                      : "student-radio-option"
                                  }
                                >

                                  <input
                                    type="radio"
                                    name="group"
                                    value={
                                      group
                                    }
                                    checked={
                                      formData.group ===
                                      group
                                    }
                                    onChange={
                                      handleInputChange
                                    }
                                  />

                                  <span className="custom-radio" />

                                  <span>
                                    {
                                      group
                                    }
                                  </span>

                                </label>

                              )
                            )}

                          </div>

                        </div>

                      )}

                    {/* =================================
                        11TH / 12TH ASSIGNED SUBJECTS
                    ================================= */}

                    {(formData.className ===
                      "11th" ||
                      formData.className ===
                        "12th") &&
                      formData.stream && (

                        <div className="student-subject-group">

                          <div className="student-subject-group-title">
                            Assigned Subjects
                          </div>

                          <div className="student-subject-list">

                            {getSubjectsForStudent().map(
                              (subject) => (

                                <div
                                  className="student-subject-item subject-fixed"
                                  key={
                                    subject
                                  }
                                >

                                  <span className="subject-radio-display">
                                    <span className="subject-radio-dot" />
                                  </span>

                                  <span>
                                    {
                                      subject
                                    }
                                  </span>

                                  <small>
                                    Assigned
                                  </small>

                                </div>

                              )
                            )}

                          </div>

                        </div>

                      )}

                  </div>

                )}

                {/* =================================
                    STATUS
                ================================= */}

                <div className="student-form-grid">

                  <div className="student-form-field">

                    <label>
                      Status *
                    </label>

                    <select
                      name="status"
                      value={
                        formData.status
                      }
                      onChange={
                        handleInputChange
                      }
                      required
                    >

                      <option value="Active">
                        Active
                      </option>

                      <option value="Inactive">
                        Inactive
                      </option>

                    </select>

                  </div>

                </div>

              </div>

              {/* =================================
                  FORM ACTIONS
              ================================= */}

              <div className="student-form-actions">

                <button
                  type="button"
                  className="student-cancel-button"
                  onClick={() => {
                    setFormData(
                      initialFormData
                    );

                    setPhoneError("");
                    setEditingStudentId(
                      null
                    );
                    setShowForm(false);
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="student-save-button"
                  disabled={savingStudent}
                >

                  {editingStudentId ? (
                    <Edit3 size={18} />
                  ) : (
                    <Plus size={18} />
                  )}

                  {savingStudent
                    ? editingStudentId
                      ? "Updating..."
                      : "Adding..."
                    : editingStudentId
                      ? "Update Student"
                      : "Add Student"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =================================
          STUDENT DETAILS MODAL
      ================================= */}

      {showDetails &&
        selectedStudent && (

          <div
            className="student-modal-overlay"
            onClick={() => {
              setShowDetails(false);
              setSelectedStudent(null);
            }}
          >

            <div
              className="student-details-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="student-modal-header">

                <div>

                  <p className="section-label">
                    STUDENT PROFILE
                  </p>

                  <h2>
                    Student Details
                  </h2>

                </div>

                <button
                  type="button"
                  className="student-modal-close"
                  onClick={() => {
                    setShowDetails(false);
                    setSelectedStudent(null);
                  }}
                  aria-label="Close"
                >
                  <X size={21} />
                </button>

              </div>

              <div className="student-details-grid">

                <div>
                  <span>
                    Student ID
                  </span>

                  <strong>
                    {
                      selectedStudent.studentId
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Student Name
                  </span>

                  <strong>
                    {
                      selectedStudent.name
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Father's Name
                  </span>

                  <strong>
                    {
                      selectedStudent.fatherName
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Gender
                  </span>

                  <strong>
                    {
                      selectedStudent.gender
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Date of Birth
                  </span>

                  <strong>
                    {
                      selectedStudent.dateOfBirth ||
                      "Not provided"
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Phone
                  </span>

                  <strong>
                    {
                      selectedStudent.phone
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Category
                  </span>

                  <strong>
                    {
                      selectedStudent.category
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Class
                  </span>

                  <strong>
                    {
                      selectedStudent.className
                    }
                  </strong>
                </div>

                {/* OPTIONAL SUBJECT */}

                {selectedStudent.optionalSubject && (

                  <div>

                    <span>
                      Optional Subject
                    </span>

                    <strong>
                      {
                        selectedStudent.optionalSubject
                      }
                    </strong>

                  </div>

                )}

                {/* STREAM */}

                {selectedStudent.stream && (

                  <div>

                    <span>
                      Stream
                    </span>

                    <strong>
                      {
                        selectedStudent.stream
                      }
                    </strong>

                  </div>

                )}

                {/* ICS GROUP */}

                {selectedStudent.group && (

                  <div>

                    <span>
                      ICS Group
                    </span>

                    <strong>
                      {
                        selectedStudent.group
                      }
                    </strong>

                  </div>

                )}

                <div>

                  <span>
                    Admission Date
                  </span>

                  <strong>
                    {
                      selectedStudent.admissionDate
                    }
                  </strong>

                </div>

                <div>

                  <span>
                    Status
                  </span>

                  <strong>
                    {
                      selectedStudent.status
                    }
                  </strong>

                </div>

                {/* SUBJECTS */}

                <div className="student-details-full">

                  <span>
                    Subjects
                  </span>

                  <div className="student-details-subjects">

                    {Array.isArray(
                      selectedStudent.subjects
                    ) &&
                    selectedStudent.subjects.length >
                      0 ? (

                      selectedStudent.subjects.map(
                        (subject) => (

                          <span
                            key={
                              subject
                            }
                            className="student-subject-badge"
                          >
                            {
                              subject
                            }
                          </span>

                        )
                      )

                    ) : (

                      <strong>
                        Subjects not
                        recorded
                      </strong>

                    )}

                  </div>

                </div>

                <div className="student-details-full">

                  <span>
                    Address
                  </span>

                  <strong>
                    {
                      selectedStudent.address ||
                      "Not provided"
                    }
                  </strong>

                </div>

              </div>

              <div className="student-details-footer">

                <button
                  type="button"
                  className="student-cancel-button"
                  onClick={() => {
                    setShowDetails(false);
                    setSelectedStudent(null);
                  }}
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        )}

    </section>
  );
}

export default Students;
