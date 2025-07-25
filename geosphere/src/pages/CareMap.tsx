import React, { memo } from 'react';
import { Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useOutletContext } from 'react-router-dom';

interface Hospital {
    id: string;
    name: string;
    address?: string;
}

interface CareMapProps {
    hospitals: Hospital[];
}

const CareMap: React.FC<CareMapProps> = memo(({ }) => {

    const { hospitals } = useOutletContext<{ hospitals: Location[] }>();



    console.log("eeee", hospitals);

    return (
        <>
            <Typography variant="h6" fontWeight={600} gutterBottom>
                Nearby Hospitals
            </Typography>
            {hospitals?.length === 0 ? (
                <Typography variant="body2" color="textSecondary">
                    No hospitals found.
                </Typography>
            ) : (
                <List dense>
                    {hospitals?.map((hospital) => (
                        <div>mahesh</div>
                        // <React.Fragment key={hospital.id}>
                        //     <ListItem alignItems="flex-start">
                        //         <ListItemText
                        //             primary={hospital?.}
                        //             secondary={hospital?.address || 'Address not available'}
                        //         />
                        //     </ListItem>
                        //     <Divider component="li" />
                        // </React.Fragment>
                    ))}
                </List>
            )}
        </>
    );
});

export default CareMap;
