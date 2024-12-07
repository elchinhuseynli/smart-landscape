class Accordion {
  constructor(element, config = {}) {
    this.accordion = element;
    this.config = {
      allowMultipleOpen: false,
      animationDuration: 300,
      enableAnimation: true,
      saveState: false,
      deepLinking: false,
      ...config,
    };
    this.items = this.accordion.querySelectorAll("[fl-accordion-item]");
    this.accordionId = `accordion-${Math.random().toString(36).substr(2, 9)}`;
    this.init();
  }

  init() {
    this.items.forEach((item, index) => {
      const header = item.querySelector("[fl-accordion-header]");
      const content = item.querySelector("[fl-accordion-content]");

      const headerId = `${this.accordionId}-header-${index + 1}`;
      const contentId = `${this.accordionId}-content-${index + 1}`;
      header.id = headerId;
      content.id = contentId;
      header.setAttribute("aria-controls", contentId);
      content.setAttribute("aria-labelledby", headerId);

      header.addEventListener("click", () => this.toggleItem(item));
      header.addEventListener("keydown", (e) => this.handleKeydown(e, item));

      if (this.config.enableAnimation) {
        content.style.transition = `max-height ${this.config.animationDuration}ms ease-out, 
                                    padding ${this.config.animationDuration}ms ease-out, 
                                    opacity ${this.config.animationDuration}ms ease-out`;
      }
    });

    if (this.config.deepLinking) {
      this.handleDeepLinking();
    }

    if (this.config.saveState) {
      this.restoreState();
    }
  }

  toggleItem(item) {
    const header = item.querySelector("[fl-accordion-header]");
    const content = item.querySelector("[fl-accordion-content]");
    const isExpanded = header.getAttribute("aria-expanded") === "true";

    if (!this.config.allowMultipleOpen) {
      this.items.forEach((otherItem) => {
        if (otherItem !== item) {
          this.closeItem(otherItem);
        }
      });
    }

    if (isExpanded) {
      this.closeItem(item);
    } else {
      this.openItem(item);
    }

    if (this.config.saveState) {
      this.saveState();
    }
  }

  openItem(item) {
    const header = item.querySelector("[fl-accordion-header]");
    const content = item.querySelector("[fl-accordion-content]");

    this.triggerEvent("beforeOpen", item);

    header.setAttribute("aria-expanded", "true");
    content.style.maxHeight = content.scrollHeight + "px";
    content.classList.add("active");

    if (this.config.enableAnimation) {
      setTimeout(() => {
        this.triggerEvent("afterOpen", item);
      }, this.config.animationDuration);
    } else {
      this.triggerEvent("afterOpen", item);
    }
  }

  closeItem(item) {
    const header = item.querySelector("[fl-accordion-header]");
    const content = item.querySelector("[fl-accordion-content]");

    this.triggerEvent("beforeClose", item);

    header.setAttribute("aria-expanded", "false");
    content.style.maxHeight = null;
    content.classList.remove("active");

    if (this.config.enableAnimation) {
      setTimeout(() => {
        this.triggerEvent("afterClose", item);
      }, this.config.animationDuration);
    } else {
      this.triggerEvent("afterClose", item);
    }
  }

  handleKeydown(event, item) {
    const key = event.key;
    const header = item.querySelector("[fl-accordion-header]");

    switch (key) {
      case " ":
      case "Enter":
        event.preventDefault();
        this.toggleItem(item);
        break;
      case "ArrowDown":
        event.preventDefault();
        this.focusNextHeader(header);
        break;
      case "ArrowUp":
        event.preventDefault();
        this.focusPreviousHeader(header);
        break;
      case "Home":
        event.preventDefault();
        this.focusFirstHeader();
        break;
      case "End":
        event.preventDefault();
        this.focusLastHeader();
        break;
    }
  }

  focusNextHeader(currentHeader) {
    const headers = Array.from(
      this.accordion.querySelectorAll("[fl-accordion-header]")
    );
    const currentIndex = headers.indexOf(currentHeader);
    const nextHeader = headers[currentIndex + 1] || headers[0];
    nextHeader.focus();
  }

  focusPreviousHeader(currentHeader) {
    const headers = Array.from(
      this.accordion.querySelectorAll("[fl-accordion-header]")
    );
    const currentIndex = headers.indexOf(currentHeader);
    const previousHeader =
      headers[currentIndex - 1] || headers[headers.length - 1];
    previousHeader.focus();
  }

  focusFirstHeader() {
    const firstHeader = this.accordion.querySelector("[fl-accordion-header]");
    firstHeader.focus();
  }

  focusLastHeader() {
    const headers = this.accordion.querySelectorAll("[fl-accordion-header]");
    const lastHeader = headers[headers.length - 1];
    lastHeader.focus();
  }

  handleDeepLinking() {
    if (window.location.hash) {
      const targetId = window.location.hash.substring(1);
      const targetItem = this.accordion.querySelector(`#${targetId}`);
      if (targetItem) {
        const parentItem = targetItem.closest("[fl-accordion-item]");
        if (parentItem) {
          this.openItem(parentItem);
        }
      }
    }
  }

  saveState() {
    const state = Array.from(this.items).map((item) => {
      const header = item.querySelector("[fl-accordion-header]");
      return header.getAttribute("aria-expanded") === "true";
    });
    localStorage.setItem(this.accordionId, JSON.stringify(state));
  }

  restoreState() {
    const savedState = localStorage.getItem(this.accordionId);
    if (savedState) {
      const state = JSON.parse(savedState);
      this.items.forEach((item, index) => {
        if (state[index]) {
          this.openItem(item);
        } else {
          this.closeItem(item);
        }
      });
    }
  }

  triggerEvent(eventName, item) {
    const event = new CustomEvent(eventName, {
      detail: { accordion: this, item: item },
      bubbles: true,
      cancelable: true,
    });
    this.accordion.dispatchEvent(event);
  }
}

// Initialize all accordions on the page
document.querySelectorAll("[fl-accordion]").forEach((accordionElement) => {
  const config = {
    allowMultipleOpen: accordionElement.hasAttribute(
      "fl-accordion-allow-multiple-open"
    ),
    animationDuration:
      parseInt(
        accordionElement.getAttribute("fl-accordion-animation-duration")
      ) || 300,
    enableAnimation: !accordionElement.hasAttribute(
      "fl-accordion-disable-animation"
    ),
    saveState: accordionElement.hasAttribute("fl-accordion-save-state"),
    deepLinking: accordionElement.hasAttribute("fl-accordion-deep-linking"),
  };
  new Accordion(accordionElement, config);
});
