import { useState } from 'react';
import ModeSelection from '@/components/ModeSelection';
import MainMenu from '@/components/MainMenu';
import Game3D from '@/components/Game3D';

type GameState = 'mode-select' | 'server-select' | 'playing';
type Server = 'holyworld' | 'funtime' | 'hypixel';
type GameMode = 'singleplayer' | 'multiplayer';

const Index = () => {
  const [gameState, setGameState] = useState<GameState>('mode-select');
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);

  const handleModeSelect = (mode: GameMode) => {
    setGameMode(mode);
    if (mode === 'singleplayer') {
      setGameState('playing');
    } else {
      setGameState('server-select');
    }
  };

  const handleServerSelect = (server: Server) => {
    setSelectedServer(server);
    setGameState('playing');
  };

  const handleBackToMenu = () => {
    setGameState('mode-select');
    setGameMode(null);
    setSelectedServer(null);
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-black">
      {gameState === 'mode-select' && (
        <ModeSelection onModeSelect={handleModeSelect} />
      )}
      {gameState === 'server-select' && (
        <MainMenu onServerSelect={handleServerSelect} />
      )}
      {gameState === 'playing' && (
        <Game3D 
          mode={gameMode!} 
          server={selectedServer || undefined} 
          onBackToMenu={handleBackToMenu} 
        />
      )}
    </div>
  );
};

export default Index;