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

    const [mapResults, setMapResults] = useState<MapLocation[]>([]);

    const [locationsByFilter, setLocationsByFilter] = useState<Record<string, MapLocation[]>>({
        caremap: [],
        openspace: [],
        weekendradar: [],
        trackez: [],
    });


    const setResultsForFilter = (filter: string, data: MapLocation[]) => {
        setLocationsByFilter(prev => ({ ...prev, [filter]: data }));
    };



    return (
        <>
            <Header />
            <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex' }}>
                {/* Map with activeTab prop */}
                <Box sx={{ flexBasis: '70%', borderRight: '1px solid #ddd' }}>
                    <MapWrapper filter={activeTab} setHospitals={(data) => setResultsForFilter(activeTab, data)} />
                </Box>

                {/* Right data panel */}
                <Box sx={{ flexBasis: '30%', overflowY: 'auto', p: 2 }}>
                    <Outlet context={{ mapResults: locationsByFilter[activeTab] || [], filter: activeTab }} />
                </Box>
            </Box>
        </>
    );
};

export default MainLayout;
