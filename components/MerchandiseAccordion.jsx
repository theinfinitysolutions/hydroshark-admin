'use client';
import React, { useState } from 'react';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';
import { TbHanger } from 'react-icons/tb';
import { IoColorPaletteOutline } from 'react-icons/io5';
import GymwearTypesManager from './GymwearTypesManager';
import ProductColorsManager from './ProductColorsManager';

const AccordionSection = ({ title, icon: Icon, children, isExpanded, onToggle }) => {
  return (
    <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
      <button
        className={`w-full px-6 py-4 flex items-center justify-between transition-colors ${
          isExpanded ? 'bg-gray-50' : 'hover:bg-gray-50'
        }`}
        onClick={onToggle}
      >
        <div className='flex items-center gap-3'>
          <Icon className={`text-xl ${isExpanded ? 'text-blue-600' : 'text-gray-500'}`} />
          <h3 className={`text-lg font-medium ${isExpanded ? 'text-blue-600' : 'text-gray-900'}`}>{title}</h3>
        </div>
        {isExpanded ? <MdExpandLess className='text-2xl' /> : <MdExpandMore className='text-2xl' />}
      </button>

      {isExpanded && (
        <div className='px-6 py-4 border-t border-gray-200 max-h-[40vh] overflow-y-scroll'>{children}</div>
      )}
    </div>
  );
};

const MerchandiseAccordion = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const sections = [
    {
      id: 'gymwear-types',
      title: 'Gymwear Types',
      icon: TbHanger,
      component: <GymwearTypesManager />,
    },
    {
      id: 'product-colors',
      title: 'Product Colors',
      icon: IoColorPaletteOutline,
      component: <ProductColorsManager />,
    },
  ];

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <div className='w-full max-w-5xl mx-auto space-y-4'>
      {sections.map((section) => (
        <AccordionSection
          key={section.id}
          title={section.title}
          icon={section.icon}
          isExpanded={expandedSection === section.id}
          onToggle={() => toggleSection(section.id)}
        >
          {section.component}
        </AccordionSection>
      ))}
    </div>
  );
};

export default MerchandiseAccordion;
