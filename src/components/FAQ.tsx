import React, { useState } from 'react';
import { FAQItem } from '../types';

interface FAQProps {
  faqItems: FAQItem[];
}

const FAQ: React.FC<FAQProps> = ({ faqItems }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section my-8">
      <h2 className="text-3xl font-bold mb-6 text-primary">Frequently Asked Questions</h2>
      {faqItems.map((item, index) => (
        <div key={index} className="mb-4">
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full text-left p-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-expanded={openIndex === index}
          >
            <span className="font-semibold text-lg text-primary-foreground">{item.question}</span>
            <span className="float-right text-xl">{openIndex === index ? '−' : '+'}</span>
          </button>
          {openIndex === index && (
            <div 
              className="mt-2 p-4 bg-white rounded-lg shadow-inner"
              dangerouslySetInnerHTML={{ __html: item.answer }}
            />
          )}
        </div>
      ))}
    </section>
  );
};

export default FAQ;
