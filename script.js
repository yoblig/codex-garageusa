const steps = Array.from(document.querySelectorAll('.step'));
const progressSteps = Array.from(document.querySelectorAll('.progress-step'));
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const form = document.getElementById('garage-form');
const summaryFields = {
  materials: document.getElementById('summary-materials'),
  roof: document.getElementById('summary-roof'),
  color: document.getElementById('summary-color'),
  size: document.getElementById('summary-size'),
};
const confirmation = document.getElementById('confirmation');

let currentStep = 0;

const showStep = (index) => {
  steps.forEach((step, idx) => {
    step.classList.toggle('is-active', idx === index);
  });

  progressSteps.forEach((step, idx) => {
    step.classList.toggle('is-active', idx === index);
    step.classList.toggle('is-complete', idx < index);
  });

  prevBtn.disabled = index === 0;
  nextBtn.textContent = index === steps.length - 1 ? 'Review' : 'Next';

  if (index === steps.length - 1) {
    nextBtn.disabled = true;
    updateSummary();
  } else {
    nextBtn.disabled = false;
  }
};

const getSelectedValues = () => {
  const materials = Array.from(form.elements['materials'])
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  const roof = form.elements['roof']?.value || '';
  const color = form.elements['color']?.value || '';
  const width = form.elements['width']?.value;
  const length = form.elements['length']?.value;
  const height = form.elements['height']?.value;

  return {
    materials,
    roof,
    color,
    size: width && length && height ? `${width}ft × ${length}ft × ${height}ft` : '',
  };
};

const validateStep = (index) => {
  const step = steps[index];
  const requiredInputs = step.querySelectorAll('input[required]');

  return Array.from(requiredInputs).every((input) => {
    if (input.type === 'radio') {
      const group = form.elements[input.name];
      const checked = Array.from(group).some((radio) => radio.checked);
      return checked;
    }
    return input.value.trim() !== '';
  });
};

const updateSummary = () => {
  const selections = getSelectedValues();

  summaryFields.materials.textContent = selections.materials.length
    ? selections.materials.join(', ')
    : 'No materials selected';

  summaryFields.roof.textContent = selections.roof || 'No roof style selected';
  summaryFields.color.textContent = selections.color || 'No color selected';
  summaryFields.size.textContent = selections.size || 'Size not specified';
};

nextBtn.addEventListener('click', () => {
  if (!validateStep(currentStep)) {
    confirmation.textContent = 'Please complete the required fields before proceeding.';
    confirmation.style.color = '#f97316';
    return;
  }

  confirmation.textContent = '';

  if (currentStep < steps.length - 1) {
    currentStep += 1;
    showStep(currentStep);
  }
});

prevBtn.addEventListener('click', () => {
  if (currentStep > 0) {
    currentStep -= 1;
    showStep(currentStep);
    confirmation.textContent = '';
  }
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  updateSummary();
  confirmation.textContent = 'Your garage design has been submitted! We will contact you soon.';
  confirmation.style.color = '#4ade80';
});

showStep(currentStep);
