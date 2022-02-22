import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

export interface StatisticCardProp {
    name: string,
    value: number,
}

const StatisticCard = ({ name, value }: StatisticCardProp) => (
    <Card elevation={0}>
        <CardContent>
            <Typography className='font-montserrat' variant="h5" component="div">
                {value}
            </Typography>
            <Typography className="font-montserrat not-prose" sx={{ mb: 1.5 }} color="text.secondary">
                {name}
            </Typography>
        </CardContent>
    </Card>
);


export default StatisticCard;
