import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LandingPage from './LandingPage';

const WelcomePage: React.FC = () => {
  const [showChat, setShowChat] = useState(false);

  if (showChat) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="p-4">
        <h1 className="text-2xl font-bold">Nomad</h1>
      </header>
      <div className="flex-grow flex flex-col justify-center items-center">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl font-bold mb-8"
        >
          Travel Made Personal
        </motion.h1>
        <motion.button
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          onClick={() => setShowChat(true)}
          className="px-6 py-3 bg-white text-black text-lg font-semibold rounded-full hover:bg-gray-200 transition"
        >
          Start Planning
        </motion.button>
      </div>
    </div>
  );
};

export default WelcomePage;