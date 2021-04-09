import { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import HelpRoundedIcon from "@material-ui/icons/HelpRounded";
import Link from "@material-ui/core/Link";

const LightIconButton = withStyles(theme => ({
  root: {
    color: "#bbb",
  },
}))(IconButton);

export default function InfoDialog(props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <LightIconButton onClick={() => setOpen(true)} {...props}>
        <HelpRoundedIcon />
      </LightIconButton>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{"Game Rules"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The computer rolls a six-sided die. The value of each roll is added
            to each player's hand. If the computer rolls a 5, each player's hand
            is reset to zero. A player can choose to leave the table and take
            their earnings by clicking the `leave` button on their name.
          </DialogContentText>
          <DialogContentText>
            Original game designed by John Scarne, 1945.
          </DialogContentText>
          <DialogContentText>
            Programmed by Cameron Ward, 2021.{" "}
            <Link
              href="https://github.com/liquifi/material-dice-game"
              target="_blank"
              rel="noopener"
              color="secondary"
            >
              Source code
            </Link>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
