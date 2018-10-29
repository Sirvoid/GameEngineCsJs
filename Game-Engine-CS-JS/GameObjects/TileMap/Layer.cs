using System;
using Bridge;
using Bridge.Html5;
using GameEngineJS.Graphics;
using GameEngineJS.Maths;

namespace GameEngineJS.GameObjects.TileMap
{
    public class Layer : GameObject
    {
        public uint index { get; set; }
        internal int[,] data { get; set; }
        internal int[,] collisionData { get; set;}

        public uint tilesW { get; private set; }
        public uint tilesH { get; private set; }
        public uint sizeX { get; private set;}
        public uint sizeY { get; private set; }

        private SpriteSheet _sheet;

        public Layer(uint _index, TileMap tileMap) {
            index = _index;
            tilesW = tileMap._tileSheet.spriteSizeX;
            tilesH = tileMap._tileSheet.spriteSizeY;
            sizeX = (uint)tileMap._size.X;
            sizeY = (uint)tileMap._size.Y;
            data = new int[sizeX, sizeY];
            collisionData = new int[sizeX, sizeY];

            for (var i = 0; i < sizeX; i++) {
                for (var j = 0; j < sizeY; j++){
                    data[i, j] = -1;
                }
            }

            position = tileMap.position;
            size = new Vector2(sizeX * tilesW, sizeY * tilesH);

            HTMLCanvasElement canvas = (HTMLCanvasElement)Document.CreateElement("canvas");
            canvas.Width = (int)Math.Floor(size.X);
            canvas.Height = (int)Math.Floor(size.Y);
            image = canvas;

            _sheet = tileMap._tileSheet;
            _sheet.data.OnLoad += Construct;

        }

        internal void Construct() => Construct(new Event(""));
        internal void Construct(Event e) {
            for (uint y = 0; y < sizeY; y++) {
                for (uint x = 0; x < sizeX; x++){
                    SetTile(x,y,data[x,y],true);
                }
            }
        }

        internal void SetTile(uint x, uint y, int tile, bool byPassOld) {
            if (!(x >= 0 && x <= sizeX && y >= 0 && y <= sizeY)) return;
            int oldTile = data[x, y];

            HTMLCanvasElement canvas = (HTMLCanvasElement)image;
            CanvasRenderingContext2D ctx = (CanvasRenderingContext2D)canvas.GetContext("2d");

            if (tile == -1 && oldTile != -1) {
                data[x, y] = tile;
                ctx.ClearRect(x*tilesW,y*tilesH,tilesW,tilesH);
                return;
            }
            if (tile == -1) return;
            if(oldTile != tile || byPassOld) { 
                data[x, y] = tile;

                if (image == null) return;
                float case_x = (data[x, y] % tilesW) * tilesW;
                float case_y = (float)Math.Floor((float)data[x, y] / tilesW) * tilesH;

                ctx.DrawImage(_sheet.data, case_x, case_y, tilesW, tilesH, x * tilesW, y * tilesH, tilesW, tilesH);
            }
            
        }

        internal int GetTile(uint x, uint y) {
            return data[x, y];
        }

        internal void SetCollision(uint x, uint y, int collision) {
            collisionData[x, y] = collision;
        }

        internal int GetCollision(uint x, uint y)
        {
            return collisionData[x, y];
        }
    }
}
