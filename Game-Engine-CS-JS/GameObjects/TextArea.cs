using System;
using Bridge;
using Bridge.Html5;
using GameEngineJS.Maths;
using GameEngineJS.Graphics;
using GameEngineJS.Components;
using System.Collections.Generic;

namespace GameEngineJS.GameObjects
{
    public class TextArea : GameObject
    {
        public string text { get; private set; } = "";
        public string color { get; set; } = "";

        /// <summary>
        /// In pixels, Example: 14
        /// </summary>
        public int fontSize { get; set; } = 14;

        /// <summary>
        /// Example: Arial
        /// </summary>
        public string font { get; set; } = "";

        //Constructor
        public TextArea(Vector2 position, Vector2 size, string color = "", int fontSize = 14, string font = ""):this(position, size) {
            this.position = position;
            this.size = size;
            this.color = color;
            this.fontSize = fontSize;
            this.font = font;
        }

        private TextArea(Vector2 position, Vector2 size) {
            this.position = position;
            this.size = size;
            this.type = "TextArea";

            HTMLCanvasElement canvas = (HTMLCanvasElement)Document.CreateElement("canvas");
            canvas.Width = (int)Math.Floor(size.X);
            canvas.Height = (int)Math.Floor(size.Y);
            this.image = canvas;

        }

        public void EraseAll() {
            HTMLCanvasElement canvas = (HTMLCanvasElement)image;
            CanvasRenderingContext2D ctx = (CanvasRenderingContext2D)canvas.GetContext("2d");
            ctx.ClearRect(0, 0, canvas.Width, canvas.Height);
        }

        public void Rewrite(string text, int x = 0, int y = 0) {
            EraseAll();
            Write(text,x,y);
        }

        public void Write(string text, int x = 0, int y = 0) {
            HTMLCanvasElement canvas = (HTMLCanvasElement)image;
            CanvasRenderingContext2D ctx = (CanvasRenderingContext2D)canvas.GetContext("2d");
            ctx.FillStyle = color;
            ctx.Font = fontSize + "px " + font;
            ctx.FillText(text, x, y+fontSize);
        }
    }
}
