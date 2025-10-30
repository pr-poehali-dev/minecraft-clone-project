import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Inventory from './Inventory';
import ChatBox from './ChatBox';
import CheatMenu from './CheatMenu';

interface Game3DProps {
  mode: 'singleplayer' | 'multiplayer';
  server?: string;
  onBackToMenu: () => void;
}

interface Bot {
  id: number;
  name: string;
  position: { x: number; y: number; z: number };
  health: number;
  mesh?: THREE.Mesh;
}

const Game3D = ({ mode, server, onBackToMenu }: Game3DProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [showInventory, setShowInventory] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showCheat, setShowCheat] = useState(false);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 5, z: 0 });
  const [bots, setBots] = useState<Bot[]>([]);
  const [breakingBlock, setBreakingBlock] = useState<THREE.Mesh | null>(null);
  const [breakProgress, setBreakProgress] = useState(0);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.Fog(0x87CEEB, 0, 150);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const blocks: THREE.Mesh[] = [];
    const blockSize = 2;

    const grassTexture = new THREE.TextureLoader().load('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
    const grassMaterial = new THREE.MeshLambertMaterial({ color: 0x4CAF50 });
    const dirtMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const stoneMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });

    for (let x = -20; x < 20; x++) {
      for (let z = -20; z < 20; z++) {
        const height = Math.floor(Math.sin(x * 0.1) * Math.cos(z * 0.1) * 2);
        
        for (let y = -2; y <= height; y++) {
          let material = stoneMaterial;
          if (y === height) material = grassMaterial;
          else if (y === height - 1) material = dirtMaterial;

          const geometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
          const block = new THREE.Mesh(geometry, material);
          block.position.set(x * blockSize, y * blockSize, z * blockSize);
          block.castShadow = true;
          block.receiveShadow = true;
          scene.add(block);
          blocks.push(block);
        }
      }
    }

    const velocity = { x: 0, y: 0, z: 0 };
    const speed = 0.3;
    const gravity = -0.02;
    const keys: { [key: string]: boolean } = {};
    let isGrounded = false;

    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 100;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 100;
      particlePositions[i + 1] = Math.random() * 50;
      particlePositions[i + 2] = (Math.random() - 0.5) * 100;
      particleColors[i] = 1;
      particleColors[i + 1] = 1;
      particleColors[i + 2] = 1;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.6
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    if (mode === 'multiplayer') {
      const initialBots: Bot[] = [
        { id: 1, name: 'Player_123', position: { x: 10, y: 0, z: 10 }, health: 100 },
        { id: 2, name: 'NoobMaster', position: { x: -15, y: 0, z: 5 }, health: 100 },
        { id: 3, name: 'ProGamer777', position: { x: 5, y: 0, z: -20 }, health: 100 }
      ];

      initialBots.forEach(bot => {
        const bodyGeometry = new THREE.BoxGeometry(1, 2, 0.5);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.set(bot.position.x, bot.position.y + 1, bot.position.z);
        body.castShadow = true;
        scene.add(body);

        const headGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0xFFA07A });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(bot.position.x, bot.position.y + 2.4, bot.position.z);
        head.castShadow = true;
        scene.add(head);

        bot.mesh = body;
      });

      setBots(initialBots);
    }

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let targetBlock: THREE.Mesh | null = null;

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(blocks);

      if (intersects.length > 0) {
        const block = intersects[0].object as THREE.Mesh;
        if (targetBlock !== block) {
          if (targetBlock && targetBlock.material instanceof THREE.MeshLambertMaterial) {
            targetBlock.material.emissive.setHex(0x000000);
          }
          targetBlock = block;
          if (targetBlock.material instanceof THREE.MeshLambertMaterial) {
            targetBlock.material.emissive.setHex(0x333333);
          }
        }
      } else {
        if (targetBlock && targetBlock.material instanceof THREE.MeshLambertMaterial) {
          targetBlock.material.emissive.setHex(0x000000);
        }
        targetBlock = null;
      }
    };

    const onMouseDown = (event: MouseEvent) => {
      if (event.button === 0 && targetBlock) {
        setBreakingBlock(targetBlock);
        setBreakProgress(0);
      }
    };

    const onMouseUp = () => {
      setBreakingBlock(null);
      setBreakProgress(0);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = true;

      if ((e.key === 'e' || e.key === 'у' || e.key === 'E' || e.key === 'У') && !showInventory) {
        e.preventDefault();
        setShowInventory(true);
        setShowChat(false);
        setShowCheat(false);
      }
      if ((e.key === 't' || e.key === 'е' || e.key === 'T' || e.key === 'Е') && !showChat) {
        e.preventDefault();
        setShowChat(true);
        setShowInventory(false);
        setShowCheat(false);
      }
      if ((e.key === 'n' || e.key === 'т' || e.key === 'N' || e.key === 'Т') && !showCheat) {
        e.preventDefault();
        setShowCheat(true);
        setShowInventory(false);
        setShowChat(false);
      }
      if (e.key === 'Escape') {
        setShowInventory(false);
        setShowChat(false);
        setShowCheat(false);
      }
      if (e.key === ' ' && isGrounded) {
        velocity.y = 0.5;
        isGrounded = false;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    const animate = () => {
      requestAnimationFrame(animate);

      if (keys['w'] || keys['ц']) velocity.z = speed;
      else if (keys['s'] || keys['ы']) velocity.z = -speed;
      else velocity.z = 0;

      if (keys['a'] || keys['ф']) velocity.x = speed;
      else if (keys['d'] || keys['в']) velocity.x = -speed;
      else velocity.x = 0;

      velocity.y += gravity;

      camera.position.x -= velocity.x;
      camera.position.z -= velocity.z;
      camera.position.y += velocity.y;

      if (camera.position.y < 2) {
        camera.position.y = 2;
        velocity.y = 0;
        isGrounded = true;
      }

      setPlayerPosition({
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
      });

      if (velocity.x !== 0 || velocity.z !== 0) {
        const positions = particleGeometry.attributes.position.array as Float32Array;
        for (let i = 1; i < particleCount * 3; i += 3) {
          positions[i] -= 0.1;
          if (positions[i] < 0) {
            positions[i] = 10;
            positions[i - 1] = camera.position.x + (Math.random() - 0.5) * 2;
            positions[i + 1] = camera.position.z + (Math.random() - 0.5) * 2;
          }
        }
        particleGeometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [mode, server]);

  useEffect(() => {
    if (!breakingBlock) return;

    const interval = setInterval(() => {
      setBreakProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          if (breakingBlock.parent) {
            breakingBlock.parent.remove(breakingBlock);
          }
          setBreakingBlock(null);
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [breakingBlock]);

  const displayServer = mode === 'multiplayer' ? server?.toUpperCase() : 'ОДИНОЧНАЯ ИГРА';

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div ref={mountRef} className="absolute inset-0" />

      <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg border-2 border-cyan-500/50 pixel-text shadow-lg shadow-cyan-500/20 pointer-events-none">
        <div className="text-cyan-400 text-sm mb-1">📡 {displayServer}</div>
        <div className="text-green-400 text-xs">
          📍 X: {playerPosition.x.toFixed(1)} Y: {playerPosition.y.toFixed(1)} Z: {playerPosition.z.toFixed(1)}
        </div>
        {breakingBlock && (
          <div className="text-yellow-400 text-xs mt-2">
            ⛏ Ломаю блок: {breakProgress}%
          </div>
        )}
        <div className="text-gray-400 text-xs mt-3 border-t border-gray-600 pt-2">
          WASD - движение | SPACE - прыжок | ЛКМ - ломать<br/>E - инвентарь | T - чат | N - читы
        </div>
      </div>

      <div className="absolute top-4 right-4 pointer-events-auto">
        <button
          onClick={onBackToMenu}
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg pixel-text text-sm shadow-lg shadow-red-500/30 border-2 border-red-400 transition-all hover:scale-105"
        >
          ✖ Выйти
        </button>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-none">
        <div className="relative">
          <div className="w-8 h-8 border-2 border-white shadow-lg shadow-white/50"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>

      {showInventory && <Inventory onClose={() => setShowInventory(false)} />}
      {showChat && <ChatBox bots={bots} onClose={() => setShowChat(false)} />}
      {showCheat && <CheatMenu onClose={() => setShowCheat(false)} />}
    </div>
  );
};

export default Game3D;
