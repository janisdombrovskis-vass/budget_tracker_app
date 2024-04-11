import React from 'react';
import { setTheme } from "@ui5/webcomponents-base/dist/config/Theme";
import { ThemeProvider } from "@ui5/webcomponents-react";
import OrderTable from './components/OrderTable';
const App = () => {
    setTheme("sap_fiori_3");
    return (
        <>
            <ThemeProvider>
                <OrderTable/>
            </ThemeProvider>
        </>
    )
}
export default App;
// comment