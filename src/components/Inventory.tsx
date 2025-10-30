import { Card } from '@/components/ui/card';

interface InventoryProps {
  onClose: () => void;
}

const Inventory = ({ onClose }: InventoryProps) => {
  const slots = Array.from({ length: 36 }, (_, i) => i);
  
  const items = [
    { slot: 0, name: 'Dirt', count: 64 },
    { slot: 1, name: 'Stone', count: 32 },
    { slot: 2, name: 'Wood', count: 16 },
    { slot: 9, name: 'Diamond Sword', count: 1 },
    { slot: 10, name: 'Diamond Pickaxe', count: 1 }
  ];

  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
      <Card className="bg-gray-800 border-4 border-gray-600 p-6 w-[600px]">
        <div className="text-white text-2xl mb-6 pixel-text text-center">Инвентарь</div>
        
        <div className="grid grid-cols-9 gap-1 mb-4">
          {slots.map((slot) => {
            const item = items.find(i => i.slot === slot);
            return (
              <div
                key={slot}
                className="w-14 h-14 bg-gray-700 border-2 border-gray-500 flex items-center justify-center hover:bg-gray-600 transition-colors relative"
              >
                {item && (
                  <>
                    <div className="text-white pixel-text text-xs text-center">
                      {item.name.slice(0, 4)}
                    </div>
                    <div className="absolute bottom-1 right-1 text-white text-xs pixel-text">
                      {item.count}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center text-gray-400 text-sm pixel-text mt-4">
          Нажми ESC чтобы закрыть
        </div>
      </Card>
    </div>
  );
};

export default Inventory;
