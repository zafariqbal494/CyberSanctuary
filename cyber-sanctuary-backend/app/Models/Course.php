<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'shortDescription',
        'description',
        'icon',
        'image_url',
        'duration',
        'topics',
        'specifications',
        'price',
        'lastUpdate',
        'purchases_count',
    ];

    protected $casts = [
        'topics' => 'array',
        'specifications' => 'array',
    ];

    public function modules(): HasMany
    {
        return $this->hasMany(CourseModule::class);
    }
    
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }
}
