import { recipes } from "../../data/recipes";
import { unique } from "../../helpers/unique";
import { MultiSelect } from "react-multi-select-component";
import { Option } from "../../App";
import { Box } from "@mui/material";

export const RecipesSearchBar = (props: {
  selected: Option[];
  setSelected: React.Dispatch<React.SetStateAction<Option[]>>;
}) => {
  const options: {
    value: string;
    label: string;
  }[] = recipes
    .flatMap((recipe) => recipe.ingredients)
    .filter(unique)
    .map((ingredient) => {
      return {
        label: ingredient,
        value: ingredient,
      };
    });

    console.log(options)

  return (
    <Box
      sx={{
        width: "50%",
        paddingBottom: "10px"
      }}
    >
      <MultiSelect
        hasSelectAll={false}
        labelledBy="label"
        value={props.selected}
        onChange={props.setSelected}
        options={options}
      />
    </Box>
  );
};
