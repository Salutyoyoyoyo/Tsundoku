import React from 'react';
import {Home, User, BookOpen, Trophy, MessageCircle, Users, PenTool} from 'lucide-react';

export default function Sidebar() {
    return (
        <div className="fixed min-h-screen w-52 bg-gray-900 text-white flex flex-col left-0">
            <div className="flex items-center justify-center h-20 border-b border-gray-900">
                <h1 className="text-2xl">tsundoku</h1>
            </div>

            <div className="px-6 py-4">
                <div className="flex items-center bg-gray-800 rounded-lg">
                    <input
                        type="text"
                        placeholder="Explorer"
                        className="ml-3 bg-transparent focus:outline-none text-white p-1"
                    />
                </div>
                <div className="flex items-center justify-around mb-4 mt-4">
                    <div className="bg-gray-700 p-3 rounded-lg cursor-pointer -mr-5">
                        <Home className="text-white"/>
                    </div>
                    <div className="bg-gray-700 p-3 rounded-lg cursor-pointer -ml-5">
                        <User className="text-white"/>
                    </div>
                </div>
            </div>

            <nav className="flex-grow px-6 mt-6">
                <ul className="space-y-4">
                    <li>
                        <a href="#" className="flex items-center text-gray-400 hover:text-white">
                            <BookOpen className="mr-3"/>
                            <span>Étagères</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center text-gray-400 hover:text-white">
                            <Trophy className="mr-3"/>
                            <span>Défis</span>
                        </a>
                    </li>
                    <li>
                        <a href="/conversations" className="flex items-center text-gray-400 hover:text-white">
                            <MessageCircle className="mr-3"/>
                            <span>Messages</span>
                            <span
                                className="ml-auto bg-red-500 text-xs rounded-full h-4 w-4 flex items-center justify-center text-white">
                                5
                            </span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center text-gray-400 hover:text-white">
                            <Users className="mr-3"/>
                            <span>Clubs</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center text-gray-400 hover:text-white">
                            <PenTool className="mr-3"/>
                            <span>Articles</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}