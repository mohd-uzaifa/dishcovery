let allRecipes = [];
let filteredRecipes = [];
let currentIndex = 0;
const batchSize = 12;

// DOM Elements
const recipeGrid = document.getElementById('recipeGrid');
const loadMoreBtn = document.getElementById('loadMore');
const spinner = document.getElementById('spinner');
const cuisineButtons = document.querySelectorAll('.cuisine-buttons button');

// Modal Elements
const modal = document.getElementById('recipeModal');
const modalName = document.getElementById('modalName');
const modalImage = document.getElementById('modalImage');
const modalDescription = document.getElementById('modalDescription');
const modalIngredients = document.getElementById('modalIngredients');
const modalSteps = document.getElementById('modalSteps');
const closeModal = document.getElementById('closeModal');

// Load JSON
fetch('https://dishcovery-backend-tprd.onrender.com/api/recipes')
.then(res => res.json())
.then(data => {
  allRecipes = data.map(r => {
    r.cuisineLower = r.cuisine.toLowerCase();
    r.nameLower = r.name.toLowerCase();
    r.image = r.image.replace(/^static\//, '../ingredient-search/static/');
    return r;
  });
})
.catch(err => console.log(err));

// Event listeners for region buttons
cuisineButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    cuisineButtons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    const cuisine = btn.dataset.cuisine.toLowerCase();

    spinner.style.display = 'block';
    recipeGrid.innerHTML = '';
    loadMoreBtn.style.display = 'none';
    currentIndex = 0;

    setTimeout(() => {
      filteredRecipes = allRecipes.filter(r => r.cuisineLower.includes(cuisine));
      spinner.style.display = 'none';
      if(filteredRecipes.length === 0){
        recipeGrid.innerHTML = '<p class="start-message">No recipes found for this region</p>';
      } else {
        displayRecipes();
      }
    }, 600);
  });
});

// Display recipes with batch + favorite icon
function displayRecipes() {
  const recipesToShow = filteredRecipes.slice(currentIndex, currentIndex+batchSize);
  recipesToShow.forEach(r => {
    const card = document.createElement('div');
    card.classList.add('recipe-card');

    

    card.innerHTML = `
      <div class="card-img-wrapper">
        <img src="${r.image}" alt="">
      </div>
      <h3>${r.name}</h3>
      <p>${r.prep_time || ''}</p>
    `;

   

    card.addEventListener('click', ()=> openModal(r));
    recipeGrid.appendChild(card);
  });
  currentIndex += recipesToShow.length;
  loadMoreBtn.style.display = currentIndex < filteredRecipes.length ? 'block' : 'none';
}

// Load More
loadMoreBtn.addEventListener('click', displayRecipes);

// Modal
function openModal(recipe){
  modalName.textContent = recipe.name;
  modalImage.src = recipe.image;
  modalDescription.textContent = recipe.description || '';
  modalIngredients.innerHTML='';
  modalSteps.innerHTML='';
  recipe.ingredients.forEach(i=>{
    let li = document.createElement('li'); li.textContent=i;
    modalIngredients.appendChild(li);
  });
  recipe.steps.forEach(s=>{
    let li = document.createElement('li'); li.textContent=s;
    modalSteps.appendChild(li);
  });
  modal.style.display='flex';
}
closeModal.addEventListener('click', ()=> modal.style.display='none');
window.addEventListener('click', e=> { if(e.target===modal) modal.style.display='none'; });


