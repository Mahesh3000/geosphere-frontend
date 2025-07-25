import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
// import { MapLocation } from '../types';

const WeekendRadar: React.FC = () => {
    const { mapResults } = useOutletContext<{ mapResults: MapLocation[] }>();

    return (
        <>
            <Typography variant="h6" fontWeight={600} gutterBottom>
                Weekend Hotspots
            </Typography>
            {mapResults.length === 0 ? (
                <Typography variant="body2" color="textSecondary">
                    No events or hotspots found.
                </Typography>
            ) : (
                <List dense>
                    {mapResults.map((location) => (
                        <React.Fragment key={location.id}>
                            <ListItem alignItems="flex-start">
                                <ListItemText
                                    primary={location.name}
                                    secondary={location.vicinity || 'Address not available'}
                                />
                            </ListItem>
                            <Divider component="li" />
                        </React.Fragment>
                    ))}
                </List>
            )}
        </>
    );
};

export default WeekendRadar;
