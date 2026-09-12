import { useEffect, useState } from "react";

function News() {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "https://aims-academy-backend-production-a580.up.railway.app/api/news"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load academy news."
          );
        }

        setNewsItems(data.news || []);
      } catch (error) {
        console.error(
          "Unable to load academy news:",
          error
        );

        setError(
          "Unable to load academy news. Please try again later."
        );

        setNewsItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  const getDateParts = (date) => {
    if (!date) {
      return {
        day: "--",
        month: "---",
      };
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return {
        day: "--",
        month: "---",
      };
    }

    return {
      day: parsedDate
        .getDate()
        .toString()
        .padStart(2, "0"),

      month: parsedDate
        .toLocaleDateString("en-US", {
          month: "short",
        })
        .toUpperCase(),
    };
  };

  const getDescription = (content) => {
    if (!content) {
      return "";
    }

    const cleanContent =
      String(content).trim();

    if (cleanContent.length <= 180) {
      return cleanContent;
    }

    return (
      cleanContent.substring(0, 180).trim() +
      "..."
    );
  };

  return (
    <main className="news-page">
      <section className="news-header">
        <div className="news-header-container">
          <p className="section-label">
            ACADEMY UPDATES
          </p>

          <h1>
            Latest News &
            <br />
            Announcements
          </h1>

          <p className="news-header-description">
            Stay informed about the latest
            announcements, admissions,
            academic updates, important
            dates, and activities at AIMS
            Academy.
          </p>
        </div>
      </section>

      <section className="news-section">
        <div className="news-list">
          {loading ? (
            <div className="news-empty-public">
              <p className="section-label">
                ACADEMY UPDATES
              </p>

              <h2>
                Loading News...
              </h2>

              <p>
                Please wait while we load the
                latest announcements from
                AIMS Academy.
              </p>
            </div>
          ) : error ? (
            <div className="news-empty-public">
              <p className="section-label">
                ACADEMY UPDATES
              </p>

              <h2>
                Unable to Load News
              </h2>

              <p>
                {error}
              </p>
            </div>
          ) : newsItems.length === 0 ? (
            <div className="news-empty-public">
              <p className="section-label">
                ACADEMY UPDATES
              </p>

              <h2>
                No News Available
              </h2>

              <p>
                There are currently no
                published announcements.
                Please check back later
                for the latest updates from
                AIMS Academy.
              </p>
            </div>
          ) : (
            newsItems.map((news) => {
              const dateParts =
                getDateParts(news.date);

              return (
                <article
                  className="news-card"
                  key={news._id}
                >
                  <div className="news-date">
                    <strong>
                      {dateParts.day}
                    </strong>

                    <span>
                      {dateParts.month}
                    </span>
                  </div>

                  <div className="news-content">
                    <p className="news-category">
                      {(
                        news.category ||
                        "GENERAL"
                      ).toUpperCase()}
                    </p>

                    <h2>
                      {news.title}
                    </h2>

                    <p className="news-description">
                      {getDescription(
                        news.content
                      )}
                    </p>

                    <a
                      href={`/news/${news._id}`}
                      className="news-read-more"
                    >
                      Read More →
                    </a>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>

      <section className="news-notice">
        <p className="section-label">
          STAY CONNECTED
        </p>

        <h2>
          Important academy information
          will be shared here.
        </h2>

        <p>
          Check this page regularly for
          new announcements, academic
          information, admission updates,
          events, and other important
          notices from AIMS Academy.
        </p>
      </section>
    </main>
  );
}

export default News;