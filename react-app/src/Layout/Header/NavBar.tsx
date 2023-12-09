import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { Link } from 'react-router-dom'
import axios from 'axios';
import Cookies from 'js-cookie';


const pages = ['Home', 'Chat', 'Game', 'Profile'];
const settings = ['Setting', 'Logout'];


const getToken = (): string | '' => {
  const tokenString = localStorage.getItem('token');
  const userToken = JSON.parse(tokenString ?? '""');

  // console.log("From LocalStorage", userToken);

  return userToken?.token || "";
};

function NavBar() {
  const [avatar, setAvatar] = React.useState();

      {/* Here set the neded headers in all requeste send to backend  becouse here when the FIRST REQUIEST send */}
  // axios.defaults.withCredentials = true;  // to send token in every requiste

  // axios.defaults.headers.common['Authorization'] = getToken();
  // axios.defaults.headers.post['Authorization'] = getToken();

  React.useEffect(() => {

    //// fetching Avatar from backend
    async function getAvatar() {

      await axios.get("http://localhost:3001/user/avatar")
      .then(res => {
        setAvatar(res.data.avatar);
      })
      .catch(err =>  {
        console.error("error in fetching Avatar", err);
      })
    }
    getAvatar();
  }, []);


  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    // alert("test logout");

    // Just redirect to logout api to remove Cookies token
    window.location.href = "http://localhost:3001/logout";
    
       //test for dev Mode
    // Cookies.remove('jwt');
    // window.location.href = "http://localhost:3001/";
  };

  const handleSetting = () => {
    window.location.href = "http://localhost:3000/setting";
  };

  // const handle2F = () => {
  //   window.location.href = "http://localhost:3001/settings/enable/2f";
  // };

  return (
    <AppBar position="static" color="primary"  >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
            >
            Pong Game
          </Typography> */}

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
              >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center"><Link to={(page == "Home") ? '/' : '/' + page}>{page}</Link></Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
            >
            Pong Game
          </Typography> */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
              key={page}
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: 'white', display: 'block' }}
              >
                <Link to={(page == "Home") ? '/' : '/' + page}>{page}</Link>
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src={avatar} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              > 
            {/* Edite Profile && Logout */}
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">
                    {
                    setting === "Logout" &&
                    (<button onClick={handleLogout}>
                      {setting}
                    </button>)
                    }
                    {/* {
                    setting === 'Enable 2F' &&
                    (<button onClick={handle2F}>
                      {setting}
                    </button>)
                    } */}
                    {
                    setting === "Setting" &&
                      (<button onClick={handleSetting}>
                        {setting}
                      </button>)
                    }
                    </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default NavBar;