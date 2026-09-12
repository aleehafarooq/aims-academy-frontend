import { useEffect, useMemo, useState } from "react";
import {
  Users,
  ClipboardCheck,
  WalletCards,
  Award,
  GraduationCap,
  TrendingUp,
  UserX,
  BarChart3,
  ArrowRight,
  X,
  Search,
  Printer,
  MessageCircle,
  FileDown,
} from "lucide-react";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import logo from "../assets/aims-logo.jpg.jpeg";

function Reports() {
  /* =================================
     LOCAL STORAGE HELPER
  ================================= */

  const readStorage = (keys, fallback = []) => {
    for (const key of keys) {
      const saved = localStorage.getItem(key);

      if (saved) {
        try {
          const parsed = JSON.parse(saved);

          if (Array.isArray(parsed)) {
            return parsed;
          }

          if (
            parsed &&
            typeof parsed === "object"
          ) {
            return Array.isArray(parsed.data)
              ? parsed.data
              : Array.isArray(parsed.records)
              ? parsed.records
              : Array.isArray(parsed.items)
              ? parsed.items
              : [];
          }
        } catch (error) {
          console.error(
            `Unable to read ${key}:`,
            error
          );
        }
      }
    }

    return fallback;
  };

  /* =================================
     STUDENTS
  ================================= */

  const [students, setStudents] = useState(() =>
    readStorage(["aims_students"])
  );

  /* =================================
     RESULTS
  ================================= */

  const [results, setResults] = useState(() =>
    readStorage([
      "aims_results",
      "aims_result_records",
    ])
  );

  /* =================================
     ATTENDANCE
  ================================= */

  const [attendance, setAttendance] =
    useState(() =>
      readStorage([
        "aims_attendance",
        "aims_attendance_records",
        "attendance_records",
      ])
    );

  /* =================================
     FEES
  ================================= */

  const [fees, setFees] = useState(() =>
    readStorage([
      "aims_fees",
      "aims_fee_records",
      "aims_fee_vouchers",
      "fee_records",
    ])
  );

  /* =================================
     REPORT STATE
  ================================= */

  const [selectedReport, setSelectedReport] =
    useState(null);

  const [reportSearch, setReportSearch] =
    useState("");

  const [generatingPdf, setGeneratingPdf] =
    useState(false);

  const [selectedClass, setSelectedClass] =
    useState("");

  const [selectedAcademicStudent, setSelectedAcademicStudent] =
    useState("");

  /* =================================
     KEEP DATA UPDATED
  ================================= */

  useEffect(() => {
    const handleStorageChange = () => {
      setStudents(
        readStorage(["aims_students"])
      );

      setResults(
        readStorage([
          "aims_results",
          "aims_result_records",
        ])
      );

      setAttendance(
        readStorage([
          "aims_attendance",
          "aims_attendance_records",
          "attendance_records",
        ])
      );

      setFees(
        readStorage([
          "aims_fees",
          "aims_fee_records",
          "aims_fee_vouchers",
          "fee_records",
        ])
      );
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);

  /* =================================
     REPORT OPTIONS
  ================================= */

  const reportOptions = [
    {
      id: "students",
      title: "Student Report",
      description:
        "View student information, class distribution, and overall student records.",
      icon: Users,
    },
    {
      id: "attendance",
      title: "Attendance Report",
      description:
        "View present and absent attendance records for all students.",
      icon: ClipboardCheck,
    },
    {
      id: "fees",
      title: "Fee Collection Report",
      description:
        "View only the students whose fees have been paid.",
      icon: WalletCards,
    },
    {
      id: "results",
      title: "Result Report",
      description:
        "View examination results, subject-wise marks, grades, and student performance.",
      icon: Award,
    },
    {
      id: "class-performance",
      title: "Class Performance",
      description:
        "Select a class and view its overall academic performance.",
      icon: GraduationCap,
    },
    {
      id: "academic-performance",
      title: "Academic Performance",
      description:
        "Select a student and view subject-wise academic performance in graphs.",
      icon: TrendingUp,
    },
    {
      id: "fee-defaulters",
      title: "Fee Defaulters",
      description:
        "View students who have not paid their fees.",
      icon: UserX,
    },
    {
      id: "student-strength",
      title: "Student Strength",
      description:
        "View the number of students across different classes and sections.",
      icon: BarChart3,
    },
  ];

  /* =================================
     OPEN REPORT
  ================================= */

  const handleOpenReport = (report) => {
    setSelectedReport(report);
    setReportSearch("");
    setSelectedClass("");
    setSelectedAcademicStudent("");

    setStudents(
      readStorage(["aims_students"])
    );

    setResults(
      readStorage([
        "aims_results",
        "aims_result_records",
      ])
    );

    setAttendance(
      readStorage([
        "aims_attendance",
        "aims_attendance_records",
        "attendance_records",
      ])
    );

    setFees(
      readStorage([
        "aims_fees",
        "aims_fee_records",
        "aims_fee_vouchers",
        "fee_records",
      ])
    );
  };

  /* =================================
     CLOSE REPORT
  ================================= */

  const handleCloseReport = () => {
    setSelectedReport(null);
    setReportSearch("");
    setSelectedClass("");
    setSelectedAcademicStudent("");
  };

  /* =================================
     PRINT
     ONLY RESULT + ACADEMIC
  ================================= */

  const handlePrintReport = () => {
    window.print();
  };

  /* =================================
     GRADE
  ================================= */

  const getGrade = (percentage) => {
    if (percentage >= 80) return "A+";
    if (percentage >= 70) return "A";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    if (percentage >= 40) return "D";
    return "F";
  };

  /* =================================
     FORMAT PERCENTAGE
  ================================= */

  const formatPercentage = (percentage) => {
    return `${Number(
      percentage || 0
    ).toFixed(1)}%`;
  };

  /* =================================
     SUBJECT STATUS
  ================================= */

  const getSubjectStatus = (subject) => {
    const total = Number(
      subject.totalMarks || 0
    );

    const obtained = Number(
      subject.obtainedMarks || 0
    );

    if (total === 0) {
      return "Fail";
    }

    return obtained >= total * 0.4
      ? "Pass"
      : "Fail";
  };

  /* =================================
     SUBJECT PERCENTAGE
  ================================= */

  const getSubjectPercentage = (subject) => {
    const total = Number(
      subject.totalMarks || 0
    );

    const obtained = Number(
      subject.obtainedMarks || 0
    );

    if (total === 0) {
      return 0;
    }

    return (obtained / total) * 100;
  };

  /* =================================
     RESULT REMARKS
  ================================= */

  const getResultRemarks = (
    result,
    percentage
  ) => {
    return (
      result.notes ||
      (percentage >= 80
        ? "Excellent academic performance. Keep up the good work."
        : percentage >= 70
        ? "Very good academic performance. Keep working hard."
        : percentage >= 60
        ? "Good academic performance. There is room for further improvement."
        : percentage >= 40
        ? "Satisfactory performance. More effort is required for further improvement."
        : "Academic performance needs significant improvement.")
    );
  };

  /* =================================
     WHATSAPP MESSAGE
  ================================= */

  const buildWhatsAppMessage = (
    result,
    student
  ) => {
    const totalMarks = Number(
      result.totalMarks || 0
    );

    const obtainedMarks = Number(
      result.obtainedMarks || 0
    );

    const percentage = Number(
      result.percentage || 0
    );

    const grade =
      result.grade ||
      getGrade(percentage);

    const status =
      result.status ||
      (percentage >= 40
        ? "Pass"
        : "Fail");

    const subjectLines =
      result.subjects?.length > 0
        ? result.subjects
            .map((subject, index) => {
              const subjectPercentage =
                getSubjectPercentage(
                  subject
                );

              const subjectGrade =
                getGrade(
                  subjectPercentage
                );

              const subjectStatus =
                getSubjectStatus(
                  subject
                );

              return (
                `${index + 1}. ${subject.name}: ` +
                `${subject.obtainedMarks}/${subject.totalMarks} ` +
                `(${formatPercentage(
                  subjectPercentage
                )}) - ${subjectGrade} - ${subjectStatus}`
              );
            })
            .join("\n")
        : "No subject-wise marks available.";

    const remarks =
      getResultRemarks(
        result,
        percentage
      );

    return `*AIMS ACADEMY*
*Student Academic Result Report*

Dear Parent / Guardian,

The academic result of your child is as follows:

*Student Information*
Student: ${student?.name || "Unknown Student"}
Student ID: ${result.studentId || "Not Available"}
Father Name: ${student?.fatherName || "Not Provided"}
Class: ${student?.className || "Not Assigned"}
Category: ${student?.category || "Not Assigned"}
Stream: ${student?.stream || "—"}

*Examination*
${result.examName || "Examination"} • ${result.examYear || ""}

*SUBJECT-WISE PERFORMANCE*

${subjectLines}

*OVERALL PERFORMANCE*

Total Marks: ${totalMarks}
Obtained Marks: ${obtainedMarks}
Percentage: ${formatPercentage(
      percentage
    )}
Grade: ${grade}
Result: *${status.toUpperCase()}*

*Remarks*
${remarks}

Regards,
*AIMS Academy*`;
  };

  /* =================================
     PHONE NUMBER
  ================================= */

  const getStudentPhone = (student) => {
    const rawPhone =
      student?.phone ||
      student?.phoneNumber ||
      student?.parentPhone ||
      student?.parentPhoneNumber ||
      student?.guardianPhone ||
      student?.guardianPhoneNumber ||
      "";

    if (!rawPhone) {
      return "";
    }

    let phone = String(rawPhone).replace(
      /\D/g,
      ""
    );

    if (phone.startsWith("0")) {
      phone = `92${phone.substring(1)}`;
    }

    if (
      phone.length === 10 &&
      phone.startsWith("3")
    ) {
      phone = `92${phone}`;
    }

    return phone;
  };

  /* =================================
     GENERATE RESULT PDF
  ================================= */

  const generateResultPdf = async (
    result
  ) => {
    const element =
      document.getElementById(
        `result-report-${result.resultId}`
      );

    if (!element) {
      throw new Error(
        "Result report could not be found."
      );
    }

    const canvas =
      await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

    const imgData =
      canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = 210;
    const pdfHeight = 297;

    const imgWidth = pdfWidth;

    const imgHeight =
      (canvas.height * imgWidth) /
      canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(
      imgData,
      "PNG",
      0,
      position,
      imgWidth,
      imgHeight,
      undefined,
      "FAST"
    );

    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position =
        heightLeft - imgHeight;

      pdf.addPage();

      pdf.addImage(
        imgData,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight,
        undefined,
        "FAST"
      );

      heightLeft -= pdfHeight;
    }

    const studentName =
      students.find(
        (student) =>
          student.studentId ===
          result.studentId
      )?.name ||
      "Student";

    const safeStudentName =
      studentName
        .replace(
          /[^a-z0-9]/gi,
          "_"
        )
        .replace(
          /_+/g,
          "_"
        );

    const examName =
      result.examName ||
      "Examination";

    const safeExamName =
      examName
        .replace(
          /[^a-z0-9]/gi,
          "_"
        )
        .replace(
          /_+/g,
          "_"
        );

    const fileName =
      `AIMS_Academy_${safeStudentName}_${safeExamName}_Result.pdf`;

    const blob =
      pdf.output("blob");

    return {
      blob,
      fileName,
    };
  };

  /* =================================
     DOWNLOAD RESULT PDF
  ================================= */

  const handleDownloadPdf = async (
    result
  ) => {
    try {
      setGeneratingPdf(true);

      const {
        blob,
        fileName,
      } =
        await generateResultPdf(
          result
        );

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "PDF generation error:",
        error
      );

      alert(
        "Unable to generate the result PDF."
      );
    } finally {
      setGeneratingPdf(false);
    }
  };

  /* =================================
     SEND RESULT ON WHATSAPP
  ================================= */

  const handleSendWhatsApp = async (
    result,
    student
  ) => {
    const phone =
      getStudentPhone(student);

    if (!phone) {
      alert(
        "No parent/guardian phone number is saved for this student."
      );

      return;
    }

    try {
      setGeneratingPdf(true);

      const {
        blob,
        fileName,
      } =
        await generateResultPdf(
          result
        );

      const message =
        buildWhatsAppMessage(
          result,
          student
        );

      if (
        typeof navigator !==
          "undefined" &&
        navigator.share &&
        navigator.canShare
      ) {
        const file =
          new File(
            [blob],
            fileName,
            {
              type:
                "application/pdf",
            }
          );

        const shareData = {
          files: [file],
          text: message,
          title:
            "AIMS Academy Result",
        };

        if (
          navigator.canShare(
            shareData
          )
        ) {
          await navigator.share(
            shareData
          );

          return;
        }
      }

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      const whatsappUrl =
        `https://wa.me/${phone}?text=${encodeURIComponent(
          message
        )}`;

      window.open(
        whatsappUrl,
        "_blank",
        "noopener,noreferrer"
      );

      alert(
        "The result PDF has been downloaded. WhatsApp has been opened with the result message. Please attach the downloaded PDF to the chat."
      );
    } catch (error) {
      if (
        error?.name ===
        "AbortError"
      ) {
        return;
      }

      console.error(
        "WhatsApp PDF sharing error:",
        error
      );

      alert(
        "Unable to share the result PDF. Please try again."
      );
    } finally {
      setGeneratingPdf(false);
    }
  };

  /* =================================
     FILTER STUDENTS
  ================================= */

  const filteredStudents = useMemo(() => {
    const searchValue =
      reportSearch
        .toLowerCase()
        .trim();

    if (!searchValue) {
      return students;
    }

    return students.filter(
      (student) => {
        return (
          String(
            student.name || ""
          )
            .toLowerCase()
            .includes(searchValue) ||
          String(
            student.studentId || ""
          )
            .toLowerCase()
            .includes(searchValue) ||
          String(
            student.fatherName || ""
          )
            .toLowerCase()
            .includes(searchValue) ||
          String(
            student.className || ""
          )
            .toLowerCase()
            .includes(searchValue)
        );
      }
    );
  }, [
    students,
    reportSearch,
  ]);

  /* =================================
     FILTER RESULTS
  ================================= */

  const filteredResults = useMemo(() => {
    const searchValue =
      reportSearch
        .toLowerCase()
        .trim();

    if (!searchValue) {
      return results;
    }

    return results.filter(
      (result) => {
        const student =
          students.find(
            (item) =>
              item.studentId ===
              result.studentId
          );

        return (
          String(
            result.studentId || ""
          )
            .toLowerCase()
            .includes(searchValue) ||
          String(
            result.examName || ""
          )
            .toLowerCase()
            .includes(searchValue) ||
          String(
            result.examYear || ""
          )
            .toLowerCase()
            .includes(searchValue) ||
          String(
            student?.name || ""
          )
            .toLowerCase()
            .includes(searchValue) ||
          String(
            student?.fatherName || ""
          )
            .toLowerCase()
            .includes(searchValue) ||
          String(
            student?.className || ""
          )
            .toLowerCase()
            .includes(searchValue)
        );
      }
    );
  }, [
    results,
    students,
    reportSearch,
  ]);

  /* =================================
     CLASS DISTRIBUTION
  ================================= */

  const classDistribution = useMemo(() => {
    const distribution = {};

    students.forEach(
      (student) => {
        const className =
          student.className ||
          "Not Assigned";

        distribution[className] =
          (distribution[className] ||
            0) + 1;
      }
    );

    return Object.entries(
      distribution
    ).sort(
      (a, b) => b[1] - a[1]
    );
  }, [students]);

  /* =================================
     AVAILABLE CLASSES
  ================================= */

  const availableClasses = useMemo(() => {
    return [
      ...new Set(
        students
          .map(
            (student) =>
              student.className
          )
          .filter(Boolean)
      ),
    ].sort();
  }, [students]);

  /* =================================
     ATTENDANCE HELPERS
  ================================= */

  const getAttendanceStatus = (
    record
  ) => {
    if (
      record?.present === true ||
      record?.isPresent === true
    ) {
      return "Present";
    }

    const status = String(
      record?.status ||
        record?.attendanceStatus ||
        record?.state ||
        ""
    ).toLowerCase();

    if (
      status === "present" ||
      status === "p" ||
      status === "true"
    ) {
      return "Present";
    }

    if (
      status === "absent" ||
      status === "a" ||
      status === "false"
    ) {
      return "Absent";
    }

    return "";
  };

  const getAttendanceStudentId = (
    record
  ) => {
    return (
      record?.studentId ||
      record?.studentID ||
      record?.id ||
      record?.student?.studentId ||
      ""
    );
  };

  /* =================================
     ATTENDANCE REPORT DATA
  ================================= */

  const attendanceReportData = useMemo(() => {
    return students.map(
      (student) => {
        const studentRecords =
          attendance.filter(
            (record) =>
              String(
                getAttendanceStudentId(
                  record
                )
              ) ===
              String(
                student.studentId
              )
          );

        let present = 0;
        let absent = 0;

        studentRecords.forEach(
          (record) => {
            const status =
              getAttendanceStatus(
                record
              );

            if (status === "Present") {
              present += 1;
            }

            if (status === "Absent") {
              absent += 1;
            }
          }
        );

        const total =
          present + absent;

        const percentage =
          total > 0
            ? (present / total) * 100
            : 0;

        return {
          student,
          present,
          absent,
          total,
          percentage,
        };
      }
    );
  }, [
    students,
    attendance,
  ]);

  /* =================================
     FEE HELPERS
  ================================= */

  const getFeeStudentId = (fee) => {
    return (
      fee?.studentId ||
      fee?.studentID ||
      fee?.student?.studentId ||
      fee?.id ||
      ""
    );
  };

  const isFeePaid = (fee) => {
    if (
      fee?.paid === true ||
      fee?.isPaid === true ||
      fee?.paymentReceived === true
    ) {
      return true;
    }

    const status = String(
      fee?.status ||
        fee?.paymentStatus ||
        fee?.feeStatus ||
        ""
    ).toLowerCase();

    if (
      status === "paid" ||
      status === "submitted" ||
      status === "received" ||
      status === "completed"
    ) {
      return true;
    }

    if (
      fee?.paidAmount !== undefined &&
      Number(fee.paidAmount) > 0
    ) {
      return true;
    }

    if (
      fee?.amountPaid !== undefined &&
      Number(fee.amountPaid) > 0
    ) {
      return true;
    }

    if (
      fee?.paymentDate ||
      fee?.paidDate ||
      fee?.submissionDate ||
      fee?.submittedAt
    ) {
      return true;
    }

    return false;
  };

  const getFeeAmount = (fee) => {
    return Number(
      fee?.paidAmount ??
        fee?.amountPaid ??
        fee?.amount ??
        fee?.feeAmount ??
        fee?.totalAmount ??
        0
    );
  };

  /* =================================
     PAID FEE STUDENTS
  ================================= */

  const paidFeeStudents = useMemo(() => {
    const paidMap = new Map();

    fees.forEach((fee) => {
      if (!isFeePaid(fee)) {
        return;
      }

      const studentId =
        getFeeStudentId(fee);

      if (!studentId) {
        return;
      }

      const existing =
        paidMap.get(
          String(studentId)
        ) || {
          amount: 0,
          records: 0,
          latestDate: "",
        };

      existing.amount +=
        getFeeAmount(fee);

      existing.records += 1;

      existing.latestDate =
        fee.paymentDate ||
        fee.paidDate ||
        fee.submissionDate ||
        fee.submittedAt ||
        existing.latestDate;

      paidMap.set(
        String(studentId),
        existing
      );
    });

    return students
      .filter((student) =>
        paidMap.has(
          String(student.studentId)
        )
      )
      .map((student) => ({
        student,
        ...paidMap.get(
          String(student.studentId)
        ),
      }));
  }, [students, fees]);

  /* =================================
     FEE DEFAULTERS
  ================================= */

  const feeDefaulters = useMemo(() => {
    const paidStudentIds =
      new Set(
        fees
          .filter(isFeePaid)
          .map((fee) =>
            String(
              getFeeStudentId(fee)
            )
          )
          .filter(Boolean)
      );

    return students.filter(
      (student) =>
        !paidStudentIds.has(
          String(student.studentId)
        )
    );
  }, [students, fees]);

  /* =================================
     CLASS PERFORMANCE
  ================================= */

  const selectedClassStudents =
    useMemo(() => {
      if (!selectedClass) {
        return [];
      }

      return students.filter(
        (student) =>
          String(
            student.className || ""
          ) ===
          String(selectedClass)
      );
    }, [
      students,
      selectedClass,
    ]);

  const classPerformance = useMemo(() => {
    if (!selectedClass) {
      return [];
    }

    const classStudentIds =
      new Set(
        selectedClassStudents.map(
          (student) =>
            String(student.studentId)
        )
      );

    const classResults =
      results.filter((result) =>
        classStudentIds.has(
          String(result.studentId)
        )
      );

    const subjectMap = {};

    classResults.forEach(
      (result) => {
        (
          result.subjects || []
        ).forEach((subject) => {
          const name =
            subject.name ||
            "Unknown Subject";

          const total = Number(
            subject.totalMarks || 0
          );

          const obtained = Number(
            subject.obtainedMarks || 0
          );

          if (!subjectMap[name]) {
            subjectMap[name] = {
              name,
              total: 0,
              obtained: 0,
              count: 0,
            };
          }

          subjectMap[name].total +=
            total;

          subjectMap[name].obtained +=
            obtained;

          subjectMap[name].count +=
            1;
        });
      }
    );

    return Object.values(
      subjectMap
    ).map((subject) => ({
      ...subject,
      percentage:
        subject.total > 0
          ? (subject.obtained /
              subject.total) *
            100
          : 0,
    }));
  }, [
    selectedClass,
    selectedClassStudents,
    results,
  ]);

  const classOverallPercentage =
    useMemo(() => {
      if (
        classPerformance.length ===
        0
      ) {
        return 0;
      }

      const total =
        classPerformance.reduce(
          (sum, subject) =>
            sum + subject.percentage,
          0
        );

      return (
        total /
        classPerformance.length
      );
    }, [classPerformance]);

  /* =================================
     REGISTERED SUBJECTS
  ================================= */

  const getRegisteredSubjects = (
    student
  ) => {
    const possibleSubjects =
      student?.subjects ||
      student?.registeredSubjects ||
      student?.selectedSubjects ||
      student?.enrolledSubjects ||
      [];

    if (Array.isArray(possibleSubjects)) {
      return possibleSubjects
        .map((subject) => {
          if (
            typeof subject ===
            "string"
          ) {
            return subject;
          }

          return (
            subject?.name ||
            subject?.subjectName ||
            ""
          );
        })
        .filter(Boolean);
    }

    return [];
  };

  /* =================================
     ACADEMIC PERFORMANCE
  ================================= */

  const academicStudent =
    useMemo(() => {
      return students.find(
        (student) =>
          String(
            student.studentId
          ) ===
          String(
            selectedAcademicStudent
          )
      );
    }, [
      students,
      selectedAcademicStudent,
    ]);

  const academicPerformance =
    useMemo(() => {
      if (!academicStudent) {
        return [];
      }

      const studentResults =
        results.filter(
          (result) =>
            String(
              result.studentId
            ) ===
            String(
              academicStudent.studentId
            )
        );

      const registeredSubjects =
        getRegisteredSubjects(
          academicStudent
        );

      const subjectMap = {};

      registeredSubjects.forEach(
        (subjectName) => {
          subjectMap[subjectName] =
            [];
        }
      );

      studentResults.forEach(
        (result) => {
          (
            result.subjects || []
          ).forEach((subject) => {
            const name =
              subject.name ||
              subject.subjectName ||
              "";

            if (!name) {
              return;
            }

            const percentage =
              getSubjectPercentage(
                subject
              );

            if (!subjectMap[name]) {
              subjectMap[name] = [];
            }

            subjectMap[name].push({
              percentage,
              examName:
                result.examName ||
                "Examination",
              examYear:
                result.examYear ||
                "",
            });
          });
        }
      );

      return Object.entries(
        subjectMap
      ).map(
        ([name, records]) => {
          const average =
            records.length > 0
              ? records.reduce(
                  (sum, record) =>
                    sum +
                    record.percentage,
                  0
                ) /
                records.length
              : 0;

          return {
            name,
            records,
            average,
          };
        }
      );
    }, [
      academicStudent,
      results,
    ]);

  /* =================================
     RENDER REPORT CONTENT
  ================================= */

  const renderReportContent = () => {
    if (!selectedReport) {
      return null;
    }

    /* =================================
       STUDENT REPORT
    ================================= */

    if (
      selectedReport.id ===
      "students"
    ) {
      return (
        <>
          <div className="reports-summary-grid">
            <div className="reports-summary-card">
              <span>
                Total Students
              </span>

              <strong>
                {students.length}
              </strong>
            </div>

            <div className="reports-summary-card">
              <span>
                Classes
              </span>

              <strong>
                {classDistribution.length}
              </strong>
            </div>

            <div className="reports-summary-card">
              <span>
                Search Results
              </span>

              <strong>
                {filteredStudents.length}
              </strong>
            </div>
          </div>

          <div className="reports-table-toolbar">
            <div className="reports-report-search">
              <Search size={16} />

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

          {filteredStudents.length ===
          0 ? (
            <div className="reports-report-empty">
              <Users size={30} />

              <h3>
                No Students Found
              </h3>

              <p>
                There are no students
                matching your search.
              </p>
            </div>
          ) : (
            <div className="reports-table-wrapper">
              <table className="reports-table">
                <thead>
                  <tr>
                    <th>
                      Student ID
                    </th>
                    <th>
                      Student Name
                    </th>
                    <th>
                      Father Name
                    </th>
                    <th>
                      Class
                    </th>
                    <th>
                      Category
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.map(
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
                          {student.name ||
                            "Not Provided"}
                        </td>

                        <td>
                          {student.fatherName ||
                            "Not Provided"}
                        </td>

                        <td>
                          {student.className ||
                            "Not Assigned"}
                        </td>

                        <td>
                          {student.category ||
                            "Not Assigned"}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="reports-class-distribution">
            <div className="reports-subsection-header">
              <div>
                <p className="section-label">
                  CLASS DISTRIBUTION
                </p>

                <h3>
                  Students by Class
                </h3>
              </div>
            </div>

            {classDistribution.length ===
            0 ? (
              <p className="reports-muted">
                No class data available.
              </p>
            ) : (
              <div className="reports-class-grid">
                {classDistribution.map(
                  ([
                    className,
                    count,
                  ]) => (
                    <div
                      className="reports-class-card"
                      key={className}
                    >
                      <span>
                        {className}
                      </span>

                      <strong>
                        {count}
                      </strong>

                      <small>
                        {count === 1
                          ? "Student"
                          : "Students"}
                      </small>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </>
      );
    }

    /* =================================
       ATTENDANCE REPORT
    ================================= */

    if (
      selectedReport.id ===
      "attendance"
    ) {
      const searchedAttendance =
        attendanceReportData.filter(
          (item) => {
            const value =
              reportSearch
                .toLowerCase()
                .trim();

            if (!value) {
              return true;
            }

            return (
              String(
                item.student.name ||
                  ""
              )
                .toLowerCase()
                .includes(value) ||
              String(
                item.student.studentId ||
                  ""
              )
                .toLowerCase()
                .includes(value) ||
              String(
                item.student.className ||
                  ""
              )
                .toLowerCase()
                .includes(value)
            );
          }
        );

      const totalPresent =
        searchedAttendance.reduce(
          (sum, item) =>
            sum + item.present,
          0
        );

      const totalAbsent =
        searchedAttendance.reduce(
          (sum, item) =>
            sum + item.absent,
          0
        );

      return (
        <>
          <div className="reports-summary-grid">
            <div className="reports-summary-card">
              <span>
                Students
              </span>

              <strong>
                {
                  searchedAttendance.length
                }
              </strong>
            </div>

            <div className="reports-summary-card reports-present-summary">
              <span>
                Present
              </span>

              <strong>
                {totalPresent}
              </strong>
            </div>

            <div className="reports-summary-card reports-absent-summary">
              <span>
                Absent
              </span>

              <strong>
                {totalAbsent}
              </strong>
            </div>
          </div>

          <div className="reports-table-toolbar">
            <div className="reports-report-search">
              <Search size={16} />

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

          {searchedAttendance.length ===
          0 ? (
            <div className="reports-report-empty">
              <ClipboardCheck size={30} />

              <h3>
                No Attendance Records
              </h3>

              <p>
                No attendance data is
                available yet.
              </p>
            </div>
          ) : (
            <div className="reports-table-wrapper">
              <table className="reports-table">
                <thead>
                  <tr>
                    <th>
                      Student ID
                    </th>

                    <th>
                      Student Name
                    </th>

                    <th>
                      Class
                    </th>

                    <th>
                      Present
                    </th>

                    <th>
                      Absent
                    </th>

                    <th>
                      Attendance %
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {searchedAttendance.map(
                    (item) => (
                      <tr
                        key={
                          item.student
                            .studentId
                        }
                      >
                        <td>
                          <strong>
                            {
                              item.student
                                .studentId
                            }
                          </strong>
                        </td>

                        <td>
                          {
                            item.student
                              .name
                          }
                        </td>

                        <td>
                          {
                            item.student
                              .className
                          }
                        </td>

                        <td>
                          <span className="reports-status-badge present">
                            {
                              item.present
                            }
                          </span>
                        </td>

                        <td>
                          <span className="reports-status-badge absent">
                            {
                              item.absent
                            }
                          </span>
                        </td>

                        <td>
                          <strong>
                            {formatPercentage(
                              item.percentage
                            )}
                          </strong>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      );
    }

    /* =================================
       FEE COLLECTION REPORT
    ================================= */

    if (
      selectedReport.id ===
      "fees"
    ) {
      const searchedPaidStudents =
        paidFeeStudents.filter(
          (item) => {
            const value =
              reportSearch
                .toLowerCase()
                .trim();

            if (!value) {
              return true;
            }

            return (
              String(
                item.student.name ||
                  ""
              )
                .toLowerCase()
                .includes(value) ||
              String(
                item.student.studentId ||
                  ""
              )
                .toLowerCase()
                .includes(value) ||
              String(
                item.student.className ||
                  ""
              )
                .toLowerCase()
                .includes(value)
            );
          }
        );

      const totalCollected =
        searchedPaidStudents.reduce(
          (sum, item) =>
            sum + item.amount,
          0
        );

      return (
        <>
          <div className="reports-summary-grid">
            <div className="reports-summary-card">
              <span>
                Students Paid
              </span>

              <strong>
                {
                  searchedPaidStudents.length
                }
              </strong>
            </div>

            <div className="reports-summary-card">
              <span>
                Total Collected
              </span>

              <strong>
                Rs{" "}
                {totalCollected.toLocaleString()}
              </strong>
            </div>
          </div>

          <div className="reports-table-toolbar">
            <div className="reports-report-search">
              <Search size={16} />

              <input
                type="text"
                placeholder="Search paid student..."
                value={reportSearch}
                onChange={(e) =>
                  setReportSearch(
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          {searchedPaidStudents.length ===
          0 ? (
            <div className="reports-report-empty">
              <WalletCards size={30} />

              <h3>
                No Paid Fees Found
              </h3>

              <p>
                No students with paid
                fees were found.
              </p>
            </div>
          ) : (
            <div className="reports-table-wrapper">
              <table className="reports-table">
                <thead>
                  <tr>
                    <th>
                      Student ID
                    </th>

                    <th>
                      Student Name
                    </th>

                    <th>
                      Father Name
                    </th>

                    <th>
                      Class
                    </th>

                    <th>
                      Amount Paid
                    </th>

                    <th>
                      Payment Date
                    </th>

                    <th>
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {searchedPaidStudents.map(
                    (item) => (
                      <tr
                        key={
                          item.student
                            .studentId
                        }
                      >
                        <td>
                          <strong>
                            {
                              item.student
                                .studentId
                            }
                          </strong>
                        </td>

                        <td>
                          {
                            item.student
                              .name
                          }
                        </td>

                        <td>
                          {
                            item.student
                              .fatherName ||
                              "Not Provided"
                          }
                        </td>

                        <td>
                          {
                            item.student
                              .className
                          }
                        </td>

                        <td>
                          <strong>
                            Rs{" "}
                            {item.amount.toLocaleString()}
                          </strong>
                        </td>

                        <td>
                          {item.latestDate ||
                            "Recorded"}
                        </td>

                        <td>
                          <span className="reports-status-badge paid">
                            PAID
                          </span>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      );
    }

    /* =================================
       RESULT REPORT
    ================================= */

    if (
      selectedReport.id ===
      "results"
    ) {
      return (
        <>
          <div className="reports-result-toolbar">
            <div className="reports-report-search">
              <Search size={16} />

              <input
                type="text"
                placeholder="Search student, ID, examination..."
                value={reportSearch}
                onChange={(e) =>
                  setReportSearch(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="reports-result-count">
              {filteredResults.length}{" "}
              {filteredResults.length ===
              1
                ? "Result"
                : "Results"}
            </div>
          </div>

          {filteredResults.length ===
          0 ? (
            <div className="reports-report-empty">
              <Award size={30} />

              <h3>
                No Results Found
              </h3>

              <p>
                No examination results
                are available for the
                current search.
              </p>
            </div>
          ) : (
            <div className="reports-result-list">
              {filteredResults.map(
                (result) => {
                  const student =
                    students.find(
                      (item) =>
                        item.studentId ===
                        result.studentId
                    );

                  const totalMarks =
                    Number(
                      result.totalMarks ||
                        0
                    );

                  const obtainedMarks =
                    Number(
                      result.obtainedMarks ||
                        0
                    );

                  const percentage =
                    Number(
                      result.percentage ||
                        0
                    );

                  const grade =
                    result.grade ||
                    getGrade(
                      percentage
                    );

                  const status =
                    result.status ||
                    (percentage >=
                    40
                      ? "Pass"
                      : "Fail");

                  return (
                    <div
                      className="result-report-item"
                      key={
                        result.resultId
                      }
                    >
                      <div
                        className="result-report-sheet"
                        id={`result-report-${result.resultId}`}
                      >
                        <div className="result-report-header">
                          <div className="result-report-logo-wrapper">
                            <img
                              src={logo}
                              alt="AIMS Academy Logo"
                              className="result-report-logo"
                            />
                          </div>

                          <div className="result-report-heading">
                            <h1>
                              AIMS ACADEMY
                            </h1>

                            <h2>
                              Student Academic
                              Result Report
                            </h2>

                            <p>
                              {
                                result.examName
                              }
                              {" • "}
                              {
                                result.examYear
                              }
                            </p>
                          </div>
                        </div>

                        <div className="result-report-section">
                          <div className="result-report-section-title">
                            <span>
                              STUDENT INFORMATION
                            </span>
                          </div>

                          <div className="result-report-info-grid">
                            <div className="result-report-info-item">
                              <span>
                                Student
                              </span>

                              <strong>
                                {student?.name ||
                                  "Unknown Student"}
                              </strong>
                            </div>

                            <div className="result-report-info-item">
                              <span>
                                Student ID
                              </span>

                              <strong>
                                {
                                  result.studentId
                                }
                              </strong>
                            </div>

                            <div className="result-report-info-item">
                              <span>
                                Father Name
                              </span>

                              <strong>
                                {student?.fatherName ||
                                  "Not Provided"}
                              </strong>
                            </div>

                            <div className="result-report-info-item">
                              <span>
                                Class
                              </span>

                              <strong>
                                {student?.className ||
                                  "Not Assigned"}
                              </strong>
                            </div>

                            <div className="result-report-info-item">
                              <span>
                                Category
                              </span>

                              <strong>
                                {student?.category ||
                                  "Not Assigned"}
                              </strong>
                            </div>

                            <div className="result-report-info-item">
                              <span>
                                Stream
                              </span>

                              <strong>
                                {student?.stream ||
                                  "—"}
                              </strong>
                            </div>
                          </div>
                        </div>

                        <div className="result-report-examination">
                          <div>
                            <span>
                              Examination
                            </span>

                            <strong>
                              {
                                result.examName
                              }
                            </strong>
                          </div>

                          <div>
                            <span>
                              Academic Year
                            </span>

                            <strong>
                              {
                                result.examYear
                              }
                            </strong>
                          </div>
                        </div>

                        <div className="result-report-section">
                          <div className="result-report-section-title">
                            <span>
                              SUBJECT-WISE PERFORMANCE
                            </span>
                          </div>

                          <div className="result-report-marks-table-wrapper">
                            <table className="result-report-marks-table">
                              <thead>
                                <tr>
                                  <th>
                                    #
                                  </th>

                                  <th>
                                    Subject
                                  </th>

                                  <th>
                                    Total Marks
                                  </th>

                                  <th>
                                    Obtained Marks
                                  </th>

                                  <th>
                                    Percentage
                                  </th>

                                  <th>
                                    Grade
                                  </th>

                                  <th>
                                    Status
                                  </th>
                                </tr>
                              </thead>

                              <tbody>
                                {result.subjects?.map(
                                  (
                                    subject,
                                    index
                                  ) => {
                                    const subjectPercentage =
                                      getSubjectPercentage(
                                        subject
                                      );

                                    const subjectGrade =
                                      getGrade(
                                        subjectPercentage
                                      );

                                    const subjectStatus =
                                      getSubjectStatus(
                                        subject
                                      );

                                    return (
                                      <tr
                                        key={`${subject.name}-${index}`}
                                      >
                                        <td>
                                          {index +
                                            1}
                                        </td>

                                        <td>
                                          <strong>
                                            {
                                              subject.name
                                            }
                                          </strong>
                                        </td>

                                        <td>
                                          {
                                            subject.totalMarks
                                          }
                                        </td>

                                        <td>
                                          {
                                            subject.obtainedMarks
                                          }
                                        </td>

                                        <td>
                                          {formatPercentage(
                                            subjectPercentage
                                          )}
                                        </td>

                                        <td>
                                          <span className="result-report-grade">
                                            {
                                              subjectGrade
                                            }
                                          </span>
                                        </td>

                                        <td>
                                          <span
                                            className={
                                              subjectStatus ===
                                              "Pass"
                                                ? "result-report-status pass"
                                                : "result-report-status fail"
                                            }
                                          >
                                            {
                                              subjectStatus
                                            }
                                          </span>
                                        </td>
                                      </tr>
                                    );
                                  }
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="result-report-section">
                          <div className="result-report-section-title">
                            <span>
                              OVERALL PERFORMANCE
                            </span>
                          </div>

                          <div className="result-report-summary-grid">
                            <div className="result-report-summary-card">
                              <span>
                                Total Marks
                              </span>

                              <strong>
                                {
                                  totalMarks
                                }
                              </strong>
                            </div>

                            <div className="result-report-summary-card">
                              <span>
                                Obtained Marks
                              </span>

                              <strong>
                                {
                                  obtainedMarks
                                }
                              </strong>
                            </div>

                            <div className="result-report-summary-card">
                              <span>
                                Percentage
                              </span>

                              <strong>
                                {formatPercentage(
                                  percentage
                                )}
                              </strong>
                            </div>

                            <div className="result-report-summary-card">
                              <span>
                                Grade
                              </span>

                              <strong>
                                {grade}
                              </strong>
                            </div>

                            <div
                              className={
                                status ===
                                "Pass"
                                  ? "result-report-summary-card result-pass-card"
                                  : "result-report-summary-card result-fail-card"
                              }
                            >
                              <span>
                                Result
                              </span>

                              <strong>
                                {status.toUpperCase()}
                              </strong>
                            </div>
                          </div>
                        </div>

                        <div className="result-report-section">
                          <div className="result-report-section-title">
                            <span>
                              REMARKS
                            </span>
                          </div>

                          <div className="result-report-remarks">
                            <p>
                              {getResultRemarks(
                                result,
                                percentage
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="result-report-signatures">
                          <div>
                            <span></span>

                            <strong>
                              Class Teacher
                            </strong>
                          </div>

                          <div>
                            <span></span>

                            <strong>
                              Principal
                            </strong>
                          </div>

                          <div>
                            <span></span>

                            <strong>
                              Parent / Guardian
                            </strong>
                          </div>
                        </div>

                        <div className="result-report-footer">
                          <span>
                            AIMS Academy
                          </span>

                          <span>
                            Official Student
                            Academic Report
                          </span>
                        </div>
                      </div>

                      <div className="result-report-actions">
                        <button
                          type="button"
                          className="result-report-whatsapp-button"
                          onClick={() =>
                            handleSendWhatsApp(
                              result,
                              student
                            )
                          }
                          disabled={
                            generatingPdf
                          }
                        >
                          <MessageCircle
                            size={17}
                          />

                          {generatingPdf
                            ? "Preparing PDF..."
                            : "Send Result on WhatsApp"}
                        </button>

                        <button
                          type="button"
                          className="result-report-pdf-button"
                          onClick={() =>
                            handleDownloadPdf(
                              result
                            )
                          }
                          disabled={
                            generatingPdf
                          }
                        >
                          <FileDown
                            size={17}
                          />

                          Download PDF
                        </button>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </>
      );
    }

    /* =================================
       CLASS PERFORMANCE
    ================================= */

    if (
      selectedReport.id ===
      "class-performance"
    ) {
      return (
        <>
          <div className="reports-selector-card">
            <div>
              <p className="section-label">
                CLASS SELECTION
              </p>

              <h3>
                Select Class
              </h3>

              <p>
                Select a class to view
                its overall academic
                performance.
              </p>
            </div>

            <select
              value={selectedClass}
              onChange={(e) =>
                setSelectedClass(
                  e.target.value
                )
              }
            >
              <option value="">
                Select Class
              </option>

              {availableClasses.map(
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

          {!selectedClass ? (
            <div className="reports-report-empty">
              <GraduationCap size={30} />

              <h3>
                Select a Class
              </h3>

              <p>
                Choose a class above to
                view its performance.
              </p>
            </div>
          ) : (
            <>
              <div className="reports-summary-grid">
                <div className="reports-summary-card">
                  <span>
                    Class
                  </span>

                  <strong>
                    {selectedClass}
                  </strong>
                </div>

                <div className="reports-summary-card">
                  <span>
                    Students
                  </span>

                  <strong>
                    {
                      selectedClassStudents.length
                    }
                  </strong>
                </div>

                <div className="reports-summary-card">
                  <span>
                    Overall Performance
                  </span>

                  <strong>
                    {formatPercentage(
                      classOverallPercentage
                    )}
                  </strong>
                </div>
              </div>

              {classPerformance.length ===
              0 ? (
                <div className="reports-report-empty">
                  <GraduationCap
                    size={30}
                  />

                  <h3>
                    No Result Data
                  </h3>

                  <p>
                    No examination
                    results are available
                    for this class.
                  </p>
                </div>
              ) : (
                <div className="reports-performance-list">
                  {classPerformance.map(
                    (subject) => (
                      <div
                        className="reports-performance-row"
                        key={
                          subject.name
                        }
                      >
                        <div className="reports-performance-name">
                          <strong>
                            {
                              subject.name
                            }
                          </strong>

                          <span>
                            {formatPercentage(
                              subject.percentage
                            )}
                          </span>
                        </div>

                        <div className="reports-performance-bar">
                          <div
                            style={{
                              width: `${Math.min(
                                100,
                                subject.percentage
                              )}%`,
                            }}
                          />
                        </div>

                        <strong>
                          {getGrade(
                            subject.percentage
                          )}
                        </strong>
                      </div>
                    )
                  )}
                </div>
              )}
            </>
          )}
        </>
      );
    }

    /* =================================
       ACADEMIC PERFORMANCE
       PRINT BUTTON REMAINS
    ================================= */

    if (
      selectedReport.id ===
      "academic-performance"
    ) {
      return (
        <>
          <div className="reports-selector-card">
            <div>
              <p className="section-label">
                STUDENT SELECTION
              </p>

              <h3>
                Select Student
              </h3>

              <p>
                Select a student to view
                subject-wise academic
                performance.
              </p>
            </div>

            <select
              value={
                selectedAcademicStudent
              }
              onChange={(e) =>
                setSelectedAcademicStudent(
                  e.target.value
                )
              }
            >
              <option value="">
                Select Student
              </option>

              {students.map(
                (student) => (
                  <option
                    key={
                      student.studentId
                    }
                    value={
                      student.studentId
                    }
                  >
                    {student.name} —{" "}
                    {
                      student.studentId
                    }
                  </option>
                )
              )}
            </select>
          </div>

          {!academicStudent ? (
            <div className="reports-report-empty">
              <TrendingUp size={30} />

              <h3>
                Select a Student
              </h3>

              <p>
                Choose a student above
                to view academic
                performance.
              </p>
            </div>
          ) : (
            <>
              <div className="academic-report-student-card">
                <div>
                  <span>
                    Student
                  </span>

                  <strong>
                    {
                      academicStudent.name
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Student ID
                  </span>

                  <strong>
                    {
                      academicStudent.studentId
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Class
                  </span>

                  <strong>
                    {
                      academicStudent.className ||
                      "Not Assigned"
                    }
                  </strong>
                </div>
              </div>

              {academicPerformance.length ===
              0 ? (
                <div className="reports-report-empty">
                  <TrendingUp
                    size={30}
                  />

                  <h3>
                    No Academic Data
                  </h3>

                  <p>
                    No result data is
                    available for this
                    student.
                  </p>
                </div>
              ) : (
                <div className="academic-performance-chart">
                  <div className="academic-chart-header">
                    <div>
                      <p className="section-label">
                        SUBJECT-WISE
                        PERFORMANCE
                      </p>

                      <h3>
                        Academic Performance
                      </h3>
                    </div>

                    <span>
                      Percentage
                    </span>
                  </div>

                  <div className="academic-chart-area">
                    {academicPerformance.map(
                      (subject) => (
                        <div
                          className="academic-chart-row"
                          key={
                            subject.name
                          }
                        >
                          <div className="academic-chart-label">
                            <strong>
                              {
                                subject.name
                              }
                            </strong>

                            <span>
                              {formatPercentage(
                                subject.average
                              )}
                            </span>
                          </div>

                          <div className="academic-chart-track">
                            <div
                              className="academic-chart-fill"
                              style={{
                                width: `${Math.min(
                                  100,
                                  subject.average
                                )}%`,
                              }}
                            />
                          </div>

                          <strong className="academic-chart-grade">
                            {getGrade(
                              subject.average
                            )}
                          </strong>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      );
    }

    /* =================================
       FEE DEFAULTERS
    ================================= */

    if (
      selectedReport.id ===
      "fee-defaulters"
    ) {
      const searchedDefaulters =
        feeDefaulters.filter(
          (student) => {
            const value =
              reportSearch
                .toLowerCase()
                .trim();

            if (!value) {
              return true;
            }

            return (
              String(
                student.name || ""
              )
                .toLowerCase()
                .includes(value) ||
              String(
                student.studentId || ""
              )
                .toLowerCase()
                .includes(value) ||
              String(
                student.className || ""
              )
                .toLowerCase()
                .includes(value)
            );
          }
        );

      return (
        <>
          <div className="reports-summary-grid">
            <div className="reports-summary-card reports-danger-summary">
              <span>
                Fee Defaulters
              </span>

              <strong>
                {
                  searchedDefaulters.length
                }
              </strong>
            </div>

            <div className="reports-summary-card">
              <span>
                Total Students
              </span>

              <strong>
                {students.length}
              </strong>
            </div>

            <div className="reports-summary-card">
              <span>
                Paid Students
              </span>

              <strong>
                {
                  paidFeeStudents.length
                }
              </strong>
            </div>
          </div>

          <div className="reports-table-toolbar">
            <div className="reports-report-search">
              <Search size={16} />

              <input
                type="text"
                placeholder="Search defaulter..."
                value={reportSearch}
                onChange={(e) =>
                  setReportSearch(
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          {searchedDefaulters.length ===
          0 ? (
            <div className="reports-report-empty">
              <UserX size={30} />

              <h3>
                No Fee Defaulters
              </h3>

              <p>
                All students have paid
                their recorded fees.
              </p>
            </div>
          ) : (
            <div className="reports-table-wrapper">
              <table className="reports-table">
                <thead>
                  <tr>
                    <th>
                      Student ID
                    </th>

                    <th>
                      Student Name
                    </th>

                    <th>
                      Father Name
                    </th>

                    <th>
                      Class
                    </th>

                    <th>
                      Category
                    </th>

                    <th>
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {searchedDefaulters.map(
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
                          {student.name ||
                            "Not Provided"}
                        </td>

                        <td>
                          {student.fatherName ||
                            "Not Provided"}
                        </td>

                        <td>
                          {student.className ||
                            "Not Assigned"}
                        </td>

                        <td>
                          {student.category ||
                            "Not Assigned"}
                        </td>

                        <td>
                          <span className="reports-status-badge unpaid">
                            UNPAID
                          </span>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      );
    }

    /* =================================
       STUDENT STRENGTH
    ================================= */

    if (
      selectedReport.id ===
      "student-strength"
    ) {
      return (
        <>
          <div className="reports-summary-grid">
            <div className="reports-summary-card">
              <span>
                Total Students
              </span>

              <strong>
                {students.length}
              </strong>
            </div>

            <div className="reports-summary-card">
              <span>
                Total Classes
              </span>

              <strong>
                {
                  classDistribution.length
                }
              </strong>
            </div>
          </div>

          <div className="reports-strength-list">
            {classDistribution.length ===
            0 ? (
              <div className="reports-report-empty">
                <BarChart3 size={30} />

                <h3>
                  No Data Available
                </h3>

                <p>
                  Student class data is
                  not available yet.
                </p>
              </div>
            ) : (
              classDistribution.map(
                ([
                  className,
                  count,
                ]) => (
                  <div
                    className="reports-strength-row"
                    key={className}
                  >
                    <div>
                      <strong>
                        {className}
                      </strong>

                      <span>
                        {count}{" "}
                        {count === 1
                          ? "student"
                          : "students"}
                      </span>
                    </div>

                    <div className="reports-strength-bar">
                      <div
                        style={{
                          width: `${
                            students.length >
                            0
                              ? (count /
                                  students.length) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>

                    <strong>
                      {count}
                    </strong>
                  </div>
                )
              )
            )}
          </div>
        </>
      );
    }

    return null;
  };

  /* =================================
     RENDER
  ================================= */

  return (
    <section className="reports-page">
      <div className="reports-header">
        <div>
          <p className="section-label">
            ACADEMIC MANAGEMENT
          </p>

          <h1>
            Reports
          </h1>

          <p className="reports-description">
            Generate and view detailed
            reports for students,
            attendance, fees, results,
            and academic performance.
          </p>
        </div>
      </div>

      <div className="reports-content">
        <div className="reports-content-header">
          <p className="section-label">
            REPORT CENTER
          </p>

          <h2>
            Available Reports
          </h2>

          <p>
            Select a report below to view
            detailed information from your
            academy records.
          </p>
        </div>

        <div className="reports-grid">
          {reportOptions.map(
            (report) => {
              const Icon =
                report.icon;

              return (
                <div
                  className="report-card"
                  key={report.id}
                >
                  <div className="report-card-icon">
                    <Icon size={21} />
                  </div>

                  <h3>
                    {report.title}
                  </h3>

                  <p>
                    {
                      report.description
                    }
                  </p>

                  <button
                    type="button"
                    className="report-card-button"
                    onClick={() =>
                      handleOpenReport(
                        report
                      )
                    }
                  >
                    View Report

                    <ArrowRight
                      size={15}
                    />
                  </button>
                </div>
              );
            }
          )}
        </div>
      </div>

      {selectedReport && (
        <div
          className="reports-modal-overlay"
          onClick={
            handleCloseReport
          }
        >
          <div
            className="reports-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="reports-modal-header">
              <div>
                <p className="section-label">
                  REPORT CENTER
                </p>

                <h2>
                  {
                    selectedReport.title
                  }
                </h2>

                <p>
                  {
                    selectedReport.description
                  }
                </p>
              </div>

              <button
                type="button"
                className="reports-modal-close"
                onClick={
                  handleCloseReport
                }
              >
                <X size={19} />
              </button>
            </div>

            <div className="reports-modal-body">
              {renderReportContent()}
            </div>

            {/* =================================
                FOOTER
                PRINT ONLY FOR:
                - RESULT REPORT
                - ACADEMIC PERFORMANCE
            ================================= */}

            <div className="reports-modal-footer">
              {(
                selectedReport.id ===
                  "results" ||
                selectedReport.id ===
                  "academic-performance"
              ) && (
                <button
                  type="button"
                  className="reports-print-button"
                  onClick={
                    handlePrintReport
                  }
                >
                  <Printer size={16} />

                  Print Report
                </button>
              )}

              <button
                type="button"
                className="reports-close-button"
                onClick={
                  handleCloseReport
                }
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

export default Reports;