// src/components/Header.tsx
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    IconButton,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

// Icons
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ParkIcon from '@mui/icons-material/Park';
import MapIcon from '@mui/icons-material/Map';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const Header = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const location = useLocation();

    const navItems = [
        { label: 'CareMap', path: '/', icon: <LocationOnIcon /> },
        { label: 'OpenSpace', path: '/openspace', icon: <ParkIcon /> },
        { label: 'WeekendRadar', path: '/weekend-radar', icon: <MapIcon /> },
        { label: 'TrackEZ', path: '/trackez', icon: <LocalShippingIcon /> },
    ];

    return (
        <AppBar position="static" color="primary" elevation={3}>
            <Toolbar>
                <Typography
                    variant={isMobile ? 'h6' : 'h5'}
                    sx={{ flexGrow: 1, fontWeight: 600 }}
                >
                    GeoSphere
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <IconButton
                                key={item.path}
                                component={Link}
                                to={item.path}
                                sx={{
                                    color: isActive ? 'yellow' : 'white',
                                    flexDirection: 'column',
                                    fontSize: '0.75rem',
                                    '&:hover': {
                                        color: 'lightyellow',
                                    },
                                }}
                            >
                                {item.icon}
                                <Typography variant="caption" sx={{ fontWeight: isActive ? 700 : 400 }}>
                                    {item.label}
                                </Typography>
                            </IconButton>
                        );
                    })}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
