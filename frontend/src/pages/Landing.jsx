import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { motion } from "framer-motion";
import { LogoText } from "@/components/Logo";
import ProfessionalFooter from "@/components/ProfessionalFooter";

const Landing = () => {
    return (
        <PageTransition className="min-h-screen bg-background">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
            </div>

            {/* Navbar */}
            <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto relative z-10">
                <LogoText />
                <div className="flex gap-4">
                    <Button variant="ghost" asChild>
                        <Link to="/sign-in">Sign In</Link>
                    </Button>
                    <Button asChild className="rounded-full px-6">
                        <Link to="/sign-up">Get Started</Link>
                    </Button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="py-20 px-6 text-center max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-sm font-medium mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Live in Bangalore & Mumbai
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1]">
                        Turn Your Steps into <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                            Real Earnings
                        </span>
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                        Complete simple tasks like deliveries, surveys, and mystery shopping while you walk. Join 50,000+ walkers earning daily.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" className="h-14 px-8 rounded-full text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform" asChild>
                            <Link to="/sign-up">
                                Start Earning Now <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="h-14 px-8 rounded-full text-lg hover:bg-secondary/50" asChild>
                            <Link to="/sign-in">Sign In</Link>
                        </Button>
                    </div>
                </motion.div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-6 bg-secondary/30">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            title: "Tasks Nearby",
                            desc: "Find paid tasks within walking distance using our real-time map."
                        },
                        {
                            title: "Instant Payouts",
                            desc: "Withdraw your earnings directly to your bank account or UPI instantly."
                        },
                        {
                            title: "Safe & Secure",
                            desc: "Verified tasks and secure payments ensure a safe earning experience."
                        }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-background p-8 rounded-3xl border shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="w-12 h-12 bg-zinc-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-zinc-200 dark:border-white/10">
                                <span className="text-sm font-black text-zinc-400">0{i + 1}</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>


            {/* Footer */}
            <ProfessionalFooter />
        </PageTransition>
    );
};

export default Landing;
