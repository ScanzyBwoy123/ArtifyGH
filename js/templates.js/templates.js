document.addEventListener("DOMContentLoaded", () => {

  const grid = document.getElementById("templateGrid");
  const searchInput = document.getElementById("templateSearch");
  const categoryButtons = document.querySelectorAll(".category-btn");
  const templateCount = document.getElementById("templateCount");

  let activeCategory = "All";
  let searchTerm = "";

  function renderTemplates() {

    if (!grid) return;

    const filteredTemplates = ARTIFY_TEMPLATES.filter(template => {

      const matchesCategory =
        activeCategory === "All" ||
        template.category === activeCategory;

      const matchesSearch =
        template.title.toLowerCase().includes(searchTerm) ||
        template.category.toLowerCase().includes(searchTerm) ||
        template.description.toLowerCase().includes(searchTerm);

      return matchesCategory && matchesSearch;

    });

    templateCount.textContent =
      `${filteredTemplates.length} template${filteredTemplates.length === 1 ? "" : "s"}`;

    if (filteredTemplates.length === 0) {

      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔎</div>
          <h3>No templates found</h3>
          <p>Try another search or category.</p>
        </div>
      `;

      return;
    }

    grid.innerHTML = filteredTemplates.map(template => {

      const imageContent = template.image
        ? `<img src="${template.image}" alt="${template.title}">`
        : `
          <div class="template-placeholder">
            <div class="placeholder-brand">ArtifyGH</div>
            <div class="placeholder-title">${template.title}</div>
            <div class="placeholder-category">${template.category}</div>
          </div>
        `;

      return `
        <article class="template-card">

          <div class="template-image">

            ${imageContent}

            ${template.badge
              ? `<span class="template-badge">${template.badge}</span>`
              : ""
            }

          </div>

          <div class="template-info">

            <div>
              <h3>${template.title}</h3>
              <p>${template.category}</p>
            </div>

            <div class="template-price">
              GH₵ ${template.price}
            </div>

          </div>

          <button
            class="customize-btn"
            onclick="customizeTemplate('${template.id}')"
          >
            Customize
          </button>

        </article>
      `;

    }).join("");

  }

  categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

      categoryButtons.forEach(btn =>
        btn.classList.remove("active")
      );

      button.classList.add("active");

      activeCategory = button.dataset.category;

      renderTemplates();

    });

  });

  if (searchInput) {

    searchInput.addEventListener("input", () => {

      searchTerm = searchInput.value
        .trim()
        .toLowerCase();

      renderTemplates();

    });

  }

  renderTemplates();

});


function customizeTemplate(templateId) {

  const template = ARTIFY_TEMPLATES.find(
    item => item.id === templateId
  );

  if (!template) {
    alert("Template could not be found.");
    return;
  }

  const url =
    "editor.html?template=" +
    encodeURIComponent(template.id) +
    "&name=" +
    encodeURIComponent(template.title) +
    "&price=" +
    encodeURIComponent(template.price);

  window.location.href = url;
}
