using System;
using Bridge.Html5;

namespace GameEngineJS.Graphics
{
    public class SpriteSheet
    {
        public HTMLImageElement data { get; set; }
        public uint spriteSizeX { get; set; }
        public uint spriteSizeY { get; set; }
        public uint currentIndex { get; set; }

        public SpriteSheet(string src, uint _spriteSizeX, uint _spriteSizeY)
        {
            data = new HTMLImageElement();
            data.Src = src;
            spriteSizeX = _spriteSizeX;
            spriteSizeY = _spriteSizeY;
        }
    }
}
