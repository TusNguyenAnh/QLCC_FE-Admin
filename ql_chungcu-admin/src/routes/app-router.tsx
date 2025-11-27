import React from 'react';
import {Routes, Route} from "react-router-dom";
import MainLayout from "../layouts/main-layout.tsx";
import {Login} from "../pages/authentication/login.tsx";
import Authorization from "@/pages/authorization/authorization.tsx";
import {ProtectedRoute} from "@/layouts/protected-route.tsx";
import Organization from "@/pages/organization/organization.tsx";
import Complex from "@/pages/complex/complex.tsx";


const AppRouter: React.FC = () => (
    <Routes>
        <Route path="/page/dashboard" element={
            <MainLayout content={undefined}>
            </MainLayout>
        }/>

        {/*<Route path="/page/org" element={*/}
        {/*    <ProtectedRoute>*/}
        {/*        <MainLayout content={<Organization/>}>*/}
        {/*        </MainLayout>*/}
        {/*    </ProtectedRoute>*/}
        {/*}/>*/}

        <Route path="/page/authori" element={
            <ProtectedRoute
                permissions={["view:permission", "assign:permission", "manage:role", "view:role", "assign:role", "view:user", "manage:user"]}
                requireAll={true}
            >
                <MainLayout content={<Authorization/>}>
                </MainLayout>
            </ProtectedRoute>
        }/>

        <Route path="/page/complex" element={
            <ProtectedRoute
                permissions={["view:complex", "manage:complex", "review:complex"]}
                requireAll={true}
            >
                <MainLayout content={<Complex/>}>
                </MainLayout>
            </ProtectedRoute>
        }/>

        <Route path="/login" element={
            <Login/>
        }/>

    </Routes>
);
export default AppRouter;
