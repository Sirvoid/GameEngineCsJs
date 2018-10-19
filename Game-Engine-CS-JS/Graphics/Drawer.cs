using System;
using Bridge;
using Bridge.Html5;
using Newtonsoft.Json;

namespace GameEngineJS.Graphics
{
    public class Drawer
    {
        private CanvasRenderingContext2D _ctx;
        private HTMLCanvasElement _canvas;

        public Drawer(HTMLCanvasElement canvas) {
            _ctx = (CanvasRenderingContext2D)canvas.GetContext("2d");
            _canvas = canvas;
        }

        public void FillScreen(string color) {
            _ctx.FillStyle = color;
            _ctx.FillRect(0,0,_canvas.Width,_canvas.Height);
        }

        public void Draw(float x, float y, float w, float h, dynamic img) => Draw(x, y, w, h, 0, img, false, 1);
        public void Draw(float x, float y, float w, float h, float r, dynamic img, bool follow, float alpha) {
            if (img.data != null) {
                img = img.data;
            }
            _ctx.DrawImage(img, x, y, w, h);
        }
    }
}
