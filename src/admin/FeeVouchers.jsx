import { useEffect, useState } from "react";
import {
  Search,
  Receipt,
  UserRound,
  Eye,
  X,
  Printer,
} from "lucide-react";

function FeeVouchers() {
  /* =================================
     STUDENTS
  ================================= */

  const [students] = useState(() => {
    const savedStudents =
      localStorage.getItem("aims_students");

    return savedStudents
      ? JSON.parse(savedStudents)
      : [];
  });

  /* =================================
     FEE RECORDS
  ================================= */

  const [feeRecords, setFeeRecords] = useState(() => {
    const savedFees =
      localStorage.getItem("aims_fee_records");

    return savedFees
      ? JSON.parse(savedFees)
      : [];
  });

  /* =================================
     REFRESH FEE RECORDS
  ================================= */

  useEffect(() => {
    const refreshFees = () => {
      const savedFees =
        localStorage.getItem("aims_fee_records");

      setFeeRecords(
        savedFees
          ? JSON.parse(savedFees)
          : []
      );
    };

    window.addEventListener(
      "storage",
      refreshFees
    );

    return () => {
      window.removeEventListener(
        "storage",
        refreshFees
      );
    };
  }, []);

  /* =================================
     PAGE STATES
  ================================= */

  const [search, setSearch] = useState("");

  const [selectedVoucher, setSelectedVoucher] =
    useState(null);

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

    return new Date(
      `${dateValue}T00:00:00`
    ).toLocaleDateString(
      "en-PK",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =================================
     GET STUDENT
  ================================= */

  const getStudent = (studentId) => {
    return students.find(
      (student) =>
        student.studentId === studentId
    );
  };

  /* =================================
     GENERATE VOUCHER NUMBER
  ================================= */

  const generateVoucherNumber = (record) => {
    /* If this record already has a voucher,
       always use the existing number. */

    if (record.voucherNumber) {
      return record.voucherNumber;
    }

    const currentYear =
      new Date().getFullYear();

    const existingNumbers =
      feeRecords
        .map(
          (item) =>
            item.voucherNumber
        )
        .filter(Boolean)
        .map((number) => {
          const match =
            number.match(
              /^VCH-\d{4}-(\d+)$/
            );

          return match
            ? Number(match[1])
            : 0;
        });

    const highestNumber =
      existingNumbers.length > 0
        ? Math.max(...existingNumbers)
        : 0;

    const nextNumber =
      highestNumber + 1;

    return `VCH-${currentYear}-${String(
      nextNumber
    ).padStart(4, "0")}`;
  };

  /* =================================
     CREATE VOUCHER DATA
  ================================= */

  const createVoucher = (record) => {
    const student = getStudent(
      record.studentId
    );

    const voucherNumber =
      generateVoucherNumber(record);

    return {
      ...record,

      voucherNumber,

      studentName:
        student?.name ||
        "Unknown Student",

      fatherName:
        student?.fatherName ||
        "Not provided",

      className:
        student?.className ||
        "Not provided",
    };
  };

  /* =================================
     ENSURE VOUCHER NUMBER
  ================================= */

  const ensureVoucherNumber = (record) => {
    if (record.voucherNumber) {
      return record;
    }

    const voucherNumber =
      generateVoucherNumber(record);

    const updatedRecord = {
      ...record,
      voucherNumber,
      voucherGeneratedAt:
        new Date().toISOString(),
    };

    const updatedRecords =
      feeRecords.map((item) =>
        item.feeId === record.feeId
          ? updatedRecord
          : item
      );

    setFeeRecords(updatedRecords);

    localStorage.setItem(
      "aims_fee_records",
      JSON.stringify(updatedRecords)
    );

    return updatedRecord;
  };

  /* =================================
     FILTER VOUCHERS
  ================================= */

  const filteredVouchers =
    feeRecords.filter((record) => {
      const student =
        getStudent(record.studentId);

      const searchValue =
        search.toLowerCase().trim();

      if (!searchValue) {
        return true;
      }

      return (
        record.voucherNumber
          ?.toLowerCase()
          .includes(searchValue) ||
        record.studentId
          ?.toLowerCase()
          .includes(searchValue) ||
        student?.name
          ?.toLowerCase()
          .includes(searchValue) ||
        student?.fatherName
          ?.toLowerCase()
          .includes(searchValue) ||
        record.feeId
          ?.toLowerCase()
          .includes(searchValue)
      );
    });

  /* =================================
     VIEW VOUCHER
  ================================= */

  const handleViewVoucher = (record) => {
    const updatedRecord =
      ensureVoucherNumber(record);

    const voucher =
      createVoucher(updatedRecord);

    setSelectedVoucher(voucher);
  };

  /* =================================
     PRINT VOUCHER
  ================================= */

  const handlePrint = () => {
    window.print();
  };

  /* =================================
     CLOSE VOUCHER
  ================================= */

  const closeVoucher = () => {
    setSelectedVoucher(null);
  };

  /* =================================
     RENDER
  ================================= */

  return (
    <section className="fee-vouchers-page">

      {/* =================================
          PAGE HEADER
      ================================= */}

      <div className="fee-vouchers-header">

        <div>

          <p className="section-label">
            FEE MANAGEMENT
          </p>

          <h1>
            Fee Vouchers
          </h1>

          <p className="fee-vouchers-description">
            View and print fee vouchers for
            student payments.
          </p>

        </div>

      </div>


      {/* =================================
          SEARCH
      ================================= */}

      <div className="fee-vouchers-toolbar">

        <div className="fee-vouchers-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search by student, ID or voucher..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

      </div>


      {/* =================================
          VOUCHER LIST
      ================================= */}

      {filteredVouchers.length === 0 ? (

        <div className="fee-vouchers-empty">

          <div className="fee-vouchers-empty-icon">
            <Receipt size={28} />
          </div>

          <h3>
            No Fee Vouchers Found
          </h3>

          <p>
            Fee vouchers will appear here
            after a fee record is added.
          </p>

        </div>

      ) : (

        <div className="fee-vouchers-table-wrapper">

          <table className="fee-vouchers-table">

            <thead>

              <tr>

                <th>
                  Voucher
                </th>

                <th>
                  Student
                </th>

                <th>
                  Fee Month
                </th>

                <th>
                  Payment Date
                </th>

                <th>
                  Amount
                </th>

                <th>
                  Status
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredVouchers.map(
                (record) => {

                  const student =
                    getStudent(
                      record.studentId
                    );

                  return (
                    <tr
                      key={
                        record.feeId
                      }
                    >

                      {/* VOUCHER NUMBER */}

                      <td>

                        <strong>
                          {
                            record.voucherNumber ||
                            "Not Generated"
                          }
                        </strong>

                      </td>


                      {/* STUDENT */}

                      <td>

                        <div className="fee-voucher-student">

                          <div className="fee-voucher-student-icon">

                            <UserRound
                              size={16}
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
                                record.studentId
                              }
                            </span>

                          </div>

                        </div>

                      </td>


                      {/* FEE MONTH */}

                      <td>
                        {formatFeeMonth(
                          record.feeMonth
                        )}
                      </td>


                      {/* PAYMENT DATE */}

                      <td>
                        {formatDate(
                          record.paymentDate
                        )}
                      </td>


                      {/* AMOUNT */}

                      <td>

                        <strong>
                          {formatRs(
                            record.totalAmount
                          )}
                        </strong>

                      </td>


                      {/* STATUS */}

                      <td>

                        <span
                          className={
                            record.paymentStatus ===
                            "Paid"
                              ? "fee-voucher-status paid"
                              : "fee-voucher-status pending"
                          }
                        >
                          {
                            record.paymentStatus
                          }
                        </span>

                      </td>


                      {/* ACTION */}

                      <td>

                        <button
                          type="button"
                          className="fee-voucher-view-button"
                          onClick={() =>
                            handleViewVoucher(
                              record
                            )
                          }
                        >

                          <Eye size={16} />

                          {record.voucherNumber
                            ? "View Voucher"
                            : "Create Voucher"}

                        </button>

                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>

        </div>

      )}


      {/* =================================
          VOUCHER MODAL
      ================================= */}

      {selectedVoucher && (

        <div
          className="fee-voucher-modal-overlay"
          onClick={closeVoucher}
        >

          <div
            className="fee-voucher-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="fee-voucher-modal-header">

              <div>

                <p className="section-label">
                  FEE VOUCHER
                </p>

                <h2>
                  Payment Voucher
                </h2>

              </div>

              <button
                type="button"
                className="fee-voucher-close"
                onClick={closeVoucher}
              >

                <X size={20} />

              </button>

            </div>


            {/* =================================
                PRINTABLE VOUCHER
            ================================= */}

            <div className="printable-fee-voucher">

              {/* VOUCHER HEADER */}

              <div className="voucher-top">

                <div>

                  <h1>
                    AIMS Academy
                  </h1>

                  <p>
                    Quality Education for a
                    Better Future
                  </p>

                </div>

                <div className="voucher-title">

                  <span>
                    FEE VOUCHER
                  </span>

                  <strong>
                    {
                      selectedVoucher.voucherNumber
                    }
                  </strong>

                </div>

              </div>


              {/* STUDENT INFORMATION */}

              <div className="voucher-student-info">

                <div>

                  <span>
                    Student Name
                  </span>

                  <strong>
                    {
                      selectedVoucher.studentName
                    }
                  </strong>

                </div>

                <div>

                  <span>
                    Father's Name
                  </span>

                  <strong>
                    {
                      selectedVoucher.fatherName
                    }
                  </strong>

                </div>

                <div>

                  <span>
                    Student ID
                  </span>

                  <strong>
                    {
                      selectedVoucher.studentId
                    }
                  </strong>

                </div>

                <div>

                  <span>
                    Class
                  </span>

                  <strong>
                    {
                      selectedVoucher.className
                    }
                  </strong>

                </div>

                <div>

                  <span>
                    Fee Month
                  </span>

                  <strong>
                    {formatFeeMonth(
                      selectedVoucher.feeMonth
                    )}
                  </strong>

                </div>

                <div>

                  <span>
                    Payment Date
                  </span>

                  <strong>
                    {formatDate(
                      selectedVoucher.paymentDate
                    )}
                  </strong>

                </div>

              </div>


              {/* FEE TABLE */}

              <table className="voucher-fee-table">

                <thead>

                  <tr>

                    <th>
                      Description
                    </th>

                    <th>
                      Amount
                    </th>

                  </tr>

                </thead>

                <tbody>

                  <tr>

                    <td>
                      Monthly Fee
                    </td>

                    <td>
                      {formatRs(
                        selectedVoucher.feeAmount
                      )}
                    </td>

                  </tr>

                  <tr>

                    <td>

                      Late Fine

                      {Number(
                        selectedVoucher.lateDays
                      ) > 0 && (
                        <>
                          {" "}
                          (
                          {
                            selectedVoucher.lateDays
                          }{" "}
                          days × Rs.20)
                        </>
                      )}

                    </td>

                    <td>
                      {formatRs(
                        selectedVoucher.fine
                      )}
                    </td>

                  </tr>

                  <tr className="voucher-total-row">

                    <td>
                      Total Amount
                    </td>

                    <td>
                      {formatRs(
                        selectedVoucher.totalAmount
                      )}
                    </td>

                  </tr>

                </tbody>

              </table>


              {/* PAYMENT STATUS */}

              <div className="voucher-status-row">

                <span>
                  Payment Status
                </span>

                <strong>
                  {
                    selectedVoucher.paymentStatus
                  }
                </strong>

              </div>


              {/* FOOTER */}

              <div className="voucher-footer">

                <div>

                  <p>
                    Thank you for your payment.
                  </p>

                  <strong>
                    AIMS Academy
                  </strong>

                </div>

                <div className="voucher-signature">

                  <div className="signature-line"></div>

                  <span>
                    Authorized Signature
                  </span>

                </div>

              </div>

            </div>


            {/* MODAL ACTIONS */}

            <div className="fee-voucher-modal-actions">

              <button
                type="button"
                className="fee-voucher-cancel-button"
                onClick={closeVoucher}
              >
                Close
              </button>

              <button
                type="button"
                className="fee-voucher-print-button"
                onClick={handlePrint}
              >

                <Printer size={17} />

                Print Voucher

              </button>

            </div>

          </div>

        </div>

      )}

    </section>
  );
}

export default FeeVouchers;
