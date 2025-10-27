import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from "@/context/AuthContext.tsx";
import AppRouter from "@/routes/app-router.tsx";

createRoot(document.getElementById('root')!).render(
    // <StrictMode>
    <BrowserRouter>
        <AuthProvider>
            <AppRouter/>
        </AuthProvider>
    </BrowserRouter>
    // </StrictMode>,
)
