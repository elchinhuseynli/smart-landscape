class Tabs {
  constructor(selector, options = {}) {
    this.options = this.getDefaultOptions(options);
    this.tabsContainer = document.querySelector(selector);

    if (!this.tabsContainer) {
      console.error("Tabs container not found");
      return;
    }

    this.tabNavs = this.tabsContainer.querySelectorAll(
      this.options.navSelector
    );
    this.tabContents = this.tabsContainer.querySelectorAll(
      this.options.contentSelector
    );

    this.setupARIA();
    this.bindEvents();
    this.initializeTabs();
  }

  getDefaultOptions(options) {
    return {
      navSelector: options.navSelector || '[data-tab="nav"]',
      contentSelector: options.contentSelector || '[data-tab="content"]',
      titleSelector: options.titleSelector || '[data-tab="title"]',
      activeClass: options.activeClass || "active",
      contentActiveClass: options.contentActiveClass || "active-tab",
      updateURL: options.updateURL !== undefined ? options.updateURL : true,
    };
  }

  setupARIA() {
    this.tabsContainer.setAttribute("role", "tablist");
    this.tabNavs.forEach((nav, index) => this.setupNavARIA(nav, index));
    this.tabContents.forEach((content, index) =>
      this.setupContentARIA(content, index)
    );
  }

  setupNavARIA(nav, index) {
    const panelId = `tabpanel${index}`;
    const tabId = `tab${index}`;

    nav.setAttribute("role", "tab");
    nav.setAttribute("aria-selected", "false");
    nav.setAttribute("aria-controls", panelId);
    nav.setAttribute("id", tabId);
    nav.setAttribute("tabindex", "-1");
  }

  setupContentARIA(content, index) {
    const tabId = `tab${index}`;

    content.setAttribute("role", "tabpanel");
    content.setAttribute("aria-labelledby", tabId);
    content.setAttribute("aria-hidden", "true");
    content.setAttribute("id", `tabpanel${index}`);
    content.setAttribute("tabindex", "0");
  }

  bindEvents() {
    this.tabNavs.forEach((nav, index) => {
      nav.addEventListener("click", (e) => {
        e.preventDefault();
        this.activateTab(index, true);
      });
      nav.addEventListener("keydown", (e) => this.handleKeydown(e, index));
    });

    window.addEventListener("hashchange", () => this.handleHashChange());
  }

  initializeTabs() {
    if (window.location.hash) {
      const index = this.findIndexFromHash(window.location.hash);
      if (index !== -1) {
        this.activateTab(index, false);
        this.scrollToSection(index);
      } else {
        this.activateTab(0, false);
      }
    } else {
      this.activateTab(0, false);
    }
  }

  handleHashChange() {
    if (window.location.hash) {
      const index = this.findIndexFromHash(window.location.hash);
      if (index !== -1) {
        this.activateTab(index, false);
        this.scrollToSection(index);
      }
    } else {
      this.activateTab(0, false);
    }
  }

  handleKeydown(e, index) {
    const isHorizontal = e.key === "ArrowRight" || e.key === "ArrowLeft";
    const isVertical = e.key === "ArrowDown" || e.key === "ArrowUp";

    if (isHorizontal || isVertical) {
      e.preventDefault();
      const direction =
        e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1;
      const newIndex = this.getNewIndex(index, direction);
      this.activateTab(newIndex, true);
      this.tabNavs[newIndex].focus();
    }
  }

  getNewIndex(currentIndex, direction) {
    const lastIndex = this.tabNavs.length - 1;
    let newIndex = currentIndex + direction;

    if (newIndex < 0) newIndex = lastIndex;
    if (newIndex > lastIndex) newIndex = 0;

    return newIndex;
  }

  findIndexFromHash(hash) {
    return Array.from(this.tabNavs).findIndex((nav) => {
      const title = nav.querySelector(this.options.titleSelector);
      return title && `#${this.slugify(title.innerText)}` === hash;
    });
  }

  activateTab(index, updateURL = true) {
    this.updateTabStates(index);
    this.updateContentStates(index);
    if (this.options.updateURL && updateURL) {
      this.updateURL(index);
    }
  }

  updateTabStates(activeIndex) {
    this.tabNavs.forEach((nav, i) => {
      const isSelected = i === activeIndex;
      nav.classList.toggle(this.options.activeClass, isSelected);
      nav.setAttribute("aria-selected", isSelected.toString());
      nav.setAttribute("tabindex", isSelected ? "0" : "-1");
    });
  }

  updateContentStates(activeIndex) {
    this.tabContents.forEach((content, i) => {
      const isActive = i === activeIndex;
      content.classList.toggle(this.options.contentActiveClass, isActive);
      content.setAttribute("aria-hidden", (!isActive).toString());
      if (isActive) this.fadeIn(content, 500, "block");
      else content.style.display = "none";
    });
  }

  updateURL(index) {
    const activeNav = this.tabNavs[index];
    const title = activeNav.querySelector(this.options.titleSelector);
    if (title) {
      const slug = this.slugify(title.innerText);
      // Remove the special case for index 0
      window.history.pushState(null, "", `#${slug}`);
    }
  }

  scrollToSection(index) {
    const content = this.tabContents[index];
    if (content) {
      content.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
  }

  fadeIn(el, timeout, display) {
    el.style.opacity = 0;
    el.style.display = display || "block";
    el.style.transition = `opacity ${timeout}ms`;
    setTimeout(() => {
      el.style.opacity = 1;
    }, 10);
  }
}
