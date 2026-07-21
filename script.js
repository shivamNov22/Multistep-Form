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
const phone = document.querySelector('input[name="phone"]');

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

  nextBtn.style.display = "inline-block";

  confirmBtn.style.display = "none";

  currentStep = step;
}

showStep(1);

nextBtn.addEventListener("click", () => {
  if (currentStep === 1) {
    if (!userName.reportValidity()) return;

    if (!email.reportValidity()) return;

    if (!phone.reportValidity()) return;

    showStep(2);

    return;
  }

  if (currentStep === 2) {
    if (!selectedPlan) {
      return;
    }

    showStep(3);

    return;
  }

  if (currentStep === 3) {
    buildSummary();

    showStep(4);

    return;
  }

  if (currentStep === 4) {
    document.getElementById("step4").classList.remove("active");

    document.getElementById("thankyou").classList.add("active");

    nextBtn.style.display = "none";

    backBtn.style.display = "none";
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
