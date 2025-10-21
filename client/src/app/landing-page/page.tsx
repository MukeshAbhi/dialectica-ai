"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  IconMessage,
  IconUsers,
  IconBrain,
  IconSparkles,
  IconArrowRight,
  IconPlayerPlay,
  IconShield,
  IconBolt,
  IconGlobe,
} from "@tabler/icons-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

interface StatCounterProps {
  target: number;
  label: string;
  suffix?: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="group relative p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-neutral-200/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white group-hover:from-blue-600 group-hover:to-purple-700 transition-all duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-neutral-900">{title}</h3>
      </div>
      <p className="text-neutral-700 leading-relaxed">{description}</p>
    </motion.div>
  );
};

const StatCounter: React.FC<StatCounterProps> = ({ target, label, suffix = "", delay = 0 }) => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const increment = target / 100;
      const interval = setInterval(() => {
        setCount((prev) => {
          if (prev >= target) {
            clearInterval(interval);
            return target;
          }
          return Math.min(prev + increment, target);
        });
      }, 20);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [target, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="text-center"
    >
      <div className="text-3xl font-bold text-neutral-900 mb-2">
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-neutral-600 text-sm uppercase tracking-wider">{label}</div>
    </motion.div>
  );
};

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features: Array<{ icon: React.ReactNode; title: string; description: string }> = [
    {
      icon: <IconBrain className="w-6 h-6" />,
      title: "AI-Powered Debates",
      description:
        "Engage in intelligent discussions powered by advanced AI that understands context and nuance.",
    },
    {
      icon: <IconUsers className="w-6 h-6" />,
      title: "Real-time Collaboration",
      description:
        "Connect with debaters worldwide in real-time rooms designed for structured discourse.",
    },
    {
      icon: <IconShield className="w-6 h-6" />,
      title: "Secure & Private",
      description:
        "Your conversations are protected with end-to-end encryption and privacy-first design.",
    },
    {
      icon: <IconBolt className="w-6 h-6" />,
      title: "Lightning Fast",
      description:
        "Experience instant responses and seamless interactions with our optimized platform.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Dialectica AI
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Experience the future of intellectual discourse. Engage in AI-powered debates that
              challenge your thinking and expand your perspectives.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <button className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-medium hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
              <IconPlayerPlay className="w-5 h-5" />
              Start Debating
              <IconArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-neutral-300/20 text-neutral-900 rounded-2xl font-medium hover:bg-neutral-100/20 transition-colors">
              Watch Demo
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          >
            <StatCounter target={10000} label="Debates" suffix="+" delay={0.8} />
            <StatCounter target={5000} label="Users" suffix="+" delay={1.0} />
            <StatCounter target={99} label="Uptime" suffix="%" delay={1.2} />
            <StatCounter target={50} label="Countries" suffix="+" delay={1.4} />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-neutral-700 max-w-2xl mx-auto">
              Discover the tools that make Dialectica AI the premier platform for intellectual
              discourse and debate.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.2}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative p-12 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-neutral-200/20 rounded-3xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl"></div>
            <div className="relative z-10">
              <IconSparkles className="w-16 h-16 mx-auto mb-6 text-blue-500" />
              <h3 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Ready to Elevate Your Discourse?
              </h3>
              <p className="text-lg text-neutral-700 mb-8 max-w-2xl mx-auto">
                Join thousands of thinkers, debaters, and curious minds who are already using
                Dialectica AI to enhance their intellectual journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-medium hover:scale-105 transition-transform">
                  Join the Community
                </button>
                <button className="px-8 py-4 bg-white/10 dark:bg-white/10 backdrop-blur-sm border border-neutral-300/20 dark:border-white/20 text-neutral-900 dark:text-white rounded-2xl font-medium hover:bg-neutral-100/20 dark:hover:bg-white/20 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 py-12 border-t border-neutral-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <IconMessage className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-neutral-900 dark:text-white">
                Dialectica AI
              </span>
            </div>

            <div className="flex items-center gap-6 text-neutral-600 dark:text-neutral-400 text-sm">
              <a
                href="#"
                className="hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                Contact
              </a>
            </div>

            <div className="text-neutral-600 dark:text-neutral-400 text-sm">
              © 2025 Dialectica AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
