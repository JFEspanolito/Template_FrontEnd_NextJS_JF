// oneko.js: https://github.com/adryd325/oneko.js

(async function oneko() {
  
  const nekoEl = document.createElement("div");
  let nekoPosX = 32,
    nekoPosY = 32,
    mousePosX = 0,
    mousePosY = 0,
    frameCount = 0,
    idleTime = 0,
    idleAnimation = null,
    idleAnimationFrame = 0,
    forceSleep = false,
    grabbing = false,
    grabStop = true,
    nudge = false,
    kuroNeko = false,
    variant = "classic";

  function parseLocalStorage(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(`oneko:${key}`));
      return typeof value === typeof fallback ? value : fallback;
    } catch (e) {
      console.error(e?.message || String(e));
      return fallback;
    }
  }

  const nekoSpeed = 10;
  let variants = [];
  let variantsLoaded = false;
  let returningToBed = false;
  let bedTargetX = null;
  let bedTargetY = null;
  let ignoreMouse = false;

  async function loadVariants() {
    variants = [
      ["classic", "Classic"],
      ["dog", "Dog"],
      ["maia", "Maia"],
      ["tora", "Tora"],
      ["vaporwave", "Vaporwave"]
    ];
    variantsLoaded = true;
  }
  const spriteSets = {
      idle: [[-3, -3]],
      alert: [[-7, -3]],
      scratchSelf: [
        [-5, 0],
        [-6, 0],
        [-7, 0],
      ],
      scratchWallN: [
        [0, 0],
        [0, -1],
      ],
      scratchWallS: [
        [-7, -1],
        [-6, -2],
      ],
      scratchWallE: [
        [-2, -2],
        [-2, -3],
      ],
      scratchWallW: [
        [-4, 0],
        [-4, -1],
      ],
      tired: [[-3, -2]],
      sleeping: [
        [-2, 0],
        [-2, -1],
      ],
      N: [
        [-1, -2],
        [-1, -3],
      ],
      NE: [
        [0, -2],
        [0, -3],
      ],
      E: [
        [-3, 0],
        [-3, -1],
      ],
      SE: [
        [-5, -1],
        [-5, -2],
      ],
      S: [
        [-6, -3],
        [-7, -2],
      ],
      SW: [
        [-5, -3],
        [-6, -1],
      ],
      W: [
        [-4, -2],
        [-4, -3],
      ],
      NW: [
        [-1, 0],
        [-1, -1],
      ],
    };
  // Get keys with 2 or more sprites
  const keys = Object.keys(spriteSets).filter((key) => spriteSets[key].length > 1);
  const usedKeys = new Set();

  function sleep() {
    forceSleep = !forceSleep;
    nudge = false;
    localStorage.setItem("oneko:forceSleep", forceSleep);
    if (!forceSleep) {
      resetIdleAnimation();
      return;
    }

    // If Full App Display is on, sleep on its progress bar instead
    const fullAppDisplay = document.getElementById("fad-progress");
    if (fullAppDisplay) {
      mousePosX = fullAppDisplay.getBoundingClientRect().right - 16;
      mousePosY = fullAppDisplay.getBoundingClientRect().top - 12;
      return;
    }

    // Get the far right and top of the progress bar (guarded)
    const progressBar = document.querySelector(".main-nowPlayingBar-center .playback-progressbar");
    if (!progressBar) {
      // No progress bar found on this page — fall back to top-right corner
      mousePosX = window.innerWidth - 16;
      mousePosY = 16;
      return;
    }

    const pRect = progressBar.getBoundingClientRect();
    const progressBarRight = pRect.right;
    const progressBarTop = pRect.top;
    const progressBarBottom = pRect.bottom;

    // Make the cat sleep on the progress bar
    mousePosX = progressBarRight - 16;
    mousePosY = progressBarTop - 8;

    // Get the position of the remaining time (guarded)
    const remainingTime = document.querySelector(".main-playbackBarRemainingTime-container");
    let remainingTimeLeft = Infinity;
    let remainingTimeBottom = -Infinity;
    let remainingTimeTop = Infinity;
    if (remainingTime) {
      const rRect = remainingTime.getBoundingClientRect();
      remainingTimeLeft = rRect.left;
      remainingTimeBottom = rRect.bottom;
      remainingTimeTop = rRect.top;
    }

    // Get the position of elapsed time (guarded)
    const elapsedTime = document.querySelector(".playback-bar__progress-time-elapsed");
    let elapsedTimeRight = -Infinity;
    let elapsedTimeLeft = Infinity;
    if (elapsedTime) {
      const eRect = elapsedTime.getBoundingClientRect();
      elapsedTimeRight = eRect.right;
      elapsedTimeLeft = eRect.left;
    }

    // If the remaining time is on top right of the progress bar, make the cat sleep a little to the left of the remaining time
    // Theme compatibility
    if (remainingTimeLeft < progressBarRight && remainingTimeTop < progressBarBottom && progressBarTop - remainingTimeBottom < 32) {
      mousePosX = remainingTimeLeft - 16;

      // Comfy special case
      if (window.Spicetify?.Config?.current_theme === "Comfy") {
        mousePosY = progressBarTop - 14;
      }

      // Move the cat to the left of elapsed time if it is too close to the remaining time (Nord theme)
      if (remainingTimeLeft - elapsedTimeRight < 32) {
        mousePosX = elapsedTimeLeft - 16;
      }
    }
  }

  function create() {
    
    variant = parseLocalStorage("variant", "classic");
    kuroNeko = parseLocalStorage("kuroneko", false);

    if (!variants.some((v) => v[0] === variant)) {
      variant = "classic";
    }

    nekoEl.id = "oneko";
    nekoEl.style.width = "32px";
    nekoEl.style.height = "32px";
    nekoEl.style.position = "fixed";
    // nekoEl.style.pointerEvents = "none";
    nekoEl.style.backgroundImage = `url('/onekoAssets/oneko-${variant}.gif')`;
    nekoEl.style.imageRendering = "pixelated";
    nekoEl.style.left = `${nekoPosX - 16}px`;
    nekoEl.style.top = `${nekoPosY - 16}px`;
    nekoEl.style.filter = kuroNeko ? "invert(100%)" : "none";
    // Render Oneko below Spicetify's Popup Modal
    // Ensure Oneko renders above the bed image (bed uses z-index 9999)
    nekoEl.style.zIndex = "10001";

    document.body.appendChild(nekoEl);

    window.addEventListener("mousemove", (e) => {
      if (forceSleep) return;
      if (ignoreMouse) {
        // occasional debug suppressed to avoid spamming console
        return;
      }

      mousePosX = e.clientX;
      mousePosY = e.clientY;
    });

    window.addEventListener("resize", () => {
      if (forceSleep) {
        forceSleep = false;
        sleep();
      }
    });

    // Handle dragging of the cat
    nekoEl.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      grabbing = true;
      let startX = e.clientX;
      let startY = e.clientY;
      let startNekoX = nekoPosX;
      let startNekoY = nekoPosY;
      let grabInterval;

      const mousemove = (e) => {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        // Scratch in the opposite direction of the drag
        if (absDeltaX > absDeltaY && absDeltaX > 10) {
          setSprite(deltaX > 0 ? "scratchWallW" : "scratchWallE", frameCount);
        } else if (absDeltaY > absDeltaX && absDeltaY > 10) {
          setSprite(deltaY > 0 ? "scratchWallN" : "scratchWallS", frameCount);
        }

        if (grabStop || absDeltaX > 10 || absDeltaY > 10 || Math.sqrt(deltaX ** 2 + deltaY ** 2) > 10) {
          grabStop = false;
          clearTimeout(grabInterval);
          grabInterval = setTimeout(() => {
            grabStop = true;
            nudge = false;
            startX = e.clientX;
            startY = e.clientY;
            startNekoX = nekoPosX;
            startNekoY = nekoPosY;
          }, 150);
        }

        nekoPosX = startNekoX + e.clientX - startX;
        nekoPosY = startNekoY + e.clientY - startY;
        nekoEl.style.left = `${nekoPosX - 16}px`;
        nekoEl.style.top = `${nekoPosY - 16}px`;
      };

      const mouseup = () => {
        grabbing = false;
        nudge = true;
        resetIdleAnimation();
        window.removeEventListener("mousemove", mousemove);
        window.removeEventListener("mouseup", mouseup);
      };

      window.addEventListener("mousemove", mousemove);
      window.addEventListener("mouseup", mouseup);
    });

    nekoEl.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      kuroNeko = !kuroNeko;
      localStorage.setItem("oneko:kuroneko", kuroNeko);
      nekoEl.style.filter = kuroNeko ? "invert(100%)" : "none";
    });

    nekoEl.addEventListener("dblclick", sleep);

    window.onekoInterval = setInterval(frame, 100);
  }

  function getSprite(name, frame) {
    return spriteSets[name][frame % spriteSets[name].length];
  }

  function setSprite(name, frame) {
    const sprite = getSprite(name, frame);
    nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
  }

  function resetIdleAnimation() {
    idleAnimation = null;
    idleAnimationFrame = 0;
  }

  function idle() {
    idleTime += 1;

    // every ~ 20 seconds
    if (idleTime > 10 && Math.floor(Math.random() * 200) == 0 && idleAnimation == null) {
      let avalibleIdleAnimations = ["sleeping", "scratchSelf"];
      if (nekoPosX < 32) {
        avalibleIdleAnimations.push("scratchWallW");
      }
      if (nekoPosY < 32) {
        avalibleIdleAnimations.push("scratchWallN");
      }
      if (nekoPosX > window.innerWidth - 32) {
        avalibleIdleAnimations.push("scratchWallE");
      }
      if (nekoPosY > window.innerHeight - 32) {
        avalibleIdleAnimations.push("scratchWallS");
      }
      idleAnimation = avalibleIdleAnimations[Math.floor(Math.random() * avalibleIdleAnimations.length)];
    }

    if (forceSleep) {
      avalibleIdleAnimations = ["sleeping"];
      idleAnimation = "sleeping";
    }

    switch (idleAnimation) {
      case "sleeping":
        if (idleAnimationFrame < 8 && nudge && forceSleep) {
          setSprite("idle", 0);
          break;
        } else if (nudge) {
          nudge = false;
          resetIdleAnimation();
        }
        if (idleAnimationFrame < 8) {
          setSprite("tired", 0);
          break;
        }
        setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
        if (idleAnimationFrame > 192 && !forceSleep) {
          resetIdleAnimation();
        }
        break;
      case "scratchWallN":
      case "scratchWallS":
      case "scratchWallE":
      case "scratchWallW":
      case "scratchSelf":
        setSprite(idleAnimation, idleAnimationFrame);
        if (idleAnimationFrame > 9) {
          resetIdleAnimation();
        }
        break;
      default:
        setSprite("idle", 0);
        return;
    }
    idleAnimationFrame += 1;
  }

  function frame() {
    frameCount += 1;

    if (grabbing) {
      grabStop && setSprite("alert", 0);
      return;
    }

    // Choose movement target: bed target when returning, otherwise mouse
    const targetX = returningToBed && bedTargetX != null ? bedTargetX : mousePosX;
    const targetY = returningToBed && bedTargetY != null ? bedTargetY : mousePosY;

    const diffX = nekoPosX - targetX;
    const diffY = nekoPosY - targetY;
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

    // If we are actively returning to the bed, check for arrival
    if (returningToBed && distance < 20) {
      arriveAtBed();
      idle();
      return;
    }
    // Cat has to sleep on top of the progress bar
    if (forceSleep && Math.abs(diffY) < nekoSpeed && Math.abs(diffX) < nekoSpeed) {
      // Make the cat sleep exactly on the top of the progress bar
      nekoPosX = mousePosX;
      nekoPosY = mousePosY;
      nekoEl.style.left = `${nekoPosX - 16}px`;
      nekoEl.style.top = `${nekoPosY - 16}px`;

      idle();
      return;
    }

    if ((distance < nekoSpeed || distance < 48) && !forceSleep) {
      idle();
      return;
    }

    idleAnimation = null;
    idleAnimationFrame = 0;

    if (idleTime > 1) {
      setSprite("alert", 0);
      // count down after being alerted before moving
      idleTime = Math.min(idleTime, 7);
      idleTime -= 1;
      return;
    }

    direction = diffY / distance > 0.5 ? "N" : "";
    direction += diffY / distance < -0.5 ? "S" : "";
    direction += diffX / distance > 0.5 ? "W" : "";
    direction += diffX / distance < -0.5 ? "E" : "";
    setSprite(direction, frameCount);

    nekoPosX -= (diffX / distance) * nekoSpeed;
    nekoPosY -= (diffY / distance) * nekoSpeed;

    nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
    nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);

    nekoEl.style.left = `${nekoPosX - 16}px`;
    nekoEl.style.top = `${nekoPosY - 16}px`;
  }

  // Initialize neko position from the draggable bed saved by the React component
  // This runs once on load so the cat starts at the bed's position.
  (function initFromBed() {
    try {
      const raw = localStorage.getItem("oneko:bedPosition");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed.x === "number" && typeof parsed.y === "number") {
          // The React component stores the bed's top-left coordinates; neko uses a center coordinate offset of 16px
          let x = parsed.x + 16;
          let y = parsed.y + 16;
          x = Math.min(Math.max(16, x), window.innerWidth - 16);
          y = Math.min(Math.max(16, y), window.innerHeight - 16);
          nekoPosX = x;
          nekoPosY = y;
        }
      }
    } catch (e) {
      // ignore parsing errors
    }
  })();

  function goToBed() {
    try {
      const raw = localStorage.getItem("oneko:bedPosition");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (typeof parsed.x === "number" && typeof parsed.y === "number") {
        let bx = parsed.x + 16;
        let by = parsed.y + 16;
        bx = Math.min(Math.max(16, bx), window.innerWidth - 16);
        by = Math.min(Math.max(16, by), window.innerHeight - 16);
        // Use a dedicated bed target so mouse movements don't override it
        bedTargetX = bx;
        bedTargetY = by;
        // set mousePos to bed target so movement follows a straight path
        mousePosX = bx;
        mousePosY = by;
        ignoreMouse = true;
        returningToBed = true;
        forceSleep = false;
        nudge = false;
        idleTime = 0;
      }
    } catch (e) {
      // ignore
    }
  }

  function arriveAtBed() {
    returningToBed = false;
    ignoreMouse = false;
    
    // snap to bed
    nekoPosX = bedTargetX ?? mousePosX;
    nekoPosY = bedTargetY ?? mousePosY;
    nekoEl.style.left = `${nekoPosX - 16}px`;
    nekoEl.style.top = `${nekoPosY - 16}px`;
    forceSleep = true;
    window.onekoAtBed = true;
    
    resetIdleAnimation();
  }

  // Do not create Oneko immediately — wait for explicit show event from the page (bed click)
  window.onekoShown = false;
  window.onekoAtBed = false;
  function showOneko(evt) {
    try {
      const cx = evt?.detail?.x;
      const cy = evt?.detail?.y;
      
      // If not shown yet, create and show
      if (!window.onekoShown) {
        create();
        window.onekoShown = true;
        window.onekoAtBed = false;
        // initialize mouse position from click so the cat will follow immediately
        if (typeof cx === "number" && typeof cy === "number") {
          mousePosX = cx;
          mousePosY = cy;
          ignoreMouse = false;
          
        }
        return;
      }

      // If the cat is currently saved at the bed, wake it up (allow it to move again)
      if (window.onekoAtBed) {
        window.onekoAtBed = false;
        forceSleep = false;
        returningToBed = false;
        ignoreMouse = false;
        
        // Clear any bed target so we follow the cursor
        bedTargetX = null;
        bedTargetY = null;
        // update mouse pos from the click so it starts following right away
        if (typeof cx === "number" && typeof cy === "number") {
          mousePosX = cx;
          mousePosY = cy;
        }
        // reset movement timers so frame() will move immediately
        idleTime = 0;
        nudge = false;
        resetIdleAnimation();
        return;
      }

      // If the cat is currently returning to bed, cancel return and wake immediately
      if (returningToBed) {
        
        returningToBed = false;
        ignoreMouse = false;
        bedTargetX = null;
        bedTargetY = null;
        window.onekoAtBed = false;
        forceSleep = false;
        // set mouse pos from click so it follows immediately
        if (typeof cx === "number" && typeof cy === "number") {
          mousePosX = cx;
          mousePosY = cy;
        }
        idleTime = 0;
        nudge = false;
        resetIdleAnimation();
        return;
      }

      // Otherwise, command the cat to run back to the bed and sleep there
      goToBed();
      } catch (e) {
        console.error("Failed to handle oneko:show:", e?.message || String(e));
    }
  }

  window.addEventListener("oneko:show", showOneko);

  function getRandomSprite() {
    let unusedKeys = keys.filter((key) => !usedKeys.has(key));
    if (unusedKeys.length === 0) {
      usedKeys.clear();
      unusedKeys = keys;
    }
    const index = Math.floor(Math.random() * unusedKeys.length);
    const key = unusedKeys[index];
    usedKeys.add(key);
    return [getSprite(key, 0), getSprite(key, 1)];
  }

  function setVariant(arr) {
    variant = arr[0];
    localStorage.setItem("oneko:variant", `"${variant}"`);
    nekoEl.style.backgroundImage = `url('/onekoAssets/oneko-${variant}.gif')`;
    // Close any open picker (fallback or Spicetify) after selecting variant
    closePicker();
  }

  function closePicker() {
    // Remove fallback overlay if present
    const overlay = document.getElementById("oneko-picker-fallback");
    if (overlay) overlay.remove();

    // Try to close Spicetify popup if available
    try {
      const pm = window.Spicetify?.PopupModal;
      if (pm) {
        // Try common close method names used by modal APIs
        if (typeof pm.close === "function") pm.close();
        else if (typeof pm.hide === "function") pm.hide();
        else if (typeof pm.dismiss === "function") pm.dismiss();
      }
    } catch (e) {
      // ignore
    }
    // Also remove any DOM modal that contains our picker content as a fallback
    try {
      const containers = document.querySelectorAll('.oneko-variant-container');
      containers.forEach((c) => {
        // Prefer removing an ancestor with role=dialog
        let ancestor = c.closest('[role="dialog"]');
        if (ancestor && ancestor !== document.body) {
          ancestor.remove();
          return;
        }

        // Otherwise look for an ancestor whose class name looks like a popup/modal
        ancestor = c.parentElement;
        let steps = 0;
        while (ancestor && ancestor !== document.body && steps < 8) {
          const cls = (ancestor.className || "") + "";
          if (/popup|modal|overlay|portal|tippy|spicetify|sp-popup/i.test(cls)) {
            ancestor.remove();
            return;
          }
          ancestor = ancestor.parentElement;
          steps += 1;
        }

        // Fallback: remove the container itself
        c.remove();
      });
    } catch (err) {
      // ignore DOM removal errors
    }
  }

  // Popup modal to choose variant
  function pickerModal() {
    const container = document.createElement("div");
    container.className = "oneko-variant-container";

    const style = document.createElement("style");
    // Each variant is a 64x64 sprite; grid with max 5 per row
    style.innerHTML = `
      .oneko-variant-container {
        display: grid;
        grid-template-columns: repeat(5, 64px);
        gap: 8px;
        justify-content: center;
        align-items: center;
        padding: 8px 0;
      }
      .oneko-variant-button {
        width: 64px;
        height: 64px;
        cursor: pointer;
        background-size: 800%;
        border-radius: 8px;
        transition: background-color 0.15s ease-in-out, transform 0.12s;
        background-position: var(--idle-x) var(--idle-y);
        image-rendering: pixelated;
      }
      .oneko-variant-button:hover, .oneko-variant-button-selected {
        background-color: var(--spice-main-elevated, rgba(255,255,255,0.06));
        transform: translateY(-2px);
      }
      .oneko-variant-button:active { transform: translateY(0); }
    `;
    container.appendChild(style);

    const [idle, active] = getRandomSprite();

    function variantButton(variantEnum) {
      const div = document.createElement("div");

      div.className = "oneko-variant-button";
      div.id = variantEnum[0];
      div.style.backgroundImage = `url('/onekoAssets/oneko-${variantEnum[0]}.gif')`;
      div.style.setProperty("--idle-x", `${idle[0] * 64}px`);
      div.style.setProperty("--idle-y", `${idle[1] * 64}px`);
      div.style.setProperty("--active-x", `${active[0] * 64}px`);
      div.style.setProperty("--active-y", `${active[1] * 64}px`);

      div.onclick = () => {
        setVariant(variantEnum);
        document.querySelector(".oneko-variant-button-selected")?.classList.remove("oneko-variant-button-selected");
        div.classList.add("oneko-variant-button-selected");
      };

      if (variantEnum[0] === variant) {
        div.classList.add("oneko-variant-button-selected");
      }

      window.Spicetify?.Tippy?.(div, {
        ...(window.Spicetify?.TippyProps || {}),
        content: variantEnum[1],
      });

      return div;
    }

    for (const variant of variants) {
      container.appendChild(variantButton(variant));
    }

    return container;
  }

  // Listen for requests to open the variant picker. The picker is shown via Spicetify's PopupModal
  // when available. If Spicetify isn't ready yet, poll until it is.
  async function showPicker() {
    await loadVariants();
    if (window.Spicetify?.PopupModal?.display) {
      window.Spicetify.PopupModal.display({
        title: "Choose your neko",
        content: pickerModal(),
      });
      return;
    }
    // Show fallback immediately to avoid delay, then poll in background
    fallbackShowPicker();
    let attempts = 0;
    const t = setInterval(() => {
      attempts += 1;
      if (window.Spicetify?.PopupModal?.display) {
        clearInterval(t);
        // Remove fallback if present, then display the Spicetify modal
        const overlay = document.getElementById("oneko-picker-fallback");
        overlay?.remove();
        window.Spicetify.PopupModal.display({
          title: "Choose your neko",
          content: pickerModal(),
        });
      } else if (attempts > 100) {
        // stop polling after a while
        clearInterval(t);
      }
    }, 200);
  }

  function fallbackShowPicker() {
    if (document.getElementById("oneko-picker-fallback")) return;
    const overlay = document.createElement("div");
    overlay.id = "oneko-picker-fallback";
    overlay.style.position = "fixed";
    overlay.style.left = "0";
    overlay.style.top = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.background = "rgba(0,0,0,0.6)";
    overlay.style.zIndex = 10000;
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";

    const modal = document.createElement("div");
    modal.style.background = "var(--background, #222)";
    modal.style.color = "var(--foreground, #fff)";
    modal.style.borderRadius = "8px";
    modal.style.padding = "16px";
    modal.style.minWidth = "320px";
    modal.style.maxWidth = "90vw";
    modal.style.maxHeight = "80vh";
    modal.style.overflow = "auto";
    modal.style.boxShadow = "0 8px 24px rgba(0,0,0,0.5)";

    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";
    header.style.marginBottom = "8px";

    const title = document.createElement("div");
    title.textContent = "Choose your neko";
    title.style.fontSize = "16px";
    title.style.fontWeight = "600";
    header.appendChild(title);

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "✕";
    closeBtn.style.background = "transparent";
    closeBtn.style.border = "none";
    closeBtn.style.color = "inherit";
    closeBtn.style.fontSize = "18px";
    closeBtn.style.cursor = "pointer";
    closeBtn.onclick = () => overlay.remove();
    header.appendChild(closeBtn);

    modal.appendChild(header);

    const content = pickerModal();
    modal.appendChild(content);

    overlay.appendChild(modal);
    overlay.addEventListener("click", (ev) => {
      if (ev.target === overlay) overlay.remove();
    });

    document.body.appendChild(overlay);
  }

  window.addEventListener("oneko:picker", (e) => {
    e.preventDefault?.();
    showPicker();
  });

  if (parseLocalStorage("forceSleep", false)) {
    while (!document.querySelector(".main-nowPlayingBar-center .playback-progressbar")) {
      await new Promise((r) => setTimeout(r, 100));
    }
    sleep();
  }
})();

export {};
