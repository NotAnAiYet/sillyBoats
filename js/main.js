(function () {
  "use strict";

  var counterEl = document.getElementById("hit-counter");
  var cloneContainers = document.querySelectorAll(".hit-counter-clone");
  var guestForm = document.getElementById("guestbook-form");
  var guestToast = document.getElementById("guestbook-toast");
  var guestbookList = document.getElementById("guestbook-entries");
  var guestbookLoading = document.getElementById("guestbook-loading");
  var generalHint = document.getElementById("site-hint");
  var ringButtons = document.querySelectorAll("[data-ring]");
  var ringStatus = document.getElementById("ring-status");
  var confettiBtn = document.getElementById("confetti-btn");
  var confettiLayer = document.getElementById("confetti-layer");
  var yearEl = document.getElementById("year");
  var lastUpdatedEl = document.getElementById("last-updated");
  var easterLink = document.getElementById("easter-egg-link");

  var STORAGE_HITS = "sb_homepage_hits_v1";
  var HIT_ALREADY_COUNTED = "sb_homepage_hit_counted_v1";
  var GUESTBOOK_LIMIT = 35;
  var turnstileWidgetId = null;
  var DefaultHits = 1337;

  function getConfig() {
    return window.SB_SITE_CONFIG || {};
  }

  function isBackendConfigured() {
    var c = getConfig();
    return !!(
      c.supabaseUrl &&
      c.supabasePublishableKey
    );
  }

  function isTurnstileConfigured() {
    return !!String(getConfig().turnstileSiteKey || "").trim();
  }

  function supabaseBaseUrl() {
    return String(getConfig().supabaseUrl || "").replace(/\/$/, "");
  }

  function supabaseHeaders() {
    var key = getConfig().supabasePublishableKey;
    return {
      apikey: key,
      "Content-Type": "application/json",
    };
  }

  function padHits(n) {
    var s = String(Math.max(0, Math.floor(Number(n))));
    while (s.length < 7) {
      s = "0" + s;
    }
    return s.slice(-7);
  }

  function setCounterDisplay(n) {
    var display = padHits(n);
    if (counterEl) {
      counterEl.textContent = display;
    }
    cloneContainers.forEach(function (el) {
      el.textContent = display;
    });
  }

  function showHint(message) {
    if (!generalHint) return;
    generalHint.textContent = message;
    generalHint.classList.remove("d-none");
  }

  function hideHint() {
    if (!generalHint) return;
    generalHint.classList.add("d-none");
    generalHint.textContent = "";
  }

  function incrementHitCounterRemote() {
    return fetch(supabaseBaseUrl() + "/rest/v1/rpc/increment_hit_counter", {
      method: "POST",
      headers: supabaseHeaders(),
      body: "{}",
    }).then(function (res) {
      if (!res.ok) {
        return res.text().then(function (t) {
          throw new Error(t || String(res.status));
        });
      }
      return res.json();
    });
  }

  function initHitCounter() {
    if (localStorage.getItem(HIT_ALREADY_COUNTED)) {
      if (!isBackendConfigured()) {
        setCounterDisplay(DefaultHits);
        showHint("Demo mode: Connection to backend not working!");
        return Promise.resolve();
      }
      hideHint();
      // Fetch current count from backend but don't increment
      return fetch(supabaseBaseUrl() + "/rest/v1/hit_counter", {
        headers: supabaseHeaders(),
      })
        .then(function (res) {
          if (!res.ok) {
            return res.text().then(function (t) {
              throw new Error(t || String(res.status));
            });
          }
          return res.json();
        })
        .then(function (arr) {
          // Expecting [{count: ...}]
          var n = Array.isArray(arr) && arr.length && typeof arr[0].count === "number" ? arr[0].count : null;
          if (!Number.isFinite(n)) throw new Error("bad counter payload");
          setCounterDisplay(n);
        })
        .catch(function () {
          setCounterDisplay(DefaultHits);
          showHint("Could not reach Backend — showing default hits.");
        });
    } else {
      // First visit: increment and set flag
      localStorage.setItem(HIT_ALREADY_COUNTED, "1");
      if (!isBackendConfigured()) {
        setCounterDisplay(DefaultHits);
        showHint("Demo mode: Connection to backend not working!");
        return Promise.resolve();
      }
      hideHint();
      return incrementHitCounterRemote()
        .then(function (value) {
          var n = typeof value === "number" ? value : parseInt(value, 10);
          if (!Number.isFinite(n)) {
            throw new Error("bad counter payload");
          }
          setCounterDisplay(n);
        })
        .catch(function () {
          setCounterDisplay(DefaultHits);
          showHint("Could not reach Backend — showing default hits.");
        });
    }
  }

  function fetchGuestbook() {
    var q =
      "select=name,message,created_at&order=created_at.desc&limit=" +
      GUESTBOOK_LIMIT;
    return fetch(supabaseBaseUrl() + "/rest/v1/guestbook?" + q, {
      headers: supabaseHeaders(),
    }).then(function (res) {
      if (!res.ok) {
        return res.text().then(function (t) {
          throw new Error(t || String(res.status));
        });
      }
      return res.json();
    });
  }

  function formatGuestWhen(iso) {
    try {
      var d = new Date(iso);
      if (Number.isNaN(d.getTime())) return "";
      return d.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch (e) {
      return "";
    }
  }

  function renderGuestbook(rows) {
    if (!guestbookList) return;
    guestbookList.innerHTML = "";
    if (!rows || !rows.length) {
      var empty = document.createElement("li");
      empty.className = "guestbook-entry guestbook-empty small text-center";
      empty.textContent =
        "No approved entries yet — say hi below (shows after moderation).";
      guestbookList.appendChild(empty);
      return;
    }
    rows.forEach(function (row) {
      var li = document.createElement("li");
      li.className = "guestbook-entry";

      var meta = document.createElement("div");
      meta.className = "guestbook-entry-meta";

      var nameSpan = document.createElement("strong");
      nameSpan.className = "guestbook-name";
      nameSpan.textContent = row.name || "Anonymous";

      var when = document.createElement("span");
      when.className = "guestbook-when";
      when.textContent = formatGuestWhen(row.created_at);

      meta.appendChild(nameSpan);
      if (when.textContent) {
        meta.appendChild(document.createTextNode(" · "));
        meta.appendChild(when);
      }

      var msg = document.createElement("p");
      msg.className = "guestbook-message mb-0";
      msg.textContent = row.message || "";

      li.appendChild(meta);
      li.appendChild(msg);
      guestbookList.appendChild(li);
    });
  }

  function setGuestbookLoading(on) {
    if (!guestbookLoading) return;
    guestbookLoading.classList.toggle("d-none", !on);
  }

  function loadGuestbook() {
    if (!guestbookList) return Promise.resolve();
    if (!isBackendConfigured()) {
      renderGuestbook([]);
      return Promise.resolve();
    }
    setGuestbookLoading(true);
    return fetchGuestbook()
      .then(function (rows) {
        renderGuestbook(rows);
      })
      .catch(function () {
        renderGuestbook([]);
        if (generalHint && generalHint.classList.contains("d-none")) {
          showHint(
            "Guestbook could not load."
          );
        }
      })
      .finally(function () {
        setGuestbookLoading(false);
      });
  }

  function getTurnstileToken() {
    var ts = window.turnstile;
    if (!ts || turnstileWidgetId === null || turnstileWidgetId === undefined) {
      return "";
    }
    return ts.getResponse(turnstileWidgetId) || "";
  }

  function resetTurnstile() {
    var ts = window.turnstile;
    if (!ts || turnstileWidgetId === null || turnstileWidgetId === undefined) {
      return;
    }
    try {
      ts.reset(turnstileWidgetId);
    } catch (e) {
      /* ignore */
    }
  }

  function submitGuestbookEdge(name, message, turnstileToken, website) {
    return fetch(
      supabaseBaseUrl() + "/functions/v1/submit-guestbook",
      {
        method: "POST",
        headers: supabaseHeaders(),
        body: JSON.stringify({
          name: name,
          message: message,
          turnstileToken: turnstileToken,
          website: website,
        }),
      }
    ).then(function (res) {
      return res.text().then(function (t) {
        var body = {};
        try {
          body = t ? JSON.parse(t) : {};
        } catch (e) {
          body = {};
        }
        if (!res.ok) {
          var errMsg =
            body.error ||
            (t && t.length < 200 ? t : null) ||
            res.statusText ||
            "Request failed";
          throw new Error(errMsg);
        }
        return body;
      });
    });
  }

  function initTurnstile() {
    var container = document.getElementById("turnstile-container");
    if (!container) return;

    // Show the container when initializing
    container.style.display = "block";

    if (!isBackendConfigured()) {
      return;
    }

    var siteKey = String(getConfig().turnstileSiteKey || "").trim();
    if (!siteKey) {
       return;
    }

    var s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    s.async = true;
    s.defer = true;
    s.onload = function () {
      var ts = window.turnstile;
      if (!ts) return;
      turnstileWidgetId = ts.render(container, {
        sitekey: siteKey,
      });
    };
    s.onerror = function () {
      container.innerHTML =
        "<p class=\"small text-center text-danger mb-0\">Could not load captcha script (network/adblock).</p>";
    };
    document.head.appendChild(s);
  }

  function fakeSites(direction) {
    var sites = [
      "Pixel Prairie",
      "Teapot Territory",
      "GIF Glacier",
      "Under Construction Forever",
      "Mom's Recipe Cache",
    ];
    var i = Math.floor(Math.random() * sites.length);
    if (direction === "prev") {
      i = (i + sites.length - 1) % sites.length;
    } else if (direction === "next") {
      i = (i + 1) % sites.length;
    }
    return sites[i];
  }

  function initYear() {
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }
  }

  function initGuestbook() {
    if (!guestForm || !guestToast) return;

    guestForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var nameInput = document.getElementById("guest-name");
      var msgInput = document.getElementById("guest-msg");
      var hpInput = document.getElementById("guest-website");
      if (!nameInput || !msgInput) return;

      var name = nameInput.value.trim();
      var msg = msgInput.value.trim();
      var website = hpInput ? String(hpInput.value).trim() : "";

      if (!name || !msg) {
        guestToast.textContent = "Please fill in both fields, cool visitor!";
        guestToast.classList.add("visible");
        return;
      }

      if (!isBackendConfigured()) {
        guestToast.textContent =
          "Guestbook needs Backend";
        guestToast.classList.add("visible");
        return;
      }

      if (!isTurnstileConfigured()) {
        guestToast.textContent =
          "Captcha not configured";
        guestToast.classList.add("visible");
        return;
      }

      var token = getTurnstileToken();
      if (!token) {
        guestToast.textContent = "Complete the captcha challenge first.";
        guestToast.classList.add("visible");
        return;
      }

      guestToast.textContent = "Sending your message…";
      guestToast.classList.add("visible");

      submitGuestbookEdge(name, msg, token, website)
        .then(function () {
          guestToast.textContent =
            "Thanks, " +
            name +
            "! Your note is pending review — it will show here after approval.";
          guestForm.reset();
          resetTurnstile();
          return loadGuestbook();
        })
        .catch(function (err) {
          guestToast.textContent =
            "Could not save — Error in Backend";
          resetTurnstile();
        });
    });
  }

  function initWebring() {
    if (!ringStatus) return;

    ringButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var dir = btn.getAttribute("data-ring") || "random";
        var label = fakeSites(dir);
        ringStatus.textContent =
          "Transporting you to… \"" + label + "\" (okay, it's pretend — but enjoy the thought!)";
      });
    });
  }

  function spawnConfetti() {
    if (!confettiLayer) return;

    var colors = [
      "#ff006e",
      "#8338ec",
      "#3a86ff",
      "#ffbe0b",
      "#fb5607",
      "#06ffa5",
      "#ff69eb",
    ];
    var count = 48;
    for (var i = 0; i < count; i++) {
      var piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.style.left = Math.random() * 100 + "%";
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = 2.5 + Math.random() * 2 + "s";
      piece.style.animationDelay = Math.random() * 0.3 + "s";
      piece.style.setProperty("--dx", (Math.random() - 0.5) * 200 + "px");
      piece.addEventListener("animationend", function (e) {
        if (e.target && e.target.parentNode) {
          e.target.parentNode.removeChild(e.target);
        }
      });
      confettiLayer.appendChild(piece);
    }
  }

  function initConfetti() {
    if (!confettiBtn) return;
    confettiBtn.addEventListener("click", spawnConfetti);
  }

  function initEasterEgg() {
    if (!easterLink) return;
    var clicks = 0;
    easterLink.addEventListener("click", function (e) {
      e.preventDefault();
      clicks += 1;
      if (clicks === 3) {
        window.alert(
          'You found it!\n\nReal title of this page: "Yannicks Silly Paradise of horses and all other great things"'
        );
        clicks = 0;
      }
    });
  }

  function initLastUpdated() {
    if (!lastUpdatedEl) return;
    var cfg = getConfig();
    if (cfg.lastUpdated) {
      var iso = cfg.lastUpdated;
      lastUpdatedEl.setAttribute("datetime", iso);
      var d = new Date(iso);
      if (!isNaN(d.getTime())) {
        lastUpdatedEl.textContent = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      } else {
        lastUpdatedEl.textContent = iso;
      }
    }
  }

  initYear();
  initLastUpdated();
  initGuestbook();
  initWebring();
  initConfetti();
  initEasterEgg();

  // Only initialize Turnstile (captcha) after user starts typing in the guestbook form
  var turnstileInitialized = false;
  function maybeInitTurnstile() {
    if (!turnstileInitialized) {
      initTurnstile();
      turnstileInitialized = true;
    }
  }

  if (guestForm) {
    var nameInput = document.getElementById("guest-name");
    var msgInput = document.getElementById("guest-msg");
    [nameInput, msgInput].forEach(function (input) {
      if (input) {
        input.addEventListener("input", maybeInitTurnstile, { once: true });
      }
    });
  }

  initHitCounter().then(function () {
    return loadGuestbook();
  });
})();
