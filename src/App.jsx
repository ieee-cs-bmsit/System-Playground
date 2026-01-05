import React from 'react';

function App() {
    return (
        <div className="min-h-screen bg-comic-cream relative overflow-hidden">
            {/* Background Patterns */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,#ff44cc_2px,transparent_2px)] [background-size:24px_24px] opacity-20 pointer-events-none"></div>

            <div className="container mx-auto px-4 py-8 relative z-10">
                {/* Navigation */}
                <nav className="flex justify-between items-center mb-16">
                    <div className="text-2xl font-comic bg-comic-yellow border-4 border-black px-4 py-1 shadow-comic transform -rotate-2">
                        System Builder
                    </div>
                    <div className="flex gap-4">
                        <button className="font-comic text-xl hover:text-comic-pink transition-colors">Tutorials</button>
                        <button className="font-comic text-xl hover:text-comic-pink transition-colors">Docs</button>
                    </div>
                </nav>

                {/* Hero Section */}
                <main className="flex flex-col items-center justify-center text-center mt-12 gap-8">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-comic-blue skew-y-3 border-4 border-black shadow-comic-lg z-0"></div>
                        <h1 className="relative z-10 text-6xl md:text-8xl font-comic text-white text-stroke-black drop-shadow-[4px_4px_0_#000]">
                            Interactive Visual <br /> System Builder
                        </h1>
                    </div>

                    <p className="text-2xl md:text-3xl font-body font-bold mt-8 max-w-2xl bg-white border-4 border-black px-6 py-4 shadow-comic rotate-1">
                        Drag, Drop, and Understand how Computers Work!
                    </p>

                    <div className="mt-12 flex gap-8">
                        <button className="bg-comic-yellow text-4xl px-8 py-4 font-comic border-4 border-black shadow-comic-lg hover:translate-x-1 hover:translate-y-1 hover:shadow-comic transition-all active:translate-x-2 active:translate-y-2 active:shadow-none">
                            Start Building!
                        </button>
                        <button className="bg-white text-4xl px-8 py-4 font-comic border-4 border-black shadow-comic-lg hover:translate-x-1 hover:translate-y-1 hover:shadow-comic transition-all text-comic-pink group">
                            <span className="group-hover:underline">Demo</span>
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default App;
