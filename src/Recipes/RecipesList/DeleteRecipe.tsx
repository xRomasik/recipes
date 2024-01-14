import { useState } from "react";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export const DeleteRecipe = (props: { onConfirm: () => void }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleConfirm = () => {
    props.onConfirm();
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <DeleteIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Opravdu chcete odstranit recept?</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Ne
          </Button>
          <Button onClick={handleConfirm} color="inherit">
            Ano
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
