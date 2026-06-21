const recipeGrid = document.getElementById('recipeGrid');

// Load favorites from localStorage
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

// Display favorites
function displayFavorites() {
    recipeGrid.innerHTML = '';

    if (favorites.length === 0) {
        recipeGrid.innerHTML = `<p class="placeholder">No favorites yet!</p>`;
        return;
    }

    favorites.forEach(r => {
        let card = document.createElement('div');
        card.classList.add('recipe-card');

        // Fix image path for ingredient-search or regional-dishes
        let imgSrc = r.image || '';
        if (imgSrc && !imgSrc.startsWith('../ingredient-search/') && !imgSrc.startsWith('http')) {
            imgSrc = '../ingredient-search/static/' + imgSrc.replace(/^static\//, '');
        }

        const isFavorited = favorites.some(f => f.name === r.name);

        card.innerHTML = `
            <div class="card-img-wrapper">
                <img src="${imgSrc}" alt="${r.name}">
                <span class="favorite-icon ${isFavorited ? 'favorited' : ''}">&#10084;</span>
            </div>
            <h3>${r.name}</h3>
            <p>${r.prep_time || ''}</p>
        `;

        const heart = card.querySelector('.favorite-icon');
        heart.addEventListener('click', e => {
            e.stopPropagation();
            toggleFavorite(r);
        });

        recipeGrid.appendChild(card);
    });
}

// Toggle favorite
function toggleFavorite(recipe) {
    const index = favorites.findIndex(f => f.name === recipe.name);
    if (index > -1) favorites.splice(index, 1);

    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
}

// Initial render
displayFavorites();
