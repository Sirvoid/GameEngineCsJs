using System;
using GameEngineJS.GameObjects;

namespace GameEngineJS.Components
{
    public class Movement : Component
    {
        public Movement(GameObject _parent) : base(_parent)
        {
        }

        public void MoveToward(float x, float y, float speed) {
            float dx = x - parent.position.X;
            float dy = y - parent.position.Y;
            float angle = (float)Math.Atan2(dy, dx);

            parent.position.X += speed * (float)Math.Cos(angle);
            parent.position.Y += speed * (float)Math.Sin(angle);
        }

        public void LookAt(float x,float y) {
            float x2 = parent.position.X - x;
            float y2 = y - parent.position.Y;
            float angle = (float)Math.Atan2(x2, y2);
            parent.angle = angle * (float)(180/Math.PI);
        }
    }
}
