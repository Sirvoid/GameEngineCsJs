using System;
using Bridge;
using Bridge.Html5;
using Newtonsoft.Json;


namespace GameEngineJS.Graphics
{
    public class Image
    {
        public HTMLImageElement data { get; set; }

        public Image(string src) {
            data = new HTMLImageElement();
            data.Src = src;

        }
    }
}
