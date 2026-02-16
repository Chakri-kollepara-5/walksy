import React from "react";

export const Logo = ({ className = "w-8 h-8", variant = "default" }) => {
    return (
        <img
            src="/logo.png"
            alt="Walksy Logo"
            className={`${className} object-contain`}
            onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                // Fallback to text or SVG if image fails could be added here, but for now we hide
            }}
        />
    );
};

export const LogoText = ({ className = "", variant = "default" }) => (
    <div className={`flex items-center gap-3 ${className}`}>
        <Logo className="w-10 h-10" variant={variant} />
        <span className={`text-2xl font-black tracking-tighter ${variant === "white" ? "text-white" : "text-foreground"}`}>
            Walksy
        </span>
    </div>
);
