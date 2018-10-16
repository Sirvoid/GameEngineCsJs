using System;
using Bridge;
using Bridge.Html5;
using Newtonsoft.Json;

namespace GameEngineJS.Graphics
{
    public class Drawer
    {
        public CanvasRenderingContext2D ctx { get; set; }

        public Drawer(HTMLCanvasElement canvas) {
            ctx = (CanvasRenderingContext2D)canvas.GetContext("2d");
        }

        public void Draw(int x, int y, int w, int h, dynamic img) => Draw(x, y, w, h, 0, img, false, 1);
        public void Draw(int x,int y,int w, int h, float r, dynamic img, bool follow, float alpha) {
            ctx.DrawImage(img, x, y, w, h);
        }
    }
}
