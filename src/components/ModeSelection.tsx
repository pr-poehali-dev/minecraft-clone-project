import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface ModeSelectionProps {
  onModeSelect: (mode: 'singleplayer' | 'multiplayer') => void;
}

const ModeSelection = ({ onModeSelect }: ModeSelectionProps) => {
  const [stars, setStars] = useState<Array<{ id: number; left: string; top: string; delay: string }>>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black p-8 relative overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: star.left,
            top: star.top,
            animationDelay: star.delay
          }}
        />
      ))}

      <div className="mb-16 text-center relative z-10 float-animation">
        <h1 className="text-7xl font-bold text-cyan-400 mb-6 minecraft-title glow-effect">
          NURSULTAN
        </h1>
        <div className="h-2 w-96 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto rounded-full"></div>
      </div>

      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        <Card
          className="server-card bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-4 border-green-500 cursor-pointer p-8 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/50"
          onClick={() => onModeSelect('singleplayer')}
        >
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">🎮</div>
            <h2 className="text-3xl font-bold text-green-400 pixel-text mb-4">
              Одиночная игра
            </h2>
            <p className="text-gray-300 pixel-text text-xs mb-6">
              Играй один в своем мире
            </p>
            <Button 
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white pixel-text py-6 text-sm shadow-lg hover:shadow-green-500/50 transition-all"
              onClick={() => onModeSelect('singleplayer')}
            >
              ▶ Начать игру
            </Button>
          </div>
        </Card>

        <Card
          className="server-card bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-4 border-purple-500 cursor-pointer p-8 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/50"
          onClick={() => onModeSelect('multiplayer')}
        >
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">🌐</div>
            <h2 className="text-3xl font-bold text-purple-400 pixel-text mb-4">
              Мультиплеер
            </h2>
            <p className="text-gray-300 pixel-text text-xs mb-6">
              Играй с друзьями на серверах
            </p>
            <Button 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white pixel-text py-6 text-sm shadow-lg hover:shadow-purple-500/50 transition-all"
              onClick={() => onModeSelect('multiplayer')}
            >
              ▶ Выбрать сервер
            </Button>
          </div>
        </Card>
      </div>

      <div className="mt-16 text-gray-600 text-xs pixel-text relative z-10">
        v1.0.0 | Minecraft Clone
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cyan-900/20 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default ModeSelection;
