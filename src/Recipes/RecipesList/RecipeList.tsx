import { Box, Chip, Link } from "@mui/material";
import { RecipeWithDocId } from "../../data/recipes";
import { Option } from "../../App";
import YouTubeIcon from "@mui/icons-material/YouTube";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { DeleteRecipe } from "./DeleteRecipe";
import { deleteRecipe } from "../../firebase/firebaseConfig";

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
          <RecipeTile key={recipe.name} recipe={recipe} selected={selected} setRecipes={props.setRecipes} />
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
    recipe: { ingredients, name, complexity, url },
    selected,
  } = props;

  return (
    <div
      style={{
        width: "14em",
        padding: "15px",
        backgroundColor: "rgba(207, 215, 45, 0.10)",
        borderRadius: "10px",
        margin: "10px",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          right: "3px",
          bottom: "3px",
        }}
      >
        <DeleteRecipe
          onConfirm={() => {
            deleteRecipe(props.recipe.docId, props.setRecipes);
          }}
        />
      </Box>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "10px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <div className="recipe-name">
            <h3
              style={{
                textAlign: "center",
                paddingRight: "10px",
                margin: 0,
              }}
            >
              {name}
            </h3>
          </div>

          {url.length > 0 ? (
            <Link
              href={url[0]}
              target="_blank"
              rel="noopener"
              sx={{
                marginTop: "-2px",
              }}
            >
              <YouTubeIcon color="error" />
            </Link>
          ) : null}
        </Box>
        {complexity ? (
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
      </div>
      <div>
        {ingredients.map((ingredient) => {
          if (
            selected.map((selection) => selection.label).includes(ingredient)
          ) {
            return (
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
            );
          }
          return (
            <Chip
              key={ingredient}
              label={ingredient}
              sx={{ mr: "5px", mt: "4px", color: "rgb(32, 33, 6)" }}
            />
          );
        })}
      </div>
    </div>
  );
};
