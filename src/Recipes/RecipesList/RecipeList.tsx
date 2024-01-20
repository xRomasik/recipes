import { Box, Chip, Collapse, IconButton, Link } from "@mui/material";
import { RecipeWithDocId } from "../../data/recipes";
import { Option } from "../../App";
import YouTubeIcon from "@mui/icons-material/YouTube";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { DeleteRecipe } from "./DeleteRecipe";
import { deleteRecipe } from "../../firebase/firebaseConfig";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";

export const RecipesList = (props: {
  selected: Option[];
  recipes: RecipeWithDocId[];
  setRecipes: React.Dispatch<React.SetStateAction<RecipeWithDocId[]>>;
}) => {
  const { selected } = props;

  const sortedRecipes = [...props.recipes].sort((recipeA, recipeB) => {
    if (!selected.length) {
      return 0;
    }

    const recipeAIncludesIngredient = selected.reduce(
      (previous, currentSearchTerm) => {
        if (recipeA.ingredients.includes(currentSearchTerm.label)) {
          return previous + 1;
        }

        return previous;
      },
      0
    );

    const recipeBIncludesIngredient = selected.reduce(
      (previous, currentSearchTerm) => {
        if (recipeB.ingredients.includes(currentSearchTerm.label)) {
          return previous + 1;
        }

        return previous;
      },
      0
    );

    return recipeBIncludesIngredient - recipeAIncludesIngredient;
  });

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {sortedRecipes.map((recipe) => {
        return (
          <RecipeTile
            key={recipe.name}
            recipe={recipe}
            selected={selected}
            setRecipes={props.setRecipes}
          />
        );
      })}
    </div>
  );
};

const RecipeTile = (props: {
  recipe: RecipeWithDocId;
  selected: Option[];
  setRecipes: React.Dispatch<React.SetStateAction<RecipeWithDocId[]>>;
}) => {
  const {
    recipe: { ingredients },
    recipe,
    selected,
  } = props;

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const availableIngredients: string[] = [];
  const unavailableIngredients: string[] = [];

  ingredients.forEach((ingredient) => {
    if (selected.map((selection) => selection.label).includes(ingredient)) {
      availableIngredients.push(ingredient);
    } else {
      unavailableIngredients.push(ingredient);
    }
  });

  return (
    <div
      className="recipes_stack"
      style={{
        width: "14em",
        padding: "10px",
        backgroundColor: "rgba(207, 215, 45, 0.10)",
        borderRadius: "10px",
        margin: "5px 10px",
        position: "relative",
      }}
    >
      <RecipeHeader
        expanded={expanded}
        handleExpandClick={handleExpandClick}
        recipe={recipe}
        totalIngredients={ingredients.length}
        availableIngredients={availableIngredients.length}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <div>
          {availableIngredients.map((ingredient) => (
            <Chip
              key={ingredient}
              label={ingredient}
              color="success"
              sx={{
                mr: "5px",
                mt: "4px",
                color: "black",
                backgroundColor: "rgb(170, 235, 148)",
              }}
            />
          ))}
          {unavailableIngredients.map((ingredient) => (
            <Chip
              key={ingredient}
              label={ingredient}
              sx={{ mr: "5px", mt: "4px", color: "rgb(32, 33, 6)" }}
            />
          ))}
        </div>
      </Collapse>
      <DeleteRecipe
        expanded={expanded}
        onConfirm={() => {
          deleteRecipe(props.recipe.docId, props.setRecipes);
        }}
      />
    </div>
  );
};

const RecipeHeader = (props: {
  handleExpandClick: () => void;
  expanded: boolean;
  recipe: RecipeWithDocId;
  totalIngredients: number;
  availableIngredients: number;
}) => {
  const {
    handleExpandClick,
    expanded,
    recipe: { name, complexity, url },
    totalIngredients,
    availableIngredients,
  } = props;

  const isMoreThanHalf = availableIngredients / totalIngredients  >= 0.5;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: expanded ? "10px" : "0px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <IconButton
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
          sx={{
            padding: 0,
            pr: 1,
            transform: !expanded ? "rotate(0deg)" : "rotate(180deg)",
            marginLeft: !expanded ? undefined : "-8px",
            marginRight: !expanded ? undefined : "8px",
          }}
        >
          <ExpandMoreIcon />
        </IconButton>
        <div className="recipe-name">
          <h4
            style={{
              textJustify: "inter-character",
              paddingRight: "10px",
              margin: 0,
            }}
          >
            {name}
          </h4>
        </div>

        {url.length > 0 ? (
          <Link href={url[0]} target="_blank" rel="noopener">
            <YouTubeIcon
              sx={{
                marginTop: "2px",
              }}
              color="error"
            />
          </Link>
        ) : null}
      </Box>
      {complexity && expanded ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {complexity}
          <AccessTimeIcon sx={{ ml: "4px" }} />
        </div>
      ) : null}

      {!expanded ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "14px",
            marginTop: "-15px",
            color: isMoreThanHalf ? "rgb(47 169 5)" : "red",
            fontWeight: "bold"
          }}
        >
          {`${availableIngredients}/${totalIngredients}`}
        </Box>
      ) : null}
    </Box>
  );
};
