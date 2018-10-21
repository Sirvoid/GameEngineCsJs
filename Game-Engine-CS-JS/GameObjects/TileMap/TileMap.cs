using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GameEngineJS.Graphics;
using GameEngineJS.Maths;

namespace GameEngineJS.GameObjects.TileMap
{

    public class TileMap
    {
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

        public void AddLayer(string name,uint index) {
            layers[name] = new Layer(index, this);
        }

        public void RemoveLayer(string name) {
            layers[name] = null;
        }

        public void SetTile(string layer, Vector2I pos, int tile) {
            layers[layer].SetTile((uint)pos.X, (uint)pos.Y, tile,false);
        }

        public int GetTile(string layer, Vector2I pos) {
            return layers[layer].GetTile((uint)pos.X, (uint)pos.Y);
        }

    }
}
