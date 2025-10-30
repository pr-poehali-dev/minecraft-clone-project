import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

interface CheatMenuProps {
  onClose: () => void;
}

const CheatMenu = ({ onClose }: CheatMenuProps) => {
  const [killAura, setKillAura] = useState(false);
  const [triggerBot, setTriggerBot] = useState(false);
  const [speed, setSpeed] = useState(false);
  const [fly, setFly] = useState(false);
  const [xray, setXray] = useState(false);
  const [reach, setReach] = useState([3]);

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <Card className="bg-gray-900 border-4 border-green-600 p-6 w-96">
        <div className="text-green-400 text-2xl mb-6 pixel-text text-center">⚡ ЧИТ МЕНЮ ⚡</div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
            <div>
              <div className="text-white pixel-text">KillAura</div>
              <div className="text-gray-400 text-xs pixel-text">Авто-атака врагов</div>
            </div>
            <Switch
              checked={killAura}
              onCheckedChange={setKillAura}
              className="data-[state=checked]:bg-green-600"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
            <div>
              <div className="text-white pixel-text">TriggerBot</div>
              <div className="text-gray-400 text-xs pixel-text">Авто-клик по прицелу</div>
            </div>
            <Switch
              checked={triggerBot}
              onCheckedChange={setTriggerBot}
              className="data-[state=checked]:bg-green-600"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
            <div>
              <div className="text-white pixel-text">Speed</div>
              <div className="text-gray-400 text-xs pixel-text">Быстрый бег</div>
            </div>
            <Switch
              checked={speed}
              onCheckedChange={setSpeed}
              className="data-[state=checked]:bg-green-600"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
            <div>
              <div className="text-white pixel-text">Fly</div>
              <div className="text-gray-400 text-xs pixel-text">Режим полета</div>
            </div>
            <Switch
              checked={fly}
              onCheckedChange={setFly}
              className="data-[state=checked]:bg-green-600"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
            <div>
              <div className="text-white pixel-text">X-Ray</div>
              <div className="text-gray-400 text-xs pixel-text">Видеть сквозь блоки</div>
            </div>
            <Switch
              checked={xray}
              onCheckedChange={setXray}
              className="data-[state=checked]:bg-green-600"
            />
          </div>

          <div className="p-3 bg-gray-800 rounded">
            <div className="text-white pixel-text mb-2">Reach: {reach[0]} блоков</div>
            <Slider
              value={reach}
              onValueChange={setReach}
              min={3}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="text-gray-400 text-xs pixel-text mt-1">Дальность атаки</div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="text-green-400 pixel-text text-sm">
            {killAura && '⚡ KillAura активен '}
            {triggerBot && '⚡ TriggerBot активен '}
            {speed && '⚡ Speed активен '}
          </div>
          <div className="text-gray-400 text-xs pixel-text mt-3">
            Нажми N или ESC чтобы закрыть
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CheatMenu;
