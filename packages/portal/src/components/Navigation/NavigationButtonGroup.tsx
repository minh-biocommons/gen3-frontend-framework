import React from 'react';
import { styled } from '@mui/material/styles';
import { Stack, Button } from '@mui/material';
import { useRouter } from 'next/router'

export interface NavigationButtonGroupProp {
    rolesPages: Record<any, any>
}

const Item = styled('div')(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary
}));

const NavigationButtonGroup = ({ rolesPages }: NavigationButtonGroupProp) => {
    const router = useRouter()
    return (
    <Stack direction={"row"} justifyContent={"center"} spacing={2}>
        {Object.entries(rolesPages).map(entry => (
            <Item key={entry[0]
            }>
                <Button variant="contained" className={(router.asPath === entry[1].link) ? "bg-rose-500" : "bg-sky-500"} href={entry[1].link || '#'}>{entry[0]}</Button>
            </Item>
        ))}
    </Stack>
)};

export default NavigationButtonGroup;
