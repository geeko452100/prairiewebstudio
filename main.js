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

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Formspree-style honeypot: bots fill hidden fields humans never see.
    var gotcha = String(new FormData(form).get('_gotcha') || '').trim();
    if (gotcha !== '') {
      showFormSuccess();
      return;
    }

    var submitBtn = document.getElementById('contact-submit');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }

    var data = Object.fromEntries(new FormData(form).entries());

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: data.customerName,
        business: data.business,
        email: data.email,
        phone: data.phone,
        address: data.address,
        message: data.message,
        _gotcha: gotcha,
      }),
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Request failed (' + res.status + ')');
        return res.json();
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
