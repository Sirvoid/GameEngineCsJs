using System;
using System.Collections.Generic;
using GameEngineJS.GameObjects;
using GameEngineJS.GameObjects.TileMap;
using GameEngineJS.Maths;

namespace GameEngineJS.Components
{
    public class Collision : Component
    {

        readonly List<Vector4> _boxes;

        public Collision(GameObject parent) : base(parent)
        {
            _boxes = new List<Vector4>();
        }

        public void AddBox(float x1,float y1, float width, float height) {
            _boxes.Add(new Vector4(x1,y1,width,height));
        }

        private float ParentPosCalculationX(float x, GameObject parent) {
            float adding = 0;
            float angleAdding = 0;

            if (parent._parent != null) {
                adding = ParentPosCalculationX(parent.position.X, parent._parent);
                angleAdding = (float)(Math.Cos(parent._parent.angle * Math.PI / 180)) * x;
            }

            if (parent._parent == null) adding += parent.position.X;

            return  adding + angleAdding;
        }

        private float ParentPosCalculationY(float y, GameObject parent)
        {
            float adding = 0;
            float angleAdding = 0;

            if (parent._parent != null)
            {
                adding = ParentPosCalculationY(parent.position.Y, parent._parent);
                angleAdding = (float)(Math.Sin(parent._parent.angle * Math.PI / 180)) * y;
            }

            if (parent._parent == null) adding += parent.position.Y;

            return adding + angleAdding;
        }

        public bool HitTestObject(GameObject obj) {

            float px = parent.position.X;
            float py = parent.position.Y;
            float p2x = obj.position.X;
            float p2y = obj.position.Y;

            if (parent._parent != null) {
                px = ParentPosCalculationX(parent.position.X,  parent); 
                py = ParentPosCalculationY(parent.position.Y,  parent);
            }

            if (obj._parent != null)
            {
                p2x = ParentPosCalculationX(obj.position.X, obj);
                p2y = ParentPosCalculationY(obj.position.Y, obj);
            }

            foreach (Component cp in obj.components.Values) {
                if (cp.GetType() == typeof(Collision)) {
                    Collision c = (Collision)cp;
                    foreach (Vector4 b in _boxes) {
                        foreach (Vector4 b2 in c._boxes) {
                            if (b.X + px < b2.X + p2x + b2.Z &&
                               b.X + b.Z + px > b2.X + p2x &&
                               b.Y + py < b2.Y + b2.W + p2y &&
                               b.W + b.Y + py  > b2.Y + p2y ) {
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        }

        public bool HitTestPoint(float x,float y) {

            float px = parent.position.X;
            float py = parent.position.Y;

            if (parent._parent != null)
            {
                px = ParentPosCalculationX(parent.position.X, parent);
                py = ParentPosCalculationX(parent.position.Y, parent);
            }

            foreach (Vector4 b in _boxes)
            {
                if (x < b.X + px + b.Z &&
                   x > b.X + px &&
                   y < b.Y + py + b.W &&
                   y > b.Y + py) {
                    return true;
                }
            }
            return false;
        }

        public bool HitTestLayer(Layer layer, int colliderValue) {

            float px = parent.position.X;
            float py = parent.position.Y;

            if (parent._parent != null)
            {
                px = ParentPosCalculationX(parent.position.X, parent);
                py = ParentPosCalculationX(parent.position.Y, parent);
            }

            foreach (Vector4 b in _boxes)
            {

                float totalX = px + b.X;
                float totalY = py + b.Y;

                float totalX2 = totalX + b.Z;
                float totalY2 = totalY + b.W;

                int left_tile = (int)Math.Floor((totalX - layer.position.X) / layer.tilesW);
                int right_tile = (int)Math.Floor((totalX2 - layer.position.X) / layer.tilesW);
                int top_tile = (int)Math.Floor((totalY - layer.position.Y) / layer.tilesH);
                int bottom_tile = (int)Math.Floor((totalY2 - layer.position.Y) / layer.tilesH);

                for (int y = top_tile-1; y <= bottom_tile+1; y++) {
                    for (int x = left_tile-1; x <= right_tile+1; x++) {
                        if (x < 0 || x > layer.sizeX - 1 || y > layer.sizeY - 1 || y < 0) continue;
                        int collider = layer.collisionData[x,y];
                        if (collider != colliderValue) continue;

                        float tileX = (x * layer.tilesW) + layer.position.X;
                        float tileY = (y * layer.tilesH) + layer.position.Y;

                        float tileX2 = tileX + layer.tilesW;
                        float tileY2 = tileY + layer.tilesH;

                   
                        bool overX = (totalX < tileX2) && (totalX2 > tileX);
                        bool overY = (totalY < tileY2) && (totalY2 > tileY);
                        if (overX && overY) {
                            return true;
                        }
                    }
                }
            }

            return false;
        }


    }
}
