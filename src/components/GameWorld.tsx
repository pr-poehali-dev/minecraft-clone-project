import { useState, useEffect, useRef } from 'react';
import Inventory from './Inventory';
import ChatBox from './ChatBox';
import CheatMenu from './CheatMenu';
import PlayerHand from './PlayerHand';

type Server = 'holyworld' | 'funtime' | 'hypixel';

interface GameWorldProps {
  server: Server;
  onBackToMenu: () => void;
}

interface Position {
  x: number;
  y: number;
  z: number;
}

interface Bot {
  id: number;
  name: string;
  position: Position;
  health: number;
}

const GameWorld = ({ server, onBackToMenu }: GameWorldProps) => {
  const [showInventory, setShowInventory] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showCheat, setShowCheat] = useState(false);
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: 0, y: 0, z: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [bots, setBots] = useState<Bot[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const initialBots: Bot[] = [
      { id: 1, name: 'Player_123', position: { x: 10, y: 0, z: 10 }, health: 100 },
      { id: 2, name: 'NoobMaster', position: { x: -15, y: 0, z: 5 }, health: 100 },
      { id: 3, name: 'ProGamer777', position: { x: 5, y: 0, z: -20 }, health: 100 }
    ];
    setBots(initialBots);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'e' || e.key === 'у' || e.key === 'E' || e.key === 'У') {
        e.preventDefault();
        setShowInventory(!showInventory);
        setShowChat(false);
        setShowCheat(false);
      }
      if (e.key === 't' || e.key === 'е' || e.key === 'T' || e.key === 'Е') {
        e.preventDefault();
        setShowChat(!showChat);
        setShowInventory(false);
        setShowCheat(false);
      }
      if (e.key === 'n' || e.key === 'т' || e.key === 'N' || e.key === 'Т') {
        e.preventDefault();
        setShowCheat(!showCheat);
        setShowInventory(false);
        setShowChat(false);
      }
      if (e.key === 'Escape') {
        setShowInventory(false);
        setShowChat(false);
        setShowCheat(false);
      }

      const speed = 1;
      if (e.key === 'w' || e.key === 'ц' || e.key === 'W' || e.key === 'Ц') {
        setPlayerPosition(prev => ({ ...prev, z: prev.z + speed }));
      }
      if (e.key === 's' || e.key === 'ы' || e.key === 'S' || e.key === 'Ы') {
        setPlayerPosition(prev => ({ ...prev, z: prev.z - speed }));
      }
      if (e.key === 'a' || e.key === 'ф' || e.key === 'A' || e.key === 'Ф') {
        setPlayerPosition(prev => ({ ...prev, x: prev.x - speed }));
      }
      if (e.key === 'd' || e.key === 'в' || e.key === 'D' || e.key === 'В') {
        setPlayerPosition(prev => ({ ...prev, x: prev.x + speed }));
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [showInventory, showChat, showCheat]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const drawWorld = () => {
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#228B22';
      ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

      const gridSize = 50;
      ctx.strokeStyle = '#1a5c1a';
      ctx.lineWidth = 2;
      
      for (let i = 0; i < canvas.width; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, canvas.height / 2);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      
      for (let i = canvas.height / 2; i < canvas.height; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      bots.forEach(bot => {
        const screenX = canvas.width / 2 + (bot.position.x - playerPosition.x) * 20;
        const screenY = canvas.height / 2 + (bot.position.z - playerPosition.z) * 10;

        ctx.fillStyle = '#8B4513';
        ctx.fillRect(screenX - 15, screenY - 60, 30, 40);
        
        ctx.fillStyle = '#FFA07A';
        ctx.fillRect(screenX - 12, screenY - 80, 24, 24);

        ctx.fillStyle = 'white';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(bot.name, screenX, screenY - 85);
        
        ctx.fillStyle = bot.health > 50 ? '#4CAF50' : '#ff4444';
        ctx.fillRect(screenX - 15, screenY - 90, 30, 4);
        ctx.fillStyle = '#333';
        ctx.fillRect(screenX - 15 + (30 * bot.health / 100), screenY - 90, 30 - (30 * bot.health / 100), 4);
      });
    };

    drawWorld();
  }, [playerPosition, bots]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />

      <div className="absolute top-4 left-4 bg-black/70 text-white p-3 rounded pixel-text">
        <div>Сервер: {server.toUpperCase()}</div>
        <div>X: {playerPosition.x.toFixed(1)} Y: {playerPosition.y.toFixed(1)} Z: {playerPosition.z.toFixed(1)}</div>
        <div className="text-gray-400 text-xs mt-2">WASD - движение | E - инвентарь | T - чат | N - читы</div>
      </div>

      <div className="absolute top-4 right-4">
        <button
          onClick={onBackToMenu}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded pixel-text"
        >
          Выйти
        </button>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="w-8 h-8 border-2 border-white"></div>
      </div>

      <PlayerHand />

      {showInventory && <Inventory onClose={() => setShowInventory(false)} />}
      {showChat && <ChatBox bots={bots} onClose={() => setShowChat(false)} />}
      {showCheat && <CheatMenu onClose={() => setShowCheat(false)} />}
    </div>
  );
};

export default GameWorld;
