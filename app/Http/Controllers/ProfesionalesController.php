<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use stdClass;
use App\Models\GlobalVars;
use App\Traits\MetodosGenerales;

class ProfesionalesController extends Controller
{
    public $global = null;
    use MetodosGenerales;

    public function __construct()
    {
        $this->global = new GlobalVars();
    }

    public function index()
    {
        //
    }

    public function create()
    {
        //
    }

    public function habilitarProfesionales(){
        $datos = json_decode(file_get_contents('php://input'));
        DB::table('profesionales_citas')->where('id', '=', $datos->id)->update([
            'enable'=> $datos->enable
        ]);
        $objeto=new stdClass();
        $objeto->configProfesionales=DB::table('profesionales_citas')->get();
        $objeto->agenda=app(CalendarController::class)->getHorarioCitas($datos->fecha)->agenda;
        return response()->json($objeto, 200, []);
    }

    public function store(Request $request)
    {
        $datos = json_decode(file_get_contents('php://input'));
        DB::table('profesionales_citas')->insert([
            'nombre'=>$datos->newProfesional->nombre,
            'enable'=>$datos->newProfesional->enable
        ]);
        $objeto=new stdClass();
        $objeto->configProfesionales=DB::table('profesionales_citas')->get();
        $objeto->agenda=app(CalendarController::class)->getHorarioCitas($datos->fecha)->agenda;
        return response()->json($objeto, 200, []);
    }

    public function eliminarProfesional(){
        // Validar que el profesional a eliminar no tenga citas programadas en el futuro
        $datos = json_decode(file_get_contents('php://input'));
        $validarProfesionalEnCitas=DB::table('calendario_citas')->where('profesional_seleccionado', '=', $datos->idProfesional)->first();
        $objeto=new stdClass();
        $objeto->respuesta="";
        if(empty($validarProfesionalEnCitas)){
            DB::table('profesionales_citas')->where('id', '=', $datos->idProfesional)->delete();
            $objeto->respuesta="¡Profesional eliminado!";
            $objeto->configProfesionales=DB::table('profesionales_citas')->get();
            $objeto->agenda=app(CalendarController::class)->getHorarioCitas($datos->fecha)->agenda;
            return response()->json($objeto, 200, []);

        }else{
            $objeto->respuesta="¡No se puede eliminar el profesional porque tiene citas programadas!";
            return response()->json($objeto, 200, []);
        }
    }

    public function editarProfesional(){
        $datos = json_decode(file_get_contents('php://input'));
        DB::table('profesionales_citas')->where('id', $datos->newProfesional->id)->update([
            'nombre' => $datos->newProfesional->nombre
        ]);
        $objeto=new stdClass();
        $objeto->configProfesionales=DB::table('profesionales_citas')->get();
        $objeto->agenda=app(CalendarController::class)->getHorarioCitas($datos->fecha)->agenda;
        return response()->json($objeto, 200, []);
    }

    public function show(string $id)
    {
       // return response()->json($id, 200, []);
    }

    public function edit(string $id)
    { 
    }

    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(string $id)
    {
        //
    }
}
