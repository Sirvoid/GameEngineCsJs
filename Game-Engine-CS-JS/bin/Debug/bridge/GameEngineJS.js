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
                        this.recursiveUpdate(obj);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            },
            recursiveUpdate: function (obj) {
                var $t, $t1;
                if (this.displayList.list.Count <= 0) {
                    return;
                }
                $t = Bridge.getEnumerator(obj.displayList.list);
                try {
                    while ($t.moveNext()) {
                        var obj2 = $t.Current;
                        $t1 = Bridge.getEnumerator(obj2.components);
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
                        this.recursiveUpdate(obj2);
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
            Add: function (obj, parent) {
                this.list.add(obj);
                obj._parent = parent;
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
                        this.DrawChild(obj, obj.position.X, obj.position.Y, obj.angle);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            },
            DrawChild: function (obj, x, y, angle) {
                var $t;
                $t = Bridge.getEnumerator(obj.displayList.list);
                try {
                    while ($t.moveNext()) {
                        var obj2 = $t.Current;
                        var newX = x + (Math.cos(obj.angle * Math.PI / 180)) * obj2.position.X - this.camera.position.X;
                        var newY = y + (Math.sin(obj.angle * Math.PI / 180)) * obj2.position.Y - this.camera.position.Y;
                        var newAngle = obj2.angle + angle;

                        this._drawer.Draw$1(newX, newY, obj2.size.X, obj2.size.Y, newAngle, obj2.image, false, 1);
                        this.DrawChild(obj2, newX, newY, newAngle);

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
                this._displayList.Add(obj, null);
            }
        }
    });

    Bridge.define("GameEngineJS.GameObjects.GameObject", {
        fields: {
            position: null,
            size: null,
            angle: 0,
            image: null,
            components: null,
            displayList: null,
            _parent: null
        },
        ctors: {
            init: function () {
                this.components = new (System.Collections.Generic.Dictionary$2(System.String,GameEngineJS.Components.Component))();
                this.displayList = new GameEngineJS.Display.DisplayList();
            }
        },
        methods: {
            AddComponent: function (instanceName, component) {
                this.components.set(instanceName, component);
                return this.components.get(instanceName);
            },
            AddChild: function (obj) {
                this.displayList.Add(obj, this);
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
            ParentPosCalculationX: function (x, parent) {
                var adding = 0;
                var angleAdding = 0;

                if (parent._parent != null) {
                    adding = this.ParentPosCalculationX(parent.position.X, parent._parent);
                    angleAdding = (Math.cos(parent._parent.angle * Math.PI / 180)) * x;
                }

                if (parent._parent == null) {
                    adding += parent.position.X;
                }

                return adding + angleAdding;
            },
            ParentPosCalculationY: function (y, parent) {
                var adding = 0;
                var angleAdding = 0;

                if (parent._parent != null) {
                    adding = this.ParentPosCalculationY(parent.position.Y, parent._parent);
                    angleAdding = (Math.sin(parent._parent.angle * Math.PI / 180)) * y;
                }

                if (parent._parent == null) {
                    adding += parent.position.Y;
                }

                return adding + angleAdding;
            },
            HitTestObject: function (obj) {
                var $t, $t1, $t2;

                var px = this.parent.position.X;
                var py = this.parent.position.Y;
                var p2x = obj.position.X;
                var p2y = obj.position.Y;

                if (this.parent._parent != null) {
                    px = this.ParentPosCalculationX(this.parent.position.X, this.parent);
                    py = this.ParentPosCalculationY(this.parent.position.Y, this.parent);
                }

                if (obj._parent != null) {
                    p2x = this.ParentPosCalculationX(obj.position.X, obj);
                    p2y = this.ParentPosCalculationY(obj.position.Y, obj);
                }

                System.Console.Write(System.Single.format(px) + " " + System.Single.format(py) + "/" + " " + System.Single.format(p2x) + " " + System.Single.format(p2y));

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
                                            if (b.X + px < b2.X + p2x + b2.Z && b.X + b.Z + px > b2.X + p2x && b.Y + py < b2.Y + b2.W + p2y && b.W + b.Y + py > b2.Y + p2y) {
                                                System.Console.Write("a");
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

                var px = this.parent.position.X;
                var py = this.parent.position.Y;

                if (this.parent._parent != null) {
                    px = this.ParentPosCalculationX(this.parent.position.X, this.parent);
                    py = this.ParentPosCalculationX(this.parent.position.Y, this.parent);
                }

                $t = Bridge.getEnumerator(this._boxes);
                try {
                    while ($t.moveNext()) {
                        var b = $t.Current;
                        if (x < b.X + px + b.Z && x > b.X + px && y < b.Y + py + b.W && y > b.Y + py) {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJHYW1lRW5naW5lSlMuanMiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbIkNvbXBvbmVudHMvQ29tcG9uZW50LmNzIiwiQ29tcG9uZW50cy9Db21wb25lbnRSZWFkZXIuY3MiLCJEaXNwbGF5L0NhbWVyYS5jcyIsIkRpc3BsYXkvRGlzcGxheUxpc3QuY3MiLCJEaXNwbGF5L1NjZW5lLmNzIiwiRXZlbnRzL0tleUJvYXJkRXZlbnQuY3MiLCJHYW1lLmNzIiwiR2FtZU9iamVjdHMvR2FtZU9iamVjdC5jcyIsIkdyYXBoaWNzL0RyYXdlci5jcyIsIkdyYXBoaWNzL0ltYWdlLmNzIiwiTWF0aHMvVmVjdG9yMi5jcyIsIk1hdGhzL1ZlY3RvcjQuY3MiLCJTeXN0ZW0vTW91c2UuY3MiLCJTeXN0ZW0vU2NoZWR1bGVyLmNzIiwiQ29tcG9uZW50cy9BbmltYXRvci5jcyIsIkNvbXBvbmVudHMvQ29sbGlzaW9uLmNzIiwiR2FtZU9iamVjdHMvU3ByaXRlLmNzIl0sCiAgIm5hbWVzIjogWyIiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7OzRCQVEyQkE7O2dCQUNmQSxjQUFTQTs7Ozs7Ozs7Ozs7Ozs0QkNFWUE7O2dCQUNyQkEsbUJBQWNBOzs7Ozs7Z0JBSWRBLDBCQUEyQkE7Ozs7d0JBQ3ZCQSwyQkFBc0RBOzs7O2dDQUVsREE7Ozs7Ozs7d0JBRUpBLHFCQUFnQkE7Ozs7Ozs7O3VDQUlLQTs7Z0JBQ3pCQSxJQUFJQTtvQkFBNkJBOztnQkFDakNBLDBCQUE0QkE7Ozs7d0JBRXhCQSwyQkFBc0RBOzs7O2dDQUVsREE7Ozs7Ozs7d0JBRUpBLHFCQUFnQkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0JDbkJwQkEsZ0JBQVdBLElBQUlBO2dCQUNmQTs7OEJBR1VBLFdBQWtCQTs7Z0JBQzVCQSxnQkFBV0E7Z0JBQ1hBLGdCQUFXQTs7Ozs7Ozs7Ozs7NEJDRmdDQSxLQUFJQTs7OzsyQkFObkNBLEtBQWVBO2dCQUMzQkEsY0FBU0E7Z0JBQ1RBLGNBQWNB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QUFPQSxPQUN6QkEsTUFBTUEsTUFBTUEsS0FBTUEsT0FBT0E7Z0RBQ3hCQTtnREFDQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztnQkFNcEJBOztvQ0FHcUJBLEdBQVFBOzs7Z0JBRTdCQSxTQUFXQTtnQkFDWEEsU0FBV0E7O2dCQUVYQSxJQUFJQSx1QkFBa0JBO29CQUVsQkEsS0FBS0EsMkJBQXNCQSx3QkFBbUJBO29CQUM5Q0EsS0FBS0EsMkJBQXNCQSx3QkFBbUJBOzs7Z0JBR2xEQSwwQkFBc0JBOzs7O3dCQUVsQkEsSUFBSUEsSUFBSUEsTUFBTUEsS0FBS0EsT0FDaEJBLElBQUlBLE1BQU1BLE1BQ1ZBLElBQUlBLE1BQU1BLEtBQUtBLE9BQ2ZBLElBQUlBLE1BQU1BOzRCQUNUQTs7Ozs7Ozs7Z0JBR1JBOzs7Ozs7Ozs0QkNqR1VBLFdBQW1CQSxPQUFlQTs7O2dCQUM1Q0EsZ0JBQVdBO2dCQUNYQSxZQUFPQTtnQkFDUEEsYUFBUUEiLAogICJzb3VyY2VzQ29udGVudCI6IFsidXNpbmcgU3lzdGVtO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHM7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkNvbXBvbmVudHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIENvbXBvbmVudFxyXG4gICAge1xyXG4gICAgICAgIGludGVybmFsIEdhbWVPYmplY3QgcGFyZW50IHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBpbnRlcm5hbCBDb21wb25lbnQoR2FtZU9iamVjdCBfcGFyZW50KSB7XHJcbiAgICAgICAgICAgIHBhcmVudCA9IF9wYXJlbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnRlcm5hbCB2aXJ0dWFsIHZvaWQgVXBkYXRlKCkge31cclxuXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkRpc3BsYXk7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuQ29tcG9uZW50c1xyXG57XHJcbiAgICBpbnRlcm5hbCBjbGFzcyBDb21wb25lbnRSZWFkZXJcclxuICAgIHtcclxuICAgICAgICBpbnRlcm5hbCBEaXNwbGF5TGlzdCBkaXNwbGF5TGlzdCB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIGludGVybmFsIENvbXBvbmVudFJlYWRlcihEaXNwbGF5TGlzdCBsaXN0KSB7XHJcbiAgICAgICAgICAgIGRpc3BsYXlMaXN0ID0gbGlzdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGludGVybmFsIHZvaWQgdXBkYXRlKCkge1xyXG4gICAgICAgICAgICBmb3JlYWNoIChHYW1lT2JqZWN0IG9iaiBpbiBkaXNwbGF5TGlzdC5saXN0KSB7XHJcbiAgICAgICAgICAgICAgICBmb3JlYWNoIChLZXlWYWx1ZVBhaXI8c3RyaW5nLCBDb21wb25lbnQ+IGNvbXBvbmVudCBpbiBvYmouY29tcG9uZW50cylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuVmFsdWUuVXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZWN1cnNpdmVVcGRhdGUob2JqKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIHJlY3Vyc2l2ZVVwZGF0ZShHYW1lT2JqZWN0IG9iaikge1xyXG4gICAgICAgICAgICBpZiAoZGlzcGxheUxpc3QubGlzdC5Db3VudCA8PSAwKSByZXR1cm47XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKEdhbWVPYmplY3Qgb2JqMiBpbiBvYmouZGlzcGxheUxpc3QubGlzdClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZm9yZWFjaCAoS2V5VmFsdWVQYWlyPHN0cmluZywgQ29tcG9uZW50PiBjb21wb25lbnQgaW4gb2JqMi5jb21wb25lbnRzKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5WYWx1ZS5VcGRhdGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlY3Vyc2l2ZVVwZGF0ZShvYmoyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxudXNpbmcgR2FtZUVuZ2luZUpTLk1hdGhzO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5EaXNwbGF5XHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBDYW1lcmFcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgVmVjdG9yMiBwb3NpdGlvbiB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IHJvdGF0aW9uIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIENhbWVyYSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwb3NpdGlvbiA9IG5ldyBWZWN0b3IyKDAsMCk7XHJcbiAgICAgICAgICAgIHJvdGF0aW9uID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBDYW1lcmEoVmVjdG9yMiBfcG9zaXRpb24sZmxvYXQgX3JvdGF0aW9uKSB7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uID0gX3Bvc2l0aW9uO1xyXG4gICAgICAgICAgICByb3RhdGlvbiA9IF9yb3RhdGlvbjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuRGlzcGxheVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgRGlzcGxheUxpc3RcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgTGlzdDxHYW1lT2JqZWN0PiBsaXN0IHsgZ2V0OyBzZXQ7IH0gIFxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBBZGQoR2FtZU9iamVjdCBvYmosR2FtZU9iamVjdCBwYXJlbnQpIHtcclxuICAgICAgICAgICAgbGlzdC5BZGQob2JqKTtcclxuICAgICAgICAgICAgb2JqLl9wYXJlbnQgPSBwYXJlbnQ7XHJcbiAgICAgICAgfVxyXG5cbiAgICBcbnByaXZhdGUgTGlzdDxHYW1lT2JqZWN0PiBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fbGlzdD1uZXcgTGlzdDxHYW1lT2JqZWN0PigpIDt9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HcmFwaGljcztcclxudXNpbmcgR2FtZUVuZ2luZUpTLk1hdGhzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuU3lzdGVtO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5EaXNwbGF5XHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBTY2VuZVxyXG4gICAge1xyXG5cclxuICAgICAgICBwdWJsaWMgQ2FtZXJhIGNhbWVyYSB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgRGlzcGxheUxpc3QgX21haW5EaXNwbGF5TGlzdDtcclxuICAgICAgICBwcml2YXRlIERyYXdlciBfZHJhd2VyO1xyXG4gICAgICAgIHByaXZhdGUgSFRNTENhbnZhc0VsZW1lbnQgX2NhbnZhcztcclxuICAgICAgICBwcml2YXRlIHN0cmluZyBfY29sb3I7XHJcbiAgICAgICAgcHVibGljIE1vdXNlIG1vdXNlIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIFNjZW5lKERpc3BsYXlMaXN0IG9iakxpc3Qsc3RyaW5nIGNhbnZhc0lELHN0cmluZyBjb2xvcikge1xyXG4gICAgICAgICAgICBjYW1lcmEgPSBuZXcgQ2FtZXJhKCk7XHJcbiAgICAgICAgICAgIF9tYWluRGlzcGxheUxpc3QgPSBvYmpMaXN0O1xyXG4gICAgICAgICAgICBfY2FudmFzID0gRG9jdW1lbnQuUXVlcnlTZWxlY3RvcjxIVE1MQ2FudmFzRWxlbWVudD4oXCJjYW52YXMjXCIgKyBjYW52YXNJRCk7XHJcbiAgICAgICAgICAgIF9kcmF3ZXIgPSBuZXcgRHJhd2VyKF9jYW52YXMpO1xyXG4gICAgICAgICAgICBfY29sb3IgPSBjb2xvcjtcclxuICAgICAgICAgICAgbW91c2UgPSBuZXcgTW91c2UoX2NhbnZhcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBSZWZyZXNoKCkge1xyXG4gICAgICAgICAgICBfZHJhd2VyLkZpbGxTY3JlZW4oX2NvbG9yKTtcclxuICAgICAgICAgICAgZm9yZWFjaCAoR2FtZU9iamVjdCBvYmogaW4gX21haW5EaXNwbGF5TGlzdC5saXN0KSB7XHJcbiAgICAgICAgICAgICAgICBfZHJhd2VyLkRyYXcob2JqLnBvc2l0aW9uLlggLSBjYW1lcmEucG9zaXRpb24uWCwgb2JqLnBvc2l0aW9uLlkgLSBjYW1lcmEucG9zaXRpb24uWSwgb2JqLnNpemUuWCwgb2JqLnNpemUuWSwgb2JqLmFuZ2xlLCBvYmouaW1hZ2UsZmFsc2UsMSk7XHJcbiAgICAgICAgICAgICAgICBEcmF3Q2hpbGQob2JqLG9iai5wb3NpdGlvbi5YLG9iai5wb3NpdGlvbi5ZLG9iai5hbmdsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBEcmF3Q2hpbGQoR2FtZU9iamVjdCBvYmosZmxvYXQgeCxmbG9hdCB5LGZsb2F0IGFuZ2xlKSB7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKEdhbWVPYmplY3Qgb2JqMiBpbiBvYmouZGlzcGxheUxpc3QubGlzdClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZmxvYXQgbmV3WCA9IHggKyAoZmxvYXQpKE1hdGguQ29zKG9iai5hbmdsZSpNYXRoLlBJLzE4MCkpICogb2JqMi5wb3NpdGlvbi5YIC0gY2FtZXJhLnBvc2l0aW9uLlg7XHJcbiAgICAgICAgICAgICAgICBmbG9hdCBuZXdZID0geSArIChmbG9hdCkoTWF0aC5TaW4ob2JqLmFuZ2xlKk1hdGguUEkvMTgwKSkgKiBvYmoyLnBvc2l0aW9uLlkgLSBjYW1lcmEucG9zaXRpb24uWTtcclxuICAgICAgICAgICAgICAgIGZsb2F0IG5ld0FuZ2xlID0gb2JqMi5hbmdsZSArIGFuZ2xlO1xyXG5cclxuICAgICAgICAgICAgICAgIF9kcmF3ZXIuRHJhdyhuZXdYLCBuZXdZLCBvYmoyLnNpemUuWCwgb2JqMi5zaXplLlksIG5ld0FuZ2xlLCBvYmoyLmltYWdlLCBmYWxzZSwgMSk7XHJcbiAgICAgICAgICAgICAgICBEcmF3Q2hpbGQob2JqMixuZXdYLG5ld1ksbmV3QW5nbGUpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuRXZlbnRzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBLZXlCb2FyZEV2ZW50XHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIGRlbGVnYXRlIHZvaWQgS2V5UHJlc3NFdmVudChpbnQga2V5Y29kZSk7XHJcbiAgICAgICAgcHVibGljIGV2ZW50IEtleVByZXNzRXZlbnQgT25LZXlQcmVzc0V2ZW50cztcclxuXHJcbiAgICAgICAgcHVibGljIGRlbGVnYXRlIHZvaWQgS2V5RG93bkV2ZW50KGludCBrZXljb2RlKTtcclxuICAgICAgICBwdWJsaWMgZXZlbnQgS2V5RG93bkV2ZW50IE9uS2V5RG93bkV2ZW50cztcclxuXHJcbiAgICAgICAgcHVibGljIGRlbGVnYXRlIHZvaWQgS2V5VXBFdmVudChpbnQga2V5Y29kZSk7XHJcbiAgICAgICAgcHVibGljIGV2ZW50IEtleVVwRXZlbnQgT25LZXlVcEV2ZW50cztcclxuXHJcbiAgICAgICAgcHVibGljIEtleUJvYXJkRXZlbnQoKSB7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkFkZEV2ZW50TGlzdGVuZXIoRXZlbnRUeXBlLktleVByZXNzLCAoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6QnJpZGdlLkh0bWw1LkV2ZW50PilEb0tleVByZXNzKTtcclxuICAgICAgICAgICAgRG9jdW1lbnQuQWRkRXZlbnRMaXN0ZW5lcihFdmVudFR5cGUuS2V5RG93biwgKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxnbG9iYWw6OkJyaWRnZS5IdG1sNS5FdmVudD4pRG9LZXlEb3duKTtcclxuICAgICAgICAgICAgRG9jdW1lbnQuQWRkRXZlbnRMaXN0ZW5lcihFdmVudFR5cGUuS2V5VXAsIChnbG9iYWw6OlN5c3RlbS5BY3Rpb248Z2xvYmFsOjpCcmlkZ2UuSHRtbDUuRXZlbnQ+KURvS2V5VXApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIERvS2V5UHJlc3MoRXZlbnQgZSkge1xyXG4gICAgICAgICAgICBpZiAoT25LZXlQcmVzc0V2ZW50cyA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIE9uS2V5UHJlc3NFdmVudHMuSW52b2tlKGUuQXM8S2V5Ym9hcmRFdmVudD4oKS5LZXlDb2RlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBEb0tleURvd24oRXZlbnQgZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChPbktleURvd25FdmVudHMgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBPbktleURvd25FdmVudHMuSW52b2tlKGUuQXM8S2V5Ym9hcmRFdmVudD4oKS5LZXlDb2RlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBEb0tleVVwKEV2ZW50IGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoT25LZXlVcEV2ZW50cyA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIE9uS2V5VXBFdmVudHMuSW52b2tlKGUuQXM8S2V5Ym9hcmRFdmVudD4oKS5LZXlDb2RlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HcmFwaGljcztcclxudXNpbmcgR2FtZUVuZ2luZUpTLlN5c3RlbTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuRGlzcGxheTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkNvbXBvbmVudHM7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBHYW1lXHJcbiAgICB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcHVibGljIERyYXdlciBkcmF3ZXIgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBTY2hlZHVsZXIgc2NoZWR1bGVyIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgU2NlbmUgc2NlbmUgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBNb3VzZSBtb3VzZSB7IGdldCB7IHJldHVybiBzY2VuZS5tb3VzZTsgfSB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgRGlzcGxheUxpc3QgX2Rpc3BsYXlMaXN0O1xyXG4gICAgICAgIHByaXZhdGUgQ29tcG9uZW50UmVhZGVyIF9jb21wb25lbnRSZWFkZXI7XHJcblxyXG4gICAgICAgIHB1YmxpYyBHYW1lKHN0cmluZyBjYW52YXNJRCkgOiB0aGlzKGNhbnZhc0lELCBcIiNmZmZcIikgeyB9XHJcbiAgICAgICAgcHVibGljIEdhbWUoc3RyaW5nIGNhbnZhc0lELHN0cmluZyBjb2xvcikge1xyXG4gICAgICAgICAgICBfZGlzcGxheUxpc3QgPSBuZXcgRGlzcGxheUxpc3QoKTtcclxuICAgICAgICAgICAgc2NlbmUgPSBuZXcgU2NlbmUoX2Rpc3BsYXlMaXN0LGNhbnZhc0lELGNvbG9yKTtcclxuICAgICAgICAgICAgX2NvbXBvbmVudFJlYWRlciA9IG5ldyBDb21wb25lbnRSZWFkZXIoX2Rpc3BsYXlMaXN0KTtcclxuICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICBzY2hlZHVsZXIgPSBuZXcgU2NoZWR1bGVyKCk7XHJcbiAgICAgICAgICAgIHNjaGVkdWxlci5BZGQoKGdsb2JhbDo6U3lzdGVtLkFjdGlvbilzY2VuZS5SZWZyZXNoKTtcclxuICAgICAgICAgICAgc2NoZWR1bGVyLkFkZCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uKV9jb21wb25lbnRSZWFkZXIudXBkYXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZENoaWxkKEdhbWVPYmplY3Qgb2JqKSB7XHJcbiAgICAgICAgICAgIF9kaXNwbGF5TGlzdC5BZGQob2JqLG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HcmFwaGljcztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkNvbXBvbmVudHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5EaXNwbGF5O1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHNcclxue1xyXG4gICAgcHVibGljIGFic3RyYWN0IGNsYXNzIEdhbWVPYmplY3RcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgVmVjdG9yMiBwb3NpdGlvbiB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIFZlY3RvcjIgc2l6ZSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IGFuZ2xlIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgVW5pb248SFRNTENhbnZhc0VsZW1lbnQsIEltYWdlPiBpbWFnZSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIERpY3Rpb25hcnk8c3RyaW5nLCBDb21wb25lbnQ+IGNvbXBvbmVudHMgPSBuZXcgRGljdGlvbmFyeTxzdHJpbmcsIENvbXBvbmVudD4oKTtcclxuICAgICAgICBpbnRlcm5hbCBEaXNwbGF5TGlzdCBkaXNwbGF5TGlzdCA9IG5ldyBEaXNwbGF5TGlzdCgpO1xyXG4gICAgICAgIGludGVybmFsIEdhbWVPYmplY3QgX3BhcmVudDtcclxuXHJcbiAgICAgICAgLy9QdWJsaWMgTWV0aG9kc1xyXG4gICAgICAgIHB1YmxpYyBDb21wb25lbnQgQWRkQ29tcG9uZW50KHN0cmluZyBpbnN0YW5jZU5hbWUsIENvbXBvbmVudCBjb21wb25lbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb21wb25lbnRzW2luc3RhbmNlTmFtZV0gPSBjb21wb25lbnQ7XHJcbiAgICAgICAgICAgIHJldHVybiBjb21wb25lbnRzW2luc3RhbmNlTmFtZV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBBZGRDaGlsZChHYW1lT2JqZWN0IG9iaikge1xyXG4gICAgICAgICAgICBkaXNwbGF5TGlzdC5BZGQob2JqLHRoaXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5HcmFwaGljc1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgRHJhd2VyXHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgX2N0eDtcclxuICAgICAgICBwcml2YXRlIEhUTUxDYW52YXNFbGVtZW50IF9jYW52YXM7XHJcblxyXG4gICAgICAgIHB1YmxpYyBEcmF3ZXIoSFRNTENhbnZhc0VsZW1lbnQgY2FudmFzKSB7XHJcbiAgICAgICAgICAgIF9jdHggPSAoQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKWNhbnZhcy5HZXRDb250ZXh0KFwiMmRcIik7XHJcbiAgICAgICAgICAgIF9jYW52YXMgPSBjYW52YXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBGaWxsU2NyZWVuKHN0cmluZyBjb2xvcikge1xyXG4gICAgICAgICAgICBfY3R4LkZpbGxTdHlsZSA9IGNvbG9yO1xyXG4gICAgICAgICAgICBfY3R4LkZpbGxSZWN0KDAsMCxfY2FudmFzLldpZHRoLF9jYW52YXMuSGVpZ2h0KTtcclxuICAgICAgICB9XHJcbnB1YmxpYyB2b2lkIERyYXcoZmxvYXQgeCwgZmxvYXQgeSwgZmxvYXQgdywgZmxvYXQgaCwgZHluYW1pYyBpbWcpXHJcbntcclxuICAgIERyYXcoeCwgeSwgdywgaCwgMCwgaW1nLCBmYWxzZSwgMSk7XHJcbn0gICAgICAgIHB1YmxpYyB2b2lkIERyYXcoZmxvYXQgeCwgZmxvYXQgeSwgZmxvYXQgdywgZmxvYXQgaCwgZmxvYXQgciwgZHluYW1pYyBpbWcsIGJvb2wgZm9sbG93LCBmbG9hdCBhbHBoYSkge1xyXG4gICAgICAgICAgICBfY3R4LkltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBfY2FudmFzLlN0eWxlLkltYWdlUmVuZGVyaW5nID0gSW1hZ2VSZW5kZXJpbmcuUGl4ZWxhdGVkO1xyXG4gICAgICAgICAgICBfY3R4LlNhdmUoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChpbWcuZGF0YSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBpbWcgPSBpbWcuZGF0YTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9PYmplY3QgUm90YXRpb25cclxuICAgICAgICAgICAgZmxvYXQgb3ggPSB4ICsgKHcgLyAyKTtcclxuICAgICAgICAgICAgZmxvYXQgb3kgPSB5ICsgKGggLyAyKTtcclxuXHJcbiAgICAgICAgICAgIF9jdHguVHJhbnNsYXRlKG94LCBveSk7XHJcbiAgICAgICAgICAgIF9jdHguUm90YXRlKChyKSAqIE1hdGguUEkgLyAxODApOyAvL2RlZ3JlZVxyXG4gICAgICAgICAgICBfY3R4LlRyYW5zbGF0ZSgtb3gsIC1veSk7XHJcbiAgICAgICAgICAgIC8vLS0tLS0tLVxyXG5cclxuICAgICAgICAgICAgX2N0eC5EcmF3SW1hZ2UoaW1nLCB4LCB5LCB3LCBoKTtcclxuXHJcbiAgICAgICAgICAgIF9jdHguUmVzdG9yZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcblxyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5HcmFwaGljc1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgSW1hZ2VcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgSFRNTEltYWdlRWxlbWVudCBkYXRhIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIEltYWdlKHN0cmluZyBzcmMpIHtcclxuICAgICAgICAgICAgZGF0YSA9IG5ldyBIVE1MSW1hZ2VFbGVtZW50KCk7XHJcbiAgICAgICAgICAgIGRhdGEuU3JjID0gc3JjO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuTWF0aHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFZlY3RvcjJcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgWCB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IFkgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgVmVjdG9yMihmbG9hdCBfeCAsIGZsb2F0IF95KSB7XHJcbiAgICAgICAgICAgIFggPSBfeDtcclxuICAgICAgICAgICAgWSA9IF95O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5NYXRoc1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgVmVjdG9yNFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBYIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgWSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IFogeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBXIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIFZlY3RvcjQoZmxvYXQgX3gsIGZsb2F0IF95LCBmbG9hdCBfeiwgZmxvYXQgX3cpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBYID0gX3g7XHJcbiAgICAgICAgICAgIFkgPSBfeTtcclxuICAgICAgICAgICAgWiA9IF96O1xyXG4gICAgICAgICAgICBXID0gX3c7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5TeXN0ZW1cclxue1xyXG4gICAgcHVibGljIGNsYXNzIE1vdXNlXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IHggeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCB5IHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwcml2YXRlIEhUTUxDYW52YXNFbGVtZW50IF9jYW52YXM7XHJcblxyXG4gICAgICAgIGludGVybmFsIE1vdXNlKEhUTUxDYW52YXNFbGVtZW50IGNhbnZhcykge1xyXG4gICAgICAgICAgICBfY2FudmFzID0gY2FudmFzO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5BZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxnbG9iYWw6OkJyaWRnZS5IdG1sNS5FdmVudD4pVXBkYXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBVcGRhdGUoRXZlbnQgZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIENsaWVudFJlY3QgcmVjdCA9IF9jYW52YXMuR2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgICAgIHggPSBlLkFzPE1vdXNlRXZlbnQ+KCkuQ2xpZW50WCAtIChmbG9hdClyZWN0LkxlZnQ7XHJcbiAgICAgICAgICAgIHkgPSBlLkFzPE1vdXNlRXZlbnQ+KCkuQ2xpZW50WSAtIChmbG9hdClyZWN0LlRvcDtcclxuICAgICAgICB9XHJcblxuICAgIFxucHJpdmF0ZSBmbG9hdCBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9feD0wO3ByaXZhdGUgZmxvYXQgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX3k9MDt9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuU3lzdGVtXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBTY2hlZHVsZXJcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIExpc3Q8QWN0aW9uPiBfYWN0aW9uTGlzdCA9IG5ldyBMaXN0PEFjdGlvbj4oKTtcclxuXHJcbiAgICAgICAgaW50ZXJuYWwgU2NoZWR1bGVyKCkge1xyXG4gICAgICAgICAgICBVcGRhdGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZChBY3Rpb24gbWV0aG9kcykge1xyXG4gICAgICAgICAgICBfYWN0aW9uTGlzdC5BZGQoKGdsb2JhbDo6U3lzdGVtLkFjdGlvbikoKCkgPT4gbWV0aG9kcygpKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBVcGRhdGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yZWFjaCAoQWN0aW9uIGEgaW4gX2FjdGlvbkxpc3QpIHtcclxuICAgICAgICAgICAgICAgIGEoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgV2luZG93LlJlcXVlc3RBbmltYXRpb25GcmFtZSgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uKVVwZGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5Db21wb25lbnRzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBBbmltYXRvciA6IENvbXBvbmVudFxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgRGljdGlvbmFyeTxzdHJpbmcsIExpc3Q8SW1hZ2U+PiBfYW5pbWF0aW9ucyB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIHN0cmluZyBjdXJyZW50QW5pbWF0aW9uIHsgZ2V0OyBzZXQ7IH0gIFxyXG4gICAgICAgIHB1YmxpYyBpbnQgY3VycmVudEZyYW1lIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgaW50IGZwcyB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgYm9vbCBfcGxheWluZyA9IGZhbHNlO1xyXG4gICAgICAgIHByaXZhdGUgZG91YmxlIGxhc3RUaW1lRnJhbWUgPSAwO1xyXG5cclxuICAgICAgICBwdWJsaWMgQW5pbWF0b3IoR2FtZU9iamVjdCBwYXJlbnQpIDogYmFzZShwYXJlbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBfYW5pbWF0aW9ucyA9IG5ldyBEaWN0aW9uYXJ5PHN0cmluZywgTGlzdDxJbWFnZT4+KCk7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgdm9pZCBHb3RvQW5kUGxheShzdHJpbmcgYW5pbWF0aW9uTmFtZSlcclxue1xyXG4gICAgR290b0FuZFBsYXkoYW5pbWF0aW9uTmFtZSwgMCk7XHJcbn0gICAgICAgIHB1YmxpYyB2b2lkIEdvdG9BbmRQbGF5KHN0cmluZyBhbmltYXRpb25OYW1lLCBpbnQgZnJhbWUpIHtcclxuICAgICAgICAgICAgY3VycmVudEFuaW1hdGlvbiA9IGFuaW1hdGlvbk5hbWU7XHJcbiAgICAgICAgICAgIGN1cnJlbnRGcmFtZSA9IGZyYW1lO1xyXG4gICAgICAgICAgICBfcGxheWluZyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgdm9pZCBHb3RvQW5kU3RvcChzdHJpbmcgYW5pbWF0aW9uTmFtZSlcclxue1xyXG4gICAgR290b0FuZFN0b3AoYW5pbWF0aW9uTmFtZSwgMCk7XHJcbn0gICAgICAgIHB1YmxpYyB2b2lkIEdvdG9BbmRTdG9wKHN0cmluZyBhbmltYXRpb25OYW1lLCBpbnQgZnJhbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjdXJyZW50QW5pbWF0aW9uID0gYW5pbWF0aW9uTmFtZTtcclxuICAgICAgICAgICAgY3VycmVudEZyYW1lID0gZnJhbWU7XHJcbiAgICAgICAgICAgIF9wbGF5aW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBTdG9wKCkge1xyXG4gICAgICAgICAgICBfcGxheWluZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgU3RhcnQoKSB7XHJcbiAgICAgICAgICAgIF9wbGF5aW5nID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIENyZWF0ZShzdHJpbmcgYW5pbWF0aW9uTmFtZSwgTGlzdDxJbWFnZT4gbGlzdCl7XHJcbiAgICAgICAgICAgIF9hbmltYXRpb25zW2FuaW1hdGlvbk5hbWVdID0gbGlzdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGludGVybmFsIG92ZXJyaWRlIHZvaWQgVXBkYXRlKCkge1xyXG4gICAgICAgICAgICBpZiAoIV9wbGF5aW5nKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBkb3VibGUgbm93ID0gRGF0ZVRpbWUuTm93LlN1YnRyYWN0KERhdGVUaW1lLk1pblZhbHVlLkFkZFllYXJzKDIwMTcpKS5Ub3RhbE1pbGxpc2Vjb25kcztcclxuICAgICAgICAgICAgZG91YmxlIGRlbHRhID0gbm93IC0gbGFzdFRpbWVGcmFtZTtcclxuICAgICAgICAgICAgaWYgKGRlbHRhID4gMTAwMC9mcHMpIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRGcmFtZSsrO1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRGcmFtZSA+PSBfYW5pbWF0aW9uc1tjdXJyZW50QW5pbWF0aW9uXS5Db3VudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRGcmFtZSA9IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBwYXJlbnQuaW1hZ2UgPSBfYW5pbWF0aW9uc1tjdXJyZW50QW5pbWF0aW9uXVtjdXJyZW50RnJhbWVdO1xyXG5cclxuICAgICAgICAgICAgICAgIGxhc3RUaW1lRnJhbWUgPSBub3c7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cblxyXG4gICAgXG5wcml2YXRlIHN0cmluZyBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fY3VycmVudEFuaW1hdGlvbj1cIlwiIDtwcml2YXRlIGludCBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fY3VycmVudEZyYW1lPTA7cHJpdmF0ZSBpbnQgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX2Zwcz0xO31cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5NYXRocztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuQ29tcG9uZW50c1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgQ29sbGlzaW9uIDogQ29tcG9uZW50XHJcbiAgICB7XHJcblxyXG4gICAgICAgIHJlYWRvbmx5IExpc3Q8VmVjdG9yND4gX2JveGVzO1xyXG5cclxuICAgICAgICBwdWJsaWMgQ29sbGlzaW9uKEdhbWVPYmplY3QgX3BhcmVudCkgOiBiYXNlKF9wYXJlbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBfYm94ZXMgPSBuZXcgTGlzdDxWZWN0b3I0PigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkQm94KGZsb2F0IHgxLGZsb2F0IHkxLCBmbG9hdCB3aWR0aCwgZmxvYXQgaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIF9ib3hlcy5BZGQobmV3IFZlY3RvcjQoeDEseTEsd2lkdGgsaGVpZ2h0KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGZsb2F0IFBhcmVudFBvc0NhbGN1bGF0aW9uWChmbG9hdCB4LCBHYW1lT2JqZWN0IHBhcmVudCkge1xyXG4gICAgICAgICAgICBmbG9hdCBhZGRpbmcgPSAwO1xyXG4gICAgICAgICAgICBmbG9hdCBhbmdsZUFkZGluZyA9IDA7XHJcblxyXG4gICAgICAgICAgICBpZiAocGFyZW50Ll9wYXJlbnQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgYWRkaW5nID0gUGFyZW50UG9zQ2FsY3VsYXRpb25YKHBhcmVudC5wb3NpdGlvbi5YLCBwYXJlbnQuX3BhcmVudCk7XHJcbiAgICAgICAgICAgICAgICBhbmdsZUFkZGluZyA9IChmbG9hdCkoTWF0aC5Db3MocGFyZW50Ll9wYXJlbnQuYW5nbGUgKiBNYXRoLlBJIC8gMTgwKSkgKiB4O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAocGFyZW50Ll9wYXJlbnQgPT0gbnVsbCkgYWRkaW5nICs9IHBhcmVudC5wb3NpdGlvbi5YO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuICBhZGRpbmcgKyBhbmdsZUFkZGluZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgZmxvYXQgUGFyZW50UG9zQ2FsY3VsYXRpb25ZKGZsb2F0IHksIEdhbWVPYmplY3QgcGFyZW50KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZmxvYXQgYWRkaW5nID0gMDtcclxuICAgICAgICAgICAgZmxvYXQgYW5nbGVBZGRpbmcgPSAwO1xyXG5cclxuICAgICAgICAgICAgaWYgKHBhcmVudC5fcGFyZW50ICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGFkZGluZyA9IFBhcmVudFBvc0NhbGN1bGF0aW9uWShwYXJlbnQucG9zaXRpb24uWSwgcGFyZW50Ll9wYXJlbnQpO1xyXG4gICAgICAgICAgICAgICAgYW5nbGVBZGRpbmcgPSAoZmxvYXQpKE1hdGguU2luKHBhcmVudC5fcGFyZW50LmFuZ2xlICogTWF0aC5QSSAvIDE4MCkpICogeTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHBhcmVudC5fcGFyZW50ID09IG51bGwpIGFkZGluZyArPSBwYXJlbnQucG9zaXRpb24uWTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBhZGRpbmcgKyBhbmdsZUFkZGluZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBib29sIEhpdFRlc3RPYmplY3QoR2FtZU9iamVjdCBvYmopIHtcclxuXHJcbiAgICAgICAgICAgIGZsb2F0IHB4ID0gcGFyZW50LnBvc2l0aW9uLlg7XHJcbiAgICAgICAgICAgIGZsb2F0IHB5ID0gcGFyZW50LnBvc2l0aW9uLlk7XHJcbiAgICAgICAgICAgIGZsb2F0IHAyeCA9IG9iai5wb3NpdGlvbi5YO1xyXG4gICAgICAgICAgICBmbG9hdCBwMnkgPSBvYmoucG9zaXRpb24uWTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnQuX3BhcmVudCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBweCA9IFBhcmVudFBvc0NhbGN1bGF0aW9uWChwYXJlbnQucG9zaXRpb24uWCwgIHBhcmVudCk7IFxyXG4gICAgICAgICAgICAgICAgcHkgPSBQYXJlbnRQb3NDYWxjdWxhdGlvblkocGFyZW50LnBvc2l0aW9uLlksICBwYXJlbnQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAob2JqLl9wYXJlbnQgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcDJ4ID0gUGFyZW50UG9zQ2FsY3VsYXRpb25YKG9iai5wb3NpdGlvbi5YLCBvYmopO1xyXG4gICAgICAgICAgICAgICAgcDJ5ID0gUGFyZW50UG9zQ2FsY3VsYXRpb25ZKG9iai5wb3NpdGlvbi5ZLCBvYmopO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBDb25zb2xlLldyaXRlKHB4ICsgXCIgXCIgKyBweSArIFwiL1wiICsgXCIgXCIgKyBwMnggKyBcIiBcIiArIHAyeSk7XHJcblxyXG4gICAgICAgICAgICBmb3JlYWNoIChDb21wb25lbnQgY3AgaW4gb2JqLmNvbXBvbmVudHMuVmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3AuR2V0VHlwZSgpID09IHR5cGVvZihDb2xsaXNpb24pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQ29sbGlzaW9uIGMgPSAoQ29sbGlzaW9uKWNwO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcmVhY2ggKFZlY3RvcjQgYiBpbiBfYm94ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yZWFjaCAoVmVjdG9yNCBiMiBpbiBjLl9ib3hlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGIuWCArIHB4IDwgYjIuWCArIHAyeCArIGIyLlogJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIuWCArIGIuWiArIHB4ID4gYjIuWCArIHAyeCAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYi5ZICsgcHkgPCBiMi5ZICsgYjIuVyArIHAyeSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYi5XICsgYi5ZICsgcHkgID4gYjIuWSArIHAyeSApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb25zb2xlLldyaXRlKFwiYVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgYm9vbCBIaXRUZXN0UG9pbnQoZmxvYXQgeCxmbG9hdCB5KSB7XHJcblxyXG4gICAgICAgICAgICBmbG9hdCBweCA9IHBhcmVudC5wb3NpdGlvbi5YO1xyXG4gICAgICAgICAgICBmbG9hdCBweSA9IHBhcmVudC5wb3NpdGlvbi5ZO1xyXG5cclxuICAgICAgICAgICAgaWYgKHBhcmVudC5fcGFyZW50ICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHB4ID0gUGFyZW50UG9zQ2FsY3VsYXRpb25YKHBhcmVudC5wb3NpdGlvbi5YLCBwYXJlbnQpO1xyXG4gICAgICAgICAgICAgICAgcHkgPSBQYXJlbnRQb3NDYWxjdWxhdGlvblgocGFyZW50LnBvc2l0aW9uLlksIHBhcmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvcmVhY2ggKFZlY3RvcjQgYiBpbiBfYm94ZXMpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmICh4IDwgYi5YICsgcHggKyBiLlogJiZcclxuICAgICAgICAgICAgICAgICAgIHggPiBiLlggKyBweCAmJlxyXG4gICAgICAgICAgICAgICAgICAgeSA8IGIuWSArIHB5ICsgYi5XICYmXHJcbiAgICAgICAgICAgICAgICAgICB5ID4gYi5ZICsgcHkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLk1hdGhzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR3JhcGhpY3M7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5Db21wb25lbnRzO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFNwcml0ZSA6IEdhbWVPYmplY3RcclxuICAgIHtcclxuICAgICAgICAvL0NvbnN0cnVjdG9yXHJcbiAgICAgICAgcHVibGljIFNwcml0ZShWZWN0b3IyIF9wb3NpdGlvbiwgVmVjdG9yMiBfc2l6ZSwgVW5pb248SFRNTENhbnZhc0VsZW1lbnQsIEltYWdlPiBfaW1hZ2UpIHtcclxuICAgICAgICAgICAgcG9zaXRpb24gPSBfcG9zaXRpb247XHJcbiAgICAgICAgICAgIHNpemUgPSBfc2l6ZTtcclxuICAgICAgICAgICAgaW1hZ2UgPSBfaW1hZ2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdCn0K
