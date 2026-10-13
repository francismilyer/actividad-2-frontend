import { HiPlus } from 'react-icons/hi';

export default function PageHeader({ title, buttonText, onButtonClick }) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-[#0D47A1]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        {title}
      </h1>
      {buttonText && (
        <button 
          onClick={onButtonClick}
          className="bg-[#2196F3] hover:bg-[#0D47A1] text-white px-4 py-2 rounded-lg flex items-center transition-colors font-medium shadow-sm"
        >
          <HiPlus className="w-5 h-5 mr-2" /> 
          {buttonText}
        </button>
      )}
    </div>
  );
}