/**
 * @version 1.0.0.0
 * @copyright Copyright ©  2018
 * @compiler Bridge.NET 17.4.0
 */
Bridge.assembly("GameEngineJS", function ($asm, globals) {
    "use strict";

    Bridge.define("GameEngineJS.Components.Component", {
        fields: {
            parent: null
        },
        ctors: {
            ctor: function (_parent) {
                this.$initialize();
                this.parent = _parent;
            }
        },
        methods: {
            Update: function () { }
        }
    });

    Bridge.define("GameEngineJS.Components.ComponentReader", {
        fields: {
            displayList: null
        },
        ctors: {
            ctor: function (list) {
                this.$initialize();
                this.displayList = list;
            }
        },
        methods: {
            update: function () {
                var $t, $t1;
                $t = Bridge.getEnumerator(this.displayList.list);
                try {
                    while ($t.moveNext()) {
                        var obj = $t.Current;
                        $t1 = Bridge.getEnumerator(obj.components);
                        try {
                            while ($t1.moveNext()) {
                                var component = $t1.Current;
                                component.value.Update();
                            }
                        } finally {
                            if (Bridge.is($t1, System.IDisposable)) {
                                $t1.System$IDisposable$Dispose();
                            }
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            }
        }
    });

    Bridge.define("GameEngineJS.Display.Camera", {
        fields: {
            position: null,
            rotation: 0
        },
        ctors: {
            ctor: function () {
                this.$initialize();
                this.position = new GameEngineJS.Maths.Vector2(0, 0);
                this.rotation = 0;
            },
            $ctor1: function (_position, _rotation) {
                this.$initialize();
                this.position = _position;
                this.rotation = _rotation;
            }
        }
    });

    Bridge.define("GameEngineJS.Display.DisplayList", {
        fields: {
            list: null
        },
        ctors: {
            init: function () {
                this.list = new (System.Collections.Generic.List$1(GameEngineJS.GameObjects.GameObject)).ctor();
            }
        },
        methods: {
            Add: function (obj) {
                this.list.add(obj);
            }
        }
    });

    Bridge.define("GameEngineJS.Display.Scene", {
        fields: {
            camera: null,
            _mainDisplayList: null,
            _drawer: null,
            _canvas: null,
            _color: null,
            mouse: null
        },
        ctors: {
            ctor: function (objList, canvasID, color) {
                this.$initialize();
                this.camera = new GameEngineJS.Display.Camera.ctor();
                this._mainDisplayList = objList;
                this._canvas = document.querySelector("canvas#" + (canvasID || ""));
                this._drawer = new GameEngineJS.Graphics.Drawer(this._canvas);
                this._color = color;
                this.mouse = new GameEngineJS.System.Mouse(this._canvas);
            }
        },
        methods: {
            Refresh: function () {
                var $t;
                this._drawer.FillScreen(this._color);
                $t = Bridge.getEnumerator(this._mainDisplayList.list);
                try {
                    while ($t.moveNext()) {
                        var obj = $t.Current;
                        this._drawer.Draw$1(obj.position.X - this.camera.position.X, obj.position.Y - this.camera.position.Y, obj.size.X, obj.size.Y, obj.angle, obj.image, false, 1);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            }
        }
    });

    Bridge.define("GameEngineJS.Events.KeyBoardEvent", {
        events: {
            OnKeyPressEvents: null,
            OnKeyDownEvents: null,
            OnKeyUpEvents: null
        },
        ctors: {
            ctor: function () {
                this.$initialize();
                document.addEventListener("keypress", Bridge.fn.cacheBind(this, this.DoKeyPress));
                document.addEventListener("keydown", Bridge.fn.cacheBind(this, this.DoKeyDown));
                document.addEventListener("keyup", Bridge.fn.cacheBind(this, this.DoKeyUp));
            }
        },
        methods: {
            DoKeyPress: function (e) {
                if (Bridge.staticEquals(this.OnKeyPressEvents, null)) {
                    return;
                }
                this.OnKeyPressEvents(e.keyCode);
            },
            DoKeyDown: function (e) {
                if (Bridge.staticEquals(this.OnKeyDownEvents, null)) {
                    return;
                }
                this.OnKeyDownEvents(e.keyCode);
            },
            DoKeyUp: function (e) {
                if (Bridge.staticEquals(this.OnKeyUpEvents, null)) {
                    return;
                }
                this.OnKeyUpEvents(e.keyCode);
            }
        }
    });

    Bridge.define("GameEngineJS.Game", {
        fields: {
            drawer: null,
            scheduler: null,
            scene: null,
            _displayList: null,
            _componentReader: null
        },
        props: {
            mouse: {
                get: function () {
                    return this.scene.mouse;
                }
            }
        },
        ctors: {
            ctor: function (canvasID) {
                GameEngineJS.Game.$ctor1.call(this, canvasID, "#fff");
            },
            $ctor1: function (canvasID, color) {
                this.$initialize();
                this._displayList = new GameEngineJS.Display.DisplayList();
                this.scene = new GameEngineJS.Display.Scene(this._displayList, canvasID, color);
                this._componentReader = new GameEngineJS.Components.ComponentReader(this._displayList);


                this.scheduler = new GameEngineJS.System.Scheduler();
                this.scheduler.Add(Bridge.fn.cacheBind(this.scene, this.scene.Refresh));
                this.scheduler.Add(Bridge.fn.cacheBind(this._componentReader, this._componentReader.update));
            }
        },
        methods: {
            AddChild: function (obj) {
                this._displayList.Add(obj);
            }
        }
    });

    Bridge.define("GameEngineJS.GameObjects.GameObject", {
        fields: {
            position: null,
            size: null,
            angle: 0,
            image: null,
            components: null
        },
        ctors: {
            init: function () {
                this.components = new (System.Collections.Generic.Dictionary$2(System.String,GameEngineJS.Components.Component))();
            }
        },
        methods: {
            AddComponent: function (instanceName, component) {
                this.components.set(instanceName, component);
                return this.components.get(instanceName);
            }
        }
    });

    Bridge.define("GameEngineJS.Graphics.Drawer", {
        fields: {
            _ctx: null,
            _canvas: null
        },
        ctors: {
            ctor: function (canvas) {
                this.$initialize();
                this._ctx = canvas.getContext("2d");
                this._canvas = canvas;
            }
        },
        methods: {
            FillScreen: function (color) {
                this._ctx.fillStyle = color;
                this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
            },
            Draw: function (x, y, w, h, img) {
                this.Draw$1(x, y, w, h, 0, img, false, 1);
            },
            Draw$1: function (x, y, w, h, r, img, follow, alpha) {
                this._ctx.imageSmoothingEnabled = false;
                this._canvas.style.imageRendering = "pixelated";
                this._ctx.save();

                if (img.data != null) {
                    img = img.data;
                }

                var ox = x + (w / 2);
                var oy = y + (h / 2);

                this._ctx.translate(ox, oy);
                this._ctx.rotate((r) * Math.PI / 180);
                this._ctx.translate(-ox, -oy);

                this._ctx.drawImage(img, x, y, w, h);

                this._ctx.restore();
            }
        }
    });

    Bridge.define("GameEngineJS.Graphics.Image", {
        fields: {
            data: null
        },
        ctors: {
            ctor: function (src) {
                this.$initialize();
                this.data = new Image();
                this.data.src = src;

            }
        }
    });

    Bridge.define("GameEngineJS.Maths.Vector2", {
        fields: {
            X: 0,
            Y: 0
        },
        ctors: {
            ctor: function (_x, _y) {
                this.$initialize();
                this.X = _x;
                this.Y = _y;
            }
        }
    });

    Bridge.define("GameEngineJS.Maths.Vector4", {
        fields: {
            X: 0,
            Y: 0,
            Z: 0,
            W: 0
        },
        ctors: {
            ctor: function (_x, _y, _z, _w) {
                this.$initialize();
                this.X = _x;
                this.Y = _y;
                this.Z = _z;
                this.W = _w;
            }
        }
    });

    Bridge.define("GameEngineJS.System.Mouse", {
        fields: {
            x: 0,
            y: 0,
            _canvas: null
        },
        ctors: {
            init: function () {
                this.x = 0;
                this.y = 0;
            },
            ctor: function (canvas) {
                this.$initialize();
                this._canvas = canvas;
                document.addEventListener("mousemove", Bridge.fn.cacheBind(this, this.Update));
            }
        },
        methods: {
            Update: function (e) {
                var rect = this._canvas.getBoundingClientRect();
                this.x = e.clientX - rect.left;
                this.y = e.clientY - rect.top;
            }
        }
    });

    Bridge.define("GameEngineJS.System.Scheduler", {
        fields: {
            _actionList: null
        },
        ctors: {
            init: function () {
                this._actionList = new (System.Collections.Generic.List$1(Function)).ctor();
            },
            ctor: function () {
                this.$initialize();
                this.Update();
            }
        },
        methods: {
            Add: function (methods) {
                this._actionList.add(function () {
                    methods();
                });
            },
            Update: function () {
                var $t;
                $t = Bridge.getEnumerator(this._actionList);
                try {
                    while ($t.moveNext()) {
                        var a = $t.Current;
                        a();
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                window.requestAnimationFrame(Bridge.fn.cacheBind(this, this.Update));
            }
        }
    });

    Bridge.define("GameEngineJS.Components.Animator", {
        inherits: [GameEngineJS.Components.Component],
        fields: {
            _animations: null,
            currentAnimation: null,
            currentFrame: 0,
            fps: 0,
            _playing: false,
            lastTimeFrame: 0
        },
        ctors: {
            init: function () {
                this.currentAnimation = "";
                this.currentFrame = 0;
                this.fps = 1;
                this._playing = false;
                this.lastTimeFrame = 0;
            },
            ctor: function (parent) {
                this.$initialize();
                GameEngineJS.Components.Component.ctor.call(this, parent);
                this._animations = new (System.Collections.Generic.Dictionary$2(System.String,System.Collections.Generic.List$1(GameEngineJS.Graphics.Image)))();
            }
        },
        methods: {
            GotoAndPlay: function (animationName) {
                this.GotoAndPlay$1(animationName, 0);
            },
            GotoAndPlay$1: function (animationName, frame) {
                this.currentAnimation = animationName;
                this.currentFrame = frame;
                this._playing = true;
            },
            GotoAndStop: function (animationName) {
                this.GotoAndStop$1(animationName, 0);
            },
            GotoAndStop$1: function (animationName, frame) {
                this.currentAnimation = animationName;
                this.currentFrame = frame;
                this._playing = false;
            },
            Stop: function () {
                this._playing = false;
            },
            Start: function () {
                this._playing = true;
            },
            Create: function (animationName, list) {
                this._animations.set(animationName, list);
            },
            Update: function () {
                if (!this._playing) {
                    return;
                }

                var now = System.DateTime.subdd(System.DateTime.getNow(), System.DateTime.addYears(System.DateTime.getMinValue(), 2017)).getTotalMilliseconds();
                var delta = now - this.lastTimeFrame;
                if (delta > ((Bridge.Int.div(1000, this.fps)) | 0)) {
                    this.currentFrame = (this.currentFrame + 1) | 0;
                    if (this.currentFrame >= this._animations.get(this.currentAnimation).Count) {
                        this.currentFrame = 0;
                    }
                    this.parent.image = this._animations.get(this.currentAnimation).getItem(this.currentFrame);

                    this.lastTimeFrame = now;
                }

            }
        }
    });

    Bridge.define("GameEngineJS.Components.Collision", {
        inherits: [GameEngineJS.Components.Component],
        fields: {
            _boxes: null
        },
        ctors: {
            ctor: function (_parent) {
                this.$initialize();
                GameEngineJS.Components.Component.ctor.call(this, _parent);
                this._boxes = new (System.Collections.Generic.List$1(GameEngineJS.Maths.Vector4)).ctor();
            }
        },
        methods: {
            AddBox: function (x1, y1, width, height) {
                this._boxes.add(new GameEngineJS.Maths.Vector4(x1, y1, width, height));
            },
            HitTestObject: function (obj) {
                var $t, $t1, $t2;
                $t = Bridge.getEnumerator(obj.components.getValues(), GameEngineJS.Components.Component);
                try {
                    while ($t.moveNext()) {
                        var cp = $t.Current;
                        if (Bridge.referenceEquals(Bridge.getType(cp), GameEngineJS.Components.Collision)) {
                            var c = Bridge.cast(cp, GameEngineJS.Components.Collision);
                            $t1 = Bridge.getEnumerator(this._boxes);
                            try {
                                while ($t1.moveNext()) {
                                    var b = $t1.Current;
                                    $t2 = Bridge.getEnumerator(c._boxes);
                                    try {
                                        while ($t2.moveNext()) {
                                            var b2 = $t2.Current;
                                            if (b.X + this.parent.position.X < b2.X + b2.Z + obj.position.X && b.X + b.Z + this.parent.position.X > b2.X + obj.position.X && b.Y + this.parent.position.Y < b2.Y + b2.W + obj.position.Y && b.W + b.Y + this.parent.position.Y > b2.Y + obj.position.Y) {
                                                return true;
                                            }
                                        }
                                    } finally {
                                        if (Bridge.is($t2, System.IDisposable)) {
                                            $t2.System$IDisposable$Dispose();
                                        }
                                    }
                                }
                            } finally {
                                if (Bridge.is($t1, System.IDisposable)) {
                                    $t1.System$IDisposable$Dispose();
                                }
                            }
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
                return false;
            },
            HitTestPoint: function (x, y) {
                var $t;
                $t = Bridge.getEnumerator(this._boxes);
                try {
                    while ($t.moveNext()) {
                        var b = $t.Current;
                        if (x < b.X + this.parent.position.X + b.Z && x > b.X + this.parent.position.X && y < b.Y + this.parent.position.Y + b.W && y > b.Y + this.parent.position.Y) {
                            return true;
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
                return false;
            }
        }
    });

    Bridge.define("GameEngineJS.GameObjects.Sprite", {
        inherits: [GameEngineJS.GameObjects.GameObject],
        ctors: {
            ctor: function (_position, _size, _image) {
                this.$initialize();
                GameEngineJS.GameObjects.GameObject.ctor.call(this);
                this.position = _position;
                this.size = _size;
                this.image = _image;
            }
        }
    });
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJHYW1lRW5naW5lSlMuanMiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbIkNvbXBvbmVudHMvQ29tcG9uZW50LmNzIiwiQ29tcG9uZW50cy9Db21wb25lbnRSZWFkZXIuY3MiLCJEaXNwbGF5L0NhbWVyYS5jcyIsIkRpc3BsYXkvRGlzcGxheUxpc3QuY3MiLCJEaXNwbGF5L1NjZW5lLmNzIiwiRXZlbnRzL0tleUJvYXJkRXZlbnQuY3MiLCJHYW1lLmNzIiwiR2FtZU9iamVjdHMvR2FtZU9iamVjdC5jcyIsIkdyYXBoaWNzL0RyYXdlci5jcyIsIkdyYXBoaWNzL0ltYWdlLmNzIiwiTWF0aHMvVmVjdG9yMi5jcyIsIk1hdGhzL1ZlY3RvcjQuY3MiLCJTeXN0ZW0vTW91c2UuY3MiLCJTeXN0ZW0vU2NoZWR1bGVyLmNzIiwiQ29tcG9uZW50cy9BbmltYXRvci5jcyIsIkNvbXBvbmVudHMvQ29sbGlzaW9uLmNzIiwiR2FtZU9iamVjdHMvU3ByaXRlLmNzIl0sCiAgIm5hbWVzIjogWyIiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7OzRCQVEyQkE7O2dCQUNmQSxjQUFTQTs7Ozs7Ozs7Ozs7Ozs0QkNFWUE7O2dCQUNyQkEsbUJBQWNBOzs7Ozs7Z0JBSWRBLDBCQUEyQkE7Ozs7d0JBQ3ZCQSwyQkFBc0RBOzs7O2dDQUVsREE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0JDTFJBLGdCQUFXQSxJQUFJQTtnQkFDZkE7OzhCQUdVQSxXQUFrQkE7O2dCQUM1QkEsZ0JBQVdBO2dCQUNYQSxnQkFBV0E7Ozs7Ozs7Ozs7OzRCQ0hnQ0EsS0FBSUE7Ozs7MkJBTG5DQTtnQkFDWkEsY0FBU0E7Ozs7Ozs7Ozs7Ozs7Ozs0QkNTQUEsU0FBb0JBLFVBQWdCQTs7Z0JBQzdDQSxjQUFTQSxJQUFJQTtnQkFDYkEsd0JBQW1CQTtnQkFDbkJBLGVBQVVBLHVCQUEwQ0EsYUFBWUE7Z0JBQ2hFQSxlQUFVQSxJQUFJQSw2QkFBT0E7Z0JBQ3JCQSxjQUFTQTtn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UkE7Ozs7Ozs7OzRCQ3JDVUEsV0FBbUJBLE9BQWVBOzs7Z0JBQzVDQSxnQkFBV0E7Z0JBQ1hBLFlBQU9BO2dCQUNQQSxhQUFRQSIsCiAgInNvdXJjZXNDb250ZW50IjogWyJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuQ29tcG9uZW50c1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgQ29tcG9uZW50XHJcbiAgICB7XHJcbiAgICAgICAgaW50ZXJuYWwgR2FtZU9iamVjdCBwYXJlbnQgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIGludGVybmFsIENvbXBvbmVudChHYW1lT2JqZWN0IF9wYXJlbnQpIHtcclxuICAgICAgICAgICAgcGFyZW50ID0gX3BhcmVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGludGVybmFsIHZpcnR1YWwgdm9pZCBVcGRhdGUoKSB7fVxyXG5cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBHYW1lRW5naW5lSlMuRGlzcGxheTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5Db21wb25lbnRzXHJcbntcclxuICAgIGludGVybmFsIGNsYXNzIENvbXBvbmVudFJlYWRlclxyXG4gICAge1xyXG4gICAgICAgIGludGVybmFsIERpc3BsYXlMaXN0IGRpc3BsYXlMaXN0IHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgaW50ZXJuYWwgQ29tcG9uZW50UmVhZGVyKERpc3BsYXlMaXN0IGxpc3QpIHtcclxuICAgICAgICAgICAgZGlzcGxheUxpc3QgPSBsaXN0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW50ZXJuYWwgdm9pZCB1cGRhdGUoKSB7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKEdhbWVPYmplY3Qgb2JqIGluIGRpc3BsYXlMaXN0Lmxpc3QpIHtcclxuICAgICAgICAgICAgICAgIGZvcmVhY2ggKEtleVZhbHVlUGFpcjxzdHJpbmcsIENvbXBvbmVudD4gY29tcG9uZW50IGluIG9iai5jb21wb25lbnRzKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5WYWx1ZS5VcGRhdGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkRpc3BsYXlcclxue1xyXG4gICAgcHVibGljIGNsYXNzIENhbWVyYVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIHBvc2l0aW9uIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgcm90YXRpb24geyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgQ2FtZXJhKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uID0gbmV3IFZlY3RvcjIoMCwwKTtcclxuICAgICAgICAgICAgcm90YXRpb24gPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIENhbWVyYShWZWN0b3IyIF9wb3NpdGlvbixmbG9hdCBfcm90YXRpb24pIHtcclxuICAgICAgICAgICAgcG9zaXRpb24gPSBfcG9zaXRpb247XHJcbiAgICAgICAgICAgIHJvdGF0aW9uID0gX3JvdGF0aW9uO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5EaXNwbGF5XHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBEaXNwbGF5TGlzdFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBMaXN0PEdhbWVPYmplY3Q+IGxpc3QgeyBnZXQ7IHNldDsgfSAgXHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZChHYW1lT2JqZWN0IG9iaikge1xyXG4gICAgICAgICAgICBsaXN0LkFkZChvYmopO1xyXG4gICAgICAgIH1cclxuXG4gICAgXG5wcml2YXRlIExpc3Q8R2FtZU9iamVjdD4gX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX2xpc3Q9bmV3IExpc3Q8R2FtZU9iamVjdD4oKSA7fVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR3JhcGhpY3M7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5NYXRocztcclxudXNpbmcgR2FtZUVuZ2luZUpTLlN5c3RlbTtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuRGlzcGxheVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgU2NlbmVcclxuICAgIHtcclxuXHJcbiAgICAgICAgcHVibGljIENhbWVyYSBjYW1lcmEgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwcml2YXRlIERpc3BsYXlMaXN0IF9tYWluRGlzcGxheUxpc3Q7XHJcbiAgICAgICAgcHJpdmF0ZSBEcmF3ZXIgX2RyYXdlcjtcclxuICAgICAgICBwcml2YXRlIEhUTUxDYW52YXNFbGVtZW50IF9jYW52YXM7XHJcbiAgICAgICAgcHJpdmF0ZSBzdHJpbmcgX2NvbG9yO1xyXG4gICAgICAgIHB1YmxpYyBNb3VzZSBtb3VzZSB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBTY2VuZShEaXNwbGF5TGlzdCBvYmpMaXN0LHN0cmluZyBjYW52YXNJRCxzdHJpbmcgY29sb3IpIHtcclxuICAgICAgICAgICAgY2FtZXJhID0gbmV3IENhbWVyYSgpO1xyXG4gICAgICAgICAgICBfbWFpbkRpc3BsYXlMaXN0ID0gb2JqTGlzdDtcclxuICAgICAgICAgICAgX2NhbnZhcyA9IERvY3VtZW50LlF1ZXJ5U2VsZWN0b3I8SFRNTENhbnZhc0VsZW1lbnQ+KFwiY2FudmFzI1wiICsgY2FudmFzSUQpO1xyXG4gICAgICAgICAgICBfZHJhd2VyID0gbmV3IERyYXdlcihfY2FudmFzKTtcclxuICAgICAgICAgICAgX2NvbG9yID0gY29sb3I7XHJcbiAgICAgICAgICAgIG1vdXNlID0gbmV3IE1vdXNlKF9jYW52YXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgUmVmcmVzaCgpIHtcclxuICAgICAgICAgICAgX2RyYXdlci5GaWxsU2NyZWVuKF9jb2xvcik7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKEdhbWVPYmplY3Qgb2JqIGluIF9tYWluRGlzcGxheUxpc3QubGlzdCkge1xyXG4gICAgICAgICAgICAgICAgX2RyYXdlci5EcmF3KG9iai5wb3NpdGlvbi5YIC0gY2FtZXJhLnBvc2l0aW9uLlgsIG9iai5wb3NpdGlvbi5ZIC0gY2FtZXJhLnBvc2l0aW9uLlksIG9iai5zaXplLlgsIG9iai5zaXplLlksIG9iai5hbmdsZSwgb2JqLmltYWdlLGZhbHNlLDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuRXZlbnRzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBLZXlCb2FyZEV2ZW50XHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIGRlbGVnYXRlIHZvaWQgS2V5UHJlc3NFdmVudChpbnQga2V5Y29kZSk7XHJcbiAgICAgICAgcHVibGljIGV2ZW50IEtleVByZXNzRXZlbnQgT25LZXlQcmVzc0V2ZW50cztcclxuXHJcbiAgICAgICAgcHVibGljIGRlbGVnYXRlIHZvaWQgS2V5RG93bkV2ZW50KGludCBrZXljb2RlKTtcclxuICAgICAgICBwdWJsaWMgZXZlbnQgS2V5RG93bkV2ZW50IE9uS2V5RG93bkV2ZW50cztcclxuXHJcbiAgICAgICAgcHVibGljIGRlbGVnYXRlIHZvaWQgS2V5VXBFdmVudChpbnQga2V5Y29kZSk7XHJcbiAgICAgICAgcHVibGljIGV2ZW50IEtleVVwRXZlbnQgT25LZXlVcEV2ZW50cztcclxuXHJcbiAgICAgICAgcHVibGljIEtleUJvYXJkRXZlbnQoKSB7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkFkZEV2ZW50TGlzdGVuZXIoRXZlbnRUeXBlLktleVByZXNzLCAoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6QnJpZGdlLkh0bWw1LkV2ZW50PilEb0tleVByZXNzKTtcclxuICAgICAgICAgICAgRG9jdW1lbnQuQWRkRXZlbnRMaXN0ZW5lcihFdmVudFR5cGUuS2V5RG93biwgKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxnbG9iYWw6OkJyaWRnZS5IdG1sNS5FdmVudD4pRG9LZXlEb3duKTtcclxuICAgICAgICAgICAgRG9jdW1lbnQuQWRkRXZlbnRMaXN0ZW5lcihFdmVudFR5cGUuS2V5VXAsIChnbG9iYWw6OlN5c3RlbS5BY3Rpb248Z2xvYmFsOjpCcmlkZ2UuSHRtbDUuRXZlbnQ+KURvS2V5VXApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIERvS2V5UHJlc3MoRXZlbnQgZSkge1xyXG4gICAgICAgICAgICBpZiAoT25LZXlQcmVzc0V2ZW50cyA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIE9uS2V5UHJlc3NFdmVudHMuSW52b2tlKGUuQXM8S2V5Ym9hcmRFdmVudD4oKS5LZXlDb2RlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBEb0tleURvd24oRXZlbnQgZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChPbktleURvd25FdmVudHMgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBPbktleURvd25FdmVudHMuSW52b2tlKGUuQXM8S2V5Ym9hcmRFdmVudD4oKS5LZXlDb2RlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBEb0tleVVwKEV2ZW50IGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoT25LZXlVcEV2ZW50cyA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIE9uS2V5VXBFdmVudHMuSW52b2tlKGUuQXM8S2V5Ym9hcmRFdmVudD4oKS5LZXlDb2RlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HcmFwaGljcztcclxudXNpbmcgR2FtZUVuZ2luZUpTLlN5c3RlbTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuRGlzcGxheTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkNvbXBvbmVudHM7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBHYW1lXHJcbiAgICB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcHVibGljIERyYXdlciBkcmF3ZXIgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBTY2hlZHVsZXIgc2NoZWR1bGVyIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgU2NlbmUgc2NlbmUgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBNb3VzZSBtb3VzZSB7IGdldCB7IHJldHVybiBzY2VuZS5tb3VzZTsgfSB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgRGlzcGxheUxpc3QgX2Rpc3BsYXlMaXN0O1xyXG4gICAgICAgIHByaXZhdGUgQ29tcG9uZW50UmVhZGVyIF9jb21wb25lbnRSZWFkZXI7XHJcblxyXG4gICAgICAgIHB1YmxpYyBHYW1lKHN0cmluZyBjYW52YXNJRCkgOiB0aGlzKGNhbnZhc0lELCBcIiNmZmZcIikgeyB9XHJcbiAgICAgICAgcHVibGljIEdhbWUoc3RyaW5nIGNhbnZhc0lELHN0cmluZyBjb2xvcikge1xyXG4gICAgICAgICAgICBfZGlzcGxheUxpc3QgPSBuZXcgRGlzcGxheUxpc3QoKTtcclxuICAgICAgICAgICAgc2NlbmUgPSBuZXcgU2NlbmUoX2Rpc3BsYXlMaXN0LGNhbnZhc0lELGNvbG9yKTtcclxuICAgICAgICAgICAgX2NvbXBvbmVudFJlYWRlciA9IG5ldyBDb21wb25lbnRSZWFkZXIoX2Rpc3BsYXlMaXN0KTtcclxuICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICBzY2hlZHVsZXIgPSBuZXcgU2NoZWR1bGVyKCk7XHJcbiAgICAgICAgICAgIHNjaGVkdWxlci5BZGQoKGdsb2JhbDo6U3lzdGVtLkFjdGlvbilzY2VuZS5SZWZyZXNoKTtcclxuICAgICAgICAgICAgc2NoZWR1bGVyLkFkZCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uKV9jb21wb25lbnRSZWFkZXIudXBkYXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZENoaWxkKEdhbWVPYmplY3Qgb2JqKSB7XHJcbiAgICAgICAgICAgIF9kaXNwbGF5TGlzdC5BZGQob2JqKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HcmFwaGljcztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkNvbXBvbmVudHM7XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0c1xyXG57XHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgY2xhc3MgR2FtZU9iamVjdFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIHBvc2l0aW9uIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgVmVjdG9yMiBzaXplIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgYW5nbGUgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBVbmlvbjxIVE1MQ2FudmFzRWxlbWVudCwgSW1hZ2U+IGltYWdlIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgRGljdGlvbmFyeTxzdHJpbmcsIENvbXBvbmVudD4gY29tcG9uZW50cyA9IG5ldyBEaWN0aW9uYXJ5PHN0cmluZywgQ29tcG9uZW50PigpO1xyXG5cclxuICAgICAgICAvL1B1YmxpYyBNZXRob2RzXHJcbiAgICAgICAgcHVibGljIENvbXBvbmVudCBBZGRDb21wb25lbnQoc3RyaW5nIGluc3RhbmNlTmFtZSwgQ29tcG9uZW50IGNvbXBvbmVudClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbXBvbmVudHNbaW5zdGFuY2VOYW1lXSA9IGNvbXBvbmVudDtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudHNbaW5zdGFuY2VOYW1lXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5HcmFwaGljc1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgRHJhd2VyXHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgX2N0eDtcclxuICAgICAgICBwcml2YXRlIEhUTUxDYW52YXNFbGVtZW50IF9jYW52YXM7XHJcblxyXG4gICAgICAgIHB1YmxpYyBEcmF3ZXIoSFRNTENhbnZhc0VsZW1lbnQgY2FudmFzKSB7XHJcbiAgICAgICAgICAgIF9jdHggPSAoQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKWNhbnZhcy5HZXRDb250ZXh0KFwiMmRcIik7XHJcbiAgICAgICAgICAgIF9jYW52YXMgPSBjYW52YXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBGaWxsU2NyZWVuKHN0cmluZyBjb2xvcikge1xyXG4gICAgICAgICAgICBfY3R4LkZpbGxTdHlsZSA9IGNvbG9yO1xyXG4gICAgICAgICAgICBfY3R4LkZpbGxSZWN0KDAsMCxfY2FudmFzLldpZHRoLF9jYW52YXMuSGVpZ2h0KTtcclxuICAgICAgICB9XHJcbnB1YmxpYyB2b2lkIERyYXcoZmxvYXQgeCwgZmxvYXQgeSwgZmxvYXQgdywgZmxvYXQgaCwgZHluYW1pYyBpbWcpXHJcbntcclxuICAgIERyYXcoeCwgeSwgdywgaCwgMCwgaW1nLCBmYWxzZSwgMSk7XHJcbn0gICAgICAgIHB1YmxpYyB2b2lkIERyYXcoZmxvYXQgeCwgZmxvYXQgeSwgZmxvYXQgdywgZmxvYXQgaCwgZmxvYXQgciwgZHluYW1pYyBpbWcsIGJvb2wgZm9sbG93LCBmbG9hdCBhbHBoYSkge1xyXG4gICAgICAgICAgICBfY3R4LkltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBfY2FudmFzLlN0eWxlLkltYWdlUmVuZGVyaW5nID0gSW1hZ2VSZW5kZXJpbmcuUGl4ZWxhdGVkO1xyXG4gICAgICAgICAgICBfY3R4LlNhdmUoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChpbWcuZGF0YSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBpbWcgPSBpbWcuZGF0YTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9PYmplY3QgUm90YXRpb25cclxuICAgICAgICAgICAgZmxvYXQgb3ggPSB4ICsgKHcgLyAyKTtcclxuICAgICAgICAgICAgZmxvYXQgb3kgPSB5ICsgKGggLyAyKTtcclxuXHJcbiAgICAgICAgICAgIF9jdHguVHJhbnNsYXRlKG94LCBveSk7XHJcbiAgICAgICAgICAgIF9jdHguUm90YXRlKChyKSAqIE1hdGguUEkgLyAxODApOyAvL2RlZ3JlZVxyXG4gICAgICAgICAgICBfY3R4LlRyYW5zbGF0ZSgtb3gsIC1veSk7XHJcbiAgICAgICAgICAgIC8vLS0tLS0tLVxyXG5cclxuICAgICAgICAgICAgX2N0eC5EcmF3SW1hZ2UoaW1nLCB4LCB5LCB3LCBoKTtcclxuXHJcbiAgICAgICAgICAgIF9jdHguUmVzdG9yZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcblxyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5HcmFwaGljc1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgSW1hZ2VcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgSFRNTEltYWdlRWxlbWVudCBkYXRhIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIEltYWdlKHN0cmluZyBzcmMpIHtcclxuICAgICAgICAgICAgZGF0YSA9IG5ldyBIVE1MSW1hZ2VFbGVtZW50KCk7XHJcbiAgICAgICAgICAgIGRhdGEuU3JjID0gc3JjO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuTWF0aHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFZlY3RvcjJcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgWCB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IFkgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgVmVjdG9yMihmbG9hdCBfeCAsIGZsb2F0IF95KSB7XHJcbiAgICAgICAgICAgIFggPSBfeDtcclxuICAgICAgICAgICAgWSA9IF95O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5NYXRoc1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgVmVjdG9yNFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBYIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgWSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IFogeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBXIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIFZlY3RvcjQoZmxvYXQgX3gsIGZsb2F0IF95LCBmbG9hdCBfeiwgZmxvYXQgX3cpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBYID0gX3g7XHJcbiAgICAgICAgICAgIFkgPSBfeTtcclxuICAgICAgICAgICAgWiA9IF96O1xyXG4gICAgICAgICAgICBXID0gX3c7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5TeXN0ZW1cclxue1xyXG4gICAgcHVibGljIGNsYXNzIE1vdXNlXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IHggeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCB5IHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwcml2YXRlIEhUTUxDYW52YXNFbGVtZW50IF9jYW52YXM7XHJcblxyXG4gICAgICAgIGludGVybmFsIE1vdXNlKEhUTUxDYW52YXNFbGVtZW50IGNhbnZhcykge1xyXG4gICAgICAgICAgICBfY2FudmFzID0gY2FudmFzO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5BZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxnbG9iYWw6OkJyaWRnZS5IdG1sNS5FdmVudD4pVXBkYXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBVcGRhdGUoRXZlbnQgZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIENsaWVudFJlY3QgcmVjdCA9IF9jYW52YXMuR2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgICAgIHggPSBlLkFzPE1vdXNlRXZlbnQ+KCkuQ2xpZW50WCAtIChmbG9hdClyZWN0LkxlZnQ7XHJcbiAgICAgICAgICAgIHkgPSBlLkFzPE1vdXNlRXZlbnQ+KCkuQ2xpZW50WSAtIChmbG9hdClyZWN0LlRvcDtcclxuICAgICAgICB9XHJcblxuICAgIFxucHJpdmF0ZSBmbG9hdCBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9feD0wO3ByaXZhdGUgZmxvYXQgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX3k9MDt9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuU3lzdGVtXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBTY2hlZHVsZXJcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIExpc3Q8QWN0aW9uPiBfYWN0aW9uTGlzdCA9IG5ldyBMaXN0PEFjdGlvbj4oKTtcclxuXHJcbiAgICAgICAgaW50ZXJuYWwgU2NoZWR1bGVyKCkge1xyXG4gICAgICAgICAgICBVcGRhdGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZChBY3Rpb24gbWV0aG9kcykge1xyXG4gICAgICAgICAgICBfYWN0aW9uTGlzdC5BZGQoKGdsb2JhbDo6U3lzdGVtLkFjdGlvbikoKCkgPT4gbWV0aG9kcygpKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBVcGRhdGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yZWFjaCAoQWN0aW9uIGEgaW4gX2FjdGlvbkxpc3QpIHtcclxuICAgICAgICAgICAgICAgIGEoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgV2luZG93LlJlcXVlc3RBbmltYXRpb25GcmFtZSgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uKVVwZGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5Db21wb25lbnRzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBBbmltYXRvciA6IENvbXBvbmVudFxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgRGljdGlvbmFyeTxzdHJpbmcsIExpc3Q8SW1hZ2U+PiBfYW5pbWF0aW9ucyB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIHN0cmluZyBjdXJyZW50QW5pbWF0aW9uIHsgZ2V0OyBzZXQ7IH0gIFxyXG4gICAgICAgIHB1YmxpYyBpbnQgY3VycmVudEZyYW1lIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgaW50IGZwcyB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgYm9vbCBfcGxheWluZyA9IGZhbHNlO1xyXG4gICAgICAgIHByaXZhdGUgZG91YmxlIGxhc3RUaW1lRnJhbWUgPSAwO1xyXG5cclxuICAgICAgICBwdWJsaWMgQW5pbWF0b3IoR2FtZU9iamVjdCBwYXJlbnQpIDogYmFzZShwYXJlbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBfYW5pbWF0aW9ucyA9IG5ldyBEaWN0aW9uYXJ5PHN0cmluZywgTGlzdDxJbWFnZT4+KCk7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgdm9pZCBHb3RvQW5kUGxheShzdHJpbmcgYW5pbWF0aW9uTmFtZSlcclxue1xyXG4gICAgR290b0FuZFBsYXkoYW5pbWF0aW9uTmFtZSwgMCk7XHJcbn0gICAgICAgIHB1YmxpYyB2b2lkIEdvdG9BbmRQbGF5KHN0cmluZyBhbmltYXRpb25OYW1lLCBpbnQgZnJhbWUpIHtcclxuICAgICAgICAgICAgY3VycmVudEFuaW1hdGlvbiA9IGFuaW1hdGlvbk5hbWU7XHJcbiAgICAgICAgICAgIGN1cnJlbnRGcmFtZSA9IGZyYW1lO1xyXG4gICAgICAgICAgICBfcGxheWluZyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgdm9pZCBHb3RvQW5kU3RvcChzdHJpbmcgYW5pbWF0aW9uTmFtZSlcclxue1xyXG4gICAgR290b0FuZFN0b3AoYW5pbWF0aW9uTmFtZSwgMCk7XHJcbn0gICAgICAgIHB1YmxpYyB2b2lkIEdvdG9BbmRTdG9wKHN0cmluZyBhbmltYXRpb25OYW1lLCBpbnQgZnJhbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjdXJyZW50QW5pbWF0aW9uID0gYW5pbWF0aW9uTmFtZTtcclxuICAgICAgICAgICAgY3VycmVudEZyYW1lID0gZnJhbWU7XHJcbiAgICAgICAgICAgIF9wbGF5aW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBTdG9wKCkge1xyXG4gICAgICAgICAgICBfcGxheWluZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgU3RhcnQoKSB7XHJcbiAgICAgICAgICAgIF9wbGF5aW5nID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIENyZWF0ZShzdHJpbmcgYW5pbWF0aW9uTmFtZSwgTGlzdDxJbWFnZT4gbGlzdCl7XHJcbiAgICAgICAgICAgIF9hbmltYXRpb25zW2FuaW1hdGlvbk5hbWVdID0gbGlzdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGludGVybmFsIG92ZXJyaWRlIHZvaWQgVXBkYXRlKCkge1xyXG4gICAgICAgICAgICBpZiAoIV9wbGF5aW5nKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBkb3VibGUgbm93ID0gRGF0ZVRpbWUuTm93LlN1YnRyYWN0KERhdGVUaW1lLk1pblZhbHVlLkFkZFllYXJzKDIwMTcpKS5Ub3RhbE1pbGxpc2Vjb25kcztcclxuICAgICAgICAgICAgZG91YmxlIGRlbHRhID0gbm93IC0gbGFzdFRpbWVGcmFtZTtcclxuICAgICAgICAgICAgaWYgKGRlbHRhID4gMTAwMC9mcHMpIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRGcmFtZSsrO1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRGcmFtZSA+PSBfYW5pbWF0aW9uc1tjdXJyZW50QW5pbWF0aW9uXS5Db3VudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRGcmFtZSA9IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBwYXJlbnQuaW1hZ2UgPSBfYW5pbWF0aW9uc1tjdXJyZW50QW5pbWF0aW9uXVtjdXJyZW50RnJhbWVdO1xyXG5cclxuICAgICAgICAgICAgICAgIGxhc3RUaW1lRnJhbWUgPSBub3c7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cblxyXG4gICAgXG5wcml2YXRlIHN0cmluZyBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fY3VycmVudEFuaW1hdGlvbj1cIlwiIDtwcml2YXRlIGludCBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fY3VycmVudEZyYW1lPTA7cHJpdmF0ZSBpbnQgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX2Zwcz0xO31cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5NYXRocztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuQ29tcG9uZW50c1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgQ29sbGlzaW9uIDogQ29tcG9uZW50XHJcbiAgICB7XHJcblxyXG4gICAgICAgIHJlYWRvbmx5IExpc3Q8VmVjdG9yND4gX2JveGVzO1xyXG5cclxuICAgICAgICBwdWJsaWMgQ29sbGlzaW9uKEdhbWVPYmplY3QgX3BhcmVudCkgOiBiYXNlKF9wYXJlbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBfYm94ZXMgPSBuZXcgTGlzdDxWZWN0b3I0PigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkQm94KGZsb2F0IHgxLGZsb2F0IHkxLCBmbG9hdCB3aWR0aCwgZmxvYXQgaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIF9ib3hlcy5BZGQobmV3IFZlY3RvcjQoeDEseTEsd2lkdGgsaGVpZ2h0KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgYm9vbCBIaXRUZXN0T2JqZWN0KEdhbWVPYmplY3Qgb2JqKSB7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKENvbXBvbmVudCBjcCBpbiBvYmouY29tcG9uZW50cy5WYWx1ZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjcC5HZXRUeXBlKCkgPT0gdHlwZW9mKENvbGxpc2lvbikpIHtcclxuICAgICAgICAgICAgICAgICAgICBDb2xsaXNpb24gYyA9IChDb2xsaXNpb24pY3A7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yZWFjaCAoVmVjdG9yNCBiIGluIF9ib3hlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JlYWNoIChWZWN0b3I0IGIyIGluIGMuX2JveGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYi5YICsgcGFyZW50LnBvc2l0aW9uLlggPCBiMi5YICsgYjIuWiArIG9iai5wb3NpdGlvbi5YICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiLlggKyBiLlogKyBwYXJlbnQucG9zaXRpb24uWCA+IGIyLlggKyBvYmoucG9zaXRpb24uWCAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYi5ZICsgcGFyZW50LnBvc2l0aW9uLlkgPCBiMi5ZICsgYjIuVyArIG9iai5wb3NpdGlvbi5ZICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiLlcgKyBiLlkgKyBwYXJlbnQucG9zaXRpb24uWSA+IGIyLlkgKyBvYmoucG9zaXRpb24uWSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBib29sIEhpdFRlc3RQb2ludChmbG9hdCB4LGZsb2F0IHkpIHtcclxuICAgICAgICAgICAgZm9yZWFjaCAoVmVjdG9yNCBiIGluIF9ib3hlcylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKHggPCBiLlggKyBwYXJlbnQucG9zaXRpb24uWCArIGIuWiAmJlxyXG4gICAgICAgICAgICAgICAgICAgeCA+IGIuWCArIHBhcmVudC5wb3NpdGlvbi5YICYmXHJcbiAgICAgICAgICAgICAgICAgICB5IDwgYi5ZICsgcGFyZW50LnBvc2l0aW9uLlkgKyBiLlcgJiZcclxuICAgICAgICAgICAgICAgICAgIHkgPiBiLlkgKyBwYXJlbnQucG9zaXRpb24uWSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HcmFwaGljcztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkNvbXBvbmVudHM7XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0c1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgU3ByaXRlIDogR2FtZU9iamVjdFxyXG4gICAge1xyXG4gICAgICAgIC8vQ29uc3RydWN0b3JcclxuICAgICAgICBwdWJsaWMgU3ByaXRlKFZlY3RvcjIgX3Bvc2l0aW9uLCBWZWN0b3IyIF9zaXplLCBVbmlvbjxIVE1MQ2FudmFzRWxlbWVudCwgSW1hZ2U+IF9pbWFnZSkge1xyXG4gICAgICAgICAgICBwb3NpdGlvbiA9IF9wb3NpdGlvbjtcclxuICAgICAgICAgICAgc2l6ZSA9IF9zaXplO1xyXG4gICAgICAgICAgICBpbWFnZSA9IF9pbWFnZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl0KfQo=
