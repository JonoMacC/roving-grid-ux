export function rovingGrid({ element: rover, target: targetSelector, wrap, VKMap, }: {
    element: HTMLElement;
    target?: string;
    wrap?: boolean;
    VKMap?: VKMap;
}): void;
export function updateRover(rover: HTMLElement, options: RoverOptions): void;
/**
 * - A `+` delimited key combination (e.g. `Ctrl+Home`)
 */
export type KeyCombo = string;
/**
 * - A map between virtual keys and key combinations
 */
export type VKMap = {
    /**
     * - The top left key combination
     */
    TOP_LEFT?: KeyCombo[];
    /**
     * - The top key combination
     */
    TOP?: KeyCombo[];
    /**
     * - The top right key combination
     */
    TOP_RIGHT?: KeyCombo[];
    /**
     * - The up key combination
     */
    UP?: KeyCombo[];
    /**
     * - The down key combination
     */
    DOWN?: KeyCombo[];
    /**
     * - The home key combination
     */
    HOME?: KeyCombo[];
    /**
     * - The end key combination
     */
    END?: KeyCombo[];
    /**
     * - The left key combination
     */
    LEFT?: KeyCombo[];
    /**
     * - The right key combination
     */
    RIGHT?: KeyCombo[];
    /**
     * - The bottom left key combination
     */
    BOTTOM_LEFT?: KeyCombo[];
    /**
     * - The bottom key combination
     */
    BOTTOM?: KeyCombo[];
    /**
     * - The bottom right key combination
     */
    BOTTOM_RIGHT?: KeyCombo[];
};
/**
 * - A map between key combinations and virtual keys
 */
export type KeyLookup = any;
/**
 * - Options for roving grid
 */
export type RoverOptions = any;
export type AnyObserver = MutationObserver | ResizeObserver;
