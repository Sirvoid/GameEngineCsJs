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
            _ctx.ImageSmoothingEnabled = false;
            _canvas.Style.ImageRendering = ImageRendering.Pixelated;
            _ctx.Save();

            if (img.data != null) {
                img = img.data;
            }

            //Object Rotation
            float ox = x + (w / 2);
            float oy = y + (h / 2);

            _ctx.Translate(ox, oy);
            _ctx.Rotate((r) * Math.PI / 180); //degree
            _ctx.Translate(-ox, -oy);
            //-------

            _ctx.DrawImage(img, x, y, w, h);

            _ctx.Restore();
        }
    }
}
