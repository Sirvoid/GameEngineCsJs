using System;
using Bridge;
using Bridge.Html5;
using Newtonsoft.Json;
using GameEngineJS.GameObjects;
using GameEngineJS.Graphics;
using GameEngineJS.Math;

namespace GameEngineJS.Display
{
    public class Scene
    {

        public Camera camera { get; set; }

        private DisplayList _mainDisplayList;
        private Drawer _drawer;
        private HTMLCanvasElement _canvas;
        private string _color;

        public Scene(DisplayList objList,string canvasID,string color) {
            camera = new Camera();
            _mainDisplayList = objList;
            _canvas = Document.QuerySelector<HTMLCanvasElement>("canvas#" + canvasID);
            _drawer = new Drawer(_canvas);
            _color = color;
        }

        public void Refresh() {
            _drawer.FillScreen(_color);
            foreach (GameObject obj in _mainDisplayList.list) {
                _drawer.Draw(obj.position.X - camera.position.X, obj.position.Y - camera.position.Y, obj.size.X, obj.size.Y, obj.image);
            }
        }
    }
}
