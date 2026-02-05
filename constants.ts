
import { Recipe, Item } from './types';

export const MAP_SIZE = 12000;
export const PLAYER_SPEED = 5.5;
export const MAX_RESOURCES = 500;
export const TICK_RATE = 1000 / 60;

export const RECIPES: Recipe[] = [
  {
    id: 'craft_rock',
    name: 'Starter Rock',
    ingredients: [{ type: 'stone', count: 10 }],
    output: { id: 'rock_tool', name: 'Rock', type: 'tool', count: 1, icon: '🪨', durability: 50, maxDurability: 50 }
  },
  {
    id: 'stone_hatchet',
    name: 'Stone Hatchet',
    ingredients: [{ type: 'wood', count: 15 }, { type: 'stone', count: 10 }],
    output: { id: 'hatchet', name: 'Stone Hatchet', type: 'tool', count: 1, icon: '🪓', durability: 100, maxDurability: 100 }
  },
  {
    id: 'stone_pickaxe',
    name: 'Stone Pickaxe',
    ingredients: [{ type: 'wood', count: 15 }, { type: 'stone', count: 15 }],
    output: { id: 'pickaxe', name: 'Stone Pickaxe', type: 'tool', count: 1, icon: '⛏️', durability: 100, maxDurability: 100 }
  },
  {
    id: 'wood_foundation',
    name: 'Wood Foundation',
    ingredients: [{ type: 'wood', count: 40 }],
    output: { id: 'foundation', name: 'Wood Foundation', type: 'building', count: 1, icon: '🧱' }
  },
  {
    id: 'wood_wall',
    name: 'Wood Wall',
    ingredients: [{ type: 'wood', count: 25 }],
    output: { id: 'wall', name: 'Wood Wall', type: 'building', count: 1, icon: '🚪' }
  }
];

export const INITIAL_INVENTORY: Item[] = [
  { id: 'rock_tool', name: 'Rock', type: 'tool', count: 1, icon: '🪨', durability: 50, maxDurability: 50 },
  { id: 'torch', name: 'Torch', type: 'tool', count: 1, icon: '🔦', durability: 80, maxDurability: 80 }
];
