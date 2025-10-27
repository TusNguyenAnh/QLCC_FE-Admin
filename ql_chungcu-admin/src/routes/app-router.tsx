import React from 'react';
import {Routes, Route} from "react-router-dom";
import MainLayout from "../layouts/main-layout.tsx";
import {Login} from "../pages/authentication/login.tsx";




const AppRouter: React.FC = () => (
    <Routes>
        <Route path="/" element={
            <MainLayout content={undefined}>
            </MainLayout>
        }/>

        <Route path="/login" element={
            <Login/>
        }/>

    </Routes>
);
export default AppRouter;
