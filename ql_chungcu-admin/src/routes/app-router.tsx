import React from 'react';
import {Routes, Route} from "react-router-dom";
import MainLayout from "../layouts/main-layout.tsx";
import {Login} from "../pages/authentication/login.tsx";
import Authorization from "@/pages/authorization/authorization.tsx";
import {ProtectedRoute} from "@/layouts/protected-route.tsx";
import Organization from "@/pages/organization/organization.tsx";


const AppRouter: React.FC = () => (
    <Routes>
        <Route path="/" element={
            <MainLayout content={undefined}>
            </MainLayout>
        }/>

        <Route path="/page/org" element={
            <ProtectedRoute>
                <MainLayout content={<Organization/>}>
                </MainLayout>
            </ProtectedRoute>
        }/>

        <Route path="/page/authori" element={
            <MainLayout content={<Authorization/>}>
            </MainLayout>
        }/>

        <Route path="/login" element={
            <Login/>
        }/>

    </Routes>
);
export default AppRouter;
