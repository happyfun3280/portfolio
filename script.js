import * as keyboard from './scripts/keyboard.js';
import * as work from './scripts/works/work.js';

class App {
    static app = null;

    static getInst() {
        if (App.app === null) {
            App.app = new App();
        }
        return App.app;
    }

    constructor() {
        this.work = null;

        this.container = null;

        this.canvas = null;
        this.ctx = null;

        this.exitButton = null;

        this.winWidth = window.innerWidth;
        this.winHeight = window.innerHeight;

        this.handle = null;

        this.onWorkCallback = undefined;
        this.stopWorkCallback = undefined;

        window.addEventListener("keydown", (e) => {
            if (this.exitButton === null) return;
            if (e.code !== 'Escape') return;

            this.exitButton.classList.add("pressed");
        })

        window.addEventListener("keyup", (e) => {
            if (this.exitButton === null) return;
            if (e.code !== 'Escape') return;

            this.stopWork();
        })
    }

    setParent(element) {
        this.parent = element;
    }

    setCallbacks(onWorkCallback, stopWorkCallback) {
        this.onWorkCallback = onWorkCallback;
        this.stopWorkCallback = stopWorkCallback;
    }

    onWork(work) {
        if (this.work !== null) return;

        this.container = document.createElement('div');
        this.container.classList.add('app_container');
        this.parent.appendChild(this.container);


        this.canvas = document.createElement('canvas');
        this.canvas.classList.add('app_canvas');
        
        this.resize();
        window.addEventListener('resize', this.resize.bind(this));

        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);

        this.exitButton = document.createElement('span');
        this.exitButton.classList.add('app_exit_button');
        this.exitButton.innerText = "exit";
        this.container.appendChild(this.exitButton);

        this.exitButton.addEventListener('click', this.stopWork.bind(this));

        this.work = new work(this.ctx, this.winWidth, this.winHeight);

        this.init();

        this.handle = window.requestAnimationFrame(this.run.bind(this));

        if (this.onWorkCallback) this.onWorkCallback();
    }

    stopWork() {
        if (this.stopWorkCallback) this.stopWorkCallback();

        window.cancelAnimationFrame(this.handle);
        this.canvas.remove();
        this.exitButton.remove();
        this.container.remove();
        this.work = null;
    }

    resize() {
        this.winWidth = window.innerWidth;
        this.winHeight = window.innerHeight;

        this.canvas.width = this.winWidth;
        this.canvas.height = this.winHeight;

        if (this.work) this.work.resize(this.winWidth, this.winHeight);
    }

    init() {
        this.work.init();

        window.addEventListener('mousemove', this.work.mousemove.bind(this.work));
        window.addEventListener('mousedown', this.work.mousedown.bind(this.work));
        window.addEventListener('mouseup', this.work.mouseup.bind(this.work));
    }

    run() {
        this.work.update();
        this.work.draw();
        this.handle = window.requestAnimationFrame(this.run.bind(this));
    }
}

let main = document.getElementById('main');
let app = document.getElementById('app');

App.getInst().setParent(app);

function onWorkCallback() {
    main.style.display = "inline-block";
    app.style.display = "none";
}

App.getInst().setCallbacks(undefined, onWorkCallback);

function keyboardCallback(work) {
    main.style.display = "none";
    app.style.display = "inline-block";
    App.getInst().onWork(work);
}

keyboard.makeKeyboard(main, [
    { key: 'KeyQ', image: './images/buttonArt.png', callback: () => keyboardCallback(work.ButtonWork) },
    { key: 'KeyW', image: './images/openningArt.png', callback: () => keyboardCallback(work.OpenningWork) }
]);