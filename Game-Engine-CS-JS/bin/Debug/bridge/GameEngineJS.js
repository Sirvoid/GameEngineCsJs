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

                var sx = 0;
                var sy = 0;
                var sw = w;
                var sh = h;

                if (img.spriteSizeX != null && img.spriteSizeY != null) {
                    var img2 = Bridge.cast(img, GameEngineJS.Graphics.SpriteSheet);
                    sx = img2.currentIndex % ((w - 1) / img2.spriteSizeX) * img2.spriteSizeX;
                    sy = Math.floor(img2.currentIndex / ((w - 1) / img2.spriteSizeY)) * img2.spriteSizeY;
                    System.Console.Write(System.Single.format(sx) + " " + System.Single.format(sy));
                    sw = img2.spriteSizeX;
                    sh = img2.spriteSizeY;
                }

                if (img.data != null) {
                    img = img.data;
                }

                var ox = x + (w / 2);
                var oy = y + (h / 2);

                this._ctx.translate(ox, oy);
                this._ctx.rotate((r) * Math.PI / 180);
                this._ctx.translate(-ox, -oy);

                this._ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);

                this._ctx.restore();
            }
        }
    });

    Bridge.define("GameEngineJS.Graphics.Image", {
        fields: {
            data: null
        },
        ctors: {
            $ctor1: function (src) {
                this.$initialize();
                this.data = new Image();
                this.data.src = src;

            },
            ctor: function (img) {
                this.$initialize();
                this.data = img;
            }
        }
    });

    Bridge.define("GameEngineJS.Graphics.SpriteSheet", {
        fields: {
            data: null,
            spriteSizeX: 0,
            spriteSizeY: 0,
            currentIndex: 0
        },
        ctors: {
            ctor: function (src, _spriteSizeX, _spriteSizeY) {
                this.$initialize();
                this.data = new Image();
                this.data.src = src;
                this.spriteSizeX = _spriteSizeX;
                this.spriteSizeY = _spriteSizeY;
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
                this._animations = new (System.Collections.Generic.Dictionary$2(System.String,System.Collections.Generic.List$1(System.Object)))();
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
            Create$2: function (animationName, list) {
                var t = new (System.Collections.Generic.List$1(System.Object)).ctor();
                t = list;
                this.Create(animationName, t);
            },
            Create$1: function (animationName, list) {
                var t = new (System.Collections.Generic.List$1(System.Object)).ctor();
                t = list;
                this.Create(animationName, t);
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

                    if (!(this._animations.get(this.currentAnimation).getItem(this.currentFrame) >= 0)) {
                        this.parent.image = this._animations.get(this.currentAnimation).getItem(this.currentFrame);
                    } else {
                        var sheet = this.parent.image;
                        sheet.currentIndex = this._animations.get(this.currentAnimation).getItem(this.currentFrame);
                    }

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

    Bridge.define("GameEngineJS.Components.Movement", {
        inherits: [GameEngineJS.Components.Component],
        ctors: {
            ctor: function (_parent) {
                this.$initialize();
                GameEngineJS.Components.Component.ctor.call(this, _parent);
            }
        },
        methods: {
            MoveToward: function (x, y, speed) {
                var $t, $t1;
                var dx = x - this.parent.position.X;
                var dy = y - this.parent.position.Y;
                var angle = Math.atan2(dy, dx);

                $t = this.parent.position;
                $t.X += speed * Math.cos(angle);
                $t1 = this.parent.position;
                $t1.Y += speed * Math.sin(angle);
            },
            LookAt: function (x, y) {
                var x2 = this.parent.position.X - x;
                var y2 = y - this.parent.position.Y;
                var angle = Math.atan2(x2, y2);
                this.parent.angle = angle * 57.29578;
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJHYW1lRW5naW5lSlMuanMiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbIkNvbXBvbmVudHMvQ29tcG9uZW50LmNzIiwiQ29tcG9uZW50cy9Db21wb25lbnRSZWFkZXIuY3MiLCJEaXNwbGF5L0NhbWVyYS5jcyIsIkRpc3BsYXkvRGlzcGxheUxpc3QuY3MiLCJEaXNwbGF5L1NjZW5lLmNzIiwiRXZlbnRzL0tleUJvYXJkRXZlbnQuY3MiLCJHYW1lLmNzIiwiR2FtZU9iamVjdHMvR2FtZU9iamVjdC5jcyIsIkdyYXBoaWNzL0RyYXdlci5jcyIsIkdyYXBoaWNzL0ltYWdlLmNzIiwiR3JhcGhpY3MvU3ByaXRlU2hlZXQuY3MiLCJNYXRocy9WZWN0b3IyLmNzIiwiTWF0aHMvVmVjdG9yNC5jcyIsIlN5c3RlbS9Nb3VzZS5jcyIsIlN5c3RlbS9TY2hlZHVsZXIuY3MiLCJDb21wb25lbnRzL0FuaW1hdG9yLmNzIiwiQ29tcG9uZW50cy9Db2xsaXNpb24uY3MiLCJDb21wb25lbnRzL01vdmVtZW50LmNzIiwiR2FtZU9iamVjdHMvU3ByaXRlLmNzIl0sCiAgIm5hbWVzIjogWyIiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7OzRCQVEyQkE7O2dCQUNmQSxjQUFTQTs7Ozs7Ozs7Ozs7Ozs0QkNFWUE7O2dCQUNyQkEsbUJBQWNBOzs7Ozs7Z0JBSWRBLDBCQUEyQkE7Ozs7d0JBQ3ZCQSwyQkFBc0RBOzs7O2dDQUVsREE7Ozs7Ozs7d0JBRUpBLHFCQUFnQkE7Ozs7Ozs7O3VDQUlLQTs7Z0JBQ3pCQSxJQUFJQTtvQkFBNkJBOztnQkFDakNBLDBCQUE0QkE7Ozs7d0JBRXhCQSwyQkFBc0RBOzs7O2dDQUVsREE7Ozs7Ozs7d0JBRUpBLHFCQUFnQkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0JDbkJwQkEsZ0JBQVdBLElBQUlBO2dCQUNmQTs7OEJBR1VBLFdBQWtCQTs7Z0JBQzVCQSxnQkFBV0E7Z0JBQ1hBLGdCQUFXQTs7Ozs7Ozs7Ozs7NEJDRmdD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LEtBQUtBLE9BQ2hCQSxJQUFJQSxNQUFNQSxNQUNWQSxJQUFJQSxNQUFNQSxLQUFLQSxPQUNmQSxJQUFJQSxNQUFNQTs0QkFDVEE7Ozs7Ozs7O2dCQUdSQTs7Ozs7Ozs7NEJDcEdZQTs7a0VBQTJCQTs7OztrQ0FJcEJBLEdBQVNBLEdBQVNBOztnQkFDckNBLFNBQVdBLElBQUlBO2dCQUNmQSxTQUFXQSxJQUFJQTtnQkFDZkEsWUFBY0EsQUFBT0EsV0FBV0EsSUFBSUE7O2dCQUVwQ0E7d0JBQXFCQSxRQUFRQSxBQUFPQSxTQUFTQTtnQkFDN0NBO3lCQUFxQkEsUUFBUUEsQUFBT0EsU0FBU0E7OzhCQUc5QkEsR0FBUUE7Z0JBQ3ZCQSxTQUFXQSx5QkFBb0JBO2dCQUMvQkEsU0FBV0EsSUFBSUE7Z0JBQ2ZBLFlBQWNBLEFBQU9BLFdBQVdBLElBQUlBO2dCQUNwQ0Esb0JBQWVBLFFBQVFBOzs7Ozs7Ozs0QkNYYkEsV0FBbUJBLE9BQWVBOzs7Z0JBQzVDQSxnQkFBV0E7Z0JBQ1hBLFlBQU9BO2dCQUNQQSxhQUFRQSIsCiAgInNvdXJjZXNDb250ZW50IjogWyJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuQ29tcG9uZW50c1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgQ29tcG9uZW50XHJcbiAgICB7XHJcbiAgICAgICAgaW50ZXJuYWwgR2FtZU9iamVjdCBwYXJlbnQgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIGludGVybmFsIENvbXBvbmVudChHYW1lT2JqZWN0IF9wYXJlbnQpIHtcclxuICAgICAgICAgICAgcGFyZW50ID0gX3BhcmVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGludGVybmFsIHZpcnR1YWwgdm9pZCBVcGRhdGUoKSB7fVxyXG5cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBHYW1lRW5naW5lSlMuRGlzcGxheTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5Db21wb25lbnRzXHJcbntcclxuICAgIGludGVybmFsIGNsYXNzIENvbXBvbmVudFJlYWRlclxyXG4gICAge1xyXG4gICAgICAgIGludGVybmFsIERpc3BsYXlMaXN0IGRpc3BsYXlMaXN0IHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgaW50ZXJuYWwgQ29tcG9uZW50UmVhZGVyKERpc3BsYXlMaXN0IGxpc3QpIHtcclxuICAgICAgICAgICAgZGlzcGxheUxpc3QgPSBsaXN0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW50ZXJuYWwgdm9pZCB1cGRhdGUoKSB7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKEdhbWVPYmplY3Qgb2JqIGluIGRpc3BsYXlMaXN0Lmxpc3QpIHtcclxuICAgICAgICAgICAgICAgIGZvcmVhY2ggKEtleVZhbHVlUGFpcjxzdHJpbmcsIENvbXBvbmVudD4gY29tcG9uZW50IGluIG9iai5jb21wb25lbnRzKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5WYWx1ZS5VcGRhdGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlY3Vyc2l2ZVVwZGF0ZShvYmopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgcmVjdXJzaXZlVXBkYXRlKEdhbWVPYmplY3Qgb2JqKSB7XHJcbiAgICAgICAgICAgIGlmIChkaXNwbGF5TGlzdC5saXN0LkNvdW50IDw9IDApIHJldHVybjtcclxuICAgICAgICAgICAgZm9yZWFjaCAoR2FtZU9iamVjdCBvYmoyIGluIG9iai5kaXNwbGF5TGlzdC5saXN0KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmb3JlYWNoIChLZXlWYWx1ZVBhaXI8c3RyaW5nLCBDb21wb25lbnQ+IGNvbXBvbmVudCBpbiBvYmoyLmNvbXBvbmVudHMpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LlZhbHVlLlVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVjdXJzaXZlVXBkYXRlKG9iajIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkRpc3BsYXlcclxue1xyXG4gICAgcHVibGljIGNsYXNzIENhbWVyYVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIHBvc2l0aW9uIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgcm90YXRpb24geyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgQ2FtZXJhKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uID0gbmV3IFZlY3RvcjIoMCwwKTtcclxuICAgICAgICAgICAgcm90YXRpb24gPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIENhbWVyYShWZWN0b3IyIF9wb3NpdGlvbixmbG9hdCBfcm90YXRpb24pIHtcclxuICAgICAgICAgICAgcG9zaXRpb24gPSBfcG9zaXRpb247XHJcbiAgICAgICAgICAgIHJvdGF0aW9uID0gX3JvdGF0aW9uO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5EaXNwbGF5XHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBEaXNwbGF5TGlzdFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBMaXN0PEdhbWVPYmplY3Q+IGxpc3QgeyBnZXQ7IHNldDsgfSAgXHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZChHYW1lT2JqZWN0IG9iaixHYW1lT2JqZWN0IHBhcmVudCkge1xyXG4gICAgICAgICAgICBsaXN0LkFkZChvYmopO1xyXG4gICAgICAgICAgICBvYmouX3BhcmVudCA9IHBhcmVudDtcclxuICAgICAgICB9XHJcblxuICAgIFxucHJpdmF0ZSBMaXN0PEdhbWVPYmplY3Q+IF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19saXN0PW5ldyBMaXN0PEdhbWVPYmplY3Q+KCkgO31cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5TeXN0ZW07XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkRpc3BsYXlcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFNjZW5lXHJcbiAgICB7XHJcblxyXG4gICAgICAgIHB1YmxpYyBDYW1lcmEgY2FtZXJhIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBEaXNwbGF5TGlzdCBfbWFpbkRpc3BsYXlMaXN0O1xyXG4gICAgICAgIHByaXZhdGUgRHJhd2VyIF9kcmF3ZXI7XHJcbiAgICAgICAgcHJpdmF0ZSBIVE1MQ2FudmFzRWxlbWVudCBfY2FudmFzO1xyXG4gICAgICAgIHByaXZhdGUgc3RyaW5nIF9jb2xvcjtcclxuICAgICAgICBwdWJsaWMgTW91c2UgbW91c2UgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgU2NlbmUoRGlzcGxheUxpc3Qgb2JqTGlzdCxzdHJpbmcgY2FudmFzSUQsc3RyaW5nIGNvbG9yKSB7XHJcbiAgICAgICAgICAgIGNhbWVyYSA9IG5ldyBDYW1lcmEoKTtcclxuICAgICAgICAgICAgX21haW5EaXNwbGF5TGlzdCA9IG9iakxpc3Q7XHJcbiAgICAgICAgICAgIF9jYW52YXMgPSBEb2N1bWVudC5RdWVyeVNlbGVjdG9yPEhUTUxDYW52YXNFbGVtZW50PihcImNhbnZhcyNcIiArIGNhbnZhc0lEKTtcclxuICAgICAgICAgICAgX2RyYXdlciA9IG5ldyBEcmF3ZXIoX2NhbnZhcyk7XHJcbiAgICAgICAgICAgIF9jb2xvciA9IGNvbG9yO1xyXG4gICAgICAgICAgICBtb3VzZSA9IG5ldyBNb3VzZShfY2FudmFzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFJlZnJlc2goKSB7XHJcbiAgICAgICAgICAgIF9kcmF3ZXIuRmlsbFNjcmVlbihfY29sb3IpO1xyXG4gICAgICAgICAgICBmb3JlYWNoIChHYW1lT2JqZWN0IG9iaiBpbiBfbWFpbkRpc3BsYXlMaXN0Lmxpc3QpIHtcclxuICAgICAgICAgICAgICAgIF9kcmF3ZXIuRHJhdyhvYmoucG9zaXRpb24uWCAtIGNhbWVyYS5wb3NpdGlvbi5YLCBvYmoucG9zaXRpb24uWSAtIGNhbWVyYS5wb3NpdGlvbi5ZLCBvYmouc2l6ZS5YLCBvYmouc2l6ZS5ZLCBvYmouYW5nbGUsIG9iai5pbWFnZSxmYWxzZSwxKTtcclxuICAgICAgICAgICAgICAgIERyYXdDaGlsZChvYmosb2JqLnBvc2l0aW9uLlgsb2JqLnBvc2l0aW9uLlksb2JqLmFuZ2xlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIERyYXdDaGlsZChHYW1lT2JqZWN0IG9iaixmbG9hdCB4LGZsb2F0IHksZmxvYXQgYW5nbGUpIHtcclxuICAgICAgICAgICAgZm9yZWFjaCAoR2FtZU9iamVjdCBvYmoyIGluIG9iai5kaXNwbGF5TGlzdC5saXN0KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmbG9hdCBuZXdYID0geCArIChmbG9hdCkoTWF0aC5Db3Mob2JqLmFuZ2xlKk1hdGguUEkvMTgwKSkgKiBvYmoyLnBvc2l0aW9uLlggLSBjYW1lcmEucG9zaXRpb24uWDtcclxuICAgICAgICAgICAgICAgIGZsb2F0IG5ld1kgPSB5ICsgKGZsb2F0KShNYXRoLlNpbihvYmouYW5nbGUqTWF0aC5QSS8xODApKSAqIG9iajIucG9zaXRpb24uWSAtIGNhbWVyYS5wb3NpdGlvbi5ZO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQgbmV3QW5nbGUgPSBvYmoyLmFuZ2xlICsgYW5nbGU7XHJcblxyXG4gICAgICAgICAgICAgICAgX2RyYXdlci5EcmF3KG5ld1gsIG5ld1ksIG9iajIuc2l6ZS5YLCBvYmoyLnNpemUuWSwgbmV3QW5nbGUsIG9iajIuaW1hZ2UsIGZhbHNlLCAxKTtcclxuICAgICAgICAgICAgICAgIERyYXdDaGlsZChvYmoyLG5ld1gsbmV3WSxuZXdBbmdsZSk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5FdmVudHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEtleUJvYXJkRXZlbnRcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgZGVsZWdhdGUgdm9pZCBLZXlQcmVzc0V2ZW50KGludCBrZXljb2RlKTtcclxuICAgICAgICBwdWJsaWMgZXZlbnQgS2V5UHJlc3NFdmVudCBPbktleVByZXNzRXZlbnRzO1xyXG5cclxuICAgICAgICBwdWJsaWMgZGVsZWdhdGUgdm9pZCBLZXlEb3duRXZlbnQoaW50IGtleWNvZGUpO1xyXG4gICAgICAgIHB1YmxpYyBldmVudCBLZXlEb3duRXZlbnQgT25LZXlEb3duRXZlbnRzO1xyXG5cclxuICAgICAgICBwdWJsaWMgZGVsZWdhdGUgdm9pZCBLZXlVcEV2ZW50KGludCBrZXljb2RlKTtcclxuICAgICAgICBwdWJsaWMgZXZlbnQgS2V5VXBFdmVudCBPbktleVVwRXZlbnRzO1xyXG5cclxuICAgICAgICBwdWJsaWMgS2V5Qm9hcmRFdmVudCgpIHtcclxuICAgICAgICAgICAgRG9jdW1lbnQuQWRkRXZlbnRMaXN0ZW5lcihFdmVudFR5cGUuS2V5UHJlc3MsIChnbG9iYWw6OlN5c3RlbS5BY3Rpb248Z2xvYmFsOjpCcmlkZ2UuSHRtbDUuRXZlbnQ+KURvS2V5UHJlc3MpO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5BZGRFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5LZXlEb3duLCAoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6QnJpZGdlLkh0bWw1LkV2ZW50PilEb0tleURvd24pO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5BZGRFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5LZXlVcCwgKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxnbG9iYWw6OkJyaWRnZS5IdG1sNS5FdmVudD4pRG9LZXlVcCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgRG9LZXlQcmVzcyhFdmVudCBlKSB7XHJcbiAgICAgICAgICAgIGlmIChPbktleVByZXNzRXZlbnRzID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgT25LZXlQcmVzc0V2ZW50cy5JbnZva2UoZS5BczxLZXlib2FyZEV2ZW50PigpLktleUNvZGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIERvS2V5RG93bihFdmVudCBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKE9uS2V5RG93bkV2ZW50cyA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIE9uS2V5RG93bkV2ZW50cy5JbnZva2UoZS5BczxLZXlib2FyZEV2ZW50PigpLktleUNvZGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIERvS2V5VXAoRXZlbnQgZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChPbktleVVwRXZlbnRzID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgT25LZXlVcEV2ZW50cy5JbnZva2UoZS5BczxLZXlib2FyZEV2ZW50PigpLktleUNvZGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuU3lzdGVtO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5EaXNwbGF5O1xyXG51c2luZyBHYW1lRW5naW5lSlMuQ29tcG9uZW50cztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEdhbWVcclxuICAgIHtcclxuICAgICAgICBcclxuICAgICAgICBwdWJsaWMgRHJhd2VyIGRyYXdlciB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIFNjaGVkdWxlciBzY2hlZHVsZXIgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBTY2VuZSBzY2VuZSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIE1vdXNlIG1vdXNlIHsgZ2V0IHsgcmV0dXJuIHNjZW5lLm1vdXNlOyB9IH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBEaXNwbGF5TGlzdCBfZGlzcGxheUxpc3Q7XHJcbiAgICAgICAgcHJpdmF0ZSBDb21wb25lbnRSZWFkZXIgX2NvbXBvbmVudFJlYWRlcjtcclxuXHJcbiAgICAgICAgcHVibGljIEdhbWUoc3RyaW5nIGNhbnZhc0lEKSA6IHRoaXMoY2FudmFzSUQsIFwiI2ZmZlwiKSB7IH1cclxuICAgICAgICBwdWJsaWMgR2FtZShzdHJpbmcgY2FudmFzSUQsc3RyaW5nIGNvbG9yKSB7XHJcbiAgICAgICAgICAgIF9kaXNwbGF5TGlzdCA9IG5ldyBEaXNwbGF5TGlzdCgpO1xyXG4gICAgICAgICAgICBzY2VuZSA9IG5ldyBTY2VuZShfZGlzcGxheUxpc3QsY2FudmFzSUQsY29sb3IpO1xyXG4gICAgICAgICAgICBfY29tcG9uZW50UmVhZGVyID0gbmV3IENvbXBvbmVudFJlYWRlcihfZGlzcGxheUxpc3QpO1xyXG4gICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIHNjaGVkdWxlciA9IG5ldyBTY2hlZHVsZXIoKTtcclxuICAgICAgICAgICAgc2NoZWR1bGVyLkFkZCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uKXNjZW5lLlJlZnJlc2gpO1xyXG4gICAgICAgICAgICBzY2hlZHVsZXIuQWRkKChnbG9iYWw6OlN5c3RlbS5BY3Rpb24pX2NvbXBvbmVudFJlYWRlci51cGRhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkQ2hpbGQoR2FtZU9iamVjdCBvYmopIHtcclxuICAgICAgICAgICAgX2Rpc3BsYXlMaXN0LkFkZChvYmosbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5NYXRocztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuQ29tcG9uZW50cztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkRpc3BsYXk7XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0c1xyXG57XHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgY2xhc3MgR2FtZU9iamVjdFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIHBvc2l0aW9uIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgVmVjdG9yMiBzaXplIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgYW5nbGUgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBVbmlvbjxIVE1MQ2FudmFzRWxlbWVudCwgSW1hZ2UsIFNwcml0ZVNoZWV0PiBpbWFnZSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIERpY3Rpb25hcnk8c3RyaW5nLCBDb21wb25lbnQ+IGNvbXBvbmVudHMgPSBuZXcgRGljdGlvbmFyeTxzdHJpbmcsIENvbXBvbmVudD4oKTtcclxuICAgICAgICBpbnRlcm5hbCBEaXNwbGF5TGlzdCBkaXNwbGF5TGlzdCA9IG5ldyBEaXNwbGF5TGlzdCgpO1xyXG4gICAgICAgIGludGVybmFsIEdhbWVPYmplY3QgX3BhcmVudDtcclxuXHJcbiAgICAgICAgLy9QdWJsaWMgTWV0aG9kc1xyXG4gICAgICAgIHB1YmxpYyBDb21wb25lbnQgQWRkQ29tcG9uZW50KHN0cmluZyBpbnN0YW5jZU5hbWUsIENvbXBvbmVudCBjb21wb25lbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb21wb25lbnRzW2luc3RhbmNlTmFtZV0gPSBjb21wb25lbnQ7XHJcbiAgICAgICAgICAgIHJldHVybiBjb21wb25lbnRzW2luc3RhbmNlTmFtZV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBBZGRDaGlsZChHYW1lT2JqZWN0IG9iaikge1xyXG4gICAgICAgICAgICBkaXNwbGF5TGlzdC5BZGQob2JqLHRoaXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5HcmFwaGljc1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgRHJhd2VyXHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgX2N0eDtcclxuICAgICAgICBwcml2YXRlIEhUTUxDYW52YXNFbGVtZW50IF9jYW52YXM7XHJcblxyXG4gICAgICAgIHB1YmxpYyBEcmF3ZXIoSFRNTENhbnZhc0VsZW1lbnQgY2FudmFzKSB7XHJcbiAgICAgICAgICAgIF9jdHggPSAoQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKWNhbnZhcy5HZXRDb250ZXh0KFwiMmRcIik7XHJcbiAgICAgICAgICAgIF9jYW52YXMgPSBjYW52YXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBGaWxsU2NyZWVuKHN0cmluZyBjb2xvcikge1xyXG4gICAgICAgICAgICBfY3R4LkZpbGxTdHlsZSA9IGNvbG9yO1xyXG4gICAgICAgICAgICBfY3R4LkZpbGxSZWN0KDAsMCxfY2FudmFzLldpZHRoLF9jYW52YXMuSGVpZ2h0KTtcclxuICAgICAgICB9XHJcbnB1YmxpYyB2b2lkIERyYXcoZmxvYXQgeCwgZmxvYXQgeSwgZmxvYXQgdywgZmxvYXQgaCwgZHluYW1pYyBpbWcpXHJcbntcclxuICAgIERyYXcoeCwgeSwgdywgaCwgMCwgaW1nLCBmYWxzZSwgMSk7XHJcbn0gICAgICAgIHB1YmxpYyB2b2lkIERyYXcoZmxvYXQgeCwgZmxvYXQgeSwgZmxvYXQgdywgZmxvYXQgaCwgZmxvYXQgciwgZHluYW1pYyBpbWcsIGJvb2wgZm9sbG93LCBmbG9hdCBhbHBoYSkge1xyXG4gICAgICAgICAgICBfY3R4LkltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBfY2FudmFzLlN0eWxlLkltYWdlUmVuZGVyaW5nID0gSW1hZ2VSZW5kZXJpbmcuUGl4ZWxhdGVkO1xyXG4gICAgICAgICAgICBfY3R4LlNhdmUoKTtcclxuXHJcbiAgICAgICAgICAgIGZsb2F0IHN4ID0gMDtcclxuICAgICAgICAgICAgZmxvYXQgc3kgPSAwO1xyXG4gICAgICAgICAgICBmbG9hdCBzdyA9IHc7XHJcbiAgICAgICAgICAgIGZsb2F0IHNoID0gaDtcclxuXHJcbiAgICAgICAgICAgIGlmIChpbWcuc3ByaXRlU2l6ZVggIT0gbnVsbCAmJiBpbWcuc3ByaXRlU2l6ZVkgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgU3ByaXRlU2hlZXQgaW1nMiA9IChTcHJpdGVTaGVldClpbWc7XHJcbiAgICAgICAgICAgICAgICBzeCA9IGltZzIuY3VycmVudEluZGV4ICUgKCh3LTEpIC8gaW1nMi5zcHJpdGVTaXplWCkgKiBpbWcyLnNwcml0ZVNpemVYO1xyXG4gICAgICAgICAgICAgICAgc3kgPSAoZmxvYXQpTWF0aC5GbG9vcihpbWcyLmN1cnJlbnRJbmRleCAvICgody0xKSAvIGltZzIuc3ByaXRlU2l6ZVkpKSAqIGltZzIuc3ByaXRlU2l6ZVk7XHJcbiAgICAgICAgICAgICAgICBDb25zb2xlLldyaXRlKHN4ICsgXCIgXCIgK3N5KTtcclxuICAgICAgICAgICAgICAgIHN3ID0gaW1nMi5zcHJpdGVTaXplWDtcclxuICAgICAgICAgICAgICAgIHNoID0gaW1nMi5zcHJpdGVTaXplWTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGltZy5kYXRhICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGltZyA9IGltZy5kYXRhO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL09iamVjdCBSb3RhdGlvblxyXG4gICAgICAgICAgICBmbG9hdCBveCA9IHggKyAodyAvIDIpO1xyXG4gICAgICAgICAgICBmbG9hdCBveSA9IHkgKyAoaCAvIDIpO1xyXG5cclxuICAgICAgICAgICAgX2N0eC5UcmFuc2xhdGUob3gsIG95KTtcclxuICAgICAgICAgICAgX2N0eC5Sb3RhdGUoKHIpICogTWF0aC5QSSAvIDE4MCk7IC8vZGVncmVlXHJcbiAgICAgICAgICAgIF9jdHguVHJhbnNsYXRlKC1veCwgLW95KTtcclxuICAgICAgICAgICAgLy8tLS0tLS0tXHJcblxyXG4gICAgICAgICAgICBfY3R4LkRyYXdJbWFnZShpbWcsIHN4LCBzeSwgc3csIHNoLCB4LCB5LCB3LCBoKTtcclxuXHJcbiAgICAgICAgICAgIF9jdHguUmVzdG9yZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcblxyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5HcmFwaGljc1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgSW1hZ2VcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgSFRNTEltYWdlRWxlbWVudCBkYXRhIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIEltYWdlKHN0cmluZyBzcmMpIHtcclxuICAgICAgICAgICAgZGF0YSA9IG5ldyBIVE1MSW1hZ2VFbGVtZW50KCk7XHJcbiAgICAgICAgICAgIGRhdGEuU3JjID0gc3JjO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBJbWFnZShIVE1MSW1hZ2VFbGVtZW50IGltZylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGRhdGEgPSBpbWc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5HcmFwaGljc1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgU3ByaXRlU2hlZXRcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgSFRNTEltYWdlRWxlbWVudCBkYXRhIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgdWludCBzcHJpdGVTaXplWCB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIHVpbnQgc3ByaXRlU2l6ZVkgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyB1aW50IGN1cnJlbnRJbmRleCB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBTcHJpdGVTaGVldChzdHJpbmcgc3JjLCB1aW50IF9zcHJpdGVTaXplWCwgdWludCBfc3ByaXRlU2l6ZVkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBkYXRhID0gbmV3IEhUTUxJbWFnZUVsZW1lbnQoKTtcclxuICAgICAgICAgICAgZGF0YS5TcmMgPSBzcmM7XHJcbiAgICAgICAgICAgIHNwcml0ZVNpemVYID0gX3Nwcml0ZVNpemVYO1xyXG4gICAgICAgICAgICBzcHJpdGVTaXplWSA9IF9zcHJpdGVTaXplWTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuTWF0aHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFZlY3RvcjJcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgWCB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IFkgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgVmVjdG9yMihmbG9hdCBfeCAsIGZsb2F0IF95KSB7XHJcbiAgICAgICAgICAgIFggPSBfeDtcclxuICAgICAgICAgICAgWSA9IF95O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5NYXRoc1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgVmVjdG9yNFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBYIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgWSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IFogeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBXIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIFZlY3RvcjQoZmxvYXQgX3gsIGZsb2F0IF95LCBmbG9hdCBfeiwgZmxvYXQgX3cpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBYID0gX3g7XHJcbiAgICAgICAgICAgIFkgPSBfeTtcclxuICAgICAgICAgICAgWiA9IF96O1xyXG4gICAgICAgICAgICBXID0gX3c7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5TeXN0ZW1cclxue1xyXG4gICAgcHVibGljIGNsYXNzIE1vdXNlXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IHggeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCB5IHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwcml2YXRlIEhUTUxDYW52YXNFbGVtZW50IF9jYW52YXM7XHJcblxyXG4gICAgICAgIGludGVybmFsIE1vdXNlKEhUTUxDYW52YXNFbGVtZW50IGNhbnZhcykge1xyXG4gICAgICAgICAgICBfY2FudmFzID0gY2FudmFzO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5BZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxnbG9iYWw6OkJyaWRnZS5IdG1sNS5FdmVudD4pVXBkYXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBVcGRhdGUoRXZlbnQgZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIENsaWVudFJlY3QgcmVjdCA9IF9jYW52YXMuR2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgICAgIHggPSBlLkFzPE1vdXNlRXZlbnQ+KCkuQ2xpZW50WCAtIChmbG9hdClyZWN0LkxlZnQ7XHJcbiAgICAgICAgICAgIHkgPSBlLkFzPE1vdXNlRXZlbnQ+KCkuQ2xpZW50WSAtIChmbG9hdClyZWN0LlRvcDtcclxuICAgICAgICB9XHJcblxuICAgIFxucHJpdmF0ZSBmbG9hdCBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9feD0wO3ByaXZhdGUgZmxvYXQgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX3k9MDt9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuU3lzdGVtXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBTY2hlZHVsZXJcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIExpc3Q8QWN0aW9uPiBfYWN0aW9uTGlzdCA9IG5ldyBMaXN0PEFjdGlvbj4oKTtcclxuXHJcbiAgICAgICAgaW50ZXJuYWwgU2NoZWR1bGVyKCkge1xyXG4gICAgICAgICAgICBVcGRhdGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZChBY3Rpb24gbWV0aG9kcykge1xyXG4gICAgICAgICAgICBfYWN0aW9uTGlzdC5BZGQoKGdsb2JhbDo6U3lzdGVtLkFjdGlvbikoKCkgPT4gbWV0aG9kcygpKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBVcGRhdGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yZWFjaCAoQWN0aW9uIGEgaW4gX2FjdGlvbkxpc3QpIHtcclxuICAgICAgICAgICAgICAgIGEoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgV2luZG93LlJlcXVlc3RBbmltYXRpb25GcmFtZSgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uKVVwZGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuQ29tcG9uZW50c1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgQW5pbWF0b3IgOiBDb21wb25lbnRcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIERpY3Rpb25hcnk8c3RyaW5nLCBMaXN0PFVuaW9uPEltYWdlLHVpbnQ+Pj4gX2FuaW1hdGlvbnMgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgY3VycmVudEFuaW1hdGlvbiB7IGdldDsgc2V0OyB9ICBcclxuICAgICAgICBwdWJsaWMgaW50IGN1cnJlbnRGcmFtZSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGludCBmcHMgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGJvb2wgX3BsYXlpbmcgPSBmYWxzZTtcclxuICAgICAgICBwcml2YXRlIGRvdWJsZSBsYXN0VGltZUZyYW1lID0gMDtcclxuXHJcbiAgICAgICAgcHVibGljIEFuaW1hdG9yKEdhbWVPYmplY3QgcGFyZW50KSA6IGJhc2UocGFyZW50KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgX2FuaW1hdGlvbnMgPSBuZXcgRGljdGlvbmFyeTxzdHJpbmcsIExpc3Q8VW5pb248SW1hZ2UsIHVpbnQ+Pj4oKTtcclxuICAgICAgICB9XHJcbnB1YmxpYyB2b2lkIEdvdG9BbmRQbGF5KHN0cmluZyBhbmltYXRpb25OYW1lKVxyXG57XHJcbiAgICBHb3RvQW5kUGxheShhbmltYXRpb25OYW1lLCAwKTtcclxufSAgICAgICAgcHVibGljIHZvaWQgR290b0FuZFBsYXkoc3RyaW5nIGFuaW1hdGlvbk5hbWUsIGludCBmcmFtZSkge1xyXG4gICAgICAgICAgICBjdXJyZW50QW5pbWF0aW9uID0gYW5pbWF0aW9uTmFtZTtcclxuICAgICAgICAgICAgY3VycmVudEZyYW1lID0gZnJhbWU7XHJcbiAgICAgICAgICAgIF9wbGF5aW5nID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbnB1YmxpYyB2b2lkIEdvdG9BbmRTdG9wKHN0cmluZyBhbmltYXRpb25OYW1lKVxyXG57XHJcbiAgICBHb3RvQW5kU3RvcChhbmltYXRpb25OYW1lLCAwKTtcclxufSAgICAgICAgcHVibGljIHZvaWQgR290b0FuZFN0b3Aoc3RyaW5nIGFuaW1hdGlvbk5hbWUsIGludCBmcmFtZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRBbmltYXRpb24gPSBhbmltYXRpb25OYW1lO1xyXG4gICAgICAgICAgICBjdXJyZW50RnJhbWUgPSBmcmFtZTtcclxuICAgICAgICAgICAgX3BsYXlpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0b3AoKSB7XHJcbiAgICAgICAgICAgIF9wbGF5aW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBTdGFydCgpIHtcclxuICAgICAgICAgICAgX3BsYXlpbmcgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQ3JlYXRlKHN0cmluZyBhbmltYXRpb25OYW1lLCBMaXN0PHVpbnQ+IGxpc3QpIHtcclxuICAgICAgICAgICAgTGlzdDxVbmlvbjxJbWFnZSwgdWludD4+IHQgPSBuZXcgTGlzdDxVbmlvbjxJbWFnZSwgdWludD4+KCk7XHJcbiAgICAgICAgICAgIHQgPSBsaXN0LkFzPExpc3Q8VW5pb248SW1hZ2UsIHVpbnQ+Pj4oKTtcclxuICAgICAgICAgICAgQ3JlYXRlKGFuaW1hdGlvbk5hbWUsIHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBDcmVhdGUoc3RyaW5nIGFuaW1hdGlvbk5hbWUsIExpc3Q8SW1hZ2U+IGxpc3QpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBMaXN0PFVuaW9uPEltYWdlLCB1aW50Pj4gdCA9IG5ldyBMaXN0PFVuaW9uPEltYWdlLCB1aW50Pj4oKTtcclxuICAgICAgICAgICAgdCA9IGxpc3QuQXM8TGlzdDxVbmlvbjxJbWFnZSwgdWludD4+PigpO1xyXG4gICAgICAgICAgICBDcmVhdGUoYW5pbWF0aW9uTmFtZSwgdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIENyZWF0ZShzdHJpbmcgYW5pbWF0aW9uTmFtZSwgTGlzdDxVbmlvbjxJbWFnZSwgdWludD4+IGxpc3Qpe1xyXG4gICAgICAgICAgICBfYW5pbWF0aW9uc1thbmltYXRpb25OYW1lXSA9IGxpc3Q7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnRlcm5hbCBvdmVycmlkZSB2b2lkIFVwZGF0ZSgpIHtcclxuICAgICAgICAgICAgaWYgKCFfcGxheWluZykgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgZG91YmxlIG5vdyA9IERhdGVUaW1lLk5vdy5TdWJ0cmFjdChEYXRlVGltZS5NaW5WYWx1ZS5BZGRZZWFycygyMDE3KSkuVG90YWxNaWxsaXNlY29uZHM7XHJcbiAgICAgICAgICAgIGRvdWJsZSBkZWx0YSA9IG5vdyAtIGxhc3RUaW1lRnJhbWU7XHJcbiAgICAgICAgICAgIGlmIChkZWx0YSA+IDEwMDAvZnBzKSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50RnJhbWUrKztcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50RnJhbWUgPj0gX2FuaW1hdGlvbnNbY3VycmVudEFuaW1hdGlvbl0uQ291bnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50RnJhbWUgPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICghKCh1aW50KV9hbmltYXRpb25zW2N1cnJlbnRBbmltYXRpb25dW2N1cnJlbnRGcmFtZV0gPj0gMCkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50LmltYWdlID0gKEltYWdlKV9hbmltYXRpb25zW2N1cnJlbnRBbmltYXRpb25dW2N1cnJlbnRGcmFtZV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBTcHJpdGVTaGVldCBzaGVldCA9IChTcHJpdGVTaGVldClwYXJlbnQuaW1hZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hlZXQuY3VycmVudEluZGV4ID0gKHVpbnQpX2FuaW1hdGlvbnNbY3VycmVudEFuaW1hdGlvbl1bY3VycmVudEZyYW1lXTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBsYXN0VGltZUZyYW1lID0gbm93O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXG5cclxuICAgIFxucHJpdmF0ZSBzdHJpbmcgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX2N1cnJlbnRBbmltYXRpb249XCJcIiA7cHJpdmF0ZSBpbnQgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX2N1cnJlbnRGcmFtZT0wO3ByaXZhdGUgaW50IF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19mcHM9MTt9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkNvbXBvbmVudHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIENvbGxpc2lvbiA6IENvbXBvbmVudFxyXG4gICAge1xyXG5cclxuICAgICAgICByZWFkb25seSBMaXN0PFZlY3RvcjQ+IF9ib3hlcztcclxuXHJcbiAgICAgICAgcHVibGljIENvbGxpc2lvbihHYW1lT2JqZWN0IF9wYXJlbnQpIDogYmFzZShfcGFyZW50KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgX2JveGVzID0gbmV3IExpc3Q8VmVjdG9yND4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZEJveChmbG9hdCB4MSxmbG9hdCB5MSwgZmxvYXQgd2lkdGgsIGZsb2F0IGhlaWdodCkge1xyXG4gICAgICAgICAgICBfYm94ZXMuQWRkKG5ldyBWZWN0b3I0KHgxLHkxLHdpZHRoLGhlaWdodCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBmbG9hdCBQYXJlbnRQb3NDYWxjdWxhdGlvblgoZmxvYXQgeCwgR2FtZU9iamVjdCBwYXJlbnQpIHtcclxuICAgICAgICAgICAgZmxvYXQgYWRkaW5nID0gMDtcclxuICAgICAgICAgICAgZmxvYXQgYW5nbGVBZGRpbmcgPSAwO1xyXG5cclxuICAgICAgICAgICAgaWYgKHBhcmVudC5fcGFyZW50ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGFkZGluZyA9IFBhcmVudFBvc0NhbGN1bGF0aW9uWChwYXJlbnQucG9zaXRpb24uWCwgcGFyZW50Ll9wYXJlbnQpO1xyXG4gICAgICAgICAgICAgICAgYW5nbGVBZGRpbmcgPSAoZmxvYXQpKE1hdGguQ29zKHBhcmVudC5fcGFyZW50LmFuZ2xlICogTWF0aC5QSSAvIDE4MCkpICogeDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHBhcmVudC5fcGFyZW50ID09IG51bGwpIGFkZGluZyArPSBwYXJlbnQucG9zaXRpb24uWDtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiAgYWRkaW5nICsgYW5nbGVBZGRpbmc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGZsb2F0IFBhcmVudFBvc0NhbGN1bGF0aW9uWShmbG9hdCB5LCBHYW1lT2JqZWN0IHBhcmVudClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZsb2F0IGFkZGluZyA9IDA7XHJcbiAgICAgICAgICAgIGZsb2F0IGFuZ2xlQWRkaW5nID0gMDtcclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnQuX3BhcmVudCAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBhZGRpbmcgPSBQYXJlbnRQb3NDYWxjdWxhdGlvblkocGFyZW50LnBvc2l0aW9uLlksIHBhcmVudC5fcGFyZW50KTtcclxuICAgICAgICAgICAgICAgIGFuZ2xlQWRkaW5nID0gKGZsb2F0KShNYXRoLlNpbihwYXJlbnQuX3BhcmVudC5hbmdsZSAqIE1hdGguUEkgLyAxODApKSAqIHk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnQuX3BhcmVudCA9PSBudWxsKSBhZGRpbmcgKz0gcGFyZW50LnBvc2l0aW9uLlk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYWRkaW5nICsgYW5nbGVBZGRpbmc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgYm9vbCBIaXRUZXN0T2JqZWN0KEdhbWVPYmplY3Qgb2JqKSB7XHJcblxyXG4gICAgICAgICAgICBmbG9hdCBweCA9IHBhcmVudC5wb3NpdGlvbi5YO1xyXG4gICAgICAgICAgICBmbG9hdCBweSA9IHBhcmVudC5wb3NpdGlvbi5ZO1xyXG4gICAgICAgICAgICBmbG9hdCBwMnggPSBvYmoucG9zaXRpb24uWDtcclxuICAgICAgICAgICAgZmxvYXQgcDJ5ID0gb2JqLnBvc2l0aW9uLlk7XHJcblxyXG4gICAgICAgICAgICBpZiAocGFyZW50Ll9wYXJlbnQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcHggPSBQYXJlbnRQb3NDYWxjdWxhdGlvblgocGFyZW50LnBvc2l0aW9uLlgsICBwYXJlbnQpOyBcclxuICAgICAgICAgICAgICAgIHB5ID0gUGFyZW50UG9zQ2FsY3VsYXRpb25ZKHBhcmVudC5wb3NpdGlvbi5ZLCAgcGFyZW50KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG9iai5fcGFyZW50ICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHAyeCA9IFBhcmVudFBvc0NhbGN1bGF0aW9uWChvYmoucG9zaXRpb24uWCwgb2JqKTtcclxuICAgICAgICAgICAgICAgIHAyeSA9IFBhcmVudFBvc0NhbGN1bGF0aW9uWShvYmoucG9zaXRpb24uWSwgb2JqKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yZWFjaCAoQ29tcG9uZW50IGNwIGluIG9iai5jb21wb25lbnRzLlZhbHVlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNwLkdldFR5cGUoKSA9PSB0eXBlb2YoQ29sbGlzaW9uKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIENvbGxpc2lvbiBjID0gKENvbGxpc2lvbiljcDtcclxuICAgICAgICAgICAgICAgICAgICBmb3JlYWNoIChWZWN0b3I0IGIgaW4gX2JveGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcmVhY2ggKFZlY3RvcjQgYjIgaW4gYy5fYm94ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiLlggKyBweCA8IGIyLlggKyBwMnggKyBiMi5aICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiLlggKyBiLlogKyBweCA+IGIyLlggKyBwMnggJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIuWSArIHB5IDwgYjIuWSArIGIyLlcgKyBwMnkgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIuVyArIGIuWSArIHB5ICA+IGIyLlkgKyBwMnkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGJvb2wgSGl0VGVzdFBvaW50KGZsb2F0IHgsZmxvYXQgeSkge1xyXG5cclxuICAgICAgICAgICAgZmxvYXQgcHggPSBwYXJlbnQucG9zaXRpb24uWDtcclxuICAgICAgICAgICAgZmxvYXQgcHkgPSBwYXJlbnQucG9zaXRpb24uWTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnQuX3BhcmVudCAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBweCA9IFBhcmVudFBvc0NhbGN1bGF0aW9uWChwYXJlbnQucG9zaXRpb24uWCwgcGFyZW50KTtcclxuICAgICAgICAgICAgICAgIHB5ID0gUGFyZW50UG9zQ2FsY3VsYXRpb25YKHBhcmVudC5wb3NpdGlvbi5ZLCBwYXJlbnQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3JlYWNoIChWZWN0b3I0IGIgaW4gX2JveGVzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoeCA8IGIuWCArIHB4ICsgYi5aICYmXHJcbiAgICAgICAgICAgICAgICAgICB4ID4gYi5YICsgcHggJiZcclxuICAgICAgICAgICAgICAgICAgIHkgPCBiLlkgKyBweSArIGIuVyAmJlxyXG4gICAgICAgICAgICAgICAgICAgeSA+IGIuWSArIHB5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5Db21wb25lbnRzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBNb3ZlbWVudCA6IENvbXBvbmVudFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBNb3ZlbWVudChHYW1lT2JqZWN0IF9wYXJlbnQpIDogYmFzZShfcGFyZW50KVxyXG4gICAgICAgIHtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIE1vdmVUb3dhcmQoZmxvYXQgeCwgZmxvYXQgeSwgZmxvYXQgc3BlZWQpIHtcclxuICAgICAgICAgICAgZmxvYXQgZHggPSB4IC0gcGFyZW50LnBvc2l0aW9uLlg7XHJcbiAgICAgICAgICAgIGZsb2F0IGR5ID0geSAtIHBhcmVudC5wb3NpdGlvbi5ZO1xyXG4gICAgICAgICAgICBmbG9hdCBhbmdsZSA9IChmbG9hdClNYXRoLkF0YW4yKGR5LCBkeCk7XHJcblxyXG4gICAgICAgICAgICBwYXJlbnQucG9zaXRpb24uWCArPSBzcGVlZCAqIChmbG9hdClNYXRoLkNvcyhhbmdsZSk7XHJcbiAgICAgICAgICAgIHBhcmVudC5wb3NpdGlvbi5ZICs9IHNwZWVkICogKGZsb2F0KU1hdGguU2luKGFuZ2xlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIExvb2tBdChmbG9hdCB4LGZsb2F0IHkpIHtcclxuICAgICAgICAgICAgZmxvYXQgeDIgPSBwYXJlbnQucG9zaXRpb24uWCAtIHg7XHJcbiAgICAgICAgICAgIGZsb2F0IHkyID0geSAtIHBhcmVudC5wb3NpdGlvbi5ZO1xyXG4gICAgICAgICAgICBmbG9hdCBhbmdsZSA9IChmbG9hdClNYXRoLkF0YW4yKHgyLCB5Mik7XHJcbiAgICAgICAgICAgIHBhcmVudC5hbmdsZSA9IGFuZ2xlICogKGZsb2F0KSgxODAvTWF0aC5QSSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5NYXRocztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuQ29tcG9uZW50cztcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBTcHJpdGUgOiBHYW1lT2JqZWN0XHJcbiAgICB7XHJcbiAgICAgICAgLy9Db25zdHJ1Y3RvclxyXG4gICAgICAgIHB1YmxpYyBTcHJpdGUoVmVjdG9yMiBfcG9zaXRpb24sIFZlY3RvcjIgX3NpemUsIFVuaW9uPEhUTUxDYW52YXNFbGVtZW50LCBJbWFnZSwgU3ByaXRlU2hlZXQ+IF9pbWFnZSkge1xyXG4gICAgICAgICAgICBwb3NpdGlvbiA9IF9wb3NpdGlvbjtcclxuICAgICAgICAgICAgc2l6ZSA9IF9zaXplO1xyXG4gICAgICAgICAgICBpbWFnZSA9IF9pbWFnZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl0KfQo=
