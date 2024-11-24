import React from "react";

const Labels = () => {
  return (
    <div className="flex space-x-4">
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-700 shadow"></div>
        <span className="text-sm">Joe Rogan</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-700 shadow"></div>
        <span className="text-sm">Tristan Harris</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-700 shadow"></div>
        <span className="text-sm">Aza Raskin</span>
      </div>
    </div>
  );
};

export default Labels;
