const PlayerHand = () => {
  return (
    <div className="absolute bottom-0 right-12 pointer-events-none minecraft-block">
      <svg width="250" height="350" viewBox="0 0 200 300" className="transform rotate-12 drop-shadow-2xl">
        <defs>
          <filter id="pixelate">
            <feFlood x="0" y="0" height="1" width="1"/>
          </filter>
        </defs>
        
        <rect x="60" y="180" width="40" height="100" fill="#C4A57B" stroke="#8B6F47" strokeWidth="1"/>
        <rect x="62" y="182" width="8" height="96" fill="#D4B58B" opacity="0.5"/>
        
        <rect x="60" y="280" width="30" height="15" fill="#8B6F47" stroke="#654321" strokeWidth="1"/>
        
        <rect x="30" y="280" width="15" height="20" fill="#8B6F47" stroke="#654321" strokeWidth="1"/>
        <rect x="45" y="285" width="15" height="15" fill="#8B6F47" stroke="#654321" strokeWidth="1"/>
        <rect x="90" y="280" width="15" height="20" fill="#8B6F47" stroke="#654321" strokeWidth="1"/>
        <rect x="105" y="285" width="15" height="15" fill="#8B6F47" stroke="#654321" strokeWidth="1"/>
        
        <rect x="50" y="150" width="60" height="40" fill="#8B4513" stroke="#654321" strokeWidth="2"/>
        <rect x="52" y="152" width="56" height="8" fill="#A0662F" opacity="0.6"/>
        <rect x="70" y="145" width="20" height="10" fill="#654321" stroke="#3d2817" strokeWidth="1"/>
        
        <rect x="55" y="165" width="10" height="10" fill="#654321"/>
        <rect x="85" y="165" width="10" height="10" fill="#654321"/>
        
        <circle cx="80" cy="135" r="3" fill="#4FC3F7" opacity="0.8" className="animate-pulse"/>
        <circle cx="90" cy="140" r="2" fill="#81D4FA" opacity="0.6" className="animate-pulse"/>
      </svg>
    </div>
  );
};

export default PlayerHand;