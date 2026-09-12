import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  Newspaper,
  CalendarDays,
  Eye,
  EyeOff,
  AlertTriangle,
} from "lucide-react";

const API_URL = "https://aims-academy-backend-production-a580.up.railway.app/api/news";

function NewsManagement() {
  /* =================================
     NEWS DATA
  ================================= */

  const [news, setNews] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =================================
     FORM STATE
  ================================= */

  const [showForm, setShowForm] = useState(false);

  const [editingNews, setEditingNews] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "General",
    date: new Date().toISOString().split("T")[0],
    content: "",
    status: "Published",
  });

  /* =================================
     SEARCH
  ================================= */

  const [search, setSearch] = useState("");

  /* =================================
     DELETE CONFIRMATION
  ================================= */

  const [deleteNewsId, setDeleteNewsId] = useState(null);

  const newsToDelete = news.find(
    (item) => item._id === deleteNewsId
  );

  /* =================================
     AUTH HEADERS
  ================================= */

  const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  /* =================================
     LOAD NEWS FROM MONGODB
  ================================= */

  const loadNews = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load academy news."
        );
      }

      setNews(data.news || []);
    } catch (error) {
      console.error("Unable to load news:", error);

      setError(
        error.message ||
          "Unable to load academy news."
      );

      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  /* =================================
     INITIAL LOAD
  ================================= */

  useEffect(() => {
    loadNews();
  }, []);

  /* =================================
     FORM CHANGE
  ================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =================================
     OPEN ADD FORM
  ================================= */

  const handleAddNews = () => {
    setEditingNews(null);

    setFormData({
      title: "",
      category: "General",
      date: new Date()
        .toISOString()
        .split("T")[0],
      content: "",
      status: "Published",
    });

    setShowForm(true);
  };

  /* =================================
     OPEN EDIT FORM
  ================================= */

  const handleEditNews = (item) => {
    setEditingNews(item);

    setFormData({
      title: item.title || "",
      category: item.category || "General",
      date:
        item.date ||
        new Date()
          .toISOString()
          .split("T")[0],
      content: item.content || "",
      status: item.status || "Published",
    });

    setShowForm(true);
  };

  /* =================================
     CLOSE FORM
  ================================= */

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingNews(null);
  };

  /* =================================
     SUBMIT FORM
  ================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Please enter a news title.");
      return;
    }

    if (!formData.content.trim()) {
      alert("Please enter the news content.");
      return;
    }

    try {
      setError("");

      /* =================================
         UPDATE EXISTING NEWS
      ================================= */

      if (editingNews) {
        const response = await fetch(
          `${API_URL}/${editingNews._id}`,
          {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(formData),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to update news."
          );
        }

        setNews((previous) =>
          previous.map((item) =>
            item._id === editingNews._id
              ? data.news
              : item
          )
        );

        handleCloseForm();

        return;
      }

      /* =================================
         CREATE NEW NEWS
      ================================= */

      const response = await fetch(API_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to create news."
        );
      }

      setNews((previous) => [
        data.news,
        ...previous,
      ]);

      handleCloseForm();
    } catch (error) {
      console.error(
        "Unable to save news:",
        error
      );

      setError(
        error.message ||
          "Unable to save news."
      );

      alert(
        error.message ||
          "Unable to save news."
      );
    }
  };

  /* =================================
     OPEN DELETE CONFIRMATION
  ================================= */

  const handleDeleteNews = (id) => {
    setDeleteNewsId(id);
  };

  /* =================================
     CONFIRM DELETE
  ================================= */

  const handleConfirmDelete = async () => {
    if (!deleteNewsId) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/${deleteNewsId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete news."
        );
      }

      setNews((previous) =>
        previous.filter(
          (item) =>
            item._id !== deleteNewsId
        )
      );

      setDeleteNewsId(null);
    } catch (error) {
      console.error(
        "Unable to delete news:",
        error
      );

      setError(
        error.message ||
          "Unable to delete news."
      );

      alert(
        error.message ||
          "Unable to delete news."
      );
    }
  };

  /* =================================
     CANCEL DELETE
  ================================= */

  const handleCancelDelete = () => {
    setDeleteNewsId(null);
  };

  /* =================================
     FILTER NEWS
  ================================= */

  const filteredNews = useMemo(() => {
    const searchValue =
      search.toLowerCase().trim();

    if (!searchValue) {
      return news;
    }

    return news.filter((item) => {
      return (
        item.title
          ?.toLowerCase()
          .includes(searchValue) ||
        item.category
          ?.toLowerCase()
          .includes(searchValue) ||
        item.content
          ?.toLowerCase()
          .includes(searchValue) ||
        item.status
          ?.toLowerCase()
          .includes(searchValue)
      );
    });
  }, [news, search]);

  /* =================================
     STATISTICS
  ================================= */

  const totalNews = news.length;

  const publishedNews = news.filter(
    (item) =>
      item.status === "Published"
  ).length;

  const draftNews = news.filter(
    (item) =>
      item.status === "Draft"
  ).length;

  /* =================================
     FORMAT DATE
  ================================= */

  const formatDate = (date) => {
    if (!date) {
      return "Not specified";
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =================================
     RENDER
  ================================= */

  return (
    <section className="news-management-page">

      {/* =================================
          PAGE HEADER
      ================================= */}

      <div className="news-management-header">

        <div>
          <p className="section-label">
            CONTENT MANAGEMENT
          </p>

          <h1>
            News Management
          </h1>

          <p className="news-management-description">
            Create, manage, publish, and
            update academy news and
            announcements.
          </p>
        </div>

        <button
          type="button"
          className="news-add-button"
          onClick={handleAddNews}
        >
          <Plus size={18} />
          Add News
        </button>

      </div>

      {/* =================================
          ERROR MESSAGE
      ================================= */}

      {error && (
        <div
          style={{
            marginBottom: "20px",
            padding: "12px 16px",
            borderRadius: "10px",
            background: "#fef2f2",
            color: "#b91c1c",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          {error}
        </div>
      )}

      {/* =================================
          SUMMARY CARDS
      ================================= */}

      <div className="news-summary-grid">

        <div className="news-summary-card">
          <div className="news-summary-icon">
            <Newspaper size={20} />
          </div>

          <div>
            <span>
              Total News
            </span>

            <strong>
              {totalNews}
            </strong>
          </div>
        </div>

        <div className="news-summary-card">
          <div className="news-summary-icon">
            <Eye size={20} />
          </div>

          <div>
            <span>
              Published
            </span>

            <strong>
              {publishedNews}
            </strong>
          </div>
        </div>

        <div className="news-summary-card">
          <div className="news-summary-icon">
            <EyeOff size={20} />
          </div>

          <div>
            <span>
              Drafts
            </span>

            <strong>
              {draftNews}
            </strong>
          </div>
        </div>

      </div>

      {/* =================================
          NEWS CONTENT
      ================================= */}

      <div className="news-management-content">

        {/* TOOLBAR */}

        <div className="news-management-toolbar">

          <div>
            <p className="section-label">
              NEWS & ANNOUNCEMENTS
            </p>

            <h2>
              Academy News
            </h2>
          </div>

          <div className="news-search-box">
            <Search size={17} />

            <input
              type="text"
              placeholder="Search news..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

        </div>

        {/* =================================
            LOADING STATE
        ================================= */}

        {loading ? (

          <div className="news-empty-state">

            <div className="news-empty-icon">
              <Newspaper size={34} />
            </div>

            <h3>
              Loading News...
            </h3>

            <p>
              Please wait while we load
              your academy news.
            </p>

          </div>

        ) : filteredNews.length === 0 ? (

          /* =================================
             EMPTY STATE
          ================================= */

          <div className="news-empty-state">

            <div className="news-empty-icon">
              <Newspaper size={34} />
            </div>

            <h3>
              {news.length === 0
                ? "No News Added Yet"
                : "No News Found"}
            </h3>

            <p>
              {news.length === 0
                ? "Start by creating your first academy news or announcement."
                : "Try changing your search to find another news item."}
            </p>

            {news.length === 0 && (
              <button
                type="button"
                className="news-empty-button"
                onClick={handleAddNews}
              >
                <Plus size={17} />
                Add Your First News
              </button>
            )}

          </div>

        ) : (

          /* =================================
             NEWS LIST
          ================================= */

          <div className="news-list">

            {filteredNews.map((item) => (

              <article
                className="news-management-card"
                key={item._id}
              >

                <div className="news-card-top">

                  <div className="news-card-category">
                    {item.category}
                  </div>

                  <span
                    className={
                      item.status ===
                      "Published"
                        ? "news-status published"
                        : "news-status draft"
                    }
                  >
                    {item.status ===
                    "Published" ? (
                      <Eye size={13} />
                    ) : (
                      <EyeOff size={13} />
                    )}

                    {item.status}
                  </span>

                </div>

                <h3>
                  {item.title}
                </h3>

                <p className="news-card-content">
                  {item.content}
                </p>

                <div className="news-card-footer">

                  <div className="news-card-date">
                    <CalendarDays size={15} />

                    <span>
                      {formatDate(item.date)}
                    </span>
                  </div>

                  <div className="news-card-actions">

                    <button
                      type="button"
                      className="news-edit-button"
                      onClick={() =>
                        handleEditNews(item)
                      }
                    >
                      <Edit3 size={15} />
                      Edit
                    </button>

                    <button
                      type="button"
                      className="news-delete-button"
                      onClick={() =>
                        handleDeleteNews(
                          item._id
                        )
                      }
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>

                  </div>

                </div>

              </article>

            ))}

          </div>
        )}

      </div>

      {/* =================================
          ADD / EDIT MODAL
      ================================= */}

      {showForm && (
        <div
          className="news-modal-overlay"
          onClick={handleCloseForm}
        >

          <div
            className="news-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="news-modal-header">

              <div>
                <p className="section-label">
                  CONTENT MANAGEMENT
                </p>

                <h2>
                  {editingNews
                    ? "Edit News"
                    : "Add News"}
                </h2>

                <p>
                  {editingNews
                    ? "Update this academy news item."
                    : "Create a new academy news or announcement."}
                </p>
              </div>

              <button
                type="button"
                className="news-modal-close"
                onClick={handleCloseForm}
              >
                <X size={19} />
              </button>

            </div>

            {/* FORM */}

            <form
              className="news-form"
              onSubmit={handleSubmit}
            >

              <div className="news-form-group">

                <label htmlFor="news-title">
                  News Title
                </label>

                <input
                  id="news-title"
                  name="title"
                  type="text"
                  placeholder="Enter news title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="news-form-row">

                <div className="news-form-group">

                  <label htmlFor="news-category">
                    Category
                  </label>

                  <select
                    id="news-category"
                    name="category"
                    value={
                      formData.category
                    }
                    onChange={handleChange}
                  >
                    <option value="General">
                      General
                    </option>

                    <option value="Announcement">
                      Announcement
                    </option>

                    <option value="Exam">
                      Exam
                    </option>

                    <option value="Result">
                      Result
                    </option>

                    <option value="Event">
                      Event
                    </option>

                    <option value="Holiday">
                      Holiday
                    </option>

                    <option value="Admission">
                      Admission
                    </option>

                    <option value="Achievement">
                      Achievement
                    </option>
                  </select>

                </div>

                <div className="news-form-group">

                  <label htmlFor="news-date">
                    Date
                  </label>

                  <input
                    id="news-date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

              <div className="news-form-group">

                <label htmlFor="news-status">
                  Status
                </label>

                <select
                  id="news-status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Published">
                    Published
                  </option>

                  <option value="Draft">
                    Draft
                  </option>
                </select>

              </div>

              <div className="news-form-group">

                <label htmlFor="news-content">
                  News Content
                </label>

                <textarea
                  id="news-content"
                  name="content"
                  placeholder="Write the news or announcement here..."
                  value={formData.content}
                  onChange={handleChange}
                  rows="7"
                  required
                />

              </div>

              {/* FORM ACTIONS */}

              <div className="news-form-actions">

                <button
                  type="button"
                  className="news-cancel-button"
                  onClick={handleCloseForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="news-save-button"
                >
                  {editingNews
                    ? "Update News"
                    : "Save News"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* =================================
          DELETE CONFIRMATION MODAL
      ================================= */}

      {deleteNewsId && (
        <div
          className="news-delete-modal-overlay"
          onClick={handleCancelDelete}
        >

          <div
            className="news-delete-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="news-delete-icon">
              <AlertTriangle size={25} />
            </div>

            <div className="news-delete-content">

              <h2>
                Delete News?
              </h2>

              <p>
                Are you sure you want to
                delete this news?
              </p>

              {newsToDelete && (
                <div className="news-delete-preview">

                  <strong>
                    {newsToDelete.title}
                  </strong>

                  <span>
                    {newsToDelete.category}
                  </span>

                </div>
              )}

              <p className="news-delete-warning">
                This action cannot be undone.
              </p>

            </div>

            <div className="news-delete-actions">

              <button
                type="button"
                className="news-delete-cancel-button"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>

              <button
                type="button"
                className="news-delete-confirm-button"
                onClick={handleConfirmDelete}
              >
                <Trash2 size={16} />
                Delete News
              </button>

            </div>

          </div>

        </div>
      )}

    </section>
  );
}

export default NewsManagement;