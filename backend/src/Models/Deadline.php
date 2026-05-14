<?php

namespace Tundua\Models;

use Illuminate\Database\Eloquent\Model;

class Deadline extends Model
{
    protected $table = 'deadlines';

    protected $fillable = [
        'university_name',
        'country',
        'intake',
        'intake_year',
        'deadline_date',
        'program_type',
        'notes',
        'is_active',
    ];

    protected $casts = [
        'intake_year' => 'integer',
        'is_active'   => 'boolean',
        'created_at'  => 'datetime',
        'updated_at'  => 'datetime',
    ];

    public static function getActive(?string $country = null): \Illuminate\Database\Eloquent\Collection
    {
        $query = self::where('is_active', true)->orderBy('deadline_date');
        if ($country) {
            $query->where('country', $country);
        }
        return $query->get();
    }
}
