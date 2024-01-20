import { useEffect, useState } from "react";
import { RecipesList } from "./Recipes/RecipesList/RecipeList";
import { RecipesSearchBarWithFridge } from "./Recipes/RecipesSearchBar/RecipesSearchBarWithFridge";
import { Ingredient } from "./data/ingredients";
import { Header } from "./header/header";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { getUserIngredients, getUserRecipes } from "./firebase/firebaseConfig";
import { RecipeWithDocId } from "./data/recipes";
import { Box, Stack } from "@mui/material";

export type Option = {
  value: string;
  label: string;
};

function App() {
  const [selected, setSelected] = useState<Option[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<RecipeWithDocId[]>([]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchData() {
      setIngredients(await getUserIngredients());
      setRecipes(await getUserRecipes());
      // setIngredientsInFridge(await getFridgeIngredients())
    }

    fetchData();
  }, [user]);

  return (
    <>
      <Header
        user={user}
        setUser={setUser}
        ingredients={ingredients}
        setIngredients={setIngredients}
        setRecipes={setRecipes}
      />
      <br />
      <Stack direction="row">
        <Box>
          <Box sx={{ width: "100%" }}>
            <RecipesSearchBarWithFridge
              ingredients={ingredients}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
          <RecipesList
            recipes={recipes}
            selected={selected}
            setRecipes={setRecipes}
          />
        </Box>
      </Stack>
    </>
  );
}

export default App;
