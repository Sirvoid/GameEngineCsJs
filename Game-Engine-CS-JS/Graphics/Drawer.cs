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

        public void Draw(float x, float y, float w, float h, float r, float pivotX, float pivotY, dynamic img, bool follow = false, float alpha = 1) {
            _ctx.ImageSmoothingEnabled = false;
            _canvas.Style.ImageRendering = ImageRendering.Pixelated;
            _ctx.Save();

            float sx = 0;
            float sy = 0;
            float sw = w;
            float sh = h;

            if (img == null) return;

            if (img.spriteSizeX != null && img.spriteSizeY != null) {
                SpriteSheet img2 = (SpriteSheet)img;
                if (img2.data.Width == 0) return; 
                sx = (img2.currentIndex % (img2.data.Width / img2.spriteSizeX)) * img2.spriteSizeX;
                sy = (float)Math.Floor(img2.currentIndex / ((double)img2.data.Width / img2.spriteSizeX)) * img2.spriteSizeY;
                sw = img2.spriteSizeX;
                sh = img2.spriteSizeY;
            }

            if (img.data != null)
            {
                img = img.data;
            }

            if(r != 0) { 
                //Object Rotation
                float ox = x + pivotX;
                float oy = y + pivotY;

                _ctx.Translate(ox, oy);
                _ctx.Rotate((r) * Math.PI / 180); //degree
                _ctx.Translate(-ox, -oy);
                //-------
            }

            _ctx.DrawImage(img, sx, sy, sw, sh, (int)x, (int)y, w, h);
            _ctx.Restore();
        }
    }
}
