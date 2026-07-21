// ============================
// ELEMENTS
// ============================

const formSteps = document.querySelectorAll(".form-step");
const sideSteps = document.querySelectorAll(".step");

const nextBtn = document.getElementById("next-button");
const backBtn = document.getElementById("back-button");
const confirmBtn = document.getElementById("confirm-button");

const userName = document.querySelector('input[name="userName"]');
const email = document.querySelector('input[name="email"]');
const phone = document.querySelector('input[name="Phone"]');

const planCards = document.querySelectorAll(".plan_card");
const addonCards = document.querySelectorAll(".addon_card");

const summaryPlan = document.getElementById("summary-plan");
const summaryAddons = document.getElementById("summary-addons");
const summaryTotal = document.getElementById("summary-total");

let currentStep = 1;

let selectedPlan = null;

let selectedPrice = 0;

let selectedAddons = [];

// ============================
// SHOW STEP
// ============================

function showStep(step) {
  formSteps.forEach((section) => {
    section.classList.remove("active");
  });

  sideSteps.forEach((item) => {
    item.classList.remove("active");
  });

  document.getElementById(`step${step}`)?.classList.add("active");

  sideSteps[step - 1]?.classList.add("active");

  backBtn.style.display = step === 1 ? "none" : "inline-block";

  nextBtn.style.display = step === 4 ? "none" : "inline-block";

  confirmBtn.style.display = step === 4 ? "inline-block" : "none";

  currentStep = step;
}

showStep(1);

// ============================
// VALIDATION
// ============================

function setError(input, message) {
  input.classList.add("error");

  input.nextElementSibling.textContent = message;
}

function clearError(input) {
  input.classList.remove("error");

  input.nextElementSibling.textContent = "";
}

function validateStepOne() {
  let valid = true;

  if (userName.value.trim() === "") {
    setError(userName, "This field is required");

    valid = false;
  } else {
    clearError(userName);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email.value.trim() === "") {
    setError(email, "This field is required");

    valid = false;
  } else if (!emailRegex.test(email.value)) {
    setError(email, "Invalid Email");

    valid = false;
  } else {
    clearError(email);
  }

  const phoneRegex = /^[0-9]{10,15}$/;

  if (phone.value.trim() === "") {
    setError(phone, "This field is required");

    valid = false;
  } else if (!phoneRegex.test(phone.value)) {
    setError(phone, "Invalid Phone");

    valid = false;
  } else {
    clearError(phone);
  }

  return valid;
}
// ============================
// NEXT / BACK BUTTONS
// ============================

nextBtn.addEventListener("click", () => {
  if (currentStep === 1) {
    if (!validateStepOne()) return;

    showStep(2);
    return;
  }

  if (currentStep === 2) {
    if (!selectedPlan) {
      document.querySelector(".plan-error").textContent =
        "Please select a plan";

      return;
    }

    document.querySelector(".plan-error").textContent = "";

    showStep(3);

    return;
  }

  if (currentStep === 3) {
    buildSummary();

    showStep(4);

    return;
  }
});

backBtn.addEventListener("click", () => {
  if (currentStep > 1) {
    showStep(currentStep - 1);
  }
});

// ============================
// PLAN SELECTION
// ============================

planCards.forEach((card) => {
  card.addEventListener("click", () => {
    planCards.forEach((item) => {
      item.classList.remove("selected");
    });

    card.classList.add("selected");

    selectedPlan = card.dataset.name;

    selectedPrice = Number(card.dataset.price);

    document.querySelector(".plan-error").textContent = "";
  });
});

// ============================
// ADDON SELECTION
// ============================

addonCards.forEach((card) => {
  const checkbox = card.querySelector("input");

  card.addEventListener("click", (e) => {
    if (e.target.tagName !== "INPUT") {
      checkbox.checked = !checkbox.checked;
    }

    card.classList.toggle("selected", checkbox.checked);

    updateAddonList();
  });

  checkbox.addEventListener("change", () => {
    card.classList.toggle("selected", checkbox.checked);

    updateAddonList();
  });
});

function updateAddonList() {
  selectedAddons = [];

  addonCards.forEach((card) => {
    const checkbox = card.querySelector("input");

    if (!checkbox.checked) return;

    const title = card.querySelector("h3").textContent.trim();

    const priceText = card.querySelector("span").textContent;

    const price = Number(priceText.replace(/[^0-9]/g, ""));

    selectedAddons.push({
      title,

      price,
    });
  });
}

// ============================
// CHANGE LINK
// ============================

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("change-plan")) {
    e.preventDefault();

    showStep(2);
  }
});
// ============================
// BUILD SUMMARY
// ============================

function buildSummary() {
  summaryPlan.innerHTML = `
        <div>
            <strong>${selectedPlan} (Monthly)</strong>
            <br>
            <a href="#" class="change-plan">Change</a>
        </div>

        <strong>$${selectedPrice}/mo</strong>
    `;

  summaryAddons.innerHTML = "";

  let addonTotal = 0;

  selectedAddons.forEach((item) => {
    addonTotal += item.price;

    summaryAddons.innerHTML += `
            <div class="summary-addon">

                <span>${item.title}</span>

                <span>+$${item.price}/mo</span>

            </div>
        `;
  });

  const total = selectedPrice + addonTotal;

  summaryTotal.innerHTML = `
        <span>Total (per month)</span>

        <strong>$${total}/mo</strong>
    `;
}

// ============================
// CONFIRM
// ============================

confirmBtn.addEventListener("click", () => {
  formSteps.forEach((step) => {
    step.classList.remove("active");
  });

  sideSteps.forEach((step) => {
    step.classList.remove("active");
  });

  backBtn.style.display = "none";

  nextBtn.style.display = "none";

  confirmBtn.style.display = "none";

  document.getElementById("thankyou").classList.add("active");
});

// ============================
// LIVE VALIDATION
// ============================

[userName, email, phone].forEach((input) => {
  input.addEventListener("input", () => {
    clearError(input);
  });
});

// ============================
// DEFAULT STATE
// ============================

backBtn.style.display = "none";

confirmBtn.style.display = "none";

// ============================
// OPTIONAL
// ============================

window.addEventListener("DOMContentLoaded", () => {
  showStep(1);
});

// ============================
// KEYBOARD SUPPORT
// ============================

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    if (currentStep < 4) {
      event.preventDefault();

      nextBtn.click();
    }
  }
});

// ============================
// CLICK EFFECT
// ============================

document.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("mousedown", () => {
    btn.style.transform = "scale(.97)";
  });

  btn.addEventListener("mouseup", () => {
    btn.style.transform = "scale(1)";
  });

  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "scale(1)";
  });
});

// ============================
// FINISHED
// ============================

console.log("Multi Step Form Loaded Successfully");
