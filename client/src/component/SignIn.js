// react
import React, { Component } from "react";
// framework
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import CircularProgress from "@material-ui/core/CircularProgress";
// icons
import VpnKey from "@material-ui/icons/VpnKey";
import AccountCircle from "@material-ui/icons/AccountCircle";

const SignInStyles = (theme) => ({
  loading: {
    display: "flex",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingLogo: {
    color: "#E63946",
  },
  paperContainer: {
    height: "100%",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  cardSection: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderColor: "hsl(0,0%,80%)",
    borderRadius: "4px",
    borderStyle: "solid",
    borderWidth: 1,
    width: "30%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      width: "90%",
    },
  },
  mainGrid: {
    padding: 40,
  },
  elGrid: {
    marginBottom: 15,
  },
  rootInputText: {
    fontSize: 13,
  },
  rootInput: {
    width: "100%",
    "& .MuiInput-underline:after": {
      borderBottomColor: "#e63946",
    },
  },
  label: {
    "&$focusedLabel": {
      color: "#e63946",
    },
  },
  focusedLabel: {},
  submitButton: {
    width: "100%",
    marginTop: 25,
  },
});

class SignIn extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      login: "",
      password: "",
    };
  }

  _isMounted = false;

  submitLogin = (e) => {
    e.preventDefault();
    fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({
        login: this.state.login,
        password: this.state.password,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        if (this._isMounted) {
          if (res.login === true) {
            if (res.isCompleted === true) {
              this.props.auth.setCompleted();
            } else {
              this.props.auth.setNotCompleted();
            }
            this.props.auth.setLogged();
            this.props.props.history.push("/");
          } else if (res.login === false) {
            this.props.auth.errorMessage("Invalid credentials");
          } else {
            this.props.auth.errorMessage(res.login.msg);
          }
        }
      })
      .catch((err) => this.props.auth.errorMessage(err));
  };

  handleChangeLogin = (e) => {
    this.setState({ login: e.target.value });
  };

  handleChangePassword = (e) => {
    this.setState({ password: e.target.value });
  };

  componentDidMount() {
    this._isMounted = true;
    document.body.style.overflow = "auto";
    this.setState({ isLoading: false });
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.setState({ isLoading: true });
  }

  render() {
    const { classes } = this.props;

    const { login, password, isLoading } = this.state;

    if (isLoading === true) {
      return (
        <div className={classes.loading}>
          <CircularProgress className={classes.loadingLogo} />
        </div>
      );
    }

    return (
      <div id="unloggedRoot" className={classes.paperContainer}>
        <Paper className={classes.cardSection} elevation={0}>
          <form
            onSubmit={(e) => {
              this.submitLogin(e);
            }}
          >
            <Grid container className={classes.mainGrid}>
              <Grid item xs={12} className={classes.elGrid}>
                <TextField
                  classes={{
                    root: classes.rootInput,
                  }}
                  inputProps={{
                    className: classes.rootInputText,
                  }}
                  InputLabelProps={{
                    classes: {
                      root: classes.label,
                      focused: classes.focusedLabel,
                    },
                  }}
                  required
                  id="login"
                  label="Username or Email"
                  value={login}
                  onChange={this.handleChangeLogin}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} className={classes.elGrid}>
                <TextField
                  classes={{
                    root: classes.rootInput,
                  }}
                  InputLabelProps={{
                    classes: {
                      root: classes.label,
                      focused: classes.focusedLabel,
                    },
                  }}
                  required
                  id="password"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={this.handleChangePassword}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VpnKey />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  color="secondary"
                  type="submit"
                  className={classes.submitButton}
                >
                  Sign in
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </div>
    );
  }
}

export default withStyles(SignInStyles)(SignIn);
