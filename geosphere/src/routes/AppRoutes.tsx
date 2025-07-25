import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import CareMap from '../pages/CareMap';
import OpenSpace from '../pages/OpenSpace';
import WeekendRadar from '../pages/WeekendRadar';
import TrackEZ from '../pages/TrackEZ';

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<MainLayout />}>
            <Route index element={<CareMap />} />
            <Route path="openspace" element={<OpenSpace />} />
            <Route path="weekend-radar" element={<WeekendRadar />} />
            <Route path="trackez" element={<TrackEZ />} />
        </Route>
    </Routes>
);

export default AppRoutes;
