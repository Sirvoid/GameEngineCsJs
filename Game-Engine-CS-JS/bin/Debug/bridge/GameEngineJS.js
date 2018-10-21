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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJHYW1lRW5naW5lSlMuanMiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbIkNvbXBvbmVudHMvQ29tcG9uZW50LmNzIiwiQ29tcG9uZW50cy9Db21wb25lbnRSZWFkZXIuY3MiLCJEaXNwbGF5L0NhbWVyYS5jcyIsIkRpc3BsYXkvRGlzcGxheUxpc3QuY3MiLCJEaXNwbGF5L1NjZW5lLmNzIiwiRXZlbnRzL0tleUJvYXJkRXZlbnQuY3MiLCJHYW1lLmNzIiwiR2FtZU9iamVjdHMvR2FtZU9iamVjdC5jcyIsIkdyYXBoaWNzL0RyYXdlci5jcyIsIkdyYXBoaWNzL0ltYWdlLmNzIiwiTWF0aHMvVmVjdG9yMi5jcyIsIk1hdGhzL1ZlY3RvcjQuY3MiLCJTeXN0ZW0vTW91c2UuY3MiLCJTeXN0ZW0vU2NoZWR1bGVyLmNzIiwiQ29tcG9uZW50cy9BbmltYXRvci5jcyIsIkNvbXBvbmVudHMvQ29sbGlzaW9uLmNzIiwiQ29tcG9uZW50cy9Nb3ZlbWVudC5jcyIsIkdhbWVPYmplY3RzL1Nwcml0ZS5jcyJdLAogICJuYW1lcyI6IFsiIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs0QkFRMkJBOztnQkFDZkEsY0FBU0E7Ozs7Ozs7Ozs7Ozs7NEJDRVlBOztnQkFDckJBLG1CQUFjQTs7Ozs7O2dCQUlkQSwwQkFBMkJBOzs7O3dCQUN2QkEsMkJBQXNEQTs7OztnQ0FFbERBOzs7Ozs7O3dCQUVKQSxxQkFBZ0JBOzs7Ozs7Ozt1Q0FJS0E7O2dCQUN6QkEsSUFBSUE7b0JBQTZCQTs7Z0JBQ2pDQSwwQkFBNEJBOzs7O3dCQUV4QkEsMkJBQXNEQTs7OztnQ0FFbERBOzs7Ozs7O3dCQUVKQSxxQkFBZ0JBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O2dCQ25CcEJBLGdCQUFXQSxJQUFJQTtnQkFDZkE7OzhCQUdVQSxXQUFrQkE7O2dCQUM1QkEsZ0JBQVdBO2dCQUNYQSxnQkFBV0E7Ozs7Ozs7Ozs7OzRCQ0ZnQ0EsS0FBSUE7Ozs7MkJBTm5DQSxLQUFlQTtn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QUFNQSxNQUFNQSxLQUFNQSxPQUFPQTtnREFDeEJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0JBTXBCQTs7b0NBR3FCQSxHQUFRQTs7O2dCQUU3QkEsU0FBV0E7Z0JBQ1hBLFNBQVdBOztnQkFFWEEsSUFBSUEsdUJBQWtCQTtvQkFFbEJBLEtBQUtBLDJCQUFzQkEsd0JBQW1CQTtvQkFDOUNBLEtBQUtBLDJCQUFzQkEsd0JBQW1CQTs7O2dCQUdsREEsMEJBQXNCQTs7Ozt3QkFFbEJBLElBQUlBLElBQUlBLE1BQU1BLEtBQUtBLE9BQ2hCQSxJQUFJQSxNQUFNQSxNQUNWQSxJQUFJQSxNQUFNQSxLQUFLQSxPQUNmQSxJQUFJQSxNQUFNQTs0QkFDVEE7Ozs7Ozs7O2dCQUdSQTs7Ozs7Ozs7NEJDcEdZQTs7a0VBQTJCQTs7OztrQ0FJcEJBLEdBQVNBLEdBQVNBOztnQkFDckNBLFNBQVdBLElBQUlBO2dCQUNmQSxTQUFXQSxJQUFJQTtnQkFDZkEsWUFBY0EsQUFBT0EsV0FBV0EsSUFBSUE7O2dCQUVwQ0E7d0JBQXFCQSxRQUFRQSxBQUFPQSxTQUFTQTtnQkFDN0NBO3lCQUFxQkEsUUFBUUEsQUFBT0EsU0FBU0E7OzhCQUc5QkEsR0FBUUE7Z0JBQ3ZCQSxTQUFXQSx5QkFBb0JBO2dCQUMvQkEsU0FBV0EsSUFBSUE7Z0JBQ2ZBLFlBQWNBLEFBQU9BLFdBQVdBLElBQUlBO2dCQUNwQ0Esb0JBQWVBLFFBQVFBOzs7Ozs7Ozs0QkNYYkEsV0FBbUJBLE9BQWVBOzs7Z0JBQzVDQSxnQkFBV0E7Z0JBQ1hBLFlBQU9BO2dCQUNQQSxhQUFRQSIsCiAgInNvdXJjZXNDb250ZW50IjogWyJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuQ29tcG9uZW50c1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgQ29tcG9uZW50XHJcbiAgICB7XHJcbiAgICAgICAgaW50ZXJuYWwgR2FtZU9iamVjdCBwYXJlbnQgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIGludGVybmFsIENvbXBvbmVudChHYW1lT2JqZWN0IF9wYXJlbnQpIHtcclxuICAgICAgICAgICAgcGFyZW50ID0gX3BhcmVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGludGVybmFsIHZpcnR1YWwgdm9pZCBVcGRhdGUoKSB7fVxyXG5cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBHYW1lRW5naW5lSlMuRGlzcGxheTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5Db21wb25lbnRzXHJcbntcclxuICAgIGludGVybmFsIGNsYXNzIENvbXBvbmVudFJlYWRlclxyXG4gICAge1xyXG4gICAgICAgIGludGVybmFsIERpc3BsYXlMaXN0IGRpc3BsYXlMaXN0IHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgaW50ZXJuYWwgQ29tcG9uZW50UmVhZGVyKERpc3BsYXlMaXN0IGxpc3QpIHtcclxuICAgICAgICAgICAgZGlzcGxheUxpc3QgPSBsaXN0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW50ZXJuYWwgdm9pZCB1cGRhdGUoKSB7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKEdhbWVPYmplY3Qgb2JqIGluIGRpc3BsYXlMaXN0Lmxpc3QpIHtcclxuICAgICAgICAgICAgICAgIGZvcmVhY2ggKEtleVZhbHVlUGFpcjxzdHJpbmcsIENvbXBvbmVudD4gY29tcG9uZW50IGluIG9iai5jb21wb25lbnRzKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5WYWx1ZS5VcGRhdGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlY3Vyc2l2ZVVwZGF0ZShvYmopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgcmVjdXJzaXZlVXBkYXRlKEdhbWVPYmplY3Qgb2JqKSB7XHJcbiAgICAgICAgICAgIGlmIChkaXNwbGF5TGlzdC5saXN0LkNvdW50IDw9IDApIHJldHVybjtcclxuICAgICAgICAgICAgZm9yZWFjaCAoR2FtZU9iamVjdCBvYmoyIGluIG9iai5kaXNwbGF5TGlzdC5saXN0KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmb3JlYWNoIChLZXlWYWx1ZVBhaXI8c3RyaW5nLCBDb21wb25lbnQ+IGNvbXBvbmVudCBpbiBvYmoyLmNvbXBvbmVudHMpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LlZhbHVlLlVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVjdXJzaXZlVXBkYXRlKG9iajIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkRpc3BsYXlcclxue1xyXG4gICAgcHVibGljIGNsYXNzIENhbWVyYVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIHBvc2l0aW9uIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgcm90YXRpb24geyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgQ2FtZXJhKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uID0gbmV3IFZlY3RvcjIoMCwwKTtcclxuICAgICAgICAgICAgcm90YXRpb24gPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIENhbWVyYShWZWN0b3IyIF9wb3NpdGlvbixmbG9hdCBfcm90YXRpb24pIHtcclxuICAgICAgICAgICAgcG9zaXRpb24gPSBfcG9zaXRpb247XHJcbiAgICAgICAgICAgIHJvdGF0aW9uID0gX3JvdGF0aW9uO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5EaXNwbGF5XHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBEaXNwbGF5TGlzdFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBMaXN0PEdhbWVPYmplY3Q+IGxpc3QgeyBnZXQ7IHNldDsgfSAgXHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZChHYW1lT2JqZWN0IG9iaixHYW1lT2JqZWN0IHBhcmVudCkge1xyXG4gICAgICAgICAgICBsaXN0LkFkZChvYmopO1xyXG4gICAgICAgICAgICBvYmouX3BhcmVudCA9IHBhcmVudDtcclxuICAgICAgICB9XHJcblxuICAgIFxucHJpdmF0ZSBMaXN0PEdhbWVPYmplY3Q+IF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19saXN0PW5ldyBMaXN0PEdhbWVPYmplY3Q+KCkgO31cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5TeXN0ZW07XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkRpc3BsYXlcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFNjZW5lXHJcbiAgICB7XHJcblxyXG4gICAgICAgIHB1YmxpYyBDYW1lcmEgY2FtZXJhIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBEaXNwbGF5TGlzdCBfbWFpbkRpc3BsYXlMaXN0O1xyXG4gICAgICAgIHByaXZhdGUgRHJhd2VyIF9kcmF3ZXI7XHJcbiAgICAgICAgcHJpdmF0ZSBIVE1MQ2FudmFzRWxlbWVudCBfY2FudmFzO1xyXG4gICAgICAgIHByaXZhdGUgc3RyaW5nIF9jb2xvcjtcclxuICAgICAgICBwdWJsaWMgTW91c2UgbW91c2UgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgU2NlbmUoRGlzcGxheUxpc3Qgb2JqTGlzdCxzdHJpbmcgY2FudmFzSUQsc3RyaW5nIGNvbG9yKSB7XHJcbiAgICAgICAgICAgIGNhbWVyYSA9IG5ldyBDYW1lcmEoKTtcclxuICAgICAgICAgICAgX21haW5EaXNwbGF5TGlzdCA9IG9iakxpc3Q7XHJcbiAgICAgICAgICAgIF9jYW52YXMgPSBEb2N1bWVudC5RdWVyeVNlbGVjdG9yPEhUTUxDYW52YXNFbGVtZW50PihcImNhbnZhcyNcIiArIGNhbnZhc0lEKTtcclxuICAgICAgICAgICAgX2RyYXdlciA9IG5ldyBEcmF3ZXIoX2NhbnZhcyk7XHJcbiAgICAgICAgICAgIF9jb2xvciA9IGNvbG9yO1xyXG4gICAgICAgICAgICBtb3VzZSA9IG5ldyBNb3VzZShfY2FudmFzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFJlZnJlc2goKSB7XHJcbiAgICAgICAgICAgIF9kcmF3ZXIuRmlsbFNjcmVlbihfY29sb3IpO1xyXG4gICAgICAgICAgICBmb3JlYWNoIChHYW1lT2JqZWN0IG9iaiBpbiBfbWFpbkRpc3BsYXlMaXN0Lmxpc3QpIHtcclxuICAgICAgICAgICAgICAgIF9kcmF3ZXIuRHJhdyhvYmoucG9zaXRpb24uWCAtIGNhbWVyYS5wb3NpdGlvbi5YLCBvYmoucG9zaXRpb24uWSAtIGNhbWVyYS5wb3NpdGlvbi5ZLCBvYmouc2l6ZS5YLCBvYmouc2l6ZS5ZLCBvYmouYW5nbGUsIG9iai5pbWFnZSxmYWxzZSwxKTtcclxuICAgICAgICAgICAgICAgIERyYXdDaGlsZChvYmosb2JqLnBvc2l0aW9uLlgsb2JqLnBvc2l0aW9uLlksb2JqLmFuZ2xlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIERyYXdDaGlsZChHYW1lT2JqZWN0IG9iaixmbG9hdCB4LGZsb2F0IHksZmxvYXQgYW5nbGUpIHtcclxuICAgICAgICAgICAgZm9yZWFjaCAoR2FtZU9iamVjdCBvYmoyIGluIG9iai5kaXNwbGF5TGlzdC5saXN0KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmbG9hdCBuZXdYID0geCArIChmbG9hdCkoTWF0aC5Db3Mob2JqLmFuZ2xlKk1hdGguUEkvMTgwKSkgKiBvYmoyLnBvc2l0aW9uLlggLSBjYW1lcmEucG9zaXRpb24uWDtcclxuICAgICAgICAgICAgICAgIGZsb2F0IG5ld1kgPSB5ICsgKGZsb2F0KShNYXRoLlNpbihvYmouYW5nbGUqTWF0aC5QSS8xODApKSAqIG9iajIucG9zaXRpb24uWSAtIGNhbWVyYS5wb3NpdGlvbi5ZO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQgbmV3QW5nbGUgPSBvYmoyLmFuZ2xlICsgYW5nbGU7XHJcblxyXG4gICAgICAgICAgICAgICAgX2RyYXdlci5EcmF3KG5ld1gsIG5ld1ksIG9iajIuc2l6ZS5YLCBvYmoyLnNpemUuWSwgbmV3QW5nbGUsIG9iajIuaW1hZ2UsIGZhbHNlLCAxKTtcclxuICAgICAgICAgICAgICAgIERyYXdDaGlsZChvYmoyLG5ld1gsbmV3WSxuZXdBbmdsZSk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5FdmVudHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEtleUJvYXJkRXZlbnRcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgZGVsZWdhdGUgdm9pZCBLZXlQcmVzc0V2ZW50KGludCBrZXljb2RlKTtcclxuICAgICAgICBwdWJsaWMgZXZlbnQgS2V5UHJlc3NFdmVudCBPbktleVByZXNzRXZlbnRzO1xyXG5cclxuICAgICAgICBwdWJsaWMgZGVsZWdhdGUgdm9pZCBLZXlEb3duRXZlbnQoaW50IGtleWNvZGUpO1xyXG4gICAgICAgIHB1YmxpYyBldmVudCBLZXlEb3duRXZlbnQgT25LZXlEb3duRXZlbnRzO1xyXG5cclxuICAgICAgICBwdWJsaWMgZGVsZWdhdGUgdm9pZCBLZXlVcEV2ZW50KGludCBrZXljb2RlKTtcclxuICAgICAgICBwdWJsaWMgZXZlbnQgS2V5VXBFdmVudCBPbktleVVwRXZlbnRzO1xyXG5cclxuICAgICAgICBwdWJsaWMgS2V5Qm9hcmRFdmVudCgpIHtcclxuICAgICAgICAgICAgRG9jdW1lbnQuQWRkRXZlbnRMaXN0ZW5lcihFdmVudFR5cGUuS2V5UHJlc3MsIChnbG9iYWw6OlN5c3RlbS5BY3Rpb248Z2xvYmFsOjpCcmlkZ2UuSHRtbDUuRXZlbnQ+KURvS2V5UHJlc3MpO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5BZGRFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5LZXlEb3duLCAoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6QnJpZGdlLkh0bWw1LkV2ZW50PilEb0tleURvd24pO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5BZGRFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5LZXlVcCwgKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxnbG9iYWw6OkJyaWRnZS5IdG1sNS5FdmVudD4pRG9LZXlVcCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgRG9LZXlQcmVzcyhFdmVudCBlKSB7XHJcbiAgICAgICAgICAgIGlmIChPbktleVByZXNzRXZlbnRzID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgT25LZXlQcmVzc0V2ZW50cy5JbnZva2UoZS5BczxLZXlib2FyZEV2ZW50PigpLktleUNvZGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIERvS2V5RG93bihFdmVudCBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKE9uS2V5RG93bkV2ZW50cyA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIE9uS2V5RG93bkV2ZW50cy5JbnZva2UoZS5BczxLZXlib2FyZEV2ZW50PigpLktleUNvZGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIERvS2V5VXAoRXZlbnQgZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChPbktleVVwRXZlbnRzID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgT25LZXlVcEV2ZW50cy5JbnZva2UoZS5BczxLZXlib2FyZEV2ZW50PigpLktleUNvZGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuU3lzdGVtO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5EaXNwbGF5O1xyXG51c2luZyBHYW1lRW5naW5lSlMuQ29tcG9uZW50cztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEdhbWVcclxuICAgIHtcclxuICAgICAgICBcclxuICAgICAgICBwdWJsaWMgRHJhd2VyIGRyYXdlciB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIFNjaGVkdWxlciBzY2hlZHVsZXIgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBTY2VuZSBzY2VuZSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIE1vdXNlIG1vdXNlIHsgZ2V0IHsgcmV0dXJuIHNjZW5lLm1vdXNlOyB9IH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBEaXNwbGF5TGlzdCBfZGlzcGxheUxpc3Q7XHJcbiAgICAgICAgcHJpdmF0ZSBDb21wb25lbnRSZWFkZXIgX2NvbXBvbmVudFJlYWRlcjtcclxuXHJcbiAgICAgICAgcHVibGljIEdhbWUoc3RyaW5nIGNhbnZhc0lEKSA6IHRoaXMoY2FudmFzSUQsIFwiI2ZmZlwiKSB7IH1cclxuICAgICAgICBwdWJsaWMgR2FtZShzdHJpbmcgY2FudmFzSUQsc3RyaW5nIGNvbG9yKSB7XHJcbiAgICAgICAgICAgIF9kaXNwbGF5TGlzdCA9IG5ldyBEaXNwbGF5TGlzdCgpO1xyXG4gICAgICAgICAgICBzY2VuZSA9IG5ldyBTY2VuZShfZGlzcGxheUxpc3QsY2FudmFzSUQsY29sb3IpO1xyXG4gICAgICAgICAgICBfY29tcG9uZW50UmVhZGVyID0gbmV3IENvbXBvbmVudFJlYWRlcihfZGlzcGxheUxpc3QpO1xyXG4gICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIHNjaGVkdWxlciA9IG5ldyBTY2hlZHVsZXIoKTtcclxuICAgICAgICAgICAgc2NoZWR1bGVyLkFkZCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uKXNjZW5lLlJlZnJlc2gpO1xyXG4gICAgICAgICAgICBzY2hlZHVsZXIuQWRkKChnbG9iYWw6OlN5c3RlbS5BY3Rpb24pX2NvbXBvbmVudFJlYWRlci51cGRhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkQ2hpbGQoR2FtZU9iamVjdCBvYmopIHtcclxuICAgICAgICAgICAgX2Rpc3BsYXlMaXN0LkFkZChvYmosbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5NYXRocztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuQ29tcG9uZW50cztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkRpc3BsYXk7XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0c1xyXG57XHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgY2xhc3MgR2FtZU9iamVjdFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIHBvc2l0aW9uIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgVmVjdG9yMiBzaXplIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgYW5nbGUgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBVbmlvbjxIVE1MQ2FudmFzRWxlbWVudCwgSW1hZ2U+IGltYWdlIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgRGljdGlvbmFyeTxzdHJpbmcsIENvbXBvbmVudD4gY29tcG9uZW50cyA9IG5ldyBEaWN0aW9uYXJ5PHN0cmluZywgQ29tcG9uZW50PigpO1xyXG4gICAgICAgIGludGVybmFsIERpc3BsYXlMaXN0IGRpc3BsYXlMaXN0ID0gbmV3IERpc3BsYXlMaXN0KCk7XHJcbiAgICAgICAgaW50ZXJuYWwgR2FtZU9iamVjdCBfcGFyZW50O1xyXG5cclxuICAgICAgICAvL1B1YmxpYyBNZXRob2RzXHJcbiAgICAgICAgcHVibGljIENvbXBvbmVudCBBZGRDb21wb25lbnQoc3RyaW5nIGluc3RhbmNlTmFtZSwgQ29tcG9uZW50IGNvbXBvbmVudClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbXBvbmVudHNbaW5zdGFuY2VOYW1lXSA9IGNvbXBvbmVudDtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudHNbaW5zdGFuY2VOYW1lXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZENoaWxkKEdhbWVPYmplY3Qgb2JqKSB7XHJcbiAgICAgICAgICAgIGRpc3BsYXlMaXN0LkFkZChvYmosdGhpcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkdyYXBoaWNzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBEcmF3ZXJcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBfY3R4O1xyXG4gICAgICAgIHByaXZhdGUgSFRNTENhbnZhc0VsZW1lbnQgX2NhbnZhcztcclxuXHJcbiAgICAgICAgcHVibGljIERyYXdlcihIVE1MQ2FudmFzRWxlbWVudCBjYW52YXMpIHtcclxuICAgICAgICAgICAgX2N0eCA9IChDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpY2FudmFzLkdldENvbnRleHQoXCIyZFwiKTtcclxuICAgICAgICAgICAgX2NhbnZhcyA9IGNhbnZhcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEZpbGxTY3JlZW4oc3RyaW5nIGNvbG9yKSB7XHJcbiAgICAgICAgICAgIF9jdHguRmlsbFN0eWxlID0gY29sb3I7XHJcbiAgICAgICAgICAgIF9jdHguRmlsbFJlY3QoMCwwLF9jYW52YXMuV2lkdGgsX2NhbnZhcy5IZWlnaHQpO1xyXG4gICAgICAgIH1cclxucHVibGljIHZvaWQgRHJhdyhmbG9hdCB4LCBmbG9hdCB5LCBmbG9hdCB3LCBmbG9hdCBoLCBkeW5hbWljIGltZylcclxue1xyXG4gICAgRHJhdyh4LCB5LCB3LCBoLCAwLCBpbWcsIGZhbHNlLCAxKTtcclxufSAgICAgICAgcHVibGljIHZvaWQgRHJhdyhmbG9hdCB4LCBmbG9hdCB5LCBmbG9hdCB3LCBmbG9hdCBoLCBmbG9hdCByLCBkeW5hbWljIGltZywgYm9vbCBmb2xsb3csIGZsb2F0IGFscGhhKSB7XHJcbiAgICAgICAgICAgIF9jdHguSW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIF9jYW52YXMuU3R5bGUuSW1hZ2VSZW5kZXJpbmcgPSBJbWFnZVJlbmRlcmluZy5QaXhlbGF0ZWQ7XHJcbiAgICAgICAgICAgIF9jdHguU2F2ZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGltZy5kYXRhICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGltZyA9IGltZy5kYXRhO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL09iamVjdCBSb3RhdGlvblxyXG4gICAgICAgICAgICBmbG9hdCBveCA9IHggKyAodyAvIDIpO1xyXG4gICAgICAgICAgICBmbG9hdCBveSA9IHkgKyAoaCAvIDIpO1xyXG5cclxuICAgICAgICAgICAgX2N0eC5UcmFuc2xhdGUob3gsIG95KTtcclxuICAgICAgICAgICAgX2N0eC5Sb3RhdGUoKHIpICogTWF0aC5QSSAvIDE4MCk7IC8vZGVncmVlXHJcbiAgICAgICAgICAgIF9jdHguVHJhbnNsYXRlKC1veCwgLW95KTtcclxuICAgICAgICAgICAgLy8tLS0tLS0tXHJcblxyXG4gICAgICAgICAgICBfY3R4LkRyYXdJbWFnZShpbWcsIHgsIHksIHcsIGgpO1xyXG5cclxuICAgICAgICAgICAgX2N0eC5SZXN0b3JlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxuXHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkdyYXBoaWNzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBJbWFnZVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBIVE1MSW1hZ2VFbGVtZW50IGRhdGEgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgSW1hZ2Uoc3RyaW5nIHNyYykge1xyXG4gICAgICAgICAgICBkYXRhID0gbmV3IEhUTUxJbWFnZUVsZW1lbnQoKTtcclxuICAgICAgICAgICAgZGF0YS5TcmMgPSBzcmM7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5NYXRoc1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgVmVjdG9yMlxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBYIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgWSB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyKGZsb2F0IF94ICwgZmxvYXQgX3kpIHtcclxuICAgICAgICAgICAgWCA9IF94O1xyXG4gICAgICAgICAgICBZID0gX3k7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLk1hdGhzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBWZWN0b3I0XHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IFggeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBZIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgWiB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IFcgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgVmVjdG9yNChmbG9hdCBfeCwgZmxvYXQgX3ksIGZsb2F0IF96LCBmbG9hdCBfdylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFggPSBfeDtcclxuICAgICAgICAgICAgWSA9IF95O1xyXG4gICAgICAgICAgICBaID0gX3o7XHJcbiAgICAgICAgICAgIFcgPSBfdztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLlN5c3RlbVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgTW91c2VcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgeCB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IHkgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHByaXZhdGUgSFRNTENhbnZhc0VsZW1lbnQgX2NhbnZhcztcclxuXHJcbiAgICAgICAgaW50ZXJuYWwgTW91c2UoSFRNTENhbnZhc0VsZW1lbnQgY2FudmFzKSB7XHJcbiAgICAgICAgICAgIF9jYW52YXMgPSBjYW52YXM7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6QnJpZGdlLkh0bWw1LkV2ZW50PilVcGRhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIFVwZGF0ZShFdmVudCBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQ2xpZW50UmVjdCByZWN0ID0gX2NhbnZhcy5HZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICAgICAgeCA9IGUuQXM8TW91c2VFdmVudD4oKS5DbGllbnRYIC0gKGZsb2F0KXJlY3QuTGVmdDtcclxuICAgICAgICAgICAgeSA9IGUuQXM8TW91c2VFdmVudD4oKS5DbGllbnRZIC0gKGZsb2F0KXJlY3QuVG9wO1xyXG4gICAgICAgIH1cclxuXG4gICAgXG5wcml2YXRlIGZsb2F0IF9fUHJvcGVydHlfX0luaXRpYWxpemVyX194PTA7cHJpdmF0ZSBmbG9hdCBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9feT0wO31cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5TeXN0ZW1cclxue1xyXG4gICAgcHVibGljIGNsYXNzIFNjaGVkdWxlclxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgTGlzdDxBY3Rpb24+IF9hY3Rpb25MaXN0ID0gbmV3IExpc3Q8QWN0aW9uPigpO1xyXG5cclxuICAgICAgICBpbnRlcm5hbCBTY2hlZHVsZXIoKSB7XHJcbiAgICAgICAgICAgIFVwZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkKEFjdGlvbiBtZXRob2RzKSB7XHJcbiAgICAgICAgICAgIF9hY3Rpb25MaXN0LkFkZCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uKSgoKSA9PiBtZXRob2RzKCkpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFVwZGF0ZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3JlYWNoIChBY3Rpb24gYSBpbiBfYWN0aW9uTGlzdCkge1xyXG4gICAgICAgICAgICAgICAgYSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBXaW5kb3cuUmVxdWVzdEFuaW1hdGlvbkZyYW1lKChnbG9iYWw6OlN5c3RlbS5BY3Rpb24pVXBkYXRlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR3JhcGhpY3M7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkNvbXBvbmVudHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEFuaW1hdG9yIDogQ29tcG9uZW50XHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSBEaWN0aW9uYXJ5PHN0cmluZywgTGlzdDxJbWFnZT4+IF9hbmltYXRpb25zIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgc3RyaW5nIGN1cnJlbnRBbmltYXRpb24geyBnZXQ7IHNldDsgfSAgXHJcbiAgICAgICAgcHVibGljIGludCBjdXJyZW50RnJhbWUgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBpbnQgZnBzIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBib29sIF9wbGF5aW5nID0gZmFsc2U7XHJcbiAgICAgICAgcHJpdmF0ZSBkb3VibGUgbGFzdFRpbWVGcmFtZSA9IDA7XHJcblxyXG4gICAgICAgIHB1YmxpYyBBbmltYXRvcihHYW1lT2JqZWN0IHBhcmVudCkgOiBiYXNlKHBhcmVudClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIF9hbmltYXRpb25zID0gbmV3IERpY3Rpb25hcnk8c3RyaW5nLCBMaXN0PEltYWdlPj4oKTtcclxuICAgICAgICB9XHJcbnB1YmxpYyB2b2lkIEdvdG9BbmRQbGF5KHN0cmluZyBhbmltYXRpb25OYW1lKVxyXG57XHJcbiAgICBHb3RvQW5kUGxheShhbmltYXRpb25OYW1lLCAwKTtcclxufSAgICAgICAgcHVibGljIHZvaWQgR290b0FuZFBsYXkoc3RyaW5nIGFuaW1hdGlvbk5hbWUsIGludCBmcmFtZSkge1xyXG4gICAgICAgICAgICBjdXJyZW50QW5pbWF0aW9uID0gYW5pbWF0aW9uTmFtZTtcclxuICAgICAgICAgICAgY3VycmVudEZyYW1lID0gZnJhbWU7XHJcbiAgICAgICAgICAgIF9wbGF5aW5nID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbnB1YmxpYyB2b2lkIEdvdG9BbmRTdG9wKHN0cmluZyBhbmltYXRpb25OYW1lKVxyXG57XHJcbiAgICBHb3RvQW5kU3RvcChhbmltYXRpb25OYW1lLCAwKTtcclxufSAgICAgICAgcHVibGljIHZvaWQgR290b0FuZFN0b3Aoc3RyaW5nIGFuaW1hdGlvbk5hbWUsIGludCBmcmFtZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRBbmltYXRpb24gPSBhbmltYXRpb25OYW1lO1xyXG4gICAgICAgICAgICBjdXJyZW50RnJhbWUgPSBmcmFtZTtcclxuICAgICAgICAgICAgX3BsYXlpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0b3AoKSB7XHJcbiAgICAgICAgICAgIF9wbGF5aW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBTdGFydCgpIHtcclxuICAgICAgICAgICAgX3BsYXlpbmcgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQ3JlYXRlKHN0cmluZyBhbmltYXRpb25OYW1lLCBMaXN0PEltYWdlPiBsaXN0KXtcclxuICAgICAgICAgICAgX2FuaW1hdGlvbnNbYW5pbWF0aW9uTmFtZV0gPSBsaXN0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW50ZXJuYWwgb3ZlcnJpZGUgdm9pZCBVcGRhdGUoKSB7XHJcbiAgICAgICAgICAgIGlmICghX3BsYXlpbmcpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGRvdWJsZSBub3cgPSBEYXRlVGltZS5Ob3cuU3VidHJhY3QoRGF0ZVRpbWUuTWluVmFsdWUuQWRkWWVhcnMoMjAxNykpLlRvdGFsTWlsbGlzZWNvbmRzO1xyXG4gICAgICAgICAgICBkb3VibGUgZGVsdGEgPSBub3cgLSBsYXN0VGltZUZyYW1lO1xyXG4gICAgICAgICAgICBpZiAoZGVsdGEgPiAxMDAwL2Zwcykge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEZyYW1lKys7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudEZyYW1lID49IF9hbmltYXRpb25zW2N1cnJlbnRBbmltYXRpb25dLkNvdW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEZyYW1lID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHBhcmVudC5pbWFnZSA9IF9hbmltYXRpb25zW2N1cnJlbnRBbmltYXRpb25dW2N1cnJlbnRGcmFtZV07XHJcblxyXG4gICAgICAgICAgICAgICAgbGFzdFRpbWVGcmFtZSA9IG5vdztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxuXHJcbiAgICBcbnByaXZhdGUgc3RyaW5nIF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19jdXJyZW50QW5pbWF0aW9uPVwiXCIgO3ByaXZhdGUgaW50IF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19jdXJyZW50RnJhbWU9MDtwcml2YXRlIGludCBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fZnBzPTE7fVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxudXNpbmcgR2FtZUVuZ2luZUpTLk1hdGhzO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5Db21wb25lbnRzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBDb2xsaXNpb24gOiBDb21wb25lbnRcclxuICAgIHtcclxuXHJcbiAgICAgICAgcmVhZG9ubHkgTGlzdDxWZWN0b3I0PiBfYm94ZXM7XHJcblxyXG4gICAgICAgIHB1YmxpYyBDb2xsaXNpb24oR2FtZU9iamVjdCBfcGFyZW50KSA6IGJhc2UoX3BhcmVudClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIF9ib3hlcyA9IG5ldyBMaXN0PFZlY3RvcjQ+KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBBZGRCb3goZmxvYXQgeDEsZmxvYXQgeTEsIGZsb2F0IHdpZHRoLCBmbG9hdCBoZWlnaHQpIHtcclxuICAgICAgICAgICAgX2JveGVzLkFkZChuZXcgVmVjdG9yNCh4MSx5MSx3aWR0aCxoZWlnaHQpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgZmxvYXQgUGFyZW50UG9zQ2FsY3VsYXRpb25YKGZsb2F0IHgsIEdhbWVPYmplY3QgcGFyZW50KSB7XHJcbiAgICAgICAgICAgIGZsb2F0IGFkZGluZyA9IDA7XHJcbiAgICAgICAgICAgIGZsb2F0IGFuZ2xlQWRkaW5nID0gMDtcclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnQuX3BhcmVudCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBhZGRpbmcgPSBQYXJlbnRQb3NDYWxjdWxhdGlvblgocGFyZW50LnBvc2l0aW9uLlgsIHBhcmVudC5fcGFyZW50KTtcclxuICAgICAgICAgICAgICAgIGFuZ2xlQWRkaW5nID0gKGZsb2F0KShNYXRoLkNvcyhwYXJlbnQuX3BhcmVudC5hbmdsZSAqIE1hdGguUEkgLyAxODApKSAqIHg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnQuX3BhcmVudCA9PSBudWxsKSBhZGRpbmcgKz0gcGFyZW50LnBvc2l0aW9uLlg7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gIGFkZGluZyArIGFuZ2xlQWRkaW5nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBmbG9hdCBQYXJlbnRQb3NDYWxjdWxhdGlvblkoZmxvYXQgeSwgR2FtZU9iamVjdCBwYXJlbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmbG9hdCBhZGRpbmcgPSAwO1xyXG4gICAgICAgICAgICBmbG9hdCBhbmdsZUFkZGluZyA9IDA7XHJcblxyXG4gICAgICAgICAgICBpZiAocGFyZW50Ll9wYXJlbnQgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYWRkaW5nID0gUGFyZW50UG9zQ2FsY3VsYXRpb25ZKHBhcmVudC5wb3NpdGlvbi5ZLCBwYXJlbnQuX3BhcmVudCk7XHJcbiAgICAgICAgICAgICAgICBhbmdsZUFkZGluZyA9IChmbG9hdCkoTWF0aC5TaW4ocGFyZW50Ll9wYXJlbnQuYW5nbGUgKiBNYXRoLlBJIC8gMTgwKSkgKiB5O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAocGFyZW50Ll9wYXJlbnQgPT0gbnVsbCkgYWRkaW5nICs9IHBhcmVudC5wb3NpdGlvbi5ZO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGFkZGluZyArIGFuZ2xlQWRkaW5nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGJvb2wgSGl0VGVzdE9iamVjdChHYW1lT2JqZWN0IG9iaikge1xyXG5cclxuICAgICAgICAgICAgZmxvYXQgcHggPSBwYXJlbnQucG9zaXRpb24uWDtcclxuICAgICAgICAgICAgZmxvYXQgcHkgPSBwYXJlbnQucG9zaXRpb24uWTtcclxuICAgICAgICAgICAgZmxvYXQgcDJ4ID0gb2JqLnBvc2l0aW9uLlg7XHJcbiAgICAgICAgICAgIGZsb2F0IHAyeSA9IG9iai5wb3NpdGlvbi5ZO1xyXG5cclxuICAgICAgICAgICAgaWYgKHBhcmVudC5fcGFyZW50ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHB4ID0gUGFyZW50UG9zQ2FsY3VsYXRpb25YKHBhcmVudC5wb3NpdGlvbi5YLCAgcGFyZW50KTsgXHJcbiAgICAgICAgICAgICAgICBweSA9IFBhcmVudFBvc0NhbGN1bGF0aW9uWShwYXJlbnQucG9zaXRpb24uWSwgIHBhcmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChvYmouX3BhcmVudCAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBwMnggPSBQYXJlbnRQb3NDYWxjdWxhdGlvblgob2JqLnBvc2l0aW9uLlgsIG9iaik7XHJcbiAgICAgICAgICAgICAgICBwMnkgPSBQYXJlbnRQb3NDYWxjdWxhdGlvblkob2JqLnBvc2l0aW9uLlksIG9iaik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvcmVhY2ggKENvbXBvbmVudCBjcCBpbiBvYmouY29tcG9uZW50cy5WYWx1ZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjcC5HZXRUeXBlKCkgPT0gdHlwZW9mKENvbGxpc2lvbikpIHtcclxuICAgICAgICAgICAgICAgICAgICBDb2xsaXNpb24gYyA9IChDb2xsaXNpb24pY3A7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yZWFjaCAoVmVjdG9yNCBiIGluIF9ib3hlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JlYWNoIChWZWN0b3I0IGIyIGluIGMuX2JveGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYi5YICsgcHggPCBiMi5YICsgcDJ4ICsgYjIuWiAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYi5YICsgYi5aICsgcHggPiBiMi5YICsgcDJ4ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiLlkgKyBweSA8IGIyLlkgKyBiMi5XICsgcDJ5ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiLlcgKyBiLlkgKyBweSAgPiBiMi5ZICsgcDJ5ICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBib29sIEhpdFRlc3RQb2ludChmbG9hdCB4LGZsb2F0IHkpIHtcclxuXHJcbiAgICAgICAgICAgIGZsb2F0IHB4ID0gcGFyZW50LnBvc2l0aW9uLlg7XHJcbiAgICAgICAgICAgIGZsb2F0IHB5ID0gcGFyZW50LnBvc2l0aW9uLlk7XHJcblxyXG4gICAgICAgICAgICBpZiAocGFyZW50Ll9wYXJlbnQgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcHggPSBQYXJlbnRQb3NDYWxjdWxhdGlvblgocGFyZW50LnBvc2l0aW9uLlgsIHBhcmVudCk7XHJcbiAgICAgICAgICAgICAgICBweSA9IFBhcmVudFBvc0NhbGN1bGF0aW9uWChwYXJlbnQucG9zaXRpb24uWSwgcGFyZW50KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yZWFjaCAoVmVjdG9yNCBiIGluIF9ib3hlcylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKHggPCBiLlggKyBweCArIGIuWiAmJlxyXG4gICAgICAgICAgICAgICAgICAgeCA+IGIuWCArIHB4ICYmXHJcbiAgICAgICAgICAgICAgICAgICB5IDwgYi5ZICsgcHkgKyBiLlcgJiZcclxuICAgICAgICAgICAgICAgICAgIHkgPiBiLlkgKyBweSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuQ29tcG9uZW50c1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgTW92ZW1lbnQgOiBDb21wb25lbnRcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgTW92ZW1lbnQoR2FtZU9iamVjdCBfcGFyZW50KSA6IGJhc2UoX3BhcmVudClcclxuICAgICAgICB7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBNb3ZlVG93YXJkKGZsb2F0IHgsIGZsb2F0IHksIGZsb2F0IHNwZWVkKSB7XHJcbiAgICAgICAgICAgIGZsb2F0IGR4ID0geCAtIHBhcmVudC5wb3NpdGlvbi5YO1xyXG4gICAgICAgICAgICBmbG9hdCBkeSA9IHkgLSBwYXJlbnQucG9zaXRpb24uWTtcclxuICAgICAgICAgICAgZmxvYXQgYW5nbGUgPSAoZmxvYXQpTWF0aC5BdGFuMihkeSwgZHgpO1xyXG5cclxuICAgICAgICAgICAgcGFyZW50LnBvc2l0aW9uLlggKz0gc3BlZWQgKiAoZmxvYXQpTWF0aC5Db3MoYW5nbGUpO1xyXG4gICAgICAgICAgICBwYXJlbnQucG9zaXRpb24uWSArPSBzcGVlZCAqIChmbG9hdClNYXRoLlNpbihhbmdsZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBMb29rQXQoZmxvYXQgeCxmbG9hdCB5KSB7XHJcbiAgICAgICAgICAgIGZsb2F0IHgyID0gcGFyZW50LnBvc2l0aW9uLlggLSB4O1xyXG4gICAgICAgICAgICBmbG9hdCB5MiA9IHkgLSBwYXJlbnQucG9zaXRpb24uWTtcclxuICAgICAgICAgICAgZmxvYXQgYW5nbGUgPSAoZmxvYXQpTWF0aC5BdGFuMih4MiwgeTIpO1xyXG4gICAgICAgICAgICBwYXJlbnQuYW5nbGUgPSBhbmdsZSAqIChmbG9hdCkoMTgwL01hdGguUEkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HcmFwaGljcztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkNvbXBvbmVudHM7XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0c1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgU3ByaXRlIDogR2FtZU9iamVjdFxyXG4gICAge1xyXG4gICAgICAgIC8vQ29uc3RydWN0b3JcclxuICAgICAgICBwdWJsaWMgU3ByaXRlKFZlY3RvcjIgX3Bvc2l0aW9uLCBWZWN0b3IyIF9zaXplLCBVbmlvbjxIVE1MQ2FudmFzRWxlbWVudCwgSW1hZ2U+IF9pbWFnZSkge1xyXG4gICAgICAgICAgICBwb3NpdGlvbiA9IF9wb3NpdGlvbjtcclxuICAgICAgICAgICAgc2l6ZSA9IF9zaXplO1xyXG4gICAgICAgICAgICBpbWFnZSA9IF9pbWFnZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl0KfQo=
