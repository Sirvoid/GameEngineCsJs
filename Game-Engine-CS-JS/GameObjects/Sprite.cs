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
        public Sprite(Vector2 _position, Vector2 _size, Union<HTMLCanvasElement, Image> _image) {
            position = _position;
            size = _size;
            image = _image;
        }
    }
}
