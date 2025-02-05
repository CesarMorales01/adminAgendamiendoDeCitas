<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Query\JoinClause;
use App\Models\GlobalVars;
use App\Traits\MetodosGenerales;
use Illuminate\Support\Facades\Redirect;

class ProductController extends Controller
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
        $productos = DB::table('productos')->orderBy('id', 'desc')->paginate(100);
        foreach ($productos as $prod) {
            $getCate = DB::table('categorias')->where('id', '=', $prod->category_id)->first();
            $prod->categoria = $getCate;
            $getProveedor = DB::table('proveedores')->where('id', '=', $prod->proveedor)->first();
            $prod->proveedor = $getProveedor;
        }
        return Inertia::render('Product/Products', compact('auth', 'productos', 'globalVars'));
    }

    public function editarProducto($id, $estado = '')
    {
        //Este metodo devuelve un array, por tanto en componente react se debe tomar en los parms[0] y el id se registra en fk_producto.
        $producto = DB::table('productos')->where('id', '=', $id)->get();
        foreach ($producto as $item) {
            $imagenes = DB::table('imagenes_productos')->where('fk_producto', '=', $id)->first();
            if ($imagenes == null) {
                $item->nombre_imagen = '';
            } else {
                $item->nombre_imagen = $imagenes->nombre_imagen;
            }
        }
        $categorias = DB::table('categorias')->get();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info = DB::table('info_pagina')->first();
        $token = csrf_token();
        $proveedores = DB::table('proveedores')->get();
        $auth = Auth()->user();
        return Inertia::render('Product/NewProduct', compact('producto', 'categorias', 'globalVars', 'token', 'proveedores', 'auth', 'estado'));
    }

    public function allproducts()
    {
        return response()->json($this->all_products(), 200, []);
    }

    public function create()
    {
        $auth = Auth()->user();
        $categorias = DB::table('categorias')->get();
        $producto = ['id' => '', 'nombre' => '', 'imagen' => ''];
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info = DB::table('info_pagina')->first();
        $token = csrf_token();
        $proveedores = DB::table('proveedores')->get();
        return Inertia::render('Product/NewProduct', compact('producto', 'categorias', 'globalVars', 'token', 'proveedores', 'auth'));
    }

    public function store(Request $request)
    {
        $id = '';
        if ($request->hasFile('imagen')) {
            $file = $request->file('imagen');
            $fileName = time() . "-" . $file->getClientOriginalName();
            $request->file('imagen')->move($this->global->getGlobalVars()->dirImagenes, $fileName);
            $id = $this->ingresarProducto($request);
            DB::table('imagenes_productos')->insert([
                'nombre_imagen' => $fileName,
                'fk_producto' => $id
            ]);
        } else {
            $id = $this->ingresarProducto($request);
        }
        $estado = "¡Producto registrado!";
        return Redirect::route('producto.editar', [$id, $estado]);
    }

    public function ingresarProducto($request)
    {
        DB::table('productos')->insert([
            'referencia' => $request->referencia,
            'category_id' => $request->categoria,
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
            'cantidad' => $request->cantidad,
            'publicacionweb' => $request->publicacion,
            'costo' => $request->costo,
            'valor' => $request->valor,
            'proveedor' => $request->proveedor,
            'updated' => $request->fecha,
        ]);
        return DB::getPdo()->lastInsertId();
    }

    public function show(string $id)
    {
        // Eliminar en este metodo porque no se conseguido reescribir el method get por delete en el form react....
        $validarEliminar = DB::table('promociones')->where('ref_producto', '=', $id)->first();
        if ($validarEliminar != null) {
            $estado = "¡No puedes eliminar este producto porque esta en algunas promociones!";
            $duracionAlert = 2000;
        } else {
            $estado = "¡Producto eliminado!";
            $duracionAlert = 1000;
            $producto = DB::table('productos')->join('imagenes_productos', function (JoinClause $join) use ($id) {
                $join->on('productos.id', '=', 'imagenes_productos.fk_producto')
                    ->where('productos.id', '=', $id);
            })->get();
            $deleted = DB::table('productos')->where('id', '=', $id)->delete();
            $deleted1 = DB::table('imagenes_productos')->where('fk_producto', '=', $id)->delete();
            $deleted2 = DB::table('preguntas_sobre_productos')->where('producto', '=', $id)->delete();
            if ($deleted1) {
                for ($i = 0; $i < count($producto); $i++) {
                    unlink($this->global->getGlobalVars()->dirImagenes . $producto[$i]->nombre_imagen);
                }
            }
        }
        $auth = Auth()->user();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info = DB::table('info_pagina')->first();
        $productos = DB::table('productos')->paginate(100);
        foreach ($productos as $prod) {
            $getCate = DB::table('categorias')->where('id', '=', $prod->category_id)->first();
            $prod->categoria = $getCate;
            $getProveedor = DB::table('proveedores')->where('id', '=', $prod->proveedor)->first();
            $prod->proveedor = $getProveedor;
        }
        return Inertia::render('Product/Products', compact('auth', 'productos', 'estado', 'globalVars', 'duracionAlert'));
    }

    public function edit(string $id)
    {
    }

    public function update(Request $request, string $id)
    {
        return response()->json("no llega a update" . $id, 200, []);
    }

    public function destroy(string $id)
    {
        return response()->json("no llega a delete" . $id, 200, []);
    }

    public function actualizar(Request $request, string $id)
    {
        DB::table('productos')->where('id', $id)->update([
            'referencia' => $request->referencia,
            'category_id' => $request->categoria,
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
            'cantidad' => $request->cantidad,
            'publicacionweb' => $request->publicacion,
            'costo' => $request->costo,
            'valor' => $request->valor,
            'proveedor' => $request->proveedor,
            'updated' => $request->fecha
        ]);
        $estado = "¡Producto actualizado!";
        return Redirect::route('producto.editar', [$id, $estado]);
    }

    public function getimages(string $id)
    {
        $imagenes = DB::table('imagenes_productos')->where('fk_producto', '=', $id)->get();
        return response()->json($imagenes, 200, []);
    }

    public function image(Request $request, string $id)
    {
        if ($request->hasFile('image')) {
            $fileName = time() . "-" . $request->name;
            $request->file('image')->move($this->global->getGlobalVars()->dirImagenes, $fileName);
            DB::table('imagenes_productos')->insert([
                'nombre_imagen' => $fileName,
                'fk_producto' => $id
            ]);
            return response()->json("ok", 200, []);
        }
    }

    public function deleteImage(Request $request, string $id)
    { 
        $CheckImgpromo = DB::table('promociones')->where('imagen', 'like', "%".$request->nombre."%")->first();
        if ($CheckImgpromo != null) {
            return response()->json('Imagen promo existe', 200, []);
        } else {
            $nombreImg=$this->global->getGlobalVars()->dirImagenes . $request->nombre;
            unlink($nombreImg);
            DB::table('imagenes_productos')->where('id', '=', $id)->delete();
            return response()->json('ok', 200, []);
        }
    }

    public function setPrincipalImage(Request $request)
    { 
        $datos = json_decode(file_get_contents('php://input'));
        foreach($datos as $data){
            DB::table('imagenes_productos')->where('id', '=', $data->id)->delete();
            DB::table('imagenes_productos')->insert([
                'nombre_imagen'=>$data->nombre_imagen,
                'fk_producto'=>$data->fk_producto
            ]);
        }
        return response()->json('ok', 200, []); 
    }


}
