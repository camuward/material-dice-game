import { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider
} from "@material-ui/core/styles";
import PlayerSetup from "./PlayerSetup";
import Rolling from "./Rolling";
import Grow from "@material-ui/core/Grow";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#77ffc5",
      main: "#29ff94",
      dark: "#00ca65",
      contrastText: "#000"
    },
    secondary: {
      light: "#2c2c2c",
      main: "#000",
      dark: "#000",
      contrastText: "#fff"
    }
  }
});

const gameStates = {
  ROLLING: "ROLLING",
  RECAP: "RECAP",
  SETUP: "SETUP",
  ERROR: "ERROR"
};

export default function App() {
  const [gameState, setGameState] = useState(gameStates.SETUP);
  const [players, setPlayers] = useState([]);

  function handleSetupComplete(arr) {
    setPlayers(arr);
    setGameState(gameStates.ROLLING);
  }

  return (
    <ThemeProvider theme={theme}>
      {gameState === gameStates.SETUP && (
        <Grow in>
          <PlayerSetup list={players} onBeginGame={handleSetupComplete} />
        </Grow>
      )}
      {gameState === gameStates.ROLLING && (
        <Grow in>
          <Rolling list={players} setList={setPlayers} />
        </Grow>
      )}
    </ThemeProvider>
  );
}
