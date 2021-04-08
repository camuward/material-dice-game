import { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CreateRoundedIcon from "@material-ui/icons/Create";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Divider from "@material-ui/core/Divider";
import GamesRoundedIcon from "@material-ui/icons/GamesRounded";
import InfoDialog from "./InfoDialog";
import Typography from "@material-ui/core/Typography";

const nameRegexLength = /^.{3,22}$/;
const nameRegexValidChars = /^\S[\S ]{0,20}\S$/;
const nameRegexReserved = /^[Cc][Pp][Uu].{0,}/;

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  control: {
    flexGrow: 0,
    padding: theme.spacing(2),
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  entry: {
    margin: theme.spacing(2),
  },
  paper: {
    width: "100%",
  },
  paperGrid: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  }
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function nameValidateLength(name) {
  return nameRegexLength.test(name);
}
function nameValidateNotReserved(name) {
  // return true;
  return !nameRegexReserved.test(name);
}
function nameValidateValidChars(name) {
  return nameRegexValidChars.test(name);
}
function nameValidateUnique(name, arr) {
  return arr.every(i => i.name !== name);
}
function nameValidateAll(name, arr) {
  return (
    nameValidateLength(name) &&
    nameValidateValidChars(name) &&
    nameValidateNotReserved(name) &&
    nameValidateUnique(name, arr)
  );
}

function withPlayer(player, arr) {
  return [...arr, player];
}
function newPlayer(name, isCpu) {
  return { name: name, score: 0, hand: 0, inRound: true, cpu: isCpu };
}

function NameEntry({ list, onSubmit, onStart }) {
  const [valid, setValid] = useState(true);
  const [reason, setReason] = useState("");
  const [errorReasons, setErrorReasons] = useState([]);
  const [value, setValue] = useState("");

  const styles = useStyles();

  function handleEntryChange(event) {
    const name = event.target.value;
    setValue(name);
    if (!nameValidateLength(name)) {
      setReason("Must be within 3-22 characters.");
      setValid(false);
      return;
    }
    if (!nameValidateValidChars(name) || !nameValidateNotReserved(name)) {
      setReason("Invalid entry.");
      setValid(false);
      return;
    }
    if (!nameValidateUnique(name, list)) {
      setReason("Another player has this name.");
      setValid(false);
      return;
    }
    setReason("");
    setValid(true);
  }

  function handleAddPlayer(event) {
    event.preventDefault();
    const name = value;
    if (nameValidateAll(name, list)) {
      onSubmit(name, false);
      setValue("");
      setReason("");
      setValid(true);
    } else {
      setValue(name);
      if (!nameValidateLength(name)) {
        setReason("Must be within 3-22 characters.");
        handleError("The entry is not within the specified length.");
        setValid(false);
        return;
      }
      if (!nameValidateValidChars(name) || !nameValidateNotReserved(name)) {
        setReason("Invalid entry.");
        handleError("The entry is invalid.");
        setValid(false);
        return;
      }
      if (!nameValidateUnique(name, list)) {
        setReason("Another player has this name.");
        handleError("Another player has this name.");
        setValid(false);
        return;
      }
    }
  }

  function handleStartGame() {
    onStart();
  }

  function handleErrorClose(id) {
    const newErrorReasons = errorReasons.filter(err => err.id !== id);
    setErrorReasons(newErrorReasons.map((err, index) => (err.id = index)));
  }

  function handleError(message) {
    const newErrorReasons = [
      ...errorReasons,
      { message: message, id: errorReasons.length },
    ];
    setErrorReasons(newErrorReasons);
  }

  function handleAddCpu() {
    const index = list.filter(player => player.cpu).length + 1;
    onSubmit(`cpu${index}`, index);
  }

  return (
    <form noValidate autoComplete="off" onSubmit={handleAddPlayer}>
      <Grid
        container
        direction="row"
        spacing={2}
        justify="center"
        alignItems="center"
      >
        <Grid item>
          <TextField
            value={value}
            label="Player"
            size="small"
            onChange={event => handleEntryChange(event)}
            error={!valid}
            helperText={valid ? "" : reason}
          />
        </Grid>
        <Grid item>
          <Button
            disableElevation
            variant="contained"
            color="secondary"
            type="submit"
            endIcon={<CreateRoundedIcon />}
          >
            Add
          </Button>
        </Grid>

        <Grid item>
          <Button onClick={handleAddCpu}>Add CPU</Button>
        </Grid>
        <Grid item>
          <Divider className={styles.divider} orientation="vertical" />
        </Grid>
        <Grid item>
          <Button
            onClick={handleStartGame}
            startIcon={<GamesRoundedIcon />}
            variant="contained"
            color="primary"
            disableElevation
            disabled={list.length < 2}
          >
            Play
          </Button>
        </Grid>
        <Grid item>
          <InfoDialog />
        </Grid>
        {errorReasons.map(err => (
          <Snackbar
            open
            key={err.id}
            autoHideDuration={5000}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            onClose={() => handleErrorClose(err.id)}
          >
            <Alert onClose={() => handleErrorClose(err.id)} severity="error">
              {err.message}
            </Alert>
          </Snackbar>
        ))}
      </Grid>
    </form>
  );
}

function PlayerPreview({ onDelete, children, ...props }) {
  const styles = useStyles();

  return (
    // <Grow in>
    <Grid item className={styles.paper} xs={12} sm={8} md={6} lg={4}>
      <Paper {...props}>
        <Grid container justify="space-between" alignItems="center" className={styles.paperGrid}>
          <Grid item><Typography variant="h5">{children}</Typography></Grid>
          <Grid item>
            <IconButton
              aria-label={`delete player ${children}`}
              onClick={onDelete}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
    // </Grow>
  );
}

export default function PlayerSetup({ onBeginGame }) {
  const styles = useStyles();
  const [players, setPlayers] = useState([]);

  function handleAddPlayer(name, isCpu) {
    setPlayers(withPlayer(newPlayer(name, isCpu), players));
  }

  function handleRemovePlayer(name) {
    const newPlayers = players.filter(player => player.name !== name);
    let i = 0;
    setPlayers(
      newPlayers.map((player, index) =>
        nameValidateNotReserved(player.name)
          ? { ...player }
          : { ...player, name: `cpu${++i}` }
      )
    );
  }

  function handleStartGame() {
    onBeginGame(players);
  }

  return (
    <div className={styles.root}>
      <Grid container direction="column" justify="center" spacing={4}>
        <Grid item className={styles.entry}>
          <NameEntry
            list={players}
            onSubmit={handleAddPlayer}
            onStart={handleStartGame}
          />
        </Grid>
        <Grid item>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            spacing={2}
          >
            {players.map((player, i) => (
              <PlayerPreview
                onDelete={() => handleRemovePlayer(player.name)}
                key={player.name}
              >
                {player.name}
              </PlayerPreview>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
