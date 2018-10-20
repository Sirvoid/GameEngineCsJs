using System;
using Bridge;
using Newtonsoft.Json;

namespace GameEngineJS.Maths
{
    public class Vector2
    {
        public float X { get; set; }
        public float Y { get; set; }

        public Vector2(float _x , float _y) {
            X = _x;
            Y = _y;
        }
    }
}
