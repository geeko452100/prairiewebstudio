function showEl(el) {
  el.removeAttribute('hidden');
  el.classList.remove('hidden');
}

function hideEl(el) {
  el.setAttribute('hidden', '');
  el.classList.add('hidden');
}

function initMenu() {
  var toggle = document.getElementById('menu-toggle');
  var nav = document.getElementById('mobile-nav');
  if (!toggle || !nav) return;

  function setOpen(nextOpen) {
    toggle.setAttribute('aria-expanded', String(nextOpen));
    toggle.setAttribute('aria-label', nextOpen ? 'Close navigation menu' : 'Open navigation menu');
    nav.classList.toggle('hidden', !nextOpen);
    if (nextOpen) {
      nav.removeAttribute('inert');
      var firstLink = nav.querySelector('a');
      if (firstLink) firstLink.focus();
    } else {
      nav.setAttribute('inert', '');
    }
  }

  toggle.addEventListener('click', function () {
    var open = toggle.getAttribute('aria-expanded') === 'true';
    setOpen(!open);
  }, { passive: true });

  nav.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      setOpen(false);
      toggle.focus();
    }
  });
}

function showFormError() {
  var error = document.getElementById('form-error');
  if (!error) return;
  showEl(error);
  error.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showFormSuccess() {
  var form = document.getElementById('contact-form');
  var success = document.getElementById('form-success');
  var error = document.getElementById('form-error');
  if (error) hideEl(error);
  if (form) hideEl(form);
  if (success) {
    showEl(success);
    success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// Contact form submission

function initContactForm() {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var dispatch = new PrairieDispatch('pk_85bfd3e424c165bb63bf0e59efc203ef6dfb26da7c97eb56');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Formspree-style honeypot: bots fill hidden fields humans never see.
    if (String(new FormData(form).get('_gotcha') || '').trim() !== '') {
      showFormSuccess();
      return;
    }

    var submitBtn = document.getElementById('contact-submit');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }

    var data = Object.fromEntries(new FormData(form).entries());

    dispatch
      .send({
        customerName: data.customerName,
        phone: data.phone,
        address: data.address,
        notes: data.message,
      })
      .then(function () {
        showFormSuccess();
      })
      .catch(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Let's Get To Work";
        }
        showFormError();
      });
  });
}
