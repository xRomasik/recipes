import { useState } from "react";
import { RecipesList } from "./Recipes/RecipesList/RecipeList";
import { RecipesSearchBar } from "./Recipes/RecipesSearchBar/RecipesSearchBar";
import { Ingredients } from "./data/ingredients";

export type Option = {
  value: Ingredients;
  label: string;
};

function App() {
  const [selected, setSelected] = useState<Option[]>([]);

  return (
    <>
      <h2
        style={{
          textAlign: "center",
          color: "#202106"
        }}
      >
        Recepty
      </h2>
      <RecipesSearchBar selected={selected} setSelected={setSelected} />
      <RecipesList selected={selected} />
    </>
  );
}

export default App;
