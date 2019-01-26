using System;
using Bridge;
using Bridge.Html5;
using GameEngineJS.Maths;
using GameEngineJS.Graphics;
using GameEngineJS.Components;
using System.Collections.Generic;

namespace GameEngineJS.GameObjects
{
    public class Sprite : GameObject
    {
        //Constructor
        public Sprite(Vector2 position, Vector2 size, Union<HTMLCanvasElement, Image, SpriteSheet> image) {
            this.position = position;
            this.size = size;
            this.image = image;
            this.type = "Sprite";
        }
    }
}
