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
                this.position = new GameEngineJS.Math.Vector2(0, 0);
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
                        this._drawer.Draw(obj.position.X - this.camera.position.X, obj.position.Y - this.camera.position.Y, obj.size.X, obj.size.Y, obj.image);
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
        ctors: {
            ctor: function (canvasID, color) {
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
                if (img.data != null) {
                    img = img.data;
                }
                this._ctx.drawImage(img, x, y, w, h);
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

    Bridge.define("GameEngineJS.Math.Vector2", {
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
            animations: null,
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
                this.animations = new (System.Collections.Generic.Dictionary$2(System.String,System.Collections.Generic.List$1(GameEngineJS.Graphics.Image)))();
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
            Create: function (animationName, list) {
                this.animations.set(animationName, list);
            },
            Update: function () {
                if (!this._playing) {
                    return;
                }

                var now = System.DateTime.subdd(System.DateTime.getNow(), System.DateTime.addYears(System.DateTime.getMinValue(), 2017)).getTotalMilliseconds();
                var delta = now - this.lastTimeFrame;
                if (delta > ((Bridge.Int.div(1000, this.fps)) | 0)) {
                    this.currentFrame = (this.currentFrame + 1) | 0;
                    if (this.currentFrame >= this.animations.get(this.currentAnimation).Count) {
                        this.currentFrame = 0;
                    }
                    System.Console.Write(this.currentFrame + " " + (this.currentAnimation || ""));
                    this.parent.image = this.animations.get(this.currentAnimation).getItem(this.currentFrame);

                    this.lastTimeFrame = now;
                }

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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJHYW1lRW5naW5lSlMuanMiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbIkNvbXBvbmVudHMvQ29tcG9uZW50LmNzIiwiQ29tcG9uZW50cy9Db21wb25lbnRSZWFkZXIuY3MiLCJEaXNwbGF5L0NhbWVyYS5jcyIsIkRpc3BsYXkvRGlzcGxheUxpc3QuY3MiLCJEaXNwbGF5L1NjZW5lLmNzIiwiRXZlbnRzL0tleUJvYXJkRXZlbnQuY3MiLCJHYW1lLmNzIiwiR2FtZU9iamVjdHMvR2FtZU9iamVjdC5jcyIsIkdyYXBoaWNzL0RyYXdlci5jcyIsIkdyYXBoaWNzL0ltYWdlLmNzIiwiTWF0aC9WZWN0b3IyLmNzIiwiU3lzdGVtL1NjaGVkdWxlci5jcyIsIkNvbXBvbmVudHMvQW5pbWF0b3IuY3MiLCJHYW1lT2JqZWN0cy9TcHJpdGUuY3MiXSwKICAibmFtZXMiOiBbIiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7NEJBUTJCQTs7Z0JBQ2ZBLGNBQVNBOzs7Ozs7Ozs7Ozs7OzRCQ0VZQTs7Z0JBQ3JCQSxtQkFBY0E7Ozs7OztnQkFJZEEsMEJBQTJCQTs7Ozt3QkFDdkJBLDJCQUFzREE7Ozs7Z0NBRWxEQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztnQkNMUkEsZ0JBQVdBLElBQUlBO2dCQUNmQTs7OEJBR1VBLFdBQWtCQTs7Z0JBQzVCQSxnQkFBV0E7Z0JBQ1hBLGdCQUFXQTs7Ozs7Ozs7Ozs7NEJDSGdDQSxLQUFJQTs7OzsyQkFMbkNBO2dCQUNaQSxjQUFTQTs7Ozs7Ozs7Ozs7Ozs7NEJDT0FBLFNBQW9CQSxVQUFnQkE7O2dCQUM3Q0EsY0FBU0EsSUFBSUE7Z0JBQ2JBLHdCQUFtQkE7Z0JBQ25CQSxlQUFVQSx1QkFBMENBLGFBQVlBO2dCQUNoRUEsZUFBVUEsSUFBSUEsNkJBQU9BO2dCQUNyQkEsY0FBU0E7Ozs7OztnQkFJVEEsd0JBQW1CQTtnQkFDbkJBLDBCQUEyQkE7Ozs7d0JBQ3ZCQSxrQkFBYUEsaUJBQWlCQSx3QkFBbUJBLGlCQUFpQkEsd0JBQW1CQSxZQUFZQSxZQUFZQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0JDWmpIQSwwQkFBMEJBLFlBQW9CQSxBQUFtREE7Z0JBQ2pHQSwwQkFBMEJBLFdBQW1CQSxBQUFtREE7Z0JBQ2hHQSwwQkFBMEJBLFNBQWlCQSxBQUFtREE7Ozs7a0NBRzFFQTtnQkFDcEJBLElBQUlBLDJDQUFvQkE7b0JBQU1BOztnQkFDOUJBLHNCQUF3QkE7O2lDQUdMQTtnQkFFbkJBLElBQUlBLDBDQUFtQkE7b0JBQU1BOztnQkFDN0JBLHFCQUF1QkE7OytCQUdOQTtnQkFFakJBLElBQUlBLHdDQUFpQkE7b0JBQU1BOztnQkFDM0JBLG1CQUFxQkE7Ozs7Ozs7Ozs7Ozs7OzRCQ2hCYkEsVUFBZ0JBOzs7Z0JBRXhCQSxvQkFBZUEsSUFBSUE7Z0JBQ25CQSxhQUFRQSxJQUFJQSwyQkFBTUEsbUJBQWFBLFVBQVNBO2dCQUN4Q0Esd0JBQW1CQSxJQUFJQSx3Q0FBZ0JBOztnQkFFdkNBLGlCQUFZQSxJQUFJQTtnQkFDaEJBLG1CQUFjQSxBQUF1QkE7Z0JBQ3JDQSxtQkFBY0EsQUFBdUJBOzs7O2dDQUdwQkE7Z0JBQ2pCQSxzQkFBaUJBOzs7Ozs7Ozs7Ozs7OztrQ0NsQjZCQSxLQUFJQTs7OztvQ0FHN0JBLGNBQXFCQTtnQkFFMUNBLG9CQUFXQSxjQUFnQkE7Ozs7Ozs7Ozs7OzRCQ1RqQkE7O2dCQUNWQSxZQUFPQSxBQUEwQkE7Z0JBQ2pDQSxlQUFVQTs7OztrQ0FHU0E7Z0JBQ25CQSxzQkFBaUJBO2dCQUNqQkEseUJBQWtCQSxvQkFBY0E7OzRCQUUzQkEsR0FBU0EsR0FBU0EsR0FBU0EsR0FBU0E7Z0JBRWpEQSxZQUFLQSxHQUFHQSxHQUFHQSxHQUFHQSxNQUFNQTs7OEJBQ0VBLEdBQVNBLEdBQVNBLEdBQVNBLEdBQVNBLEdBQVNBLEtBQWFBLFFBQWFBO2dCQUNyRkEsSUFBSUEsWUFBWUE7b0JBQ1pBLE1BQU1BOztnQkFFVkEsb0JBQWVBLEtBQUtBLEdBQUdBLEdBQUdBLEdBQUdBOzs7Ozs7Ozs7OzRCQ2hCcEJBOztnQkFDVEEsWUFBT0E7Z0JBQ1BBLGdCQUFXQTs7Ozs7Ozs7Ozs7OzRCQ0hBQSxJQUFXQTs7Z0JBQ3RCQSxTQUFJQTtnQkFDSkEsU0FBSUE7Ozs7Ozs7Ozs7O21DQ0gyQkEsS0FBSUE7Ozs7Z0JBR25DQTs7OzsyQkFHWUE7Z0JBQ1pBLHFCQUFnQkEsQUFBd0JBO29CQUFNQTs7Ozs7Z0JBSzlDQSwwQkFBcUJBOzs7O3dCQUNqQkE7Ozs7Ozs7O2dCQUdKQSw2QkFBNkJBLEFBQXVCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7NEJDVHhDQTs7a0VBQTBCQTtnQkFFdENBLGtCQUFhQSxLQUFJQTs7OzttQ0FFTEE7Z0JBRXBCQSxtQkFBWUE7O3FDQUNpQkEsZUFBc0JBO2dCQUMzQ0Esd0JBQW1CQTtnQkFDbkJBLG9CQUFlQTtnQkFDZkE7OzhCQUdlQSxlQUFzQkE7Z0JBQ3JDQSxvQkFBV0EsZUFBaUJBOzs7Z0JBSTVCQSxJQUFJQSxDQUFDQTtvQkFBVUE7OztnQkFFZkEsVUFBYUEsZ0RBQXNCQTtnQkFDbkNBLFlBQWVBLE1BQU1BO2dCQUNyQkEsSUFBSUEsUUFBUUEsdUJBQUtBO29CQUNiQTtvQkFDQUEsSUFBSUEscUJBQWdCQSxvQkFBV0E7d0JBQzNCQTs7b0JBRUpBLHFCQUFjQSwyQkFBcUJBO29CQUNuQ0Esb0JBQWVBLG9CQUFXQSwrQkFBa0JBOztvQkFFNUNBLHFCQUFnQkE7Ozs7Ozs7Ozs7NEJDbENWQSxXQUFtQkEsT0FBZUE7OztnQkFDNUNBLGdCQUFXQTtnQkFDWEEsWUFBT0E7Z0JBQ1BBLGFBQVFBIiwKICAic291cmNlc0NvbnRlbnQiOiBbInVzaW5nIFN5c3RlbTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5Db21wb25lbnRzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBDb21wb25lbnRcclxuICAgIHtcclxuICAgICAgICBpbnRlcm5hbCBHYW1lT2JqZWN0IHBhcmVudCB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgaW50ZXJuYWwgQ29tcG9uZW50KEdhbWVPYmplY3QgX3BhcmVudCkge1xyXG4gICAgICAgICAgICBwYXJlbnQgPSBfcGFyZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW50ZXJuYWwgdmlydHVhbCB2b2lkIFVwZGF0ZSgpIHt9XHJcblxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5EaXNwbGF5O1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHM7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkNvbXBvbmVudHNcclxue1xyXG4gICAgaW50ZXJuYWwgY2xhc3MgQ29tcG9uZW50UmVhZGVyXHJcbiAgICB7XHJcbiAgICAgICAgaW50ZXJuYWwgRGlzcGxheUxpc3QgZGlzcGxheUxpc3QgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBpbnRlcm5hbCBDb21wb25lbnRSZWFkZXIoRGlzcGxheUxpc3QgbGlzdCkge1xyXG4gICAgICAgICAgICBkaXNwbGF5TGlzdCA9IGxpc3Q7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnRlcm5hbCB2b2lkIHVwZGF0ZSgpIHtcclxuICAgICAgICAgICAgZm9yZWFjaCAoR2FtZU9iamVjdCBvYmogaW4gZGlzcGxheUxpc3QubGlzdCkge1xyXG4gICAgICAgICAgICAgICAgZm9yZWFjaCAoS2V5VmFsdWVQYWlyPHN0cmluZywgQ29tcG9uZW50PiBjb21wb25lbnQgaW4gb2JqLmNvbXBvbmVudHMpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LlZhbHVlLlVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5NYXRoO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5EaXNwbGF5XHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBDYW1lcmFcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgVmVjdG9yMiBwb3NpdGlvbiB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IHJvdGF0aW9uIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIENhbWVyYSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwb3NpdGlvbiA9IG5ldyBWZWN0b3IyKDAsMCk7XHJcbiAgICAgICAgICAgIHJvdGF0aW9uID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBDYW1lcmEoVmVjdG9yMiBfcG9zaXRpb24sZmxvYXQgX3JvdGF0aW9uKSB7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uID0gX3Bvc2l0aW9uO1xyXG4gICAgICAgICAgICByb3RhdGlvbiA9IF9yb3RhdGlvbjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuRGlzcGxheVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgRGlzcGxheUxpc3RcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgTGlzdDxHYW1lT2JqZWN0PiBsaXN0IHsgZ2V0OyBzZXQ7IH0gIFxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBBZGQoR2FtZU9iamVjdCBvYmopIHtcclxuICAgICAgICAgICAgbGlzdC5BZGQob2JqKTtcclxuICAgICAgICB9XHJcblxuICAgIFxucHJpdmF0ZSBMaXN0PEdhbWVPYmplY3Q+IF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19saXN0PW5ldyBMaXN0PEdhbWVPYmplY3Q+KCkgO31cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aDtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuRGlzcGxheVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgU2NlbmVcclxuICAgIHtcclxuXHJcbiAgICAgICAgcHVibGljIENhbWVyYSBjYW1lcmEgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwcml2YXRlIERpc3BsYXlMaXN0IF9tYWluRGlzcGxheUxpc3Q7XHJcbiAgICAgICAgcHJpdmF0ZSBEcmF3ZXIgX2RyYXdlcjtcclxuICAgICAgICBwcml2YXRlIEhUTUxDYW52YXNFbGVtZW50IF9jYW52YXM7XHJcbiAgICAgICAgcHJpdmF0ZSBzdHJpbmcgX2NvbG9yO1xyXG5cclxuICAgICAgICBwdWJsaWMgU2NlbmUoRGlzcGxheUxpc3Qgb2JqTGlzdCxzdHJpbmcgY2FudmFzSUQsc3RyaW5nIGNvbG9yKSB7XHJcbiAgICAgICAgICAgIGNhbWVyYSA9IG5ldyBDYW1lcmEoKTtcclxuICAgICAgICAgICAgX21haW5EaXNwbGF5TGlzdCA9IG9iakxpc3Q7XHJcbiAgICAgICAgICAgIF9jYW52YXMgPSBEb2N1bWVudC5RdWVyeVNlbGVjdG9yPEhUTUxDYW52YXNFbGVtZW50PihcImNhbnZhcyNcIiArIGNhbnZhc0lEKTtcclxuICAgICAgICAgICAgX2RyYXdlciA9IG5ldyBEcmF3ZXIoX2NhbnZhcyk7XHJcbiAgICAgICAgICAgIF9jb2xvciA9IGNvbG9yO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgUmVmcmVzaCgpIHtcclxuICAgICAgICAgICAgX2RyYXdlci5GaWxsU2NyZWVuKF9jb2xvcik7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKEdhbWVPYmplY3Qgb2JqIGluIF9tYWluRGlzcGxheUxpc3QubGlzdCkge1xyXG4gICAgICAgICAgICAgICAgX2RyYXdlci5EcmF3KG9iai5wb3NpdGlvbi5YIC0gY2FtZXJhLnBvc2l0aW9uLlgsIG9iai5wb3NpdGlvbi5ZIC0gY2FtZXJhLnBvc2l0aW9uLlksIG9iai5zaXplLlgsIG9iai5zaXplLlksIG9iai5pbWFnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5FdmVudHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEtleUJvYXJkRXZlbnRcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgZGVsZWdhdGUgdm9pZCBLZXlQcmVzc0V2ZW50KGludCBrZXljb2RlKTtcclxuICAgICAgICBwdWJsaWMgZXZlbnQgS2V5UHJlc3NFdmVudCBPbktleVByZXNzRXZlbnRzO1xyXG5cclxuICAgICAgICBwdWJsaWMgZGVsZWdhdGUgdm9pZCBLZXlEb3duRXZlbnQoaW50IGtleWNvZGUpO1xyXG4gICAgICAgIHB1YmxpYyBldmVudCBLZXlEb3duRXZlbnQgT25LZXlEb3duRXZlbnRzO1xyXG5cclxuICAgICAgICBwdWJsaWMgZGVsZWdhdGUgdm9pZCBLZXlVcEV2ZW50KGludCBrZXljb2RlKTtcclxuICAgICAgICBwdWJsaWMgZXZlbnQgS2V5VXBFdmVudCBPbktleVVwRXZlbnRzO1xyXG5cclxuICAgICAgICBwdWJsaWMgS2V5Qm9hcmRFdmVudCgpIHtcclxuICAgICAgICAgICAgRG9jdW1lbnQuQWRkRXZlbnRMaXN0ZW5lcihFdmVudFR5cGUuS2V5UHJlc3MsIChnbG9iYWw6OlN5c3RlbS5BY3Rpb248Z2xvYmFsOjpCcmlkZ2UuSHRtbDUuRXZlbnQ+KURvS2V5UHJlc3MpO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5BZGRFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5LZXlEb3duLCAoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6QnJpZGdlLkh0bWw1LkV2ZW50PilEb0tleURvd24pO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5BZGRFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5LZXlVcCwgKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxnbG9iYWw6OkJyaWRnZS5IdG1sNS5FdmVudD4pRG9LZXlVcCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgRG9LZXlQcmVzcyhFdmVudCBlKSB7XHJcbiAgICAgICAgICAgIGlmIChPbktleVByZXNzRXZlbnRzID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgT25LZXlQcmVzc0V2ZW50cy5JbnZva2UoZS5BczxLZXlib2FyZEV2ZW50PigpLktleUNvZGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIERvS2V5RG93bihFdmVudCBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKE9uS2V5RG93bkV2ZW50cyA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIE9uS2V5RG93bkV2ZW50cy5JbnZva2UoZS5BczxLZXlib2FyZEV2ZW50PigpLktleUNvZGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIERvS2V5VXAoRXZlbnQgZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChPbktleVVwRXZlbnRzID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgT25LZXlVcEV2ZW50cy5JbnZva2UoZS5BczxLZXlib2FyZEV2ZW50PigpLktleUNvZGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuU3lzdGVtO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5EaXNwbGF5O1xyXG51c2luZyBHYW1lRW5naW5lSlMuQ29tcG9uZW50cztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEdhbWVcclxuICAgIHtcclxuICAgICAgICBcclxuICAgICAgICBwdWJsaWMgRHJhd2VyIGRyYXdlciB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIFNjaGVkdWxlciBzY2hlZHVsZXIgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgU2NlbmUgc2NlbmUgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHByaXZhdGUgRGlzcGxheUxpc3QgX2Rpc3BsYXlMaXN0O1xyXG5cclxuICAgICAgICBwcml2YXRlIENvbXBvbmVudFJlYWRlciBfY29tcG9uZW50UmVhZGVyO1xyXG5cclxuICAgICAgICBwdWJsaWMgR2FtZShzdHJpbmcgY2FudmFzSUQsc3RyaW5nIGNvbG9yKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBfZGlzcGxheUxpc3QgPSBuZXcgRGlzcGxheUxpc3QoKTtcclxuICAgICAgICAgICAgc2NlbmUgPSBuZXcgU2NlbmUoX2Rpc3BsYXlMaXN0LGNhbnZhc0lELGNvbG9yKTtcclxuICAgICAgICAgICAgX2NvbXBvbmVudFJlYWRlciA9IG5ldyBDb21wb25lbnRSZWFkZXIoX2Rpc3BsYXlMaXN0KTtcclxuXHJcbiAgICAgICAgICAgIHNjaGVkdWxlciA9IG5ldyBTY2hlZHVsZXIoKTtcclxuICAgICAgICAgICAgc2NoZWR1bGVyLkFkZCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uKXNjZW5lLlJlZnJlc2gpO1xyXG4gICAgICAgICAgICBzY2hlZHVsZXIuQWRkKChnbG9iYWw6OlN5c3RlbS5BY3Rpb24pX2NvbXBvbmVudFJlYWRlci51cGRhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkQ2hpbGQoR2FtZU9iamVjdCBvYmopIHtcclxuICAgICAgICAgICAgX2Rpc3BsYXlMaXN0LkFkZChvYmopO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5NYXRoO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR3JhcGhpY3M7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5Db21wb25lbnRzO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHNcclxue1xyXG4gICAgcHVibGljIGFic3RyYWN0IGNsYXNzIEdhbWVPYmplY3RcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgVmVjdG9yMiBwb3NpdGlvbiB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIFZlY3RvcjIgc2l6ZSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIFVuaW9uPEhUTUxDYW52YXNFbGVtZW50LCBJbWFnZT4gaW1hZ2UgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBEaWN0aW9uYXJ5PHN0cmluZywgQ29tcG9uZW50PiBjb21wb25lbnRzID0gbmV3IERpY3Rpb25hcnk8c3RyaW5nLCBDb21wb25lbnQ+KCk7XHJcblxyXG4gICAgICAgIC8vUHVibGljIE1ldGhvZHNcclxuICAgICAgICBwdWJsaWMgdm9pZCBBZGRDb21wb25lbnQoc3RyaW5nIGluc3RhbmNlTmFtZSwgQ29tcG9uZW50IGNvbXBvbmVudClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbXBvbmVudHNbaW5zdGFuY2VOYW1lXSA9IGNvbXBvbmVudDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5HcmFwaGljc1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgRHJhd2VyXHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgX2N0eDtcclxuICAgICAgICBwcml2YXRlIEhUTUxDYW52YXNFbGVtZW50IF9jYW52YXM7XHJcblxyXG4gICAgICAgIHB1YmxpYyBEcmF3ZXIoSFRNTENhbnZhc0VsZW1lbnQgY2FudmFzKSB7XHJcbiAgICAgICAgICAgIF9jdHggPSAoQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKWNhbnZhcy5HZXRDb250ZXh0KFwiMmRcIik7XHJcbiAgICAgICAgICAgIF9jYW52YXMgPSBjYW52YXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBGaWxsU2NyZWVuKHN0cmluZyBjb2xvcikge1xyXG4gICAgICAgICAgICBfY3R4LkZpbGxTdHlsZSA9IGNvbG9yO1xyXG4gICAgICAgICAgICBfY3R4LkZpbGxSZWN0KDAsMCxfY2FudmFzLldpZHRoLF9jYW52YXMuSGVpZ2h0KTtcclxuICAgICAgICB9XHJcbnB1YmxpYyB2b2lkIERyYXcoZmxvYXQgeCwgZmxvYXQgeSwgZmxvYXQgdywgZmxvYXQgaCwgZHluYW1pYyBpbWcpXHJcbntcclxuICAgIERyYXcoeCwgeSwgdywgaCwgMCwgaW1nLCBmYWxzZSwgMSk7XHJcbn0gICAgICAgIHB1YmxpYyB2b2lkIERyYXcoZmxvYXQgeCwgZmxvYXQgeSwgZmxvYXQgdywgZmxvYXQgaCwgZmxvYXQgciwgZHluYW1pYyBpbWcsIGJvb2wgZm9sbG93LCBmbG9hdCBhbHBoYSkge1xyXG4gICAgICAgICAgICBpZiAoaW1nLmRhdGEgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgaW1nID0gaW1nLmRhdGE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgX2N0eC5EcmF3SW1hZ2UoaW1nLCB4LCB5LCB3LCBoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG5cclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuR3JhcGhpY3Ncclxue1xyXG4gICAgcHVibGljIGNsYXNzIEltYWdlXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIEhUTUxJbWFnZUVsZW1lbnQgZGF0YSB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBJbWFnZShzdHJpbmcgc3JjKSB7XHJcbiAgICAgICAgICAgIGRhdGEgPSBuZXcgSFRNTEltYWdlRWxlbWVudCgpO1xyXG4gICAgICAgICAgICBkYXRhLlNyYyA9IHNyYztcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLk1hdGhcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFZlY3RvcjJcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgWCB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IFkgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgVmVjdG9yMihmbG9hdCBfeCAsIGZsb2F0IF95KSB7XHJcbiAgICAgICAgICAgIFggPSBfeDtcclxuICAgICAgICAgICAgWSA9IF95O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5TeXN0ZW1cclxue1xyXG4gICAgcHVibGljIGNsYXNzIFNjaGVkdWxlclxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgTGlzdDxBY3Rpb24+IF9hY3Rpb25MaXN0ID0gbmV3IExpc3Q8QWN0aW9uPigpO1xyXG5cclxuICAgICAgICBpbnRlcm5hbCBTY2hlZHVsZXIoKSB7XHJcbiAgICAgICAgICAgIFVwZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkKEFjdGlvbiBtZXRob2RzKSB7XHJcbiAgICAgICAgICAgIF9hY3Rpb25MaXN0LkFkZCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uKSgoKSA9PiBtZXRob2RzKCkpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFVwZGF0ZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3JlYWNoIChBY3Rpb24gYSBpbiBfYWN0aW9uTGlzdCkge1xyXG4gICAgICAgICAgICAgICAgYSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBXaW5kb3cuUmVxdWVzdEFuaW1hdGlvbkZyYW1lKChnbG9iYWw6OlN5c3RlbS5BY3Rpb24pVXBkYXRlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR3JhcGhpY3M7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkNvbXBvbmVudHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEFuaW1hdG9yIDogQ29tcG9uZW50XHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIERpY3Rpb25hcnk8c3RyaW5nLCBMaXN0PEltYWdlPj4gYW5pbWF0aW9ucyB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIHN0cmluZyBjdXJyZW50QW5pbWF0aW9uIHsgZ2V0OyBzZXQ7IH0gIFxyXG4gICAgICAgIHB1YmxpYyBpbnQgY3VycmVudEZyYW1lIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgaW50IGZwcyB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgYm9vbCBfcGxheWluZyA9IGZhbHNlO1xyXG4gICAgICAgIHByaXZhdGUgZG91YmxlIGxhc3RUaW1lRnJhbWUgPSAwO1xyXG5cclxuICAgICAgICBwdWJsaWMgQW5pbWF0b3IoR2FtZU9iamVjdCBwYXJlbnQpIDogYmFzZShwYXJlbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBhbmltYXRpb25zID0gbmV3IERpY3Rpb25hcnk8c3RyaW5nLCBMaXN0PEltYWdlPj4oKTtcclxuICAgICAgICB9XHJcbnB1YmxpYyB2b2lkIEdvdG9BbmRQbGF5KHN0cmluZyBhbmltYXRpb25OYW1lKVxyXG57XHJcbiAgICBHb3RvQW5kUGxheShhbmltYXRpb25OYW1lLCAwKTtcclxufSAgICAgICAgcHVibGljIHZvaWQgR290b0FuZFBsYXkoc3RyaW5nIGFuaW1hdGlvbk5hbWUsIGludCBmcmFtZSkge1xyXG4gICAgICAgICAgICBjdXJyZW50QW5pbWF0aW9uID0gYW5pbWF0aW9uTmFtZTtcclxuICAgICAgICAgICAgY3VycmVudEZyYW1lID0gZnJhbWU7XHJcbiAgICAgICAgICAgIF9wbGF5aW5nID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIENyZWF0ZShzdHJpbmcgYW5pbWF0aW9uTmFtZSwgTGlzdDxJbWFnZT4gbGlzdCl7XHJcbiAgICAgICAgICAgIGFuaW1hdGlvbnNbYW5pbWF0aW9uTmFtZV0gPSBsaXN0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW50ZXJuYWwgb3ZlcnJpZGUgdm9pZCBVcGRhdGUoKSB7XHJcbiAgICAgICAgICAgIGlmICghX3BsYXlpbmcpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGRvdWJsZSBub3cgPSBEYXRlVGltZS5Ob3cuU3VidHJhY3QoRGF0ZVRpbWUuTWluVmFsdWUuQWRkWWVhcnMoMjAxNykpLlRvdGFsTWlsbGlzZWNvbmRzO1xyXG4gICAgICAgICAgICBkb3VibGUgZGVsdGEgPSBub3cgLSBsYXN0VGltZUZyYW1lO1xyXG4gICAgICAgICAgICBpZiAoZGVsdGEgPiAxMDAwL2Zwcykge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEZyYW1lKys7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudEZyYW1lID49IGFuaW1hdGlvbnNbY3VycmVudEFuaW1hdGlvbl0uQ291bnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50RnJhbWUgPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgQ29uc29sZS5Xcml0ZShjdXJyZW50RnJhbWUgKyBcIiBcIiArIGN1cnJlbnRBbmltYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgcGFyZW50LmltYWdlID0gYW5pbWF0aW9uc1tjdXJyZW50QW5pbWF0aW9uXVtjdXJyZW50RnJhbWVdO1xyXG5cclxuICAgICAgICAgICAgICAgIGxhc3RUaW1lRnJhbWUgPSBub3c7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cblxyXG4gICAgXG5wcml2YXRlIHN0cmluZyBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fY3VycmVudEFuaW1hdGlvbj1cIlwiIDtwcml2YXRlIGludCBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fY3VycmVudEZyYW1lPTA7cHJpdmF0ZSBpbnQgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX2Zwcz0xO31cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aDtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuQ29tcG9uZW50cztcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBTcHJpdGUgOiBHYW1lT2JqZWN0XHJcbiAgICB7XHJcbiAgICAgICAgLy9Db25zdHJ1Y3RvclxyXG4gICAgICAgIHB1YmxpYyBTcHJpdGUoVmVjdG9yMiBfcG9zaXRpb24sIFZlY3RvcjIgX3NpemUsIFVuaW9uPEhUTUxDYW52YXNFbGVtZW50LCBJbWFnZT4gX2ltYWdlKSB7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uID0gX3Bvc2l0aW9uO1xyXG4gICAgICAgICAgICBzaXplID0gX3NpemU7XHJcbiAgICAgICAgICAgIGltYWdlID0gX2ltYWdlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXQp9Cg==
