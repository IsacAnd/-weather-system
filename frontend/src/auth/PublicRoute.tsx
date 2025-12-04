import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { JSX } from "react";

export default function PublicRoute({
    children
}: {
    children: JSX.Element;
}) {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}
