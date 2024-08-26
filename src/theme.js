import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    typography: {
        fontFamily: ['Open Sans'],
        fontSize: "14px",
    },
    components: {
        MUIDataTableBodyCell: {
            styleOverrides: {
                stackedHeader: {
                    display: "none !important"
                }
            }
        }
    }
});
