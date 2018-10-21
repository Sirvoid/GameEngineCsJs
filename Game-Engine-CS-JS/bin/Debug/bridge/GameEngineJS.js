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
            Add$1: function (obj, parent) {
                var $t;
                $t = Bridge.getEnumerator(obj.layers.getValues(), GameEngineJS.GameObjects.TileMap.Layer);
                try {
                    while ($t.moveNext()) {
                        var l = $t.Current;
                        this.AddAt(l, parent, l.index);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            },
            Add: function (obj, parent) {
                this.list.add(obj);
                obj._parent = parent;
            },
            AddAt: function (obj, parent, index) {
                this.list.insert((index | 0), obj);
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
                this.OnKeyPressEvents(e.key);
            },
            DoKeyDown: function (e) {
                if (Bridge.staticEquals(this.OnKeyDownEvents, null)) {
                    return;
                }
                this.OnKeyDownEvents(e.key);
            },
            DoKeyUp: function (e) {
                if (Bridge.staticEquals(this.OnKeyUpEvents, null)) {
                    return;
                }
                this.OnKeyUpEvents(e.key);
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
            AddChild$1: function (obj) {
                this._displayList.Add$1(obj, null);
            },
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
            AddChild$1: function (tileMap) {
                this.displayList.Add$1(tileMap, this);
            },
            AddChild: function (obj) {
                this.displayList.Add(obj, this);
            }
        }
    });

    Bridge.define("GameEngineJS.GameObjects.TileMap.TileMap", {
        fields: {
            layers: null,
            _tileSheet: null,
            _size: null,
            position: null
        },
        ctors: {
            ctor: function (tileSheet, pos, size) {
                this.$initialize();
                this.layers = new (System.Collections.Generic.Dictionary$2(System.String,GameEngineJS.GameObjects.TileMap.Layer))();
                this._tileSheet = tileSheet;
                this.position = pos;
                this._size = size;
            }
        },
        methods: {
            AddLayer: function (name, index) {
                this.layers.set(name, new GameEngineJS.GameObjects.TileMap.Layer(index, this));
            },
            RemoveLayer: function (name) {
                this.layers.set(name, null);
            },
            SetTile: function (layer, pos, tile) {
                this.layers.get(layer).SetTile(((pos.X) >>> 0), ((pos.Y) >>> 0), tile, false);
            },
            GetTile: function (layer, pos) {
                return this.layers.get(layer).GetTile(((pos.X) >>> 0), ((pos.Y) >>> 0));
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

                if (img == null) {
                    return;
                }

                if (img.spriteSizeX != null && img.spriteSizeY != null) {
                    var img2 = Bridge.cast(img, GameEngineJS.Graphics.SpriteSheet);
                    if (img2.data.width === 0) {
                        return;
                    }
                    sx = System.Int64.toNumber((System.Int64(img2.currentIndex).mod((System.Int64(img2.data.width).div(System.Int64(img2.spriteSizeX))))).mul(System.Int64(img2.spriteSizeX)));
                    sy = Math.floor(img2.currentIndex / (img2.data.width / img2.spriteSizeX)) * img2.spriteSizeY;
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

    Bridge.define("GameEngineJS.Maths.Vector2I", {
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
            playing: false,
            lastTimeFrame: 0
        },
        ctors: {
            init: function () {
                this.currentAnimation = "";
                this.currentFrame = 0;
                this.fps = 1;
                this.playing = false;
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
                this.playing = true;
            },
            GotoAndStop: function (animationName) {
                this.GotoAndStop$1(animationName, 0);
            },
            GotoAndStop$1: function (animationName, frame) {
                this.currentAnimation = animationName;
                this.currentFrame = frame;

                if (!(this._animations.get(this.currentAnimation).getItem(this.currentFrame) >= 0)) {
                    this.parent.image = this._animations.get(this.currentAnimation).getItem(this.currentFrame);
                } else {
                    var sheet = this.parent.image;
                    sheet.currentIndex = this._animations.get(this.currentAnimation).getItem(this.currentFrame);
                }

                this.playing = false;
            },
            Stop: function () {
                this.playing = false;
            },
            Start: function () {
                this.playing = true;
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
                if (!this.playing) {
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

    Bridge.define("GameEngineJS.GameObjects.TileMap.Layer", {
        inherits: [GameEngineJS.GameObjects.GameObject],
        fields: {
            index: 0,
            data: null,
            _tilesW: 0,
            _tilesH: 0,
            _sizeX: 0,
            _sizeY: 0,
            _sheet: null
        },
        ctors: {
            ctor: function (_index, tileMap) {
                this.$initialize();
                GameEngineJS.GameObjects.GameObject.ctor.call(this);
                this.index = _index;
                this._tilesW = tileMap._tileSheet.spriteSizeX;
                this._tilesH = tileMap._tileSheet.spriteSizeY;
                this._sizeX = (tileMap._size.X) >>> 0;
                this._sizeY = (tileMap._size.Y) >>> 0;
                this.data = System.Array.create(0, null, System.Int32, this._sizeX, this._sizeY);

                for (var y = 0; y < this._sizeY; y = (y + 1) >>> 0) {
                    for (var x = 0; x < this._sizeX; x = (x + 1) >>> 0) {
                        this.data.set([x, y], -1);
                    }
                }

                this.position = tileMap.position;
                this.size = new GameEngineJS.Maths.Vector2(Bridge.Int.umul(this._sizeX, this._tilesW), Bridge.Int.umul(this._sizeY, this._tilesH));

                var canvas = Bridge.cast(document.createElement("canvas"), HTMLCanvasElement);
                canvas.width = Bridge.Int.clip32(Math.floor(this.size.X));
                canvas.height = Bridge.Int.clip32(Math.floor(this.size.Y));
                this.image = canvas;

                this._sheet = tileMap._tileSheet;
                this._sheet.data.onload = Bridge.fn.combine(this._sheet.data.onload, Bridge.fn.cacheBind(this, this.Construct));

            }
        },
        methods: {
            Construct: function (e) {
                for (var y = 0; y < this._sizeY; y = (y + 1) >>> 0) {
                    for (var x = 0; x < this._sizeX; x = (x + 1) >>> 0) {
                        this.SetTile(x, y, this.data.get([x, y]), true);
                    }
                }
            },
            SetTile: function (x, y, tile, byPassOld) {
                if (!(x >= 0 && x <= this._sizeX && y >= 0 && y <= this._sizeY)) {
                    return;
                }
                var oldTile = this.data.get([x, y]);

                var canvas = this.image;
                var ctx = canvas.getContext("2d");

                if (tile === -1 && oldTile !== -1) {
                    this.data.set([x, y], tile);
                    ctx.clearRect(Bridge.Int.umul(x, this._tilesW), Bridge.Int.umul(y, this._tilesH), this._tilesW, this._tilesH);
                    return;
                }
                if (tile === -1) {
                    return;
                }
                if (oldTile !== tile || byPassOld) {
                    this.data.set([x, y], tile);

                    if (this.image == null) {
                        return;
                    }
                    var case_x = System.Int64.toNumber(System.Int64(this.data.get([x, y])).mod(System.Int64(this._sizeX)).mul(System.Int64(this._tilesW)));
                    var case_y = Math.floor(this.data.get([x, y]) / this._sizeX) * this._tilesH;

                    ctx.drawImage(this._sheet.data, case_x, case_y, this._tilesW, this._tilesH, Bridge.Int.umul(x, this._tilesW), Bridge.Int.umul(y, this._tilesH), this._tilesW, this._tilesH);
                }

            },
            GetTile: function (x, y) {
                return this.data.get([x, y]);
            }
        }
    });
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJHYW1lRW5naW5lSlMuanMiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbIkNvbXBvbmVudHMvQ29tcG9uZW50LmNzIiwiQ29tcG9uZW50cy9Db21wb25lbnRSZWFkZXIuY3MiLCJEaXNwbGF5L0NhbWVyYS5jcyIsIkRpc3BsYXkvRGlzcGxheUxpc3QuY3MiLCJEaXNwbGF5L1NjZW5lLmNzIiwiRXZlbnRzL0tleUJvYXJkRXZlbnQuY3MiLCJHYW1lLmNzIiwiR2FtZU9iamVjdHMvR2FtZU9iamVjdC5jcyIsIkdhbWVPYmplY3RzL1RpbGVNYXAvVGlsZU1hcC5jcyIsIkdyYXBoaWNzL0RyYXdlci5jcyIsIkdyYXBoaWNzL0ltYWdlLmNzIiwiR3JhcGhpY3MvU3ByaXRlU2hlZXQuY3MiLCJNYXRocy9WZWN0b3IyLmNzIiwiTWF0aHMvVmVjdG9yMkkuY3MiLCJNYXRocy9WZWN0b3I0LmNzIiwiU3lzdGVtL01vdXNlLmNzIiwiU3lzdGVtL1NjaGVkdWxlci5jcyIsIkNvbXBvbmVudHMvQW5pbWF0b3IuY3MiLCJDb21wb25lbnRzL0NvbGxpc2lvbi5jcyIsIkNvbXBvbmVudHMvTW92ZW1lbnQuY3MiLCJHYW1lT2JqZWN0cy9TcHJpdGUuY3MiLCJHYW1lT2JqZWN0cy9UaWxlTWFwL0xheWVyLmNzIl0sCiAgIm5hbWVzIjogWyIiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7OzRCQVEyQkE7O2dCQUNmQSxjQUFTQTs7Ozs7Ozs7Ozs7Ozs0QkNFWUE7O2dCQUNyQkEsbUJBQWNBOzs7Ozs7Z0JBSWRBLDBCQUEyQkE7Ozs7d0JBQ3ZCQSwyQkFBc0RBOzs7O2dDQUVsREE7Ozs7Ozs7d0JBRUpBLHFCQUFnQkE7Ozs7Ozs7O3VDQUlLQTs7Z0JBQ3pCQSxJQUFJQTtvQkFBNkJBOztnQkFDakNBLDBCQUE0QkE7Ozs7d0JBRXhCQSwyQkFBc0RBOzs7O2dDQUVsREE7Ozs7Ozs7d0JBRUpBLHFCQUFnQkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0JDbkJwQkEsZ0JBQVdBLElBQUlBO2dCQUNmQTs7OEJBR1VBLFdBQWtCQTs7Z0JBQzVCQSxnQkFBV0E7Z0JBQ1hBLGdCQUFXQTs7Ozs7Ozs7Ozs7NEJDVWdDQSxLQUFJQTs7Ozs2QkFqQm5DQSxLQUFhQTs7Z0JBQ3pCQSxLQUFvQkE7Ozs7d0JBQ2hCQSxXQUFNQSxHQUFFQSxRQUFPQTs7Ozs7Ozs7MkJBSVBBLEtBQWVBO2dCQUMzQkEsY0FBU0E7Z0JBQ1RBLGNBQWNBOzs2QkFHQUEsS0FBZUEsUUFBbUJBO2dCQUNoREEsaUJBQVlBLENBQUtBLFlBQU9BOzs7Ozs7Ozs7Ozs7Ozs7NEJDSGZBLFNBQW9CQSxVQUFnQkE7O2dCQUM3Q0EsY0FBU0EsSUFBSUE7Z0JBQ2JBLHdCQUFtQkE7Z0JBQ25CQSxlQUFVQSx1QkFBMENBLGFBQVlBO2dCQUNoRUEsZUFBVUEsSUFBSUEsNkJBQU9BO2dCQUNyQkEsY0FBU0E7Z0JBQ1RBLGFBQVFBLElBQUlBLDBCQUFNQTs7Ozs7O2dCQUlsQkEsd0JBQW1CQTtnQkFDbkJBLDBCQUEyQkE7Ozs7d0JBQ3ZCQSxvQkFBYUEsaUJBQWlCQSx3QkFBbUJBLGlCQUFpQkEsd0JBQW1CQSxZQUFZQSxZQUFZQSxXQUFXQTt3QkFDeEhBLGVBQVVBLEtBQUlBLGdCQUFlQSxnQkFBZUE7Ozs7Ozs7O2lDQUk3QkEsS0FBZUEsR0FBUUEsR0FBUUE7O2dCQUNsREEsMEJBQTRCQTs7Ozt3QkFFeEJBLFdBQWFBLElBQUlBLEFBQU9BLENBQUNBLFNBQVNBLFlBQVVBLGtCQUFnQkEsa0JBQWtCQTt3QkFDOUVBLFdBQWFBLElBQUlBLEFBQU9BLENBQUNBLFNBQVNBLFlBQVVBLGtCQUFnQkEsa0JBQWtCQTt3QkFDOUVBLGVBQWlCQSxhQUFhQTs7d0JBRTlCQSxvQkFBYUEsTUFBTUEsTUFBTUEsYUFBYUEsYUFBYUEsVUFBVUE7d0JBQzdEQSxlQUFVQSxNQUFLQSxNQUFLQSxNQUFLQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2dCQzVCN0JBLDBCQUEwQkEsWUFBb0JBLEFBQW1EQTtnQkFDakdBLDBCQUEwQkEsV0FBbUJBLEFBQW1EQTtnQkFDaEdBLDBCQUEwQkEsU0FBaUJBLEFBQW1EQTs7OztrQ0FHMUVBO2dCQUNwQkEsSUFBSUEsMkNBQW9CQTtvQkFBTUE7O2dCQUM5QkEsc0JBQXdCQTs7aUNBR0xBO2dCQUVuQkEsSUFBSUEsMENBQW1CQTtvQkFBTUE7O2dCQUM3QkEscUJBQXVCQTs7K0JBR05BO2dCQUVqQkEsSUFBSUEsd0NBQWlCQTtvQkFBTUE7O2dCQUMzQkEsbUJBQXFCQTs7Ozs7Ozs7Ozs7Ozs7OztvQkNwQkVBLE9BQU9BOzs7Ozs0QkFLdEJBO29EQUF3QkE7OzhCQUN4QkEsVUFBZ0JBOztnQkFDeEJBLG9CQUFlQSxJQUFJQTtnQkFDbkJBLGFBQVFBLElBQUlBLDJCQUFNQSxtQkFBYUEsVUFBU0E7Z0JBQ3hDQSx3QkFBbUJBLElBQUlBLHdDQUFnQkE7OztnQkFHdkNBLGlCQUFZQSxJQUFJQTtnQkFDaEJBLG1CQUFjQSxBQUF1QkE7Z0JBQ3JDQSxtQkFBY0EsQUFBdUJBOzs7O2tDQUdwQkE7Z0JBRWpCQSx3QkFBaUJBLEtBQUtBOztnQ0FFTEE7Z0JBQ2pCQSxzQkFBaUJBLEtBQUlBOzs7Ozs7Ozs7Ozs7Ozs7OztrQ0NyQnlCQSxLQUFJQTttQ0FDbkJBLElBQUlBOzs7O29DQUlUQSxjQUFxQkE7Z0JBRS9DQSxvQkFBV0EsY0FBZ0JBO2dCQUMzQkEsT0FBT0Esb0JBQVdBOztrQ0FHREE7Z0JBQ2pCQSx1QkFBZ0JBLFNBQVNBOztnQ0FHUkE7Z0JBQ2pCQSxxQkFBZ0JBLEtBQUlBOzs7Ozs7Ozs7Ozs7OzRCQ2ZUQSxXQUF1QkEsS0FBYUE7O2dCQUMvQ0EsY0FBU0EsS0FBSUE7Z0JBQ2JBLGtCQUFhQTtnQkFDYkEsZ0JBQVdBO2dCQUNYQSxhQUFRQTs7OztnQ0FHU0EsTUFBWUE7Z0JBQzdCQSxnQkFBT0EsTUFBUUEsSUFBSUEsdUNBQU1BLE9BQU9BOzttQ0FHWkE7Z0JBQ3BCQSxnQkFBT0EsTUFBUUE7OytCQUdDQSxPQUFjQSxLQUFjQTtnQkFDNUNBLGdCQUFPQSxlQUFlQSxFQUFNQSxlQUFPQSxFQUFNQSxlQUFPQTs7K0JBR2pDQSxPQUFjQTtnQkFDN0JBLE9BQU9BLGdCQUFPQSxlQUFlQSxFQUFNQSxlQUFPQSxFQUFNQTs7Ozs7Ozs7Ozs7NEJDNUJ0Q0E7O2dCQUNWQSxZQUFPQSxBQUEwQkE7Z0JBQ2pDQSxlQUFVQTs7OztrQ0FHU0E7Z0JBQ25CQSxzQkFBaUJBO2dCQUNqQkEseUJBQWtCQSxvQkFBY0E7OzRCQUUzQkEsR0FBU0EsR0FBU0EsR0FBU0EsR0FBU0E7Z0JBRWpEQSxZQUFLQSxHQUFHQSxHQUFHQSxHQUFHQSxNQUFNQTs7OEJBQ0VBLEdBQVNBLEdBQVNBLEdBQVNBLEdBQVNBLEdBQVNBLEtBQWFBLFFBQWFBO2dCQUNyRkE7Z0JBQ0FBLG9DQUErQkE7Z0JBQy9CQTs7Z0JBRUFBO2dCQUNBQTtnQkFDQUEsU0FBV0E7Z0JBQ1hBLFNBQVdBOztnQkFFWEEsSUFBSUEsT0FBT0E7b0JBQU1BOzs7Z0JBRWpCQSxJQUFJQSxtQkFBbUJBLFFBQVFBLG1CQUFtQkE7b0JBQzlDQSxXQUFtQkEsWUFBYUE7b0JBQ2hDQSxJQUFJQTt3QkFBc0JBOztvQkFDMUJBLEtBQUtBLHVCQUFDQSxvQ0FBb0JBLENBQUNBLGtDQUFrQkEsdUNBQXFCQTtvQkFDbEVBLEtBQUtBLEFBQU9BLFdBQVdBLG9CQUFvQkEsQ0FBQ0EsQUFBUUEsa0JBQWtCQSxxQkFBcUJBO29CQUMzRkEsS0FBS0E7b0JBQ0xBLEtBQUtBOzs7Z0JBR1RBLElBQUlBLFlBQVlBO29CQUVaQSxNQUFNQTs7O2dCQUlWQSxTQUFXQSxJQUFJQSxDQUFDQTtnQkFDaEJBLFNBQVdBLElBQUlBLENBQUNBOztnQkFFaEJBLG9CQUFlQSxJQUFJQTtnQkFDbkJBLGlCQUFZQSxDQUFDQSxLQUFLQTtnQkFDbEJBLG9CQUFlQSxDQUFDQSxJQUFJQSxDQUFDQTs7Z0JBR3JCQSxvQkFBZUEsS0FBS0EsSUFBSUEsSUFBSUEsSUFBSUEsSUFBSUEsR0FBR0EsR0FBR0EsR0FBR0E7O2dCQUU3Q0E7Ozs7Ozs7Ozs7OEJDakRTQTs7Z0JBQ1RBLFlBQU9BO2dCQUNQQSxnQkFBV0E7Ozs0QkFJRkE7O2dCQUVUQSxZQUFPQTs7Ozs7Ozs7Ozs7Ozs0QkNSUUEsS0FBWUEsY0FBbUJBOztnQkFFOUNBLFlBQU9BO2dCQUNQQSxnQkFBV0E7Z0JBQ1hBLG1CQUFjQTtnQkFDZEEsbUJBQWNBOzs7Ozs7Ozs7Ozs0QkNOSEEsSUFBV0E7O2dCQUN0QkEsU0FBSUE7Z0JBQ0pBLFNBQUlBOzs7Ozs7Ozs7Ozs0QkNBUUEsSUFBUUE7O2dCQUVwQkEsU0FBSUE7Z0JBQ0pBLFNBQUlBOzs7Ozs7Ozs7Ozs7OzRCQ0hPQSxJQUFVQSxJQUFVQSxJQUFVQTs7Z0JBRXpDQSxTQUFJQTtnQkFDSkEsU0FBSUE7Z0JBQ0pBLFNBQUlBO2dCQUNKQSxTQUFJQTs7Ozs7Ozs7Ozs7Ozs7Ozs0QkNQT0E7O2dCQUNYQSxlQUFVQTtnQkFDVkEsdUNBQXNDQSxBQUFtREE7Ozs7OEJBR3pFQTtnQkFFaEJBLFdBQWtCQTtnQkFDbEJBLFNBQUlBLFlBQTZCQSxBQUFPQTtnQkFDeENBLFNBQUlBLFlBQTZCQSxBQUFPQTs7Ozs7Ozs7Ozs7bUNDVlRBLEtBQUlBOzs7O2dCQUduQ0E7Ozs7MkJBR1lBO2dCQUNaQSxxQkFBZ0JBLEFBQXdCQTtvQkFBTUE7Ozs7O2dCQUs5Q0EsMEJBQXFCQTs7Ozt3QkFDakJBOzs7Ozs7OztnQkFHSkEsNkJBQTZCQSxBQUF1QkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzRCQ1B4Q0E7O2tFQUEwQkE7Z0JBRXRDQSxtQkFBY0EsS0FBSUE7Ozs7bUNBRU5BO2dCQUVwQkEsbUJBQVlBOztxQ0FDaUJBLGVBQXNCQTtnQkFDM0NBLHdCQUFtQkE7Z0JBQ25CQSxvQkFBZUE7Z0JBQ2ZBOzttQ0FFWUE7Z0JBRXBCQSxtQkFBWUE7O3FDQUNpQkEsZUFBc0JBO2dCQUUzQ0Esd0JBQW1CQTtnQkFDbkJBLG9CQUFlQTs7Z0JBRWZBLElBQUlBLENBQUNBLENBQUNBLEFBQU1BLHFCQUFZQSwrQkFBa0JBO29CQUV0Q0Esb0JBQWVBLEFBQU9BLHFCQUFZQSwrQkFBa0JBOztvQkFHcERBLFlBQW9CQSxBQUFhQTtvQkFDakNBLHFCQUFxQkEsQUFBTUEscUJBQVlBLCtCQUFrQkE7OztnQkFHN0RBOzs7Z0JBSUFBOzs7Z0JBSUFBOztnQ0FHZUEsZUFBc0JBO2dCQUNyQ0EsUUFBNkJBLEtBQUlBO2dCQUNqQ0EsSUFBSUE7Z0JBQ0pBLFlBQU9BLGVBQWVBOztnQ0FFUEEsZUFBc0JBO2dCQUVyQ0EsUUFBNkJBLEtBQUlBO2dCQUNqQ0EsSUFBSUE7Z0JBQ0pBLFlBQU9BLGVBQWVBOzs4QkFFUEEsZUFBc0JBO2dCQUNyQ0EscUJBQVlBLGVBQWlCQTs7O2dCQUk3QkEsSUFBSUEsQ0FBQ0E7b0JBQVNBOzs7Z0JBRWRBLFVBQWFBLGdEQUFzQkE7Z0JBQ25DQSxZQUFlQSxNQUFNQTtnQkFDckJBLElBQUlBLFFBQVFBLHVCQUFLQTtvQkFDYkE7b0JBQ0FBLElBQUlBLHFCQUFnQkEscUJBQVlBO3dCQUM1QkE7OztvQkFHSkEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQUFBTUEscUJBQVlBLCtCQUFrQkE7d0JBRXRDQSxvQkFBZUEsQUFBT0EscUJBQVlBLCtCQUFrQkE7O3dCQUdwREEsWUFBb0JBLEFBQWFBO3dCQUNqQ0EscUJBQXFCQSxBQUFNQSxxQkFBWUEsK0JBQWtCQTs7O29CQUc3REEscUJBQWdCQTs7Ozs7Ozs7Ozs7Ozs0QkNsRlBBOztrRUFBMkJBO2dCQUV4Q0EsY0FBU0EsS0FBSUE7Ozs7OEJBR0VBLElBQVNBLElBQVVBLE9BQWFBO2dCQUMvQ0EsZ0JBQVdBLElBQUlBLDJCQUFRQSxJQUFHQSxJQUFHQSxPQUFNQTs7NkNBR0hBLEdBQVNBO2dCQUN6Q0E7Z0JBQ0FBOztnQkFFQUEsSUFBSUEsa0JBQWtCQTtvQkFDbEJBLFNBQVNBLDJCQUFzQkEsbUJBQW1CQTtvQkFDbERBLGNBQWNBLEFBQU9BLENBQUNBLFNBQVNBLHVCQUF1QkEsa0JBQWtCQTs7O2dCQUc1RUEsSUFBSUEsa0JBQWtCQTtvQkFBTUEsVUFBVUE7OztnQkFFdENBLE9BQVFBLFNBQVNBOzs2Q0FHZUEsR0FBU0E7Z0JBRXpDQTtnQkFDQUE7O2dCQUVBQSxJQUFJQSxrQkFBa0JBO29CQUVsQkEsU0FBU0EsMkJBQXNCQSxtQkFBbUJBO29CQUNsREEsY0FBY0EsQUFBT0EsQ0FBQ0EsU0FBU0EsdUJBQXVCQSxrQkFBa0JBOzs7Z0JBRzVFQSxJQUFJQSxrQkFBa0JBO29CQUFNQSxVQUFVQTs7O2dCQUV0Q0EsT0FBT0EsU0FBU0E7O3FDQUdNQTs7O2dCQUV0QkEsU0FBV0E7Z0JBQ1hBLFNBQVdBO2dCQUNYQSxVQUFZQTtnQkFDWkEsVUFBWUE7O2dCQUVaQSxJQUFJQSx1QkFBa0JBO29CQUNsQkEsS0FBS0EsMkJBQXNCQSx3QkFBb0JBO29CQUMvQ0EsS0FBS0EsMkJBQXNCQSx3QkFBb0JBOzs7Z0JBR25EQSxJQUFJQSxlQUFlQTtvQkFFZkEsTUFBTUEsMkJBQXNCQSxnQkFBZ0JBO29CQUM1Q0EsTUFBTUEsMkJBQXNCQSxnQkFBZ0JBOzs7Z0JBR2hEQSxLQUF5QkE7Ozs7d0JBQ3JCQSxJQUFJQSwyQ0FBZ0JBLEFBQU9BOzRCQUN2QkEsUUFBY0EsWUFBV0E7NEJBQ3pCQSwyQkFBc0JBOzs7O29DQUNsQkEsMkJBQXVCQTs7Ozs0Q0FDbkJBLElBQUlBLE1BQU1BLEtBQUtBLE9BQU9BLE1BQU1BLFFBQ3pCQSxNQUFNQSxNQUFNQSxLQUFLQSxPQUFPQSxPQUN4QkEsTUFBTUEsS0FBS0EsT0FBT0EsT0FBT0EsT0FDekJBLE1BQU1BLE1BQU1BLEtBQU1BLE9BQU9BO2dEQUN4QkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztnQkFNcEJBOztvQ0FHcUJBLEdBQVFBOzs7Z0JBRTdCQSxTQUFXQTtnQkFDWEEsU0FBV0E7O2dCQUVYQSxJQUFJQSx1QkFBa0JBO29CQUVsQkEsS0FBS0EsMkJBQXNCQSx3QkFBbUJBO29CQUM5Q0EsS0FBS0EsMkJBQXNCQSx3QkFBbUJBOzs7Z0JBR2xEQSwwQkFBc0JBOzs7O3dCQUVsQkEsSUFBSUEsSUFBSUEsTUFBTUEsS0FBS0EsT0FDaEJBLElBQUlBLE1BQU1BLE1BQ1ZBLElBQUlBLE1BQU1BLEtBQUtBLE9BQ2ZBLElBQUlBLE1BQU1BOzRCQUNUQTs7Ozs7Ozs7Z0JBR1JBOzs7Ozs7Ozs0QkNwR1lBOztrRUFBMkJBOzs7O2tDQUlwQkEsR0FBU0EsR0FBU0E7O2dCQUNyQ0EsU0FBV0EsSUFBSUE7Z0JBQ2ZBLFNBQVdBLElBQUlBO2dCQUNmQSxZQUFjQSxBQUFPQSxXQUFXQSxJQUFJQTs7Z0JBRXBDQTt3QkFBcUJBLFFBQVFBLEFBQU9BLFNBQVNBO2dCQUM3Q0E7eUJBQXFCQSxRQUFRQSxBQUFPQSxTQUFTQTs7OEJBRzlCQSxHQUFRQTtnQkFDdkJBLFNBQVdBLHlCQUFvQkE7Z0JBQy9CQSxTQUFXQSxJQUFJQTtnQkFDZkEsWUFBY0EsQUFBT0EsV0FBV0EsSUFBSUE7Z0JBQ3BDQSxvQkFBZUEsUUFBUUE7Ozs7Ozs7OzRCQ1hiQSxXQUFtQkEsT0FBZUE7OztnQkFDNUNBLGdCQUFXQTtnQkFDWEEsWUFBT0E7Z0JBQ1BBLGFBQVFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs0QkNJQ0EsUUFBYUE7OztnQkFDdEJBLGFBQVFBO2dCQUNSQSxlQUFVQTtnQkFDVkEsZUFBVUE7Z0JBQ1ZBLGNBQVNBLENBQU1BO2dCQUNmQSxjQUFTQSxDQUFNQTtnQkFDZkEsWUFBT0EsMkNBQVFBLGFBQVFBOztnQkFFdkJBLEtBQUtBLFdBQVlBLElBQUlBLGFBQVFBO29CQUN6QkEsS0FBS0EsV0FBWUEsSUFBSUEsYUFBUUE7d0JBQ3pCQSxlQUFLQSxHQUFHQSxJQUFLQTs7OztnQkFJckJBLGdCQUFXQTtnQkFDWEEsWUFBT0EsSUFBSUEsMkJBQVFBLDZCQUFTQSxlQUFTQSw2QkFBU0E7O2dCQUU5Q0EsYUFBMkJBLFlBQW1CQTtnQkFDOUNBLGVBQWVBLGtCQUFLQSxXQUFXQTtnQkFDL0JBLGdCQUFnQkEsa0JBQUtBLFdBQVdBO2dCQUNoQ0EsYUFBUUE7O2dCQUVSQSxjQUFTQTtnQkFDVEEscUVBQXNCQTs7Ozs7aUNBSUhBO2dCQUNuQkEsS0FBS0EsV0FBWUEsSUFBSUEsYUFBUUE7b0JBQ3pCQSxLQUFLQSxXQUFZQSxJQUFJQSxhQUFRQTt3QkFDekJBLGFBQVFBLEdBQUVBLEdBQUVBLGVBQUtBLEdBQUVBOzs7OytCQUtUQSxHQUFRQSxHQUFRQSxNQUFVQTtnQkFDNUNBLElBQUlBLENBQUNBLENBQUNBLFVBQVVBLEtBQUtBLGVBQVVBLFVBQVVBLEtBQUtBO29CQUFTQTs7Z0JBQ3ZEQSxjQUFjQSxlQUFLQSxHQUFHQTs7Z0JBRXRCQSxhQUEyQkEsQUFBbUJBO2dCQUM5Q0EsVUFBK0JBLEFBQTBCQTs7Z0JBRXpEQSxJQUFJQSxTQUFRQSxNQUFNQSxZQUFXQTtvQkFDekJBLGVBQUtBLEdBQUdBLElBQUtBO29CQUNiQSxjQUFjQSxtQkFBRUEsZUFBUUEsbUJBQUVBLGVBQVFBLGNBQVFBO29CQUMxQ0E7O2dCQUVKQSxJQUFJQSxTQUFRQTtvQkFBSUE7O2dCQUNoQkEsSUFBR0EsWUFBV0EsUUFBUUE7b0JBQ2xCQSxlQUFLQSxHQUFHQSxJQUFLQTs7b0JBRWJBLElBQUlBLGNBQVNBO3dCQUFNQTs7b0JBQ25CQSxhQUFlQSxrREFBS0EsR0FBR0EsU0FBS0EsK0JBQVNBO29CQUNyQ0EsYUFBZUEsQUFBT0EsV0FBV0EsQUFBT0EsZUFBS0EsR0FBR0EsTUFBS0EsZUFBVUE7O29CQUUvREEsY0FBY0Esa0JBQWFBLFFBQVFBLFFBQVFBLGNBQVNBLGNBQVNBLG1CQUFJQSxlQUFTQSxtQkFBSUEsZUFBU0EsY0FBU0E7Ozs7K0JBS25GQSxHQUFRQTtnQkFDekJBLE9BQU9BLGVBQUtBLEdBQUdBIiwKICAic291cmNlc0NvbnRlbnQiOiBbInVzaW5nIFN5c3RlbTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5Db21wb25lbnRzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBDb21wb25lbnRcclxuICAgIHtcclxuICAgICAgICBpbnRlcm5hbCBHYW1lT2JqZWN0IHBhcmVudCB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgaW50ZXJuYWwgQ29tcG9uZW50KEdhbWVPYmplY3QgX3BhcmVudCkge1xyXG4gICAgICAgICAgICBwYXJlbnQgPSBfcGFyZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW50ZXJuYWwgdmlydHVhbCB2b2lkIFVwZGF0ZSgpIHt9XHJcblxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5EaXNwbGF5O1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHM7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkNvbXBvbmVudHNcclxue1xyXG4gICAgaW50ZXJuYWwgY2xhc3MgQ29tcG9uZW50UmVhZGVyXHJcbiAgICB7XHJcbiAgICAgICAgaW50ZXJuYWwgRGlzcGxheUxpc3QgZGlzcGxheUxpc3QgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBpbnRlcm5hbCBDb21wb25lbnRSZWFkZXIoRGlzcGxheUxpc3QgbGlzdCkge1xyXG4gICAgICAgICAgICBkaXNwbGF5TGlzdCA9IGxpc3Q7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnRlcm5hbCB2b2lkIHVwZGF0ZSgpIHtcclxuICAgICAgICAgICAgZm9yZWFjaCAoR2FtZU9iamVjdCBvYmogaW4gZGlzcGxheUxpc3QubGlzdCkge1xyXG4gICAgICAgICAgICAgICAgZm9yZWFjaCAoS2V5VmFsdWVQYWlyPHN0cmluZywgQ29tcG9uZW50PiBjb21wb25lbnQgaW4gb2JqLmNvbXBvbmVudHMpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LlZhbHVlLlVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVjdXJzaXZlVXBkYXRlKG9iaik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCByZWN1cnNpdmVVcGRhdGUoR2FtZU9iamVjdCBvYmopIHtcclxuICAgICAgICAgICAgaWYgKGRpc3BsYXlMaXN0Lmxpc3QuQ291bnQgPD0gMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBmb3JlYWNoIChHYW1lT2JqZWN0IG9iajIgaW4gb2JqLmRpc3BsYXlMaXN0Lmxpc3QpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZvcmVhY2ggKEtleVZhbHVlUGFpcjxzdHJpbmcsIENvbXBvbmVudD4gY29tcG9uZW50IGluIG9iajIuY29tcG9uZW50cylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuVmFsdWUuVXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZWN1cnNpdmVVcGRhdGUob2JqMik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5NYXRocztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuRGlzcGxheVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgQ2FtZXJhXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIFZlY3RvcjIgcG9zaXRpb24geyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCByb3RhdGlvbiB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBDYW1lcmEoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcG9zaXRpb24gPSBuZXcgVmVjdG9yMigwLDApO1xyXG4gICAgICAgICAgICByb3RhdGlvbiA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgQ2FtZXJhKFZlY3RvcjIgX3Bvc2l0aW9uLGZsb2F0IF9yb3RhdGlvbikge1xyXG4gICAgICAgICAgICBwb3NpdGlvbiA9IF9wb3NpdGlvbjtcclxuICAgICAgICAgICAgcm90YXRpb24gPSBfcm90YXRpb247XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cy5UaWxlTWFwO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5EaXNwbGF5XHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBEaXNwbGF5TGlzdFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBMaXN0PEdhbWVPYmplY3Q+IGxpc3QgeyBnZXQ7IHNldDsgfSAgXHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZChUaWxlTWFwIG9iaiwgR2FtZU9iamVjdCBwYXJlbnQpIHtcclxuICAgICAgICAgICAgZm9yZWFjaCAoTGF5ZXIgbCBpbiBvYmoubGF5ZXJzLlZhbHVlcykge1xyXG4gICAgICAgICAgICAgICAgQWRkQXQobCxwYXJlbnQsbC5pbmRleCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZChHYW1lT2JqZWN0IG9iaixHYW1lT2JqZWN0IHBhcmVudCkge1xyXG4gICAgICAgICAgICBsaXN0LkFkZChvYmopO1xyXG4gICAgICAgICAgICBvYmouX3BhcmVudCA9IHBhcmVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZEF0KEdhbWVPYmplY3Qgb2JqLEdhbWVPYmplY3QgcGFyZW50LCB1aW50IGluZGV4KSB7XHJcbiAgICAgICAgICAgIGxpc3QuSW5zZXJ0KChpbnQpaW5kZXgsIG9iaik7XHJcbiAgICAgICAgfVxyXG5cblxyXG4gICAgXG5wcml2YXRlIExpc3Q8R2FtZU9iamVjdD4gX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX2xpc3Q9bmV3IExpc3Q8R2FtZU9iamVjdD4oKSA7fVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR3JhcGhpY3M7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5NYXRocztcclxudXNpbmcgR2FtZUVuZ2luZUpTLlN5c3RlbTtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuRGlzcGxheVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgU2NlbmVcclxuICAgIHtcclxuXHJcbiAgICAgICAgcHVibGljIENhbWVyYSBjYW1lcmEgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwcml2YXRlIERpc3BsYXlMaXN0IF9tYWluRGlzcGxheUxpc3Q7XHJcbiAgICAgICAgcHJpdmF0ZSBEcmF3ZXIgX2RyYXdlcjtcclxuICAgICAgICBwcml2YXRlIEhUTUxDYW52YXNFbGVtZW50IF9jYW52YXM7XHJcbiAgICAgICAgcHJpdmF0ZSBzdHJpbmcgX2NvbG9yO1xyXG4gICAgICAgIHB1YmxpYyBNb3VzZSBtb3VzZSB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBTY2VuZShEaXNwbGF5TGlzdCBvYmpMaXN0LHN0cmluZyBjYW52YXNJRCxzdHJpbmcgY29sb3IpIHtcclxuICAgICAgICAgICAgY2FtZXJhID0gbmV3IENhbWVyYSgpO1xyXG4gICAgICAgICAgICBfbWFpbkRpc3BsYXlMaXN0ID0gb2JqTGlzdDtcclxuICAgICAgICAgICAgX2NhbnZhcyA9IERvY3VtZW50LlF1ZXJ5U2VsZWN0b3I8SFRNTENhbnZhc0VsZW1lbnQ+KFwiY2FudmFzI1wiICsgY2FudmFzSUQpO1xyXG4gICAgICAgICAgICBfZHJhd2VyID0gbmV3IERyYXdlcihfY2FudmFzKTtcclxuICAgICAgICAgICAgX2NvbG9yID0gY29sb3I7XHJcbiAgICAgICAgICAgIG1vdXNlID0gbmV3IE1vdXNlKF9jYW52YXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgUmVmcmVzaCgpIHtcclxuICAgICAgICAgICAgX2RyYXdlci5GaWxsU2NyZWVuKF9jb2xvcik7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKEdhbWVPYmplY3Qgb2JqIGluIF9tYWluRGlzcGxheUxpc3QubGlzdCkge1xyXG4gICAgICAgICAgICAgICAgX2RyYXdlci5EcmF3KG9iai5wb3NpdGlvbi5YIC0gY2FtZXJhLnBvc2l0aW9uLlgsIG9iai5wb3NpdGlvbi5ZIC0gY2FtZXJhLnBvc2l0aW9uLlksIG9iai5zaXplLlgsIG9iai5zaXplLlksIG9iai5hbmdsZSwgb2JqLmltYWdlLGZhbHNlLDEpO1xyXG4gICAgICAgICAgICAgICAgRHJhd0NoaWxkKG9iaixvYmoucG9zaXRpb24uWCxvYmoucG9zaXRpb24uWSxvYmouYW5nbGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgRHJhd0NoaWxkKEdhbWVPYmplY3Qgb2JqLGZsb2F0IHgsZmxvYXQgeSxmbG9hdCBhbmdsZSkge1xyXG4gICAgICAgICAgICBmb3JlYWNoIChHYW1lT2JqZWN0IG9iajIgaW4gb2JqLmRpc3BsYXlMaXN0Lmxpc3QpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZsb2F0IG5ld1ggPSB4ICsgKGZsb2F0KShNYXRoLkNvcyhvYmouYW5nbGUqTWF0aC5QSS8xODApKSAqIG9iajIucG9zaXRpb24uWCAtIGNhbWVyYS5wb3NpdGlvbi5YO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQgbmV3WSA9IHkgKyAoZmxvYXQpKE1hdGguU2luKG9iai5hbmdsZSpNYXRoLlBJLzE4MCkpICogb2JqMi5wb3NpdGlvbi5ZIC0gY2FtZXJhLnBvc2l0aW9uLlk7XHJcbiAgICAgICAgICAgICAgICBmbG9hdCBuZXdBbmdsZSA9IG9iajIuYW5nbGUgKyBhbmdsZTtcclxuXHJcbiAgICAgICAgICAgICAgICBfZHJhd2VyLkRyYXcobmV3WCwgbmV3WSwgb2JqMi5zaXplLlgsIG9iajIuc2l6ZS5ZLCBuZXdBbmdsZSwgb2JqMi5pbWFnZSwgZmFsc2UsIDEpO1xyXG4gICAgICAgICAgICAgICAgRHJhd0NoaWxkKG9iajIsbmV3WCxuZXdZLG5ld0FuZ2xlKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkV2ZW50c1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgS2V5Qm9hcmRFdmVudFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBkZWxlZ2F0ZSB2b2lkIEtleVByZXNzRXZlbnQoc3RyaW5nIGtleSk7XHJcbiAgICAgICAgcHVibGljIGV2ZW50IEtleVByZXNzRXZlbnQgT25LZXlQcmVzc0V2ZW50cztcclxuXHJcbiAgICAgICAgcHVibGljIGRlbGVnYXRlIHZvaWQgS2V5RG93bkV2ZW50KHN0cmluZyBrZXkpO1xyXG4gICAgICAgIHB1YmxpYyBldmVudCBLZXlEb3duRXZlbnQgT25LZXlEb3duRXZlbnRzO1xyXG5cclxuICAgICAgICBwdWJsaWMgZGVsZWdhdGUgdm9pZCBLZXlVcEV2ZW50KHN0cmluZyBrZXkpO1xyXG4gICAgICAgIHB1YmxpYyBldmVudCBLZXlVcEV2ZW50IE9uS2V5VXBFdmVudHM7XHJcblxyXG4gICAgICAgIHB1YmxpYyBLZXlCb2FyZEV2ZW50KCkge1xyXG4gICAgICAgICAgICBEb2N1bWVudC5BZGRFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5LZXlQcmVzcywgKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxnbG9iYWw6OkJyaWRnZS5IdG1sNS5FdmVudD4pRG9LZXlQcmVzcyk7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkFkZEV2ZW50TGlzdGVuZXIoRXZlbnRUeXBlLktleURvd24sIChnbG9iYWw6OlN5c3RlbS5BY3Rpb248Z2xvYmFsOjpCcmlkZ2UuSHRtbDUuRXZlbnQ+KURvS2V5RG93bik7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkFkZEV2ZW50TGlzdGVuZXIoRXZlbnRUeXBlLktleVVwLCAoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6QnJpZGdlLkh0bWw1LkV2ZW50PilEb0tleVVwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBEb0tleVByZXNzKEV2ZW50IGUpIHtcclxuICAgICAgICAgICAgaWYgKE9uS2V5UHJlc3NFdmVudHMgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBPbktleVByZXNzRXZlbnRzLkludm9rZShlLkFzPEtleWJvYXJkRXZlbnQ+KCkuS2V5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBEb0tleURvd24oRXZlbnQgZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChPbktleURvd25FdmVudHMgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBPbktleURvd25FdmVudHMuSW52b2tlKGUuQXM8S2V5Ym9hcmRFdmVudD4oKS5LZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIERvS2V5VXAoRXZlbnQgZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChPbktleVVwRXZlbnRzID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgT25LZXlVcEV2ZW50cy5JbnZva2UoZS5BczxLZXlib2FyZEV2ZW50PigpLktleSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBHYW1lRW5naW5lSlMuR3JhcGhpY3M7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5TeXN0ZW07XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkRpc3BsYXk7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5Db21wb25lbnRzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHMuVGlsZU1hcDtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEdhbWVcclxuICAgIHtcclxuICAgICAgICBcclxuICAgICAgICBwdWJsaWMgRHJhd2VyIGRyYXdlciB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIFNjaGVkdWxlciBzY2hlZHVsZXIgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBTY2VuZSBzY2VuZSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIE1vdXNlIG1vdXNlIHsgZ2V0IHsgcmV0dXJuIHNjZW5lLm1vdXNlOyB9IH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBEaXNwbGF5TGlzdCBfZGlzcGxheUxpc3Q7XHJcbiAgICAgICAgcHJpdmF0ZSBDb21wb25lbnRSZWFkZXIgX2NvbXBvbmVudFJlYWRlcjtcclxuXHJcbiAgICAgICAgcHVibGljIEdhbWUoc3RyaW5nIGNhbnZhc0lEKSA6IHRoaXMoY2FudmFzSUQsIFwiI2ZmZlwiKSB7IH1cclxuICAgICAgICBwdWJsaWMgR2FtZShzdHJpbmcgY2FudmFzSUQsc3RyaW5nIGNvbG9yKSB7XHJcbiAgICAgICAgICAgIF9kaXNwbGF5TGlzdCA9IG5ldyBEaXNwbGF5TGlzdCgpO1xyXG4gICAgICAgICAgICBzY2VuZSA9IG5ldyBTY2VuZShfZGlzcGxheUxpc3QsY2FudmFzSUQsY29sb3IpO1xyXG4gICAgICAgICAgICBfY29tcG9uZW50UmVhZGVyID0gbmV3IENvbXBvbmVudFJlYWRlcihfZGlzcGxheUxpc3QpO1xyXG4gICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIHNjaGVkdWxlciA9IG5ldyBTY2hlZHVsZXIoKTtcclxuICAgICAgICAgICAgc2NoZWR1bGVyLkFkZCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uKXNjZW5lLlJlZnJlc2gpO1xyXG4gICAgICAgICAgICBzY2hlZHVsZXIuQWRkKChnbG9iYWw6OlN5c3RlbS5BY3Rpb24pX2NvbXBvbmVudFJlYWRlci51cGRhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkQ2hpbGQoVGlsZU1hcCBvYmopXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBfZGlzcGxheUxpc3QuQWRkKG9iaiwgbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZENoaWxkKEdhbWVPYmplY3Qgb2JqKSB7XHJcbiAgICAgICAgICAgIF9kaXNwbGF5TGlzdC5BZGQob2JqLG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HcmFwaGljcztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkNvbXBvbmVudHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5EaXNwbGF5O1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cy5UaWxlTWFwO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHNcclxue1xyXG4gICAgcHVibGljIGFic3RyYWN0IGNsYXNzIEdhbWVPYmplY3RcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgVmVjdG9yMiBwb3NpdGlvbiB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIFZlY3RvcjIgc2l6ZSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IGFuZ2xlIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgVW5pb248SFRNTENhbnZhc0VsZW1lbnQsIEltYWdlLCBTcHJpdGVTaGVldD4gaW1hZ2UgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBEaWN0aW9uYXJ5PHN0cmluZywgQ29tcG9uZW50PiBjb21wb25lbnRzID0gbmV3IERpY3Rpb25hcnk8c3RyaW5nLCBDb21wb25lbnQ+KCk7XHJcbiAgICAgICAgaW50ZXJuYWwgRGlzcGxheUxpc3QgZGlzcGxheUxpc3QgPSBuZXcgRGlzcGxheUxpc3QoKTtcclxuICAgICAgICBpbnRlcm5hbCBHYW1lT2JqZWN0IF9wYXJlbnQ7XHJcblxyXG4gICAgICAgIC8vUHVibGljIE1ldGhvZHNcclxuICAgICAgICBwdWJsaWMgQ29tcG9uZW50IEFkZENvbXBvbmVudChzdHJpbmcgaW5zdGFuY2VOYW1lLCBDb21wb25lbnQgY29tcG9uZW50KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29tcG9uZW50c1tpbnN0YW5jZU5hbWVdID0gY29tcG9uZW50O1xyXG4gICAgICAgICAgICByZXR1cm4gY29tcG9uZW50c1tpbnN0YW5jZU5hbWVdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkQ2hpbGQoVGlsZU1hcC5UaWxlTWFwIHRpbGVNYXApIHtcclxuICAgICAgICAgICAgZGlzcGxheUxpc3QuQWRkKHRpbGVNYXAsIHRoaXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkQ2hpbGQoR2FtZU9iamVjdCBvYmopIHtcclxuICAgICAgICAgICAgZGlzcGxheUxpc3QuQWRkKG9iaix0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzLlRpbGVNYXBcclxue1xyXG5cclxuICAgIHB1YmxpYyBjbGFzcyBUaWxlTWFwXHJcbiAgICB7XHJcbiAgICAgICAgaW50ZXJuYWwgRGljdGlvbmFyeTxzdHJpbmcsIExheWVyPiBsYXllcnMgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIGludGVybmFsIFNwcml0ZVNoZWV0IF90aWxlU2hlZXQ7XHJcblxyXG4gICAgICAgIGludGVybmFsIFZlY3RvcjJJIF9zaXplO1xyXG5cclxuICAgICAgICBwdWJsaWMgVmVjdG9yMiBwb3NpdGlvbiB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBUaWxlTWFwKFNwcml0ZVNoZWV0IHRpbGVTaGVldCwgVmVjdG9yMiBwb3MsIFZlY3RvcjJJIHNpemUpIHtcclxuICAgICAgICAgICAgbGF5ZXJzID0gbmV3IERpY3Rpb25hcnk8c3RyaW5nLCBMYXllcj4oKTtcclxuICAgICAgICAgICAgX3RpbGVTaGVldCA9IHRpbGVTaGVldDtcclxuICAgICAgICAgICAgcG9zaXRpb24gPSBwb3M7XHJcbiAgICAgICAgICAgIF9zaXplID0gc2l6ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZExheWVyKHN0cmluZyBuYW1lLHVpbnQgaW5kZXgpIHtcclxuICAgICAgICAgICAgbGF5ZXJzW25hbWVdID0gbmV3IExheWVyKGluZGV4LCB0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFJlbW92ZUxheWVyKHN0cmluZyBuYW1lKSB7XHJcbiAgICAgICAgICAgIGxheWVyc1tuYW1lXSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBTZXRUaWxlKHN0cmluZyBsYXllciwgVmVjdG9yMkkgcG9zLCBpbnQgdGlsZSkge1xyXG4gICAgICAgICAgICBsYXllcnNbbGF5ZXJdLlNldFRpbGUoKHVpbnQpcG9zLlgsICh1aW50KXBvcy5ZLCB0aWxlLGZhbHNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBpbnQgR2V0VGlsZShzdHJpbmcgbGF5ZXIsIFZlY3RvcjJJIHBvcykge1xyXG4gICAgICAgICAgICByZXR1cm4gbGF5ZXJzW2xheWVyXS5HZXRUaWxlKCh1aW50KXBvcy5YLCAodWludClwb3MuWSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkdyYXBoaWNzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBEcmF3ZXJcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBfY3R4O1xyXG4gICAgICAgIHByaXZhdGUgSFRNTENhbnZhc0VsZW1lbnQgX2NhbnZhcztcclxuXHJcbiAgICAgICAgcHVibGljIERyYXdlcihIVE1MQ2FudmFzRWxlbWVudCBjYW52YXMpIHtcclxuICAgICAgICAgICAgX2N0eCA9IChDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpY2FudmFzLkdldENvbnRleHQoXCIyZFwiKTtcclxuICAgICAgICAgICAgX2NhbnZhcyA9IGNhbnZhcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEZpbGxTY3JlZW4oc3RyaW5nIGNvbG9yKSB7XHJcbiAgICAgICAgICAgIF9jdHguRmlsbFN0eWxlID0gY29sb3I7XHJcbiAgICAgICAgICAgIF9jdHguRmlsbFJlY3QoMCwwLF9jYW52YXMuV2lkdGgsX2NhbnZhcy5IZWlnaHQpO1xyXG4gICAgICAgIH1cclxucHVibGljIHZvaWQgRHJhdyhmbG9hdCB4LCBmbG9hdCB5LCBmbG9hdCB3LCBmbG9hdCBoLCBkeW5hbWljIGltZylcclxue1xyXG4gICAgRHJhdyh4LCB5LCB3LCBoLCAwLCBpbWcsIGZhbHNlLCAxKTtcclxufSAgICAgICAgcHVibGljIHZvaWQgRHJhdyhmbG9hdCB4LCBmbG9hdCB5LCBmbG9hdCB3LCBmbG9hdCBoLCBmbG9hdCByLCBkeW5hbWljIGltZywgYm9vbCBmb2xsb3csIGZsb2F0IGFscGhhKSB7XHJcbiAgICAgICAgICAgIF9jdHguSW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIF9jYW52YXMuU3R5bGUuSW1hZ2VSZW5kZXJpbmcgPSBJbWFnZVJlbmRlcmluZy5QaXhlbGF0ZWQ7XHJcbiAgICAgICAgICAgIF9jdHguU2F2ZSgpO1xyXG5cclxuICAgICAgICAgICAgZmxvYXQgc3ggPSAwO1xyXG4gICAgICAgICAgICBmbG9hdCBzeSA9IDA7XHJcbiAgICAgICAgICAgIGZsb2F0IHN3ID0gdztcclxuICAgICAgICAgICAgZmxvYXQgc2ggPSBoO1xyXG5cclxuICAgICAgICAgICAgaWYgKGltZyA9PSBudWxsKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBpZiAoaW1nLnNwcml0ZVNpemVYICE9IG51bGwgJiYgaW1nLnNwcml0ZVNpemVZICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIFNwcml0ZVNoZWV0IGltZzIgPSAoU3ByaXRlU2hlZXQpaW1nO1xyXG4gICAgICAgICAgICAgICAgaWYgKGltZzIuZGF0YS5XaWR0aCA9PSAwKSByZXR1cm47IFxyXG4gICAgICAgICAgICAgICAgc3ggPSAoaW1nMi5jdXJyZW50SW5kZXggJSAoaW1nMi5kYXRhLldpZHRoIC8gaW1nMi5zcHJpdGVTaXplWCkpICogaW1nMi5zcHJpdGVTaXplWDtcclxuICAgICAgICAgICAgICAgIHN5ID0gKGZsb2F0KU1hdGguRmxvb3IoaW1nMi5jdXJyZW50SW5kZXggLyAoKGRvdWJsZSlpbWcyLmRhdGEuV2lkdGggLyBpbWcyLnNwcml0ZVNpemVYKSkgKiBpbWcyLnNwcml0ZVNpemVZO1xyXG4gICAgICAgICAgICAgICAgc3cgPSBpbWcyLnNwcml0ZVNpemVYO1xyXG4gICAgICAgICAgICAgICAgc2ggPSBpbWcyLnNwcml0ZVNpemVZO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaW1nLmRhdGEgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaW1nID0gaW1nLmRhdGE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vT2JqZWN0IFJvdGF0aW9uXHJcbiAgICAgICAgICAgIGZsb2F0IG94ID0geCArICh3IC8gMik7XHJcbiAgICAgICAgICAgIGZsb2F0IG95ID0geSArIChoIC8gMik7XHJcblxyXG4gICAgICAgICAgICBfY3R4LlRyYW5zbGF0ZShveCwgb3kpO1xyXG4gICAgICAgICAgICBfY3R4LlJvdGF0ZSgocikgKiBNYXRoLlBJIC8gMTgwKTsgLy9kZWdyZWVcclxuICAgICAgICAgICAgX2N0eC5UcmFuc2xhdGUoLW94LCAtb3kpO1xyXG4gICAgICAgICAgICAvLy0tLS0tLS1cclxuXHJcbiAgICAgICAgICAgIF9jdHguRHJhd0ltYWdlKGltZywgc3gsIHN5LCBzdywgc2gsIHgsIHksIHcsIGgpO1xyXG5cclxuICAgICAgICAgICAgX2N0eC5SZXN0b3JlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxuXHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkdyYXBoaWNzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBJbWFnZVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBIVE1MSW1hZ2VFbGVtZW50IGRhdGEgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgSW1hZ2Uoc3RyaW5nIHNyYykge1xyXG4gICAgICAgICAgICBkYXRhID0gbmV3IEhUTUxJbWFnZUVsZW1lbnQoKTtcclxuICAgICAgICAgICAgZGF0YS5TcmMgPSBzcmM7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIEltYWdlKEhUTUxJbWFnZUVsZW1lbnQgaW1nKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZGF0YSA9IGltZztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkdyYXBoaWNzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBTcHJpdGVTaGVldFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBIVE1MSW1hZ2VFbGVtZW50IGRhdGEgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyB1aW50IHNwcml0ZVNpemVYIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgdWludCBzcHJpdGVTaXplWSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIHVpbnQgY3VycmVudEluZGV4IHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIFNwcml0ZVNoZWV0KHN0cmluZyBzcmMsIHVpbnQgX3Nwcml0ZVNpemVYLCB1aW50IF9zcHJpdGVTaXplWSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGRhdGEgPSBuZXcgSFRNTEltYWdlRWxlbWVudCgpO1xyXG4gICAgICAgICAgICBkYXRhLlNyYyA9IHNyYztcclxuICAgICAgICAgICAgc3ByaXRlU2l6ZVggPSBfc3ByaXRlU2l6ZVg7XHJcbiAgICAgICAgICAgIHNwcml0ZVNpemVZID0gX3Nwcml0ZVNpemVZO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5NYXRoc1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgVmVjdG9yMlxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBYIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgWSB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyKGZsb2F0IF94ICwgZmxvYXQgX3kpIHtcclxuICAgICAgICAgICAgWCA9IF94O1xyXG4gICAgICAgICAgICBZID0gX3k7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuTWF0aHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFZlY3RvcjJJXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIGludCBYIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgaW50IFkgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgVmVjdG9yMkkoaW50IF94LCBpbnQgX3kpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBYID0gX3g7XHJcbiAgICAgICAgICAgIFkgPSBfeTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuTWF0aHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFZlY3RvcjRcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgWCB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IFkgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBaIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgVyB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBWZWN0b3I0KGZsb2F0IF94LCBmbG9hdCBfeSwgZmxvYXQgX3osIGZsb2F0IF93KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgWCA9IF94O1xyXG4gICAgICAgICAgICBZID0gX3k7XHJcbiAgICAgICAgICAgIFogPSBfejtcclxuICAgICAgICAgICAgVyA9IF93O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuU3lzdGVtXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBNb3VzZVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCB4IHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgeSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHJpdmF0ZSBIVE1MQ2FudmFzRWxlbWVudCBfY2FudmFzO1xyXG5cclxuICAgICAgICBpbnRlcm5hbCBNb3VzZShIVE1MQ2FudmFzRWxlbWVudCBjYW52YXMpIHtcclxuICAgICAgICAgICAgX2NhbnZhcyA9IGNhbnZhcztcclxuICAgICAgICAgICAgRG9jdW1lbnQuQWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLChnbG9iYWw6OlN5c3RlbS5BY3Rpb248Z2xvYmFsOjpCcmlkZ2UuSHRtbDUuRXZlbnQ+KVVwZGF0ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgVXBkYXRlKEV2ZW50IGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBDbGllbnRSZWN0IHJlY3QgPSBfY2FudmFzLkdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgICAgICB4ID0gZS5BczxNb3VzZUV2ZW50PigpLkNsaWVudFggLSAoZmxvYXQpcmVjdC5MZWZ0O1xyXG4gICAgICAgICAgICB5ID0gZS5BczxNb3VzZUV2ZW50PigpLkNsaWVudFkgLSAoZmxvYXQpcmVjdC5Ub3A7XHJcbiAgICAgICAgfVxyXG5cbiAgICBcbnByaXZhdGUgZmxvYXQgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX3g9MDtwcml2YXRlIGZsb2F0IF9fUHJvcGVydHlfX0luaXRpYWxpemVyX195PTA7fVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLlN5c3RlbVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgU2NoZWR1bGVyXHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSBMaXN0PEFjdGlvbj4gX2FjdGlvbkxpc3QgPSBuZXcgTGlzdDxBY3Rpb24+KCk7XHJcblxyXG4gICAgICAgIGludGVybmFsIFNjaGVkdWxlcigpIHtcclxuICAgICAgICAgICAgVXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBBZGQoQWN0aW9uIG1ldGhvZHMpIHtcclxuICAgICAgICAgICAgX2FjdGlvbkxpc3QuQWRkKChnbG9iYWw6OlN5c3RlbS5BY3Rpb24pKCgpID0+IG1ldGhvZHMoKSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgVXBkYXRlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKEFjdGlvbiBhIGluIF9hY3Rpb25MaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBhKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIFdpbmRvdy5SZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKGdsb2JhbDo6U3lzdGVtLkFjdGlvbilVcGRhdGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HcmFwaGljcztcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkNvbXBvbmVudHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEFuaW1hdG9yIDogQ29tcG9uZW50XHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSBEaWN0aW9uYXJ5PHN0cmluZywgTGlzdDxVbmlvbjxJbWFnZSwgdWludD4+PiBfYW5pbWF0aW9ucyB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIHN0cmluZyBjdXJyZW50QW5pbWF0aW9uIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgaW50IGN1cnJlbnRGcmFtZSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGludCBmcHMgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgYm9vbCBwbGF5aW5nIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG4gICAgICAgIHByaXZhdGUgZG91YmxlIGxhc3RUaW1lRnJhbWUgPSAwO1xyXG5cclxuICAgICAgICBwdWJsaWMgQW5pbWF0b3IoR2FtZU9iamVjdCBwYXJlbnQpIDogYmFzZShwYXJlbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBfYW5pbWF0aW9ucyA9IG5ldyBEaWN0aW9uYXJ5PHN0cmluZywgTGlzdDxVbmlvbjxJbWFnZSwgdWludD4+PigpO1xyXG4gICAgICAgIH1cclxucHVibGljIHZvaWQgR290b0FuZFBsYXkoc3RyaW5nIGFuaW1hdGlvbk5hbWUpXHJcbntcclxuICAgIEdvdG9BbmRQbGF5KGFuaW1hdGlvbk5hbWUsIDApO1xyXG59ICAgICAgICBwdWJsaWMgdm9pZCBHb3RvQW5kUGxheShzdHJpbmcgYW5pbWF0aW9uTmFtZSwgaW50IGZyYW1lKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRBbmltYXRpb24gPSBhbmltYXRpb25OYW1lO1xyXG4gICAgICAgICAgICBjdXJyZW50RnJhbWUgPSBmcmFtZTtcclxuICAgICAgICAgICAgcGxheWluZyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgdm9pZCBHb3RvQW5kU3RvcChzdHJpbmcgYW5pbWF0aW9uTmFtZSlcclxue1xyXG4gICAgR290b0FuZFN0b3AoYW5pbWF0aW9uTmFtZSwgMCk7XHJcbn0gICAgICAgIHB1YmxpYyB2b2lkIEdvdG9BbmRTdG9wKHN0cmluZyBhbmltYXRpb25OYW1lLCBpbnQgZnJhbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjdXJyZW50QW5pbWF0aW9uID0gYW5pbWF0aW9uTmFtZTtcclxuICAgICAgICAgICAgY3VycmVudEZyYW1lID0gZnJhbWU7XHJcblxyXG4gICAgICAgICAgICBpZiAoISgodWludClfYW5pbWF0aW9uc1tjdXJyZW50QW5pbWF0aW9uXVtjdXJyZW50RnJhbWVdID49IDApKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnQuaW1hZ2UgPSAoSW1hZ2UpX2FuaW1hdGlvbnNbY3VycmVudEFuaW1hdGlvbl1bY3VycmVudEZyYW1lXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIFNwcml0ZVNoZWV0IHNoZWV0ID0gKFNwcml0ZVNoZWV0KXBhcmVudC5pbWFnZTtcclxuICAgICAgICAgICAgICAgIHNoZWV0LmN1cnJlbnRJbmRleCA9ICh1aW50KV9hbmltYXRpb25zW2N1cnJlbnRBbmltYXRpb25dW2N1cnJlbnRGcmFtZV07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHBsYXlpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0b3AoKSB7XHJcbiAgICAgICAgICAgIHBsYXlpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0YXJ0KCkge1xyXG4gICAgICAgICAgICBwbGF5aW5nID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIENyZWF0ZShzdHJpbmcgYW5pbWF0aW9uTmFtZSwgTGlzdDx1aW50PiBsaXN0KSB7XHJcbiAgICAgICAgICAgIExpc3Q8VW5pb248SW1hZ2UsIHVpbnQ+PiB0ID0gbmV3IExpc3Q8VW5pb248SW1hZ2UsIHVpbnQ+PigpO1xyXG4gICAgICAgICAgICB0ID0gbGlzdC5BczxMaXN0PFVuaW9uPEltYWdlLCB1aW50Pj4+KCk7XHJcbiAgICAgICAgICAgIENyZWF0ZShhbmltYXRpb25OYW1lLCB0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgQ3JlYXRlKHN0cmluZyBhbmltYXRpb25OYW1lLCBMaXN0PEltYWdlPiBsaXN0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgTGlzdDxVbmlvbjxJbWFnZSwgdWludD4+IHQgPSBuZXcgTGlzdDxVbmlvbjxJbWFnZSwgdWludD4+KCk7XHJcbiAgICAgICAgICAgIHQgPSBsaXN0LkFzPExpc3Q8VW5pb248SW1hZ2UsIHVpbnQ+Pj4oKTtcclxuICAgICAgICAgICAgQ3JlYXRlKGFuaW1hdGlvbk5hbWUsIHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBDcmVhdGUoc3RyaW5nIGFuaW1hdGlvbk5hbWUsIExpc3Q8VW5pb248SW1hZ2UsIHVpbnQ+PiBsaXN0KXtcclxuICAgICAgICAgICAgX2FuaW1hdGlvbnNbYW5pbWF0aW9uTmFtZV0gPSBsaXN0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW50ZXJuYWwgb3ZlcnJpZGUgdm9pZCBVcGRhdGUoKSB7XHJcbiAgICAgICAgICAgIGlmICghcGxheWluZykgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgZG91YmxlIG5vdyA9IERhdGVUaW1lLk5vdy5TdWJ0cmFjdChEYXRlVGltZS5NaW5WYWx1ZS5BZGRZZWFycygyMDE3KSkuVG90YWxNaWxsaXNlY29uZHM7XHJcbiAgICAgICAgICAgIGRvdWJsZSBkZWx0YSA9IG5vdyAtIGxhc3RUaW1lRnJhbWU7XHJcbiAgICAgICAgICAgIGlmIChkZWx0YSA+IDEwMDAvZnBzKSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50RnJhbWUrKztcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50RnJhbWUgPj0gX2FuaW1hdGlvbnNbY3VycmVudEFuaW1hdGlvbl0uQ291bnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50RnJhbWUgPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICghKCh1aW50KV9hbmltYXRpb25zW2N1cnJlbnRBbmltYXRpb25dW2N1cnJlbnRGcmFtZV0gPj0gMCkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50LmltYWdlID0gKEltYWdlKV9hbmltYXRpb25zW2N1cnJlbnRBbmltYXRpb25dW2N1cnJlbnRGcmFtZV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBTcHJpdGVTaGVldCBzaGVldCA9IChTcHJpdGVTaGVldClwYXJlbnQuaW1hZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hlZXQuY3VycmVudEluZGV4ID0gKHVpbnQpX2FuaW1hdGlvbnNbY3VycmVudEFuaW1hdGlvbl1bY3VycmVudEZyYW1lXTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBsYXN0VGltZUZyYW1lID0gbm93O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXG5cclxuICAgIFxucHJpdmF0ZSBzdHJpbmcgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX2N1cnJlbnRBbmltYXRpb249XCJcIjtwcml2YXRlIGludCBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fY3VycmVudEZyYW1lPTA7cHJpdmF0ZSBpbnQgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX2Zwcz0xO3ByaXZhdGUgYm9vbCBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fcGxheWluZz1mYWxzZTt9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkNvbXBvbmVudHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIENvbGxpc2lvbiA6IENvbXBvbmVudFxyXG4gICAge1xyXG5cclxuICAgICAgICByZWFkb25seSBMaXN0PFZlY3RvcjQ+IF9ib3hlcztcclxuXHJcbiAgICAgICAgcHVibGljIENvbGxpc2lvbihHYW1lT2JqZWN0IF9wYXJlbnQpIDogYmFzZShfcGFyZW50KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgX2JveGVzID0gbmV3IExpc3Q8VmVjdG9yND4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZEJveChmbG9hdCB4MSxmbG9hdCB5MSwgZmxvYXQgd2lkdGgsIGZsb2F0IGhlaWdodCkge1xyXG4gICAgICAgICAgICBfYm94ZXMuQWRkKG5ldyBWZWN0b3I0KHgxLHkxLHdpZHRoLGhlaWdodCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBmbG9hdCBQYXJlbnRQb3NDYWxjdWxhdGlvblgoZmxvYXQgeCwgR2FtZU9iamVjdCBwYXJlbnQpIHtcclxuICAgICAgICAgICAgZmxvYXQgYWRkaW5nID0gMDtcclxuICAgICAgICAgICAgZmxvYXQgYW5nbGVBZGRpbmcgPSAwO1xyXG5cclxuICAgICAgICAgICAgaWYgKHBhcmVudC5fcGFyZW50ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGFkZGluZyA9IFBhcmVudFBvc0NhbGN1bGF0aW9uWChwYXJlbnQucG9zaXRpb24uWCwgcGFyZW50Ll9wYXJlbnQpO1xyXG4gICAgICAgICAgICAgICAgYW5nbGVBZGRpbmcgPSAoZmxvYXQpKE1hdGguQ29zKHBhcmVudC5fcGFyZW50LmFuZ2xlICogTWF0aC5QSSAvIDE4MCkpICogeDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHBhcmVudC5fcGFyZW50ID09IG51bGwpIGFkZGluZyArPSBwYXJlbnQucG9zaXRpb24uWDtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiAgYWRkaW5nICsgYW5nbGVBZGRpbmc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGZsb2F0IFBhcmVudFBvc0NhbGN1bGF0aW9uWShmbG9hdCB5LCBHYW1lT2JqZWN0IHBhcmVudClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZsb2F0IGFkZGluZyA9IDA7XHJcbiAgICAgICAgICAgIGZsb2F0IGFuZ2xlQWRkaW5nID0gMDtcclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnQuX3BhcmVudCAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBhZGRpbmcgPSBQYXJlbnRQb3NDYWxjdWxhdGlvblkocGFyZW50LnBvc2l0aW9uLlksIHBhcmVudC5fcGFyZW50KTtcclxuICAgICAgICAgICAgICAgIGFuZ2xlQWRkaW5nID0gKGZsb2F0KShNYXRoLlNpbihwYXJlbnQuX3BhcmVudC5hbmdsZSAqIE1hdGguUEkgLyAxODApKSAqIHk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnQuX3BhcmVudCA9PSBudWxsKSBhZGRpbmcgKz0gcGFyZW50LnBvc2l0aW9uLlk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYWRkaW5nICsgYW5nbGVBZGRpbmc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgYm9vbCBIaXRUZXN0T2JqZWN0KEdhbWVPYmplY3Qgb2JqKSB7XHJcblxyXG4gICAgICAgICAgICBmbG9hdCBweCA9IHBhcmVudC5wb3NpdGlvbi5YO1xyXG4gICAgICAgICAgICBmbG9hdCBweSA9IHBhcmVudC5wb3NpdGlvbi5ZO1xyXG4gICAgICAgICAgICBmbG9hdCBwMnggPSBvYmoucG9zaXRpb24uWDtcclxuICAgICAgICAgICAgZmxvYXQgcDJ5ID0gb2JqLnBvc2l0aW9uLlk7XHJcblxyXG4gICAgICAgICAgICBpZiAocGFyZW50Ll9wYXJlbnQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcHggPSBQYXJlbnRQb3NDYWxjdWxhdGlvblgocGFyZW50LnBvc2l0aW9uLlgsICBwYXJlbnQpOyBcclxuICAgICAgICAgICAgICAgIHB5ID0gUGFyZW50UG9zQ2FsY3VsYXRpb25ZKHBhcmVudC5wb3NpdGlvbi5ZLCAgcGFyZW50KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG9iai5fcGFyZW50ICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHAyeCA9IFBhcmVudFBvc0NhbGN1bGF0aW9uWChvYmoucG9zaXRpb24uWCwgb2JqKTtcclxuICAgICAgICAgICAgICAgIHAyeSA9IFBhcmVudFBvc0NhbGN1bGF0aW9uWShvYmoucG9zaXRpb24uWSwgb2JqKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yZWFjaCAoQ29tcG9uZW50IGNwIGluIG9iai5jb21wb25lbnRzLlZhbHVlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNwLkdldFR5cGUoKSA9PSB0eXBlb2YoQ29sbGlzaW9uKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIENvbGxpc2lvbiBjID0gKENvbGxpc2lvbiljcDtcclxuICAgICAgICAgICAgICAgICAgICBmb3JlYWNoIChWZWN0b3I0IGIgaW4gX2JveGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcmVhY2ggKFZlY3RvcjQgYjIgaW4gYy5fYm94ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiLlggKyBweCA8IGIyLlggKyBwMnggKyBiMi5aICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiLlggKyBiLlogKyBweCA+IGIyLlggKyBwMnggJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIuWSArIHB5IDwgYjIuWSArIGIyLlcgKyBwMnkgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIuVyArIGIuWSArIHB5ICA+IGIyLlkgKyBwMnkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGJvb2wgSGl0VGVzdFBvaW50KGZsb2F0IHgsZmxvYXQgeSkge1xyXG5cclxuICAgICAgICAgICAgZmxvYXQgcHggPSBwYXJlbnQucG9zaXRpb24uWDtcclxuICAgICAgICAgICAgZmxvYXQgcHkgPSBwYXJlbnQucG9zaXRpb24uWTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnQuX3BhcmVudCAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBweCA9IFBhcmVudFBvc0NhbGN1bGF0aW9uWChwYXJlbnQucG9zaXRpb24uWCwgcGFyZW50KTtcclxuICAgICAgICAgICAgICAgIHB5ID0gUGFyZW50UG9zQ2FsY3VsYXRpb25YKHBhcmVudC5wb3NpdGlvbi5ZLCBwYXJlbnQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3JlYWNoIChWZWN0b3I0IGIgaW4gX2JveGVzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoeCA8IGIuWCArIHB4ICsgYi5aICYmXHJcbiAgICAgICAgICAgICAgICAgICB4ID4gYi5YICsgcHggJiZcclxuICAgICAgICAgICAgICAgICAgIHkgPCBiLlkgKyBweSArIGIuVyAmJlxyXG4gICAgICAgICAgICAgICAgICAgeSA+IGIuWSArIHB5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5Db21wb25lbnRzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBNb3ZlbWVudCA6IENvbXBvbmVudFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBNb3ZlbWVudChHYW1lT2JqZWN0IF9wYXJlbnQpIDogYmFzZShfcGFyZW50KVxyXG4gICAgICAgIHtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIE1vdmVUb3dhcmQoZmxvYXQgeCwgZmxvYXQgeSwgZmxvYXQgc3BlZWQpIHtcclxuICAgICAgICAgICAgZmxvYXQgZHggPSB4IC0gcGFyZW50LnBvc2l0aW9uLlg7XHJcbiAgICAgICAgICAgIGZsb2F0IGR5ID0geSAtIHBhcmVudC5wb3NpdGlvbi5ZO1xyXG4gICAgICAgICAgICBmbG9hdCBhbmdsZSA9IChmbG9hdClNYXRoLkF0YW4yKGR5LCBkeCk7XHJcblxyXG4gICAgICAgICAgICBwYXJlbnQucG9zaXRpb24uWCArPSBzcGVlZCAqIChmbG9hdClNYXRoLkNvcyhhbmdsZSk7XHJcbiAgICAgICAgICAgIHBhcmVudC5wb3NpdGlvbi5ZICs9IHNwZWVkICogKGZsb2F0KU1hdGguU2luKGFuZ2xlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIExvb2tBdChmbG9hdCB4LGZsb2F0IHkpIHtcclxuICAgICAgICAgICAgZmxvYXQgeDIgPSBwYXJlbnQucG9zaXRpb24uWCAtIHg7XHJcbiAgICAgICAgICAgIGZsb2F0IHkyID0geSAtIHBhcmVudC5wb3NpdGlvbi5ZO1xyXG4gICAgICAgICAgICBmbG9hdCBhbmdsZSA9IChmbG9hdClNYXRoLkF0YW4yKHgyLCB5Mik7XHJcbiAgICAgICAgICAgIHBhcmVudC5hbmdsZSA9IGFuZ2xlICogKGZsb2F0KSgxODAvTWF0aC5QSSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5NYXRocztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuQ29tcG9uZW50cztcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBTcHJpdGUgOiBHYW1lT2JqZWN0XHJcbiAgICB7XHJcbiAgICAgICAgLy9Db25zdHJ1Y3RvclxyXG4gICAgICAgIHB1YmxpYyBTcHJpdGUoVmVjdG9yMiBfcG9zaXRpb24sIFZlY3RvcjIgX3NpemUsIFVuaW9uPEhUTUxDYW52YXNFbGVtZW50LCBJbWFnZSwgU3ByaXRlU2hlZXQ+IF9pbWFnZSkge1xyXG4gICAgICAgICAgICBwb3NpdGlvbiA9IF9wb3NpdGlvbjtcclxuICAgICAgICAgICAgc2l6ZSA9IF9zaXplO1xyXG4gICAgICAgICAgICBpbWFnZSA9IF9pbWFnZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzLlRpbGVNYXBcclxue1xyXG4gICAgcHVibGljIGNsYXNzIExheWVyIDogR2FtZU9iamVjdFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyB1aW50IGluZGV4IHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgaW50WyxdIGRhdGEgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHVpbnQgX3RpbGVzVztcclxuICAgICAgICBwcml2YXRlIHVpbnQgX3RpbGVzSDtcclxuICAgICAgICBwcml2YXRlIHVpbnQgX3NpemVYO1xyXG4gICAgICAgIHByaXZhdGUgdWludCBfc2l6ZVk7XHJcblxyXG4gICAgICAgIHByaXZhdGUgU3ByaXRlU2hlZXQgX3NoZWV0O1xyXG5cclxuICAgICAgICBwdWJsaWMgTGF5ZXIodWludCBfaW5kZXgsIFRpbGVNYXAgdGlsZU1hcCkge1xyXG4gICAgICAgICAgICBpbmRleCA9IF9pbmRleDtcclxuICAgICAgICAgICAgX3RpbGVzVyA9IHRpbGVNYXAuX3RpbGVTaGVldC5zcHJpdGVTaXplWDtcclxuICAgICAgICAgICAgX3RpbGVzSCA9IHRpbGVNYXAuX3RpbGVTaGVldC5zcHJpdGVTaXplWTtcclxuICAgICAgICAgICAgX3NpemVYID0gKHVpbnQpdGlsZU1hcC5fc2l6ZS5YO1xyXG4gICAgICAgICAgICBfc2l6ZVkgPSAodWludCl0aWxlTWFwLl9zaXplLlk7XHJcbiAgICAgICAgICAgIGRhdGEgPSBuZXcgaW50W19zaXplWCwgX3NpemVZXTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodWludCB5ID0gMDsgeSA8IF9zaXplWTsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHVpbnQgeCA9IDA7IHggPCBfc2l6ZVg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFbeCwgeV0gPSAtMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcG9zaXRpb24gPSB0aWxlTWFwLnBvc2l0aW9uO1xyXG4gICAgICAgICAgICBzaXplID0gbmV3IFZlY3RvcjIoX3NpemVYICogX3RpbGVzVywgX3NpemVZICogX3RpbGVzSCk7XHJcblxyXG4gICAgICAgICAgICBIVE1MQ2FudmFzRWxlbWVudCBjYW52YXMgPSAoSFRNTENhbnZhc0VsZW1lbnQpRG9jdW1lbnQuQ3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcclxuICAgICAgICAgICAgY2FudmFzLldpZHRoID0gKGludClNYXRoLkZsb29yKHNpemUuWCk7XHJcbiAgICAgICAgICAgIGNhbnZhcy5IZWlnaHQgPSAoaW50KU1hdGguRmxvb3Ioc2l6ZS5ZKTtcclxuICAgICAgICAgICAgaW1hZ2UgPSBjYW52YXM7XHJcblxyXG4gICAgICAgICAgICBfc2hlZXQgPSB0aWxlTWFwLl90aWxlU2hlZXQ7XHJcbiAgICAgICAgICAgIF9zaGVldC5kYXRhLk9uTG9hZCArPSBDb25zdHJ1Y3Q7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIENvbnN0cnVjdChFdmVudCBlKSB7XHJcbiAgICAgICAgICAgIGZvciAodWludCB5ID0gMDsgeSA8IF9zaXplWTsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHVpbnQgeCA9IDA7IHggPCBfc2l6ZVg7IHgrKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgU2V0VGlsZSh4LHksZGF0YVt4LHldLHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnRlcm5hbCB2b2lkIFNldFRpbGUodWludCB4LCB1aW50IHksIGludCB0aWxlLCBib29sIGJ5UGFzc09sZCkge1xyXG4gICAgICAgICAgICBpZiAoISh4ID49IDAgJiYgeCA8PSBfc2l6ZVggJiYgeSA+PSAwICYmIHkgPD0gX3NpemVZKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpbnQgb2xkVGlsZSA9IGRhdGFbeCwgeV07XHJcblxyXG4gICAgICAgICAgICBIVE1MQ2FudmFzRWxlbWVudCBjYW52YXMgPSAoSFRNTENhbnZhc0VsZW1lbnQpaW1hZ2U7XHJcbiAgICAgICAgICAgIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBjdHggPSAoQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKWNhbnZhcy5HZXRDb250ZXh0KFwiMmRcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAodGlsZSA9PSAtMSAmJiBvbGRUaWxlICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhW3gsIHldID0gdGlsZTtcclxuICAgICAgICAgICAgICAgIGN0eC5DbGVhclJlY3QoeCpfdGlsZXNXLHkqX3RpbGVzSCxfdGlsZXNXLF90aWxlc0gpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aWxlID09IC0xKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmKG9sZFRpbGUgIT0gdGlsZSB8fCBieVBhc3NPbGQpIHsgXHJcbiAgICAgICAgICAgICAgICBkYXRhW3gsIHldID0gdGlsZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaW1hZ2UgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQgY2FzZV94ID0gZGF0YVt4LCB5XSAlIF9zaXplWCAqIF90aWxlc1c7XHJcbiAgICAgICAgICAgICAgICBmbG9hdCBjYXNlX3kgPSAoZmxvYXQpTWF0aC5GbG9vcigoZmxvYXQpZGF0YVt4LCB5XSAvIF9zaXplWCkgKiBfdGlsZXNIO1xyXG5cclxuICAgICAgICAgICAgICAgIGN0eC5EcmF3SW1hZ2UoX3NoZWV0LmRhdGEsIGNhc2VfeCwgY2FzZV95LCBfdGlsZXNXLCBfdGlsZXNILCB4ICogX3RpbGVzVywgeSAqIF90aWxlc0gsIF90aWxlc1csIF90aWxlc0gpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW50ZXJuYWwgaW50IEdldFRpbGUodWludCB4LCB1aW50IHkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRhdGFbeCwgeV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdCn0K
