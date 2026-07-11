let allRecipes = [];
let filteredRecipes = [];
let selectedIngredients = [];
let selectedDiet = null;
let selectedCourse = null;
let currentIndex = 0;
const batchSize = 16;

// DOM Elements
const loadingOverlay = document.getElementById("loadingOverlay");
const ingredientCount = document.getElementById('ingredientCount');
const ingredientSearch = document.getElementById('ingredientSearch');
const recipeGrid = document.getElementById('recipeGrid');
const selectedIngredientsDiv = document.getElementById('selectedIngredients');
const loadMoreBtn = document.getElementById('loadMore');
const recipeSearch = document.getElementById('recipeSearch');
const container = document.querySelector('.recipes-container');

// Spinner
const spinner = document.createElement('div');
spinner.classList.add('spinner');
spinner.style.display = 'none';
recipeGrid.parentNode.insertBefore(spinner, recipeGrid);

// Modal Elements
const modal = document.getElementById('recipeModal');
const modalName = document.getElementById('modalName');
const modalImage = document.getElementById('modalImage');
const modalDescription = document.getElementById('modalDescription');
const modalIngredients = document.getElementById('modalIngredients');
const modalSteps = document.getElementById('modalSteps');
const closeModal = document.getElementById('closeModal');

loadingOverlay.style.display = "flex";

const cachedRecipes = sessionStorage.getItem("recipes");

function prepareRecipes(data) {
    allRecipes = data.map(r => {

        r.ingredients = (r.ingredients || []).map(i => i.toLowerCase().trim());

        r.nameLower = (r.name || "").toLowerCase();
        r.courseLower = (r.course || "").toLowerCase();
        r.dietLower = (r.diet || "").toLowerCase();

        r.image = r.image || "";

        return r;
    });

    loadingOverlay.style.display = "none";
}

if (cachedRecipes) {

    console.log("Loaded recipes from sessionStorage");

    prepareRecipes(JSON.parse(cachedRecipes));

} else {

    fetch("https://dishcovery-backend-tprd.onrender.com/api/recipes")
        .then(res => res.json())
        .then(data => {

            sessionStorage.setItem("recipes", JSON.stringify(data));

            prepareRecipes(data);

        })
        .catch(err => {

            loadingOverlay.style.display = "none";

            console.error(err);

        });

}

// Sections
const sections = {
  'pantry-essentials': ['salt','oil','sugar','flour','baking powder','soy sauce','vinegar','honey','ketchup','mustard','coconut oil','soda'],
  vegetables: ['tomato','onion','cauliflower','potato','methi','spinach','carrot','capsicum','cabbage','peas','brinjal','beetroot','pumpkin','garlic','ginger'],
  dairy: ['milk','cheese','butter','cream','yogurt','paneer','curd','ghee','buttermilk','condensed milk','mozzarella'],
  spices: ['turmeric','cumin','chilli','garam masala','coriander','black pepper','cardamom','cloves','cinnamon','nutmeg','fennel','saffron','mustard seeds','asafoetida','curry leaves']
};

// Initialize pantry section boxes
for (let sec in sections) {
  let container = document.querySelector(`#${sec} .items`);
  sections[sec].forEach(item => {
    let box = document.createElement('div');
    box.classList.add('item-box');
    box.textContent = item;
    box.addEventListener('click', () => toggleIngredient(item, box));
    container.appendChild(box);
  });
}

// Diet and Course boxes
const dietOptions = ['Vegetarian','Non Vegetarian'];
const courseOptions = ['Breakfast','Lunch','Dinner','Dessert','Snacks'];

dietOptions.forEach(d => {
  let box = document.createElement('div');
  box.classList.add('diet-box');
  box.textContent = d;
  box.addEventListener('click', ()=> {
    selectedDiet = (selectedDiet===d)?null:d;
    document.querySelectorAll('.diet-box').forEach(b=>{
      b.classList.remove('selected-diet');
      if(b.textContent===selectedDiet) b.classList.add('selected-diet');
    });
    filterRecipes();
  });
  document.querySelector('#diet .items').appendChild(box);
});

courseOptions.forEach(c => {
  let box = document.createElement('div');
  box.classList.add('course-box');
  box.textContent = c;
  box.addEventListener('click', ()=> {
    selectedCourse = (selectedCourse===c)?null:c;
    document.querySelectorAll('.course-box').forEach(b=>{
      b.classList.remove('selected-course');
      if(b.textContent===selectedCourse) b.classList.add('selected-course');
    });
    filterRecipes();
  });
  document.querySelector('#course .items').appendChild(box);
});

// Toggle ingredient
function toggleIngredient(ingredient, box=null){
  ingredient = ingredient.toLowerCase().trim();
  if(selectedIngredients.includes(ingredient)){
    selectedIngredients = selectedIngredients.filter(i => i!==ingredient);
    // Remove selected class from left panel boxes
    document.querySelectorAll('.item-box').forEach(b => {
      if(b.textContent.toLowerCase()===ingredient) b.classList.remove('selected');
    });
    // Also remove class from passed box if any
    if(box) box.classList.remove('selected');
  } else {
    selectedIngredients.push(ingredient);
    // Add selected class to left panel boxes
    document.querySelectorAll('.item-box').forEach(b => {
      if(b.textContent.toLowerCase()===ingredient) b.classList.add('selected');
    });
    if(box) box.classList.add('selected');
  }
  updateSelectedIngredients();
  filterRecipes();
}


// Update selected ingredients div
function updateSelectedIngredients(){
  ingredientCount.textContent = selectedIngredients.length;
  selectedIngredientsDiv.innerHTML = '';
  selectedIngredients.forEach(i => {
    let div = document.createElement('div');
    div.classList.add('selected-ingredient');
    div.textContent = i;
    let span = document.createElement('span');
    span.textContent = '×';
    div.appendChild(span);
    div.addEventListener('click', ()=>{ toggleIngredient(i); });
    selectedIngredientsDiv.appendChild(div);
  });
}

// Scroll to top smoothly
function scrollRecipesToTop(){ container.scrollTop = 0; }

// Filter recipes
function filterRecipes(){
  if(selectedIngredients.length === 0 && !selectedDiet && !selectedCourse){
      recipeGrid.innerHTML = '<p id="startMessage">Enter your ingredients to get started</p>';
      recipeGrid.classList.add('empty');
      loadMoreBtn.style.display = 'none';
      spinner.style.display = 'none';
      scrollRecipesToTop();
      return;
  }

  spinner.style.display = 'block';
  recipeGrid.innerHTML = '';
  recipeGrid.classList.remove('empty');
  loadMoreBtn.style.display = 'none';
  scrollRecipesToTop();

  setTimeout(() => {
      filteredRecipes = allRecipes.filter(r=>{
          let ingCheck = selectedIngredients.length===0 || selectedIngredients.every(si => r.ingredients.some(ri=>ri.includes(si)));

          let dietCheck = true;
          if(selectedDiet){
              let dietNormalized = r.diet.toLowerCase();
              if(selectedDiet==='Vegetarian'){
                  dietCheck = dietNormalized.includes('vegetarian') && !dietNormalized.includes('non');
              } else if(selectedDiet==='Non Vegetarian'){
                  dietCheck = dietNormalized.includes('non vegetarian') || dietNormalized.includes('nonvegetarian') || dietNormalized.includes('eggetarian');
              }
          }

          let courseCheck = true;
          if(selectedCourse){
              let courseLower = r.courseLower;
              if(selectedCourse==='Breakfast') courseCheck = courseLower.includes('breakfast');
              else if(selectedCourse==='Lunch') courseCheck = courseLower.includes('lunch');
              else if(selectedCourse==='Dinner') courseCheck = courseLower.includes('dinner');
              else if(selectedCourse==='Dessert') courseCheck = courseLower.includes('dessert');
          }

          return ingCheck && dietCheck && courseCheck;
      });

      spinner.style.display = 'none';
      currentIndex = 0;
      recipeGrid.innerHTML = '';

      if(filteredRecipes.length === 0){
          recipeGrid.innerHTML = '<p id="startMessage">No such recipes found</p>';
          recipeGrid.classList.add('empty');
          loadMoreBtn.style.display = 'none';
          scrollRecipesToTop();
      } else {
          recipeGrid.classList.remove('empty');
          displayRecipes();
      }
  }, 600);
}

// Display recipes with favorite icon
function displayRecipes(){
  const recipesToShow = filteredRecipes.slice(currentIndex, currentIndex+batchSize);
  recipesToShow.forEach(r=>{
    let card = document.createElement('div');
    card.classList.add('recipe-card');

    

    card.innerHTML = `
      <img src="${r.image}" alt="">
      <h3>${r.name}</h3>
      <p>Ready in ${r.prep_time.replace(/Total in /i,'')}</p>
    `;

    

    // Open modal
    card.addEventListener('click', ()=>fetchRecipe(r.id));

    recipeGrid.appendChild(card);
  });
  currentIndex += recipesToShow.length;
  if(spinner.style.display==='none'){
      loadMoreBtn.style.display = (currentIndex < filteredRecipes.length) ? 'block' : 'none';
  }
}

// Load More
loadMoreBtn.addEventListener('click', displayRecipes);
function fetchRecipe(id) {
    fetch(`https://dishcovery-backend-tprd.onrender.com/api/recipes/${id}`)
        .then(res => res.json())
        .then(recipe => {

            recipe.image = recipe.image || '';

            openModal(recipe);
        })
        .catch(console.error);
}
// Modal
function openModal(recipe){
  modalName.textContent = recipe.name;
  modalImage.src = recipe.image;
  modalDescription.textContent = recipe.description || '';
  modalIngredients.innerHTML='';
  modalSteps.innerHTML='';
  recipe.ingredients.forEach(i=>{
    let li = document.createElement('li'); li.textContent=i; modalIngredients.appendChild(li);
  });
  recipe.steps.forEach(s=>{
    let li = document.createElement('li'); li.textContent=s; modalSteps.appendChild(li);
  });
  modal.style.display='flex';
}
closeModal.addEventListener('click', ()=>{ modal.style.display='none'; });
window.addEventListener('click', e=>{ if(e.target===modal) modal.style.display='none'; });

// Ingredient search
ingredientSearch.addEventListener('keypress', e=>{
  if(e.key==='Enter'){
    let val = ingredientSearch.value.toLowerCase().trim();
    if(val && !selectedIngredients.includes(val)){ toggleIngredient(val); ingredientSearch.value=''; }
  }
});

// Recipe search
recipeSearch.addEventListener('keypress', e=>{
  if(e.key==='Enter'){
    let val = recipeSearch.value.toLowerCase().trim();
    if(val){
      filteredRecipes = allRecipes.filter(r => r.nameLower.includes(val));
      currentIndex=0; recipeGrid.innerHTML=''; spinner.style.display='block'; loadMoreBtn.style.display='none';
      setTimeout(()=>{
        spinner.style.display='none';
        if(filteredRecipes.length===0){ recipeGrid.innerHTML='<p id="startMessage">No such recipes found</p>'; recipeGrid.classList.add('empty'); }
        else{ recipeGrid.classList.remove('empty'); displayRecipes(); }
      },600);
      recipeSearch.value=''; scrollRecipesToTop();
    }
  }
});
