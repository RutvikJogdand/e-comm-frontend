import React from "react";
import {Route, Routes} from "react-router-dom";
import TailwindNav from "../components/TailwindNav/TailwindNav";
import Checkout from "../components/Checkout/Checkout";

function AppRoutes(){

    return(
        <>
            <Routes>
                <Route exact path="/" element={<TailwindNav/> } />
                <Route path="/checkout" element={<Checkout/> } />  
            </Routes>
        </>
    )

}

export default AppRoutes