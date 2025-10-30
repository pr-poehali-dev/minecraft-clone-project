import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type Server = 'holyworld' | 'funtime' | 'hypixel';

interface MainMenuProps {
  onServerSelect: (server: Server) => void;
}

const MainMenu = ({ onServerSelect }: MainMenuProps) => {
  const servers = [
    { id: 'holyworld' as Server, name: 'HolyWorld', players: '1,234' },
    { id: 'funtime' as Server, name: 'FunTime', players: '892' },
    { id: 'hypixel' as Server, name: 'Hypixel', players: '5,678' }
  ];

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-black p-8">
      <div className="mb-12 text-center">
        <h1 className="text-7xl font-bold text-white mb-4 tracking-wider pixel-text">
          NURSULTAN
        </h1>
        <div className="h-1 w-64 bg-green-500 mx-auto"></div>
      </div>

      <div className="w-full max-w-2xl space-y-4">
        <h2 className="text-2xl text-gray-300 mb-6 text-center pixel-text">Выбери сервер</h2>
        
        {servers.map((server) => (
          <Card
            key={server.id}
            className="bg-gray-900 border-2 border-gray-700 hover:border-green-500 transition-all cursor-pointer p-6"
            onClick={() => onServerSelect(server.id)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-white pixel-text">{server.name}</h3>
                <p className="text-gray-400 pixel-text">Игроков онлайн: {server.players}</p>
              </div>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white pixel-text"
                onClick={() => onServerSelect(server.id)}
              >
                Играть
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-gray-500 text-sm pixel-text">
        Версия 1.0.0
      </div>
    </div>
  );
};

export default MainMenu;
