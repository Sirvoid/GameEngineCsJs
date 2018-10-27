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
                        this.AddAt(l, parent, ((l.index) | 0));
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
                this.list.insert(index, obj);
                obj._parent = parent;
            },
            Remove: function (obj) {
                this.list.remove(obj);
            },
            Move: function (obj, index) {
                var oldIndex = this.list.indexOf(obj);
                this.list.removeAt(oldIndex);
                this.list.insert(index, obj);
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
            },
            AddChildAt: function (obj, index) {
                this._displayList.AddAt(obj, null, index);
            },
            RemoveChild: function (obj) {
                this._displayList.Remove(obj);
            },
            MoveChild: function (obj, index) {
                this._displayList.Move(obj, index);
            }
        }
    });

    Bridge.define("GameEngineJS.GameObjects.GameObject", {
        statics: {
            fields: {
                IDIncrementer: 0
            },
            ctors: {
                init: function () {
                    this.IDIncrementer = 0;
                }
            }
        },
        fields: {
            position: null,
            size: null,
            angle: 0,
            ID: 0,
            image: null,
            components: null,
            displayList: null,
            _parent: null
        },
        ctors: {
            init: function () {
                var $t;
                this.ID = Bridge.identity(GameEngineJS.GameObjects.GameObject.IDIncrementer, ($t = (GameEngineJS.GameObjects.GameObject.IDIncrementer + 1) | 0, GameEngineJS.GameObjects.GameObject.IDIncrementer = $t, $t));
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
            },
            AddChildAt: function (obj, index) {
                this.displayList.AddAt(obj, this, index);
            },
            RemoveChild: function (obj) {
                this.displayList.Remove(obj);
            },
            MoveChild: function (obj, index) {
                this.displayList.Move(obj, index);
            }
        }
    });

    Bridge.define("GameEngineJS.GameObjects.TileMap.TileMap", {
        fields: {
            request: null,
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
                return this.layers.get(name);
            },
            RemoveLayer: function (name) {
                this.layers.set(name, null);
            },
            GetLayer: function (name) {
                return this.layers.get(name);
            },
            SetTile$1: function (layer, x, y, tile) {
                this.SetTile(layer, new GameEngineJS.Maths.Vector2I(x, y), tile);
            },
            SetTile: function (layer, pos, tile) {
                this.layers.get(layer).SetTile(((pos.X) >>> 0), ((pos.Y) >>> 0), tile, false);
            },
            GetTile$1: function (layer, x, y) {
                return this.GetTile(layer, new GameEngineJS.Maths.Vector2I(x, y));
            },
            GetTile: function (layer, pos) {
                return this.layers.get(layer).GetTile(((pos.X) >>> 0), ((pos.Y) >>> 0));
            },
            LoadTiledJson: function (url, numberOfLayers) {

                for (var i = 0; i < numberOfLayers; i = (i + 1) >>> 0) {
                    this.AddLayer(i + "", i);
                }

                this.request = new XMLHttpRequest();

                this.request.onload = Bridge.fn.combine(this.request.onload, Bridge.fn.cacheBind(this, this.LoadTiled));
                this.request.open("get", url);
                this.request.send();

            },
            LoadTiled: function (e) {
                var a = JSON.parse(this.request.responseText);
                this._size.X = a.width;
                this._size.Y = a.height;

                for (var i = 0; i < a.layers.length; i = (i + 1) >>> 0) {
                    var layerjs = a.layers[i];

                    var layer = this.layers.get(i + "");

                    layerjs = layerjs.data;

                    for (var j = 0; j < layerjs.length; j = (j + 1) | 0) {

                        var indexX = j % this._size.X;
                        var indexY = Bridge.Int.clip32(Math.floor(((Bridge.Int.div(j, this._size.X)) | 0)));

                        layer.SetTile((indexX >>> 0), (indexY >>> 0), ((layerjs[j] - 1) | 0), true);
                    }
                }

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
            MoveToward: function (pos, speed) {
                this.MoveToward$1(pos.X, pos.Y, speed);
            },
            MoveToward$1: function (x, y, speed) {
                var $t, $t1;
                var dx = x - this.parent.position.X;
                var dy = y - this.parent.position.Y;
                var angle = Math.atan2(dy, dx);

                $t = this.parent.position;
                $t.X += speed * Math.cos(angle);
                $t1 = this.parent.position;
                $t1.Y += speed * Math.sin(angle);
            },
            LookAt: function (pos) {
                this.LookAt$1(pos.X, pos.Y);
            },
            LookAt$1: function (x, y) {
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

                for (var i = 0; System.Int64(i).lt(System.Int64(this._sizeX)); i = (i + 1) | 0) {
                    for (var j = 0; System.Int64(j).lt(System.Int64(this._sizeY)); j = (j + 1) | 0) {
                        this.data.set([i, j], -1);
                    }
                }

                this.position = tileMap.position;
                this.size = new GameEngineJS.Maths.Vector2(Bridge.Int.umul(this._sizeX, this._tilesW), Bridge.Int.umul(this._sizeY, this._tilesH));

                var canvas = Bridge.cast(document.createElement("canvas"), HTMLCanvasElement);
                canvas.width = Bridge.Int.clip32(Math.floor(this.size.X));
                canvas.height = Bridge.Int.clip32(Math.floor(this.size.Y));
                this.image = canvas;

                this._sheet = tileMap._tileSheet;
                this._sheet.data.onload = Bridge.fn.combine(this._sheet.data.onload, Bridge.fn.cacheBind(this, this.Construct$1));

            }
        },
        methods: {
            Construct: function () {
                this.Construct$1(new Event(""));
            },
            Construct$1: function (e) {
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
                    var case_x = System.Int64.toNumber((System.Int64(this.data.get([x, y])).mod(System.Int64(this._tilesW))).mul(System.Int64(this._tilesW)));
                    var case_y = Math.floor(this.data.get([x, y]) / this._tilesW) * this._tilesH;

                    ctx.drawImage(this._sheet.data, case_x, case_y, this._tilesW, this._tilesH, Bridge.Int.umul(x, this._tilesW), Bridge.Int.umul(y, this._tilesH), this._tilesW, this._tilesH);
                }

            },
            GetTile: function (x, y) {
                return this.data.get([x, y]);
            }
        }
    });
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJHYW1lRW5naW5lSlMuanMiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbIkNvbXBvbmVudHMvQ29tcG9uZW50LmNzIiwiQ29tcG9uZW50cy9Db21wb25lbnRSZWFkZXIuY3MiLCJEaXNwbGF5L0NhbWVyYS5jcyIsIkRpc3BsYXkvRGlzcGxheUxpc3QuY3MiLCJEaXNwbGF5L1NjZW5lLmNzIiwiRXZlbnRzL0tleUJvYXJkRXZlbnQuY3MiLCJHYW1lLmNzIiwiR2FtZU9iamVjdHMvR2FtZU9iamVjdC5jcyIsIkdhbWVPYmplY3RzL1RpbGVNYXAvVGlsZU1hcC5jcyIsIkdyYXBoaWNzL0RyYXdlci5jcyIsIkdyYXBoaWNzL0ltYWdlLmNzIiwiR3JhcGhpY3MvU3ByaXRlU2hlZXQuY3MiLCJNYXRocy9WZWN0b3IyLmNzIiwiTWF0aHMvVmVjdG9yMkkuY3MiLCJNYXRocy9WZWN0b3I0LmNzIiwiU3lzdGVtL01vdXNlLmNzIiwiU3lzdGVtL1NjaGVkdWxlci5jcyIsIkNvbXBvbmVudHMvQW5pbWF0b3IuY3MiLCJDb21wb25lbnRzL0NvbGxpc2lvbi5jcyIsIkNvbXBvbmVudHMvTW92ZW1lbnQuY3MiLCJHYW1lT2JqZWN0cy9TcHJpdGUuY3MiLCJHYW1lT2JqZWN0cy9UaWxlTWFwL0xheWVyLmNzIl0sCiAgIm5hbWVzIjogWyIiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7OzRCQVEyQkE7O2dCQUNmQSxjQUFTQTs7Ozs7Ozs7Ozs7Ozs0QkNFWUE7O2dCQUNyQkEsbUJBQWNBOzs7Ozs7Z0JBSWRBLDBCQUEyQkE7Ozs7d0JBQ3ZCQSwyQkFBc0RBOzs7O2dDQUVsREE7Ozs7Ozs7d0JBRUpBLHFCQUFnQkE7Ozs7Ozs7O3VDQUlLQTs7Z0JBQ3pCQSxJQUFJQTtvQkFBNkJBOztnQkFDakNBLDBCQUE0QkE7Ozs7d0JBRXhCQSwyQkFBc0RBOzs7O2dDQUVsREE7Ozs7Ozs7d0JBRUpBLHFCQUFnQkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0JDbkJw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aUJBQVVBLElBQUlBOzttQ0FDZUE7Z0JBQ3JCQSxLQUFLQSxXQUFZQSxJQUFJQSxhQUFRQTtvQkFDekJBLEtBQUtBLFdBQVlBLElBQUlBLGFBQVFBO3dCQUN6QkEsYUFBUUEsR0FBRUEsR0FBRUEsZUFBS0EsR0FBRUE7Ozs7K0JBS1RBLEdBQVFBLEdBQVFBLE1BQVVBO2dCQUM1Q0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsVUFBVUEsS0FBS0EsZUFBVUEsVUFBVUEsS0FBS0E7b0JBQVNBOztnQkFDdkRBLGNBQWNBLGVBQUtBLEdBQUdBOztnQkFFdEJBLGFBQTJCQSxBQUFtQkE7Z0JBQzlDQSxVQUErQkEsQUFBMEJBOztnQkFFekRBLElBQUlBLFNBQVFBLE1BQU1BLFlBQVdBO29CQUN6QkEsZUFBS0EsR0FBR0EsSUFBS0E7b0JBQ2JBLGNBQWNBLG1CQUFFQSxlQUFRQSxtQkFBRUEsZUFBUUEsY0FBUUE7b0JBQzFDQTs7Z0JBRUpBLElBQUlBLFNBQVFBO29CQUFJQTs7Z0JBQ2hCQSxJQUFHQSxZQUFXQSxRQUFRQTtvQkFDbEJBLGVBQUtBLEdBQUdBLElBQUtBOztvQkFFYkEsSUFBSUEsY0FBU0E7d0JBQU1BOztvQkFDbkJBLGFBQWVBLHVCQUFDQSw0QkFBS0EsR0FBR0EsU0FBS0EsaUNBQVdBO29CQUN4Q0EsYUFBZUEsQUFBT0EsV0FBV0EsQUFBT0EsZUFBS0EsR0FBR0EsTUFBS0EsZ0JBQVdBOztvQkFFaEVBLGNBQWNBLGtCQUFhQSxRQUFRQSxRQUFRQSxjQUFTQSxjQUFTQSxtQkFBSUEsZUFBU0EsbUJBQUlBLGVBQVNBLGNBQVNBOzs7OytCQUtuRkEsR0FBUUE7Z0JBQ3pCQSxPQUFPQSxlQUFLQSxHQUFHQSIsCiAgInNvdXJjZXNDb250ZW50IjogWyJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuQ29tcG9uZW50c1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgQ29tcG9uZW50XHJcbiAgICB7XHJcbiAgICAgICAgaW50ZXJuYWwgR2FtZU9iamVjdCBwYXJlbnQgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIGludGVybmFsIENvbXBvbmVudChHYW1lT2JqZWN0IF9wYXJlbnQpIHtcclxuICAgICAgICAgICAgcGFyZW50ID0gX3BhcmVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGludGVybmFsIHZpcnR1YWwgdm9pZCBVcGRhdGUoKSB7fVxyXG5cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBHYW1lRW5naW5lSlMuRGlzcGxheTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5Db21wb25lbnRzXHJcbntcclxuICAgIGludGVybmFsIGNsYXNzIENvbXBvbmVudFJlYWRlclxyXG4gICAge1xyXG4gICAgICAgIGludGVybmFsIERpc3BsYXlMaXN0IGRpc3BsYXlMaXN0IHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgaW50ZXJuYWwgQ29tcG9uZW50UmVhZGVyKERpc3BsYXlMaXN0IGxpc3QpIHtcclxuICAgICAgICAgICAgZGlzcGxheUxpc3QgPSBsaXN0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW50ZXJuYWwgdm9pZCB1cGRhdGUoKSB7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKEdhbWVPYmplY3Qgb2JqIGluIGRpc3BsYXlMaXN0Lmxpc3QpIHtcclxuICAgICAgICAgICAgICAgIGZvcmVhY2ggKEtleVZhbHVlUGFpcjxzdHJpbmcsIENvbXBvbmVudD4gY29tcG9uZW50IGluIG9iai5jb21wb25lbnRzKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5WYWx1ZS5VcGRhdGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlY3Vyc2l2ZVVwZGF0ZShvYmopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgcmVjdXJzaXZlVXBkYXRlKEdhbWVPYmplY3Qgb2JqKSB7XHJcbiAgICAgICAgICAgIGlmIChkaXNwbGF5TGlzdC5saXN0LkNvdW50IDw9IDApIHJldHVybjtcclxuICAgICAgICAgICAgZm9yZWFjaCAoR2FtZU9iamVjdCBvYmoyIGluIG9iai5kaXNwbGF5TGlzdC5saXN0KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmb3JlYWNoIChLZXlWYWx1ZVBhaXI8c3RyaW5nLCBDb21wb25lbnQ+IGNvbXBvbmVudCBpbiBvYmoyLmNvbXBvbmVudHMpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LlZhbHVlLlVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVjdXJzaXZlVXBkYXRlKG9iajIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkRpc3BsYXlcclxue1xyXG4gICAgcHVibGljIGNsYXNzIENhbWVyYVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIHBvc2l0aW9uIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgcm90YXRpb24geyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgQ2FtZXJhKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uID0gbmV3IFZlY3RvcjIoMCwwKTtcclxuICAgICAgICAgICAgcm90YXRpb24gPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIENhbWVyYShWZWN0b3IyIF9wb3NpdGlvbixmbG9hdCBfcm90YXRpb24pIHtcclxuICAgICAgICAgICAgcG9zaXRpb24gPSBfcG9zaXRpb247XHJcbiAgICAgICAgICAgIHJvdGF0aW9uID0gX3JvdGF0aW9uO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHMuVGlsZU1hcDtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuRGlzcGxheVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgRGlzcGxheUxpc3RcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgTGlzdDxHYW1lT2JqZWN0PiBsaXN0IHsgZ2V0OyBzZXQ7IH0gIFxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBBZGQoVGlsZU1hcCBvYmosIEdhbWVPYmplY3QgcGFyZW50KSB7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKExheWVyIGwgaW4gb2JqLmxheWVycy5WYWx1ZXMpIHtcclxuICAgICAgICAgICAgICAgIEFkZEF0KGwscGFyZW50LChpbnQpbC5pbmRleCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkKEdhbWVPYmplY3Qgb2JqLEdhbWVPYmplY3QgcGFyZW50KSB7XHJcbiAgICAgICAgICAgIGxpc3QuQWRkKG9iaik7XHJcbiAgICAgICAgICAgIG9iai5fcGFyZW50ID0gcGFyZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkQXQoR2FtZU9iamVjdCBvYmosR2FtZU9iamVjdCBwYXJlbnQsIGludCBpbmRleCkge1xyXG4gICAgICAgICAgICBsaXN0Lkluc2VydChpbmRleCwgb2JqKTtcclxuICAgICAgICAgICAgb2JqLl9wYXJlbnQgPSBwYXJlbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBSZW1vdmUoR2FtZU9iamVjdCBvYmopXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsaXN0LlJlbW92ZShvYmopO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgTW92ZShHYW1lT2JqZWN0IG9iaiwgaW50IGluZGV4KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW50IG9sZEluZGV4ID0gbGlzdC5JbmRleE9mKG9iaik7XHJcbiAgICAgICAgICAgIGxpc3QuUmVtb3ZlQXQob2xkSW5kZXgpO1xyXG4gICAgICAgICAgICBsaXN0Lkluc2VydChpbmRleCxvYmopO1xyXG4gICAgICAgIH1cclxuXG5cclxuICAgIFxucHJpdmF0ZSBMaXN0PEdhbWVPYmplY3Q+IF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19saXN0PW5ldyBMaXN0PEdhbWVPYmplY3Q+KCkgO31cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5TeXN0ZW07XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkRpc3BsYXlcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFNjZW5lXHJcbiAgICB7XHJcblxyXG4gICAgICAgIHB1YmxpYyBDYW1lcmEgY2FtZXJhIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBEaXNwbGF5TGlzdCBfbWFpbkRpc3BsYXlMaXN0O1xyXG4gICAgICAgIHByaXZhdGUgRHJhd2VyIF9kcmF3ZXI7XHJcbiAgICAgICAgcHJpdmF0ZSBIVE1MQ2FudmFzRWxlbWVudCBfY2FudmFzO1xyXG4gICAgICAgIHByaXZhdGUgc3RyaW5nIF9jb2xvcjtcclxuICAgICAgICBwdWJsaWMgTW91c2UgbW91c2UgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgU2NlbmUoRGlzcGxheUxpc3Qgb2JqTGlzdCxzdHJpbmcgY2FudmFzSUQsc3RyaW5nIGNvbG9yKSB7XHJcbiAgICAgICAgICAgIGNhbWVyYSA9IG5ldyBDYW1lcmEoKTtcclxuICAgICAgICAgICAgX21haW5EaXNwbGF5TGlzdCA9IG9iakxpc3Q7XHJcbiAgICAgICAgICAgIF9jYW52YXMgPSBEb2N1bWVudC5RdWVyeVNlbGVjdG9yPEhUTUxDYW52YXNFbGVtZW50PihcImNhbnZhcyNcIiArIGNhbnZhc0lEKTtcclxuICAgICAgICAgICAgX2RyYXdlciA9IG5ldyBEcmF3ZXIoX2NhbnZhcyk7XHJcbiAgICAgICAgICAgIF9jb2xvciA9IGNvbG9yO1xyXG4gICAgICAgICAgICBtb3VzZSA9IG5ldyBNb3VzZShfY2FudmFzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFJlZnJlc2goKSB7XHJcbiAgICAgICAgICAgIF9kcmF3ZXIuRmlsbFNjcmVlbihfY29sb3IpO1xyXG4gICAgICAgICAgICBmb3JlYWNoIChHYW1lT2JqZWN0IG9iaiBpbiBfbWFpbkRpc3BsYXlMaXN0Lmxpc3QpIHtcclxuICAgICAgICAgICAgICAgIF9kcmF3ZXIuRHJhdyhvYmoucG9zaXRpb24uWCAtIGNhbWVyYS5wb3NpdGlvbi5YLCBvYmoucG9zaXRpb24uWSAtIGNhbWVyYS5wb3NpdGlvbi5ZLCBvYmouc2l6ZS5YLCBvYmouc2l6ZS5ZLCBvYmouYW5nbGUsIG9iai5pbWFnZSxmYWxzZSwxKTtcclxuICAgICAgICAgICAgICAgIERyYXdDaGlsZChvYmosb2JqLnBvc2l0aW9uLlgsb2JqLnBvc2l0aW9uLlksb2JqLmFuZ2xlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIERyYXdDaGlsZChHYW1lT2JqZWN0IG9iaixmbG9hdCB4LGZsb2F0IHksZmxvYXQgYW5nbGUpIHtcclxuICAgICAgICAgICAgZm9yZWFjaCAoR2FtZU9iamVjdCBvYmoyIGluIG9iai5kaXNwbGF5TGlzdC5saXN0KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmbG9hdCBuZXdYID0geCArIChmbG9hdCkoTWF0aC5Db3Mob2JqLmFuZ2xlKk1hdGguUEkvMTgwKSkgKiBvYmoyLnBvc2l0aW9uLlggLSBjYW1lcmEucG9zaXRpb24uWDtcclxuICAgICAgICAgICAgICAgIGZsb2F0IG5ld1kgPSB5ICsgKGZsb2F0KShNYXRoLlNpbihvYmouYW5nbGUqTWF0aC5QSS8xODApKSAqIG9iajIucG9zaXRpb24uWSAtIGNhbWVyYS5wb3NpdGlvbi5ZO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQgbmV3QW5nbGUgPSBvYmoyLmFuZ2xlICsgYW5nbGU7XHJcblxyXG4gICAgICAgICAgICAgICAgX2RyYXdlci5EcmF3KG5ld1gsIG5ld1ksIG9iajIuc2l6ZS5YLCBvYmoyLnNpemUuWSwgbmV3QW5nbGUsIG9iajIuaW1hZ2UsIGZhbHNlLCAxKTtcclxuICAgICAgICAgICAgICAgIERyYXdDaGlsZChvYmoyLG5ld1gsbmV3WSxuZXdBbmdsZSk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5FdmVudHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEtleUJvYXJkRXZlbnRcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgZGVsZWdhdGUgdm9pZCBLZXlQcmVzc0V2ZW50KHN0cmluZyBrZXkpO1xyXG4gICAgICAgIHB1YmxpYyBldmVudCBLZXlQcmVzc0V2ZW50IE9uS2V5UHJlc3NFdmVudHM7XHJcblxyXG4gICAgICAgIHB1YmxpYyBkZWxlZ2F0ZSB2b2lkIEtleURvd25FdmVudChzdHJpbmcga2V5KTtcclxuICAgICAgICBwdWJsaWMgZXZlbnQgS2V5RG93bkV2ZW50IE9uS2V5RG93bkV2ZW50cztcclxuXHJcbiAgICAgICAgcHVibGljIGRlbGVnYXRlIHZvaWQgS2V5VXBFdmVudChzdHJpbmcga2V5KTtcclxuICAgICAgICBwdWJsaWMgZXZlbnQgS2V5VXBFdmVudCBPbktleVVwRXZlbnRzO1xyXG5cclxuICAgICAgICBwdWJsaWMgS2V5Qm9hcmRFdmVudCgpIHtcclxuICAgICAgICAgICAgRG9jdW1lbnQuQWRkRXZlbnRMaXN0ZW5lcihFdmVudFR5cGUuS2V5UHJlc3MsIChnbG9iYWw6OlN5c3RlbS5BY3Rpb248Z2xvYmFsOjpCcmlkZ2UuSHRtbDUuRXZlbnQ+KURvS2V5UHJlc3MpO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5BZGRFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5LZXlEb3duLCAoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6QnJpZGdlLkh0bWw1LkV2ZW50PilEb0tleURvd24pO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5BZGRFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5LZXlVcCwgKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxnbG9iYWw6OkJyaWRnZS5IdG1sNS5FdmVudD4pRG9LZXlVcCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgRG9LZXlQcmVzcyhFdmVudCBlKSB7XHJcbiAgICAgICAgICAgIGlmIChPbktleVByZXNzRXZlbnRzID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgT25LZXlQcmVzc0V2ZW50cy5JbnZva2UoZS5BczxLZXlib2FyZEV2ZW50PigpLktleSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgRG9LZXlEb3duKEV2ZW50IGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoT25LZXlEb3duRXZlbnRzID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgT25LZXlEb3duRXZlbnRzLkludm9rZShlLkFzPEtleWJvYXJkRXZlbnQ+KCkuS2V5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBEb0tleVVwKEV2ZW50IGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoT25LZXlVcEV2ZW50cyA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIE9uS2V5VXBFdmVudHMuSW52b2tlKGUuQXM8S2V5Ym9hcmRFdmVudD4oKS5LZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuU3lzdGVtO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5EaXNwbGF5O1xyXG51c2luZyBHYW1lRW5naW5lSlMuQ29tcG9uZW50cztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzLlRpbGVNYXA7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBHYW1lXHJcbiAgICB7XHJcblxyXG4gICAgICAgIHB1YmxpYyBEcmF3ZXIgZHJhd2VyIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgU2NoZWR1bGVyIHNjaGVkdWxlciB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIFNjZW5lIHNjZW5lIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgTW91c2UgbW91c2UgeyBnZXQgeyByZXR1cm4gc2NlbmUubW91c2U7IH0gfVxyXG5cclxuICAgICAgICBwcml2YXRlIERpc3BsYXlMaXN0IF9kaXNwbGF5TGlzdDtcclxuICAgICAgICBwcml2YXRlIENvbXBvbmVudFJlYWRlciBfY29tcG9uZW50UmVhZGVyO1xyXG5cclxuICAgICAgICBwdWJsaWMgR2FtZShzdHJpbmcgY2FudmFzSUQpIDogdGhpcyhjYW52YXNJRCwgXCIjZmZmXCIpIHsgfVxyXG4gICAgICAgIHB1YmxpYyBHYW1lKHN0cmluZyBjYW52YXNJRCwgc3RyaW5nIGNvbG9yKSB7XHJcbiAgICAgICAgICAgIF9kaXNwbGF5TGlzdCA9IG5ldyBEaXNwbGF5TGlzdCgpO1xyXG4gICAgICAgICAgICBzY2VuZSA9IG5ldyBTY2VuZShfZGlzcGxheUxpc3QsIGNhbnZhc0lELCBjb2xvcik7XHJcbiAgICAgICAgICAgIF9jb21wb25lbnRSZWFkZXIgPSBuZXcgQ29tcG9uZW50UmVhZGVyKF9kaXNwbGF5TGlzdCk7XHJcblxyXG5cclxuICAgICAgICAgICAgc2NoZWR1bGVyID0gbmV3IFNjaGVkdWxlcigpO1xyXG4gICAgICAgICAgICBzY2hlZHVsZXIuQWRkKChnbG9iYWw6OlN5c3RlbS5BY3Rpb24pc2NlbmUuUmVmcmVzaCk7XHJcbiAgICAgICAgICAgIHNjaGVkdWxlci5BZGQoKGdsb2JhbDo6U3lzdGVtLkFjdGlvbilfY29tcG9uZW50UmVhZGVyLnVwZGF0ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBBZGRDaGlsZChUaWxlTWFwIG9iailcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIF9kaXNwbGF5TGlzdC5BZGQob2JqLCBudWxsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZENoaWxkKEdhbWVPYmplY3Qgb2JqKSB7XHJcbiAgICAgICAgICAgIF9kaXNwbGF5TGlzdC5BZGQob2JqLCBudWxsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZENoaWxkQXQoR2FtZU9iamVjdCBvYmosIGludCBpbmRleCkge1xyXG4gICAgICAgICAgICBfZGlzcGxheUxpc3QuQWRkQXQob2JqLCBudWxsLCBpbmRleCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBSZW1vdmVDaGlsZChHYW1lT2JqZWN0IG9iaikge1xyXG4gICAgICAgICAgICBfZGlzcGxheUxpc3QuUmVtb3ZlKG9iaik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBNb3ZlQ2hpbGQoR2FtZU9iamVjdCBvYmosIGludCBpbmRleCkge1xyXG4gICAgICAgICAgICBfZGlzcGxheUxpc3QuTW92ZShvYmosaW5kZXgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HcmFwaGljcztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkNvbXBvbmVudHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5EaXNwbGF5O1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cy5UaWxlTWFwO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHNcclxue1xyXG4gICAgcHVibGljIGFic3RyYWN0IGNsYXNzIEdhbWVPYmplY3RcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBpbnQgSURJbmNyZW1lbnRlciA9IDA7XHJcblxyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIHBvc2l0aW9uIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgVmVjdG9yMiBzaXplIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgYW5nbGUgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBpbnQgSUQgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIFVuaW9uPEhUTUxDYW52YXNFbGVtZW50LCBJbWFnZSwgU3ByaXRlU2hlZXQ+IGltYWdlIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgRGljdGlvbmFyeTxzdHJpbmcsIENvbXBvbmVudD4gY29tcG9uZW50cyA9IG5ldyBEaWN0aW9uYXJ5PHN0cmluZywgQ29tcG9uZW50PigpO1xyXG4gICAgICAgIGludGVybmFsIERpc3BsYXlMaXN0IGRpc3BsYXlMaXN0ID0gbmV3IERpc3BsYXlMaXN0KCk7XHJcbiAgICAgICAgaW50ZXJuYWwgR2FtZU9iamVjdCBfcGFyZW50O1xyXG5cclxuICAgICAgICBcclxuXHJcbiAgICAgICAgLy9QdWJsaWMgTWV0aG9kc1xyXG4gICAgICAgIHB1YmxpYyBDb21wb25lbnQgQWRkQ29tcG9uZW50KHN0cmluZyBpbnN0YW5jZU5hbWUsIENvbXBvbmVudCBjb21wb25lbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb21wb25lbnRzW2luc3RhbmNlTmFtZV0gPSBjb21wb25lbnQ7XHJcbiAgICAgICAgICAgIHJldHVybiBjb21wb25lbnRzW2luc3RhbmNlTmFtZV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBBZGRDaGlsZChUaWxlTWFwLlRpbGVNYXAgdGlsZU1hcCkge1xyXG4gICAgICAgICAgICBkaXNwbGF5TGlzdC5BZGQodGlsZU1hcCwgdGhpcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBBZGRDaGlsZChHYW1lT2JqZWN0IG9iaikge1xyXG4gICAgICAgICAgICBkaXNwbGF5TGlzdC5BZGQob2JqLHRoaXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkQ2hpbGRBdChHYW1lT2JqZWN0IG9iaiwgaW50IGluZGV4KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZGlzcGxheUxpc3QuQWRkQXQob2JqLCB0aGlzLCBpbmRleCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBSZW1vdmVDaGlsZChHYW1lT2JqZWN0IG9iailcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGRpc3BsYXlMaXN0LlJlbW92ZShvYmopO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgTW92ZUNoaWxkKEdhbWVPYmplY3Qgb2JqLCBpbnQgaW5kZXgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBkaXNwbGF5TGlzdC5Nb3ZlKG9iaiwgaW5kZXgpO1xyXG4gICAgICAgIH1cclxuXG5cclxuICAgIFxucHJpdmF0ZSBpbnQgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX0lEPUlESW5jcmVtZW50ZXIrKzt9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHMuVGlsZU1hcFxyXG57XHJcblxyXG4gICAgcHVibGljIGNsYXNzIFRpbGVNYXBcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIFhNTEh0dHBSZXF1ZXN0IHJlcXVlc3Q7XHJcblxyXG4gICAgICAgIGludGVybmFsIERpY3Rpb25hcnk8c3RyaW5nLCBMYXllcj4gbGF5ZXJzIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBpbnRlcm5hbCBTcHJpdGVTaGVldCBfdGlsZVNoZWV0O1xyXG4gICAgICAgIGludGVybmFsIFZlY3RvcjJJIF9zaXplO1xyXG5cclxuICAgICAgICBwdWJsaWMgVmVjdG9yMiBwb3NpdGlvbiB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBUaWxlTWFwKFNwcml0ZVNoZWV0IHRpbGVTaGVldCwgVmVjdG9yMiBwb3MsIFZlY3RvcjJJIHNpemUpIHtcclxuICAgICAgICAgICAgbGF5ZXJzID0gbmV3IERpY3Rpb25hcnk8c3RyaW5nLCBMYXllcj4oKTtcclxuICAgICAgICAgICAgX3RpbGVTaGVldCA9IHRpbGVTaGVldDtcclxuICAgICAgICAgICAgcG9zaXRpb24gPSBwb3M7XHJcbiAgICAgICAgICAgIF9zaXplID0gc2l6ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBMYXllciBBZGRMYXllcihzdHJpbmcgbmFtZSx1aW50IGluZGV4KSB7XHJcbiAgICAgICAgICAgIGxheWVyc1tuYW1lXSA9IG5ldyBMYXllcihpbmRleCwgdGhpcyk7XHJcbiAgICAgICAgICAgIHJldHVybiBsYXllcnNbbmFtZV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBSZW1vdmVMYXllcihzdHJpbmcgbmFtZSkge1xyXG4gICAgICAgICAgICBsYXllcnNbbmFtZV0gPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIExheWVyIEdldExheWVyKHN0cmluZyBuYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBsYXllcnNbbmFtZV07XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgdm9pZCBTZXRUaWxlKHN0cmluZyBsYXllciwgaW50IHgsIGludCB5LCBpbnQgdGlsZSlcclxue1xyXG4gICAgU2V0VGlsZShsYXllciwgbmV3IFZlY3RvcjJJKHgsIHkpLCB0aWxlKTtcclxufSAgICAgICAgcHVibGljIHZvaWQgU2V0VGlsZShzdHJpbmcgbGF5ZXIsIFZlY3RvcjJJIHBvcywgaW50IHRpbGUpIHtcclxuICAgICAgICAgICAgbGF5ZXJzW2xheWVyXS5TZXRUaWxlKCh1aW50KXBvcy5YLCAodWludClwb3MuWSwgdGlsZSxmYWxzZSk7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgaW50IEdldFRpbGUoc3RyaW5nIGxheWVyLCBpbnQgeCwgaW50IHkpXHJcbntcclxuICAgIHJldHVybiBHZXRUaWxlKGxheWVyLCBuZXcgVmVjdG9yMkkoeCwgeSkpO1xyXG59ICAgICAgICBwdWJsaWMgaW50IEdldFRpbGUoc3RyaW5nIGxheWVyLCBWZWN0b3IySSBwb3MpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGxheWVyc1tsYXllcl0uR2V0VGlsZSgodWludClwb3MuWCwgKHVpbnQpcG9zLlkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgTG9hZFRpbGVkSnNvbihzdHJpbmcgdXJsLCB1aW50IG51bWJlck9mTGF5ZXJzKSB7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHVpbnQgaSA9IDA7IGkgPCBudW1iZXJPZkxheWVyczsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBBZGRMYXllcihpK1wiXCIsIGkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0Lk9uTG9hZCArPSBMb2FkVGlsZWQ7XHJcbiAgICAgICAgICAgIHJlcXVlc3QuT3BlbihcImdldFwiLHVybCk7XHJcbiAgICAgICAgICAgIHJlcXVlc3QuU2VuZCgpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBMb2FkVGlsZWQoRXZlbnQgZSkge1xyXG4gICAgICAgICAgICBkeW5hbWljIGEgPSBKU09OLlBhcnNlKHJlcXVlc3QuUmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgX3NpemUuWCA9IGEud2lkdGg7XHJcbiAgICAgICAgICAgIF9zaXplLlkgPSBhLmhlaWdodDtcclxuXHJcbiAgICAgICAgICAgIGZvciAodWludCBpID0gMDsgaSA8IGEubGF5ZXJzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBkeW5hbWljIGxheWVyanMgPSBhLmxheWVyc1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBMYXllciBsYXllciA9IGxheWVyc1tpICsgXCJcIl07XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGxheWVyanMgPSBsYXllcmpzLmRhdGE7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChpbnQgaiA9IDA7IGogPCBsYXllcmpzLmxlbmd0aDsgaisrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGludCBpbmRleFggPSBqICUgX3NpemUuWDtcclxuICAgICAgICAgICAgICAgICAgICBpbnQgaW5kZXhZID0gKGludClNYXRoLkZsb29yKChmbG9hdCkoaiAvIF9zaXplLlgpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGF5ZXIuU2V0VGlsZSgodWludClpbmRleFgsICh1aW50KWluZGV4WSwgbGF5ZXJqc1tqXS0xLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuR3JhcGhpY3Ncclxue1xyXG4gICAgcHVibGljIGNsYXNzIERyYXdlclxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIF9jdHg7XHJcbiAgICAgICAgcHJpdmF0ZSBIVE1MQ2FudmFzRWxlbWVudCBfY2FudmFzO1xyXG5cclxuICAgICAgICBwdWJsaWMgRHJhd2VyKEhUTUxDYW52YXNFbGVtZW50IGNhbnZhcykge1xyXG4gICAgICAgICAgICBfY3R4ID0gKENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCljYW52YXMuR2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgICAgICAgICBfY2FudmFzID0gY2FudmFzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgRmlsbFNjcmVlbihzdHJpbmcgY29sb3IpIHtcclxuICAgICAgICAgICAgX2N0eC5GaWxsU3R5bGUgPSBjb2xvcjtcclxuICAgICAgICAgICAgX2N0eC5GaWxsUmVjdCgwLDAsX2NhbnZhcy5XaWR0aCxfY2FudmFzLkhlaWdodCk7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgdm9pZCBEcmF3KGZsb2F0IHgsIGZsb2F0IHksIGZsb2F0IHcsIGZsb2F0IGgsIGR5bmFtaWMgaW1nKVxyXG57XHJcbiAgICBEcmF3KHgsIHksIHcsIGgsIDAsIGltZywgZmFsc2UsIDEpO1xyXG59ICAgICAgICBwdWJsaWMgdm9pZCBEcmF3KGZsb2F0IHgsIGZsb2F0IHksIGZsb2F0IHcsIGZsb2F0IGgsIGZsb2F0IHIsIGR5bmFtaWMgaW1nLCBib29sIGZvbGxvdywgZmxvYXQgYWxwaGEpIHtcclxuICAgICAgICAgICAgX2N0eC5JbWFnZVNtb290aGluZ0VuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgX2NhbnZhcy5TdHlsZS5JbWFnZVJlbmRlcmluZyA9IEltYWdlUmVuZGVyaW5nLlBpeGVsYXRlZDtcclxuICAgICAgICAgICAgX2N0eC5TYXZlKCk7XHJcblxyXG4gICAgICAgICAgICBmbG9hdCBzeCA9IDA7XHJcbiAgICAgICAgICAgIGZsb2F0IHN5ID0gMDtcclxuICAgICAgICAgICAgZmxvYXQgc3cgPSB3O1xyXG4gICAgICAgICAgICBmbG9hdCBzaCA9IGg7XHJcblxyXG4gICAgICAgICAgICBpZiAoaW1nID09IG51bGwpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGlmIChpbWcuc3ByaXRlU2l6ZVggIT0gbnVsbCAmJiBpbWcuc3ByaXRlU2l6ZVkgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgU3ByaXRlU2hlZXQgaW1nMiA9IChTcHJpdGVTaGVldClpbWc7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW1nMi5kYXRhLldpZHRoID09IDApIHJldHVybjsgXHJcbiAgICAgICAgICAgICAgICBzeCA9IChpbWcyLmN1cnJlbnRJbmRleCAlIChpbWcyLmRhdGEuV2lkdGggLyBpbWcyLnNwcml0ZVNpemVYKSkgKiBpbWcyLnNwcml0ZVNpemVYO1xyXG4gICAgICAgICAgICAgICAgc3kgPSAoZmxvYXQpTWF0aC5GbG9vcihpbWcyLmN1cnJlbnRJbmRleCAvICgoZG91YmxlKWltZzIuZGF0YS5XaWR0aCAvIGltZzIuc3ByaXRlU2l6ZVgpKSAqIGltZzIuc3ByaXRlU2l6ZVk7XHJcbiAgICAgICAgICAgICAgICBzdyA9IGltZzIuc3ByaXRlU2l6ZVg7XHJcbiAgICAgICAgICAgICAgICBzaCA9IGltZzIuc3ByaXRlU2l6ZVk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChpbWcuZGF0YSAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpbWcgPSBpbWcuZGF0YTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9PYmplY3QgUm90YXRpb25cclxuICAgICAgICAgICAgZmxvYXQgb3ggPSB4ICsgKHcgLyAyKTtcclxuICAgICAgICAgICAgZmxvYXQgb3kgPSB5ICsgKGggLyAyKTtcclxuXHJcbiAgICAgICAgICAgIF9jdHguVHJhbnNsYXRlKG94LCBveSk7XHJcbiAgICAgICAgICAgIF9jdHguUm90YXRlKChyKSAqIE1hdGguUEkgLyAxODApOyAvL2RlZ3JlZVxyXG4gICAgICAgICAgICBfY3R4LlRyYW5zbGF0ZSgtb3gsIC1veSk7XHJcbiAgICAgICAgICAgIC8vLS0tLS0tLVxyXG5cclxuICAgICAgICAgICAgX2N0eC5EcmF3SW1hZ2UoaW1nLCBzeCwgc3ksIHN3LCBzaCwgeCwgeSwgdywgaCk7XHJcblxyXG4gICAgICAgICAgICBfY3R4LlJlc3RvcmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG5cclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuR3JhcGhpY3Ncclxue1xyXG4gICAgcHVibGljIGNsYXNzIEltYWdlXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIEhUTUxJbWFnZUVsZW1lbnQgZGF0YSB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBJbWFnZShzdHJpbmcgc3JjKSB7XHJcbiAgICAgICAgICAgIGRhdGEgPSBuZXcgSFRNTEltYWdlRWxlbWVudCgpO1xyXG4gICAgICAgICAgICBkYXRhLlNyYyA9IHNyYztcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgSW1hZ2UoSFRNTEltYWdlRWxlbWVudCBpbWcpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBkYXRhID0gaW1nO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuR3JhcGhpY3Ncclxue1xyXG4gICAgcHVibGljIGNsYXNzIFNwcml0ZVNoZWV0XHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIEhUTUxJbWFnZUVsZW1lbnQgZGF0YSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIHVpbnQgc3ByaXRlU2l6ZVggeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyB1aW50IHNwcml0ZVNpemVZIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgdWludCBjdXJyZW50SW5kZXggeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgU3ByaXRlU2hlZXQoc3RyaW5nIHNyYywgdWludCBfc3ByaXRlU2l6ZVgsIHVpbnQgX3Nwcml0ZVNpemVZKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZGF0YSA9IG5ldyBIVE1MSW1hZ2VFbGVtZW50KCk7XHJcbiAgICAgICAgICAgIGRhdGEuU3JjID0gc3JjO1xyXG4gICAgICAgICAgICBzcHJpdGVTaXplWCA9IF9zcHJpdGVTaXplWDtcclxuICAgICAgICAgICAgc3ByaXRlU2l6ZVkgPSBfc3ByaXRlU2l6ZVk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLk1hdGhzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBWZWN0b3IyXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IFggeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBZIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIFZlY3RvcjIoZmxvYXQgX3ggLCBmbG9hdCBfeSkge1xyXG4gICAgICAgICAgICBYID0gX3g7XHJcbiAgICAgICAgICAgIFkgPSBfeTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5NYXRoc1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgVmVjdG9yMklcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgaW50IFggeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBpbnQgWSB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IySShpbnQgX3gsIGludCBfeSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFggPSBfeDtcclxuICAgICAgICAgICAgWSA9IF95O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5NYXRoc1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgVmVjdG9yNFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBYIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgWSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IFogeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBXIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIFZlY3RvcjQoZmxvYXQgX3gsIGZsb2F0IF95LCBmbG9hdCBfeiwgZmxvYXQgX3cpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBYID0gX3g7XHJcbiAgICAgICAgICAgIFkgPSBfeTtcclxuICAgICAgICAgICAgWiA9IF96O1xyXG4gICAgICAgICAgICBXID0gX3c7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5TeXN0ZW1cclxue1xyXG4gICAgcHVibGljIGNsYXNzIE1vdXNlXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IHggeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCB5IHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwcml2YXRlIEhUTUxDYW52YXNFbGVtZW50IF9jYW52YXM7XHJcblxyXG4gICAgICAgIGludGVybmFsIE1vdXNlKEhUTUxDYW52YXNFbGVtZW50IGNhbnZhcykge1xyXG4gICAgICAgICAgICBfY2FudmFzID0gY2FudmFzO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5BZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxnbG9iYWw6OkJyaWRnZS5IdG1sNS5FdmVudD4pVXBkYXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBVcGRhdGUoRXZlbnQgZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIENsaWVudFJlY3QgcmVjdCA9IF9jYW52YXMuR2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgICAgIHggPSBlLkFzPE1vdXNlRXZlbnQ+KCkuQ2xpZW50WCAtIChmbG9hdClyZWN0LkxlZnQ7XHJcbiAgICAgICAgICAgIHkgPSBlLkFzPE1vdXNlRXZlbnQ+KCkuQ2xpZW50WSAtIChmbG9hdClyZWN0LlRvcDtcclxuICAgICAgICB9XHJcblxuICAgIFxucHJpdmF0ZSBmbG9hdCBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9feD0wO3ByaXZhdGUgZmxvYXQgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX3k9MDt9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuU3lzdGVtXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBTY2hlZHVsZXJcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIExpc3Q8QWN0aW9uPiBfYWN0aW9uTGlzdCA9IG5ldyBMaXN0PEFjdGlvbj4oKTtcclxuXHJcbiAgICAgICAgaW50ZXJuYWwgU2NoZWR1bGVyKCkge1xyXG4gICAgICAgICAgICBVcGRhdGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZChBY3Rpb24gbWV0aG9kcykge1xyXG4gICAgICAgICAgICBfYWN0aW9uTGlzdC5BZGQoKGdsb2JhbDo6U3lzdGVtLkFjdGlvbikoKCkgPT4gbWV0aG9kcygpKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBVcGRhdGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yZWFjaCAoQWN0aW9uIGEgaW4gX2FjdGlvbkxpc3QpIHtcclxuICAgICAgICAgICAgICAgIGEoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgV2luZG93LlJlcXVlc3RBbmltYXRpb25GcmFtZSgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uKVVwZGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuQ29tcG9uZW50c1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgQW5pbWF0b3IgOiBDb21wb25lbnRcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIERpY3Rpb25hcnk8c3RyaW5nLCBMaXN0PFVuaW9uPEltYWdlLCB1aW50Pj4+IF9hbmltYXRpb25zIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgc3RyaW5nIGN1cnJlbnRBbmltYXRpb24geyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBpbnQgY3VycmVudEZyYW1lIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgaW50IGZwcyB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBib29sIHBsYXlpbmcgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgcHJpdmF0ZSBkb3VibGUgbGFzdFRpbWVGcmFtZSA9IDA7XHJcblxyXG4gICAgICAgIHB1YmxpYyBBbmltYXRvcihHYW1lT2JqZWN0IHBhcmVudCkgOiBiYXNlKHBhcmVudClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIF9hbmltYXRpb25zID0gbmV3IERpY3Rpb25hcnk8c3RyaW5nLCBMaXN0PFVuaW9uPEltYWdlLCB1aW50Pj4+KCk7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgdm9pZCBHb3RvQW5kUGxheShzdHJpbmcgYW5pbWF0aW9uTmFtZSlcclxue1xyXG4gICAgR290b0FuZFBsYXkoYW5pbWF0aW9uTmFtZSwgMCk7XHJcbn0gICAgICAgIHB1YmxpYyB2b2lkIEdvdG9BbmRQbGF5KHN0cmluZyBhbmltYXRpb25OYW1lLCBpbnQgZnJhbWUpIHtcclxuICAgICAgICAgICAgY3VycmVudEFuaW1hdGlvbiA9IGFuaW1hdGlvbk5hbWU7XHJcbiAgICAgICAgICAgIGN1cnJlbnRGcmFtZSA9IGZyYW1lO1xyXG4gICAgICAgICAgICBwbGF5aW5nID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbnB1YmxpYyB2b2lkIEdvdG9BbmRTdG9wKHN0cmluZyBhbmltYXRpb25OYW1lKVxyXG57XHJcbiAgICBHb3RvQW5kU3RvcChhbmltYXRpb25OYW1lLCAwKTtcclxufSAgICAgICAgcHVibGljIHZvaWQgR290b0FuZFN0b3Aoc3RyaW5nIGFuaW1hdGlvbk5hbWUsIGludCBmcmFtZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRBbmltYXRpb24gPSBhbmltYXRpb25OYW1lO1xyXG4gICAgICAgICAgICBjdXJyZW50RnJhbWUgPSBmcmFtZTtcclxuXHJcbiAgICAgICAgICAgIGlmICghKCh1aW50KV9hbmltYXRpb25zW2N1cnJlbnRBbmltYXRpb25dW2N1cnJlbnRGcmFtZV0gPj0gMCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHBhcmVudC5pbWFnZSA9IChJbWFnZSlfYW5pbWF0aW9uc1tjdXJyZW50QW5pbWF0aW9uXVtjdXJyZW50RnJhbWVdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgU3ByaXRlU2hlZXQgc2hlZXQgPSAoU3ByaXRlU2hlZXQpcGFyZW50LmltYWdlO1xyXG4gICAgICAgICAgICAgICAgc2hlZXQuY3VycmVudEluZGV4ID0gKHVpbnQpX2FuaW1hdGlvbnNbY3VycmVudEFuaW1hdGlvbl1bY3VycmVudEZyYW1lXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcGxheWluZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgU3RvcCgpIHtcclxuICAgICAgICAgICAgcGxheWluZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgU3RhcnQoKSB7XHJcbiAgICAgICAgICAgIHBsYXlpbmcgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQ3JlYXRlKHN0cmluZyBhbmltYXRpb25OYW1lLCBMaXN0PHVpbnQ+IGxpc3QpIHtcclxuICAgICAgICAgICAgTGlzdDxVbmlvbjxJbWFnZSwgdWludD4+IHQgPSBuZXcgTGlzdDxVbmlvbjxJbWFnZSwgdWludD4+KCk7XHJcbiAgICAgICAgICAgIHQgPSBsaXN0LkFzPExpc3Q8VW5pb248SW1hZ2UsIHVpbnQ+Pj4oKTtcclxuICAgICAgICAgICAgQ3JlYXRlKGFuaW1hdGlvbk5hbWUsIHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBDcmVhdGUoc3RyaW5nIGFuaW1hdGlvbk5hbWUsIExpc3Q8SW1hZ2U+IGxpc3QpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBMaXN0PFVuaW9uPEltYWdlLCB1aW50Pj4gdCA9IG5ldyBMaXN0PFVuaW9uPEltYWdlLCB1aW50Pj4oKTtcclxuICAgICAgICAgICAgdCA9IGxpc3QuQXM8TGlzdDxVbmlvbjxJbWFnZSwgdWludD4+PigpO1xyXG4gICAgICAgICAgICBDcmVhdGUoYW5pbWF0aW9uTmFtZSwgdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIENyZWF0ZShzdHJpbmcgYW5pbWF0aW9uTmFtZSwgTGlzdDxVbmlvbjxJbWFnZSwgdWludD4+IGxpc3Qpe1xyXG4gICAgICAgICAgICBfYW5pbWF0aW9uc1thbmltYXRpb25OYW1lXSA9IGxpc3Q7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnRlcm5hbCBvdmVycmlkZSB2b2lkIFVwZGF0ZSgpIHtcclxuICAgICAgICAgICAgaWYgKCFwbGF5aW5nKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBkb3VibGUgbm93ID0gRGF0ZVRpbWUuTm93LlN1YnRyYWN0KERhdGVUaW1lLk1pblZhbHVlLkFkZFllYXJzKDIwMTcpKS5Ub3RhbE1pbGxpc2Vjb25kcztcclxuICAgICAgICAgICAgZG91YmxlIGRlbHRhID0gbm93IC0gbGFzdFRpbWVGcmFtZTtcclxuICAgICAgICAgICAgaWYgKGRlbHRhID4gMTAwMC9mcHMpIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRGcmFtZSsrO1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRGcmFtZSA+PSBfYW5pbWF0aW9uc1tjdXJyZW50QW5pbWF0aW9uXS5Db3VudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRGcmFtZSA9IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCEoKHVpbnQpX2FuaW1hdGlvbnNbY3VycmVudEFuaW1hdGlvbl1bY3VycmVudEZyYW1lXSA+PSAwKSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQuaW1hZ2UgPSAoSW1hZ2UpX2FuaW1hdGlvbnNbY3VycmVudEFuaW1hdGlvbl1bY3VycmVudEZyYW1lXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIFNwcml0ZVNoZWV0IHNoZWV0ID0gKFNwcml0ZVNoZWV0KXBhcmVudC5pbWFnZTtcclxuICAgICAgICAgICAgICAgICAgICBzaGVldC5jdXJyZW50SW5kZXggPSAodWludClfYW5pbWF0aW9uc1tjdXJyZW50QW5pbWF0aW9uXVtjdXJyZW50RnJhbWVdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxhc3RUaW1lRnJhbWUgPSBub3c7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cblxyXG4gICAgXG5wcml2YXRlIHN0cmluZyBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fY3VycmVudEFuaW1hdGlvbj1cIlwiO3ByaXZhdGUgaW50IF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19jdXJyZW50RnJhbWU9MDtwcml2YXRlIGludCBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fZnBzPTE7cHJpdmF0ZSBib29sIF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19wbGF5aW5nPWZhbHNlO31cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5NYXRocztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuQ29tcG9uZW50c1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgQ29sbGlzaW9uIDogQ29tcG9uZW50XHJcbiAgICB7XHJcblxyXG4gICAgICAgIHJlYWRvbmx5IExpc3Q8VmVjdG9yND4gX2JveGVzO1xyXG5cclxuICAgICAgICBwdWJsaWMgQ29sbGlzaW9uKEdhbWVPYmplY3QgX3BhcmVudCkgOiBiYXNlKF9wYXJlbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBfYm94ZXMgPSBuZXcgTGlzdDxWZWN0b3I0PigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkQm94KGZsb2F0IHgxLGZsb2F0IHkxLCBmbG9hdCB3aWR0aCwgZmxvYXQgaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIF9ib3hlcy5BZGQobmV3IFZlY3RvcjQoeDEseTEsd2lkdGgsaGVpZ2h0KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGZsb2F0IFBhcmVudFBvc0NhbGN1bGF0aW9uWChmbG9hdCB4LCBHYW1lT2JqZWN0IHBhcmVudCkge1xyXG4gICAgICAgICAgICBmbG9hdCBhZGRpbmcgPSAwO1xyXG4gICAgICAgICAgICBmbG9hdCBhbmdsZUFkZGluZyA9IDA7XHJcblxyXG4gICAgICAgICAgICBpZiAocGFyZW50Ll9wYXJlbnQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgYWRkaW5nID0gUGFyZW50UG9zQ2FsY3VsYXRpb25YKHBhcmVudC5wb3NpdGlvbi5YLCBwYXJlbnQuX3BhcmVudCk7XHJcbiAgICAgICAgICAgICAgICBhbmdsZUFkZGluZyA9IChmbG9hdCkoTWF0aC5Db3MocGFyZW50Ll9wYXJlbnQuYW5nbGUgKiBNYXRoLlBJIC8gMTgwKSkgKiB4O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAocGFyZW50Ll9wYXJlbnQgPT0gbnVsbCkgYWRkaW5nICs9IHBhcmVudC5wb3NpdGlvbi5YO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuICBhZGRpbmcgKyBhbmdsZUFkZGluZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgZmxvYXQgUGFyZW50UG9zQ2FsY3VsYXRpb25ZKGZsb2F0IHksIEdhbWVPYmplY3QgcGFyZW50KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZmxvYXQgYWRkaW5nID0gMDtcclxuICAgICAgICAgICAgZmxvYXQgYW5nbGVBZGRpbmcgPSAwO1xyXG5cclxuICAgICAgICAgICAgaWYgKHBhcmVudC5fcGFyZW50ICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGFkZGluZyA9IFBhcmVudFBvc0NhbGN1bGF0aW9uWShwYXJlbnQucG9zaXRpb24uWSwgcGFyZW50Ll9wYXJlbnQpO1xyXG4gICAgICAgICAgICAgICAgYW5nbGVBZGRpbmcgPSAoZmxvYXQpKE1hdGguU2luKHBhcmVudC5fcGFyZW50LmFuZ2xlICogTWF0aC5QSSAvIDE4MCkpICogeTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHBhcmVudC5fcGFyZW50ID09IG51bGwpIGFkZGluZyArPSBwYXJlbnQucG9zaXRpb24uWTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBhZGRpbmcgKyBhbmdsZUFkZGluZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBib29sIEhpdFRlc3RPYmplY3QoR2FtZU9iamVjdCBvYmopIHtcclxuXHJcbiAgICAgICAgICAgIGZsb2F0IHB4ID0gcGFyZW50LnBvc2l0aW9uLlg7XHJcbiAgICAgICAgICAgIGZsb2F0IHB5ID0gcGFyZW50LnBvc2l0aW9uLlk7XHJcbiAgICAgICAgICAgIGZsb2F0IHAyeCA9IG9iai5wb3NpdGlvbi5YO1xyXG4gICAgICAgICAgICBmbG9hdCBwMnkgPSBvYmoucG9zaXRpb24uWTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnQuX3BhcmVudCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBweCA9IFBhcmVudFBvc0NhbGN1bGF0aW9uWChwYXJlbnQucG9zaXRpb24uWCwgIHBhcmVudCk7IFxyXG4gICAgICAgICAgICAgICAgcHkgPSBQYXJlbnRQb3NDYWxjdWxhdGlvblkocGFyZW50LnBvc2l0aW9uLlksICBwYXJlbnQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAob2JqLl9wYXJlbnQgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcDJ4ID0gUGFyZW50UG9zQ2FsY3VsYXRpb25YKG9iai5wb3NpdGlvbi5YLCBvYmopO1xyXG4gICAgICAgICAgICAgICAgcDJ5ID0gUGFyZW50UG9zQ2FsY3VsYXRpb25ZKG9iai5wb3NpdGlvbi5ZLCBvYmopO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3JlYWNoIChDb21wb25lbnQgY3AgaW4gb2JqLmNvbXBvbmVudHMuVmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3AuR2V0VHlwZSgpID09IHR5cGVvZihDb2xsaXNpb24pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQ29sbGlzaW9uIGMgPSAoQ29sbGlzaW9uKWNwO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcmVhY2ggKFZlY3RvcjQgYiBpbiBfYm94ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yZWFjaCAoVmVjdG9yNCBiMiBpbiBjLl9ib3hlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGIuWCArIHB4IDwgYjIuWCArIHAyeCArIGIyLlogJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIuWCArIGIuWiArIHB4ID4gYjIuWCArIHAyeCAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYi5ZICsgcHkgPCBiMi5ZICsgYjIuVyArIHAyeSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYi5XICsgYi5ZICsgcHkgID4gYjIuWSArIHAyeSApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgYm9vbCBIaXRUZXN0UG9pbnQoZmxvYXQgeCxmbG9hdCB5KSB7XHJcblxyXG4gICAgICAgICAgICBmbG9hdCBweCA9IHBhcmVudC5wb3NpdGlvbi5YO1xyXG4gICAgICAgICAgICBmbG9hdCBweSA9IHBhcmVudC5wb3NpdGlvbi5ZO1xyXG5cclxuICAgICAgICAgICAgaWYgKHBhcmVudC5fcGFyZW50ICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHB4ID0gUGFyZW50UG9zQ2FsY3VsYXRpb25YKHBhcmVudC5wb3NpdGlvbi5YLCBwYXJlbnQpO1xyXG4gICAgICAgICAgICAgICAgcHkgPSBQYXJlbnRQb3NDYWxjdWxhdGlvblgocGFyZW50LnBvc2l0aW9uLlksIHBhcmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvcmVhY2ggKFZlY3RvcjQgYiBpbiBfYm94ZXMpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmICh4IDwgYi5YICsgcHggKyBiLlogJiZcclxuICAgICAgICAgICAgICAgICAgIHggPiBiLlggKyBweCAmJlxyXG4gICAgICAgICAgICAgICAgICAgeSA8IGIuWSArIHB5ICsgYi5XICYmXHJcbiAgICAgICAgICAgICAgICAgICB5ID4gYi5ZICsgcHkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5NYXRocztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuQ29tcG9uZW50c1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgTW92ZW1lbnQgOiBDb21wb25lbnRcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgTW92ZW1lbnQoR2FtZU9iamVjdCBfcGFyZW50KSA6IGJhc2UoX3BhcmVudClcclxuICAgICAgICB7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgdm9pZCBNb3ZlVG93YXJkKFZlY3RvcjIgcG9zLCBmbG9hdCBzcGVlZClcclxue1xyXG4gICAgTW92ZVRvd2FyZChwb3MuWCwgcG9zLlksIHNwZWVkKTtcclxufSAgICAgICAgcHVibGljIHZvaWQgTW92ZVRvd2FyZChmbG9hdCB4LCBmbG9hdCB5LCBmbG9hdCBzcGVlZCkge1xyXG4gICAgICAgICAgICBmbG9hdCBkeCA9IHggLSBwYXJlbnQucG9zaXRpb24uWDtcclxuICAgICAgICAgICAgZmxvYXQgZHkgPSB5IC0gcGFyZW50LnBvc2l0aW9uLlk7XHJcbiAgICAgICAgICAgIGZsb2F0IGFuZ2xlID0gKGZsb2F0KU1hdGguQXRhbjIoZHksIGR4KTtcclxuXHJcbiAgICAgICAgICAgIHBhcmVudC5wb3NpdGlvbi5YICs9IHNwZWVkICogKGZsb2F0KU1hdGguQ29zKGFuZ2xlKTtcclxuICAgICAgICAgICAgcGFyZW50LnBvc2l0aW9uLlkgKz0gc3BlZWQgKiAoZmxvYXQpTWF0aC5TaW4oYW5nbGUpO1xyXG4gICAgICAgIH1cclxucHVibGljIHZvaWQgTG9va0F0KFZlY3RvcjIgcG9zKVxyXG57XHJcbiAgICBMb29rQXQocG9zLlgsIHBvcy5ZKTtcclxufSAgICAgICAgcHVibGljIHZvaWQgTG9va0F0KGZsb2F0IHgsZmxvYXQgeSkge1xyXG4gICAgICAgICAgICBmbG9hdCB4MiA9IHBhcmVudC5wb3NpdGlvbi5YIC0geDtcclxuICAgICAgICAgICAgZmxvYXQgeTIgPSB5IC0gcGFyZW50LnBvc2l0aW9uLlk7XHJcbiAgICAgICAgICAgIGZsb2F0IGFuZ2xlID0gKGZsb2F0KU1hdGguQXRhbjIoeDIsIHkyKTtcclxuICAgICAgICAgICAgcGFyZW50LmFuZ2xlID0gYW5nbGUgKiAoZmxvYXQpKDE4MC9NYXRoLlBJKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLk1hdGhzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR3JhcGhpY3M7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5Db21wb25lbnRzO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFNwcml0ZSA6IEdhbWVPYmplY3RcclxuICAgIHtcclxuICAgICAgICAvL0NvbnN0cnVjdG9yXHJcbiAgICAgICAgcHVibGljIFNwcml0ZShWZWN0b3IyIF9wb3NpdGlvbiwgVmVjdG9yMiBfc2l6ZSwgVW5pb248SFRNTENhbnZhc0VsZW1lbnQsIEltYWdlLCBTcHJpdGVTaGVldD4gX2ltYWdlKSB7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uID0gX3Bvc2l0aW9uO1xyXG4gICAgICAgICAgICBzaXplID0gX3NpemU7XHJcbiAgICAgICAgICAgIGltYWdlID0gX2ltYWdlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBHYW1lRW5naW5lSlMuR3JhcGhpY3M7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5NYXRocztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHMuVGlsZU1hcFxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgTGF5ZXIgOiBHYW1lT2JqZWN0XHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIHVpbnQgaW5kZXggeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBpbnRbLF0gZGF0YSB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdWludCBfdGlsZXNXO1xyXG4gICAgICAgIHByaXZhdGUgdWludCBfdGlsZXNIO1xyXG4gICAgICAgIHByaXZhdGUgdWludCBfc2l6ZVg7XHJcbiAgICAgICAgcHJpdmF0ZSB1aW50IF9zaXplWTtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBTcHJpdGVTaGVldCBfc2hlZXQ7XHJcblxyXG4gICAgICAgIHB1YmxpYyBMYXllcih1aW50IF9pbmRleCwgVGlsZU1hcCB0aWxlTWFwKSB7XHJcbiAgICAgICAgICAgIGluZGV4ID0gX2luZGV4O1xyXG4gICAgICAgICAgICBfdGlsZXNXID0gdGlsZU1hcC5fdGlsZVNoZWV0LnNwcml0ZVNpemVYO1xyXG4gICAgICAgICAgICBfdGlsZXNIID0gdGlsZU1hcC5fdGlsZVNoZWV0LnNwcml0ZVNpemVZO1xyXG4gICAgICAgICAgICBfc2l6ZVggPSAodWludCl0aWxlTWFwLl9zaXplLlg7XHJcbiAgICAgICAgICAgIF9zaXplWSA9ICh1aW50KXRpbGVNYXAuX3NpemUuWTtcclxuICAgICAgICAgICAgZGF0YSA9IG5ldyBpbnRbX3NpemVYLCBfc2l6ZVldO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfc2l6ZVg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBfc2l6ZVk7IGorKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVtpLCBqXSA9IC0xO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBwb3NpdGlvbiA9IHRpbGVNYXAucG9zaXRpb247XHJcbiAgICAgICAgICAgIHNpemUgPSBuZXcgVmVjdG9yMihfc2l6ZVggKiBfdGlsZXNXLCBfc2l6ZVkgKiBfdGlsZXNIKTtcclxuXHJcbiAgICAgICAgICAgIEhUTUxDYW52YXNFbGVtZW50IGNhbnZhcyA9IChIVE1MQ2FudmFzRWxlbWVudClEb2N1bWVudC5DcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xyXG4gICAgICAgICAgICBjYW52YXMuV2lkdGggPSAoaW50KU1hdGguRmxvb3Ioc2l6ZS5YKTtcclxuICAgICAgICAgICAgY2FudmFzLkhlaWdodCA9IChpbnQpTWF0aC5GbG9vcihzaXplLlkpO1xyXG4gICAgICAgICAgICBpbWFnZSA9IGNhbnZhcztcclxuXHJcbiAgICAgICAgICAgIF9zaGVldCA9IHRpbGVNYXAuX3RpbGVTaGVldDtcclxuICAgICAgICAgICAgX3NoZWV0LmRhdGEuT25Mb2FkICs9IENvbnN0cnVjdDtcclxuXHJcbiAgICAgICAgfVxyXG5pbnRlcm5hbCB2b2lkIENvbnN0cnVjdCgpXHJcbntcclxuICAgIENvbnN0cnVjdChuZXcgRXZlbnQoXCJcIikpO1xyXG59ICAgICAgICBpbnRlcm5hbCB2b2lkIENvbnN0cnVjdChFdmVudCBlKSB7XHJcbiAgICAgICAgICAgIGZvciAodWludCB5ID0gMDsgeSA8IF9zaXplWTsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHVpbnQgeCA9IDA7IHggPCBfc2l6ZVg7IHgrKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgU2V0VGlsZSh4LHksZGF0YVt4LHldLHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnRlcm5hbCB2b2lkIFNldFRpbGUodWludCB4LCB1aW50IHksIGludCB0aWxlLCBib29sIGJ5UGFzc09sZCkge1xyXG4gICAgICAgICAgICBpZiAoISh4ID49IDAgJiYgeCA8PSBfc2l6ZVggJiYgeSA+PSAwICYmIHkgPD0gX3NpemVZKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpbnQgb2xkVGlsZSA9IGRhdGFbeCwgeV07XHJcblxyXG4gICAgICAgICAgICBIVE1MQ2FudmFzRWxlbWVudCBjYW52YXMgPSAoSFRNTENhbnZhc0VsZW1lbnQpaW1hZ2U7XHJcbiAgICAgICAgICAgIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBjdHggPSAoQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKWNhbnZhcy5HZXRDb250ZXh0KFwiMmRcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAodGlsZSA9PSAtMSAmJiBvbGRUaWxlICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhW3gsIHldID0gdGlsZTtcclxuICAgICAgICAgICAgICAgIGN0eC5DbGVhclJlY3QoeCpfdGlsZXNXLHkqX3RpbGVzSCxfdGlsZXNXLF90aWxlc0gpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aWxlID09IC0xKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmKG9sZFRpbGUgIT0gdGlsZSB8fCBieVBhc3NPbGQpIHsgXHJcbiAgICAgICAgICAgICAgICBkYXRhW3gsIHldID0gdGlsZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaW1hZ2UgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQgY2FzZV94ID0gKGRhdGFbeCwgeV0gJSBfdGlsZXNXKSAqIF90aWxlc1c7XHJcbiAgICAgICAgICAgICAgICBmbG9hdCBjYXNlX3kgPSAoZmxvYXQpTWF0aC5GbG9vcigoZmxvYXQpZGF0YVt4LCB5XSAvIF90aWxlc1cpICogX3RpbGVzSDtcclxuXHJcbiAgICAgICAgICAgICAgICBjdHguRHJhd0ltYWdlKF9zaGVldC5kYXRhLCBjYXNlX3gsIGNhc2VfeSwgX3RpbGVzVywgX3RpbGVzSCwgeCAqIF90aWxlc1csIHkgKiBfdGlsZXNILCBfdGlsZXNXLCBfdGlsZXNIKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGludGVybmFsIGludCBHZXRUaWxlKHVpbnQgeCwgdWludCB5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkYXRhW3gsIHldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXQp9Cg==
