import { useEffect, useState } from "react";
import {
  Settings as SettingsIcon,
  School,
  Palette,
  Bell,
  ShieldCheck,
  Save,
} from "lucide-react";

function Settings() {
  /* =================================
     DEFAULT SETTINGS
  ================================= */

  const defaultSettings = {
    academyName: "AIMS Academy",
    phone: "03366084596",
    email: "aimsacademy06@gamil.com",
    address: "Garden Town, Multan",

    theme: "light",

    emailNotifications: true,
    newsNotifications: true,

    sessionTimeout: "30",
  };

  /* =================================
     GET SAVED THEME
  ================================= */

  const getSavedTheme = () => {
    const savedTheme =
      localStorage.getItem("aims_theme");

    if (
      savedTheme === "dark" ||
      savedTheme === "light"
    ) {
      return savedTheme;
    }

    try {
      const savedSettings =
        localStorage.getItem("aims_settings");

      if (savedSettings) {
        const parsedSettings =
          JSON.parse(savedSettings);

        if (
          parsedSettings.theme === "dark" ||
          parsedSettings.theme === "light"
        ) {
          return parsedSettings.theme;
        }
      }
    } catch {
      // Ignore invalid saved settings
    }

    return "light";
  };

  /* =================================
     APPLY THEME GLOBALLY
  ================================= */

  const applyTheme = (theme) => {
    const selectedTheme =
      theme === "dark"
        ? "dark"
        : "light";

    /* Apply to HTML */

    document.documentElement.setAttribute(
      "data-theme",
      selectedTheme
    );

    /* Apply to BODY for existing
       admin compatibility */

    if (selectedTheme === "dark") {
      document.body.classList.add(
        "dark-mode"
      );
    } else {
      document.body.classList.remove(
        "dark-mode"
      );
    }

    /* Save theme separately so the
       entire application can use it */

    localStorage.setItem(
      "aims_theme",
      selectedTheme
    );

    /* Save a timestamp so other
       parts of the application can
       detect the latest theme change */

    localStorage.setItem(
      "aims_theme_updated_at",
      Date.now().toString()
    );

    /* Notify components in the same tab */

    window.dispatchEvent(
      new CustomEvent(
        "aims-theme-change",
        {
          detail: {
            theme: selectedTheme,
          },
        }
      )
    );

    /* Notify other browser tabs */

    window.dispatchEvent(
      new StorageEvent(
        "storage",
        {
          key: "aims_theme",
          newValue: selectedTheme,
          storageArea: localStorage,
        }
      )
    );
  };

  /* =================================
     LOAD SETTINGS
  ================================= */

  const [settings, setSettings] = useState(
    () => {
      const savedSettings =
        localStorage.getItem(
          "aims_settings"
        );

      let parsedSettings = {};

      if (savedSettings) {
        try {
          parsedSettings =
            JSON.parse(savedSettings);
        } catch {
          parsedSettings = {};
        }
      }

      return {
        ...defaultSettings,
        ...parsedSettings,
        theme: getSavedTheme(),
      };
    }
  );

  const [saved, setSaved] =
    useState(false);

  /* =================================
     APPLY SAVED THEME WHEN SETTINGS
     PAGE LOADS
  ================================= */

  useEffect(() => {
    const currentTheme =
      getSavedTheme();

    applyTheme(currentTheme);

    /* Keep Settings state synchronized
       if another part of the application
       changed the theme */

    const handleThemeChange = (
      event
    ) => {
      const newTheme =
        event?.detail?.theme ||
        localStorage.getItem(
          "aims_theme"
        ) ||
        "light";

      setSettings((previous) => ({
        ...previous,
        theme:
          newTheme === "dark"
            ? "dark"
            : "light",
      }));
    };

    window.addEventListener(
      "aims-theme-change",
      handleThemeChange
    );

    return () => {
      window.removeEventListener(
        "aims-theme-change",
        handleThemeChange
      );
    };
  }, []);

  /* =================================
     HANDLE INPUT
  ================================= */

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setSettings((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    /* ---------------------------------
       APPLY THEME IMMEDIATELY WHEN
       THE USER CHANGES THE SELECT
    --------------------------------- */

    if (name === "theme") {
      applyTheme(value);
    }

    setSaved(false);
  };

  /* =================================
     SAVE SETTINGS
  ================================= */

  const handleSaveSettings = () => {
    const finalSettings = {
      ...settings,
      theme:
        settings.theme === "dark"
          ? "dark"
          : "light",
    };

    /* Save complete settings */

    localStorage.setItem(
      "aims_settings",
      JSON.stringify(
        finalSettings
      )
    );

    /* Apply and save theme globally */

    applyTheme(
      finalSettings.theme
    );

    /* Make sure React state contains
       the exact saved values */

    setSettings(
      finalSettings
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  /* =================================
     RENDER
  ================================= */

  return (
    <section className="settings-page">

      {/* =================================
          PAGE HEADER
      ================================= */}

      <div className="settings-header">

        <div>
          <p className="section-label">
            SYSTEM CONFIGURATION
          </p>

          <h1>
            Settings
          </h1>

          <p className="settings-description">
            Manage your academy information,
            appearance, notifications, and
            administrator preferences.
          </p>
        </div>

        <div className="settings-header-icon">
          <SettingsIcon size={26} />
        </div>

      </div>

      {/* =================================
          SETTINGS CONTENT
      ================================= */}

      <div className="settings-content">

        {/* =================================
            ACADEMY INFORMATION
        ================================= */}

        <div className="settings-card">

          <div className="settings-card-header">

            <div className="settings-card-icon">
              <School size={20} />
            </div>

            <div>
              <h2>
                Academy Information
              </h2>

              <p>
                Update the basic information
                used throughout the academy
                portal.
              </p>
            </div>

          </div>

          <div className="settings-form-grid">

            <div className="settings-form-group">

              <label htmlFor="academyName">
                Academy Name
              </label>

              <input
                id="academyName"
                name="academyName"
                type="text"
                value={
                  settings.academyName
                }
                onChange={
                  handleChange
                }
              />

            </div>

            <div className="settings-form-group">

              <label htmlFor="phone">
                Phone Number
              </label>

              <input
                id="phone"
                name="phone"
                type="text"
                value={settings.phone}
                onChange={
                  handleChange
                }
              />

            </div>

            <div className="settings-form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={settings.email}
                onChange={
                  handleChange
                }
              />

            </div>

            <div className="settings-form-group">

              <label htmlFor="address">
                Academy Address
              </label>

              <input
                id="address"
                name="address"
                type="text"
                value={
                  settings.address
                }
                onChange={
                  handleChange
                }
              />

            </div>

          </div>

        </div>

        {/* =================================
            APPEARANCE
        ================================= */}

        <div className="settings-card">

          <div className="settings-card-header">

            <div className="settings-card-icon">
              <Palette size={20} />
            </div>

            <div>
              <h2>
                Appearance
              </h2>

              <p>
                Choose how the admin portal
                and public website should look.
              </p>
            </div>

          </div>

          <div className="settings-option-group">

            <div className="settings-option-text">

              <strong>
                Portal Theme
              </strong>

              <span>
                Select your preferred
                interface theme.
              </span>

            </div>

            <select
              name="theme"
              value={settings.theme}
              onChange={
                handleChange
              }
              className="settings-select"
            >

              <option value="light">
                Light
              </option>

              <option value="dark">
                Dark
              </option>

            </select>

          </div>

        </div>

        {/* =================================
            NOTIFICATIONS
        ================================= */}

        <div className="settings-card">

          <div className="settings-card-header">

            <div className="settings-card-icon">
              <Bell size={20} />
            </div>

            <div>
              <h2>
                Notifications
              </h2>

              <p>
                Manage notification preferences
                for the admin portal.
              </p>
            </div>

          </div>

          <div className="settings-toggle-list">

            <label className="settings-toggle-row">

              <div>
                <strong>
                  Email Notifications
                </strong>

                <span>
                  Receive important system
                  notifications by email.
                </span>
              </div>

              <input
                type="checkbox"
                name="emailNotifications"
                checked={
                  settings.emailNotifications
                }
                onChange={
                  handleChange
                }
              />

            </label>

            <label className="settings-toggle-row">

              <div>
                <strong>
                  News Notifications
                </strong>

                <span>
                  Receive notifications when
                  academy news is published.
                </span>
              </div>

              <input
                type="checkbox"
                name="newsNotifications"
                checked={
                  settings.newsNotifications
                }
                onChange={
                  handleChange
                }
              />

            </label>

          </div>

        </div>

        {/* =================================
            SECURITY
        ================================= */}

        <div className="settings-card">

          <div className="settings-card-header">

            <div className="settings-card-icon">
              <ShieldCheck size={20} />
            </div>

            <div>
              <h2>
                Security
              </h2>

              <p>
                Manage basic administrator
                security preferences.
              </p>
            </div>

          </div>

          <div className="settings-option-group">

            <div className="settings-option-text">

              <strong>
                Session Timeout
              </strong>

              <span>
                Automatically end the admin
                session after inactivity.
              </span>

            </div>

            <select
              name="sessionTimeout"
              value={
                settings.sessionTimeout
              }
              onChange={
                handleChange
              }
              className="settings-select"
            >

              <option value="15">
                15 minutes
              </option>

              <option value="30">
                30 minutes
              </option>

              <option value="60">
                1 hour
              </option>

              <option value="120">
                2 hours
              </option>

            </select>

          </div>

        </div>

        {/* =================================
            SAVE
        ================================= */}

        <div className="settings-save-area">

          <button
            type="button"
            className="settings-save-button"
            onClick={
              handleSaveSettings
            }
          >

            <Save size={17} />

            {saved
              ? "Settings Saved"
              : "Save Settings"}

          </button>

        </div>

      </div>

    </section>
  );
}

export default Settings;
