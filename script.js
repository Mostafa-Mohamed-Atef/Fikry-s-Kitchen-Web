const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const mealList = document.getElementById('mealList');
const modalContainer = document.querySelector('.modal-container');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseButton = document.getElementById('recipeCloseButton');
const showLoadScreen = document.getElementById('loadingScreen');
const hideLoadScreen = document.getElementById('loadingScreen');

function showLoadingScreen(){
    showLoadScreen.style.display = 'block';
}

function hideLoadingScreen(){
    hideLoadScreen.style.display = 'none';
}


searchButton.addEventListener('click',async() => {
    const inp = searchInput.value; 
    if(inp){
        const meals = await searchMeals(inp); 
        displayMeals(meals);
    }
});

mealList.addEventListener('click', async (e) => {
    const card = e.target.closest('.meal-item');
    if (card) {
        const mealId = card.dataset.id;
        const meal = await getMealDetails(mealId);
        if (meal) {
            showMealDetailsPopup(meal);
        }
    }
});
async function searchMeals(inp){
    try{
        showLoadingScreen();
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${inp}`);
        const data = await res.json();
        hideLoadingScreen();
        console.log(' data.meals',  data);
        return data.meals;
    }catch(error){
        console.error('Error fetching data:',error);
        hideLoadingScreen();
    }
}
async function getMealDetails(mealId) {
    try {
        showLoadingScreen();
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const data = await res.json();
        hideLoadingScreen();
        return data.meals[0];
    } catch (error) {
        hideLoadingScreen();
        console.error('Error fetching meal details:');
    }
}

function displayMeals(meals){
    mealList.innerHTML = '';
    if(meals){
        meals.forEach((meal)=>{
            const mealItem = document.createElement('div');
            mealItem.classList.add('meal-item');
            mealItem.dataset.id = meal.idMeal;
            mealItem.innerHTML = `<img src="${meal.strMealThumb}" alt="${meal.strMeal}"> <h3>${meal.strMeal}</h3>`;
            mealList.appendChild(mealItem);
        })
    }
    else{
        mealList.innerHTML = `<p>No meals found</p>`;
    }
}

function showMealDetailsPopup(meal) {
    mealDetailsContent.innerHTML = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class="recipe-img">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        </div>
        <div class="recipe-video">
            <a href="${meal.strYoutube}" target="_blank">Video Tutorial</a>
        </div>
    `;
    modalContainer.style.display = 'block';
}

recipeCloseButton.addEventListener('click', closeRecipeModal);

function closeRecipeModal(){
    modalContainer.style.display = 'none';
}

searchInput.addEventListener('keyup', (e)=>{
    if(e.key === 'Enter'){
        performSearch();
    }});

async function performSearch(){
    const inp = searchInput.value.trim();
    if(inp){
        const meals = await searchMeals(inp);
        displayMeals(meals);
    }
}

