import { useEffect, useState } from "react";
import FirebaseAuthService from "./FirebaseAuthService";
import FirebaseFireStoreService from "./FirebaseFireStoreService";
import LoginForm from "./components/LoginForm";
import AddEditRecipeForm from "./components/AddEditRecipeForm";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetchRecipes()
      .then((fetchedRecipes) => {
        setRecipes(fetchedRecipes);
      })
      .catch((error) => {
        console.error(error.message);
        throw error;
      })
  }, [user]);

  FirebaseAuthService.subscribeToAuthChanges(setUser);

  async function fetchRecipes() {
  
    
    try {
      const response = await FirebaseFireStoreService.readDocuments("recipes");
      let fetchedRecipes = response;
      return fetchedRecipes;
    
    } catch (error) {
      console.error(error.message);
      throw error;
    }
   
  }

  
  async function handleFetchRecipes() {
    try {
      const fetchedRecipes = await fetchRecipes();

      setRecipes(fetchedRecipes);
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  async function handleAddRecipe(newRecipe) {
    if (user === null) {
      alert(`Not Authorized Please login to add a recipe`);
      return;
    }
    try {
      const response = await FirebaseFireStoreService.createDocument(
        "recipes",
        newRecipe
      );

      handleFetchRecipes();
    
      alert(`successfully creared a recipe with an ID ${response.id}}`);
    } catch (error) {
      alert(error.message);
    }
  }


function lookupCategoryLabel(categoryKey) {
const categories={
  breadsSanwhichsAndPizza:"Breads, Sandwhiches, & Pizza",
eggsAndBreakfast:"Eggs & Breakfast",
dessertsAndBakedGoods:"Deserts & Baked Goods",
fishAndSeafood:"Seafood",
vegtables:" Vegtables",
}

return categories[categoryKey];
}
  return (
    <div className="App">
      <div className="title-row">
        <h1 className="title">Firebase Recipes</h1>
        <LoginForm existingUser={user}></LoginForm>
      </div>

      <div className="main">
      <div className="center">
  <div className="recipe-list-box">
    {
      recipes && recipes.length > 0 ? (
        <div className="recipe-list">
          {
            recipes.map((recipe) => (
              <div className="recipe-card" key={recipe.id}>
                <div className="recipe-name">{recipe.name}</div>
                <div className="recipe-field">Category: {lookupCategoryLabel(recipe.category)}</div>
                {<div className="recipe-field">Publish Date: {recipe.toString() ? new Date(recipe.publishDate.seconds * 1000).toLocaleString('en-US', { timeZone: 'America/Denver', weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' }) : 'N/A'}</div>}
                </div>
            ))
          }
        </div>
      ) : <p>No recipes available</p>
    }
  </div>
</div>
{user ? <AddEditRecipeForm handleAddRecipe={handleAddRecipe} /> : null}

      </div>
    </div>
  );
}

export default App;
