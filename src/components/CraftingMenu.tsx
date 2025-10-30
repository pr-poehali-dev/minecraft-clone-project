import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CraftingMenuProps {
  onClose: () => void;
  onCraft: (item: string) => void;
}

interface Recipe {
  name: string;
  icon: string;
  materials: { name: string; count: number }[];
  category: string;
}

const CraftingMenu = ({ onClose, onCraft }: CraftingMenuProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('tools');

  const recipes: Recipe[] = [
    { name: 'Wooden Pickaxe', icon: '⛏️', materials: [{ name: 'Wood', count: 3 }, { name: 'Stick', count: 2 }], category: 'tools' },
    { name: 'Stone Pickaxe', icon: '⛏️', materials: [{ name: 'Stone', count: 3 }, { name: 'Stick', count: 2 }], category: 'tools' },
    { name: 'Iron Pickaxe', icon: '⛏️', materials: [{ name: 'Iron', count: 3 }, { name: 'Stick', count: 2 }], category: 'tools' },
    { name: 'Diamond Pickaxe', icon: '⛏️', materials: [{ name: 'Diamond', count: 3 }, { name: 'Stick', count: 2 }], category: 'tools' },
    
    { name: 'Wooden Axe', icon: '🪓', materials: [{ name: 'Wood', count: 3 }, { name: 'Stick', count: 2 }], category: 'tools' },
    { name: 'Stone Axe', icon: '🪓', materials: [{ name: 'Stone', count: 3 }, { name: 'Stick', count: 2 }], category: 'tools' },
    { name: 'Iron Axe', icon: '🪓', materials: [{ name: 'Iron', count: 3 }, { name: 'Stick', count: 2 }], category: 'tools' },
    
    { name: 'Wooden Shovel', icon: '⛏', materials: [{ name: 'Wood', count: 1 }, { name: 'Stick', count: 2 }], category: 'tools' },
    { name: 'Stone Shovel', icon: '⛏', materials: [{ name: 'Stone', count: 1 }, { name: 'Stick', count: 2 }], category: 'tools' },
    
    { name: 'Wooden Sword', icon: '⚔️', materials: [{ name: 'Wood', count: 2 }, { name: 'Stick', count: 1 }], category: 'weapons' },
    { name: 'Stone Sword', icon: '⚔️', materials: [{ name: 'Stone', count: 2 }, { name: 'Stick', count: 1 }], category: 'weapons' },
    { name: 'Iron Sword', icon: '⚔️', materials: [{ name: 'Iron', count: 2 }, { name: 'Stick', count: 1 }], category: 'weapons' },
    { name: 'Diamond Sword', icon: '⚔️', materials: [{ name: 'Diamond', count: 2 }, { name: 'Stick', count: 1 }], category: 'weapons' },
    
    { name: 'Leather Helmet', icon: '🪖', materials: [{ name: 'Leather', count: 5 }], category: 'armor' },
    { name: 'Leather Chestplate', icon: '🦺', materials: [{ name: 'Leather', count: 8 }], category: 'armor' },
    { name: 'Leather Leggings', icon: '👖', materials: [{ name: 'Leather', count: 7 }], category: 'armor' },
    { name: 'Leather Boots', icon: '👢', materials: [{ name: 'Leather', count: 4 }], category: 'armor' },
    
    { name: 'Iron Helmet', icon: '🪖', materials: [{ name: 'Iron', count: 5 }], category: 'armor' },
    { name: 'Iron Chestplate', icon: '🦺', materials: [{ name: 'Iron', count: 8 }], category: 'armor' },
    { name: 'Iron Leggings', icon: '👖', materials: [{ name: 'Iron', count: 7 }], category: 'armor' },
    { name: 'Iron Boots', icon: '👢', materials: [{ name: 'Iron', count: 4 }], category: 'armor' },
    
    { name: 'Diamond Helmet', icon: '🪖', materials: [{ name: 'Diamond', count: 5 }], category: 'armor' },
    { name: 'Diamond Chestplate', icon: '🦺', materials: [{ name: 'Diamond', count: 8 }], category: 'armor' },
    { name: 'Diamond Leggings', icon: '👖', materials: [{ name: 'Diamond', count: 7 }], category: 'armor' },
    { name: 'Diamond Boots', icon: '👢', materials: [{ name: 'Diamond', count: 4 }], category: 'armor' }
  ];

  const categories = [
    { id: 'tools', name: 'Инструменты', icon: '⛏️' },
    { id: 'weapons', name: 'Оружие', icon: '⚔️' },
    { id: 'armor', name: 'Броня', icon: '🛡️' }
  ];

  const filteredRecipes = recipes.filter(r => r.category === selectedCategory);

  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 pointer-events-auto">
      <Card className="bg-gray-800 border-4 border-cyan-500 p-6 w-[800px] max-h-[80vh] overflow-hidden">
        <div className="text-white text-2xl mb-6 pixel-text text-center text-cyan-400">
          ⚒️ Крафтинг ⚒️
        </div>

        <div className="flex gap-2 mb-6">
          {categories.map(cat => (
            <Button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`pixel-text text-xs ${
                selectedCategory === cat.id
                  ? 'bg-cyan-600 hover:bg-cyan-700'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {cat.icon} {cat.name}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto mb-4">
          {filteredRecipes.map((recipe) => (
            <Card
              key={recipe.name}
              className="bg-gray-900 border-2 border-gray-700 p-4 hover:border-cyan-500 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="text-3xl">{recipe.icon}</div>
                <div className="text-white pixel-text text-sm">{recipe.name}</div>
              </div>
              
              <div className="text-gray-400 text-xs pixel-text mb-3">
                Нужно:
              </div>
              
              <div className="space-y-1 mb-3">
                {recipe.materials.map((mat, idx) => (
                  <div key={idx} className="text-green-400 text-xs pixel-text">
                    • {mat.name} x{mat.count}
                  </div>
                ))}
              </div>

              <Button
                onClick={() => {
                  onCraft(recipe.name);
                  onClose();
                }}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white pixel-text text-xs py-2"
              >
                Создать
              </Button>
            </Card>
          ))}
        </div>

        <div className="text-center text-gray-400 text-xs pixel-text mt-4">
          Нажми ESC чтобы закрыть
        </div>
      </Card>
    </div>
  );
};

export default CraftingMenu;
