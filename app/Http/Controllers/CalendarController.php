<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\GlobalVars;
use App\Traits\MetodosGenerales;
use DateTime;
use stdClass;

class CalendarController extends Controller
{

    public $global = null;
    use MetodosGenerales;

    public function __construct()
    {
        $this->global = new GlobalVars();
    }

    public function index()
    {
        $auth = Auth()->user();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info = DB::table('info_pagina')->first();
        $tokenFormu = csrf_token();
        $horarios_disponibles = $this->getHorarioCitas($this->getFechaHoy());
        $clientes = $this->all_clientes();
        $configHorario=DB::table('horario_citas')->get();
        $configProfesionales=DB::table('profesionales_citas')->get();
        return Inertia::render('Calendar/Calendario', compact('auth', 'globalVars', 'tokenFormu', 'horarios_disponibles', 'clientes', 'configHorario', 'configProfesionales'));
    }

    public function establecerDiaDeLaSemana($fecha)
    {
        $dayofweek = date('w', strtotime($fecha));
        $day = "Domingo";
        if ($dayofweek == 1) {
            $day = "Lunes";
        }
        if ($dayofweek == 2) {
            $day = "Martes";
        }
        if ($dayofweek == 3) {
            $day = "Miércoles";
        }
        if ($dayofweek == 4) {
            $day = "Jueves";
        }
        if ($dayofweek == 5) {
            $day = "Viernes";
        }
        if ($dayofweek == 6) {
            $day = "Sabado";
        }
        return $day;
    }

    public function getHorarioCitas($fecha)
    {
        $agenda = [];
        $datosAgenda = new stdClass();
        $datosAgenda->profesionalesDisponibles = DB::table('profesionales_citas')->where('enable', '=', true)->get();
        $horario = DB::table('horario_citas')->where('dia', '=', $this->establecerDiaDeLaSemana($fecha))->get();
        date_default_timezone_set("America/Bogota");
        $horaInicio = date($fecha . " " . $horario[0]->inicio);
        $intervalo = "60";
        // Establecer total citas disponibles
        $sumaInicio = new DateTime($horario[0]->inicio);
        $sumaFin = new DateTime($horario[0]->fin);
        $diferencia = $sumaInicio->diff($sumaFin);
        $sumaHoras = intval($diferencia->format('%H')) * 60;
        $sumaMinutos = intval($diferencia->format('%i'));
        $totalIntervalos = ($sumaHoras + $sumaMinutos) / intval($intervalo);
        for ($i = 1; $i < $totalIntervalos; $i++) {
            $horaInicio = date($horario[0]->inicio);
            //Sumar minutos desde el inicio del horario para establecer todas las citas disponibles
            $sumatorioMinutos=intval($intervalo)*$i;
            $NuevaHora = strtotime('+' . $sumatorioMinutos . ' minute', strtotime($horaInicio));
            $objeto = new stdClass();
            $objeto->hora = date('H:i:s', $NuevaHora);
            $consultarCitas = DB::table('calendario_citas')->whereBetween('fecha', [$fecha, $fecha])->where('inicio', '=', $objeto->hora)->get();
            foreach ($consultarCitas as $cita) {
                $profesionalSeleccionado = DB::table('profesionales_citas')->where('id', '=', $cita->profesional_seleccionado)->first();
                $cita->profesional = $profesionalSeleccionado;
            }
            if (count($consultarCitas) == 0) {
                //Si no hay citas a esta hora, todos los profesionales esta disponibles.
                $objeto->profesionalesDisponibles = $datosAgenda->profesionalesDisponibles;
            } else {
                //Consultar los profesionales disponibles
                $profesDisponible = [];
                foreach ($datosAgenda->profesionalesDisponibles as $profe) {
                    $buscarProfe = false;
                    foreach ($consultarCitas as $cita) {
                        if ($profe->id == $cita->profesional_seleccionado) {
                            $buscarProfe = true;
                        }
                    }
                    if ($buscarProfe != true) {
                        $profesDisponible[] = $profe;
                    }
                }
                $objeto->profesionalesDisponibles = $profesDisponible;
            }
            $objeto->citasAgendadas = $consultarCitas;
            $agenda[] = $objeto;
        }
        $datosAgenda->agenda = $agenda;
        return $datosAgenda;
    }

    public function registrarcita(Request $request)
    {
        $datos = json_decode(file_get_contents('php://input'));
        
        $horaFin = strtotime('+1 hour', strtotime($datos->hora));
        $horaFinFormat = date('H', $horaFin);
        $insert = DB::table('calendario_citas')->insert([
            'fecha' => $datos->fecha,
            'inicio' => $datos->hora,
            'fin' => $horaFinFormat . ":00",
            'cliente' => $datos->cliente,
            'idCliente' => $datos->idCliente,
            'email' => $datos->email,
            'telefono' => $datos->telefono,
            'comentario' => $datos->comentario,
            'profesional_seleccionado' => $datos->profesional_selected
        ]);
        
        return response()->json($datos, 200, []);
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        //Cambiar estado cita
        DB::table('calendario_citas')->where('id', $request->idCita)->update([
            'estado_cita' => $request->estado
        ]);
        return response()->json($this->getHorarioCitas($request->fecha), 200, []);
    }

    public function show(string $fecha)
    {
        return $this->getHorarioCitas($fecha);
    }

    public function edit($id)
    {
        //Eliminar aqui que esta disponible XD
        //Consulto la fecha para no tener que construir otra ruta post y asi poder consultar de nuevo la lista de citas...
        $fecha = DB::table('calendario_citas')->where('id', '=', $id)->first()->fecha;
        DB::table("calendario_citas")->where('id', '=', $id)->delete();
        return response()->json($this->getHorarioCitas($fecha), 200, []);
    }

    public function updateHorario(Request $request){
        DB::table('horario_citas')->delete();
        $datos = json_decode(file_get_contents('php://input'));
        foreach($datos->config as $dato){
            DB::table('horario_citas')->insert([
                'dia'=>$dato->dia,
                'inicio'=>$dato->inicio,
                'fin'=>$dato->fin
            ]);
        }
        return response()->json($this->getHorarioCitas($datos->fecha), 200, []); 
    }

    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(string $id)
    {
        
    }
}
