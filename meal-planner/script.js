// Weekly planner script - automatic diet box triggers, spinner, day-card layout,
// course-based filtering, Hindi exclusion, image-path fix (like region page).

document.addEventListener('DOMContentLoaded', () => {
  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const meals = ["Breakfast","Lunch","Dinner"];

  let allRecipes = [];
  let weeklyPlan = {};
  const hindiRegex = /[\u0900-\u097F]/;

  // DOM
  const dietBoxes = Array.from(document.querySelectorAll('.diet-box'));
  const spinner = document.getElementById('spinner');
  const plannerArea = document.getElementById('plannerArea');

  // Modal elements
  const modal = document.getElementById('recipeModal');
  const closeModal = document.getElementById('closeModal');
  const modalName = document.getElementById('modalName');
  const modalImage = document.getElementById('modalImage');
  const modalDescription = document.getElementById('modalDescription');
  const modalIngredients = document.getElementById('modalIngredients');
  const modalSteps = document.getElementById('modalSteps');

  // Selected diets (strings)
  let selectedDiets = [];
  let firstLoad = true; // 🔹 New flag to prevent spinner on first render

  // load JSON
  fetch('recipes1.json')
    .then(r => r.json())
    .then(data => {
      // adjust image paths same as your region page
      allRecipes = data.map(item => {
        const r = Object.assign({}, item);
        r.image = (r.image || '').replace(/^static\//, '../ingredient-search/static/');
        return r;
      });
      // initial render (no diets = show message)
      generateAndRender();
    })
    .catch(err => {
      console.error('Failed to load recipes1.json', err);
    });

  // diet box clicks toggle selection and auto-generate
  dietBoxes.forEach(box => {
    box.addEventListener('click', () => {
      box.classList.toggle('selected');
      const diet = box.dataset.diet;
      if (box.classList.contains('selected')) {
        if (!selectedDiets.includes(diet)) selectedDiets.push(diet);
      } else {
        selectedDiets = selectedDiets.filter(d => d !== diet);
      }
      // auto-generate on each change
      generateAndRender();
    });
  });

  // main generate + render with spinner
  function generateAndRender() {
    // 🔹 Only show spinner after the first manual trigger
    if (!firstLoad) {
      spinner.style.display = 'block';
    }
    plannerArea.innerHTML = '';

    setTimeout(() => {
      // 1) if no diet selected — show message and stop
      if (selectedDiets.length === 0) {
        spinner.style.display = 'none';
        plannerArea.innerHTML = `
          <div style="text-align:center; color:#777; padding:20px; background:#fff; border-radius:10px;">
            Please select at least one diet type to generate your weekly meal plan.
          </div>`;
        firstLoad = false; // mark that first render happened
        return;
      }

      // 2) Start from all recipes
      let filtered = allRecipes.slice();

      // 3) Exclude Hindi recipes (name or description)
      filtered = filtered.filter(r => {
        const name = (r.name || '');
        const desc = (r.description || '');
        return !hindiRegex.test(name) && !hindiRegex.test(desc);
      });

      // 4) Apply diet filter
      filtered = filtered.filter(r => {
        const dietName = (r.diet || '').toLowerCase().trim();
        return selectedDiets.some(selected => {
          const sel = selected.toLowerCase();
          if (sel === 'vegetarian' || sel === 'non vegetarian') {
            return dietName === sel;
          }
          return dietName.includes(sel);
        });
      });

      // 5) If no recipes after filters
      if (filtered.length === 0) {
        spinner.style.display = 'none';
        plannerArea.innerHTML = `
          <div style="text-align:center; color:#777; padding:20px; background:#fff; border-radius:10px;">
            No recipes found for the selected diet type(s).
          </div>`;
        firstLoad = false;
        return;
      }

      // 6) Build weeklyPlan
      weeklyPlan = {};
      days.forEach(day => {
        weeklyPlan[day] = {};
        meals.forEach(meal => {
          const mealRecipes = filtered.filter(r =>
            (r.course || '').toLowerCase().includes(meal.toLowerCase())
          );
          weeklyPlan[day][meal] =
            mealRecipes.length > 0
              ? mealRecipes[Math.floor(Math.random() * mealRecipes.length)]
              : null;
        });
      });

      // 7) Render planner
      renderPlanner();
      spinner.style.display = 'none';
      firstLoad = false;
    }, 600);
  }

  function renderPlanner() {
    plannerArea.innerHTML = ''; // clear
    for (const day of days) {
      const dayEl = document.createElement('section');
      dayEl.className = 'day';

      // header
      const header = document.createElement('div');
      header.className = 'day-header';
      header.innerHTML = `<h4>🍽 ${day}</h4><div class="sub">Breakfast • Lunch • Dinner</div>`;
      dayEl.appendChild(header);

      // meals row
      const row = document.createElement('div');
      row.className = 'meals-row';

      for (const meal of meals) {
        const recipe = weeklyPlan[day][meal];

        const card = document.createElement('div');
        card.className = 'meal-card';
        card.dataset.day = day;
        card.dataset.meal = meal;

        if (!recipe) {
          card.innerHTML = `<div class="meal-type">${meal}</div>
            <div class="placeholder">No ${meal.toLowerCase()} found</div>`;
        } else {
          const imgSrc = recipe.image || '';
          card.innerHTML = `
            <div class="meal-type">${meal}</div>
            <img loading="lazy" src="${imgSrc}" alt="${escapeHtml(recipe.name)}" 
              onerror="this.style.opacity=0.6; this.nextElementSibling && (this.nextElementSibling.textContent='Image not found')">
            <div class="recipe-name">${escapeHtml(recipe.name)}</div>
          `;
          // click to open modal
          card.addEventListener('click', () => showModal(recipe));
        }

        row.appendChild(card);
      }

      dayEl.appendChild(row);
      plannerArea.appendChild(dayEl);
    }
  }

  // show modal filled with recipe details
  function showModal(recipe) {
    modalName.textContent = recipe.name || '';
    modalImage.src = recipe.image || '';
    modalDescription.textContent = recipe.description || '';

    modalIngredients.innerHTML = '';
    (recipe.ingredients || []).forEach(i => {
      const li = document.createElement('li');
      li.textContent = i;
      modalIngredients.appendChild(li);
    });

    modalSteps.innerHTML = '';
    (recipe.steps || []).forEach(s => {
      const li = document.createElement('li');
      li.textContent = s;
      modalSteps.appendChild(li);
    });

    modal.style.display = 'flex';
  }

  // close modal handlers
  closeModal.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });

  // small helper: escape html for safety
  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"]/g, ch => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;'
    }[ch]));
  }
});
