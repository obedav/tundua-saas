<?php

namespace Tundua\Filters;

use Illuminate\Database\Eloquent\Builder;

class ArticleCountryFilter
{
    /**
     * Narrow a query to articles relevant to the given origin country.
     *
     * Relevance: explicit country_target match OR country name in the title.
     * Both conditions live here so the controller and model stay free of
     * filtering logic (DRY).
     */
    public function apply(Builder $query, string $country): Builder
    {
        $term = strtolower(trim($country));
        return $query->where(function (Builder $q) use ($term): void {
            $q->where('country_target', $term)
              ->orWhere('title', 'LIKE', '%' . $term . '%');
        });
    }
}
