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
        public int[,] data { get; set; }

        private uint _tilesW;
        private uint _tilesH;
        private uint _sizeX;
        private uint _sizeY;

        private SpriteSheet _sheet;

        public Layer(uint _index, TileMap tileMap) {
            index = _index;
            _tilesW = tileMap._tileSheet.spriteSizeX;
            _tilesH = tileMap._tileSheet.spriteSizeY;
            _sizeX = (uint)tileMap._size.X;
            _sizeY = (uint)tileMap._size.Y;
            data = new int[_sizeX, _sizeY];

            for (var i = 0; i < _sizeX; i++) {
                for (var j = 0; j < _sizeY; j++){
                    data[i, j] = -1;
                }
            }

            position = tileMap.position;
            size = new Vector2(_sizeX * _tilesW, _sizeY * _tilesH);

            HTMLCanvasElement canvas = (HTMLCanvasElement)Document.CreateElement("canvas");
            canvas.Width = (int)Math.Floor(size.X);
            canvas.Height = (int)Math.Floor(size.Y);
            image = canvas;

            _sheet = tileMap._tileSheet;
            _sheet.data.OnLoad += Construct;

        }

        internal void Construct() => Construct(new Event(""));
        internal void Construct(Event e) {
            for (uint y = 0; y < _sizeY; y++) {
                for (uint x = 0; x < _sizeX; x++){
                    SetTile(x,y,data[x,y],true);
                }
            }
        }

        internal void SetTile(uint x, uint y, int tile, bool byPassOld) {
            if (!(x >= 0 && x <= _sizeX && y >= 0 && y <= _sizeY)) return;
            int oldTile = data[x, y];

            HTMLCanvasElement canvas = (HTMLCanvasElement)image;
            CanvasRenderingContext2D ctx = (CanvasRenderingContext2D)canvas.GetContext("2d");

            if (tile == -1 && oldTile != -1) {
                data[x, y] = tile;
                ctx.ClearRect(x*_tilesW,y*_tilesH,_tilesW,_tilesH);
                return;
            }
            if (tile == -1) return;
            if(oldTile != tile || byPassOld) { 
                data[x, y] = tile;

                if (image == null) return;
                float case_x = (data[x, y] % _tilesW) * _tilesW;
                float case_y = (float)Math.Floor((float)data[x, y] / _tilesW) * _tilesH;

                ctx.DrawImage(_sheet.data, case_x, case_y, _tilesW, _tilesH, x * _tilesW, y * _tilesH, _tilesW, _tilesH);
            }

        }

        internal int GetTile(uint x, uint y) {
            return data[x, y];
        }
    }
}
