﻿using System;
using Bridge;
using Bridge.Html5;
using Newtonsoft.Json;
using GameEngineJS.Math;
using GameEngineJS.Graphics;

namespace GameEngineJS.GameObjects
{
    public class Sprite : GameObject
    {
        public Sprite(Vector2 _position, Vector2 _size, Union<HTMLCanvasElement, Image> _image) {
            position = _position;
            size = _size;
            image = _image;
        }
    }
}
