using System;
using System.Collections.Generic;
using GameEngineJS.Graphics;
using GameEngineJS.Maths;
using Bridge.Html5;

namespace GameEngineJS.GameObjects.TileMap
{

    public class TileMap
    {
        private XMLHttpRequest request;

        internal Dictionary<string, Layer> layers { get; set; }
        internal SpriteSheet _tileSheet;
        internal Vector2I _size;

        public Vector2 position { get; set; }

        public TileMap(SpriteSheet tileSheet, Vector2 pos, Vector2I size) {
            layers = new Dictionary<string, Layer>();
            _tileSheet = tileSheet;
            position = pos;
            _size = size;
        }

        public Layer AddLayer(string name,uint index) {
            layers[name] = new Layer(index, this);
            return layers[name];
        }

        public void RemoveLayer(string name) {
            layers[name] = null;
        }

        public Layer GetLayer(string name) {
            return layers[name];
        }

        public void SetCollision(string layer, int x, int y, int collisionType) => SetCollision(layer, new Vector2I(x, y), collisionType);
        public void SetCollision(string layer, Vector2I pos, int collisionType)
        {
            layers[layer].SetCollision((uint)pos.X, (uint)pos.Y, collisionType);
        }

        public int GetCollision(string layer, int x, int y) => GetCollision(layer, new Vector2I(x, y));
        public int GetCollision(string layer, Vector2I pos)
        {
            return layers[layer].GetCollision((uint)pos.X, (uint)pos.Y);
        }

        public void SetTile(string layer, int x, int y, int tile) => SetTile(layer, new Vector2I(x,y), tile);
        public void SetTile(string layer, Vector2I pos, int tile) {
            layers[layer].SetTile((uint)pos.X, (uint)pos.Y, tile,false);
        }

        public int GetTile(string layer, int x, int y) => GetTile(layer, new Vector2I(x,y));
        public int GetTile(string layer, Vector2I pos) {
            return layers[layer].GetTile((uint)pos.X, (uint)pos.Y);
        }

        public void LoadTiledJson(string url, uint numberOfLayers) {

            for (uint i = 0; i < numberOfLayers; i++) {
                AddLayer(i+"", i);
            }

            request = new XMLHttpRequest();

            request.OnLoad += LoadTiled;
            request.Open("get",url);
            request.Send();

        }

        private void LoadTiled(Event e) {
            dynamic a = JSON.Parse(request.ResponseText);
            _size.X = a.width;
            _size.Y = a.height;

            for (uint i = 0; i < a.layers.length; i++)
            {
                dynamic layerjs = a.layers[i];

                Layer layer = layers[i + ""];
                
                layerjs = layerjs.data;

                for (int j = 0; j < layerjs.length; j++) {

                    int indexX = j % _size.X;
                    int indexY = (int)Math.Floor((float)(j / _size.X));

                    layer.SetTile((uint)indexX, (uint)indexY, layerjs[j]-1, true);
                }
            }

        }

    }
}
