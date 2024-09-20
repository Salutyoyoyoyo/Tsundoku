'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';

type SearchBarProps = {
    placeholder?: string;
    onSearch: (searchTerm: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = "Rechercher...", onSearch }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);
        onSearch(newSearchTerm);
    };

    return (
        <div className="relative w-full ">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={handleInputChange}
                className="w-full pl-8 p-2 border border-gray-300 rounded text-sm"
            />
        </div>
    );
};

export default SearchBar;