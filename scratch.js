/* ═══════════════════════════════════════════════
   APPOLLO PRODUCTS — JAVASCRIPT
   Scroll Reveal · Nav · Slider · FAQ · Mobile
   ═══════════════════════════════════════════════ */

// ── Smooth scroll ──
document.querySelectorAll('a[href^="#"]').forEach((a) => {
	a.addEventListener("click", function (e) {
		e.preventDefault();
		const target = document.querySelector(this.getAttribute("href"));
		if (target) {
			const navH = document.querySelector("nav").offsetHeight;
			window.scrollTo({
				top: target.getBoundingClientRect().top + window.scrollY - navH,
				behavior: "smooth",
			});
			document.getElementById("navLinks").classList.remove("open");
			document.getElementById("mobileToggle").classList.remove("active");
		}
	});
});

// ── Mobile Menu ──
const mobileToggle = document.getElementById("mobileToggle");
const navLinks = document.getElementById("navLinks");
mobileToggle.addEventListener("click", () => {
	mobileToggle.classList.toggle("active");
	navLinks.classList.toggle("open");
});
document.addEventListener("click", (e) => {
	if (!e.target.closest("nav") && navLinks.classList.contains("open")) {
		navLinks.classList.remove("open");
		mobileToggle.classList.remove("active");
	}
});

// ── Navbar scroll ──
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
	navbar.classList.toggle("scrolled", window.scrollY > 50);
});

// ── Scroll Reveal ──
const revealObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add("visible");
				revealObserver.unobserve(entry.target);
			}
		});
	},
	{ threshold: 0.12 },
);
document
	.querySelectorAll(".reveal-up, .reveal-left, .reveal-right, .stagger")
	.forEach((el) => revealObserver.observe(el));

// ── Active Nav ──
const sections = document.querySelectorAll("section[id]");
const allNavLinks = document.querySelectorAll(".nav-link");
const navObs = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				const id = entry.target.id;
				allNavLinks.forEach((l) => {
					l.classList.toggle("active", l.getAttribute("href") === `#${id}`);
				});
			}
		});
	},
	{ threshold: 0.3, rootMargin: "-80px 0px -40% 0px" },
);
sections.forEach((s) => navObs.observe(s));

// ── FAQ Accordion ──
document.querySelectorAll(".faq-q").forEach((btn) => {
	btn.addEventListener("click", () => {
		const item = btn.parentElement;
		const isOpen = item.classList.contains("open");
		document.querySelectorAll(".faq-item").forEach((i) => {
			i.classList.remove("open");
			i.querySelector(".faq-q").setAttribute("aria-expanded", "false");
		});
		if (!isOpen) {
			item.classList.add("open");
			btn.setAttribute("aria-expanded", "true");
		}
	});
});

// ═══════════════════════════════════════════════
// TESTIMONIALS SLIDER
// ═══════════════════════════════════════════════
(function () {
	const track = document.getElementById("sliderTrack");
	const prevBtn = document.getElementById("sliderPrev");
	const nextBtn = document.getElementById("sliderNext");
	const dotsContainer = document.getElementById("sliderDots");
	if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

	const cards = track.querySelectorAll(".testimonial-card");
	const totalCards = cards.length;
	let currentIndex = 0;
	let cardsPerView = getCardsPerView();
	let autoSlideTimer;

	function getCardsPerView() {
		const w = window.innerWidth;
		if (w <= 768) return 1;
		if (w <= 1100) return 2;
		return 3;
	}

	function getMaxIndex() {
		return Math.max(0, totalCards - cardsPerView);
	}

	function buildDots() {
		dotsContainer.innerHTML = "";
		const dotCount = getMaxIndex() + 1;
		for (let i = 0; i < dotCount; i++) {
			const dot = document.createElement("button");
			dot.className = "slider-dot" + (i === currentIndex ? " active" : "");
			dot.setAttribute("aria-label", `Slide ${i + 1}`);
			dot.addEventListener("click", () => goTo(i));
			dotsContainer.appendChild(dot);
		}
	}

	function updateSlider() {
		const gap = 24; // 1.5rem gap
		const containerWidth = track.parentElement.offsetWidth;
		const cardWidth =
			(containerWidth - gap * (cardsPerView - 1)) / cardsPerView;

		cards.forEach((c) => {
			c.style.flex = `0 0 ${cardWidth}px`;
			c.style.minWidth = `${cardWidth}px`;
		});

		const offset = currentIndex * (cardWidth + gap);
		track.style.transform = `translateX(-${offset}px)`;

		// Update dots
		dotsContainer.querySelectorAll(".slider-dot").forEach((d, i) => {
			d.classList.toggle("active", i === currentIndex);
		});
	}

	function goTo(index) {
		currentIndex = Math.max(0, Math.min(index, getMaxIndex()));
		updateSlider();
		resetAutoSlide();
	}

	function next() {
		goTo(currentIndex >= getMaxIndex() ? 0 : currentIndex + 1);
	}

	function prev() {
		goTo(currentIndex <= 0 ? getMaxIndex() : currentIndex - 1);
	}

	function startAutoSlide() {
		autoSlideTimer = setInterval(next, 5000);
	}

	function resetAutoSlide() {
		clearInterval(autoSlideTimer);
		startAutoSlide();
	}

	prevBtn.addEventListener("click", prev);
	nextBtn.addEventListener("click", next);

	// Touch/swipe support
	let touchStartX = 0;
	let touchEndX = 0;
	track.addEventListener(
		"touchstart",
		(e) => {
			touchStartX = e.changedTouches[0].screenX;
		},
		{ passive: true },
	);
	track.addEventListener(
		"touchend",
		(e) => {
			touchEndX = e.changedTouches[0].screenX;
			const diff = touchStartX - touchEndX;
			if (Math.abs(diff) > 50) {
				if (diff > 0) next();
				else prev();
			}
		},
		{ passive: true },
	);

	// Resize handler
	let resizeTimeout;
	window.addEventListener("resize", () => {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(() => {
			cardsPerView = getCardsPerView();
			if (currentIndex > getMaxIndex()) currentIndex = getMaxIndex();
			buildDots();
			updateSlider();
		}, 150);
	});

	// Init
	buildDots();
	updateSlider();
	startAutoSlide();
})();

// ── Contact Form ──
const contactForm = document.getElementById("contactForm");
if (contactForm) {
	contactForm.addEventListener("submit", (e) => {
		e.preventDefault();
		const btn = contactForm.querySelector("button");
		const orig = btn.textContent;
		btn.textContent = "Message Sent! ✓";
		btn.style.background = "#2a8040";
		btn.style.color = "white";
		btn.disabled = true;
		setTimeout(() => {
			btn.textContent = orig;
			btn.style.background = "";
			btn.style.color = "";
			btn.disabled = false;
			contactForm.reset();
		}, 3000);
	});
}

// ── Subtle hero parallax ──
const heroImg = document.querySelector(".hero-img-container");
if (heroImg) {
	window.addEventListener("scroll", () => {
		if (window.scrollY < window.innerHeight) {
			heroImg.style.transform = `translateY(${window.scrollY * 0.06}px)`;
		}
	});
}
