import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  X,
  Receipt,
  UserRound,
  Users,
  CalendarDays,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Trash2,
  Eye,
  Edit3,
} from "lucide-react";

const API_BASE_URL = "https://aims-academy-backend-production-a580.up.railway.app/api";

function Fees() {
  /* =================================
     DATE HELPERS
  ================================= */

  const getCurrentMonth = () => {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, "0");

    return `${year}-${month}`;
  };

  const getToday = () => {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, "0");

    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  /* =================================
     AUTH
  ================================= */

  const getAdminToken = () => {
    return localStorage.getItem("adminToken");
  };

  /* =================================
     STUDENTS
  ================================= */

  const [students, setStudents] = useState([]);

  const [loadingStudents, setLoadingStudents] = useState(true);

  const [studentError, setStudentError] = useState("");

  /* =================================
     FEE RECORDS
  ================================= */

  const [feeRecords, setFeeRecords] = useState([]);

  const [loadingFees, setLoadingFees] = useState(true);

  const [savingFee, setSavingFee] = useState(false);

  const [deletingFeeId, setDeletingFeeId] = useState(null);

  const [feeError, setFeeError] = useState("");

  /* =================================
     PAGE STATES
  ================================= */

  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");

  const [selectedStudentId, setSelectedStudentId] = useState("");

  const [showStudentList, setShowStudentList] = useState(false);

  const [selectedFeeRecord, setSelectedFeeRecord] = useState(null);

  const [showDetails, setShowDetails] = useState(false);

  const [editingFeeId, setEditingFeeId] = useState(null);

  const [feeSearch, setFeeSearch] = useState("");

  /* =================================
     MONTHLY REPORT STATES
  ================================= */

  const [reportMonth, setReportMonth] = useState(getCurrentMonth());

  const [reportSearch, setReportSearch] = useState("");

  /* =================================
     FORM DATA
  ================================= */

  const getInitialFormData = () => ({
    studentId: "",
    feeMonth: getCurrentMonth(),
    feeAmount: "",
    paymentDate: getToday(),
    paymentStatus: "Paid",
    notes: "",
  });

  const [formData, setFormData] = useState(getInitialFormData);

  /* =================================
     AUTH ERROR HANDLER
  ================================= */

  const handleUnauthorized = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminInfo");

    window.location.href = "/admin/login";
  };

  /* =================================
     LOAD STUDENTS FROM MONGODB
  ================================= */

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      setStudentError("");

      const token = getAdminToken();

      if (!token) {
        handleUnauthorized();
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
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load students."
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

  /* =================================
     LOAD FEES FROM MONGODB
  ================================= */

  const fetchFees = async () => {
    try {
      setLoadingFees(true);
      setFeeError("");

      const token = getAdminToken();

      if (!token) {
        handleUnauthorized();
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/fees`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load fee records."
        );
      }

      setFeeRecords(
        Array.isArray(data.fees)
          ? data.fees
          : []
      );
    } catch (error) {
      console.error("Fetch fees error:", error);

      setFeeError(
        error.message ||
          "Unable to load fee records from the database."
      );
    } finally {
      setLoadingFees(false);
    }
  };

  /* =================================
     INITIAL DATABASE LOAD
  ================================= */

  useEffect(() => {
    fetchStudents();
    fetchFees();
  }, []);

  /* =================================
     FEE CALCULATION

     AIMS ACADEMY RULE:
     1st–10th = No Fine
     After 10th = Rs. 100 Per Day
  ================================= */

  const calculateLateDays = (paymentDate) => {
    if (!paymentDate) {
      return 0;
    }

    const date = new Date(`${paymentDate}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return 0;
    }

    const day = date.getDate();

    if (day <= 10) {
      return 0;
    }

    return day - 10;
  };

  const calculateFine = (paymentDate) => {
    const lateDays = calculateLateDays(paymentDate);

    return lateDays * 100;
  };

  const calculateTotal = (
    feeAmount,
    paymentDate,
    paymentStatus
  ) => {
    const amount = Number(feeAmount) || 0;

    if (paymentStatus !== "Paid") {
      return amount;
    }

    return amount + calculateFine(paymentDate);
  };

  /* =================================
     FORM HANDLER
  ================================= */

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =================================
     SELECT STUDENT
  ================================= */

  const handleSelectStudent = (student) => {
    setFormData((previous) => ({
      ...previous,
      studentId: student.studentId || "",
    }));

    setSelectedStudentId(student.studentId || "");

    setSearch(student.name || student.studentId || "");

    setShowStudentList(false);
  };

  /* =================================
     SELECTED STUDENT
  ================================= */

  const selectedStudent = students.find(
    (student) =>
      student.studentId === formData.studentId
  );

  /* =================================
     SEARCH STUDENTS
  ================================= */

  const searchedStudents = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) {
      return students;
    }

    return students.filter(
      (student) =>
        student.name
          ?.toLowerCase()
          .includes(searchValue) ||
        student.studentId
          ?.toLowerCase()
          .includes(searchValue) ||
        student.fatherName
          ?.toLowerCase()
          .includes(searchValue)
    );
  }, [students, search]);

  /* =================================
     OPEN ADD FORM
  ================================= */

  const openAddForm = () => {
    setFormData(getInitialFormData());

    setEditingFeeId(null);
    setSearch("");
    setSelectedStudentId("");
    setShowStudentList(false);
    setFeeError("");
    setShowForm(true);
  };

  /* =================================
     OPEN EDIT FORM
  ================================= */

  const handleEditFee = (record) => {
    const student = students.find(
      (item) =>
        item.studentId === record.studentId
    );

    setFormData({
      studentId: record.studentId || "",

      feeMonth:
        record.feeMonth ||
        getCurrentMonth(),

      feeAmount:
        record.feeAmount !== undefined
          ? String(record.feeAmount)
          : "",

      /*
        Pending records do not need a payment
        date. Paid records keep their original
        payment date.
      */
      paymentDate:
        record.paymentStatus === "Paid"
          ? record.paymentDate || getToday()
          : record.paymentDate || "",

      paymentStatus:
        record.paymentStatus ||
        "Paid",

      notes: record.notes || "",
    });

    setSearch(
      student
        ? student.name
        : record.studentId || ""
    );

    setSelectedStudentId(record.studentId || "");

    setEditingFeeId(record.feeId || null);

    setShowDetails(false);
    setSelectedFeeRecord(null);
    setFeeError("");
    setShowForm(true);
  };

  /* =================================
     SAVE / UPDATE FEE
  ================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.studentId) {
      window.alert("Please select a student.");
      return;
    }

    if (
      !formData.feeAmount ||
      Number(formData.feeAmount) <= 0
    ) {
      window.alert(
        "Please enter a valid monthly fee amount."
      );
      return;
    }

    if (!formData.feeMonth) {
      window.alert("Please select the fee month.");
      return;
    }

    /*
      Payment date is required ONLY when
      the fee is Paid.

      Pending records can exist without
      a payment date.
    */
    if (
      formData.paymentStatus === "Paid" &&
      !formData.paymentDate
    ) {
      window.alert(
        "Please select the payment date."
      );
      return;
    }

    /* =================================
       DUPLICATE MONTH CHECK
       DATABASE ALSO ENFORCES THIS

       IMPORTANT:
       editing the current record is allowed.
       Creating another record for the same
       student + month is not allowed.
    ================================= */

    const duplicateRecord = feeRecords.find(
      (record) =>
        record.studentId === formData.studentId &&
        record.feeMonth === formData.feeMonth &&
        record.feeId !== editingFeeId
    );

    if (duplicateRecord) {
      window.alert(
        "A fee record for this student and month already exists."
      );
      return;
    }

    /* =================================
       CALCULATE PAYMENT

       Pending:
       - lateDays = 0
       - fine = 0
       - total = monthly fee

       Paid:
       - calculate late days
       - calculate fine
       - calculate total
    ================================= */

    const isPaid =
      formData.paymentStatus === "Paid";

    const paymentDate = isPaid
      ? formData.paymentDate
      : "";

    const lateDays = isPaid
      ? calculateLateDays(paymentDate)
      : 0;

    const fine = isPaid
      ? calculateFine(paymentDate)
      : 0;

    const totalAmount = calculateTotal(
      formData.feeAmount,
      paymentDate,
      formData.paymentStatus
    );

    /* =================================
       AUTH
    ================================= */

    const token = getAdminToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    setSavingFee(true);
    setFeeError("");

    try {
      /* =================================
         PAYLOAD
      ================================= */

      const feePayload = {
        studentId: formData.studentId,
        feeMonth: formData.feeMonth,
        feeAmount: Number(formData.feeAmount),
        paymentDate,
        lateDays,
        fine,
        totalAmount,
        paymentStatus: formData.paymentStatus,
        notes: formData.notes.trim(),
      };

      /* =================================
         UPDATE EXISTING FEE

         This is what happens when the
         user edits Pending -> Paid.

         It uses PUT with the existing
         feeId, so NO new record is created.
      ================================= */

      if (editingFeeId) {
        const response = await fetch(
          `${API_BASE_URL}/fees/${editingFeeId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(feePayload),
          }
        );

        const data = await response.json();

        if (response.status === 401) {
          handleUnauthorized();
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to update fee record."
          );
        }

        /*
          Do not temporarily put data.student
          into feeRecords.

          The fee table must contain fee
          records only.

          Refresh directly from MongoDB after
          the update so the UI and database
          stay synchronized.
        */

        await fetchFees();

        window.alert(
          "Fee record updated successfully."
        );
      }

      /* =================================
         ADD NEW FEE
      ================================= */

      else {
        const response = await fetch(
          `${API_BASE_URL}/fees`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(feePayload),
          }
        );

        const data = await response.json();

        if (response.status === 401) {
          handleUnauthorized();
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to save fee record."
          );
        }

        if (data.fee) {
          setFeeRecords((previous) => [
            data.fee,
            ...previous,
          ]);
        } else {
          await fetchFees();
        }

        window.alert(
          "Fee record added successfully."
        );
      }

      /* =================================
         RESET FORM
      ================================= */

      setFormData(getInitialFormData());

      setSearch("");
      setSelectedStudentId("");
      setEditingFeeId(null);
      setShowStudentList(false);
      setShowForm(false);
    } catch (error) {
      console.error("Save fee error:", error);

      setFeeError(
        error.message ||
          "Unable to save the fee record."
      );

      window.alert(
        error.message ||
          "Unable to save the fee record."
      );
    } finally {
      setSavingFee(false);
    }
  };

  /* =================================
     DELETE FEE RECORD
  ================================= */

  const handleDeleteFee = async (record) => {
    const student = students.find(
      (item) =>
        item.studentId === record.studentId
    );

    const studentName =
      student?.name ||
      record.studentId ||
      "this student";

    const confirmed = window.confirm(
      `Are you sure you want to delete the fee record for ${studentName}?`
    );

    if (!confirmed) {
      return;
    }

    const token = getAdminToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    setDeletingFeeId(record.feeId);
    setFeeError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/fees/${record.feeId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete fee record."
        );
      }

      setFeeRecords((previous) =>
        previous.filter(
          (item) =>
            item.feeId !== record.feeId
        )
      );

      if (
        selectedFeeRecord?.feeId ===
        record.feeId
      ) {
        setShowDetails(false);
        setSelectedFeeRecord(null);
      }

      window.alert(
        "Fee record deleted successfully."
      );
    } catch (error) {
      console.error("Delete fee error:", error);

      setFeeError(
        error.message ||
          "Unable to delete the fee record."
      );

      window.alert(
        error.message ||
          "Unable to delete the fee record."
      );
    } finally {
      setDeletingFeeId(null);
    }
  };

  /* =================================
     VIEW FEE DETAILS
  ================================= */

  const handleViewFee = (record) => {
    setSelectedFeeRecord(record);
    setShowDetails(true);
  };

  /* =================================
     FILTER FEE RECORDS
  ================================= */

  const filteredFeeRecords = useMemo(() => {
    const searchValue =
      feeSearch.toLowerCase().trim();

    if (!searchValue) {
      return feeRecords;
    }

    return feeRecords.filter((record) => {
      const student = students.find(
        (item) =>
          item.studentId === record.studentId
      );

      return (
        record.studentId
          ?.toLowerCase()
          .includes(searchValue) ||
        student?.name
          ?.toLowerCase()
          .includes(searchValue) ||
        student?.fatherName
          ?.toLowerCase()
          .includes(searchValue)
      );
    });
  }, [feeRecords, students, feeSearch]);

  /* =================================
     FEE STATISTICS
  ================================= */

  const totalFees = feeRecords.reduce(
    (total, record) =>
      total +
      (Number(record.totalAmount) || 0),
    0
  );

  const collectedFees = feeRecords
    .filter(
      (record) =>
        record.paymentStatus === "Paid"
    )
    .reduce(
      (total, record) =>
        total +
        (Number(record.totalAmount) || 0),
      0
    );

  const pendingFees = feeRecords
    .filter(
      (record) =>
        record.paymentStatus !== "Paid"
    )
    .reduce(
      (total, record) =>
        total +
        (Number(record.totalAmount) || 0),
      0
    );

  const totalFines = feeRecords.reduce(
    (total, record) =>
      total +
      (Number(record.fine) || 0),
    0
  );

  /* =================================
     MONTHLY REPORT
  ================================= */

  const activeStudents = students.filter(
    (student) =>
      student.status !== "Inactive"
  );

  const monthlyRecords = useMemo(() => {
    return feeRecords.filter(
      (record) =>
        record.feeMonth === reportMonth
    );
  }, [feeRecords, reportMonth]);

  const paidMonthlyRecords =
    monthlyRecords.filter(
      (record) =>
        record.paymentStatus === "Paid"
    );

  const pendingMonthlyRecords =
    monthlyRecords.filter(
      (record) =>
        record.paymentStatus !== "Paid"
    );

  const paidStudentIds = new Set(
    paidMonthlyRecords.map(
      (record) =>
        record.studentId
    )
  );

  const pendingStudentIds = new Set(
    pendingMonthlyRecords.map(
      (record) =>
        record.studentId
    )
  );

  const monthlyPaidStudents =
    activeStudents.filter(
      (student) =>
        paidStudentIds.has(
          student.studentId
        )
    );

  const monthlyPendingStudents =
    activeStudents.filter(
      (student) =>
        !paidStudentIds.has(
          student.studentId
        )
    );

  const monthlyCollected =
    paidMonthlyRecords.reduce(
      (total, record) =>
        total +
        (Number(record.totalAmount) || 0),
      0
    );

  const monthlyPendingAmount =
    pendingMonthlyRecords.reduce(
      (total, record) =>
        total +
        (Number(record.totalAmount) || 0),
      0
    );

  /* =================================
     MONTHLY REPORT SEARCH
  ================================= */

  const reportSearchValue =
    reportSearch.toLowerCase().trim();

  const filteredPaidStudents =
    monthlyPaidStudents.filter(
      (student) =>
        !reportSearchValue ||
        student.name
          ?.toLowerCase()
          .includes(reportSearchValue) ||
        student.studentId
          ?.toLowerCase()
          .includes(reportSearchValue) ||
        student.fatherName
          ?.toLowerCase()
          .includes(reportSearchValue)
    );

  const filteredPendingStudents =
    monthlyPendingStudents.filter(
      (student) =>
        !reportSearchValue ||
        student.name
          ?.toLowerCase()
          .includes(reportSearchValue) ||
        student.studentId
          ?.toLowerCase()
          .includes(reportSearchValue) ||
        student.fatherName
          ?.toLowerCase()
          .includes(reportSearchValue)
    );

  /* =================================
     GET MONTHLY RECORD FOR STUDENT
  ================================= */

  const getMonthlyRecord = (studentId) => {
    return monthlyRecords.find(
      (record) =>
        record.studentId === studentId
    );
  };

  /* =================================
     CURRENT FORM CALCULATIONS
  ================================= */

  const currentLateDays =
    formData.paymentStatus === "Paid"
      ? calculateLateDays(
          formData.paymentDate
        )
      : 0;

  const currentFine =
    formData.paymentStatus === "Paid"
      ? calculateFine(
          formData.paymentDate
        )
      : 0;

  const currentTotal = calculateTotal(
    formData.feeAmount,
    formData.paymentDate,
    formData.paymentStatus
  );

  /* =================================
     FORMAT CURRENCY
  ================================= */

  const formatRs = (amount) => {
    return `Rs. ${Number(
      amount || 0
    ).toLocaleString("en-PK")}`;
  };

  /* =================================
     FORMAT MONTH
  ================================= */

  const formatFeeMonth = (month) => {
    if (!month) {
      return "Not provided";
    }

    const date = new Date(
      `${month}-01T00:00:00`
    );

    if (Number.isNaN(date.getTime())) {
      return "Not provided";
    }

    return date.toLocaleDateString(
      "en-PK",
      {
        month: "long",
        year: "numeric",
      }
    );
  };

  /* =================================
     FORMAT DATE
  ================================= */

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Not provided";
    }

    const date = new Date(
      `${dateValue}T00:00:00`
    );

    if (Number.isNaN(date.getTime())) {
      return "Not provided";
    }

    return date.toLocaleDateString(
      "en-PK",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =================================
     CLOSE FORM
  ================================= */

  const closeForm = () => {
    if (savingFee) {
      return;
    }

    setShowForm(false);
    setEditingFeeId(null);

    setFormData(getInitialFormData());

    setSearch("");
    setSelectedStudentId("");
    setShowStudentList(false);
    setFeeError("");
  };

  /* =================================
     CLOSE DETAILS
  ================================= */

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedFeeRecord(null);
  };

  /* =================================
     LOADING STATE
  ================================= */

  const isLoading =
    loadingStudents || loadingFees;

  /* =================================
     RENDER
  ================================= */

  return (
    <section className="fees-page">

      {/* =================================
          PAGE HEADER
      ================================= */}

      <div className="fees-header">

        <div>

          <p className="section-label">
            FEE MANAGEMENT
          </p>

          <h1>
            Fees
          </h1>

          <p className="fees-description">
            Manage student fees, payments,
            pending dues, fines, and fee
            records from one place.
          </p>

        </div>

        <button
          type="button"
          className="fees-add-button"
          onClick={openAddForm}
          disabled={isLoading}
        >
          <Plus size={18} />
          Add Fee Record
        </button>

      </div>

      {/* =================================
          DATABASE ERROR
      ================================= */}

      {(studentError || feeError) && (

        <div className="fees-error-message">

          <AlertCircle size={18} />

          <span>
            {studentError || feeError}
          </span>

        </div>

      )}

      {/* =================================
          FEE OVERVIEW
      ================================= */}

      <div className="fees-stats">

        <div className="fees-stat-card">

          <div className="fees-stat-icon">
            <Receipt size={20} />
          </div>

          <div>
            <p>
              Total Fees
            </p>

            <h3>
              {formatRs(totalFees)}
            </h3>
          </div>

        </div>

        <div className="fees-stat-card">

          <div className="fees-stat-icon">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <p>
              Collected
            </p>

            <h3>
              {formatRs(collectedFees)}
            </h3>
          </div>

        </div>

        <div className="fees-stat-card">

          <div className="fees-stat-icon">
            <Clock3 size={20} />
          </div>

          <div>
            <p>
              Pending
            </p>

            <h3>
              {formatRs(pendingFees)}
            </h3>
          </div>

        </div>

        <div className="fees-stat-card">

          <div className="fees-stat-icon">
            <AlertCircle size={20} />
          </div>

          <div>
            <p>
              Fines
            </p>

            <h3>
              {formatRs(totalFines)}
            </h3>
          </div>

        </div>

      </div>

      {/* =================================
          MONTHLY FEE REPORT
      ================================= */}

      <div className="fees-monthly-report">

        <div className="fees-monthly-report-header">

          <div>

            <p className="section-label">
              MONTHLY REPORT
            </p>

            <h2>
              Monthly Fee Report
            </h2>

            <p>
              Check which students have paid
              and which students still have
              pending fees for a specific month.
            </p>

          </div>

          <div className="fees-monthly-report-controls">

            <div className="fees-month-selector">

              <CalendarDays size={17} />

              <input
                type="month"
                value={reportMonth}
                onChange={(e) =>
                  setReportMonth(
                    e.target.value
                  )
                }
              />

            </div>

            <div className="fees-monthly-search">

              <Search size={17} />

              <input
                type="text"
                placeholder="Search student..."
                value={reportSearch}
                onChange={(e) =>
                  setReportSearch(
                    e.target.value
                  )
                }
              />

            </div>

          </div>

        </div>

        {/* MONTHLY SUMMARY */}

        <div className="fees-monthly-summary">

          <div className="fees-monthly-summary-card">

            <div className="fees-monthly-summary-icon">
              <Users size={20} />
            </div>

            <div>
              <span>
                Total Active Students
              </span>

              <strong>
                {activeStudents.length}
              </strong>
            </div>

          </div>

          <div className="fees-monthly-summary-card">

            <div className="fees-monthly-summary-icon">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <span>
                Paid Students
              </span>

              <strong>
                {monthlyPaidStudents.length}
              </strong>
            </div>

          </div>

          <div className="fees-monthly-summary-card">

            <div className="fees-monthly-summary-icon">
              <Clock3 size={20} />
            </div>

            <div>
              <span>
                Pending Students
              </span>

              <strong>
                {monthlyPendingStudents.length}
              </strong>
            </div>

          </div>

          <div className="fees-monthly-summary-card">

            <div className="fees-monthly-summary-icon">
              <Receipt size={20} />
            </div>

            <div>
              <span>
                Collected This Month
              </span>

              <strong>
                {formatRs(monthlyCollected)}
              </strong>
            </div>

          </div>

        </div>

        {/* =================================
            PAID STUDENTS
        ================================= */}

        <div className="fees-monthly-list-section">

          <div className="fees-monthly-list-header">

            <div>

              <h3>
                Paid Students
              </h3>

              <p>
                Students who have paid their
                fee for{" "}
                {formatFeeMonth(reportMonth)}.
              </p>

            </div>

            <span className="fees-monthly-count paid">
              {filteredPaidStudents.length}
            </span>

          </div>

          {filteredPaidStudents.length === 0 ? (

            <div className="fees-monthly-empty">

              <CheckCircle2 size={26} />

              <span>
                No students have paid for
                this month.
              </span>

            </div>

          ) : (

            <div className="fees-monthly-student-list">

              {filteredPaidStudents.map(
                (student) => {

                  const record =
                    getMonthlyRecord(
                      student.studentId
                    );

                  return (
                    <div
                      className="fees-monthly-student-row"
                      key={student.studentId}
                    >

                      <div className="fees-monthly-student-info">

                        <div className="fees-monthly-student-icon">
                          <UserRound size={17} />
                        </div>

                        <div>

                          <strong>
                            {student.name}
                          </strong>

                          <span>
                            {student.studentId}{" "}
                            •{" "}
                            {student.className}
                          </span>

                        </div>

                      </div>

                      <div className="fees-monthly-student-payment">

                        <div>

                          <span>
                            Paid
                          </span>

                          <strong>
                            {formatRs(
                              record?.totalAmount
                            )}
                          </strong>

                        </div>

                        <div>

                          <span>
                            Payment Date
                          </span>

                          <strong>
                            {formatDate(
                              record?.paymentDate
                            )}
                          </strong>

                        </div>

                        <div className="fees-monthly-status paid">

                          <CheckCircle2 size={15} />

                          Paid

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          )}

        </div>

        {/* =================================
            PENDING STUDENTS
        ================================= */}

        <div className="fees-monthly-list-section">

          <div className="fees-monthly-list-header">

            <div>

              <h3>
                Pending Students
              </h3>

              <p>
                Students who have not paid
                their fee for{" "}
                {formatFeeMonth(reportMonth)}.
              </p>

            </div>

            <span className="fees-monthly-count pending">
              {filteredPendingStudents.length}
            </span>

          </div>

          {filteredPendingStudents.length === 0 ? (

            <div className="fees-monthly-empty">

              <CheckCircle2 size={26} />

              <span>
                All active students have paid
                for this month.
              </span>

            </div>

          ) : (

            <div className="fees-monthly-student-list">

              {filteredPendingStudents.map(
                (student) => {

                  const record =
                    getMonthlyRecord(
                      student.studentId
                    );

                  return (
                    <div
                      className="fees-monthly-student-row"
                      key={student.studentId}
                    >

                      <div className="fees-monthly-student-info">

                        <div className="fees-monthly-student-icon">
                          <UserRound size={17} />
                        </div>

                        <div>

                          <strong>
                            {student.name}
                          </strong>

                          <span>
                            {student.studentId}{" "}
                            •{" "}
                            {student.className}
                          </span>

                        </div>

                      </div>

                      <div className="fees-monthly-student-payment">

                        <div>

                          <span>
                            Status
                          </span>

                          <strong>
                            {record
                              ? record.paymentStatus
                              : "Pending"}
                          </strong>

                        </div>

                        <div>

                          <span>
                            Expected Fee
                          </span>

                          <strong>
                            {record
                              ? formatRs(
                                  record.totalAmount
                                )
                              : "Not recorded"}
                          </strong>

                        </div>

                        <div className="fees-monthly-status pending">

                          <Clock3 size={15} />

                          Pending

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          )}

        </div>

      </div>

      {/* =================================
          FEE MANAGEMENT SECTION
      ================================= */}

      <div className="fees-management-section">

        <div className="fees-section-header">

          <div>

            <p className="section-label">
              FEE RECORDS
            </p>

            <h2>
              Student Fee Records
            </h2>

            <p>
              Search students and manage
              monthly fee payments.
            </p>

          </div>

          <div className="fees-record-search">

            <Search size={17} />

            <input
              type="text"
              placeholder="Search by student or ID..."
              value={feeSearch}
              onChange={(e) =>
                setFeeSearch(
                  e.target.value
                )
              }
            />

          </div>

        </div>

        {/* =================================
            FEE TABLE
        ================================= */}

        {loadingFees ? (

          <div className="fees-empty-state">

            <div className="fees-empty-icon">
              <Receipt size={26} />
            </div>

            <h3>
              Loading Fee Records
            </h3>

            <p>
              Fetching fee records from
              MongoDB...
            </p>

          </div>

        ) : filteredFeeRecords.length === 0 ? (

          <div className="fees-empty-state">

            <div className="fees-empty-icon">
              <Receipt size={26} />
            </div>

            <h3>
              No Fee Records Found
            </h3>

            <p>
              Add a fee record to start
              managing student payments.
            </p>

            <button
              type="button"
              className="fees-empty-button"
              onClick={openAddForm}
            >
              <Plus size={17} />
              Add Fee Record
            </button>

          </div>

        ) : (

          <div className="fees-table-wrapper">

            <table className="fees-table">

              <thead>

                <tr>

                  <th>
                    Student
                  </th>

                  <th>
                    Fee Month
                  </th>

                  <th>
                    Fee
                  </th>

                  <th>
                    Fine
                  </th>

                  <th>
                    Total
                  </th>

                  <th>
                    Payment Date
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredFeeRecords.map(
                  (record) => {

                    const student =
                      students.find(
                        (item) =>
                          item.studentId ===
                          record.studentId
                      );

                    return (
                      <tr
                        key={record.feeId}
                      >

                        <td>

                          <div className="fees-student-cell">

                            <div className="fees-student-icon">
                              <UserRound size={16} />
                            </div>

                            <div>

                              <strong>
                                {
                                  student?.name ||
                                  "Unknown Student"
                                }
                              </strong>

                              <span>
                                {record.studentId}
                              </span>

                            </div>

                          </div>

                        </td>

                        <td>
                          {formatFeeMonth(
                            record.feeMonth
                          )}
                        </td>

                        <td>
                          {formatRs(
                            record.feeAmount
                          )}
                        </td>

                        <td>

                          {Number(record.fine) > 0 ? (

                            <span className="fees-fine-value">
                              {formatRs(
                                record.fine
                              )}
                            </span>

                          ) : (

                            <span className="fees-no-fine">
                              Rs. 0
                            </span>

                          )}

                        </td>

                        <td>

                          <strong>
                            {formatRs(
                              record.totalAmount
                            )}
                          </strong>

                        </td>

                        <td>
                          {formatDate(
                            record.paymentDate
                          )}
                        </td>

                        <td>

                          <span
                            className={
                              record.paymentStatus ===
                              "Paid"
                                ? "fee-payment-status paid"
                                : "fee-payment-status pending"
                            }
                          >
                            {record.paymentStatus}
                          </span>

                        </td>

                        <td>

                          <div className="fees-actions">

                            <button
                              type="button"
                              title="View Details"
                              onClick={() =>
                                handleViewFee(
                                  record
                                )
                              }
                            >
                              <Eye size={16} />
                            </button>

                            <button
                              type="button"
                              title="Edit Fee"
                              onClick={() =>
                                handleEditFee(
                                  record
                                )
                              }
                              disabled={
                                deletingFeeId ===
                                record.feeId
                              }
                            >
                              <Edit3 size={16} />
                            </button>

                            <button
                              type="button"
                              title="Delete Fee"
                              className="fees-delete-action"
                              onClick={() =>
                                handleDeleteFee(
                                  record
                                )
                              }
                              disabled={
                                deletingFeeId ===
                                record.feeId
                              }
                            >
                              <Trash2 size={16} />
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
          ADD / EDIT FEE MODAL
      ================================= */}

      {showForm && (

        <div
          className="fees-modal-overlay"
          onClick={closeForm}
        >

          <div
            className="fees-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="fees-modal-header">

              <div>

                <p className="section-label">
                  {editingFeeId
                    ? "UPDATE PAYMENT"
                    : "NEW FEE RECORD"}
                </p>

                <h2>
                  {editingFeeId
                    ? "Edit Fee Record"
                    : "Add Fee Record"}
                </h2>

              </div>

              <button
                type="button"
                className="fees-modal-close"
                onClick={closeForm}
                disabled={savingFee}
              >
                <X size={20} />
              </button>

            </div>

            {feeError && (

              <div className="fees-error-message">

                <AlertCircle size={18} />

                <span>
                  {feeError}
                </span>

              </div>

            )}

            <form
              className="fees-form"
              onSubmit={handleSubmit}
            >

              {/* STUDENT */}

              <div className="fees-form-section">

                <h3>
                  Student Information
                </h3>

                <div className="fees-form-grid">

                  <div className="fees-form-field fees-form-full">

                    <label>
                      Student *
                    </label>

                    <div className="fees-student-search">

                      <Search size={17} />

                      <input
                        type="text"
                        value={search}
                        onChange={(e) => {

                          const value =
                            e.target.value;

                          setSearch(value);

                          setShowStudentList(true);

                          if (
                            value !==
                            selectedStudent?.name
                          ) {
                            setSelectedStudentId("");

                            setFormData(
                              (previous) => ({
                                ...previous,
                                studentId: "",
                              })
                            );
                          }

                        }}
                        onFocus={() =>
                          setShowStudentList(true)
                        }
                        placeholder="Search student by name or ID..."
                        required
                      />

                    </div>

                    {showStudentList && (

                      <div className="fees-student-dropdown">

                        {searchedStudents.length === 0 ? (

                          <div className="fees-dropdown-empty">
                            {loadingStudents
                              ? "Loading students..."
                              : "No students found."}
                          </div>

                        ) : (

                          searchedStudents.map(
                            (student) => (

                              <button
                                type="button"
                                key={
                                  student.studentId
                                }
                                className={
                                  selectedStudentId ===
                                  student.studentId
                                    ? "fees-student-option selected"
                                    : "fees-student-option"
                                }
                                onClick={() =>
                                  handleSelectStudent(
                                    student
                                  )
                                }
                              >

                                <div className="fees-option-icon">

                                  <UserRound size={16} />

                                </div>

                                <div>

                                  <strong>
                                    {student.name}
                                  </strong>

                                  <span>
                                    {
                                      student.studentId
                                    }{" "}
                                    •{" "}
                                    {
                                      student.className
                                    }
                                  </span>

                                </div>

                              </button>

                            )
                          )

                        )}

                      </div>

                    )}

                  </div>

                  {selectedStudent && (

                    <div className="fees-selected-student">

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
                          Class
                        </span>

                        <strong>
                          {
                            selectedStudent.className
                          }
                        </strong>

                      </div>

                    </div>

                  )}

                </div>

              </div>

              {/* FEE INFORMATION */}

              <div className="fees-form-section">

                <h3>
                  Fee Information
                </h3>

                <div className="fees-form-grid">

                  <div className="fees-form-field">

                    <label>
                      Fee Month *
                    </label>

                    <input
                      type="month"
                      name="feeMonth"
                      value={
                        formData.feeMonth
                      }
                      onChange={
                        handleInputChange
                      }
                      required
                    />

                  </div>

                  <div className="fees-form-field">

                    <label>
                      Monthly Fee *
                    </label>

                    <div className="fees-amount-input">

                      <span>
                        Rs.
                      </span>

                      <input
                        type="number"
                        name="feeAmount"
                        value={
                          formData.feeAmount
                        }
                        onChange={
                          handleInputChange
                        }
                        placeholder="Enter fee amount"
                        min="1"
                        step="1"
                        required
                      />

                    </div>

                  </div>

                  <div className="fees-form-field">

                    <label>
                      Payment Date *
                    </label>

                    <div className="fees-date-input">

                      <CalendarDays size={17} />

                      <input
                        type="date"
                        name="paymentDate"
                        value={
                          formData.paymentDate
                        }
                        onChange={
                          handleInputChange
                        }
                        required={
                          formData.paymentStatus ===
                          "Paid"
                        }
                      />

                    </div>

                  </div>

                  <div className="fees-form-field">

                    <label>
                      Payment Status *
                    </label>

                    <select
                      name="paymentStatus"
                      value={
                        formData.paymentStatus
                      }
                      onChange={(e) => {
                        const { value } = e.target;

                        setFormData(
                          (previous) => ({
                            ...previous,
                            paymentStatus: value,

                            /*
                              When changing Pending
                              to Paid, keep an existing
                              date if one exists.

                              When changing to Pending,
                              the payment date is not
                              required anymore.
                            */
                            paymentDate:
                              value === "Paid"
                                ? previous.paymentDate ||
                                  getToday()
                                : previous.paymentDate,
                          })
                        );
                      }}
                      required
                    >

                      <option value="Paid">
                        Paid
                      </option>

                      <option value="Pending">
                        Pending
                      </option>

                    </select>

                  </div>

                  <div className="fees-form-field fees-form-full">

                    <label>
                      Notes
                    </label>

                    <textarea
                      name="notes"
                      value={
                        formData.notes
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="Add any notes about this payment..."
                      rows="3"
                    />

                  </div>

                </div>

              </div>

              {/* CALCULATION */}

              <div className="fees-calculation">

                <div className="fees-calculation-row">

                  <span>
                    Monthly Fee
                  </span>

                  <strong>
                    {formatRs(
                      formData.feeAmount
                    )}
                  </strong>

                </div>

                <div className="fees-calculation-row">

                  <span>
                    Late Days
                  </span>

                  <strong>
                    {currentLateDays}
                  </strong>

                </div>

                <div className="fees-calculation-row">

                  <span>
                    Late Fine
                  </span>

                  <strong
                    className={
                      currentFine > 0
                        ? "fees-fine-highlight"
                        : ""
                    }
                  >
                    {formatRs(currentFine)}
                  </strong>

                </div>

                <div className="fees-calculation-divider" />

                <div className="fees-calculation-row total">

                  <span>
                    Total Payable
                  </span>

                  <strong>
                    {formatRs(currentTotal)}
                  </strong>

                </div>

                {currentLateDays > 0 && (

                  <div className="fees-late-notice">

                    <AlertCircle size={16} />

                    <span>
                      Payment is{" "}
                      {currentLateDays} day
                      {currentLateDays !== 1
                        ? "s"
                        : ""}{" "}
                      late. A fine of Rs. 100
                      per day has been applied.
                    </span>

                  </div>

                )}

                {currentLateDays === 0 && (

                  <div className="fees-on-time-notice">

                    <CheckCircle2 size={16} />

                    <span>
                      Payment is within the
                      1st–10th normal payment
                      period. No late fine.
                    </span>

                  </div>

                )}

              </div>

              {/* ACTIONS */}

              <div className="fees-form-actions">

                <button
                  type="button"
                  className="fees-cancel-button"
                  onClick={closeForm}
                  disabled={savingFee}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="fees-save-button"
                  disabled={savingFee}
                >

                  {savingFee ? (
                    <>
                      <Clock3 size={17} />
                      {editingFeeId
                        ? "Updating..."
                        : "Saving..."}
                    </>
                  ) : (
                    <>
                      {editingFeeId ? (
                        <Edit3 size={17} />
                      ) : (
                        <Plus size={17} />
                      )}

                      {editingFeeId
                        ? "Update Fee"
                        : "Save Fee"}
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =================================
          FEE DETAILS MODAL
      ================================= */}

      {showDetails &&
        selectedFeeRecord && (

          <div
            className="fees-modal-overlay"
            onClick={closeDetails}
          >

            <div
              className="fees-details-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="fees-modal-header">

                <div>

                  <p className="section-label">
                    FEE RECORD
                  </p>

                  <h2>
                    Payment Details
                  </h2>

                </div>

                <button
                  type="button"
                  className="fees-modal-close"
                  onClick={closeDetails}
                >
                  <X size={20} />
                </button>

              </div>

              <div className="fees-details-grid">

                <div>

                  <span>
                    Fee ID
                  </span>

                  <strong>
                    {
                      selectedFeeRecord.feeId
                    }
                  </strong>

                </div>

                <div>

                  <span>
                    Student ID
                  </span>

                  <strong>
                    {
                      selectedFeeRecord.studentId
                    }
                  </strong>

                </div>

                <div>

                  <span>
                    Student
                  </span>

                  <strong>
                    {
                      students.find(
                        (student) =>
                          student.studentId ===
                          selectedFeeRecord.studentId
                      )?.name ||
                      "Unknown Student"
                    }
                  </strong>

                </div>

                <div>

                  <span>
                    Father's Name
                  </span>

                  <strong>
                    {
                      students.find(
                        (student) =>
                          student.studentId ===
                          selectedFeeRecord.studentId
                      )?.fatherName ||
                      "Not provided"
                    }
                  </strong>

                </div>

                <div>

                  <span>
                    Class
                  </span>

                  <strong>
                    {
                      students.find(
                        (student) =>
                          student.studentId ===
                          selectedFeeRecord.studentId
                      )?.className ||
                      "Not provided"
                    }
                  </strong>

                </div>

                <div>

                  <span>
                    Fee Month
                  </span>

                  <strong>
                    {formatFeeMonth(
                      selectedFeeRecord.feeMonth
                    )}
                  </strong>

                </div>

                <div>

                  <span>
                    Payment Date
                  </span>

                  <strong>
                    {formatDate(
                      selectedFeeRecord.paymentDate
                    )}
                  </strong>

                </div>

                <div>

                  <span>
                    Monthly Fee
                  </span>

                  <strong>
                    {formatRs(
                      selectedFeeRecord.feeAmount
                    )}
                  </strong>

                </div>

                <div>

                  <span>
                    Late Days
                  </span>

                  <strong>
                    {
                      selectedFeeRecord.lateDays ||
                      0
                    }
                  </strong>

                </div>

                <div>

                  <span>
                    Late Fine
                  </span>

                  <strong
                    className={
                      Number(
                        selectedFeeRecord.fine
                      ) > 0
                        ? "fees-fine-highlight"
                        : ""
                    }
                  >
                    {formatRs(
                      selectedFeeRecord.fine
                    )}
                  </strong>

                </div>

                <div>

                  <span>
                    Total Paid
                  </span>

                  <strong className="fees-details-total">
                    {formatRs(
                      selectedFeeRecord.totalAmount
                    )}
                  </strong>

                </div>

                <div>

                  <span>
                    Payment Status
                  </span>

                  <strong>
                    {
                      selectedFeeRecord.paymentStatus
                    }
                  </strong>

                </div>

                {selectedFeeRecord.notes && (

                  <div className="fees-details-full">

                    <span>
                      Notes
                    </span>

                    <strong>
                      {
                        selectedFeeRecord.notes
                      }
                    </strong>

                  </div>

                )}

              </div>

              <div className="fees-details-footer">

                <button
                  type="button"
                  className="fees-cancel-button"
                  onClick={closeDetails}
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

export default Fees;
