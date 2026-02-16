// Pash Care bilingual language toggle and enhancements
// This script enables switching between Arabic and English content, RTL/LTR, hero word rotation, and form UX.
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

    // update language toggle button text
    const buttonText = isAr ? 'English' : 'العربية';
    const buttonTitle = isAr ? 'View site in English' : 'عرض الموقع بالعربية';
    
    if (langToggle) {
      langToggle.textContent = buttonText;
      langToggle.setAttribute('title', buttonTitle);
    }
  }

  // Animated language switch
  function animatedSwitch(lang) {
    try {
      const main = document.querySelector('main') || document.body;
      main.classList.add('lang-fade');
      // mark targets so CSS can fade them
      document.querySelectorAll('[id$="-ar"],[id$="-en"]').forEach(el => el.classList.add('lang-fade-target'));
      setTimeout(() => {
        setLanguage(lang);
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

  // Language toggle event listener
  if (langToggle) {
    langToggle.addEventListener('click', function(e) {
      e.preventDefault();
      const current = html.getAttribute('lang') || 'ar';
      const next = (current === 'ar') ? 'en' : 'ar';
      animatedSwitch(next);
    });
    
    langToggle.addEventListener('keydown', function(ev){ 
      if(ev.key === 'Enter' || ev.key === ' ') { 
        ev.preventDefault(); 
        const current = html.getAttribute('lang') || 'ar'; 
        animatedSwitch(current === 'ar' ? 'en' : 'ar'); 
      }
    });
  }

  /* Word rotation animation for hero section */
  let _wordRotationTimer;
  const serviceWords = {
    ar: ['استشارة طبية', 'تمريض منزلي', 'خدمات رعاية صحية'],
    en: ['Medical Consultation', 'Home Nursing', 'Healthcare Services']
  };

  function startWordRotation() {
    clearWordRotationTimer();
    const isAr = document.documentElement.getAttribute('lang') === 'ar';
    const words = serviceWords[isAr ? 'ar' : 'en'];
    const animatedWordAr = document.getElementById('animated-word-ar');
    const animatedWordEn = document.getElementById('animated-word-en');
    
    let currentIndex = 0;
    
    function rotateWord() {
      const currentWord = words[currentIndex];
      const targetElement = isAr ? animatedWordAr : animatedWordEn;
      
      if (targetElement) {
        // Fade out
        targetElement.classList.add('fade-out');
        
        setTimeout(() => {
          // Change text
          targetElement.textContent = currentWord;
          // Remove fade-out and add fade-in
          targetElement.classList.remove('fade-out');
          targetElement.classList.add('fade-in');
          
          // Remove fade-in after animation completes
          setTimeout(() => {
            targetElement.classList.remove('fade-in');
          }, 800);
        }, 400);
      }
      
      // Move to next word
      currentIndex = (currentIndex + 1) % words.length;
    }
    
    // Start rotation immediately
    rotateWord();
    // Then rotate every 3 seconds
    _wordRotationTimer = setInterval(rotateWord, 3000);
  }

  function clearWordRotationTimer() {
    if (_wordRotationTimer) {
      clearInterval(_wordRotationTimer);
      _wordRotationTimer = null;
    }
  }

  // Reveal on scroll for sections (progressive enhancement)
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(en => { if(en.isIntersecting) en.target.classList.add('visible'); });
    }, { threshold: 0.12 });
    document.querySelectorAll('section, .service-card, .card').forEach(el => { el.classList.add('reveal'); io.observe(el); });
  } else {
    document.querySelectorAll('section, .service-card, .card').forEach(el => el.classList.add('reveal', 'visible'));
  }

  // default language
  setLanguage('ar');

  // start word rotation on initial load
  startWordRotation();

  // Update animatedSwitch to restart word rotation after language change
  const originalAnimatedSwitch = animatedSwitch;
  animatedSwitch = function(lang) {
    originalAnimatedSwitch(lang);
    // Restart word rotation with new language
    setTimeout(() => {
      startWordRotation();
    }, 200);
  };

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
      const termsAccepted = form.querySelector('input[name="termsAccepted"]');

      if (!fullName || !fullName.value.trim()) return invalid(isAr ? 'الرجاء إدخال الاسم الكامل.' : 'Please enter your full name.', fullName);
      if (!email || !emailRe.test(email.value.trim())) return invalid(isAr ? 'الرجاء إدخال بريد إلكتروني صالح.' : 'Please enter a valid email address.', email);
      if (!phone || !phoneRe.test(phone.value.trim())) return invalid(isAr ? 'الرجاء إدخال رقم هاتف صالح.' : 'Please enter a valid phone number.', phone);
      if (!date || !date.value) return invalid(isAr ? 'الرجاء اختيار تاريخ الحجز.' : 'Please choose a reservation date.', date);
      // prevent past dates
      const selected = new Date(date.value + 'T00:00:00');
      const today = new Date(); today.setHours(0,0,0,0);
      if (selected < today) return invalid(isAr ? 'لا يمكن اختيار تاريخ في الماضي.' : 'Reservation date cannot be in the past.', date);
      if (!interest || !interest.value) return invalid(isAr ? 'الرجاء اختيار نوع الخدمة.' : 'Please select a service.', interest);
      if (!termsAccepted || !termsAccepted.checked) return invalid(isAr ? 'يجب الموافقة على الشروط وسياسة الخدمة قبل إرسال الطلب.' : 'You must agree to the Terms & Service Policy before submitting.', termsAccepted);

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


  // Prevent '#' links from jumping while still allowing Bootstrap modal trigger
  ['terms-link-ar', 'terms-link-en'].forEach(id => {
    const link = document.getElementById(id);
    if (!link) return;
    link.addEventListener('click', (e) => {
      e.preventDefault();
    });
  });


  // --- Doctor Selection and Booking Functionality ---
  (function(){
    const serviceSelect = document.getElementById('service-select');
    const doctorContainer = document.getElementById('doctor-selection-container');
    
    // Show/hide doctor selection based on service type
    if (serviceSelect) {
      serviceSelect.addEventListener('change', function() {
        const selectedService = this.value;
        if (!doctorContainer) return;
        if (selectedService === 'consultation') {
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
});
