import { Drawer, IconButton, Box } from "@mui/material";
import { useState } from "react";
// import KitchenIcon from "@mui/icons-material/Kitchen";
import MenuIcon from "@mui/icons-material/Menu";
import { NewRecipe } from "../Recipes/NewRecipe/NewRecipe";
import { Ingredient } from "../data/ingredients";
import { NewIngredient } from "../Recipes/NewIngredient/NewIngredient";
import { RecipeWithDocId } from "../data/recipes";

export const Sidebar = (props: {
  ingredients: Ingredient[];
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  setRecipes: React.Dispatch<React.SetStateAction<RecipeWithDocId[]>>;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 2 }}
        onClick={() => setIsOpen(true)}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor={"left"}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: "25%" },
        }}
      >
        <Box>
          <NewRecipe
            ingredients={props.ingredients}
            setRecipes={props.setRecipes}
          />
          <NewIngredient
            ingredients={props.ingredients}
            setIngredients={props.setIngredients}
          />
        </Box>
      </Drawer>
    </>
  );
};
