import { useState } from "react";
import FirebaseAuthService from "./FirebaseAuthService";
import FirebaseFireStoreService from "./FirebaseFireStoreService";
import LoginForm from "./components/LoginForm";
import AddEditRecipeForm from "./components/AddEditRecipeForm";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  FirebaseAuthService.subscribeToAuthChanges(setUser);

  async function handleAddRecipe(newRecipe) {
    try {
      const response = await FirebaseFireStoreService.createDocument(
        "recipes",
        newRecipe
      );
      //todo fetch  new recipes from firestore
      alert(`successfully creared a recipe with an ID ${response.id}}`);
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="App">
      <div className="title-row">
        <h1 className="title">Firebase Recipes</h1>
        <LoginForm existingUser={user}></LoginForm>
      </div>
      <AddEditRecipeForm handleAddRecipe={handleAddRecipe} />
    </div>
  );
}

export default App;
