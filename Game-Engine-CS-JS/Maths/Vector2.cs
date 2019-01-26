using System;
using Bridge;
using Newtonsoft.Json;

namespace GameEngineJS.Maths
{
    public class Vector2
    {
        public float X { get; set; }
        public float Y { get; set; }

        public Vector2() {
            X = 0;
            Y = 0;
        }

        public Vector2(float X , float Y) {
            this.X = X;
            this.Y = Y;
        }
    }
}
