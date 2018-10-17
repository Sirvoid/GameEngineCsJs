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

        private DisplayList mainDisplayList;
        private Drawer drawer;
        private HTMLCanvasElement canvas;
        private string color;

        public Scene(DisplayList objList,string canvasID,string _color) {
            camera = new Camera();
            mainDisplayList = objList;
            canvas = Document.QuerySelector<HTMLCanvasElement>("canvas#" + canvasID);
            drawer = new Drawer(canvas);
            color = _color;
        }

        public void Refresh() {
            drawer.FillScreen(color);
            foreach (GameObject obj in mainDisplayList.list) {
                drawer.Draw(obj.position.X - camera.position.X, obj.position.Y - camera.position.Y, obj.size.X, obj.size.Y, obj.image);
            }
        }
    }
}
