'use client';
import { useState } from 'react';
import ClinicalInfoModal from './ClinicalInfoModal';

export default function GlobalHeader() {
  const [openClinicalInfo, setOpenClinicalInfo] = useState(false);

  return (
    <>
      <div className="fixed top-4 right-4 z-40">
        <button 
          onClick={() => setOpenClinicalInfo(true)}
          className="bg-red-800 hover:bg-red-900 text-white text-xs font-bold rounded-lg px-4 py-2 shadow-lg transition-all"
        >
          Fundamentación
        </button>
      </div>
      <ClinicalInfoModal 
        open={openClinicalInfo} 
        onClose={() => setOpenClinicalInfo(false)} 
      />
    </>
  );
}