using Bridge;
using Newtonsoft.Json;
using System;

namespace GameEngineJS
{
    public class Engine
    {
        static Game game;
        public static void Main()
        {
            game = new Game();
        }
    }
}