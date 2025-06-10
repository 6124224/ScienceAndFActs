document.addEventListener("DOMContentLoaded", function () {
    // Fade in sections on scroll
    const sections = document.querySelectorAll("section");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.2 });

    sections.forEach(section => observer.observe(section));

    // Smooth scrolling effect for navigation
    document.querySelectorAll("a").forEach(anchor => {
        anchor.addEventListener("click", function (event) {
            if (this.getAttribute("href").startsWith("#")) {
                event.preventDefault();
                document.querySelector(this.getAttribute("href")).scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    });

    // Hover effects for articles
    const articles = document.querySelectorAll("article");
    articles.forEach(article => {
        article.addEventListener("mouseenter", () => {
            article.style.transform = "scale(1.05)";
            article.style.transition = "transform 0.3s ease-in-out";
        });
        article.addEventListener("mouseleave", () => {
            article.style.transform = "scale(1)";
        });
    });

    // Background animation effect
    document.body.style.background = "linear-gradient(45deg, #2d3e50, #4a69bd)";
    document.body.style.animation = "backgroundAnimation 10s infinite alternate";
});

