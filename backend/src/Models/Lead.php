<?php

namespace Tundua\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Lead — an inbound contact from a public funnel form.
 *
 * Data-access only (S in SOLID). Validation lives in the controller, email
 * formatting lives in EmailService. This class does one thing: talk to the DB.
 */
class Lead extends Model
{
    protected $table = 'leads';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'country',
        'budget',
        'message',
        'source',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
        'gclid',
        'fbclid',
        'landing_page',
        'referrer',
        'ip_address',
        'user_agent',
        'status',
        'notes',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
