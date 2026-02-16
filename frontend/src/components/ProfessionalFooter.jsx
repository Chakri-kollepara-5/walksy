import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { LogoText } from "./Logo";

const ProfessionalFooter = () => {
    return (
        <footer className="bg-black text-white pt-20 pb-10 border-t border-white/10 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[128px] pointer-events-none opacity-20" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <LogoText variant="white" />
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            Revolutionizing local logistics by connecting people who walk with people who need things done. Join the movement today.
                        </p>
                        <div className="flex items-center gap-4">
                            <SocialLink icon={<Twitter size={18} />} href="#" />
                            <SocialLink icon={<Instagram size={18} />} href="#" />
                            <SocialLink icon={<Linkedin size={18} />} href="#" />
                            <SocialLink icon={<Facebook size={18} />} href="#" />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link to="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
                            <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                            <li><Link to="/press" className="hover:text-primary transition-colors">Press</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">Support</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link to="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
                            <li><Link to="/safety" className="hover:text-primary transition-colors">Safety Guide</Link></li>
                            <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Contact & Newsletter */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">Stay Updated</h4>
                        <div className="space-y-4 mb-6">
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <Mail size={16} className="text-primary" />
                                <span>hello@walksy.app</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <MapPin size={16} className="text-primary" />
                                <span>Bengaluru, India</span>
                            </div>
                        </div>

                        <form className="relative">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-gray-600"
                            />
                            <button className="absolute right-1 top-1 bottom-1 bg-primary hover:bg-primary/90 text-white px-3 rounded-md text-xs font-bold transition-colors">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-500">
                        © {new Date().getFullYear()} Walksy Technologies Pvt Ltd. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-xs text-gray-500">
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link to="/cookies" className="hover:text-white transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const SocialLink = ({ icon, href }) => (
    <a
        href={href}
        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
    >
        {icon}
    </a>
);

export default ProfessionalFooter;
