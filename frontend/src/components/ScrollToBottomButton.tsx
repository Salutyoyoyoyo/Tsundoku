import React from 'react';
import { ChevronDown } from 'lucide-react';

type ScrollToBottomButtonProps = {
    onClick: () => void;
};

const ScrollToBottomButton: React.FC<ScrollToBottomButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-24 right-14 p-2 bg-gray-500 bg-opacity-50  rounded-full cursor-pointer">
            <ChevronDown className="w-5 h-5 text-white"/>
        </button>
    );
};

export default ScrollToBottomButton;