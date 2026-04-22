import React from 'react';
import quotes from '../data/quotes.json';

const QuotesPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 font-sans">
      <div className="space-y-6">
        {quotes.map((quote) => (
          <div key={quote.id} className="flex gap-4 items-start">
            <span className="text-gray-500 min-w-[30px] font-mono text-sm mt-1">{quote.id}.</span>
            <p className="text-gray-900 text-lg leading-relaxed">
              {quote.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuotesPage;
