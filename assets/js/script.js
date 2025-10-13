// script.js
//
// Handles dynamic behaviors on the M2 Estratégia site including:
// - Sticky header appearance on scroll
// - Theme toggling with persistence using localStorage
// - Mobile menu open/close
// - Button ripple animations
// - Newsletter form success message

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const themeToggle = document.querySelector('.theme-toggle');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const form = document.getElementById('newsletter-form');

  // Sticky header styling on scroll
  function handleScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // Theme toggling and persistence
  function setTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('theme', theme);
  }
  // Load stored theme preference
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) {
    setTheme(storedTheme);
  }
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = document.body.classList.contains('light-theme');
      setTheme(isLight ? 'dark' : 'light');
    });
  }

  // Mobile navigation toggle with aria attributes
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
      // Toggle aria-expanded and update label
      const expanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', (!expanded).toString());
      // Change label for screen readers
      mobileToggle.setAttribute('aria-label', expanded ? 'Abrir menu' : 'Fechar menu');
    });
  }

  // Ripple effect on buttons
  document.querySelectorAll('.btn').forEach((button) => {
    button.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Newsletter form submission handler
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Capture fields (not used further but could be sent to backend)
      const formData = new FormData(form);
      const name = formData.get('name');
      const email = formData.get('email');
      const whatsapp = formData.get('whatsapp');
      // Create a success message with a download link to the updated e-book
      const message = document.createElement('div');
      message.className = 'success-message';
      // Build success message for newsletter using the configured e‑book path.
      message.innerHTML = `<p>Obrigado, ${name}! Seu cadastro foi realizado com sucesso.</p>` +
        `<p>Agora você pode baixar o nosso guia exclusivo de marketing digital.</p>` +
        `<a href="${getEbookPath()}" download class="btn btn-primary" style="margin-top:1rem;">Baixar e‑book</a>`;
      // Replace the form with the success message
      form.parentNode.replaceChild(message, form);
    });
  }

  /*
   * E-book configuration
   * Define the filename of the e-book once here. When updating the e‑book file,
   * change this constant and the rest of the site will reference it
   * automatically. The getEbookPath function derives the correct path
   * depending on whether the current page is inside the blog folder.
   */
  const EBOOK_FILENAME = 'ebook-m2-ultimate.pdf';
  function getEbookPath() {
    const isBlog = window.location.pathname.includes('/blog/');
    const prefix = isBlog ? '../' : '';
    return `${prefix}assets/ebook/${EBOOK_FILENAME}`;
  }

  /*
   * Typed effect for the hero heading
   * Types out a sentence character by character.
   */
  const typedElement = document.getElementById('typed-text');
  const cursor = document.querySelector('.cursor');
  const textToType = 'Crescimento não é sorte... é sistema.';
  let typeIndex = 0;
  function typeNextChar() {
    if (!typedElement) return;
    if (typeIndex < textToType.length) {
      typedElement.textContent += textToType.charAt(typeIndex);
      typeIndex++;
      setTimeout(typeNextChar, 80);
    } else {
      // Optional: stop blinking after typing complete
      // cursor.style.display = 'none';
    }
  }
  if (typedElement) {
    typeNextChar();
  }

  /*
   * Sticky bottom CTA bar
   * Shows when the user scrolls beyond 60% of the page height.
   */
  const stickyBar = document.querySelector('.sticky-cta-bar');
  function handleStickyBar() {
    if (!stickyBar) return;
    const scrollPosition = window.scrollY + window.innerHeight;
    const triggerPosition = document.body.scrollHeight * 0.6;
    if (scrollPosition > triggerPosition) {
      stickyBar.classList.add('show');
    } else {
      stickyBar.classList.remove('show');
    }
  }
  if (stickyBar) {
    window.addEventListener('scroll', handleStickyBar);
    handleStickyBar();
  }

  /*
   * Chat widget removed
   * O botão flutuante agora direciona diretamente ao WhatsApp via link no HTML.
   */

  /*
   * The progress bar functionality has been removed. The element still exists
   * in the markup for compatibility but is hidden via CSS.
   */

  /*
   * Animated counters for service statistics
   * When the stats section enters the viewport, animate numbers from 0 to their target values.
   */
  const stats = document.querySelectorAll('.service-stats strong');
  const statSection = document.querySelector('.service-stats');
  let countersAnimated = false;
  function animateCounters() {
    if (countersAnimated || !statSection) return;
    const rect = statSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
      countersAnimated = true;
      stats.forEach((stat) => {
        const targetText = stat.textContent;
        // Extract numerical part; handle values like 120+, 3.8x, 99%
        const match = targetText.match(/([\d\.]+)/);
        const cleanNumber = match ? parseFloat(match[1]) : 0;
        const suffix = targetText.replace(/[\d\.]/g, '');
        let current = 0;
        const frames = 100;
        const increment = cleanNumber / frames;
        function updateCounter() {
          current += increment;
          if (current < cleanNumber) {
            // Round to one decimal if target has decimal, else integer
            const value = targetText.includes('.') ? current.toFixed(1) : Math.floor(current);
            stat.textContent = `${value}${suffix}`;
            requestAnimationFrame(updateCounter);
          } else {
            stat.textContent = targetText;
          }
        }
        updateCounter();
      });
    }
  }
  window.addEventListener('scroll', animateCounters);
  animateCounters();

  /*
   * Interactive quiz system
   * A multi-step modal that assesses the user's digital maturity and
   * collects basic contact information. Elements with the class
   * `open-quiz` will trigger the quiz overlay. Each step is wrapped in
   * a .quiz-step container with navigation buttons. Answers are stored
   * in an object and used to compute a simple maturity level.
   */
  const quizOverlay = document.getElementById('quiz-overlay');
  if (quizOverlay) {
    const quizSteps = quizOverlay.querySelectorAll('.quiz-step');
    let currentQuizIndex = 0;
    const quizAnswers = {};

    function showQuizStep(index) {
      quizSteps.forEach((step, i) => {
        step.style.display = i === index ? 'block' : 'none';
      });
    }

    // Attach open handlers to any element with .open-quiz
    document.querySelectorAll('.open-quiz').forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        quizOverlay.style.display = 'flex';
        currentQuizIndex = 0;
        showQuizStep(currentQuizIndex);
      });
    });

    // Handle option selection, navigation and close events via event delegation
    quizOverlay.addEventListener('click', (e) => {
      const target = e.target;
      // Close button
      if (target.classList.contains('quiz-close')) {
        quizOverlay.style.display = 'none';
        return;
      }
      // Option selection
      if (target.classList.contains('quiz-option')) {
        const step = target.closest('.quiz-step');
        // Deselect other options in this step
        step.querySelectorAll('.quiz-option').forEach((btn) => btn.classList.remove('selected'));
        target.classList.add('selected');
        return;
      }
      // Previous button
      if (target.classList.contains('quiz-prev')) {
        if (currentQuizIndex > 0) {
          currentQuizIndex--;
          showQuizStep(currentQuizIndex);
        }
        return;
      }
      // Next or submit buttons
      if (target.classList.contains('quiz-next') || target.classList.contains('quiz-submit')) {
        // Validate selection for steps 1 and 2
        if (currentQuizIndex === 0 || currentQuizIndex === 1) {
          const currentStep = quizSteps[currentQuizIndex];
          const selected = currentStep.querySelector('.quiz-option.selected');
          if (!selected) {
            // Do nothing until an option is selected
            return;
          }
          // Store answers
          if (currentQuizIndex === 0) quizAnswers.size = selected.dataset.answer;
          if (currentQuizIndex === 1) quizAnswers.goal = selected.dataset.answer;
        }
        // Compute result on step 2 before moving to step 3
        if (currentQuizIndex === 1) {
          const resultEl = quizOverlay.querySelector('.quiz-result');
          let level = '';
          if (quizAnswers.size === 'large' && quizAnswers.goal === 'automation') {
            level = 'Avançado';
          } else if (quizAnswers.size === 'medium' || quizAnswers.goal === 'leads') {
            level = 'Intermediário';
          } else {
            level = 'Iniciante';
          }
          resultEl.innerHTML = `Seu nível de maturidade digital é <strong>${level}</strong>. Nossa equipe está pronta para ajudar você a evoluir.`;
        }
        // Move to next step
        currentQuizIndex++;
        // On submit (final form), handle via form submit
        if (currentQuizIndex < quizSteps.length) {
          showQuizStep(currentQuizIndex);
        }
        return;
      }
    });

    // Handle form submission in the last step
    const quizForm = quizOverlay.querySelector('.quiz-form');
    if (quizForm) {
      quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Hide form and show thank-you message
        quizForm.style.display = 'none';
        const thanks = quizOverlay.querySelector('.quiz-thanks');
        if (thanks) {
          thanks.style.display = 'block';
        }
      });
    }
  }

  // --- 3D Tilt effect on bento items ---
  // Add a subtle 3D tilt interaction when moving the mouse over service cards and other bento items.
  const tiltElements = document.querySelectorAll('.bento-item');
  tiltElements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (y / rect.height) * -10; // tilt strength
      const rotateY = (x / rect.width) * 10;
      el.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });

  // --- Parallax effect for article hero images ---
  // Make hero images in articles move slower than scroll for a sense of depth.
  function initParallax() {
    const heroImages = document.querySelectorAll('.article-image img');
    if (!heroImages.length) return;
    function updateParallax() {
      heroImages.forEach((img) => {
        const speed = 0.2;
        const offset = window.pageYOffset;
        img.style.transform = `translateY(${offset * speed}px)`;
      });
    }
    window.addEventListener('scroll', updateParallax);
    updateParallax();
  }
  initParallax();
  /*
   * ROI calculator system
   *
   * When a user clicks any element with the class .open-roi the overlay
   * appears. The calculator is a multi-step form: Step 1 collects
   * leads and total investment; Step 2 collects conversion rate and
   * average ticket; Step 3 displays the computed revenue, profit and
   * ROI; Step 4 collects user contact information. All inputs are
   * validated before progressing. The overlay can be closed with the
   * close button or by navigating back.
   */
  const roiOverlay = document.getElementById('roi-overlay');
  if (roiOverlay) {
    const roiSteps = roiOverlay.querySelectorAll('.roi-step');
    let currentRoiIndex = 0;
    function showRoiStep(index) {
      roiSteps.forEach((step, i) => {
        if (i === index) {
          step.classList.add('active');
        } else {
          step.classList.remove('active');
        }
      });
    }
    // Open triggers
    document.querySelectorAll('.open-roi').forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        roiOverlay.style.display = 'flex';
        currentRoiIndex = 0;
        showRoiStep(0);
      });
    });
    // Close button
    const roiCloseBtn = roiOverlay.querySelector('.roi-close');
    if (roiCloseBtn) {
      roiCloseBtn.addEventListener('click', () => {
        roiOverlay.style.display = 'none';
      });
    }
    // Navigation and result handling via event delegation
    roiOverlay.addEventListener('click', (e) => {
      const target = e.target;
      // Previous
      if (target.classList.contains('roi-prev')) {
        if (currentRoiIndex > 0) {
          currentRoiIndex--;
          showRoiStep(currentRoiIndex);
        }
        return;
      }
      // Next
      if (target.classList.contains('roi-next')) {
        if (currentRoiIndex === 0) {
          // Require leads and investment
          const leadsInput = roiOverlay.querySelector('#roi-leads');
          const investInput = roiOverlay.querySelector('#roi-invest');
          if (!leadsInput.value || !investInput.value) return;
        } else if (currentRoiIndex === 1) {
          // Require conversion and ticket
          const convInput = roiOverlay.querySelector('#roi-conversion');
          const ticketInput = roiOverlay.querySelector('#roi-ticket');
          if (!convInput.value || !ticketInput.value) return;
          // Compute result
          const leadsVal = parseFloat(roiOverlay.querySelector('#roi-leads').value) || 0;
          const investVal = parseFloat(roiOverlay.querySelector('#roi-invest').value) || 0;
          const convVal = parseFloat(convInput.value) / 100 || 0;
          const ticketVal = parseFloat(ticketInput.value) || 0;
          const revenue = leadsVal * convVal * ticketVal;
          const profit = revenue - investVal;
          const roi = investVal > 0 ? (profit / investVal) * 100 : 0;
          const resultEl = roiOverlay.querySelector('.roi-result');
          if (resultEl) {
            const formatCurrency = (val) => {
              return 'R$ ' + val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            };
            resultEl.innerHTML = `Receita esperada: <strong>${formatCurrency(revenue)}</strong><br>Lucro: <strong>${formatCurrency(profit)}</strong><br>ROI: <strong>${roi.toFixed(1)}%</strong>`;
          }
        }
        currentRoiIndex++;
        if (currentRoiIndex < roiSteps.length) {
          showRoiStep(currentRoiIndex);
        }
        return;
      }
    });
    // Form submission
    const roiForm = roiOverlay.querySelector('.roi-form');
    if (roiForm) {
    roiForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Capture form data (name, email, whatsapp)
      // Attempt to capture the name value. Some ROI forms may not have a `name` attribute on the input.
      let name = '';
      const nameField = roiForm.querySelector('#roi-name');
      if (nameField) {
        name = nameField.value;
      } else {
        const data = new FormData(roiForm);
        name = data.get('roi-name') || '';
      }
      // Determine correct e-book path: if current page is in blog directory, use '../assets/ebook/', else 'assets/ebook/'
      // Determine correct path to the latest e‑book. If we're on a blog page, go up one level.
      // Build success message with download link; reference the e‑book via getEbookPath().
      const ebookPath = getEbookPath();
      const msg = document.createElement('div');
      msg.className = 'roi-success';
      msg.innerHTML = `<p>Obrigado, ${name}! Seu cadastro foi realizado com sucesso.</p>` +
        `<p>Agora você pode baixar nosso guia exclusivo.</p>` +
        `<a href="${ebookPath}" download class="btn btn-primary" style="margin-top:1rem;">Baixar e‑book</a>`;
      // Replace form with success message
      roiForm.parentNode.replaceChild(msg, roiForm);
      // Hide navigation buttons if present
      const nav = roiOverlay.querySelector('.roi-nav');
      if (nav) nav.style.display = 'none';
    });
    }
  }

  /*
   * Case study overlay
   * Opens a modal with detailed information when a testimonial card is clicked.
   */
  const caseOverlay = document.getElementById('case-overlay');
  if (caseOverlay) {
    const caseContents = caseOverlay.querySelectorAll('.case-content');
    // Bind click events to testimonial cards
    document.querySelectorAll('.testimonial-card').forEach((card) => {
      card.addEventListener('click', () => {
        const id = card.dataset.case;
        caseContents.forEach((content) => {
          content.style.display = content.dataset.case === id ? 'block' : 'none';
        });
        caseOverlay.style.display = 'flex';
      });
    });
    // Close button handler
    const caseClose = caseOverlay.querySelector('.case-close');
    if (caseClose) {
      caseClose.addEventListener('click', () => {
        caseOverlay.style.display = 'none';
      });
    }
  }

  // Update quiz thank-you links to use the dynamic e‑book path
  document.querySelectorAll('#quiz-thank-you a').forEach((link) => {
    // Only update if getEbookPath is defined
    if (typeof getEbookPath === 'function') {
      link.setAttribute('href', getEbookPath());
    }
  });
});