"use client"
import { FaUserCheck, FaCrown } from "react-icons/fa6";
import { FaShieldAlt } from "react-icons/fa";

interface UsernameDisplayProps {
    username: string;
    level: number;
    isVerified: boolean;
    role: string;
    showLevel?: boolean;
    size?: "sm" | "md" | "lg";
    className?: string;
}

export default function UsernameDisplay({ 
    username, 
    level, 
    isVerified, 
    role, 
    showLevel = false, 
    size = "md",
    className = ""
}: UsernameDisplayProps) {
    const getUsernameColor = (level: number) => {
        if (level >= 100) return "text-red-500";
        if (level >= 50) return "text-orange-500";
        if (level >= 25) return "text-green-500";
        if (level >= 10) return "text-yellow-500";
        return "";
    };

    const getSizeClasses = () => {
        switch (size) {
            case "sm":
                return "text-sm";
            case "lg":
                return "text-lg";
            default:
                return "text-base";
        }
    };

    const getIconSize = () => {
        switch (size) {
            case "sm":
                return 12;
            case "lg":
                return 20;
            default:
                return 16;
        }
    };

    return (
        <span className={`${getSizeClasses()} ${className}`}>
            <span className={`font-medium ${getUsernameColor(level)}`}>
                {level>=100 ? <span><span className="text-[var(--text-color)]!">{username.charAt(0)}</span>{username.substring(1)}</span>: username}
            </span>
            {showLevel && (
                <span className="ml-1 px-1 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                    L{level}
                </span>
            )}
            {isVerified && (
                <FaUserCheck 
                    className="inline ml-1 text-blue-600" 
                    size={getIconSize()} 
                    title="Verified User" 
                />
            )}
            {role === "ADMIN" && (
                <FaCrown 
                    className="inline ml-1 text-yellow-600" 
                    size={getIconSize()} 
                    title="Administrator" 
                />
            )}
            {role === "MODERATOR" && (
                <FaShieldAlt 
                    className="inline ml-1 text-green-600" 
                    size={getIconSize()} 
                    title="Moderator" 
                />
            )}
        </span>
    );
}
