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

function initTaxCalculator() {
  var amountInput = document.getElementById('calc-amount');
  var rateInput = document.getElementById('calc-rate');
  var citySelect = document.getElementById('calc-city');
  var subtotalEl = document.getElementById('calc-subtotal');
  var taxEl = document.getElementById('calc-tax');
  var totalEl = document.getElementById('calc-total');
  if (!amountInput || !rateInput) return;

  function fmt(n) {
    return '$' + n.toFixed(2);
  }

  function applyLocal(amount, rate) {
    var tax = amount * (rate / 100);
    subtotalEl.textContent = fmt(amount);
    taxEl.textContent = fmt(tax);
    totalEl.textContent = fmt(amount + tax);
  }

  var debounceTimer;
  function update() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      var amount = parseFloat(amountInput.value) || 0;
      var rate = parseFloat(rateInput.value) || 0;
      var city = citySelect ? citySelect.value : '';
      var url = '/api/tax?amount=' + amount + (city ? '&city_name=' + encodeURIComponent(city) : '');
      fetch(url)
        .then(function (res) { return res.json(); })
        .then(function (data) {
          subtotalEl.textContent = fmt(data.calculated_base_cost);
          taxEl.textContent = fmt(data.calculated_tax_cost);
          totalEl.textContent = fmt(data.calculated_grand_total);
        })
        .catch(function () { applyLocal(amount, rate); });
    }, 300);
  }

  var calcBtn = document.getElementById('calc-btn');
  if (calcBtn) calcBtn.addEventListener('click', update);

  function onEnter(e) { if (e.key === 'Enter') update(); }
  amountInput.addEventListener('keydown', onEnter);
  rateInput.addEventListener('keydown', onEnter);

  if (citySelect) {
    citySelect.addEventListener('change', function () {
      var selected = citySelect.options[citySelect.selectedIndex];
      var dataRate = selected.getAttribute('data-rate');
      if (dataRate) rateInput.value = dataRate;
    });
  }
}

if ('requestIdleCallback' in window) {
  requestIdleCallback(function () { initMenu(); initContactForm(); initTaxCalculator(); });
} else {
  setTimeout(function () { initMenu(); initContactForm(); initTaxCalculator(); }, 1);
}
