/* eslint-disable no-unused-vars */
import React from 'react'

import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'

import UserList from './components/UserList'

import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Profile from './components/Profile'
import ProfilePage from './components/ProfilePage'
import Post from './components/Post/index'
import Blog from './components/Blog/index'

import Logo from './images/helpMe.jpg'

import { useAuth0 } from '@auth0/auth0-react'
import Fab from '@material-ui/core/Fab'
import {
  CssBaseline,
  Drawer,
  Box,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Container,
  Link as MUILink,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Tooltip,
  Modal,
  Backdrop,
  Fade,
  useScrollTrigger,
  Slide,
} from '@material-ui/core'
import { Link } from 'react-router-dom'
import {
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  PostAdd as PostAddIcon,
} from '@material-ui/icons'
import Dashboard from './components/Dashboard'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <MUILink color="inherit" href="https://grandstack.io/">
        Help me
      </MUILink>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    height: theme.spacing(8),
    backgroundColor: 'white',
    color: '#121212',
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  navLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
  appBarImage: {
    maxHeight: '75px',
    paddingRight: '20px',
  },
  absolute: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(3),
    backgroundColor: 'white',
  },
  btImg: {
    borderRadius: '50%',
  },

  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid black',
  },
  Modalpaper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  logo: {
    height: 'inherit',
    width: '40px',
    borderRadius: '50%',
  },
}))
function HideOnScroll(props) {
  const { children, window } = props
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({ target: window ? window() : undefined })

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}

export default function App(props) {
  const classes = useStyles()
  const [open, setOpen] = React.useState(true) // for the drawing bar

  const [openModal, setOpenModal] = React.useState(false) // for the Model
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0()
  const handleDrawerOpen = () => {
    setOpen(true)
  }
  const handleDrawerClose = () => {
    setOpen(false)
  }

  return (
    <Router>
      <div className={classes.root}>
        <CssBaseline />
        <HideOnScroll {...props}>
          <AppBar className={clsx(classes.appBar, open && classes.appBarShift)}>
            <Toolbar className={classes.toolbar}>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                className={clsx(
                  classes.menuButton,
                  open && classes.menuButtonHidden
                )}
              >
                <MenuIcon />
              </IconButton>
              <img src={Logo} alt="logo" className={classes.logo} />

              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                className={classes.title}
              >
                HelpMe
              </Typography>
              {!isAuthenticated ? (
                <Button color="inherit" onClick={() => loginWithRedirect()}>
                  Log In
                </Button>
              ) : (
                <Button color="inherit" onClick={() => logout()}>
                  Log Out
                </Button>
              )}
            </Toolbar>
          </AppBar>
        </HideOnScroll>
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          open={open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>
            <Link to="/" className={classes.navLink}>
              <ListItem button>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItem>
            </Link>

            <Link to="/posts" className={classes.navLink}>
              <ListItem button>
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Posts" />
              </ListItem>
            </Link>
          </List>
          <Link to="/profile" className={classes.navLink}>
            <ListItem button>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
          </Link>
          <Link to="/post" className={classes.navLink}>
            <ListItem button>
              <ListItemIcon>
                <PostAddIcon />
              </ListItemIcon>
              <ListItemText primary="Post" />
            </ListItem>
          </Link>
          <Divider />
          <Profile />
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <Switch>
              <Route exact path="/" component={Dashboard} />
              <Route exact path="/businesses" component={UserList} />
              <Route exact path="/posts" component={UserList} />
              <Route exact path="/profile" component={ProfilePage} />
              <Route exact path="/post" component={Post} />
              <Route path="/blog/:id" component={Blog} />
            </Switch>
            <Tooltip title="Add" aria-label="add">
              <Link to="/post">
                <Fab className={classes.absolute}>
                  <img
                    src={Logo}
                    height="40px"
                    width="40px"
                    alt="button Logo"
                    className={classes.btImg}
                  />
                </Fab>
              </Link>
            </Tooltip>

            <Box pt={4}>
              <Copyright />
            </Box>
          </Container>
        </main>
      </div>
    </Router>
  )
}
