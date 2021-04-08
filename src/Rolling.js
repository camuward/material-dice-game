import { useEffect, useState, useRef } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import dieStyle from "./Rolling.module.css";
import { makeStyles } from "@material-ui/core/styles";
import Grow from "@material-ui/core/Grow";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import NavigateNextRoundedIcon from "@material-ui/icons/NavigateNextRounded";
import Typography from "@material-ui/core/Typography";

const imageSources = [...Array(6).keys()].map(i => `/${i}.png`);

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(8),
  },
  paper: {
    width: 100,
    height: 130,
    overflow: "hidden",
    position: "relative",
    transition: "background-color 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
    "& > span": {
      backfaceVisibility: "hidden",
      position: "absolute",
      top: "50%",
      left: "50%",
      fontSize: 80,
      transition: "opacity 0.1s cubic-bezier(0.16, 1, 0.3, 1)",
    },
  },
  paperFive: {
    width: 100,
    height: 150,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#f44336",
    transition: "background-color 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
  },
  roulette: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(2),
  },
  dieControls: {
    display: "block",
    position: "relative",
  },
  playerCard: {
    minWidth: 100,
    position: "relative",
    overflow: "hidden",
  },
  playerCardOut: {
    position: "relative",
    overflow: "hidden",
    minWidth: 100,
    backgroundColor: "#eee",
  },
  playerCardLeave: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.palette.error.main,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: "0%",
    transition:
      "opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), visibility 0s linear 0.3s",
    visibility: "hidden",
  },
  playerCardLeaveShow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.palette.error.main,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: "100%",
    transition: "opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
  },
  handValue: {
    color: "#f00",
  },
  playerScore: {
    marginTop: theme.spacing(2),
    "& > span": {
      marginLeft: theme.spacing(0.5),
      fontWeight: "bold",
    },
  },
  inGoodScore: {
    color: theme.palette.primary.main,
    paddingRight: 3,
    borderRadius: 4,
    backgroundColor: "#000",
  },
  inBadScore: {
    color: "#fff",
    paddingRight: 3,
    borderRadius: 4,
    backgroundColor: "#000",
  },
  outGoodScore: {
    color: "#000",
  },
  outBadScore: {
    color: theme.palette.error.main,
  },
  rouletteText: {
    backfaceVisibility: "hidden",
    color: "#000",
    position: "absolute",
    top: "50%",
    left: "50%",
    fontSize: 80,
    transition: "opacity 0.1s cubic-bezier(0.16, 1, 0.3, 1)",
  }
}));

const Player = ({ player, onLeave, canLeave }) => {
  const [hover, setHover] = useState(false);
  const styles = useStyles();
  return (
    <Card
      className={player.inRound ? styles.playerCard : styles.playerCardOut}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <CardActions>
        <Box>
          <Typography variant="h5" component="h2">
            {player.name}
          </Typography>
          <Typography className={styles.playerScore}>
            {player.score}
            <span
              className={
                player.hand > 0
                  ? player.inRound
                    ? styles.inGoodScore
                    : styles.outGoodScore
                  : player.inRound
                  ? styles.inBadScore
                  : styles.outBadScore
              }
            >
              {` +${player.hand}`}
            </span>
          </Typography>
          <Typography variant="h6" className={styles.playerScoreCombined}>
            {player.score + player.hand} pts
          </Typography>
        </Box>
      </CardActions>
      {!player.cpu && (
        <Box
          className={
            hover && player.inRound && canLeave
              ? styles.playerCardLeaveShow
              : styles.playerCardLeave
          }
        >
          <Button
            color="secondary"
            {...(player.inRound && canLeave ? { onClick: onLeave } : {})}
          >
            LEAVE
          </Button>
        </Box>
      )}
    </Card>
  );
};

const Roulette = ({ onRoll, setBlocking, blocking, mustEnd, onEnd }) => {
  const [roll, setRoll] = useState(4);
  const dice = useRef();
  const styles = useStyles();

  function rollIt() {
    if (blocking) return;
    setBlocking(true);
    const nextRoll = Math.floor(Math.random() * 6) + 1;
    // console.log(nextRoll);
    const displayRolls = Array(20)
      .fill()
      .map((_, i) => ((nextRoll + i) % 6) + 1)
      .reverse();
    displayRolls.forEach((r, i) => setTimeout(() => setRoll(r), 100 * (i + 1)));
    setTimeout(() => {
      setRoll(nextRoll);
      onRoll(nextRoll);
      setBlocking(false);
    }, 100 * 21);
  }

  const fiveRolled = mustEnd || (roll === 5 && !blocking);

  return (
    <Box className={styles.roulette}>
      <Box>
        <Paper
          className={roll === 5 && !blocking ? styles.paperFive : styles.paper}
        >
          <Typography
            variant="h5"
            className={`${styles.rouletteText} ${roll === 1 ? dieStyle.dieRollSelected : dieStyle.dieRoll}`}
          >
            1
          </Typography>
          <Typography
            variant="h5"
            className={`${styles.rouletteText} ${roll === 2 ? dieStyle.dieRollSelected : dieStyle.dieRoll}`}
          >
            2
          </Typography>
          <Typography
            variant="h5"
            className={`${styles.rouletteText} ${roll === 3 ? dieStyle.dieRollSelected : dieStyle.dieRoll}`}
          >
            3
          </Typography>
          <Typography
            variant="h5"
            className={`${styles.rouletteText} ${roll === 4 ? dieStyle.dieRollSelected : dieStyle.dieRoll}`}
          >
            4
          </Typography>
          <Typography
            variant="h5"
            className={`${styles.rouletteText} ${roll === 5 ? dieStyle.dieRollSelected : dieStyle.dieRoll}`}
          >
            5
          </Typography>
          <Typography
            variant="h5"
            className={`${styles.rouletteText} ${roll === 6 ? dieStyle.dieRollSelected : dieStyle.dieRoll}`}
          >
            6
          </Typography>
        </Paper>
      </Box>
      <Box className={styles.dieControls}>
        <Grow in={!blocking}>
          <Button
            onClick={fiveRolled ? onEnd : rollIt}
            variant={fiveRolled ? "outlined" : "contained"}
            color="secondary"
          >
            {fiveRolled ? "End Round" : "Roll"}
          </Button>
        </Grow>
      </Box>
    </Box>
  );
};

export default function Rolling({ list, setList, ...props }) {
  const [round, setRound] = useState(0);
  const [blocking, setBlocking] = useState(false);
  const [, updateNothing] = useState();
  const [roundOver, setRoundOver] = useState(false);
  const [hideRoulette, setHideRoulette] = useState(false);

  const styles = useStyles();

  function handleInit() {
    setList(list.map(p => ({ ...p, inRound: true })));
    setRoundOver(false);
    setHideRoulette(false);
  }

  function handleRoll(r) {
    if (r === 5) {
      const players = list.map(player =>
        player.inRound
          ? {
              ...player,
              hand: 0,
              inRound: false,
            }
          : player
      );
      setList(players);
    } else {
      const players = list.map(player =>
        player.inRound
          ? {
              ...player,
              hand: player.hand + r,
            }
          : player
      );
      const count = list.length;
      setList(
        players.map(p => {
          if (p.inRound && p.cpu) {
            if (
              Math.random() -
                (list.filter(j => !j.inRound).length / count) * 0.2 -
                0.3 * Math.max(0, Math.min(1, round / 8)) -
                Math.pow(Math.min((p.score + p.hand) / 100, 1), 10) * 0.6 <
              0.05
            )
              return { ...p, inRound: false };
          }
          return p;
        })
      );
      setRound(round + 1);
    }
    // cpu logic
  }

  function handlePlayerLeave(name) {
    const players = list;
    const player = players.findIndex(p => p.name === name);
    if (!blocking && players[player].inRound) {
      players[player].inRound = false;
      setList(players);
    }
    updateNothing({});
  }

  function handleEnd() {
    const players = list.map(p => ({
      ...p,
      score: p.score + p.hand,
      hand: 0,
      inRound: false,
    }));
    setList(players);
    setRoundOver(true);
    setHideRoulette(true);
  }

  return (
    <Box className={styles.root}>
      <Grow in>
        {hideRoulette ? (
          <></>
        ) : (
          <Roulette
            onRoll={handleRoll}
            blocking={blocking}
            setBlocking={setBlocking}
            mustEnd={list.every(p => !p.inRound)}
            onEnd={handleEnd}
          />
        )}
      </Grow>
      <Grid container justify="center" alignItems="center" spacing={2}>
        {list.map(player => (
          <Grid item key={player.name}>
            <Player
              player={player}
              onLeave={() => handlePlayerLeave(player.name)}
              canLeave={!blocking}
            />
          </Grid>
        ))}
      </Grid>
      <Grow in={roundOver}>
        <Button
          variant="contained"
          color="primary"
          endIcon={<NavigateNextRoundedIcon />}
          onClick={handleInit}
        >
          Next
        </Button>
      </Grow>
    </Box>
  );
}
