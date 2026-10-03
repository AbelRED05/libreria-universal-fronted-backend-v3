<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Novelas', 'description' => 'Obras maestras de la narrativa universal, ficción y realismo mágico'],
            ['name' => 'Filosofía', 'description' => 'Pensamiento clásico, reflexiones estoicas y filosofía contemporánea'],
            ['name' => 'Ciencia', 'description' => 'Astrofísica, divulgación científica y exploración del cosmos'],
            ['name' => 'Historia', 'description' => 'Crónicas de civilizaciones, imperios y relatos de la humanidad'],
            ['name' => 'Matemáticas', 'description' => 'Geometría, acertijos lógicos y fascinantes enigmas numéricos'],
            ['name' => 'Manga', 'description' => 'Obras ilustradas clásicas y modernas del cómic japonés'],
            ['name' => 'Cómics', 'description' => 'Novelas gráficas galardonadas y narrativas visuales'],
            ['name' => 'Arte', 'description' => 'Historia del arte visual, estética y arquitectura universal'],
            ['name' => 'Poesía', 'description' => 'Lírica universal, versos inmortales y antologías selectas'],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(['name' => $cat['name']], $cat);
        }
    }
}
