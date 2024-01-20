import { Drawer, IconButton } from "@mui/material";
import { useState } from "react";
import KitchenIcon from "@mui/icons-material/Kitchen";
import { Ingredient } from "../data/ingredients";
import { Fridge } from "../Recipes/Fridge/Fridge";

export const FridgeSidebar = (props: {
  ingredients: Ingredient[];
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
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
        <KitchenIcon />
      </IconButton>
      <Drawer
        className="drawer_test"
        anchor={"left"}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: "30%" },
        }}
      >
        <Fridge
          ingredients={props.ingredients}
          setIngredients={props.setIngredients}
        />
      </Drawer>
    </>
  );
};
