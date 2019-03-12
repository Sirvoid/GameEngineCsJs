/**
 * @version 1.0.0.0
 * @copyright Copyright ©  2018
 * @compiler Bridge.NET 17.6.0
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
                        this._drawer.Draw(xPos, yPos, obj.size.X, obj.size.Y, obj.angle, obj.pivot.X, obj.pivot.Y, obj.image, false, 1);
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

                        this._drawer.Draw(newX, newY, obj2.size.X, obj2.size.Y, newAngle, obj2.pivot.X, obj2.pivot.Y, obj2.image, false, 1);
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

    Bridge.define("GameEngineJS.Events.MouseButtonEvent", {
        events: {
            OnMouseDownEvents: null,
            OnMouseUpEvents: null
        },
        ctors: {
            ctor: function () {
                this.$initialize();
                document.addEventListener("mousedown", Bridge.fn.cacheBind(this, this.DoMouseDown));
                document.addEventListener("mouseup", Bridge.fn.cacheBind(this, this.DoMouseUp));
            }
        },
        methods: {
            DoMouseDown: function (e) {
                if (Bridge.staticEquals(this.OnMouseDownEvents, null)) {
                    return;
                }
                this.OnMouseDownEvents(e.button);
            },
            DoMouseUp: function (e) {
                if (Bridge.staticEquals(this.OnMouseUpEvents, null)) {
                    return;
                }
                this.OnMouseUpEvents(e.button);
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
             * Pivot for angle.
             *
             * @instance
             * @public
             * @memberof GameEngineJS.GameObjects.GameObject
             * @function pivot
             * @type GameEngineJS.Maths.Vector2
             */
            pivot: null,
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
            Draw: function (x, y, w, h, r, pivotX, pivotY, img, follow, alpha) {
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
                    var ox = x + pivotX;
                    var oy = y + pivotY;

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
                    return window.requestAnimationFrame(Bridge.fn.cacheBind(this, this.Update));
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
                this.LookAt$2(x, y, this.parent.position.X, this.parent.position.Y);
            },
            LookAt$2: function (x, y, centerX, centerY) {
                var x2 = centerX - x;
                var y2 = y - centerY;
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
                this.pivot = new GameEngineJS.Maths.Vector2.$ctor1(size.X / 2, size.Y / 2);
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
                this.pivot = new GameEngineJS.Maths.Vector2.$ctor1(size.X / 2, size.Y / 2);
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
                this.pivot = new GameEngineJS.Maths.Vector2.$ctor1(this.size.X / 2, this.size.Y / 2);

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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJHYW1lRW5naW5lSlMuanMiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbIkNvbXBvbmVudHMvQ29tcG9uZW50LmNzIiwiQ29tcG9uZW50cy9Db21wb25lbnRSZWFkZXIuY3MiLCJEaXNwbGF5L0NhbWVyYS5jcyIsIkRpc3BsYXkvRGlzcGxheUxpc3QuY3MiLCJEaXNwbGF5L1NjZW5lLmNzIiwiRXZlbnRzL0tleUJvYXJkRXZlbnQuY3MiLCJFdmVudHMvTW91c2VFdmVudC5jcyIsIkdhbWUuY3MiLCJHYW1lT2JqZWN0cy9HYW1lT2JqZWN0LmNzIiwiR2FtZU9iamVjdHMvVGlsZU1hcC9UaWxlTWFwLmNzIiwiR3JhcGhpY3MvRHJhd2VyLmNzIiwiR3JhcGhpY3MvSW1hZ2UuY3MiLCJHcmFwaGljcy9TcHJpdGVTaGVldC5jcyIsIk1hdGhzL1ZlY3RvcjIuY3MiLCJNYXRocy9WZWN0b3IySS5jcyIsIk1hdGhzL1ZlY3RvcjQuY3MiLCJTeXN0ZW0vTW91c2UuY3MiLCJTeXN0ZW0vU2NoZWR1bGVyLmNzIiwiQ29tcG9uZW50cy9BbmltYXRvci5jcyIsIkNvbXBvbmVudHMvQ29sbGlzaW9uLmNzIiwiQ29tcG9uZW50cy9Nb3ZlbWVudC5jcyIsIkdhbWVPYmplY3RzL1Nwcml0ZS5jcyIsIkdhbWVPYmplY3RzL1RleHRBcmVhLmNzIiwiR2FtZU9iamVjdHMvVGlsZU1hcC9MYXllci5jcyJdLAogICJuYW1lcyI6IFsiIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs0QkFRMkJBOztnQkFDZkEsY0FBY0E7Ozs7Ozs7Ozs7Ozs7NEJDRU9BOztnQkFDckJBLG1CQUFjQTs7Ozs7O2dCQUlkQSwwQkFBMkJBOzs7O3dCQUN2QkEsMkJBQXNEQTs7OztnQ0FFbERBOzs7Ozs7O3dCQUVKQSxxQkFBZ0JBOzs7Ozs7Ozt1Q0FJS0E7O2dCQUN6QkEsSUFBSUE7b0JBQTZCQTs7Z0JBQ2pDQSwwQkFBNEJBOzs7O3dCQUV4QkEsMkJBQXNEQTs7OztnQ0FF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QTs7b0NBR1FBLEdBQVFBLEdBQVFBO2dCQUN2Q0Esd0JBQWNBLEdBQUdBLElBQUtBOztvQ0FHQUEsR0FBUUE7Z0JBRTlCQSxPQUFPQSx3QkFBY0EsR0FBR0EiLAogICJzb3VyY2VzQ29udGVudCI6IFsidXNpbmcgU3lzdGVtO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHM7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkNvbXBvbmVudHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIENvbXBvbmVudFxyXG4gICAge1xyXG4gICAgICAgIGludGVybmFsIEdhbWVPYmplY3QgcGFyZW50IHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBpbnRlcm5hbCBDb21wb25lbnQoR2FtZU9iamVjdCBwYXJlbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnRlcm5hbCB2aXJ0dWFsIHZvaWQgVXBkYXRlKCkge31cclxuXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkRpc3BsYXk7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuQ29tcG9uZW50c1xyXG57XHJcbiAgICBpbnRlcm5hbCBjbGFzcyBDb21wb25lbnRSZWFkZXJcclxuICAgIHtcclxuICAgICAgICBpbnRlcm5hbCBEaXNwbGF5TGlzdCBkaXNwbGF5TGlzdCB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIGludGVybmFsIENvbXBvbmVudFJlYWRlcihEaXNwbGF5TGlzdCBsaXN0KSB7XHJcbiAgICAgICAgICAgIGRpc3BsYXlMaXN0ID0gbGlzdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGludGVybmFsIHZvaWQgVXBkYXRlKCkge1xyXG4gICAgICAgICAgICBmb3JlYWNoIChHYW1lT2JqZWN0IG9iaiBpbiBkaXNwbGF5TGlzdC5saXN0KSB7XHJcbiAgICAgICAgICAgICAgICBmb3JlYWNoIChLZXlWYWx1ZVBhaXI8c3RyaW5nLCBDb21wb25lbnQ+IGNvbXBvbmVudCBpbiBvYmouY29tcG9uZW50cylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuVmFsdWUuVXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBSZWN1cnNpdmVVcGRhdGUob2JqKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIFJlY3Vyc2l2ZVVwZGF0ZShHYW1lT2JqZWN0IG9iaikge1xyXG4gICAgICAgICAgICBpZiAoZGlzcGxheUxpc3QubGlzdC5Db3VudCA8PSAwKSByZXR1cm47XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKEdhbWVPYmplY3Qgb2JqMiBpbiBvYmouZGlzcGxheUxpc3QubGlzdClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZm9yZWFjaCAoS2V5VmFsdWVQYWlyPHN0cmluZywgQ29tcG9uZW50PiBjb21wb25lbnQgaW4gb2JqMi5jb21wb25lbnRzKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5WYWx1ZS5VcGRhdGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFJlY3Vyc2l2ZVVwZGF0ZShvYmoyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxudXNpbmcgR2FtZUVuZ2luZUpTLk1hdGhzO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5EaXNwbGF5XHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBDYW1lcmFcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgVmVjdG9yMiBwb3NpdGlvbiB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IHJvdGF0aW9uIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIENhbWVyYSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwb3NpdGlvbiA9IG5ldyBWZWN0b3IyKDAsMCk7XHJcbiAgICAgICAgICAgIHJvdGF0aW9uID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBDYW1lcmEoVmVjdG9yMiBwb3NpdGlvbixmbG9hdCByb3RhdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XHJcbiAgICAgICAgICAgIHRoaXMucm90YXRpb24gPSByb3RhdGlvbjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzLlRpbGVNYXA7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkRpc3BsYXlcclxue1xyXG4gICAgcHVibGljIGNsYXNzIERpc3BsYXlMaXN0XHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIExpc3Q8R2FtZU9iamVjdD4gbGlzdCB7IGdldDsgc2V0OyB9ICBcclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkKFRpbGVNYXAgb2JqLCBHYW1lT2JqZWN0IHBhcmVudCkge1xyXG4gICAgICAgICAgICBmb3JlYWNoIChMYXllciBsIGluIG9iai5sYXllcnMuVmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgICBBZGRBdChsLHBhcmVudCwoaW50KWwuaW5kZXgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZChHYW1lT2JqZWN0IG9iaixHYW1lT2JqZWN0IHBhcmVudCkge1xyXG4gICAgICAgICAgICBsaXN0LkFkZChvYmopO1xyXG4gICAgICAgICAgICBvYmouX3BhcmVudCA9IHBhcmVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZEF0KEdhbWVPYmplY3Qgb2JqLEdhbWVPYmplY3QgcGFyZW50LCBpbnQgaW5kZXgpIHtcclxuICAgICAgICAgICAgbGlzdC5JbnNlcnQoaW5kZXgsIG9iaik7XHJcbiAgICAgICAgICAgIG9iai5fcGFyZW50ID0gcGFyZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgUmVtb3ZlKFRpbGVNYXAgb2JqKSB7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKExheWVyIGwgaW4gb2JqLmxheWVycy5WYWx1ZXMpIHtcclxuICAgICAgICAgICAgICAgIGxpc3QuUmVtb3ZlKGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBSZW1vdmUoR2FtZU9iamVjdCBvYmopXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsaXN0LlJlbW92ZShvYmopO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgTW92ZShHYW1lT2JqZWN0IG9iaiwgaW50IGluZGV4KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW50IG9sZEluZGV4ID0gbGlzdC5JbmRleE9mKG9iaik7XHJcbiAgICAgICAgICAgIGxpc3QuUmVtb3ZlQXQob2xkSW5kZXgpO1xyXG4gICAgICAgICAgICBsaXN0Lkluc2VydChpbmRleCxvYmopO1xyXG4gICAgICAgIH1cclxuXG5cclxuICAgIFxucHJpdmF0ZSBMaXN0PEdhbWVPYmplY3Q+IF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19saXN0PW5ldyBMaXN0PEdhbWVPYmplY3Q+KCkgO31cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5TeXN0ZW07XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkRpc3BsYXlcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFNjZW5lXHJcbiAgICB7XHJcblxyXG4gICAgICAgIHB1YmxpYyBDYW1lcmEgY2FtZXJhIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgTW91c2UgbW91c2UgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwcml2YXRlIERpc3BsYXlMaXN0IF9tYWluRGlzcGxheUxpc3Q7XHJcbiAgICAgICAgcHJpdmF0ZSBEcmF3ZXIgX2RyYXdlcjtcclxuICAgICAgICBwcml2YXRlIEhUTUxDYW52YXNFbGVtZW50IF9jYW52YXM7XHJcbiAgICAgICAgcHJpdmF0ZSBzdHJpbmcgX2NvbG9yO1xyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBwdWJsaWMgU2NlbmUoRGlzcGxheUxpc3Qgb2JqTGlzdCxzdHJpbmcgY2FudmFzSUQsc3RyaW5nIGNvbG9yKSB7XHJcbiAgICAgICAgICAgIGNhbWVyYSA9IG5ldyBDYW1lcmEoKTtcclxuICAgICAgICAgICAgX21haW5EaXNwbGF5TGlzdCA9IG9iakxpc3Q7XHJcbiAgICAgICAgICAgIF9jYW52YXMgPSBEb2N1bWVudC5RdWVyeVNlbGVjdG9yPEhUTUxDYW52YXNFbGVtZW50PihcImNhbnZhcyNcIiArIGNhbnZhc0lEKTtcclxuICAgICAgICAgICAgX2RyYXdlciA9IG5ldyBEcmF3ZXIoX2NhbnZhcyk7XHJcbiAgICAgICAgICAgIF9jb2xvciA9IGNvbG9yO1xyXG4gICAgICAgICAgICBtb3VzZSA9IG5ldyBNb3VzZShfY2FudmFzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFJlZnJlc2goKSB7XHJcbiAgICAgICAgICAgIF9kcmF3ZXIuRmlsbFNjcmVlbihfY29sb3IpO1xyXG4gICAgICAgICAgICBmb3JlYWNoIChHYW1lT2JqZWN0IG9iaiBpbiBfbWFpbkRpc3BsYXlMaXN0Lmxpc3QpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBmbG9hdCB4UG9zID0gb2JqLnNjcmVlbkZpeGVkID8gb2JqLnBvc2l0aW9uLlggOiBvYmoucG9zaXRpb24uWCAtIGNhbWVyYS5wb3NpdGlvbi5YO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQgeVBvcyA9IG9iai5zY3JlZW5GaXhlZCA/IG9iai5wb3NpdGlvbi5ZIDogb2JqLnBvc2l0aW9uLlkgLSBjYW1lcmEucG9zaXRpb24uWTtcclxuICAgICAgICAgICAgICAgIF9kcmF3ZXIuRHJhdyh4UG9zLCB5UG9zLCBvYmouc2l6ZS5YLCBvYmouc2l6ZS5ZLCBvYmouYW5nbGUsIG9iai5waXZvdC5YLCBvYmoucGl2b3QuWSwgb2JqLmltYWdlLGZhbHNlLDEpO1xyXG4gICAgICAgICAgICAgICAgRHJhd0NoaWxkKG9iaixvYmoucG9zaXRpb24uWCxvYmoucG9zaXRpb24uWSxvYmouYW5nbGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgRHJhd0NoaWxkKEdhbWVPYmplY3Qgb2JqLGZsb2F0IHgsZmxvYXQgeSxmbG9hdCBhbmdsZSkge1xyXG5cclxuICAgICAgICAgICAgZmxvYXQgYW5nbGVSYWQgPSAwO1xyXG4gICAgICAgICAgICBmbG9hdCB4YXJDb3MgPSAwO1xyXG4gICAgICAgICAgICBmbG9hdCB5YXJTaW4gPSAwO1xyXG5cclxuICAgICAgICAgICAgaWYgKG9iai5kaXNwbGF5TGlzdC5saXN0LkNvdW50ICE9IDApIHsgXHJcbiAgICAgICAgICAgICAgICBhbmdsZVJhZCA9IChmbG9hdCkob2JqLmFuZ2xlICogTWF0aC5QSSAvIDE4MCk7XHJcbiAgICAgICAgICAgICAgICB4YXJDb3MgPSB4ICsgKGZsb2F0KShNYXRoLkNvcyhhbmdsZVJhZCkpO1xyXG4gICAgICAgICAgICAgICAgeWFyU2luID0geSArIChmbG9hdCkoTWF0aC5TaW4oYW5nbGVSYWQpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yZWFjaCAoR2FtZU9iamVjdCBvYmoyIGluIG9iai5kaXNwbGF5TGlzdC5saXN0KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZmxvYXQgbmV3WCA9IG9iajIuc2NyZWVuRml4ZWQgPyB4YXJDb3MgKyBvYmoyLnBvc2l0aW9uLlggOiB4YXJDb3MgKyBvYmoyLnBvc2l0aW9uLlggLSBjYW1lcmEucG9zaXRpb24uWDtcclxuICAgICAgICAgICAgICAgIGZsb2F0IG5ld1kgPSBvYmoyLnNjcmVlbkZpeGVkID8geWFyU2luICsgb2JqMi5wb3NpdGlvbi5ZIDogeWFyU2luICsgb2JqMi5wb3NpdGlvbi5ZIC0gY2FtZXJhLnBvc2l0aW9uLlk7XHJcbiAgICAgICAgICAgICAgICBmbG9hdCBuZXdBbmdsZSA9IG9iajIuYW5nbGUgKyBhbmdsZTtcclxuXHJcbiAgICAgICAgICAgICAgICBfZHJhd2VyLkRyYXcobmV3WCwgbmV3WSwgb2JqMi5zaXplLlgsIG9iajIuc2l6ZS5ZLCBuZXdBbmdsZSwgb2JqMi5waXZvdC5YLCBvYmoyLnBpdm90LlksIG9iajIuaW1hZ2UsIGZhbHNlLCAxKTtcclxuICAgICAgICAgICAgICAgIERyYXdDaGlsZChvYmoyLG5ld1gsbmV3WSxuZXdBbmdsZSk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5FdmVudHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEtleUJvYXJkRXZlbnRcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgZGVsZWdhdGUgdm9pZCBLZXlQcmVzc0V2ZW50KHN0cmluZyBrZXkpO1xyXG4gICAgICAgIHB1YmxpYyBldmVudCBLZXlQcmVzc0V2ZW50IE9uS2V5UHJlc3NFdmVudHM7XHJcblxyXG4gICAgICAgIHB1YmxpYyBkZWxlZ2F0ZSB2b2lkIEtleURvd25FdmVudChzdHJpbmcga2V5KTtcclxuICAgICAgICBwdWJsaWMgZXZlbnQgS2V5RG93bkV2ZW50IE9uS2V5RG93bkV2ZW50cztcclxuXHJcbiAgICAgICAgcHVibGljIGRlbGVnYXRlIHZvaWQgS2V5VXBFdmVudChzdHJpbmcga2V5KTtcclxuICAgICAgICBwdWJsaWMgZXZlbnQgS2V5VXBFdmVudCBPbktleVVwRXZlbnRzO1xyXG5cclxuICAgICAgICBwdWJsaWMgS2V5Qm9hcmRFdmVudCgpIHtcclxuICAgICAgICAgICAgRG9jdW1lbnQuQWRkRXZlbnRMaXN0ZW5lcihFdmVudFR5cGUuS2V5UHJlc3MsIChBY3Rpb248RXZlbnQ+KURvS2V5UHJlc3MpO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5BZGRFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5LZXlEb3duLCAoQWN0aW9uPEV2ZW50PilEb0tleURvd24pO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5BZGRFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5LZXlVcCwgKEFjdGlvbjxFdmVudD4pRG9LZXlVcCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgRG9LZXlQcmVzcyhFdmVudCBlKSB7XHJcbiAgICAgICAgICAgIGlmIChPbktleVByZXNzRXZlbnRzID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgT25LZXlQcmVzc0V2ZW50cy5JbnZva2UoZS5BczxLZXlib2FyZEV2ZW50PigpLktleSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgRG9LZXlEb3duKEV2ZW50IGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoT25LZXlEb3duRXZlbnRzID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgT25LZXlEb3duRXZlbnRzLkludm9rZShlLkFzPEtleWJvYXJkRXZlbnQ+KCkuS2V5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBEb0tleVVwKEV2ZW50IGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoT25LZXlVcEV2ZW50cyA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIE9uS2V5VXBFdmVudHMuSW52b2tlKGUuQXM8S2V5Ym9hcmRFdmVudD4oKS5LZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5FdmVudHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIE1vdXNlQnV0dG9uRXZlbnRcclxuICAgIHtcclxuXHJcbiAgICAgICAgcHVibGljIGRlbGVnYXRlIHZvaWQgTW91c2VEb3duRXZlbnQoaW50IGJ1dHRvbik7XHJcbiAgICAgICAgcHVibGljIGV2ZW50IE1vdXNlRG93bkV2ZW50IE9uTW91c2VEb3duRXZlbnRzO1xyXG5cclxuICAgICAgICBwdWJsaWMgZGVsZWdhdGUgdm9pZCBNb3VzZVVwRXZlbnQoaW50IGJ1dHRvbik7XHJcbiAgICAgICAgcHVibGljIGV2ZW50IE1vdXNlVXBFdmVudCBPbk1vdXNlVXBFdmVudHM7XHJcblxyXG4gICAgICAgIHB1YmxpYyBNb3VzZUJ1dHRvbkV2ZW50KCkge1xyXG4gICAgICAgICAgICBEb2N1bWVudC5BZGRFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5Nb3VzZURvd24sIChBY3Rpb248RXZlbnQ+KURvTW91c2VEb3duKTtcclxuICAgICAgICAgICAgRG9jdW1lbnQuQWRkRXZlbnRMaXN0ZW5lcihFdmVudFR5cGUuTW91c2VVcCwgKEFjdGlvbjxFdmVudD4pRG9Nb3VzZVVwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBEb01vdXNlRG93bihFdmVudCBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKE9uTW91c2VEb3duRXZlbnRzID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgT25Nb3VzZURvd25FdmVudHMuSW52b2tlKGUuQXM8TW91c2VFdmVudD4oKS5CdXR0b24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIERvTW91c2VVcChFdmVudCBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKE9uTW91c2VVcEV2ZW50cyA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIE9uTW91c2VVcEV2ZW50cy5JbnZva2UoZS5BczxNb3VzZUV2ZW50PigpLkJ1dHRvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBHYW1lRW5naW5lSlMuR3JhcGhpY3M7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5TeXN0ZW07XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkRpc3BsYXk7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5Db21wb25lbnRzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHMuVGlsZU1hcDtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEdhbWVcclxuICAgIHtcclxuXHJcbiAgICAgICAgcHVibGljIERyYXdlciBkcmF3ZXIgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBTY2hlZHVsZXIgc2NoZWR1bGVyIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgU2NlbmUgc2NlbmUgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBNb3VzZSBtb3VzZSB7IGdldCB7IHJldHVybiBzY2VuZS5tb3VzZTsgfSB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgRGlzcGxheUxpc3QgX2Rpc3BsYXlMaXN0O1xyXG4gICAgICAgIHByaXZhdGUgQ29tcG9uZW50UmVhZGVyIF9jb21wb25lbnRSZWFkZXI7XHJcblxyXG4gICAgICAgIHB1YmxpYyBHYW1lKHN0cmluZyBjYW52YXNJRCkgOiB0aGlzKGNhbnZhc0lELCBcIiNmZmZcIikgeyB9XHJcbiAgICAgICAgcHVibGljIEdhbWUoc3RyaW5nIGNhbnZhc0lELCBzdHJpbmcgY29sb3IpIHtcclxuICAgICAgICAgICAgX2Rpc3BsYXlMaXN0ID0gbmV3IERpc3BsYXlMaXN0KCk7XHJcbiAgICAgICAgICAgIHNjZW5lID0gbmV3IFNjZW5lKF9kaXNwbGF5TGlzdCwgY2FudmFzSUQsIGNvbG9yKTtcclxuICAgICAgICAgICAgX2NvbXBvbmVudFJlYWRlciA9IG5ldyBDb21wb25lbnRSZWFkZXIoX2Rpc3BsYXlMaXN0KTtcclxuXHJcblxyXG4gICAgICAgICAgICBzY2hlZHVsZXIgPSBuZXcgU2NoZWR1bGVyKCk7XHJcbiAgICAgICAgICAgIHNjaGVkdWxlci5BZGQoKEFjdGlvbilzY2VuZS5SZWZyZXNoKTtcclxuICAgICAgICAgICAgc2NoZWR1bGVyLkFkZCgoQWN0aW9uKV9jb21wb25lbnRSZWFkZXIuVXBkYXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZENoaWxkKFRpbGVNYXAgb2JqKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgX2Rpc3BsYXlMaXN0LkFkZChvYmosIG51bGwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkQ2hpbGQoR2FtZU9iamVjdCBvYmopIHtcclxuICAgICAgICAgICAgX2Rpc3BsYXlMaXN0LkFkZChvYmosIG51bGwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkQ2hpbGRBdChHYW1lT2JqZWN0IG9iaiwgaW50IGluZGV4KSB7XHJcbiAgICAgICAgICAgIF9kaXNwbGF5TGlzdC5BZGRBdChvYmosIG51bGwsIGluZGV4KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFJlbW92ZUNoaWxkKFRpbGVNYXAgb2JqKSB7XHJcbiAgICAgICAgICAgIF9kaXNwbGF5TGlzdC5SZW1vdmUob2JqKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFJlbW92ZUNoaWxkKEdhbWVPYmplY3Qgb2JqKSB7XHJcbiAgICAgICAgICAgIF9kaXNwbGF5TGlzdC5SZW1vdmUob2JqKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIE1vdmVDaGlsZChHYW1lT2JqZWN0IG9iaiwgaW50IGluZGV4KSB7XHJcbiAgICAgICAgICAgIF9kaXNwbGF5TGlzdC5Nb3ZlKG9iaixpbmRleCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5NYXRocztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuQ29tcG9uZW50cztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkRpc3BsYXk7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzLlRpbGVNYXA7XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0c1xyXG57XHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgY2xhc3MgR2FtZU9iamVjdCB7XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgaW50IElESW5jcmVtZW50ZXIgPSAwO1xyXG5cclxuICAgICAgICAvLy8gPHN1bW1hcnk+XHJcbiAgICAgICAgLy8vIFBvc2l0aW9uIG9mIHRoZSBHYW1lT2JqZWN0LlxyXG4gICAgICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICAgICAgcHVibGljIFZlY3RvcjIgcG9zaXRpb24geyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICAvLy8gPHN1bW1hcnk+XHJcbiAgICAgICAgLy8vIEZpeGVkIG9uIHRoZSBzY3JlZW4gaWYgdHJ1ZS5cclxuICAgICAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgICAgIHB1YmxpYyBib29sIHNjcmVlbkZpeGVkIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgICAgIC8vLyBTaXplIG9mIHRoZSBHYW1lT2JqZWN0LlxyXG4gICAgICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICAgICAgcHVibGljIFZlY3RvcjIgc2l6ZSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgICAgIC8vLyBPYmplY3QgQW5nbGUgaW4gZGVncmVlcy5cclxuICAgICAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBhbmdsZSB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAvLy8gUGl2b3QgZm9yIGFuZ2xlLlxyXG4gICAgICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICAgICAgcHVibGljIFZlY3RvcjIgcGl2b3QgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICAvLy8gPHN1bW1hcnk+XHJcbiAgICAgICAgLy8vIFVuaXF1ZSBJRCBvZiB0aGUgR2FtZU9iamVjdC5cclxuICAgICAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgICAgIHB1YmxpYyBpbnQgSUQgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcblxyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAvLy8gSW1hZ2Ugb2YgdGhlIEdhbWVPYmplY3QuXHJcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICBwdWJsaWMgVW5pb248SFRNTENhbnZhc0VsZW1lbnQsIEltYWdlLCBTcHJpdGVTaGVldD4gaW1hZ2UgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAvLy8gTGlzdCBvZiB0aGUgb2JqZWN0IGNvbXBvbmVudHMuXHJcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICBwdWJsaWMgRGljdGlvbmFyeTxzdHJpbmcsIENvbXBvbmVudD4gY29tcG9uZW50cyA9IG5ldyBEaWN0aW9uYXJ5PHN0cmluZywgQ29tcG9uZW50PigpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAvLy8gR2FtZSBPYmplY3QgdHlwZS5cclxuICAgICAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgdHlwZSB7IGdldDsgaW50ZXJuYWwgc2V0OyB9XHJcblxyXG4gICAgICAgIGludGVybmFsIERpc3BsYXlMaXN0IGRpc3BsYXlMaXN0ID0gbmV3IERpc3BsYXlMaXN0KCk7XHJcbiAgICAgICAgaW50ZXJuYWwgR2FtZU9iamVjdCBfcGFyZW50O1xyXG5cclxuXHJcblxyXG4gICAgICAgIC8vUHVibGljIE1ldGhvZHNcclxuXHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgICAgIC8vLyBBZGQvTGluayBhIGNvbXBvbmVudCB0byB0aGlzIEdhbWVPYmplY3QuXHJcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICBwdWJsaWMgQ29tcG9uZW50IEFkZENvbXBvbmVudChzdHJpbmcgaW5zdGFuY2VOYW1lLCBDb21wb25lbnQgY29tcG9uZW50KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29tcG9uZW50c1tpbnN0YW5jZU5hbWVdID0gY29tcG9uZW50O1xyXG4gICAgICAgICAgICByZXR1cm4gY29tcG9uZW50c1tpbnN0YW5jZU5hbWVdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkQ2hpbGQoVGlsZU1hcC5UaWxlTWFwIHRpbGVNYXApIHtcclxuICAgICAgICAgICAgZGlzcGxheUxpc3QuQWRkKHRpbGVNYXAsIHRoaXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkQ2hpbGQoR2FtZU9iamVjdCBvYmopIHtcclxuICAgICAgICAgICAgZGlzcGxheUxpc3QuQWRkKG9iaix0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZENoaWxkQXQoR2FtZU9iamVjdCBvYmosIGludCBpbmRleClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGRpc3BsYXlMaXN0LkFkZEF0KG9iaiwgdGhpcywgaW5kZXgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgUmVtb3ZlQ2hpbGQoR2FtZU9iamVjdCBvYmopXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBkaXNwbGF5TGlzdC5SZW1vdmUob2JqKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIE1vdmVDaGlsZChHYW1lT2JqZWN0IG9iaiwgaW50IGluZGV4KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZGlzcGxheUxpc3QuTW92ZShvYmosIGluZGV4KTtcclxuICAgICAgICB9XHJcblxuXHJcbiAgICBcbnByaXZhdGUgYm9vbCBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fc2NyZWVuRml4ZWQ9ZmFsc2U7cHJpdmF0ZSBpbnQgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX0lEPUlESW5jcmVtZW50ZXIrKztwcml2YXRlIHN0cmluZyBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fdHlwZT1cIlVua25vd25cIjt9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHMuVGlsZU1hcFxyXG57XHJcblxyXG4gICAgcHVibGljIGNsYXNzIFRpbGVNYXBcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIFhNTEh0dHBSZXF1ZXN0IHJlcXVlc3Q7XHJcblxyXG4gICAgICAgIGludGVybmFsIERpY3Rpb25hcnk8c3RyaW5nLCBMYXllcj4gbGF5ZXJzIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBpbnRlcm5hbCBTcHJpdGVTaGVldCBfdGlsZVNoZWV0O1xyXG4gICAgICAgIGludGVybmFsIFZlY3RvcjJJIF9zaXplO1xyXG5cclxuICAgICAgICBwdWJsaWMgVmVjdG9yMiBwb3NpdGlvbiB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBUaWxlTWFwKFNwcml0ZVNoZWV0IHRpbGVTaGVldCwgVmVjdG9yMiBwb3MsIFZlY3RvcjJJIHNpemUpIHtcclxuICAgICAgICAgICAgbGF5ZXJzID0gbmV3IERpY3Rpb25hcnk8c3RyaW5nLCBMYXllcj4oKTtcclxuICAgICAgICAgICAgX3RpbGVTaGVldCA9IHRpbGVTaGVldDtcclxuICAgICAgICAgICAgcG9zaXRpb24gPSBwb3M7XHJcbiAgICAgICAgICAgIF9zaXplID0gc2l6ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBMYXllciBBZGRMYXllcihzdHJpbmcgbmFtZSx1aW50IGluZGV4KSB7XHJcbiAgICAgICAgICAgIGxheWVyc1tuYW1lXSA9IG5ldyBMYXllcihpbmRleCwgdGhpcyk7XHJcbiAgICAgICAgICAgIHJldHVybiBsYXllcnNbbmFtZV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBSZW1vdmVMYXllcihzdHJpbmcgbmFtZSkge1xyXG4gICAgICAgICAgICBsYXllcnNbbmFtZV0gPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIExheWVyIEdldExheWVyKHN0cmluZyBuYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBsYXllcnNbbmFtZV07XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgdm9pZCBTZXRDb2xsaXNpb24oc3RyaW5nIGxheWVyLCBpbnQgeCwgaW50IHksIGludCBjb2xsaXNpb25UeXBlKVxyXG57XHJcbiAgICBTZXRDb2xsaXNpb24obGF5ZXIsIG5ldyBWZWN0b3IySSh4LCB5KSwgY29sbGlzaW9uVHlwZSk7XHJcbn0gICAgICAgIHB1YmxpYyB2b2lkIFNldENvbGxpc2lvbihzdHJpbmcgbGF5ZXIsIFZlY3RvcjJJIHBvcywgaW50IGNvbGxpc2lvblR5cGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsYXllcnNbbGF5ZXJdLlNldENvbGxpc2lvbigodWludClwb3MuWCwgKHVpbnQpcG9zLlksIGNvbGxpc2lvblR5cGUpO1xyXG4gICAgICAgIH1cclxucHVibGljIGludCBHZXRDb2xsaXNpb24oc3RyaW5nIGxheWVyLCBpbnQgeCwgaW50IHkpXHJcbntcclxuICAgIHJldHVybiBHZXRDb2xsaXNpb24obGF5ZXIsIG5ldyBWZWN0b3IySSh4LCB5KSk7XHJcbn0gICAgICAgIHB1YmxpYyBpbnQgR2V0Q29sbGlzaW9uKHN0cmluZyBsYXllciwgVmVjdG9yMkkgcG9zKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIGxheWVyc1tsYXllcl0uR2V0Q29sbGlzaW9uKCh1aW50KXBvcy5YLCAodWludClwb3MuWSk7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgdm9pZCBTZXRUaWxlKHN0cmluZyBsYXllciwgaW50IHgsIGludCB5LCBpbnQgdGlsZSlcclxue1xyXG4gICAgU2V0VGlsZShsYXllciwgbmV3IFZlY3RvcjJJKHgsIHkpLCB0aWxlKTtcclxufSAgICAgICAgcHVibGljIHZvaWQgU2V0VGlsZShzdHJpbmcgbGF5ZXIsIFZlY3RvcjJJIHBvcywgaW50IHRpbGUpIHtcclxuICAgICAgICAgICAgbGF5ZXJzW2xheWVyXS5TZXRUaWxlKCh1aW50KXBvcy5YLCAodWludClwb3MuWSwgdGlsZSxmYWxzZSk7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgaW50IEdldFRpbGUoc3RyaW5nIGxheWVyLCBpbnQgeCwgaW50IHkpXHJcbntcclxuICAgIHJldHVybiBHZXRUaWxlKGxheWVyLCBuZXcgVmVjdG9yMkkoeCwgeSkpO1xyXG59ICAgICAgICBwdWJsaWMgaW50IEdldFRpbGUoc3RyaW5nIGxheWVyLCBWZWN0b3IySSBwb3MpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGxheWVyc1tsYXllcl0uR2V0VGlsZSgodWludClwb3MuWCwgKHVpbnQpcG9zLlkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgTG9hZFRpbGVkSnNvbihzdHJpbmcgdXJsLCB1aW50IG51bWJlck9mTGF5ZXJzKSB7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHVpbnQgaSA9IDA7IGkgPCBudW1iZXJPZkxheWVyczsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBBZGRMYXllcihpK1wiXCIsIGkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0Lk9uTG9hZCArPSBMb2FkVGlsZWQ7XHJcbiAgICAgICAgICAgIHJlcXVlc3QuT3BlbihcImdldFwiLHVybCk7XHJcbiAgICAgICAgICAgIHJlcXVlc3QuU2VuZCgpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBMb2FkVGlsZWQoRXZlbnQgZSkge1xyXG4gICAgICAgICAgICBkeW5hbWljIGEgPSBKU09OLlBhcnNlKHJlcXVlc3QuUmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgX3NpemUuWCA9IGEud2lkdGg7XHJcbiAgICAgICAgICAgIF9zaXplLlkgPSBhLmhlaWdodDtcclxuXHJcbiAgICAgICAgICAgIGZvciAodWludCBpID0gMDsgaSA8IGEubGF5ZXJzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBkeW5hbWljIGxheWVyanMgPSBhLmxheWVyc1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBMYXllciBsYXllciA9IGxheWVyc1tpICsgXCJcIl07XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGxheWVyanMgPSBsYXllcmpzLmRhdGE7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChpbnQgaiA9IDA7IGogPCBsYXllcmpzLmxlbmd0aDsgaisrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGludCBpbmRleFggPSBqICUgX3NpemUuWDtcclxuICAgICAgICAgICAgICAgICAgICBpbnQgaW5kZXhZID0gKGludClNYXRoLkZsb29yKChmbG9hdCkoaiAvIF9zaXplLlgpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGF5ZXIuU2V0VGlsZSgodWludClpbmRleFgsICh1aW50KWluZGV4WSwgbGF5ZXJqc1tqXS0xLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuR3JhcGhpY3Ncclxue1xyXG4gICAgcHVibGljIGNsYXNzIERyYXdlclxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIF9jdHg7XHJcbiAgICAgICAgcHJpdmF0ZSBIVE1MQ2FudmFzRWxlbWVudCBfY2FudmFzO1xyXG5cclxuICAgICAgICBwdWJsaWMgRHJhd2VyKEhUTUxDYW52YXNFbGVtZW50IGNhbnZhcykge1xyXG4gICAgICAgICAgICBfY3R4ID0gKENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCljYW52YXMuR2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgICAgICAgICBfY2FudmFzID0gY2FudmFzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgRmlsbFNjcmVlbihzdHJpbmcgY29sb3IpIHtcclxuICAgICAgICAgICAgX2N0eC5GaWxsU3R5bGUgPSBjb2xvcjtcclxuICAgICAgICAgICAgX2N0eC5GaWxsUmVjdCgwLDAsX2NhbnZhcy5XaWR0aCxfY2FudmFzLkhlaWdodCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBEcmF3KGZsb2F0IHgsIGZsb2F0IHksIGZsb2F0IHcsIGZsb2F0IGgsIGZsb2F0IHIsIGZsb2F0IHBpdm90WCwgZmxvYXQgcGl2b3RZLCBkeW5hbWljIGltZywgYm9vbCBmb2xsb3cgPSBmYWxzZSwgZmxvYXQgYWxwaGEgPSAxKSB7XHJcbiAgICAgICAgICAgIF9jdHguSW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIF9jYW52YXMuU3R5bGUuSW1hZ2VSZW5kZXJpbmcgPSBJbWFnZVJlbmRlcmluZy5QaXhlbGF0ZWQ7XHJcbiAgICAgICAgICAgIF9jdHguU2F2ZSgpO1xyXG5cclxuICAgICAgICAgICAgZmxvYXQgc3ggPSAwO1xyXG4gICAgICAgICAgICBmbG9hdCBzeSA9IDA7XHJcbiAgICAgICAgICAgIGZsb2F0IHN3ID0gdztcclxuICAgICAgICAgICAgZmxvYXQgc2ggPSBoO1xyXG5cclxuICAgICAgICAgICAgaWYgKGltZyA9PSBudWxsKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBpZiAoaW1nLnNwcml0ZVNpemVYICE9IG51bGwgJiYgaW1nLnNwcml0ZVNpemVZICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIFNwcml0ZVNoZWV0IGltZzIgPSAoU3ByaXRlU2hlZXQpaW1nO1xyXG4gICAgICAgICAgICAgICAgaWYgKGltZzIuZGF0YS5XaWR0aCA9PSAwKSByZXR1cm47IFxyXG4gICAgICAgICAgICAgICAgc3ggPSAoaW1nMi5jdXJyZW50SW5kZXggJSAoaW1nMi5kYXRhLldpZHRoIC8gaW1nMi5zcHJpdGVTaXplWCkpICogaW1nMi5zcHJpdGVTaXplWDtcclxuICAgICAgICAgICAgICAgIHN5ID0gKGZsb2F0KU1hdGguRmxvb3IoaW1nMi5jdXJyZW50SW5kZXggLyAoKGRvdWJsZSlpbWcyLmRhdGEuV2lkdGggLyBpbWcyLnNwcml0ZVNpemVYKSkgKiBpbWcyLnNwcml0ZVNpemVZO1xyXG4gICAgICAgICAgICAgICAgc3cgPSBpbWcyLnNwcml0ZVNpemVYO1xyXG4gICAgICAgICAgICAgICAgc2ggPSBpbWcyLnNwcml0ZVNpemVZO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaW1nLmRhdGEgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaW1nID0gaW1nLmRhdGE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKHIgIT0gMCkgeyBcclxuICAgICAgICAgICAgICAgIC8vT2JqZWN0IFJvdGF0aW9uXHJcbiAgICAgICAgICAgICAgICBmbG9hdCBveCA9IHggKyBwaXZvdFg7XHJcbiAgICAgICAgICAgICAgICBmbG9hdCBveSA9IHkgKyBwaXZvdFk7XHJcblxyXG4gICAgICAgICAgICAgICAgX2N0eC5UcmFuc2xhdGUob3gsIG95KTtcclxuICAgICAgICAgICAgICAgIF9jdHguUm90YXRlKChyKSAqIE1hdGguUEkgLyAxODApOyAvL2RlZ3JlZVxyXG4gICAgICAgICAgICAgICAgX2N0eC5UcmFuc2xhdGUoLW94LCAtb3kpO1xyXG4gICAgICAgICAgICAgICAgLy8tLS0tLS0tXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIF9jdHguRHJhd0ltYWdlKGltZywgc3gsIHN5LCBzdywgc2gsIChpbnQpeCwgKGludCl5LCB3LCBoKTtcclxuICAgICAgICAgICAgX2N0eC5SZXN0b3JlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxuXHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkdyYXBoaWNzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBJbWFnZVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBIVE1MSW1hZ2VFbGVtZW50IGRhdGEgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgSW1hZ2Uoc3RyaW5nIHNyYykge1xyXG4gICAgICAgICAgICBkYXRhID0gbmV3IEhUTUxJbWFnZUVsZW1lbnQoKTtcclxuICAgICAgICAgICAgZGF0YS5TcmMgPSBzcmM7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIEltYWdlKEhUTUxJbWFnZUVsZW1lbnQgaW1nKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZGF0YSA9IGltZztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkdyYXBoaWNzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBTcHJpdGVTaGVldFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBIVE1MSW1hZ2VFbGVtZW50IGRhdGEgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyB1aW50IHNwcml0ZVNpemVYIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgdWludCBzcHJpdGVTaXplWSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIHVpbnQgY3VycmVudEluZGV4IHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIFNwcml0ZVNoZWV0KEltYWdlIHNyYywgdWludCBzcHJpdGVTaXplWCwgdWludCBzcHJpdGVTaXplWSkge1xyXG4gICAgICAgICAgICBkYXRhID0gc3JjLmRhdGE7XHJcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlU2l6ZVggPSBzcHJpdGVTaXplWDtcclxuICAgICAgICAgICAgdGhpcy5zcHJpdGVTaXplWSA9IHNwcml0ZVNpemVZO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgU3ByaXRlU2hlZXQoc3RyaW5nIHNyYywgdWludCBzcHJpdGVTaXplWCwgdWludCBzcHJpdGVTaXplWSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGRhdGEgPSBuZXcgSFRNTEltYWdlRWxlbWVudCgpO1xyXG4gICAgICAgICAgICBkYXRhLlNyYyA9IHNyYztcclxuICAgICAgICAgICAgdGhpcy5zcHJpdGVTaXplWCA9IHNwcml0ZVNpemVYO1xyXG4gICAgICAgICAgICB0aGlzLnNwcml0ZVNpemVZID0gc3ByaXRlU2l6ZVk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLk1hdGhzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBWZWN0b3IyIHtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgWCB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IFkgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgVmVjdG9yMigpIHtcclxuICAgICAgICAgICAgWCA9IDA7XHJcbiAgICAgICAgICAgIFkgPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIFZlY3RvcjIoZmxvYXQgWCwgZmxvYXQgWSkge1xyXG4gICAgICAgICAgICB0aGlzLlggPSBYO1xyXG4gICAgICAgICAgICB0aGlzLlkgPSBZO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBib29sIG9wZXJhdG9yID09IChWZWN0b3IyIGEsIFZlY3RvcjIgYikge1xyXG4gICAgICAgICAgICBpZiAoYS5YID09IGIuWCAmJiBhLlkgPT0gYi5ZKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBib29sIG9wZXJhdG9yICE9KFZlY3RvcjIgYSwgVmVjdG9yMiBiKSB7XHJcbiAgICAgICAgICAgIGlmIChhLlggPT0gYi5YICYmIGEuWSA9PSBiLlkpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuTWF0aHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFZlY3RvcjJJXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIGludCBYIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgaW50IFkgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgVmVjdG9yMkkoaW50IFgsIGludCBZKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5YID0gWDtcclxuICAgICAgICAgICAgdGhpcy5ZID0gWTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuTWF0aHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFZlY3RvcjRcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgWCB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IFkgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBaIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgVyB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBWZWN0b3I0KGZsb2F0IFgsIGZsb2F0IFksIGZsb2F0IFosIGZsb2F0IFcpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLlggPSBYO1xyXG4gICAgICAgICAgICB0aGlzLlkgPSBZO1xyXG4gICAgICAgICAgICB0aGlzLlogPSBaO1xyXG4gICAgICAgICAgICB0aGlzLlcgPSBXO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuU3lzdGVtXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBNb3VzZVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCB4IHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgeSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHJpdmF0ZSBIVE1MQ2FudmFzRWxlbWVudCBfY2FudmFzO1xyXG5cclxuICAgICAgICBpbnRlcm5hbCBNb3VzZShIVE1MQ2FudmFzRWxlbWVudCBjYW52YXMpIHtcclxuICAgICAgICAgICAgX2NhbnZhcyA9IGNhbnZhcztcclxuICAgICAgICAgICAgRG9jdW1lbnQuQWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLChBY3Rpb248RXZlbnQ+KVVwZGF0ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgVXBkYXRlKEV2ZW50IGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBDbGllbnRSZWN0IHJlY3QgPSBfY2FudmFzLkdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgICAgICB4ID0gZS5BczxNb3VzZUV2ZW50PigpLkNsaWVudFggLSAoZmxvYXQpcmVjdC5MZWZ0O1xyXG4gICAgICAgICAgICB5ID0gZS5BczxNb3VzZUV2ZW50PigpLkNsaWVudFkgLSAoZmxvYXQpcmVjdC5Ub3A7XHJcbiAgICAgICAgfVxyXG5cbiAgICBcbnByaXZhdGUgZmxvYXQgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX3g9MDtwcml2YXRlIGZsb2F0IF9fUHJvcGVydHlfX0luaXRpYWxpemVyX195PTA7fVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLlN5c3RlbVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgU2NoZWR1bGVyXHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSBMaXN0PEFjdGlvbj4gX2FjdGlvbkxpc3QgPSBuZXcgTGlzdDxBY3Rpb24+KCk7XHJcblxyXG4gICAgICAgIGludGVybmFsIFNjaGVkdWxlcigpIHtcclxuICAgICAgICAgICAgVXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBBZGQoQWN0aW9uIG1ldGhvZHMpIHtcclxuICAgICAgICAgICAgX2FjdGlvbkxpc3QuQWRkKChBY3Rpb24pKCgpID0+IG1ldGhvZHMoKSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgVXBkYXRlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKEFjdGlvbiBhIGluIF9hY3Rpb25MaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBhKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgV2luZG93LlNldFRpbWVvdXQoKFN5c3RlbS5BY3Rpb24pKCgpID0+IFdpbmRvdy5SZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKEFjdGlvbilVcGRhdGUpKSwgMTAwMC82MCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HcmFwaGljcztcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkNvbXBvbmVudHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEFuaW1hdG9yIDogQ29tcG9uZW50XHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSBEaWN0aW9uYXJ5PHN0cmluZywgTGlzdDxVbmlvbjxIVE1MQ2FudmFzRWxlbWVudCxJbWFnZSwgdWludD4+PiBfYW5pbWF0aW9ucyB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIHN0cmluZyBjdXJyZW50QW5pbWF0aW9uIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgaW50IGN1cnJlbnRGcmFtZSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGludCBmcHMgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgYm9vbCBwbGF5aW5nIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG4gICAgICAgIHByaXZhdGUgZG91YmxlIGxhc3RUaW1lRnJhbWUgPSAwO1xyXG5cclxuICAgICAgICBwdWJsaWMgQW5pbWF0b3IoR2FtZU9iamVjdCBwYXJlbnQpIDogYmFzZShwYXJlbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBfYW5pbWF0aW9ucyA9IG5ldyBEaWN0aW9uYXJ5PHN0cmluZywgTGlzdDxVbmlvbjxIVE1MQ2FudmFzRWxlbWVudCwgSW1hZ2UsIHVpbnQ+Pj4oKTtcclxuICAgICAgICB9XHJcbnB1YmxpYyB2b2lkIEdvdG9BbmRQbGF5KHN0cmluZyBhbmltYXRpb25OYW1lKVxyXG57XHJcbiAgICBHb3RvQW5kUGxheShhbmltYXRpb25OYW1lLCAwKTtcclxufSAgICAgICAgcHVibGljIHZvaWQgR290b0FuZFBsYXkoc3RyaW5nIGFuaW1hdGlvbk5hbWUsIGludCBmcmFtZSkge1xyXG4gICAgICAgICAgICBjdXJyZW50QW5pbWF0aW9uID0gYW5pbWF0aW9uTmFtZTtcclxuICAgICAgICAgICAgY3VycmVudEZyYW1lID0gZnJhbWU7XHJcbiAgICAgICAgICAgIHBsYXlpbmcgPSB0cnVlO1xyXG4gICAgICAgIH1cclxucHVibGljIHZvaWQgR290b0FuZFN0b3Aoc3RyaW5nIGFuaW1hdGlvbk5hbWUpXHJcbntcclxuICAgIEdvdG9BbmRTdG9wKGFuaW1hdGlvbk5hbWUsIDApO1xyXG59ICAgICAgICBwdWJsaWMgdm9pZCBHb3RvQW5kU3RvcChzdHJpbmcgYW5pbWF0aW9uTmFtZSwgaW50IGZyYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY3VycmVudEFuaW1hdGlvbiA9IGFuaW1hdGlvbk5hbWU7XHJcbiAgICAgICAgICAgIGN1cnJlbnRGcmFtZSA9IGZyYW1lO1xyXG5cclxuICAgICAgICAgICAgaWYgKCEoKHVpbnQpX2FuaW1hdGlvbnNbY3VycmVudEFuaW1hdGlvbl1bY3VycmVudEZyYW1lXSA+PSAwKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcGFyZW50LmltYWdlID0gKEltYWdlKV9hbmltYXRpb25zW2N1cnJlbnRBbmltYXRpb25dW2N1cnJlbnRGcmFtZV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBTcHJpdGVTaGVldCBzaGVldCA9IChTcHJpdGVTaGVldClwYXJlbnQuaW1hZ2U7XHJcbiAgICAgICAgICAgICAgICBzaGVldC5jdXJyZW50SW5kZXggPSAodWludClfYW5pbWF0aW9uc1tjdXJyZW50QW5pbWF0aW9uXVtjdXJyZW50RnJhbWVdO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBwbGF5aW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBTdG9wKCkge1xyXG4gICAgICAgICAgICBwbGF5aW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBTdGFydCgpIHtcclxuICAgICAgICAgICAgcGxheWluZyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBDcmVhdGUoc3RyaW5nIGFuaW1hdGlvbk5hbWUsIExpc3Q8dWludD4gbGlzdCkge1xyXG4gICAgICAgICAgICBMaXN0PFVuaW9uPEhUTUxDYW52YXNFbGVtZW50LCBJbWFnZSwgdWludD4+IHQgPSBuZXcgTGlzdDxVbmlvbjxIVE1MQ2FudmFzRWxlbWVudCwgSW1hZ2UsIHVpbnQ+PigpO1xyXG4gICAgICAgICAgICB0ID0gbGlzdC5BczxMaXN0PFVuaW9uPEhUTUxDYW52YXNFbGVtZW50LCBJbWFnZSwgdWludD4+PigpO1xyXG4gICAgICAgICAgICBDcmVhdGUoYW5pbWF0aW9uTmFtZSwgdCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBDcmVhdGUoc3RyaW5nIGFuaW1hdGlvbk5hbWUsIExpc3Q8SW1hZ2U+IGxpc3QpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBMaXN0PFVuaW9uPEhUTUxDYW52YXNFbGVtZW50LCBJbWFnZSwgdWludD4+IHQgPSBuZXcgTGlzdDxVbmlvbjxIVE1MQ2FudmFzRWxlbWVudCwgSW1hZ2UsIHVpbnQ+PigpO1xyXG4gICAgICAgICAgICB0ID0gbGlzdC5BczxMaXN0PFVuaW9uPEhUTUxDYW52YXNFbGVtZW50LCBJbWFnZSwgdWludD4+PigpO1xyXG4gICAgICAgICAgICBDcmVhdGUoYW5pbWF0aW9uTmFtZSwgdCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBDcmVhdGUoc3RyaW5nIGFuaW1hdGlvbk5hbWUsIExpc3Q8SFRNTENhbnZhc0VsZW1lbnQ+IGxpc3QpIHtcclxuICAgICAgICAgICAgTGlzdDxVbmlvbjxIVE1MQ2FudmFzRWxlbWVudCwgSW1hZ2UsIHVpbnQ+PiB0ID0gbmV3IExpc3Q8VW5pb248SFRNTENhbnZhc0VsZW1lbnQsIEltYWdlLCB1aW50Pj4oKTtcclxuICAgICAgICAgICAgdCA9IGxpc3QuQXM8TGlzdDxVbmlvbjxIVE1MQ2FudmFzRWxlbWVudCwgSW1hZ2UsIHVpbnQ+Pj4oKTtcclxuICAgICAgICAgICAgQ3JlYXRlKGFuaW1hdGlvbk5hbWUsIHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQ3JlYXRlKHN0cmluZyBhbmltYXRpb25OYW1lLCBMaXN0PFVuaW9uPEhUTUxDYW52YXNFbGVtZW50LCBJbWFnZSwgdWludD4+IGxpc3Qpe1xyXG4gICAgICAgICAgICBfYW5pbWF0aW9uc1thbmltYXRpb25OYW1lXSA9IGxpc3Q7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnRlcm5hbCBvdmVycmlkZSB2b2lkIFVwZGF0ZSgpIHtcclxuICAgICAgICAgICAgaWYgKCFwbGF5aW5nKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBkb3VibGUgbm93ID0gRGF0ZVRpbWUuTm93LlN1YnRyYWN0KERhdGVUaW1lLk1pblZhbHVlLkFkZFllYXJzKDIwMTcpKS5Ub3RhbE1pbGxpc2Vjb25kcztcclxuICAgICAgICAgICAgZG91YmxlIGRlbHRhID0gbm93IC0gbGFzdFRpbWVGcmFtZTtcclxuICAgICAgICAgICAgaWYgKGRlbHRhID4gMTAwMC9mcHMpIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRGcmFtZSsrO1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRGcmFtZSA+PSBfYW5pbWF0aW9uc1tjdXJyZW50QW5pbWF0aW9uXS5Db3VudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRGcmFtZSA9IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCEoKHVpbnQpX2FuaW1hdGlvbnNbY3VycmVudEFuaW1hdGlvbl1bY3VycmVudEZyYW1lXSA+PSAwKSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoX2FuaW1hdGlvbnNbY3VycmVudEFuaW1hdGlvbl1bY3VycmVudEZyYW1lXS5HZXRUeXBlKCkgPT0gdHlwZW9mKEltYWdlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQuaW1hZ2UgPSAoSW1hZ2UpX2FuaW1hdGlvbnNbY3VycmVudEFuaW1hdGlvbl1bY3VycmVudEZyYW1lXTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQuaW1hZ2UgPSAoSFRNTENhbnZhc0VsZW1lbnQpX2FuaW1hdGlvbnNbY3VycmVudEFuaW1hdGlvbl1bY3VycmVudEZyYW1lXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBTcHJpdGVTaGVldCBzaGVldCA9IChTcHJpdGVTaGVldClwYXJlbnQuaW1hZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hlZXQuY3VycmVudEluZGV4ID0gKHVpbnQpX2FuaW1hdGlvbnNbY3VycmVudEFuaW1hdGlvbl1bY3VycmVudEZyYW1lXTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBsYXN0VGltZUZyYW1lID0gbm93O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXG5cclxuICAgIFxucHJpdmF0ZSBzdHJpbmcgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX2N1cnJlbnRBbmltYXRpb249XCJcIjtwcml2YXRlIGludCBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fY3VycmVudEZyYW1lPTA7cHJpdmF0ZSBpbnQgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX2Zwcz0xO3ByaXZhdGUgYm9vbCBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fcGxheWluZz1mYWxzZTt9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHMuVGlsZU1hcDtcclxudXNpbmcgR2FtZUVuZ2luZUpTLk1hdGhzO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5Db21wb25lbnRzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBDb2xsaXNpb24gOiBDb21wb25lbnRcclxuICAgIHtcclxuXHJcbiAgICAgICAgcmVhZG9ubHkgTGlzdDxWZWN0b3I0PiBfYm94ZXM7XHJcblxyXG4gICAgICAgIHB1YmxpYyBDb2xsaXNpb24oR2FtZU9iamVjdCBwYXJlbnQpIDogYmFzZShwYXJlbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBfYm94ZXMgPSBuZXcgTGlzdDxWZWN0b3I0PigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkQm94KGZsb2F0IHgxLGZsb2F0IHkxLCBmbG9hdCB3aWR0aCwgZmxvYXQgaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIF9ib3hlcy5BZGQobmV3IFZlY3RvcjQoeDEseTEsd2lkdGgsaGVpZ2h0KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGZsb2F0IFBhcmVudFBvc0NhbGN1bGF0aW9uWChmbG9hdCB4LCBHYW1lT2JqZWN0IHBhcmVudCkge1xyXG4gICAgICAgICAgICBmbG9hdCBhZGRpbmcgPSAwO1xyXG4gICAgICAgICAgICBmbG9hdCBhbmdsZUFkZGluZyA9IDA7XHJcblxyXG4gICAgICAgICAgICBpZiAocGFyZW50Ll9wYXJlbnQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgYWRkaW5nID0gUGFyZW50UG9zQ2FsY3VsYXRpb25YKHBhcmVudC5wb3NpdGlvbi5YLCBwYXJlbnQuX3BhcmVudCk7XHJcbiAgICAgICAgICAgICAgICBhbmdsZUFkZGluZyA9IChmbG9hdCkoTWF0aC5Db3MocGFyZW50Ll9wYXJlbnQuYW5nbGUgKiBNYXRoLlBJIC8gMTgwKSkgKiB4O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAocGFyZW50Ll9wYXJlbnQgPT0gbnVsbCkgYWRkaW5nICs9IHBhcmVudC5wb3NpdGlvbi5YO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuICBhZGRpbmcgKyBhbmdsZUFkZGluZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgZmxvYXQgUGFyZW50UG9zQ2FsY3VsYXRpb25ZKGZsb2F0IHksIEdhbWVPYmplY3QgcGFyZW50KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZmxvYXQgYWRkaW5nID0gMDtcclxuICAgICAgICAgICAgZmxvYXQgYW5nbGVBZGRpbmcgPSAwO1xyXG5cclxuICAgICAgICAgICAgaWYgKHBhcmVudC5fcGFyZW50ICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGFkZGluZyA9IFBhcmVudFBvc0NhbGN1bGF0aW9uWShwYXJlbnQucG9zaXRpb24uWSwgcGFyZW50Ll9wYXJlbnQpO1xyXG4gICAgICAgICAgICAgICAgYW5nbGVBZGRpbmcgPSAoZmxvYXQpKE1hdGguU2luKHBhcmVudC5fcGFyZW50LmFuZ2xlICogTWF0aC5QSSAvIDE4MCkpICogeTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHBhcmVudC5fcGFyZW50ID09IG51bGwpIGFkZGluZyArPSBwYXJlbnQucG9zaXRpb24uWTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBhZGRpbmcgKyBhbmdsZUFkZGluZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBib29sIEhpdFRlc3RPYmplY3QoR2FtZU9iamVjdCBvYmopIHtcclxuXHJcbiAgICAgICAgICAgIGZsb2F0IHB4ID0gcGFyZW50LnBvc2l0aW9uLlg7XHJcbiAgICAgICAgICAgIGZsb2F0IHB5ID0gcGFyZW50LnBvc2l0aW9uLlk7XHJcbiAgICAgICAgICAgIGZsb2F0IHAyeCA9IG9iai5wb3NpdGlvbi5YO1xyXG4gICAgICAgICAgICBmbG9hdCBwMnkgPSBvYmoucG9zaXRpb24uWTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnQuX3BhcmVudCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBweCA9IFBhcmVudFBvc0NhbGN1bGF0aW9uWChwYXJlbnQucG9zaXRpb24uWCwgIHBhcmVudCk7IFxyXG4gICAgICAgICAgICAgICAgcHkgPSBQYXJlbnRQb3NDYWxjdWxhdGlvblkocGFyZW50LnBvc2l0aW9uLlksICBwYXJlbnQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAob2JqLl9wYXJlbnQgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcDJ4ID0gUGFyZW50UG9zQ2FsY3VsYXRpb25YKG9iai5wb3NpdGlvbi5YLCBvYmopO1xyXG4gICAgICAgICAgICAgICAgcDJ5ID0gUGFyZW50UG9zQ2FsY3VsYXRpb25ZKG9iai5wb3NpdGlvbi5ZLCBvYmopO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3JlYWNoIChDb21wb25lbnQgY3AgaW4gb2JqLmNvbXBvbmVudHMuVmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3AuR2V0VHlwZSgpID09IHR5cGVvZihDb2xsaXNpb24pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQ29sbGlzaW9uIGMgPSAoQ29sbGlzaW9uKWNwO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcmVhY2ggKFZlY3RvcjQgYiBpbiBfYm94ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yZWFjaCAoVmVjdG9yNCBiMiBpbiBjLl9ib3hlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGIuWCArIHB4IDwgYjIuWCArIHAyeCArIGIyLlogJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIuWCArIGIuWiArIHB4ID4gYjIuWCArIHAyeCAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYi5ZICsgcHkgPCBiMi5ZICsgYjIuVyArIHAyeSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYi5XICsgYi5ZICsgcHkgID4gYjIuWSArIHAyeSApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgYm9vbCBIaXRUZXN0UG9pbnQoZmxvYXQgeCxmbG9hdCB5KSB7XHJcblxyXG4gICAgICAgICAgICBmbG9hdCBweCA9IHBhcmVudC5wb3NpdGlvbi5YO1xyXG4gICAgICAgICAgICBmbG9hdCBweSA9IHBhcmVudC5wb3NpdGlvbi5ZO1xyXG5cclxuICAgICAgICAgICAgaWYgKHBhcmVudC5fcGFyZW50ICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHB4ID0gUGFyZW50UG9zQ2FsY3VsYXRpb25YKHBhcmVudC5wb3NpdGlvbi5YLCBwYXJlbnQpO1xyXG4gICAgICAgICAgICAgICAgcHkgPSBQYXJlbnRQb3NDYWxjdWxhdGlvblgocGFyZW50LnBvc2l0aW9uLlksIHBhcmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvcmVhY2ggKFZlY3RvcjQgYiBpbiBfYm94ZXMpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmICh4IDwgYi5YICsgcHggKyBiLlogJiZcclxuICAgICAgICAgICAgICAgICAgIHggPiBiLlggKyBweCAmJlxyXG4gICAgICAgICAgICAgICAgICAgeSA8IGIuWSArIHB5ICsgYi5XICYmXHJcbiAgICAgICAgICAgICAgICAgICB5ID4gYi5ZICsgcHkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgYm9vbCBIaXRUZXN0TGF5ZXIoTGF5ZXIgbGF5ZXIsIGludCBjb2xsaWRlclZhbHVlKSB7XHJcblxyXG4gICAgICAgICAgICBmbG9hdCBweCA9IHBhcmVudC5wb3NpdGlvbi5YO1xyXG4gICAgICAgICAgICBmbG9hdCBweSA9IHBhcmVudC5wb3NpdGlvbi5ZO1xyXG5cclxuICAgICAgICAgICAgaWYgKHBhcmVudC5fcGFyZW50ICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHB4ID0gUGFyZW50UG9zQ2FsY3VsYXRpb25YKHBhcmVudC5wb3NpdGlvbi5YLCBwYXJlbnQpO1xyXG4gICAgICAgICAgICAgICAgcHkgPSBQYXJlbnRQb3NDYWxjdWxhdGlvblgocGFyZW50LnBvc2l0aW9uLlksIHBhcmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvcmVhY2ggKFZlY3RvcjQgYiBpbiBfYm94ZXMpXHJcbiAgICAgICAgICAgIHtcclxuXHJcbiAgICAgICAgICAgICAgICBmbG9hdCB0b3RhbFggPSBweCArIGIuWDtcclxuICAgICAgICAgICAgICAgIGZsb2F0IHRvdGFsWSA9IHB5ICsgYi5ZO1xyXG5cclxuICAgICAgICAgICAgICAgIGZsb2F0IHRvdGFsWDIgPSB0b3RhbFggKyBiLlo7XHJcbiAgICAgICAgICAgICAgICBmbG9hdCB0b3RhbFkyID0gdG90YWxZICsgYi5XO1xyXG5cclxuICAgICAgICAgICAgICAgIGludCBsZWZ0X3RpbGUgPSAoaW50KU1hdGguRmxvb3IoKHRvdGFsWCAtIGxheWVyLnBvc2l0aW9uLlgpIC8gbGF5ZXIudGlsZXNXKTtcclxuICAgICAgICAgICAgICAgIGludCByaWdodF90aWxlID0gKGludClNYXRoLkZsb29yKCh0b3RhbFgyIC0gbGF5ZXIucG9zaXRpb24uWCkgLyBsYXllci50aWxlc1cpO1xyXG4gICAgICAgICAgICAgICAgaW50IHRvcF90aWxlID0gKGludClNYXRoLkZsb29yKCh0b3RhbFkgLSBsYXllci5wb3NpdGlvbi5ZKSAvIGxheWVyLnRpbGVzSCk7XHJcbiAgICAgICAgICAgICAgICBpbnQgYm90dG9tX3RpbGUgPSAoaW50KU1hdGguRmxvb3IoKHRvdGFsWTIgLSBsYXllci5wb3NpdGlvbi5ZKSAvIGxheWVyLnRpbGVzSCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChpbnQgeSA9IHRvcF90aWxlLTE7IHkgPD0gYm90dG9tX3RpbGUrMTsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpbnQgeCA9IGxlZnRfdGlsZS0xOyB4IDw9IHJpZ2h0X3RpbGUrMTsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh4IDwgMCB8fCB4ID4gbGF5ZXIuc2l6ZVggLSAxIHx8IHkgPiBsYXllci5zaXplWSAtIDEgfHwgeSA8IDApIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnQgY29sbGlkZXIgPSBsYXllci5jb2xsaXNpb25EYXRhW3gseV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb2xsaWRlciAhPSBjb2xsaWRlclZhbHVlKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsb2F0IHRpbGVYID0gKHggKiBsYXllci50aWxlc1cpICsgbGF5ZXIucG9zaXRpb24uWDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxvYXQgdGlsZVkgPSAoeSAqIGxheWVyLnRpbGVzSCkgKyBsYXllci5wb3NpdGlvbi5ZO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxvYXQgdGlsZVgyID0gdGlsZVggKyBsYXllci50aWxlc1c7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsb2F0IHRpbGVZMiA9IHRpbGVZICsgbGF5ZXIudGlsZXNIO1xyXG5cclxuICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib29sIG92ZXJYID0gKHRvdGFsWCA8IHRpbGVYMikgJiYgKHRvdGFsWDIgPiB0aWxlWCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvb2wgb3ZlclkgPSAodG90YWxZIDwgdGlsZVkyKSAmJiAodG90YWxZMiA+IHRpbGVZKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG92ZXJYICYmIG92ZXJZKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkNvbXBvbmVudHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIE1vdmVtZW50IDogQ29tcG9uZW50XHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIE1vdmVtZW50KEdhbWVPYmplY3QgX3BhcmVudCkgOiBiYXNlKF9wYXJlbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgIH1cclxucHVibGljIHZvaWQgTW92ZVRvd2FyZChWZWN0b3IyIHBvcywgZmxvYXQgc3BlZWQpXHJcbntcclxuICAgIE1vdmVUb3dhcmQocG9zLlgsIHBvcy5ZLCBzcGVlZCk7XHJcbn0gICAgICAgIHB1YmxpYyB2b2lkIE1vdmVUb3dhcmQoZmxvYXQgeCwgZmxvYXQgeSwgZmxvYXQgc3BlZWQpIHtcclxuICAgICAgICAgICAgZmxvYXQgZHggPSB4IC0gcGFyZW50LnBvc2l0aW9uLlg7XHJcbiAgICAgICAgICAgIGZsb2F0IGR5ID0geSAtIHBhcmVudC5wb3NpdGlvbi5ZO1xyXG4gICAgICAgICAgICBmbG9hdCBhbmdsZSA9IChmbG9hdClNYXRoLkF0YW4yKGR5LCBkeCk7XHJcblxyXG4gICAgICAgICAgICBwYXJlbnQucG9zaXRpb24uWCArPSBzcGVlZCAqIChmbG9hdClNYXRoLkNvcyhhbmdsZSk7XHJcbiAgICAgICAgICAgIHBhcmVudC5wb3NpdGlvbi5ZICs9IHNwZWVkICogKGZsb2F0KU1hdGguU2luKGFuZ2xlKTtcclxuICAgICAgICB9XHJcbnB1YmxpYyB2b2lkIExvb2tBdChWZWN0b3IyIHBvcylcclxue1xyXG4gICAgTG9va0F0KHBvcy5YLCBwb3MuWSk7XHJcbn1wdWJsaWMgdm9pZCBMb29rQXQoZmxvYXQgeCwgZmxvYXQgeSlcclxue1xyXG4gICAgTG9va0F0KHgsIHksIHBhcmVudC5wb3NpdGlvbi5YLCBwYXJlbnQucG9zaXRpb24uWSk7XHJcbn0gICAgICAgIHB1YmxpYyB2b2lkIExvb2tBdChmbG9hdCB4LGZsb2F0IHksIGZsb2F0IGNlbnRlclgsIGZsb2F0IGNlbnRlclkpIHtcclxuICAgICAgICAgICAgZmxvYXQgeDIgPSBjZW50ZXJYIC0geDtcclxuICAgICAgICAgICAgZmxvYXQgeTIgPSB5IC0gY2VudGVyWTtcclxuICAgICAgICAgICAgZmxvYXQgYW5nbGUgPSAoZmxvYXQpTWF0aC5BdGFuMih4MiwgeTIpO1xyXG4gICAgICAgICAgICBwYXJlbnQuYW5nbGUgPSBhbmdsZSAqIChmbG9hdCkoMTgwL01hdGguUEkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HcmFwaGljcztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkNvbXBvbmVudHM7XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0c1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgU3ByaXRlIDogR2FtZU9iamVjdFxyXG4gICAge1xyXG4gICAgICAgIC8vQ29uc3RydWN0b3JcclxuICAgICAgICBwdWJsaWMgU3ByaXRlKFZlY3RvcjIgcG9zaXRpb24sIFZlY3RvcjIgc2l6ZSwgVW5pb248SFRNTENhbnZhc0VsZW1lbnQsIEltYWdlLCBTcHJpdGVTaGVldD4gaW1hZ2UpIHtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG4gICAgICAgICAgICB0aGlzLnNpemUgPSBzaXplO1xyXG4gICAgICAgICAgICB0aGlzLmltYWdlID0gaW1hZ2U7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IFwiU3ByaXRlXCI7XHJcbiAgICAgICAgICAgIHRoaXMucGl2b3QgPSBuZXcgVmVjdG9yMihzaXplLlgvMixzaXplLlkvMik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5NYXRocztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuQ29tcG9uZW50cztcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBUZXh0QXJlYSA6IEdhbWVPYmplY3RcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgc3RyaW5nIHRleHQgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIHN0cmluZyBjb2xvciB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAvLy8gSW4gcGl4ZWxzLCBFeGFtcGxlOiAxNFxyXG4gICAgICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICAgICAgcHVibGljIGludCBmb250U2l6ZSB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAvLy8gRXhhbXBsZTogQXJpYWxcclxuICAgICAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgZm9udCB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIC8vQ29uc3RydWN0b3JcclxuICAgICAgICBwdWJsaWMgVGV4dEFyZWEoVmVjdG9yMiBwb3NpdGlvbiwgVmVjdG9yMiBzaXplLCBzdHJpbmcgY29sb3IgPSBcIlwiLCBpbnQgZm9udFNpemUgPSAxNCwgc3RyaW5nIGZvbnQgPSBcIlwiKTp0aGlzKHBvc2l0aW9uLCBzaXplKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcclxuICAgICAgICAgICAgdGhpcy5zaXplID0gc2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xyXG4gICAgICAgICAgICB0aGlzLmZvbnRTaXplID0gZm9udFNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuZm9udCA9IGZvbnQ7XHJcbiAgICAgICAgICAgIHRoaXMucGl2b3QgPSBuZXcgVmVjdG9yMihzaXplLlggLyAyLCBzaXplLlkgLyAyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgVGV4dEFyZWEoVmVjdG9yMiBwb3NpdGlvbiwgVmVjdG9yMiBzaXplKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcclxuICAgICAgICAgICAgdGhpcy5zaXplID0gc2l6ZTtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gXCJUZXh0QXJlYVwiO1xyXG5cclxuICAgICAgICAgICAgSFRNTENhbnZhc0VsZW1lbnQgY2FudmFzID0gKEhUTUxDYW52YXNFbGVtZW50KURvY3VtZW50LkNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcbiAgICAgICAgICAgIGNhbnZhcy5XaWR0aCA9IChpbnQpTWF0aC5GbG9vcihzaXplLlgpO1xyXG4gICAgICAgICAgICBjYW52YXMuSGVpZ2h0ID0gKGludClNYXRoLkZsb29yKHNpemUuWSk7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UgPSBjYW52YXM7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgRXJhc2VBbGwoKSB7XHJcbiAgICAgICAgICAgIEhUTUxDYW52YXNFbGVtZW50IGNhbnZhcyA9IChIVE1MQ2FudmFzRWxlbWVudClpbWFnZTtcclxuICAgICAgICAgICAgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGN0eCA9IChDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpY2FudmFzLkdldENvbnRleHQoXCIyZFwiKTtcclxuICAgICAgICAgICAgY3R4LkNsZWFyUmVjdCgwLCAwLCBjYW52YXMuV2lkdGgsIGNhbnZhcy5IZWlnaHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgUmV3cml0ZShzdHJpbmcgdGV4dCwgaW50IHggPSAwLCBpbnQgeSA9IDApIHtcclxuICAgICAgICAgICAgRXJhc2VBbGwoKTtcclxuICAgICAgICAgICAgV3JpdGUodGV4dCx4LHkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgV3JpdGUoc3RyaW5nIHRleHQsIGludCB4ID0gMCwgaW50IHkgPSAwKSB7XHJcbiAgICAgICAgICAgIEhUTUxDYW52YXNFbGVtZW50IGNhbnZhcyA9IChIVE1MQ2FudmFzRWxlbWVudClpbWFnZTtcclxuICAgICAgICAgICAgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGN0eCA9IChDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpY2FudmFzLkdldENvbnRleHQoXCIyZFwiKTtcclxuICAgICAgICAgICAgY3R4LkZpbGxTdHlsZSA9IGNvbG9yO1xyXG4gICAgICAgICAgICBjdHguRm9udCA9IGZvbnRTaXplICsgXCJweCBcIiArIGZvbnQ7XHJcbiAgICAgICAgICAgIGN0eC5GaWxsVGV4dCh0ZXh0LCB4LCB5K2ZvbnRTaXplKTtcclxuICAgICAgICB9XHJcblxuICAgIFxucHJpdmF0ZSBzdHJpbmcgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX3RleHQ9XCJcIjtwcml2YXRlIHN0cmluZyBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fY29sb3I9XCJcIjtwcml2YXRlIGludCBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fZm9udFNpemU9MTQ7cHJpdmF0ZSBzdHJpbmcgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX2ZvbnQ9XCJcIjt9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzLlRpbGVNYXBcclxue1xyXG4gICAgcHVibGljIGNsYXNzIExheWVyIDogR2FtZU9iamVjdFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyB1aW50IGluZGV4IHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgaW50WyxdIGRhdGEgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIGludGVybmFsIGludFssXSBjb2xsaXNpb25EYXRhIHsgZ2V0OyBzZXQ7fVxyXG5cclxuICAgICAgICBwdWJsaWMgdWludCB0aWxlc1cgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIHVpbnQgdGlsZXNIIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyB1aW50IHNpemVYIHsgZ2V0OyBwcml2YXRlIHNldDt9XHJcbiAgICAgICAgcHVibGljIHVpbnQgc2l6ZVkgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgU3ByaXRlU2hlZXQgX3NoZWV0O1xyXG5cclxuICAgICAgICBwdWJsaWMgTGF5ZXIodWludCBfaW5kZXgsIFRpbGVNYXAgdGlsZU1hcCkge1xyXG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBcIlRpbGVtYXBMYXllclwiO1xyXG4gICAgICAgICAgICBpbmRleCA9IF9pbmRleDtcclxuICAgICAgICAgICAgdGlsZXNXID0gdGlsZU1hcC5fdGlsZVNoZWV0LnNwcml0ZVNpemVYO1xyXG4gICAgICAgICAgICB0aWxlc0ggPSB0aWxlTWFwLl90aWxlU2hlZXQuc3ByaXRlU2l6ZVk7XHJcbiAgICAgICAgICAgIHNpemVYID0gKHVpbnQpdGlsZU1hcC5fc2l6ZS5YO1xyXG4gICAgICAgICAgICBzaXplWSA9ICh1aW50KXRpbGVNYXAuX3NpemUuWTtcclxuICAgICAgICAgICAgZGF0YSA9IG5ldyBpbnRbc2l6ZVgsIHNpemVZXTtcclxuICAgICAgICAgICAgY29sbGlzaW9uRGF0YSA9IG5ldyBpbnRbc2l6ZVgsIHNpemVZXTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZVg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzaXplWTsgaisrKXtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhW2ksIGpdID0gLTE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHBvc2l0aW9uID0gdGlsZU1hcC5wb3NpdGlvbjtcclxuICAgICAgICAgICAgc2l6ZSA9IG5ldyBWZWN0b3IyKHNpemVYICogdGlsZXNXLCBzaXplWSAqIHRpbGVzSCk7XHJcbiAgICAgICAgICAgIHRoaXMucGl2b3QgPSBuZXcgVmVjdG9yMihzaXplLlggLyAyLCBzaXplLlkgLyAyKTtcclxuXHJcbiAgICAgICAgICAgIEhUTUxDYW52YXNFbGVtZW50IGNhbnZhcyA9IChIVE1MQ2FudmFzRWxlbWVudClEb2N1bWVudC5DcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xyXG4gICAgICAgICAgICBjYW52YXMuV2lkdGggPSAoaW50KU1hdGguRmxvb3Ioc2l6ZS5YKTtcclxuICAgICAgICAgICAgY2FudmFzLkhlaWdodCA9IChpbnQpTWF0aC5GbG9vcihzaXplLlkpO1xyXG4gICAgICAgICAgICBpbWFnZSA9IGNhbnZhcztcclxuXHJcbiAgICAgICAgICAgIF9zaGVldCA9IHRpbGVNYXAuX3RpbGVTaGVldDtcclxuICAgICAgICAgICAgX3NoZWV0LmRhdGEuT25Mb2FkICs9IENvbnN0cnVjdDtcclxuXHJcbiAgICAgICAgfVxyXG5wdWJsaWMgdm9pZCBDb25zdHJ1Y3QoKVxyXG57XHJcbiAgICBDb25zdHJ1Y3QobmV3IEV2ZW50KFwiXCIpKTtcclxufSAgICAgICAgaW50ZXJuYWwgdm9pZCBDb25zdHJ1Y3QoRXZlbnQgZSkge1xyXG4gICAgICAgICAgICBmb3IgKHVpbnQgeSA9IDA7IHkgPCBzaXplWTsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHVpbnQgeCA9IDA7IHggPCBzaXplWDsgeCsrKXtcclxuICAgICAgICAgICAgICAgICAgICBTZXRUaWxlKHgseSxkYXRhW3gseV0sdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGludGVybmFsIHZvaWQgU2V0VGlsZSh1aW50IHgsIHVpbnQgeSwgaW50IHRpbGUsIGJvb2wgYnlQYXNzT2xkKSB7XHJcbiAgICAgICAgICAgIGlmICghKHggPj0gMCAmJiB4IDw9IHNpemVYICYmIHkgPj0gMCAmJiB5IDw9IHNpemVZKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpbnQgb2xkVGlsZSA9IGRhdGFbeCwgeV07XHJcblxyXG4gICAgICAgICAgICBIVE1MQ2FudmFzRWxlbWVudCBjYW52YXMgPSAoSFRNTENhbnZhc0VsZW1lbnQpaW1hZ2U7XHJcbiAgICAgICAgICAgIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBjdHggPSAoQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKWNhbnZhcy5HZXRDb250ZXh0KFwiMmRcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAodGlsZSA9PSAtMSAmJiBvbGRUaWxlICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhW3gsIHldID0gdGlsZTtcclxuICAgICAgICAgICAgICAgIGN0eC5DbGVhclJlY3QoeCp0aWxlc1cseSp0aWxlc0gsdGlsZXNXLHRpbGVzSCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRpbGUgPT0gLTEpIHJldHVybjtcclxuICAgICAgICAgICAgaWYob2xkVGlsZSAhPSB0aWxlIHx8IGJ5UGFzc09sZCkgeyBcclxuICAgICAgICAgICAgICAgIGRhdGFbeCwgeV0gPSB0aWxlO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpbWFnZSA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICBmbG9hdCBjYXNlX3ggPSAoZGF0YVt4LCB5XSAlIHRpbGVzVykgKiB0aWxlc1c7XHJcbiAgICAgICAgICAgICAgICBmbG9hdCBjYXNlX3kgPSAoZmxvYXQpTWF0aC5GbG9vcigoZmxvYXQpZGF0YVt4LCB5XSAvIHRpbGVzVykgKiB0aWxlc0g7XHJcblxyXG4gICAgICAgICAgICAgICAgY3R4LkRyYXdJbWFnZShfc2hlZXQuZGF0YSwgY2FzZV94LCBjYXNlX3ksIHRpbGVzVywgdGlsZXNILCB4ICogdGlsZXNXLCB5ICogdGlsZXNILCB0aWxlc1csIHRpbGVzSCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnRlcm5hbCBpbnQgR2V0VGlsZSh1aW50IHgsIHVpbnQgeSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZGF0YVt4LCB5XTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGludGVybmFsIHZvaWQgU2V0Q29sbGlzaW9uKHVpbnQgeCwgdWludCB5LCBpbnQgY29sbGlzaW9uKSB7XHJcbiAgICAgICAgICAgIGNvbGxpc2lvbkRhdGFbeCwgeV0gPSBjb2xsaXNpb247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnRlcm5hbCBpbnQgR2V0Q29sbGlzaW9uKHVpbnQgeCwgdWludCB5KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbGxpc2lvbkRhdGFbeCwgeV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdCn0K
