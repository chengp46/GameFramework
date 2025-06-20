import { GameCore } from './extensions/game-framwork/assets/GameCore';

declare global {
    interface Window {
        core: GameCore;
    }
    var core: GameCore;
}

export {};