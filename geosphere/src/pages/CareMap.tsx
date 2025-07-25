import React, { memo } from 'react';
import { Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useOutletContext } from 'react-router-dom';

interface Hospital {
    id: string;
    name: string;
    address?: string;
}

interface CareMapProps {
    mapResults: Hospital[];
}

const CareMap: React.FC<CareMapProps> = memo(({ }) => {

    // const { hospitals } = useOutletContext<{ hospitals: MapLocation[] }>();
    const { mapResults, filter } = useOutletContext<{ mapResults: MapLocation[], filter: string }>();



    console.log("in care map", mapResults);

    return (
        <>
            <Typography variant="h6" fontWeight={600} gutterBottom>
                Nearby Hospitals
            </Typography>
            {mapResults?.length === 0 ? (
                <Typography variant="body2" color="textSecondary">
                    No hospitals found.
                </Typography>
            ) : (
                <List dense>
                    {mapResults?.map((hospital) => (

                        <React.Fragment key={hospital.id}>
                            <ListItem alignItems="flex-start">
                                <ListItemText
                                    primary={hospital?.name}
                                    secondary={hospital?.vicinity || 'Address not available'}
                                />
                            </ListItem>
                            <Divider component="li" />
                        </React.Fragment>
                    ))}
                </List>
            )}
        </>
    );
});

export default CareMap;
