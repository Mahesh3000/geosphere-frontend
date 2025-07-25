import { useState } from 'react';
import { Box } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import MapWrapper from './MapWrapper';
import Header from './Header';

const tabFilters = {
    '/': 'caremap',
    '/openspace': 'openspace',
    '/weekend-radar': 'weekendradar',
    '/trackez': 'trackez',
};

const MainLayout = () => {
    const location = useLocation();

    const activeTab = tabFilters[location.pathname] || 'caremap';

    const [hospitals, setHospitals] = useState<Location[]>([]);


    return (
        <>
            <Header />
            <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex' }}>
                {/* Map with activeTab prop */}
                <Box sx={{ flexBasis: '70%', borderRight: '1px solid #ddd' }}>
                    <MapWrapper filter={activeTab} setHospitals={setHospitals} />
                </Box>

                {/* Right data panel */}
                <Box sx={{ flexBasis: '30%', overflowY: 'auto', p: 2 }}>
                    <Outlet hospitals={hospitals} />
                </Box>
            </Box>
        </>
    );
};

export default MainLayout;
