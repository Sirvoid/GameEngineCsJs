﻿using System;
using GameEngineJS.GameObjects;
using GameEngineJS.Maths;

namespace GameEngineJS.Components
{
    public class Movement : Component
    {
        public Movement(GameObject _parent) : base(_parent)
        {
        }

        public void MoveToward(Vector2 pos, float speed) => MoveToward(pos.X, pos.Y, speed);
        public void MoveToward(float x, float y, float speed) {
            float dx = x - parent.position.X;
            float dy = y - parent.position.Y;
            float angle = (float)Math.Atan2(dy, dx);

            parent.position.X += speed * (float)Math.Cos(angle);
            parent.position.Y += speed * (float)Math.Sin(angle);
        }

        public void LookAt(Vector2 pos) => LookAt(pos.X, pos.Y);
        public void LookAt(float x, float y) => LookAt(x,y,parent.position.X,parent.position.Y);
        public void LookAt(float x,float y, float centerX, float centerY) {
            float x2 = centerX - x;
            float y2 = y - centerY;
            float angle = (float)Math.Atan2(x2, y2);
            parent.angle = angle * (float)(180/Math.PI);
        }
    }
}
