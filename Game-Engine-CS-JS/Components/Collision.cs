using System;
using System.Collections.Generic;
using GameEngineJS.GameObjects;
using GameEngineJS.Maths;

namespace GameEngineJS.Components
{
    public class Collision : Component
    {

        readonly List<Vector4> _boxes;

        public Collision(GameObject _parent) : base(_parent)
        {
            _boxes = new List<Vector4>();
        }

        public void AddBox(float x1,float y1, float width, float height) {
            _boxes.Add(new Vector4(x1,y1,width,height));
        }

        public bool HitTestObject(GameObject obj) {
            foreach (Component cp in obj.components.Values) {
                if (cp.GetType() == typeof(Collision)) {
                    Collision c = (Collision)cp;
                    foreach (Vector4 b in _boxes) {
                        foreach (Vector4 b2 in c._boxes) {
                            if (b.X + parent.position.X < b2.X + b2.Z + obj.position.X &&
                               b.X + b.Z + parent.position.X > b2.X + obj.position.X &&
                               b.Y + parent.position.Y < b2.Y + b2.W + obj.position.Y &&
                               b.W + b.Y + parent.position.Y > b2.Y + obj.position.Y) {
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        }

        public bool HitTestPoint(float x,float y) {
            foreach (Vector4 b in _boxes)
            {
                if (x < b.X + parent.position.X + b.Z &&
                   x > b.X + parent.position.X &&
                   y < b.Y + parent.position.Y + b.W &&
                   y > b.Y + parent.position.Y) {
                    return true;
                }
            }
            return false;
        }


    }
}
