import React from 'react';

const MetricsCard = ({ title, count, icon, isAdmin }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between transition-transform duration-300 hover:scale-[1.02] border border-gray-100">
            <div className="flex items-center">
                {/* Icon Circle */}
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mr-4 shadow-inner">
                    <img src={icon} alt={`${title} icon`} className="w-6 h-6 text-blue-600" />
                </div>
                
                {/* Count and Title */}
                <div>
                    <p className="text-lg font-medium text-gray-500">{title}</p>
                    <p className="text-3xl font-extrabold text-gray-900">{count}</p>
                </div>
            </div>

            {/* Admin Tag for Doctors Card (if applicable) */}
            {isAdmin && (
                <span className="text-xs font-semibold text-white bg-green-500 px-3 py-1 rounded-full shadow-md">
                    Admin
                </span>
            )}
        </div>
    );
};

export default MetricsCard;