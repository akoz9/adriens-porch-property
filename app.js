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
