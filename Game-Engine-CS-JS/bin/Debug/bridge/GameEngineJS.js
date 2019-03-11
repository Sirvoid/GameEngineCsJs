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
            ctor: function (parent) {
                this.$initialize();
                this.parent = parent;
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
            Update: function () {
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
                        this.RecursiveUpdate(obj);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            },
            RecursiveUpdate: function (obj) {
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
                        this.RecursiveUpdate(obj2);
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
                this.position = new GameEngineJS.Maths.Vector2.$ctor1(0, 0);
                this.rotation = 0;
            },
            $ctor1: function (position, rotation) {
                this.$initialize();
                this.position = position;
                this.rotation = rotation;
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
            Remove$1: function (obj) {
                var $t;
                $t = Bridge.getEnumerator(obj.layers.getValues(), GameEngineJS.GameObjects.TileMap.Layer);
                try {
                    while ($t.moveNext()) {
                        var l = $t.Current;
                        this.list.remove(l);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
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
            mouse: null,
            _mainDisplayList: null,
            _drawer: null,
            _canvas: null,
            _color: null
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

                        var xPos = obj.screenFixed ? obj.position.X : obj.position.X - this.camera.position.X;
                        var yPos = obj.screenFixed ? obj.position.Y : obj.position.Y - this.camera.position.Y;
                        this._drawer.Draw(xPos, yPos, obj.size.X, obj.size.Y, obj.angle, obj.image, false, 1);
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

                var angleRad = 0;
                var xarCos = 0;
                var yarSin = 0;

                if (obj.displayList.list.Count !== 0) {
                    angleRad = obj.angle * Math.PI / 180;
                    xarCos = x + (Math.cos(angleRad));
                    yarSin = y + (Math.sin(angleRad));
                }

                $t = Bridge.getEnumerator(obj.displayList.list);
                try {
                    while ($t.moveNext()) {
                        var obj2 = $t.Current;

                        var newX = obj2.screenFixed ? xarCos + obj2.position.X : xarCos + obj2.position.X - this.camera.position.X;
                        var newY = obj2.screenFixed ? yarSin + obj2.position.Y : yarSin + obj2.position.Y - this.camera.position.Y;
                        var newAngle = obj2.angle + angle;

                        this._drawer.Draw(newX, newY, obj2.size.X, obj2.size.Y, newAngle, obj2.image, false, 1);
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
                this.scheduler.Add(Bridge.fn.cacheBind(this._componentReader, this._componentReader.Update));
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
            RemoveChild$1: function (obj) {
                this._displayList.Remove$1(obj);
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
            /**
             * Position of the GameObject.
             *
             * @instance
             * @public
             * @memberof GameEngineJS.GameObjects.GameObject
             * @function position
             * @type GameEngineJS.Maths.Vector2
             */
            position: null,
            /**
             * Fixed on the screen if true.
             *
             * @instance
             * @public
             * @memberof GameEngineJS.GameObjects.GameObject
             * @function screenFixed
             * @type boolean
             */
            screenFixed: false,
            /**
             * Size of the GameObject.
             *
             * @instance
             * @public
             * @memberof GameEngineJS.GameObjects.GameObject
             * @function size
             * @type GameEngineJS.Maths.Vector2
             */
            size: null,
            /**
             * Object Angle in degrees.
             *
             * @instance
             * @public
             * @memberof GameEngineJS.GameObjects.GameObject
             * @function angle
             * @type number
             */
            angle: 0,
            /**
             * Unique ID of the GameObject.
             *
             * @instance
             * @public
             * @memberof GameEngineJS.GameObjects.GameObject
             * @function ID
             * @type number
             */
            ID: 0,
            /**
             * Image of the GameObject.
             *
             * @instance
             * @public
             * @memberof GameEngineJS.GameObjects.GameObject
             * @function image
             * @type System.Object
             */
            image: null,
            /**
             * List of the object components.
             *
             * @instance
             * @public
             * @memberof GameEngineJS.GameObjects.GameObject
             * @type System.Collections.Generic.Dictionary$2
             */
            components: null,
            /**
             * Game Object type.
             *
             * @instance
             * @public
             * @memberof GameEngineJS.GameObjects.GameObject
             * @function type
             * @type string
             */
            type: null,
            displayList: null,
            _parent: null
        },
        ctors: {
            init: function () {
                var $t;
                this.screenFixed = false;
                this.ID = Bridge.identity(GameEngineJS.GameObjects.GameObject.IDIncrementer, ($t = (GameEngineJS.GameObjects.GameObject.IDIncrementer + 1) | 0, GameEngineJS.GameObjects.GameObject.IDIncrementer = $t, $t));
                this.components = new (System.Collections.Generic.Dictionary$2(System.String,GameEngineJS.Components.Component))();
                this.type = "Unknown";
                this.displayList = new GameEngineJS.Display.DisplayList();
            }
        },
        methods: {
            /**
             * Add/Link a component to this GameObject.
             *
             * @instance
             * @public
             * @this GameEngineJS.GameObjects.GameObject
             * @memberof GameEngineJS.GameObjects.GameObject
             * @param   {string}                               instanceName    
             * @param   {GameEngineJS.Components.Component}    component
             * @return  {GameEngineJS.Components.Component}
             */
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
            SetCollision$1: function (layer, x, y, collisionType) {
                this.SetCollision(layer, new GameEngineJS.Maths.Vector2I(x, y), collisionType);
            },
            SetCollision: function (layer, pos, collisionType) {
                this.layers.get(layer).SetCollision(((pos.X) >>> 0), ((pos.Y) >>> 0), collisionType);
            },
            GetCollision$1: function (layer, x, y) {
                return this.GetCollision(layer, new GameEngineJS.Maths.Vector2I(x, y));
            },
            GetCollision: function (layer, pos) {
                return this.layers.get(layer).GetCollision(((pos.X) >>> 0), ((pos.Y) >>> 0));
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
            Draw: function (x, y, w, h, r, img, follow, alpha) {
                if (follow === void 0) { follow = false; }
                if (alpha === void 0) { alpha = 1.0; }
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

                if (r !== 0) {
                    var ox = x + (w / 2);
                    var oy = y + (h / 2);

                    this._ctx.translate(ox, oy);
                    this._ctx.rotate((r) * Math.PI / 180);
                    this._ctx.translate(-ox, -oy);
                }

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
            ctor: function (src, spriteSizeX, spriteSizeY) {
                this.$initialize();
                this.data = src.data;
                this.spriteSizeX = spriteSizeX;
                this.spriteSizeY = spriteSizeY;
            },
            $ctor1: function (src, spriteSizeX, spriteSizeY) {
                this.$initialize();
                this.data = new Image();
                this.data.src = src;
                this.spriteSizeX = spriteSizeX;
                this.spriteSizeY = spriteSizeY;
            }
        }
    });

    Bridge.define("GameEngineJS.Maths.Vector2", {
        statics: {
            methods: {
                op_Equality: function (a, b) {
                    if (a.X === b.X && a.Y === b.Y) {
                        return true;
                    }
                    return false;
                },
                op_Inequality: function (a, b) {
                    if (a.X === b.X && a.Y === b.Y) {
                        return false;
                    }
                    return true;
                }
            }
        },
        fields: {
            X: 0,
            Y: 0
        },
        ctors: {
            ctor: function () {
                this.$initialize();
                this.X = 0;
                this.Y = 0;
            },
            $ctor1: function (X, Y) {
                this.$initialize();
                this.X = X;
                this.Y = Y;
            }
        }
    });

    Bridge.define("GameEngineJS.Maths.Vector2I", {
        fields: {
            X: 0,
            Y: 0
        },
        ctors: {
            ctor: function (X, Y) {
                this.$initialize();
                this.X = X;
                this.Y = Y;
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
            ctor: function (X, Y, Z, W) {
                this.$initialize();
                this.X = X;
                this.Y = Y;
                this.Z = Z;
                this.W = W;
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
                window.setTimeout(Bridge.fn.bind(this, function () {
                    window.requestAnimationFrame(Bridge.fn.cacheBind(this, this.Update));
                }), 16);

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
            Create$3: function (animationName, list) {
                var t = new (System.Collections.Generic.List$1(System.Object)).ctor();
                t = list;
                this.Create$1(animationName, t);
            },
            Create$2: function (animationName, list) {
                var t = new (System.Collections.Generic.List$1(System.Object)).ctor();
                t = list;
                this.Create$1(animationName, t);
            },
            Create: function (animationName, list) {
                var t = new (System.Collections.Generic.List$1(System.Object)).ctor();
                t = list;
                this.Create$1(animationName, t);
            },
            Create$1: function (animationName, list) {
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
                        if (Bridge.referenceEquals(Bridge.getType(this._animations.get(this.currentAnimation).getItem(this.currentFrame)), GameEngineJS.Graphics.Image)) {
                            this.parent.image = this._animations.get(this.currentAnimation).getItem(this.currentFrame);
                        } else {
                            this.parent.image = this._animations.get(this.currentAnimation).getItem(this.currentFrame);
                        }
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
            ctor: function (parent) {
                this.$initialize();
                GameEngineJS.Components.Component.ctor.call(this, parent);
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
            },
            HitTestLayer: function (layer, colliderValue) {
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

                        var totalX = px + b.X;
                        var totalY = py + b.Y;

                        var totalX2 = totalX + b.Z;
                        var totalY2 = totalY + b.W;

                        var left_tile = Bridge.Int.clip32(Math.floor((totalX - layer.position.X) / layer.tilesW));
                        var right_tile = Bridge.Int.clip32(Math.floor((totalX2 - layer.position.X) / layer.tilesW));
                        var top_tile = Bridge.Int.clip32(Math.floor((totalY - layer.position.Y) / layer.tilesH));
                        var bottom_tile = Bridge.Int.clip32(Math.floor((totalY2 - layer.position.Y) / layer.tilesH));

                        for (var y = (top_tile - 1) | 0; y <= ((bottom_tile + 1) | 0); y = (y + 1) | 0) {
                            for (var x = (left_tile - 1) | 0; x <= ((right_tile + 1) | 0); x = (x + 1) | 0) {
                                if (x < 0 || System.Int64(x).gt(System.Int64(layer.sizeX - 1)) || System.Int64(y).gt(System.Int64(layer.sizeY - 1)) || y < 0) {
                                    continue;
                                }
                                var collider = layer.collisionData.get([x, y]);
                                if (collider !== colliderValue) {
                                    continue;
                                }

                                var tileX = System.Int64.toNumber((System.Int64(x).mul(System.Int64(layer.tilesW)))) + layer.position.X;
                                var tileY = System.Int64.toNumber((System.Int64(y).mul(System.Int64(layer.tilesH)))) + layer.position.Y;

                                var tileX2 = tileX + layer.tilesW;
                                var tileY2 = tileY + layer.tilesH;


                                var overX = (totalX < tileX2) && (totalX2 > tileX);
                                var overY = (totalY < tileY2) && (totalY2 > tileY);
                                if (overX && overY) {
                                    return true;
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
            ctor: function (position, size, image) {
                this.$initialize();
                GameEngineJS.GameObjects.GameObject.ctor.call(this);
                this.position = position;
                this.size = size;
                this.image = image;
                this.type = "Sprite";
            }
        }
    });

    Bridge.define("GameEngineJS.GameObjects.TextArea", {
        inherits: [GameEngineJS.GameObjects.GameObject],
        fields: {
            text: null,
            color: null,
            /**
             * In pixels, Example: 14
             *
             * @instance
             * @public
             * @memberof GameEngineJS.GameObjects.TextArea
             * @function fontSize
             * @type number
             */
            fontSize: 0,
            /**
             * Example: Arial
             *
             * @instance
             * @public
             * @memberof GameEngineJS.GameObjects.TextArea
             * @function font
             * @type string
             */
            font: null
        },
        ctors: {
            init: function () {
                this.text = "";
                this.color = "";
                this.fontSize = 14;
                this.font = "";
            },
            $ctor1: function (position, size, color, fontSize, font) {
                if (color === void 0) { color = ""; }
                if (fontSize === void 0) { fontSize = 14; }
                if (font === void 0) { font = ""; }

                GameEngineJS.GameObjects.TextArea.ctor.call(this, position, size);
                this.position = position;
                this.size = size;
                this.color = color;
                this.fontSize = fontSize;
                this.font = font;
            },
            ctor: function (position, size) {
                this.$initialize();
                GameEngineJS.GameObjects.GameObject.ctor.call(this);
                this.position = position;
                this.size = size;
                this.type = "TextArea";

                var canvas = Bridge.cast(document.createElement("canvas"), HTMLCanvasElement);
                canvas.width = Bridge.Int.clip32(Math.floor(size.X));
                canvas.height = Bridge.Int.clip32(Math.floor(size.Y));
                this.image = canvas;

            }
        },
        methods: {
            EraseAll: function () {
                var canvas = this.image;
                var ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            },
            Rewrite: function (text, x, y) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                this.EraseAll();
                this.Write(text, x, y);
            },
            Write: function (text, x, y) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                var canvas = this.image;
                var ctx = canvas.getContext("2d");
                ctx.fillStyle = this.color;
                ctx.font = this.fontSize + "px " + (this.font || "");
                ctx.fillText(text, x, ((y + this.fontSize) | 0));
            }
        }
    });

    Bridge.define("GameEngineJS.GameObjects.TileMap.Layer", {
        inherits: [GameEngineJS.GameObjects.GameObject],
        fields: {
            index: 0,
            data: null,
            collisionData: null,
            tilesW: 0,
            tilesH: 0,
            sizeX: 0,
            sizeY: 0,
            _sheet: null
        },
        ctors: {
            ctor: function (_index, tileMap) {
                this.$initialize();
                GameEngineJS.GameObjects.GameObject.ctor.call(this);
                this.type = "TilemapLayer";
                this.index = _index;
                this.tilesW = tileMap._tileSheet.spriteSizeX;
                this.tilesH = tileMap._tileSheet.spriteSizeY;
                this.sizeX = (tileMap._size.X) >>> 0;
                this.sizeY = (tileMap._size.Y) >>> 0;
                this.data = System.Array.create(0, null, System.Int32, this.sizeX, this.sizeY);
                this.collisionData = System.Array.create(0, null, System.Int32, this.sizeX, this.sizeY);

                for (var i = 0; System.Int64(i).lt(System.Int64(this.sizeX)); i = (i + 1) | 0) {
                    for (var j = 0; System.Int64(j).lt(System.Int64(this.sizeY)); j = (j + 1) | 0) {
                        this.data.set([i, j], -1);
                    }
                }

                this.position = tileMap.position;
                this.size = new GameEngineJS.Maths.Vector2.$ctor1(Bridge.Int.umul(this.sizeX, this.tilesW), Bridge.Int.umul(this.sizeY, this.tilesH));

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
                for (var y = 0; y < this.sizeY; y = (y + 1) >>> 0) {
                    for (var x = 0; x < this.sizeX; x = (x + 1) >>> 0) {
                        this.SetTile(x, y, this.data.get([x, y]), true);
                    }
                }
            },
            SetTile: function (x, y, tile, byPassOld) {
                if (!(x >= 0 && x <= this.sizeX && y >= 0 && y <= this.sizeY)) {
                    return;
                }
                var oldTile = this.data.get([x, y]);

                var canvas = this.image;
                var ctx = canvas.getContext("2d");

                if (tile === -1 && oldTile !== -1) {
                    this.data.set([x, y], tile);
                    ctx.clearRect(Bridge.Int.umul(x, this.tilesW), Bridge.Int.umul(y, this.tilesH), this.tilesW, this.tilesH);
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
                    var case_x = System.Int64.toNumber((System.Int64(this.data.get([x, y])).mod(System.Int64(this.tilesW))).mul(System.Int64(this.tilesW)));
                    var case_y = Math.floor(this.data.get([x, y]) / this.tilesW) * this.tilesH;

                    ctx.drawImage(this._sheet.data, case_x, case_y, this.tilesW, this.tilesH, Bridge.Int.umul(x, this.tilesW), Bridge.Int.umul(y, this.tilesH), this.tilesW, this.tilesH);
                }

            },
            GetTile: function (x, y) {
                return this.data.get([x, y]);
            },
            SetCollision: function (x, y, collision) {
                this.collisionData.set([x, y], collision);
            },
            GetCollision: function (x, y) {
                return this.collisionData.get([x, y]);
            }
        }
    });
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJHYW1lRW5naW5lSlMuanMiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbIkNvbXBvbmVudHMvQ29tcG9uZW50LmNzIiwiQ29tcG9uZW50cy9Db21wb25lbnRSZWFkZXIuY3MiLCJEaXNwbGF5L0NhbWVyYS5jcyIsIkRpc3BsYXkvRGlzcGxheUxpc3QuY3MiLCJEaXNwbGF5L1NjZW5lLmNzIiwiRXZlbnRzL0tleUJvYXJkRXZlbnQuY3MiLCJHYW1lLmNzIiwiR2FtZU9iamVjdHMvR2FtZU9iamVjdC5jcyIsIkdhbWVPYmplY3RzL1RpbGVNYXAvVGlsZU1hcC5jcyIsIkdyYXBoaWNzL0RyYXdlci5jcyIsIkdyYXBoaWNzL0ltYWdlLmNzIiwiR3JhcGhpY3MvU3ByaXRlU2hlZXQuY3MiLCJNYXRocy9WZWN0b3IyLmNzIiwiTWF0aHMvVmVjdG9yMkkuY3MiLCJNYXRocy9WZWN0b3I0LmNzIiwiU3lzdGVtL01vdXNlLmNzIiwiU3lzdGVtL1NjaGVkdWxlci5jcyIsIkNvbXBvbmVudHMvQW5pbWF0b3IuY3MiLCJDb21wb25lbnRzL0NvbGxpc2lvbi5jcyIsIkNvbXBvbmVudHMvTW92ZW1lbnQuY3MiLCJHYW1lT2JqZWN0cy9TcHJpdGUuY3MiLCJHYW1lT2JqZWN0cy9UZXh0QXJlYS5jcyIsIkdhbWVPYmplY3RzL1RpbGVNYXAvTGF5ZXIuY3MiXSwKICAibmFtZXMiOiBbIiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7NEJBUTJCQTs7Z0JBQ2ZBLGNBQWNBOzs7Ozs7Ozs7Ozs7OzRCQ0VPQTs7Z0JBQ3JCQSxtQkFBY0E7Ozs7OztnQkFJZEEsMEJBQTJCQTs7Ozt3QkFDdkJBLDJCQUFzREE7Ozs7Z0NBRWxEQTs7Ozs7Ozt3QkFFSkEscUJBQWdCQTs7Ozs7Ozs7dUNBSUtBOztnQkFDekJBLElBQUlBO29CQUE2QkE7O2dCQUNqQ0EsMEJBQTRCQTs7Ozt3QkFFeEJBLDJCQUFzREE7Ozs7Z0NBRWxEQTs7Ozs7Ozt3QkFFSkEscUJBQWdC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Q3JEQSxjQUFjQSxlQUFLQSxHQUFHQTs7Z0JBRXRCQSxhQUEyQkEsQUFBbUJBO2dCQUM5Q0EsVUFBK0JBLEFBQTBCQTs7Z0JBRXpEQSxJQUFJQSxTQUFRQSxNQUFNQSxZQUFXQTtvQkFDekJBLGVBQUtBLEdBQUdBLElBQUtBO29CQUNiQSxjQUFjQSxtQkFBRUEsY0FBT0EsbUJBQUVBLGNBQU9BLGFBQU9BO29CQUN2Q0E7O2dCQUVKQSxJQUFJQSxTQUFRQTtvQkFBSUE7O2dCQUNoQkEsSUFBR0EsWUFBV0EsUUFBUUE7b0JBQ2xCQSxlQUFLQSxHQUFHQSxJQUFLQTs7b0JBRWJBLElBQUlBLGNBQVNBO3dCQUFNQTs7b0JBQ25CQSxhQUFlQSx1QkFBQ0EsNEJBQUtBLEdBQUdBLFNBQUtBLGdDQUFVQTtvQkFDdkNBLGFBQWVBLEFBQU9BLFdBQVdBLEFBQU9BLGVBQUtBLEdBQUdBLE1BQUtBLGVBQVVBOztvQkFFL0RBLGNBQWNBLGtCQUFhQSxRQUFRQSxRQUFRQSxhQUFRQSxhQUFRQSxtQkFBSUEsY0FBUUEsbUJBQUlBLGNBQVFBLGFBQVFBOzs7OytCQUs5RUEsR0FBUUE7Z0JBQ3pCQSxPQUFPQSxlQUFLQSxHQUFHQTs7b0NBR1FBLEdBQVFBLEdBQVFBO2dCQUN2Q0Esd0JBQWNBLEdBQUdBLElBQUtBOztvQ0FHQUEsR0FBUUE7Z0JBRTlCQSxPQUFPQSx3QkFBY0EsR0FBR0EiLAogICJzb3VyY2VzQ29udGVudCI6IFsidXNpbmcgU3lzdGVtO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHM7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkNvbXBvbmVudHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIENvbXBvbmVudFxyXG4gICAge1xyXG4gICAgICAgIGludGVybmFsIEdhbWVPYmplY3QgcGFyZW50IHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBpbnRlcm5hbCBDb21wb25lbnQoR2FtZU9iamVjdCBwYXJlbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnRlcm5hbCB2aXJ0dWFsIHZvaWQgVXBkYXRlKCkge31cclxuXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkRpc3BsYXk7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuQ29tcG9uZW50c1xyXG57XHJcbiAgICBpbnRlcm5hbCBjbGFzcyBDb21wb25lbnRSZWFkZXJcclxuICAgIHtcclxuICAgICAgICBpbnRlcm5hbCBEaXNwbGF5TGlzdCBkaXNwbGF5TGlzdCB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIGludGVybmFsIENvbXBvbmVudFJlYWRlcihEaXNwbGF5TGlzdCBsaXN0KSB7XHJcbiAgICAgICAgICAgIGRpc3BsYXlMaXN0ID0gbGlzdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGludGVybmFsIHZvaWQgVXBkYXRlKCkge1xyXG4gICAgICAgICAgICBmb3JlYWNoIChHYW1lT2JqZWN0IG9iaiBpbiBkaXNwbGF5TGlzdC5saXN0KSB7XHJcbiAgICAgICAgICAgICAgICBmb3JlYWNoIChLZXlWYWx1ZVBhaXI8c3RyaW5nLCBDb21wb25lbnQ+IGNvbXBvbmVudCBpbiBvYmouY29tcG9uZW50cylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuVmFsdWUuVXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBSZWN1cnNpdmVVcGRhdGUob2JqKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIFJlY3Vyc2l2ZVVwZGF0ZShHYW1lT2JqZWN0IG9iaikge1xyXG4gICAgICAgICAgICBpZiAoZGlzcGxheUxpc3QubGlzdC5Db3VudCA8PSAwKSByZXR1cm47XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKEdhbWVPYmplY3Qgb2JqMiBpbiBvYmouZGlzcGxheUxpc3QubGlzdClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZm9yZWFjaCAoS2V5VmFsdWVQYWlyPHN0cmluZywgQ29tcG9uZW50PiBjb21wb25lbnQgaW4gb2JqMi5jb21wb25lbnRzKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5WYWx1ZS5VcGRhdGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFJlY3Vyc2l2ZVVwZGF0ZShvYmoyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxudXNpbmcgR2FtZUVuZ2luZUpTLk1hdGhzO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5EaXNwbGF5XHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBDYW1lcmFcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgVmVjdG9yMiBwb3NpdGlvbiB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IHJvdGF0aW9uIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIENhbWVyYSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwb3NpdGlvbiA9IG5ldyBWZWN0b3IyKDAsMCk7XHJcbiAgICAgICAgICAgIHJvdGF0aW9uID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBDYW1lcmEoVmVjdG9yMiBwb3NpdGlvbixmbG9hdCByb3RhdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XHJcbiAgICAgICAgICAgIHRoaXMucm90YXRpb24gPSByb3RhdGlvbjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzLlRpbGVNYXA7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkRpc3BsYXlcclxue1xyXG4gICAgcHVibGljIGNsYXNzIERpc3BsYXlMaXN0XHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIExpc3Q8R2FtZU9iamVjdD4gbGlzdCB7IGdldDsgc2V0OyB9ICBcclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkKFRpbGVNYXAgb2JqLCBHYW1lT2JqZWN0IHBhcmVudCkge1xyXG4gICAgICAgICAgICBmb3JlYWNoIChMYXllciBsIGluIG9iai5sYXllcnMuVmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgICBBZGRBdChsLHBhcmVudCwoaW50KWwuaW5kZXgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZChHYW1lT2JqZWN0IG9iaixHYW1lT2JqZWN0IHBhcmVudCkge1xyXG4gICAgICAgICAgICBsaXN0LkFkZChvYmopO1xyXG4gICAgICAgICAgICBvYmouX3BhcmVudCA9IHBhcmVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZEF0KEdhbWVPYmplY3Qgb2JqLEdhbWVPYmplY3QgcGFyZW50LCBpbnQgaW5kZXgpIHtcclxuICAgICAgICAgICAgbGlzdC5JbnNlcnQoaW5kZXgsIG9iaik7XHJcbiAgICAgICAgICAgIG9iai5fcGFyZW50ID0gcGFyZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgUmVtb3ZlKFRpbGVNYXAgb2JqKSB7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKExheWVyIGwgaW4gb2JqLmxheWVycy5WYWx1ZXMpIHtcclxuICAgICAgICAgICAgICAgIGxpc3QuUmVtb3ZlKGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBSZW1vdmUoR2FtZU9iamVjdCBvYmopXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsaXN0LlJlbW92ZShvYmopO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgTW92ZShHYW1lT2JqZWN0IG9iaiwgaW50IGluZGV4KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW50IG9sZEluZGV4ID0gbGlzdC5JbmRleE9mKG9iaik7XHJcbiAgICAgICAgICAgIGxpc3QuUmVtb3ZlQXQob2xkSW5kZXgpO1xyXG4gICAgICAgICAgICBsaXN0Lkluc2VydChpbmRleCxvYmopO1xyXG4gICAgICAgIH1cclxuXG5cclxuICAgIFxucHJpdmF0ZSBMaXN0PEdhbWVPYmplY3Q+IF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19saXN0PW5ldyBMaXN0PEdhbWVPYmplY3Q+KCkgO31cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5TeXN0ZW07XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkRpc3BsYXlcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFNjZW5lXHJcbiAgICB7XHJcblxyXG4gICAgICAgIHB1YmxpYyBDYW1lcmEgY2FtZXJhIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgTW91c2UgbW91c2UgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwcml2YXRlIERpc3BsYXlMaXN0IF9tYWluRGlzcGxheUxpc3Q7XHJcbiAgICAgICAgcHJpdmF0ZSBEcmF3ZXIgX2RyYXdlcjtcclxuICAgICAgICBwcml2YXRlIEhUTUxDYW52YXNFbGVtZW50IF9jYW52YXM7XHJcbiAgICAgICAgcHJpdmF0ZSBzdHJpbmcgX2NvbG9yO1xyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBwdWJsaWMgU2NlbmUoRGlzcGxheUxpc3Qgb2JqTGlzdCxzdHJpbmcgY2FudmFzSUQsc3RyaW5nIGNvbG9yKSB7XHJcbiAgICAgICAgICAgIGNhbWVyYSA9IG5ldyBDYW1lcmEoKTtcclxuICAgICAgICAgICAgX21haW5EaXNwbGF5TGlzdCA9IG9iakxpc3Q7XHJcbiAgICAgICAgICAgIF9jYW52YXMgPSBEb2N1bWVudC5RdWVyeVNlbGVjdG9yPEhUTUxDYW52YXNFbGVtZW50PihcImNhbnZhcyNcIiArIGNhbnZhc0lEKTtcclxuICAgICAgICAgICAgX2RyYXdlciA9IG5ldyBEcmF3ZXIoX2NhbnZhcyk7XHJcbiAgICAgICAgICAgIF9jb2xvciA9IGNvbG9yO1xyXG4gICAgICAgICAgICBtb3VzZSA9IG5ldyBNb3VzZShfY2FudmFzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFJlZnJlc2goKSB7XHJcbiAgICAgICAgICAgIF9kcmF3ZXIuRmlsbFNjcmVlbihfY29sb3IpO1xyXG4gICAgICAgICAgICBmb3JlYWNoIChHYW1lT2JqZWN0IG9iaiBpbiBfbWFpbkRpc3BsYXlMaXN0Lmxpc3QpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBmbG9hdCB4UG9zID0gb2JqLnNjcmVlbkZpeGVkID8gb2JqLnBvc2l0aW9uLlggOiBvYmoucG9zaXRpb24uWCAtIGNhbWVyYS5wb3NpdGlvbi5YO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQgeVBvcyA9IG9iai5zY3JlZW5GaXhlZCA/IG9iai5wb3NpdGlvbi5ZIDogb2JqLnBvc2l0aW9uLlkgLSBjYW1lcmEucG9zaXRpb24uWTtcclxuICAgICAgICAgICAgICAgIF9kcmF3ZXIuRHJhdyh4UG9zLCB5UG9zLCBvYmouc2l6ZS5YLCBvYmouc2l6ZS5ZLCBvYmouYW5nbGUsIG9iai5pbWFnZSxmYWxzZSwxKTtcclxuICAgICAgICAgICAgICAgIERyYXdDaGlsZChvYmosb2JqLnBvc2l0aW9uLlgsb2JqLnBvc2l0aW9uLlksb2JqLmFuZ2xlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIERyYXdDaGlsZChHYW1lT2JqZWN0IG9iaixmbG9hdCB4LGZsb2F0IHksZmxvYXQgYW5nbGUpIHtcclxuXHJcbiAgICAgICAgICAgIGZsb2F0IGFuZ2xlUmFkID0gMDtcclxuICAgICAgICAgICAgZmxvYXQgeGFyQ29zID0gMDtcclxuICAgICAgICAgICAgZmxvYXQgeWFyU2luID0gMDtcclxuXHJcbiAgICAgICAgICAgIGlmIChvYmouZGlzcGxheUxpc3QubGlzdC5Db3VudCAhPSAwKSB7IFxyXG4gICAgICAgICAgICAgICAgYW5nbGVSYWQgPSAoZmxvYXQpKG9iai5hbmdsZSAqIE1hdGguUEkgLyAxODApO1xyXG4gICAgICAgICAgICAgICAgeGFyQ29zID0geCArIChmbG9hdCkoTWF0aC5Db3MoYW5nbGVSYWQpKTtcclxuICAgICAgICAgICAgICAgIHlhclNpbiA9IHkgKyAoZmxvYXQpKE1hdGguU2luKGFuZ2xlUmFkKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvcmVhY2ggKEdhbWVPYmplY3Qgb2JqMiBpbiBvYmouZGlzcGxheUxpc3QubGlzdCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGZsb2F0IG5ld1ggPSBvYmoyLnNjcmVlbkZpeGVkID8geGFyQ29zICsgb2JqMi5wb3NpdGlvbi5YIDogeGFyQ29zICsgb2JqMi5wb3NpdGlvbi5YIC0gY2FtZXJhLnBvc2l0aW9uLlg7XHJcbiAgICAgICAgICAgICAgICBmbG9hdCBuZXdZID0gb2JqMi5zY3JlZW5GaXhlZCA/IHlhclNpbiArIG9iajIucG9zaXRpb24uWSA6IHlhclNpbiArIG9iajIucG9zaXRpb24uWSAtIGNhbWVyYS5wb3NpdGlvbi5ZO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQgbmV3QW5nbGUgPSBvYmoyLmFuZ2xlICsgYW5nbGU7XHJcblxyXG4gICAgICAgICAgICAgICAgX2RyYXdlci5EcmF3KG5ld1gsIG5ld1ksIG9iajIuc2l6ZS5YLCBvYmoyLnNpemUuWSwgbmV3QW5nbGUsIG9iajIuaW1hZ2UsIGZhbHNlLCAxKTtcclxuICAgICAgICAgICAgICAgIERyYXdDaGlsZChvYmoyLG5ld1gsbmV3WSxuZXdBbmdsZSk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5FdmVudHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEtleUJvYXJkRXZlbnRcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgZGVsZWdhdGUgdm9pZCBLZXlQcmVzc0V2ZW50KHN0cmluZyBrZXkpO1xyXG4gICAgICAgIHB1YmxpYyBldmVudCBLZXlQcmVzc0V2ZW50IE9uS2V5UHJlc3NFdmVudHM7XHJcblxyXG4gICAgICAgIHB1YmxpYyBkZWxlZ2F0ZSB2b2lkIEtleURvd25FdmVudChzdHJpbmcga2V5KTtcclxuICAgICAgICBwdWJsaWMgZXZlbnQgS2V5RG93bkV2ZW50IE9uS2V5RG93bkV2ZW50cztcclxuXHJcbiAgICAgICAgcHVibGljIGRlbGVnYXRlIHZvaWQgS2V5VXBFdmVudChzdHJpbmcga2V5KTtcclxuICAgICAgICBwdWJsaWMgZXZlbnQgS2V5VXBFdmVudCBPbktleVVwRXZlbnRzO1xyXG5cclxuICAgICAgICBwdWJsaWMgS2V5Qm9hcmRFdmVudCgpIHtcclxuICAgICAgICAgICAgRG9jdW1lbnQuQWRkRXZlbnRMaXN0ZW5lcihFdmVudFR5cGUuS2V5UHJlc3MsIChnbG9iYWw6OlN5c3RlbS5BY3Rpb248Z2xvYmFsOjpCcmlkZ2UuSHRtbDUuRXZlbnQ+KURvS2V5UHJlc3MpO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5BZGRFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5LZXlEb3duLCAoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6QnJpZGdlLkh0bWw1LkV2ZW50PilEb0tleURvd24pO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5BZGRFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5LZXlVcCwgKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxnbG9iYWw6OkJyaWRnZS5IdG1sNS5FdmVudD4pRG9LZXlVcCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgRG9LZXlQcmVzcyhFdmVudCBlKSB7XHJcbiAgICAgICAgICAgIGlmIChPbktleVByZXNzRXZlbnRzID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgT25LZXlQcmVzc0V2ZW50cy5JbnZva2UoZS5BczxLZXlib2FyZEV2ZW50PigpLktleSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgRG9LZXlEb3duKEV2ZW50IGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoT25LZXlEb3duRXZlbnRzID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgT25LZXlEb3duRXZlbnRzLkludm9rZShlLkFzPEtleWJvYXJkRXZlbnQ+KCkuS2V5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBEb0tleVVwKEV2ZW50IGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoT25LZXlVcEV2ZW50cyA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIE9uS2V5VXBFdmVudHMuSW52b2tlKGUuQXM8S2V5Ym9hcmRFdmVudD4oKS5LZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuU3lzdGVtO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5EaXNwbGF5O1xyXG51c2luZyBHYW1lRW5naW5lSlMuQ29tcG9uZW50cztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzLlRpbGVNYXA7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBHYW1lXHJcbiAgICB7XHJcblxyXG4gICAgICAgIHB1YmxpYyBEcmF3ZXIgZHJhd2VyIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgU2NoZWR1bGVyIHNjaGVkdWxlciB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIFNjZW5lIHNjZW5lIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgTW91c2UgbW91c2UgeyBnZXQgeyByZXR1cm4gc2NlbmUubW91c2U7IH0gfVxyXG5cclxuICAgICAgICBwcml2YXRlIERpc3BsYXlMaXN0IF9kaXNwbGF5TGlzdDtcclxuICAgICAgICBwcml2YXRlIENvbXBvbmVudFJlYWRlciBfY29tcG9uZW50UmVhZGVyO1xyXG5cclxuICAgICAgICBwdWJsaWMgR2FtZShzdHJpbmcgY2FudmFzSUQpIDogdGhpcyhjYW52YXNJRCwgXCIjZmZmXCIpIHsgfVxyXG4gICAgICAgIHB1YmxpYyBHYW1lKHN0cmluZyBjYW52YXNJRCwgc3RyaW5nIGNvbG9yKSB7XHJcbiAgICAgICAgICAgIF9kaXNwbGF5TGlzdCA9IG5ldyBEaXNwbGF5TGlzdCgpO1xyXG4gICAgICAgICAgICBzY2VuZSA9IG5ldyBTY2VuZShfZGlzcGxheUxpc3QsIGNhbnZhc0lELCBjb2xvcik7XHJcbiAgICAgICAgICAgIF9jb21wb25lbnRSZWFkZXIgPSBuZXcgQ29tcG9uZW50UmVhZGVyKF9kaXNwbGF5TGlzdCk7XHJcblxyXG5cclxuICAgICAgICAgICAgc2NoZWR1bGVyID0gbmV3IFNjaGVkdWxlcigpO1xyXG4gICAgICAgICAgICBzY2hlZHVsZXIuQWRkKChnbG9iYWw6OlN5c3RlbS5BY3Rpb24pc2NlbmUuUmVmcmVzaCk7XHJcbiAgICAgICAgICAgIHNjaGVkdWxlci5BZGQoKGdsb2JhbDo6U3lzdGVtLkFjdGlvbilfY29tcG9uZW50UmVhZGVyLlVwZGF0ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBBZGRDaGlsZChUaWxlTWFwIG9iailcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIF9kaXNwbGF5TGlzdC5BZGQob2JqLCBudWxsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZENoaWxkKEdhbWVPYmplY3Qgb2JqKSB7XHJcbiAgICAgICAgICAgIF9kaXNwbGF5TGlzdC5BZGQob2JqLCBudWxsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZENoaWxkQXQoR2FtZU9iamVjdCBvYmosIGludCBpbmRleCkge1xyXG4gICAgICAgICAgICBfZGlzcGxheUxpc3QuQWRkQXQob2JqLCBudWxsLCBpbmRleCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBSZW1vdmVDaGlsZChUaWxlTWFwIG9iaikge1xyXG4gICAgICAgICAgICBfZGlzcGxheUxpc3QuUmVtb3ZlKG9iaik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBSZW1vdmVDaGlsZChHYW1lT2JqZWN0IG9iaikge1xyXG4gICAgICAgICAgICBfZGlzcGxheUxpc3QuUmVtb3ZlKG9iaik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBNb3ZlQ2hpbGQoR2FtZU9iamVjdCBvYmosIGludCBpbmRleCkge1xyXG4gICAgICAgICAgICBfZGlzcGxheUxpc3QuTW92ZShvYmosaW5kZXgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HcmFwaGljcztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkNvbXBvbmVudHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5EaXNwbGF5O1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cy5UaWxlTWFwO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHNcclxue1xyXG4gICAgcHVibGljIGFic3RyYWN0IGNsYXNzIEdhbWVPYmplY3Qge1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGludCBJREluY3JlbWVudGVyID0gMDtcclxuXHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgICAgIC8vLyBQb3NpdGlvbiBvZiB0aGUgR2FtZU9iamVjdC5cclxuICAgICAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIHBvc2l0aW9uIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgICAgIC8vLyBGaXhlZCBvbiB0aGUgc2NyZWVuIGlmIHRydWUuXHJcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICBwdWJsaWMgYm9vbCBzY3JlZW5GaXhlZCB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAvLy8gU2l6ZSBvZiB0aGUgR2FtZU9iamVjdC5cclxuICAgICAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIHNpemUgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAvLy8gT2JqZWN0IEFuZ2xlIGluIGRlZ3JlZXMuXHJcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICBwdWJsaWMgZmxvYXQgYW5nbGUgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICAvLy8gPHN1bW1hcnk+XHJcbiAgICAgICAgLy8vIFVuaXF1ZSBJRCBvZiB0aGUgR2FtZU9iamVjdC5cclxuICAgICAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgICAgIHB1YmxpYyBpbnQgSUQgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcblxyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAvLy8gSW1hZ2Ugb2YgdGhlIEdhbWVPYmplY3QuXHJcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICBwdWJsaWMgVW5pb248SFRNTENhbnZhc0VsZW1lbnQsIEltYWdlLCBTcHJpdGVTaGVldD4gaW1hZ2UgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAvLy8gTGlzdCBvZiB0aGUgb2JqZWN0IGNvbXBvbmVudHMuXHJcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICBwdWJsaWMgRGljdGlvbmFyeTxzdHJpbmcsIENvbXBvbmVudD4gY29tcG9uZW50cyA9IG5ldyBEaWN0aW9uYXJ5PHN0cmluZywgQ29tcG9uZW50PigpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAvLy8gR2FtZSBPYmplY3QgdHlwZS5cclxuICAgICAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgdHlwZSB7IGdldDsgaW50ZXJuYWwgc2V0OyB9XHJcblxyXG4gICAgICAgIGludGVybmFsIERpc3BsYXlMaXN0IGRpc3BsYXlMaXN0ID0gbmV3IERpc3BsYXlMaXN0KCk7XHJcbiAgICAgICAgaW50ZXJuYWwgR2FtZU9iamVjdCBfcGFyZW50O1xyXG5cclxuXHJcblxyXG4gICAgICAgIC8vUHVibGljIE1ldGhvZHNcclxuXHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgICAgIC8vLyBBZGQvTGluayBhIGNvbXBvbmVudCB0byB0aGlzIEdhbWVPYmplY3QuXHJcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICBwdWJsaWMgQ29tcG9uZW50IEFkZENvbXBvbmVudChzdHJpbmcgaW5zdGFuY2VOYW1lLCBDb21wb25lbnQgY29tcG9uZW50KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29tcG9uZW50c1tpbnN0YW5jZU5hbWVdID0gY29tcG9uZW50O1xyXG4gICAgICAgICAgICByZXR1cm4gY29tcG9uZW50c1tpbnN0YW5jZU5hbWVdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkQ2hpbGQoVGlsZU1hcC5UaWxlTWFwIHRpbGVNYXApIHtcclxuICAgICAgICAgICAgZGlzcGxheUxpc3QuQWRkKHRpbGVNYXAsIHRoaXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkQ2hpbGQoR2FtZU9iamVjdCBvYmopIHtcclxuICAgICAgICAgICAgZGlzcGxheUxpc3QuQWRkKG9iaix0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZENoaWxkQXQoR2FtZU9iamVjdCBvYmosIGludCBpbmRleClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGRpc3BsYXlMaXN0LkFkZEF0KG9iaiwgdGhpcywgaW5kZXgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgUmVtb3ZlQ2hpbGQoR2FtZU9iamVjdCBvYmopXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBkaXNwbGF5TGlzdC5SZW1vdmUob2JqKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIE1vdmVDaGlsZChHYW1lT2JqZWN0IG9iaiwgaW50IGluZGV4KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZGlzcGxheUxpc3QuTW92ZShvYmosIGluZGV4KTtcclxuICAgICAgICB9XHJcblxuXHJcbiAgICBcbnByaXZhdGUgYm9vbCBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fc2NyZWVuRml4ZWQ9ZmFsc2U7cHJpdmF0ZSBpbnQgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX0lEPUlESW5jcmVtZW50ZXIrKztwcml2YXRlIHN0cmluZyBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fdHlwZT1cIlVua25vd25cIjt9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHMuVGlsZU1hcFxyXG57XHJcblxyXG4gICAgcHVibGljIGNsYXNzIFRpbGVNYXBcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIFhNTEh0dHBSZXF1ZXN0IHJlcXVlc3Q7XHJcblxyXG4gICAgICAgIGludGVybmFsIERpY3Rpb25hcnk8c3RyaW5nLCBMYXllcj4gbGF5ZXJzIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBpbnRlcm5hbCBTcHJpdGVTaGVldCBfdGlsZVNoZWV0O1xyXG4gICAgICAgIGludGVybmFsIFZlY3RvcjJJIF9zaXplO1xyXG5cclxuICAgICAgICBwdWJsaWMgVmVjdG9yMiBwb3NpdGlvbiB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBUaWxlTWFwKFNwcml0ZVNoZWV0IHRpbGVTaGVldCwgVmVjdG9yMiBwb3MsIFZlY3RvcjJJIHNpemUpIHtcclxuICAgICAgICAgICAgbGF5ZXJzID0gbmV3IERpY3Rpb25hcnk8c3RyaW5nLCBMYXllcj4oKTtcclxuICAgICAgICAgICAgX3RpbGVTaGVldCA9IHRpbGVTaGVldDtcclxuICAgICAgICAgICAgcG9zaXRpb24gPSBwb3M7XHJcbiAgICAgICAgICAgIF9zaXplID0gc2l6ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBMYXllciBBZGRMYXllcihzdHJpbmcgbmFtZSx1aW50IGluZGV4KSB7XHJcbiAgICAgICAgICAgIGxheWVyc1tuYW1lXSA9IG5ldyBMYXllcihpbmRleCwgdGhpcyk7XHJcbiAgICAgICAgICAgIHJldHVybiBsYXllcnNbbmFtZV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBSZW1vdmVMYXllcihzdHJpbmcgbmFtZSkge1xyXG4gICAgICAgICAgICBsYXllcnNbbmFtZV0gPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIExheWVyIEdldExheWVyKHN0cmluZyBuYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBsYXllcnNbbmFtZV07XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgdm9pZCBTZXRDb2xsaXNpb24oc3RyaW5nIGxheWVyLCBpbnQgeCwgaW50IHksIGludCBjb2xsaXNpb25UeXBlKVxyXG57XHJcbiAgICBTZXRDb2xsaXNpb24obGF5ZXIsIG5ldyBWZWN0b3IySSh4LCB5KSwgY29sbGlzaW9uVHlwZSk7XHJcbn0gICAgICAgIHB1YmxpYyB2b2lkIFNldENvbGxpc2lvbihzdHJpbmcgbGF5ZXIsIFZlY3RvcjJJIHBvcywgaW50IGNvbGxpc2lvblR5cGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsYXllcnNbbGF5ZXJdLlNldENvbGxpc2lvbigodWludClwb3MuWCwgKHVpbnQpcG9zLlksIGNvbGxpc2lvblR5cGUpO1xyXG4gICAgICAgIH1cclxucHVibGljIGludCBHZXRDb2xsaXNpb24oc3RyaW5nIGxheWVyLCBpbnQgeCwgaW50IHkpXHJcbntcclxuICAgIHJldHVybiBHZXRDb2xsaXNpb24obGF5ZXIsIG5ldyBWZWN0b3IySSh4LCB5KSk7XHJcbn0gICAgICAgIHB1YmxpYyBpbnQgR2V0Q29sbGlzaW9uKHN0cmluZyBsYXllciwgVmVjdG9yMkkgcG9zKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIGxheWVyc1tsYXllcl0uR2V0Q29sbGlzaW9uKCh1aW50KXBvcy5YLCAodWludClwb3MuWSk7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgdm9pZCBTZXRUaWxlKHN0cmluZyBsYXllciwgaW50IHgsIGludCB5LCBpbnQgdGlsZSlcclxue1xyXG4gICAgU2V0VGlsZShsYXllciwgbmV3IFZlY3RvcjJJKHgsIHkpLCB0aWxlKTtcclxufSAgICAgICAgcHVibGljIHZvaWQgU2V0VGlsZShzdHJpbmcgbGF5ZXIsIFZlY3RvcjJJIHBvcywgaW50IHRpbGUpIHtcclxuICAgICAgICAgICAgbGF5ZXJzW2xheWVyXS5TZXRUaWxlKCh1aW50KXBvcy5YLCAodWludClwb3MuWSwgdGlsZSxmYWxzZSk7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgaW50IEdldFRpbGUoc3RyaW5nIGxheWVyLCBpbnQgeCwgaW50IHkpXHJcbntcclxuICAgIHJldHVybiBHZXRUaWxlKGxheWVyLCBuZXcgVmVjdG9yMkkoeCwgeSkpO1xyXG59ICAgICAgICBwdWJsaWMgaW50IEdldFRpbGUoc3RyaW5nIGxheWVyLCBWZWN0b3IySSBwb3MpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGxheWVyc1tsYXllcl0uR2V0VGlsZSgodWludClwb3MuWCwgKHVpbnQpcG9zLlkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgTG9hZFRpbGVkSnNvbihzdHJpbmcgdXJsLCB1aW50IG51bWJlck9mTGF5ZXJzKSB7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHVpbnQgaSA9IDA7IGkgPCBudW1iZXJPZkxheWVyczsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBBZGRMYXllcihpK1wiXCIsIGkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0Lk9uTG9hZCArPSBMb2FkVGlsZWQ7XHJcbiAgICAgICAgICAgIHJlcXVlc3QuT3BlbihcImdldFwiLHVybCk7XHJcbiAgICAgICAgICAgIHJlcXVlc3QuU2VuZCgpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBMb2FkVGlsZWQoRXZlbnQgZSkge1xyXG4gICAgICAgICAgICBkeW5hbWljIGEgPSBKU09OLlBhcnNlKHJlcXVlc3QuUmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgX3NpemUuWCA9IGEud2lkdGg7XHJcbiAgICAgICAgICAgIF9zaXplLlkgPSBhLmhlaWdodDtcclxuXHJcbiAgICAgICAgICAgIGZvciAodWludCBpID0gMDsgaSA8IGEubGF5ZXJzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBkeW5hbWljIGxheWVyanMgPSBhLmxheWVyc1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBMYXllciBsYXllciA9IGxheWVyc1tpICsgXCJcIl07XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGxheWVyanMgPSBsYXllcmpzLmRhdGE7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChpbnQgaiA9IDA7IGogPCBsYXllcmpzLmxlbmd0aDsgaisrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGludCBpbmRleFggPSBqICUgX3NpemUuWDtcclxuICAgICAgICAgICAgICAgICAgICBpbnQgaW5kZXhZID0gKGludClNYXRoLkZsb29yKChmbG9hdCkoaiAvIF9zaXplLlgpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGF5ZXIuU2V0VGlsZSgodWludClpbmRleFgsICh1aW50KWluZGV4WSwgbGF5ZXJqc1tqXS0xLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuR3JhcGhpY3Ncclxue1xyXG4gICAgcHVibGljIGNsYXNzIERyYXdlclxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIF9jdHg7XHJcbiAgICAgICAgcHJpdmF0ZSBIVE1MQ2FudmFzRWxlbWVudCBfY2FudmFzO1xyXG5cclxuICAgICAgICBwdWJsaWMgRHJhd2VyKEhUTUxDYW52YXNFbGVtZW50IGNhbnZhcykge1xyXG4gICAgICAgICAgICBfY3R4ID0gKENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCljYW52YXMuR2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgICAgICAgICBfY2FudmFzID0gY2FudmFzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgRmlsbFNjcmVlbihzdHJpbmcgY29sb3IpIHtcclxuICAgICAgICAgICAgX2N0eC5GaWxsU3R5bGUgPSBjb2xvcjtcclxuICAgICAgICAgICAgX2N0eC5GaWxsUmVjdCgwLDAsX2NhbnZhcy5XaWR0aCxfY2FudmFzLkhlaWdodCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBEcmF3KGZsb2F0IHgsIGZsb2F0IHksIGZsb2F0IHcsIGZsb2F0IGgsIGZsb2F0IHIsIGR5bmFtaWMgaW1nLCBib29sIGZvbGxvdyA9IGZhbHNlLCBmbG9hdCBhbHBoYSA9IDEpIHtcclxuICAgICAgICAgICAgX2N0eC5JbWFnZVNtb290aGluZ0VuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgX2NhbnZhcy5TdHlsZS5JbWFnZVJlbmRlcmluZyA9IEltYWdlUmVuZGVyaW5nLlBpeGVsYXRlZDtcclxuICAgICAgICAgICAgX2N0eC5TYXZlKCk7XHJcblxyXG4gICAgICAgICAgICBmbG9hdCBzeCA9IDA7XHJcbiAgICAgICAgICAgIGZsb2F0IHN5ID0gMDtcclxuICAgICAgICAgICAgZmxvYXQgc3cgPSB3O1xyXG4gICAgICAgICAgICBmbG9hdCBzaCA9IGg7XHJcblxyXG4gICAgICAgICAgICBpZiAoaW1nID09IG51bGwpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGlmIChpbWcuc3ByaXRlU2l6ZVggIT0gbnVsbCAmJiBpbWcuc3ByaXRlU2l6ZVkgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgU3ByaXRlU2hlZXQgaW1nMiA9IChTcHJpdGVTaGVldClpbWc7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW1nMi5kYXRhLldpZHRoID09IDApIHJldHVybjsgXHJcbiAgICAgICAgICAgICAgICBzeCA9IChpbWcyLmN1cnJlbnRJbmRleCAlIChpbWcyLmRhdGEuV2lkdGggLyBpbWcyLnNwcml0ZVNpemVYKSkgKiBpbWcyLnNwcml0ZVNpemVYO1xyXG4gICAgICAgICAgICAgICAgc3kgPSAoZmxvYXQpTWF0aC5GbG9vcihpbWcyLmN1cnJlbnRJbmRleCAvICgoZG91YmxlKWltZzIuZGF0YS5XaWR0aCAvIGltZzIuc3ByaXRlU2l6ZVgpKSAqIGltZzIuc3ByaXRlU2l6ZVk7XHJcbiAgICAgICAgICAgICAgICBzdyA9IGltZzIuc3ByaXRlU2l6ZVg7XHJcbiAgICAgICAgICAgICAgICBzaCA9IGltZzIuc3ByaXRlU2l6ZVk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChpbWcuZGF0YSAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpbWcgPSBpbWcuZGF0YTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYociAhPSAwKSB7IFxyXG4gICAgICAgICAgICAgICAgLy9PYmplY3QgUm90YXRpb25cclxuICAgICAgICAgICAgICAgIGZsb2F0IG94ID0geCArICh3IC8gMik7XHJcbiAgICAgICAgICAgICAgICBmbG9hdCBveSA9IHkgKyAoaCAvIDIpO1xyXG5cclxuICAgICAgICAgICAgICAgIF9jdHguVHJhbnNsYXRlKG94LCBveSk7XHJcbiAgICAgICAgICAgICAgICBfY3R4LlJvdGF0ZSgocikgKiBNYXRoLlBJIC8gMTgwKTsgLy9kZWdyZWVcclxuICAgICAgICAgICAgICAgIF9jdHguVHJhbnNsYXRlKC1veCwgLW95KTtcclxuICAgICAgICAgICAgICAgIC8vLS0tLS0tLVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBfY3R4LkRyYXdJbWFnZShpbWcsIHN4LCBzeSwgc3csIHNoLCAoaW50KXgsIChpbnQpeSwgdywgaCk7XHJcbiAgICAgICAgICAgIF9jdHguUmVzdG9yZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcblxyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5HcmFwaGljc1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgSW1hZ2VcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgSFRNTEltYWdlRWxlbWVudCBkYXRhIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIEltYWdlKHN0cmluZyBzcmMpIHtcclxuICAgICAgICAgICAgZGF0YSA9IG5ldyBIVE1MSW1hZ2VFbGVtZW50KCk7XHJcbiAgICAgICAgICAgIGRhdGEuU3JjID0gc3JjO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBJbWFnZShIVE1MSW1hZ2VFbGVtZW50IGltZylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGRhdGEgPSBpbWc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5HcmFwaGljc1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgU3ByaXRlU2hlZXRcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgSFRNTEltYWdlRWxlbWVudCBkYXRhIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgdWludCBzcHJpdGVTaXplWCB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIHVpbnQgc3ByaXRlU2l6ZVkgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyB1aW50IGN1cnJlbnRJbmRleCB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBTcHJpdGVTaGVldChJbWFnZSBzcmMsIHVpbnQgc3ByaXRlU2l6ZVgsIHVpbnQgc3ByaXRlU2l6ZVkpIHtcclxuICAgICAgICAgICAgZGF0YSA9IHNyYy5kYXRhO1xyXG4gICAgICAgICAgICB0aGlzLnNwcml0ZVNpemVYID0gc3ByaXRlU2l6ZVg7XHJcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlU2l6ZVkgPSBzcHJpdGVTaXplWTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIFNwcml0ZVNoZWV0KHN0cmluZyBzcmMsIHVpbnQgc3ByaXRlU2l6ZVgsIHVpbnQgc3ByaXRlU2l6ZVkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBkYXRhID0gbmV3IEhUTUxJbWFnZUVsZW1lbnQoKTtcclxuICAgICAgICAgICAgZGF0YS5TcmMgPSBzcmM7XHJcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlU2l6ZVggPSBzcHJpdGVTaXplWDtcclxuICAgICAgICAgICAgdGhpcy5zcHJpdGVTaXplWSA9IHNwcml0ZVNpemVZO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5NYXRoc1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgVmVjdG9yMiB7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IFggeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBZIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIFZlY3RvcjIoKSB7XHJcbiAgICAgICAgICAgIFggPSAwO1xyXG4gICAgICAgICAgICBZID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyKGZsb2F0IFgsIGZsb2F0IFkpIHtcclxuICAgICAgICAgICAgdGhpcy5YID0gWDtcclxuICAgICAgICAgICAgdGhpcy5ZID0gWTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYm9vbCBvcGVyYXRvciA9PSAoVmVjdG9yMiBhLCBWZWN0b3IyIGIpIHtcclxuICAgICAgICAgICAgaWYgKGEuWCA9PSBiLlggJiYgYS5ZID09IGIuWSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYm9vbCBvcGVyYXRvciAhPShWZWN0b3IyIGEsIFZlY3RvcjIgYikge1xyXG4gICAgICAgICAgICBpZiAoYS5YID09IGIuWCAmJiBhLlkgPT0gYi5ZKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLk1hdGhzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBWZWN0b3IySVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBpbnQgWCB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGludCBZIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIFZlY3RvcjJJKGludCBYLCBpbnQgWSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuWCA9IFg7XHJcbiAgICAgICAgICAgIHRoaXMuWSA9IFk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLk1hdGhzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBWZWN0b3I0XHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IFggeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBZIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgWiB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IFcgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgVmVjdG9yNChmbG9hdCBYLCBmbG9hdCBZLCBmbG9hdCBaLCBmbG9hdCBXKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5YID0gWDtcclxuICAgICAgICAgICAgdGhpcy5ZID0gWTtcclxuICAgICAgICAgICAgdGhpcy5aID0gWjtcclxuICAgICAgICAgICAgdGhpcy5XID0gVztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLlN5c3RlbVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgTW91c2VcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgeCB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IHkgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHByaXZhdGUgSFRNTENhbnZhc0VsZW1lbnQgX2NhbnZhcztcclxuXHJcbiAgICAgICAgaW50ZXJuYWwgTW91c2UoSFRNTENhbnZhc0VsZW1lbnQgY2FudmFzKSB7XHJcbiAgICAgICAgICAgIF9jYW52YXMgPSBjYW52YXM7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6QnJpZGdlLkh0bWw1LkV2ZW50PilVcGRhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIFVwZGF0ZShFdmVudCBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQ2xpZW50UmVjdCByZWN0ID0gX2NhbnZhcy5HZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICAgICAgeCA9IGUuQXM8TW91c2VFdmVudD4oKS5DbGllbnRYIC0gKGZsb2F0KXJlY3QuTGVmdDtcclxuICAgICAgICAgICAgeSA9IGUuQXM8TW91c2VFdmVudD4oKS5DbGllbnRZIC0gKGZsb2F0KXJlY3QuVG9wO1xyXG4gICAgICAgIH1cclxuXG4gICAgXG5wcml2YXRlIGZsb2F0IF9fUHJvcGVydHlfX0luaXRpYWxpemVyX194PTA7cHJpdmF0ZSBmbG9hdCBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9feT0wO31cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5TeXN0ZW1cclxue1xyXG4gICAgcHVibGljIGNsYXNzIFNjaGVkdWxlclxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgTGlzdDxBY3Rpb24+IF9hY3Rpb25MaXN0ID0gbmV3IExpc3Q8QWN0aW9uPigpO1xyXG5cclxuICAgICAgICBpbnRlcm5hbCBTY2hlZHVsZXIoKSB7XHJcbiAgICAgICAgICAgIFVwZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkKEFjdGlvbiBtZXRob2RzKSB7XHJcbiAgICAgICAgICAgIF9hY3Rpb25MaXN0LkFkZCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uKSgoKSA9PiBtZXRob2RzKCkpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFVwZGF0ZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3JlYWNoIChBY3Rpb24gYSBpbiBfYWN0aW9uTGlzdCkge1xyXG4gICAgICAgICAgICAgICAgYSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFdpbmRvdy5TZXRUaW1lb3V0KChnbG9iYWw6OlN5c3RlbS5BY3Rpb24pKCgpID0+IFdpbmRvdy5SZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKGdsb2JhbDo6U3lzdGVtLkFjdGlvbilVcGRhdGUpKSwgMTAwMC82MCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HcmFwaGljcztcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkNvbXBvbmVudHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEFuaW1hdG9yIDogQ29tcG9uZW50XHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSBEaWN0aW9uYXJ5PHN0cmluZywgTGlzdDxVbmlvbjxIVE1MQ2FudmFzRWxlbWVudCxJbWFnZSwgdWludD4+PiBfYW5pbWF0aW9ucyB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIHN0cmluZyBjdXJyZW50QW5pbWF0aW9uIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgaW50IGN1cnJlbnRGcmFtZSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGludCBmcHMgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgYm9vbCBwbGF5aW5nIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG4gICAgICAgIHByaXZhdGUgZG91YmxlIGxhc3RUaW1lRnJhbWUgPSAwO1xyXG5cclxuICAgICAgICBwdWJsaWMgQW5pbWF0b3IoR2FtZU9iamVjdCBwYXJlbnQpIDogYmFzZShwYXJlbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBfYW5pbWF0aW9ucyA9IG5ldyBEaWN0aW9uYXJ5PHN0cmluZywgTGlzdDxVbmlvbjxIVE1MQ2FudmFzRWxlbWVudCwgSW1hZ2UsIHVpbnQ+Pj4oKTtcclxuICAgICAgICB9XHJcbnB1YmxpYyB2b2lkIEdvdG9BbmRQbGF5KHN0cmluZyBhbmltYXRpb25OYW1lKVxyXG57XHJcbiAgICBHb3RvQW5kUGxheShhbmltYXRpb25OYW1lLCAwKTtcclxufSAgICAgICAgcHVibGljIHZvaWQgR290b0FuZFBsYXkoc3RyaW5nIGFuaW1hdGlvbk5hbWUsIGludCBmcmFtZSkge1xyXG4gICAgICAgICAgICBjdXJyZW50QW5pbWF0aW9uID0gYW5pbWF0aW9uTmFtZTtcclxuICAgICAgICAgICAgY3VycmVudEZyYW1lID0gZnJhbWU7XHJcbiAgICAgICAgICAgIHBsYXlpbmcgPSB0cnVlO1xyXG4gICAgICAgIH1cclxucHVibGljIHZvaWQgR290b0FuZFN0b3Aoc3RyaW5nIGFuaW1hdGlvbk5hbWUpXHJcbntcclxuICAgIEdvdG9BbmRTdG9wKGFuaW1hdGlvbk5hbWUsIDApO1xyXG59ICAgICAgICBwdWJsaWMgdm9pZCBHb3RvQW5kU3RvcChzdHJpbmcgYW5pbWF0aW9uTmFtZSwgaW50IGZyYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY3VycmVudEFuaW1hdGlvbiA9IGFuaW1hdGlvbk5hbWU7XHJcbiAgICAgICAgICAgIGN1cnJlbnRGcmFtZSA9IGZyYW1lO1xyXG5cclxuICAgICAgICAgICAgaWYgKCEoKHVpbnQpX2FuaW1hdGlvbnNbY3VycmVudEFuaW1hdGlvbl1bY3VycmVudEZyYW1lXSA+PSAwKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcGFyZW50LmltYWdlID0gKEltYWdlKV9hbmltYXRpb25zW2N1cnJlbnRBbmltYXRpb25dW2N1cnJlbnRGcmFtZV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBTcHJpdGVTaGVldCBzaGVldCA9IChTcHJpdGVTaGVldClwYXJlbnQuaW1hZ2U7XHJcbiAgICAgICAgICAgICAgICBzaGVldC5jdXJyZW50SW5kZXggPSAodWludClfYW5pbWF0aW9uc1tjdXJyZW50QW5pbWF0aW9uXVtjdXJyZW50RnJhbWVdO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBwbGF5aW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBTdG9wKCkge1xyXG4gICAgICAgICAgICBwbGF5aW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBTdGFydCgpIHtcclxuICAgICAgICAgICAgcGxheWluZyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBDcmVhdGUoc3RyaW5nIGFuaW1hdGlvbk5hbWUsIExpc3Q8dWludD4gbGlzdCkge1xyXG4gICAgICAgICAgICBMaXN0PFVuaW9uPEhUTUxDYW52YXNFbGVtZW50LCBJbWFnZSwgdWludD4+IHQgPSBuZXcgTGlzdDxVbmlvbjxIVE1MQ2FudmFzRWxlbWVudCwgSW1hZ2UsIHVpbnQ+PigpO1xyXG4gICAgICAgICAgICB0ID0gbGlzdC5BczxMaXN0PFVuaW9uPEhUTUxDYW52YXNFbGVtZW50LCBJbWFnZSwgdWludD4+PigpO1xyXG4gICAgICAgICAgICBDcmVhdGUoYW5pbWF0aW9uTmFtZSwgdCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBDcmVhdGUoc3RyaW5nIGFuaW1hdGlvbk5hbWUsIExpc3Q8SW1hZ2U+IGxpc3QpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBMaXN0PFVuaW9uPEhUTUxDYW52YXNFbGVtZW50LCBJbWFnZSwgdWludD4+IHQgPSBuZXcgTGlzdDxVbmlvbjxIVE1MQ2FudmFzRWxlbWVudCwgSW1hZ2UsIHVpbnQ+PigpO1xyXG4gICAgICAgICAgICB0ID0gbGlzdC5BczxMaXN0PFVuaW9uPEhUTUxDYW52YXNFbGVtZW50LCBJbWFnZSwgdWludD4+PigpO1xyXG4gICAgICAgICAgICBDcmVhdGUoYW5pbWF0aW9uTmFtZSwgdCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBDcmVhdGUoc3RyaW5nIGFuaW1hdGlvbk5hbWUsIExpc3Q8SFRNTENhbnZhc0VsZW1lbnQ+IGxpc3QpIHtcclxuICAgICAgICAgICAgTGlzdDxVbmlvbjxIVE1MQ2FudmFzRWxlbWVudCwgSW1hZ2UsIHVpbnQ+PiB0ID0gbmV3IExpc3Q8VW5pb248SFRNTENhbnZhc0VsZW1lbnQsIEltYWdlLCB1aW50Pj4oKTtcclxuICAgICAgICAgICAgdCA9IGxpc3QuQXM8TGlzdDxVbmlvbjxIVE1MQ2FudmFzRWxlbWVudCwgSW1hZ2UsIHVpbnQ+Pj4oKTtcclxuICAgICAgICAgICAgQ3JlYXRlKGFuaW1hdGlvbk5hbWUsIHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQ3JlYXRlKHN0cmluZyBhbmltYXRpb25OYW1lLCBMaXN0PFVuaW9uPEhUTUxDYW52YXNFbGVtZW50LCBJbWFnZSwgdWludD4+IGxpc3Qpe1xyXG4gICAgICAgICAgICBfYW5pbWF0aW9uc1thbmltYXRpb25OYW1lXSA9IGxpc3Q7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnRlcm5hbCBvdmVycmlkZSB2b2lkIFVwZGF0ZSgpIHtcclxuICAgICAgICAgICAgaWYgKCFwbGF5aW5nKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBkb3VibGUgbm93ID0gRGF0ZVRpbWUuTm93LlN1YnRyYWN0KERhdGVUaW1lLk1pblZhbHVlLkFkZFllYXJzKDIwMTcpKS5Ub3RhbE1pbGxpc2Vjb25kcztcclxuICAgICAgICAgICAgZG91YmxlIGRlbHRhID0gbm93IC0gbGFzdFRpbWVGcmFtZTtcclxuICAgICAgICAgICAgaWYgKGRlbHRhID4gMTAwMC9mcHMpIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRGcmFtZSsrO1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRGcmFtZSA+PSBfYW5pbWF0aW9uc1tjdXJyZW50QW5pbWF0aW9uXS5Db3VudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRGcmFtZSA9IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCEoKHVpbnQpX2FuaW1hdGlvbnNbY3VycmVudEFuaW1hdGlvbl1bY3VycmVudEZyYW1lXSA+PSAwKSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoX2FuaW1hdGlvbnNbY3VycmVudEFuaW1hdGlvbl1bY3VycmVudEZyYW1lXS5HZXRUeXBlKCkgPT0gdHlwZW9mKEltYWdlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQuaW1hZ2UgPSAoSW1hZ2UpX2FuaW1hdGlvbnNbY3VycmVudEFuaW1hdGlvbl1bY3VycmVudEZyYW1lXTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQuaW1hZ2UgPSAoSFRNTENhbnZhc0VsZW1lbnQpX2FuaW1hdGlvbnNbY3VycmVudEFuaW1hdGlvbl1bY3VycmVudEZyYW1lXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBTcHJpdGVTaGVldCBzaGVldCA9IChTcHJpdGVTaGVldClwYXJlbnQuaW1hZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hlZXQuY3VycmVudEluZGV4ID0gKHVpbnQpX2FuaW1hdGlvbnNbY3VycmVudEFuaW1hdGlvbl1bY3VycmVudEZyYW1lXTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBsYXN0VGltZUZyYW1lID0gbm93O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXG5cclxuICAgIFxucHJpdmF0ZSBzdHJpbmcgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX2N1cnJlbnRBbmltYXRpb249XCJcIjtwcml2YXRlIGludCBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fY3VycmVudEZyYW1lPTA7cHJpdmF0ZSBpbnQgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX2Zwcz0xO3ByaXZhdGUgYm9vbCBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fcGxheWluZz1mYWxzZTt9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHMuVGlsZU1hcDtcclxudXNpbmcgR2FtZUVuZ2luZUpTLk1hdGhzO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5Db21wb25lbnRzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBDb2xsaXNpb24gOiBDb21wb25lbnRcclxuICAgIHtcclxuXHJcbiAgICAgICAgcmVhZG9ubHkgTGlzdDxWZWN0b3I0PiBfYm94ZXM7XHJcblxyXG4gICAgICAgIHB1YmxpYyBDb2xsaXNpb24oR2FtZU9iamVjdCBwYXJlbnQpIDogYmFzZShwYXJlbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBfYm94ZXMgPSBuZXcgTGlzdDxWZWN0b3I0PigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkQm94KGZsb2F0IHgxLGZsb2F0IHkxLCBmbG9hdCB3aWR0aCwgZmxvYXQgaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIF9ib3hlcy5BZGQobmV3IFZlY3RvcjQoeDEseTEsd2lkdGgsaGVpZ2h0KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGZsb2F0IFBhcmVudFBvc0NhbGN1bGF0aW9uWChmbG9hdCB4LCBHYW1lT2JqZWN0IHBhcmVudCkge1xyXG4gICAgICAgICAgICBmbG9hdCBhZGRpbmcgPSAwO1xyXG4gICAgICAgICAgICBmbG9hdCBhbmdsZUFkZGluZyA9IDA7XHJcblxyXG4gICAgICAgICAgICBpZiAocGFyZW50Ll9wYXJlbnQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgYWRkaW5nID0gUGFyZW50UG9zQ2FsY3VsYXRpb25YKHBhcmVudC5wb3NpdGlvbi5YLCBwYXJlbnQuX3BhcmVudCk7XHJcbiAgICAgICAgICAgICAgICBhbmdsZUFkZGluZyA9IChmbG9hdCkoTWF0aC5Db3MocGFyZW50Ll9wYXJlbnQuYW5nbGUgKiBNYXRoLlBJIC8gMTgwKSkgKiB4O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAocGFyZW50Ll9wYXJlbnQgPT0gbnVsbCkgYWRkaW5nICs9IHBhcmVudC5wb3NpdGlvbi5YO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuICBhZGRpbmcgKyBhbmdsZUFkZGluZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgZmxvYXQgUGFyZW50UG9zQ2FsY3VsYXRpb25ZKGZsb2F0IHksIEdhbWVPYmplY3QgcGFyZW50KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZmxvYXQgYWRkaW5nID0gMDtcclxuICAgICAgICAgICAgZmxvYXQgYW5nbGVBZGRpbmcgPSAwO1xyXG5cclxuICAgICAgICAgICAgaWYgKHBhcmVudC5fcGFyZW50ICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGFkZGluZyA9IFBhcmVudFBvc0NhbGN1bGF0aW9uWShwYXJlbnQucG9zaXRpb24uWSwgcGFyZW50Ll9wYXJlbnQpO1xyXG4gICAgICAgICAgICAgICAgYW5nbGVBZGRpbmcgPSAoZmxvYXQpKE1hdGguU2luKHBhcmVudC5fcGFyZW50LmFuZ2xlICogTWF0aC5QSSAvIDE4MCkpICogeTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHBhcmVudC5fcGFyZW50ID09IG51bGwpIGFkZGluZyArPSBwYXJlbnQucG9zaXRpb24uWTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBhZGRpbmcgKyBhbmdsZUFkZGluZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBib29sIEhpdFRlc3RPYmplY3QoR2FtZU9iamVjdCBvYmopIHtcclxuXHJcbiAgICAgICAgICAgIGZsb2F0IHB4ID0gcGFyZW50LnBvc2l0aW9uLlg7XHJcbiAgICAgICAgICAgIGZsb2F0IHB5ID0gcGFyZW50LnBvc2l0aW9uLlk7XHJcbiAgICAgICAgICAgIGZsb2F0IHAyeCA9IG9iai5wb3NpdGlvbi5YO1xyXG4gICAgICAgICAgICBmbG9hdCBwMnkgPSBvYmoucG9zaXRpb24uWTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnQuX3BhcmVudCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBweCA9IFBhcmVudFBvc0NhbGN1bGF0aW9uWChwYXJlbnQucG9zaXRpb24uWCwgIHBhcmVudCk7IFxyXG4gICAgICAgICAgICAgICAgcHkgPSBQYXJlbnRQb3NDYWxjdWxhdGlvblkocGFyZW50LnBvc2l0aW9uLlksICBwYXJlbnQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAob2JqLl9wYXJlbnQgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcDJ4ID0gUGFyZW50UG9zQ2FsY3VsYXRpb25YKG9iai5wb3NpdGlvbi5YLCBvYmopO1xyXG4gICAgICAgICAgICAgICAgcDJ5ID0gUGFyZW50UG9zQ2FsY3VsYXRpb25ZKG9iai5wb3NpdGlvbi5ZLCBvYmopO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3JlYWNoIChDb21wb25lbnQgY3AgaW4gb2JqLmNvbXBvbmVudHMuVmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3AuR2V0VHlwZSgpID09IHR5cGVvZihDb2xsaXNpb24pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQ29sbGlzaW9uIGMgPSAoQ29sbGlzaW9uKWNwO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcmVhY2ggKFZlY3RvcjQgYiBpbiBfYm94ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yZWFjaCAoVmVjdG9yNCBiMiBpbiBjLl9ib3hlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGIuWCArIHB4IDwgYjIuWCArIHAyeCArIGIyLlogJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIuWCArIGIuWiArIHB4ID4gYjIuWCArIHAyeCAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYi5ZICsgcHkgPCBiMi5ZICsgYjIuVyArIHAyeSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYi5XICsgYi5ZICsgcHkgID4gYjIuWSArIHAyeSApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgYm9vbCBIaXRUZXN0UG9pbnQoZmxvYXQgeCxmbG9hdCB5KSB7XHJcblxyXG4gICAgICAgICAgICBmbG9hdCBweCA9IHBhcmVudC5wb3NpdGlvbi5YO1xyXG4gICAgICAgICAgICBmbG9hdCBweSA9IHBhcmVudC5wb3NpdGlvbi5ZO1xyXG5cclxuICAgICAgICAgICAgaWYgKHBhcmVudC5fcGFyZW50ICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHB4ID0gUGFyZW50UG9zQ2FsY3VsYXRpb25YKHBhcmVudC5wb3NpdGlvbi5YLCBwYXJlbnQpO1xyXG4gICAgICAgICAgICAgICAgcHkgPSBQYXJlbnRQb3NDYWxjdWxhdGlvblgocGFyZW50LnBvc2l0aW9uLlksIHBhcmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvcmVhY2ggKFZlY3RvcjQgYiBpbiBfYm94ZXMpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmICh4IDwgYi5YICsgcHggKyBiLlogJiZcclxuICAgICAgICAgICAgICAgICAgIHggPiBiLlggKyBweCAmJlxyXG4gICAgICAgICAgICAgICAgICAgeSA8IGIuWSArIHB5ICsgYi5XICYmXHJcbiAgICAgICAgICAgICAgICAgICB5ID4gYi5ZICsgcHkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgYm9vbCBIaXRUZXN0TGF5ZXIoTGF5ZXIgbGF5ZXIsIGludCBjb2xsaWRlclZhbHVlKSB7XHJcblxyXG4gICAgICAgICAgICBmbG9hdCBweCA9IHBhcmVudC5wb3NpdGlvbi5YO1xyXG4gICAgICAgICAgICBmbG9hdCBweSA9IHBhcmVudC5wb3NpdGlvbi5ZO1xyXG5cclxuICAgICAgICAgICAgaWYgKHBhcmVudC5fcGFyZW50ICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHB4ID0gUGFyZW50UG9zQ2FsY3VsYXRpb25YKHBhcmVudC5wb3NpdGlvbi5YLCBwYXJlbnQpO1xyXG4gICAgICAgICAgICAgICAgcHkgPSBQYXJlbnRQb3NDYWxjdWxhdGlvblgocGFyZW50LnBvc2l0aW9uLlksIHBhcmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvcmVhY2ggKFZlY3RvcjQgYiBpbiBfYm94ZXMpXHJcbiAgICAgICAgICAgIHtcclxuXHJcbiAgICAgICAgICAgICAgICBmbG9hdCB0b3RhbFggPSBweCArIGIuWDtcclxuICAgICAgICAgICAgICAgIGZsb2F0IHRvdGFsWSA9IHB5ICsgYi5ZO1xyXG5cclxuICAgICAgICAgICAgICAgIGZsb2F0IHRvdGFsWDIgPSB0b3RhbFggKyBiLlo7XHJcbiAgICAgICAgICAgICAgICBmbG9hdCB0b3RhbFkyID0gdG90YWxZICsgYi5XO1xyXG5cclxuICAgICAgICAgICAgICAgIGludCBsZWZ0X3RpbGUgPSAoaW50KU1hdGguRmxvb3IoKHRvdGFsWCAtIGxheWVyLnBvc2l0aW9uLlgpIC8gbGF5ZXIudGlsZXNXKTtcclxuICAgICAgICAgICAgICAgIGludCByaWdodF90aWxlID0gKGludClNYXRoLkZsb29yKCh0b3RhbFgyIC0gbGF5ZXIucG9zaXRpb24uWCkgLyBsYXllci50aWxlc1cpO1xyXG4gICAgICAgICAgICAgICAgaW50IHRvcF90aWxlID0gKGludClNYXRoLkZsb29yKCh0b3RhbFkgLSBsYXllci5wb3NpdGlvbi5ZKSAvIGxheWVyLnRpbGVzSCk7XHJcbiAgICAgICAgICAgICAgICBpbnQgYm90dG9tX3RpbGUgPSAoaW50KU1hdGguRmxvb3IoKHRvdGFsWTIgLSBsYXllci5wb3NpdGlvbi5ZKSAvIGxheWVyLnRpbGVzSCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChpbnQgeSA9IHRvcF90aWxlLTE7IHkgPD0gYm90dG9tX3RpbGUrMTsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpbnQgeCA9IGxlZnRfdGlsZS0xOyB4IDw9IHJpZ2h0X3RpbGUrMTsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh4IDwgMCB8fCB4ID4gbGF5ZXIuc2l6ZVggLSAxIHx8IHkgPiBsYXllci5zaXplWSAtIDEgfHwgeSA8IDApIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnQgY29sbGlkZXIgPSBsYXllci5jb2xsaXNpb25EYXRhW3gseV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb2xsaWRlciAhPSBjb2xsaWRlclZhbHVlKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsb2F0IHRpbGVYID0gKHggKiBsYXllci50aWxlc1cpICsgbGF5ZXIucG9zaXRpb24uWDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxvYXQgdGlsZVkgPSAoeSAqIGxheWVyLnRpbGVzSCkgKyBsYXllci5wb3NpdGlvbi5ZO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxvYXQgdGlsZVgyID0gdGlsZVggKyBsYXllci50aWxlc1c7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsb2F0IHRpbGVZMiA9IHRpbGVZICsgbGF5ZXIudGlsZXNIO1xyXG5cclxuICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib29sIG92ZXJYID0gKHRvdGFsWCA8IHRpbGVYMikgJiYgKHRvdGFsWDIgPiB0aWxlWCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvb2wgb3ZlclkgPSAodG90YWxZIDwgdGlsZVkyKSAmJiAodG90YWxZMiA+IHRpbGVZKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG92ZXJYICYmIG92ZXJZKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkNvbXBvbmVudHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIE1vdmVtZW50IDogQ29tcG9uZW50XHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIE1vdmVtZW50KEdhbWVPYmplY3QgX3BhcmVudCkgOiBiYXNlKF9wYXJlbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgIH1cclxucHVibGljIHZvaWQgTW92ZVRvd2FyZChWZWN0b3IyIHBvcywgZmxvYXQgc3BlZWQpXHJcbntcclxuICAgIE1vdmVUb3dhcmQocG9zLlgsIHBvcy5ZLCBzcGVlZCk7XHJcbn0gICAgICAgIHB1YmxpYyB2b2lkIE1vdmVUb3dhcmQoZmxvYXQgeCwgZmxvYXQgeSwgZmxvYXQgc3BlZWQpIHtcclxuICAgICAgICAgICAgZmxvYXQgZHggPSB4IC0gcGFyZW50LnBvc2l0aW9uLlg7XHJcbiAgICAgICAgICAgIGZsb2F0IGR5ID0geSAtIHBhcmVudC5wb3NpdGlvbi5ZO1xyXG4gICAgICAgICAgICBmbG9hdCBhbmdsZSA9IChmbG9hdClNYXRoLkF0YW4yKGR5LCBkeCk7XHJcblxyXG4gICAgICAgICAgICBwYXJlbnQucG9zaXRpb24uWCArPSBzcGVlZCAqIChmbG9hdClNYXRoLkNvcyhhbmdsZSk7XHJcbiAgICAgICAgICAgIHBhcmVudC5wb3NpdGlvbi5ZICs9IHNwZWVkICogKGZsb2F0KU1hdGguU2luKGFuZ2xlKTtcclxuICAgICAgICB9XHJcbnB1YmxpYyB2b2lkIExvb2tBdChWZWN0b3IyIHBvcylcclxue1xyXG4gICAgTG9va0F0KHBvcy5YLCBwb3MuWSk7XHJcbn0gICAgICAgIHB1YmxpYyB2b2lkIExvb2tBdChmbG9hdCB4LGZsb2F0IHkpIHtcclxuICAgICAgICAgICAgZmxvYXQgeDIgPSBwYXJlbnQucG9zaXRpb24uWCAtIHg7XHJcbiAgICAgICAgICAgIGZsb2F0IHkyID0geSAtIHBhcmVudC5wb3NpdGlvbi5ZO1xyXG4gICAgICAgICAgICBmbG9hdCBhbmdsZSA9IChmbG9hdClNYXRoLkF0YW4yKHgyLCB5Mik7XHJcbiAgICAgICAgICAgIHBhcmVudC5hbmdsZSA9IGFuZ2xlICogKGZsb2F0KSgxODAvTWF0aC5QSSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5NYXRocztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuQ29tcG9uZW50cztcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBTcHJpdGUgOiBHYW1lT2JqZWN0XHJcbiAgICB7XHJcbiAgICAgICAgLy9Db25zdHJ1Y3RvclxyXG4gICAgICAgIHB1YmxpYyBTcHJpdGUoVmVjdG9yMiBwb3NpdGlvbiwgVmVjdG9yMiBzaXplLCBVbmlvbjxIVE1MQ2FudmFzRWxlbWVudCwgSW1hZ2UsIFNwcml0ZVNoZWV0PiBpbWFnZSkge1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XHJcbiAgICAgICAgICAgIHRoaXMuc2l6ZSA9IHNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UgPSBpbWFnZTtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gXCJTcHJpdGVcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLk1hdGhzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR3JhcGhpY3M7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5Db21wb25lbnRzO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFRleHRBcmVhIDogR2FtZU9iamVjdFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgdGV4dCB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgc3RyaW5nIGNvbG9yIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgICAgIC8vLyBJbiBwaXhlbHMsIEV4YW1wbGU6IDE0XHJcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICBwdWJsaWMgaW50IGZvbnRTaXplIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgICAgIC8vLyBFeGFtcGxlOiBBcmlhbFxyXG4gICAgICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICAgICAgcHVibGljIHN0cmluZyBmb250IHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgLy9Db25zdHJ1Y3RvclxyXG4gICAgICAgIHB1YmxpYyBUZXh0QXJlYShWZWN0b3IyIHBvc2l0aW9uLCBWZWN0b3IyIHNpemUsIHN0cmluZyBjb2xvciA9IFwiXCIsIGludCBmb250U2l6ZSA9IDE0LCBzdHJpbmcgZm9udCA9IFwiXCIpOnRoaXMocG9zaXRpb24sIHNpemUpIHtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG4gICAgICAgICAgICB0aGlzLnNpemUgPSBzaXplO1xyXG4gICAgICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XHJcbiAgICAgICAgICAgIHRoaXMuZm9udFNpemUgPSBmb250U2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5mb250ID0gZm9udDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgVGV4dEFyZWEoVmVjdG9yMiBwb3NpdGlvbiwgVmVjdG9yMiBzaXplKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcclxuICAgICAgICAgICAgdGhpcy5zaXplID0gc2l6ZTtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gXCJUZXh0QXJlYVwiO1xyXG5cclxuICAgICAgICAgICAgSFRNTENhbnZhc0VsZW1lbnQgY2FudmFzID0gKEhUTUxDYW52YXNFbGVtZW50KURvY3VtZW50LkNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcbiAgICAgICAgICAgIGNhbnZhcy5XaWR0aCA9IChpbnQpTWF0aC5GbG9vcihzaXplLlgpO1xyXG4gICAgICAgICAgICBjYW52YXMuSGVpZ2h0ID0gKGludClNYXRoLkZsb29yKHNpemUuWSk7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UgPSBjYW52YXM7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgRXJhc2VBbGwoKSB7XHJcbiAgICAgICAgICAgIEhUTUxDYW52YXNFbGVtZW50IGNhbnZhcyA9IChIVE1MQ2FudmFzRWxlbWVudClpbWFnZTtcclxuICAgICAgICAgICAgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGN0eCA9IChDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpY2FudmFzLkdldENvbnRleHQoXCIyZFwiKTtcclxuICAgICAgICAgICAgY3R4LkNsZWFyUmVjdCgwLCAwLCBjYW52YXMuV2lkdGgsIGNhbnZhcy5IZWlnaHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgUmV3cml0ZShzdHJpbmcgdGV4dCwgaW50IHggPSAwLCBpbnQgeSA9IDApIHtcclxuICAgICAgICAgICAgRXJhc2VBbGwoKTtcclxuICAgICAgICAgICAgV3JpdGUodGV4dCx4LHkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgV3JpdGUoc3RyaW5nIHRleHQsIGludCB4ID0gMCwgaW50IHkgPSAwKSB7XHJcbiAgICAgICAgICAgIEhUTUxDYW52YXNFbGVtZW50IGNhbnZhcyA9IChIVE1MQ2FudmFzRWxlbWVudClpbWFnZTtcclxuICAgICAgICAgICAgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGN0eCA9IChDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpY2FudmFzLkdldENvbnRleHQoXCIyZFwiKTtcclxuICAgICAgICAgICAgY3R4LkZpbGxTdHlsZSA9IGNvbG9yO1xyXG4gICAgICAgICAgICBjdHguRm9udCA9IGZvbnRTaXplICsgXCJweCBcIiArIGZvbnQ7XHJcbiAgICAgICAgICAgIGN0eC5GaWxsVGV4dCh0ZXh0LCB4LCB5K2ZvbnRTaXplKTtcclxuICAgICAgICB9XHJcblxuICAgIFxucHJpdmF0ZSBzdHJpbmcgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX3RleHQ9XCJcIjtwcml2YXRlIHN0cmluZyBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fY29sb3I9XCJcIjtwcml2YXRlIGludCBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fZm9udFNpemU9MTQ7cHJpdmF0ZSBzdHJpbmcgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX2ZvbnQ9XCJcIjt9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzLlRpbGVNYXBcclxue1xyXG4gICAgcHVibGljIGNsYXNzIExheWVyIDogR2FtZU9iamVjdFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyB1aW50IGluZGV4IHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgaW50WyxdIGRhdGEgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIGludGVybmFsIGludFssXSBjb2xsaXNpb25EYXRhIHsgZ2V0OyBzZXQ7fVxyXG5cclxuICAgICAgICBwdWJsaWMgdWludCB0aWxlc1cgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIHVpbnQgdGlsZXNIIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyB1aW50IHNpemVYIHsgZ2V0OyBwcml2YXRlIHNldDt9XHJcbiAgICAgICAgcHVibGljIHVpbnQgc2l6ZVkgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgU3ByaXRlU2hlZXQgX3NoZWV0O1xyXG5cclxuICAgICAgICBwdWJsaWMgTGF5ZXIodWludCBfaW5kZXgsIFRpbGVNYXAgdGlsZU1hcCkge1xyXG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBcIlRpbGVtYXBMYXllclwiO1xyXG4gICAgICAgICAgICBpbmRleCA9IF9pbmRleDtcclxuICAgICAgICAgICAgdGlsZXNXID0gdGlsZU1hcC5fdGlsZVNoZWV0LnNwcml0ZVNpemVYO1xyXG4gICAgICAgICAgICB0aWxlc0ggPSB0aWxlTWFwLl90aWxlU2hlZXQuc3ByaXRlU2l6ZVk7XHJcbiAgICAgICAgICAgIHNpemVYID0gKHVpbnQpdGlsZU1hcC5fc2l6ZS5YO1xyXG4gICAgICAgICAgICBzaXplWSA9ICh1aW50KXRpbGVNYXAuX3NpemUuWTtcclxuICAgICAgICAgICAgZGF0YSA9IG5ldyBpbnRbc2l6ZVgsIHNpemVZXTtcclxuICAgICAgICAgICAgY29sbGlzaW9uRGF0YSA9IG5ldyBpbnRbc2l6ZVgsIHNpemVZXTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZVg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzaXplWTsgaisrKXtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhW2ksIGpdID0gLTE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHBvc2l0aW9uID0gdGlsZU1hcC5wb3NpdGlvbjtcclxuICAgICAgICAgICAgc2l6ZSA9IG5ldyBWZWN0b3IyKHNpemVYICogdGlsZXNXLCBzaXplWSAqIHRpbGVzSCk7XHJcblxyXG4gICAgICAgICAgICBIVE1MQ2FudmFzRWxlbWVudCBjYW52YXMgPSAoSFRNTENhbnZhc0VsZW1lbnQpRG9jdW1lbnQuQ3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcclxuICAgICAgICAgICAgY2FudmFzLldpZHRoID0gKGludClNYXRoLkZsb29yKHNpemUuWCk7XHJcbiAgICAgICAgICAgIGNhbnZhcy5IZWlnaHQgPSAoaW50KU1hdGguRmxvb3Ioc2l6ZS5ZKTtcclxuICAgICAgICAgICAgaW1hZ2UgPSBjYW52YXM7XHJcblxyXG4gICAgICAgICAgICBfc2hlZXQgPSB0aWxlTWFwLl90aWxlU2hlZXQ7XHJcbiAgICAgICAgICAgIF9zaGVldC5kYXRhLk9uTG9hZCArPSBDb25zdHJ1Y3Q7XHJcblxyXG4gICAgICAgIH1cclxucHVibGljIHZvaWQgQ29uc3RydWN0KClcclxue1xyXG4gICAgQ29uc3RydWN0KG5ldyBFdmVudChcIlwiKSk7XHJcbn0gICAgICAgIGludGVybmFsIHZvaWQgQ29uc3RydWN0KEV2ZW50IGUpIHtcclxuICAgICAgICAgICAgZm9yICh1aW50IHkgPSAwOyB5IDwgc2l6ZVk7IHkrKykge1xyXG4gICAgICAgICAgICAgICAgZm9yICh1aW50IHggPSAwOyB4IDwgc2l6ZVg7IHgrKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgU2V0VGlsZSh4LHksZGF0YVt4LHldLHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnRlcm5hbCB2b2lkIFNldFRpbGUodWludCB4LCB1aW50IHksIGludCB0aWxlLCBib29sIGJ5UGFzc09sZCkge1xyXG4gICAgICAgICAgICBpZiAoISh4ID49IDAgJiYgeCA8PSBzaXplWCAmJiB5ID49IDAgJiYgeSA8PSBzaXplWSkpIHJldHVybjtcclxuICAgICAgICAgICAgaW50IG9sZFRpbGUgPSBkYXRhW3gsIHldO1xyXG5cclxuICAgICAgICAgICAgSFRNTENhbnZhc0VsZW1lbnQgY2FudmFzID0gKEhUTUxDYW52YXNFbGVtZW50KWltYWdlO1xyXG4gICAgICAgICAgICBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgY3R4ID0gKENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCljYW52YXMuR2V0Q29udGV4dChcIjJkXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRpbGUgPT0gLTEgJiYgb2xkVGlsZSAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgZGF0YVt4LCB5XSA9IHRpbGU7XHJcbiAgICAgICAgICAgICAgICBjdHguQ2xlYXJSZWN0KHgqdGlsZXNXLHkqdGlsZXNILHRpbGVzVyx0aWxlc0gpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aWxlID09IC0xKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmKG9sZFRpbGUgIT0gdGlsZSB8fCBieVBhc3NPbGQpIHsgXHJcbiAgICAgICAgICAgICAgICBkYXRhW3gsIHldID0gdGlsZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaW1hZ2UgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQgY2FzZV94ID0gKGRhdGFbeCwgeV0gJSB0aWxlc1cpICogdGlsZXNXO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQgY2FzZV95ID0gKGZsb2F0KU1hdGguRmxvb3IoKGZsb2F0KWRhdGFbeCwgeV0gLyB0aWxlc1cpICogdGlsZXNIO1xyXG5cclxuICAgICAgICAgICAgICAgIGN0eC5EcmF3SW1hZ2UoX3NoZWV0LmRhdGEsIGNhc2VfeCwgY2FzZV95LCB0aWxlc1csIHRpbGVzSCwgeCAqIHRpbGVzVywgeSAqIHRpbGVzSCwgdGlsZXNXLCB0aWxlc0gpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW50ZXJuYWwgaW50IEdldFRpbGUodWludCB4LCB1aW50IHkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRhdGFbeCwgeV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnRlcm5hbCB2b2lkIFNldENvbGxpc2lvbih1aW50IHgsIHVpbnQgeSwgaW50IGNvbGxpc2lvbikge1xyXG4gICAgICAgICAgICBjb2xsaXNpb25EYXRhW3gsIHldID0gY29sbGlzaW9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW50ZXJuYWwgaW50IEdldENvbGxpc2lvbih1aW50IHgsIHVpbnQgeSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBjb2xsaXNpb25EYXRhW3gsIHldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXQp9Cg==
