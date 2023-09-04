import { useEffect, useState, startTransition } from "react";
import FirebaseAuthService from "./FirebaseAuthService";
import FirebaseFireStoreService from "./FirebaseFireStoreService";
import LoginForm from "./components/LoginForm";
import AddEditRecipeForm from "./components/AddEditRecipeForm";
import "./App.css";
// import { orderBy, docs, map } from "firebase/firestore";

function App() {
  const [user, setUser] = useState(null);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [orderBy, setOrderBy] = useState("publishDateDesc");
  const [recipesPerPage, setRecipesPerPage] = useState(3);
  const [recipesCount, setRecipesCount] = useState(0);
  useEffect(() => {
    setIsloading(true);
    FirebaseFireStoreService.getDocumentCount("recipes").then(setRecipesCount);
    fetchRecipes()
      .then((fetchedRecipes) => {
        setRecipes(fetchedRecipes);
      })
      .catch((error) => {
        console.error(error.message);
        throw error;
      })
      .finally(() => {
        setIsloading(false);
      });
  }, [user, categoryFilter, orderBy, recipesPerPage]);

  FirebaseAuthService.subscribeToAuthChanges(setUser);

  async function fetchRecipes(cursorId = "") {
    const queries = [];
    if (categoryFilter) {
      queries.push({
        field: "category",
        condition: "==",
        value: categoryFilter,
      });
    }
    if (!user) {
      queries.push({
        field: "isPublished",
        condition: "==",
        value: true,
      });
    }
    let fetchedRecipes = [];
    const orderByField = "publishDate";
    let orderByDirection;

    if (orderBy) {
      switch (orderBy) {
        case "publishDateAsc":
          orderByDirection = "asc";
          break;
        case "publishDateDesc":
          orderByDirection = "desc";
          break;
        default:
          break;
      }
    }
    try {
      const response = await FirebaseFireStoreService.readDocuments({
        collection: "recipes",
        queries: queries,
        orderByField: orderByField,
        orderByDirection: orderByDirection,
        perPage: recipesPerPage,
        cursorId: cursorId,
      });

      let newRecipes = response.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (cursorId) {
        let fetchedRecipes = [...recipes, ...newRecipes];

        return fetchedRecipes;
      } else {
        let fetchedRecipes = response.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        return fetchedRecipes;
      }

      return newRecipes;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  function handleRecipesPerPageChange(event) {
    const recipesPerPage = event.target.value;

    startTransition(() => {
      setRecipes([]);
      setRecipesPerPage(recipesPerPage);
    });
  }
  function handleLoadMoreRecipesClick() {
    const lastRecipe = recipes[recipes.length - 1];
    const cursorId = lastRecipe.id;

    handleFetchRecipes(cursorId);
  }
  async function handleFetchRecipes(cursorId = "") {
    try {
      const fetchedRecipes = await fetchRecipes(cursorId);

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

  async function handleUpdateRecipe(newRecipe, recipeId) {
    try {
      await FirebaseFireStoreService.updateDocument(
        "recipes",
        recipeId,
        newRecipe
      );
      handleFetchRecipes();

      alert(`successfully updated a recipe with an ID = ${recipeId}}`);
      startTransition(() => {
        setCurrentRecipe(null);
      });
    } catch (error) {
      alert(error.message);
      throw error;
    }
  }

  async function handleDeleteRecipe(recipeId) {
    const deleteConfirmation = window.confirm(
      `Are you sure you want to delete this recipe? Ok for Yes. Cancel for No.`
    );
    if (deleteConfirmation) {
      try {
        FirebaseFireStoreService.deleteDocument("recipes", recipeId);
        handleFetchRecipes();
        startTransition(() => {
          setCurrentRecipe(null);
        });
        window.scrollTo(0, 0);
        alert(`Successfully deleted a recipe with an ID = ${recipeId}`);
      } catch (error) {
        console.log(error.message);
        alert(error.message);
        throw error;
      }
    }
  }

  function handleEditRecipeClick(recipeId) {
    let selectedRecipe = recipes.find((recipe) => {
      return recipe.id === recipeId;
    });

    if (selectedRecipe) {
      startTransition(() => {
        setCurrentRecipe(selectedRecipe);
      });

      window.scrollTo(0, document.body.scrollHeight);
    }
  }

  function handleEditRecipeCancel() {
    startTransition(() => {
      setCurrentRecipe(null);
    });
    window.scrollTo(0, 0);
  }

  function lookupCategoryLabel(categoryKey) {
    const categories = {
      breadsSanwhichsAndPizza: "Breads, Sandwhiches, & Pizza",
      eggsAndBreakfast: "Eggs & Breakfast",
      dessertsAndBakedGoods: "Deserts & Baked Goods",
      fishAndSeafood: "Seafood",
      vegtables: "Vegtables",
    };
    const label = categories[categoryKey];
    return label;
  }

  function formatDate(date) {
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
    const dateString = `${month}-${day}-${year}`;
    return dateString;
  }
  return (
    <div className="App">
      <div className="title-row">
        <h1 className="title">Firebase Recipes</h1>
        <LoginForm existingUser={user}></LoginForm>
      </div>

      <div className="main">
        <div className="row filters">
          {" "}
          <label className="recipe-label input-label">
            Category:
            <select
              value={categoryFilter}
              onChange={(e) => {
                startTransition(() => {
                  setCategoryFilter(e.target.value);
                });
              }}
              required
              className="select"
            >
              <option value=""></option>
              <option value="breadsSanwhichsAndPizza">
                Breads, Sandwhiches, & Pizza
              </option>
              <option value="eggsAndBreakfast">Eggs & Breakfast</option>

              <option value="dessertsAndBakedGoods">
                Deserts & Baked Goods
              </option>
              <option value="fishAndSeafood">Fish & Seafood</option>

              <option value="vegtables">Vegtables</option>
            </select>
          </label>
          <label className="input-label">
            <select
              className="select"
              value={orderBy}
              onChange={(e) =>
                startTransition(() => {
                  setOrderBy(e.target.value);
                })
              }
            >
              <option value="publishDateDesc">
                Publish Date (newest to oldest)
              </option>
              <option value="publishDateAsc">
                Publish Date (oldest to newest)
              </option>
            </select>
          </label>
        </div>
        <div className="center">
          <div className="recipe-list-box">
            {isLoading ? (
              <div className="fire">
                <div className="flames">
                  <div className="flame"></div>
                  <div className="flame"></div>
                  <div className="flame"></div>
                  <div className="flame"></div>
                </div>
                <div className="logs"></div>
              </div>
            ) : null}
            {!isLoading && recipes && recipes.length === 0 ? (
              <h5 className="no-recipes">No Recipes Found</h5>
            ) : null}
            {!isLoading && recipes && recipes.length > 0 ? (
              <div className="recipe-list">
                {recipes.map((recipe) => (
                  <div className="recipe-card" key={recipe.id}>
                    {recipe.isPublished === false ? (
                      <div className="unpublished">UNPUBLISHED</div>
                    ) : null}
                    <div className="recipe-name">{recipe.name}</div>
                    <div className="recipe-field">
                      Category: {lookupCategoryLabel(recipe.category)}
                    </div>

                    <div className="recipe-field">
                      Publish Date: {formatDate(recipe.publishDate.toDate())}
                    </div>

                    {user ? (
                      <button
                        type="button"
                        onClick={() => handleEditRecipeClick(recipe.id)}
                        className="primary-button edit-button"
                      >
                        EDIT
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {isLoading || (recipes && recipes.length > 0) ? (
          <>
            <label className="input-label">
              Recipes Per Page:
              <select
                value={recipesPerPage}
                onChange={handleRecipesPerPageChange}
                className="select"
              >
                <option value="3">3</option>
                <option value="6">6</option>
                <option value="9">9</option>
              </select>
            </label>
          </>
        ) : null}

        {recipesCount > recipes.length ? (
          <>
            <label className="input-label">
              <div className="pagination">
                <button
                  className="primary-button"
                  onClick={handleLoadMoreRecipesClick}
                  type="button"
                >
                  LOAD MORE RECIPES
                </button>
              </div>
            </label>
          </>
        ) : null}
        {user ? (
          <AddEditRecipeForm
            existingRecipe={currentRecipe}
            handleAddRecipe={handleAddRecipe}
            handleUpdateRecipe={handleUpdateRecipe}
            handleDeleteRecipe={handleDeleteRecipe}
            handleEditRecipeCancel={handleEditRecipeCancel}
          />
        ) : null}
      </div>
    </div>
  );
}

export default App;
