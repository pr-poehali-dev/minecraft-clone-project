import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';

type Server = 'holyworld' | 'funtime' | 'hypixel';

interface MainMenuProps {
  onServerSelect: (server: Server) => void;
}

const MainMenu = ({ onServerSelect }: MainMenuProps) => {
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

  const servers = [
    { id: 'holyworld' as Server, name: 'HolyWorld', players: '1,234', color: 'from-yellow-600 to-orange-600' },
    { id: 'funtime' as Server, name: 'FunTime', players: '892', color: 'from-purple-600 to-pink-600' },
    { id: 'hypixel' as Server, name: 'Hypixel', players: '5,678', color: 'from-green-600 to-emerald-600' }
  ];

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

      <div className="w-full max-w-2xl space-y-6 relative z-10">
        <h2 className="text-2xl text-cyan-300 mb-8 text-center pixel-text">
          ⚔ Выбери сервер ⚔
        </h2>
        
        {servers.map((server, index) => (
          <Card
            key={server.id}
            className="server-card bg-gradient-to-r from-gray-900 to-gray-800 border-2 border-gray-700 hover:border-green-500 cursor-pointer p-6 transform hover:scale-105 transition-all duration-300"
            onClick={() => onServerSelect(server.id)}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${server.color} animate-pulse`}></div>
                <div>
                  <h3 className="text-2xl font-bold text-white pixel-text mb-2">{server.name}</h3>
                  <p className="text-green-400 pixel-text text-sm">
                    ● Онлайн: {server.players}
                  </p>
                </div>
              </div>
              <Button 
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white pixel-text px-6 py-3 text-sm shadow-lg hover:shadow-green-500/50 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  onServerSelect(server.id);
                }}
              >
                ▶ Играть
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-gray-600 text-xs pixel-text relative z-10">
        v1.0.0 | Minecraft Clone
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-900/20 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default MainMenu;