<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\GlobalVars;
use App\Traits\MetodosGenerales;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use stdClass;

class ClientesController extends Controller
{
    public $global = null;
    use MetodosGenerales;

    public function __construct()
    {
        $this->global = new GlobalVars();
    }

    public function listar($state)
    {
        $auth = Auth()->user();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info = DB::table('info_pagina')->first();
        $clientes = DB::table('clientes')->paginate(100);
        $telefono = [];
        foreach ($clientes as $cliente) {
            $telefono = DB::table('telefonos_clientes')->where('cedula', '=', $cliente->id)->get();
            if ($telefono != null) {
                $cliente->telefonos = $telefono;
            } else {
                $tels = [];
                $cliente->telefonos = $tels;
            }
            $cars = DB::table('vehiculos')->where('cliente', '=', $cliente->id)->get();
            $cliente->cars = $cars;
        }
        $estado = '';
        if ($state != 'nothing') {
            $estado = $state;
        }
        return Inertia::render('Customer/Customers', compact('auth', 'clientes', 'globalVars', 'estado'));
    }

    public function create()
    {
        $auth = Auth()->user();
        $cliente = ['id' => '', 'cedula' => '', 'email' => ''];
        $deptos = DB::table('departamentos')->get();
        $municipios = DB::table('municipios')->get();
        $token = csrf_token();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info = DB::table('info_pagina')->first();
        $estado = '';
        $cars = DB::table('vehiculos')->where('cliente', '=', null)->get();
        return Inertia::render('Customer/NewClient', compact('auth', 'cliente', 'globalVars', 'deptos', 'municipios', 'token', 'estado', 'cars'));
    }

    public function store(Request $request)
    {
        DB::table('clientes')->insert([
            'nombre' => $request->nombre,
            'apellidos' => $request->apellidos,
            'cedula' => $request->cedula,
            'direccion' => $request->direccion,
            'info_direccion' => $request->info_direccion,
            'ciudad' => $request->codCiudad,
            'departamento' => $request->codDepto,
            'otros' => $request->otros,
            'fecha_ingreso' => $request->fecha
        ]);
        $newRequest = new stdClass();
        // SE DEBE ENVIAR EL ID DE LA TABLA CLIENTES COMO CEDULA PARA TABLAS TELEFONOS Y KEYS ..
        $newRequest->id = DB::getPdo()->lastInsertId();
        $newRequest->telefonos = $request->telefonos;
        $newRequest->usuario = $request->usuario;
        $newRequest->clave = $request->clave;
        $newRequest->correo = $request->correo;
        $newRequest->cars = $request->cars;
        $this->ingresar_telefonos($newRequest);
        // $this->ingresarCrearClave($newRequest);
        $this->ingresarCars($newRequest);
        $this->ingresarCrearClave($newRequest);
        return Redirect::route('customer.list', 'Cliente registrado!');
    }


    public function ingresarCrearClave($request)
    {
        $contra = Hash::make($request->clave);
        DB::table('keys')->insert([
            'cedula' => $request->id,
            'name' => $request->usuario,
            'password' => $contra,
            'email' => $request->correo
        ]);
    }

    public function ingresarCars($request)
    {
        $check = DB::table('vehiculos')->where('cliente', '=', $request->id)->first();
        if ($check) {
            DB::table('vehiculos')->where('cliente', '=', $request->id)->update([
                'cliente' => null
            ]);
        }
        for ($i = 0; $i < count($request->cars); $i++) {
            $token = strtok($request->cars[$i], ",");
            while ($token !== false) {
                DB::table('vehiculos')->where('placa', '=', $token)->update([
                    'cliente' => $request->id,
                ]);
                $token = strtok(",");
            }
        }
    }

    public function show(string $id)
    {
        // Eliminar en este metodo porque no se conseguido reescribir el method get por delete en el form react....
        $validarEliminar = DB::table('lista_compras')->where('cliente', '=', $id)->first();
        if ($validarEliminar != null) {
            $estado = "¡No puedes eliminar este cliente porque tiene algunas compras!";
        } else {
            DB::table('telefonos_clientes')->where('cedula', '=', $id)->delete();
            DB::table('clientes')->where('id', $id)->delete();
            DB::table('keys')->where('cedula', '=', $id)->delete();
            DB::table('vehiculos')->where('cliente', '=', $id)->update([
                'cliente' => null,
            ]);
            $estado = "¡Cliente eliminado!";
        }
        return Redirect::route('customer.list', $estado);
    }

    public function edit(string $id) {}

    public function editar($id, $state)
    {
        $cliente = DB::table('clientes')->where('id', '=', $id)->first();
        $telefonos = DB::table('telefonos_clientes')->where('cedula', '=', $id)->get();
        $cars = DB::table('vehiculos')->where('cliente', '=', $cliente->id)->get(); 
        $usuario = DB::table('keys')->where('cedula', '=', $id)->first();
        $cliente->telefonos = $telefonos;
        $cliente->cars = $cars;
        $cliente->usuario = $usuario;
        $auth = Auth()->user();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info = DB::table('info_pagina')->first();
        $deptos = DB::table('departamentos')->get();
        $municipios = DB::table('municipios')->get();
        $token = csrf_token();
        $estado = '';
        if ($state != 'nothing') {
            $estado = $state;
        }
        $cars = DB::table('vehiculos')->where('cliente', '=', null)->get();
        return Inertia::render('Customer/NewClient', compact('auth', 'cliente', 'globalVars', 'deptos', 'municipios', 'token', 'estado', 'cars'));
    }

    public function update(Request $request, string $id) {}

    public function destroy(string $id) {}

    public function actualizar(Request $request, string $id)
    {
        $update = DB::table('clientes')->where('id', '=', $id)->update([
            'nombre' => $request->nombre,
            'apellidos' => $request->apellidos,
            'cedula' => $request->cedula,
            'direccion' => $request->direccion,
            'info_direccion' => $request->info_direccion,
            'ciudad' => $request->codCiudad,
            'departamento' => $request->codDepto,
            'otros' => $request->otros
        ]);
        $this->ingresar_telefonos($request);
        //  $this->ActualizarCrearClave($request);
        //Si el cliente realizo compras, actualizar la cedula
        $validarComprasRealizadas = DB::table('lista_compras')->where('cliente', '=', $request->cedulaAnterior)->first();
        if ($validarComprasRealizadas != null) {
            DB::table('lista_compras')->where('cliente', '=', $request->cedulaAnterior)->update([
                'cliente' => $request->cedula
            ]);
        }
        $this->ingresarCars($request);
        $this->ActualizarCrearClave($request);
        return Redirect::route('customer.editar', [$id, 'Cliente actualizado!']);
    }

    public function ActualizarCrearClave($request)
    {
        $contra = '';
        if (strlen($request->clave) == 60) {
            $contra = $request->clave;
        } else {
            $contra = Hash::make($request->clave);
        }
        DB::table('keys')->where('cedula', '=', $request->id)->update([
            'name' => $request->usuario,
            'password' => $contra,
            'email' => $request->correo
        ]);
    }

    public function getclient(string $ced, string $email)
    {
        $cliente = null;
        $usuario = null;
        $client = DB::table('clientes')->where('cedula', '=', $ced)->first();
        $user = DB::table('keys')->where('email', '=', $email)->first();
        if ($client != null) {
            $cliente = $client;
        }
        if ($user != null) {
            $usuario = $user;
        }

        $response = [
            'cliente' => $cliente,
            'usuario' => $usuario
        ];
        return response()->json($response, 200, []);
    }

    function getClienteById($id)
    {
        // Validar si la compra pertenece a un cliente registrado... si no mandar id
        $getCliente = null;
        $cliente = DB::table('clientes')->where('id', '=', $id)->first();
        if ($cliente) {
            $getCliente = $cliente;
        } else {
            $cliente1 = new stdClass();
            $cliente1->id = '';
            $getCliente = $cliente1;
        }
        return $getCliente;
    }

    public function allclients()
    {
        return response()->json($this->all_clientes(), 200, []);
    }
}
