const Key = {
    ArrowUp: 'Rotate',
    ArrowDown: 'SlowDrop',
    ArrowLeft: 'Left',
    ArrowRight: 'Right',
    KeyQ: 'Quit',
    KeyP: 'Pause',
    Space: 'FastDrop',
};

export const actionForKey = (keyCode) => Key[keyCode];
