const busRoutes = [
  ["583", "Tambaram Sanatorium Bus Stand ↔ Sriperumbudur Bus Stand"],
  ["579A", "Tambaram Sanatorium Bus Stand ↔ Walajabad Bus Stand"],
  ["579C", "Tambaram Sanatorium Bus Stand ↔ Walajabad Bus Stand"],
  ["579K", "Kilambakkam Bus Terminal ↔ Walajabad Bus Stand"],
  ["79A", "Tambaram ↔ Navalur S.C.B"],
  ["555P", "Padappai ↔ Sholinganallur"],
  ["55X", "Tambaram ↔ Mannivakkam Tank"],
];

const busGrid = document.getElementById("busGrid");
busRoutes.forEach(([number, route]) => {
  const card = document.createElement("div");
  card.className = "col-md-6 col-lg-4 col-xl-3";
  card.innerHTML = `<div class="bus-card"><div class="route-no">${number}</div><p class="mt-2 mb-3">${route}</p><a class="route-link" target="_blank" rel="noopener" href="https://moovitapp.com/index/en/public_transit-line-${number.toLowerCase()}-Chennai-4612">Route details ↗</a></div>`;
  busGrid.appendChild(card);
});

const showNote = (message) => {
  const note = document.getElementById("copyNote");
  note.textContent = message;
  note.classList.add("show");
  setTimeout(() => note.classList.remove("show"), 1800);
};

document.getElementById("openInvitation").addEventListener("click", () => {
  document.getElementById("gate").classList.add("hidden");
  document.body.classList.remove("locked");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener(
  "scroll",
  () => {
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    document.getElementById("progress").style.width =
      `${maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0}%`;
  },
  { passive: true },
);

const ceremonyTime = new Date("2026-11-28T17:00:00+05:30").getTime();
function updateCountdown() {
  const remaining = ceremonyTime - Date.now();
  if (remaining <= 0) {
    ["days", "hours", "minutes", "seconds"].forEach((id) => {
      document.getElementById(id).textContent = "00";
    });
    document.getElementById("countdownMessage").textContent =
      "Today is the day! Welcome to the celebration.";
    return;
  }
  const values = {
    days: Math.floor(remaining / 86400000),
    hours: Math.floor(remaining / 3600000) % 24,
    minutes: Math.floor(remaining / 60000) % 60,
    seconds: Math.floor(remaining / 1000) % 60,
  };
  Object.entries(values).forEach(([id, value]) => {
    document.getElementById(id).textContent = String(value).padStart(2, "0");
  });
  document.getElementById("countdownMessage").textContent =
    "Counting down to the ceremony at 5:00 PM IST.";
}
updateCountdown();
setInterval(updateCountdown, 1000);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.12 },
);
document
  .querySelectorAll(".reveal")
  .forEach((element) => revealObserver.observe(element));

document.getElementById("copyAddress").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(
      "Jacob Gardens, Padappai, Chennai – 601301",
    );
  } catch (error) {}
  showNote("Venue address copied");
});

document.getElementById("shareBtn").addEventListener("click", async () => {
  const shareData = {
    title: "Eliyaser & Glory — Wedding Invitation",
    text: "You are invited to celebrate the wedding of Eliyaser & Glory on 28 November 2026 at Jacob Gardens, Padappai, Chennai.",
  };
  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (error) {}
    return;
  }
  try {
    await navigator.clipboard.writeText(location.href);
  } catch (error) {}
  showNote("Invitation link copied");
});

document.getElementById("rsvpForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("guestName").value.trim();
  const response = document.getElementById("guestResponse").value;
  const message = `Hello Eliyaser & Glory!\n\nThis is ${name}. ${response} for your wedding on 28 November 2026 at Jacob Gardens, Padappai.\n\nWishing you both a beautiful and blessed wedding!`;
  window.open(
    `https://wa.me/?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener",
  );
});
