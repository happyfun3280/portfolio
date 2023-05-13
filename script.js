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
        this.parent = null;

        this.work = null;
        this.events = [];

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

        this.parent.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        });
        this.parent.addEventListener('selectstart', function (e) {
            e.preventDefault();
        });
        this.parent.addEventListener('dragstart', function (e) {
            e.preventDefault();
        });
        this.parent.addEventListener('touchstart', function (e) {
            if ((e.touches.length > 1) || e.targetTouches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });


        this.parent.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, { passive: false });
    }

    setCallbacks(onWorkCallback, stopWorkCallback) {
        this.onWorkCallback = onWorkCallback;
        this.stopWorkCallback = stopWorkCallback;
    }

    onWork(work) {
        if (this.work !== null) return;

        this.events = [];

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

        for (let i = 0; i < this.events.length; i++) {
            this.events[i].e.removeEventListener(this.events[i].t, this.events[i].h);
        }

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

        function setEvent(element, type, callback, list) {
            element.addEventListener(type, callback);
            list.push({ e: element, t: type, h: callback });
        }

        setEvent(window, 'touchstart', this.work.touchstartCallback.bind(this.work), this.events);
        setEvent(window, 'touchmove', this.work.touchmoveCallback.bind(this.work), this.events);
        setEvent(window, 'touchend', this.work.touchendCallback.bind(this.work), this.events);

        setEvent(window, 'mousedown', this.work.mousedownCallback.bind(this.work), this.events);
        setEvent(window, 'mousemove', this.work.mousemoveCallback.bind(this.work), this.events);
        setEvent(window, 'mouseup', this.work.mouseupCallback.bind(this.work), this.events);
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
    { key: 'KeyQ', image: './images/buttonWork.png', callback: () => keyboardCallback(work.ButtonWork) },
    { key: 'KeyW', image: './images/openningWork.png', callback: () => keyboardCallback(work.OpenningWork) },
    { key: 'KeyE', image: './images/waveWork.png', callback: () => keyboardCallback(work.WaveWork) },
    { key: 'KeyR', callback: () => keyboardCallback(work.sample) }
]);