// Pash Care bilingual language toggle and enhancements
// This script enables switching between Arabic and English content, RTL/LTR, and can be extended for map and form logic.
window.addEventListener('DOMContentLoaded', function() {
  // Remove inline styles to prevent conflicts
  const inlineStyle = document.querySelector('style[data-inline-lang]');
  if (inlineStyle) inlineStyle.remove();
  
  const langToggle = document.getElementById('lang-toggle');
  const html = document.documentElement;

  function setLanguage(lang) {
    const isAr = (lang === 'ar');

    // set document language and direction
    html.setAttribute('lang', isAr ? 'ar' : 'en');
    html.setAttribute('dir', isAr ? 'rtl' : 'ltr');

    // show/hide localized content
    document.querySelectorAll('[id$="-ar"]').forEach(e => e.classList.toggle('d-none', !isAr));
    document.querySelectorAll('[id$="-en"]').forEach(e => e.classList.toggle('d-none', isAr));

    // update nav/footer if present
    const navAr = document.getElementById('nav-ar');
    const navEn = document.getElementById('nav-en');
    const footerAr = document.getElementById('footer-ar');
    const footerEn = document.getElementById('footer-en');
    if(navAr) navAr.classList.toggle('d-none', !isAr);
    if(navEn) navEn.classList.toggle('d-none', isAr);
    if(footerAr) footerAr.classList.toggle('d-none', !isAr);
    if(footerEn) footerEn.classList.toggle('d-none', isAr);

    // update single toggle button label + accessibility
    if (langToggle) {
      // button shows the language *to switch to* (better UX)
      if (isAr) {
        langToggle.textContent = 'English';
        langToggle.setAttribute('title', 'Show site in English');
        langToggle.setAttribute('aria-label', 'Switch to English');
        langToggle.classList.remove('btn-outline-secondary');
        langToggle.classList.add('btn-outline-primary');
      } else {
        langToggle.textContent = 'العربية';
        langToggle.setAttribute('title', 'عرض الموقع بالعربية');
        langToggle.setAttribute('aria-label', 'التبديل إلى العربية');
        langToggle.classList.remove('btn-outline-primary');
        langToggle.classList.add('btn-outline-secondary');
      }
    }
  }

  // Animated language switch with debug logs (helps if clicks are being swallowed)
  function animatedSwitch(lang) {
    try {
      console.log('[i] language switch requested ->', lang);
      const main = document.querySelector('main') || document.body;
      main.classList.add('lang-fade');
      // mark targets so CSS can fade them
      document.querySelectorAll('[id$="-ar"],[id$="-en"]').forEach(el => el.classList.add('lang-fade-target'));
      setTimeout(() => {
        setLanguage(lang);
        // restart hero typing after language change
        startHeroTyping();
        main.classList.remove('lang-fade');
        document.body.classList.add('lang-fade-done');
        // small delay to allow CSS to settle then remove helper class
        setTimeout(() => {
          document.querySelectorAll('.lang-fade-target').forEach(el => el.classList.remove('lang-fade-target'));
          document.body.classList.remove('lang-fade-done');
        }, 260);
      }, 160);
    } catch (err) { console.error('language switch error', err); }
  }

  if (langToggle) {
    langToggle.addEventListener('click', function(e) {
      e.preventDefault();
      const current = html.getAttribute('lang') || 'ar';
      const next = (current === 'ar') ? 'en' : 'ar';
      console.log('lang-toggle clicked ->', next);
      animatedSwitch(next);
    });
    langToggle.addEventListener('keydown', function(ev){ if(ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); const current = html.getAttribute('lang') || 'ar'; animatedSwitch(current === 'ar' ? 'en' : 'ar'); }});
  }

  /* Typing animation utilities for hero text */
  let _typingHandles = [];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function clearTypingTimers(){
    _typingHandles.forEach(h => clearTimeout(h));
    _typingHandles = [];
  }

  function typeText(el, text, speed = 40){
    return new Promise((resolve) => {
      if (!el) return resolve();
      if (prefersReducedMotion) { el.textContent = text; return resolve(); }
      el.textContent = '';
      el.classList.add('typing','typing-cursor');
      let i = 0;
      function step(){
        if (i <= text.length - 1) {
          el.textContent += text.charAt(i);
          i += 1;
          _typingHandles.push(setTimeout(step, speed + (Math.random()*10)));
        } else {
          // keep cursor visible for a short moment, then resolve
          _typingHandles.push(setTimeout(() => { el.classList.remove('typing-cursor'); resolve(); }, 400));
        }
      }
      step();
    });
  }

  async function startHeroTyping(){
    clearTypingTimers();
    const titleAr = document.getElementById('hero-title-ar');
    const titleEn = document.getElementById('hero-title-en');
    const descAr = document.getElementById('hero-desc-ar');
    const descEn = document.getElementById('hero-desc-en');

    const isAr = document.documentElement.getAttribute('lang') === 'ar';

    // determine visible elements
    const titleEl = (isAr && titleAr) ? titleAr : titleEn;
    const descEl = (isAr && descAr) ? descAr : descEn;

    if (!titleEl || !descEl) return;

    // store originals if not already stored
    if (!titleEl.dataset.original) titleEl.dataset.original = titleEl.textContent.trim();
    if (!descEl.dataset.original) descEl.dataset.original = descEl.textContent.trim();

    const titleText = titleEl.dataset.original;
    const descText = descEl.dataset.original;

    // if reduced motion preference, render instantly
    if (prefersReducedMotion) {
      titleEl.textContent = titleText;
      descEl.textContent = descText;
      titleEl.classList.remove('typing-cursor');
      descEl.classList.remove('typing-cursor');
      return;
    }

    // clear visible text then animate sequentially
    titleEl.textContent = '';
    descEl.textContent = '';
    try {
      await typeText(titleEl, titleText, 35);
      // small pause before description
      await new Promise(r => _typingHandles.push(setTimeout(r, 300)));
      await typeText(descEl, descText, 28);
    } catch (e) {
      // on error, restore texts
      titleEl.textContent = titleText;
      descEl.textContent = descText;
      titleEl.classList.remove('typing-cursor');
      descEl.classList.remove('typing-cursor');
    }
  }

  // Reveal on scroll for sections (progressive enhancement)
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en => { if(en.isIntersecting) en.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('section, .service-card, .card').forEach(el => { el.classList.add('reveal'); io.observe(el); });

  // default language
  setLanguage('ar');

  // start hero typing on initial load
  startHeroTyping();

  // --- AJAX form submission + friendly on-page feedback for reservation & interest forms ---
  function createAlertHTML(type, heading, text) {
    const success = type === 'success';
    return `
      <div class="form-alert ${success ? 'form-alert-success' : 'form-alert-error'}" role="status">
        <div class="icon" aria-hidden="true">${success ? '✓' : '!'}</div>
        <div class="body">
          <div class="title">${heading}</div>
          <div class="msg">${text}</div>
        </div>
        <button class="close-btn" aria-label="Close">×</button>
      </div>
    `;
  }

  function showFormMessage(container, type, heading, text) {
    if (!container) return;
    container.innerHTML = createAlertHTML(type, heading, text);
    const btn = container.querySelector('.close-btn');
    if (btn) btn.addEventListener('click', () => container.innerHTML = '');
    // auto-dismiss after 6s
    setTimeout(() => { if (container) container.innerHTML = ''; }, 6000);
  }

  // Client-side validation: block obviously invalid submissions
  function validateForm(form) {
    const feedbackId = (form.querySelector('input[name="formType"]') && form.querySelector('input[name="formType"]').value === 'interest') ? 'interest-feedback' : 'reservation-feedback';
    const feedback = document.getElementById(feedbackId);
    const isAr = document.documentElement.getAttribute('lang') === 'ar';

    function invalid(msg, el) {
      showFormMessage(feedback, 'error', isAr ? 'خطأ في الإدخال' : 'Invalid input', msg);
      if (el && typeof el.focus === 'function') el.focus();
      return false;
    }

    const formType = (form.querySelector('input[name="formType"]') && form.querySelector('input[name="formType"]').value) || 'reservation';

    // basic helpers
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRe = /^[0-9+\s()\-]{6,20}$/;

    if (formType === 'reservation') {
      const fullName = form.querySelector('input[name="fullName"]');
      const email = form.querySelector('input[name="email"]');
      const phone = form.querySelector('input[name="phone"]');
      const date = form.querySelector('input[name="date"]');
      const interest = form.querySelector('select[name="interest"]');

      if (!fullName || !fullName.value.trim()) return invalid(isAr ? 'الرجاء إدخال الاسم الكامل.' : 'Please enter your full name.', fullName);
      if (!email || !emailRe.test(email.value.trim())) return invalid(isAr ? 'الرجاء إدخال بريد إلكتروني صالح.' : 'Please enter a valid email address.', email);
      if (!phone || !phoneRe.test(phone.value.trim())) return invalid(isAr ? 'الرجاء إدخال رقم هاتف صالح.' : 'Please enter a valid phone number.', phone);
      if (!date || !date.value) return invalid(isAr ? 'الرجاء اختيار تاريخ الحجز.' : 'Please choose a reservation date.', date);
      // prevent past dates
      const selected = new Date(date.value + 'T00:00:00');
      const today = new Date(); today.setHours(0,0,0,0);
      if (selected < today) return invalid(isAr ? 'لا يمكن اختيار تاريخ في الماضي.' : 'Reservation date cannot be in the past.', date);
      if (!interest || !interest.value) return invalid(isAr ? 'الرجاء اختيار نوع الخدمة.' : 'Please select a service.', interest);

    } else {
      // interest form
      const fullName = form.querySelector('input[name="fullName"]');
      const email = form.querySelector('input[name="email"]');
      const checkedInterests = form.querySelectorAll('input[name="interests[]"]:checked');

      if (!fullName || !fullName.value.trim()) return invalid(isAr ? 'الرجاء إدخال الاسم.' : 'Please enter your name.', fullName);
      if (!email || !emailRe.test(email.value.trim())) return invalid(isAr ? 'الرجاء إدخال بريد إلكتروني صالح.' : 'Please enter a valid email address.', email);
      if (!checkedInterests || checkedInterests.length === 0) return invalid(isAr ? 'اختر اهتمامًا واحدًا على الأقل.' : 'Select at least one interest.', form.querySelector('input[name="interests[]"]'));
    }

    // if we reach here, form is valid
    return true;
  }

  document.querySelectorAll('form[action="send-email.php"]').forEach(form => {
    // guard to prevent duplicate concurrent submissions
    form.dataset.submitting = '0';

    function setFormLoading(on) {
      const submit = form.querySelector('button[type="submit"]');
      if (!submit) return;
      if (on) {
        // save original label if not saved yet
        if (!submit.dataset.orig) submit.dataset.orig = submit.innerHTML;
        submit.disabled = true;
        submit.classList.add('disabled');
        submit.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>${submit.dataset.orig}`;
      } else {
        submit.disabled = false;
        submit.classList.remove('disabled');
        if (submit.dataset.orig) submit.innerHTML = submit.dataset.orig;
      }
    }

    form.addEventListener('submit', function(ev) {
      ev.preventDefault();

      // client-side validation
      if (!validateForm(form)) return;

      if (form.dataset.submitting === '1') return; // already in progress
      form.dataset.submitting = '1';
      setFormLoading(true);

      const feedbackId = (form.querySelector('input[name="formType"]') && form.querySelector('input[name="formType"]').value === 'interest') ? 'interest-feedback' : 'reservation-feedback';
      const feedback = document.getElementById(feedbackId);

      const fd = new FormData(form);
      fetch(form.action, { method: 'POST', body: fd })
        .then(r => r.json())
        .then(json => {
          const isAr = document.documentElement.getAttribute('lang') === 'ar';
          if (json.success) {
            const heading = isAr ? 'تم الإرسال' : 'Submission received';
            // custom friendly text per form
            const formType = fd.get('formType');
            const text = formType === 'reservation'
              ? (isAr ? 'تم استلام طلب الحجز بنجاح! سنقوم بالاتصال بك لتأكيد الموعد.' : 'Your reservation request was received. We will contact you to confirm the appointment.')
              : (isAr ? 'شكراً! تم استلام طلبك وسنتواصل معك قريبًا.' : 'Thank you — your request was submitted. We will be in touch soon.');

            showFormMessage(feedback, 'success', heading, text);
            form.reset();
          } else {
            const heading = isAr ? 'حدث خطأ' : 'Submission failed';
            const text = json.message || (isAr ? 'حصل خطأ أثناء إرسال النموذج. حاول لاحقًا.' : 'An error occurred while sending the form. Please try again later.');
            showFormMessage(feedback, 'error', heading, text);
          }
        })
        .catch(err => {
          const isAr = document.documentElement.getAttribute('lang') === 'ar';
          const feedbackEl = document.getElementById(feedbackId);
          showFormMessage(feedbackEl, 'error', isAr ? 'خطأ في الاتصال' : 'Network error', isAr ? 'تعذر الاتصال بالخادم. تحقق من اتصالك وحاول مرة أخرى.' : 'Unable to reach the server. Check your connection and try again.');
          console.error('form submit error', err);
        })
        .finally(() => {
          form.dataset.submitting = '0';
          setFormLoading(false);
        });
    });
  });


  // --- Map interactivity: update state-info on hover/click (bilingual) ---
  (function(){
    const stateNameAr = document.getElementById('state-name-ar');
    const stateNameEn = document.getElementById('state-name-en');
    const stateStatusAr = document.getElementById('state-status-ar');
    const stateStatusEn = document.getElementById('state-status-en');
    const facilityCount = document.getElementById('facility-count');
    const professionalCount = document.getElementById('professional-count');
    const lastTraining = document.getElementById('last-training');
    const upcomingEvents = document.getElementById('upcoming-events');
    const statusBadge = document.querySelector('.status-badge');

    // default (read from DOM so edits to HTML stay consistent)
    const defaultInfo = {
      arName: stateNameAr ? stateNameAr.textContent.trim() : 'اسم الولاية',
      enName: stateNameEn ? stateNameEn.textContent.trim() : 'State Name',
      coveredTextAr: stateStatusAr ? stateStatusAr.textContent.trim() : 'مغطاة',
      coveredTextEn: stateStatusEn ? stateStatusEn.textContent.trim() : 'Covered',
      facilities: facilityCount ? facilityCount.textContent.trim() : '-',
      professionals: professionalCount ? professionalCount.textContent.trim() : '-',
      lastTraining: lastTraining ? lastTraining.textContent.trim() : '-',
      events: upcomingEvents ? upcomingEvents.textContent.trim() : '-',
    };

    // lightweight data for a few states (extendable)
    const stateData = {
      'SD-DC': { ar: 'وسط دارفور', en: 'Central Darfur', covered: true, facilities: 4, professionals: 68, lastTraining: 'Mar 2024', events: 1 },
      'SD-DN': { ar: 'شمال دارفور', en: 'North Darfur', covered: true, facilities: 6, professionals: 120, lastTraining: 'Feb 2024', events: 3 },
      'SD-DW': { ar: 'غرب دارفور', en: 'West Darfur', covered: true, facilities: 5, professionals: 90, lastTraining: 'Jan 2024', events: 2 },
      'SD-KH': { ar: 'الخرطوم', en: 'Khartoum', covered: true, facilities: 45, professionals: 980, lastTraining: 'Dec 2023', events: 5 },
      'SD-NO': { ar: 'الشمالية', en: 'Northern', covered: true, facilities: 20, professionals: 410, lastTraining: 'Sep 2023', events: 4 },
      'SD-GD': { ar: 'القضارف', en: 'Al Qaḑārif', covered: true, facilities: 8, professionals: 150, lastTraining: 'Aug 2023', events: 2 },
    };

    function showState(el){
      if (!el) return;
      const id = el.id;
      const data = stateData[id] || {};
      const enName = data.en || el.getAttribute('title') || defaultInfo.enName;
      const arName = data.ar || el.getAttribute('data-ar') || enName;
      const covered = (typeof data.covered === 'boolean') ? data.covered : el.classList.contains('covered');

      // update names
      if (stateNameAr) stateNameAr.textContent = arName;
      if (stateNameEn) stateNameEn.textContent = enName;

      // update status badge text + style
      if (stateStatusAr) stateStatusAr.textContent = covered ? 'مغطاة' : 'سيتم التغطية قريبًا';
      if (stateStatusEn) stateStatusEn.textContent = covered ? 'Covered' : 'Will be covered soon';
      if (statusBadge) statusBadge.classList.toggle('covered-badge', covered);

      // if covered -> show stats; if not covered -> show 'coming soon' message and hide stats
      const comingAr = document.getElementById('coming-soon-ar');
      const comingEn = document.getElementById('coming-soon-en');
      const details = document.getElementById('state-details');
      if (covered) {
        if (comingAr) comingAr.classList.add('d-none');
        if (comingEn) comingEn.classList.add('d-none');
        if (details) details.classList.remove('d-none');

        // update stats (fallback to defaults)
        facilityCount && (facilityCount.textContent = data.facilities ?? defaultInfo.facilities);
        professionalCount && (professionalCount.textContent = data.professionals ?? defaultInfo.professionals);
        lastTraining && (lastTraining.textContent = data.lastTraining ?? defaultInfo.lastTraining);
        upcomingEvents && (upcomingEvents.textContent = data.events ?? defaultInfo.events);
      } else {
        // show coming-soon message (language toggle will control which one is visible)
        if (comingAr) comingAr.classList.remove('d-none');
        if (comingEn) comingEn.classList.remove('d-none');
        if (details) details.classList.add('d-none');
      }
    }

    function resetState(){
      if (stateNameAr) stateNameAr.textContent = defaultInfo.arName;
      if (stateNameEn) stateNameEn.textContent = defaultInfo.enName;
      if (stateStatusAr) stateStatusAr.textContent = defaultInfo.coveredTextAr;
      if (stateStatusEn) stateStatusEn.textContent = defaultInfo.coveredTextEn;
      facilityCount && (facilityCount.textContent = defaultInfo.facilities);
      professionalCount && (professionalCount.textContent = defaultInfo.professionals);
      lastTraining && (lastTraining.textContent = defaultInfo.lastTraining);
      upcomingEvents && (upcomingEvents.textContent = defaultInfo.events);
      if (statusBadge) statusBadge.classList.add('covered-badge');
    }

    // wire events to SVG states
    const states = document.querySelectorAll('#sudan-map .state');
    states.forEach(s => {
      // make focusable for keyboard users
      s.setAttribute('tabindex', '0');

      s.addEventListener('mouseenter', () => showState(s));
      s.addEventListener('focus', () => showState(s));
      s.addEventListener('click', () => showState(s)); // mobile tap
      s.addEventListener('mouseleave', () => resetState());
      s.addEventListener('blur', () => resetState());
    });

    // Navbar behavior: make hamburger functional and auto-collapse on small screens
    (function(){
      const navMenu = document.getElementById('navMenu');
      const navLinks = document.querySelectorAll('.nav-link');
      const toggler = document.querySelector('.navbar-toggler');

      // Toggler: toggle Bootstrap collapse and update aria-expanded
      if (toggler && navMenu) {
        toggler.addEventListener('click', () => {
          const bsCollapse = bootstrap.Collapse.getInstance(navMenu) || new bootstrap.Collapse(navMenu, {
            toggle: false
          });
          bsCollapse.toggle();
          
          // Update aria-expanded
          const isOpen = navMenu.classList.contains('show');
          toggler.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
        
        toggler.addEventListener('keydown', (e) => { 
          if (e.key === 'Enter' || e.key === ' ') { 
            e.preventDefault(); 
            toggler.click(); 
          } 
        });
      }

      // Collapse when a nav link is clicked (on narrow screens)
      navLinks.forEach(link => link.addEventListener('click', () => {
        try {
          if (!navMenu) return;
          if (window.innerWidth < 992 && navMenu.classList.contains('show')) {
            const bsCollapse = bootstrap.Collapse.getInstance(navMenu) || new bootstrap.Collapse(navMenu, {
              toggle: false
            });
            bsCollapse.hide();
            if (toggler) toggler.setAttribute('aria-expanded', 'false');
          }
        } catch(e) { /* noop */ }
      }));
    })();

    // --- Doctor Selection and Booking Functionality ---
    (function(){
      const serviceSelect = document.getElementById('service-select');
      const doctorContainer = document.getElementById('doctor-selection-container');
      
      // Show/hide doctor selection based on service type
      if (serviceSelect) {
        serviceSelect.addEventListener('change', function() {
          const selectedService = this.value;
          if (selectedService === 'consultation' || selectedService === 'consultation') {
            doctorContainer.style.display = 'block';
            doctorContainer.style.animation = 'slideDown 0.3s ease-out';
          } else {
            doctorContainer.style.display = 'none';
          }
        });
      }

      // Handle doctor booking buttons
      const bookDoctorBtns = document.querySelectorAll('.book-doctor-btn');
      const bookNursingBtn = document.querySelector('.book-nursing-btn');
      const bookSpecialistBtn = document.querySelector('.specialist-btn');
      
      bookDoctorBtns.forEach(btn => {
        btn.addEventListener('click', function() {
          const doctorName = this.getAttribute('data-doctor');
          const isAr = document.documentElement.getAttribute('lang') === 'ar';
          
          // Scroll to booking form
          const bookingSection = document.getElementById('contact');
          if (bookingSection) {
            bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Wait for scroll to complete, then fill form
            setTimeout(() => {
              // Set service to consultation
              if (serviceSelect) {
                serviceSelect.value = 'consultation';
                serviceSelect.dispatchEvent(new Event('change'));
              }
              
              // Select doctor
              const doctorSelect = document.getElementById('doctor-select');
              if (doctorSelect) {
                doctorSelect.value = doctorName;
              }
              
              // Show success message
              const feedback = document.getElementById('reservation-feedback');
              if (feedback) {
                const message = isAr 
                  ? `تم اختيار ${doctorName}. يرجى إكمال بيانات الحجز.`
                  : `${doctorName} has been selected. Please complete booking details.`;
                showFormMessage(feedback, 'success', isAr ? 'تم اختيار الطبيب' : 'Doctor Selected', message);
              }
            }, 800);
          }
        });
      });

      // Handle specialist booking button
      if (bookSpecialistBtn) {
        bookSpecialistBtn.addEventListener('click', function() {
          const isAr = document.documentElement.getAttribute('lang') === 'ar';
          const specialistName = isAr ? 'د. اعتدال ابراهيم' : 'Dr. E\'tedal Ibrahim';
          
          // Scroll to booking form
          const bookingSection = document.getElementById('contact');
          if (bookingSection) {
            bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Wait for scroll to complete, then fill form
            setTimeout(() => {
              // Set service to consultation
              if (serviceSelect) {
                serviceSelect.value = 'consultation';
                serviceSelect.dispatchEvent(new Event('change'));
              }
              
              // Select specialist
              const doctorSelect = document.getElementById('doctor-select');
              if (doctorSelect) {
                doctorSelect.value = specialistName;
              }
              
              // Show success message
              const feedback = document.getElementById('reservation-feedback');
              if (feedback) {
                const message = isAr 
                  ? `تم اختيار ${specialistName}. يرجى إكمال بيانات الحجز.`
                  : `${specialistName} has been selected. Please complete booking details.`;
                showFormMessage(feedback, 'success', isAr ? 'تم اختيار الاستشاري' : 'Consultant Selected', message);
              }
            }, 800);
          }
        });
      }

      // Handle nursing service booking button
      if (bookNursingBtn) {
        bookNursingBtn.addEventListener('click', function() {
          const isAr = document.documentElement.getAttribute('lang') === 'ar';
          
          // Scroll to booking form
          const bookingSection = document.getElementById('contact');
          if (bookingSection) {
            bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Wait for scroll to complete, then fill form
            setTimeout(() => {
              // Set service to nursing
              if (serviceSelect) {
                serviceSelect.value = 'nursing';
                serviceSelect.dispatchEvent(new Event('change'));
              }
              
              // Show success message
              const feedback = document.getElementById('reservation-feedback');
              if (feedback) {
                const message = isAr 
                  ? 'تم اختيار خدمة التمريض المنزلي. يرجى إكمال بيانات الحجز.'
                  : 'Home nursing service has been selected. Please complete booking details.';
                showFormMessage(feedback, 'success', isAr ? 'تم اختيار الخدمة' : 'Service Selected', message);
              }
            }, 800);
          }
        });
      }
    })();

  })();

});
