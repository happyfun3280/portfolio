const BUTTONS = [
        /* 14 */ [ 'Escape', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'Delete' ],
        /* 14 */ [ 'Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace' ],
        /* 14 */ [ 'Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash' ],
        /* 13 */ [ 'CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter' ],
        /* 12 */ [ 'ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ShiftRight' ],
        /* 9  */ [ 'ControlLeft', 'fn', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'fn', 'ContextMenu', 'ControlRight' ]
];

/**
 * 
 * @param {element} element 
 * @param {object} settings [ { key image callback } ]
 */
export function makeKeyboard(element, settings) {
    let container = document.createElement('div');
    container.classList.add('keyboard_container');
    element.appendChild(container);
    let keyboard = document.createElement('div');
    keyboard.classList.add('keyboard');
    container.appendChild(keyboard);
    for (let i = 0; i < BUTTONS.length; i++) {
        let line = document.createElement('div');
        line.classList.add('keyboard_line_' + (i+1));
        keyboard.appendChild(line);
        for (let j = 0; j < BUTTONS[i].length; j++) {
            let button = document.createElement('span');
            button.classList.add('keyboard_button_'+BUTTONS[i][j]);
            line.appendChild(button);

            window.addEventListener("keydown", (e) => {
                if (e.code === BUTTONS[i][j]) {
                    button.classList.add("pressed");
                }
            });

            window.addEventListener("keyup", (e) => {
                if (e.code === BUTTONS[i][j]) {
                    button.classList.remove("pressed");
                }
            })

            window.addEventListener("contextmenu", (e) => {
                button.classList.remove("pressed");
            })
    
            window.addEventListener("blur", (e) => {
                button.classList.remove("pressed");
            })

            for (let k = 0; k < settings.length; k++) {
                if (settings[k].key === BUTTONS[i][j]) {
                    button.style.backgroundImage = `url(${(settings[k].image === undefined)?("none"):(settings[k].image)})`;
                    button.addEventListener("mousedown", (settings[k].callback === undefined)?(null):(settings[k].callback));
                    window.addEventListener("keydown", (e) => {
                        if (e.code === BUTTONS[i][j]) {
                            (settings[k].callback === undefined)?(null):(settings[k].callback());
                        }
                    });
                    break;
                }
            }
        }
    }
}