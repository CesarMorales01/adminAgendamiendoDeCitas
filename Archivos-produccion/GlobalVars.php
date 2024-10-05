<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use stdClass;

class GlobalVars extends Model
{
    use HasFactory;

    public $globalVars;

    function __construct()
    {
        $this->globalVars = new stdClass();
        $this->globalVars->urlRoot = "https://gestionagendamientocitas.tupaginaweb.site/";
        $this->globalVars->myUrl = "https://gestionagendamientocitas.tupaginaweb.site/";
        $this->globalVars->dirImagenesCategorias = "/home/u629086351/domains/tupaginaweb.site/public_html/gestionagendamientocitas/public/Images/Categories/";
        $this->globalVars->urlImagenesCategorias = "https://gestionagendamientocitas.tupaginaweb.site/Images/Categories/";
        $this->globalVars->dirImagenes = "/home/u629086351/domains/tupaginaweb.site/public_html/gestionagendamientocitas/Images/Products/";
        $this->globalVars->urlImagenes="https://gestionagendamientocitas.tupaginaweb.site/Images/Products/";
    }


    public function getGlobalVars()
    {
        return $this->globalVars;
    }
}