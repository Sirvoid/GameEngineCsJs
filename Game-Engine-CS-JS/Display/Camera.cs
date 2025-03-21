﻿using System;
using Bridge;
using Newtonsoft.Json;
using GameEngineJS.Maths;

namespace GameEngineJS.Display
{
    public class Camera
    {
        public Vector2 position { get; set; }
        public float rotation { get; set; }

        public Camera()
        {
            position = new Vector2(0,0);
            rotation = 0;
        }

        public Camera(Vector2 position,float rotation) {
            this.position = position;
            this.rotation = rotation;
        }
    }
}
