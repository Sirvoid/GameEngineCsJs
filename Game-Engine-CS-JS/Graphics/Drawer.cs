using System;
using Bridge;
using Bridge.Html5;
using Newtonsoft.Json;

namespace GameEngineJS.Graphics
{
    public class Drawer
    {
        public CanvasRenderingContext2D ctx { get; set; }
        private HTMLCanvasElement canvas { get; set; }

        public Drawer(HTMLCanvasElement _canvas) {
            ctx = (CanvasRenderingContext2D)_canvas.GetContext("2d");
            canvas = _canvas;
        }

        public void FillScreen(string color) {
            ctx.FillStyle = color;
            ctx.FillRect(0,0,canvas.Width,canvas.Height);
        }

        public void Draw(float x, float y, float w, float h, dynamic img) => Draw(x, y, w, h, 0, img, false, 1);
        public void Draw(float x, float y, float w, float h, float r, dynamic img, bool follow, float alpha) {
            if (img.data != null) {
                img = img.data;
            }
            ctx.DrawImage(img, x, y, w, h);
        }
    }
}
