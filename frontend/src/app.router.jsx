
import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Layout from "./components/layout/Layout";
import Dashboard from "./features/dashboard/Dashboard"; // NEW
import Preparation from "./features/interview/pages/Preparation";
import Interview from "./features/interview/pages/Interview";
import MockSetup from "./features/mockInterview/pages/MockSetup";
import LiveInterview from "./features/mockInterview/pages/LiveInterview";
import MockResults from "./features/mockInterview/pages/MockResults";
import Activity from "./features/activity/Activity";

import Landing from "./features/landing/pages/Landing";

export const router = createBrowserRouter([
    { 
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/",
        element: <Landing />
    },
    {
        path: "/dashboard",
        element: (
            <Protected>
                <Layout>
                    <Dashboard /> {/* Changed from Home */}
                </Layout>
            </Protected>
        )
    },
    {
        path: "/preparation", // NEW - moved Home here
        element: (
            <Protected>
                <Layout>
                    <Preparation />
                </Layout>
            </Protected>
        )
    },
    {
        path: "/mock-setup",
        element: (
            <Protected>
                <Layout>
                    <MockSetup />
                </Layout>
            </Protected>
        )
    },
    {
        path: "/live-interview/:sessionId",
        element: (
            <Protected>
                <LiveInterview />
            </Protected>
        )
    },
    {
        path: "/mock-results/:sessionId",
        element: (
            <Protected>
                <Layout>
                    <MockResults />
                </Layout>
            </Protected>
        )
    },
    {
        path: "/interview/:interviewId",
        element: (
            <Protected>
                <Layout>
                    <Interview />
                </Layout>
            </Protected>
        )
    },
    {
        path: "/activity",
        element: (
            <Protected>
                <Layout>
                    <Activity />
                </Layout>
            </Protected>
        )
    }
]);
