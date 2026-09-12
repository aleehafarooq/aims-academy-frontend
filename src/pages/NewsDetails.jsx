import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Newspaper,
} from "lucide-react";
import {
  Link,
  useParams,
} from "react-router-dom";

const API_URL = "https://aims-academy-backend-production-a580.up.railway.app/api/news";

function NewsDetails() {
  const { id } = useParams();

  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =================================
     LOAD NEWS FROM MONGODB
  ================================= */

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load news article."
          );
        }

        setNews(data.news || null);
      } catch (error) {
        console.error(
          "Unable to load news details:",
          error
        );

        setNews(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadNews();
    } else {
      setLoading(false);
      setNews(null);
    }
  }, [id]);

  /* =================================
     FORMAT DATE
  ================================= */

  const formatDate = (date) => {
    if (!date) {
      return "Date not specified";
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
        month: "long",
        year: "numeric",
      }
    );
  };

  /* =================================
     LOADING
  ================================= */

  if (loading) {
    return (
      <main className="news-details-page">

        <section className="news-details-not-found">

          <div className="news-details-not-found-icon">
            <Newspaper size={36} />
          </div>

          <p className="section-label">
            ACADEMY UPDATES
          </p>

          <h1>
            Loading News...
          </h1>

          <p>
            Please wait while we load
            the news article.
          </p>

        </section>

      </main>
    );
  }

  /* =================================
     NEWS NOT FOUND
  ================================= */

  if (!news) {
    return (
      <main className="news-details-page">

        <section className="news-details-not-found">

          <div className="news-details-not-found-icon">
            <Newspaper size={36} />
          </div>

          <p className="section-label">
            ACADEMY UPDATES
          </p>

          <h1>
            News Not Found
          </h1>

          <p>
            The news article you are
            looking for does not exist
            or is no longer published.
          </p>

          <Link
            to="/news"
            className="news-details-back-button"
          >
            <ArrowLeft size={17} />
            Back to News
          </Link>

        </section>

      </main>
    );
  }

  /* =================================
     NEWS DETAILS
  ================================= */

  return (
    <main className="news-details-page">

      {/* =================================
          HEADER
      ================================= */}

      <section className="news-details-header">

        <div className="news-details-container">

          <Link
            to="/news"
            className="news-details-back-link"
          >
            <ArrowLeft size={17} />
            Back to News
          </Link>

          <p className="section-label">
            ACADEMY UPDATES
          </p>

          <div className="news-details-category">
            {(
              news.category ||
              "General"
            ).toUpperCase()}
          </div>

          <h1>
            {news.title}
          </h1>

          <div className="news-details-meta">

            <CalendarDays size={17} />

            <span>
              {formatDate(news.date)}
            </span>

          </div>

        </div>

      </section>

      {/* =================================
          CONTENT
      ================================= */}

      <section className="news-details-content-section">

        <article className="news-details-content">

          <div className="news-details-content-icon">
            <Newspaper size={24} />
          </div>

          <div className="news-details-text">

            {news.content
              ?.split("\n")
              .map(
                (paragraph, index) => (
                  <p key={index}>
                    {paragraph}
                  </p>
                )
              )}

          </div>

        </article>

      </section>

      {/* =================================
          BOTTOM NAVIGATION
      ================================= */}

      <section className="news-details-bottom">

        <Link
          to="/news"
          className="news-details-back-button"
        >
          <ArrowLeft size={17} />
          Back to All News
        </Link>

      </section>

    </main>
  );
}

export default NewsDetails;