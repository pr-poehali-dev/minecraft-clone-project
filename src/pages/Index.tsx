import { useState } from 'react';
import MainMenu from '@/components/MainMenu';
import GameWorld from '@/components/GameWorld';

type GameState = 'menu' | 'playing';
type Server = 'holyworld' | 'funtime' | 'hypixel';

const Index = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);

  const handleServerSelect = (server: Server) => {
    setSelectedServer(server);
    setGameState('playing');
  };

  const handleBackToMenu = () => {
    setGameState('menu');
    setSelectedServer(null);
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-black">
      {gameState === 'menu' ? (
        <MainMenu onServerSelect={handleServerSelect} />
      ) : (
        <GameWorld server={selectedServer!} onBackToMenu={handleBackToMenu} />
      )}
    </div>
  );
};

export default Index;