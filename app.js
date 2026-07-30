const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".nav");

menuButton?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

const form = document.querySelector("#quote-form");
const review = document.querySelector("#request-review");
const requestText = document.querySelector("#request-text");
const copyButton = document.querySelector("#copy-request");
const editButton = document.querySelector("#edit-request");

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  requestText.textContent =
    `Hi Adrien — I’d like a quote from Adrien’s Porch & Property.\n\n` +
    `Name: ${data.get("name")}\n` +
    `Neighborhood: ${data.get("neighborhood")}\n` +
    `Contact: ${data.get("contact")}\n` +
    `Job: ${data.get("job")}`;
  form.hidden = true;
  review.hidden = false;
  copyButton.textContent = "Copy request";
  review.focus();
});

copyButton?.addEventListener("click", async () => {
  const text = requestText.textContent;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
  }
  copyButton.textContent = "Copied!";
});

editButton?.addEventListener("click", () => {
  review.hidden = true;
  form.hidden = false;
  form.querySelector("input")?.focus();
});

const customerReviewForm = document.querySelector("#customer-review-form");
const reviewStatus = document.querySelector("#review-status");
const reviewSubmit = customerReviewForm?.querySelector(".review-submit");
const reviewSubmitContent = reviewSubmit?.innerHTML;

customerReviewForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!customerReviewForm.reportValidity()) return;

  const formData = new FormData(customerReviewForm);
  const firstName = String(formData.get("first_name") || "").trim();
  const lastInitial = String(formData.get("last_initial") || "").trim().slice(0, 1).toUpperCase();
  const neighborhood = String(formData.get("neighborhood") || "").trim();
  const reviewText = String(formData.get("review") || "").trim();

  formData.delete("first_name");
  formData.delete("last_initial");
  formData.delete("neighborhood");
  formData.delete("review");
  formData.set("Reviewer", `${firstName} ${lastInitial}.`);
  formData.set("Neighborhood", neighborhood || "Not provided");
  formData.set("Review", reviewText);

  reviewSubmit.disabled = true;
  reviewSubmit.textContent = "Sending…";
  reviewStatus.className = "review-status review-field-wide";
  reviewStatus.textContent = "Sending your review…";

  try {
    const response = await fetch(customerReviewForm.action, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.success === "false") {
      throw new Error("Review submission failed");
    }

    customerReviewForm.reset();
    reviewStatus.classList.add("success");
    reviewStatus.textContent = "Thank you — your review was sent to Adrien for approval.";
  } catch {
    reviewStatus.classList.add("error");
    reviewStatus.textContent = "The review could not be sent. Please try again in a moment.";
  } finally {
    reviewSubmit.disabled = false;
    reviewSubmit.innerHTML = reviewSubmitContent;
  }
});
