import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Bot {
  id: number;
  name: string;
  position: { x: number; y: number; z: number };
  health: number;
}

interface ChatBoxProps {
  bots: Bot[];
  onClose: () => void;
}

interface ChatMessage {
  id: number;
  author: string;
  text: string;
  timestamp: Date;
}

const ChatBox = ({ bots, onClose }: ChatBoxProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const botMessages = [
    'привет всем!',
    'кто хочет в пвп?',
    'где алмазы?',
    'у кого есть еда?',
    'помогите пожалуйста',
    'классный сервер',
    'кто-то видел админа?',
    'пошли в шахту',
    'я нашел деревню!',
    'осторожно, тут криперы'
  ];

  useEffect(() => {
    inputRef.current?.focus();

    setMessages([
      { id: 1, author: 'Сервер', text: 'Добро пожаловать на сервер!', timestamp: new Date() }
    ]);

    const interval = setInterval(() => {
      if (bots.length > 0 && Math.random() > 0.6) {
        const randomBot = bots[Math.floor(Math.random() * bots.length)];
        const randomMessage = botMessages[Math.floor(Math.random() * botMessages.length)];
        
        setMessages(prev => [...prev, {
          id: Date.now(),
          author: randomBot.name,
          text: randomMessage,
          timestamp: new Date()
        }]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [bots]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        author: 'Ты',
        text: input,
        timestamp: new Date()
      }]);
      setInput('');
    }
  };

  return (
    <div className="absolute bottom-20 left-4 z-50">
      <Card className="bg-black/80 border-2 border-gray-600 p-4 w-96">
        <div className="text-white text-xl mb-3 pixel-text">Чат</div>
        
        <div className="h-48 overflow-y-auto mb-3 space-y-1">
          {messages.map((msg) => (
            <div key={msg.id} className="text-sm">
              <span className="text-gray-400 pixel-text">[{msg.timestamp.toLocaleTimeString()}]</span>
              {' '}
              <span className="text-yellow-400 pixel-text font-bold">{msg.author}:</span>
              {' '}
              <span className="text-white pixel-text">{msg.text}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage}>
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Введи сообщение..."
            className="bg-gray-800 border-gray-600 text-white pixel-text"
          />
        </form>

        <div className="text-center text-gray-400 text-xs pixel-text mt-2">
          ESC - закрыть
        </div>
      </Card>
    </div>
  );
};

export default ChatBox;
