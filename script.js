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
  const transitUrl =
    "https://www.google.com/maps/dir/?api=1&destination=Jacob%20Gardens%2C%20Padappai%2C%20Tamil%20Nadu%20601301&travelmode=transit";
  card.innerHTML = `<div class="bus-card"><div class="route-no">${number}</div><p class="mt-2 mb-3">${route}</p><a class="route-link" target="_blank" rel="noopener" href="${transitUrl}">Plan transit trip ↗</a></div>`;
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

const engagementPhotos = Array.from({ length: 23 }, (_, index) => {
  const number = String(index + 1).padStart(3, "0");
  return {
    src: `https://eliyaser-engagement-photos.s3.ap-south-1.amazonaws.com/image_${number}.jpg`,
    alt: `Eliyaser and Glory engagement photo ${index + 1}`,
    layout: ["featured", "tall", "medium", "wide", "square"][index % 5],
  };
});

const galleryGrid = document.getElementById("engagementGallery");
const galleryToggle = document.getElementById("toggleGallery");
const lightbox = document.getElementById("engagementLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCounter = document.getElementById("lightboxCounter");
const lightboxPrev = document.querySelector(".lightbox-prev");
const lightboxNext = document.querySelector(".lightbox-next");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxStage = document.getElementById("lightboxStage");

const initialGalleryCount = 9;
let showAllPhotos = false;
let currentPhotoIndex = 0;

function getGalleryImageUrl(photo) {
  return photo.src;
}

function renderGallery() {
  if (!galleryGrid) return;

  galleryGrid.innerHTML = "";

  engagementPhotos.forEach((photo, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `gallery-item ${photo.layout}`;
    if (!showAllPhotos && index >= initialGalleryCount) {
      button.classList.add("hidden");
    }
    button.setAttribute("aria-label", `Open engagement photo ${index + 1}`);
    button.dataset.index = String(index);

    const img = document.createElement("img");
    img.src = getGalleryImageUrl(photo);
    img.alt = photo.alt;
    img.loading = index < 5 ? "eager" : "lazy";
    img.decoding = "async";
    img.draggable = false;

    button.appendChild(img);
    button.addEventListener("click", () => openLightbox(index));
    galleryGrid.appendChild(button);
  });

  galleryToggle.textContent = showAllPhotos
    ? "Show Fewer Photos"
    : "View All Photos";
}

function updateLightboxDisplay(index) {
  const photo = engagementPhotos[index];
  if (!photo) return;

  currentPhotoIndex = index;
  lightboxCounter.textContent = `${index + 1} / ${engagementPhotos.length}`;
  lightboxImage.src = getGalleryImageUrl(photo);
  lightboxImage.alt = photo.alt;
  lightboxImage.classList.remove("is-visible");

  const preloadIndex = (index + 1) % engagementPhotos.length;
  const preloadImage = new Image();
  preloadImage.src = getGalleryImageUrl(engagementPhotos[preloadIndex]);

  requestAnimationFrame(() => {
    lightboxImage.classList.add("is-visible");
  });
}

function openLightbox(index) {
  if (!lightbox) return;

  updateLightboxDisplay(index);
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
}

function closeLightbox() {
  if (!lightbox) return;

  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
}

function goToPrevious() {
  const nextIndex =
    currentPhotoIndex === 0
      ? engagementPhotos.length - 1
      : currentPhotoIndex - 1;
  updateLightboxDisplay(nextIndex);
}

function goToNext() {
  const nextIndex =
    currentPhotoIndex === engagementPhotos.length - 1
      ? 0
      : currentPhotoIndex + 1;
  updateLightboxDisplay(nextIndex);
}

if (galleryToggle) {
  galleryToggle.addEventListener("click", () => {
    showAllPhotos = !showAllPhotos;
    renderGallery();
  });
}

if (lightboxClose) {
  lightboxClose.addEventListener("click", closeLightbox);
}

if (lightboxPrev) {
  lightboxPrev.addEventListener("click", goToPrevious);
}

if (lightboxNext) {
  lightboxNext.addEventListener("click", goToNext);
}

if (lightbox) {
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (!lightbox || !lightbox.classList.contains("open")) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowRight") goToNext();
  if (event.key === "ArrowLeft") goToPrevious();
});

let touchStartX = 0;
let touchEndX = 0;

if (lightboxStage) {
  lightboxStage.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0].screenX;
      touchEndX = touchStartX;
    },
    { passive: true },
  );

  lightboxStage.addEventListener(
    "touchend",
    (event) => {
      touchEndX = event.changedTouches[0].screenX;
      const delta = touchStartX - touchEndX;

      if (Math.abs(delta) > 50) {
        if (delta > 0) goToNext();
        else goToPrevious();
      }
    },
    { passive: true },
  );
}

renderGallery();
