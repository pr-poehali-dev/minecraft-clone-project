const PlayerHand = () => {
  return (
    <div className="absolute bottom-0 right-12 pointer-events-none">
      <svg width="200" height="300" viewBox="0 0 200 300" className="transform rotate-12">
        <rect x="60" y="180" width="40" height="100" fill="#C4A57B" />
        
        <rect x="60" y="280" width="30" height="15" fill="#8B6F47" />
        
        <rect x="30" y="280" width="15" height="20" fill="#8B6F47" />
        <rect x="45" y="285" width="15" height="15" fill="#8B6F47" />
        <rect x="90" y="280" width="15" height="20" fill="#8B6F47" />
        <rect x="105" y="285" width="15" height="15" fill="#8B6F47" />
        
        <rect x="50" y="150" width="60" height="40" fill="#8B4513" />
        <rect x="70" y="145" width="20" height="10" fill="#654321" />
      </svg>
    </div>
  );
};

export default PlayerHand;
