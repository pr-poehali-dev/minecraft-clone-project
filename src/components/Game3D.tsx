import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Inventory from './Inventory';
import ChatBox from './ChatBox';
import CheatMenu from './CheatMenu';
import CraftingMenu from './CraftingMenu';

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
  const [showCrafting, setShowCrafting] = useState(false);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 20, z: 0 });
  const [bots, setBots] = useState<Bot[]>([]);
  const [breakingBlock, setBreakingBlock] = useState<THREE.Mesh | null>(null);
  const [breakProgress, setBreakProgress] = useState(0);
  const [isPointerLocked, setIsPointerLocked] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.Fog(0x87CEEB, 0, 200);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 20, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    scene.add(directionalLight);

    const blocks: THREE.Mesh[] = [];
    const blockSize = 1;

    const createTexture = (color: number) => {
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
      ctx.fillRect(0, 0, 16, 16);
      
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 16; i += 4) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 16);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(16, i);
        ctx.stroke();
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      return texture;
    };

    const grassTop = createTexture(0x5C9A3D);
    const grassSide = createTexture(0x7B6C47);
    const dirtTexture = createTexture(0x8B6F47);
    const stoneTexture = createTexture(0x7F7F7F);
    const woodTexture = createTexture(0x8B6F47);
    const leavesTexture = createTexture(0x2D5016);

    const grassMaterials = [
      new THREE.MeshLambertMaterial({ map: grassSide }),
      new THREE.MeshLambertMaterial({ map: grassSide }),
      new THREE.MeshLambertMaterial({ map: grassTop }),
      new THREE.MeshLambertMaterial({ map: dirtTexture }),
      new THREE.MeshLambertMaterial({ map: grassSide }),
      new THREE.MeshLambertMaterial({ map: grassSide })
    ];

    const dirtMaterial = new THREE.MeshLambertMaterial({ map: dirtTexture });
    const stoneMaterial = new THREE.MeshLambertMaterial({ map: stoneTexture });
    const woodMaterial = new THREE.MeshLambertMaterial({ map: woodTexture });
    const leavesMaterial = new THREE.MeshLambertMaterial({ map: leavesTexture, transparent: true, opacity: 0.8 });

    const generateTree = (x: number, z: number) => {
      const trunkHeight = 5;
      for (let y = 0; y < trunkHeight; y++) {
        const geometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
        const trunk = new THREE.Mesh(geometry, woodMaterial);
        trunk.position.set(x, y, z);
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        scene.add(trunk);
        blocks.push(trunk);
      }

      for (let dy = 0; dy < 3; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          for (let dz = -2; dz <= 2; dz++) {
            if (Math.random() > 0.3) {
              const geometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
              const leaves = new THREE.Mesh(geometry, leavesMaterial);
              leaves.position.set(x + dx, trunkHeight + dy, z + dz);
              leaves.castShadow = true;
              scene.add(leaves);
              blocks.push(leaves);
            }
          }
        }
      }
    };

    const generateCave = (cx: number, cz: number) => {
      const caveRadius = 5;
      const caveDepth = -5;
      
      for (let y = caveDepth; y < 0; y++) {
        for (let dx = -caveRadius; dx <= caveRadius; dx++) {
          for (let dz = -caveRadius; dz <= caveRadius; dz++) {
            if (dx * dx + dz * dz < caveRadius * caveRadius) {
              const existingBlock = blocks.find(b => 
                Math.abs(b.position.x - (cx + dx)) < 0.5 &&
                Math.abs(b.position.y - y) < 0.5 &&
                Math.abs(b.position.z - (cz + dz)) < 0.5
              );
              if (existingBlock) {
                scene.remove(existingBlock);
                blocks.splice(blocks.indexOf(existingBlock), 1);
              }
            }
          }
        }
      }
    };

    const generateVillage = (vx: number, vz: number) => {
      const buildHouse = (hx: number, hz: number) => {
        for (let y = 0; y < 4; y++) {
          for (let dx = 0; dx < 5; dx++) {
            for (let dz = 0; dz < 5; dz++) {
              if (y === 0 || dx === 0 || dx === 4 || dz === 0 || dz === 4) {
                const geometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
                const wall = new THREE.Mesh(geometry, woodMaterial);
                wall.position.set(hx + dx, y, hz + dz);
                wall.castShadow = true;
                wall.receiveShadow = true;
                scene.add(wall);
                blocks.push(wall);
              }
            }
          }
        }
      };

      buildHouse(vx, vz);
      buildHouse(vx + 8, vz);
      buildHouse(vx, vz + 8);
      buildHouse(vx + 8, vz + 8);
    };

    let spawnX = 0, spawnZ = 0;
    if (mode === 'multiplayer' && server) {
      if (server === 'holyworld') { spawnX = 50; spawnZ = 50; }
      else if (server === 'funtime') { spawnX = -50; spawnZ = 50; }
      else if (server === 'hypixel') { spawnX = 0; spawnZ = -50; }
    }

    for (let x = -60; x < 60; x++) {
      for (let z = -60; z < 60; z++) {
        const noise = Math.sin(x * 0.1) * Math.cos(z * 0.1);
        const height = Math.floor(noise * 3);

        for (let y = -10; y <= height; y++) {
          let material: THREE.Material | THREE.Material[] = stoneMaterial;
          if (y === height) material = grassMaterials;
          else if (y === height - 1 || y === height - 2) material = dirtMaterial;

          const geometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
          const block = new THREE.Mesh(geometry, material);
          block.position.set(x, y, z);
          block.castShadow = true;
          block.receiveShadow = true;
          scene.add(block);
          blocks.push(block);
        }

        if (Math.random() > 0.97 && height >= 0) {
          generateTree(x, z);
        }
      }
    }

    if (mode === 'multiplayer' && server) {
      generateVillage(spawnX, spawnZ);
      
      const spawnPlatformSize = 10;
      for (let dx = -spawnPlatformSize; dx < spawnPlatformSize; dx++) {
        for (let dz = -spawnPlatformSize; dz < spawnPlatformSize; dz++) {
          const geometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
          const platform = new THREE.Mesh(geometry, stoneMaterial);
          platform.position.set(spawnX + dx, 0, spawnZ + dz);
          platform.castShadow = true;
          platform.receiveShadow = true;
          scene.add(platform);
          blocks.push(platform);
        }
      }

      camera.position.set(spawnX, 20, spawnZ);
    }

    generateCave(30, 30);
    generateCave(-40, -20);

    const velocity = { x: 0, y: 0, z: 0 };
    const speed = 0.15;
    const gravity = -0.015;
    const keys: { [key: string]: boolean } = {};
    let isGrounded = false;

    const euler = new THREE.Euler(0, 0, 0, 'YXZ');
    const PI_2 = Math.PI / 2;

    const onMouseMove = (event: MouseEvent) => {
      if (!isPointerLocked) return;

      const movementX = event.movementX || 0;
      const movementY = event.movementY || 0;

      euler.setFromQuaternion(camera.quaternion);
      euler.y -= movementX * 0.002;
      euler.x -= movementY * 0.002;
      euler.x = Math.max(-PI_2, Math.min(PI_2, euler.x));
      camera.quaternion.setFromEuler(euler);
    };

    const raycaster = new THREE.Raycaster();
    raycaster.far = 10;
    const targetBlock: THREE.Mesh | null = null;

    const onMouseDown = (event: MouseEvent) => {
      if (!isPointerLocked) {
        renderer.domElement.requestPointerLock();
        return;
      }

      if (event.button === 0) {
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        raycaster.set(camera.position, direction);
        const intersects = raycaster.intersectObjects(blocks);

        if (intersects.length > 0) {
          const block = intersects[0].object as THREE.Mesh;
          setBreakingBlock(block);
          setBreakProgress(0);
        }
      }
    };

    const onMouseUp = () => {
      setBreakingBlock(null);
      setBreakProgress(0);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = true;

      if ((e.key === 'e' || e.key === 'у' || e.key === 'E' || e.key === 'У') && isPointerLocked) {
        setShowInventory(true);
        document.exitPointerLock();
      }
      if ((e.key === 't' || e.key === 'е' || e.key === 'T' || e.key === 'Е') && isPointerLocked) {
        setShowChat(true);
        document.exitPointerLock();
      }
      if ((e.key === 'n' || e.key === 'т' || e.key === 'N' || e.key === 'Т') && isPointerLocked) {
        setShowCheat(true);
        document.exitPointerLock();
      }
      if ((e.key === 'c' || e.key === 'с' || e.key === 'C' || e.key === 'С') && isPointerLocked) {
        setShowCrafting(true);
        document.exitPointerLock();
      }
      if (e.key === 'Escape' && !isPointerLocked) {
        setShowInventory(false);
        setShowChat(false);
        setShowCheat(false);
        setShowCrafting(false);
      }
      if (e.key === ' ' && isGrounded) {
        velocity.y = 0.3;
        isGrounded = false;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false;
    };

    const onPointerLockChange = () => {
      setIsPointerLocked(document.pointerLockElement === renderer.domElement);
    };

    document.addEventListener('pointerlockchange', onPointerLockChange);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    if (mode === 'multiplayer') {
      const initialBots: Bot[] = [
        { id: 1, name: 'Player_123', position: { x: spawnX + 5, y: 2, z: spawnZ + 5 }, health: 100 },
        { id: 2, name: 'NoobMaster', position: { x: spawnX - 5, y: 2, z: spawnZ }, health: 100 },
        { id: 3, name: 'ProGamer777', position: { x: spawnX, y: 2, z: spawnZ - 5 }, health: 100 }
      ];

      initialBots.forEach(bot => {
        const bodyGeometry = new THREE.BoxGeometry(0.6, 1.2, 0.3);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.set(bot.position.x, bot.position.y, bot.position.z);
        body.castShadow = true;
        scene.add(body);

        const headGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0xFFA07A });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(bot.position.x, bot.position.y + 0.85, bot.position.z);
        head.castShadow = true;
        scene.add(head);

        bot.mesh = body;
      });

      setBots(initialBots);
    }

    const animate = () => {
      requestAnimationFrame(animate);

      const direction = new THREE.Vector3();
      const forward = new THREE.Vector3();
      const right = new THREE.Vector3();

      camera.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();

      right.crossVectors(forward, new THREE.Vector3(0, 1, 0));

      direction.set(0, 0, 0);

      if (keys['w'] || keys['ц']) direction.add(forward);
      if (keys['s'] || keys['ы']) direction.sub(forward);
      if (keys['a'] || keys['ф']) direction.sub(right);
      if (keys['d'] || keys['в']) direction.add(right);

      if (direction.length() > 0) {
        direction.normalize();
        velocity.x = direction.x * speed;
        velocity.z = direction.z * speed;
      } else {
        velocity.x = 0;
        velocity.z = 0;
      }

      velocity.y += gravity;

      camera.position.x += velocity.x;
      camera.position.z += velocity.z;
      camera.position.y += velocity.y;

      if (camera.position.y < 1.7) {
        camera.position.y = 1.7;
        velocity.y = 0;
        isGrounded = true;
      }

      setPlayerPosition({
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
      });

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
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
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

  const handleCraft = (item: string) => {
    console.log('Crafted:', item);
  };

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
          {!isPointerLocked ? 'Кликни чтобы начать' : 'WASD - движение | SPACE - прыжок | ЛКМ - ломать'}
          <br/>E - инвентарь | T - чат | N - читы | C - крафтинг
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

      {isPointerLocked && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-none">
          <div className="relative">
            <div className="w-8 h-8 border-2 border-white shadow-lg shadow-white/50"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}

      {showInventory && <Inventory onClose={() => setShowInventory(false)} />}
      {showChat && <ChatBox bots={bots} onClose={() => setShowChat(false)} />}
      {showCheat && <CheatMenu onClose={() => setShowCheat(false)} />}
      {showCrafting && <CraftingMenu onClose={() => setShowCrafting(false)} onCraft={handleCraft} />}
    </div>
  );
};

export default Game3D;
