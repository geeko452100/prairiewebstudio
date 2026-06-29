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
  toggle.addEventListener('click', function () {
    var open = toggle.getAttribute('aria-expanded') === 'true';
    var nextOpen = !open;
    toggle.setAttribute('aria-expanded', String(nextOpen));
    toggle.setAttribute('aria-label', nextOpen ? 'Close navigation menu' : 'Open navigation menu');
    nav.classList.toggle('hidden');
    if (nextOpen) {
      nav.removeAttribute('inert');
    } else {
      nav.setAttribute('inert', '');
    }
  }, { passive: true });
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
    var action = form.getAttribute('action');
    if (!action || action.indexOf('YOUR_FORM_ID') !== -1) {
      showFormError();
      return;
    }
    var submitBtn = document.getElementById('contact-submit');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }
    fetch(action, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    })
      .then(function (res) {
        if (!res.ok) throw new Error('submit failed');
        return res.json();
      })
      .then(function (data) {
        if (!data.ok) throw new Error('submit failed');
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
