﻿using System;
using Bridge;
using Bridge.Html5;
using Newtonsoft.Json;
using GameEngineJS.Math;

namespace GameEngineJS.GameObjects
{
    public abstract class GameObject
    {
        public Vector2 position { get; set; }
        public Vector2 size { get; set; }
        public Union<HTMLCanvasElement, HTMLImageElement> image { get; set; }
    }
}
