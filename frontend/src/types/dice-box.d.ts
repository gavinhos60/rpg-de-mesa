declare module "@3d-dice/dice-box" {
  export default class DiceBox {
    constructor(config?: Record<string, unknown>);
    init(): Promise<void>;
    roll(notation: string | unknown[]): Promise<unknown>;
    clear(): void;
    hide(): void;
    show(): void;
    resizeWorld?(): void;
  }
}

declare module "@3d-dice/dice-box/dist/style.css";
