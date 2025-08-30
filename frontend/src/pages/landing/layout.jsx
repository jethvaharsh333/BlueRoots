import React from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  }
};

const heroVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      staggerChildren: 0.2
    }
  }
};

const floatingVariants = {
  animate: {
    y: [-10, 10, -10],
    rotate: [0, 5, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const cardVariants = {
  hidden: { y: 50, opacity: 0, rotateX: -15 },
  visible: {
    y: 0,
    opacity: 1,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  }
};

const Layout = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      {/* Navbar */}
      <motion.nav 
        className="w-full flex justify-between items-center px-6 py-4 bg-gradient-to-r from-gray-900/95 via-slate-800/95 to-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-700/50 sticky top-0 z-40"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <motion.h1 
          className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          BlueRoots
        </motion.h1>
        <Link to='/login'>
          <Button
            variant="outline" 
            className="border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-gray-900 hover:border-teal-400 transition-all duration-300"
          >
            Login
          </Button>
        </Link>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-teal-600 to-emerald-600 text-white py-24 overflow-hidden">
        {/* Parallax background elements */}
        <motion.div 
          className="absolute inset-0 opacity-10"
          style={{ y: y1 }}
        >
          <motion.div 
            className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"
            variants={floatingVariants}
            animate="animate"
          />
          <motion.div 
            className="absolute top-32 right-20 w-24 h-24 bg-white rounded-full"
            variants={floatingVariants}
            animate="animate"
            transition={{ delay: 1 }}
          />
          <motion.div 
            className="absolute bottom-20 left-1/3 w-20 h-20 bg-white rounded-full"
            variants={floatingVariants}
            animate="animate"
            transition={{ delay: 0.5 }}
          />
        </motion.div>

        {/* Animated gradient orbs */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-full"
          style={{ y: y2 }}
        >
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-400/20 to-teal-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.div>
        
        <motion.div 
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
          variants={heroVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            variants={itemVariants}
          >
            Empowering communities with{" "}
            <motion.span 
              className="text-yellow-300 inline-block"
              whileHover={{ scale: 1.1, rotate: 2 }}
              transition={{ duration: 0.2 }}
            >
              AI
            </motion.span> to protect{" "}
            <motion.span 
              className="text-cyan-200 inline-block"
              whileHover={{ scale: 1.1, rotate: -2 }}
              transition={{ duration: 0.2 }}
            >
              blue carbon
            </motion.span> ecosystems
          </motion.h2>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-blue-100"
            variants={itemVariants}
          >
            Together we can protect mangroves with AI + Community Power 🌱
          </motion.p>
          
          <motion.div
            variants={itemVariants}
          >
            <Link to="/login">
              <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-gray-900 font-semibold px-10 py-4 text-lg shadow-2xl shadow-yellow-500/25">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2"
                >
                  Get Started
                  <motion.svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </motion.svg>
                </motion.span>
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-6 bg-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #10b981 2px, transparent 2px),
                             radial-gradient(circle at 75% 75%, #3b82f6 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        <motion.div 
          className="max-w-6xl mx-auto text-center relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.h3 
            className="text-5xl font-bold mb-4 text-gray-800"
            variants={itemVariants}
          >
            The Problem
          </motion.h3>
          <motion.p 
            className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Our precious mangrove ecosystems are under constant threat from human activities
          </motion.p>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
            variants={containerVariants}
          >
            {[
              {
                emoji: "🌲",
                title: "Illegal Cutting",
                description: "Unauthorized deforestation destroying vital ecosystems",
                color: "red",
                gradient: "from-red-500 to-pink-600"
              },
              {
                emoji: "🗑",
                title: "Waste Dumping", 
                description: "Pollution threatening marine biodiversity",
                color: "orange",
                gradient: "from-orange-500 to-red-500"
              },
              {
                emoji: "🏗",
                title: "Land Reclamation",
                description: "Development projects destroying wetlands", 
                color: "amber",
                gradient: "from-amber-500 to-orange-600"
              }
            ].map((problem, index) => (
              <motion.div
                key={problem.title}
                className="group relative"
                variants={cardVariants}
                whileHover={{ y: -10, rotateY: 5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-3xl blur-xl"
                     style={{ background: `linear-gradient(135deg, ${problem.color === 'red' ? '#ef4444' : problem.color === 'orange' ? '#f97316' : '#f59e0b'}, transparent)` }} />
                
                <div className={`relative p-8 border-2 border-${problem.color}-200 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-b from-${problem.color}-50 to-${problem.color}-100 backdrop-blur-sm`}>
                  <motion.div 
                    className="text-7xl mb-6"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {problem.emoji}
                  </motion.div>
                  <h4 className={`text-2xl font-bold text-${problem.color}-800 mb-3`}>{problem.title}</h4>
                  <p className={`text-${problem.color}-700 text-lg leading-relaxed`}>{problem.description}</p>
                  
                  {/* Animated border */}
                  <motion.div
                    className={`absolute inset-0 rounded-3xl border-2 border-${problem.color}-400 opacity-0 group-hover:opacity-100`}
                    initial={{ pathLength: 0 }}
                    whileHover={{ pathLength: 1 }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="p-8 bg-gradient-to-r from-blue-100 via-teal-100 to-green-100 rounded-3xl border-2 border-blue-200 shadow-lg backdrop-blur-sm"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <motion.p 
              className="text-2xl text-gray-800 font-semibold"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.span 
                className="text-blue-600 inline-block"
                whileHover={{ scale: 1.1 }}
              >
                🌊 Mangroves
              </motion.span> = 
              <motion.span 
                className="text-teal-600 mx-3 inline-block"
                whileHover={{ scale: 1.1 }}
              >
                Coastal Protection
              </motion.span> + 
              <motion.span 
                className="text-green-600 ml-3 inline-block"
                whileHover={{ scale: 1.1 }}
              >
                🌍 Carbon Storage
              </motion.span>
            </motion.p>
          </motion.div>
        </motion.div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-teal-50 via-blue-50 to-emerald-50 relative overflow-hidden">
        {/* Animated background grid */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{
            backgroundImage: `linear-gradient(45deg, #10b981 1px, transparent 1px),
                             linear-gradient(-45deg, #3b82f6 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}
        />

        <motion.div 
          className="max-w-5xl mx-auto text-center relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.h3 
            className="text-5xl font-bold mb-12 text-gray-800"
            variants={itemVariants}
          >
            Our Solution
          </motion.h3>
          
          <motion.div 
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-teal-100"
            variants={cardVariants}
            whileHover={{ scale: 1.02, rotateY: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10"
              variants={containerVariants}
            >
              {[
                {
                  emoji: "👥",
                  title: "Community Reports",
                  description: "Citizens, NGOs & fishermen report activities",
                  gradient: "from-blue-500 to-teal-500",
                  delay: 0
                },
                {
                  emoji: "🤖", 
                  title: "AI Validation",
                  description: "Smart algorithms verify and prioritize reports",
                  gradient: "from-purple-500 to-indigo-500",
                  delay: 0.2
                },
                {
                  emoji: "⚡",
                  title: "Government Action", 
                  description: "Real-time dashboard enables swift response",
                  gradient: "from-green-500 to-emerald-500",
                  delay: 0.4
                }
              ].map((step, index) => (
                <motion.div
                  key={step.title}
                  className="text-center group"
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <motion.div 
                    className={`w-20 h-20 bg-gradient-to-r ${step.gradient} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-300`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-3xl text-white">{step.emoji}</span>
                  </motion.div>
                  <h4 className="font-bold text-xl text-gray-800 mb-3">{step.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  
                  {/* Connection line */}
                  {index < 2 && (
                    <motion.div
                      className="hidden md:block absolute top-10 left-full w-10 h-0.5 bg-gradient-to-r from-gray-300 to-transparent"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      transition={{ delay: step.delay + 0.5, duration: 0.8 }}
                    />
                  )}
                </motion.div>
              ))}
            </motion.div>
            
            <motion.p 
              className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto"
              variants={itemVariants}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Our community-powered AI monitoring system creates a seamless bridge between 
              grassroots environmental awareness and official conservation action, ensuring 
              rapid response to threats against our blue carbon ecosystems.
            </motion.p>
          </motion.div>
        </motion.div>
      </section>

      {/* Impact Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-teal-600 text-white relative overflow-hidden">
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        <motion.div 
          className="max-w-5xl mx-auto text-center relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.h3 
            className="text-4xl font-bold mb-12"
            variants={itemVariants}
          >
            Why Blue Carbon Matters
          </motion.h3>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
          >
            {[
              {
                emoji: "🛡",
                title: "Coastal Protection",
                description: "Natural barriers against storms, floods, and erosion",
                delay: 0
              },
              {
                emoji: "💨",
                title: "Carbon Storage", 
                description: "Store 3-10x more carbon per hectare than forests",
                delay: 0.2
              }
            ].map((impact, index) => (
              <motion.div
                key={impact.title}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl group"
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="text-6xl mb-6"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  {impact.emoji}
                </motion.div>
                <h4 className="text-2xl font-bold mb-4">{impact.title}</h4>
                <p className="text-blue-100 text-lg leading-relaxed">{impact.description}</p>
                
                {/* Glowing border effect */}
                <motion.div
                  className="absolute inset-0 rounded-3xl border-2 border-white/40 opacity-0 group-hover:opacity-100"
                  initial={{ pathLength: 0 }}
                  whileHover={{ pathLength: 1 }}
                  transition={{ duration: 0.8 }}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 relative overflow-hidden">
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            background: [
              "radial-gradient(circle at 20% 20%, #10b981 0%, transparent 50%)",
              "radial-gradient(circle at 80% 80%, #3b82f6 0%, transparent 50%)",
              "radial-gradient(circle at 20% 80%, #10b981 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, #3b82f6 0%, transparent 50%)",
            ]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <motion.div 
          className="max-w-5xl mx-auto text-center px-6 relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div 
            className="mb-8"
            variants={itemVariants}
          >
            <motion.h2 
              className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              BlueRoots
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-300 mb-8"
              variants={itemVariants}
            >
              Together we can protect blue carbon ecosystems 🌍
            </motion.p>
            
            {/* Social proof / Call to action */}
            <motion.div 
              className="flex flex-wrap justify-center gap-6 mb-8"
              variants={containerVariants}
            >
              {[
                { label: "Communities", value: "500+", icon: "🏘️" },
                { label: "Reports", value: "2.5K+", icon: "📊" },
                { label: "Hectares Protected", value: "1.2K+", icon: "🌿" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-teal-400">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="border-t border-gray-700 pt-8"
            variants={itemVariants}
          >
            <p className="text-gray-400">
              © 2025 BlueRoots. Protecting our blue planet, one mangrove at a time.
            </p>
          </motion.div>
        </motion.div>
      </footer>
    </div>
  );
};

export default Layout;